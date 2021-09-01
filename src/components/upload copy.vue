<template>
  <div class="curp upload-box">
            <div class="upload-btn">
                   上传
                  <input type="file" ref="imgInput" accept="image/jpeg,image/jpg,image/png"  @change="doUpload($event)"  class="curp "/>
            </div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import { getStsUpload } from "@/api/uploadoss"; //阿里云上传凭证获取
import md5 from "js-md5";
let OSS = require("ali-oss");
let flietoken = null;
let client = new OSS({
  region: "youregion",
  accessKeyId: "youaccessKeyId",
  accessKeySecret: "youaccessKeySecret",    
  stsToken: "youstsToken",
  bucket: "youbucket",
});
export default {
  name: "aliUpload",
  async created() {
    await this.clickupload();
  },
  data() {
    return {
      imgUrl: "",
    };
  },
  methods: {
    // base64转码加密
    base64Fun(val) {
      var base64Val = Base64.encode(val);
      return base64Val;
    },
    // base64转码解密
    debase64Fun(val) {
      var deBase64Val = Base64.decode(val);
      return deBase64Val;
    },
    setclient(data) {
      client.options.region = data.region;
      client.options.accessKeyId = data.accessKeyId;
      client.options.accessKeySecret = data.accessKeySecret;
      client.options.stsToken = data.stsToken;
      client.options.bucket = data.bucket;
      client.options.endpoint.host = data.region;
      client.options.endpoint.hostname = data.region;
      client.options.endpoint.href = `http://${data.region}/`;
    },
    async getSts() {
      await getStsUpload().then((response) => {
        if (response.data.code == 0) {
          localStorage.getOsstime = new Date();
          localStorage.stsData = this.base64Fun(
            JSON.stringify(response.data.data)
          );
          this.setclient(response.data.data);
        }
      });
    },
    clickupload() {
      if (!localStorage.getOsstime || !localStorage.stsData) {
        this.getSts(); //获取
      } else if (
        (new Date() - new Date(localStorage.getOsstime)) / 1000 >3590
      ) {
        this.getSts(); //获取
      } else if (
        (new Date() - new Date(localStorage.getOsstime)) / 1000 <=3590
      ) {
        flietoken = JSON.parse(this.debase64Fun(localStorage.stsData));
        this.setclient(flietoken);
        this.$forceUpdate();
      }
    },
    //上传部分
    doUpload(event) {
      let file = event.target.files;
      let year=new Date().getFullYear();
      let month=new Date().getMonth()+1;
      if(month<10){month=`0${month}`}
      this.size = file[0].size;
    //   let tmpName =`${year}${month}/${md5(file[0].name)}`;
      let tmpName =`${year}${month}/${file[0].name}`;
      this.putObject(tmpName, file[0]);
    },

    async putObject(upName, upFile) {
      try {
        const result = await client.put(upName, upFile);
        console.log("成功", result);
         this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.imgUrl=result.url// 成功后传递URL等父组件所需的值
        this.Epass()
      } catch (e) {
        console.log("失败", e);
         this.$message.error('上传失败');
        this.$refs.imgInput.value = "";
      }
    },
    Epass(){
      this.$emit("setimgUrl", this.imgUrl);
    }//将上传返回的图片地址返给父组件
  },
};
</script>

<style lang="less" scoped>
.upload-btn{
    position: relative;
    padding: 6px 12px;
    background-color: #1CEDE7;
    color: #fff;
    border-radius: 4px;
}
input{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
}
.curp{
    cursor: pointer;
}
</style>

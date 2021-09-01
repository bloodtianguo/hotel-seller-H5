<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="ITEMS_UP_IMG"
      :show-file-list="false"
      :on-success="handleVideoSuccess"
      :on-error="uperror"
      :before-upload="beforeUploadImg"
      :on-progress="onprogress"
    >
        <el-button size="small" type="primary" v-if="!img" :loading="imgLoading"
        :disabled="imgLoading"
      >{{uptext}}</el-button>
      <el-image class="avatar" v-else  :src="img" fit="contain" />
    </el-upload>
  </div>
</template>

<script>
import { ITEMS_UP_IMG } from "@/utils/request_upload";
import { Success, Infos, Warning } from "@/utils/tools/message.js";
export default {
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      imgLoading:false,
      img: "",
      uptext:"上传",
      ITEMS_UP_IMG: ITEMS_UP_IMG,
    };
  },
  methods: {
    // 上传成功时函数
    handleVideoSuccess(res, file) {
      if (res.code == "0") {
        this.ESpass(res.data);
        Success("上传图片成功!");
        this.imgLoading=false
        this.uptext="上传"
      } else {
        this.$message.error("图片上传失败!");
        this.uptext="上传"
      }
    },
    //上传时
    onprogress(){
        this.imgLoading=true
        this.uptext="上传中"
    },
    // 上传前函数
    beforeUploadImg(file) {
      const isImage =
        ["image/png", "image/jpg", "image/jpeg"].indexOf(file.type) == -1;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isImage == true) {
        this.$message.error("只支持上传jpg，png格式图片!");
        this.fileList = [];
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return !isImage && isLt2M;
    },
    uperror(err, file, fileList) {
      this.$message.error("图片上传失败!");
      this.imgLoading=false
    },
    // 点击向父级传值
    ESpass(val) {
      this.$emit("getimgUrl", val);
    },
  },
    watch: {
    imgUrl: {
      handler(newValue) {
        this.img = newValue;
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.el-upload {
  display: block;
}
</style>

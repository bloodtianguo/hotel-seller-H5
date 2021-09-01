<template>
  <div class="container">
    <div class="head">
      <div class="title">
        <h3>视频列表</h3>
        <el-button plain class="goback" @click="goBack">返回</el-button>
      </div>
      <el-input
        class="search"
        v-model="search"
        placeholder="请输入视频标题"
      ></el-input>
      <el-button type="primary" @click="searchVideo">搜索</el-button>
      <el-button plain @click="addVideo">新增视频</el-button>
    </div>
    <div class="content">
      <div class="table">
        <el-table
          :data="tableData"
          height="100%"
          v-loading="loading"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
        >
          <el-table-column label="" width="35" :resizable="false">
            <template slot-scope="scope">
              <el-radio
                :label="scope.$index"
                v-model="radio"
                @click.native.stop.prevent="
                  selectRadio(scope.$index, $event, scope.row)
                "
                >{{ "" }}</el-radio
              >
            </template>
          </el-table-column>

          <el-table-column prop="title" label="视频标题" width="130"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTimeStr" label="发布时间">
          </el-table-column>
          <el-table-column prop="status" label="审核状态">
            <template slot-scope="scope">
              {{
                scope.row.status == -1
                  ? "待云审核"
                  : scope.row.status == 0
                  ? "待审核"
                  : scope.row.status == 1
                  ? "已通过"
                  : "未通过"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="verifyTimeStr"
            label="审核时间"
          ></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="playVideo(scope.row)"
                >预览</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增视频 -->
      <div class="addvideo" v-show="addVideoIsShow" >
       <div class="head">
          新增视频<i class="el-icon-close" @click="closeVideo"></i>
        </div>
      <div class="addvideo-main">
        <div class="title">
          <label class="bered">视频标题:</label>
          <el-input type="text" size="mini"
          style="width:170px;margin-left:10px" 
          v-model="uploadTitle" maxlength="55"></el-input>
        </div>
           <div class="title">
          <label class="bered">视频封面：</label>
          <div class="upload-box">
          <upload ref="childupload" :imgUrl="imgUrl"  @getimgUrl="setimgUrl" />
          </div>
        </div>
        <div class="uptitle">
          <label class="bered">上传视频：</label>
          <el-link type="primary">
            本地上传
            <input type="file" accept=".mp4,.rmvn" ref="videoInput" @change="choseVideo($event)"/>
          </el-link>
        </div>
        <div class="uploadVideo">
          <video
            ref="video"
            src=""
            muted
            controls
            autoplay
            volume="1"
            id="up-video"
          ></video>
        </div>
        <div class="progress_box" v-show="progress">
          <el-progress
            :percentage="percentage"
            :show-text="false"
            :color="colors"
          ></el-progress>
        </div>
        <div class="tag">视频时长不超过2分钟,支持mp4格式</div>
      </div>
 

        <div class="foot">
          <el-button type="primary" plain class="no" @click="closeVideo"
            >取消</el-button
          >
          <el-button type="primary" class="ok" @click="uploadVideo"
            >确定</el-button
          >
        </div>
      </div>
      <!--预览-->
      <play-video
        ref="videobox"
        :videoUrl="videoUrl"
        :vTitle="videoTitel"
      ></play-video>
    </div>
  </div>
</template>

<script>
import * as qiniu from "qiniu-js";
import { getVideoAuth, publishVideo } from "@/api/videoList";
import { qryVideoByUserId } from "@/api/room";
import PlayVideo from "@/components/PlayVideo.vue";
import upload from "@/components/upload";//上传到阿里云oss的组件
import { uploadImg } from "@/api/uploadData";//上传图片
export default {
  name: "videoList",
  components: {
    PlayVideo,
    upload
  },
  data() {
    return {
      loading: false,
      uploadState: false,
      progress: false, //进度条与video切换
      percentage: 0, //进度条
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ], //进度条颜色
      search: "",
      tableData: [],
      // radio: -1,
      radio: false,
      videoTitel: "",
      videoUrl: "",
      currentRow: null,
      addVideoIsShow: false,
      uploadTitle: "", // 上传视频的标题
      imgUrl: "",
      isTime: "ok", //
      duration: 0,
      timeFun: undefined,
      afterVideo:null //之前选择的视频file
    };
  },
  mounted() {
    this.getVideo();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    },
    goBack() {
      if (this.currentRow != null) {
        sessionStorage.setItem("videoCurrent", JSON.stringify(this.currentRow));
      }
      this.$router.back();
    },
    // 获取视频
    async getVideo() {
      this.loading = true;
      let res = await qryVideoByUserId({ number: 10000 });
      this.tableData = res.data
      this.loading = false;
    },
    selectRadio(index, e, row) {
      if (index !== this.radio) {
        this.radio = index;
        this.currentRow = row;
        this.uploadurl = JSON.parse(JSON.stringify(this.currentRow.videoUrl));
        this.goBack();
      }
    },
    playVideo(data) {
      this.videoUrl = JSON.parse(JSON.stringify(data.videoUrl));
      this.videoTitel = JSON.parse(JSON.stringify(data.title));
      this.$refs.videobox.openvideo(); // 调用子组件方法
    },
    // 搜索视频 根据标题
    async searchVideo() {
      let res = await qryVideoByUserId({ title: this.search });
      this.tableData = res.data;
    },
    // 新增视频
    async addVideo() {
      this.addVideoIsShow = true;
      this.percentage = 0; //进度条初始化
      // 打开视频上传弹窗时初始化清空input标签中上传文件
      this.$refs.videoInput.value = "";
    },
    // 关闭新增视频弹窗
    closeVideo() {
      this.addVideoIsShow = false;
      this.uploadTitle = "";
      this.$refs.videoInput.value = "";
      this.$refs.video.src = "";
      this.imgUrl=""
      this.progress = false;
      this.isTime = "ok";
      this.afterVideo = null; //重置选择新增视频前的视频
    },
    // 选择视频
    async choseVideo(e) {
      let _this = this;
      _this.isTime = "ok";
      let files = e.target.files;
      if (files && files[0]) {
        _this.afterVideo = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        /*--------------------获取视频长度-------------------*/
        //  await setTimeout(() => {
        let url = URL.createObjectURL(files[0]);
        let audioElement = new Audio(url);
        let duration;

        audioElement.onloadedmetadata = function() {
          // let isTime;
          duration = audioElement.duration; //时长为秒 小数
          if (duration > 180) {
            _this.Warning("请上传2分钟以内视频");
            _this.isTime = "no";
            _this.$forceUpdate();
          } else {
            _this.isTime = "ok";
            _this.$forceUpdate();
          }
        };

        /*---------------------------------------------------*/
        reader.onload = (e) => {
          if (this.isTime == "ok") {
            this.$refs.video.src = e.target.result;
            // this.captureImage(e.target.result);
          } else {
            this.$refs.video.src = "";
            this.$refs.videoInput.value = "";
          }
        };
      }
    },
    str(e) {
      if (this.duration != 0) {
        clearTimeout(this.timeFun);
        if (this.duration > 180) {
          this.Warning("请上传2分钟以内视频");
          this.$refs.video.src = "";
          this.$refs.videoInput.value = "";
          this.$forceUpdate();
        } else {
          this.$refs.video.src = e.target.result;
        //   this.captureImage(e.target.result);
          this.$forceUpdate();
        }
      }
    },
    // 上传视频
    async uploadVideo() {
      if (this.uploadState) {
        return false;
      }
      if (
        this.uploadTitle == null ||
        this.uploadTitle.trim() == "" ||
        this.uploadTitle == undefined
      ) {
        this.$message("请填写视频标题");
        return;
      }
      let file;
      if (this.$refs.videoInput.files[0]) {
        file = this.$refs.videoInput.files[0];
      } else {
        file = this.afterVideo;
      }
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {};
      } else {
        this.Infos("请选择需要上传的视频");
        return;
      }
      if(!this.imgUrl){
        this.Infos("请上传视频封面");
        return;
      }
      this.progress = true;
      //获取凭证
      let res = await getVideoAuth();
      if (res.code == 0 && file) {
        this.uploadState = true;
        // 七牛上传
        let result = await this.uploadQiNiu(
          file,
          res.data.fileName,
          res.data.upToken
        );
        // 七牛上传成功
        if (result.key) {
          let params = {
            isCloseComment: 0,
            isPrivate: 0,
            title: this.uploadTitle,
            videoCover: this.imgUrl,
            videoId: res.data.videoId,
          };
          // 发表视频
          let lrs = await publishVideo(params);
          let msgType = "error";
          if (lrs.code == "0") {
            msgType = "success";
          }
          this.$message({
            message: lrs.msg,
            type: msgType,
          });
          this.uploadState = false;
          setTimeout(() => {
            this.addVideoIsShow = false;
          }, 1000);
          setTimeout(() => {
            this.closeVideo();
            this.getVideo();
          }, 600);
        }
      }
    },
    // 七牛云视频上传
    uploadQiNiu(file, key, token) {
      let _this = this;
      return new Promise((resolve, reject) => {
        const observable = qiniu.upload(file, key, token);
        observable.subscribe({
          next(data) {
            _this.percentage = data.total.percent;
          },
          error(err) {
            // 失败
            reject(err);
          },
          complete(data) {
            // 成功
            resolve(data);
          },
        });
      });
    },
        setimgUrl(val){
         this.imgUrl = val;
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #f4f4f4;
  box-sizing: border-box;
  .head {
    width: 100%;
    height: 150px;
    background-color: #fff;
    color: #333;
    padding: 0 20px;
    box-sizing: border-box;
    .title {
      position: relative;
      border-bottom: 2px solid #e4e4e4;
      h3 {
        height: 75px;
        line-height: 75px;
        font-size: 20px;
        font-weight: 700;
      }
      .goback {
        float: right;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 125px;
      }
    }
    .search {
      margin-top: 15px;
      margin-right: 25px;
      width: 180px;
    }
    .el-button {
      margin-right: 15px;
    }
  }
  .content {
    position: relative;
    height: calc(100% - 200px);
    margin-top: 30px;
    background-color: #fff;
    .addvideo,
    .play-video {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .table {
      height: 100%;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      /deep/.my-table-head {
        th {
          background-color: #e4f6fe !important;
          color: #22b2f2 !important;
        }
      }
    }
    .addvideo {
      width: 370px;
      height: 500px;
      box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.2);
      background-color: #fff;
      font-size: 14px;
      border-radius: 5px;
      overflow: auto;
      z-index: 10;
      .addvideo-main{
        height: 400px;
        overflow-y: auto;
      }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        width: 100%;
        background-color: #bfe9fb;
        font-size: 14px;
        line-height: 50px;
        padding: 0 15px;
        box-sizing: border-box;
        i {
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
        }
      }
      .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 15px 50px;
        lable{
       width: 75px;
        }
      }
      .uptitle {
        position: relative;
        margin-left: 50px;
        line-height: 20px;
        .el-link {
          position: relative;
          top: -1px !important;
        }
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          line-height: 20px;
          opacity: 0;
        }
      }
      .uploadVideo {
        position: relative;
        width: 250px;
        height: 150px;
        border: 1px solid #999;
        margin: 18px auto;
        border-radius: 5px;
        i {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 40px;
          color: #999;
        }
        input {
          height: 100%;
          width: 100%;
          opacity: 0;
          cursor: pointer;
        }
        video {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
        }
      }
      .tag {
        text-align: center;
        font-size: 11px;
        color: #dfd7df;
      }
      .foot {
        display: flex;
        justify-content: space-around;
        position: fixed;
        width: 100%;
        bottom:0;
        left: 0;
        padding: 10px 0 14px 0;
        background-color: #fff;
        .ok,
        .no {
          width: 120px;
        }
        .no:hover {
          color: #409eff;
          background: #ecf5ff;
          border-color: #a9d2fd;
        }
      }
    }
  }
}
.progress_box {
  width: calc(100% - 50px);
  margin: 15px auto;
}
.upload-box{
max-width: 140px;
}
</style>

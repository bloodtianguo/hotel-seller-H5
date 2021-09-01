<template>
  <div class="play-video" v-if="videoshow">
    <div class="head">
   <div v-if="vTitle.length<7">{{vTitle||"视频标题"}} </div>
     <el-tooltip
                  v-else
                  effect="light"
                  placement="top"
                  :content="vTitle"
                >
                  <span>{{
                    hidetextFun(vTitle)
                  }}</span>
                </el-tooltip>
    <i class="close_icon el-icon-close" @click="closeVideo"></i>
  </div>
    <slot>
      <video 
      :src="videoUrl" 
      muted 
      controls 
      controlslist="nofullscreen nodownload noremoteplayback"
      ref="playVideo"></video>
      <el-button type="primary" class="ok" @click="closeVideo">确定</el-button>
    </slot>
  </div>
</template>

<script>
export default {
  name:'PlayVideo',
  data () {
    return {
      videoshow:false  
    }
  },
   props: {
    videoUrl: {
      type: String,
      default: ""
    }, 
    vTitle: {
      type: String,
      default: ""
    },
  },
  methods:{
    // 打开视频
  openvideo(){
      this.videoshow=true
   this.$nextTick(()=>{
     this.$refs.playVideo.disablePictureInPicture=true
    })
  },
    // 关闭视频
    closeVideo(){
      this.videoshow=false
      this.$refs.playVideo.pause()
      this.$emit('closePlay')
    },
  },
  watch:{
       videoUrl: {
      handler(newValue) {
        this.src = newValue;
      },
      deep: true
    },
  }
}
</script>

<style lang="less" scoped>
.play-video{
       position: absolute;
        // top: -113px;
        // left: 50%;
        // transform: translateX(-50%);
        width: 350px;
        height: 550px;
        box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, .7);
        background-color: #fff;
        .head{
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 50px;
          width: 100%;
          background-color: #BFE9FB;
          font-size: 14px;
          line-height: 50px;
          padding: 0 15px;
          box-sizing: border-box;
          .close_icon{
          position: absolute;
          right: 20px;
          }
          i{
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
          }
          
        }
        video{
          display: block;
          width: 300px;
          height: 350px;
          margin: 40px auto;
        }
        .ok{
          float: right;
          margin-right: 25px;
          width: 120px;
          background-color: #BFE9FB;
          border: 0;
          color: black;
        }
      }
      ::v-deep video::-internal-media-controls-overflow-menu-list {
        bottom: 100px !important;
        right: 10px !important;
      background-color: red !important;
      }
      ::v-deep video::-internal-media-controls-overflow-menu-list{
      }
</style>
<template>
  <div class="container">
     <div class="cardtype-box">
      <div class="box-card-type"><span>房间详情:</span> {{ room.checkStatu }}</div>
      <div class="box-card-btn" @click="goBack()">返回</div>
    </div>
    <div class="content">
      <div class="title">
        <h4 class="fontwei">房间信息 ：</h4>
        <div class="right">
          <el-button
            type="primary"
            size="mini"
            v-show="
              room.checkStatu !== '审核失败' && room.checkStatu !== '违规下架'
            "
            @click="goEdit"
            >编辑</el-button
          >
          <el-button
            type="primary"
            size="mini"
            v-show="room.checkStatus == 2 && room.status == 2"
            @click="setoutOk"
            >上架</el-button
          >
          <el-button
            type="danger"
            size="mini"
            v-show="room.checkStatu == '上架'"
            @click="setoutNo"
            >下架</el-button
          >
          <el-button
            type="success"
            plain
            size="mini"
            v-show="
              room.checkStatu == '审核失败' || room.checkStatu == '违规下架'
            "
            @click="goEdits"
            >重新提交</el-button
          >
        </div>
      </div>
      <div class="table">
        <table>
          <tr class="th">
            <td>房间名称</td>
            <td>房型名称</td>
            <td>房间数量</td>
            <td>可住人数</td>
          </tr>
          <tr>
            <td>{{ room.roomName }}</td>
            <td>{{ room.roomType }}</td>
            <td>{{ room.roomNumber }}</td>
            <td>{{ room.roomResideNumber }}</td>
          </tr>
          <tr class="th">
            <td>销售价(元)</td>
            <td>优惠价(元)</td>
            <td>视频</td>
            <td>
                <span v-show="room.checkStatu=='违规下架'">下架理由</span>
                <span v-show="room.checkStatu=='审核失败'">拒绝理由</span>
            </td>
          </tr>
          <tr>
            <td>{{ room.roomPrice }}</td>
            <td>{{ room.roomSalePrice }}</td>
            <td>
              <img
                src="../../assets/img/room/video.png"
                alt=""
                @click="playVideo"
              />
            </td>
            <td>
              <span v-show="room.checkStatu=='违规下架'||room.checkStatu=='审核失败'">{{room.remark}}</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="facility">
        <div class="fontwei">
          设备设施：
        </div>
        <div class="content">
          {{ room.roomFacility }}
        </div>
      </div>
      <div class="facility">
        <div class="fontwei">
          房间描述：
        </div>
        <div class="timy-box desic" v-html="room.roomDescribe"></div>
      </div>
       <play-video ref="videobox" :videoUrl="videoUrl" :vTitle="videoTitel"></play-video>
    </div>
  </div>
</template>

<script>
import PlayVideo from "../../components/PlayVideo.vue";
import { getRoomById, batchOperate } from "../../api/room";
export default {
  name: "roomDetails",
  components: {
    PlayVideo,
  },
  data() {
    return {
      room: {},
      videoTitel: "",
      videoUrl: "",
    };
  },
  mounted() {
    this.getRoomMeg();
  },
  methods: {
    getRoomMeg() {
      let params = {
        id: this.$route.query.roomId,
      };
      getRoomById(params).then((res) => {
        if (res.code == 0) {
          this.room = res.data;
          if(!this.room.roomDescribe){
            this.room.roomDescribe="无"
          }
          if (this.room.checkStatus == 2 && this.room.status == 1) {
            this.room.checkStatu = "上架";
          } else if (this.room.checkStatus == 2 && this.room.status == 2) {
            this.room.checkStatu = "下架";
          } else {
            switch (this.room.checkStatus) {
              case 1:
                this.room.checkStatu = "审核中";
                break;
              case 3:
                this.room.checkStatu = "审核失败";
                break;
              case 4:
                this.room.checkStatu = "违规下架";
                break;
              default:
                break;
            }
          }
        }
      });
    },
    goBack() {
      this.$router.back();
    },
    // 关闭视频
    offHandle() {
      this.videoUrl = "";
    },
    playVideo() {
      this.videoUrl = JSON.parse(JSON.stringify(this.room.roomVideoUrl));
      this.videoTitel = JSON.parse(JSON.stringify(this.room.roomVideoTitle));
      this.$refs.videobox.openvideo()// 调用子组件方法
    },
    // 上下架操作 1是上架
    setoutNo() {
      batchOperate({ ids: this.$route.query.roomId, status: 2 }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "操作下架!",
            type: "success",
          });
          this.getRoomMeg();
        }
      });
    },
    setoutOk() {
      batchOperate({ ids: this.$route.query.roomId, status: 1 }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "操作上架!",
            type: "success",
          });
          this.getRoomMeg();
        }
      });
    },
    // setOut(){
    //   batchOperate({ids:this.$route.query.roomId,status:this.room.status == 1 ? 2 : 1}).then(res=>{
    //     if(res.code == 0){
    //       this.getRoomMeg()
    //     }
    //   })
    // },
    goEdit() {
      this.$router.push({
        name: "addRoom",
        query: { roomId: this.room.id, tag: "编辑" },
      });
    },
    goEdits() {
      this.$router.push({
        name: "addRoom",
        query: { roomId: this.room.id, tag: "重新提交",Status:this.room.checkStatu },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  background: #fbfcfe;
  box-sizing: border-box;
  .cardtype-box {
  display: flex !important;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  justify-content: space-between;
  border-radius: 2px;
  padding: 10px 20px;
  .box-card-type {
    line-height: 30px;
    width: 200px;
    span {
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }
  }
  .box-card-btn {
    cursor: pointer;
    font-size: 16px;
    line-height: 30px;
    width: 80px;
    border: 1px solid #e4e7ed;
    text-align: center;
    border-radius: 4px;
    transform: all 0.3s;
    &:hover {
      border-color: #409eff;
      color: #409eff;
    }
  }
}
  .content {
    position: relative;
    margin-top: 20px;
    width: 100%;
    height: auto;
    background-color: #fff;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    .title {
      display: flex;
      justify-content: space-between;
      .right {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-right: 20px;
        .btnDow {
          background-color: #d5e7ef;
          color: #333;
        }
      }
    }
    h4 {
      padding-left: 25px;
      line-height: 50px;
      color: #666;
    }
    .btnEdit,
    .btnDow {
      width: 120px;
      margin: 0 15px;
      border: 0;
    }
    .table {
      padding: 0 20px;
      box-sizing: border-box;
      table {
        width: 100%;
        border-collapse: collapse;
        td {
          text-align: center;
          height: 50px;
          border: 1px solid #f2f2f2;
          color: #999;
        }
        .th {
          td {
            color: #666;
          }
        }
        img {
          cursor: pointer;
        }
      }
    }
    .facility {
      padding: 20px;
      color: #666;

      .content {
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0 50px;
        box-sizing: border-box;
        border: 1px solid #f3f3f3;
        font-size: 14px;
      }
      .timy-box{
        padding: 10px 50px;
        box-sizing: border-box;
        border: 1px solid #f3f3f3;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        margin-top: 20px;
      }
      .desic {
        height: auto;
      }
    }

    .play-video {
      position: absolute;
      top: -113px;
      left: 50%;
      transform: translateX(-50%);
      width: 350px;
      height: 550px;
      box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.7);
      background-color: #fff;
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
      video {
        display: block;
        width: 300px;
        height: 350px;
        margin: 40px auto;
      }
      .ok {
        float: right;
        margin-right: 25px;
        width: 120px;
        background-color: #bfe9fb;
        border: 0;
        color: black;
      }
    }
  }
}
</style>

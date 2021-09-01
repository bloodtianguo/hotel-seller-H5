<template>
  <div class="contanier">
    <div class="head">
      <h3 v-if="tag == '新增'">新增房间</h3>
      <h3 v-if="tag == '编辑'">编辑房间</h3>
      <h3 v-if="tag == '重新提交'">重新提交</h3>
      <el-button plain class="goback" @click="goBack">返回</el-button>
    </div>
    <div class="content">
      <div class="parent">
        <div class="title-header">基本信息:</div>
        <div>
          <el-form
            class="form"
            label-position="left"
            :rules="rules"
            ref="ruleFormone"
            label-width="120px"
            :model="room"
          >
            <el-form-item label="房间名称:" prop="roomName">
              <el-input
                class="form-input"
                v-model="room.roomName"
                placeholder="请输入房间名称"
              ></el-input>
            </el-form-item>
            <!-- :disabled="mydisabled" -->
            <el-form-item label="房型:" prop="type">
              <el-radio-group v-model="room.type">
                <el-radio label="大床房"></el-radio>
                <el-radio label="双床房"></el-radio>
                <el-radio label="三床房"></el-radio>
                <el-radio label="套房"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="房间数:" prop="roomNum">
              <el-input
                class="form-input"
                v-model="room.roomNum"
                @input="(e) => (room.roomNum = isnumber(e))"
                placeholder="请输入房间数量"
              >
                <template slot="append">间</template>
              </el-input>
            </el-form-item>

            <el-form-item label="可住人数:" prop="liveNum">
              <el-input
                class="form-input"
                v-model="room.liveNum"
                placeholder="请输入房间可住人数"
                @input="(e) => (room.liveNum = isnumber(e))"
              >
                <template slot="append">人</template>
              </el-input>
            </el-form-item>

            <el-form-item label="销售价:" prop="price">
              <el-input
                class="form-input"
                maxlength="13"
                v-model="room.price"
                placeholder="请输入房间价格"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>

            <el-form-item label="优惠价:" prop="salePrice">
              <el-input
                class="form-input"
                maxlength="13"
                v-model="room.salePrice"
                placeholder="请输入房间优惠价格"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="title-header">展示信息:</div>
          <el-form
            class="form"
            label-position="left"
            :rules="rules"
            ref="ruleFormtwo"
            label-width="120px"
            :model="room"
          >
            <el-form-item label="视频:" prop="videoUrl" class="item-video">
              <el-radio-group v-model="room.videoIndex">
                <el-radio
                  v-for="(item, idx) in videoList"
                  :label="idx"
                  :key="idx"
                >
                  <video :src="item.videoUrl" muted controls></video>
                  <div class="title" v-if="item.title.trim().length < 7">
                    {{ hidetextFun(item.title.trim()) || "-" }}
                  </div>
                  <el-tooltip
                    v-else
                    effect="light"
                    placement="top"
                    :content="item.title"
                  >
                    <div class="title">{{ hidetextFun(item.title) }}</div>
                  </el-tooltip>
                </el-radio>

                <el-button :loading="videoloding" plain @click="goVideoList"
                  >更多视频</el-button
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="房间描述:" class="roomremark">
              <my-tinymce
                :tinyvalue="room.remark"
                @tinymceinput="gettinymceinput"
              ></my-tinymce>
              <div class="text">已输入{{ textlength }}/500</div>
            </el-form-item>
          </el-form>
          <div class="title-header">配套设施:</div>
          <el-form
            class="form faccard"
            label-position="left"
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            :model="room"
          >
            <el-form-item prop="facility" :error="facilityerr">
              <div class="facility-box">
                <!-- 回显 -->
                <div
                  class="facility-card font12"
                  v-for="(tag,index) in facilitylist"
                  :key="index"
                  closable
                  type="info"
                >
                <i class="icons el-icon-error" @click="clickicon(tag.name,index)"></i>
                 <el-image
                    style="width: 40px; height: 30px;margin-top: 10px;"
                    :src="tag.iconurl"
                    fit="contain"></el-image>
                <p class="fac-tit">{{ tag.name }}</p>
                </div>
              </div>
              <div class="add-fac" @click="faciliOpen()">添加配套设施</div>
            </el-form-item>
            <el-form-item label="销售状态:" prop="status" class="saleStatus">
              <el-radio-group v-model="room.status">
                <el-radio label="上架"></el-radio>
                <el-radio label="下架"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="foot">
            <el-button plain @click="goBack">取消</el-button>
            <el-button type="primary" @click="save">提交</el-button>
            <el-button
              type="primary"
              v-if="tag == '新增'"
              @click="saveAndContinue"
              >提交并继续</el-button
            >
          </div>
          <!-- <button @click="test">click</button> -->
        </div>
      </div>
    </div>
    <el-dialog
      title="配套服务"
      :visible.sync="facilishow"
      width="60%"
      :before-close="faciliClose"
      @closed="facilicloseD"
      :close-on-click-modal="false"
    >
      <div class="facili-main">
        <!-- <div class="facili-card"> -->
        <el-checkbox-group v-model="facilityval" class="facili-card">
          <el-checkbox
            class="box-card"
            v-for="(item, index) in facilitys"
            :label="item.name"
            :key="index"
          >
            <el-image
              fit="contain"
              class="card-icon"
              :key="item.iconurl"
              :src="item.iconurl"
              lazy
            ></el-image>
            <p class="card-title">{{ item.name }}</p>
          </el-checkbox>
        </el-checkbox-group>
        <!-- </div> -->
      </div>
      <span slot="footer" class="facili-footer">
        <el-button @click="facilishow = false">取 消</el-button>
        <el-button type="primary" @click="faciliOK">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyTinymce from "@/components/MyTinymce.vue";
import { qryVideoByUserId, crtUptRoom, getRoomById } from "../../api/room";

// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ direction: "rtl" }], // 文本方向
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ["clean"], // 清除文本格式
  ["image"], // 链接、图片、视频
];

export default {
  name: "addRoom",
  data() {
    let validatorIsNum = (rule, value, callback) => {
      // /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
      if (/^\d{1,10}(\.\d{1,2})?$/.test(value) == false) {
        callback(new Error("价格可输入为10位数小数点后2位"));
      } else {
        callback();
      }
    };
    return {
      // 回显设施的循环列表
      facilitylist:[],
      Statusval: "",
      videoloding: false, //获取视频列表加载状态
      facilishow: false, //添加配套设施是否显示
      textlength: "0",
      facilityval: [],
      room: {
        roomName: "", // 房间名称
        type: "", // 房型
        roomNum: "", // 房间数
        liveNum: "", // 可住人数
        price: "", // 基本价
        salePrice: "", // 销售价（优惠后）
        videoIndex: 0, // 视频
        roomVideoImgUrl: "", //视频封面
        facility: ["免费WIFI", "空调", "洗漱用品", "24小时热水"], // 设备设施
        remark: "",
        status: "上架",
      },
      facilityerr: null,
      editorOption: {
        // matchVisual: false,
        placeholder: "请输入描述",
        modules: {
          imageDrop: true,
          toolbar: {
            container: toolbarOptions,
          },
        },
      },

      rules: {
        roomName: [
          { required: true, message: "请输入房间名称", trigger: "blur" },
          { max: 15, message: "最多输入15个字符", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择房型", trigger: "change" }],
        roomNum: [
          { required: true, message: "请输入房间数量", trigger: "blur" },
          { validator: validatorIsNum, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (Number(value) > 999) {
                callback(new Error("房间数不能超过999"));
              }
            },
            trigger: "blur",
          },
        ],
        liveNum: [
          { required: true, message: "请输入房间可住人数", trigger: "blur" },
          { validator: validatorIsNum, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (Number(value) > 999) {
                callback(new Error("可住人数不能超过999"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        price: [
          { required: true, message: "请输入房间价格", trigger: "blur" },
          { validator: validatorIsNum, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (Number(value) < Number(this.room.salePrice)) {
                callback(new Error("销售价格必须大于优惠价格"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        salePrice: [
          { required: true, message: "请输入房间优惠价格", trigger: "blur" },
          { validator: validatorIsNum, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (Number(this.room.price) < Number(value)) {
                callback(new Error("销售价格必须大于优惠价格"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        videoUrl: [
          { required: true, message: "请选择一个视频", trigger: "blur" },
        ],
        facility: [
          {
            required: true,
            message: "请至少选择一个设备设施",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (value.length < 1) {
                callback(new Error("至少选择一个设备或设施"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        status: [{ required: true, message: "", trigger: "blur" }],
      },
    };
  },
  components: {
    MyTinymce,
  },
  created() {
    this.videoList = [];
    this.facilist =
      "免费WIFI,空调,洗漱用品,24小时热水,有窗,电话,电水壶,沙发,麻将机,浴缸,洗衣机,保险柜,吹风机,烘干机,微波炉,电脑,含早餐,办公桌椅,衣架,影音";
    this.facilitys = [
      { name: "免费WIFI", iconurl: require("@/assets/img/icons/wifi.png") },
      { name: "空调", iconurl: require("@/assets/img/icons/kongtiao.png") },
      { name: "洗漱用品", iconurl: require("@/assets/img/icons/xishu.png") },
      {
        name: "24小时热水",
        iconurl: require("@/assets/img/icons/24reshui.png"),
      },
      { name: "有窗", iconurl: require("@/assets/img/icons/window.png") },
      { name: "电话", iconurl: require("@/assets/img/icons/phone.png") },
      { name: "电水壶", iconurl: require("@/assets/img/icons/reshuihu.png") },
      { name: "沙发", iconurl: require("@/assets/img/icons/shafa.png") },
      { name: "麻将机", iconurl: require("@/assets/img/icons/majiang.png") },
      { name: "浴缸", iconurl: require("@/assets/img/icons/yugang.png") },
      { name: "洗衣机", iconurl: require("@/assets/img/icons/xiyiji.png") },

      { name: "保险柜", iconurl: require("@/assets/img/icons/baoxiangui.png") },
      { name: "吹风机", iconurl: require("@/assets/img/icons/chuifengji.png") },
      { name: "烘干机", iconurl: require("@/assets/img/icons/honggan.png") },
      { name: "微波炉", iconurl: require("@/assets/img/icons/weibolu.png") },
      { name: "电脑", iconurl: require("@/assets/img/icons/computer.png") },
      { name: "含早餐", iconurl: require("@/assets/img/icons/food.png") },
      { name: "办公桌椅", iconurl: require("@/assets/img/icons/zhuoyi.png") },
      { name: "衣架", iconurl: require("@/assets/img/icons/yijia.png") },
      { name: "影音", iconurl: require("@/assets/img/icons/video.png") },
    ];
    (this.roomId = -1), (this.tag = "");
    this.mydisabled = false;
  },
  async mounted() {
    await this.judgeAddorEdit();
    this.getVideos();
  },
  methods: {
    isnumber(val) {
      val = val.replace(/[^\d]/g, "");
      if (val.substr(0, 1) == "0") {
        val = val.replace(val.slice(0, 1), "");
      }
      return val;
    },
    // 接收router.query的值，以此判断是添加房间还是编辑房间
    judgeAddorEdit() {
      this.tag = this.$route.query.tag;
      this.mydisabled = this.tag == "编辑";
      if (this.tag == "编辑" || this.tag == "重新提交") {
        this.roomId = this.$route.query.roomId;
        this.Statusval = this.$route.query.Status;
        getRoomById({ id: this.roomId }).then((res) => {
          if (res.code == 0) {
            if (sessionStorage.getItem("room")) {
              var istemp = JSON.parse(sessionStorage.getItem("room"));
              this.room = {
                roomName: istemp.roomName, // 房间名称
                type: istemp.type, // 房型
                roomNum: istemp.roomNum, // 房间数
                liveNum: istemp.liveNum, // 可住人数
                price: istemp.price, // 基本价
                salePrice: istemp.salePrice, // 销售价（优惠后）
                roomVideoImgUrl: res.data.roomVideoImgUrl,
                videoIndex: 0, // 视频
                facility: istemp.facility, // 设备设施
                remark: istemp.remark,
                status: istemp.status,
              };
              sessionStorage.removeItem("room");
            } else {
              this.room = {
                roomName: res.data.roomName, // 房间名称
                type: res.data.roomType, // 房型
                roomNum: res.data.roomNumber, // 房间数
                liveNum: res.data.roomResideNumber, // 可住人数
                price: res.data.roomPrice, // 基本价
                salePrice: res.data.roomSalePrice, // 销售价（优惠后）
                // facility:res.data.roomFacility.split(",")
                roomVideoImgUrl: res.data.roomVideoImgUrl,
                videoIndex: 0, // 视频
                remark: res.data.roomDescribe,
                status: res.data.status == 1 ? "上架" : "下架",
              };
              if (res.data.roomFacility) {
                this.room.facility = [];
                var faci = res.data.roomFacility.split(",");
                faci.map((item) => {
                  if (this.facilist.includes(item)) {
                    this.room.facility.push(item);
                    this.$forceUpdate();
                  }
                });
              } else {
                this.room.facility = [
                  "免费WIFI",
                  "空调",
                  "洗漱用品",
                  "24小时热水",
                ];
              }
            }
            if (this.Statusval == "违规下架") {
              this.room.status = "上架";
            }
            if (this.tag == "编辑") {
              if (sessionStorage.getItem("videoCurrent")) {
                let videos = JSON.parse(sessionStorage.getItem("videoCurrent"));
                this.videoList = [
                  {
                    id: videos.id,
                    videoUrl: videos.videoUrl,
                    title: videos.title,
                    roomVideoImgUrl: videos.coverImage,
                  },
                ];
                sessionStorage.removeItem("videoCurrent");
              } else {
                this.videoList = [
                  {
                    id: res.data.roomVideoId,
                    videoUrl: res.data.roomVideoUrl,
                    title: res.data.roomVideoTitle,
                    roomVideoImgUrl: res.data.coverImage,
                  },
                ];
              }
            }
          }
        });
      } else {
        if (sessionStorage.getItem("room")) {
          var istemp = JSON.parse(sessionStorage.getItem("room"));
          this.room = {
            roomName: istemp.roomName, // 房间名称
            type: istemp.type, // 房型
            roomNum: istemp.roomNum, // 房间数
            liveNum: istemp.liveNum, // 可住人数
            price: istemp.price, // 基本价
            salePrice: istemp.salePrice, // 销售价（优惠后）
            videoIndex: 0, // 视频
            facility: istemp.facility, // 设备设施
            remark: istemp.remark,
            status: istemp.status,
          };
          sessionStorage.removeItem("room");
        } else {
          this.changefaci()
        }
      }
    },
    // 点击回显盒子X
    clickicon(name,index){
      if(this.room.facility.length>=2){
         this.room.facility.splice(index,1)
         this.changefaci()
      }else{
        this.Warning("房间至少选择一个设备或设施");
      }
    },
    //处理回显信息
    changefaci(){
       this.facilitylist=[];
          this.room.facility.map((item) => {
            this.facilitys.map((items) => {
              if (items.name == item) {
                this.facilitylist.push(items)
              }
            });
          });
    },
    // 获取视频信息
    getVideos() {
      this.videoList = [];
      if (this.roomId != -1) {
        if (this.tag == "编辑") {
          return;
        }
      }
      this.videoloding = true;
      let params = {
        number: 4, // 这个是需要几条视频
      };
      qryVideoByUserId(params).then((res) => {
        if (res.code == 0) {
          this.videoloding = false;
          if (sessionStorage.getItem("videoCurrent")) {
            res.data.map((item) => {
              if (
                item.id !==
                JSON.parse(sessionStorage.getItem("videoCurrent")).id
              ) {
                this.videoList.push(item);
              } else {
                return false;
              }
            });
            this.videoList.unshift(
              JSON.parse(sessionStorage.getItem("videoCurrent"))
            );
            sessionStorage.removeItem("videoCurrent");
          } else {
            this.videoList = res.data;
          }
          this.$forceUpdate();
        }
      });
    },
    gettinymceinput(val) {
      this.room.remark = val;
    },
    // 返回
    goBack() {
      sessionStorage.removeItem("room");
      this.$router.back();
    },
    // 发送提交
    async sendSubmit() {
      if (
        this.room.type == "" ||
        this.room.videoUrl == "" ||
        this.room.status == ""
      ) {
        this.Warning("你还有未填完的项哟");
        return;
      }
      if (!this.videoList[this.room.videoIndex]) {
        this.Warning("请先新增酒店视频");
        return;
      }
      let data = {
        roomDescribe: this.room.remark,
        roomFacility: this.room.facility.join(","),
        roomName: this.room.roomName,
        roomNumber: this.room.roomNum,
        roomPrice: this.room.price,
        roomResideNumber: this.room.liveNum,
        roomSalePrice: this.room.salePrice,
        roomType: this.room.type,
        roomVideoId: this.videoList[this.room.videoIndex].id,
        roomVideoUrl: this.videoList[this.room.videoIndex].videoUrl,
        roomVideoTitle: this.videoList[this.room.videoIndex].title,
        roomVideoImgUrl: "",
        status: this.room.status == "上架" ? 1 : 2,
        userId: 5,
      };
      if (this.videoList[this.room.videoIndex].coverImage) {
        data.roomVideoImgUrl = this.videoList[this.room.videoIndex].coverImage;
      } else if(this.videoList[this.room.videoIndex].roomVideoImgUrl){
         data.roomVideoImgUrl =this.videoList[this.room.videoIndex].roomVideoImgUrl
      }else{
        data.roomVideoImgUrl = this.room.roomVideoImgUrl;
      }
      if (this.roomId != -1) {
        data.id = this.roomId;
      }
      let result = null;
      try {
        result = await crtUptRoom(data);
      } catch (error) {
        console.log(error);
      }
      return result;
    },

    // 保存
    async save() {
      if (this.room.facility == "") {
        this.facilityerr = "至少选择一个设备或设施!";
        return false;
      }
      let res = await this.sendSubmit();
      if (res.code == 0) {
        this.Success(this.roomId == -1 ? "添加房间成功!" : "修改成功");
        setTimeout(() => {
          this.$router.back();
        }, 500);
      }
    },
    // 保存并继续
    async saveAndContinue() {
      if (this.room.facility == "") {
        this.facilityerr = "至少选择一个设备或设施!";
        return false;
      }
      let res = await this.sendSubmit();
      if (res.code == 0) {
        this.$refs.ruleFormone.resetFields();
        this.$refs.ruleFormtwo.resetFields();
        this.$refs.ruleForm.resetFields();
        this.room.facility = ["免费WIFI", "空调", "洗漱用品", "24小时热水"];
        this.room.remark = "";
        this.Success("添加房间成功");
        this.getVideos(); //获取视频
      }
    },
    // 跳转视频列表
    goVideoList() {
      sessionStorage.setItem("room", JSON.stringify(this.room));
      this.$router.push({ name: "videoList" });
    },
    //配套设施
    // 打开配套设施弹窗
    faciliOpen() {
      this.facilishow = true;
      this.facilityval = JSON.parse(JSON.stringify(this.room.facility));
    },
    faciliClose() {
      this.facilishow = false;
    },
    facilicloseD() {
      this.facilityval = [];
    },
    faciliOK() {
      if (this.facilityval.length == 0) {
        this.Err("请选择至少一个设备或设施");
        return false;
      } else {
        this.room.facility = JSON.parse(JSON.stringify(this.facilityval));
        this.changefaci()
        this.facilishow = false;
      }
    },
    /*-------------------------------------------------------------*/
  },
  watch: {
    "room.remark": {
      handler: function() {
        let temp = this.room.remark.replace(/<\/?.+?\/?>/g, "");
        temp = temp.replace(/(&nbsp;)/gi, "a");
        this.textlength = temp.length;
        if (temp.length > 500) {
          temp = temp.substr(0, 500);
          this.Warning("最多输入500字!");
          return;
        }
      },
    },
    "room.facility":{
      handler:function () {
      this.changefaci()
      this.$forceUpdate()
      deep:true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.contanier {
  width: 100%;
  padding: 0 20px;
  background-color: #f4f4f4;
  box-sizing: border-box;
  .head {
    position: relative;
    height: 90px;
    background-color: #fff;
    h3 {
      line-height: 90px;
      padding-left: 22px;
      color: #333;
      font-size: 20px;
    }
    .goback {
      float: right;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      margin-right: 22px;
      width: 125px;
    }
  }
  .content {
    height: 800px;
    width: 100%;
    margin: 30px auto;
    overflow: hidden;
    .parent {
      height: 100%;
      width: calc(100% + 18px);
      background-color: #fff;
      overflow-y: scroll;
      .title {
        padding: 28px 0 0 22px;
        font-size: 18px;
        color: #444;
      }
      .form {
        margin: 30px 0 0 60px;
        .form-input {
          width: 325px;
        }
        .item-video {
          /deep/.el-radio-group {
            position: relative;
            padding-left: 10px;
            padding-right: 110px;
            height: 200px;
            border-radius: 3px;
            border: 1px solid #999;
            video {
              margin: 5px;
              height: 140px;
              width: 140px;
              border: 2px solid #cccccc;
              border-radius: 5px;
            }
            .title {
              color: #333;
              text-align: center;
              padding: 0;
              width: 144px;
              position: absolute;
              right: 5px;
            }
            .el-radio {
              margin-top: 8px;
            }
            .el-radio__input {
              vertical-align: top;
            }
            .el-radio__label {
              color: transparent;
            }
            .el-button {
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);
            }
          }
        }
        .quill-editor {
          height: 400px;
          width: 922px;
        }
      }
    }
    .tinymce {
      width: 1200px;
      height: 400px;
      /deep/.tox-tinymce {
        height: 450px !important;
      }
    }
  }
  .foot {
    text-align: right;
    padding-right: 600px;
    padding-bottom: 50px;
    .el-button {
      width: 120px;
      margin-left: 50px;
    }
  }
}
.tiny {
  width: 100%;
  height: 100%;
  background-color: red;
}
::v-deep .tox-statusbar {
  display: none !important;
}
.text {
  margin-top: 50px;
}
.roomremark {
  position: relative;
  .box {
    position: absolute;
    width: 1200px;
    height: 100%;
    top: 0;
    z-index: 900;
    background-color: #f5f7fa7d;
    &:hover {
      cursor: not-allowed;
    }
  }
  .text {
    float: right;
    margin-right: calc(100% - 1180px);
  }
}
.title-header {
  line-height: 45px;
  margin: 15px;
  border-bottom: 2px solid rgba(161, 161, 161, 0.2);
}
.add-fac {
  width: 100px;
  line-height: 35px;
  border: 2px solid #8080ff;
  text-align: center;
  border-radius: 5px;
  color: #8080ff;
  cursor: pointer;
}
.facili-footer {
  display: flex;
  justify-content: center;
}
.facili-card {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .box-card {
    width: 16%;
    height: 110px;
    margin: 10px;
    border-radius: 5px;
    border: 2px solid #dcdcdc;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    transition: 0.3s;
    .image {
      width: 100%;
      display: block;
    }
  }
}
::v-deep .el-dialog__body {
  height: 620px;
  overflow: auto;
}
::v-deep .el-dialog {
  border-radius: 10px;
  .el-dialog__title {
    color: #333;
    font-family: MicrosoftYaHeiUI-Bold, MicrosoftYaHeiUI;
    font-weight: bold;
  }
}
.el-dialog__wrapper {
  margin-top: -50px;
  overflow: hidden;
}
::v-deep .el-checkbox__inner {
  border-radius: 50%;
  position: absolute;
  left: 150px;
}
.card-icon {
  width: 40px !important;
  height: 30px !important;
  position: absolute;
  left: 50%;
  top: 40px;
  transform: translate(-50%, -50%);
}
.card-title {
  position: absolute;
  left: 50%;
  top: 80px;
  transform: translate(-50%, -50%);
  color: #666666;
  font-family: MicrosoftYaHeiUI;
}
::v-deep .faccard{
  margin-top: 0 !important;
}
/*回显设施盒子*/
.facility-box {
  max-width: 85%;
  overflow-x: auto;
  border-radius: 5px;
  margin-bottom: 30px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  .facility-card {
    /*box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);*/
    border: 1px solid #DCDCDC;
    color: #666666;
    text-align: center;
    width: 100px;
    height: 80px;
    border-radius: 5px;
    margin-right: 15px;
    position: relative;
    margin-top: 15px;
    .icons{
      font-size: 1.5em;
      position: absolute;
      right: 5px;
      top: 5px;
      &:hover{
        color: #19cfc9;
      }
    }
    .fac-tit{
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>

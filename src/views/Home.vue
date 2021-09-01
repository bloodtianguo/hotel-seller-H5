<template>
  <div class="container-home clearfix">
    <aside class="aside">
      <div class="title">没找酒店管理系统</div>
      <div class="nav">
        <div
          class="item"
          :class="{ 'active-item': item.route == activeRoute }"
          v-for="(item, idx) in aside"
          :key="idx"
          @click="chooseHandle(idx)"
        >
          <img
            :src="item.route == activeRoute ? item.urlActive : item.url"
            class="icon"
          />
          <div>{{ item.item }}</div>
        </div>
      </div>
    </aside>
    <section class="right">
      <div class="head-top">
        <div class="user">
          <i class="el-icon-s-custom"></i>
          <span class="name">{{ userName }}</span>
        </div>

        <div>
          <el-button
            icon="el-icon-switch-button"
            size="mini"
            circle
            @click="exitHandle"
          ></el-button>
        </div>
      </div>
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </section>
    <el-dialog
      :modal="true"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>是否开启语言提示</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleBtn(false)">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleBtn(true)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// var ws = new WebSocket(process.env.VUE_APP_WEBSOCKT_URL + sessionStorage.token);
import { asideBoss, asideStaff } from "@/utils/tools/router-link";
import { webLogout } from "@/api/login";
export default {
  created() {
    // console.log("ws",ws);
  },
  data() {
    return {
      aside: [
        {
          urlActive: require("../assets/img/home/workbench1.png"),
          url: require("../assets/img/home/workbench.png"),
          item: "工作台",
          route: "workbench",
        },
        {
          urlActive: require("../assets/img/home/oder1.png"),
          url: require("../assets/img/home/oder.png"),
          item: "订单管理",
          route: "order",
        },
        {
          urlActive: require("../assets/img/home/room1.png"),
          url: require("../assets/img/home/room.png"),
          item: "房间管理",
          route: "room",
        },
        {
          urlActive: require("../assets/img/home/child1.png"),
          url: require("../assets/img/home/child.png"),
          item: "子账号设置",
          route: "roleSet",
        },
        {
          urlActive: require("../assets/img/home/hotel1.png"),
          url: require("../assets/img/home/hotel.png"),
          item: "酒店设置",
          route: "hotelSet",
        },
      ],
      current: 0,
      userName: "",
      dialogVisible: true,
      sendSet: "",
      ws:""
    };
  },
  mounted() {
    this.setAside();
    this.ws = new WebSocket(
      process.env.VUE_APP_WEBSOCKT_URL + sessionStorage.token
    );
    this.ws.onopen = function() {
      console.log("连接成功");
      clearInterval(this.sendSet);
    };
  },
  beforeDestroy() {
    clearInterval(this.sendSet);
  },
  methods: {
    dialogVisibleBtn(value) {
      this.dialogVisible = false;
      this.$store.commit("setAiduoStatus", value);
      this.wobsockFun();
    },
    chooseHandle(i) {
      this.current = i;
      this.$router.push({ name: this.aside[i].route }).catch((err) => {});
    },
    setAside() {
      this.userName = sessionStorage.getItem("userName");
      let userType = sessionStorage.getItem("userType"); // 1.主账号  2.子账号
      if (userType == 1) {
        this.aside = asideBoss;
      } else {
        this.aside = asideStaff;
      }
    },

    exitHandle() {
      webLogout().then((response) => {
        if (response.code == 0) {
          this.ws.close()//断开websorket
          clearInterval(this.sendSet);
          sessionStorage.clear();
          this.$router.push("/login");
        }
      });
    },
    wobsockFun() {
      let _this = this;
      let token = sessionStorage.getItem("token");
      _this.ws = new WebSocket(
        process.env.VUE_APP_WEBSOCKT_URL + sessionStorage.token
      );
      _this.ws.onopen = function() {};
      _this.sendSet = setInterval(() => {
        _this.ws.send(token);
      }, 60000);

      _this.ws.onmessage = function(e) {
        let str = JSON.parse(e.data);
        if (str.messageType == 1) {
          if (_this.getAiduoStatus == true) {
            if (str.orderType == 2) {
              var myAuto = document.getElementById("myaudio");
              myAuto.play();
            } else {
              var myAutoquxiao = document.getElementById("myaudioquxiao");
              myAutoquxiao.play();
            }
          }
        } else {
          _this.$store.commit("setOrderData", str);
        }
      };

       _this.ws.onclose = function(e) {
        if(sessionStorage.token){
            setTimeout(_this.wobsockFun, 500);
            console.log("socket closed try again");
        }else{
          console.log("已断开连接");
        }
      };

       _this.ws.onerror = function(err) {
        console.error(err);
      };
    },
  },
  watch: {},
  computed: {
    key() {
      return this.$route.path;
    },
    activeRoute() {
      let active = this.$route.path.match(/(?<=\/).*(?=\/)/);
      if (active == null) {
        active = this.$route.path.match(/(?<=\/).*/);
      }
      return active[0];
    },
    getAiduoStatus() {
      return this.$store.state.aiduoStatus;
    },
  },
};
</script>

<style lang="less" scoped>
.container-home {
  float: left;
  width: 1900px;
  height: 100%;
  margin: auto;
  .aside,
  .right {
    float: left;
  }
  .right {
    // width: 1630px;
    width: calc(100% - 230px);
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    background: #f4f4f4;
    .head-top {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 50px;
      margin-bottom: 10px;
      background: #fff;
      color: #666;
      vertical-align: text-bottom;
      .el-icon-s-custom {
        font-size: 25px;
        vertical-align: bottom;
        margin-right: 5px;
      }
      .user {
        margin-right: 30px;
        .name {
          font-size: 14px;
        }
      }
      & > div {
        margin-right: 25px;
      }
    }
  }
  .aside {
    width: 230px;
    height: 100%;
    background-color: #041334;
    .title {
      margin-top: 56px;
      margin-bottom: 40px;
      font-size: 23px;
      font-weight: 700;
      text-align: center;
      color: #fff;
    }
    .nav {
      display: flex;
      flex-direction: column;
      .item {
        display: flex;
        align-items: center;
        width: calc(100% - 24px);
        height: 48px;
        margin-bottom: 20px;
        color: #fff;
        cursor: pointer;
        img {
          margin: 0 19px 0 55px;
          width: 22px;
          height: 22px;
        }
        div {
          font-size: 18px;
          font-family: "Microsoft Yahei UI";
        }
      }
      .active-item {
        border-radius: 0 48px 48px 0;
        background-color: #fff;
        color: #333;
      }
    }
  }
}
</style>

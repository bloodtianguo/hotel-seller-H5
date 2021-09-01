<template>
  <div class="container">
    <div class="from">
      <div class="title">
        <div class="tag">
          {{ !loginWay ? "二维码登录" : "欢迎登录" }}
        </div>
        <img
          class="icon"
          src="@/assets/img/login/qrcode.png"
          v-show="loginWay"
          @click="changLogin"
        />
        <img
          class="icon"
          src="@/assets/img/login/zhanghao.png"
          v-show="!loginWay"
          @click="changLogin"
        />
      </div>
      <!-- 账号登陆 -->
      <div v-show="loginWay">
        <div class="content">
          <div>
            <img class="phone-icon" src="@/assets/img/login/phone.png" />
            <input
              type="text"
              ref="phoneInput"
              placeholder="请输入手机"
              maxlength="11"
              onkeyup="value=value.replace(/[^\d\.]/g,'')"
              v-model="phone"
            />
          </div>
          <div>
            <img class="phone-icon" src="@/assets/img/login/dun.png" />
            <input
              class="vpwd"
              type="text"
              ref="SmsInput"
              maxlength="4"
              placeholder="请输入验证码"
              onkeyup="value=value.replace(/[^\d\.]/g,'')"
              v-model="validate"
            />
            <div
              class="validate"
              :class="{ 'validate-disabled': myTime }"
              @click="onGetValidate"
            >
              {{ myTime === undefined ? "获取验证码" : time + "秒" }}
            </div>
          </div>
        </div>
        <div
          class="btn-login"
          :class="{ 'btn-disabed': phone.length < 11 || validate.length < 4 }"
          @click="longinHandle"
        >
          登录
        </div>
      </div>
      <!-- 扫码登陆 -->
      <div class="sans" v-show="!loginWay">
        <div class="scan" ref="qrCode"></div>
        <div class="overtimeTip" v-show="qrOverTime" @click="refreshQr">
          <p>二维码失效</p>
          <p>请点击刷新</p>
        </div>
        <div class="scan-tag">
          打开没找APP"扫一扫"<br />
          扫码登录
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { getPhoneValidate, login, getScanStr, pollScan } from "@/api/login";
export default {
  name: "login",
  data() {
    return {
      loginWay: true,
      phone: "",
      validate: "",
      time: 60,
      myTime: undefined, // 接收定时器变量
      qrOverTime: false, //二维码失效是否显示
    };
  },
  created() {
    this.qrcode = "";
  },
  mounted() {
    this.changLogin();
  },
  destroyed() {
    clearInterval(this.myTime);
  },
  methods: {
    changLogin() {
      if (this.myTime) {
        clearInterval(this.myTime);
        this.myTime = undefined;
        this.time = 60;
      }

      this.loginWay = !this.loginWay;
      if (!this.loginWay) {
        this.creatScan();
      } else {
      }
    },
    onGetValidate() {
      if (this.phone == "") {
        this.Warning("请输入手机号码");
        this.$refs.phoneInput.focus();
        return;
      } else {
        let phoneReg = /^(?:(?:\+|00)86)?1\d{10}$/; //手机号正则
        if (!phoneReg.test(this.phone)) {
          this.Warning("请输入1开头的11位手机号");
          this.$refs.phoneInput.focus();
          return;
        }
      }
      let params = {
        phone: this.phone.trim(),
      };
      // 访问api
      getPhoneValidate(params)
        .then((res) => {
          if (res.code != 0) {
            this.$message(res.msg);
          } else {
            // 如果定时器存在则直接退出改方法
            if (this.myTime !== undefined) return;
            this.myTime = setInterval(() => {
              this.time--;
              if (this.time == 0) {
                clearInterval(this.myTime);
                this.myTime = undefined;
                this.time = 60;
              }
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    longinHandle() {
        let phoneReg = /^(?:(?:\+|00)86)?1\d{10}$/; //手机号正则
        let SmsReg = /^\d{4}$/;
      if (this.phone == "") {
        this.Warning("请输入1开头的11位手机号");
        this.$refs.phoneInput.focus();
        return;
      } else {
        if (!phoneReg.test(this.phone)) {
          this.Warning("请输入1开头的11位手机号");
          this.$refs.phoneInput.focus();
          return;
        }
      }

      if (this.validate == "") {
        this.Warning("请输入验证码");
        this.$refs.SmsInput.focus();
        return;
      } else {
        if (!SmsReg.test(this.validate)) {
          this.Warning("请输入由4位数字构成的验证码");
          this.$refs.SmsInput.focus();
          return;
        }
      }
      let fdata = new FormData();
      fdata.append("phone", this.phone);
      fdata.append("phoneSms", this.validate);

      login(fdata)
        .then((res) => {
          if (res.code != 0) {
            this.Err(res.msg)
            return;
          }
          //保存token
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("userType", res.data.userType);
          sessionStorage.setItem("userName", res.data.userName);
          // 成功跳转
          this.$router.push("/home");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 刷新二维码
    refreshQr() {
      this.qrcode = "";
      this.creatScan();
    },
    // 生成二维码
    async creatScan() {
      let res = await getScanStr();

      if (res.code != 0) {
        this.$message("获取二维码失败！请联系管理员。");
        return;
      }
      this.qrOverTime = false;
      this.qrcode = res.data.hotelCode;
      this.$refs.qrCode.innerHTML = null;
      let qr = new QRCode(this.$refs.qrCode, {
        width: 300,
        height: 300,
        text: this.qrcode,
      });
      qr._el.title = "";
      this.scanLong();
    },

    // 轮询
    async scanLong() {
      let res = await pollScan({ code: this.qrcode });

      if (res.code == 0) {
        if (res.data.code == 0) {
          // 0.未授权   1.成功  2.失败  3.超时失效
          setTimeout(() => {
            !this.loginWay && this.scanLong();
          }, 1000);
        } else if (res.data.code == 1) {
          //保存token
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("userType", res.data.data.userType);
          sessionStorage.setItem("userName", res.data.data.userName);
          if(res.data.data.userType==1){
            sessionStorage.Types=1
          }
          // 成功跳转
          this.$router.push({ name: "home" });
          this.Success("扫码成功,欢迎登录");
        } else {
          if (res.data.msg == "二维码已失效") {
            this.qrOverTime = true;
          } else {
            this.$message(res.data.msg);
            this.refreshQr();
          }
        }
      } else {
        this.$message("系统出错，请联系管理员");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100;
  height: 100%;
  background: url("../assets/img/login/background.jpg") no-repeat center;
  background-size: cover;
  .from {
    position: absolute;
    top: 50%;
    right: 180px;
    transform: translateY(-50%);
    width: 440px;
    height: 522px;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 120px;
      padding: 20px;
      box-sizing: border-box;
      border: 2px solid #f8f8f8;
      .tag {
        font-size: 28px;
        font-family: Microsoft Yahei UI;
      }
      .icon {
        width: 80px;
        height: 80px;
        cursor: pointer;
      }
    }
    .content {
      & > div {
        position: relative;
        display: block;
        margin: 37px auto 0;
        height: 53px;
        width: calc(100% - 60px);
        img {
          width: 22.5px;
          height: 30px;
        }
        .phone-icon {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          margin-top: -3px;
        }
        .vpwd {
          padding-right: 120px;
        }
        .validate {
          top: 3px;
          position: absolute;
          right: 0;
          width: 120px;
          height: 40px;
          border: 1px solid #292bfe;
          border-radius: 5px;
          color: #292bfe;
          cursor: pointer;
          font-size: 20px;
          line-height: 35px;
          font-family: MicrosoftYaHeiUI;
          text-align: center;
          box-sizing: border-box;
          user-select: none;
        }
        .validate-disabled {
          color: #666;
          border: 1px solid #666;
        }
      }
      input {
        height: 100%;
        width: 100%;
        border: 0;
        border-bottom: 1px solid #f8f8f8;
        outline: none;
        font-size: 20px;
        padding-left: 40px;
        box-sizing: border-box;
        &::placeholder {
          color: #cccc;
          font-family: "MicrosoftYaHeiUI";
        }
      }
    }
    .btn-login {
      margin: 100px auto;
      width: 331px;
      height: 42px;
      background: #0ce0ed;
      color: #fff;
      font-size: 22px;
      text-align: center;
      line-height: 44px;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn-disabed {
      background: #ccc;
    }
    .scan {
      width: 264px;
      height: 271px;
      margin: 29px auto 20px;
      /deep/img {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        box-shadow: 0 0 6px rgb(0, 0, 0, 0.04);
      }
    }
    .scan-tag {
      text-align: center;
      font-size: 20px;
      color: #333;
      font-family: MicrosoftYaHeiUI;
    }
  }
}
.sans {
  position: relative;
  .overtimeTip {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 264px;
    height: 271px;
    background-color: rgba(0, 0, 0, 0.5);
    p {
      font-size: 20px;
      font-weight: 900;
      color: #fff;
      line-height: 40px;
    }
  }
}
</style>

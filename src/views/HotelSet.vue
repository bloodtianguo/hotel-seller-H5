<template>
  <div class="p-container">
    <div class="container">
      <headertit :headertit="headertit" />
      <div class="content">
        <div class="title">酒店信息</div>
        <div class="item-b">
          <div>酒店名称：</div>
          <div>{{ hotelMsg.hotelName }}</div>
        </div>
        <div class="item-b">
          <div>酒店banner：</div>
          <div class="banner">
            <div v-for="(item, idx) in uploadUrl" :key="idx">
              <div
                class="upload imges"
                v-if="uploadUrl.length > 0 && uploadUrl[idx] != ''"
              >
                <img :src="item" alt="" />
                <i
                  class="el-icon-delete-solid delete"
                  @click="deleteHandle(idx)"
                ></i>
              </div>
            </div>
            <div class="upload upload-input" v-if="uploadUrl.length < 3">
              <span>+</span>
              <input
                ref="input"
                type="file"
                class="uploadpic"
                accept=".jpg,.jpeg,.bmp,.png"
                @change="picChange($event)"
              />
              <div class="input-tag">
                支持.jpg .jpeg .bmp .png格式照片，大小不超过5M
              </div>
            </div>
          </div>
        </div>
        <div class="item-b">
          <div>酒店认证：</div>
          <div>
            {{
              hotelMsg.status == 1
                ? "待认证"
                : hotelMsg.status == 2
                ? "已认证"
                : "认证失败"
            }}
          </div>
        </div>
        <div class="item-b">
          <div>酒店管理员：</div>
          <div>{{ hotelMsg.contactName }}</div>
        </div>

        <div class="title">预定设置</div>

        <div class="item-b">
          <div>可预订天数：</div>
          <div>
            <el-input
              class="input-day"
              size="small"
              placeholder="请输入可预订天数"
              v-model="hotelMsg.maxReservationDay"
              oninput="value=value.replace(/[^\d]/g, '')"
            ></el-input>
          </div>
        </div>
        <div class="item-b">
          <div>地址设置：</div>
          <div>{{ address + hotelMsg.hotelAddress }}</div>
        </div>
        <div class="item-b">
          <div>联系方式：</div>
          <div>{{ hotelMsg.contactPhone }}</div>
        </div>
        <div class="item-b">
          <div class="tinymce-title">服务说明：</div>
          <div>
            <my-tinymce
              :tinyvalue="hotelMsg.remark"
              @tinymceinput="gettinymceinput"
            ></my-tinymce>
            <div class="wordNum">已输入{{ text }}/500</div>
          </div>
        </div>
        <div class="item-b item-b-auch">
          <div>渠道商授权码：</div>
          <div>{{ hotelMsg.authCode }}</div>
          <div class="copyicon" @click="copy()">
            <svg
              t="1627357858374"
              class="icon"
              viewBox="0 0 1026 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2825"
              width="30"
              height="30"
            >
              <path
                d="M510.523099 1023.998298A510.523099 510.523099 0 0 1 149.540724 152.492824a510.523099 510.523099 0 1 1 721.96475 721.96475A507.204699 507.204699 0 0 1 510.523099 1023.998298zM249.858513 327.346986A37.183099 37.183099 0 0 0 212.717958 364.572628v409.567157a37.183099 37.183099 0 0 0 37.140555 37.140555H659.42567a37.225643 37.225643 0 0 0 37.183099-37.183099V364.572628a37.225643 37.225643 0 0 0-37.183099-37.183099zM417.480264 215.670058a74.536372 74.536372 0 0 0-74.451285 74.451285h353.409616a37.31073 37.31073 0 0 1 37.480904 37.055468v372.426601A74.536372 74.536372 0 0 0 808.32824 625.152127V290.121343A74.536372 74.536372 0 0 0 733.876955 215.670058z m204.719763 335.030784H287.169243V513.475199h335.030784v37.225643z m0-111.676928H287.169243v-37.225643h335.030784v37.183099z"
                fill="#1296db"
                p-id="2826"
              ></path>
            </svg>
          </div>
        </div>
        <div class="foot">
          <el-button plain class="cancle">取消</el-button>
          <el-button type="primary" plain class="ok" @click="saveHotel"
            >确定</el-button
          >
        </div>
      </div>
    </div>
    <input style="opacity: 0" id="demoInput" v-model="hotelMsg.authCode" />
  </div>
</template>

<script>
import { toFormData } from "../utils/tools/fdata";
import { uploadImg } from "../api/uploadData";
import { getMessage, updateHotel } from "../api/hotelSet";
import MyTinymce from "../components/MyTinymce.vue";
export default {
  components: {
    MyTinymce,
  },
  data() {
    return {
      headertit: "酒店设置",
      uploadUrl: [], //上传图片返回的url
      hotelMsg: {
        checkUserId: 0,
        cityCode: "",
        contactName: "",
        contactPhone: "",
        countyCode: "",
        createUserId: 0,
        hotelAddress: "",
        hotelBannerUrl: "",
        hotelName: "",
        id: 0,
        maxReservationDay: "",
        provinceCode: "",
        remark: "",
        status: 0,
        authCode: "",
      },
      address: "",
    };
  },
  mounted() {
    this.getHotel();
    // this.getAddress()
  },
  methods: {
    //点击复制授权码
    copy() {
      let input = document.querySelector("#demoInput");
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.Success("复制成功");
      }
    },
    // 图片上传
    picChange(e) {
      const input = e.target;
      const files = input.files;
      if (files && files[0]) {
        const file = files[0];
        let index = file.name.lastIndexOf(".");
        let isImage =
          ["image/png", "image/jpg", "image/jpeg", "image/bmp"].indexOf(
            file.type
          ) == -1;
        if (isImage) {
          this.$message.error("只支持上传.jpg .jpeg .bmp .png格式图片!");
          input.value = "";
          return false;
        }

        if (file.size > 1024 * 1024 * 5) {
          this.$message("文件大小不能超过5M");
          input.value = "";
          return;
        }
        const fdata = new FormData();
        fdata.append("file", file);
        uploadImg(fdata)
          .then(({ data }) => {
            if (data.code == 0) {
              input.value = "";
              this.uploadUrl.push(data.data);
              this.$message({
                message: "上传完成",
                type: "success",
              });
            } else {
              this.$message({
                message: data.msg,
                type: "warning",
              });
            }
          })
          .catch(() => {
            input.value = "";
          });
      }
    },
    // 获取酒店信息
    async getHotel() {
      let res = await getMessage();
      if (res.code == 0 && res.data != null) {
        const _that = this;
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
          "http://meizhao-public.oss-cn-chengdu.aliyuncs.com/city.js";
        document.getElementsByTagName("head")[0].appendChild(script);

        script.onload = () => {
          this.address = this.getAddress(
            areas,
            res.data.provinceCode,
            res.data.cityCode,
            res.data.countyCode
          );
          this.hotelMsg = res.data;
          if (
            typeof res.data.hotelBannerUrl == "string" &&
            res.data.hotelBannerUrl != ""
          ) {
            this.uploadUrl = res.data.hotelBannerUrl.split(",");
          }
          this.hotelMsg.remark = res.data.hotelDesc;
        };
      }
    },
    // 将城市编码换成地名
    getAddress(arr, provinceCode, cityCode, countyCode) {
      let address = "";
      arr.forEach((e) => {
        e.areaId == provinceCode && (address += e.areaName);
        if (cityCode && e.cities) {
          e.cities.forEach((e) => {
            e.areaId == cityCode && (address += e.areaName);
            if (countyCode && e.counties) {
              e.counties.forEach((e) => {
                e.areaId == countyCode && (address += e.areaName);
              });
            }
          });
        }
      });
      return address;
    },

    gettinymceinput(val) {
      this.hotelMsg.remark = val;

      // console.log(this.remark, "看实时变动的父组件获取的数据");
    },
    // 删除图片
    deleteHandle(idx) {
      this.uploadUrl.splice(idx, 1);
    },
    // 修改保存
    saveHotel() {
      let data = {
        hotelBannerUrl: this.uploadUrl.join(","),
        maxReservationDay: this.hotelMsg.maxReservationDay,
        remark: this.hotelMsg.remark,
      };

      let fdata = toFormData(data);

      this.$confirm("确认提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateHotel(fdata).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "提交完成!",
              });
              this.getHotel();
            } else {
              this.$message(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
  computed: {
    // 计算用户输入纯文字字数。
    text() {
      let t = this.hotelMsg.remark;
      t = t.replace(/<\/?.+?\/?>/g, "");
      t = t.replace(/(&nbsp;)/gi, "a");
      if (t.length > 500) {
        this.$message({
          message: "最多输入500字!",
          type: "warning",
        });
      }
      return t.length;
    },
  },
};
</script>

<style lang="less" scoped>
.p-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .container {
    padding: 0 20px;
    box-sizing: border-box;
    background-color: #f4f4f4;
  }
  .head {
    height: 100px;
    line-height: 100px;
    padding-left: 20px;
    background-color: #fff;
    color: #333;
  }
  .content {
    margin-top: 10px;
    background-color: #fff;
    padding: 30px 20px;
    .title {
      font-weight: 400;
      color: #222;
    }
    .item-b {
      display: flex;

      margin: 30px 0;
      & > div:nth-child(1) {
        width: 170px;
      }
      & > div {
        color: #666;
        font-size: 14px;
        .upload {
          position: relative;
          height: 100px;
          width: 150px;
          border: 1px solid #999;
          border-radius: 6px;
          .uploadpic {
            height: 100%;
            width: 100%;
            cursor: pointer;
            opacity: 0;
            z-index: 2;
          }
          span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            font-weight: 700;
          }
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 100%;
            max-height: 100%;
            background-color: #fff;
          }
        }
      }
      .input-day {
        position: relative;
        width: 300px;
        &::after {
          position: absolute;
          top: 8px;
          right: 8px;
          display: block;
          content: "天";
          height: 100%;
          color: #7f7f7f;
        }
      }
      .banner {
        display: flex;
        .imges {
          position: relative;
          margin: 0 5px;
          border: 1px dotted #999;
          cursor: pointer;
          .delete {
            position: absolute;
            top: 3px;
            right: 3px;
            font-size: 20px;
            opacity: 0;
            transition: 0.7s;
          }
          &:hover .delete {
            opacity: 1;
          }
        }
        .upload-input {
          position: relative;
          margin-bottom: 30px;
          .input-tag {
            position: absolute;
            bottom: -37px;
            left: 0;
            font-size: 10px;
            color: #aaaaaa;
          }
        }
      }
      .wordNum {
        text-align: right;
      }
    }
    .foot {
      display: flex;
      justify-content: space-around;
      width: 400px;
      margin: 0 auto;
      .el-button {
        width: 100px;
      }

      .ok {
        background-color: #7ecdf1;
        color: #fff;
      }
      .ok:hover {
        background-color: #5dbae6;
      }
    }
    ::v-deep .tox .tox-statusbar {
      display: none !important;
      background: pink;
    }
  }
}
.item-b-auch {
  display: flex;
  align-content: center;
  line-height: 30px;
  .copyicon {
    height: 1.5em;
    width: 1.5em;
    margin-left: 30px;
    cursor: pointer;
  }
}
</style>

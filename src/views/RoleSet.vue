<template>
  <div class="container">
    <headertit :headertit="headertit" />
    <div class="content">
      <div class="t-content">
        <el-button type="primary" @click="addAccountHandle"
          >新增子账号</el-button
        >
        <div class="table">
          <el-table
            :data="tableData"
            :row-class-name="tableRowClassName"
            :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
            height="500"
            border
            style="width: 100%"
          >
            <el-table-column prop="userName" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="phone" label="手机" align="center">
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="添加时间">
            </el-table-column>
            <el-table-column prop="" align="center" label="操作">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteHandle(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 新增子账号填写框 -->
        <div class="mark" v-show="isShow">
          <div class="head">
            新增子账号
            <i class="el-icon-close" @click="closeWindow"></i>
          </div>
          <div class="content">
            <div>
              <p>姓名：</p>
              <el-input
                v-model="userName"
                placeholder="请输入姓名"
                size="small"
              ></el-input>
            </div>
            <div class="form">
              <p>手机号：</p>
              <el-input
                v-model="phone"
                placeholder="请输入手机号码"
                size="small"
                :maxlength="11"
                @blur="validataPhone"
              ></el-input>
              <div class="tag" v-show="phoneTagIsShow">请输入合法手机号码</div>
            </div>
            <div class="validata">
              <p>手机验证码：</p>
              <el-input
                v-model="validata"
                placeholder="请输入验证码"
                size="small"
                :maxlength="10"
              ></el-input>
              <div
                class="t-validata"
                :class="{ 't-dva': timing }"
                @click="getPhoneValidata"
              >
                {{ timing ? time + "秒" : "获取验证码" }}
              </div>
            </div>
            <div class="t-btn">
              <el-button plain size="small" @click="closeWindow"
                >取消</el-button
              >
              <el-button type="primary" size="small" @click="submit"
                >确定</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  selectList,
  appendAccount,
  addAccount,
  deleteAccount,
} from "../api/roleSet";
export default {
  name: "roleSet",
  data() {
    return {
      headertit:"子账号设置",
      tableData: [],
      userName: "",
      phone: "",
      validata: "",
      isShow: false,
      time: 60,
      timing: undefined, // 保存定时器变量
      phoneTagIsShow: false,
    };
  },
  mounted() {
    this.getList();
  },
  computed: {},
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    },
    //获取列表
    getList() {
      selectList().then((res) => {
        if (res.code == 0) {
          this.tableData = res.data;
        }
      });
    },
    // 添加账号
    addAccountHandle() {
      this.isShow = true;
    },
    // 关闭新增弹窗
    closeWindow() {
      this.isShow = false;
      this.phoneTagIsShow = false;
      this.userName = "";
      this.phone = "";
      this.validata = "";
      clearInterval(this.timing);
      this.timing = undefined;
      this.time = 60;
    },
    // 获取手机验证码
    getPhoneValidata() {
      if (this.phoneTagIsShow || this.phone == "") return;
      // 如果定时器存在则不往下执行
      if (this.timing) return;

      appendAccount({ phone: this.phone })
        .then((res) => {
          if (res.code == -1) {
            this.$message(res.msg);
          }
          if (res.code == 0) {
            this.timing = setInterval(() => {
              this.time--;

              if (this.time == 0) {
                clearInterval(this.timing);
                this.timing = undefined;
                this.time = 60;
              }
            }, 1000);
          }
        })
        .catch(() => {
          this.$message("系统出错，请联系管理员");
        });
    },
    // 确认提交
    submit() {
      let params = {
        phone: this.phone,
        phoneSms: this.validata,
        userName: this.userName,
      };

      addAccount(params).then((res) => {
        if (res.code != 0) {
          this.$message(res.msg);
        } else {
          this.$message("添加成功！");
          this.getList();
          this.closeWindow();
        }
      });
    },
    // 删除子账号
    deleteHandle(val) {
      this.$confirm("是否删除该子账号，删除不可登录酒店后台！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteAccount({ id: val.id }).then((res) => {
            if (res.code == 0) {
              this.$message("删除成功");
              this.getList();
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
    // 验证手机号
    validataPhone() {
      const regPhone = /^(?:(?:\+|00)86)?1\d{10}$/;
      this.phoneTagIsShow = !regPhone.test(this.phone);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: calc(100% - 60px);
  width: 100%;
  overflow-y: auto;
  background-color: #f4f4f4;
  padding:0 20px;
  box-sizing: border-box;
  .content {
    .head {
      height: 100px;
      padding-left: 20px;
      margin-bottom: 20px;
      line-height: 100px;
      background: #fff;
      box-sizing: border-box;
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }
    .t-content {
      position: relative;
      background: #fff;
      padding: 20px;
      .table {
        padding-top: 30px;
        /deep/.t-head {
          background-color: #e4f6fe;
          color: #22b2f2;
        }
      }
      .mark {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
        z-index: 10;
        .head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          margin: 0;
          height: 45px;
          line-height: 45px;
          color: #666;
          font-size: 14px;
          background-color: #e4f6fe;
          i {
            font-size: 32px;
            cursor: pointer;
          }
        }
        .content {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: calc(100% - 65px);
          margin-top: 20px;
          & > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 25%;
            padding: 0 30px;
            p {
              width: 120px;
              font-size: 14px;
              color: #666;
            }
          }
          .form {
            position: relative;
            .tag {
              position: absolute;
              top: 48px;
              left: 130px;
              font-size: 11px;
              color: #f56c6c;
            }
          }
          .t-btn {
            margin: 0 auto;
            width: 200px;
          }
          .validata {
            position: relative;
            .t-validata {
              position: absolute;
              top: 18px;
              right: 36px;
              font-size: 14px;
              color: #00a1e9;
              cursor: pointer;
            }
            .t-dva {
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>

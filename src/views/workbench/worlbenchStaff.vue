<template>
  <div class="worlbenchStaff">
    <div v-if="isOrder" class="isOrder">
      <img src="@/assets/img/workbenchBoss/isroom.png" alt="" />
    </div>
    <div class="" v-else>
      <!-- 有单消息 -->
      <div class="hearder" v-if="orderData.messageType == 2">
        <div>
          <div class="right">
            <span>是否关闭语音提示功能</span>
            <my-switch class="switch" @click="voiceHandle"></my-switch>
          </div>
          <div class="reserveData">
            <span class="reserveData_title">接单倒计时：</span>
            <div class="reserveData_time_box">00</div>
            :
            <div class="reserveData_time_box">
              {{
                Math.floor(orderData.orderTime / 60) < 10
                  ? "0" + Math.floor(orderData.orderTime / 60)
                  : Math.floor(orderData.orderTime / 60)
              }}
            </div>
            :
            <div class="reserveData_time_box">
              {{
                orderData.orderTime % 60 < 10
                  ? "0" + (orderData.orderTime % 60)
                  : orderData.orderTime % 60
              }}
            </div>
            <div class="reserveData_copy" @click="copyBtn()">复制预订信息</div>
          </div>

          <div class="hotelData">
            <div class="hotelData_box">房型：{{ orderData.roomType }}</div>
            <div class="hotelData_box">
              价格(元)：<span class="colf5">{{ orderData.orderMoney }}</span>
            </div>
            <div class="hotelData_box">
              房间数：{{ orderData.orderRoomNumber }}
            </div>
            <div class="hotelData_box">
              预定时间：{{ orderData.startTimeStr }}至{{ orderData.endTimeStr }}
            </div>
          </div>
          <div class="hearderBtnList">
            <div class="hearderBtn" @click="refuseBtn(orderData)">拒绝</div>
            <div class="hearderBtn meetBtn" @click="agreeBtn(orderData)">
              接单
            </div>
          </div>
        </div>
      </div>
      <!-- 退单 -->
      <div class="hearder" v-if="orderData.messageType == 9">
        <div class="right">
          <span>是否关闭语音提示功能</span>
          <my-switch class="switch" @click="voiceHandle"></my-switch>
        </div>
        <div class="orderData">
          <div class="orderData_box">
            订单编号：{{ orderData.orderNo
            }}<span class="reserveData_copy" @click="copyBtn()">复制</span>
          </div>
          <div class="orderData_box">预定人：{{ orderData.reserveName }}</div>
          <div class="orderData_box">
            预留号码：{{ orderData.reservePhone }}
          </div>
        </div>
        <div class="hotelData cancelHotelData">
          <div class="hotelData_box">房型：{{ orderData.roomType }}</div>
          <div class="hotelData_box">
            价格(元)：<span class="colf5">{{ orderData.orderMoney }}</span>
          </div>
          <div class="hotelData_box">
            房间数：{{ orderData.orderRoomNumber }}
          </div>
          <div class="hotelData_box">
            预定时间：{{ orderData.startTimeStr }}至{{ orderData.endTimeStr }}
          </div>
        </div>
        <div class="hearderBtnList">
          <div class="hearderBtn cancelBtn" @click="cancelBtn">确定取消</div>
        </div>
      </div>
      <!-- 无数据展示 -->
      <div class="hearder" v-if="!orderData.messageType">
        <div class="right">
          <span>是否关闭语音提示功能</span>
          <my-switch class="switch" @click="voiceHandle"></my-switch>
        </div>
        <div class="reserveData">
          <span class="reserveData_title">预定倒计时：</span>
          <div class="reserveData_time_box">00</div>
          :
          <div class="reserveData_time_box">00</div>
          :
          <div class="reserveData_time_box">00</div>
          <div class="reserveData_copy">复制预订信息</div>
        </div>
        <div class="blank">
          <img src="@/assets/img/workbenchBoss/nothing.png" alt="" />
          <div class="span">暂无预定信息</div>
        </div>
      </div>

      <!-- 搜索区域 -->
      <div class="search-d">
        <el-input
          v-model="searchdata.reserveName"
          placeholder="请输入预定人"
          size="mini"
          clearable
        ></el-input>
        <el-input
          v-model="searchdata.orderNo"
          placeholder="请输入订单编号"
          size="mini"
          clearable
        ></el-input>
        <el-button type="primary" size="mini" @click="orderSearch"
          >搜索</el-button
        >
        <el-button size="mini" @click="reSearch">重置</el-button>
        <el-button size="mini" @click="export2excel">导出</el-button>
      </div>

      <!-- 表格区 -->
      <div class="tab_box">
        <el-table
          :data="tableData"
          ref="tableData"
          element-loading-text="数据加载中"
          border
          max-height="500"
          height="500"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column
            prop="orderNo"
            align="center"
            :resizable="false"
            label="订单编号"
            width="250"
            show-overflow-tooltip
          />
          <el-table-column
            prop="reserveName"
            align="center"
            :resizable="false"
            label="预定人"
            show-overflow-tooltip
          />
          <el-table-column
            prop="reservePhone"
            align="center"
            :resizable="false"
            label="联系方式"
            show-overflow-tooltip
          />
          <el-table-column
            prop="roomType"
            align="center"
            :resizable="false"
            label="房型"
            show-overflow-tooltip
          />
          <el-table-column
            prop="scheduledTime"
            align="center"
            :resizable="false"
            label="预定时间段"
            width="250"
            show-overflow-tooltip
          />
          <el-table-column
            prop="orderRoomNumber"
            align="center"
            :resizable="false"
            label="房间数"
            show-overflow-tooltip
          />
          <el-table-column
            prop="orderMoney"
            align="center"
            width="120"
            :resizable="false"
            label="订单总金额(元)"
          >
            <template slot-scope="scope">
              <span class="fonred">{{ scope.row.orderMoney }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            label="操作"
            width="230"
            :resizable="false"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="info"
                size="mini"
                @click="clickDetails(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="paging" style="margin-top: 30px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchdata.page"
          :page-sizes="[10, 20, 50, 100, 1000]"
          :page-size="searchdata.rows"
          background
          layout="prev,pager,next,total,sizes"
          :total="total"
        >
        </el-pagination>
      </div>
      <input style="opacity: 0" id="demoInput" v-model="orderData.orderNo" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { export_json_to_excel } from "../../utils/Export2Excel";
import MySwitch from "../../components/MySwitch.vue";
import { switchtypeFin } from "@/utils/tools/switchfin";
import {
  orderList,
  orderconfirm,
  orderreject,
  refundOrderById,
} from "@/api/order/ordermanage";
export default {
  name: "workbenchBoss",
  components: {
    MySwitch,
  },
  data() {
    return {
      voiceSwitch: false,
      tableData: [],
      searchdata: {
        page: 1,
        rows: 20,
        status: "", //订单状态
        reserveName: "", //预定人 搜索框
        orderNo: "", //订单编号 搜索框
      },
      total: 0,
      isMeet: false,
      confirmdata: {
        id: "",
      }, //订单审核数据
      multipleSelection: [],
      isOrder: false,
      // orderData: this.$store.state.orderData,
    };
  },
  mounted() {
    this.fetchData();
    this.orderTimeBtn();
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
    copyBtn() {
      let input = document.querySelector("#demoInput");
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
      }
    },
    agreeBtn(row) {
      this.confirmdata.id = row.id;
      this.orderagreeFun("是否同意该订单请求");
    },
    refuseBtn(row) {
      this.confirmdata.id = row.id;
      this.orderrejectFun("是否拒绝该订单请求");
    },
    // 确认取消订单
    cancelBtn() {
      this.$confirm("是否同意该订单退款！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let _this = this;
          this.subId = this.orderData.id;
          refundOrderById({ id: this.orderData.id }).then((response) => {
            if (response.code == "0") {
              if (_this.subId == _this.orderData.id) {
                _this.$store.commit("setOrderData", " ");
              }
              _this.Success("操作成功!");
            } else {
              _this.Warning(response.msg);
            }
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    voiceHandle() {
      this.voiceSwitch = !this.voiceSwitch;

      video.muted = false;
    },
    handleSizeChange(pageSize) {
      this.searchdata.rows = pageSize;
      this.fetchData();
    },
    handleCurrentChange(curPage) {
      this.searchdata.page = curPage;
      this.fetchData();
    },
    fetchData() {
      let _this = this;
      orderList(this.searchdata).then((response) => {
        if (response.code == "0") {
          _this.total = response.total;
          if (response.data.length == 0 && _this.orderData == "") {
            _this.isOrder = true;
          } else {
            _this.isOrder = false;
          }
          _this.tableData = response.data.map((item) => {
            if (item.startTime) {
              item.startTime = _this.changedatano(item.startTime);
            }
            if (item.endTime) {
              item.endTime = _this.changedatano(item.endTime);
            }
            if (item.startTime && item.endTime) {
              item.scheduledTime = `${item.startTime}到${item.endTime}`;
            } else {
              item.scheduledTime = "";
            }
            item.statu = switchtypeFin(item.status);
            item.shows = true;
            return item;
          });
        }
      });
    },
    //同意订单
    clickagree(row) {
      this.confirmdata.id = row.id;
      this.orderagreeFun("是否同意该订单请求");
    },
    // 订单审核封装
    orderagreeFun(text) {
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let _this = this;
          this.subId = this.confirmdata.id;
          orderconfirm(this.confirmdata).then((response) => {
            if (response.code == "0") {
              if (_this.subId == _this.orderData.id) {
                _this.$store.commit("setOrderData", " ");
              }
              _this.fetchData();
              _this.Success("操作成功!");
              _this.confirmdata.id = "";
            } else {
              _this.Warning(response.msg);
            }
          });
        })
        .catch(() => {
          this.Infos("已取消");
        });
    },
    //拒绝订单
    clickrefuse(row) {
      this.confirmdata.id = row.id;
      this.orderrejectFun("是否拒绝该订单请求");
    },
    orderrejectFun(text) {
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let _this = this;
          this.subId = this.confirmdata.id;
          orderreject(this.confirmdata).then((response) => {
            if (response.code == "0") {
              if (_this.subId == _this.orderData.id) {
                _this.$store.commit("setOrderData", " ");
              }
              _this.Success("操作成功!");
              _this.confirmdata.id = "";
            } else {
              _this.Warning(response.msg);
            }
          });
        })
        .catch(() => {
          this.Infos("已取消");
        });
    },
    // 点击详情
    clickDetails(row) {
      sessionStorage.orderid = row.id;
      this.$router.push("/order/orderdetails");
    },
    orderTimeBtn() {
      if (this.orderData.orderTime > 0) {
        this.orderData.orderTime -= 1;
        this.setorderTimeBtn = setTimeout(this.orderTimeBtn, 1000);
      } else {
        if (this.orderData.messageType == 2) {
          this.$store.commit("setOrderData", " ");
        }
        clearTimeout(this.setorderTimeBtn);
      }
    },
    //
    reSearch() {
      this.searchdata.reserveName = "";
      this.searchdata.orderNo = "";
    },
    // 订单搜索
    orderSearch() {
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 导出excel
    export2excel() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "没有选择导出内容",
          type: "warning",
        });
        return;
      }
      var tHeader = [
        "订单编号",
        "预定人",
        "联系方式",
        "房型",
        "预定时间段",
        "房间数",
        "订单状态",
      ];
      var filterVal = [
        "orderNo",
        "reserveName",
        "reservePhone",
        "roomType",
        "scheduledTime",
        "orderRoomNumber",
        "statu",
      ];
      let time = new Date();

      var filename = "订单列表" + moment(time).format("YYYY-MM-DD HH:mm:ss");
      var data = this.formatJson(filterVal, this.multipleSelection);
      export_json_to_excel({
        header: tHeader,
        data,
        filename,
      });
    },

    formatJson(filterVal, tableData) {
      return tableData.map((v) => {
        return filterVal.map((j) => {
          return v[j];
        });
      });
    },
  },
  computed: {
    orderData() {
      return this.$store.state.orderData;
    },
  },
  beforeDestroy() {
    clearTimeout(this.setorderTimeBtn);
  },
  watch: {
    "orderData.id": {
      handler(newValue) {
        if (this.orderData.messageType == 2) {
          this.isOrder = false;
          clearTimeout(this.setorderTimeBtn);
          this.orderTimeBtn();
        }
      },
      deep: true,
    },
  },
};
</script>

<style src="@/assets/css/worlbenchStaff.less" lang="less" scoped></style>
<style lang="less" scoped>
.hearder {
  .blank {
    margin-top: 105px;
    text-align: center;
    img {
      width: 395px;
      height: 356px;
    }
    .span {
      text-align: center;
      color: #999;
      font-size: 20px;
      font-family: MicrosoftYaHeiUI;
    }
  }
}
.search-d {
  display: flex;
  justify-content: space-around;
  width: 700px;
  margin-bottom: 10px;
  .el-input {
    width: 200px;
  }
}
.isOrder {
  img {
    width: 718px;
    height: 505px;
    margin: 0 auto;
    margin-top: 175px;
    display: block;
  }
}
.fonred {
  color: red;
}
::v-deep .el-table td,
.el-table th {
  padding: 5px 0;
}
</style>

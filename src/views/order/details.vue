<template>
  <div class="app-container">
    <!-- 订单详情 -->
    <div class="cardtype-box">
      <div class="box-card-type">订单详情:
      <span v-if="orderType != '待入住'">{{ orderType }}</span>
        <span v-else>待入住</span>
       </div>
      <div class="box-card-btn" @click="clickreturn()">返回</div>
    </div>
    <div class="detailmain">
      <div class="detailmain-header">
        <div><span>订单编号:</span>{{ order.orderNo }}</div>
        <div class="detailmain-btn-box">
          <el-button
            size="mini"
            type="success"
              plain
            v-if="orderType == '待确定'"
            @click="clickagree()"
            >同意</el-button
          >
          <el-button
            size="mini"
            v-if="orderType == '待确定'"
             type="warning"
            @click="clickrefuse()"
            >拒单</el-button
          >
          <el-button
            size="mini"
            v-if="orderType == '待入住'"
             type="success"
            @click="clickin()"
            >确认入住</el-button
          >
          <el-button
            size="mini"
            v-if="orderType == '已入住'"
             type="danger"
            @click="clickout()"
            >离店</el-button
          >
          <el-button
            size="mini"
            v-if="orderType == '待取消'"
             type="primary"
            @click="clickcancel()"
            >确定取消</el-button
          >
          <el-button
            size="mini"
            v-if="orderType == '待退款'"
            type="success"
            plain
            @click="refuseOK()"
            >同意退款</el-button
          >
          <el-button
            size="mini"
            v-if="orderType == '待退款'"
             type="warning"
            @click="refuseNo()"
            >拒绝退款</el-button
          >
        </div>
      </div>
      <!-- 入住信息 -->
      <div class="detail-info">
        <div class="title">入住信息</div>
        <el-table
          :data="infoData"
          ref="infoData"
          border
          style="margin-left:10px"
        >
          <el-table-column
            :prop="lable.pro"
            align="center"
            :resizable="false"
            :label="lable.labels"
            v-for="lable in tablist"
            :key="lable.pro"
          />
        </el-table>
      </div>
      <!-- 订单信息 -->
      <div class="detail-info">
        <div class="title">订单信息</div>
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>预定人</td>
            <td>用户ID</td>
            <td>联系方式</td>
            <td>酒店名称</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.reserveName }}</td>
            <td class="fon12">{{ order.buyerUserId }}</td>
            <td class="fon12">{{ order.reservePhone }}</td>
            <td class="fon12">{{ order.hotelName }}</td>
          </tr>
        <tbody  v-if="orderType=='待支付'||orderType=='待确定'||orderType=='待入住'||orderType=='已入住'||orderType=='已完成'">
          <tr>
            <td>房型</td>
            <td>房间数</td>
            <td>预定时间段</td>
            <td>预定天数</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.roomType }}</td>
            <td class="fon12">{{ order.orderRoomNumber }}</td>
            <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
            <td class="fon12">{{ order.dayNumber }}</td>
          </tr>
          <tr>
            <td>单价(元)</td>
            <td>订单总金额(元)</td>
            <td>支付方式</td>
            <td>入住时间</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.roomSalePrice }}</td>
            <td class="fon12">{{ order.orderMoney }}</td>
            <td class="fon12">{{ order.payTypes }}</td>
            <td class="fon12">{{ order.occupancyTime }}</td>
          </tr>
          <tr>
            <td>离店时间</td>
            <td></td><td></td><td></td>
          </tr>
          <tr>
            <td class="fon12">{{ order.finishTime }}</td>
            <td></td><td></td><td></td>
          </tr>
        </tbody>
        <tbody  v-if="orderType=='待取消'">
         <tr>
            <td>房型</td>
            <td>房间数</td>
            <td>预定时间段</td>
            <td>预定天数</td>
          </tr>
         <tr>
            <td class="fon12">{{ order.roomType }}</td>
            <td class="fon12">{{ order.orderRoomNumber }}</td>
            <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
            <td class="fon12">{{ order.dayNumber }}</td>
          </tr>
           <tr>
            <td>单价(元)</td>
            <td>订单总金额(元)</td>
            <td>退款金额(元)</td>
            <td>支付方式</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.roomSalePrice }}</td>
            <td class="fon12">{{ order.orderMoney }}</td>
            <td class="fon12">{{ order.orderMoney }}</td>
            <td class="fon12">{{ order.payTypes }}</td>
          </tr>
          <tr>
            <td>入住时间</td>
            <td>离店时间</td>
            <td>取消时间</td>
            <td></td>
          </tr>
          <tr>
            <td class="fon12">{{ order.occupancyTime }}</td>
            <td class="fon12">{{ order.finishTime }}</td>
            <td class="fon12">{{ order.cancelOrderTime }}</td>
            <td class="fon12"></td>
          </tr>
        </tbody>
        <tbody v-if="orderType=='取消中'">
          <tr>
            <td>房型</td>
            <td>房间数</td>
            <td>预定时间段</td>
            <td>预定天数</td>
          </tr>
         <tr>
            <td class="fon12">{{ order.roomType }}</td>
            <td class="fon12">{{ order.orderRoomNumber }}</td>
            <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
            <td class="fon12">{{ order.dayNumber }}</td>
          </tr>
         <tr>
            <td>单价(元)</td>
            <td>订单总金额(元)</td>
            <td>支付方式</td>
            <td>入住时间</td>
          </tr>
         <tr>
            <td class="fon12">{{ order.roomSalePrice }}</td>
            <td class="fon12">{{ order.orderMoney }}</td>
            <td class="fon12">{{ order.payTypes }}</td>
            <td class="fon12">{{ order.occupancyTime }}</td>
          </tr>
         <tr>
            <td>离店时间</td>
            <td>取消时间</td>
            <td>确认取消时间</td>
            <td></td>
          </tr>
         <tr>
            <td class="fon12">{{ order.finishTime }}</td>
            <td class="fon12">{{ order.cancelOrderTime }}</td>
            <td class="fon12">{{order.confirmCancelOrderTime}}</td>
            <td class="fon12"></td>
          </tr>
        </tbody>
        <tbody  v-if="orderType=='已取消'">
          <tr>
            <td>房型</td>
            <td>房间数</td>
            <td>预定时间段</td>
            <td>预定天数</td>
          </tr>
         <tr>
            <td class="fon12">{{ order.roomType }}</td>
            <td class="fon12">{{ order.orderRoomNumber }}</td>
            <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
            <td class="fon12">{{ order.dayNumber }}</td>
          </tr>
           <tr>
            <td>单价(元)</td>
            <td>订单总金额(元)</td>
            <td>退款金额(元)</td>
            <td>支付方式</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.roomSalePrice }}</td>
            <td class="fon12">{{ order.orderMoney }}</td>
            <td class="fon12">{{ order.orderMoney }}</td>
            <td class="fon12">{{ order.payTypes }}</td>
          </tr>
          <tr>
            <td>入住时间</td>
            <td>离店时间</td>
            <td>发起取消时间</td>
            <td>确认取消时间</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.occupancyTime }}</td>
            <td class="fon12">{{ order.finishTime }}</td>
            <td class="fon12">{{order.startCancelOrderTime}}</td>
            <td class="fon12">{{order.confirmCancelOrderTime}}</td>
          </tr>
          <tr>
            <td>取消时间</td>
            <td></td><td></td><td></td>
          </tr>
          <tr>
            <td class="fon12">{{ order.cancelOrderTime }}</td>
            <td></td><td></td><td></td>
          </tr>
        </tbody>
        <tbody v-if="orderType=='待退款'||orderType=='退款中'||orderType=='已退款'">
          <tr>
            <td>酒店名称</td>
            <td>房型</td>
            <td>房间数</td>
            <td>预定时间段</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.hotelName }}</td>
            <td class="fon12">{{ order.roomType }}</td>
            <td class="fon12">{{ order.orderRoomNumber }}</td>
            <td class="fon12">{{ order.startTime }}到{{ order.endTime }}</td>
          </tr>
          <tr>
            <td>预定天数</td>
            <td>单价(元)</td>
            <td>订单总金额(元)</td>
            <td>退款金额(元)</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.dayNumber }}</td>
            <td class="fon12">{{ order.roomSalePrice }}</td>
            <td class="fon12">{{ order.orderMoney }}</td>
            <td class="fon12">{{ order.orderMoney }}</td>
          </tr>
           <tr>
            <td>支付方式</td>
            <td>入住时间</td>
            <td>离店时间</td>
            <td>退款原因</td>
          </tr>
          <tr>
            <td class="fon12">{{ order.payTypes }}</td>
            <td class="fon12">{{ order.occupancyTime }}</td>
            <td class="fon12">{{ order.finishTime }}</td>
            <td class="fon12">{{ order.remark }}</td>
          </tr>
           <tr>
            <td>发起退款时间</td>
            <td>同意退款时间</td>
            <td>实际退款时间</td>
            <td></td>
          </tr>
          <tr>
            <td class="fon12">{{ order.startRefundTime }}</td>
            <td class="fon12">{{ order.confirmRefundTime }}</td>
            <td class="fon12">{{ order.refundTime }}</td>
            <td></td>
          </tr>
        </tbody>
        </table>
      </div>
<!-- 地址信息 -->
      <div class="detail-info">
        <div class="title">地址信息：</div>
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>收货人</td>
            <td>手机号</td>
            <td>所在地区</td>
            <td>详细地址</td>
          </tr>
          <tr>
            <td class="fon12">{{addressData.userName||"--"}}</td>
            <td class="fon12">{{addressData.phone||"--"}}</td>
            <td class="fon12">{{addressData.address||"--"}}</td>
            <td class="fon12">{{addressData.addressInfo||"--"}}</td>
          </tr>
        </table>
      </div>
<!-- 礼包信息 -->
      <div class="detail-info">
        <div class="title">礼包信息：</div>
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>礼包名称</td>
            <td>副标题</td>
            <td>图片</td>
          </tr>
          <tr>
            <td class="fon12">{{order.spreeName||"--"}}</td>
            <td class="fon12">{{order.spreeTitle||"--"}}</td>
            <td>
               <img
               v-if="order.spreeIcon"
                style="width: 50px; height: 50px;margin-top:10px"
                :src="order.spreeIcon"
                fit="cover"
              >
              <p v-else style="text-align:center">暂无</p>
            </td>
          </tr>
        </table>
      </div>
<!-- 操作信息 -->
      <div class="detail-info">
        <div class="title">操作信息</div>
        <el-table
          :data="Operation"
          ref="Operation"
          border
          style="margin-left:10px"
        >
          <el-table-column
            :prop="lable.pro"
            align="center"
            :resizable="false"
            :label="lable.labels"
            v-for="lable in tablistoper"
            :key="lable.pro"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  orderdetail,
  refundOrderById,
  agreeToaRefund,
  refuseFefundOrder,
} from "@/api/order/ordermanage";
import { switchtypeFin } from "@/utils/tools/switchfin";
import {
  orderconfirm,
  orderreject,
  orderocc,
  orderout,
} from "@/api/order/ordermanage";
export default {
  created() {
    if (sessionStorage.getItem("orderid")) {
      this.searchdata.id = sessionStorage.getItem("orderid");
    }
    this.fetchData();
  },
  data() {
    return {
      orderType: "待支付",
      tablist: [
        { pro: "occupancyName", labels: "入住姓名" },
        { pro: "occupancyPhone", labels: "预留电话" },
      ],
      tablistoper: [
        { pro: "operation", labels: "操作者" },
        { pro: "createTime", labels: "操作时间" },
        { pro: "orderStatu", labels: "订单状态" },
        { pro: "remark", labels: "备注" },
      ],
      searchdata: {
        id: "",
        pass: "",
      },
      addressData:{},
      order: {},
      Operation: [],
      infoData: [],
    };
  },
  methods: {
    //同意订单
    clickagree() {
      this.$confirm("是否同意该订单请求！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          orderconfirm(this.searchdata).then((response) => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    //拒绝订单
    clickrefuse() {
      this.$confirm("是否拒绝该订单请求！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          orderreject(this.searchdata).then((response) => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    //离店
    clickout() {
      this.$confirm("是否确定该客户已离店！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          orderout(this.searchdata).then((response) => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    //确认入住
    clickin() {
      orderocc(this.searchdata).then((response) => {
        if (response.code == "0") {
          this.Success("操作成功!");
          this.fetchData();
        }
      });
    },
    //确认取消
    clickcancel() {
      this.$confirm("是否确认取消！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          refundOrderById(this.searchdata).then((response) => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.occdata.id = "";
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    refuseOK() {
      this.$confirm("是否同意该退款请求！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          agreeToaRefund(this.searchdata).then((response) => {
            if (response.code == 0) {
              this.Success("操作成功!");
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    // 拒绝退款
    refuseNo() {
      this.$confirm("是否拒绝该退款请求！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          refuseFefundOrder(this.searchdata).then((response) => {
            if (response.code == 0) {
              this.Success("操作成功!");
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    fetchData() {
      let _this = this;
      orderdetail(this.searchdata).then((response) => {
        if (response.code == "0") {
          _this.order = response.data;
          if (_this.order.payType == 1) {
            _this.order.payTypes = "支付宝";
          } else if (_this.order.payType == 2) {
            _this.order.payTypes = "微信";
          } else {
            _this.order.payTypes = "";
          }

          _this.order.startTime = _this.changedatano(_this.order.startTime);
          _this.order.endTime = _this.changedatano(_this.order.endTime);
          if(_this.order.occupancyTime){
            _this.order.occupancyTime = _this.changedata(_this.order.occupancyTime);
          }
             if(_this.order.finishTime){
            _this.order.finishTime = _this.changedata(_this.order.finishTime);
          }
          // _this.order.endTime = _this.changedata(_this.order.endTime);
          _this.infoData = response.data.occupancyInfos;
          if(response.data.shippingAddress){
          _this.addressData=JSON.parse(response.data.shippingAddress)
          }
          _this.orderType = switchtypeFin(_this.order.status);
          _this.Operation = response.data.orderOperation.map((item) => {
            item.orderStatu = switchtypeFin(item.orderStatus);
            return item;
          });
        }
      });
    },
    clickreturn() {
      sessionStorage.removeItem("orderid");
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.fon12 {
  font-size: 12px;
}
.app-container {
  height: auto;
  color: #4d4f53;
}
::v-deep .el-table td,
.el-table th {
  padding: 5px 0;
}
.title {
  font-weight: 400;
  line-height: 50px;
}
.app-container {
  background-color: #fbfcfe;
}
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
    //span {
      //font-size: 20px;
      //font-weight: 700;
      //color: #333;
    //}
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
.detailmain {
  height: calc(100% - 80px);
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  .detailmain-header {
    line-height: 50px;
    border-bottom: 2px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    .detailmain-btn-box {
      padding-right: 20px;
    }
  }
  .detail-info {
    width: 100%;
    padding-top: 20px;
    table {
      width: 100%;
      height: 90px;
      margin-left: 10px;
    }
    td {
      width: 150px;
      line-height: 30px;
      height: 30px;
      tr {
        text-align: center;
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
}
.vtable {
  border-spacing: 0;
  border-collapse: collapse;
  td {
    width: 250px;
    border: 1px solid #eeeef0;
    line-height: 30px;
    text-align: center;
  }
}
</style>

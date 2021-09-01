<template>
  <div class="workbenchBoss">
    <div class="kanban">
      <h3>数据概况</h3>
      <div class="right">
        <span>是否关闭语音提示功能</span>
        <my-switch class="switch" @click="voiceHandle"></my-switch>
      </div>
      <div class="item">
        <div class="item-flex">
          <div class="item-flex_img_title">
            <img src="@/assets/img/workbenchBoss/shouru.png" />
            <div class="item-flex_title">今日总收入</div>
          </div>
          <div class="item-flex_num">
            {{ toDayCountMoney == null ? 0 : toDayCountMoney }}
          </div>
        </div>
        <div class="item-flex">
          <div class="item-flex_img_title">
            <img src="@/assets/img/workbenchBoss/dingdanshu.png" />
            <div class="item-flex_title">今日订单数</div>
          </div>
          <div class="item-flex_num">{{ toDayCountOrder }}</div>
        </div>
        <div class="item-flex">
          <div class="item-flex_img_title">
            <img src="@/assets/img/workbenchBoss/shouru.png" />
            <div class="item-flex_title">昨日总收入</div>
          </div>
          <div class="item-flex_num">
            {{ yesterdayCountMoney == null ? 0 : yesterdayCountMoney }}
          </div>
        </div>
        <div class="item-flex">
          <div class="item-flex_img_title">
            <img src="@/assets/img/workbenchBoss/dingdanshu.png" />
            <div class="item-flex_title">昨日订单数</div>
          </div>
          <div class="item-flex_num">{{ yesterdayCountOrder }}</div>
        </div>
        <div class="item-flex">
          <div class="item-flex_img_title">
            <img src="@/assets/img/workbenchBoss/weishenhe.png" />
            <div class="item-flex_title">未审核房间数</div>
          </div>
          <div class="item-flex_num">{{ roomCount }}</div>
        </div>
      </div>
    </div>
    <div class="tab_box">
      <el-table
        :data="tableData"
        ref="tableData"
        element-loading-text="数据加载中"
        border
        max-height="500"
        height="500"
        :row-class-name="tableRowClassName"
        :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          prop="orderNo"
          align="center"
          :resizable="false"
          label="订单编号"
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
          show-overflow-tooltip
        />
        <el-table-column
          prop="orderRoomNumber"
          align="center"
          :resizable="false"
          width="80"
          label="房间数"
          show-overflow-tooltip
        />
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
              type="success"
              plain
              size="mini"
              @click="clickagree(scope.row)"
              >同意</el-button
            >
            <el-button size="mini"  type="warning" @click="clickrefuse(scope.row)"
              >拒绝</el-button
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
  </div>
</template>

<script>
import MySwitch from "../../components/MySwitch.vue";
import { switchtypeFin } from "@/utils/tools/switchfin";
import {
  orderList,
  orderconfirm,
  orderreject,
  getOrderCountByUserId,
} from "@/api/order/ordermanage";
export default {
  name: "workbenchBoss",
  components: {
    MySwitch,
  },
  data() {
    return {
      voiceSwitch: true,
      tableData: [],
      searchdata: {
        page: 1,
        rows: 20,
        status: 2, //订单状态
      },
      total: 0,
      roomCount: 0,
      toDayCountMoney: 0,
      toDayCountOrder: 0,
      yesterdayCountMoney: 0,
      yesterdayCountOrder: 0,
      confirmdata: {
        id: "",
      }, //订单审核数据
    };
  },
  mounted() {
    this.fetchData();
    this.getData();
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
    voiceHandle() {
      this.voiceSwitch = !this.voiceSwitch;
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
      orderList(this.searchdata).then((response) => {
        if (response.code == "0") {
          this.total = response.total;
          this.tableData = response.data.map((item) => {
            if (item.startTime) {
              item.startTime = this.changedatano(item.startTime);
            }
            if (item.endTime) {
              item.endTime = this.changedatano(item.endTime);
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
          orderconfirm(this.confirmdata).then((response) => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.fetchData();
              this.confirmdata.id = "";
            }
          });
        })
        .catch(() => {});
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
          orderreject(this.confirmdata).then((response) => {
            if (response.code == "0") {
              this.Success("操作成功!");
              this.confirmdata.id = "";
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    getData() {
      getOrderCountByUserId().then((response) => {
        if (response.code == "0") {
          this.roomCount = response.data.roomCount;
          this.toDayCountMoney = response.data.toDayCountMoney;
          this.toDayCountOrder = response.data.toDayCountOrder;
          this.yesterdayCountMoney = response.data.yesterdayCountMoney;
          this.yesterdayCountOrder = response.data.yesterdayCountOrder;
        }
      });
    },
  },
};
</script>

<style src="@/assets/css/workbenchBoss.less" lang="less" scoped></style>

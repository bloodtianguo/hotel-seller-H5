<template>
  <div class="container">
    <headertit :headertit="headertit" />
    <div class="head">
      <!-- <h3 class="title">房间列表</h3> -->
      <div class="line"></div>
      <div class="hote-type clearfix">
        <div>房型:</div>
        <my-head-select
          :itemArr="hotelType"
          ref="hotelType"
          @selectHandle="getHotelType"
        ></my-head-select>
      </div>
      <div class="hote-type clearfix two">
        <div>状态:</div>
        <my-head-select
          :itemArr="hotelStatus"
          ref="hotelStatus"
          @selectHandle="getHotelStatus"
        ></my-head-select>
      </div>
      <div class="search">
         <el-form
          size="normal"
          :inline="true"
          label-position="left"
        >
          <el-form-item
            label-width="95px"
            style="margin-right:20px"
          >
            <el-input
          v-model="search"
          placeholder="请输入房间名称"
          size="mini"
          clearable
          @clear="getRoom()"
        ></el-input>
          </el-form-item>
          <el-form-item>
           <el-button type="primary" @click="getRoom" size="mini">搜索</el-button>
        <el-button @click="resetSearch" size="mini"
          >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="content">
      <div class="button-area">
        <el-button size="mini" @click="goAddRoom">新增房间</el-button>
        <el-button
          size="mini"
          @click="setRoomType(multipleSelection, 1, '批量上架')"
          >批量上架</el-button
        >
        <el-button
          size="mini"
          @click="setRoomType(multipleSelection, 2, '批量下架')"
          >批量下架</el-button
        >
        <!-- <el-button plain size="small">设置排序码</el-button> -->
        <el-button size="mini" @click="export2excel">导出</el-button>
      </div>
      <!-- 表格区域 -->
      <div class="table-area">
        <el-table
          :data="tableData"
          style="margin:20px 0;"
          height="510"
          ref="multipleTable"
          v-loading="loading"
          :row-style="{ height: '40px' }"
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55"/>
          <el-table-column align="center" prop="roomName" label="房间名称" width="140" show-overflow-tooltip/>
          <el-table-column align="center" label="房间视频" width="120">
            <template slot-scope="scope">
              <!-- {{scope.row.roomVideoUrl}} -->
              <img
                class="videoImg"
                src="../../assets/img/room/video.png"
                @click="playVideo(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="roomType"
            label="房型"
            width="120"
          />
          <el-table-column
            align="center"
            prop="roomPrice"
            label="销售价(元)"
            width="120"
          />
          <el-table-column
            prop="roomSalePrice"
            label="优惠价(元)"
            width="120"
            align="center"
          />
          <el-table-column
            align="center"
            prop="Status"
            label="状态"
            width="150"
          />
          <el-table-column
            align="center"
            prop="roomNumber"
            label="房间数"
            width="120"
          />
          <el-table-column
            align="center"
            prop="saleVolume"
            label="销量"
            width="120"
          />
          <el-table-column align="center" prop="sort" label="排序" width="100"/>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="400"
          >
            <template slot-scope="scope">
              <div class="my-button">
                <el-button
                  @click.native.prevent="goRoomDetails(scope.$index, scope.row)"
                  type="info"
                  size="mini"
                >
                  详情
                </el-button>
                <el-button
                  v-if="
                    scope.row.checkStatus != 4 && scope.row.checkStatus != 3
                  "
                  type="primary"
                  size="mini"
                  @click="goEdit(scope.row, '编辑')"
                  >编辑</el-button
                >
                <el-button
                  v-if="
                    scope.row.checkStatus == 3 || scope.row.checkStatus == 4
                  "
                  type="success"
                  plain
                  size="mini"
                  @click="goEdit(scope.row, '重新提交')"
                  >重新提交</el-button
                >
                <el-button
                  v-if="scope.row.checkStatus == 2 && scope.row.status == 2"
                  type="primary"
                  size="mini"
                  @click="setRoomType([scope.row], 1, '上架')"
                  >上架</el-button
                >
                <el-button
                  v-if="scope.row.checkStatus == 2 && scope.row.status == 1"
                  type="danger"
                  size="mini"
                  @click="setRoomType([scope.row], 2, '下架')"
                  >下架</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  v-if="scope.row.spreeNum == 0 && scope.row.checkStatus == 2"
                  @click="openGift(scope.row)"
                  >绑定礼包</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  v-if="scope.row.spreeNum > 0 && scope.row.checkStatus == 2"
                  @click="editbind(scope.row)"
                  >编辑礼包</el-button
                >
                <el-button
                  type="success"
                  size="mini"
                  v-if="
                    scope.row.spreeNum > 0 &&
                      scope.row.showStatus == 2 &&
                      scope.row.checkStatus == 2
                  "
                  @click="changeshow(scope.row, 1)"
                  >展示礼包</el-button
                >
                <el-button
                  type="success"
                  size="mini"
                  v-if="
                    scope.row.spreeNum > 0 &&
                      scope.row.showStatus == 1 &&
                      scope.row.checkStatus == 2
                  "
                  @click="changeshow(scope.row, 2)"
                  >展示酒店</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>

        <play-video
          ref="videobox"
          :videoUrl="videoUrl"
          :vTitle="videoTitel"
        ></play-video>
        <!-- 分页 @closePlay="offHandle"-->
        <el-pagination
          background
          layout="prev,pager,next,total,sizes"
          :total="total"
          :page-size="params.limit"
          :current-page="params.page"
          @current-change="currentChange($event)"
          @size-change="sizeChange($event)"
        ></el-pagination>
        <!-- 绑定礼包弹窗 -->

        <el-dialog
          title="绑定礼包"
          :visible.sync="giftshow"
          width="40%"
          :close-on-click-modal="false"
          @closed="bindclosed()"
          :before-close="handleClose"
        >
           <!-- 礼包搜索 -->
            <el-form :model="giftsearchForm" ref="giftsearchForm" inline id="giftsearch">
              <el-form-item prop="spreeName">
                <el-input
                  size="mini"
                  placeholder="请输入礼包名称"
                  v-model="giftsearchForm.spreeName"
                  clearable
                  @clear="searchgift()"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="searchgift()"
                  >搜索</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="disbind"
                  @click="bind(giftSelection)"
                  >绑定</el-button
                >
              </el-form-item>
            </el-form>
          <div class="gift_box">
            <!-- 礼包列表 -->
            <el-table
              ref="giftData"
              :data="giftData"
              tooltip-effect="dark"
              style="width: 100%"
              size="mini"
              @selection-change="giftSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
              ></el-table-column>
              <el-table-column
                label="礼包名称"
                prop="spreeName"
                width="120"
                align="center"
              />
              <el-table-column
                prop="spreeTitle"
                label="副标题"
                align="center"
              />
              <el-table-column prop="spreeIcon" label="图片" align="center">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.spreeIcon"
                    style="width:50px;height:50px"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="updateTime"
                label="最后修改时间"
                align="center"
              />
            </el-table>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { export_json_to_excel } from "@/utils/Export2Excel";
import MyHeadSelect from "@/components/MyHeadSelect.vue";
import PlayVideo from "@/components/PlayVideo.vue";
import { getRoomList, batchOperate } from "@/api/room";
import {
  getbindgiftList,
  getbindgift,
  spreeBinding,
  showInfo,
} from "@/api/gift/gift";
export default {
  components: {
    MyHeadSelect,
    PlayVideo,
  },
  data() {
    return {
      headertit: "房间列表",
      loading: true,
      giftsearchForm: {
        roomId: "",
        spreeName: "", //礼包名称
      }, //搜索礼包
      disbind: true, //是否可以点击绑定
      giftData: [], //礼包数组
      giftSelection: [], //被勾选的礼包
      giftshow: false, //绑定礼包弹窗是否显示
      hotelTypeValue: "全部", // 房型
      hotelStatusValue: 0, // 状态  status:1 上架  status:2 下架 / 审核状态   checkStatus:1 -待审核，2-审核通过，checkStatus:3-审核失败，checkStatus:4-违规下级
      search: "", // 根据房间名查找
      tableData: [],
      multipleSelection: [],
      beforechecking: [], //礼包勾选前数据
      videoUrl: "",
      videoTitel: "",
      total: 0,
      params: {
        current: 1,
        limit: 10,
      },
      showinfodata: {
        roomId: "",
        showStatus: "",
      },
    };
  },
  created() {
    if(sessionStorage.getItem("room")){
      sessionStorage.removeItem('room')
    }
    this.hotelType = [
      {
        title: "全部",
        value: 0,
      },
      {
        title: "大床房",
        value: 1,
      },
      {
        title: "双床房",
        value: 2,
      },
      {
        title: "三床房",
        value: 3,
      },
      {
        title: "套房",
        value: 4,
      },
    ];
    this.hotelStatus = [
      {
        title: "全部",
        value: 0,
      },
      {
        title: "上架",
        value: {
          status: 1,
        },
      },
      {
        title: "下架",
        value: {
          status: 2,
        },
      },
      {
        title: "审核中",
        value: {
          checkStatus: 1,
        },
      },
      {
        title: "审核失败",
        value: {
          checkStatus: 3,
        },
      },
      {
        title: "违规下架",
        value: {
          checkStatus: 4,
        },
      },
    ];
    this.getRoom();
  },
  mounted() {},
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    },
    //改变展示
    changeshow(row, num) {
      this.showinfodata.roomId = row.id;
      this.showinfodata.showStatus = num;
      showInfo(this.showinfodata).then((response) => {
        if (response.code == 0) {
          this.getRoom();
          this.showinfodata.roomId = "";
          this.showinfodata.showStatus = "";
        }
      });
    },
    // 礼包搜索
    searchgift() {
      getbindgiftList(this.giftsearchForm).then((response) => {
        if (response.code == 0 && response.data) {
          this.giftData = response.data;
        }
      });
    },
    //点击编辑礼包
    async editbind(row) {
      await this.openGift(row); //加载礼包列表
      this.$nextTick(() => {
        getbindgift(this.giftsearchForm).then((response) => {
          if (response.code == 0) {
            response.data.map((item) => {
              this.giftData.map((items) => {
                if (item == items.id) {
                  this.$refs.giftData.toggleRowSelection(items);
                  this.$forceUpdate();
                }
              });
            });
          }
        });
      });
    },

    //打开绑定礼包弹窗
    async openGift(row) {
      this.giftsearchForm.roomId = row.id;
      await this.searchgift(); //加载礼包列表
      this.giftshow = true;
    },
    handleClose() {
      this.giftshow = false;
    },
    // 勾选礼品
    giftSelectionChange(val) {
      this.giftSelection = val;
    },
    bindclosed() {
      this.getRoom();
    },
    // 绑定礼包
    bind(data) {
      if (this.giftSelection.length < 1) {
        this.Warning("请选择礼包");
        return false;
      }
      let ids = [];
      data.forEach((e) => {
        ids.push(e.id);
      });
      let params = {
        ids: ids.join(","),
        roomId: this.giftsearchForm.roomId,
      };
      spreeBinding(params).then((res) => {
        if (res.code == 0) {
          this.Success("操作成功!");
          this.giftshow = false;
          this.getRoom();
        }
      });
    },
    /*-----------------------------------------------------*/
    goAddRoom() {
      this.$router.push({ name: "addRoom", query: { tag: "新增" } });
    },
    getHotelType(val) {
      this.hotelTypeValue = this.hotelType.filter(
        (i) => i.value == val
      )[0].title;
      this.getRoom();
    },
    getHotelStatus(val) {
      this.hotelStatusValue = val;
      this.getRoom();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 重置搜索条件
    resetSearch() {
      this.hotelTypeValue = "全部";
      this.hotelStatusValue = 0;
      this.search = "";
      this.$refs.hotelType.resetHandle();
      this.$refs.hotelStatus.resetHandle();
    },
    // 查询
    getRoom() {
      let data = {
        page: this.params.current,
        rows: this.params.limit,
      };
      if (this.hotelStatusValue != 0) {
        if (this.hotelStatusValue.status) {
          data.status = this.hotelStatusValue.status;
          data.checkStatus = 2;
        }
        if (this.hotelStatusValue.checkStatus) {
          data.checkStatus = this.hotelStatusValue.checkStatus;
        }
      }

      this.search != "" && (data.roomName = this.search);
      this.hotelTypeValue != "全部" && (data.roomType = this.hotelTypeValue);
      (this.loading = true),
        getRoomList(data).then((res) => {
          if (res.code == 0) {
            (this.loading = false), (this.tableData = res.data);
            this.total = res.total;
            // 显示状态过滤
            this.tableData.forEach((e) => {
              if (e.checkStatus == 2) {
                e.Status = e.status == 1 ? "上架" : "下架";
              } else {
                e.checkStatus == 1 && (e.Status = "审核中");
                e.checkStatus == 3 && (e.Status = "审核失败");
                e.checkStatus == 4 && (e.Status = "违规下架");
              }
            });
          }
        });
    },
    // 点击 播放视频
    playVideo(data) {
      this.videoUrl = JSON.parse(JSON.stringify(data.roomVideoUrl));
      this.videoTitel = JSON.parse(JSON.stringify(data.roomVideoTitle));
      this.$refs.videobox.openvideo(); // 调用子组件方法
    },
    // 关闭视频
    // offHandle() {
    //   this.videoSrc = "";
    // },
    // 分页方法
    currentChange: function(e) {
      this.params.current = e;
      this.getRoom();
    },
    // 分页方法
    sizeChange: function(e) {
      this.params.limit = e;
      this.getRoom();
    },
    // 上下架
    // 上下架询问
    inquiry(data, status, text) {
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = [];
          data.forEach((e) => {
            ids.push(e.id);
          });
          let params = {
            ids: ids.join(","),
            status,
          };

          batchOperate(params).then((res) => {
            if (res.code == 0) {
              this.Success("操作成功!");
              this.getRoom();
            }
          });
        })
        .catch(() => {
          this.Infos("已取消");
        });
    },
    setRoomType(data, status, textstate) {
      if (data.length == 0) {
        this.Warning("请选择房间");
        return;
      }
      switch (textstate) {
        case "批量上架":
          this.inquiry(data, status, "是否批量上架房间!!");
          break;
        case "批量下架":
          this.inquiry(data, status, "是否批量下架房间!!");
          break;
        case "上架":
          this.inquiry(data, status, "是否上架该房间!!");
          break;
        case "下架":
          this.inquiry(data, status, "是否下架该房间!!");
          break;
        default:
          break;
      }
    },
    // 跳转房间详情
    goRoomDetails(index, td) {
      this.$router.push({ name: "roomDetails", query: { roomId: td.id } });
    },
    // 跳转房间编辑
    goEdit(val, tag) {
      this.$router.push({ name: "addRoom", query: { roomId: val.id, tag,Status:val.Status } });
    },
    // 导出excel
    export2excel() {
      if (this.multipleSelection.length == 0) {
        this.Warning("没有选择导出内容");
        return;
      }
      var tHeader = [
        "房间名称",
        "房间视频",
        "房型",
        "销售价(元)",
        "优惠价(元)",
        "状态",
        "房间数",
        "销量",
        "排序",
      ];
      var filterVal = [
        "roomName",
        "roomVideoUrl",
        "roomType",
        "roomPrice",
        "roomSalePrice",
        "Status",
        "roomNumber",
        "saleVolume",
        "sort",
      ];
      let time = new Date();

      var filename = "房间列表" + moment(time).format("YYYY-MM-DD HH:mm:ss");
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
  watch: {
    giftSelection(val, oldval) {
      if (11 > this.giftSelection.length > 0) {
        this.disbind = false;
      } else {
        this.disbind = true;
        if (oldval.length < val.length) this.Warning("一个房间最多绑定十个");
      }
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-dialog{
  border-radius: 10px;
}
::v-deep .el-dialog__body{
  padding: 20px;
}
.gift_box {
  height: 400px;
  max-height: 400px;
  overflow: auto;
}
#giftsearch{
height: 50px;
}
.container {
  padding: 0 20px;
  background-color: #f4f4f4;
  box-sizing: border-box;
  .head {
    margin: 0 auto 10px;
    width: 100%;
    background-color: #fff;
    .title {
      display: block;
      margin: 10px 0 10px 20px;
      padding: 0;
      color: #333;
      font-size: 20px;
      font-weight: bold;
      font-family: "Microsoft Yahei UI Bold";
    }
    .line {
      margin: 0 auto 15px;
      height: 2px;
      background-color: #f4f4f4;
    }
    .hote-type {
      color: #666;
      margin-left: 20px;
      font-size: 14px;
      & > div,
      .my-head-select {
        float: left;
      }
      & > div {
        margin-right: 10px;
      }
    }
    .hote-type.two {
      margin: 20px 20px;
    }
    .search {
      margin-left: 20px;
      .el-input {
        width: 188px;
        height: 40px;
      }
      .el-button {
        margin-left: 30px;
        width: 56px;
      }
    }
  }
  .content {
    margin: 0 auto;
    padding: 0 20px;
    padding-bottom: 10px;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    .button-area {
      padding: 10px 0;
      border-bottom: 1px solid #f2f2f2;
      .el-button {
        margin-right: 30px;
      }
    }
    .table-area {
      position: relative;
      /deep/td {
        text-align: center;
      }
      /deep/.el-table td,
      .el-table th {
        padding: 7px 0 !important;
      }

      .my-button {
        .el-button {
          display: block;
          float: left;
        }
      }
      .videoImg {
        display: block;
        margin: auto;
        width: 30px;
        height: 30px;
        cursor: pointer;
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
      }
    }
  }
}

</style>

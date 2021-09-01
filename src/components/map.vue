<template>
  <div class="map-container">
    <div class="search-box">
      <input v-model="searchKey" type="search" id="search" />
      <!-- <button @click="searchByHand">搜索</button> -->
      <!-- <button @click="submitAddress" style="margin-left: 2px">确认</button> -->
      <div class="tip-box" id="searchTip"></div>
    </div>
    <el-amap
      class="amap-box"
      :amap-manager="amapManager"
      :vid="'amap-vue'"
      :zoom="zoom"
      :plugin="plugin"
      :center="center"
      :events="events"
    >
      <!-- 标记 -->
      <el-amap-marker
        v-for="(marker, index) in markers"
        :position="marker"
        :key="index"
      ></el-amap-marker>
    </el-amap>
  </div>
</template>
<script>
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
let amapManager = new AMapManager();
export default {
  name: "vueMap",
  props: {
    lng: {
      type: Number,
      default: 0,
    },
    lat: {
      type: Number,
      default: 0,
    },
    mapsearchval:{
        type:String,
        default: "",
    }
  },
  data() {
    let self = this;
    return {
      address: null,
      searchKey: "",
      amapManager,
      markers: [],
      searchOption: {
        city: "全国",
        citylimit: true,
      },
      center: [121.329402, 31.228667],
      zoom: 17,
      maplng: self.lng,
      maplat: self.lat,
      loaded: false,
      markerEvent: {
        click(e) {
          console.log(e);
        },
      },
      events: {
        init() {
          lazyAMapApiLoaderInstance.load().then(() => {
            self.initSearch();
          });
        },
        // 点击获取地址的数据
        click(e) {
          self.markers = [];
          let { lng, lat } = e.lnglat;
          // self.lng = lng
          // self.lat = lat
          // self.center = [lng, lat]
          self.markers.push([lng, lat]);
          self.changelng(lng);
          self.changelat(lat);
          // 这里通过高德 SDK 完成。
          let geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all",
          });
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                let province = result.regeocode.addressComponent.province;
                let city = result.regeocode.addressComponent.city;
                let district = result.regeocode.addressComponent.district;
                let deladdress = `${province}${city}${district}`;
                let hotelAddress = result.regeocode.formattedAddress.split(
                  deladdress
                )[1];
                self.chprovince(province);
                self.chcity(city);
                self.chdistrict(district);
                self.chhotelAddress(hotelAddress);
                self.address = result.regeocode.formattedAddress;
                self.searchKey = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        },
      },
      // 一些工具插件
      plugin: [
        {
          // 定位
          pName: "Geolocation",
          events: {
            init(o) {
              // o是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  // self.lng = result.position.lng // 设置经度
                  // self.lat = result.position.lat// 设置纬度
                  self.center = [self.lng, self.lat]; // 设置坐标
                  self.markers.push([self.lng, self.lat]); // load
                  self.loaded = true; // 页面渲染好后
                  self.$nextTick();
                }
              });
            },
            click(e) {
              // console.log(e);
            },
          },
        },
        {
          // 工具栏
          pName: "ToolBar",
          events: {
            init(instance) {
              // console.log(instance)
            },
          },
        },
        {
          // 搜索
          pName: "PlaceSearch",
          events: {
            init(instance) {
              // console.log(instance)
            },
          },
        },
      ],
    };
  },
  methods: {
    // 向父组件传递点击获得的经纬度
    changelng(lng) {
      this.$emit("setlng", lng);
    }, //经度
    changelat(lat) {
      this.$emit("setlat", lat);
    }, //纬度
    chprovince(province) {
      this.$emit("setprovince", province);
    }, //省
    chcity(city) {
      this.$emit("setcity", city);
    }, //市
    chdistrict(district) {
      this.$emit("setdistrict", district);
    }, //区
    chhotelAddress(hotelAddress) {
      this.$emit("sethotelAddress", hotelAddress);
    }, //具体地点
    // submitAddress() {
    //   console.log("经纬度", this.center);
    //   console.log("地址", this.address);
    // },
    initSearch() {
      let vm = this;
      let map = this.amapManager.getMap();
      AMapUI.loadUI(["misc/PoiPicker"], function(PoiPicker) {
        var poiPicker = new PoiPicker({
          input: "search",
          placeSearchOptions: {
            map: map,
            pageSize: 10,
          },
          suggestContainer: "searchTip", //搜索提示的盒子
          searchResultsContainer: "searchTip", //搜索结果容器
        });
        vm.poiPicker = poiPicker;
        // 监听poi选中信息
        poiPicker.on("poiPicked", function(poiResult) {
          let source = poiResult.source;
          let poi = poiResult.item;
          console.log(poi);
          if (source !== "search") {
            poiPicker.searchByKeyword(poi.name);
          } else {
            poiPicker.clearSearchResults();
            vm.markers = [];
            let lng = poi.location.lng;
            let lat = poi.location.lat;
            let province= poi.pname
            let city=poi.cityname
            let district=poi.adname
            let hotelAddress=poi.name
            let address = poi.cityname + poi.adname + poi.name;
            vm.center = [lng, lat];
            console.log(vm.center);
            vm.changelng(lng)
            vm.changelat(lat)
            vm.chprovince(province);
            vm.chcity(city);
            vm.chdistrict(district);
            vm.chhotelAddress(hotelAddress);
            vm.markers.push([lng, lat]);
            // vm.lng = lng;
            // vm.lat = lat;
            vm.address = address;
            vm.searchKey = address;
          }
        });
      });
    },
    // 手动搜索
    searchByHand() {
      if (this.searchKey !== "") {
        this.poiPicker.searchByKeyword(this.searchKey);
      }
    },
  },
  watch: {
    lng: {
      handler(newValue) {
        this.lng = newValue;
      },
      deep: true,
    },
    lat: {
      handler(newValue) {
        this.lat = newValue;
      },
      deep: true,
    },
    mapsearchval:{
        handler(newValue){
            this.searchKey=newValue
            this.searchByHand()//调用搜索
        }
    }
  },
};
</script>
<style scoped>
.map-container {
  height: 450px;
  position: relative;
}
.search-box {
  position: absolute;
  z-index: 5;
  width: 70%;
  left: 8%;
  top: 10px;
  height: 30px;
}

.search-box input {
  float: left;
  width: 50%;
  height: 100%;
  border: 1px solid #30ccc1;
  padding: 0 8px;
  outline: none;
}

.search-box button {
  float: left;
  width: 10%;
  height: 100%;
  background: #30ccc1;
  border: 1px solid #30ccc1;
  color: #fff;
  outline: none;
}

.tip-box {
  width: 100%;
  max-height: 260px;
  position: absolute;
  top: 30px;
  overflow-y: auto;
  background-color: #fff;
}
</style>
<style>
.amap-logo {
  display: none !important;
}
.amap-copyright {
  opacity: 0;
}
</style>

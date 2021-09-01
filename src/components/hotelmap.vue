<template>
  <div class="map-container">
    <el-form
      size="mini"
      :model="address"
      ref="addressForm"
      label-width="170px"
      inline
    >
      <el-form-item prop="province">
        <el-input
          type="text"
          v-model="address.province" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="city">
        <el-input
          type="text"
          v-model="address.city" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="area">
        <el-input
          type="text"
          v-model="address.area" autocomplete="off"></el-input>
      </el-form-item>
       <el-form-item prop="area">
        <el-button type="warning" size="mini">定位</el-button>
      </el-form-item>
    </el-form>
     <el-input
          style="width: 365px;margin-bottom:20px;"
          type="text" size="mini" v-model="hotelAddress" autocomplete="off"></el-input>
     <el-form
      size="mini"
      inline
    >
      <el-form-item label="经度：">
        <el-input
          type="text"
          v-model="lng" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="纬度：">
        <el-input
          type="text"
          v-model="lat"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="map-title">定位：</div>
    <div class="map_box">
        <vueMap :lng="lng" :lat="lat"/>
    </div>
  </div>
</template>

<script>
import vueMap from "@/components/map.vue";
export default {
  components: {
    vueMap,
  },
  props: {
    address: {
      type: Object,
      default: null,
    },
    hotelAddress: {
      type: String,
      default: "",
    },
    lng: {
      type: Number,
      default: 0,
    },
    lat: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      address: {
        province: "",
        city: "",
        area: "",
      },
    };
  },
};
</script>

<style lang="less" scoped>
.map-container {
  width: 990px;
}
.map_box {
  width: 100%;
  height: 450px;
}
.map-title{
  padding: 15px 0;
}
</style>

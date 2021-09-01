<template>
  <div class="header">{{headertit}}</div>
</template>
<script>
export default {
  props: {
    headertit: {
      type: String,
      default: ""
    },
  },
  data() {
    return {

    };
  },
};
</script>

<style lang="less" scoped>
.header{
    margin-bottom: 10px;
      display: block;
      padding:10px 0 10px 20px !important;
      color: #333;
      font-size: 20px;
      font-weight: bold;
      font-family: 'Microsoft Yahei UI Bold';
      background-color: #fff;
}
</style>

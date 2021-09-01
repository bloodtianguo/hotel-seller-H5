<template>
  <div class="my-head-select clearfix">
      <div v-for="(item,idx) in itemArr" :key="idx" :class="{active:idx == current}" @click="handle(idx)">{{item.title}}</div>
  </div>
</template>

<script>
export default {
  name:'MyHeadSelect',
  data(){
    return{
      current:0
    }
  },
  props:{
    itemArr:{
      type:Array,
      default:()=>[]
    },
  },
  methods:{
    handle(i){
      this.current = i
      this.$emit('selectHandle',this.itemArr[i].value)
    },
    resetHandle(){
      this.current = 0
    }
  }
}
</script>
<style lang="less" scoped>
.my-head-select{
  font-size: 14px;
  &>div{
    float: left;
    margin: 0 27px;
    cursor: pointer;
  }
  .active{
    color: #1CEDE7;
  }
}
</style>
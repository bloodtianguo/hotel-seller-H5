<!--name-->
<template>
  <section ref="mouseBtn" class="rightbutton">
    <!-- 增加 -->
    <span
      @touchstart="onmousedown('mouseBtn', $event)"
      @touchmove.prevent="onmousemove('mouseBtn', $event)"
      @touchend="onmouseup('mouseBtn', $event)"
      class="rowspan"
      @click="addClick"
      v-show="off.add"
    >
    </span>
    <!-- 修改 -->
    <span
      @touchstart="onmousedown('mouseBtn', $event)"
      @touchmove.prevent="onmousemove('mouseBtn', $event)"
      @touchend="onmouseup('mouseBtn', $event)"
      class="rowspan"
      @click="modifyClick"
      v-show="off.modify"
    >
    </span>
    <!-- 创建 没有这张图片了 -->
    <span class="rowspan" v-show="off.create"> </span>
    <!-- 帮助 -->
    <span
      @touchstart="onmousedown('mouseBtn', $event)"
      @touchmove.prevent="onmousemove('mouseBtn', $event)"
      @touchend="onmouseup('mouseBtn', $event)"
      class="rowspan"
      @click="helpClick"
      v-show="off.help"
    >
    </span>
    <!-- 返回 -->
    <span
      @touchstart="onmousedown('mouseBtn', $event)"
      @touchmove.prevent="onmousemove('mouseBtn', $event)"
      @touchend="onmouseup('mouseBtn', $event)"
      class="rowspan"
      @click="leftClick"
      v-show="off.back"
    >
    </span>
  </section>
</template>

<script>



export default {

  components: {},

  props: {
    imgIdList: {
      default: () => [],
    },
    typeShow:{
      type: Boolean,
      default: false
    },
    clickLeft: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
        typeShows:false,
      off: {
        add: false,
        modify: false,
        help: false,
        back: false,
      },
      coordinate: {
        client: {},
        elePosition: {}
      },
      isMove: false
    }
  },
  //监听属性,类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
         typeShow: {
      handler(newValue) {
        if(newValue){
          this.typeShows=this.typeShow
        }
      },
      deep: true
    },
  },
  methods: {
    initData() {
      this.imgIdList.forEach((v, i) => {
        if (v == '1') {
          this.off.add = true
        } else if (v == '2') {
          this.off.modify = true
        } else if (v == '4') {
          this.off.help = true
        } else if (v == '5'&&this.typeShow) {
          this.off.back = true
        }
      })
    },
    leftClick() {
      if (this.clickLeft) {
        this.$emit('leftClick')
      } else {
        this.$router.go(-1)
      }
    },
    helpClick() {
      this.$emit('helpClick')
    },
    modifyClick() {
      this.$emit('modifyClick')
    },
    addClick() {
      this.$emit('addClick')
    },
    onmousedown(refName, e) {
      this.isMove = true
      if (this.isMove) {
        let element = e.targetTouches[0]
        // 记录点击的坐标
        this.coordinate.client = {
          x: element.clientX,
          y: element.clientY
        }
        // 记录需要移动的元素坐标
        this.coordinate.elePosition.left = this.$refs[refName].offsetLeft
        this.coordinate.elePosition.top = this.$refs[refName].offsetTop
      }
    },
    onmousemove(refName, e) {
      let element = e.targetTouches[0]
      // 根据初始 client 位置计算移动距离(元素移动位置=元素初始位置+光标移动后的位置-光标点击时的初始位置)
      let x = this.coordinate.elePosition.left + (element.clientX - this.coordinate.client.x)
      let y = this.coordinate.elePosition.top + (element.clientY - this.coordinate.client.y)
      // 限制可移动距离，不超出可视区域
      x = x <= 0 ? 0 : x >= innerWidth - this.$refs[refName].offsetWidth ? innerWidth - this.$refs[refName].offsetWidth : x
      y = y <= 0 ? 0 : y >= innerHeight - this.$refs[refName].offsetHeight ? innerHeight - this.$refs[refName].offsetHeight : y
      // 移动当前元素
      this.$refs[refName].style.left = x + 'px'
      this.$refs[refName].style.top = y + 'px'
      document.addEventListener('onmousemove', function () {
        e.perventDefault()
      })
    },
    onmouseup(e) {
      this.isMove = false
    }
  },
  //生命周期-创建之前
  beforeCreate() { },
  //生命周期-创建完成（可以访问当前this实例）
  created() {
    this.initData()
  },
  //生命周期-挂载之前
  beforeMount() { },
  //生命周期-挂载完成（可以访问DOM元素）
  mounted() {
    let countNum = 0
    for (let item in this.off) {
      if (this.off[item]) {
        countNum += 1
      }
    }
    setTimeout(() => {
      this.$refs.mouseBtn.style.height = (Number(countNum) * 62) + 'px'
    }, 0);
  },
  //生命周期-更新之前
  beforeUpdate() { },
  //生命周期-更新之后
  updated() { },
  // 生命周期-销毁之前
  beforeDestroy() { },
  //生命周期-销毁完成
  destroyed() { },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() { }
}
</script>
<style scoped lang='less'>
//@import url()引入公共css类
.rightbutton {
  position: fixed !important;
  bottom: 70px;
  right: 20px !important;
  display: flex;
  z-index: 999;
  flex-direction: column;
  width: 42px;
  min-height: 62px;
  .rowspan {
    background-repeat: no-repeat;
    margin-bottom: 20px;
    width: 42px;
    height: 42px;
    display: inline-block;
    background-size: contain;
    &:active {
      animation: clickanimition 200ms linear;
    }
    @keyframes clickanimition {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(0.8);
      }
      100% {
        transform: scale(1);
      }
    }
  }
  /*span:nth-child(1) {*/
  /*  background-image: url('../assets/img/newadd/添加.png');*/
  /*}*/
  /*span:nth-child(2) {*/
  /*  background-image: url('../assets/img/newadd/编辑.png');*/
  /*}*/
  /*span:nth-child(3) {*/
  /*  background-image: url('../assets/img/newadd/newcreate.png');*/
  /*}*/
  /*span:nth-child(4) {*/
  /*  background-image: url('../assets/img/newadd/帮助.png');*/
  /*}*/
  span:nth-child(5) {
    background-image: url('../assets/img/newadd/返回.png');
  }
}
</style>

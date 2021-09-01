import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/plugins/element' // 导入element组件
import '../public/common.css'
import {
  Success,
  Infos,
  Warning,
  Err
} from '@/utils/tools/message.js';
import{hidetextFun} from "./utils/tools/hidetext.js"
import { Message ,MessageBox } from 'element-ui'
import selectexeport from "@/components/selectexeport.vue"; //引入导出勾选组件
import headertit from "@/components/headertit.vue"; //引入导出勾选组件
import {getchtime,getchtime2} from '@/utils/tools/format-time'
import vueMap from 'vue-amap'
import '@/assets/css/index.less'
Vue.prototype.$message = Message
Vue.prototype.$confirm  = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.changedatano = getchtime; //格式化时间 不带秒数
Vue.prototype.changedata = getchtime2; //格式化时间 带秒数
Vue.prototype.Success = Success; //成功消息提示
Vue.prototype.Warning = Warning; //警告消息提示
Vue.prototype.Infos = Infos; //普通消息提示
Vue.prototype.Err = Err; //普通消息提示
Vue.prototype.hidetextFun = hidetextFun; //js控制文本超出隐藏
Vue.use(vueMap)
// 定义全局 时间过滤器 S
import Moment from 'moment'
Vue.filter('comverTime', function (data, format) {
  return Moment(data).format(format)
})
// Vue.use(ElementUI)
Vue.component("selectexeport", selectexeport) //全局注册 勾选导出组件
Vue.component("headertit", headertit) //全局注册 列表头部组件

// 初始化vue-amap
vueMap.initAMapApiLoader({
  key: '84049f3b3af45edd1e0b56017f3a79fd',//需修改
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geolocation', 'AMap.Geocoder', 'AMap.AMapManager', 'AMap.Marker'],
  v: '1.4.4',
  uiVersion: '1.0',
});
// const VConsole = require("vconsole");
// const my_console = new VConsole();

window.addEventListener("storage", (e) => {
  sessionStorage.setItem(e.key, e.oldValue) //重新赋值修改前的值
  localStorage.setItem(e.key, e.oldValue) //重新赋值修改前的值
})

Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import axios from "axios";
import {loading} from './loading'
import dsbridge from "dsbridge";
let baseurl = process.env.VUE_APP_TEST_URL

const instance = axios.create({
  baseURL:baseurl,
  timeout:30000
})

//安卓获取用户信息
let getUserInfo = dsbridge.call("getUserInfo");

let Authorization = "";
if (getUserInfo) {
  Authorization = JSON.parse(getUserInfo).token;
}

instance.defaults.withCredentials = false;
instance.defaults.headers.common["Authorization"] = "Bearer " + Authorization;
instance.defaults.headers.common["machineCode"] = "111";
instance.defaults.headers.common["terminal"] = "Web";
instance.defaults.headers.common["timeStamp"] = Math.round(
  new Date().getTime() / 1000
).toString();
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  loading('open')
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  loading('close')
  return response;
}, function (error) {
  // 对响应错误做点什么
  loading('close')
  return Promise.reject(error);
});

export default instance
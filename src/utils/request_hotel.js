import axios from "axios";
import router from '@/router/index'
let baseurl = process.env.VUE_APP_TEST_URL + '/hotel/seller'
const instance = axios.create({
  baseURL:baseurl,
  // timeout:5000,
})
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = "Bearer " + sessionStorage.getItem("token")
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.status == 250){
    router.push('/login')
    sessionStorage.clear()
  }
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default instance
import request from '../utils/request_hotel'

// 获取手机验证码
export function getPhoneValidate(params){
  return request({
    url:'/sign/getPhoneSms2Login',
    method:'GET',
    params
  })
}

// 登录
export function login(data){
  return request({
    url:'/sign/login',
    method:'POST',
    data
  })
}

// 获得扫码登录字符信息
export function getScanStr(data){
  return request({
    url:'/sign/getCreateScanData',
    method:'POST',
    data
  })
}

// 扫码轮询
export function pollScan(params){
  return request({
    url:'/sign/getScanForInfo',
    method:'POST',
    params
  })
}
// 登出webSocket接口
export function webLogout(){
  return request({
    url:'/sign/logoutWebSocket',
    method:'POST',
  })
}

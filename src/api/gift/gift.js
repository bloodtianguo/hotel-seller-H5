import request from '@/utils/request_hotel'
// 获取房间已绑定礼包的ID
export function getbindgift(params){
  return request({
    url:'/spree/getIdsByRoomId',
    method:'GET',
    params
  })
}
// 礼包查询接口
export function getbindgiftList(params){
  return request({
    url:'/spree/getList',
    method:'GET',
    params
  })
}
// 绑定礼包
export function spreeBinding(params){
  return request({
    url:'/spree/spreeBinding',
    method:'POST',
    params
  })
}
// 展示礼包房间
export function showInfo(params){
  return request({
    url:'/spree/showInfo',
    method:'POST',
    params
  })
}
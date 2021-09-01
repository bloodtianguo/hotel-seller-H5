
import request from '../utils/request_hotel'


// 房间列表分页查询
export function getRoomList(params){
  return request({
    url:'/room/qryPgRoom',
    method:'POST',
    params,
  })
}

// 房间上下架
export function batchOperate(json){
  return request({
    url:'/room/batchOperate',
    method:'POST',
    params:json
  })
}

// 添加房间时获取用户符合条件的视频
export function qryVideoByUserId(json){
  return request({
    url:'/room/qryVideoByUserId',
    method:'POST',
    params:json
  })
}


// 根据房间id 查询 房间详细信息
export function getRoomById(id){
  return request({
    url:'/room/getRoomById',
    method:'POST',
    params:id
  })
}

// 添加房间或编辑房间
export function crtUptRoom(data){
  return request({
    url:'/room/crtUptRoom',
    method:'POST',
    data
  })
}

// 官网第一次收集酒店联系信息
export function sendContactWay(data){
  return request({
    url:'/enter/saveEnterPurpose',
    method:'POST',
    data
  })
}

import request from '../utils/request_hotel'


// 获取入驻酒店信息
export function getMessage(params){
  return request({
    url:'/enter/getHoterDesc',
    method:'GET',
    params
  })
}

// 设置酒店
export function updateHotel(data){
  return request({
    url:'/enter/updateHotel',
    method:'POST',
    data
  })
}
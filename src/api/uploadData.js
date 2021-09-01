
import request from '../utils/request'


// 上传图片
export function uploadImg(data){
  return request({
    headers:{Authorization:''},
    url:'/api/v1/basic/uploadFile',
    method:'POST',
    data
  })
}

// 提交酒店入驻信息
export function submitMessage(data){
  return request({
    url:'/hotel/seller/enter/saveHotel',
    method:'POST',
    data
  })
}

// 获取入驻酒店信息
export function getMessage(params){
  return request({
    url:'/hotel/seller/enter/getHoterByUserId',
    method:'GET',
    params
  })
}








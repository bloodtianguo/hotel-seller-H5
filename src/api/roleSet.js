import request from '../utils/request_hotel'


//查询子账号列表
export function selectList(){
  return request({
    url:'/hotelaccount/list',
    method:'GET'
  })
}

// 新增账号获取验证码
export function appendAccount(params){
  return request({
    url:'/hotelaccount/getPhoneSms',
    method:'GET',
    params
  })
}

// 新增账号
export function addAccount(params){
  return request({
    url:'/hotelaccount/saveHotel',
    method:'POST',
    params
  })
}

// 删除子账号
export function deleteAccount(id){
  return request({
    url:'/hotelaccount/remove',
    method:'POST',
    params:id
  })
}
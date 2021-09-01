import request from '@/utils/request_hotel'
// 订单查询
export function orderList (params) {
  return request({
    url: '/order/hotel/seller/qryPgOrder',
    method: 'post',
    data:params,
  })
}

// 订单详情查询
export function orderdetail (params) {
  return request({
    url: '/order/getOrderById',
    method: 'post',
    params
  })
}

// 同意订单
export function orderconfirm(params) {
  return request({
    url: '/order/updateAgreeOrderById',
    method: 'post',
    params
  })
}
// 拒绝订单
export function orderreject (params) {
  return request({
    url: '/order/updateRejectOrderById',
    method: 'post',
    params
  })
}
// 确认取消订单
export function refundOrderById (params) {
  return request({
    url: '/order/cancelOrderById',
    method: 'post',
    params
  })
}

//订单待入住接口
export function orderocc (params) {
  return request({
    url: '/order/updateLiveOrderById',
    method: 'post',
    params
  })
}

// 离店接口
export function orderout (params) {
  return request({
    url: '/order/updateLeaveOrderById',
    method: 'post',
    params
  })
}
// 订单退款
export function orderrefund (params) {
  return request({
    url: '/order/refundOrderById',
    method: 'post',
    params
  })
}
// 老板工作台数据
export function getOrderCountByUserId (params) {
  return request({
    url: '/order/getOrderCountByUserId',
    method: 'post',
    params
  })
}
//同意退款
export function agreeToaRefund (params) {
  return request({
    url: '/order/agreeToaRefund',
    method: 'post',
    params
  })
}
//拒绝退款
export function refuseFefundOrder (params) {
  return request({
    url: '/order/refuseFefundOrderById',
    method: 'post',
    params
  })
}

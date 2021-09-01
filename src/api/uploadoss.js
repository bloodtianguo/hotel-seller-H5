import request from '@/utils/request-alioss'
// 获取上传文件的凭证(采用STS方式上传)
export function getStsUpload(){
  return request({
    url: '/api/v2/meizhao/provider/getStsUploadFileToken',
    method: 'POST',
  })
}
//返回参数中 expireTime为凭证的过期时间 超过1小时获取一次(考虑到延迟问题 默认拿到过期时间-10s) 






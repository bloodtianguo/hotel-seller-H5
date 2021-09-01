
import request from '../utils/video-request'


// 获取视频上传凭证，文件名，id
export function getVideoAuth(){
  return request({
    url:'/video/v1/getVideoUpTokenAndFileName',
    method:'GET'
  })
}


// 发表视频
export function publishVideo(params){
  return request({
    url:'/video/v1/videoBasis/publishWork',
    method:'POST',
    params
  })
}
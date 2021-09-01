import { Message } from 'element-ui'
export var Success = (message) => {
    Message({
        type: 'success',
        message: message
    });
}
export var Infos = (message) => {
    Message({
        type: 'info',
        message: message
    });
}
export var Warning = (message) => {
  Message({
      type: 'warning',
      message: message
  });
}
export var Err = (message) => {
  Message({
      type:"error",
      message: message
  });
}

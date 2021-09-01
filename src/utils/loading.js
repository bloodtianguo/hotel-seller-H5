

// status = 'open' 开启加载状态 'close' 关闭
export function loading(status){
    let objEl = document.querySelector('#myLoading')
    if(status == 'open'&& !objEl){

        let el = document.createElement('div')
        let div = document.createElement('div')
        div.innerHTML = `<i class="el-icon-loading"></i>`
        el.style.cssText = `position: fixed;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0, 0, 0, .3);
                            z-index: 5;`
        div.style.cssText = ` position: absolute;
                            display: block;
                            transform: translate(-50%,-50%);
                            color: #fff;
                            top: 50%;
                            left: 50%;
                            font-size: 1.333333rem;`   
        el.appendChild(div) 
        el.id='myLoading' 
        document.body.appendChild(el)
    }
    if(status == 'close'&& objEl){
        document.body.removeChild(objEl)
    }

                                     
}
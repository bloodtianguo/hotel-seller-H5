<template >
  <div class="container">
    <div :class="{ toastshow: skip }" class="content">
      <div class="hotel-name">
        <p class="title">酒店名称：</p>
        <input
          type="text"
          placeholder="请输入酒店名称"
          maxlength="20"
          v-model="hotel"
        />
        <p class="explain">需与营业执照上的商户名称完全一致</p>
      </div>
      <div>
        <p class="title">营业执照：</p>
        <div class="upload-container">
          <input
            ref="input"
            type="file"
            class="uploadpic"
            accept=".jpg,.jpeg,.bmp,.png"
            @change="picChange($event)"
          />
          <div class="mark" ref="mark">
            <span :class="{ toastshow: url != '' }">点击上传</span>
            <img :src="url" />
          </div>
        </div>
        <p class="explain">
          格式要求：原件照片、扫描件或者复印件加盖企业公章后的扫描件，
        </p>
        <p class="explain">支持.jpg .jpeg .bmp .png格式照片，大小不超过5M</p>
      </div>
      <div>
        <p class="title">联系人姓名：</p>
        <input
          type="text"
          maxlength="10"
          placeholder="请输入联系人"
          v-model="contacts"
        />
        <p class="explain">请填写公司运营负责人</p>
      </div>
      <div>
        <p class="title">联系方式：</p>
        <input
          maxlength="20"
          @change="landlineTelephone()"
          placeholder="请输入座机号"
          v-model="phone"
        />
        <p class="explain">请注意填写格式，举例座机：0755-88880000；</p>
      </div>
      <div>
        <p class="title">酒店地址：</p>
        <div class="address">
          <div class="pr-selt">
            <select v-model="address.province" @change="choseProvince">
              <option disabled value="">请选择省份</option>
              <option
                v-for="(item, idx) in provinces"
                :key="idx"
                :value="item[0]"
              >
                {{ item[1] }}
              </option>
            </select>
            <div class="arr"></div>
          </div>

          <div class="pr-selt">
            <select v-model="address.city" @change="choseCity">
              <option disabled value="">请选择市</option>
              <option v-for="(item, idx) in city" :key="idx" :value="item[0]">
                {{ item[1] }}
              </option>
            </select>
            <div class="arr"></div>
          </div>

          <div class="pr-selt">
            <select v-model="address.area">
              <option disabled value="">请选择区</option>
              <option v-for="(item, idx) in area" :key="idx" :value="item[0]">
                {{ item[1] }}
              </option>
            </select>
            <div class="arr"></div>
          </div>
        </div>

        <div class="street-container">
          <textarea
            maxlength="200"
            v-model="address.street"
            placeholder="请填写详细地址：例**街道**号"
            class="street"
            @input="keydownHandle($event)"
          ></textarea>
          <span> {{ address.street.length }} /200</span>
        </div>
      </div>
      <div class="foo">
        <button class="cancel" @click="cancelHandle">取消</button>
        <button class="submit" @click="submitHandle">提交</button>
      </div>
    </div>
    <div class="toast" :class="{ toastshow: isShow }">
      <span>{{ message }}</span>
    </div>
    <div class="skip" :class="{ toastshow: !skip }">
      <div v-if="checkStatus == 1">
        <p>你好，平台审核中请耐心等待！！</p>
        <p>
          申请成功后，可至
          <a :href="aUrl">{{ aUrl }}</a>
          登录使用！！
        </p>
      </div>
      <div v-else-if="checkStatus == 2">
        <p>你好，平台审核已经通过了！！</p>
        <p>
          你可至
          <a :href="aUrl">{{ aUrl }}</a
          >登录使用！！
        </p>
      </div>
    </div>
    <rightImgBar :imgIdList="['5']"  :typeShow="typeShow"/>
  </div>
</template>


<script>
import '@/utils/flexible'
import { uploadImg, submitMessage, getMessage } from '@/api/uploadData'
import rightImgBar from '@/components/rightImgBar'

export default {
  name: 'uploadData',
  components: { rightImgBar },
  data() {
    return {
      typeShow:false,//用于传递返回按钮是否显示
      hotel: '',
      contacts: '', // 联系人
      phone: '',
      address: {
        province: '',
        city: '',
        area: '',
        street: ''
      },
      message: '消息',
      isShow: true,
      provinces: [],
      city: [],
      area: [],
      url: '',  // 图片上传后返回的url 地址
      skip: false,
      checkStatus: 0, // 审核状态  1:审核中 2.通过审核 3.审核失败
      aUrl: ''
    }
  },
  created() {
      if(this.$route.query.typeShow){
            this.typeShow=true
      }
    this.picData = null // 保存上传图片二进制信息
    this.getHotelMess()
  },
  mounted() {
    this.aUrl = process.env.VUE_APP_A_URL
  },
  methods: {

    landlineTelephone() {
      let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      let zji = /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,4}))?$/
      if (reg_tel.test(this.phone) == false && zji.test(this.phone) == false) {
        this.setToastTime('请输入正确的座机号码!')
        this.phone = ''
        return
      }
    },
    async submitHandle() {
      if (this.hotel == '' || this.contacts == '' || this.phone == '' || this.address.province == '' || (this.address.city == '' && this.city.length != 0) || (this.address.area == '' && this.area.length != 0) || this.address.street == '') {
        this.setToastTime('你还有未填完的项')
        return
      }
      if (this.url == '' && this.picData == null) {
        this.setToastTime('你还没有上传营业执照')
        return
      }
      this.uploadData()//上传整个表单
      // 如果用户选择了上传的图片则先执行图片上传获取图片url
      // if (this.picData != null) {
      //   let result
      //   try {
      //     result = await this.uploadImgHandler()//上传图片
      //   } catch (error) {
      //     this.setToastTime(error)
      //   }
      //   if (result == 0) {
      //     this.uploadData()
      //   }
      // } else {
      //   this.uploadData()//上传整个表单
      // }
    },
    // 上传所有填写的资料
    uploadData() {
      let params = {
        hotelName: this.hotel, // 酒店名称
        hotelAddress: this.address.street, // 详细地址
        provinceCode: this.address.province,
        cityCode: this.address.city,
        countyCode: this.address.area,
        contactName: this.contacts, // 联系人
        contactPhone: this.phone,
        businessLicenseUrl: this.url // 营业执照img 的url
      }
      const mdata = new FormData()
      for (const key in params) {
        mdata.append(key, params[key])
      }
      submitMessage(mdata).then(({ data }) => {
        if (data.code == 0) {
          this.skip = true
          this.checkStatus = 1
        }
        if (data.code != 0) {
          this.setToastTime(data.msg)
        }
      }).catch(err => {
      })
    },
    // 图片上传到服务器
    uploadImgHandler() {
      return new Promise((resolve, reject) => {
        const fdata = new FormData()
        fdata.append('file', this.picData)
        uploadImg(fdata).then(({ data }) => {
          if (data.code == 0) {
            this.url = data.data
            // console.log("上传了",this.url);
            resolve(0)
          } else {
            reject(data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 选择图片，本地预览，同时对图片大小做判断
    picChange(e) {
      const input = e.target
      const files = input.files
      if (files && files[0]) {
        const file = files[0]
        // console.log(file.size);
        if (file.size > 1024 * 1024 * 5) {
          this.setToastTime('文件大小不能超过5M')
          input.value = ''
          // return
        } else {
          var reader = new FileReader();
          reader.readAsDataURL(file)
          this.picData = file
          reader.onload = e => {
            this.url = e.target.result
            this.$refs.mark.innerHTML = `<img src="${e.target.result}"/>`
          }
          // 直接上传
          this.uploadImgHandler()
        }
      }
    },
    // 弹出提示消息框
    setToastTime(message, time = 2000) {
      this.message = message
      this.isShow = false
      setTimeout(() => {
        this.message = ''
        this.isShow = true
      }, time)
    },
    // 多行文本 ，当输入字符满200个就禁止继续输入，但是可以删除。
    keydownHandle(e) {
      if (this.address.street.length >= 2 && e.keyCode != 8) {

        return e.returnValue = false
      }

    },
    // 加载全国城市信息
    loadCity() {
      const vm = this
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'http://meizhao-public.oss-cn-chengdu.aliyuncs.com/city.js'
      document.getElementsByTagName('head')[0].appendChild(script)
      script.onload = function () {
        let provinceMap = [...getProvince()]

        vm.provinces = provinceMap
        // if (vm.address.province != '') {
        let city = getCity(vm.address.province)
        vm.city = [...city]
        // }
        // if (vm.address.city != '') {
        let area = getCountry(vm.address.province, vm.address.city)
        vm.area = [...area]
        // }
      }
    },
    choseProvince() {
      // 选择了省份就加载城市信息
      let city = getCity(this.address.province)
      this.city = [...city]
      this.address.city = ''
      this.address.area = ''
      this.area = []
    },
    choseCity() {
      // 选择了城市就加载地区信息
      let area = getCountry(this.address.province, this.address.city)
      this.area = [...area]
      this.address.area = ''
    },
    cancelHandle() {
      this.$router.back(-1)
    },
    // 获取酒店是否入驻过信息
    getHotelMess() {
      let params = {}
      getMessage(params).then((res) => {
        this.loadCity()
        if (res.data.code == 0) {
          if (res.data.data == null) {
            // 没有申请过 不做操作
            return
          }
          // 3 表示 审核失败 ，可以重新编辑提交
          if (res.data.data.status == 3) {
            this.hotel = res.data.data.hotelName
            this.contacts = res.data.data.contactName
            this.phone = res.data.data.contactPhone
            this.address.province = res.data.data.provinceCode
            this.address.city = res.data.data.cityCode
            this.address.area = res.data.data.countyCode
            this.address.street = res.data.data.hotelAddress
            this.url = res.data.data.businessLicenseUrl
          } else { // 2 表示通过审核  1 表示审核中
            this.skip = true
            this.checkStatus = res.data.data.status
          }

        }
      }).catch(err => {
      })
    }
  },
  computed: {

  },
  watch: {

  },
  beforeDestroy() {
    // window.removeEventListener("resize", setRemUnit);
    // window.removeEventListener("pageshow", pageshow);
    // window.removeEventListener("DOMContentLoaded", setBodyFontSize);
    // document.documentElement.style.fontSize = "";
  },
}
</script>


<style lang="less" scoped>
.container {
  font-size: 16px;
  // padding-top: 1.2rem;
  & > div {
    width: 100%;
    margin-bottom: 0.266667rem;
  }
  .content {
    box-sizing: border-box;
    padding-left: 0.266667rem;
    padding-bottom: 0.266667rem;
  }
  .head {
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    background-color: #1e1c28;
    margin: 0;
    color: #fff;
    font-size: 0.48rem;
    font-weight: Medium;
    i {
      position: absolute;
      top: 50%;
      left: 0.213333rem;
      transform: translateY(-50%);
    }
  }
  .hotel-name {
    margin-top: 0.346667rem;
  }
  .title {
    margin: 0 0 0 0.266667rem;
    padding: 0;
    font-weight: 700;
    color: #333333;

    font-family: PingFangSC-Medium, PingFang SC;
  }
  input {
    display: block;
    margin: 0.266667rem 0 0 0.746667rem;
    padding-left: 0.266667rem;
    width: 7.306667rem;
    height: 0.906667rem;
    background-color: #f3f3f3;
    border-radius: 0.053333rem;
    outline: none;
    border: 0;
    font-size: 14px;
    box-sizing: border-box;
    &::placeholder {
      color: #999999;
    }
  }
  .explain {
    display: block;
    margin: 0.133333rem 0.773333rem;
    width: 8rem;
    font-size: 0.266667rem;
    color: #999999;
  }
  .upload-container {
    position: relative;
    margin: 0.266667rem 0 0 0.746667rem;
    height: 4.8rem;
    width: 7.84rem;
    border-radius: 0.053333rem;
    .uploadpic {
      position: absolute;
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      opacity: 0;
    }
    .mark {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: #f2f2f2;
      text-align: center;
      line-height: 4.8rem;
      z-index: -1;
      /deep/img {
        max-width: 7.84rem;
        max-height: 4.8rem;
      }
    }
  }
  .street-container {
    position: relative;
    span {
      position: absolute;
      display: block;
      bottom: 0;
      right: 2.133333rem;
      font-size: 0.266667rem;
      color: #999;
    }
  }
  .street {
    display: block;
    margin: 0.24rem 0 0.8rem 0.746667rem;
    padding: 0.266667rem;
    width: 7.28rem;
    height: 3.306667rem;
    outline: none;
    resize: none;
    border: 0;
    box-sizing: border-box;
    background-color: #f3f3f3;
    &::placeholder {
      color: #999999;
    }
  }
  .address {
    margin: 0.266667rem 0 0 0.746667rem;
    width: 7.333333rem;
    .pr-selt{
      position: relative;
      margin-bottom: 0.266667rem;
      height: 0.906667rem;
      width: 5.626667rem;
      .arr {
        position: absolute;
        top: .293333rem;
        right: .293333rem;
        width: .186667rem;
        height: .186667rem;
        border-left: 1px solid #333;
        border-bottom: 1px solid #333;
        transform: rotate(-45deg);
      }
    }
    select {
      padding-left: 0.266667rem;
      outline: none;
      width: 100%;
      height: 100%;
      color: #999999;
      border: 0;
      background-color: #f3f3f3 !important;
    }
  }
  .foo {
    display: flex;
    justify-content: space-between;
    width: 7.28rem;
    margin-left: 0.746667rem;
    margin-bottom: 0.826667rem;
    button {
      width: 2.933333rem;
      height: 0.8rem;
      border: 0;
      font-size: 0.48rem;
      font-weight: 600;
      border-radius: 0.053333rem;
    }
    .cancel {
      color: #b0b0b0;
      background-color: #f3f3f3;
    }
    .submit {
      color: #fff;
      background-color: #fc8228;
    }
  }
  .toast {
    position: fixed;
    top: 50%;
    border-radius: 3px;
    text-align: center;
    transition: 2s ease;
    width: 100%;
    span {
      padding: 0.133333rem 0.4rem;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 0.08rem;
      color: #fff;
      font-size: 0.266667rem;
      font-weight: 200;
    }
  }
  .skip {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    p {
      margin-bottom: 0.266667rem;
      font-size: 0.4rem;
      text-align: center;
      font-weight: 600;
      span {
        color: #aa64ff;
      }
    }
  }
  .toastshow {
    display: none;
  }
}
</style>

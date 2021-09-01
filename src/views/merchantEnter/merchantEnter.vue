<template>
  <div class="box">
    <div class="screen1">
        <div class="contanier">
          <div class="title">提交信息</div>
          <el-form label-position="left"  :rules="rules" ref="ruleForm"  label-width="80px" :model="hotel">
            <el-form-item label="酒店名称" prop="name">
              <el-input v-model="hotel.name" maxlength="20"  placeholder="请输入酒店名称"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="porson">
              <el-input v-model="hotel.porson" maxlength="10"  placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="hotel.phone" placeholder="酒店顾问将会联系你,帮助入驻" oninput="value=value.replace(/[^\d]/g, '')" :maxlength="11"></el-input>
            </el-form-item>
            
            <el-form-item label="备注" >
              <el-input class="desc" type="textarea" v-model="desc" resize="none"  :maxlength="200" 
              placeholder="如有特殊要求，请详细描述"
              show-word-limit ></el-input>
              
            </el-form-item>
            <el-form-item class="last" >
              <el-button type="info" @click="goMeizhao">取消</el-button>
              <el-button type="success" class="successbtn" @click="submitHandle">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
    <div class="screen2">
      <div class="tag">Why didn't you find it?<br> 为什么选择没找？</div>
      <div class="picban">
        <img src="@/assets/img/ruzhu/b-1.png" >
        <img src="@/assets/img/ruzhu/b-2.png" >
        <img src="@/assets/img/ruzhu/b-3.png" >
        <img src="@/assets/img/ruzhu/b-4.png" >
        <img src="@/assets/img/ruzhu/b-5.png" >
      </div>
    </div>
    <div class="screen3">
      <div class="tag">Franchise process <br> 加盟流程</div>
      <div class="s3-ban">
        <img src="@/assets/img/ruzhu/b-7.png" >
        <img src="@/assets/img/ruzhu/b-8.png" >
        <img src="@/assets/img/ruzhu/b-6.png" >
        
      </div>
    </div>
  </div>
</template>

<script>
import { sendContactWay } from '@/api/room'
export default {
  data() {
    // 验证手机号
    var checkPhone = (rule,value,cb)=>{
      const regPhone =  /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regPhone.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      labelPosition: 'right',
      hotel: {
        name: '',
        porson: '',
        phone: '',
      },
      desc:'',
      rules: {
          name: [
            { required: true, message: '请输入酒店名称', trigger: 'blur' },
          ],
          porson: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator:checkPhone, trigger: 'blur' }
          ],
      }
    };
  },
  methods:{
    submitHandle(){
      let isTrue = true
      for (const key in this.hotel) {
        if(  this.hotel[key] == ''){
          isTrue = false
          break
        }
      }
      if(!isTrue){
        this.$message('你还有未填完的项')
        return
      }

      let regPhone =  /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regPhone.test(this.hotel.phone) == false){
        this.$message('手机号码不符合！')
        return
      }


      let data ={
        hotelName:this.hotel.name,
        name:this.hotel.porson,
        phone:this.hotel.phone,
        remark:this.desc
      }
      let fdata = new FormData()
      for (const key in data) {
        fdata.append(key,data[key])
      }
      sendContactWay(fdata).then(res=>{
        console.log(res);
        if(res.code == 0){
          this.$alert('资料提交成功！！', '', {
          confirmButtonText: '确定',
          callback: action => {
            location.reload();
          }
        });


        }

      }).catch(err=>{
        console.log(err);
      })


    },
    
    goMeizhao(){
      window.location.href = 'http://www.meizkj.com'
    }
  }
}
</script>

<style lang="less" scoped>
.box{
  width: 100%;
  // height: 100vh;
  background-color: #f5f5f5;
  .screen1{
    position: relative;
    width: 100%;
    height: 100vh;
    background: url('../../assets/img/ruzhu/beijing.jpg') no-repeat center;
    background-size: cover;
    overflow: hidden;
  }
  .screen3,
  .screen2{
    height: 100vh;
    padding-top: 100px;
    box-sizing: border-box;
    .tag{
      min-width: 800px;
      height: 200px;
      font-size: 70px;
      font-family: Microsoft YaHei UI;
      font-weight: 400;
      color: #2C2C2C;
      line-height: 100px;
      text-align: center;
    }
    .picban{
      display: flex;
      justify-content: center;
      height: 480px;
      width: calc(100% - 150px);
      margin: 0 auto;
      img{
        width: 300px;
        height: 490px;
        margin: 0 5px;
      }
    }
  }
  .screen3{
    height: 100vh;
    background-color: #fff;
    .s3-ban{
      display: flex;
      justify-content: center;
      height: 480px;
      width: calc(100% - 150px);
      margin: 0 auto;
      img{
        // width: 250px;
        height: 350px;
        margin: 140px 80px;
      }
    }
  }

}
  .contanier{
    position: absolute;
    top: 150px;
    right: 200px;
    height: 600px;
    width: 450px;
    padding: 50px;
    box-shadow: 2px 1px 5px #888888;
    background-color: #fff;
    .title{
      text-align: center;
      font-size: 36px;
      font-family: Microsoft YaHei UI;
      font-weight: 400;
      color: #1A1A1A;
      margin-bottom: 40px;
    }
    .el-form-item{
      // margin: 30px 0;
      position: relative;
      margin-bottom: 50px;
    }
    .span{
      margin: 30px 82px;
      color: #7f7f7f;
      font-size: 14px;
    }
    .desc{
      /deep/.el-textarea__inner{
        height: 150px;
      }
    }
    .count{
      position: absolute;
      right: 7px;
      bottom: -7px;
      color: #d9d7df;
    }
    .successbtn{
      background-color: #302370;
      border-color: #fff;
      &:hover{
        background-color: #3f3570;
        border-color: #3f3570;
      }
    }
    .el-button{
      width: 100px;
    }
    .last{
      /deep/.el-form-item__content{
        margin: 0 !important;
        display: flex;
        justify-content: space-between;
      }
    }


  }
  .screen1,
  .screen2,
  .screen3{
    min-height: 937px;
  }
</style>

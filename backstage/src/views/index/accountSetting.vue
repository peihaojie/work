<template>
  <div>
    <sub-title :subTitle="'用户设置'"></sub-title>
    <div class="body">
      <div class="div-middle">
        <!-- active 上传的地址,
        http-request 覆盖默认的上传行为
        accept 上传文件类型
        show-file-list 是否显示已上传文件列表 -->
        <el-upload
          class="upload-demo"
          action
          :http-request="uploadFile"
          accept="image/jpeg,image/png"
          :show-file-list="false"
        >
          <img :src="avatar" alt="" class="uploading-img-img">
          <div class="el-upload__tip" slot="tip">上传头像</div>
        </el-upload>
        <!-- ref和v-on:model是表单的使用方法，model中使用的数据在data中定义，required表示必填项，label-width表单宽度，v-on：rules定义表单验证 -->
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          required
          label-width="150px"
          class="demo-ruleForm"
        >
          <!-- label标签文本，prop对应表单验证的名称 -->         
          <el-form-item label='用户名' prop='name'>
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label='旧密码' prop='oldPassword'>
            <el-input type='password' v-model="ruleForm.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label='新密码' prop='newPassword'>
            <el-input type='password' v-model="ruleForm.newPassword"></el-input>
          </el-form-item>
          <el-form-item label='确定密码' prop='twicePassword'>
            <el-input type='password' v-model="ruleForm.twicePassword"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- primary为主要按钮 -->
            <el-button type="primary" @click="update('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
export default {
  name:"accountSetting",
  components:{
    subTitle
  },
  created(){
    this.userInfo = JSON.parse(this.$store.getters.userInfo)
    this.ruleForm.name = this.userInfo.merchantName
    this.ruleForm.merchantLogo = this.userInfo.merchantLogo
    this.avatar = 'http://k.zol-img.com.cn/sjbbs/7692/a7691515_s.jpg'
  },
  data(){
    // callback是一个回调函数的函数名（之后会定义）
    // 自定义表单校验规则
    var validatePass2 = (rule,value,callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      }else if (this.ruleForm.twicePassword !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致！'))
      }else{
        callback()
      };
    }
    return{
      avatar:'',
      ruleForm:{
        name:'',
        oldPassword:'',
        newPassword:'',
        twicePassword:'',
        merchantLogo:''
      },
      rules:{
        // required必填项，trigger: "blur"失去焦点时出发验证,message验证显示内容
        name:[{ required:true,message:'请输入用户名',trigger:'blur'}],
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        // validator为自定义规则
        twicePassword: [
          { required: true, trigger: "blur", validator: validatePass2 }
        ]
      }
    }
  },
  methods:{
    uploadFile(file){
      // formData函数：把form中所有表单元素的name与value组装成一个queryString（创建表单）
      // append添加自定义属性
      // post上传内容和内容的属性到指定地址
       let formData = new FormData()
       formData.append('file',file.file)
       this.$http
       .post("merchant/upload_file",formData,{
         type:'form',
         file:'image'
       })
       .then(res => {
        //  将获取到的图片保存到merchantLogo
        // 修改图片的链接，这里需要加上网址
         this.ruleForm.merchantLogo = res.image;
         this.avatar = this.userInfo.imgUrl + res.image
       })
    },
    update(formName){
    // 验证form所有项
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
          .post("/merchant/change_password",this.ruleForm,{type:'form'})
          .then(
            () => {
              // 将修改后的密码头像保存vuex里
              this.userInfo.merchantName = this.ruleForm.name;
              this.userInfo.merchantLogo = this.ruleForm.merchantLogo;
              this.$msgSuc('修改成功')
              this.ruleForm.oldPassword = ''
              this.ruleForm.newPassword = ''
              this.ruleForm.twicePassword = ''
              this.$store.commit(
                'SET_USERINFO',
                JSON.stringify(this.userInfo)
              )
            },
            err => {
              this.$msgErr(err.msg);
            }
          )
        }else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-form-item__error{
  left:26px;
}
.body{
  .div-middle{
    text-align: center;
    .el-from-item__label{
      float: none;
      clear: both;
    }
    .el-form-item{
      width: 400px;
      margin: 26px auto;
    }
    button{
      background: #5bc0bf;
      color:#fff;
    }
    .el-form-item__content{
      display: inline-block;
      .el-input{
        display: inline-block;
        input{
          width:100%
        }
      }
    }
  }
}
.uploading-img-img{
  width:100px;
  height:100px;
  border-radius: 50%;
}
.demo-ruleForm{
  margin-left: -120px;
}
</style>
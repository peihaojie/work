<template>
  <div class = 'container'>
    <div class="login">
      <h2>零售后台管理系统</h2>
      <span hidden>13227750618</span>
      <div class="login-from">
        <div class="from-item flex h-center">
          <img src="@/assets/icon-user.png">
          <!-- placeholder是占位符 -->
          <input v-model="from.loginName" class="flex-1" placeholder='请输入手机号'>
        </div>
        <div class="from-item flex h-center">
          <img src="@/assets/icon-lock.png">
          <input v-model="from.loginPassword" class="flex-1" type="password" placeholder='请输入密码'>
        </div>
        <button @click='login'>登录</button>
      </div>
    </div>
  </div>
</template>

<script>

import CONFIG from '@/utils/config'

export default {
  name:'login',
  data(){
    return{
      from:{
        loginName:'13227750618',
        loginPassword:'123456'
      },
      config:CONFIG,
      newMenu:{
        selectedparent: "",
        name: ""
      }
    }
  },
  methods:{
    login(){
      if (!this.from.loginName) {
        this.$msgWar('请输入手机号')
        return
      }
      if (!CONFIG.reg.phone.test(this.from.loginName)) {
        this.$msgWar('请输入正确的手机号')
        return
      }
      if (!this.from.loginPassword) {
        this.$msgWar('请输入密码')
        return
      }
      this.$http.post("merchant/login", this.form, {
        type: "form"
      })
      .then(
        res => {
          // 将获取到的数据转化为json，保存到vux里，并存到localStorage里
          this.$store.commit("SET_USERINFO", JSON.stringify(res));
          this.$msgSuc("登录成功");
          localStorage.userId = res.userId;
          localStorage.userMobile = res.merchantMobile;
          localStorage.merchantId_ID = res.merchantId;
          localStorage.moduleId = 300;
          // 500毫秒之后跳转到/index页面
          setTimeout(() => {
            this.$router.push("/index");
          }, 500);
        },
        err => {
          this.$msgErr(err.msg);
        }
      );
    }
  }
}
</script>

<style scoped lang='scss'>
.container{
  position:fixed;
  width:100vw;
  height:100vh;
  background: url('../assets/background.png') repeat-y center / 100%
}
.login{
  position: absolute;
  top:50%;
  left:50%;
  width: 500px;
  background: #fff;
  padding:60px 40px;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translate(-50%, -50%);
  z-index: 2;
  h2{
    color: #1abc9c;
    text-align: center;
  }
  .login-from{
    margin-top: 40px;
    .from-item{
      padding-right: 20px;
      height: 50px;
      border:1px solid #dcdfe6;
      border-radius: 4px;
      margin-bottom: 30px;
    }
    input{
      height: 50px;
      font-size: 18px;
      border:none;
      border-radius: 4px
    }
    img{
      margin:0 20px;
    }
    button{
      height: 50px;
      width: 100%;
      background-color: #1abc9c;
      border-radius: 4px;
      border:none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
    // 伪类，获得焦点的元素
    button:focus{
      opacity: 0.8;
    }
  }
}
</style>
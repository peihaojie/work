<template>
  <div class="container">
    <header class="header flex">
      <div class="logo"></div>
      <!-- 因为设置了路由卫士，所以在router跳转之前，会将现在正在访问的二级页面传给vuex -->
      <!-- activeNav方法返回保存在vuex的二级页面名称，一样的话就修改className -->
      <!-- v-for循环数组接收两个参数（item, index）,
      v-for循环对象接收三个参数（value, name, index） -->
      <!-- 这里的index应该是name，也就是属性名 -->
      <div 
        @click="switchNav(item.path)"
        class="nav-item"
        v-for="(item,index) in nav"
        :key="index"
        :class="index == activeNav ? 'active' : ''"
      >{{item.title}}</div>
      <div class="flex-1">
        <img src="@/assets/icon-index.png" @click="linkIndex" title="回到首页">
        <img src="@/assets/icon-exit.png" @click="loginOut" title="退出">
      </div>
    </header>
    <div class="main" :style="{ 'height':mainHeight + 'px' }">
      <div class="menu">
        <ul v-for="(item,index) in menu" :key="index">
          <li class="menu-item menu-title">{{item.sub}}</li>
          <router-link
            class="menu-item"
            tag="li"
            active-class="active"
            v-for="(child,idx) in item.menu"
            :key="idx"
            :to="child.path"
          >{{child.name}}</router-link>
        </ul>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import nav from '@/utils/nav';
export default {
  name:'index',
  data(){
    return {
      mainHeight:window.innerHeight - 90,
      nav:nav,
      // loginData: [{},{}]
    }
  },
  // mounted(){
  //   this.$http.post(
  //     'merchant/get_merchant_login_info_list',
  //     {
  //       currentPage:1,
  //       pageSize:10,
  //       orderBy:'operate_time desc'
  //     },
  //     {
  //       type:'from'
  //     }
  //   )
  //   .then(res => {
  //     this.loginData = res.list
  //   })
  // },
  computed:{
    activeNav(){
      return this.$store.getters.activeNav
    },
    menu(){
      return nav[this.$store.getters.activeNav].child
    }
  },
  methods:{
    switchNav(path){
      this.$router.push(path)
    },
    loginOut(){
      this.$router.push('/')
      this.$store.commit('CLEAR_USERINFO')
    },
    linkIndex(){
      this.$router.push('/index')
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.container{
  position: fixed;
  width:100vw;
  height:100vh;
  left:0;
  top:0;
  overflow: auto;
}
.header{
  width:100%;
  min-width: 1240px;
  height:70px;
  background-color: #5bc0bf;
  .logo{
    width:200px;
    height:100%;
  }
  .nav-item{
    line-height: 70px;
    padding:0 20px;
    color:#fff;
    font-size: 20px;
    cursor: pointer;
  }
  .active{
    background-color: #7ccdcc;
  }
  .flex-1{
    display: flex;
    // align-items 属性定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式。
    align-items: center;
    // justify-content 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式。flex-end项目位于容器的尾部
    justify-content: flex-end;
    padding-right:30px;
    .avatar{
      width:40px;
      height:40px;
      border-radius: 50%;
    }
    *{
      margin-left: 20px;
    }
    span{
      color: #fff;
      font-size: 18px;
    }
  }
}
.main{
  display: flex;
  width: 100%;
  .menu{
    width:200px;
    height:100%;
    // 不参与缩放
    flex-shrink: 0;
    overflow: auto;
    background-color: #efefef;
    font-size: 15px;
    .menu-title{
      color:#b9b9ba !important;
      cursor: auto !important;
    }
    .menu-item{
      display: block;
      line-height: 50px;
      color: #595757;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
    }
    .active{
      color: #5bc0bf;
      border-bottom: 1px solid #5bc0bf;
      background-color: #fff;
      font-weight: bold
    }
  }
}
.content{
  position: relative;
  // flex: 1;
  width:100%;
  min-width: 1040px;
  overflow: auto;
}
</style>

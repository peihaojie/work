import Vue from 'vue'
import VueRouter from 'vue-router'
// Vue Router是Vue.js的官方路由器。
import VueResource from 'vue-resource'
// Vue.js的插件提供了使用XMLHttpRequest或JSONP 发出Web请求和处理响应的服务。
import App from './App.vue'
import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'

import './common/stylus/index.styl'

Vue.config.productionTip = false

// 安装插件，挂载属性
Vue.use(VueRouter)
Vue.use(VueResource)

// 创建路由对象
const routes = [{
  path: '/goods',
  component: goods
},
{
  path: '/ratings',
  component: ratings
},
{
  path: '/seller',
  component: seller
}
]

// 配置路由规则
const router = new VueRouter({
  routes, // (缩写) 相当于 routes: routes
  linkActiveClass: 'active' // 被点击class属性转换为active
})

// new Vue 启动并添加路由规则
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 页面打开时跳转至goods页面
router.push('/goods')

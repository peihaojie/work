import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import Element from 'element-ui'
import { Message } from 'element-ui'
import store from './store/store'
import axios from './utils/axios'
import './assets/css/element-variables.scss'
// 自定义插件
import plugin from './utils/plugin'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.use(Element)
Vue.prototype.$http = axios
Vue.use(VueQuillEditor)
Vue.use(plugin)

// 导航守卫主要用来通过跳转或取消的方式守卫导航。
// to: Route: 即将要进入的目标路由对象
// from: Route: 当前导航正要离开的路由
// next(): 进行管道中的下一个钩子
router.beforeEach((to, from, next) => {
  // 如果浏览器缓存里没有userInfo，或设置userInfo为空对象,JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  if (!localStorage.getItem('userInfo') || JSON.stringify(store.getters.userInfo) === '{}') {
    // 判断跳转的路由名称，如果是login就执行下一步
    if (to.name == 'login') {
      next();
    } else {
      // 若是其他页面的话就跳转到path:'/'的位置
      Message.error("登录过期");
      // 跟router.push很像，唯一的不同就是，它不会向history添加新记录，而是跟它的方法名一样,替换掉当前的history记录。
      router.replace('/');
    }
  } else {
    // split()方法用于把一个字符串分割成字符串数组。
    // 判断路由的path是否为空，若不为空，则去当前路由path，否则取index
    let module = to.path.split('/')[1] ? to.path.split('/')[1] : 'index';
    store.commit('ACTIVE_NAV', module);
    next();
  }
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')

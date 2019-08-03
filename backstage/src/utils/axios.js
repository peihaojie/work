import axios from 'axios'
import qs from 'qs'
import CONFIG from './config'
import store from '../store/store'
import router from '../router/router'
import { Message } from 'element-ui'

// 配置axios的默认值
axios.defaults.baseURL = CONFIG.api  // 定义bastUrl
axios.defaults.timeOut = 5000        // 设置请求的延迟时间

// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // 在发送请求之前做某事
  config.withCredentials = true; // 在跨域请求时，会携带用户凭证
  if (config.type == 'form' && config.file != 'image') {
    config.data = qs.stringify(config.data); // `data` 是作为请求主体被发送的数据，qs.stringify方法将json解析成URL的形式
    // `headers` 是即将被发送的自定义请求头
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'; // 使用的qs进行序列化那么content-type就是application/x-www-form-urlencoded
  } else {
    config.headers['Content-Type'] = 'application/json; charset=UTF-8'; // axios默认的content-type是application/json
  }
  return config
}, (err) => {
  // 请求错误时做些事
  Message.error('请求超时');
  return Promise.reject(err);
  // Promise是异步编程的一种解决方案，相当于return new Promise((resolve, reject) => reject(err))

  // new Promise(function(resolve, reject) {
  //   // ... some code
  
  //   if (/* 异步操作成功 */){
  //     resolve(value);
  //   } else {
  //     reject(error);
  //   }
  // });
});
  
// 添加响应拦截器
axios.interceptors.response.use((res) => {
  // 对响应数据做些事
  if (res.data.errno == 200) {
    return res.data.data
  } else if (res.data.errno == 416) {
    Message.error('登录失效');
    setTimeout(() => {
      store.commit('CLEAR_USERINFO'); // store.commit()调用vuex中mutation定义的方法，来修改store中的状态
      router.push('/');               // 页面跳转至'/'
    }, 500)
  } else if (res.data.errno == '0000') {
    //Message.error(res.data.msg);
    return Promise.reject(res.data);
  } else {
    return Promise.reject(res.data);
  }
}, (err) => {
  // 请求错误时做些事
  return Promise.reject(err);
});

export default axios;
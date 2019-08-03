import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	// 将状态从根组件“注入”到每一个子组件中
	state:{
		// 获取浏览器缓存的数据，如果没有就设置为{}
		userInfo:localStorage.getItem('userInfo') || {},
		activeNav:'index'
	},
	// 像计算属性一样，getter的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
	getters:{
		userInfo:state => state.userInfo,
		activeNav:state => state.activeNav
	},
	// 修改state的方法，使用store.commit()调用
	mutations:{
		// 更改用户账号，并存储到浏览器
		SET_USERINFO(state, userInfo){
			state.userInfo = userInfo
			localStorage.setItem('userInfo',userInfo)
		},
		// 删除用户名，并从浏览器内移除
		CLEAR_USERINFO(state){
			state.userInfo = {}
			localStorage.removeItem('userInfo')
		},
		ACTIVE_NAV(state,module){
			state.activeNav = module
		}
	},
	// 提交的是 mutation，而不是直接变更状态。可以包含任意异步操作。
	actions:{}
})
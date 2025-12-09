import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) // vue的插件机制
// Vuex.Store 构造器选项
const store = new Vuex.Store({
    // 为了不和页面或组件的data中的造成混淆，state中的变量前面建议加上$符号
    state: {
        // 用户信息
        $userInfo: {
            id: 1
        },
		privacyAgree: true,//是否需要调用隐私协议 同意过返回false
    },
	
	mutations:{
		setPrivacyAgree(state,payload){
			state.privacyAgree = payload;
		}
	},
	actions:{
		getPrivacyAgree(state,payload){
			uni.getPrivacySetting({
				success: res => {
				// 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
					this.commit("setPrivacyAgree",res.needAuthorization)
				},
				fail: () => {},
				complete: () => {}
			})
		}
	},
	modules: {}
})

export default store

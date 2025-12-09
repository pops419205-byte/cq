import {
	Storage
} from "@/common/SDK/tools/index.js"
import Recipe from '../Recipe.js'
import Author from '../Author.js'
import Router from '@/router/index.js'
export default class User {
	constructor() {
		this.user_info = {
			nick: '未登录',
			avatar: 'null'
		}
	}

	/**
	 * 初始化用户信息
	 */
	init(callback = null, options) {
		this.user_info = Storage.getStorage('userInfo').values.data;
		// this.updateUser()
		if (callback) {
			callback()
		}
	}

	/**
	 * 用户模块销毁
	 */
	destoryed() {

	}
}

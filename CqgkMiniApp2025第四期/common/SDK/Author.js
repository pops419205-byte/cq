import {
	redirect
} from "@/router/navigator.js"
import {
	Storage
} from '@/common/SDK/tools/index.js';
import Recipe from './Recipe.js'
import User from './user/index.js'
import Router from '@/router/index.js'
export default class Author {
	constructor() {}

	showToast(msg) {
		uni.showToast({
			icon: 'none',
			title: msg
		})
	}


}

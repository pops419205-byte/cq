import {
	baseURL,
	timeout
} from "./config";
import {
	METHODTYPE
} from './constant';
import {
	Storage
} from '@/common/SDK/tools/index.js';

const headerHandler = (api, params) => {
	const header = {
		...params
	};
	let tokenVal = uni.getStorageSync('userNumberToken');
	console.log('tokenVal:',tokenVal)
	header['tokenFID'] = tokenVal?tokenVal:'';
	if (api.auth_with) {
		const token = Storage.getStorage('token');
		if (token) header['Authorization'] = 'Bearer ' + token.values;
	}
	if (api.method == METHODTYPE.POST) {
		header['content-type'] = 'application/json';
	}
	// console.log('header:',header)
	return header;
};

const urlHandler = (url, baseUrl = '') => {
	if (baseUrl !== '') {
		return baseUrl + url
	} else {
		return baseURL + url;
	}
};

/**
 * 请求拦截
 * @param { Object } option  
 * */
const requestIntercept = (option) => {
	if (!option.auth_with) return true;
	else return recipe.Author.checkTokenLose();
}

/**
 * 请求方法
 * @param {string}  api	请求的地址信息 constants内
 * @param {object}
 * @property {object} data 携带数据
 * @property {object} header	请求的 header
 * @property {string} dataType = ['json'] 如果设为 json，会尝试对返回的数据做一次 JSON.parse
 * @property {string} responseType = ['text'] 设置响应的数据类型
 * @return {object}
 */
export const axios = async (api, data, header = {}, baseUrl = '', dataType = 'json', responseType = 'text') => {
	let method = api.method || 'POST'; //默认为POST
	let Network = true; // 标识是否发起请求
	let url = urlHandler(api.url, baseUrl);
	header = headerHandler(api, header);
	let isRequest = requestIntercept(api);
	uni.onNetworkStatusChange((res) => { // 监听网络
		if (!res.isConnected) {
			Network = false;
			uni.showLoading({
				title: "网络连接失败！"
			})
		} else {
			Network = true;
			uni.hideLoading();
		}
	});
	if (!Network || !isRequest) return false;
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method,
			data,
			header,
			dataType,
			responseType,
			timeout,
			success: rsp => {
				resolve(rsp.data, url);
			},
			fail: fail => {
				if (fail.errMsg.indexOf('timeout') !== -1) {
					uni.showToast({
						icon: 'none',
						title: '请求超时！',
						position: 'center'
					})
				}
				console.error('请求错误: ' + url, fail);
				reject(fail);
			},
			complete: complete => {}
		});
	});
};

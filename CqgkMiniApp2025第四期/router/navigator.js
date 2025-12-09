import { objEmpty } from '@/common/SDK/tools/index.js';

export const ANIMATIONTYPE = {
	SlideInRight: 'slide-in-right',	// slide-out-right 新窗体从右侧进入
	SlideInLeft: 'slide-in-left',	// slide-out-left 新窗体从左侧进入
	SlideInTop: 'slide-in-top',	// slide-out-top 新窗体从顶部进入
	SlideInBottom: 'slide-in-bottom',	// slide-out-bottom 新窗体从底部进入
	PopIn: 'pop-in',	// pop-out 新窗体从左侧进入，且老窗体被挤压而出
	FadeIn: 'fade-in',	// fade-out 新窗体从透明到不透明逐渐显示
	ZoomOut: 'zoom-out',	// zoom-in 新窗体从小到大缩放显示
	ZoomFadeOut: 'zoom-fade-out',	// zoom-fade-in 新窗体从小到大逐渐放大并且从透明到不透明逐渐显示
	None: 'none',	// none 无动画
}

/**
 * 成功失败函数统一处理
 * @return {object}
 */
const navigateHandler = (successCallback, failCallback, completeCallback) => {
	return {
		success: success => {
			if(typeof successCallback == 'function')
				successCallback.call(null, success)
		},
		fail: fail => {
			if(typeof failCallback == 'function')
				failCallback.call(null, fail);
			console.error('跳转失败', fail);
		},
		complete: complete => {
			if(typeof completeCallback == 'function')
				completeCallback.call(null, complete);
		}
	}
}


/** 
* 对象转为查询字符串
* @type object
* */ 
const toQueryString = (params) => {
	if(objEmpty(params)) {
		return '';
	}
	let str = "";
	for (let n in params) {
		let par;
		if(typeof params[n] === "boolean") {
			par = +params[n]
		} else {
			par = params[n]
		}
		str += n + "=" + par + "&";
	}
	str = str.substring(0, str.length - 1);
	return str;
}

/**
 * query对象处理
 * @param {string}
 * @param {object} 
 * @return {string}
 */
const queryHandler = (url, query) => {
	if(query && !objEmpty(query)) {
		url += '?' + toQueryString(query);
	}
	return url;
}

/**
 * 处理路由传递参数
 * @param {object} originObj 源对象
 * @param {object} extendsObj 组合的对象
 */
const handlerOptions = (originObj, extendsObj) => {
	return { ...originObj, ...extendsObj }
}

/**
 * 路由导航 
 * @param {object}  = {}
 * 	@property {string} url
 * 	@property {object} query = null
 * 	@property {string} animationType = ANIMATIONTYPE.SlideInRight
 * 	@property {number} animationDuration = 300
 * 	@property {function} successCallback = null
 * 	@property {function} failCallback = null
 * 	@property {function} completeCallback = null
 */
export const navigateTo = ({ url, query = null, animationType = ANIMATIONTYPE.SlideInRight, animationDuration = 300, events = null, success = null, fail = null, complete = null } = {}) => {
	let options = handlerOptions(
		{
			url: queryHandler(url, query),
			animationType,
			animationDuration,
			events
		}, 
		navigateHandler(success, fail, complete)
	)
	
	uni.navigateTo(options);
}

export const redirectTo = ({ url, query, success = null, fail = null, complete = null } = {}) => {
	let options = handlerOptions(
		{ url: queryHandler(url, query) }, 
		navigateHandler(success, fail, complete)
	);
	
	uni.redirectTo(options)
}

export const reLaunch = ({ url, query, success = null, fail = null, complete = null } = {}) => {
	let options = handlerOptions(
		{ url: queryHandler(url, query) }, 
		navigateHandler(success, fail, complete)
	);
	uni.reLaunch(options);
}

export const switchTab = ({ url, success = null, fail = null, complete = null } = {}) => {
	let options = handlerOptions(
		{ url }, 
		navigateHandler(success, fail, complete)
	);
	uni.switchTab(options)
}
/**
 * 普通页面重定向
 */
export const redirect = (url,options)=> {
	uni.navigateTo({
		url: url + '?options=' + encodeURIComponent(JSON.stringify(options))
	})
}
/**
 * 判断对象是否为空
 * @param {Object} obj
 */
export const objEmpty = (obj) => {
	for (let key in obj) {
		return false;
	}
	return true;
};

/**
 * 获取元素信息
 * @param {String} name 查询名字
 * @param {Boolean} tag 判断是选择全部还是单个 
 */
export const getElementInfo = (name, tag = false) => {
	if (!tag) {
		return new Promise((resolve, reject) => {
			uni.createSelectorQuery().select(name).boundingClientRect((info) => {
				resolve(info)
			}).exec()
		})
	} else {
		return new Promise((resolve, reject) => {
			uni.createSelectorQuery().selectAll(name).boundingClientRect((info) => {
				resolve(info)
			}).exec()
		})
	}
}

/**
 * 获取手机信息
 */
export const getMobileInfo = () => {
	const mobile = uni.getSystemInfoSync();
	if (mobile) {
		return mobile;
	} else {
		console.log("获取手机信息失败")

	}
}
/**
 * 存储
 */
export const Storage = {
	setStorage(key, value, outTime = 0) {
		let time = new Date().getTime();
		let data = {
			times: outTime ? outTime * 1000 : time,
			values: value
		}
		uni.setStorageSync(key, JSON.stringify(data))
	},
	getStorage(key) {
		let res = uni.getStorageSync(key)
		if (res) return JSON.parse(res);
	},
	removeStorage(...key) {
		function clear() {
			key.forEach((item) => {
				uni.removeStorageSync(item)
			})
		}
		key.length ? clear() : uni.clearStorageSync();
	}
}

/**
 * 要截取的字符串
 * @param {String} string
 * 开始位置
 * @param {String} star
 * 结束位置
 * @param {String} end
 */
export const subString = (string, star, end) => {
	let _star = string.indexOf(star);
	let _end = string.indexOf(end);
	return string.substring(_star, _end);
}

/**
 * 去重合并
 * @param {Array} list
 * 去重的字段
 * @param {String} name
 */
export const removeMerge = (list, name) => {
	let obj = {};
	list.forEach((item, index) => {
		let {
			name
		} = item;
		if (!obj[name]) {
			obj[name] = {
				name,
				skins: []
			}
		}
		obj[name].skins.push(item);
	});
	let data = Object.values(obj);
	return data;
}

/**
 * 获取枚举对象
 * @param { Object } enums 枚举对象
 * @param { Number } code 状态码
 */
export const getEnumObj = (enums, code) => {
	for (let key in enums) {
		if (enums[key].value == code) {
			return enums[key]
		}
	}
	return null
}

/**
 * 获取区间随机数
 * @param { Number } min 最小值
 * @param { Number } max 最小值   
 */
export const getSectionRandom = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



//防抖  
export const debounce = (fn, wait = 500, isImmediate = true) => {
	let timerId = null;
	let flag = true;
	if (isImmediate) {
		return function() {
			clearTimeout(timerId);
			if (flag) {
				fn.apply(this, arguments);
				flag = false
			}
			timerId = setTimeout(() => {
				flag = true
			}, wait)
		}
	}
	return function() {
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			fn.apply(this, arguments)
		}, wait)
	}
}

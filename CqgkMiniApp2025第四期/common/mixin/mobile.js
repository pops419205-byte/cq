export default {
	data() {
		return {
			menuButtonInfo: {}, //胶囊信息
			windowHeight: 0, //窗口可视高度
			statusBarHeight: 0, //状态栏高度
			menuHeight: 0, //菜单高度
			mobileInfo: {}, //手机信息
			screenHeight: 0, //手机高度
			screenWidth: 0, //手机宽度
		}
	},
	mounted() {
		this.getMenuButtonInfo();
		this.getSystemInfoSync();
	},
	computed: {
		navigationHeight() {
			return this.menuButtonInfo.top * 2 + this.menuButtonInfo.height;
		},
		winHeight() { //滑动窗口
			return this.windowHeight - (uni.upx2px(112) + this.navigationHeight);
		},
		navHeight() {
			return this.windowHeight - this.menuButtonInfo.top - this.menuButtonInfo.height - 6
		}
	},
	methods: {
		/**
		 * 获取胶囊按钮
		 * */
		getMenuButtonInfo() {
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			this.menuHeight = this.menuButtonInfo.height;
		},
		/**
		 * 获取手机信息
		 * */
		getSystemInfoSync() {
			try {
				// #ifdef MP-WEIXIN
				// 使用新的API替代废弃的getSystemInfoSync
				const deviceInfo = wx.getDeviceInfo();
				const windowInfo = wx.getWindowInfo();
				const appBaseInfo = wx.getAppBaseInfo();
				
				// 合并信息
				this.mobileInfo = {
					...deviceInfo,
					...windowInfo,
					...appBaseInfo,
					// 兼容旧字段
					screenHeight: deviceInfo.screenHeight || windowInfo.screenHeight,
					screenWidth: deviceInfo.screenWidth || windowInfo.screenWidth,
					windowHeight: windowInfo.windowHeight,
					statusBarHeight: windowInfo.statusBarHeight
				};
				// #endif
				// #ifndef MP-WEIXIN
				this.mobileInfo = uni.getSystemInfoSync();
				// #endif
				this.screenHeight = this.mobileInfo.screenHeight;
				this.screenWidth = this.mobileInfo.screenWidth;
				this.windowHeight = this.mobileInfo.windowHeight;
				this.statusBarHeight = this.mobileInfo.statusBarHeight;
			} catch (e) {
				console.log("获取手机信息失败!" + e)
				// 降级处理：如果新API失败，尝试使用旧API
				try {
					// #ifdef MP-WEIXIN
					this.mobileInfo = wx.getSystemInfoSync();
					// #endif
					// #ifndef MP-WEIXIN
					this.mobileInfo = uni.getSystemInfoSync();
					// #endif
					this.screenHeight = this.mobileInfo.screenHeight;
					this.screenWidth = this.mobileInfo.screenWidth;
					this.windowHeight = this.mobileInfo.windowHeight;
					this.statusBarHeight = this.mobileInfo.statusBarHeight;
				} catch (e2) {
					console.log("降级获取手机信息也失败!" + e2)
				}
			}
		}
	}
}

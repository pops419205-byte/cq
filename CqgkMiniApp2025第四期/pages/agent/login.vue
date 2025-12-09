<template>
	<!-- 司机界面引导页 -->
	<view class="customer">
		<view class="main">
			<view class="welcome">
				<!-- 标题 -->
				<view class="title">
					<view>重油高科欢迎你</view>
				</view>
			</view>
			<view class="button-box">

				<!-- 跳转到报修列表 -->
				<button v-if="Author" size="medium" type="warning" style="color:black;background-color: #169BD5;margin-top: 20rpx;color: #FFFFFF;"
					@click="totalNav('order')">马上报修</button>
				<button v-if="!Author" size="medium" type="warning" style="color: black;background-color: #169BD5;margin-top: 20rpx"
					open-type="getPhoneNumber" @getphonenumber="wxgetPhoneNumber"
					@click.native="indexBtn('order')">马上报修</button>


				<button v-if="Author" size="medium" type="warning" style="color:black;margin-top: 20rpx"
					@click="totalNav('order_list')">查看未完工单</button>
				<button v-if="!Author" size="medium" type="warning" style="color: black;margin-top: 20rpx"
					open-type="getPhoneNumber" @getphonenumber="wxgetPhoneNumber"
					@click.native="indexBtn()">查看未完工单</button>
			</view>


		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				code: '', //用户登录的code
				isAuthor: false, //用户是否先授权了个人信息    
				show: false, //订阅消息开关
				show2: false, //关注公众号提示
				Author: false, //用户是否已经登录
				type: '', //授权完成后 去维修站或报修列表
				isGetPhone: false
			}
		},
		/**
		 *  页面显示时 1.调用小程序登录api  获取code 2.检查是否已经登录  
		 */
		onShow() {
			this.login();
			this.Author = this.$Recipe.checkLogin()
		},
		methods: {
			/**
			 * 提取本地openid 和 phone 调用获取userinfo 接口 将值保存  当借口返回空时  则说明是司机 需要调用插入司机方法  插入成功后再次调用   本方法获取用户信息
			 */
			async getMiniUser() {
				let data = {
					openid: uni.getStorageSync('openid'),
					mobile: uni.getStorageSync('phone')
				}
				const res = await this.$Recipe.getMiniUserInfo(data)
				if (res.data.length == 0) {
					this.updateUserInfo()
				} else {
					uni.setStorageSync('customertype', res.data[0].customertype)
					uni.setStorageSync('Fnumber', res.data[0].FCustID)
					uni.setStorageSync('userNumber', res.data[0].number)
					uni.setStorageSync('userNumberToken', res.data[0].usernumber)
					uni.setStorageSync('FISADMIN', res.data[0].FISADMIN)
					if (res.data[0].customertype == 'Service_station') {
						uni.setStorageSync('stationName', res.data[0].name)
						if (!res.data[0].openid.replace(' ', '')) {
							let data = {
								FName: res.data[0].username,
								FTEL: uni.getStorageSync('phone'),
								unionid: uni.getStorageSync('unionid'),
								openid: uni.getStorageSync('openid'),
								fnumber: res.data[0].usernumber
							}
							let res3 = await this.$Recipe.InsertServiceCustomer(data)
						}
					}
					this.nav()
				}
			},
			/**
			 * 当userinfo 列表为空的时候    调用添加人员接口  
			 */
			async updateUserInfo() {
				let data1 = {
					FName: uni.getStorageSync('nickName'),
					FTEL: uni.getStorageSync('phone'),
					unionid: uni.getStorageSync('unionid'),
					openid: uni.getStorageSync('openid')
				}
				const res = await this.$Recipe.addUser(data1)
				let data = {
					openid: uni.getStorageSync('openid'),
					mobile: uni.getStorageSync('phone')
				}
				const res1 = await this.$Recipe.getMiniUserInfo(data)
				uni.setStorageSync('customertype', res1.data[0].customertype)
				uni.setStorageSync('Fnumber', res1.data[0].FCustID)
				uni.setStorageSync('userNumber', res1.data[0].number)
				uni.setStorageSync('userNumberToken', res.data[0].usernumber)
				uni.setStorageSync('FISADMIN', res.data[0].FISADMIN)
				this.nav()
			},
			/**
			 *  登录方法 调用微信登录api 获取code   通过 code调用接口获取 openid session_key  unionid   当获取完成后 再次调用微信登录api 更新code 用于手机授权 解密手机号
			 */
			login() {
				uni.showLoading({
					title: '登录中...'
				});
				uni.login({
					provider: 'weixin',
					success: ({
						code
					}) => {
						this.code = code;
						this.$Recipe.getOpenid({
							json_code: this.code
						}).then((res) => {
							uni.setStorageSync('openid', res.data.openid)
							uni.setStorageSync('unionid', res.data.unionid)
							uni.login({
								provider: 'weixin',
								success: ({
									code
								}) => {
									this.code = code;
								},
							});
						})
						uni.hideLoading();
					},
				});
			},
			/**
			 * 获取用户信息授权  授权完成后 将用户名和头像地址保存  
			 */
			wxGetUserInfo() {
				uni.getUserProfile({
					desc: 'weixin',
					success: ({
						userInfo
					}) => {
						uni.login({
							provider: 'weixin',
							success: ({
								code
							}) => {
								this.code = code;
								uni.setStorageSync('nickName', userInfo.nickName)
								uni.setStorageSync('avatarUrl', userInfo.avatarUrl)
								this.isAuthor = true
								if (this.isGetPhone) {
									this.getMiniUser()
								}
							},
						});

					},
					fail: (err) => {
						uni.login({
							provider: 'weixin',
							success: ({
								code
							}) => {
								this.code = code;
							},
						});
						this.isAuthor = false
						this.$Recipe.toast('您已拒绝授权,请重试')
					}
				});
			},
			/**
			 * 获取手机号授权  如果先调用手机号授权 则isAuthor为空   或者拒绝手机授权  则 返回       授权成功则 调用获取手机号接口  将手机号保存  然后调用获取 客户信息接口判断是司机或服务站
			 */
			wxgetPhoneNumber(e) {
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					uni.login({
						provider: 'weixin',
						success: ({
							code
						}) => {
							this.code = code;
							let data = {
								encryptedData: e.detail.encryptedData,
								IV: e.detail.iv,
								code: this.code
							}
							this.$Recipe.getTel(data).then((res) => {
								uni.setStorageSync('phone', res.data)
								this.isGetPhone = true
								if (this.isAuthor) {
									this.getMiniUser()
								}
							})
						},
					});

				} else {
					this.isGetPhone = false
					this.$Recipe.toast('您已拒绝授权,请重试')
				}
			},
			/**
			 * @param {String} type  判断type 判断点击的按钮 去到不同的页面
			 */
			indexBtn(type) {
				this.type = type
				let nickName = uni.getStorageSync('nickName')
				let avatarUrl = uni.getStorageSync('avatarUrl')
				if (nickName && avatarUrl) {
					return
				}
				this.wxGetUserInfo()
			},
			nav() {
				if (this.type == 'order') {
					this.totalNav('order')
				} else {
					this.totalNav('order_list')
				}
			},
			totalNav(type) {
				switch (type) {
					case 'history':
						this.$Router.navigateTo({
							url: this.$Router.history.index
						})
						break;
					case 'order_list':
						this.$Router.switchTab({
							url: this.$Router.order.report_index
						})
						break;
					case 'order':
						this.$Router.switchTab({
							url: this.$Router.order.index
						})
						break;
					case 'map':
						this.$Router.navigateTo({
							url: this.$Router.station.map
						})
						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.customer {
		height: 100vh;

		.main {
			padding: 0 150rpx;
			height: 100%;
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;

			.welcome {
				position: absolute;
				top: 20%;
				font-weight: bold;
				font-size: 40rpx;

				.logo {
					display: flex;
					justify-content: center;
					margin-bottom: 30rpx;
				}
			}

			.button-box {
				position: absolute;
				bottom: 120px;
				width: 400rpx;
			}
		}
	}
</style>

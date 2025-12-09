<template>
	<!-- 司机界面引导页 -->
	<view class="customer">
		<view class="main">
			<view class="welcome">
				<!-- 标题 -->
				<view class="title">
					<view>重油高科售后管理系统</view>
					<view style="text-align: center;margin-top: 25px;">服务平台</view>
				</view>
			</view>
			<view class="button-box">
				<button size="medium" v-if='!isAuthor' type="warning" style="color: black;margin-top: 20rpx"
					@click="wxGetUserInfo()">授权微信登录</button>
				<button size="medium" type="warning" v-if="isAuthor" style="color: black;margin-top: 20rpx"
					open-type="getPhoneNumber" @getphonenumber="wxgetPhoneNumber">授权手机号码</button>
			</view>

		</view>
		<privacyAgreenPop :show.sync="showPrivacy" @handleAgree="handleAgree"></privacyAgreenPop>
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
				isGetPhone: false,
				status: '',
				showPrivacy:false
			}
		},
		/**
		 *  页面显示时 1.调用小程序登录api  获取code 2.检查是否已经登录  
		 */
		onShow() {
			console.log(333,this.$store.state.privacyAgree)
			console.log(444,this.showPrivacy) 
			console.log(111,uni.getStorageSync('userRoleList'))
			
			this.checkPrivacySetting()
			
			this.login();
			this.Author = this.$Recipe.checkLogin()
			if (this.Author) {
				this.getMiniUser();
				// this.status = uni.getStorageSync('customertype')
				// this.nav(this.status)
			}
		},
		methods: {
			/**
			 * 提取本地openid 和 phone 调用获取userinfo 接口 将值保存  当借口返回空时  则说明是司机 需要调用插入司机方法  插入成功后再次调用   本方法获取用户信息
			 */
			async getMiniUser() {
				console.log('login.page',222)
				let data = {
					openid: uni.getStorageSync('openid'),
					mobile: uni.getStorageSync('phone')
				}
				uni.showLoading()
				//const res = await this.$Recipe.getMiniUserInfo(data);
				uni.setStorageSync('openid','oOZkW5EyHcRwrzvBOslT_Ilr4ISU')
				uni.setStorageSync('phone','17092368880')
				const res ={"data":[{"name":"测试用服务站A","number":"02.testA","openid":"oOZkW5EyHcRwrzvBOslT_Ilr4ISU","mobile":"17092368880","FCustID":"126878","FISADMIN":"0","username":"孙鹏","usernumber":"CXR059995","customertype":"Service_station"},{"name":"微信用户","number":"CUST0520","openid":" ","mobile":"17092368880","FCustID":"1506464","FISADMIN":"0","username":"微信用户","usernumber":"0","customertype":"Customer"}],"msg":"Success","code":200}

				
				
				const roleList =	res.data.filter(item=>{
					 if(item.customertype == 'Service_station'||item.customertype=='Distributor'){
						 return item
					 }
				 })
				console.log('login')
				console.log(roleList)
				uni.setStorageSync('userRoleList',roleList); 
				
				
				if (res.data.length == 0) {
					this.updateUserInfo()
				} else if (res.data.length == 1) { 
					 
					
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
							this.getMiniUser();
							return 
						}
					}
					if(this.status == 'Distributor'){ 
						uni.$emit('aEven', '2')
						this.totalNav('Distributor') 
					}else{
						this.nav(res.data[0].customertype)
					}
					return 
				}  else {
					const list = res.data;
					const result = list.filter(item => {
						if (item.customertype == 'Service_station') {
							// 筛选出服务商身份
							return item
						}
					})
					
					let insertNum = 0 ;
					roleList.forEach(item => {
						if (!item.openid.replace(' ', '')) {
							let _data = {
								FName: item.username,
								FTEL: uni.getStorageSync('phone'),
								unionid: uni.getStorageSync('unionid'),
								openid: uni.getStorageSync('openid'),
								fnumber: item.usernumber
							}; 
							this.$Recipe.InsertServiceCustomer(_data);
							insertNum++;
						}
					})
					console.log(333,insertNum)
					let _thisa = this ;
					if(insertNum>0){
						setTimeout(function(){
							_thisa.getMiniUser();
						},1000) 
						return
					}
					let data
					if (result.length > 0) {
						data = result[0];
						// 服务商
					} else {
						data = list[0]
						 
						// 中心库
					}
					console.log(data,444)
					uni.setStorageSync('customertype', data.customertype)
					uni.setStorageSync('Fnumber', data.FCustID)
					uni.setStorageSync('userNumber', data.number)
					uni.setStorageSync('userNumberToken', data.usernumber)
					uni.setStorageSync('FISADMIN', data.FISADMIN)
					uni.setStorageSync('stationName', data.name)  //服务站中心库名称
			
					this.nav(data.customertype)
				}
				
				uni.hideLoading()
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
				uni.setStorageSync('userNumberToken', res1.data[0].usernumber)
				uni.setStorageSync('FISADMIN', res1.data[0].FISADMIN)
				this.nav(res1.data[0].customertype)
			},
			/**
			 *  登录方法 调用微信登录api 获取code   通过 code调用接口获取 openid session_key  unionid   当获取完成后 再次调用微信登录api 更新code 用于手机授权 解密手机号
			 */
			login() {
				  
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
						}, (error) => {
							console.log(error);
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
					desc: '用于完善会员资料',
					success: ({
						userInfo
					}) => {
						uni.showToast({
							icon: 'none',
							title: '个人信息授权成功'
						})
						uni.login({
							provider: 'weixin',
							success: ({
								code
							}) => {
								this.code = code;
								uni.setStorageSync('nickName', userInfo.nickName)
								uni.setStorageSync('avatarUrl', userInfo.avatarUrl)
								this.isAuthor = true
							},
						});

					},
					fail: (err) => {
						console.log(111,err)
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
				let _this = this;
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					uni.login({
						provider: 'weixin',
						success: ({
							code
						}) => {
							_this.code = code;
							let data = {
								encryptedData: e.detail.encryptedData,
								IV: e.detail.iv,
								code: _this.code
							}
							_this.$Recipe.getTel(data).then((res) => {
								uni.setStorageSync('phone', res.data)
								_this.isGetPhone = true
								if (_this.isAuthor) {
									_this.getMiniUser()
								}
							})
						},
					});

				} else {
					_this.isGetPhone = false
					_this.$Recipe.toast('您已拒绝授权,请重试')
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
			
			handleAgree(){
				this.$store.dispatch("getPrivacyAgree")
			},
			nav(type) {
				if (type == 'Service_station') {
					uni.redirectTo({
						url: '/pages/station/lead'
					})
				}
				if (type == 'Customer') {
					uni.redirectTo({
						url: '/pages/login/driver',
						// url: '/pages/station/lead'
					})
				}
				if (type == 'Distributor') {
					uni.redirectTo({
						url: '/pages/agent/index'
					})
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
					case 'Distributor':
						this.$Router.switchTab({
							url: this.$Router.agent.index
						})
						break;
				}
			},
			
		
			checkPrivacySetting(){
				let _this = this;
				uni.getPrivacySetting({
					  success: res => {
						console.log("getPrivacySetting",res,_this.showPrivacy)
						if(res.needAuthorization){
							_this.showPrivacy = true
						}else{
							_this.showPrivacy = false
						} 
						console.log(_this.showPrivacy)
						// 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
						// if (res.needAuthorization) {
						  // 需要弹出隐私协议
							// this.showPrivacy = false
						// } else {
							// this.showPrivacy = true
						  // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
						  // wx.getUserProfile()
						  // wx.chooseMedia()
						  // wx.getClipboardData()
						  // wx.startRecord()
						// }
					  },
					  fail: () => {},
					  complete: () => {}
				})
			},
			
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

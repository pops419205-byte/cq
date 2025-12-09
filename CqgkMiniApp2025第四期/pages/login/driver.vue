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
			<view class="button-box" v-if="!isAuthor || !isGetPhone"> 
				<!-- 跳转到报修列表 -->
				<button v-if="!isAuthor" size="medium" type="warning" style="color:black;margin-top: 20rpx"
					@click="indexBtn()">授权微信登录</button>
				<button v-if="isAuthor" size="medium" type="warning" style="color: black;margin-top: 20rpx"
					open-type="getPhoneNumber" @getphonenumber="wxgetPhoneNumber"
					>授权手机号码</button>
			</view>
			<view class="button-box" v-if="status == 'Customer' && isAuthor && isGetPhone">
				<!-- 跳转到服务站 -->
				<button size="medium" type="warning"
					style="color: #FFFFFF;background-color: #169BD5;margin-top: 20rpx"
					@click.native="totalNav('map')">去附近服务站</button> 
				<!-- 跳转到报修列表 -->
				<button size="medium" type="warning" style="color:black;margin-top: 20rpx"
					@click="totalNav('order')">马上报修</button>
				 
			</view>
			<view class="button-box" v-if="status == 'Service_station' && isAuthor && isGetPhone">
				<!-- 跳转到报修列表 -->
				<button size="medium" type="warning"
					style="color:black;background-color: #169BD5;margin-top: 20rpx;color: #FFFFFF;"
					@click="totalNav('order')">马上报修</button>
				 
				<button size="medium" type="warning" style="color:black;margin-top: 20rpx"
					@click="totalNav('order_list')">查看未完工单</button> 
			</view>


			<view v-if="isAuthor && isGetPhone && status == 'Customer'"
				style="width: 300px;display: flex;justify-content: space-between;position: absolute;bottom: 60px;">
				<text @click="totalNav('history')">查看历史报修</text>
				<text @click="totalNav('order_list')">查看未完工单</text>
			</view>
			
			<!-- <u-modal :show="showLoginBox" :closeOnClickOverlay="false" :showCancelButton="false" @confirm="showLoginBox=false;indexBtn()"
				:title="'点击进行微信授权'" @cancel="showLoginBox=true" @close="showLoginBox=true"></u-modal> -->
			<!-- <u-popup :show="show" mode="top"  @close="close" @open="open">
				<view>
					<text>人生若只如初见，何事秋风悲画扇</text>
				</view>
			</u-popup> -->
		</view>
		<privacyAgreenPop :show.sync="privacyWxPopShow" @handleAgree="handleAgree"></privacyAgreenPop>
	</view>
</template>


<script> 
	export default { 
		data() {
			return {
				code: '', //用户登录的code
				showLoginBox:true,
				isAuthor: false, //用户是否先授权了个人信息    
				show: false, //订阅消息开关
				show2: false, //关注公众号提示
				Author: false, //用户是否已经登录
				type: '', //授权完成后 去维修站或报修列表
				isGetPhone: false,
				status: '',
				privacyWxPopShow:false
			}
		},
		/**
		 *  页面显示时 1.调用小程序登录api  获取code 2.检查是否已经登录  
		 */
		onShow() {
			uni.hideTabBar();
			if(this.$store.state.privacyAgree) {this.privacyWxPopShow = true};
			this.login();
			this.Author = this.$Recipe.checkLogin()
			if (this.Author) {
				this.isAuthor = true ;
				this.isGetPhone = true ;
				// this.getMiniUser();
				this.status = uni.getStorageSync('customertype')
				console.log('driver.page',222,this.status)
				
				if(this.status == 'Distributor'){
					uni.$emit('aEven', '2')
					this.totalNav('Distributor')
				}
				
			}
			
		},
		methods: {
			/**
			 * 提取本地openid 和 phone 调用获取userinfo 接口 将值保存  当借口返回空时  则说明是司机 需要调用插入司机方法  插入成功后再次调用   本方法获取用户信息
			 */
			async getMiniUser(tag) {
				let data = {
					openid: uni.getStorageSync('openid'),
					mobile: uni.getStorageSync('phone')
				}
				const res = await this.$Recipe.getMiniUserInfo(data);
				let len =res.data.length;
				 
				const roleList = res.data.filter(item => {
					if (item.customertype == 'Service_station' || item.customertype == 'Distributor') {
						return item
					}
				})
				console.log('driver')
				console.log(roleList)
				uni.setStorageSync('userRoleList', roleList);
				uni.setStorageSync('userCustomer', '')
				uni.setStorageSync('userService', '')
				// uni.setStorageSync('userDistributor', roleList[0]) 
				
				if (res.data.length == 0) {
					this.updateUserInfo()
					return
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
				} else {
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
				this.nav()
			},
			/**
			 *  登录方法 调用微信登录api 获取code   通过 code调用接口获取 openid session_key  unionid   当获取完成后 再次调用微信登录api 更新code 用于手机授权 解密手机号
			 */
			login() {
				// uni.showLoading({
				// 	title: '登录中...'
				// });
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
				uni.openPrivacyContract({
					success: () => {
									  
					}, // 打开成功
					fail: () => {
									  
					}
				})
				console.log(1111111111)
				
				uni.getUserProfile({
					desc: '用于完善会员资料',
					success: ({
						userInfo
					}) => {
						uni.login({
							provider: '个人信息授权成功',
							success: ({
								code
							}) => {
								this.code = code;
								uni.setStorageSync('nickName', userInfo.nickName)
								uni.setStorageSync('avatarUrl', userInfo.avatarUrl)
								this.isAuthor = true
								if (this.isGetPhone) {
									this.getMiniUser(1)
								}
							},
						});
				
					},
					fail: (err) => {
						console.log(222,err)
						uni.login({
							provider: 'weixin',
							success: ({
								code
							}) => {
								this.code = code;
							},
						});
						this.isAuthor = false
						this.$Recipe.toast('您已拒绝授权登录,请重试')
						this.showLoginBox = true
					}
				});
								        
										
				 
				
			
			},
		
			handleAgree(){
				this.$store.dispatch("getPrivacyAgree")
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
									this.getMiniUser(1)
								}
							})
						},
					});

				} else {
					this.isGetPhone = false
					this.$Recipe.toast('您已拒绝授权获取手机号,请重试')
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
			// nav() {
			// 	if (this.type == 'station') {
			// 		this.totalNav('map')
			// 	} else {
			// 		this.totalNav('order')
			// 	}
				
			// },
			
			nav(type) {
				if (type == 'Service_station') {
					uni.redirectTo({
						url: '/pages/station/lead'
					})
				}
				if (type == 'Customer') {
					uni.redirectTo({
						url: '/pages/login/driver', 
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

<template>
	<view class="mine">

		<!-- 输入框示例 -->
		<uni-popup ref="popup" type="dialog">
			<view class="ad">
				<!-- v-if="stationName!==item.name&&item.customertype!==type" -->
				<!-- <button class="button"   @click="switchBtn(item.customertype,index,item)"
				v-for=" (item,index) in userRoleList" :key="index">
					<span v-if="stationName==item.name&&item.customertype==type" style="color: red;margin-right: 5rpx;" >
						当前
					</span>
				切换-{{item.name}}-{{ item.customertype=="Service_station"?"服务站":(item.customertype=="Distributor"?"中心库":"用户") }}
				</button> -->
				<view v-for=" (item,index) in userRoleList" :key="index">
					<button class="button" v-if="!(stationName==item.name&&item.customertype==type)"
						@click="switchBtn(item.customertype,index,item)">
						切换-{{item.name}}-{{ item.customertype=="Service_station"?"服务站":(item.customertype=="Distributor"?"中心库":"用户") }}
					</button>
				</view>
			</view>
		</uni-popup>





		<!-- 	<view v-if="showType==2 && isShow" class="changeBox" @click.native="changeNav('station')">切换至服务站</view>
		<view v-if="showType==1 && isShow" class="changeBox" @click.native="changeNav('agent')">切换至中心库</view> -->

		<!-- 用户信息 -->
		<view class="user-info" @click="totalNav('user_info')" style="margin-top: 10rpx;">
			<view class="flex flex-ai-c flex-js-c flex-dir-c" style="width: 100%;height: 145px;">
				<image :src="avatart" mode="widthFix" style="width: 70px;height: 70px;"></image>
				<text style="margin: 10px 0;" @click.stop="toggleShow">{{name}}</text>
				<text v-if="type !== 'Customer'" @click.stop="toggleShow">{{stationName}}</text>
				<span style="color: red;" @click.stop="toggleShow" v-if="userRoleList.length>1">

					<span v-if="type == 'Service_station'">当前为服务站（点击切换身份）</span>
					<span v-if="type == 'Distributor'">当前为中心库（点击切换身份）</span>
					<span v-if="type == 'Customer'">用户</span>
					<!-- <span>切换身份</span> -->
					<uni-icons type="tune" size="16" style="padding-left: 10rpx;"></uni-icons>
				</span>
			</view>
		</view>
		<!-- 我的消息 -->
		<u-cell-group>
			<u-cell :isLink="true" @click.native="totalNav(item.nav,item.type)" v-for="(item,index) in cellList"
				v-if="item.type == 'all' || item.type == type" :key='item.value'>
				<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
					<view style="width: 33px;height: 33px;display: flex;justify-content: center;align-items: center;">
						<image :src="item.image" style="width: 24px;height: 24px;" v-if="item.mode == 'small'" mode="">
						</image>
						<image :src="item.image" style="width: 18px;height: 18px;" v-if="item.mode == 'medium'" mode="">
						</image>
					</view>
					<text>{{item.value}}</text>
				</view>
			</u-cell>
		</u-cell-group>
		<!-- 引导关注公众号 -->
		<view class="tips"
			style="padding: 25px 0;display: flex;flex-direction: column;align-items: center;font-size: 14px;">
			<text>关注"重油高科"公众号</text>
			<text>及时获取报修审核及维修相关消息</text>
			<!-- <image src="https://cy.klwsxx.com//Images/2022-06-01/BXYMSC,CPTP-VQPXSDh2UGeUb7afef96.jpg" @click="preview()"
				style="width: 200px;height: 200px;" mode=""></image> -->

			<image src="../../../static/CYGK_logo.jpg" @click="preview()" style="width: 200px;height: 200px;" mode="">
			</image>
			<view style="width: 100%;height: 20px;line-height: 20px;text-align: center;">
				cyefi-cn
			</view>
			<view style="width: 100%;height: 20px;line-height: 20px;text-align: center;">
				1.0.70 20250425
			</view>
		</view>

		<!-- 重新登录 -->
		<u-modal :show="showLoginOut" :closeOnClickOverlay="false" :showCancelButton="false" @confirm="showLoginPage()"
			:title="'当前登录身份已失效，请重新登录'" @cancel="showLoginOut=false" @close="showLoginOut=false"></u-modal>


		<tab-bar @tab='tab' :current='2'></tab-bar>

	</view>
</template>
<script>
	import cellList from './data.js'
	export default {
		data() {
			return {
				type: 'Customer', //用户类型
				name: '', //用户微信昵称
				avatart: '', //用户微信头像
				stationName: '', //服务站名称
				// RoleCount: uni.getStorageSync('userRoleCount'),
				cellList, //cell列表数组
				isShow: false,
				showType: 1,
				userRoleList: [],
				FCustID: '',
				showLoginOut: false,
			}
		},
		/**
		 * 检查登录
		 */
		onShow() {
			this.$Recipe.checkLogin(true)
			this.type = uni.getStorageSync('customertype');
			this.stationName = uni.getStorageSync('stationName');
			this.FCustID = uni.getStorageSync('Fnumber');
			this.userRoleList = uni.getStorageSync('userRoleList')
			this.getMiniUser();
		},
		/**
		 * 从缓存中获取个人信息
		 */
		onLoad() {
			this.init();

		},
		onPullDownRefresh() {
			this.getMiniUser()
		},
		methods: {
			init() {
				this.userRoleList = uni.getStorageSync('userRoleList')

				console.log(this.userRoleList)

				this.type = uni.getStorageSync('customertype')
				this.avatart = uni.getStorageSync('avatarUrl')
				this.name = uni.getStorageSync('nickName')
				this.showType = getApp().globalData.index
				let us = uni.getStorageSync('userService')
				let ud = uni.getStorageSync('userDistributor')
				if (us !== '' && ud !== '') {
					this.isShow = true
				}
			},


			/**
			 * 提取本地openid 和 phone 调用获取userinfo 接口 将值保存  当借口返回空时  则说明是司机 需要调用插入司机方法  插入成功后再次调用   本方法获取用户信息
			 */
			async getMiniUser() {
				let data = {
					openid: uni.getStorageSync('openid'),
					mobile: uni.getStorageSync('phone')
				}
				const res = await this.$Recipe.getMiniUserInfo(data);
                console.log('接口返回的用户角色数据:', res.data);
				let len = res.data.length;
				if (len == 0) {
					// uni.$emit('aEvenReInit', '2')

					// uni.setStorageSync('userRoleList', roleList);
					// uni.setStorageSync('userCustomer', '')
					// uni.setStorageSync('userService', '')

					this.showLoginOut = true;
					return
				}
				const roleList = res.data.filter(item => {
					if (item.customertype == 'Service_station' || item.customertype == 'Distributor') {
						return item
					}
				})

				let oldRoleList = uni.getStorageSync('userRoleList');
				if (JSON.stringify(oldRoleList) == JSON.stringify(roleList)) {
					return
				} else {
					this.showLoginOut = true;
					return
				}
				// uni.$emit('aEvenReInit', '2')

				// uni.setStorageSync('userRoleList', roleList);
				// uni.setStorageSync('userCustomer', '')
				// uni.setStorageSync('userService', '') 
				// if (len == 0) {  
				// 	this.showLoginOut = true;
				// 	return
				// }
				// if (len == 1) {

				// 	uni.setStorageSync('customertype', res.data[0].customertype)
				// 	uni.setStorageSync('Fnumber', res.data[0].FCustID)
				// 	uni.setStorageSync('userNumber', res.data[0].number)
				//  uni.setStorageSync('userNumberToken', res.data[0].usernumber)
				// 	uni.setStorageSync('FISADMIN', res.data[0].FISADMIN)
				// 	if (res.data[0].customertype == 'Service_station') {
				// 		uni.setStorageSync('stationName', res.data[0].name)
				// 		if (!res.data[0].openid.replace(' ', '')) {
				// 			let data = {
				// 				FName: res.data[0].username,
				// 				FTEL: uni.getStorageSync('phone'),
				// 				unionid: uni.getStorageSync('unionid'),
				// 				openid: uni.getStorageSync('openid'),
				// 				fnumber: res.data[0].usernumber
				// 			}
				// 			let res3 = await this.$Recipe.InsertServiceCustomer(data)
				// 		}
				// 	} 

				// }


				// if (len > 1) {


				// 	let type1 = 0;
				// 	let type2 = 0;
				// 	let type3 = 0;
				// 	for (let i = 0; i < len; i++) {
				// 		if ('Customer' == res.data[i].customertype) {
				// 			type1 = i
				// 			uni.setStorageSync('userCustomer', res.data[i])
				// 		}
				// 		if ('Service_station' == res.data[i].customertype) {
				// 			type2 = i
				// 			uni.setStorageSync('userService', res.data[i])
				// 		}
				// 		if ('Distributor' == res.data[i].customertype) {
				// 			type3 = i
				// 			uni.setStorageSync('userDistributor', res.data[i])
				// 		}
				// 	}
				// 	if (type2 > 0) {
				// 		uni.setStorageSync('customertype', res.data[type2].customertype)
				// 		uni.setStorageSync('Fnumber', res.data[type2].FCustID)
				// 		uni.setStorageSync('userNumber', res.data[type2].number)
				// 		uni.setStorageSync('userNumberToken', res.data[type2].usernumber)
				// 		uni.setStorageSync('stationName', res.data[type2].name)
				// 		uni.setStorageSync('FISADMIN', res.data[type2].FISADMIN)
				// 	} else {
				// 		uni.setStorageSync('customertype', res.data[type3].customertype)
				// 		uni.setStorageSync('stationName', res.data[type3].name)
				// 		uni.setStorageSync('Fnumber', res.data[type3].FCustID)
				// 		uni.setStorageSync('userNumber', res.data[type3].number)
				// 		uni.setStorageSync('userNumberToken', res.data[type3].usernumber)
				// 		uni.setStorageSync('FISADMIN', res.data[type3].FISADMIN)
				// 	}


				// }




				// uni.stopPullDownRefresh();
				// this.init()
			},

			toggleShow() {
				if (this.userRoleList.length <= 1) return;
				this.$refs.popup.open('center')
			},
			/**
			 * 预览图片
			 */

			preview() {
				uni.previewImage({
					urls: ['https://cy.klwsxx.com//Images/2022-06-01/BXYMSC,CPTP-VQPXSDh2UGeUb7afef96.jpg'],
					// urls: ['../../../static/CYGK_logo.jpg'],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			switchBtn(type, index, item) {
				if (item.name == this.stationName && item.customertype == this.type) {
					uni.showToast({
						icon: 'none',
						title: '切换身份已是当前身份'
					})

					return
				}
				const data = this.userRoleList[index];

				switch (type) {
					case 'Customer': //用户
						break;
					case 'Service_station': //服务站
						this.stationName = data.name
						this.totalNav(type)
						break;
					case 'Distributor': //中心库
						break;
					default:
						break;
				}
				if (type == 'Distributor') {
					uni.$emit('aEven', '2')
				} else {
					uni.$emit('aEven', '1')
				}
				this.type = type;
				uni.setStorageSync('Fnumber', data.FCustID)
				uni.setStorageSync('userNumber', data.number)
				uni.setStorageSync('userNumberToken', data.usernumber)
				uni.setStorageSync('FISADMIN', data.FISADMIN)
				uni.setStorageSync('stationName', data.name)
				uni.setStorageSync('customertype', type)

				this.totalNav(type)
				this.$refs.popup.close('center')
			},

			changeNav(type) {
				let num = 1;
				if (type == 'agent') {
					num = 2
				}
				this.showType = num
				uni.$emit('aEven', num)
				this.totalNav(type)
			},
			/**
			 * 总路由
			 */
			totalNav(type, val) {
				console.log(type);
				console.log(111, val);
				switch (type) {
					case 'message':
						this.$Router.navigateTo({
							url: this.$Router.message.index
						})
						break;
					case 'history':
						this.$Router.navigateTo({
							url: this.$Router.history.index
						})
						break;
					case 'user':
						this.$Router.navigateTo({
							url: this.$Router.my.user
						})
						break;
					case 'map':
						this.$Router.navigateTo({
							url: this.$Router.station.map
						})
						break;
					case 'bill':
						this.$Router.navigateTo({
							url: this.$Router.station.station_bill
						})
						break;
					case 'setting':
						this.$Router.navigateTo({
							url: this.$Router.my.setting
						})
						break
					case 'user_info':
						this.$Router.navigateTo({
							url: this.$Router.my.userinfo
						})
						break
					case 'my_order_bh':
						this.$Router.navigateTo({
							url: this.$Router.my.myorderbh
						})
						break
					case 'my_order_bh_zxk':
						this.$Router.navigateTo({
							url: this.$Router.my.myorderbhzxk
						})
						break
					case 'addcost':
						this.$Router.navigateTo({
							url: this.$Router.history.addcost
						})
						break
					case 'othercost':
						this.$Router.navigateTo({
							url: this.$Router.history.othercost
						})
						break
					case 'costinfo':
						this.$Router.navigateTo({
							url: this.$Router.history.costinfo
						})
						break

					case 'Statement_zxk':
						this.$Router.navigateTo({
							url: this.$Router.agent.Statement_zxk
						})
						break
					case 'Statement':
						this.$Router.navigateTo({
							url: this.$Router.agent.Statement
						})
						break
					case 'Distributor':
						this.$Router.switchTab({
							url: this.$Router.agent.index
						})
						break;

						// case 'Customer':
						// this.$Router.switchTab({
						// 	url: this.$Router.login.index
						// })
						// break;
					case 'Service_station':
						this.$Router.navigateTo({
							url: this.$Router.station.login
						})
						break;
				}
			},


			/**
			 * 退出登录
			 */
			showLoginPage() {
				this.showLoginOut = false;
				/** 清理缓存  **/
				uni.removeStorageSync('openid');
				uni.removeStorageSync('userRoleList');
				uni.removeStorageSync('phone');
				uni.removeStorageSync('avatarUrl');
				uni.removeStorageSync('nickName');
				uni.removeStorageSync('unionid');
				uni.removeStorageSync('userNumber');
				uni.removeStorageSync('Fnumber');
				uni.removeStorageSync('customertype');
				uni.removeStorageSync('FISADMIN');
				uni.clearStorage();
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},


		}
	}
</script>

<style lang="scss" scoped>
	.ad {
		width: 680rpx;
		background-color: white;
		border-radius: 10rpx;
		padding: 20rpx;

		.button {
			margin: 10rpx 0;
			font-size: 28rpx;
		}
	}

	.mine {
		height: 80%;
		background-color: #FFFFFF;
		padding-bottom: 100rpx;
	}
</style>
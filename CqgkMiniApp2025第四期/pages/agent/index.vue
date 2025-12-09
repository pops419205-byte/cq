<template>
	<view class="page">

		<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false"
			:scroll-into-view="scrollInto">
			<view v-for="(tab,index) in items" :key="index" class="uni-tab-item" :id="index" :data-current="index"
				@click="ontabtap">
				<text class="uni-tab-item-title"
					:class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab}}</text>
			</view>
		</scroll-view>

		<scroll-view style="height: calc( 100vh - 32px ) ;" scroll-y="true" refresher-enabled="true"
			:refresher-triggered="triggered" :refresher-threshold="100" @refresherrefresh="onRefresh"
			@refresherrestore="onRestore" :scroll-into-view="FBillNo" scroll-with-animation='true'>
			<template>
				<view style="height: 40px;width: 100%;margin-bottom: 5px;"></view>
				<view class="card" v-for="(item,index) in listArr" :key='index'>
					<!-- 卡片头部-产品名称 -->
					<view class="head" @click="infoBtn(item.FBILLNO)">
						<view class="left">
							<text class="materiel-name">工单编号: {{item.FWORDERNO }}</text>
						</view>
					</view>
					<!-- 工单信息 -->
					<view class="middle" @click="infoBtn(item.FBILLNO)">
						<view style="display: flex;flex-direction: column;width: 100%;">
							<view class="new-item">
								<image src="@/static/user.png" mode=""></image>
								<text class="left">收货人:</text>
								<text class="right">{{item.FRECEIVERUSER}}</text>
							</view>
							<view class="new-item">
								<image src="@/static/info_number.png" mode=""></image>
								<text class="left">电话号:</text>
								<text class="right">{{item.FRECEIVERTEL}}</text>
							</view>
							<view class="new-item">
								<image src="@/static/info_location.png" mode=""></image>
								<text class="left">服务站点:</text>
								<text class="right">{{ item['FRECEIVER.FNAME'] }}</text>
							</view>
						</view>

					</view>

				</view>
				<view style="width: 100%;height: 30px;background: #fff;"> </view>
			</template>
		</scroll-view>
		<view v-if="listArr.length == 0"
			style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);color: gray;">
			{{_freshing?'正在刷新':'当前暂无工单'}}
		</view>


		<!-- 重新登录 -->
		<u-modal :show="showLoginOut" :closeOnClickOverlay="false" :showCancelButton="false" @confirm="showLoginPage()"
			:title="'当前登录身份已失效，请重新登录'" @cancel="showLoginOut=false" @close="showLoginOut=false"></u-modal>


		<tab-bar @tab='tab' :current='0'></tab-bar>

	</view>
</template>


<script>
	let t = '';
	export default {
		data() {
			return {
				triggered: false,
				_freshing: false,
				showLoginOut: false, //重新登录
				tabIndex: 0,
				items: ['未发货', '已发货'],
				listArr: [],
				Icon1: {
					color: '#4cd964',
					size: '22',
					type: 'calendar'
				},
				Icon2: {
					color: '#4cd964',
					size: '22',
					type: 'vip'
				},
				Icon3: {
					color: '#4cd964',
					size: '22',
					type: 'loop'
				},
				Icon4: {
					color: '#4cd964',
					size: '22',
					type: 'location'
				},
				FBillNo: '',
			}
		},
		onReady() {

		},
		onShow() {

			uni.hideTabBar()
			this.$Recipe.checkLogin(true)
			this.getMiniUser();

			this.initF();
		},
		onLoad() {
			uni.$on('reLoadAgent', data => {
				console.log(111111111111, 22222222222, 33333333)
				uni.showToast({
					icon: 'none',
					title: '发货成功'
				})
				this.initF();
			})
		},
		methods: {
			init() {

			},

			async onRefresh() {
				if (this._freshing) return;

				this._freshing = true;
				if (!this.triggered) //界面下拉触发，triggered可能不是true，要设为true  
					this.triggered = true;
				this.listArr.splice(0)
				await this.initF()
				this.triggered = false;
				this._freshing = false;
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
			},
			//中心库 查发货单
			initF() {
				this._freshing = true
				uni.showLoading({
					title: '加载中'
				});
				let _this = this;
				let status = 'C';

				let data = {
					FNUMBER: uni.getStorageSync('userNumber'),
					FWORDERSTATUS: 1,
					FDocumentStatus: status
				}
				if (_this.tabIndex == 1) {
					data.FDocumentStatus = status
				} else {
					data.FDocumentStatus = 'B'
					// delete  data.FDocumentStatus
				}

				_this.$Recipe.GetAllSend(data).then((res) => {
					_this.listArr = res.data
					uni.hideLoading();
					_this._freshing = false;
					console.log("list-", res.data)
					let MSG_TYPE = uni.getStorageSync('MSG_TYPE')
					let MSG_INFO = uni.getStorageSync('MSG_INFO')

					console.log("?MSG_INFO:", MSG_INFO);
					if (MSG_TYPE == 'distributor') {
						if (MSG_INFO) {
							_this.FBillNo = MSG_INFO.FBillNo
							uni.setStorageSync('MSG_INFO', '')
						}
					}
				})
			},
			//中心库 查补货单
			initB() {
				let _this = this;
				let data = {
					FNUMBER: uni.getStorageSync('userNumber'),
					FWORDERSTATUS: 2
				}
				_this.$Recipe.GetAllSend(data).then((res) => {
					_this.listArr = res.data
				})
			},
			//中心库 查结算单
			initJ() {
				this.listArr = [];
				// let _this = this ;
				// let data = {
				// 	FNUMBER:uni.getStorageSync('userNumber'),
				// 	FWORDERSTATUS:3
				// }  
				// _this.$Recipe.GetAllSend(data).then((res) => {
				// 	_this.listArr = res.data  
				// })
			},
			infoBtn(num) {
				let url = this.$Router.agent.Invoiceing + '?FWORDERNO=' + num + '&tabIndex=' + this.tabIndex;
				if (this.tabIndex == 1) url = this.$Router.agent.Invoiced + '?FWORDERNO=' + num + '&tabIndex=' + this
					.tabIndex;
				this.$Router.navigateTo({
					url: url
				})
				// uni.navigateTo({
				// 	url: url
				// })
			},

			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.tabIndex = index
				this.initF();
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

				let len = res.data.length;
				if (len == 0) {
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
			},

		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #fff;
		position: relative;
		height: 100vh;
	}

	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding-left: 34rpx;
		padding-right: 34rpx;
	}

	.uni-tab-item-title {
		color: #555;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title-active {
		color: #007AFF;
	}

	.card {
		margin: 8px auto;
		box-sizing: border-box;
		padding: 14rpx 20rpx;
		font-size: 20rpx;
		background-color: #fff;
		box-shadow: 0 4rpx 8rpx 0 #e3eef5;
		border-radius: 10rpx;
		border: 4rpx solid #e3eef5;
		width: 95%;

		.head {
			margin-bottom: 16rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.materiel-name {
					font-size: 28rpx;
					color: #030303;
				}
			}
		}

		.middle {
			margin-bottom: 8rpx;
			display: flex;
			flex-wrap: wrap;
			font-size: 26rpx;

			.item {
				padding-bottom: 8rpx;
				width: 50%;
				font-size: 24rpx;

				.left {
					padding-right: 16rpx;
					color: #707070;
				}

				.right {
					color: #666666;
				}
			}

			.new-item {
				padding-bottom: 16rpx;
				font-size: 28rpx;
				width: 100%;
				display: flex;
				align-items: center;

				image {
					width: 20px;
					height: 20px;
				}

				.left {
					padding-right: 16rpx;
					padding-left: 16rpx;
					color: #707070;
				}

				.right {
					color: #666666;
				}
			}

		}

		.bottom {
			display: flex;
			align-items: center;
			margin-top: 10rpx;

			.label-wrap {
				display: flex;
				margin-right: 20rpx;

				text {
					margin-right: 28rpx;
					padding: 6rpx 18rpx;
					display: flex;
					background: #169BD5;
					border-radius: 10rpx;
					font-size: 20rpx;
					height: 25px;
					color: #fff;
					justify-content: center;
					align-items: center;
				}
			}
		}

		&:first-child {
			margin-top: 0;
		}
	}

	.scroll-h {
		position: fixed;
		z-index: 99;
		top: 0;
		background: #fff;
	}
</style>
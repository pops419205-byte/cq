<template>
	<view class="page">
		<!-- 退出登录 -->
		<view style="width: 100%;position: absolute; top: 50px;left: 0;height: 200px; " >
			<view class="tiit">  {{stationName}} </view>
			<view class="tiit"> {{addr}} </view>
		</view>
		<view class="btn" @click="chooseLocation" v-if="type=='Service_station'"
			style="width: 240px;height: 50px;top:-150px;display: flex;justify-content: center;align-items: center;background-color: #169BD5;border-radius: 5px;color: #FFFFFF">
			重新标注服务站位置
		</view>
		<view class="btn" @click="quit"
			style="width: 240px;height: 40px;display: flex;justify-content: center;align-items: center;background-color: #169BD5;border-radius: 5px;color: #FFFFFF">
			退出登录
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'Customer', //用户类型
				stationName:"",
				notice:'0',
				resss:'',
				lng:'',
				lat:'',
				addr:''
			}
		},
		onShow() { 
			this.type = uni.getStorageSync('customertype');  
			this.stationName = uni.getStorageSync('stationName');  
			this.init()
		},
		methods: {
			
			async init(){
				const {data} = await this.$Recipe.getFuwuzhanxinxi({  fnumber:uni.getStorageSync('userNumber')},"post");
				let _data  =  data[0];
				this.addr = _data.FAddress 
			},
			/**
			 * 退出登录
			 */
			quit() {
				let type = uni.getStorageSync('customertype')
					this.reset()
					uni.redirectTo({
						url: '/pages/login/login'
					})
			},
			/**
			 * 清理缓存
			 */
			reset() {
				// 
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
			},
			
			chooseLocation() {
				let _this = this ;
				 uni.getSystemInfo({
				 	success({
				 		locationEnabled,
				 		locationAuthorized
				 	}) {
				 		// locationEnabled 判断手机定位服务是否开启
				 		// locationAuthorized 判断定位服务是否允许微信授权
				 		if (!locationEnabled && !locationAuthorized) {
				 			// GPS未开启 与 GPS未给微信授权定位服务
				 			_this.$Recipe.toast(' GPS定位服务未开启')
				 		} else if (locationEnabled && !locationAuthorized) {
				 			// GPS已开启 与 GPS未给微信授权定位服务
				 			_this.$Recipe.toast(' GPS未授权定位服务')
				 		} else if (locationEnabled && locationAuthorized) {
				 			/* 
				 				GPS已开启 与 GPS已给微信授权定位服务
				 				判断微信小程序位置信息是否开启
				 			*/
				 			uni.authorize({
				 				scope: "scope.userLocation",
				 				success() {
				 					// 微信小程序位置信息已开启 
				 					 uni.getLocation({
				 					 	type: 'wgs84',
				 					 	success: (res) => {
				 					 		 //  _this.notice = JSON.stringify(res)
											   // _this.resss = res.errMsg
											   // _this.lng = res.longitude
											   // _this.lat = res.latitude
				 					 		uni.chooseLocation({
				 					 			latitude: res.latitude,
				 					 			longitude: res.longitude,
				 					 			success: (result) => { 
													console.log(1111,result)
				 					 				// _this.formData.FREPAIRSITE = result.address
				 					 				// _this.formData.FLongitude_latitude = result.longitude + ',' + result
				 					 				// 	.latitude
													 
													 if(result.address){ 
														 let data = {
														 	custnumber:uni.getStorageSync('userNumber'), 
														 	latitude:result.latitude,
														 	longitude:result.longitude,
														 	address:result.address
														 }   
														 console.log(222,data)	 
														 // return
														 _this.$Recipe.UpdateLocation(data).then((res) => {
														 	console.log(res) 
															_this.init() 
														 	_this.$Recipe.toast(' 操作成功！ ')
														 })
													 }else{
														_this.$Recipe.toast(' 地址未选择，请重新操作！ ') 
													 }
				 					 			}
				 					 		});
				 					 	},fail: (err) => { 
				 					 		_this.$Recipe.toast('位置信息未开启,请打开小程序 设置-位置信息') 
				 					 	}
				 					 });
				 				},
				 				fail() {
				 					// 微信小程序位置信息未开启
				 					_this.$Recipe.toast('位置信息未开启,请打开小程序 设置-位置信息')  
				 				}
				 			})
				 		}
				 	},fail(err) {
				 		 
				 	}
				 })
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		height: 100vh;
		position: relative;

		.btn {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin: auto;
		}
	}
	.tiit {
		text-align: center;
		height: 32px;
		line-height: 32px;
	}
</style>

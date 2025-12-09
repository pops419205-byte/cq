<template>
	<view class="">
		<view>
			<u-search :show-action="true" actionText="搜索" placeholder:='请输入服务站名称' @input='filter' @search="filter" :animation="true">
			</u-search>
		</view>
		<view>
			<uni-card padding="0" style="margin-top: 60px;" v-for="(item,index) in showList" :key='item.Fname'>
				<view class="item" style="display: flex;padding: 10px 0;">
					<view class="left" style="display: flex;align-items: center;margin-top: 10px;width: 80%;"
						@click="toStationInfo(item)">
						<image src="../../static/address.png" mode="aspectFill" style="width: 25px;height: 30px;">
						</image>
						<view class="station"
							style="display: flex;flex-direction: column;font-size: 14px;margin-left: 10px;">
							<text style="font-weight: bold;">{{item.Fname}}</text>
							<text>{{item.Faddress}}</text>
						</view>
					</view>
					<view class="right"
						style="width: 20%;display: flex;align-items: center;justify-content: center;flex-direction: column;">
						<text style="color: #2979FF;" @click="toStationMap(item)">去这里</text>
						<text style="font-size: 12px;"> {{item.dis}}</text>
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {	
			return {
				latitude: '',
				longitude: '',
				stationList: [],
				showList: []
			}
		},
		onShow: function() {
			var that = this;
			uni.getLocation({
				type: 'gcj02',
				success: async function(res) {
					that.longitude = res.longitude
					that.latitude = res.latitude
					 
					var location = that.longitude + ',' + that.latitude
					const result = await that.$Recipe.GetServiceStationLength({
						Latitude: res.longitude + '',
						Longitude: res.latitude + ''
					})
					 
					that.stationList = result.data
					that.showList = [...result.data]
				},
				fail:e=>{
					   
						this.stationList.splice(0)
					    // 判断用户是否拒绝了授权
					    wx.getSetting({
					      success: res => {
					        if (typeof(res.authSetting['scope.userLocation']) != 'undefined' && !res.authSetting['scope.userLocation']) {
					          // 用户拒绝了授权
					          wx.showModal({
					            title: '提示',
					            content: '您拒绝了定位权限，将无法查看附近的服务站',
					            success: res => {
					              if (res.confirm) {
					                // 跳转设置页面
					                wx.openSetting({
					                  success: res => {
					                    if (res.authSetting['scope.userLocation']) {
					                      // 授权成功，重新定位
					                      wx.getLocation({
					                        success: res => {}
					                      });
					                    } else {
					                      // 没有允许定位权限
					                      wx.showToast({
					                        title: '您拒绝了定位权限，将无法查看附近的服务站',
					                        icon: 'none'
					                      });
					                    }
					                  }
					                });
					              }
					            }
					          });
					        }
					      }
					    });
				}
			});
		},
		methods: {
			filter(e) {
				 
				this.showList = this.stationList.filter((item, index) => {
					return item.Fname.indexOf(e) != -1
				})
				this.showList = this.showList.splice(0, 10)
			},
			toStationInfo(item) {
				uni.navigateTo({
					url: '/pages/station/info?obj=' + encodeURIComponent(JSON.stringify(item))
				})
			},
			toStationMap(item) {
				const that = this;
				uni.openLocation({
					latitude: item.F_Longitude,
					longitude: item.FLatitude_New,
					name: item.Fname,
					success: function() {
						console.log('success');
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.map_container {
		position: absolute;
		top: 0;
		bottom: 40%;
		left: 0;
		right: 0;
	}

	.map {
		width: 100%;
		height: 100%;
	}

	.map_text {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0rpx;
		height: 40%;
		background: #fff;
		padding: 5px 0 0 0;
		overflow: scroll;
	}

	.search-box {
		position: fixed;
		top: 60%;
		left: 0;
		right: 0;
		height: 50rpx;
		background-color: #FFFFFF;
		z-index: 999;
		margin: 15rpx 40rpx;
	}

	.text_box {
		margin: 10rpx 20rpx;
		display: block;
		font-size: 24rpx;
	}

	.uni-easyinput-box {
		position: fixed;
		left: 0;
		top: 60%;
		width: calc(100% - 30px);
		background: #fefefe;
		z-index: 99;
		margin: 0 15px;
	}
</style>

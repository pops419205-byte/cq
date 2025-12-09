<template>
	<view>
		<!-- 服务站名称 -->
		<view class="title" style="padding:15px 0 0 15px ;font-weight: bold;">
			{{info.Fname}}
		</view>
		<!-- 服务站地址 -->
		<view class=""
			style="display: flex;padding: 0 15px;height: 60px;margin-top: 30px;justify-content: space-between;">
			<view class="left" style="display: flex;">
				<image src="../../static/address.png" style="width: 25px;height: 25px;" mode=""></image>
				<text style="width: 235px;font-size: 14px;">{{info.Faddress}}</text>
			</view>
			<view class="right">
				<text
					style="display: flex; font-size: 12px;color: #1785FF;width: 80px;line-height: 20px;margin-left: 10px;"
					@click="toNav">去这里</text>
			</view>
		</view>
		<!-- 服务站电话 -->
		<view class="" style="display: flex;justify-content: space-around;margin-top: 15px; color:blue;">
			<view class="" style="display: flex; justify-content: center;align-items: center;" @click="call(info.Ftel)"  >
				<image src="../../static/mobile.png" mode="" style="width: 25px;height: 25px;"></image>
				<text style="margin-left: 10px;">{{info.Ftel}}</text>
			</view>
			<view class="" style="display: flex; justify-content: center;align-items: center;"
				
				@click="call(info.FServiceTel)"
				>
				<image src="../../static/phone.png" mode="" style="width: 25px;height: 25px;"></image>
				<text style="margin-left: 10px;">{{info.FServiceTel}}</text>
			</view>
		</view>
		<button type="warning" class="addbtn" @click="orderAddBtn"  v-if="type==1">立即报修</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				Icon1: {
					color: '#4cd964',
					size: '22',
					type: 'location'
				},
				Icon2: {
					color: '#4cd964',
					size: '22',
					type: 'phone'
				},
				type:'1',
				info: null
			};
		},
	async	onLoad(option) {
           			// getSupllier
					console.log(22222,option)
		   if(option.obj){
			   this.info = JSON.parse(decodeURIComponent(option.obj));
					console.log(33333, this.info)
			   this.type = 2;
		   }else{
					console.log(44444 )
			   const {data} = await this.$Recipe.getFuwuzhanxinxi({  fnumber:option.id},"post");
			   let _data  =  data[0];
			    
				_data.Fname=_data.name
				_data.Faddress=_data.FAddress;
				_data.FLatitude_New=Number(_data.FLATITUDE_NEW);
				_data.F_Longitude=Number(_data.F_LONGITUDE);
				_data.Ftel=_data.FTel;
				_data.FServiceTel=_data.FSERVICETEL;
				this.info = _data
				this.type = 2;
				
				
			   
		   }
			
		},
		methods: {
			orderAddBtn() {
				uni.switchTab({
					url: '/pages/tabBar/order/index'
				})
			},
			call(phone) {
				if (!phone) {
					return
				}
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			toNav() {
				let that = this ;
				
				console.log(3333, that.info.F_Longitude )
				console.log(4444, that.info.FLatitude_New )
						uni.openLocation({
							latitude: that.info.F_Longitude,
							longitude: that.info.FLatitude_New,
							name: that.info.Fname,
							success: function() {
								console.log('success');
							}
						});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.addbtn {
		position: fixed;
		left: 10%;
		width: 80%;
		bottom: 10px;
		color: #FFFFFF;
		z-index: 99;
		background-color: #169BD5;
	}

	.to-station {
		position: fixed;
		left: 10%;
		width: 80%;
		bottom: 70px;
		color: #FFFFFF;
		z-index: 99;
		background-color: #169BD5;
	}
</style>

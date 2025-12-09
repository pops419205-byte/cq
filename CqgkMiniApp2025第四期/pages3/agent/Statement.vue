<template>
	<view class="">
	<view class="bg-image-box">     
		<uni-card  title="账款查询" class="top-card" bgcolor="#8BC34A">
			<u-row style="padding: 0 20rpx;text-align: center;color: #fff;">
				<u-col span="3">
					<view class="zk-top-1">{{  forMateData(info,'periodbegin') }}</view>
					<view class="zk-top-2">期初账款</view>
				</u-col>
				<u-col span="3">
					<view class="zk-top-1">{{ forMateData(info,'onaccount') }}</view>
					<view class="zk-top-2">已挂账</view>
				</u-col>
				<u-col span="3">
					<view class="zk-top-1 blue">{{forMateData(info,'paid') }}</view>
					<view class="zk-top-2 blue">已付款</view>
				</u-col>
				<u-col span="3">
					<view class="zk-top-1 red">{{ forMateData(info,'balance') }}</view>
					<view class="zk-top-2 red">余额</view>
				</u-col>
				<!-- <u-col span="3">
					<view class="zk-top-1 red">{{WEIFU}}</view>
					<view class="zk-top-2 red">未付款</view>
				</u-col> -->
			</u-row>
		
		</uni-card>
		 
		<uni-card  title="账款结算">
			<uni-forms ref="baseForm" :modelValue="formData">
				<uni-forms-item label="结算时间">
					<!-- <uni-datetime-picker  placeholder="请选择结算时间" :showSale="false" type="datetime" hide-second="true" :clearIcon="false" @change="getNewList"
						v-model="formData.time" /> -->
						
						<picker mode="date" class="picker-style" selector-type="select" start="2021-01-01" end="2999-12-20" fields="year" :value="formData.time"  @change="bindDateChange">
							<view class="uni-input">{{formData.time}}</view>
						</picker>
						
				</uni-forms-item> 
			</uni-forms>  
		</uni-card> 
		
		</view>
		<!-- 结算单信息 -->
		<view style="overflow-y: auto;margin-top: 270px;">
			 <uni-card v-for="(item,index) in list" :key='index'> 
				<view class="middle"  @click="orderBtn(item)">
					<view style="display: flex;flex-direction: column;width: 100%;">
						<view class="new-item">
							<image src="@/static/order_status_new.png" mode=""></image>
							<text class="left">结算单号:</text>
							<text class="right">{{item.FBillNo}}</text>
						</view>
						<view class="new-item">
							<image src="@/static/info_number.png" mode=""></image>
							<text class="left">结算时间:</text>
							<text class="right">{{item.FSETTLETSTARTDATE.slice(0,10)}} ~ {{item.FSELLTEENDDATE.slice(0,10)}}</text>
						</view>
						<view class="new-item">
							<image src="@/static/user.png" mode=""></image>
							<text class="left">结算金额:</text>
							<text class="right">¥{{ Math.round(item.FSettlementMoney * 100) / 100 }}</text>
						</view>
						<view class="new-item">
							<image src="@/static/info_time.png" mode=""></image>
							<text class="left">开票状态:</text>
							<text class="right">{{item.FSettlementPay == '1'?'已开票':'未开票'}}</text>
						</view>
						<!-- <view class="new-item">
							<image src="@/static/info_location.png" mode=""></image>
							<text class="left">收票状态:</text>
							<text class="right">item.FAMOUNT</text>
						</view> -->
					</view>
				</view>
			</uni-card>
				
		</view>
		 
		 	
	</view>
</template>


<script>
	 
	let t = '';
	export default {
		data() {
			return { 
				formData:{
					time:new Date().getFullYear()
				},
				info:[],
				list:[],
				WEIFU:0
			}
		},  
		onReady() {
			 
		},
		onShow() {
			this.getlist();  
		},
		onLoad() { 
			this.init(); 
			this.getlist(); 
			console.log(this.formData.time)
		},
		methods: {   
			forMateData(arr,field){
				if(!arr || !arr.length){
					return '0.00'
				}
				let value =  Number.parseFloat(arr[0][field])
				console.log(value,'value')
				
				if(isNaN(value)){
					return '0.00'
				}
				
				return value.toFixed(2)
			},
			init(){ 
				let _this = this ;
				// let data = {
				// 	serviceid:uni.getStorageSync('Fnumber')
				// }  
				
				let data = {
					supplier:[uni.getStorageSync('userNumber')],
					year: this.formData.time
				}  
				
				
				
				_this.$Recipe.QueryAssistactBalance(data).then((res) => {
					_this.info = res.data.data
					// _this.WEIFU = 0
				})
				
				return
				_this.$Recipe.SettlementInfo(data).then((res) => { 
					_this.info = res.data 
					// _this.WEIFU = 0
				})
			},
			//列表
			getlist(){ 
				let _this = this ;
				let data = {
					FNUMBER:uni.getStorageSync('userNumber'),
					FDocumentStatus:'C',
					time:this.formData.time
				}  
				uni.showLoading({ title: '加载中' }); 
				_this.list = [];
				_this.$Recipe.GetSettlementALL(data).then((res) => { 
					_this.list = res.data   
					uni.hideLoading(); 
				})
			}, 
			orderBtn(item) { 
				uni.navigateTo({
					url: '/pages3/agent/Statementinfo?obj=' + encodeURIComponent(JSON.stringify(item))
				}); 
			},
			bindDateChange(e){
				console.log(e)
				this.formData.time = e.detail.value
				this.getlist(); 
				this.init()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg-image-box{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;  
		background-size: 100% 100%; 
		background-repeat: no-repeat;
		z-index: 8;
		background: #FFFFFF;
		height: 270px;
	}  
	.button-box{
		position: fixed;
		bottom:10%;
		left: 20%;
		text-align: center;
		margin: 0;
		padding: 0;
		width: 60%;
		z-index:99
	} 
	.title-box{
		width: 100%;
		height: 400px;
		line-height: 400px;
		text-align: center;
		font-weight: bold; 
		font-size: 20px;
		margin: 0;
		padding: 0; 
	} 
	.ani-box{
		width: 50px;
		height: 50px;
		margin-left: 140px;
		margin-top: 140px;
		font-size: 2px; 
		color: #FFFFFF;  
	}
	.ani-notice{
		width: 100%;
		height: 100px;
		font-size: 16px;
		color: red; 
		color: #FFFFFF;  
		padding-top: 20px;
	} 
	.mask{
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		background: #000000;
		opacity: 0.1;
		position: fixed;
		top: 0;
		left: 0;
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
	.zk-top-1{
		text-align: center;
		height: 32px;
		line-height: 32px;
		font-size: 18px;
		color:  #fff;
		font-size: 28rpx;
	}
	.zk-top-2{
		text-align: center;
		height: 32px;
		line-height: 32px;
		color: #fff;
		font-size: 28rpx;
	}
	.picker-style{
		line-height: 36px;
		border: 1px solid #dedede;
		text-align: center; 
	}
	.top-card{
		.uni-card{
			color: #FFFFFF;
			background-color: #8BC34A !important;
		}
	}
	.red{
		color: red;
	}
	.blue{
		color: blue;
	}
</style>

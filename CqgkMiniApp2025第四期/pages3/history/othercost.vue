<template>
	<view class="page">
		<scroll-view  id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
		    <view v-for="(tab,index) in items" :key="index" class="uni-tab-item" :id="index" :data-current="index" @click="ontabtap">
		        <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab}}</text>
		    </view>
		</scroll-view> 
		<view style="width: 100%;height: 40px;"> </view>
		
		<view class="card" v-for="(item,index) in SelectRepairOrderList" :key='index'>
			 
			<!-- 工单信息 -->
			<view class="middle" @click="orderBtn(item)">
				<view style="display: flex;flex-direction: column;width: 100%;">
					<view class="new-item">
						<image src="@/static/order_status_new.png" mode=""></image>
						<text class="left">其他费用单:</text>
						<text class="right">{{item.FBillNo}}</text>
					</view>
					<view class="new-item">
						<image src="@/static/info_number.png" mode=""></image>
						<text class="left">工单状态:</text>
						<text class="right">{{item.FDocumentStatus=='B'?'待审核':'已审核'}}</text>
					</view>
					<view class="new-item">
						<image src="@/static/user.png" mode=""></image>
						<text class="left">费用项目:</text>
						<text class="right">非维修项目</text>
					</view>
					<view class="new-item">
						<image src="@/static/info_time.png" mode=""></image>
						<text class="left">填报时间:</text>
						<text class="right">{{item.FCreateDate.replace('T',' ')}}</text>
					</view>
					<view class="new-item">
						<image src="@/static/info_location.png" mode=""></image>
						<text class="left">填报金额:</text>
						<text class="right">{{ Math.round(item.FAMOUNT * 100) / 100   }}</text>
					</view>
				</view>
			</view>
		
		</view>

		<view class="nothing" v-if="SelectRepairOrderList.length == 0">
			暂无其他费用单
		</view>
		<view style="width: 100%;height: 60px;"> </view>
		<button type="warning" size="small" class="addbtn" @click="addBtn">填报其他费用</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				SelectRepairOrderList: [],
				status: 'B',
				tabIndex:0,
				triggered: false,
				_freshing: false,
				showLoginOut:false,//重新登录 
				items: ['待审核', '已审核'], 
			}
		},
		onLoad() { 
			
		},
		
		onShow() { 
			this.init(); 
		},
		methods: {
			init(){
				let _this = this
				let Fnumber = uni.getStorageSync('userNumber');
				let status =  'B';
				if(_this.tabIndex==1)status = 'C'
				let data = {
					FNUMBER:Fnumber,  
					FDocumentStatus:status
				}   
				_this.$Recipe.GetAllReceiveOfCost(data).then((res) => {
					_this.SelectRepairOrderList = res.data  
				})
			 
			},
			orderBtn(item) { 
				uni.navigateTo({
					url: '/pages3/history/costinfo?obj=' + encodeURIComponent(JSON.stringify(item))
				}); 
			},
			/**
			 * 添加其他费用单
			 */
			addBtn() {
				uni.navigateTo({
					url: '/pages3/history/addcost'
				})
			},
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.tabIndex = index
			    this.init(); 
			}, 
		}
	}
</script>

<style lang="scss" scoped>
	
	.scroll-h{
		position:fixed;
		z-index:99;
		top: 0;
		background: #fff;
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
	.page {
		position: relative;
		height: 100vh;

		.nothing {
			position: absolute;
			width: 150px;
			height: 22px;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}
	.addbtn {
		position: fixed;
		left: 10%;
		width: 80%;
		bottom: 10px;
		color: #FFFFFF;
		z-index: 99;
		background-color: #169BD5;
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

	}
</style>

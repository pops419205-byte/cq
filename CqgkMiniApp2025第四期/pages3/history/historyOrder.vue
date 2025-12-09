<template>
	<view class="page">
		<view class="card" v-for="(item,index) in SelectRepairOrderList" :key='index'>
			<!-- 卡片头部-产品名称 -->
			<view class="head" @click="orderBtn(item)">
				<view class="left">
					<text class="materiel-name">产品名称: {{item.productname|| ''}}</text>
				</view>
			</view>
			<!-- 工单信息 -->
			<view class="middle" @click="orderBtn(item)">
				<view style="display: flex;flex-direction: column;width: 100%;">
					<view class="new-item">
						<image src="@/static/order_status_new.png" mode=""></image>
						<text class="left">工单状态:</text>
						<text class="right">{{item.REPAIRPRICE}}</text>
					</view>
					<view class="new-item">
						<image src="@/static/info_number.png" mode=""></image>
						<text class="left">工单编号:</text>
						<text class="right">{{item.FWORKORDERNO1}}</text>
					</view>
					<view class="new-item" v-if="status == 'Service_station'">
						<image src="@/static/user.png" mode=""></image>
						<text class="left">用户名称:</text>
						<text class="right">{{item.username}}</text>
					</view>
					<view class="new-item">
						<image src="@/static/info_time.png" mode=""></image>
						<text class="left">报修时间:</text>
						<text class="right">{{item.FCreateDate}}</text>
					</view>
					<view class="new-item" v-if="status == 'Customer'">
						<image src="@/static/info_location.png" mode=""></image>
						<text class="left">服务站点:</text>
						<text class="right">{{item.customername?item.customername:'待服务中心分配'}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="nothing" v-if="SelectRepairOrderList.length == 0">
			暂无历史工单
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				SelectRepairOrderList: [],
				status: 'Customer'
			}
		},
		async onLoad() {
			const value = uni.getStorageSync('customertype');
			let FID = uni.getStorageSync('Fnumber')
			this.status = value 
			let type = ''
			if (value == 'Customer') {
				type = 'driver'
			}
			if (value == 'Service_station') {
				type = 'station'
			}
			let datastatus = 'complete'
			const result = await this.$Recipe.getRepairReportListByOpenid({
				type,
				FID,
				datastatus
			})
			this.SelectRepairOrderList = result.data
		},
		methods: {
			orderBtn(item) {
				if (item.billtype == 'baoxiu') {
					uni.navigateTo({
						url: '/pages2/order/reportRepair/info?obj=' + encodeURIComponent(JSON.stringify(item))
					});
				}
				if (item.billtype == 'weixiu') {
					uni.navigateTo({
						url: '/pages2/order/repair/info?obj=' + encodeURIComponent(JSON.stringify(item))
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		position: relative;
		height: 100vh;

		.nothing {
			position: absolute;
			width: 100px;
			height: 22px;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
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

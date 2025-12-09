<template>
	<view class="page">
		<uni-list>
			<uni-card :title="item.FWORKORDERNO1" @click="orderBtn(item)" :extra="item.FCreateDate"
				v-for="(item,index) in list" :key='item.FWORKORDERNO1'> 
				<text class="uni-body">  {{item.REPAIRPRICE?item.REPAIRPRICE:''}}</text>
			</uni-card>
		</uni-list>
		<view class="nothing" v-if="list.length == 0" style="text-align: center;">
			暂无消息
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				list: []
			};
		},
		async onLoad() {
			const value = uni.getStorageSync('customertype');
			let FID = uni.getStorageSync('Fnumber')
			let type = ''
			if (value == 'Customer') {
				type = 'driver'
			}
			if (value == 'Service_station') {
				type = 'station'
			}
			let datastatus = 'running'
			const result = await this.$Recipe.getRepairReportListByOpenid({
				type,
				FID,
				datastatus
			})
			this.list.splice(0)
			this.list = result.data;
			// for (let i = 0; i < result.data.length; i++) {
			// 	if (result.data[i].billtype == 'weixiu') {
			// 		this.list.push(result.data[i])
			// 	}
			// }
			 
		},
		onReady() {},
		onShow() {

		},
		onHide() {},
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
	};
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
	}
</style>

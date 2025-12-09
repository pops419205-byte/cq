<template>
	<view class="page">
		<view style="padding: 20px 15px;">
			<!-- 服务站信息 -->
			<view style="display: flex;justify-content: space-between;">
				<text>服务站:</text>
				<text>xxx服务站</text>
			</view>
			<!-- 选择对账时间 -->
			<view style="margin-top: 20px;display: flex;">
				<text style="display: flex;justify-content: center;align-items: center;">对账时间</text>
				<view style="margin-left: 30px;">
					<uni-datetime-picker type="date" @change="dateChange" />
				</view>
			</view>
		</view>
		<!-- 单位 -->
		<view style="display: flex;justify-content: flex-end;padding: 0 20px; color: gray;margin:  15px 0;">
			<text>单位: 元</text>
		</view>

		<uni-table border stripe emptyText="暂无更多数据">
			<!-- 表头行 -->
			<uni-tr>
				<uni-th align="center" width="25px">序号</uni-th>
				<uni-th align="center">工单编号</uni-th>
				<uni-th align="center">报修时间</uni-th>
				<uni-th align="center">费用小计</uni-th>
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="(item,index) in tableList">
				<uni-td align="center">{{index+1}}</uni-td>
				<uni-td></uni-td>
				<uni-td></uni-td>
				<uni-td></uni-td>
			</uni-tr>
			<uni-tr>
				<uni-td align="center">小计</uni-td>
				<uni-td></uni-td>
				<uni-td></uni-td>
				<uni-td align="center">5600</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tableList: [{
					fid: '',
					date: '',
					price: ''
				}, {
					fid: '',
					date: '',
					price: ''
				}], //数据列表
				single: '' //日期变量
			}
		},
		methods: {
			/**
			 * @param {Object} e 选择日期事件 
			 */
			dateChange(e) {
				this.single = e;
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>

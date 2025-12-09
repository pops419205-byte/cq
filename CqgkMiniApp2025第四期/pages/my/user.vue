<template>
	<view class="mine">
		<!-- 员工列表 -->
		<uni-list>
			<uni-list-item showArrow v-for="(item,index) in list " :key='index' :title="item.Fname"
				@click.native="showInfo(item)" thumb-size="lg" />
		</uni-list>
		<!-- 添加员工导航 -->
		<button type="warning" class="addbtn" @click="addBtn" v-if="admin == '1'">添加员工</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				list: [], //员工数组列表
				admin: '' //权限
			}
		},
		/**
		 * 获取列表数据
		 */
		onShow() {
			this.getList()
		},
		/**
		 * 获取权限
		 */
		onLoad() {
			this.admin = uni.getStorageSync('FISADMIN')
		},
		methods: {
			/**
			 * 获取列表数组
			 */
			async getList() {
				const Fnumber = uni.getStorageSync('userNumber')
				const result = await this.$Recipe.GetUserlist({
					Fnumber
				})
				this.list.splice(0)
				this.list = await result.data
			},
			/**
			 * 员工详情页面跳转
			 */
			showInfo(item) {
				uni.navigateTo({
					url: '/pages/my/staffInfo?obj=' + encodeURIComponent(JSON.stringify(item))
				})
			},
			/**
			 * 添加员工页面跳转
			 */
			addBtn() {
				uni.navigateTo({
					url: '/pages/my/useradd'
				})
			},
		}
	}
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

	.u-page {
		padding: 0;
	}

	.u-demo-block__title {
		padding: 10px 0 2px 15px;
	}

	.swipe-action {
		&__content {
			padding: 25rpx 0;

			&__text {
				font-size: 15px;
				color: $u-main-color;
				padding-left: 30rpx;
			}
		}
	}
</style>

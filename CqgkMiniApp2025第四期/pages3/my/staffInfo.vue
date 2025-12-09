<template>
	<view class="mine">
		<!-- 员工详情页 -->
		<uni-list>
			<uni-list-item :show-extra-icon="true"  :extra-icon="Icon2" title="姓名" :rightText="name" />
			<uni-list-item :show-extra-icon="true"  :extra-icon="Icon3" title="电话" :rightText="phone" />
		</uni-list>
		<!-- 删除员工 -->
		<button type="warning" class="addbtn" @click="deleteStaff()"  v-if="admin == '1'">删除员工</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				Icon2: {
					color: '#4cd964',
					size: '22',
					type: 'person'
				},
				Icon3: {
					color: '#4cd964',
					size: '22',
					type: 'phone'
				},
				name: '',   //姓名
				phone: '',  //电话
				admin: '',  //用户权限
				FMASTERID: ''  //服务站 / 中心库 id
			}
		},
		/**
		 * 获取缓存信息
		 */
		onLoad(option) {
			let info = JSON.parse(decodeURIComponent(option.obj))
			this.admin = uni.getStorageSync('FISADMIN')
			this.name = info.Fname
			this.phone = info.FMobile
			this.FMASTERID = info.FMASTERID
		},
		methods: {
			/**
			 * 管理员删除员工
			 */
			deleteStaff(item, index) {
				uni.showModal({
					title: '提示',
					content: `请确认是否删除员工-${this.name}`,
					confirmText: '确定',
					success: async ({
						confirm
					}) => {
						if (confirm) {
							const result = await this.$Recipe.deleteStaff({
								FID: this.FMASTERID
							})
							if (result.code == 200) {
								uni.navigateBack({
									delta: 1,
									success() {
										uni.showToast({
											icon: 'none',
											title: '删除员工成功'
										})
									}
								})
							} else {
								uni.showToast({
									icon: 'none',
									title: '删除员工失败'
								})
							}
						}
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.addbtn {
		position: fixed;
		left: 10%;
		width: 80%;
		bottom: 10px;
		color: #FFFFFF;
		z-index: 99;
		background-color: #f56c6c;
	}
</style>

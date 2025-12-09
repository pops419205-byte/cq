<template>
	<view>
		<uni-card padding="10px 0">
			<!-- 添加人员表单 -->
			<uni-forms ref="baseForm" :modelValue="formData">
				<uni-forms-item label="姓名" required>
					<uni-easyinput v-model="formData.FName" placeholder="请输入/姓名" />
				</uni-forms-item>
				<uni-forms-item label="电话" required>
					<uni-easyinput v-model="formData.FMobile" placeholder="请输入电话" />
				</uni-forms-item>
				<uni-forms-item label="地址">
					<uni-easyinput v-model="formData.FBizAddress" placeholder="请输入地址" />
				</uni-forms-item>
			</uni-forms>
		</uni-card>
		<!-- 提交按钮 -->
		<button type="warning" class="addbtn" @click="commit">保存</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				formData: {
					FName: '',      //姓名
					FMobile: '',		//电话
					FBizAddress: '' //地址
				},
				admin: ''  //用户权限 
			};
		},
		/**
		 * 获取服务站ID
		 */
		onLoad() {
				this.admin = uni.getStorageSync('FISADMIN');
				
		},
		methods: {
			/**
			 * 提交表单 验证填写字段  接口调用成功后返回上级页面
			 */
			async commit() {
				if (this.formData.FName == '' || this.formData.FMobile == '') {
					uni.showToast({
						icon: 'none',
						title: '请填写完整'
					})
					return
				}
				let FCompany = uni.getStorageSync('Fnumber')
				this.formData.FCompany = FCompany
				const result = await this.$Recipe.AddCommonContact(this.formData)
				if (result.msg == 'Success') {
					uni.navigateBack({
						delta: 1,
						sucess() {
							uni.showToast({
								icon: 'none',
								title: '新增员工成功'
							})
						}
					})
				}else{
					uni.showToast({
						icon: 'none',
						title: result.data
					})
				}
			}

		}
	};
</script>

<style scoped lang="scss">
	.addbtn {
		position: fixed;
		left: 10%;
		width: 80%;
		bottom: 10px;
		color: #FFFFFF;
		z-index: 99;
		background-color: #169BD5;
	}
</style>

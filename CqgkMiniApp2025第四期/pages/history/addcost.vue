<template>
	<view>
		<uni-card padding="10px 0">
			<!-- 添加人员表单 -->
			<uni-forms ref="baseForm" :modelValue="formData">
				<uni-forms-item label="费用项目" required>
					<uni-easyinput value="非维修费用" disabled   />
				</uni-forms-item>
				<uni-forms-item label="费用金额" required>
					<uni-easyinput v-model="formData.FAMOUNT" type="number" placeholder="请输入费用金额" />
				</uni-forms-item>
				<uni-forms-item label="费用说明" required>
					<uni-easyinput type="textarea" v-model="formData.FREMARK" placeholder="请描述费用说明" />
				</uni-forms-item>
				<uni-forms-item label="费用图片">
					<view class="img-box" style="display: flex;">
						<u-upload class="img-box-cp" :fileList="fileList1" @afterRead="afterRead" @delete="deletePic"
							name="1" :multiple='true' :maxCount="3"></u-upload>
					</view>
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
					FFREIGHT:'',
					FAMOUNT:0, 
					FREMARK: '' ,//费用说明 
				}, 
				fileList1:[],
				QTFYTP:[],
			};
		},
		/**
		 * 获取服务站ID
		 */
		onLoad() {
			 
		},
		methods: {
			/**
			 * 提交表单 验证填写字段  接口调用成功后返回上级页面
			 */
			async commit() {
				if (this.formData.FAMOUNT == '' || this.formData.FREMARK == '') {
					uni.showToast({
						icon: 'none',
						title: '请填写完整'
					})
					return
				}
				let num = Number(this.formData.FAMOUNT);
				this.formData.FAMOUNT  = num
				this.formData.FSUMAmount = num
				let obj = {
					FSERVICESTATION:{
						FNUMBER:uni.getStorageSync('userNumber'),
					} ,
					FSUMAmount:num, 
					FileFIDS:[], 
					FEntity:[
						{
							FEXPENSEITEM:{ FNUMBER:'REPR.0076' }, 
							FFREIGHT:num,
							FAMOUNT:num, 
							FREMARK:this.formData.FREMARK ,//费用说明 
						}
					]
				} 
				obj.FileFIDS.push(...this.QTFYTP)
				
				// console.log(obj)
				// return
				const result = await this.$Recipe.SaveCost(obj)
				if (result.msg == 'Success') {
					uni.navigateBack({
						delta: 1,
						sucess() {
							uni.showToast({
								icon: 'none',
								title: '其他费用填报成功'
							})
						}
					})
				}else{
					uni.showToast({
						icon: 'none',
						title: result.data
					})
				}
			},
			 
			deletePic(event) { 
				this[`fileList${event.name}`].splice(event.index, 1)
				this.FYTP.splice(event.index, 1)
				this.$Recipe.DeleteFile( {FID:event.file.FID})
				 
			},
			beforeReadHandler(file, lists, name) {},
			// 新增图片
			async afterRead(event) {
				// this.isUpdate = true
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					let result
					try {
						result = await this.uploadFilePromise(lists[i].url, event.name)
			
					} catch (e) {
						 
						//TODO handle the exception
					}
					try {
						JSON.parse(result).data.FID
					} catch (e) {
						 
						uni.showToast({
							icon: 'none',
							title: '文件上传失败'
						})
						this[`fileList${event.name}`].splice(fileListLen, 1)
						return
						//TODO handle the exception
					}
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: item.url,
						FID: JSON.parse(result).data.FID
					}))
					fileListLen++
				} 
				
				this.QTFYTP.splice(0) 
				this[`fileList${event.name}`].forEach(item => {
					let obj = {
						"FID": item.FID,
					}
					this.QTFYTP.push(obj);
				})
				this.isUpdate = false
				 
			},
			uploadFilePromise(url, number) {
				let _this = this ;
				const baseUrl = 'https://cy.klwsxx.com'
				let uploadUrl = baseUrl + '/File/FileUpload';
				let type = 'BXYMSC_QTFYTP';
				 
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: uploadUrl,
						filePath: url,
						name: 'FileName',
						formData: {
							type: type,
						},
						success: (res) => {
							_this.isUpdate = false
							setTimeout(() => {
								resolve(res.data)
							}, 1000)
						},
						fail: (err) => {
							_this.isUpdate = false
							uni.showToast({
								icon: 'none',
								title: '上传失败'
							})
						}
					});
				})
				
			}, 
			

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

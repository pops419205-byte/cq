<template>
	<view class="page">
		<!-- 维修费用明细 -->
		<!-- <view class="">
			
			<view class="title" style="padding: 20px 0 0 20px;margin-bottom: 10px;">
				维修费用明细
			</view>
		</view> -->
		<!-- 	<view class=""
			style="display: flex;justify-content: flex-end;color: gray;padding: 0 15px 0 0;margin-bottom: 10px;">
			<text>单位: 元</text>
		</view>
		<uni-table border stripe emptyText="暂无更多数据"> -->
		<!-- 表头行 -->
		<!-- 	<uni-tr>
				<uni-th align="center" width="25px">序号</uni-th>
				<uni-th align="center">零件名称</uni-th>
				<uni-th align="center">数量</uni-th>
				<uni-th align="center">单价</uni-th>
				<uni-th align="center">金额</uni-th>
			</uni-tr> -->
		<!-- 表格数据行 -->
		<!-- 		<uni-tr v-for="(item,index) in repairList" :key='index'>
				<uni-td align="center">
					{{index+1}}
				</uni-td>
				<uni-td>
					<view class="" style="width: 80px;">
						<input type="text" :disabled="item.isDis" v-model="item.name" />
					</view>
				</uni-td>
				<uni-td>
					<input type="text" :disabled="item.isDis" v-model="item.number" style="width: 30px;" />
				</uni-td>
				<uni-td>
					<input type="text" :disabled="item.isDis" v-model="item.price" style="width: 30px;" />
				</uni-td>
				<uni-td>{{item.price * item.number || ''}}</uni-td>
			</uni-tr> -->
		<!-- 小计行 -->
		<!-- 	<uni-tr>
				<uni-td>小计</uni-td>
				<uni-td></uni-td>
				<uni-td></uni-td>
				<uni-td></uni-td>
				<uni-td>{{getRepairPrice()}}</uni-td>
			</uni-tr>
		</uni-table> -->
		<!-- 维修费用增加一行 -->
		<!-- 	<view style="color: blue;margin-top: 10px;padding-right: 10px;display: flex;justify-content: flex-end;">
			<text @click="addRepair">增加一项</text>
		</view> -->


		<!-- 服务费明细 -->
		<view class="">
			<view class="title" style="padding: 20px 0 0 20px;margin-bottom: 10px;">
				<span>服务费明细：</span> <span style="font-size: 14px;color: red;">单价为空时 可手动填写金额</span>
			</view>
		</view>
		<view class=""
			style="display: flex;justify-content: flex-end;color: gray;padding: 0 15px 0 0;margin-bottom: 10px;">
			<text>单位: 元</text>
		</view>
		<uni-table border stripe emptyText="暂未选择费用项目">
			<!-- 表头行 -->
			<uni-tr>
				<!-- <uni-th :align="align" :width="80">序号</uni-th> -->
				<uni-th :align="align" :width="320">费用项目</uni-th>
				<uni-th :align="align" :width="80">数量</uni-th>
				<uni-th :align="align" :width="100">单价</uni-th>
				<uni-th :align="align" :width="100">金额</uni-th>
				<uni-th :align="align" :width="120">备注</uni-th>
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="(item,index) in service" :key='index'>
				<!-- <uni-td :align="align"> {{index+1}} </uni-td> -->
				<uni-td :align="align">{{index+1}} - {{item.name}} </uni-td>
				<uni-td :align="align"> <u-button type="primary" size="mini" :text="item.FQTY"
						@click="showFQ(item.FQTY,index)"></u-button> </uni-td>
				<uni-td :align="align"> {{item.price=='0.00'?'':item.price}} </uni-td>



				<uni-td :align="align" v-if="item.price !=='0.00'"> {{ getTotal( index )}} </uni-td>
				<uni-td :align="align" v-if="item.price =='0.00' ">
					<u-button type="primary" size="mini" :text="item.FAMOUNT"
						@click="showPrice(item.FAMOUNT,index)"></u-button>
				</uni-td>

				<uni-td :align="align">
					<u-button type="primary" size="small" text="修改"
						@click="showMK(item.mark,item.newMark,index)"></u-button>
				</uni-td>
			</uni-tr>
			<!-- 服务费小计 -->

		</uni-table>
		<!-- 增加服务费表格行 -->
		<view style="color: blue;margin-top: 10px;padding-right: 10px;display: flex;justify-content: flex-end;">
			<text @click="addService">选择项目</text>
		</view>

		<!-- 总费用小计 -->
		<view class="total" style="padding: 20px 10px;">
			<view class="title">
				<text>小计:</text>
			</view>
			<view style="padding: 10px 20px;">
				<view style="display: flex;justify-content: space-between;margin: 15px 0;">
					<text>服务费用</text>
					<text>{{getPrice()}}</text>
				</view>
			</view>

		</view>
		<view class="total" style="padding: 20px 10px;">
			<view class="title">
				<text>费用附件:</text>
			</view>
			<uni-forms>
				<uni-forms-item label=" " label-width='65'>
					<u-upload class="img-box-cp" :fileList="fileList7" @afterRead="afterRead" @delete="deletePic"
						name="7" :multiple='true' :maxCount="3"></u-upload>
				</uni-forms-item>
			</uni-forms>
		</view>
		<!-- 提交按钮-->
		<view @click="showModel=true" class="btn"
			style="display: flex;justify-content: center;align-items: center;width: 150px;height: 40px;color: #fff;background-color: #169BD5;margin: 0 auto;border-radius: 10px;">
			确认提交
		</view>
		<!-- 费用选择框 -->
		<tki-treed ref="tkitree" :selectParent='true' :range="priceList" rangeKey="FREPAIRITEM" :multiple='true'
			:foldAll="true" @confirm='treeconfirm' confirmColor="#4e8af7" />

		<u-modal :show="showModal" :title="title" @confirm="confirmModel" ref="uModal">
			<view class="slot-content">
				<view style="min-height:140px ;" v-if="tag==2">
					<u--textarea v-model="newMark" :placeholder="mark" :maxlength='-1'
						:height="textareaH"></u--textarea>
				</view>
				<view v-if="tag==1">
					<u--input type="number" v-model="content" /></u--input>
				</view>

				<view v-if="tag==3">
					<u--input type="number" v-model="content" /></u--input>
				</view>
			</view>
		</u-modal>
		<!-- 保存确认 -->
		<u-modal :show="showModel" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="submit()"
			:title="'确认提交'" @cancel="showModel=false" @close="showModel=false"></u-modal>

	</view>
</template>

<script>
	import tree from '@/components/tki-treed/tki-treed.vue'

	export default {
		components: {
			tree,
		},
		data() {
			return {
				showModel: false,
				tag: 1,
				showModal: false,
				textareaH: 140,
				indexTag: '',
				title: '提示信息',
				content: '',
				align: 'center',
				mark: '',
				newMark: '',
				repairList: [], //维修费列表  
				service: [
					// 	{
					// 	name: '服务费项目选择',
					// 	price: 100,
					// 	remarks: '备注'
					// },

				], //服务费列表
				priceList: [], //服务费列表
				FBillNo: '', //订单号
				FID: '', //订单号
				fileList7: [], // 图片
				handle: [],
				allInfo: [],
				FDISTANCE: 0,
				total: 0
			}
		},
		/**
		 * 获取维修价目表 指定三个默认选中费用项目
		 */
		async onLoad(option) {
			const info = JSON.parse(decodeURIComponent(option.obj))
			// console.log(info)
			this.FBillNo = info.FWORKORDERNO1
			this.FID = info.FID
			// GetWeiXiuDetail
			let result2 = await this.$Recipe.GetWeiXiuDetail({
				fnumber: info.FBillNo
			})
			this.allInfo = result2.data
			this.FDISTANCE = result2.data.FDISTANCE

			const result = await this.$Recipe.SelectREPAIRPRICEList({
				serviceid: uni.getStorageSync('Fnumber')
			})
			this.priceList = result.data.map(item => {
				let str = item.FREPAIRITEM;
				let itemType = 'A'; // 默认其他
				    
				// 判断是否包含关键词
				if (str.includes('机械产品')) {
				    itemType = 'M'; // Mechanical
				} else if (str.includes('共轨产品')) {
				    itemType = 'C'; 
				}
				item.itemType = itemType;
				//默认选中
				// if(item.FID == 114475 || item.FID == 114476 || item.FID == 114477){
				// 		item.checked = true
				// 		let FQTY = 1 ;
				// 		if(item.FID == 114477)FQTY = result2.data.FDISTANCE
				// 		this.service.push({
				// 			name: item.FREPAIRITEM,
				// 			mark: item.FREMARK,  
				// 			newMark: '',
				// 			FQTY:FQTY,
				// 			price: item.FPROPOSALPRICE,
				// 			FAMOUNT: parseFloat(item.FPROPOSALPRICE)*FQTY, 
				// 			isDis: false,
				// 			FID: item.FID
				// 		})
				// }
				return item
			})
			console.log('this.priceList', this.priceList)
		},
		methods: {
			/**
			 * 树形菜单确认方法
			 */
			treeconfirm(e) {
				let that = this;
				this.service.splice(0)
				e.forEach(item => {
					let FQTY = 1;
					if (item.FID == 114477 || item.FID == 114497 || item.FID == 114514) {
						FQTY = that.FDISTANCE ? that.FDISTANCE : 1
					}
					this.service.push({
						name: item.FREPAIRITEM,
						mark: item.FREMARK,
						newMark: '',
						FQTY: FQTY,
						price: item.FPROPOSALPRICE,
						FAMOUNT: parseFloat(item.FPROPOSALPRICE),
						isDis: false,
						FID: item.FID
					})
				})
			},
		
			/**
			 * 修改数量 展开
			 */
			showFQ(content, index) {
				this.title = '修改数量'
				this.content = content
				this.tag = 1
				this.showModal = true
				this.indexTag = index
			},
			
			/**
			 * 修改单价 展开
			 */
			showPrice(content, index) {
				this.title = '修改总价'
				this.content = content
				this.tag = 3
				this.showModal = true
				this.indexTag = index
			},
		
			/**
			 * 修改备注
			 */
			showMK(content, newContent, index) {
				this.newMark = '';
				this.title = '备注信息'
				this.mark = content
				if (newContent !== content)
					this.newMark = newContent;
				this.tag = 2
				this.showModal = true
				this.indexTag = index
			},
			
			/**
			 * 确定点击 - 精简调试
			 */
			confirmModel() {
				let index = this.indexTag;
				
				if (this.tag == 1) {
					this.content = parseFloat(this.content) ? parseFloat(this.content) : 1
					this.service[index].FQTY = this.content
					this.service[index].FAMOUNT = this.getTotal(index);
					console.log(`修改数量后: 数量=${this.content}, 单价=${this.service[index].price}, 金额=${this.service[index].FAMOUNT}`);
				}
				
				if (this.tag == 2) {
					this.service[index].newMark = this.newMark
				}
				
				if (this.tag == 3) {
					this.service[index].FAMOUNT = parseFloat(this.content);
				}
				
				this.showModal = false
			},
		
			/**
			 * 单行总价
			 */
			getTotal(idx) {
				let num = this.service[idx].FQTY;
				let price = parseFloat(this.service[idx].price);
				return num * price
			},
			
			/**
			 * 添加维修表格行
			 */
			addRepair() {
				this.repairList.push({
					name: '',
					number: '',
					price: '',
					isDis: false
				})
			},
			
			/**
			 * 添加服务费行
			 */
			addService() {
				this.$refs.tkitree._show()
			},
			
			/**
			 * 获取服务费表格小计 - 精简调试
			 */
			getPrice() {
				console.log('\n========== 计算小计 ==========');
				let total = 0
				this.service.forEach((item, idx) => {
					if (!parseFloat(item.FAMOUNT) || !parseFloat(item.FQTY)) {
						return
					}
					let price = parseFloat(item.price);
					if (price == 0) {
						total += parseFloat(item.FAMOUNT)
						console.log(`项目${idx+1}: 数量=${item.FQTY}, 单价=0(手动), 金额=${item.FAMOUNT}`);
					} else {
						let num = item.FQTY;
						let FAMOUNT = num * price
						total += FAMOUNT
						console.log(`项目${idx+1}: 数量=${num}, 单价=${price}, 金额=${FAMOUNT}`);
					}
				})
				this.total = total
				console.log(`小计总额: ${total}`);
				console.log('==============================\n');
				return total
			},
			
			/**
			 * 维修费表格小计
			 */
			getRepairPrice() {
				let total = 0
				this.service.forEach(item => {
					if (!parseFloat(item.FAMOUNT) || !parseFloat(item.FQTY)) {
						return
					}
					let price = parseFloat(item.price);
					if (price == 0) {
						total += parseFloat(item.FAMOUNT)
					} else {
						let num = item.FQTY;
						let FAMOUNT = num * price
						total += FAMOUNT
					}
				})
				this.total = total
				return total
			},
			
			/**
			 * 提交费用
			 */
			async submit() {
				console.log('\n========== 提交数据 ==========');
				
				if (this.total <= 0) {
					uni.showToast({
						icon: 'none',
						title: '费用为0！'
					})
					return
				} else {
					let arr = this.service.map((item, idx) => {
						let ppp = parseFloat(item.price);
						let FAMOUNT = ppp == 0 ? item.FAMOUNT : ppp * item.FQTY
						
						console.log(`项目${idx+1}: FQTY=${item.FQTY}, 单价=${ppp}, 提交金额=${FAMOUNT}`);
						
						return {
							FID: item.FID,
							FREMARK: item.newMark ? item.newMark : item.mark,
							FPROPOSALPRICE: item.price,
							type: '1',
							FQTY: item.FQTY,
							price: item.price,
							FAMOUNT: FAMOUNT,
						}
					})
					
					console.log('==============================\n');
					
					if (arr.length == 0 || this.fileList7.length <= 0) {
						this.showModel = false
						uni.showToast({
							icon: 'none',
							title: '无维修费用项目或未上传维修附件！'
						})
						return
					}
					
					let obj = {
						repairList: arr,
						FBillNo: this.FBillNo,
						FID: this.FID,
						FileFIDS: [...this.handle]
					}
					
					this.showModel = false
					
					let res = await this.$Recipe.UpdateRepairOrder(obj)
					console.log("维修费用提交回传，res--", res)
					
					if (res.code == 200) {
						uni.navigateBack({
							delta: 1,
							success() {
								uni.showToast({
									icon: 'none',
									title: '提交维修费用成功'
								})
							}
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '提交维修费用失败'
						})
					}
				}
			},
		
			/**
			 * 删除图片
			 */
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
				this.handle.splice(event.index, 1)
				this.$Recipe.DeleteFile({
					FID: event.file.FID
				})
			},
		
			/**
			 * 新增图片
			 */
			async afterRead(event) {
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
					const result = await this.uploadFilePromise(lists[i].url, event.name)
		
					try {
						JSON.parse(result).data.FID
					} catch (e) {
						uni.showToast({
							icon: 'none',
							title: '文件上传失败'
						})
						this[`fileList${event.name}`].splice(fileListLen, 1)
						return
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
				this.handle.splice(0)
				this[`fileList${event.name}`].forEach(item => {
					let obj = {
						"FID": item.FID
					}
					this.handle.push(obj)
				})
			},
		
			/**
			 * 上传图片方法
			 */
			uploadFilePromise(url, number) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'https://cy.klwsxx.com/File/FileUpload',
						filePath: url,
						formData: {
							type: 'WXFYYMSC_COST'
						},
						name: 'FileName',
						success: (res) => {
							setTimeout(() => {
								resolve(res.data)
							}, 1000)
						},
						fail: (err) => {
							uni.showToast({
								icon: 'none',
								title: '上传失败'
							})
						}
					});
				})
			},
			
			numberChaneg(price, index) {
				console.log(price, index)
			}
		}
	}
</script>

<style scoped lang="scss">
	.page {
		padding-bottom: 50px;
	}

	.slot-content {
		border: 1px solid #eee;
		width: 100%;
	}
</style>
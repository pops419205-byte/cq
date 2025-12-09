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
		<!-- 产品分类选择 -->
		<view style="padding: 10px 20px;margin-bottom: 10px;">
			<uni-forms-item label="产品分类" required>
				<view @click="showCostTypePicker = true" class="w100">
					<uni-easyinput v-model="costTypeName" disabled placeholder="请选择产品分类" />
				</view>
			</uni-forms-item>
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
		<!-- 产品分类选择器 -->
		<u-picker :show="showCostTypePicker" :closeOnClickOverlay='true' @cancel='showCostTypePicker=false' @close='showCostTypePicker=false'
			@confirm='costTypeConfirm' :columns="costTypeList" keyName="name"></u-picker>
		<!-- 费用选择框 -->
		<tki-treed ref="tkitree" :selectParent='true' :range="filteredPriceList" rangeKey="FREPAIRITEM" :multiple='true'
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
				priceList: [], //服务费列表（全部）
				filteredPriceList: [], //过滤后的服务费列表
				costType: '', //产品分类值：'1'=机械产品，'2'=共轨产品
				costTypeName: '', //产品分类显示名称
				showCostTypePicker: false, //显示分类选择器
				costTypeList: [
					[{
						name: '机械产品',
						value: '1'
					}, {
						name: '共轨产品',
						value: '2'
					}]
				],
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
				let str = item.FREPAIRITEM || '';
				let arr = str.split("-");
				let itemType = arr[0];
				
				// 优先使用后端返回的分类字段
				// 后端应该提供 FCOSTTYPE 字段：'1'=机械产品，'2'=共轨产品
				if (item.FCOSTTYPE) {
					item.costType = item.FCOSTTYPE;
				} else {
					// 判断逻辑：只有明确标识为"机械产品"的才是机械产品，其他都是共轨产品
					// 检查 FREPAIRITEM 是否以"机械产品"开头
					if (str.startsWith('机械产品') || str.indexOf('机械产品') === 0) {
						item.costType = '1'; // 机械产品
					} else {
						// 其他所有情况都是共轨产品
						item.costType = '2'; // 共轨产品
					}
				}
				
				// 保留原有的itemType用于兼容（H、P、G系列）
				if (itemType !== 'H' && itemType !== 'P' && itemType !== 'G') {
					itemType = 'A'
				}
				item.itemType = itemType;
				return item
			})
			
			// 打印分类统计
			const mechanicalCount = this.priceList.filter(item => item.costType === '1').length;
			const commonRailCount = this.priceList.filter(item => item.costType === '2').length;
			console.log('========== 费用项目分类统计 ==========')
			console.log('机械产品数量:', mechanicalCount)
			console.log('共轨产品数量:', commonRailCount)
			console.log('总数量:', this.priceList.length)
			console.log('====================================')
			// 初始时不显示列表，需要先选择产品分类
			this.filteredPriceList = [];
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
					//114477 114497 114514
					console.log("treeconfirm--", this.service)
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
			 * 确定点击
			 */
			confirmModel() {
				let index = this.indexTag;
				if (this.tag == 1) {
					this.content = parseFloat(this.content) ? parseFloat(this.content) : 1
					this.service[index].FQTY = this.content
					this.service[index].FAMOUNT = this.getTotal(index);
				}
				if (this.tag == 2) {
					this.service[index].newMark = this.newMark
				}
				if (this.tag == 3) {
					this.service[index].FAMOUNT = parseFloat(this.content);
				}
				this.showModal = false
				// console.log(111,this.service)
			},

			/**
			 * 单行总价
			 */
			getTotal(index) {
				console.log("getTotal,this.service--", this.service)
				let num = this.service[index].FQTY;
				let price = parseFloat(this.service[index].price);
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
			 * 产品分类选择确认
			 */
			costTypeConfirm(e) {
				this.costType = e.value[0].value;
				this.costTypeName = e.value[0].name;
				// 根据选择的分类过滤费用项目列表
				this.filteredPriceList = this.priceList.filter(item => {
					return item.costType === this.costType;
				});
				console.log('========== 产品分类选择 ==========')
				console.log('产品分类:', this.costTypeName, '分类值:', this.costType)
				console.log('全部费用项目数量:', this.priceList.length)
				console.log('过滤后的费用项目数量:', this.filteredPriceList.length)
				console.log('过滤后的费用项目列表:', this.filteredPriceList)
				console.log('================================')
				this.showCostTypePicker = false;
			},
			/**
			 * 添加服务费行
			 */
			addService() {
				// 必须先选择产品分类
				if (!this.costType) {
					uni.showToast({
						icon: 'none',
						title: '请先选择产品分类'
					})
					return
				}
				this.$refs.tkitree._show()
			},
			/**
			 * 获取服务费表格小计
			 */
			getPrice() {
				let total = 0
				this.service.forEach(item => {
					//console.log(item.FAMOUNT,item.FQTY)
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

					// total +=  item.FAMOUNT
				})
				this.total = total
				return total
			},
			/**
			 * 提交费用
			 */
			async submit() {

				console.log(this.service, this.total)
				// 检查是否选择了产品分类
				if (!this.costType) {
					uni.showToast({
						icon: 'none',
						title: '请先选择产品分类！'
					})
					this.showModel = false
					return
				}
				if (this.total <= 0) {
					uni.showToast({
						icon: 'none',
						title: '费用为0！'
					})
					return
				} else {


					let arr = this.service.map(item => {
						let ppp = parseFloat(item.price);
						let FAMOUNT = ppp == 0 ? item.FAMOUNT : ppp * item.FQTY
						return {
							FID: item.FID,
							FREMARK: item.newMark ? item.newMark : item.mark,
							FPROPOSALPRICE: item.price,
							type: '1',
							FQTY: item.FQTY,
							price: item.FAMOUNT,
							FAMOUNT: FAMOUNT,
							FCOSTTYPE: this.costType, // 添加产品分类：'1'=机械产品，'2'=共轨产品
						}
					})
					if (arr.length == 0 || this.fileList7.length <= 0) {
						this.showModel = false
						uni.showToast({
							icon: 'none',
							title: '无维修费用项目或未上传维修附件！'
						})
						return
						arr = [{
							FID: 0,
							FREMARK: 0,
							FPROPOSALPRICE: 0,
							type: '1',
							FQTY: 0,
							price: 0,
							FAMOUNT: 0
						}]
					}
					let obj = {
						repairList: arr,
						FBillNo: this.FBillNo,
						FID: this.FID,
						FileFIDS: [...this.handle]
					}
					this.showModel = false
					console.log("提交维修费用，", obj)
					// return
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
	.w100 {
		width: 100%;
	}
	.page {
		padding-bottom: 50px;
	}

	.slot-content {
		border: 1px solid #eee;
		width: 100%;
	}
</style>
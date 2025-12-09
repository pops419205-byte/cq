<template>
	<view class="page">
		<!-- 发货信息 -->
		<uni-card>
			<uni-list>

				<uni-list-item title="发货方" :rightText="info.FSENDER.Name[0].Value" />
				<!-- <uni-list-item title="电话号码" :rightText="info.FSENDER.TEL" /> -->
				<uni-list-item title="关联工单编号" :rightText="info.FWORDERNO" />
				<uni-list-item title="发货清单" />

				<uni-list-item title=" ">
					<template v-slot:header>
						<text style="font-size: 12px;color: black;display: flex;width: 25%;">配件名称</text>
					</template>

					<template v-slot:body>
						<view style="font-size: 12px;color: black;width: 65%;">
							<span style="width: 50%;text-align: center;float: left;">规格型号</span>
							<span style="width: 50%;text-align: center;float: right;">配件编号</span>
						</view>
					</template>

					<template v-slot:footer>
						<view style="font-size: 12px;color: black;width:10%;text-align: end;">
							数量
						</view>
					</template>
				</uni-list-item>
				<uni-list-item title=" " v-for="(item,index) in info.FEntity" :key='item.Id'>
					<!-- item.FMiniAssistant.F<!-- D -->ataValue[0].Value FORDERNO item.FPRODUCTNO-- -->
					<template v-slot:header>
						<text style="font-size: 12px;color: black;display: flex;width:
							25%;">{{item.FPARTSNAME.Name[0].Value}}</text>
					</template>

					<template v-slot:body>
						<view style="font-size: 12px;color: black;width: 65%;">
							<span
								style="width: 50%;text-align: center;float: left;">{{item.FPARTSNAME.Specification[0].Value}}</span>
							<span style="width: 50%;text-align: center;float: right;">{{item.FCENTERPUSH}}</span>
						</view>
					</template>

					<template v-slot:footer>
						<view style="font-size: 12px;color: black;width: 10%;text-align: end;">
							{{item.FNUMSEND}}
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-card>
		<!-- 收货信息 -->
		<uni-card>
			<uni-list>
				<uni-list-item title="收货人" :rightText="info.FRECEIVERUSER" />
				<uni-list-item title="收货方" :rightText="info.FRECEIVER.Name[0].Value" />
				<uni-list-item title="电话号码" :rightText="info.FRECEIVERTEL?info.FRECEIVERTEL:info.FRECEIVER.TEL" />
				<uni-list-item title=" ">
					<template v-slot:header>
						<text style="font-size: 14px;color: black;">收货地址</text>
					</template>
					<template v-slot:footer>
						<view style="width: 200px;font-size: 12px;color: black;text-align: end;">
							{{info.FRECEIVEADDRESS}}
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-card>
		<!-- 物流信息 -->
		<uni-card>
			<uni-forms ref="baseForm" :modelValue="formData">
				<!-- <uni-list-item title="发货人" :rightText="info.FSENDERNAME" /> -->
				<uni-forms-item label="发货人" required>
					<!-- <u--input placeholder="请输入发货人" border="surround" v-model="formData.order" ></u--input> -->
					<uni-easyinput v-model="formData.FSENDERNAME" placeholder="请输入发货人" />
				</uni-forms-item>
				<uni-forms-item label="电话号码" required>
					<!-- <u--input placeholder="请输入发货人电话" border="surround" v-model="formData.order" ></u--input> -->
					<uni-easyinput v-model="formData.FSENDPHONE" placeholder="请输入发货人电话" />
				</uni-forms-item>
				<uni-forms-item label="发货时间" required>
					<uni-datetime-picker @custom='custom' placeholder="请选择发货时间" :showSale="false" type="datetime"
						hide-second="true" :clearIcon="false" v-model="formData.date" />
				</uni-forms-item>
				<uni-forms-item label="物流单号" required>
					<!-- <u--input placeholder="请输入物流单号" border="surround" v-model="formData.order" ></u--input> -->
					<uni-easyinput v-model="formData.order" placeholder="请输入物流单号" />
				</uni-forms-item>
				<uni-forms-item label="发运方式" required>
					<!-- <u--input placeholder="请输入发运方式" border="surround" v-model="formData.company" ></u--input> -->
					<uni-easyinput v-model="formData.company" placeholder="请输入发运方式" />
				</uni-forms-item>
				<uni-forms-item label="运费" required>
					<!-- <u--input placeholder="请输入运费" border="surround" v-model="formData.price" ></u--input> -->
					<uni-easyinput v-model="formData.price" type="number" placeholder="请输入运费" />
				</uni-forms-item>
				<uni-forms-item label="备注信息" required>
					<u--textarea v-model="formData.FHEADREMARKS" :maxlength='-1' placeholder="请输入备注信息"></u--textarea>
				</uni-forms-item>
			</uni-forms>
		</uni-card>
		<!-- 确认发货按钮 -->
		<view class="btn" @click="showModel=true"
			style="display: flex;justify-content: center;align-items: center;color: #FFFFFF;border-radius: 5px;margin: 0 auto;background-color: #169BD5;width: 120px;height: 40px;">
			确认发货
		</view>
		<!-- 保存确认 -->
		<u-modal :show="showModel" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="confirmReceive()"
			:title="'确认提交'" @cancel="showModel=false" @close="showModel=false"></u-modal>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				showModel: false,
				info: {}, //发货单信息
				FBillNo: '', //订单号
				FWORKORDERNO1: '', //工单号
				formData: {
					order: '', //物流单号
					company: '', //发运方式
					price: 0, //运费
					date: new Date().getTime(), //发货时间
					FWORDERSTATUS: '',
					FSENDERNAME: '',
					FRECEIVERTEL: '',
					FSENDPHONE: '', //  发货人电话
					FHEADREMARKS: ''
				},
				FID: '' // fid
			}
		},
		/**
		 * 获取数据
		 */
		async onLoad(option) {
			const info = JSON.parse(decodeURIComponent(option.obj))
			console.log("send--,info--", info)

			this.FID = info.FID
			this.FBillNo = info.FBillNo
			this.FWORKORDERNO1 = info.FWORKORDERNO1
			const result = await this.$Recipe.SelectInvoiceList({
				orderno: info.FWORKORDERNO1,
				type: 'station',
				return: '3'
			})
			this.info = result.data

			console.log("send--,this.info--", this.info)
			console.log("this.info.FEntity--", this.info.FEntity)

			this.formData.FRECEIVERTEL = result.data.FSENDER.TEL
			this.formData.FSENDPHONE = result.data.FSENDPHONE
			// this.formData.FSENDERNAME = result.data.FSENDER.Name[0].Value
			this.formData.FSENDERNAME = (result.data.FSENDERNAME == ' ' || result.data.FSENDERNAME == '') ? result.data
				.FSENDER.Name[0].Value : result.data.FSENDERNAME
		},
		methods: {
			happenTimeFun(num) { //时间戳数据处理 
				let date = new Date(num);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM; //月补0
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d; //天补0
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h; //小时补0
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m; //分钟补0
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s; //秒补0
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m
			},
			/**
			 * 确认发货后跳转页面
			 */
			async confirmReceive() {
				this.showModel = false;
				let Fnumber = uni.getStorageSync('Fnumber')

				console.log("确认发货，数据：", this.info, this.formData)
				let data = {
					// FID: this.FID,
					FID: this.info.Id,
					FBillNo: this.FWORKORDERNO1,
					FCustID: Fnumber,
					FWLDH: this.formData.order,
					FWLGS: this.formData.company,
					FREPAIRRPTIME: this.formData.date,
					FFREIGHT: this.formData.price,
					FSENDERNAME: this.formData.FSENDERNAME,
					FRECEIVERTEL: this.formData.FRECEIVERTEL,
					FWORDERSTATUS: this.info.FWORDERSTATUS,
					FSENDPHONE: this.formData.FSENDPHONE, // 发货人电话
					FHEADREMARKS: this.formData.FHEADREMARKS, //发货备注

				}
				console.log("确认发货，data：", data)
				if (parseFloat(this.formData.price).toString() == "NaN") {
					uni.showToast({
						icon: 'none',
						title: '数据非法或为空值！'
					})
					return
				}
				if (!this.formData.order || !this.formData.company || !this.formData.date || !this.formData
					.FSENDERNAME || !this.formData.FRECEIVERTEL || !this.formData.FSENDPHONE) {
					uni.showToast({
						icon: 'none',
						title: '请完善数据信息！'
					})
					return
				}
				if (typeof(data.FREPAIRRPTIME) == 'number') {
					data.FREPAIRRPTIME = this.happenTimeFun(data.FREPAIRRPTIME)
				}

				// console.log(111,data) 
				// return  
				const result = await this.$Recipe.oldProduct(data)

				if (result.code == 200) {
					uni.navigateBack({
						delta: 1,
						success() {
							uni.showToast({
								icon: 'none',
								title: '确认发货成功'
							})
						}
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '确认发货失败'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding-bottom: 100px;

		.list {
			padding: 0 20px;

			.item {
				display: flex;
				margin: 8px 0;
				justify-content: space-between;
				font-size: 14px;
			}
		}
	}
</style>
<template>
	<view class="bg-image-box">    
		<template >
			<uni-list>
				<uni-list-item :title="'工单编号: '+info.FWORDERNO" />
			</uni-list>
		</template> 
		
		<uni-card>
			<uni-list>
				<uni-list-item title="收货方" :rightText="info.FRECEIVER.Name[0].Value" /> 
				<uni-list-item title="收货人" :rightText="info.FRECEIVERUSER" />
				<uni-list-item title="电话号码" :rightText="info.FRECEIVERTEL" />  
				 
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
				 
				<uni-list-item title="发运方式" :rightText="info.FWLGS " />  
				<uni-list-item title="物流单号" :rightText="info.FWLDH " @click="copyToClipboard" />  
				<uni-list-item title="物流费用" :rightText="info.FFREIGHT " />  
			</uni-list>
			<uni-table border stripe emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					 
					<uni-th align="center">配件名称</uni-th>
					<uni-th align="center">数量</uni-th>
					<uni-th align="center">规格型号</uni-th>
					<uni-th align="center">新配件编号</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item,index) in info.FEntity" :key="index"> 
					<uni-td>{{item.FPARTSNAME.Name[0].Value}}</uni-td>
					<uni-td>{{item.FNUMSEND}}</uni-td>
					<uni-td>{{item.FPARTSNAME.Specification[0].Value}}</uni-td>
					<uni-td>{{item.FNEWNUMBER}}</uni-td>
				</uni-tr> 
			</uni-table>
		</uni-card> 
		<uni-card>
			<uni-list>
				<uni-list-item title="中心库" :rightText="info.FSENDER.Name[0].Value" />
				<uni-list-item title="发货人" :rightText="info.FSENDERNAME" />
				<uni-list-item title="电话号码" :rightText="info.FSENDER.TEL" /> 
				<!-- <uni-list-item title="发货地址" :rightText="info.FSENDER.ADDRESS " />  -->
				
				<uni-list-item title=" ">
					<template v-slot:header>
						<text style="font-size: 14px;color: black;">发货地址</text>
					</template>
					<template v-slot:footer>
						<view style="width: 200px;font-size: 12px;color: black;text-align: end;">
							{{info.FSENDADDRESS}}
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-card> 
		 
	</view>
</template>


<script>
	 
	let t = '';
	export default {
		data() {
			return { 
				info:'', 
			}
		},  
		onReady() {
			 
		},
		onShow() {
			 
		},
		onLoad(options) { 
		 
			this.FWORDERNO = options.FWORDERNO
			this.init(); 
		},
		methods: {   
			init(){ 
				uni.showLoading({ title: '加载中' }); 
				let _this = this ;
				let data = {
					FNUMBER:_this.FWORDERNO
					// FNUMBER:'HJ001'
				}  
				_this.$Recipe.GetReceiveByFnumber(data).then((res) => {
					 
					_this.info = res.data[0]; 
					uni.hideLoading(); 
				})
			},
			copyToClipboard(){
				uni.setClipboardData({
				    data: this.info.FWLDH, // e是你要保存的内容
				    success: function () {
						uni.showToast({
							title:'复制物流单号成功',
							icon:'none'
						})
				    }
				}) 
			}  
		}
	}
</script>

<style lang="scss" scoped>
	 
</style>

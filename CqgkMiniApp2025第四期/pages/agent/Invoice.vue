<template>
	<view>
		<view class="bg-image-box">    
			<template>
				<uni-list>
					<uni-list-item :title="'工单编号: '+info.FWORDERNO" />
				</uni-list>
			</template> 
			
			<uni-card>
				<uni-list>
					<uni-list-item title="收货人" :rightText="info.FRECEIVER.Name[0].Value" />
					<uni-list-item title="电话号码" :rightText="info.FFRECEIVERTEL" />  
					<uni-list-item title="收货地址" :rightText="info.FRECEIVEADDRESS" />  
				</uni-list>
			</uni-card>
			<template>
				<uni-list>
					<uni-list-item title="收货清单" />
				</uni-list>
			</template> 
			<uni-table border stripe emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center" width="25px">序号</uni-th>
					<uni-th align="center">配件名称</uni-th>
					<uni-th align="center">数量</uni-th>
					<uni-th align="center">配件编号</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item,index) in info.FEntity" :key="index">
					<uni-td align="center">{{index+1}}</uni-td>
					<uni-td>{{item.FPARTSNAME.Name[0].Value}}</uni-td>
					<uni-td>{{item.FPARTSNAME.UseOrgId.Number}}</uni-td>
					<uni-td>{{item.FPARTSNAME.Number}}</uni-td>
				</uni-tr> 
			</uni-table>
			<button v-if="info.DocumentStatus !=='C'" type="warning" class="addbtn"  @click="addBtn">马上发货</button> 
		</view>
		
		 
	</view> 
</template>


<script>
	 
	let t = '';
	 
	export default { 
		data() {
			return {  
				FWORDERNO:'',
				info:'',
				tableList:[{
					fid: '',
					date: '',
					price: ''
				},{
					fid: '',
					date: '',
					price: ''
				}] 
			}
		},  
		onReady() {
			 
		},
		onShow() {
			 
		},
		onLoad(options) {  
			this.FWORDERNO = options.FWORDERNO
			// this.init(); 
		},
		methods: {   
			init(){ 
				let _this = this ;
				let data = {
					FNUMBER:_this.FWORDERNO
					// FNUMBER:'HJ001'
				}  
				_this.$Recipe.GetSendByFnumber(data).then((res) => {
					console.log('data',res) 
					_this.info = res.data  
				})
			},
			 
            addBtn(){
				let _this = this ;
				let data = {
					FWLDH:_this.info.FWLDH,
					FWLGS:_this.info.FWLGS,
					FREPAIRRPTIME:_this.info.FREPAIRRPTIME,
					FFREIGHT:_this.info.FFREIGHT,
					FID:_this.info.Id,
					FBillNo:_this.info.FWORDERNO
				}  
				_this.$Recipe.Savefahuo(data).then((res) => {
					console.log('data',res)  
				})
				 
            	 
            },  
			
			tab(e) {
				console.log(e)
			}
		}
	}
</script>

<style lang="scss" scoped> 

</style>

<template>
	<view>
		<uni-forms ref="baseForm">
			<!--  -->
			<!-- 产品名称 -->
			<uni-forms-item label="产品名称" required>
				<view @click="showMaterialList" class="w100">
					<uni-easyinput v-model="formData.FPRODUCTNAME" disabled placeholder="请选择产品" />
				</view>
			</uni-forms-item>

			<!-- 订货号 -->
			<uni-forms-item label="产品订货号" :required="type == 'Service_station'">
				<view class="w100" style="display: flex;">
					<uni-easyinput v-if="type !== 'Service_station'" class="w100" v-model="formData.FORDERNO" placeholder="请输入订货号" /> 
					<!-- <uni-easyinput v-show="false" class="w100" v-model="keyProd"   /> -->
					
					  
					<u-input v-if="type == 'Service_station'"   v-model="formData.FORDERNO" placeholder="请输入订货号" @input='$emit("choose")'  >
						<template slot="suffix">
							<u-icon   @click="toSearch" size="25" name="search"></u-icon>
						</template> 
					</u-input> 
				</view>
			</uni-forms-item>
	 
			<uni-forms-item label="产品编号"  v-if='status' v-for="(item,index) in productNoList" :key='item.id'>
				<uni-easyinput class="w100" v-model="item.value" placeholder="请输入编码" />
			</uni-forms-item>

			<!-- 产品编号 -->
			<uni-forms-item label="产品数量" >
				 
				<view class="w15"> {{FPRODUCTNONUMBER}} </view>
				<view class="w80"> 请通过增减产品编号自动修改 </view>
				 
			</uni-forms-item>
			<uni-forms-item :required="type == 'Service_station'"  :label="'产品编号'+(index+1)"  v-for="(item,index) in FPRODUCTNOLIST" :key='item.id'>
				<view   class="w100_box">
					<view class="w100_box_input">
						<uni-easyinput  v-model="item.FPRODUCTNO" placeholder="请输入编码"  />
					</view>
					<view class="icons_box">
						<view class="icon_item" v-if="FPRODUCTNOLIST.length>0&&index!==0" @click="delproductNo(index)">
							<uni-icons type="trash" size="25"></uni-icons>
						</view>
						<view class="icon_item" @click="addproductNo" v-if="index===0">
							<uni-icons type="plusempty" size="25"></uni-icons>
						</view>
					</view>
				</view>
			</uni-forms-item>
		</uni-forms>
		<!-- 产品名称选择器 -->
		<u-picker :show="show2" class="w100" :closeOnClickOverlay='true' @cancel='show2=false' @close='show2=false'
			@confirm='MaterialListConfirm' :columns="MaterialList" keyName="Fname"></u-picker>

	</view>
</template>

<script>
	let _self ;
	export default {
		props: {
			/**
			 * 获取默认的产品名称列表
			 */
			MaterialList: {
				type: Array,
				default () {
					return []
				}
			},
			status: {
				type: Boolean,
				default: false
			},
			keyProd:{
				type: String,
				default: false
			}
		},
		data() {
			return {
				show4: false,
				show2: false,
				formData: {
					FPRODUCTNAME: '',
					FPRODUCTNO: '',
					FORDERNO: '',
					number: '',

				},
				MaterialListnumber: '',
				type: '',
				typeList: [
					[{
						Fname: '整车(整机)'
					}, {
						Fname: '零售发动机'
					}, {
						Fname: '配件'
					}]
				],
				currentIndex: 0,
				productNoList: [],
				FPRODUCTNOLIST:[{
					FPRODUCTNO:'',
					id:new Date().getTime()
				}],
				FPRODUCTNONUMBER:1,
			}
		},
		created() {
			_self = this;
			let type = uni.getStorageSync('customertype'); 
			this.$emit("choose")
			this.type = type
			
			uni.$on('reSetPageOn', data=>{
				console.log('a组件传来的数据：@1', data)  
				_self.type = uni.getStorageSync('customertype'); 
			})
		},
		watch: {
			formData: {
				handler: function(val, oldValue) {
					if (!val.number) {
						// this.productNoList.splice(0)
					}
				},
				deep: true
			},
			keyProd: {
				handler(new__, old__) { 
					this.type = uni.getStorageSync('customertype');   
				},
				immediate: true,
				deep: true
			},
			
		},

		mounted() { },
		methods: {
			// 保存
			getSaveData() {
			  return {
			    formData: {...this.formData},
			    MaterialListnumber: this.MaterialListnumber,
			    FPRODUCTNAME: this.FPRODUCTNAME,
			    FPRODUCTNOLIST: [...this.FPRODUCTNOLIST], // 保存产品编号列表
			    FPRODUCTNONUMBER: this.FPRODUCTNONUMBER // 保存产品编号数量
			  }
			},
			// 设置草稿数据的方法
			setDraftData(draftData) {
			  this.formData = {...draftData.formData}
			  this.MaterialListnumber = draftData.MaterialListnumber
			  this.FPRODUCTNAME = draftData.FPRODUCTNAME
			  // 恢复产品编号列表
			  if (draftData.FPRODUCTNOLIST && Array.isArray(draftData.FPRODUCTNOLIST)) {
			    this.FPRODUCTNOLIST = draftData.FPRODUCTNOLIST.map(item => ({
			      ...item,
			      id: item.id || new Date().getTime() + Math.random() // 确保有id
			    }))
			  } else {
			    // 如果没有保存的数据，初始化为一个空项
			    this.FPRODUCTNOLIST = [{
			      FPRODUCTNO: '',
			      id: new Date().getTime()
			    }]
			  }
			  // 恢复产品编号数量
			  this.FPRODUCTNONUMBER = draftData.FPRODUCTNONUMBER || this.FPRODUCTNOLIST.length || 1
			},
			reSetType(){ 
				this.type = uni.getStorageSync('customertype');  
			},
			// 删除
			delproductNo(index){
				this.FPRODUCTNOLIST.splice(index,1);
				this.FPRODUCTNONUMBER = this.FPRODUCTNOLIST.length
			},
			//新增
				addproductNo(){
					this.FPRODUCTNOLIST.push({
						FPRODUCTNO:'',
					id:new Date().getTime()
					})
					this.FPRODUCTNONUMBER = this.FPRODUCTNOLIST.length
				},






			input_number_change: function(e) {
				this.setProductNoList();
			},

			setProductNoList() {
				if (!this.formData.number || this.formData.number == this.productNoList.length || this.formData.number >
					20) {
					return
				}
				let number = this.formData.number * 1;
				this.productNoList.splice(0)
				for (let i = 0; i < number; i++) {
					this.productNoList.push({
						id: +new Date() + '' + i,
						value: ''
					})
				}

			},
			setValues(obj) {
				console.log('objjjj',obj);
				this.formData.FPRODUCTNAME = obj.productname;
				obj.data.map((item,index)=>{
					item.id = new Date().getTime()+index
				})
				// this.formData.FPRODUCTNO = obj.FPRODUCTNO
				this.formData.FORDERNO = obj.FORDERNO
				this.FPRODUCTNOLIST = obj.data;
				this.MaterialListnumber = obj.F_ASSISTANT;
				
				
				this.FPRODUCTNONUMBER = this.FPRODUCTNOLIST.length
			},
			reset() {
				this.formData.FPRODUCTNAME = ''
				this.formData.FPRODUCTNO = ''
				this.formData.FORDERNO = ''
				this.MaterialListnumber = ''
			},
			toSearch() {
				if (!this.MaterialListnumber || this.MaterialListnumber == '') {
					uni.showToast({
						icon: 'none',
						title: '请选择产品名称'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/search/search?obj=' + encodeURIComponent(JSON.stringify({
						number: this.MaterialListnumber,
						forderno: this.formData.FORDERNO
					}))
				})
			},
			showMaterialList() {
				this.show2 = true
			},
			MaterialListConfirm(e) {
				this.$emit('choose')
				 
				this.formData.FPRODUCTNAME = e.value[0].Fname
				this.MaterialListnumber = e.value[0].FID
				this.formData.FORDERNO = '',
					this.formData.number = '',
					this.show2 = false
			},

			getObj() {
					 
					let arr = []
					this.FPRODUCTNOLIST.map((item,i)=>{
						let obj = {
							...this.formData,
							MaterialListnumber: this.MaterialListnumber,
							Fproductclass: this.currentIndex + ''
						}
							obj.FPRODUCTNO=item.FPRODUCTNO;
						arr.push(obj)
					})
					return arr
					

			},

		}
	}
	
	
</script>

<style lang="scss" scoped>
	.w100_box_input{
		width: 420rpx;
	}
	.w100_box {
		display: flex;
		width: 100%;
		align-items: center;
	}
.icons_box{
	width: 120rpx;
	padding-left: 20rpx;
	display: flex;
	align-items: center;
}
	.w100 { width: 100%; }
	.w15 { width: 15%;	
		float: left;
		line-height: 36px;    
		text-align: center;    
		background: #efefef
	}
	.w80 { 
		width: 80%;	
		float: right;
		line-height: 36px;
		color: blue;
		text-align: right
	}
</style>

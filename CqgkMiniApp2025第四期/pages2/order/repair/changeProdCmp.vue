<template>
	<view v-if="producInfo.FangAnId==2">
		<uni-card margin='0' spacing='0' padding='15'>
			<!-- 标题 -->
			<view class="title" style="display: flex;justify-content: space-between;font-size: 16px;">
				<text>配件 ({{minIndex+1}})</text>
				<!-- 关闭的图标 -->
				<u-icon name="close-circle" size="18" @click="close" v-if="minIndex != 0"></u-icon>
			</view>
			<!-- 表单 ref="prodCmpForm" -->
			<u--form labelPosition="left" ref="prodCmpForm" :model="formdata">
				<!-- 配件名称 -->
				<u-form-item label="配件名称" required labelWidth='100'>
					<view @click='toSearch'>
						<u--input disabled v-model="formdata.name.fname" 
						disabledColor="#ffffff"
						placeholder="请点击选择"
						></u--input>
					</view>
					
				</u-form-item>
				<!-- 故障原因件 -->
				<u-form-item label="故障原因件" required labelWidth='100'>
					<u-radio-group placement="row" v-model="boxList">
						<u-radio :customStyle="{marginRight: '20px'}" 
							v-for="(item, index) in checkboxList1" :key="index" :label="item.name" :name="item.name">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				
				<!-- {{JSON.stringify(formdata.name.FnumberCode)}} -->
				<!-- {{checkNameIsFirst()}} -->
				<!-- 新配件来源 -->
				<u-form-item label="新配件来源" required labelWidth='100'>
					<u-radio-group placement="column" v-model="radioValue" @change="radioChange">
						<u-radio :customStyle="{marginBottom: '8px'}" v-for="(item, index) in radioList" :key="index"
							:label="item.name"  :name="item.name" >
						</u-radio>
					</u-radio-group>
				</u-form-item> 
				 
				<u-form-item label="新配件订货号" labelWidth='100' :required="isFirst">
					<view style="display: flex;" >
						<u-input ref='part'      v-model="formdata.orderno" placeholder="请点击选择" disabledColor="#ffffff" >
							<template slot="suffix">
								<u-icon   @click="toSearch2" size="25" name="search"></u-icon>
							</template>
						
						</u-input> 
					</view>
				</u-form-item>
				 

				<!-- 是否有新配件编号 -->
				<template v-if="(isSelf=='1' || isSelf == '2') ">
					
					<u-form-item label="有新配件编号" labelWidth='100'>
						<u-radio-group placement="row" v-model="boxNew" @change="radioChangeNew">
							<u-radio :customStyle="{marginRight: '20px'}"  :disabled="isDisabledNew"
								v-for="(item, index) in checkboxNew" :key="index" :label="item.name" :name="item.name">
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<view class="" v-if=" boxNew=='有' "> 
						<view style="display: flex;" v-for="(item,index) in parts" :key='item.id'>
							<!-- 产品编号 -->
							<u-form-item label="新配件编号" labelWidth='100' :required="isFirst">
								<view style="display: flex;">
									<u-input ref='part'   v-model="item.value"></u-input>
								</view>
							</u-form-item>
							 
						</view>
					</view>
				</template>
				<!-- 新配件数量 -->
				<u-form-item label="新配件数量" required labelWidth='100'>
					<u-input :disabled="isDisabled"   :type="'number'" v-model="formdata.number"></u-input>
				</u-form-item>
				<view style="height: 20px;width: 100%;"> </view>
			</u--form>

		</uni-card>
	</view>
</template>

<script>
	import {
		FISSPP
	} from '@/common/SDK/tools/enum.js'
	export default {
		/**
		 * 编号  决定点击的是哪一个组件
		 */
		props: {
			item:{
				// 修改时候用
				type: Object,
				required: true
			},
			item2:{
				// 修改时候用
				type: Object,
				required: true
			}, 
			number: {
				type: String,
				required: true
			},
			maxIndex: {
				type: Number,
				required: true
			},
			minIndex: {
				type: Number,
				required: true
			},
			bigIndex: {
				type: Number,
				required: true
			},
			producInfo: {
				type: Object,
				required: true
			},
			isEdit: {
				type: Boolean,
				required: true
			}
		},
		data() {
			return {
				id: 1, // 用户配件编号的key值
				parts: [{
					id: 1,
					value: ''
				}], //配件编号列表数组
				isError: false, //是否故障原因件
				isSelf: '', //配件来源
				radioValue: '', //配件来源绑定变量
				radioList: [{
						name: '重油预投件'
					},
					{
						name: '服务站自备件'
					},
					{
						name: '重油调货'
					}
				], // 配件来源列表
				boxList: '', //是否故障原因件
				checkboxList1: [{
					name: '是'
				}, {
					name: '否'
				}], //故障原因件数组
				
				boxNew: '没有', //是否有新配件编号
				checkboxNew: [{
					label:'1',
					name: '有'
				}, {
					label:'2',
					name: '没有'
				}], //故障原因件数组
				
				formdata: {
					name: {
						fname: '', //配件名称
						Fentryid: '', //配件名称对应的fid
						fcode: '', //配件名称对应的编号
					},
					oldProductNo: '',
					orderno: '',
					number: '', //新配件数量
					FNEWSOURCECHECK:'0', //是否有新配件编号
				},
				isDisabled:false,
				isDisabledNew:false,  //是否可修改 
				isFirst:false,  //是否可修改 
			}
		},
		created() {
			let item = this.item;
			 
		// 1	FPARTSNAME:FFF.name.Fentryid,
		// 1	F_ASSISTANT:FFF.F_ASSISTANT,// 维修产品名称
		// 1	FQTY: FFF.number,//新配件数量
		// 1	FISERROR:FFF.isError?'1':'0',//故障原因件
		// 1	FNEWSOURCE:FFF.needCenter,//新建来源
		// 1	F_ASSISTANT1:FFF.oldFPRODUCTNO,//新配件订货号
		// 1	FREMARKS:FFF.productnumber,//新建编号
		// 1	F_ASSISTANT2:FFF.WXDHH,  //维修订货号  B916-040S
		// 	FPRODUCTNUMBER1:FFF.oldFPRODUCTNO ,// 故障件编号
		// 1	FWEIXIUSIN:FFF.FWEIXIUSIN
			
			if(this.isEdit&&this.producInfo.FangAnId=='2'){
				
				
				
				// 赋值写入
				this.isError = item.FISERROR=='1'?true:false; 		//故障原因件
				this.boxList = item.FISERROR=='1'?'是':'否'; 		//故障原因件
				this.isSelf  = Number(item.FNEWSOURCE);  			//新建来源
				if(item.FNEWSOURCECHECK=='1')this.boxNew = '有';   	//有新配件编号
				if(item.FNEWSOURCECHECK=='0')this.boxNew = '没有'; 	//有新配件编号
				// this.boxNew  = item.FNEWSOURCECHECK=='1'?'有':'没有';  
				if(item.FNEWSOURCECHECK=='1'){
					this.isDisabled = true;
				}
				
				Object.keys(FISSPP).forEach(key => {
					if (FISSPP[key].value == item.FNEWSOURCE) {
						this.radioValue = FISSPP[key].name
					}
				})
				
				
				
				this.formdata.name.Fentryid=item.FPARTSNAME //配件id
				this.formdata.name.fname = item.FPARTSNAMESTR //配件名字
				this.formdata.name.FnumberCode = item.FPARTSNAMENUMBER //配件编号
				
				let arrCode =   item.FPARTSNAMENUMBER.split(".");
				if(arrCode.length  ==  1 ){
					this.isFirst = true ; //一级必填  
					this.isDisabledNew = true;
				}
				
				this.formdata.number = item.FQTY=="0"?'0': item.FQTY  //数量
				
				this.formdata.FNEWSOURCECHECK = item.FNEWSOURCECHECK //是否有新配件编号
				
				this.parts[0].value = item.FREMARKS; //新建编号
				// this.producInfo.FangAnId = item.FWEIXIUSIN //方案编号
				this.number = item.F_ASSISTANT
				// this.producInfo.tipFPRODUCTNO = item.F_ASSISTANT1 //新配件订货号
				this.formdata.orderno = item.F_ASSISTANT1
				// this.producInfo.name = item.F_ASSISTANT2
				 // debugger
			}
			
			 
			
		},
		watch:{
			isSelf(n){
				this.$emit('changeBoxHeight',{
					index3:this.minIndex,
					index:this.bigIndex,
					index2:this.maxIndex,
				})
			},
			'formdata.name.fname'(oldVal,newVal){
					console.log(1111111111111,oldVal,222222222,newVal)
					 
					let code = this.formdata.name.FnumberCode ; 
					if(code ){
						let arrCode =   code.split("."); 
						if(arrCode.length  ==  1 ){
							this.isFirst = true ; //一级必填
							this.boxNew = '有';
							this.formdata.number = 1;
							this.formdata.FNEWSOURCECHECK = '1'
							this.isDisabled = true;
							this.isDisabledNew = true;
						}
					}
					if(newVal=='')return
					let arrCode =   code.split("."); 
					this.isSelf = '' 
					this.boxList ='';
					this.radioValue = '';
					this.formdata.orderno = '';
					if(arrCode.length  ==  1 ){ //第一级分类 新配件编号默认 有且不可更改
						this.boxNew = '有';
						this.formdata.number = 1;
						this.formdata.FNEWSOURCECHECK = '1'
						this.isDisabled = true;
						this.isDisabledNew = true;
					} else{
						this.boxNew = '没有';
						this.formdata.number = 1;
						this.isDisabled = false;
						this.isDisabledNew = false;
						this.isFirst = false ;  
						this.formdata.FNEWSOURCECHECK = '0'
					}
					 
			}
			
		},
		methods: {
			toSearch2() {
				 
				let arr = {
						productnumber: this.producInfo.productnumber,
						number: this.number?this.number:this.producInfo.F_ASSISTANT,
						number: this.number,
						index3:this.minIndex,
						index:this.bigIndex,
						index2:this.maxIndex,
						forderno: this.formdata.orderno,
						typeOrder: 'order'
					}
					  
				uni.navigateTo({
					url: '/pages/search/search?obj=' + encodeURIComponent(JSON.stringify(arr))
				})
			},
		 
			/**
			 * 设置值
			 */
			setValue2(obj) {
				this.formdata.oldProductNo = obj.FPRODUCTNO
				this.formdata.orderno = obj.Forderno
			},
			setValue3(obj){
				console.log(obj);
			},
			/**
			 * 设置值
			 */
			setValue(obj) {
				if (!obj) {
					return
				}
				 
				this.formdata.name.fname = obj.FDATAVALUE
				this.formdata.name.Fentryid = obj.F_ASSISTANT
				this.formdata.number = obj.FQTY.split('.')[0]
				if (obj.FISERROR == '1') {
					this.isError = true
					this.boxList = '是'
				} else {
					this.boxList = '否'
				}
				this.isSelf = obj.FISSPP

				Object.keys(FISSPP).forEach(key => {
					if (FISSPP[key].value == obj.FISSPP) {
						this.radioValue = FISSPP[key].name
					}
				})

				let flag = obj.FPRODUCTNUMBER1.indexOf(',')
				this.parts.splice(0)
				if (flag == -1) {
					this.parts.push({
						id: +new Date() + '',
						value: obj.FPRODUCTNUMBER1
					})
				} else {
					obj.FPRODUCTNUMBER1.split(',').forEach((item, index) => {
						this.parts.push({
							id: +new Date() + '' + index + item,
							value: item
						})
					})
				}
			},
			/**
			 *  删除配件编号
			 */
			descrement(index) {
				this.parts.splice(index, 1)
			},
			/**
			 *  添加配件编号
			 */
			addPart() {
				this.id++
				this.parts.push({
					id: this.id
				})
			},
			/**
			 *  单选框改变事件
			 */
			radioChange(e) {
				 
				Object.keys(FISSPP).forEach(key => {
					if (FISSPP[key].name == e) {
						this.isSelf = FISSPP[key].value
					}
				})
				this.changeNameOver();
				 
			},
			//获取产品是否第一级分类
			checkNameIsFirst(){
				let code = this.formdata.name.FnumberCode ;
				 
				if(code){
					let arrCode =   code.split(".");
					return arrCode.length
				}
				
			},
			//重置初始值
			changeNameOver(){
				
				this.isDisabledNew = false
				let code = this.formdata.name.FnumberCode ;
				let arrCode =   code.split(".");
							 
				if (this.isSelf == 3) {
					this.parts = [{
						id: +new Date + '',
						value: ''
					}]
					this.boxNew = '没有';
					this.isDisabled = false;
					if(arrCode.length  ==  1 ){ //第一级分类 新配件编号默认 有且不可更改 
						this.formdata.number = 1;
						this.isDisabled = true; 
					} 
				}else{ 
					if(arrCode.length  ==  1 ){ //第一级分类 新配件编号默认 有且不可更改 
						this.boxNew = '有';
						this.formdata.number = 1;
						this.isDisabled = true;
						this.isDisabledNew = true;
					} 
				}
			},
			/**
			 *  单选框改变事件 新配件编号
			 */
			radioChangeNew(e){
				 
				this.boxNew = e ;
				if(e=='有'){
					this.formdata.FNEWSOURCECHECK = '1' //是否有新配件编号
					this.formdata.number = 1;
					this.isDisabled = true;
				}else{ 
					this.formdata.FNEWSOURCECHECK = '0' //是否有新配件编号
					this.isDisabled = false;
					this.parts[0].value =  '';
				}
				 
			},
			/**
			 * 发射关闭事件 携带上点击的组件个数 
			 */
			close() {
				this.$emit('close', {
					index3: this.minIndex,
					index2: this.maxIndex,
					index: this.bigIndex
				})
			},
			/**
			 *  父组件调用 返回obj对象用于提交数据
			 */
			add() {
				 
				let productnumber
				if (this.isSelf != 3) {
					let arr = this.parts.map(item => {
						return item.value
					})
					productnumber = arr.join(',')
				} else {
					productnumber = ''
					this.formdata.FNEWSOURCECHECK = '0' //选择重邮配货 就没有新配件编号 
				}
				let isSelf;

				Object.keys(FISSPP).forEach(key => {
					if (FISSPP[key].name == this.radioValue) {
						isSelf = FISSPP[key].value
					}
				})


				let isError;
				if (this.boxList == '是') {
					isError = true
				} else {
					isError = false
				}
				let obj = {
					tipTitle:`${this.producInfo.name}-${this.producInfo.productname}-产品编号${this.producInfo.tipFPRODUCTNO}--配件${this.minIndex+1}`,
					// tipTitle:`${this.producInfo.name} -- 【${this.producInfo.tipFPRODUCTNO}】 --配件${this.minIndex+1}`,
					tipBoxList:this.boxList,
					name: {
						fname: this.formdata.name.fname,
						Fentryid: this.formdata.name.Fentryid,
						fcode: this.formdata.name.FnumberCode,
					},
					maxName:this.producInfo.name,
					oldFPRODUCTNO:this.producInfo.tipFPRODUCTNO,
					number: this.formdata.number,
					needCenter: isSelf,
					isError,
					id: this.formdata.ID,
					productnumber,
					F_ASSISTANT:this.number,
					
					WXDHH:this.producInfo.name,  // 维修订货号
					Forderno: this.formdata.orderno,
					// F_ASSISTANT:this.formdata.Forderno,
					FWEIXIUSIN:this.producInfo.FangAnId,
					FPRODUCTNO: this.producInfo.tipFPRODUCTNO,
					FNEWSOURCECHECK:this.formdata.FNEWSOURCECHECK,
				}
				  
				return obj
			},
			/**
			 *  检查是否勾选了故障原因件 
			 */
			check() {
				if (this.boxList == '是' || this.boxList == '否') {
					return true
				} else {
					return false
				}
			},
			/**
			 * 检查是否勾选了配件来源
			 */
			check2() {
				if (this.radioValue == '重油预投件' || this.radioValue == '服务站自备件' || this.radioValue == '重油调货') {
					return true
				} else {
					return false
				}
			},
			/**
			 * 检查配件名称
			 */
			check3() {
				return !!this.formdata.name.fname
			},
			/**
			 * 检查新配件数量
			 */
			check4() {
				return !!this.formdata.number
			},
			/**
			 * 去搜索界面把  type  和   当前选择的number携带上
			 */
			toSearch() {
				
				let arr = {
						type: 'reply',
						number: this.number,
						index3:this.minIndex,
						index:this.bigIndex,
						index2:this.maxIndex,
						Fnumber: this.producInfo.productname
					}
				 
				uni.navigateTo({
					url: '/pages/search/search?obj=' + encodeURIComponent(JSON.stringify(arr))
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	
	
	
	/deep/ .u-input--radius.data-v-113bc24f, .u-input--square.data-v-113bc24f{
		background-color: white !important;
	}
	
	.title {
		font-weight: bold;
	}

	.add {
		color: #169BD5;
		font-size: 28rpx;
		margin-top: 20rpx;
		display: flex;
		justify-content: flex-end;
	}
</style>

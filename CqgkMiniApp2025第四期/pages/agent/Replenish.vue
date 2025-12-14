<template>
	<view class="bg-image-box">    
		<template>
			<uni-list>
				<uni-list-item :title="'工单编号: '+info.FWORDERNO" />
			</uni-list>
		</template> 
		
		<uni-card>
			<uni-list>
				 
				<uni-list-item title="收货方" :rightText="info.FRECEIVER.Name[0].Value" /> 
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
				<uni-forms ref="baseForm"  :rules="baseFormRules" :modelValue="formData"> 
					<uni-forms-item label="收货人" required>
						<uni-easyinput v-model="formData.FRECEIVERUSER" placeholder="请输入收货人" />
					</uni-forms-item>
					<uni-forms-item label="电话号码" required>
						<uni-easyinput v-model="formData.FRECEIVERTEL" placeholder="请输入电话号码" />
					</uni-forms-item> 
				</uni-forms>
				  
				
				<uni-forms ref="baseForm" :modelValue="formData">
					
					<uni-forms-item label="发货类型" required style="padding-top: 10px;">
						<!-- <view @click="show=true"> -->
						<view>
							<uni-easyinput v-model="sendType" disabled placeholder="请选择产品类别" />
						</view>
					</uni-forms-item>
					
					<uni-forms-item label="发货时间" required>
						<uni-datetime-picker  placeholder="请选择发货时间" :showSale="false" type="datetime" hide-second="true" :clearIcon="false"
							v-model="formData.FREPAIRRPTIME" />
					</uni-forms-item>
					<uni-forms-item label="物流单号" required>
						<uni-easyinput v-model="formData.FWLDH" placeholder="请输入物流单号" />
					</uni-forms-item>
					<uni-forms-item label="发运方式" required>
						<uni-easyinput v-model="formData.FWLGS" placeholder="请输入发运方式" />
					</uni-forms-item>
					<uni-forms-item label="运费" required>
						<uni-easyinput v-model="formData.FFREIGHT" type="number" placeholder="请输入运费" />
					</uni-forms-item>
				</uni-forms>
				
			</uni-list>
			
		</uni-card> 
		
		<view class="" style="margin: 30rpx;">
			<uni-table border stripe emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<!-- <uni-th align="center" width="25px">序号</uni-th> -->
					<uni-th align="center">配件名称</uni-th>
					<uni-th align="center">产品订货号</uni-th>
					<uni-th align="center">数量</uni-th>
					<uni-th align="center">规格型号</uni-th>  
					<uni-th align="center">新配件编号</uni-th> 
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item,index) in info.FEntity" :key="index">
					<!-- <uni-td align="center">{{index+1}}</uni-td> -->
					<uni-td>{{item.FPARTSNAME.Name[0].Value}}</uni-td>
					<uni-td>{{item.FORDERNO || '-'}}</uni-td>
					<uni-td>{{item.FNUMSEND}}</uni-td>
					<uni-td>{{item.FPARTSNAME.Specification[0].Value}}</uni-td>
					<uni-td v-if="!item.FNEWSOURCECHECK ">{{item.FNEWNUMBER}}</uni-td>
					<uni-td v-if="item.FNEWSOURCECHECK ">
						<uni-easyinput v-model="entry[index].FNEWNUMBER" placeholder="请输入新配件编号" />
					</uni-td>
				</uni-tr> 
			</uni-table>
		 	
		 </view>	
		 
		 <uni-card>
		 	<uni-list>
		 		<uni-list-item title="中心库" :rightText="info.FSENDER.Name[0].Value" />
		 	  
		 		<uni-forms ref="baseForm" :modelValue="formData"> 
		 			<uni-forms-item label="发货人" required>
		 				<uni-easyinput v-model="formData.FSENDERNAME" placeholder="请输入发货人" />
		 			</uni-forms-item>
		 			<uni-forms-item label="电话号码" required>
		 				<uni-easyinput v-model="formData.FSENDPHONE" placeholder="请输入电话号码" />
		 			</uni-forms-item>
		 			<uni-forms-item label="发货地址" required>
		 				<uni-easyinput v-model="formData.FSENDADDRESS" placeholder="请输入发货地址" />
		 			</uni-forms-item>
		 		</uni-forms>
		 		
		 	</uni-list>
		 </uni-card> 
		 
		<view class="btn" @click="showModel=true" v-if="tabIndex == '0'" 
			style="display: flex;justify-content: center;align-items: center;color: #FFFFFF;border-radius: 5px;margin: 0 auto;background-color: #169BD5;width: 120px;height: 40px;">
			确认发货
		</view>
		 <!-- 保存确认 -->
		 <u-modal :show="showModel" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="addBtn"
		 	:title="'确认发货'" @cancel="showModel=false" @close="showModel=false"></u-modal>	
	</view>
</template>


<script>
	 
	let t = '';
	export default {
		data() {
			return {  
				showModel:false,
				FWORDERNO:'',
				info:'',
				show:false,
				sendType:'',
				sendIndex: 0 + '' ,//发货类型index
				typeList:[ 
					[{
						name: '更换配件',val:'1'
					}, {
						name: '补件申请',val:'2'
					}, {
						name: '旧件发货',val:'3'
					}], 
				],
				tabIndex:'',
				tableList:[ ] ,
				formData:{
					FWLDH:'',
					FWLGS:'',
					FREPAIRRPTIME:new Date().getTime(),
					FFREIGHT:0,
					FSENDERNAME:'',
					FSENDPHONE:'',
					FSENDADDRESS:'',
					FRECEIVERUSER:'',
					FRECEIVERTEL:'',
					FWORDERSTATUS:''
				},
				entry:[],
				addTag:true
			}
		},  
		onReady() {
			 
		},
		onShow() {
			 
		},
		onLoad(options) { 
			console.log('FWORDERNO',options) 
			this.FWORDERNO = options.FWORDERNO
			this.tabIndex = options.tabIndex
			this.init(); 
		},
		methods: {   
			/**
			 * 获取发货类别
			 */
			getSendType(val) {
				switch (val) {
					case '1':
						return '更换配件';
					case '2':
						return '补件申请';
					case '3':
						return '旧件发货';
				}
			},
			/**
			 *  确定发货类别
			 */
			TypeConfirm(e) {
				console.log(e)
				this.sendType = e.value[0].name
				this.formData.FWORDERSTATUS =  e.value[0].val
				this.sendIndex = e.indexs[0] + ''
				
				this.show = false
			},
			init() {
			  let _this = this;
			
			  const isBlank = (val) => {
			    return val === null || val === undefined || String(val).trim() === '';
			  };
			  const isValidPhone = (val) => {
			    return /^1[3-9]\d{9}$/.test(String(val));
			  };
			
			  let data = {
			    FNUMBER: _this.FWORDERNO
			  };
			
			  _this.$Recipe.GetSendByFnumber(data).then((res) => {
			    console.log('=========== 接口返回值 ==========');
			    console.log(JSON.stringify(res.data, null, 2));
			
			    const d = res.data || {};
			    const sender = d.FSENDER || {};
			
			    // 主数据
			    _this.info = d;
			
			    _this.formData.FWLDH = isBlank(d.FWLDH) ? '' : d.FWLDH.trim();
			    _this.formData.FWLGS = isBlank(d.FWLGS) ? '' : d.FWLGS.trim();
			    _this.formData.FFREIGHT = d.FFREIGHT || 0;
			    _this.formData.FREPAIRRPTIME = ''; // 强制重新选择
			
			    /* =======================
			       二、发货信息（核心修复）
			    ======================= */
			
			    // 发货人：单据 → 中心库
			    _this.formData.FSENDERNAME = !isBlank(d.FSENDERNAME)
			      ? d.FSENDERNAME.trim()
			      : (sender?.Name?.[0]?.Value || '');
			
			    // 发货电话：合法手机号 → 中心库电话
			    if (isValidPhone(d.FSENDPHONE)) {
			      _this.formData.FSENDPHONE = d.FSENDPHONE;
			    } else {
			      _this.formData.FSENDPHONE = sender?.TEL || '';
			    }
			
			    // 发货地址：单据 → 中心库
			    _this.formData.FSENDADDRESS = !isBlank(d.FSENDADDRESS)
			      ? d.FSENDADDRESS.trim()
			      : (sender?.ADDRESS || '');
			
			    
			    _this.formData.FRECEIVERUSER = isBlank(d.FRECEIVERUSER) ? '' : d.FRECEIVERUSER.trim();
			    _this.formData.FRECEIVERTEL = isBlank(d.FRECEIVERTEL) ? '' : d.FRECEIVERTEL.trim();
			    _this.formData.FWORDERSTATUS = d.FWORDERSTATUS;
			
			    // 发货类型文字
			    _this.sendType = _this.getSendType(d.FWORDERSTATUS);

			    _this.entry = [];
			    (d.FEntity || []).forEach((item) => {
			      if (item.FNEWSOURCECHECK) {
			        let num = isBlank(item.FNEWNUMBER) ? '' : item.FNEWNUMBER.trim();
			        if (_this.tabIndex == 1) {
			          num = '';
			        }
			        _this.entry.push({
			          id: item.Id,
			          FNEWNUMBER: num
			        });
			      }
			    });
			    console.log('=========== 发货信息最终值 ==========');
			    console.log('发货人:', _this.formData.FSENDERNAME);
			    console.log('发货电话:', _this.formData.FSENDPHONE);
			    console.log('发货地址:', _this.formData.FSENDADDRESS);
			    console.log('===================================');
			  });
			},
			 
            addBtn(){
				let _this = this ;
				_this.showModel = false ;
				let data = {
					FWLDH:_this.formData.FWLDH,
					FWLGS:_this.formData.FWLGS,
					FREPAIRRPTIME:_this.formData.FREPAIRRPTIME,
					FFREIGHT:_this.formData.FFREIGHT,
									
					 
					FSENDERNAME:_this.formData.FSENDERNAME,
					FSENDPHONE:_this.formData.FSENDPHONE,
					FSENDADDRESS:_this.formData.FSENDADDRESS,
					
					FRECEIVERUSER:_this.formData.FRECEIVERUSER,
					FRECEIVERTEL:_this.formData.FRECEIVERTEL,
					FWORDERSTATUS:_this.formData.FWORDERSTATUS,
					
					FID:_this.info.Id,
					FBillNo:_this.info.FWORDERNO,
					FCustID:uni.getStorageSync('Fnumber'),
					entry:this.entry
				}  
				console.log(data)
				// return
				if(!this.formData.FRECEIVERUSER || !this.formData.FRECEIVERTEL || !this.formData.FWORDERSTATUS ){
					uni.showToast({
						icon: 'none',
						title: '请完善收货信息！'
					})
					return 
				}
				if(!this.formData.FWLDH   || !this.formData.FWLGS || !this.formData.FREPAIRRPTIME){
					uni.showToast({
						icon: 'none',
						title: '请完善发运信息！'
					})
					return 
				}
				
				if (parseFloat(this.formData.FFREIGHT).toString() == "NaN" ){
					uni.showToast({
						icon: 'none',
						title: '运费，数据非法或为空！'
					})
					return 
				}
				if(!this.formData.FSENDERNAME || !this.formData.FSENDPHONE || !this.formData.FSENDADDRESS ){
					uni.showToast({
						icon: 'none',
						title: '请完善发货信息！'
					})
					return 
				}
				let tag = 0 ;
				this.entry.map((item,index) => {
					if(!item.FNEWNUMBER || item.FNEWNUMBER ==' '){
						tag++    
					}						 
				})  
				if(tag>0){ 
					uni.showToast({
						icon: 'none',
						title: '请录入新配件编号！'
					})
					return
				}
				
				if(typeof(data.FREPAIRRPTIME) == 'number'){
					data.FREPAIRRPTIME = this.happenTimeFun(data.FREPAIRRPTIME )
				}
				 // data.FREPAIRRPTIME = this.happenTimeFun(data.FREPAIRRPTIME )
				// return
				_this.$Recipe.Savefahuo(data).then((res) => {
					console.log('data',res)  
					if (res?.msg == 'Success') { 
						uni.showToast({
							icon: 'none',
							title: '补货成功'
						})
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/agent/indexbh', 
							})
						}, 1000)
									 	
					} else {
						uni.showToast({
							icon: 'none',
							title: '补货失败'
						})
					}
				})
				 
            	 
            },  
		
			
			happenTimeFun(num){//时间戳数据处理 
				let date = new Date(num); 
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;//月补0
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;//天补0
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;//小时补0
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;//分钟补0
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;//秒补0
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m  
			},
		}
	}
</script>

<style lang="scss" scoped>
	 
</style>

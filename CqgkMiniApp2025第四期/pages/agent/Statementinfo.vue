<template>
	<view class="bg-image-box">    
		<uni-card v-show="!showKP">
			<uni-section title="结算信息" type="line"> 
				<uni-list-item title="结算时间" :rightText="times" />
				<uni-list-item title="结算单号" :rightText="FBillNo" />
			</uni-section> 
			
			<uni-table border stripe emptyText="暂无更多数据"> 
				<uni-tr>
					<uni-th align="center" width="25px">序号</uni-th>
					<uni-th align="center">项目</uni-th>
					<uni-th align="center">工单编号</uni-th> 
					<uni-th align="center">核定金额</uni-th> 
				</uni-tr>
				 
				<uni-tr v-for="(item,index) in info.FEntity" :key='index'>
					<uni-td align="center">1</uni-td> 
					<uni-td>{{item.FCOSTNAME}}</uni-td>
					<uni-td> 
						<span   @click="orderBtn(item.FREPIARENO)" style="text-decoration: underline;color: blue;">{{item.FREPIARENO}}</span>
					</uni-td>
					<uni-td>{{item.Fentrycost}}</uni-td> 
				</uni-tr>  
			</uni-table>
		</uni-card>
		 
		 
		
		<uni-card v-show="showKP">
			<uni-section title="开票信息" type="line"> 
				<uni-list>
					<uni-list-item title="公司名称" :rightText="KP.INVOICETITLE" />
					<uni-list-item title="开票税号" :rightText="KP.FTAXREGISTERCODE" />
					<uni-list-item title="单位地址" :rightText="KP.INVOICEADDRESS" /> 
					<uni-list-item title="开户银行" :rightText="KP.INVOICEBANKNAME " />  
					<uni-list-item title="银行账号" :rightText="KP.INVOICEBANKACCOUNT " />    
				</uni-list>
			</uni-section>  
		</uni-card>
		<uni-card v-show="showKP">
			<!-- <uni-section title="重油高科开票信息" type="line"> -->
				<uni-list>
					<uni-list-item title="公司名称" :rightText="CYinfo.INVOICETITLE" />
					<uni-list-item title="开票税号" :rightText="CYinfo.FTAXREGISTERCODE" />
					<uni-list-item title="单位地址" :rightText="CYinfo.INVOICEADDRESS" /> 
					<uni-list-item title="开户银行" :rightText="CYinfo.INVOICEBANKNAME " />  
					<uni-list-item title="银行账号" :rightText="CYinfo.INVOICEBANKACCOUNT " />    
				</uni-list>
			<!-- </uni-section> -->
		</uni-card>
		 
		<view class="" v-if="info.FSettlementPay !=='1'">
			
		
			<view class="btn btn-sn" v-if="!showKP" @click="showKP=true;" >
				确定开具发票
			</view>
			
			<view class="btn btn-sn btn-sn-2 left" v-if="showKP" @click="showModel=true;">
				确定
			</view>
			<view class="btn btn-sn btn-sn-2 right" v-if="showKP" @click="showKP=false;">
				取消
			</view>
		</view>
		
		<view class="" v-if="info.FSettlementPay =='1'"> 
			<view class="btn btn-sn" style="background-color: #666;" v-if="!showKP" @click="showKP=true;" >
				已开具发票
			</view> 
		</view>
		<!-- 保存确认 -->
		<u-modal :show="showModel" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="addBtn"
			:title="'确定开具发票'" @cancel="showModel=false;showKP=false;" @close="showModel=false;showKP=false;">
			<!-- <view class="slot-content">
				<rich-text >
					<uni-section>
						<uni-list-item title="公司名称" :rightText="KP.INVOICETITLE" />
						<uni-list-item title="开票税号" :rightText="KP.FTAXREGISTERCODE" />
						<uni-list-item title="单位地址" :rightText="KP.INVOICEADDRESS" /> 
						<uni-list-item title="开户银行" :rightText="KP.INVOICEBANKNAME " />  
						<uni-list-item title="银行账号" :rightText="KP.INVOICEBANKACCOUNT " />    
					</uni-section>  
				</rich-text>
			</view> -->
		</u-modal>	
		 
		<view class="kp-notice" v-if="!showKP && info.FSettlementPay !=='1'">
			若账单有误，请电话联系服务中心修改。若账单无误，请开发票寄送给服务中心。联系电话：<span class="kp-tel">023-65293989</span>
		</view>
	</view>
</template>


<script>
	 
	let t = '';
	export default {
		data() {
			return { 
				KP:[],
				info:[],
				times:'',
				CYinfo:'',
				FBillNo:'',
				showKP:false,
				showModel:false,
				content:'公司名称:12312313<br>公司名称:12312313<br>公司名称:12312313<br>公司名称:12312313<br>',
			}
		},  
		onReady() {
			 
		},
		onShow() {
			 
		},
		onLoad(option) { 
			let obj = JSON.parse(decodeURIComponent(option.obj));
			this.FBillNo = obj.FBillNo
			this.init(); 
			this.initKP();
		},
		methods: {   
			init(){
				let _this = this ;
				let data = {
					fnumber: this.FBillNo,
					formId:'TESU_InvNotice'
				}  
				 
				_this.$Recipe.GetAllDetail(data).then((res) => { 
					_this.info = res.data ;
					_this.getJStime(); 
				})
				
				let data1 = {
					fnumber: 'CYEFI',
					formId:'BD_Customer'
				}  
				_this.$Recipe.GetAllDetail(data1).then((res) => { 
					_this.CYinfo = res.data ; 
				})
				
			},
			getJStime(){
				let stime = this.info.FSETTLETSTARTDATE
				let etime = this.info.FSELLTEENDDATE
				console.log(stime,etime)
				let s = stime.toString().slice(0,10)
				let e = etime.toString().slice(0,10)
				this.times = s +' ~ '+ e 
			},
			initKP(){
				let _this = this ;
				let data = {
					fnumber: uni.getStorageSync('userNumber'),
					formId:'BD_Customer'
				}  
				 
				_this.$Recipe.GetAllDetail(data).then((res) => { 
					_this.KP = res.data 
					_this.content = ''
					// _this.WEIFU = 0
				})
			},
            addBtn(){
				// this.$Recipe.toast('开票接口正在调试中。。。')
				 
				// return
				let _this = this ;
				let data = {
					FBillNo: _this.FBillNo,
					FSettlementPay:1
				}  
				uni.showLoading({ title: '加载中' });    
				_this.$Recipe.UpdateSettle(data).then((res) => { 
					 
					_this.showModel=false
					_this.showKP = false 
					uni.hideLoading(); 
					uni.navigateBack();
				})  
            },  
			orderBtn(FREPIARENO){ 
				 
				uni.showLoading({ title: '加载中' });   
				let data ={
					FID:uni.getStorageSync('Fnumber') ,
					type:'station' ,
					datastatus: 'complete' ,
				}
				 
				
				this.$Recipe.getRepairReportListByOpenid(data).then((res) => {
					 let list = res.data;
					 let info = [];
					 console.log('list:',list)
					 list.forEach(item => {
					 	if(item.FWORKORDERNO1  == FREPIARENO){ info = item; } 
					 }); 
					 console.log('info:',info)
					 uni.hideLoading();  
					 if (info.billtype == 'baoxiu') {
					 	uni.navigateTo({
					 		url: '/pages2/order/reportRepair/info?obj=' + encodeURIComponent(JSON.stringify(info))
					 	});
					 }
					 if (info.billtype == 'weixiu') {
					 	uni.navigateTo({
					 		url: '/pages2/order/repair/info?obj=' + encodeURIComponent(JSON.stringify(info)) 
					 	});
					 }
				})
				
				 
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg-image-box{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;  
		background-size: 100% 100%; 
		background-repeat: no-repeat;
		z-index: 8;
		height: 100%;
		
	}  
	.button-box{
		position: fixed;
		bottom:10%;
		left: 20%;
		text-align: center;
		margin: 0;
		padding: 0;
		width: 60%;
		z-index:99
	} 
	.title-box{
		width: 100%;
		height: 400px;
		line-height: 400px;
		text-align: center;
		font-weight: bold; 
		font-size: 20px;
		margin: 0;
		padding: 0; 
	} 
	.ani-box{
		width: 50px;
		height: 50px;
		margin-left: 140px;
		margin-top: 140px;
		font-size: 2px; 
		color: #FFFFFF;  
	}
	.ani-notice{
		width: 100%;
		height: 100px;
		font-size: 16px;
		color: red; 
		color: #FFFFFF;  
		padding-top: 20px;
	} 
	.mask{
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		background: #000000;
		opacity: 0.1;
		position: fixed;
		top: 0;
		left: 0;
	}  
	.kp-notice{
		position: absolute;
		left: 0;
		bottom: 0;
		padding: 10px 20px 30px 20px;
		font-size: 10px;
		text-align: center;
	}
	.kp-tel{
		color: blue;
	}
	.btn-sn{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 80px;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		border-radius: 5px;
		margin: 0 auto;
		background-color: #169BD5;
		width: 120px;
		height: 40px;
		line-height: 40px;
		text-align: center;
	}
	.btn-sn-2{
		bottom: 20px;
	}
	.left{
		left: 50%;
	}
	.right{
		right: 50%;
	}
</style>

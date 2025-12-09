<template>
	<view class="mine">
		 
		
		<view class="btn"
			style="display: flex;flex-direction: column;align-items: center;width: 70px;position: fixed;top: 75%;right: 3%;"
			@click="gohead">
			<image style="height: 40px;width: 40px;" src="../../../static/ic_baoxiu.png" mode=""></image>
			<text style="color:#F3A73F;font-weight: bold;">点击</text>
			
			
		</view>
		<view style="color:#efefef;font-weight: bold;position: absolute;bottom: 20px;text-align: center;left: 0;right: 0;font-size: 12px;">
			{{MSG_TYPE}} -- {{CUSTOM_TYPE}}-- {{FBillNo}}-- {{RUN}} --{{ORDER_TYPE}}  
		</view>

	</view>
</template>
<script>
	 
	export default {
		data() {
			return {
				info:[], 
				orderList:[],
				orderInfo:[],
				FList:[],
				Finfo:[],
				_freshing:false, 
				indexNum:0,
				data:{
					MSG_TYPE:'BXD_TJ,BXD_TG,FWZ_JD,TZ_HJ,TZ_FH,JJFH_SH,FHD_SH,WXQK,FHD_SH',
					FBillNo:'',
					CUSTOM_TYPE:'' 
				},
				MSG_TYPE:'',
				CUSTOM_TYPE:'',
				FBillNo:'',
				ORDER_TYPE:'',
				RUN:'0', 
			}
		},
		/**
		 * 检查登录
		 */
		onShow() {
			 //保修单提交后给用户发消息
			 // Quartz.SendBaoxiuSubCheck();
			 // //报修单审核以后给服务站发消息
			 // Quartz.SendBaoxiuCheck(); 
			 // //服务站接单给用户发消息
			 // Quartz.ReceiveOrder();
			 // //s审核后给服务站发消息
			 // Quartz.ReceiveFWZOrder();
			 // //换件通知
			 // Quartz.SendHuanJian();
			 // //发货通知
			 // Quartz.SendFaHuo();
			 // //旧件返还审核以后给服务站通知 
			 // Quartz.SendOldProduct();
			 // //发货单审核以后给服务站通知
			 // Quartz.SendSTATIONFaHuo();
			 // //维修情况 给用户发消息
			 // Quartz.REPAIRORDERTOUser();
			 // //补货单审核以后给服务站通知
			 // Quartz.SendSTATIONReceive();

		},
		/**
		 * 获取消息通知传递数据
		 */
		onLoad: async function(option){
			console.log("?option:",option);   
			// option = {
			// 	FBillNo:'FW-20221215221839',
			// 	MSG_TYPE:8, 
			// 	CUSTOM_TYPE:'service_station',
			// 	ORDER_TYPE:'0'
			// }
			this.info = {
				FBillNo:option.FBillNo,
				FWORKORDERNO:option.FBillNo,
				MSG_TYPE:option.MSG_TYPE,
				ORDER_TYPE:option.ORDER_TYPE,
				CUSTOM_TYPE:option.CUSTOM_TYPE,
				FNUMBER:uni.getStorageSync('userNumber')
			};
			this.FBillNo = option.FBillNo
			this.MSG_TYPE = option.MSG_TYPE
			this.CUSTOM_TYPE = option.CUSTOM_TYPE
			this.ORDER_TYPE = option.ORDER_TYPE
			uni.setStorageSync('MSG_INFO', this.info) 
			
			//记录 缓存 
			console.log("?MSG_INFO:",uni.getStorageSync('MSG_INFO')); 
			
			let isLogin = this.$Recipe.checkLogin(true);
			console.log("?isLogin:",isLogin);  
			if(isLogin){
				this.getlist()
			}
			
		},
		 
		methods: {
			 
			init(){
				
				//处理消息 内容确定跳转页面 然后删除 缓存消息MSG_INFO
				// uni.setStorageSync('MSG_INFO', '')
				//保修单提交B	1 XD_TJ
				//报修单审核 	2 BXD_SH_TG 
				//服务站接单 	3 FWZ_JD 
				//s审核     		4 FWZOrder 
				//换件通知  		5 TZ_HJ
				//发货通知  		6 TZ_FH
				//旧件返还审核  	7 JJFH_SH
				//发货单审核		8 FHD_SH
				//维修情况		9 WXQK
				//发货单审核	   10 FHD_SH 
			},
			
			async getlist() {
				this.RUN = 1
				this._freshing = true
				uni.showLoading({ title: '加载中' }); 
				const value = uni.getStorageSync('customertype');
				let FID = uni.getStorageSync('Fnumber')
				this.status = value
				let type = ''
				if (value == 'Customer') {
					type = 'driver'
				}
				if (value == 'Service_station') {
					type = 'station'
				}
				let datastatus = 'running'
				this.orderList = []; 
				const result = await this.$Recipe.getRepairReportListByOpenid({
					type,
					FID,
					datastatus,
					keywords: ''
				})
				this.orderList = result.data
				
				this.RUN = 2
				 
				let datastatus1 = 'complete'
				const result1 = await this.$Recipe.getRepairReportListByOpenid({
					type,
					FID,
					datastatus1,
					keywords: ''
				})
				this.orderList1 = result1.data
				this.RUN = 3
				 
				 
				console.log("?this.orderList:",this.orderList);  
				
				this._freshing = false
				let orderInfo =  [];
				let orderInfo1 =  [];
				let indexOf = 0;
				let indexOf1 = 0 
				if(this.orderList.length >0 ){   
					this.orderList.map((item,index) => { 
						// console.log(111111,"?item.FBillNo:",item.FBillNo,"?this.info.FBillNo:",this.info.FBillNo);  
						if (item.FBillNo == this.info.FBillNo || item.FWORKORDERNO1 == this.info.FBillNo ) { 
							orderInfo  = item;
							indexOf = index;
							this.orderInfo = item
							this.indexNum = index 
						}
					})  
					
				}
				 
				if(this.orderList1.length >0 ){    
					this.orderList1.map((item,index) => {  
						if (item.FWORKORDERNO1 == this.info.FBillNo || item.FBillNo == this.info.FBillNo) {
							 
							orderInfo1  = item;
							indexOf1 = index;
							this.orderInfo = item
							this.indexNum = index 
						}
					})  
				}
				 
				const result2 = await this.$Recipe.GetAllReceiveBySender({ 
					FDocumentStatus: "B",
					FNUMBER:uni.getStorageSync('userNumber'), 
					FWORDERSTATUS: 2
				}) 
				this.FList = result2.data;
				this.RUN = 4
				let Finfo = [];  
				if(this.FList ){  
					this.FList.map((item,index) => { 
						if (item.FBillNo == this.info.FBillNo) {
							Finfo  = item
						}
					}) 
					this.Finfo = Finfo;
				}
				let that = this;
				this.RUN = 5
				setTimeout(function(){ 
					uni.hideLoading(); 
					that.gotoPage();
				},1000)
				
			},	
			
			gotoPage(){
				let page = '';
				let MT = this.info.MSG_TYPE;
				let UT = this.info.CUSTOM_TYPE;
				if(UT == 'distributor'){
					// 我的补货
					if(MT == '6'){  
						uni.setStorageSync('MSG_TYPE', 'distributor') 
						uni.$emit('aEven', '2')
						this.$Router.switchTab({
							url: this.$Router.agent.index
						})
					} 
				}else{ 
					uni.setStorageSync('MSG_TYPE', 'service_station') 
					//跳转工单列表 并定位
					if(MT == '1' || MT == '2' || MT == '3' || MT == '4' || MT == '5' || MT == '7'){ 
						this.$Router.switchTab({
							url: this.$Router.order.report_index
						})
					}
					 
					//发货单 跳转发货单
					if(MT == '6'){
						uni.navigateTo({
							url: '/pages2/order/product/receive?obj=' + encodeURIComponent(JSON.stringify(this.orderInfo))
						})
					}
					//发货单 跳转工单详情 
					if(MT == '8'){
						uni.navigateTo({
							url: '/pages2/order/product/receive?obj=' + encodeURIComponent(JSON.stringify(this.orderInfo))
						})
					}
					//维修情况 跳转工单详情
					if(MT == '9'){
						uni.navigateTo({
							url: '/pages2/order/repair/info?obj=' + encodeURIComponent(JSON.stringify(this.orderInfo)) 
						});
					}
					//补货 跳转我的补货详情
					if(MT == '10'){
						this.$Router.navigateTo({
							url: this.$Router.my.myorderbh
						})
						// let obj ={
						// 	FBillNo:this.Finfo.FBillNo,
						// 	FWORKORDERNO1:this.Finfo.FWORKORDERNO1,
						// 	tabIndex:0
						// }
						// let url = this.$Router.my.Replenish +'?obj='+encodeURIComponent(JSON.stringify(obj));
						 
						// this.$Router.navigateTo({
						// 	url: url
						// })  
					}
					
				}
				 
				
			},
			gohead(){ 
				
				let info = {
					FBillNo:'YH-20220622154602',
					MSG_TYPE:'LIST',
					ORDER_TYPE:'Y',
					CUSTOM_TYPE:'Service_station',
					indexNum: this.indexNum
				};
				uni.setStorageSync('MSG_INFO', info) 
				this.$Router.switchTab({
					url: '/pages/tabBar/report/index'
				})
			}
			 
		}
	}
</script>

<style lang="scss" scoped>
	 
</style>

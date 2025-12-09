<template>
	<view class="page">
		<!-- 发货信息 -->
		<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
		    <view v-for="(tab,index) in list"  :key="index" class="uni-tab-item" :id="index" :data-current="index" @click="ontabtap">
		        <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.BillNo}}</text>
		    </view>
		</scroll-view> 
		<view class="card-box" v-for="(info,index1) in list" :key="index1" v-show="tabIndex == index1 " >
			 
			<uni-card >   
				<uni-list>
					<uni-list-item title="收货单编号" :rightText="info.BillNo" />
					<uni-list-item title="发货人" :rightText="info.FSENDERNAME" />
					<uni-list-item title="发货方" :rightText="info.FSENDER.Name[0].Value" />
					<!-- <uni-list-item title="发货地址" :rightText="info.FSENDER.ADDRESS" /> -->
					<uni-list-item title=" ">
						<template v-slot:header>
							<text style="font-size: 14px;color: black;">发货地址</text>
						</template>
						<template v-slot:footer>
							<view style="width: 200px;font-size: 12px;color: black;text-align: end;">
								{{info.FSENDER.ADDRESS}}
							</view>
						</template>
					</uni-list-item>
					<uni-list-item title="电话号码" :rightText="info.FSENDER.TEL" />
					<uni-list-item title="发货时间" :rightText="resetTime(info.FREPAIRRPTIME)" />
					<uni-list-item title="关联工单编号" :rightText="info.FWORDERNO" />
					<uni-list-item title="物流单号" :rightText="info.FWLDH" clickable @click="copyToClipboard(info.FWLDH)" />  
					<uni-list-item title="发运方式" :rightText="info.FWLGS" />
					<!-- <uni-list-item title="运费" :rightText="info.FFREIGHT" /> -->
					<uni-list-item title="发货清单" />
					<uni-list-item title=" " >
						<template v-slot:header>
							<text
								style="font-size: 10px;color: black;display: flex;width: 25%;">产品/配件名</text>
						</template>
						
						<template v-slot:body>
							<view style="font-size: 10px;color: black;width: 50%;">
								<span style="width: 45%;text-align: center;float: left;" >产品订货号</span>
								<span style="width: 15%;text-align: center;float: right;" >数量</span>
								<span style="width: 40%;text-align: center;float: right;" >发货件编号</span>
							</view> 
						</template> 
						
						<template v-slot:footer>
							<view style="font-size: 10px;color: black;width:25%;text-align: center;">
								备注
							</view>
						</template>
					</uni-list-item>
					
					<uni-list-item title=" " v-for="(item,index) in info.FEntity" :key='item.Id'>
						<template v-slot:header>
							<text
								style="font-size: 10px;color: black;display: flex;width: 25%;">{{item.FPARTSNAME.Name[0].Value}}</text>
						</template>
						
						<template v-slot:body>
							<view style="font-size: 10px;color: black;width: 50%;">
								<span style="width: 45%;text-align: center;float: left;" >{{item.FORDERNO}}</span>
								<span style="width: 15%;text-align: center;float: right;" >{{item.FNUMSEND}}</span>
								<span style="width: 40%;text-align: center;float: right;" >{{item.FNEWNUMBER}}</span>
							</view> 
						</template> 
						
						<template v-slot:footer>
							<view style="font-size: 10px;color: black;width: 25%;text-align: center;">
								{{item.FSENDREMARK}}
							</view>
						</template>
					</uni-list-item>
					<!-- <uni-list-item title=" " v-for="(item,index) in info.FEntity" :key='item.Id'>
						<template v-slot:header>
							<text
								style="font-size: 12px;color: black;display: flex;width: 55%;">{{item.FPARTSNAME.Name[0].Value}} 【{{item.FORDERNO}}】</text>
						</template>
						<template v-slot:body>
							<view style="font-size: 12px;color: black;width: 40%;">
								{{item.FPARTSNAME.Specification[0].Value}}
							</view>
						</template>
						<template v-slot:footer>
							<view style="font-size: 12px;color: black;width: 5%;text-align: end;">
								{{item.FNUMSEND}}
							</view>
						</template>
					</uni-list-item> -->
					<uni-list-item title="备注信息:"  />
					<view style="font-size: 12px;color: black;width: 90%;text-align: left;padding: 0px 15px 12px 15px;">
						{{info.FHEADREMARKS}}
					</view>
				</uni-list>
			</uni-card>
			<!-- 收货信息 -->
			<uni-card>
				<uni-list>
					<uni-list-item title="收货人" :rightText="info.FRECEIVERUSER" />
					<uni-list-item title="收货方" :rightText="info.FRECEIVER.Name[0].Value" />
					<uni-list-item title="电话号码" :rightText="info.FRECEIVERTEL " />
					<uni-list-item title=" ">
						<template v-slot:header>
							<text style="width: 30%;font-size: 14px;color: black;">收货地址</text>
						</template>
						<template v-slot:body>
							<view style="font-size: 12px;color: black;width: 10%;"> </view>
						</template>
						<template v-slot:footer>
							<view style="width: 60%;font-size: 12px;color: black;text-align: end;">
								{{info.FRECEIVEADDRESS}}
							</view>
						</template>
					</uni-list-item>
				</uni-list>
			</uni-card>
			<!-- 确认收货按钮 -->
			<view class="btn" @click="showModel=true" v-if="info.DocumentStatus == 'B'"  
				style="display: flex;justify-content: center;align-items: center;color: #FFFFFF;border-radius: 5px;margin: 0 auto;background-color: #169BD5;width: 120px;height: 40px;">
				确认收货 
			</view>
			<view class="btn"  v-if="info.DocumentStatus == 'C'"
				style="display: flex;justify-content: center;align-items: center;color: #FFFFFF;border-radius: 5px;margin: 0 auto;background-color: #c3c3c3;width: 120px;height: 40px;">
				已收货 
			</view>
			<!-- 保存确认 -->
			<u-modal :show="showModel" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="confirmReceive(info.BillNo)"
				:title="'确认收货'" @cancel="showModel=false" @close="showModel=false"></u-modal>	
		</view>	
		
			
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showModel:false,
				triggered: false,
				_freshing: false,
				tabIndex:0,
				items: ['未发货', '已发货'], 
				list:[],
				info: {}, //收货单信息
				phone: '', //手机号
				FBillNo: '', //订单号
				FWORKORDERNO1: '', //工单号
				tabIndex: '', //工单号
			}
		},   										
		/**
		 * 获取数据
		 */
		async onLoad(option) {
			const info = JSON.parse(decodeURIComponent(option.obj))
			 
			this.FBillNo = info.FBillNo
			this.tabIndex = info.tabIndex
			this.FWORKORDERNO1 = info.FWORKORDERNO1
			this.phone = uni.getStorageSync('phone')
			const result = await this.$Recipe.GetReceiveByFnumber({
				FNUMBER: info.FBillNo, 
			}) 
			this.list = result.data
			
			this.tabIndex = 0 ; 
			for (var i = 0; i < result.data.length; i++) {
				 
				if(result.data[i].DocumentStatus =='B'){
					this.tabIndex = i ;
					break;
				}
			}
			// this.init()
		},   
		methods: {
			resetTime(time){
				let arr = time.split('T');
				let HI = arr[1].split(':');
				return arr[0] + ' '+HI[0]+':'+HI[1];
			},
			
			/**
			 * 确认收货
			 */
			async confirmReceive(BillNo) { 
				this.showModel = false;
				const result = await this.$Recipe.SaveReceive({
					orderno: BillNo
				}) 
				if (result.code == 200) {
					uni.navigateBack({
						delta: 1,
						success() {
							uni.showToast({
								icon: 'none',
								title: '确认收货成功'
							})
						}
					})
					// uni.showToast({
					// 	icon: 'none',
					// 	title: '确认收货成功'
					// })
					// this.init();
				} else {
					uni.showToast({
						icon: 'none',
						title: '确认收货失败'
					})
				}
			},
			
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.tabIndex = index
			    // this.initF(); 
			}, 
			
			 init(){
				let _this = this ;
				let FWORKORDERNO1 = _this.FWORKORDERNO1;
				let data = {
					FNUMBER: info.FBillNo, 
				}
				console.log(data)
				_this.list = [];
				_this.$Recipe.GetReceiveByFnumber(data).then((res) => {
					// console.log(111111111111111)
					_this.list = res.data    
					
				})
				
				 
			},
			copyToClipboard(FWLDH){
				uni.setClipboardData({
				    data: FWLDH, // e是你要保存的内容
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
	.uni-tab-item {
	    /* #ifndef APP-PLUS */
	    display: inline-block;
	    /* #endif */
	    flex-wrap: nowrap;
		min-width: 60px;
		// background: red;
		text-align: center;
	    padding-left: 12rpx;
	    padding-right: 12rpx;
	}
	
	.uni-tab-item-title {
	    color: #555;
	    font-size: 28rpx;
	    height: 60rpx;
	    line-height: 60rpx;
	    flex-wrap: nowrap;
	    /* #ifndef APP-PLUS */
	    white-space: nowrap;
	    /* #endif */
	}
	
	.uni-tab-item-title-active {
	    color: #007AFF;
		border-bottom: 1px solid #007AFF;
	}

	.scroll-h{
		position:fixed;
		z-index:99;
		top: 0;
		background: #fff;
	}
	.card-box{
		margin-top: 50px;
	}
</style>

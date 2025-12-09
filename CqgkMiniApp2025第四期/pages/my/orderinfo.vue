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
					<uni-list-item title="发货单编号" :rightText="info.BillNo" />
					<uni-list-item title="物流单号" :rightText="info.FWLDH" />
					<uni-list-item title="发运方式" :rightText="info.FWLGS" />
					<!-- <uni-list-item title="运费" :rightText="info.FFREIGHT" /> -->
					<uni-list-item title="发货清单" />
					<uni-list-item title=" " v-for="(item,index) in info.FEntity" :key='item.Id'>
						<template v-slot:header>
							<text
								style="font-size: 12px;color: black;display: flex;width: 33%;">{{item.FPARTSNAME.Name[0].Value}}</text>
						</template>
						<template v-slot:body>
							<view style="font-size: 12px;color: black;width: 33%;">
								{{item.FPARTSNAME.Specification[0].Value}}
							</view>
						</template>
						<template v-slot:footer>
							<view style="font-size: 12px;color: black;width: 33%;text-align: end;">
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
					<uni-list-item title="电话号码" :rightText="info.FFRECEIVERTEL" />
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
			<!-- 确认收货按钮 -->
			<view class="btn" v-if="info.DocumentStatus =='B'"
				style="display: flex;justify-content: center;align-items: center;color: #FFFFFF;border-radius: 5px;margin: 0 auto;background-color: #169BD5;width: 120px;height: 40px;">
				为收货
			</view>
			<view class="btn"  v-if="info.DocumentStatus !=='B'"
				style="display: flex;justify-content: center;align-items: center;color: #FFFFFF;border-radius: 5px;margin: 0 auto;background-color: #c3c3c3;width: 120px;height: 40px;">
				已收货
			</view>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				triggered: false,
				_freshing: false,
				tabIndex:0,
				items: ['未发货', '已发货'], 
				list:[],
				info: {}, //收货单信息
				phone: '', //手机号
				FBillNo: '', //订单号
				FWORKORDERNO1: '', //工单号
			}
		},   										
		/**
		 * 获取数据
		 */
		async onLoad(option) {
			const info = JSON.parse(decodeURIComponent(option.obj))
			 
			this.FBillNo = info.FBillNo
			this.FWORKORDERNO1 = info.FWORKORDERNO1
			this.phone = uni.getStorageSync('phone')
			const result = await this.$Recipe.GetReceiveByFnumber({
				orderno: info.FWORKORDERNO1,
				type: 'station'
			})
			this.list = result.data
			// this.init()
		},   
		methods: {
			resetTime(time){
				let arr = time.split('T');
				let HI = arr[1].split(':');
				return arr[0] + ' '+HI[0]+':'+HI[1];
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
					orderno: FWORKORDERNO1,
					type: 'station'
				}
				console.log(data)
				_this.list = [];
				_this.$Recipe.GetReceiveByFnumber(data).then((res) => {
					_this.list = res.data   
				})
				
				 
			},
			
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

<template>
	<view class="mine">
		<!-- 个人信息 -->
		<uni-list>
			<uni-card>
				<uni-list-item  title="费用项目" rightText="非维修费用" />
				<uni-list-item  title="工单号" :rightText="info.FBillNo" />
				<uni-list-item  title="工单状态" :rightText="info.FDocumentStatus == 'B'?'待审核':'已审核'" />
				<uni-list-item  title="填报时间" :rightText="info.FCreateDate" />
				<uni-list-item  title="填报金额" :rightText="info.FAMOUNT" />
				<uni-list-item  title="核定金额" :rightText="info.FEntity_FEntryID" />    
			 
			</uni-card>
			<uni-card style="margin-top:-15px " v-if="info.FREMARK || QTFYTP.length > 0">
				<uni-section title="费用说明" type="line" v-if="info.FREMARK">
					<text style="padding:0 15px;" class="uni-body">{{info.FREMARK}}</text> 
				</uni-section> 
				<uni-section title="费用图片" type="line" v-if="QTFYTP.length > 0">
					<view class="img-box">
						<view class="img-box-gz" v-for="(item,index) in QTFYTP" :key='index'>
							<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
								:src="item.FattachmentName" />
						</view>
					</view>
				</uni-section> 
			</uni-card>
		</uni-list>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				Icon2: {
					color: '#4cd964',
					size: '22',
					type: 'person'
				},
				Icon3: {
					color: '#4cd964',
					size: '22',
					type: 'phone'
				}, 
				QTFYTP:[],
				info:[],
			}
		},
		/**
		 * 获取缓存信息
		 */
		onLoad(option) {
			 const obj = JSON.parse(decodeURIComponent(option.obj))
			 console.log(obj)
			 obj.FAMOUNT = Math.round(obj.FAMOUNT * 100) / 100 
			 obj.FCreateDate =  obj.FCreateDate.replace("T"," ") 
			 this.info = obj;
			 this.init();
		},
		methods: {
			init(){
				let _this = this
				let data = {
					fnumber: this.info.FBillNo,   
				}   
				this.$Recipe.getCostImg(data).then((res) => {
					_this.QTFYTP = res.data.img  
				})
			},
			 
		},
		
	}
</script>

<style>

	.img-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.img-box-gz {
		width: 32%;
		padding: 10rpx 2%;
		float: left;
	}

	.img-box-gz image {
		width: 100%;
		height: auto;
		text-align: center;
	}

</style>

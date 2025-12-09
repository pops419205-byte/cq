<template>
	<view class="page">
		<uni-card padding="20rpx 0">
			<!-- 产品名称 -->
			<template v-slot:title>
				<uni-list>
					<uni-list-item :title="'产品名称: '+ billInfo.productname?billInfo.productname:''" />
				</uni-list>
			</template>
			<!-- 工单信息 -->

			<u-cell-group>
				<u-cell :value="billInfo.REPAIRPRICE">
					<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
						<image src="@/static/info_status.png" style="width: 22px;height: 22px;margin-right: 10px;"
							mode="">
						</image>
						<text>工单状态</text>
					</view>
				</u-cell>
				<!-- 我的工单 -->
				<u-cell :value="billInfo.FWORKORDERNO1">
					<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
						<image src="@/static/info_number.png" style="width: 22px;height: 22px;margin-right: 10px;"
							mode="">
						</image>
						<text>工单编号</text>
					</view>
				</u-cell>
				<!-- 员工管理 -->
				<u-cell :value="billInfo.FCreateDate">
					<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
						<image src="@/static/info_time.png" style="width: 22px;height: 22px;margin-right: 10px;"
							mode="">
						</image>
						<text>报修时间</text>
					</view>
				</u-cell>

				<!-- 服务站 -->
				<u-cell v-if="status=='Service_station'">
					<!-- 服务端 -->
					<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
						<image src="@/static/info_location.png" style="width: 22px;height: 22px;margin-right: 10px;"
							mode="">
						</image>
						<text v-if="info.FRCHECKHOME=='0'">到服务站维修</text>
						<text v-if="info.FRCHECKHOME=='1'">上门维修</text>
					</view>
					<view slot="value" style="width: 170px;text-align: end;">
						<text
							v-if="info.FRCHECKHOME==0">{{info.servicestationname==''||info.servicestationname==' '?'待服务中心审核':info.servicestationname}}</text>
						<text
							v-if="info.FRCHECKHOME==1">{{info.FREPAIRSITE==''||info.FREPAIRSITE==' '?'待服务中心审核':info.FREPAIRSITE}}</text>
					</view>
				</u-cell>
				<block v-else>
					<block v-if="info.FRCHECKHOME=='0'">
						<u-cell>
							<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
								<image src="@/static/info_location.png"
									style="width: 22px;height: 22px;margin-right: 10px;" mode="">
								</image>
								<text>服务站</text>
							</view>
							<view slot="value" style="width: 170px;text-align: end; color: blue;text-decoration:underline;" 
								@click="goStationDetails">
								<text>{{info.servicestationname==''||info.servicestationname==' '?'待服务中心审核':info.servicestationname}}</text>
							</view>
						</u-cell>
					</block>
					
					<block v-if="info.FRCHECKHOME=='1'">

						<!-- <u-cell>
							<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
								<image src="@/static/info_location.png"
									style="width: 22px;height: 22px;margin-right: 10px;" mode="">
								</image>
								<text>服务站2</text>

							</view>
							<view slot="value" style="width: 170px;text-align: end;"
								@click="goStationDetails">
								<text>{{info.servicestationname==''||info.servicestationname==' '?'待服务中心审核':info.servicestationname}}</text>
							</view>
						</u-cell> -->
						<u-cell>
							<!-- 上门维修 -->
							<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
								<image src="@/static/info_location.png"
									style="width: 22px;height: 22px;margin-right: 10px;" mode="">
								</image>

								<text>上门维修</text>
							</view>
							<view slot="value" style="width: 170px;text-align: end;">
								<text>{{allInfo.FREPAIRSITE==''||allInfo.FREPAIRSITE==' '?'待服务中心审核':allInfo.FREPAIRSITE}}</text>
								<!-- 	<view class="tag-view">
										<uni-icons type="notification" size="16" color="@FF5A5F"></uni-icons>
									请耐心等待服务站上门维修
													</view> -->
							</view>

						</u-cell>
					</block>

					

				</block>
				
				<!-- 员工管理 -->
				<block v-if="info.FERRDATE">
					<u-cell :value="info.FERRDATE">
						<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
							<image src="@/static/info_time.png" style="width: 22px;height: 22px;margin-right: 10px;"
								mode="">
							</image>
							<text>故障时间</text>
						</view>
					</u-cell>
				</block>
				
				
				
			</u-cell-group>
		</uni-card>
		<!-- 用户信息 -->
		<uni-card :is-shadow="false">
			<uni-section title="用户信息" type="line">
				<uni-list>
					<uni-list-item title="用户单位" :rightText="info.FUSER==' '?'暂无用户':info.FUSER" />
					<uni-list-item title="用户电话" :rightText="info.FOWNERPHONE" />
					<uni-list-item title="用户地址" :rightText="info.FUSERADDRESS==' '?'暂无用户地址':info.FUSERADDRESS" />
					<uni-list-item title="联系人" :rightText="info.F_USERREMAERK==' '?'-':info.F_USERREMAERK" />
					<uni-list-item title='联系电话'  :rightText="info.FDRIVERPHONE==' '?'-':info.FDRIVERPHONE" />
				</uni-list>
			</uni-section>
		</uni-card>
		<!-- 产品信息 -->
		<uni-card :is-shadow="false">
			<uni-list>
				<uni-list-item v-if='info.Fproductclass' title="产品类别" :rightText="getType" />
				<uni-list-item v-if="allInfo.FPOWERNUMBER" title="发动机号" :rightText="allInfo.FPOWERNUMBER" />
				<uni-list-item v-if='info.Fproductclass' :title="getTile" :rightText="info.F_tesu_text" />
				<uni-list-item title="用途" :rightText="info.FVEHICLEPURPOSE" />
				<uni-list-item :title="carType" :rightText="info.FdownSALE == '2'?info.F_DRIVINGCOM_H:'售前维修'" />
				<uni-list-item title="购买日期" :rightText="info.FdownSALE == '2'?info.FPURCHASEDATA:'售前维修'" />
				<uni-list-item title="维修类别" :rightText="info.FdownSALE == '2'?'售后':'售前'" />
				<uni-list-item v-if="allInfo.FERRDATE" title="故障时间" :rightText="allInfo.FERRDATE" />
			</uni-list>

		</uni-card>
<!-- 		<uni-card>
			<uni-section title="产品信息" type="line">
				<u-tabs :list="info.PRODUCT" keyName='FDataValue' itemStyle="font-size:18px;height:30px"
					v-if="info.PRODUCT.length != 0" @change='prodChange'>
				</u-tabs>
				<view v-for="(item,index) in info.PRODUCT" :key='item.FDataValue'>
					<uni-list v-show="currentIndex==index">
						<uni-list-item v-if='item.FDataValue' title="产品名称" :rightText="item.FDataValue" />
						<uni-list-item v-if='item.FORDERNO' title="订货号" :rightText="item.FORDERNO" />
						<uni-list-item v-if='item.FPRODUCTNO' title="产品编号" :rightText="item.FPRODUCTNO" />
					</uni-list>
				</view>
			</uni-section>
		</uni-card> -->
		<uni-card>
			<uni-section title="产品信息" type="line">
				<u-tabs :list="info.PRODUCT.Prodcuts" keyName='productname' itemStyle="font-size:18px;height:30px"
					v-if="info.PRODUCT.Prodcuts.length != 0" @change='prodChange'>
				</u-tabs>
				<view v-for="(item,index) in info.PRODUCT.Prodcuts" :key='item.FORDERNO'
				v-show="index===currentIndex"
				>
					<uni-list-item   title="订货号" :rightText="item.FORDERNO" />
					<uni-list-item v-if=' item.data.length>0' title="产品数量" :rightText="item.data.length" />
						<uni-list v-for="(item2,index2) in item.data">
						     	<uni-list-item style="padding-left: 20rpx;"  :title="(index2+1)+'.产品编号'" :rightText="item2.FPRODUCTNO" />
						</uni-list>
				</view>
			</uni-section>
		</uni-card>
		<uni-card :is-shadow="false" v-if='info.ATTACHMENT.length != 0'>
			<uni-section title="产品图片" type="line">
				<view class="img-box">
					<view class="img-box-gz" v-for="(item,index) in info.ATTACHMENT" :key='item.FattachmentName'>
						<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
							:src="item.FattachmentName" />
					</view>
				</view>
			</uni-section>
		</uni-card>
		<!-- 故障描述 -->
		<uni-card :is-shadow="false" v-if='info.FGUZHANINFO'>
			<uni-section title="故障描述" type="line">
				<text class="uni-body">{{info.FGUZHANINFO}}</text>
				<!-- <view class="img-box">
					<view class="img-box-gz" v-for="(item,index) in info.FGUZHANINFOLIST" :key='item.FattachmentName'>
						<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
							:src="item.FattachmentName" />
					</view>
				</view> -->
			</uni-section>
		</uni-card>
		<!-- 故障图片 -->
		<uni-card :is-shadow="false" v-if=' info.FGUZHANINFOLIST.length != "0"'>
			<uni-section title="故障图片" type="line"> 
				<view class="img-box">
					<view class="img-box-gz" v-for="(item,index) in info.FGUZHANINFOLIST" :key='item.FattachmentName'>
						<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
							:src="item.FattachmentName" />
					</view>
				</view>
			</uni-section>
		</uni-card>
		<uni-card :is-shadow="false" v-if="info.video.length != 0">
			<uni-section title="故障视频" type="line">
				<view class="img-box" v-for="item in info.video">
					<view class="img-box-gz">
						<video :src="item.FattachmentName" controls></video>
					</view>
				</view>
			</uni-section>
		</uni-card>
		<!-- 	<uni-card :is-shadow="false" v-if="allInfo.FREPAIRSITE && allInfo.FREPAIRSITE != ' ' ">
			<uni-section title="维修地点" type="line">
				<text class="uni-body">{{allInfo.FREPAIRSITE}}</text>
			</uni-section>
		</uni-card> -->
		<!-- 检查结果描述 -->
		<uni-card :is-shadow="false" v-if="info.GMPZ.length != 0">
			<uni-section title="购买凭证" type="line">
				<view class="img-box">
					<view class="img-box-gz" v-for="(item,index) in info.GMPZ" :key='item.FattachmentName'>
						<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
							:src="item.FattachmentName" />
					</view>
				</view>
			</uni-section>
		</uni-card>
	</view>
</template>
<script>
	export default {
		components: {

		},
		data() {
			return {
				allInfo: {},
				info: null, //订单详情信息
				billInfo: null, //订单信息
				Icon1: {
					color: '#4cd964',
					size: '22',
					type: 'calendar'
				},
				Icon2: {
					color: '#4cd964',
					size: '22',
					type: 'vip'
				},
				Icon3: {
					color: '#4cd964',
					size: '22',
					type: 'loop'
				},
				Icon4: {
					color: '#4cd964',
					size: '22',
					type: 'location'
				},
				currentIndex: 0, //产品列表
				carType: '',
				status: '', // 用户类型
			};
		},
		/**
		 * @param {Object} option  获取路由传递过来的参数 同时调用接口  获取接口数据
		 */
		onLoad: async function(option) {
			this.status = uni.getStorageSync('customertype')
			let info = JSON.parse(decodeURIComponent(option.obj));
			
			this.billInfo = info
			 

			let result = await this.$Recipe.getSelectRepairReportByFBillNo({
				FBillNo: info.FBillNo
			})
			let _info = result.data.map(item => item)[0];
			_info.FGUZHANINFOLIST = [] 
			 _info.GMPZ = []
			_info.buyimg.map(item => {
				if (item.type) {
					let FF = item.type.split("_");
					item.type = FF[1];
					item.des = FF[0];
					switch (item.type) {
						case "CPTP":
							// 产品图片
							_info.ATTACHMENT.push(item);
							break;
						case "GZSP":
							// 故障视频
							_info.video.push(item);
							break;
						case "GZTP":
							// 故障图片
							_info.FGUZHANINFOLIST.push(item);
							break;
						case "GMPZ":
							//购买凭证/
							_info.GMPZ.push(item);
							break;

						default:
							break;
					}
				}
			})
			this.info = _info;
			console.log(222222222222,_info)

			let result2 = await this.$Recipe.GetBaoXiuDetail({
				fnumber: info.FBillNo
			})
			this.allInfo = result2.data
			const result3 = await this.$Recipe.getAssistantDataList()
			result3.data.forEach((item, index) => {
				if (item.FDataValue == this.info.FVEHICLEPURPOSE) {
					this.info.carType = index
					if (index == 0 || index == 1) {
						this.carType = '行驶公里'
					} else {
						this.carType = '运转小时'
					}
				}
			})
			 

		},
		computed:{
			getTile() {
				switch (this.info&&this.info.Fproductclass) {
					case '0':
					case '1':
						return '厂家';
					case '2':
						return '中心库';
				}
			},
			getType() {
				switch (this.info&&this.info.Fproductclass) {
					case '0':
						return '整车(整机)';
					case '1':
						return '零售发动机';
					case '2':
						return '配件';
				}
			},
		},
		methods: {
			// 去服务站详情
			goStationDetails() {
				console.log(this.allInfo)
				console.log(this.info)
				let id = this.allInfo.FSERVICESTATION.Number;
				// return;
				uni.navigateTo({
					url: `/pages/station/info?id=${id}`
				})
			},
		
			videoUrl(e) {
				return encodeURIComponent(e)
			},
		
			previewImg(url) {
				uni.previewImage({
					urls: [url],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			/**
			 * @param {Object} n 切换产品信息
			 */
			prodChange(n) {
				this.currentIndex = n.index
			},
		}
	};
</script>

<style lang="scss" scoped>
	.tag-view {
		font-size: 24rpx;
		color: #FF5A5F;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.page {
		padding-bottom: 30px;
	}

	.img-box {
		width: 100%;
	}

	.img-box-cp {
		width: 30%;
		padding: 10rpx 2% 10rpx 1%;
		float: left;
	}

	.img-box-cp image {
		width: 100%;
		height: auto;
		text-align: center;
	}

	.img-box-gz {
		width: 40%;
		padding: 10rpx 5%;
		float: left;
	}

	.img-box-gz image {
		width: 100%;
		height: auto;
		text-align: center;
	}
</style>

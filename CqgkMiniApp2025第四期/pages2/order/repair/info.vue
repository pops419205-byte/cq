<template>
	<view class="page" style="padding-bottom: 65px;">
		<view class="pageMine"  @click="goBtn" v-if="billInfo.F_REPAIRPRICESTATE !== '3' "> 查看维修记录</view>
		 
		<uni-card padding="20rpx 0">
			<!-- 产品名称 -->
			<template v-slot:title>
				<uni-list>
					<uni-list-item :title="'产品名称: '+ billInfo.productname?billInfo.productname:''" />
				</uni-list>
			</template>
			<!-- 工单信息 -->
			<u-cell-group>
				<u-cell :value="((billInfo.F_REPAIRPRICESTATE==5 ||  billInfo.F_REPAIRPRICESTATE==30  ) && billInfo.FREPAIRDESC  && status!='Customer' ) ? '服务站待提交维修费用':billInfo.REPAIRPRICE">
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


					<!-- 上门维修 -->

					<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
						<image src="@/static/info_location.png" style="width: 22px;height: 22px;margin-right: 10px;"
							mode="">
						</image>
						<text v-if="allInfo.FWXCONFIRM !=='0' ">上门维修</text>
						<text v-if="allInfo.FWXCONFIRM == '0' ">到服务站维修</text>
					</view>
					<view slot="value" style="width: 170px;text-align: end;">
						<text @click="showUserAddress" :style="allInfo.FREPAIRSITE?'color: blue;text-decoration:underline;':''"
							v-if="allInfo.FWXCONFIRM !=='0'">{{allInfo.FREPAIRSITE==''||allInfo.FREPAIRSITE==' '?billInfo.msg:allInfo.FREPAIRSITE}}</text>
						<text style="color: blue;text-decoration:underline;" @click="showServiceStation(info)"
							v-if="allInfo.FWXCONFIRM  =='0'">{{info.servicestationname==''||info.servicestationname==' '?billInfo.msg:info.servicestationname}}</text>
					</view>
 


				</u-cell>
				<block v-else>


					<!-- 客户端 -->

					<block v-if="allInfo.FWXCONFIRM !=='0'">

						<u-cell>
							<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
								<image src="@/static/info_location.png"
									style="width: 22px;height: 22px;margin-right: 10px;" mode="">
								</image>
								<text>服务站</text>

							</view>
							<view slot="value" style="width: 170px;text-align: end;color: blue;text-decoration:underline;"
								@click="goStationDetails(allInfo.F_TESU_SERVICESTATION.Number)">
								<text>{{info.servicestationname==''||info.servicestationname==' '?billInfo.msg:info.servicestationname}}</text>
							</view>
						</u-cell>
						<u-cell>
							<!-- 上门维修 -->
							<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
								<image src="@/static/info_location.png"
									style="width: 22px;height: 22px;margin-right: 10px;" mode="">
								</image>

								<text>上门维修</text>
							</view>
							<view slot="value" style="width: 170px;text-align: end;" >
								<text>{{allInfo.FREPAIRSITE==''||allInfo.FREPAIRSITE==' '?billInfo.msg:allInfo.FREPAIRSITE}}</text>
								<view class="tag-view">
									<uni-icons type="notification" size="16" color="@FF5A5F"></uni-icons>
									请耐心等待服务站上门维修
								</view>
							</view>

						</u-cell>
					</block>


					<block v-if="allInfo.FWXCONFIRM =='0'">
						<u-cell>
							<view slot="title" class="u-slot-title" style="display: flex;align-items: center;">
								<image src="@/static/info_location.png"
									style="width: 22px;height: 22px;margin-right: 10px;" mode="">
								</image>
								<text>服务站</text>

							</view>
							<view slot="value" style="width: 170px;text-align: end;"
								@click="goStationDetails(allInfo.F_TESU_SERVICESTATION.Number)">
								<text style="color: blue;text-decoration:underline;">
								{{info.servicestationname==''||info.servicestationname==' '?billInfo.msg:info.servicestationname}}</text> 
								<!-- <view class="tag-view">
									<uni-icons type="notification" size="16" color="@FF5A5F"></uni-icons> 
								</view> -->
							</view>
						</u-cell>
					</block>




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
					<uni-list-item title='联系电话' :rightText="info.FDRIVERPHONE==' '?'-':info.FDRIVERPHONE" />
				</uni-list>
			</uni-section>
		</uni-card>
		<!-- 产品信息 -->
		<uni-card :is-shadow="false">
			<uni-section title="产品使用情况" type="line">
				<uni-list>
					<uni-list-item v-if='allInfo.FCLASSPRODUCT' title="产品类别" :rightText="getType" />
					<uni-list-item v-if='allInfo.FCLASSPRODUCT' :title="getTile" :rightText="allInfo.F_TESU_MANU" />
					<uni-list-item v-if='info.FVEHICLEPURPOSE' title="用途" :rightText="info.FVEHICLEPURPOSE" />
					<uni-list-item :title="carType" :rightText="info.FdownSALE == '2'?info.FDRIVINGCOM_H:'售前维修'" />
					<uni-list-item title="购买日期" :rightText="info.FdownSALE == '2'?info.FPURCHASEDATA:'售前维修'" />
					<uni-list-item title="发动机号" :rightText="allInfo.FPOWERNUMBER?allInfo.FPOWERNUMBER:'未录入'" />
					<uni-list-item title="维修类别" :rightText="info.FdownSALE == '2'?'售后':'售前'" />
					<uni-list-item title="故障时间" :rightText="allInfo.FERRDATE?allInfo.FERRDATE:'未录入'" /> 
				</uni-list>
			</uni-section>
		</uni-card>
		 
		<uni-card>
			<uni-section title="产品信息" type="line">
				<u-tabs :list="info.PRODUCT.Prodcuts" keyName='productname' itemStyle="font-size:18px;height:30px"
					v-if="info.PRODUCT.Prodcuts.length != 0" @change='prodChange'>
				</u-tabs>
				<view v-for="(item,index) in info.PRODUCT.Prodcuts" :key='item.FORDERNO' v-show="index===currentIndex">
					<uni-list-item   title="订货号" :rightText="item.FORDERNO" />
					<uni-list-item v-if='  item.data.length>0' title="产品数量" :rightText="item.data.length" />
					<uni-list v-for="(item2,index2) in item.data" :key='index2' >
						<uni-list-item style="padding-left: 20rpx;" :title="(index2+1)+'.产品编号'"
							:rightText="item2.FPRODUCTNO" />
					</uni-list>
				</view>
			</uni-section>
		</uni-card>








		<uni-card :is-shadow="false" v-if='info.ATTACHMENT && info.ATTACHMENT.length != 0'>
			<uni-section title="产品图片" type="line">
				<view class="img-box">
					<view class="img-box-gz" v-for="(item,index3) in info.ATTACHMENT" :key='index3'>
						<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
							:src="item.FattachmentName" />
					</view>
				</view>
			</uni-section>
		</uni-card>
		<!-- 故障描述 -->
		<uni-card :is-shadow="false" v-if='info.FGUZHANINFO || info.FGUZHANINFOLIST.length != 0'>
			<uni-section title="故障描述" type="line">
				<text class="uni-body">{{info.FGUZHANINFO}}</text>
				
			</uni-section>
		</uni-card>
		
		<uni-card :is-shadow="false" v-if="info.FGUZHANINFOLIST.length != 0">
			<uni-section title="故障图片" type="line">
				<view class="img-box">
					<view class="img-box-gz" v-for="(item,index4) in info.FGUZHANINFOLIST" :key='index4'>
						<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
							:src="item.FattachmentName" />
					</view>
				</view>
			</uni-section>
		</uni-card>
		
		<uni-card :is-shadow="false" v-if="info.video.length != 0">
			<uni-section title="故障视频" type="line">
				<view class="img-box" v-for="(item,index5) in info.video" :key='index5'>
					<view class="img-box-gz">
						<video :src="item.FattachmentName" controls></video>
					</view>
				</view>
			</uni-section>
		</uni-card>
		 
		<!-- 检查结果描述 -->
		<uni-card :is-shadow="false" v-if="info.GMPZ.length != 0">
			<uni-section title="购买凭证" type="line">
				<view class="img-box">
					<view class="img-box-gz" v-for="(item,index6) in info.GMPZ" :key='index6'>
						<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
							:src="item.FattachmentName" />
					</view>
				</view>
			</uni-section>
		</uni-card>
		<!-- 故障检测结果 -->
		
		<uni-card style="display: none;" :is-shadow="false" v-if=" info.guzhanmoshi || info.FCHECKRESULT!= ' ' ">
			<uni-section title="故障检测" type="line">
				<uni-list>
					<uni-list-item title="故障类别" :rightText="info.guzhanmoshi" v-if=" info.guzhanmoshi " />
					<uni-list-item title=" " v-if="info.FCHECKRESULT && info.FCHECKRESULT!= ' '">
						<template v-slot:header>
							<text style="font-size: 14px;color: black;">检测结果</text>
						</template>
						<template v-slot:footer>
							<view style="width: 200px;font-size: 12px;color: black;text-align: end;">
								{{info.FCHECKRESULT}}
							</view>
						</template>
					</uni-list-item>

					<view class="img-box">
						<view class="img-box-gz" v-for="(item,index7) in info.FGUZHANINFOLIST" :key='index7'>
							<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
								:src="item.FattachmentName" />
						</view>
					</view>

				</uni-list>
			</uni-section>
		</uni-card>

		<uni-card style="display: none;" :is-shadow="false" v-if="allInfo.FREPAIRDESC && allInfo.FREPAIRDESC!=' '">
			<uni-section title="维修检测" type="line">
				<uni-list>
					<uni-list-item title=" ">
						<template v-slot:header>
							<text style="font-size: 14px;color: black;">检测结果</text>
						</template>
						<template v-slot:footer>
							<view style="width: 200px;font-size: 12px;color: black;text-align: end;">
								{{allInfo.FREPAIRDESC}}
							</view>

						</template>
					</uni-list-item>

					<uni-section title="维修图片" type="line">
						<view class="img-box">
							<view class="img-box-gz" v-for="(item,index8) in info.WXQKIMAGE" :key='index8'>
								<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
									:src="item.FattachmentName" />
							</view>
						</view>
					</uni-section>
					<uni-section title="维修视频" type="line">
						<view class="img-box" v-for="(item,index) in info.WXQKVideo" :key='index'>
							<view class="img-box-gz">
								<video :src="item.FattachmentName" controls></video>
							</view>
						</view>
					</uni-section>
				</uni-list>
			</uni-section>
		</uni-card>

		<uni-card style="display: none;" :is-shadow="false" v-if=" info.jArrayhuanjian && info.jArrayhuanjian.length != 0">
			<uni-section title="维修方案" type="line">
				<uni-list v-for="(item,index9) in info.jArrayhuanjian" :key="index9">
					<uni-list-item title="配件名称" :rightText="item.proctname" />
					<uni-list-item title=" ">
						<template v-slot:header>
							<text style="font-size: 14px;color: black;display: flex;width: 33%;">新配件编号</text>
						</template>
						<template v-slot:footer>
							<p style="font-size: 12px;color: black;text-align: end;width: 66%;word-break: break-all;">
								{{item.FPRODUCTNUMBER1}}
							</p>
						</template>
					</uni-list-item>
					<uni-list-item title="新件数量" :rightText="item.FQTY" />
					<uni-list-item title="新配件来源" :rightText="newSource(item.FNEWSOURCE)" />
					<uni-list-item title="故障原因件" :rightText="item.FISERROR=='1'?'是':'否'" />
				</uni-list>
			</uni-section>
		</uni-card>

		<uni-card style="display: none;" :is-shadow="false"
			v-if=" allInfo.TESU_REPAIRORDER_ENTRY && allInfo.TESU_REPAIRORDER_ENTRY.length != 0 && status == 'Service_station'">
			<uni-section title="维修费用" type="line">
				<uni-list v-for="(item,index10) in allInfo.TESU_REPAIRORDER_ENTRY" :key="index10">
					<uni-list-item title="费用项目" :rightText="item.FEXPENSEITEM.FREPAIRITEM" />
					<uni-list-item title=" ">
						<template v-slot:header>
							<text style="font-size: 12px;color: black;display: flex;width: 33%;">数量</text>
						</template>
						<template v-slot:footer>
							<p style="font-size: 12px;color: black;text-align: end;width: 66%;word-break: break-all;">
								{{item.FQTY}}
							</p>
						</template>
					</uni-list-item>
					<uni-list-item title=" ">
						<template v-slot:header>
							<text style="font-size: 12px;color: black;display: flex;width: 33%;">单价</text>
						</template>
						<template v-slot:footer>
							<p style="font-size: 12px;color: black;text-align: end;width: 66%;word-break: break-all;">
								{{item.FPRICE}}
							</p>
						</template>
					</uni-list-item>
					<uni-list-item title=" ">
						<template v-slot:header>
							<text style="font-size: 12px;color: black;display: flex;width: 33%;">金额</text>
						</template>
						<template v-slot:footer>
							<p style="font-size: 12px;color: black;text-align: end;width: 66%;word-break: break-all;">
								{{item.FAMOUNT}}
							</p>
						</template>
					</uni-list-item>
				</uni-list>
			</uni-section>
			<uni-section title="合计" type="line">
				<uni-list>
					<uni-list-item title="费用合计" :rightText="getTotalPrice()" />
				</uni-list>
			</uni-section>
		</uni-card>


		<view v-if="billInfo.F_REPAIRPRICESTATE == '3' && status == 'Service_station'"
			style="display: flex;justify-content: space-around; position: fixed;top: 90%;z-index: 10;width: 90%;border:1px solid #169BD5;border-radius:6px;left: 50%;transform: translateX(-50%);">
			<!-- 保存按钮 -->
			<view @click="showReject"
				style="width: 50%;height: 35px;background-color: #FFFFFF;color: black;border-radius: 5px;display: flex;justify-content: center;align-items: center;">
				无法接单

			</view>
			<!-- 提交按钮 -->
			<view @click="confirm"
				style="width: 50%;height: 35px;background-color: #169BD5;color: #fff;border-radius: 5px;display: flex;justify-content: center;align-items: center;">
				确认接单
			</view>
		</view>
		<!-- 无法接单弹窗 -->
		<u-popup :show="show" mode="center" @close="close" @open="open" :round="10" :customStyle="{width: '90%'}">
			<view style="padding: 20px;display: flex;flex-direction: column;">
				<view style="display: flex;margin-bottom: 20px;">
					<text style="color: red;">*</text>
					<text>无法接单的原因</text>
				</view>
				<u--textarea v-model="FRESON" placeholder="请输入无法接单的原因" style="margin: 20px;"></u--textarea>
				<view @click="rejectOrder"
					style="width: 140px;height: 35px;border-radius: 8px;display: flex;justify-content: center;align-items: center;border: 1px solid gray;margin: 20px auto;">
					提交
				</view>
			</view>
		</u-popup>

	</view>
</template>
<script>
	import {
		FISSPP
	} from '@/common/SDK/tools/enum.js'

	export default {
		data() {
			return {
				allInfo: {},
				info: {}, //订单详情信息
				billInfo: null, //订单信息
				currentIndex: 0, //产品列表
				show: false, //弹窗绑定变量
				FRESON: '', //无法接单原因保存变量
				status: 'Service_station', // 用户类型
				prodCurrentIndex: 0, // 产品的当前索引
				carType: '行驶公里'
			};
		},
		/**
		 * @param {Object} option  获取路由传递过来的参数 同时调用接口  获取接口数据
		 */
		onLoad: async function(option) {
			// console.log("?",option);
			this.status = uni.getStorageSync('customertype')
			let info = JSON.parse(decodeURIComponent(option.obj));
			this.billInfo = info
			console.log("?info",info);
			uni.showLoading({ title: '加载中' }); 
			let result = await this.$Recipe.getSelectRepairOrderDetailByFBillNo({
				FBillNo: info.FBillNo
			})
			let result2 = await this.$Recipe.GetWeiXiuDetail({
				fnumber: info.FBillNo
			})
			this.allInfo = result2.data
			let _info = result.data[0];

			_info.FGUZHANINFOLIST = [];
			_info.WXQKIMAGE = []; //维修情况图片
			_info.WXQKVideo = []; //维修情况视频
			_info.ATTACHMENT = []; //产品图片
			_info.video = []; //故障视频
			_info.GMPZ = []; //购买凭证 
			 
			_info.buyimg.map(item => {
				if (item.type) {
					let FF = item.type.split("_");
					item.type = FF[1];
					item.des = FF[0];
					// if(item.des !=='BXYMSC'){
					// 	return
					// }
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
						case "WXTP":
							//维修情况图片/
							_info.WXQKIMAGE.push(item);
							break;
						case "WXSP":
							//维修情况视频/
							_info.WXQKVideo.push(item);
							break;
						default:
							break;
					}
				}
			}) 
			// YH-20220424105
			this.info = _info;


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
			uni.hideLoading(); 

		},
		computed: {
			// newSource(value) {
			// 	let t='-';
			// 	switch (value) {
			// 		case "1":
			// 			t = "重油预投件"
			// 			break;
			// 		case "2":
			// 			t = "服务站自备件"
			// 			break;
			// 		case "3":
			// 			t = "重油调货"
			// 			break;
			// 		default:
			// 			break;
			// 	}
			// 	return t
			// },



			getTile() {
				switch (this.allInfo && this.allInfo.FCLASSPRODUCT) {
					case '0':
					case '1':
						return '厂家';
					case '2':
						return '中心库';
				}
			},
			/**
			 * 获取产品类型
			 */
			getType() {
				switch (this.allInfo && this.allInfo.FCLASSPRODUCT) {
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
			goStationDetails(id) {
				// return;
				uni.navigateTo({
					url: `/pages/station/info?id=${id}`
				})
			},
			
			newSource(value) {
				let t='-';
				switch (value) {
					case "1":
						t = "重油预投件"
						break;
					case "2":
						t = "服务站自备件"
						break;
					case "3":
						t = "重油调货"
						break;
					default:
						break;
				}
				return t
			},
			goBtn() {
				let WXD = this.info.FNumber;
				let YH = this.info.FBillNo
				 

				uni.navigateTo({
					url: `/pages2/order/repair/repairinfo?YH=${YH}&WXD=${WXD}`
				})
			},
			getTotalPrice() {
				let price = 0
				this.allInfo.TESU_REPAIRORDER_ENTRY.forEach((item, index) => {
					price += item.FPRICE
				})
				return price
			},

			/**
			 * 获取配件来源
			 */
			getProductType(type) {
				let text = ''
				Object.keys(FISSPP).forEach(key => {
					if (FISSPP[key].value == type) {
						text = FISSPP[key].name
					}
				})
				return text
			},

			/**
			 * 切换产品信息
			 */
			prodChange(n) {
				this.currentIndex = n.index
			},
			/**
			 * 无法接单
			 */
			async rejectOrder() {
				if (this.FRESON == '') {
					this.$Recipe.toast('请填写原因')
					return
				}
				const result = await this.$Recipe.UpdateRepairOrder({
					FBillNo: this.billInfo.FBillNo,
					FCONFIRM: '0',
					FWORKORDERNO1: this.billInfo.FWORKORDERNO1,
					FRESON: this.FRESON
				})
				this.show = false
				if (result.code == 200) {
					uni.navigateBack({
						delta: 1,
						success() {
							this.$Recipe.toast('拒绝接单成功')
						}
					})
				} else {
					this.$Recipe.toast('拒绝接单失败,请重试')
				}
			},
			/**
			 * 展示无法接单界面
			 */
			showReject() {
				this.show = true
			},
			open() {},
			/**
			 * 关闭无法接单界面
			 */
			close() {
				this.show = false
			},
			/**
			 * 确定接单
			 */
			async confirm() {
				const result = await this.$Recipe.UpdateRepairOrder({
					FBillNo: this.billInfo.FBillNo,
					FCONFIRM: '1',
					FRESON: ''
				})
				if (result.code == 200) {
					uni.navigateBack({
						delta: 1,
						success() {
							uni.showToast({
								icon: 'none',
								title: '确认接单成功'
							})
						}
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '确认接单失败,请重试'
					})
				}
			},

			/**
			 * 预览图片方法
			 */
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
			showServiceStation(item){
				  
				let data = { FCUSTID: item.F_TESU_SERVICESTATION }
				this.$Recipe.getFuwuzhanxinxi(data).then((res) => {
					 
					let _data  =  res.data[0]; 
					let map = {
						FLatitude_New: Number( _data.FLATITUDE_NEW ),
						F_Longitude: Number( _data.F_LONGITUDE ),
						FServiceTel:  _data.FSERVICETEL,
						Faddress: _data.FAddress,
						Fcustid: _data.FID,
						Fname:  _data.name,
						Fnumber:  _data.name,
						Ftel: _data.FTel,
						dis: "",
						readme: _data.remark
					}
					// console.log(11111111111,map)
					uni.navigateTo({
						url: '/pages/station/info?obj=' + encodeURIComponent(JSON.stringify(map))
					})
				}) 
			},
			showUserAddress(){ 
				let lnglat = this.allInfo.FLongitude_latitude;
				let arr = lnglat.split(',');
				let addr = this.allInfo.FREPAIRSITE 
				uni.openLocation({
					latitude: Number(arr[1]),
					longitude: Number(arr[0]),
					name: addr,
					success: function() {
						console.log('success');
					}
				});
			}
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

	.bottom {
		position: fixed;
		bottom: 20px;
		right: 10px;
		z-index: 99;

		.label-wrap {

			text {
				margin-top: 10rpx;
				margin-right: 28rpx;
				padding: 6rpx 16rpx;
				display: flex;
				background: #169BD5;
				border-radius: 8rpx;
				font-size: 26rpx;
				height: 25px;
				width: 90px;
				color: #fff;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.pageMine{
		width: 160px;
		text-align: center;
		background: #2979ff;
		line-height: 36px;
		border-radius: 22rpx;
		font-size: 28rpx;
		color:#fff;
		position: fixed;
		bottom: 20rpx;
		left: 0;
		margin-left: 50%;
		transform: translateX(-50%);
		z-index: 8; 
	}
</style>

<template>
	<view class="page">
		<!-- 标题 -->
		<view class="title" style="margin-bottom: 10px;font-weight: bold;">
			故障检测结果
		</view>
		<!-- {{allinfo.FCARUSING}} -->
		<view>
			<uni-forms ref="baseForm" :modelValue="formData">
				<!-- required -->
				<uni-forms-item label="使用类别">
					<view @click="show4=true" class="w100">
						<uni-easyinput v-model="Fproductclass" disabled placeholder="请选择使用类别" />
					</view>
				</uni-forms-item>
				<uni-forms-item label="发动机号" :required="Fproductclass == '整车(整机)' || Fproductclass == '零售发动机'">
					<view class="w100">
						<uni-easyinput v-model="formData.FPOWERNUMBER" placeholder="请输入发动机编号" />
					</view>
				</uni-forms-item>
				<!-- 厂家名称 -->
				<uni-forms-item :label="getTile()" required>
					<view class="w100">
						<uni-easyinput v-model="F_tesu_text" :placeholder="getTips()" />
					</view>
				</uni-forms-item>
				<!-- 车辆用途字段 -->
				<uni-forms-item label="用途">
					<view @click="showAssistant" class="w100">
						<uni-easyinput v-model="formData.FVEHICLEPURPOSE" class="disabled_class" disabled
							placeholder="请选择" />
					</view>
				</uni-forms-item>


				<uni-forms-item :label="carType">
					<u-input class="w100" :placeholder="'请填写'+carType" v-model="formData.F_TESU__DRIVINGCOM_H"
						suffixIconStyle="color: #909399">
						<!-- == '行驶里程' -->
						<template slot="suffix"> {{carType=="运转时长" ?'【 小时 】':'【 公里 】'}} </template>
					</u-input>
				</uni-forms-item>

				<!-- 购买日期字段 -->
				<uni-forms-item label="购买日期" style="padding: 0;">
					<uni-datetime-picker class="w100" @custom='custom' :end='new Date().getTime()'
						:placeholder="getDateLabel()" type="date" :clearIcon="false" @dateConfirm='dateConfirm'
						v-model="formData.FPURCHASEDATA" />
				</uni-forms-item>
				<u-gap height="3" bgColor="#ececec" marginBottom='10'></u-gap>


				<!-- 	<uni-forms-item label="产品图片" required>
					<view class="img-box">

						<u-upload class="img-box-cp" :fileList="fileList1" @afterRead="afterRead" @delete="deletePic"
							name="1" :multiple='true' :maxCount="3"></u-upload>
					</view>
					<text class="img-box" style="font-size: 12px;margin-bottom: 5px;">请上传产品外观及标识图片</text>
				</uni-forms-item> -->


				<!-- <uni-forms-item label="故障图片" >
					<view class="img-box"> 
						<u-upload class="img-box-cp" :fileList="fileList2" @afterRead="afterRead" @delete="deletePic"
							name="2" :multiple='true' :maxCount="3"></u-upload>
					</view> 
				</uni-forms-item> -->

				<!-- 服务方式 -->

				<uni-forms-item label="服务方式">
					<u-radio-group v-model="FWXCONFIRM" placement="row">
						<u-radio :name="item.label" :label="item.name"
							:customStyle="{marginBottom: '11px',marginLeft:'20px',marginTop:'10px'}"
							v-for="(item, index) in radiolist1" :key="index"></u-radio>
					</u-radio-group>
				</uni-forms-item>

				<uni-forms-item label="服务站" v-if="FWXCONFIRM=='0'">
					{{servicestationname}}
				</uni-forms-item>
				<!-- 故障地点字段 -->
				<!-- <uni-forms-item :label="FWXCONFIRM=='1'?'维修地点':'服务站'">
					{{FWXCONFIRM=='1'?allinfo.FUSERADDRESS:servicestationname}} 
				</uni-forms-item> -->

				<uni-forms-item label="维修地点:" v-if="FWXCONFIRM=='1'">
					<uni-easyinput class="w100" v-model="formData.FREPAIRSITE" placeholder="维修地点" />
				</uni-forms-item>

				<!-- 上门距离 -->
				<uni-forms-item label="上门距离" required v-if="FWXCONFIRM=='1'">
					<u-input class="w100" placeholder="请输入总里程" v-model="FDISTANCE" type="number"
						suffixIconStyle="color: #909399">
						<template slot="suffix"> 【 往返公里 】 </template>
					</u-input>

				</uni-forms-item>
				<!-- 上门距离 -->
				<uni-forms-item label="往返次数" required v-if="FWXCONFIRM=='1'">
					<u-input class="w100" placeholder="请输入往返次数" v-model="FDISTANCENUM" type="number"
						suffixIconStyle="color: #909399">
						<template slot="suffix"> 【 次数 】 </template>
					</u-input>

				</uni-forms-item>
				<uni-forms-item label="故障类型" required>
					<view class="w100" @click='openTypePicker'>
						<u--textarea v-model="formData.errType" :maxlength='-1' disabled autoHeight="true"
							placeholder="请选择故障类别" /></u--textarea>
					</view>
				</uni-forms-item>

				<u-gap height="3" bgColor="#ececec" marginBottom='10'></u-gap>

				<!-- 多个产品tabs切换 -->
				<u-tabs :list="list2" itemStyle="font-size:18px;height:30px" :current='currentIndex'
					@change='prodChange'>
					<view slot="right"
						style="padding-left: 4px;display: flex;width: 52px;justify-content: space-between;">
						<u-icon name="close" size="20" bold @tap="descrementPro"></u-icon>
						<u-icon name="plus" size="20" bold @tap="addProd"></u-icon>
					</view>
				</u-tabs>
				<!-- 选择产品组件 -->
				<view v-for="(item,index) in list2" :key='item.id'>
					<chooseProd @choose='changeBadge' :status="true" ref='choosecmp' :MaterialList='MaterialList'
						v-show="currentIndex == index" />
				</view>
				<u-gap height="3" bgColor="#ececec" marginBottom='10' marginTottom='10'></u-gap>
				<!--  -->


				<view class="top-btn" @click="toggle(3)">报修单故障描述</view>
				<!-- 检测情况描述 -->

				<uni-forms-item label="检测结果" required>
					<view class="w100" style="margin-bottom: 25px;">
						<u--textarea v-model="formData.mark" :maxlength='-1'
							placeholder="请填写产品检测情况，可能造成的故障原因及处理意见。如喷油器回油量大，造成车辆无法启动，建议更换喷油器。"></u--textarea>
					</view>
				</uni-forms-item>
				<!-- 维修图片 -->
				<view class="top-btn" @click="toggle(1)">报修单故障图片</view>
				<uni-forms-item required label="检测图片" label-width='80'>
					<u-upload class="img-box-cp" :fileList="fileList4" @afterRead="afterRead" @delete="deletePic"
						name="4" :multiple='true' :maxCount="3"></u-upload>

				</uni-forms-item>
				<view class="top-btn" @click="toggle(4)">报修单购买凭证</view>
				<!-- 维修图片 -->
				<uni-forms-item label="手续图片" label-width='80'>
					<u-upload class="img-box-cp" :fileList="fileList7" @afterRead="afterRead" @delete="deletePic"
						name="7" :multiple='true' :maxCount="3"></u-upload>
				</uni-forms-item>
				<!-- 维修视频 -->
				<view class="top-btn" @click="toggle(2)">报修单故障视频</view>
				<uni-forms-item label="检测视频" label-width='80'>
					<u-upload class="img-box-cp" :previewFullImage='false' @click.native="preVideo"
						:useBeforeRead='true' accept="video" :fileList="fileList5" @afterRead="afterRead"
						@delete="deletePic" @beforeRead='beforeReadHandler' name="5" :multiple='false' :maxCount="1">
					</u-upload>
				</uni-forms-item>

				<!-- 提交检测结果 -->
				<button size="medium" type="warning"
					style="color: #FFFFFF;background-color: #169BD5;margin-top: 20rpx;margin-bottom:50rpx"
					@click='commitBtn'>提交检测结果</button>
				<!-- 故障类型选择树状图 -->
				<tki-tree ref="tkitree" :selectParent='false' :range="list" rangeKey="Fname" @cancel='quit'
					:multiple='true' :foldAll="true" @confirm='treeconfirm' confirmColor="#4e8af7" />

				<!-- 产品类别选择器 -->
				<u-picker :show="show4" :closeOnClickOverlay='true' @cancel='show4=false' @close='show4=false'
					@confirm='TypeConfirm' :columns="typeList" keyName="Fname"></u-picker>
				<!-- 车辆用途选择框 -->
				<u-picker :show="show1" :closeOnClickOverlay='true' @cancel='show1=false' @close='show1=false'
					@confirm='AssistantDataConfirm' :columns="SelectAssistantDataList" keyName="FDataValue"></u-picker>
				<!-- 删除确认 -->
				<u-modal :show="show2" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="deletConfitm()"
					:title="'确认是否删除产品' + (currentIndex+1)" @cancel="show2=false" @close="show2=false"></u-modal>

				<u-popup :show="show6" :round="10" mode="center" @close="videoclose">
					<view class="" style="display: flex;justify-content: center;align-items: center;">
						<video :src="fileList5[0].url" ref='video' controls></video>
					</view>
				</u-popup>


				<!-- 保存确认 -->
				<u-modal :show="show7" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="commit"
					:title="'确认提交'" @cancel="show7=false" @close="show7=false"></u-modal>
			</uni-forms>
		</view>

		<uni-popup ref="popup" type="center" background-color="#fff">
			<view class="popup-content">
				<view class="img-box" v-if="showType==1 && showInfo && showInfo.CPGZ && showInfo.CPGZ.length > 0">
					<view class="img-box-gz" v-for="(item,index) in showInfo.CPGZ" :key='item.FattachmentName'>
						<image class="image" @click='previewImg(item.FattachmentName)' style="width: 180px;"
							mode="widthFix" :src="item.FattachmentName" />
					</view>
				</view>
				<view v-if="showType==2 && showInfo && showInfo.video && showInfo.video.length > 0">
					<view class="img-box" style="width: 1%;" v-for="(item,index) in showInfo.video" :key='index'>
						<view class="img-box-gz">
							<video :src="item.FattachmentName" controls></video>
						</view>
					</view>
				</view>
				<view class="text_box" v-if="showType==3">
					<text class="text">{{allinfo.FERRORDESC || '暂无故障描述'}}</text>
				</view>

				<view class="img-box" v-if="showType==4 && showInfo && showInfo.GMPZ && showInfo.GMPZ.length > 0">

					<view class="img-box-gz" v-for="(item,index) in showInfo.GMPZ" :key='item.FattachmentName'>
						<image class="image" @click='previewImg(item.FattachmentName)' style="width: 180px;"
							mode="widthFix" :src="item.FattachmentName" />
					</view>

					<!-- <view class="img-box-gz">
						<image class="image" @click='previewImg(showInfo.GMPZ[0].FattachmentName)' style="width: 180px;" mode="widthFix"
							:src="showInfo.GMPZ[0].FattachmentName" />
					</view> -->
				</view>
				<view v-if="showInfo && ((showType==1 && (!showInfo.CPGZ || showInfo.CPGZ.length === 0)) || (showType==2 && (!showInfo.video || showInfo.video.length === 0)) || (showType==4 && (!showInfo.GMPZ || showInfo.GMPZ.length === 0)))" style="padding: 20px;text-align: center;color: #999;">
					暂无数据
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	import chooseProd from '@/components/common/chooseProd.vue'
	export default {
		components: {
			tkiTree,
			chooseProd
		},
		data() {
			return {
				formData: {
					errType: '', // 故障类型展示变量
					mark: '', // 检查结果绑定变量
					Fentryid: '', // 故障类型的fid
					FVEHICLEPURPOSE: '', // 用途
					FPURCHASEDATA: '',
					FREPAIRSITE: '',
					distence: '',
					F_TESU__DRIVINGCOM_H: '',
					F_DRIVINGCOM_H: '',
					FPOWERNUMBER: ''
				},
				fileList1: [], // 产品图片列表数组
				fileList2: [], // 产品故障列表数组
				fileList4: [], // 检测图片列表数组
				fileList5: [], // 检测视频列表数组
				fileList7: [], // 手续图片
				ATTACHMENT: [], //产品图片
				CPGZ: [], //产品故障图片
				JCTP: [], //检测图片
				JCSP: [], //检测视频    // //JCTP JCSP SXTP
				SXTP: [], //手续图片

				handle: [], //凭证图片
				errImg: [], // 故障图片接口返回变量数组
				video: [], // 故障视频接口返回变量数组
				prodImg: [], // 产品图片接口返回变量数组
				item: null, // 
				list: [], // 树形菜单列表数组
				show1: false,
				show4: false, // 产品类别
				show2: false,
				show6: false,
				show7: false, //提交检测结果
				Fproductclass: '',
				F_tesu_text: '',
				F_TESU__DRIVINGCOM_H: '',
				radiolist1: [{
						name: '到服务站维修',
						label: "0"
					},
					{
						name: '上门维修',
						label: "1"
					}
				],
				typeList: [
					[{
						Fname: '整车(整机)'
					}, {
						Fname: '零售发动机'
					}, {
						Fname: '配件'
					}]
				],
				list2: [{
					name: '产品1',
					badge: {
						isDot: true
					}
				}], // 产品名字列表  isDot控制红点显示
				currentIndex: 0,
				MaterialList: [], // 选择产品列表大类
				customInfo: 'after',
				producIndex: '0',
				SelectAssistantDataList: [],
				SelectAssistantDataListnumber: '',
				status: 'Service_station',
				carType: '行驶里程', // '行驶里程'  运转时长 当用途为机械（3.4.5.6），为时间 ↵其余为里程
				FID: '0',
				FBillNo: '',
				id: 0,
				allinfo: {},
				FWXCONFIRM: '', //上门维修 1是 0否
				servicestationname: "", //服务站
				FDISTANCE: '', //上门距离
				FDISTANCENUM: "", //往返次数
				FDISTANCEALL: '', //往返总里程
				showInfo: null, //
				showType: 1,

			}
		},
		/**
		 *  请求数据
		 */
		async onLoad(options) {
			this.item = JSON.parse(decodeURIComponent(options.obj))
			let result2 = await this.$Recipe.GetWeiXiuDetail({
				fnumber: this.item.FBillNo
			})
			this.allinfo = result2.data;
			console.log(result2.data)
			console.log(result2.data.FWXCONFIRM)
			this.FWXCONFIRM = result2.data.FWXCONFIRM;
			this.F_TESU__DRIVINGCOM_H = result2.data.F_TESU__DRIVINGCOM_H
			if (result2.FLongitude_latitude && result2.FLongitude_latitude != ' ') {
				let locationArr = result2.FLongitude_latitude.split(',')
				let custnumber = uni.getStorageSync('userNumber')
				this.$Recipe.GetServiceStationLength({
					custnumber,
					Latitude: locationArr[1],
					Longitude: locationArr[0]
				})
			}

			const value = uni.getStorageSync('customertype');
			this.status = value
			const obj = JSON.parse(decodeURIComponent(options.obj))
			this.FID = obj.FID
			this.FBillNo = obj.FBillNo
			const result = await this.$Recipe.getSelectRepairOrderDetailByFBillNo({
				FBillNo: obj.FBillNo
			})
			console.log('完整的接口返回数据:', result)
			console.log('buyimg数据:', result.data[0]?.buyimg)
			console.log('ATTACHMENT数据:', result.data[0]?.ATTACHMENT)
			console.log('ERRORIMG数据:', result.data[0]?.ERRORIMG) 
			console.log('video数据:', result.data[0]?.video)
			console.log('接口返回的所有字段:', Object.keys(result.data[0] || {}))

			let _info = result.data[0];

			_info.ATTACHMENT = []
			_info.CPGZ = []
			_info.GMPZ = []
			_info.video = _info.video || [] // 确保video数组存在
			
			// 检查buyimg是否存在
			if (!_info.buyimg || !Array.isArray(_info.buyimg)) {
				console.warn('⚠️ buyimg数据不存在或不是数组:', _info.buyimg)
			} else {
				console.log('📦 buyimg数组长度:', _info.buyimg.length)
				console.log('📦 buyimg数据详情:', JSON.stringify(_info.buyimg, null, 2))
				
				_info.buyimg.forEach((item, index) => {
					console.log(`🔍 处理第${index + 1}项:`, item)
					if (item.type) {
						let FF = item.type.split("_");
						let originalType = item.type;
						item.type = FF[1];
						item.des = FF[0];
						console.log(`  - 原始type: ${originalType}, 拆分后: [${FF.join(', ')}], 处理后type: ${item.type}`)
						
						switch (item.type) {
							case "CPTP":
								// 产品图片
								_info.ATTACHMENT.push(item);
								console.log('  ✅ 已添加到ATTACHMENT')
								break;
							case "GZSP":
								// 故障视频
								_info.video.push(item);
								console.log('  ✅ 已添加到video')
								break;
							case "GZTP":
								// 故障图片
								_info.CPGZ.push(item);
								console.log('  ✅ 已添加到CPGZ')
								break;
							case "GMPZ":
								//购买凭证/
								_info.GMPZ.push(item);
								console.log('  ✅ 已添加到GMPZ')
								break;
							case "JCTP":
								//检测图片/
								_info.JCPZ = _info.JCPZ || [];
								_info.JCPZ.push(item);
								console.log('  ✅ 已添加到JCPZ')
								break;
							case "JCSP":
								//检测视频/
								_info.JCSP = _info.JCSP || [];
								_info.JCSP.push(item);
								console.log('  ✅ 已添加到JCSP')
								break;
							case "SXTP":
								//手续图片/
								_info.SXTP = _info.SXTP || [];
								_info.SXTP.push(item);
								console.log('  ✅ 已添加到SXTP')
								break;
							default:
								console.warn(`  ⚠️ 未匹配的类型: ${item.type}, 原始type: ${originalType}`)
								break;
						}
					} else {
						console.warn(`  ⚠️ 第${index + 1}项没有type字段:`, item)
					}
				})
			}

			this.showInfo = _info;
			console.log('📊 最终showInfo数据:')
			console.log('  - CPGZ (故障图片):', _info.CPGZ.length, _info.CPGZ)
			console.log('  - video (故障视频):', _info.video.length, _info.video)
			console.log('  - GMPZ (购买凭证):', _info.GMPZ.length, _info.GMPZ)
			console.log('  - ATTACHMENT (产品图片):', _info.ATTACHMENT.length, _info.ATTACHMENT)
			this.servicestationname = result.data[0].servicestationname
			// this.FBillNo = obj.FBillNo
			Object.keys(this.formData).forEach(key => {
				this.formData[key] = result.data[0][key]
			})
			console.log("this.formData--", this.formData)
			this.formData.FREPAIRSITE = this.allinfo.FREPAIRSITE ? this.allinfo.FREPAIRSITE : ''; //维修地点
			this.formData.FPOWERNUMBER = this.allinfo.FPOWERNUMBER ? this.allinfo.FPOWERNUMBER : ''; //发动机号
			// FDataValue
			this.formData.F_TESU__DRIVINGCOM_H = result2.data.F_TESU__DRIVINGCOM_H
			this.F_tesu_text = result.data[0].F_TESU_MANU.trim();

			this.producIndex = this.allinfo.FCLASSPRODUCT ? this.allinfo.FCLASSPRODUCT : '0'
			// this.producIndex = result.data[0].Fproductclass ? result.data[0].Fproductclass : '0'
			this.$nextTick(function() {
				this.Fproductclass = this.getproducType()
			})

			this.list2.splice(0)
			let Prodcuts = _info.PRODUCT.Prodcuts;

			//产品图片
			_info.ATTACHMENT.forEach(item => {
				let obj = {
					url: item.FattachmentName,
					FID: item.FID,
					type: 'image',
					status: 'success',
					thumb: item.FattachmentName
				}
				this.fileList1.push(obj)
				this.prodImg.push({
					FID: item.FID
				})
			})
			Prodcuts.map((item, index) => {
				if (Prodcuts[0].data.length === 0) {
					this.list2 = [{
						name: '产品1',
						badge: {
							isDot: true
						}
					}]
				} else {
					this.id++
					this.list2.push({
						name: '产品' + (index + 1),
						id: this.id,
						badge: {
							isDot: false
						}
					})
					this.$nextTick(() => {
						this.$refs.choosecmp[index].setValues(item)
					})
				}
			})


			// FDataValue: "公路用车"
			// FDescription: "当用途为机械（3.4.5.6），为时间 ↵其余为里程"
			// FentryID: "622eaea96ec6e9"
			// Fnumber: "CLYT.0001"
			// res.data[0].FVEHICLEPURPOSE
			const res = await this.$Recipe.getAssistantDataList()
			console.log("getAssistantDataList,--res--", res)
			res.data.forEach((item, index) => {


				if (item.FDataValue == this.formData.FVEHICLEPURPOSE) {
					// this.carType = index
					// this.formData.FVEHICLEPURPOSE = item.FDataValue
					this.SelectAssistantDataListnumber = item.FentryID
					if (index == 0 || index == 1) {
						this.carType = '行驶里程'
					} else {
						this.carType = '运转时长'
					}
				}
			})


			this.getList()
			this.getSelectMaterialList()
			this.getAssistantDataList()
		},
		methods: {

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


			beforeReadHandler(file, lists, name) {},
			/**
			 * 删除图片  
			 */
			preVideo(url) {

				if (this.fileList5.length == 0 || this.JCSP.length == 0) {
					return
				}
				this.show6 = true
			},
			videoclose() {
				this.show6 = false
			},
			/**
			 * 获取产品类别
			 */
			getproducType(type) {
				switch (this.producIndex) {
					case '0':
						return '整车(整机)';
					case '1':
						return '零售发动机';
					case '2':
						return '配件';
				}
			},
			/**
			 * 获取产品信息
			 */
			getprodArr() {
				let arr = []
				let stau = 0
				this.$refs.choosecmp.forEach(item => {
					let newArr = item.getObj().map(item2 => {

						let tag = 1;
						if (item2.FPRODUCTNO && item2.FORDERNO && item2.MaterialListnumber && item2
							.FPRODUCTNO !== ' ' && item2.FORDERNO !== ' ' && item2.MaterialListnumber !==
							' ') {
							tag = 0;
						}
						stau += tag
						return {
							FPRODUCTNO: item2.FPRODUCTNO,
							FORDERNO: item2.FORDERNO,
							F_Assistant_01: item2.MaterialListnumber,
							// RPMFENTRYID: item2.RPMFENTRYID,
						}
					})

					arr.push(...newArr)

				})

				if (stau > 0) {
					arr = false
				}
				return arr
			},
			/**
			 * 确认删除产品
			 */
			deletConfitm() {
				this.list2.splice(this.currentIndex, 1)
				if (this.currentIndex == this.list2.length) {
					this.currentIndex--
				}
				this.list2 = this.list2.map((item, index) => {
					item.name = '产品' + (index + 1)
					return item
				})
				this.show2 = false
			},
			/**
			 * 获取车辆用途数组
			 */
			async getAssistantDataList() {
				const result = await this.$Recipe.getAssistantDataList()
				if (result.code == 200) {
					this.SelectAssistantDataList = [result.data]
				} else {
					uni.showToast({
						icon: 'none',
						title: '获取车辆用途失败'
					})
				}
			},
			/**
			 *  获取搜索或树形菜单的返回结果  
			 */
			getSearchReault(item) {
				this.$refs.choosecmp[this.currentIndex].formData.FORDERNO = item.Fname
				this.changeBadge()
			},
			/**
			 * 日期确定
			 */
			dateConfirm() {
				this.customInfo = 'after'
			},
			/**
			 * 获取日期的placeholder
			 */
			getDateLabel() {
				let text = "购买日期"
				text = this.customInfo == 'after' ? '购买日期' : '售前维修'
				if (!this.formData.FPURCHASEDATA) {
					text = '售前维修'
				}

				return text
			},
			/**
			 * 售前维修
			 */
			custom(e) {
				this.customInfo = 'before'
				this.formData.FPURCHASEDATA = ''
				this.formData.F_TESU__DRIVINGCOM_H = ''

			},
			/**
			 * 车辆用途选择确定
			 */
			AssistantDataConfirm(e) {
				this.formData.FVEHICLEPURPOSE = e.value[0].FDataValue
				this.SelectAssistantDataListnumber = e.value[0].Fnumber

				if (e.indexs[0] == 0 || e.indexs[0] == 1) {
					this.carType = '行驶里程'
				} else {
					this.carType = '运转时长'
				}

				this.show1 = false
			},
			/**
			 * 打开车辆用途选择
			 */
			showAssistant() {
				if (!this.SelectAssistantDataList || this.SelectAssistantDataList[0].length == 0) {
					this.getAssistantDataList()
				}
				this.show1 = true
			},
			/**
			 * 获取产品信息数组
			 */
			async getSelectMaterialList() {
				const result = await this.$Recipe.getSelectMaterialList()
				if (result.code == 200) {
					this.MaterialList = [result.data]
				} else {
					uni.showToast({
						icon: 'none',
						title: '获取产品信息失败'
					})
				}
			},
			/**
			 * 切换产品
			 */
			prodChange(item) {
				this.currentIndex = item.index
				for (let i = 0; i < this.list2.length; i++) {
					this.list2[i].badge.isDot = false //删除红点状态 
					if (this.currentIndex == i) {
						this.list2[i].badge.isDot = true //修改红点状态 
					}
				}
			},
			addProd() {
				for (let i = 0; i < this.list2.length; i++) {
					// if (this.list2[i].badge.isDot) {
					// this.$Recipe.toast('请完善信息')  /**isDot 表示红点 这里是在做什么判断？**/
					// return
					// }
					this.list2[i].badge.isDot = false //修改红点状态
				}
				let number = this.list2.length + 1;
				this.id++
				this.list2.push({
					name: '产品' + number,
					id: this.id + 1,
					badge: {
						isDot: true,
					}
				})
				this.$nextTick(() => {
					let length = this.$refs.choosecmp.length;
					this.$refs.choosecmp[length - 1].formData.FPRODUCTNAME = this.$refs.choosecmp[length - 2]
						.formData.FPRODUCTNAME
					this.$refs.choosecmp[length - 1].MaterialListnumber = this.$refs.choosecmp[length - 2]
						.MaterialListnumber
					this.currentIndex = length - 1
					this.changeBadge()
				})
				this.$Recipe.toast('添加成功')
			},
			/**
			 * 删除产品提示框
			 */
			descrementPro() {
				if (this.list2.length == 1) {
					this.$Recipe.toast('至少一项产品')
					return
				}
				this.show2 = true
			},
			/**
			 * 确认删除产品
			 */
			deletConfitm() {
				this.list2.splice(this.currentIndex, 1)
				if (this.currentIndex == this.list2.length) {
					this.currentIndex--
				}
				this.list2 = this.list2.map((item, index) => {
					item.name = '产品' + (index + 1)
					return item
				})
				this.show2 = false
			},
			/**
			 * 改变产品状态
			 */
			changeBadge() {

				this.$nextTick(() => {
					let current = this.$refs.choosecmp[this.currentIndex];

					if (this.status == 'Service_station') {
						if (current.MaterialListnumber != '' && current.formData.FORDERNO != '' && current.formData
							.number != '') {
							this.list2[this.currentIndex].badge.isDot = false
						} else {
							this.list2[this.currentIndex].badge.isDot = true
						}
					} else {
						if (current.MaterialListnumber != '') {
							this.list2[this.currentIndex].badge.isDot = false
						}
					}

				})
			},
			/**
			 * 获取厂家的placeholder
			 */
			getTips() {
				return `请输入${this.getTile()}名称`
			},
			/**
			 * 获取厂家类别
			 */
			getTile() {
				switch (this.producIndex) {
					case '0':
					case '1':
						return '厂家';
					case '2':
						return '中心库';
				}
			},
			/**
			 *  确定产品类别
			 */
			TypeConfirm(e) {
				this.Fproductclass = e.value[0].Fname
				this.producIndex = e.indexs[0] + ''
				this.show4 = false
			},
			/**
			 *  清除数据
			 */
			reset() {
				Object.keys(this.formData).forEach(item => {
					this.formData[item] = ''
				})
				this.fileList1.splice(0)
				this.fileList2.splice(0)
				this.fileList4.splice(0)
				this.fileList5.splice(0)
				this.fileList7.splice(0)
				this.ATTACHMENT.splice(0)

				this.CPGZ.splice(0)
				this.JCTP.splice(0)
				this.JCSP.splice(0)
				this.SXTP.splice(0)
				this.prodImg.splice(0)
			},
			/**
			 * 树形菜单确定方法 
			 */
			treeconfirm(e) {

				this.formData.errType = e.map(item => item.Fname).join(',')
				// this.formData.Fentryid = e[0].Fentryid
				this.formData.Fentryid = e.map(item => item.Fentryid)
			},
			quit() {

			},
			/**
			 * 打开树形菜单
			 */
			openTypePicker() {
				if (this.list.length == 0) {
					this.getList()
				}
				this.$refs.tkitree._show()
			},
			/**
			 * 获取列表
			 */
			async getList() {
				let result = await this.$Recipe.errReason()
				let arr3 = []
				console.log('result', result)
				result.data.forEach((item, index) => {
					item.id = item.FID
					arr3.push(item.children)
					if (!item.children && item.children.length != 0) {
						item.children.forEach((item2, index2) => {
							arr3.push(item2)
							item2.id = item2.FID
							if (!item2.children && item2.children.length != 0) {
								item2.children.forEach((item3, index3) => {
									arr3.push(item3)
									item3.id = item3.FID
								})
							}
						})
					}
				})
				this.list = [...result.data]
			},

			commitBtn() {
				this.show7 = true
			},
			/**
			 * 提交检测结果
			 */
			async commit(type) {
				this.show7 = false;
				const arr = this.getprodArr()
				console.log(this.Fproductclass)
				if (this.Fproductclass == '整车(整机)' || this.Fproductclass == '零售发动机') {
					if (!this.formData.FPOWERNUMBER) {
						uni.showToast({
							icon: 'none',
							title: '请填写发动机号'
						})
						return;
					}
				}
				if (!this.F_tesu_text) {
					uni.showToast({
						icon: 'none',
						title: '请填写厂家'
					})
					return;
				}

				// if (this.ATTACHMENT.length == 0 && this.showInfo.ATTACHMENT.length == 0) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '请上传产品图片'
				// 	})
				// 	return;
				// }
				if (!arr) {
					uni.showToast({
						icon: 'none',
						title: '请完善产品信息'
					})
					return;
				}
				if (!this.formData.errType) {
					uni.showToast({
						icon: 'none',
						title: '请填写故障类型'
					})
					return;
				}

				if (!this.formData.mark) {
					uni.showToast({
						icon: 'none',
						title: '请填写故障检测结果'
					})
					return;
				}
				if (this.JCTP.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请上传故障检测图片'
					})
					return;
				}
				if (this.FWXCONFIRM == '1') {
					if (parseFloat(this.FDISTANCE).toString() == "NaN") {
						uni.showToast({
							icon: 'none',
							title: '请输入上门距离！'
						})
						return
					}
					if (parseFloat(this.FDISTANCENUM).toString() == "NaN") {
						uni.showToast({
							icon: 'none',
							title: '请输入上门次数！'
						})
						return
					}
				}

				// this.prodImg.splice(0)
				let newobj = {
					FileFIDS: [...this.ATTACHMENT, ...this.JCTP, ...this.JCSP, ...this.SXTP],
					FCHECKRESULT: this.formData.mark ? this.formData.mark : ' ',
					FID: this.item.FID,
					FBillNo: this.item.FBillNo,
					FERRORMODE: this.formData.Fentryid,
					FWXCONFIRM: this.FWXCONFIRM, //上门维修 1是 0否
					FDISTANCE: (this.FWXCONFIRM == '1' && this.FDISTANCE) ? this.FDISTANCE : '', //上门距离
					FDISTANCENUM: (this.FWXCONFIRM == '1' && this.FDISTANCENUM) ? this.FDISTANCENUM : 1, //上门次数
					FREPAIRSITE: this.formData.FREPAIRSITE,
					F_TESU_MANU: this.F_tesu_text,
					FCLASSPRODUCT: this.producIndex,
					FCARUSING: this.SelectAssistantDataListnumber,
					FPURCHASEDATA: this.formData.FPURCHASEDATA,
					FPURCHASEDATAENTENTRY: arr,
					FWORKORDERNO1: this.item.FWORKORDERNO1,
					FPOWERNUMBER: this.formData.FPOWERNUMBER,
				}
				console.log('========== 故障检测结果页面 - 提交参数 ==========')
				console.log('页面: pages2/order/repair/errCheck.vue')
				console.log('提交参数对象:', JSON.stringify(newobj, null, 2))
				console.log('参数详情:')
				console.log('  - FBillNo:', newobj.FBillNo)
				console.log('  - FID:', newobj.FID)
				console.log('  - FWORKORDERNO1:', newobj.FWORKORDERNO1)
				console.log('  - FCHECKRESULT:', newobj.FCHECKRESULT)
				console.log('  - FERRORMODE:', newobj.FERRORMODE)
				console.log('  - FWXCONFIRM:', newobj.FWXCONFIRM)
				console.log('  - FileFIDS 数组长度:', newobj.FileFIDS ? newobj.FileFIDS.length : 0)
				console.log('================================================')
				
				const result = await this.$Recipe.UpdateRepairOrder(newobj)
				
				console.log('========== 故障检测结果页面 - 接口响应 ==========')
				console.log('响应结果:', result)
				console.log('响应码:', result ? result.code : '无响应')
				console.log('响应消息:', result ? result.msg : '无响应')
				console.log('响应数据:', result ? result.data : '无响应')
				console.log('================================================')
				if (result.code == 200) {
					this.reset()
					uni.redirectTo({
						url: '/pages2/order/repair/changeProd?obj=' + encodeURIComponent(JSON.stringify(this
							.item)),
						success() {
							uni.showToast({
								icon: 'none',
								title: '提交检测结果成功'
							})
						}
					})
					// uni.navigateBack({
					// 	delta: 1,
					// 	success() {
					// 		uni.showToast({
					// 			icon: 'none',
					// 			title: '提交检测结果成功'
					// 		})
					// 	}
					// })
				} else {
					uni.showToast({
						icon: 'none',
						title: '提交检测结果失败'
					})
				}
			},
			/**
			 * 删除图片  
			 */
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
				if (event.name == '1') {
					this.ATTACHMENT.splice(event.index, 1)
				}
				if (event.name == '2') {
					this.CPGZ.splice(event.index, 1)
				}
				if (event.name == '4') {
					this.JCTP.splice(event.index, 1)
				}
				if (event.name == '5') {
					this.JCSP.splice(event.index, 1)
				}
				if (event.name == '7') {
					this.SXTP.splice(event.index, 1)
				}
				this.$Recipe.DeleteFile({
					FID: event.file.FID
				})
			},

			/**
			 * 新增图片
			 */
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})

				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url, event.name)

					try {
						JSON.parse(result).data.FID
					} catch (e) {

						uni.showToast({
							icon: 'none',
							title: '文件上传失败'
						})
						this[`fileList${event.name}`].splice(fileListLen, 1)
						return
						//TODO handle the exception
					}
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: item.url,
						FID: JSON.parse(result).data.FID
					}))
					fileListLen++
				}
				if (event.name == '1') {
					this.ATTACHMENT.splice(0)
				}
				if (event.name == '2') {
					this.CPGZ.splice(0)
				}
				if (event.name == '4') {
					this.JCTP.splice(0)
				}

				if (event.name == '5') {
					this.JCSP.splice(0)
				}
				if (event.name == '7') {
					this.SXTP.splice(0)
				}
				this[`fileList${event.name}`].forEach(item => {
					let obj = {
						"FID": item.FID,
					}
					if (event.name == '1') {
						this.ATTACHMENT.push(obj)
					}
					if (event.name == '2') {
						this.CPGZ.splice(0)
					}
					if (event.name == '4') {
						this.JCTP.push(obj)
					}
					if (event.name == '5') {
						this.JCSP.push(obj)
					}
					if (event.name == '7') {
						this.SXTP.push(obj)
					}
				})
			},
			/**
			 * 上传图片方法
			 */
			uploadFilePromise(url, number) {
				let type = '';
				let Uploadurl = 'https://cy.klwsxx.com/File/FileUpload';
				if (number == '1') type = 'BXYMSC_CPTP';
				if (number == '2') type = 'BXYMSC_GZTP';
				if (number == '4') type = 'GZJCYMSC_JCTP';
				if (number == '7') type = 'GZJCYMSC_SXTP';
				if (number == '5') type = 'GZJCYMSC_JCSP';
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: Uploadurl,
						filePath: url,
						formData: {
							type: type,
						},
						name: 'FileName',
						success: (res) => {
							setTimeout(() => {
								resolve(res.data)
							}, 1000)
						},
						fail: (err) => {
							uni.showToast({
								icon: 'none',
								title: '上传失败'
							})
						}
					});
				})

			},
			//弹框
			toggle(type) {
				this.showType = type;
				// 检查数据是否存在
				if (!this.showInfo) {
					console.warn('⚠️ showInfo为空，无法显示弹窗')
					uni.showToast({
						icon: 'none',
						title: '数据加载中，请稍候'
					})
					return
				}
				
				// 调试信息
				console.log('🔍 toggle调用，type:', type)
				console.log('  - showInfo:', this.showInfo)
				console.log('  - CPGZ:', this.showInfo.CPGZ, '长度:', this.showInfo.CPGZ?.length)
				console.log('  - video:', this.showInfo.video, '长度:', this.showInfo.video?.length)
				console.log('  - GMPZ:', this.showInfo.GMPZ, '长度:', this.showInfo.GMPZ?.length)
				
				// 根据类型检查数据
				if (type === 1) {
					if (!this.showInfo.CPGZ || this.showInfo.CPGZ.length === 0) {
						console.warn('⚠️ 故障图片数据为空')
						console.log('  - 检查buyimg:', this.showInfo.buyimg)
						console.log('  - 检查ERRORIMG:', this.showInfo.ERRORIMG)
						uni.showToast({
							icon: 'none',
							title: '暂无故障图片'
						})
						return
					}
				}
				if (type === 2) {
					if (!this.showInfo.video || this.showInfo.video.length === 0) {
						console.warn('⚠️ 故障视频数据为空')
						console.log('  - 检查buyimg:', this.showInfo.buyimg)
						console.log('  - 检查video字段:', this.showInfo.video)
						uni.showToast({
							icon: 'none',
							title: '暂无故障视频'
						})
						return
					}
				}
				if (type === 4) {
					if (!this.showInfo.GMPZ || this.showInfo.GMPZ.length === 0) {
						console.warn('⚠️ 购买凭证数据为空')
						console.log('  - 检查buyimg:', this.showInfo.buyimg)
						uni.showToast({
							icon: 'none',
							title: '暂无购买凭证'
						})
						return
					}
				}
				// open 方法传入弹出方向，使用 'center' 居中弹出
				if (this.$refs.popup) {
					this.$refs.popup.open('center')
				} else {
					console.error('❌ popup ref不存在')
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.img-box {
		width: 100%;
	}

	.text_box {
		width: 100%;
	}

	.text_box text {
		margin: 20px;
		padding: 20px;
		line-height: 30px;
	}

	.img-box {
		width: 100%;
	}

	.img-box-cp {
		width: 30%;
		padding: 5px 2% 5px 1%;
		float: left;
	}

	.img-box-cp image {
		width: 100%;
		height: auto;
		text-align: center;
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

	/deep/ .u-cell__body,
	.data-v-1c4434ae {
		padding: 10px 15px 10px 0 !important;
		font-size: 13px !important;
		color: #666666 !important;
	}

	/deep/ .u-cell__title-text,
	.data-v-1c4434ae {
		font-size: 13px !important;
		color: #666666 !important;
	}

	/deep/ .uni-forms-item__content,
	.u-radio-group,
	.data-v-97ce24d6,
	.u-radio-group--row,
	.radio_group {
		// display: flex;
		align-items: center;
	}

	/deep/ .uni-easyinput__content,
	.data-v-abe12412 .is-input-border .is-disabled,
	.disabled_class {
		background-color: white !important;
	}

	.page {
		padding: 15px 20px 0 20px;
	}

	.top-btn {
		font-size: 14px;
		width: 100%;
		padding: 10px;
		color: #3c9cff;
		text-align: right;
	}

	.show-box {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
		background: #efefef;
		text-align: center;
	}

	.w100 {
		width: 100%;
	}

	.popup-content {}

	.popup-content text {

		padding: 20px;
	}

	.my-card-box {
		margin: 1px 0;
		padding: 1px 0;
		background-color: #fff;
		box-shadow: 0 4rpx 8rpx 0 #e3eef5;
		border-radius: 10rpx;
		border: 4rpx solid #e3eef5;
	}
</style>  
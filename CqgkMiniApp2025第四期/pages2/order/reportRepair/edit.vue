<template>
	<view class="add-box" style="position: relative;padding-bottom: 55px;">
 
		<uni-forms ref="baseForm" :modelValue="formData" v-show="onShowNow">
			<!--  -->
			<!--  -->
			<!--  -->
			<view class="my-card-box">
				<uni-section title="用户信息" type="line">
					<uni-list>
						<view style="padding: 5px;">
							<uni-forms-item label="用户单位" style="padding-top: 10px;">
								<uni-easyinput v-model="formData.FUSER" placeholder="请输入用户单位/户主" />
							</uni-forms-item>
							<!-- 用户电话字段 -->
							<uni-forms-item label="用户电话">
								<uni-easyinput v-model="formData.FOWNERPHONE" placeholder="请填写用户电话号码" />
							</uni-forms-item>
							<!-- 用户地址字段 -->
							<uni-forms-item label="用户地址">
								<uni-easyinput v-model="formData.FUSERADDRESS" placeholder="请填写地址" />
							</uni-forms-item>
							<!-- 联系人字段 -->
							<uni-forms-item label="联系人" required>
								<uni-easyinput v-model="formData.F_USERREMAERK" placeholder="请填写联系人" />
							</uni-forms-item>
							<!-- 联系电话字段 -->
							<uni-forms-item label="联系电话" required>
								<uni-easyinput v-model="formData.FDRIVERPHONE" placeholder="请填写联系人电话号码" />
							</uni-forms-item>
							<view
								style="width: 160px;display: flex;position: relative;right: -50%;bottom: 0;height: 30px;">
								<view class="flex"
									style="width: 160px;height: 30px;display: flex;justify-content:center;align-items: center;">
									<button :plain='true'
										style="font-size: 15px; height: 30px;display: flex;justify-content: center;align-items: center;color: #1785FF;border: none;"
										open-type="getPhoneNumber" @getphonenumber="quikGetPhone">快速修改手机号码</button>
								</view>
							</view>
							<!--  -->
							<!--  -->
							
						</view>
					</uni-list>
				</uni-section>
			</view>
			<!--  -->
			<view class="my-card-box">
				<uni-section title="产品使用情况" type="line">
					<uni-list>
						<view style="padding: 5px;">

							<uni-forms-item label="使用类别" required style="padding-top: 10px;">
								<view @click="show4=true">
									<uni-easyinput v-model="Fproductclass" disabled placeholder="请选择使用类别" />
								</view>
							</uni-forms-item>
							<!-- {{Fproductclass  }}  {{ type }} -->
							<uni-forms-item label="发动机编号" :required="status == 'Service_station'" v-if=" producIndex !== '2' ">
								<view>
									<uni-easyinput v-model="formData.FPOWERNUMBER"  placeholder="请输入发动机编号" />
								</view>
							</uni-forms-item>
							<!-- 厂家名称 -->
							<uni-forms-item :label="getTile()" :required="status == 'Service_station'">
								<view>
									<uni-easyinput v-model="F_tesu_text" :placeholder="getTips()" />
								</view>
							</uni-forms-item>
							
							<!--  -->
							<!-- 购买日期字段 -->
							<uni-forms-item label="购买日期" style="padding: 0;" required>
								<uni-datetime-picker @custom='custom' :end='new Date().getTime()'
									:placeholder="getDateLabel()" type="date" :clearIcon="false"
									@dateConfirm='dateConfirm' v-model="formData.FPURCHASEDATA" />
							</uni-forms-item>
							
							
							<uni-forms-item label="购买凭证" :required="status == 'Service_station'">
								<view class="img-box" style="display: flex;">
									<u-upload class="img-box-cp" :fileList="fileList6" @afterRead="afterRead" @delete="deletePic"
										name="6" :multiple='true' :maxCount="3"></u-upload>
								</view>
							</uni-forms-item>
							 
							
							<!--  -->
							<!-- 车辆用途字段 -->
							<uni-forms-item label="用途" required>
								<view @click="showAssistant">
									<uni-easyinput v-model="formData.FVEHICLEPURPOSE" disabled placeholder="请选择" />
								</view>
							</uni-forms-item>
							
							<!-- 行驶里程/运转时长字段 -->
							<view class="" v-if=" customInfo == 'after' ">
								<uni-forms-item   :label="carType>1?'运转时长':'行驶里程'"  required  v-if="producIndex !== '1' && producIndex !== '2' "> 
									<u-input class="w100" placeholder="请输入" v-model="formData.F_DRIVINGCOM_H"  suffixIconStyle="color: #909399">
										<template slot="suffix"> {{carType>1?'【 小时 】':'【 公里 】'}} </template> 
									</u-input> 
								</uni-forms-item> 
								
								<!-- 配件或零售发动机时：显示运转时长(carType>1)则非必填，显示行驶里程(carType<=1)则必填 -->
								<uni-forms-item  :label="carType>1?'运转时长':'行驶里程'" :required="carType <= 1" v-if="producIndex== '1' || producIndex== '2' "> 
									<u-input class="w100" placeholder="请输入" v-model="formData.F_DRIVINGCOM_H"  suffixIconStyle="color: #909399">
										<template slot="suffix"> {{carType>1?'【 小时 】':'【 公里 】'}} </template> 
									</u-input> 
								</uni-forms-item>
							</view>
							 
							
							<!--  -->
							<!-- 产品图片字段 -->
							<uni-forms-item label="产品图片" :required="status == 'Service_station'">
								<view class="img-box">
									<u-upload class="img-box-cp" :fileList="fileList1" @afterRead="afterRead"
										@delete="deletePic" name="1" :multiple='true' :maxCount="3"></u-upload>
									<text style="font-size: 12px;margin-bottom: 5px;">请上传产品外观及标识图片</text>
								</view>
							</uni-forms-item>
							<!--  -->
							<!--  -->
							<!--  -->
						</view></uni-list>
					</uni-section>
				</view>
				<!--  -->
				<!--  -->
				<!--  -->
				<view class="my-card-box">
					<uni-section title="产品信息" type="line">
						<uni-list><view style="padding: 5px;">
							 
							<!-- 多个产品tabs切换 -->
							<view style="border:1px solid #ececec; padding: 5px;">
								<u-tabs :list="list2" itemStyle="font-size:18px;height:30px" :current='currentIndex'
									@change='prodChange'>
									<view slot="right"
										style="padding-left: 4px;display: flex;width: 70px;justify-content: space-between;">
										<!-- <u-icon name="close" size="20" bold @tap="descrementPro"></u-icon> -->
										<u-icon name="plus" size="20" bold @tap="addProd"></u-icon>
										<u-icon name="trash" size="28" color="#fa3534" bold @tap="descrementPro">
										</u-icon>
									</view>
								</u-tabs>
							</view>
							<!-- 选择产品组件 -->
							<view v-for="(item,index) in list2" :key='item.id'>
								<chooseProd @choose='changeBadge' ref='choosecmp' :MaterialList='MaterialList' :keyProd="keyProd" :key="keyProd"
									v-show="currentIndex == index" />
							</view>
							 
							<!--  -->
							<!--  -->
						</view>
					</uni-list>
				</uni-section>
			</view>
			<!--  -->
			<!--  -->
			<!--  -->
			<view class="line-h"></view>
			<!-- 维修方式字段 -->

			<view class="my-card-box">
				<uni-section title="服务信息" type="line">
					<uni-list>
						<view style="padding: 5px;">
							<uni-forms-item label="服务方式" required>
								<u-radio-group v-model="radiovalue1" placement="row"  @change="groupChange" 
									style="display: flex;align-items: center;justify-content: space-around;">
									<u-radio :customStyle="{marginBottom: '11px',marginLeft:'20px',marginTop:'10px'}"
										v-for="(item, index) in radiolist1" :key="index" :label="item.name"
										:name="item.name">
									</u-radio>
								</u-radio-group>

							</uni-forms-item>
							 
							<!--  -->
							<!-- 服务站点字段 -->
							<uni-forms-item label="服务站点" v-if="radiovalue1=='到服务站维修' && status !== 'Service_station'"
								:required="status == 'Service_station'">
								<view @click='showSuppler'>
									<uni-easyinput v-model="formData.FSERVICESTATION" disabled placeholder="选择服务站" />
								</view>
							</uni-forms-item>


							<uni-forms-item label="服务站点" v-if="radiovalue1=='到服务站维修' && status == 'Service_station'">
								<view>
									<uni-easyinput v-model="formData.FSERVICESTATION" disabled placeholder="选择服务站" />
								</view>
							</uni-forms-item>
							 
							<!-- 故障地点字段 -->
							<uni-forms-item label="故障地点" v-if="radiovalue1=='上门维修' " required>
								<!-- <uni-easyinput v-model="formData.FREPAIRSITE" placeholder="请输入故障地点" /> -->
								<u--textarea v-model="formData.FREPAIRSITE" :maxlength='-1' placeholder="请填写故障地点"></u--textarea>
							</uni-forms-item>

							<view style="width:100%;height: 30px;">

								<view style="width: 110px;display: flex; float: right; bottom: 0px;height: 30px;"
									v-if="radiovalue1=='上门维修' ">
									 

									<view class="flex"
										style="width: 110px;height: 30px;display: flex;justify-content:center;align-items: center;">
										<button :plain='true'
											style="font-size: 15px; height: 30px;display: flex;justify-content: center;align-items: center;color: #1785FF;border: none;"
											  @click="chooseLocation">地图上选择</button>
									</view>

								</view>
							</view>


							<!-- 故障描述字段 -->
							<!--  -->
							<!--  -->
							<uni-forms-item label="故障时间" style="padding: 0;" required>
								<uni-datetime-picker type="datetime" :end='new Date().getTime()' placeholder="故障时间" :showSale="false" v-model="formData.FERRDATE" />
							</uni-forms-item>
							<!--  -->
							<uni-forms-item label="故障描述" required>
								<uni-easyinput type="textarea" v-model="formData.FGUZHANINFO" placeholder="请描述产品造成的故障现象，如无力、冒黑烟、不好启动。" />
							</uni-forms-item>
							<uni-forms-item label="故障图片" :required="status == 'Service_station'">
								<view class="img-box" style="display: flex;">
									<u-upload class="img-box-cp" :fileList="fileList4" @afterRead="afterRead"
										@delete="deletePic" name="4" :multiple='true' :maxCount="3"></u-upload>
								</view>
							</uni-forms-item>
							<uni-forms-item label="故障视频">
								<u-upload class="img-box-cp" :previewFullImage='false' @click.native="preVideo"
									:useBeforeRead='true' @clickPreview='preVideo' uploadText='故障视频' accept="video"
									:fileList="fileList5" @afterRead="afterRead" @delete="deletePic"
									@beforeRead='beforeReadHandler' name="5" :multiple='false' :maxCount="1">
										 
									</u-upload>
							</uni-forms-item>

							<u-popup :show="show6" :round="10" mode="center" @close="videoclose">
								<view class="" style="display: flex;justify-content: center;align-items: center;">
									<video :src="fileList5[0].url" ref='video' controls></video>
								</view>
							</u-popup>
						</view>
					</uni-list>
				</uni-section>
			</view>
		</uni-forms>

		<view 
			style="display: flex;justify-content: space-around; position: fixed;top: 90%;z-index: 10;width: calc(100% - 30px);border:1px solid #169BD5;border-radius:6px">
			<!-- 保存按钮 -->
			<view class="btn" @click="saveBtn('A')"
				style="width: 50%;height: 35px;background-color: #FFFFFF;color: black;border-radius: 5px;display: flex;justify-content: center;align-items: center;">
				保存
			</view>
			<!-- 提交按钮 -->
			<view @click="saveBtn('B')" class="btn"
				style="width: 50%;height: 35px;background-color: #169BD5;color: #fff;border-radius: 5px;display: flex;justify-content: center;align-items: center;">
				提交
			</view>
		</view>
		<!-- 报修单信息不完整提示 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="dialog" title="通知" content="确定报修单信息已填写完整!" @confirm="dialogConfirm"
				@close="dialogClose"></uni-popup-dialog>
		</uni-popup>

		<!-- 服务站选择框 -->
		<u-picker :show="show" :closeOnClickOverlay='true' @cancel='show=false' @close='show=false'
			@confirm='supplierConfirm' :columns="supplierlist" keyName="name"></u-picker>

		<!-- 车辆用途选择框 -->
		<u-picker :show="show1" :closeOnClickOverlay='true' @cancel='show1=false' @close='show1=false'
			@confirm='AssistantDataConfirm' :columns="SelectAssistantDataList" keyName="FDataValue"></u-picker>

		<!-- 删除确认 -->
		<u-modal :show="show2" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="deletConfitm()"
			:title="'确认是否删除产品' + (currentIndex+1)" @cancel="show2=false" @close="show2=false"></u-modal>

		<!-- 删除凭证 -->
		<u-modal :show="show3" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="deletBuyImg()"
			title="确认是否删除购买凭证" @cancel="show3=false" @close="show3=false"></u-modal>

		<!-- 产品类别选择器 -->
		<u-picker :show="show4" :closeOnClickOverlay='true' @cancel='show4=false' @close='show4=false'
			@confirm='TypeConfirm' :columns="typeList" keyName="Fname"></u-picker>
			
		<!-- 保存确认 -->
		<u-modal :show="showModel" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="commit()"
			:title="'确认提交'" @cancel="showModel=false" @close="showModel=false"></u-modal>
		
		
	</view>
</template>
<script>
	import chooseProd from '@/components/common/chooseProd.vue'
	import {
		debounce
	} from '@/common/SDK/tools/index.js'
	export default {
		components: {
			chooseProd
		},
		data() {
			return {
				keyProd:'keyProd1',
				showModel:false,
				status: 'Customer', // 用户类别 默认是司机
				isUpdate: false, // 控制是否正在提交
				onShowNow:false, //页面显示
				documentType: '', // A保存  或者 B提交
				formData: {
					"FOWNER": '',
					"FDocumentStatus": 'A',
					"FOWNERPHONE": '', //车主电话
					"Fdriver": '', //司机
					"FDRIVERPHONE": '', //司机电话
					"FVEHICLEPURPOSE": '', //车辆用途
					"F_DRIVINGCOM_H": '', //行驶公司/运转时长
					"FPURCHASEDATA": '', //购买日期
					"FSERVICESTATION": '', //服务站点
					"FREPAIRSITE": '', //故障地点
					"FGUZHANINFO": '',
					'FERRORDESC': '', //故障描述
					"FUSERADDRESS": '', //用户地址
					"FUSER": '', //用户单位
					"FileFIDS": [], //图片FID
					"FLongitude_latitude": '',
					"FPOWERNUMBER":'',
					"FERRDATE":''
				},
				fileList1: [], // 上传产品标识图片数组
				fileList4: [], // 上传故障图片数组
				fileList5: [], // 上传故障视频数组
				fileList6: [], // 上传购买凭证数组
				prodImg: [], //产品图片接口返回数据
				errImg: [], // 故障图片接口返回数据
				previewUrl: [], // 预览购买凭证接口url地址
				previewData: [], // 购买凭证接口返回数据
				video: [], // 视频接口返回数据
				show: false, //控制服务站显示
				show1: false, //控制车辆用途显示
				show2: false, //删除产品提醒
				show3: false, //删除购买凭证提示
				show4: false, //产品类别
				show6: false, //显示视频弹窗 
				astatus:false, //服务站信息获取情况
				astatus1:false,//车辆用途信息获取情况
				MaterialList: [], // 选择产品列表大类
				supplierlist: null, //服务站数组列表
				FSERVICESTATIONnumber: '', // 选择的服务站的Fnumber
				SelectAssistantDataList: null, // 车辆用途数组
				SelectAssistantDataListnumber: '', // 选择的车辆用途的Fnumber
				carType: 0, //车辆用途index
				radiovalue1: '到服务站维修', // 维修分类111
				FRCHECKHOME: '0', //  是否上门维修
				radiolist1: [{
						name: '到服务站维修',
						disabled: false
					},
					{
						name: '上门维修',
						disabled: false
					}
				], // radioGroup列表
				list2: [{
					name: '产品1',
					badge: {
						isDot: true
					}
				}], // 产品名字列表  isDot控制红点显示
				currentIndex: 0, // 显示选择产品第几个
				id: 0, //产品id
				customInfo: 'after', //售前售后
				Fproductclass: '', //产品类别
				F_tesu_text: '', // 根据产品类别返回   厂家 || 服务商
				typeList: [
					[{
						Fname: '整车(整机)'
					}, {
						Fname: '零售发动机'
					}, {
						Fname: '配件'
					}]
				], //产品类别数组
				producIndex: 0 + '', //产品类别index
				FID: '', //!!!
				FBillNo: '', // 工单编号
				isDraft: false ,// 是否为草稿数据
				draftId: '',     // 当前草稿的唯一ID
				saveTime: null,  // 当前草稿的保存时间戳
			};
		},
		onShow() {
			this.$Recipe.checkLogin(true);
		},
		/**
		 * 获取用户类型  昵称 和 电话 默认绑定到页面上 
		 */
		async onLoad(option) {
			this.onShowNow = false ;
			uni.showLoading();
			this.defaultValue()
			const value = uni.getStorageSync('customertype');
			this.status = value
			
			// 检查是否是草稿数据
			if (option.obj) {
				const obj = JSON.parse(decodeURIComponent(option.obj))
				
				// 如果是草稿数据
				if (obj.isDraft && obj.draftData) {
				            this.isDraft = true
				            // 保存原始的草稿ID和时间戳用于后续匹配
				            this.originalDraftId = obj.draftId || obj.FBillNo
				            this.saveTime = obj.saveTime || obj.draftData.saveTime
				            
				            await this.loadDraftData(obj.draftData)
				            this.onShowNow = true;
				            uni.hideLoading()
				            return
				        }
				// 原有的服务器数据加载逻辑
				this.FID = obj.FID;
				const result = await this.$Recipe.getSelectRepairReportByFBillNo({
					FBillNo: obj.FBillNo
				})

				let _info = result.data[0];

				_info.FGUZHANINFOLIST = [];
				_info.WXQKIMAGE = []; //维修情况图片
				_info.WXQKVideo = []; //维修情况视频
				_info.GMPZ = []; 	//购买凭证
				 
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
				console.log(22222222222,_info)
				////故障图片 
				_info.ERRORIMG = _info.FGUZHANINFOLIST;
				this.FBillNo = obj.FBillNo
				Object.keys(this.formData).forEach(key => {
					this.formData[key] = result.data[0][key];
				})
				
				this.formData.FOWNER = ''
				this.formData.FDocumentStatus = 'A'
				this.formData.FileFIDS = []
				this.formData.F_USERREMAERK = result.data[0].F_USERREMAERK.trim();
				this.formData.FLongitude_latitude = result.data[0].FLongitude_latitude ? result.data[0].FLongitude_latitude : ''
				this.formData.FUSER = this.formData.FUSER==' '?'':this.formData.FUSER 
				this.formData.FUSERADDRESS = this.formData.FUSERADDRESS==' '?'':this.formData.FUSERADDRESS 
				this.formData.F_tesu_text = this.formData.F_tesu_text==' '?'':this.formData.F_tesu_text 
				this.formData.FGUZHANINFO = this.formData.FGUZHANINFO==' '?'':this.formData.FGUZHANINFO 
				this.formData.F_DRIVINGCOM_H = this.formData.F_DRIVINGCOM_H==' '?'':this.formData.F_DRIVINGCOM_H   
				    result.data = result.data.map(item => {
					return item
				})

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
				//故障图片
				if (_info.FGUZHANINFOLIST && _info.FGUZHANINFOLIST.length > 0) {
					_info.FGUZHANINFOLIST.forEach(item => {
						let obj = {
							url: item.FattachmentName,
							FID: item.FID,
							type: 'image',
							status: 'success',
							thumb: item.FattachmentName
						}
						this.fileList4.push(obj)
						this.errImg.push({
							FID: item.FID
						})
					})
				}
				//故障视频
				if (_info.video && _info.video.length > 0) {
					_info.video.forEach(item => {
						let obj = {
							url: item.FattachmentName,
							FID: item.FID,
							type: 'video',
							status: 'success',
							thumb: '../../../static/mp4.jpeg',
							duration: 0,
							height: 0,
							size: 0
						}
						this.fileList5.push(obj)
						this.video.push({
							FID: item.FID
						})
					})
				} 
				if (result.data[0].FRCHECKHOME === " " || result.data[0].FRCHECKHOME === ""){
					this.radiovalue1 = "";
					this.FRCHECKHOME = ""
				}
				 
				// 上门维修
				if (result.data[0].FRCHECKHOME === "1") {
					this.radiovalue1 = '上门维修';
					if(_info.FREPAIRSITE == ' ')_info.FREPAIRSITE = '';
					this.formData.FREPAIRSITE = _info.FREPAIRSITE
					this.FRCHECKHOME = "1"
				}

				// 服务站维修
				if (result.data[0].FRCHECKHOME === "0") {
					this.radiovalue1 = '到服务站维修';
					this.FRCHECKHOME = "0"
				}

				if (_info.FSERVICESTATION) {

					this.formData.FSERVICESTATION = _info.servicestationname;
					this.FSERVICESTATIONnumber = _info.FSERVICESTATION;
				} else {
					if (this.status == 'Service_station') {
						this.formData.FSERVICESTATION = uni.getStorageSync('stationName')
						this.FSERVICESTATIONnumber = uni.getStorageSync('userNumber')
					}
				}
	 
				if (result.data[0].FdownSALE == '2') {
					this.customInfo = 'after'
				} else {
					this.customInfo = 'before'
					this.$nextTick(() => {
						this.fileList6.splice(0)
						this.previewData.splice(0)
						this.previewUrl.splice(0)
					})
				}
				// this.formData.F_tesu_text = this.formData.F_tesu_text==' '?'':this.formData.F_tesu_text 
				this.F_tesu_text = result.data[0].F_tesu_text && result.data[0].F_tesu_text!==' ' ? result.data[0].F_tesu_text : '';
				this.producIndex = result.data[0].Fproductclass
				this.$nextTick(function() {
					this.Fproductclass = this.getproducType()
				})
				//购买凭证
				if (_info.GMPZ.length > 0) {
					_info.GMPZ.forEach(item => {
						let obj = {
							url: item.FattachmentName,
							FID: item.FID,
							type: 'image',
							status: 'success',
							thumb: item.FattachmentName
						}

						this.fileList6.push(obj)
						this.previewData.push({
							FID: item.FID
						})
						this.previewUrl.push(item.FattachmentName)
					})

				}
				let p = [];
				this.list2.splice(0);
				let Prodcuts = result.data[0].PRODUCT.Prodcuts;
				 
				if( Prodcuts.length ===0){
					this.list2 = [{
						name: '产品1',
						badge: {
							isDot: true
						}
					}] 
				}else{ 
					Prodcuts.map((item,index) => {
						console.log(111111111,Prodcuts)
						if (Prodcuts[0].data.length === 0 ) {
							this.list2 = [{
								name: '产品1',
								badge: {
									isDot: true
								}
							}]
						}else{
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
				}
			
	 
				const res = await this.$Recipe.getAssistantDataList()
				res.data.forEach((item, index) => {
					if (item.FDataValue == result.data[0].FVEHICLEPURPOSE) {
						this.carType = index
						this.formData.FVEHICLEPURPOSE = item.FDataValue
						this.SelectAssistantDataListnumber = item.Fnumber
					}
				})
				 
				const result3 = await this.$Recipe.getFuwuzhanxinxi({
					Fnumber: ''
				})
				result3.data.forEach(item => {
					if (item.FID == result.data[0].FSERVICESTATION) {
						this.formData.FSERVICESTATION = result.data[0].servicestationname
						this.FSERVICESTATIONnumber = item.Fnumber
					}
				})
			}
			
			this.onShowNow = true ; 
			uni.hideLoading()
		},
		/**
		 *  获取服务站列表     获取车辆用途列表    获取产品大类列表并穿给组件使用
		 */
		created() {
			this.getFuwuzhanxinxi()
			this.getAssistantDataList()
			this.getSelectMaterialList()
		},
		methods: {
			Giao() {
				const idd = this.getprodArr();
				 
			},
			quikGetPhone(e) {
				 
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					uni.login({
						provider: 'weixin',
						success: ({
							code
						}) => {
							let userCode = code;
							let data = {
								encryptedData: e.detail.encryptedData,
								IV: e.detail.iv,
								code: userCode
							}
							this.$Recipe.getTel(data).then((res) => {
								this.formData.FDRIVERPHONE = res.data
								if (!res.data) {
									this.$Recipe.toast('获取手机号失败,请重试')
								}
							})
						},
					});
				} else {
					this.$Recipe.toast('您已拒绝授权,请重试')
				}
			},
			chooseLocation() {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						uni.chooseLocation({
							latitude: res.latitude,
							longitude: res.longitude,
							success: (result) => {
								 
								this.formData.FREPAIRSITE = result.address
								this.formData.FLongitude_latitude = result.longitude + ',' + result
									.latitude
							}
						});
					}
				});
			},
			/**
			 * 默认数据
			 */
			defaultValue() {
				this.status = uni.getStorageSync('customertype');
				this.formData.FOWNERPHONE = uni.getStorageSync('phone');
				this.formData.FDRIVERPHONE = uni.getStorageSync('phone');
				this.formData.F_USERREMAERK = uni.getStorageSync('nickName');
				if (this.status == 'Service_station') {
					this.formData.FSERVICESTATION = uni.getStorageSync('stationName')
					this.FSERVICESTATIONnumber = uni.getStorageSync('userNumber')
				}
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
			 *  确定产品类别
			 */
			TypeConfirm(e) {
				this.Fproductclass = e.value[0].Fname
				this.producIndex = e.indexs[0] + ''
				this.show4 = false
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
			 * 获取日期的placeholder
			 */
			getDateLabel() {
				return this.customInfo == 'after' ? '购买日期' : '售前维修'
			},
			/**
			 * 日期确定
			 */
			dateConfirm() {
				this.customInfo = 'after'
			},
			/**
			 * 售前维修
			 */
			custom(e) {
				this.customInfo = 'before'
				this.formData.FPURCHASEDATA = ''
				this.formData.F_DRIVINGCOM_H = ''
				this.formData.FERRDATE = ''
				this.fileList6.splice(0)
				this.previewData.splice(0)
				this.previewUrl.splice(0)
			},
			/**
			 * 重置信息
			 */
			reset() {
				this.formData.FDRIVERPHONE = ''
				this.formData.FVEHICLEPURPOSE = ''
				this.formData.F_DRIVINGCOM_H = ''
				this.formData.FPURCHASEDATA = ''
				this.formData.FERRDATE = ''
				this.formData.FREPAIRSITE = ''
				this.formData.FGUZHANINFO = ''
				this.formData.FUSERADDRESS = ''
				this.formData.FPOWERNUMBER = ''
				this.formData.FUSER = ''
				this.formData.FLongitude_latitude = ''
				this.formData.FileFIDS.splice(0)
				this.fileList1.splice(0)
				this.fileList4.splice(0)
				this.fileList6.splice(0)
				this.fileList5.splice(0)
				this.video.splice(0)
				this.errImg.splice(0)
				this.previewUrl.splice(0)
				this.previewData.splice(0)
				this.prodImg.splice(0)

				this.customInfo = 'after',
					this.Fproductclass = '',
					this.F_tesu_text = '',
					this.producIndex = 0 + ''

				if (this.status == 'Customer') {
					this.formData.FSERVICESTATION = ''
					this.FSERVICESTATIONnumber = ''
				}
				this.SelectAssistantDataListnumber = ''
				this.$refs.choosecmp.forEach(item => {
					item.reset()
				})
				this.list2 = [{
					name: '产品1',
					id: 0,
					badge: {
						isDot: true
					}
				}]
				this.currentIndex = 0
				
				// 重置草稿相关标识
				this.FBillNo = ''
				this.FID = ''
				this.isDraft = false
			},

			/**
			 *  获取搜索或树形菜单的返回结果  
			 */
			getSearchReault(item) {
				this.$refs.choosecmp[this.currentIndex].formData.FORDERNO = item.Fname
				this.changeBadge()
			},
			/**
			 * 改变产品状态
			 */
			changeBadge() {
				this.$nextTick(() => {
					let current = this.$refs.choosecmp[this.currentIndex];
					if (this.status == 'Service_station') {
						if (current.MaterialListnumber != '' && current.formData.FORDERNO != '') {
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
			 * 获取产品信息
			 */
			getprodArr() {
				let arr = []
				let _this = this;
				let arrStatus = 0 
				console.log(222222222222,this.$refs.choosecmp)
				this.$refs.choosecmp.forEach(item => {
					let newArr = item.getObj().map(item2 => {
						if (this.documentType == 'B' && this.status == 'Service_station') {
							let text = ''
							if(!item2.FPRODUCTNO)text='产品编号缺失！'
							if(!item2.FORDERNO && _this.status == 'Service_station')text='订货号缺失！'
							if(!item2.MaterialListnumber)text='产品名称未选择！' 
							if (text != '') {
								arrStatus++
								uni.showToast({ icon: 'none', title: text })
								return
							}else{ 
								return {
									FPRODUCTNO: item2.FPRODUCTNO,
									FORDERNO: item2.FORDERNO,
									F_Assistant_01: item2.MaterialListnumber,
								} 
							}
						}else{
							return {
								FPRODUCTNO: item2.FPRODUCTNO,
								FORDERNO: item2.FORDERNO,
								F_Assistant_01: item2.MaterialListnumber,
							}
						}
					})
					 
					arr.push(...newArr)
				})
				 
				// return arr
				return [arr,arrStatus]
			},
			/**
			 * 切换产品
			 */
			prodChange(item) {
				this.currentIndex = item.index
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
			 * 添加产品
			 */
			addProd() {
				for (let i = 0; i < this.list2.length; i++) {
					if (this.list2[i].badge.isDot) {
						this.$Recipe.toast('请完善信息')
						return
					}
				}
				let number = this.list2.length + 1;
				this.id++
				this.list2.push({
					name: '产品' + number,
					id: this.id + 1,
					badge: {
						isDot: false,
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
			 *  服务站维修 或 上门维修 选择
			 */
			groupChange(e) {
				 
				if (e == '到服务站维修') {
					this.FRCHECKHOME = '0'
					if (this.status == 'Service_station') {
						this.formData.FSERVICESTATION = uni.getStorageSync('stationName')
						this.FSERVICESTATIONnumber = uni.getStorageSync('userNumber')
					}
				}
				if (e == '上门维修') {
					this.FRCHECKHOME = '1'
					if (this.status === "Service_station") {
						this.formData.FSERVICESTATION = uni.getStorageSync('stationName');
						this.FSERVICESTATIONnumber = uni.getStorageSync('userNumber');
					}
				}
			},
			/**
			 * 打开服务站选择
			 */
			showSuppler() {
				if (this.status != 'Customer') {
					return
				}
				if (!this.supplierlist || this.supplierlist[0].length == 0) {
					this.astatus = true
					this.getFuwuzhanxinxi()
				}else{
					this.show = true
				}
				
			},
			/**
			 * 打开车辆用途选择
			 */
			showAssistant() {
				if (!this.SelectAssistantDataList || this.SelectAssistantDataList[0].length == 0) {
					this.astatus1 = true
					this.getAssistantDataList() 
				}else{
					this.show1 = true
				} 
			},
			/**
			 * 车辆用途选择确定
			 */
			AssistantDataConfirm(e) {
				this.formData.FVEHICLEPURPOSE = e.value[0].FDataValue
				this.SelectAssistantDataListnumber = e.value[0].Fnumber
				this.carType = e.indexs[0]
				this.show1 = false
			},
			/**
			 * 服务站选择确定
			 */
			supplierConfirm(e) {
				this.formData.FSERVICESTATION = e.value[0].name
				this.FSERVICESTATIONnumber = e.value[0].Fnumber
				this.show = false
			},
			/**
			 * 获取服务站信息数组
			 */
			async getFuwuzhanxinxi() {
				const result = await this.$Recipe.getFuwuzhanxinxi()
				if (result.code == 200) {
					this.supplierlist = [result.data]
					if(this.astatus){
						this.show = true;
						this.astatus = false;
					}
				} else {
					if(this.astatus){ 
						this.astatus = false;
						uni.showToast({
							icon: 'none',
							title: '获取服务站信息失败,请重试'
						})
					}
				}
			},
			/**
			 * 获取车辆用途数组
			 */
			async getAssistantDataList() {
				const result = await this.$Recipe.getAssistantDataList()
				if (result.code == 200) {
					this.SelectAssistantDataList = [result.data]
					if(this.astatus1){
						this.show1 = true;
						this.astatus1 = false;
					}
				} else {
					if(this.astatus1){ 
						this.astatus1 = false;
						uni.showToast({
							icon: 'none',
							title: '获取服务站信息失败,请重试'
						})
					}
				}
			},
			/**
			 * 获取产品信息数组
			 */
			async getSelectMaterialList() {
				const result = await this.$Recipe.getSelectMaterialList()
				if (result.code == 200) {
					this.MaterialList = [result.data]
				} else {
					// uni.showToast({
					// 	icon: 'none',
					// 	title: '获取产品信息失败'
					// })
					
				}
			},
			/**
			 * 保存按钮 + 防抖
			 */
			saveBtn: debounce(async function(type) {
				this.documentType = type
				
				if (type == 'A') {
					// 保存到本地缓存
					await this.saveToLocalStorage()
					uni.showToast({
						icon: 'none',
						title: '保存到草稿成功'
					})
					// 跳转到工单页面
					uni.switchTab({
						url: '/pages/tabBar/report/index'
					})
				} else {
					// 提交逻辑保持不变
					if (!this.formData.FOWNERPHONE) {
						this.$refs.alertDialog.open()
						return
					}
					this.showModel = true
				}
			}, 1000),
			
			/**
			 * 保存报修单数据到本地缓存
			 */
			async saveToLocalStorage() {
			  try {
			    // 确定本次草稿的保存时间
			    const now = Date.now()
			    // 如果之前已经有 saveTime（从草稿进入编辑时会带上），则沿用；否则用当前时间
			    const saveTime = this.saveTime || now
			    this.saveTime = saveTime
			
			    
			    const draftId = this.draftId || `DRAFT-${saveTime}`
			    this.draftId = draftId
			
			    // 组装需要缓存的数据
			    const saveData = {
			      // 表单数据
			      formData: { ...this.formData },
			
			      // 各类附件
			      fileList1: [...this.fileList1],
			      fileList4: [...this.fileList4],
			      fileList5: [...this.fileList5],
			      fileList6: [...this.fileList6],
			      prodImg:   [...this.prodImg],
			      errImg:    [...this.errImg],
			      previewData: [...this.previewData],
			      video:     [...this.video],
			
			      // 其它状态字段
			      radiovalue1: this.radiovalue1,
			      FRCHECKHOME: this.FRCHECKHOME,
			      currentIndex: this.currentIndex,
			      customInfo:   this.customInfo,
			      Fproductclass: this.Fproductclass,
			      F_tesu_text:   this.F_tesu_text,
			      producIndex:   this.producIndex,
			      carType:       this.carType,
			      FSERVICESTATIONnumber:         this.FSERVICESTATIONnumber,
			      SelectAssistantDataListnumber: this.SelectAssistantDataListnumber,
			
			      // 产品tab、产品选择组件的数据
			      productsData: this.$refs.choosecmp
			        ? this.$refs.choosecmp.map(item =>
			            item.getSaveData
			              ? item.getSaveData()
			              : {
			                  formData: { ...item.formData },
			                  MaterialListnumber: item.MaterialListnumber,
			                  FPRODUCTNAME: item.FPRODUCTNAME,
			                  FPRODUCTNOLIST: item.FPRODUCTNOLIST
			                    ? [...item.FPRODUCTNOLIST]
			                    : [],
			                  FPRODUCTNONUMBER:
			                    item.FPRODUCTNONUMBER ||
			                    (item.FPRODUCTNOLIST
			                      ? item.FPRODUCTNOLIST.length
			                      : 1),
			                }
			          )
			        : [],
			      list2: [...this.list2],
			
			      // 关键标识
			      saveTime,       // 用来匹配删除草稿
			      draftId,        // 草稿ID
			      status: 'draft',
			      billtype: 'baoxiu', 
			    }
			
			    // 4. 读出本地已有草稿列表
			    let draftList = uni.getStorageSync('repairDrafts') || []
			
			    // 5. 如果已经存在同一个 draftId 或 saveTime 的草稿，先删掉，防止重复
			    draftList = draftList.filter(
			      d => d.draftId !== draftId && d.saveTime !== saveTime
			    )
			
			    // 6. 把当前草稿放到最前面
			    draftList.unshift(saveData)
			
			    // 7. 写回缓存
			    uni.setStorageSync('repairDrafts', draftList)
			
			    console.log('保存草稿成功:', {
			      draftId,
			      saveTime,
			      total: draftList.length
			    })
			  } catch (error) {
			    console.error('保存草稿失败:', error)
			    uni.showToast({
			      icon: 'none',
			      title: '保存草稿失败，请稍后重试'
			    })
			  }
			},
			/**
			 * 加载草稿数据
			 */
			loadDraftData(draftData) {
				// 恢复表单数据
				this.formData = {...draftData.formData}
				this.fileList1 = [...draftData.fileList1]
				this.fileList4 = [...draftData.fileList4]
				this.fileList5 = [...draftData.fileList5]
				this.fileList6 = [...draftData.fileList6]
				this.prodImg = [...draftData.prodImg]
				this.errImg = [...draftData.errImg]
				this.previewData = [...draftData.previewData]
				this.video = [...draftData.video]
				this.radiovalue1 = draftData.radiovalue1
				this.FRCHECKHOME = draftData.FRCHECKHOME
				this.currentIndex = draftData.currentIndex
				this.customInfo = draftData.customInfo
				this.Fproductclass = draftData.Fproductclass
				this.F_tesu_text = draftData.F_tesu_text
				this.producIndex = draftData.producIndex
				this.carType = draftData.carType
				this.FSERVICESTATIONnumber = draftData.FSERVICESTATIONnumber
				this.SelectAssistantDataListnumber = draftData.SelectAssistantDataListnumber
				this.list2 = [...draftData.list2]
				this.FBillNo = draftData.draftId // 设置草稿ID
				this.isDraft = true
				console.log('加载草稿数据，编号:', this.FBillNo)
				// 恢复产品数据
				this.$nextTick(() => {
					if (draftData.productsData && this.$refs.choosecmp) {
						draftData.productsData.forEach((productData, index) => {
							if (this.$refs.choosecmp[index]) {
								// 调用组件的方法来设置数据
								if (this.$refs.choosecmp[index].setDraftData) {
									this.$refs.choosecmp[index].setDraftData(productData)
								} else {
									// 直接赋值
									this.$refs.choosecmp[index].formData = {...productData.formData}
									this.$refs.choosecmp[index].MaterialListnumber = productData.MaterialListnumber
									this.$refs.choosecmp[index].FPRODUCTNAME = productData.FPRODUCTNAME
									// 恢复产品编号列表
									if (productData.FPRODUCTNOLIST && Array.isArray(productData.FPRODUCTNOLIST)) {
										this.$refs.choosecmp[index].FPRODUCTNOLIST = productData.FPRODUCTNOLIST.map(item => ({
											...item,
											id: item.id || new Date().getTime() + Math.random()
										}))
									} else {
										this.$refs.choosecmp[index].FPRODUCTNOLIST = [{
											FPRODUCTNO: '',
											id: new Date().getTime()
										}]
									}
									// 恢复产品编号数量
									this.$refs.choosecmp[index].FPRODUCTNONUMBER = productData.FPRODUCTNONUMBER || this.$refs.choosecmp[index].FPRODUCTNOLIST.length || 1
								}
								
							}
						})
					}
				})
			},
			
			dialogConfirm() {
				this.commit()
			},
			/**
			 * 服务站须填字段检查
			 */
		serviceCheck() {
			// 其他类别时，必填
			if (!this.formData.F_DRIVINGCOM_H && this.customInfo == 'after' && this.producIndex !== '1' && this.producIndex !== '2') {
				return this.carType > 1 ? '请填写运转时长' : '请填写行驶里程'
			}
			// 配件或零售发动机时：显示行驶里程(carType<=1)则必填，显示运转时长(carType>1)则非必填
			if (!this.formData.F_DRIVINGCOM_H && this.customInfo == 'after' && (this.producIndex == '1' || this.producIndex == '2') && this.carType <= 1) {
				return '请填写行驶里程'
			}
			if (this.fileList1.length == 0) {
				return '请上传产品图片'
			}
			if (this.fileList4.length == 0) {
				return '请上传故障图片'
			}
			return ''
		},
			/**
			 * 提交报修单
			 */
			async commit() {
				this.showModel = false
				if (this.isUpdate) {
					return
				}
				let flag = true
				this.$refs.choosecmp.forEach(item => {
					if (!item.formData.FPRODUCTNAME) {
						flag = false
					}
				})
				let flag4 = true
				if (this.status == 'Service_station') {
					this.$refs.choosecmp.forEach(item => {
						if (!item.formData.FORDERNO) {
							flag4 = false
						}
					})
				}
				if (this.documentType == 'B') {
					let text = '';
					if (!flag) {
						text = '请选择产品名称'
					}

					if (!flag4) {
						text = '请输入订货号'
					}

					if (!this.formData.F_USERREMAERK) {
						text = '请填写联系人'
					}
					if (!this.formData.FDRIVERPHONE) {
						text = '请填写联系人电话'
					}

					if (this.formData.FPURCHASEDATA == '' && this.customInfo == 'after') {
						text = '请填写购买日期'
					}
					if (this.formData.FVEHICLEPURPOSE == '') {
						text = '请选择车辆用途'
					}
					if (this.formData.FERRDATE == '') {
						text = '请填写故障时间'
					}
					if (this.formData.FGUZHANINFO == '') {
						text = '请填写故障描述'
					} 

					if (this.previewData.length == 0 && this.customInfo == 'after') {
						text = '请上传购买凭证'
						this.previewUrl.splice(0)
						this.fileList6.splice(0)
					}

					if (this.radiovalue1 == '上门维修' && !this.formData.FREPAIRSITE) {
						text = '请填写故障地点'
					}
					
					if( this.producIndex !== '2' && !this.formData.FPOWERNUMBER && this.status == 'Service_station'){ 
						text = '请输入发动机编号'
					}
					//售后 其他类别时，必填
					if (!this.formData.F_DRIVINGCOM_H && this.customInfo == 'after' && this.producIndex !== '1' && this.producIndex !== '2') {
						text = this.carType > 1 ? '请填写运转时长' : '请填写行驶里程'
					}
					// 配件或零售发动机时：显示行驶里程(carType<=1)则必填，显示运转时长(carType>1)则非必填
					if (!this.formData.F_DRIVINGCOM_H && this.customInfo == 'after' && (this.producIndex == '1' || this.producIndex == '2') && this.carType <= 1) {
						text = '请填写行驶里程'
					}
					
					// 数据验证：其他类别时，验证数据合法性
					if ((parseFloat(this.formData.F_DRIVINGCOM_H).toString() == "NaN" || !this.formData.F_DRIVINGCOM_H) && this.customInfo == 'after' && this.producIndex !== '1' && this.producIndex !== '2'){
						uni.showToast({
							icon: 'none',
							title: this.carType > 1 ? '运转时长' : '行驶里程'+'，数据非法或为空！'
						})
						return 
					}
					// 数据验证：配件或零售发动机且显示行驶里程时，验证数据合法性
					if ((parseFloat(this.formData.F_DRIVINGCOM_H).toString() == "NaN" || !this.formData.F_DRIVINGCOM_H) && this.customInfo == 'after' && (this.producIndex == '1' || this.producIndex == '2') && this.carType <= 1){
						uni.showToast({
							icon: 'none',
							title: '行驶里程，数据非法或为空！'
						})
						return 
					}
					
					if(this.FRCHECKHOME  !== '0' && this.FRCHECKHOME  !== '1' ){   //'到服务站维修'
						text = '请选择服务方式'
					}
					let text2 = text
					if (this.status == 'Service_station') {
						if (this.serviceCheck() != '') {
							text = this.serviceCheck()
						}
						if(this.F_tesu_text == ''){
							text = '请填写厂家信息'
						}
					}
					if (text != '') {
						uni.showToast({
							icon: 'none',
							title: text
						})
						return
					}
				}
				
				// 如果是草稿提交，先从缓存中删除草稿
				if (this.isDraft) {
				  let draftList = uni.getStorageSync('repairDrafts') || []
				  const beforeLen = draftList.length
				
				  draftList = draftList.filter(draft => draft.saveTime !== this.saveTime)
				
				  if (draftList.length < beforeLen) {
				    console.log('提交时删除草稿成功, saveTime =', this.saveTime)
				  } else {
				    console.log('未找到需要删除的草稿, saveTime =', this.saveTime, draftList)
				  }
				
				  uni.setStorageSync('repairDrafts', draftList)
				  this.isDraft = false
				  
				}
				
				if(this.FRCHECKHOME  == '0' ){   //'到服务站维修'
					this.formData.FREPAIRSITE = '';
				}
				
				if(this.status =='Customer' && this.FRCHECKHOME  !== '0' ){
					this.formData.FSERVICESTATION = '';
					this.FSERVICESTATIONnumber = '';
				}
				
				const arr = this.getprodArr()
				  
				if(arr[1]>0){
					this.showModel = false
					return  //判断产品信息是否完整
				}
				uni.showLoading({
					title: '正在保存'
				});
				let obj = {
					...this.formData
				}
				obj.FSERVICESTATION = this.FSERVICESTATIONnumber
				obj.FVEHICLEPURPOSE = this.SelectAssistantDataListnumber
				obj.FileFIDS.push(...this.prodImg, ...this.previewData, ...this.errImg.concat(this.video))
				let type = uni.getStorageSync('customertype') 
				obj.Fdriver = ''
				if (type == 'Customer') {
					let Fdriver = uni.getStorageSync('userNumber')
					obj.Fdriver = Fdriver
				}
				obj.FdownSALE = this.customInfo == 'after' ? '2' : '1'
				obj.entry = arr[0]
				if (this.documentType == 'A') {
					obj.FDocumentStatus = 'A'
				}
				if (this.documentType == 'B') {
					obj.FDocumentStatus = 'B'
				}

				let documentType = this.documentType
				obj.Fproductclass = this.producIndex + ''
				obj.F_tesu_text = this.F_tesu_text
				obj.FRCHECKHOME = this.FRCHECKHOME
				obj.FBillNo = ''
				 
				this.isUpdate = true
				// obj.FBillNo = this.FBillNo 
				// obj.FID = this.FID 
				
				console.log(obj)
				// debugger
				// return
				// if (this.documentType == 'B')return
				this.showModel = false
				const res = await this.$Recipe.InsertREPAIRREPORT(obj)
				console.log('编辑提交返回：', res)
				this.isUpdate = false
				uni.hideLoading()
				if (res?.msg == 'Success') {
					this.reset()
					uni.switchTab({
						url: '/pages/tabBar/report/index',
						success() {
							if (documentType == 'A') {
								uni.showToast({
									icon: 'none',
									title: '保存报修单成功'
								})
							} else {
								uni.showToast({
									icon: 'none',
									title: '提交报修单成功'
								})
							}
						}
					})
				} else {
					if (documentType == 'A') {
						uni.showToast({
							icon: 'none',
							title: '保存报修单失败,请重试'
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '提交报修单失败,请重试'
						})
					}
				}
			},

			/**
			 * 预览图片
			 */
			previewImg() {
				let _this = this
				 
				uni.previewImage({
					urls: _this.previewUrl,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							//console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							//console.log(err.errMsg);
						}
					}
				});
			},
			/**
			 * 清除购买凭证
			 */
			deletBuyImg() {
				this.fileList6.splice(0)
				this.previewData.splice(0)
				this.previewUrl.splice(0)
				this.show3 = false
			},
			/**
			 * 删除购买凭证确认框
			 */
			resetPreview() {
				this.show3 = true
			},
			/**
			 * 删除图片
			 */
			preVideo(url) {
				if (this.fileList5.length == 0 || this.video.length == 0) {
					return
				}
				this.show6 = true
			},
			videoclose() {
				this.show6 = false
			},
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
				if (event.name == '1') {
					this.prodImg.splice(event.index, 1)
				}
				if (event.name == '4') {
					this.errImg.splice(event.index, 1)
				}
				if (event.name == '5') {
					this.video.splice(event.index, 1)
				}
				if (event.name == '6') {
					this.previewData.splice(event.index, 1)
				}
				this.$Recipe.DeleteFile( {FID:event.file.FID})
				 
			},
			beforeReadHandler(file, lists, name) {},
			// 新增图片
			async afterRead(event) {
				this.isUpdate = true
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
					let result
					try {
						result = await this.uploadFilePromise(lists[i].url, event.name)

					} catch (e) {
						 
					}
					try {
						JSON.parse(result).data.FID
					} catch (e) {
						 
						uni.showToast({
							icon: 'none',
							title: '文件上传失败'
						})
						this[`fileList${event.name}`].splice(fileListLen, 1)
						return
						
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
					this.prodImg.splice(0)
				}
				if (event.name == '4') {
					this.errImg.splice(0)
				}
				if (event.name == '5') {
					this.video.splice(0)
				}
				if (event.name == '6') {
					this.previewData.splice(0)
				}
				this[`fileList${event.name}`].forEach(item => {
					let obj = {
						"FID": item.FID
					}
					if (event.name == '1') {
						this.prodImg.push(obj)
					}
					if (event.name == '4') {
						this.errImg.push(obj)
					}
					if (event.name == '5') {
						this.video.push(obj)
					}
					if (event.name == '6') {
						this.previewData.push(obj)
					}
				})
				this.isUpdate = false
				 
			},
			uploadFilePromise(url, number) {
				let _this = this ; 
				let type = '';
				let Uploadurl = 'https://cy.klwsxx.com/File/FileUpload';
				if(number == '1')type = 'BXYMSC_CPTP';
				if(number == '4')type = 'BXYMSC_GZTP';
				if(number == '5')type = 'BXYMSC_GZSP'; 
				if(number == '6')type = 'BXYMSC_GMPZ'; 
				 
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: Uploadurl,
						filePath: url,
						formData: {
							type: type,
						},
						name: 'FileName',
						success: (res) => {
							_this.previewUrl = [url]
							 
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
		}
	};
</script>

<style lang="scss" scoped>
	.add-box {
		padding: 5px;
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

	.my-card-box {
		margin: 5px;
		padding: 5px;
		background-color: #fff;
		box-shadow: 0 4rpx 8rpx 0 #e3eef5;
		border-radius: 10rpx;
		border: 4rpx solid #e3eef5;
	}
</style>
<template>
	<view class="add-box" style="position: relative;padding-bottom: 110rpx;">

		<uni-forms ref="baseForm" :modelValue="formData">
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
								<uni-easyinput v-model="formData.FOWNERPHONE" placeholder=" 请填写用户电话号码" />

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
								<uni-easyinput v-model="formData.FDRIVERPHONE" type="tel" placeholder="请填写联系人电话号码" />

							</uni-forms-item>
							<view
								style="width: 160px;display: flex;position: relative;right: -57%;bottom: 0;height: 30px;">
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
			<!--  -->
			<!-- {{Fproductclass}} {{producIndex}} -->
			<view class="my-card-box">
				<uni-section title="产品使用情况" type="line">
					<uni-list>
						<view style="padding: 5px;">

							<uni-forms-item label="使用类别" required style="padding-top: 10px;">
								<view @click="show4=true;uni.hideKeyboard();">
									<uni-easyinput v-model="Fproductclass" disabled placeholder="请选择使用类别" />
								</view>
							</uni-forms-item>
							<!-- 厂家名称 -->
							<uni-forms-item label="发动机编号" :required="status == 'Service_station'"
								v-if=" producIndex !=='2' ">
								<view>
									<uni-easyinput v-model=" formData.FPOWERNUMBER" placeholder="请输入发动机编号" />
								</view>
							</uni-forms-item>
							<uni-forms-item :label="getTile()" :required="status == 'Service_station'">
								<view>
									<uni-easyinput v-model="F_tesu_text" :placeholder="getTips()" />
								</view>
							</uni-forms-item>


							<!--  -->
							<!-- 购买日期字段 -->
							<uni-forms-item label="购买日期" style="padding: 0;" required>
								<uni-datetime-picker @custom='custom' :end='new Date().getTime()'
									:placeholder="getDateLabel()" class="uni_datetime_picker" type="date"
									:clearIcon="false" @dateConfirm='dateConfirm' v-model="formData.FPURCHASEDATA" />
							</uni-forms-item>

							<uni-forms-item label="购买凭证" :required="status == 'Service_station'">
								<view class=" img-box" style="display: flex;">
									<u-upload class="img-box-cp" :fileList="fileList6" @afterRead="afterRead"
										@delete="deletePic" name="6" :multiple='true' :maxCount="3"></u-upload>
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
							<uni-forms-item :label="carType>1?'运转时长':'行驶里程'" required v-if="producIndex !== '1' && producIndex !== '2' ">
								<u-input class="w100" type="number" :adjust-position="false" placeholder="请输入"
									v-model="formData.F_DRIVINGCOM_H" suffixIconStyle="color: #909399">
									<template slot="suffix"> {{carType>1?'【 小时 】':'【 公里 】'}} </template>
								</u-input>
							</uni-forms-item>

							<!-- 配件或零售发动机时：显示运转时长(carType>1)则非必填，显示行驶里程(carType<=1)则必填 -->
							<uni-forms-item :label="carType>1?'运转时长':'行驶里程'" :required="carType <= 1" v-if="producIndex== '1' || producIndex== '2' ">
									<u-input class="w100" type="number" :adjust-position="false" placeholder="请输入"
										v-model="formData.F_DRIVINGCOM_H" suffixIconStyle="color: #909399">
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
								</view>
								<text style="font-size: 12px;margin-bottom: 5px;">请上传产品外观及标识图片</text>
							</uni-forms-item>

						</view>
					</uni-list>
				</uni-section>
			</view>
			<!--  -->
			<!--  -->
			<!--  -->
			<view class="my-card-box">
				<uni-section title="产品信息" type="line">
					<uni-list>
						<view style="padding: 5px;">


							<!-- 多个产品tabs切换 -->
							<view style="border:1px solid #ececec; padding: 5px;">
								<u-tabs :list="list2" itemStyle="font-size:18px;height:30px" :current='currentIndex'
									@change='prodChange'>
									<view slot="right"
										style="padding: 4px;display: flex;width:70px;justify-content: space-between;">
										<u-icon name="plus" size="20" bold @tap="addProd"></u-icon>
										<u-icon name="trash" size="28" color="#fa3534" bold
											@tap="descrementPro"></u-icon>
									</view>
								</u-tabs>
							</view>

							<!-- 选择产品组件 -->
							<view v-for="(item,index) in list2" :key='item.id'>
								<chooseProd @choose='changeBadge' ref='choosecmp' :keyProd="keyProd" :key="keyProd"
									:MaterialList='MaterialList' v-show="currentIndex == index" />
							</view>
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
								<u-radio-group v-model="radiovalue1" @change="groupChange"
									style="display: flex;align-items: center;justify-content: space-around;">
									<u-radio :customStyle="{marginBottom: '11px',marginLeft:'20px',marginTop:'10px'}"
										v-for="(item, index) in radiolist1" :key="index" :label="item.name"
										:name="item.name">
									</u-radio>
								</u-radio-group>

							</uni-forms-item>
							<!--  -->
							<!--  -->
							<!--  -->
							<!-- 服务站点字段 -->
							<uni-forms-item label="服务站点" v-if="radiovalue1=='到服务站维修' && status != 'Service_station'"
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

							<uni-forms-item label="故障地点" v-if="radiovalue1=='上门维修' " required>
								<!-- <uni-easyinput v-model="formData.FREPAIRSITE" placeholder="请输入故障地点" /> -->
								<u--textarea v-model="formData.FREPAIRSITE" :maxlength='-1'
									placeholder="请填写故障地点,地址写详细,落实到乡镇村或道路门牌号"></u--textarea>
							</uni-forms-item>

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
					</uni-list>
				</uni-section>
			</view>

			<!-- 故障地点字段 -->

			<view class="my-card-box">
				<uni-section title="故障信息" type="line">
					<uni-list>
						<view style="padding: 5px;">


							<!-- 故障描述字段 -->
							<!--  -->
							<!--  -->
							<!--  -->
							<!-- 购买日期字段 -->
							<uni-forms-item label="故障时间" style="padding: 0;" required>
								<uni-datetime-picker type="datetime" :end='new Date().getTime()' placeholder="故障时间"
									:showSale="false" v-model="formData.FERRDATE" @change="changeLog" />
							</uni-forms-item>

							<uni-forms-item label="故障描述" required>
								<uni-easyinput type="textarea" v-model="formData.FGUZHANINFO"
									placeholder="请描述产品造成的故障现象，如无力、冒黑烟、不好启动。" />
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
									@beforeRead='beforeReadHandler' name="5" :multiple='false' :maxCount="1"></u-upload>
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

		<view class="save-btn" style="display: flex;justify-content: space-around; position: fixed;
			bottom: 120rpx;background-color: #fff;
			z-index: 10;width: 100%;border:1px solid #169BD5;border-radius:6px">
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

		<!-- 产品类别（使用类别）选择器 -->
		<u-picker :show="show4" :closeOnClickOverlay='true' @cancel='show4=false' @close='show4=false'
			@confirm='TypeConfirm' :columns="typeList" keyName="Fname"></u-picker>

		<!-- 保存确认 -->
		<u-modal :show="show5" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="commit()" :title="'确认提交'"
			@cancel="show5=false" @close="show5=false"></u-modal>

		<!-- 重新登录 -->
		<u-modal :show="showLoginOut" :closeOnClickOverlay="false" :showCancelButton="false" @confirm="showLoginPage()"
			:title="'当前登录身份已失效，请重新登录'" @cancel="showLoginOut=false" @close="showLoginOut=false"></u-modal>

		<view style="width: 100%;height: 50px;"> </view>
		<tab-bar @tab='tab' :current='1'></tab-bar>
	</view>
</template>
<script>
	let _self;
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
				status: 'Customer', // 用户类别 默认是司机
				isUpdate: false, // 控制是否正在提交
				documentType: '', // A保存  或者 B提交
				keyProd: new Date().getTime(),
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
					"FERRDATE": '' //故障时间
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
				show4: false, //产品类别（使用类别)
				show5: false, //保存提交
				show6: false, //显示视频弹窗
				showLoginOut: false, //重新登录
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
				Fproductclass: '', //产品类别（使用类别)
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
				producIndex: 0 + '' //产品类别index
			};
		},
		watch: {
			radiovalue1: function(n) {
				if (n == '到服务站维修') {
					if (this.status == 'Service_station') {
						this.formData.FSERVICESTATION = uni.getStorageSync('stationName')
						this.FSERVICESTATIONnumber = uni.getStorageSync('userNumber')
					}
				}
			},
		},


		/**
		 * 获取用户类型  昵称 和 电话 默认绑定到页面上 
		 */
		onLoad() {
			uni.login({
				provider: 'weixin',
				success: ({
					code
				}) => {},
			});
			console.log(this.formData)
			this.defaultValue()
		},

		onShow() {
			uni.hideTabBar();
			this.$Recipe.checkLogin(true);
			try {
				this.getMiniUser();
			} catch (e) {
			}

		},
		/**
		 *  获取服务站列表     获取车辆用途列表    获取产品大类列表并穿给组件使用
		 */
		created() {
			_self = this;
			this.getFuwuzhanxinxi()
			this.getAssistantDataList()
			this.getSelectMaterialList()
			uni.$on('reSetPage', data => {
				console.log('a组件传来的数据：@1', data)
				_self.keyProd = new Date().getTime();
			})
		},
		methods: {
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
				let _this = this;
				uni.getSystemInfo({
					success({
						locationEnabled,
						locationAuthorized
					}) {
						// locationEnabled 判断手机定位服务是否开启
						// locationAuthorized 判断定位服务是否允许微信授权
						if (!locationEnabled && !locationAuthorized) {
							// GPS未开启 与 GPS未给微信授权定位服务
							_this.$Recipe.toast(' GPS定位服务未开启')
						} else if (locationEnabled && !locationAuthorized) {
							// GPS已开启 与 GPS未给微信授权定位服务
							_this.$Recipe.toast(' GPS未授权定位服务')
						} else if (locationEnabled && locationAuthorized) {
							/* 
								GPS已开启 与 GPS已给微信授权定位服务
								判断微信小程序位置信息是否开启
							*/
							uni.authorize({
								scope: "scope.userLocation",
								success() {
									// 微信小程序位置信息已开启 
									uni.getLocation({
										type: 'wgs84',
										success: (res) => {

											uni.chooseLocation({
												latitude: res.latitude,
												longitude: res.longitude,
												success: (result) => {
													_this.formData.FREPAIRSITE =
														result.address
													_this.formData
														.FLongitude_latitude =
														result.longitude + ',' +
														result
														.latitude
												}
											});
										},
										fail: (err) => {
											_this.$Recipe.toast('位置信息未开启,请打开小程序 设置-位置信息')
										}
									});
								},
								fail() {
									// 微信小程序位置信息未开启
									_this.$Recipe.toast('位置信息未开启,请打开小程序 设置-位置信息')
								}
							})
						}
					},
					fail(err) {

					}
				})
			},
			/**
			 * 默认数据
			 */
			defaultValue() {
				this.status = uni.getStorageSync('customertype');
				// this.formData.FOWNERPHONE = uni.getStorageSync('phone');
				// this.formData.FDRIVERPHONE = uni.getStorageSync('phone');
				// this.formData.F_USERREMAERK = uni.getStorageSync('nickName');
				if (this.status == 'Service_station') {
					this.formData.FSERVICESTATION = uni.getStorageSync('stationName')
					this.FSERVICESTATIONnumber = uni.getStorageSync('userNumber')
				}
				if (this.status == 'Customer') {
					this.formData.FSERVICESTATION = ''
					this.FSERVICESTATIONnumber = ''
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
			 *  确定产品类别（使用类别）
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
				return `请输入一级${this.getTile()}名称`
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
						return '经销商/中心库';
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

			changeLog(e) {
				console.log(1111, e)
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
				this.$refs.choosecmp.forEach(item => {
					let newArr = item.getObj().map(item2 => {

						if (this.documentType == 'B' && this.status == 'Service_station') {
							let text = ''
							if (!item2.FPRODUCTNO) text = '产品编号缺失！'
							if (!item2.FORDERNO && _this.status == 'Service_station') text = '订货号缺失！'
							if (!item2.MaterialListnumber) text = '产品名称未选择！'
							if (text != '') {
								arrStatus++
								uni.showToast({
									icon: 'none',
									title: text
								})
								return
							} else {
								return {
									FPRODUCTNO: item2.FPRODUCTNO,
									FORDERNO: item2.FORDERNO,
									F_Assistant_01: item2.MaterialListnumber,
								}
							}
						} else {
							return {
								FPRODUCTNO: item2.FPRODUCTNO,
								FORDERNO: item2.FORDERNO,
								F_Assistant_01: item2.MaterialListnumber,
							}
						}
					})

					arr.push(...newArr)
				})

				return [arr, arrStatus]
			},
			getprodArr1() {
				let arr = []
				this.$refs.choosecmp.forEach(item => {

					let obj = item.getObj();

					return;
					let newobj = {
						FPRODUCTNO: obj.FPRODUCTNO,
						FORDERNO: obj.FORDERNO,
						F_Assistant_01: obj.MaterialListnumber,
					}
					arr.push(newobj)
				});

				return arr
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
					} else {
						this.formData.FSERVICESTATION = '';
						this.FSERVICESTATIONnumber = '';
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
					this.getFuwuzhanxinxi()
				}
				uni.hideKeyboard();
				this.show = true
			},
			/**
			 * 打开车辆用途选择
			 */
			showAssistant() {
				if (!this.SelectAssistantDataList || this.SelectAssistantDataList[0].length == 0) {
					this.getAssistantDataList()
				}
				uni.hideKeyboard();
				this.show1 = true
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
				} else {
					uni.showToast({
						icon: 'none',
						title: '获取服务站信息失败'
					})
				}
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
					// this.getAssistantDataList()
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
					uni.showToast({
						icon: 'none',
						title: '获取产品信息失败'
					})
					// this.getSelectMaterialList()
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
				    this.show5 = true
				  }
				}, 1000),
				/**
				 * 保存报修单数据到本地缓存
				 */
				async saveToLocalStorage() {
				  try {
				    // 收集所有需要保存的数据
				    const saveData = {
				      formData: this.formData,
				      fileList1: this.fileList1,
				      fileList4: this.fileList4,
				      fileList5: this.fileList5,
				      fileList6: this.fileList6,
				      prodImg: this.prodImg,
				      errImg: this.errImg,
				      previewData: this.previewData,
				      video: this.video,
				      radiovalue1: this.radiovalue1,
				      FRCHECKHOME: this.FRCHECKHOME,
				      currentIndex: this.currentIndex,
				      customInfo: this.customInfo,
				      Fproductclass: this.Fproductclass,
				      F_tesu_text: this.F_tesu_text,
				      producIndex: this.producIndex,
				      carType: this.carType,
				      FSERVICESTATIONnumber: this.FSERVICESTATIONnumber,
				      SelectAssistantDataListnumber: this.SelectAssistantDataListnumber,
				      // 保存所有产品的数据
				      productsData: this.$refs.choosecmp.map(item => item.getSaveData ? item.getSaveData() : {
						  formData: {...item.formData},
						   MaterialListnumber: item.MaterialListnumber,
						   FPRODUCTNAME: item.FPRODUCTNAME
                      }),
				      list2: this.list2,
				      saveTime: new Date().getTime(),
				      status: 'draft' // 标记为草稿状态
				    }
					let draftList = uni.getStorageSync('repairDrafts') || []
				    // 生成唯一的工单编号
				    const draftId = this.FBillNo
				    saveData.draftId = draftId
				    draftList = draftList.filter(draft => draft.draftId !== draftId)
				    // 添加到草稿列表
				    draftList.unshift(saveData)				    
				    // 保存到缓存
				    uni.setStorageSync('repairDrafts', draftList)				    
				    console.log('保存草稿成功:', draftId)				    
				  } catch (error) {
				    console.error('保存草稿失败:', error)
				    uni.showToast({
				      icon: 'none',
				      title: '保存草稿失败'
				    })
				  }
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
			  
			  // ========== 调试信息开始：附件上传验证 ==========
			  console.log('=== 附件上传验证调试信息 ===');
			  console.log('1. 文件上传到服务器验证:');
			  
			  // 验证每个文件数组的FID状态
			  const checkFileUploadStatus = (name, fileList, storageArray) => {
			    console.log(`【${name}】验证结果:`);
			    console.log(`- 本地文件列表: ${fileList.length} 个文件`);
			    console.log(`- 服务器存储数组: ${storageArray.length} 个FID`);
			    
			    // 检查每个文件的FID
			    fileList.forEach((file, index) => {
			      const hasFID = !!file.FID;
			      const status = hasFID ? '✅ 已上传到服务器 (有FID)' : '❌ 未上传到服务器 (无FID)';
			      console.log(`  文件${index + 1}: ${status}${file.FID ? `, FID: ${file.FID}` : ''}`);
			    });
			    
			    // 检查存储数组的FID
			    storageArray.forEach((item, index) => {
			      console.log(`  存储${index + 1}: ${item.FID ? `✅ FID: ${item.FID}` : '❌ FID为空'}`);
			    });
			    
			    // 验证一致性
			    if (fileList.length !== storageArray.length) {
			      console.log(`⚠️ 警告: 本地文件数量(${fileList.length})与服务器FID数量(${storageArray.length})不一致`);
			    }
			    
			    return fileList.every(f => f.FID) && storageArray.every(s => s.FID);
			  };
			  
			  // 验证所有附件
			  console.log('\n2. 各类型附件验证详情:');
			  const productImgStatus = checkFileUploadStatus('产品图片', this.fileList1, this.prodImg);
			  const errorImgStatus = checkFileUploadStatus('故障图片', this.fileList4, this.errImg);
			  const videoStatus = checkFileUploadStatus('故障视频', this.fileList5, this.video);
			  const purchaseProofStatus = checkFileUploadStatus('购买凭证', this.fileList6, this.previewData);
			  
			  console.log('\n3. 附件上传汇总:');
			  console.log(`产品图片: ${productImgStatus ? '✅ 已全部上传' : '❌ 未全部上传'}`);
			  console.log(`故障图片: ${errorImgStatus ? '✅ 已全部上传' : '❌ 未全部上传'}`);
			  console.log(`故障视频: ${videoStatus ? '✅ 已全部上传' : '❌ 未全部上传'}`);
			  console.log(`购买凭证: ${purchaseProofStatus ? '✅ 已全部上传' : '❌ 未全部上传'}`);
			  
			  console.log('\n4. 提交前附件FID数组:');
			  console.log('产品图片FID:', this.prodImg.map(p => p.FID));
			  console.log('故障图片FID:', this.errImg.map(e => e.FID));
			  console.log('故障视频FID:', this.video.map(v => v.FID));
			  console.log('购买凭证FID:', this.previewData.map(p => p.FID));
			  
			  // 合并后的FileFIDS（这是实际提交给服务器的）
			  const allFIDs = [
			    ...this.prodImg,      // 产品图片
			    ...this.previewData,  // 购买凭证
			    ...this.errImg,       // 故障图片
			    ...this.video         // 故障视频
			  ];
			  
			  console.log('\n5. 即将提交给服务器的FileFIDS:');
			  console.log(`总FID数量: ${allFIDs.length}`);
			  console.log('FID列表:', allFIDs.map(item => item.FID));
			  
			  const validFIDCount = allFIDs.filter(item => item.FID).length;
			  console.log(`有效FID数量: ${validFIDCount}/${allFIDs.length}`);
			  
			  if (allFIDs.length > 0 && validFIDCount === 0) {
			    console.log('⚠️ 警告: 有附件文件但没有有效的FID，可能未上传到服务器！');
			  }
			  // ========== 调试信息结束 ==========
			  
			  this.show5 = false;
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
			    // && this.customInfo == 'after'
			    if (this.previewData.length == 0) {
			      text = '请上传购买凭证'
			      this.previewUrl.splice(0)
			      this.fileList6.splice(0)
			    }
			
			    if (this.radiovalue1 == '上门维修' && this.formData.FREPAIRSITE == '') {
			      text = '请填写故障地点'
			    }
			    let text2 = text
			    if (this.status == 'Service_station') {
			      if (this.serviceCheck() !== '') {
			        text = this.serviceCheck()
			      }
			      if (this.F_tesu_text == '') {
			        text = '请填写厂家信息'
			      }
			    }
			    if (this.Fproductclass == '') {
			      text = '请选择使用类别'
			    }
			    if (this.producIndex !== '2' && !this.formData.FPOWERNUMBER && this.status == 'Service_station') {
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
			    if ((parseFloat(this.formData.F_DRIVINGCOM_H).toString() == "NaN" || !this.formData
			        .F_DRIVINGCOM_H) && this.customInfo == 'after' && this.producIndex !== '1' && this.producIndex !== '2') {
			      uni.showToast({
			        icon: 'none',
			        title: this.carType > 1 ? '运转时长' : '行驶里程' + '，数据非法或为空！'
			      })
			      return
			    }
			    // 数据验证：配件或零售发动机且显示行驶里程时，验证数据合法性
			    if ((parseFloat(this.formData.F_DRIVINGCOM_H).toString() == "NaN" || !this.formData
			        .F_DRIVINGCOM_H) && this.customInfo == 'after' && (this.producIndex == '1' || this.producIndex == '2') && this.carType <= 1) {
			      uni.showToast({
			        icon: 'none',
			        title: '行驶里程，数据非法或为空！'
			      })
			      return
			    }
			
			    if (this.FRCHECKHOME !== '0' && this.FRCHECKHOME !== '1') { //'到服务站维修'
			      text = '请选择服务方式'
			    }
			    if (text !== '') {
			      uni.showToast({
			        icon: 'none',
			        title: text
			      })
			      this.show5 = false
			      return
			    }
			
			  }
			  const arr = this.getprodArr();
			  console.log("报修提交数据，arr--", arr)
			
			  if (arr[1] > 0) {
			    this.show5 = false
			    return //判断产品信息是否完整
			  }
			
			  if (this.FRCHECKHOME == '0') { //'到服务站维修'
			    this.formData.FREPAIRSITE = '';
			  }
			
			  if (this.status == 'Customer') {
			    if (this.FRCHECKHOME == '1') { //'上门维修'  
			      this.formData.FSERVICESTATION = '';
			      this.FSERVICESTATIONnumber = '';
			    }
			  }
			
			  // return;
			  uni.showLoading({
			    title: '正在保存'
			  });
			  let obj = {
			    ...this.formData
			  }
			  
			  // 调试：显示实际提交的FileFIDS
			  console.log('\n6. 最终提交数据中的FileFIDS验证:');
			  obj.FileFIDS = [
			    ...this.prodImg,      // 产品图片
			    ...this.previewData,  // 购买凭证
			    ...this.errImg,       // 故障图片
			    ...this.video         // 故障视频
			  ]
			  console.log('提交的FileFIDS:', obj.FileFIDS);
			  console.log('FileFIDS总数:', obj.FileFIDS.length);
			  console.log('有效的FID数量:', obj.FileFIDS.filter(item => item.FID).length);
			  
			  obj.FSERVICESTATION = this.FSERVICESTATIONnumber
			  obj.FVEHICLEPURPOSE = this.SelectAssistantDataListnumber
			  obj.FileFIDS.splice(0)
			
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
			
			
			  // console.log(1112,this.producIndex,obj)
			  // return
			
			  console.log('\n7. 开始调用InsertREPAIRREPORT接口，提交数据包含:');
			  console.log(`- FileFIDS: ${obj.FileFIDS.length} 个附件`);
			  console.log(`- entry: ${obj.entry ? obj.entry.length : 0} 个产品`);
			  
			  const res = await this.$Recipe.InsertREPAIRREPORT(obj)
			  
			  console.log('\n8. 接口响应结果:');
			  console.log('接口响应:', res);
			  console.log('响应msg:', res?.msg);
			  console.log('响应data:', res?.data);
			  
			  this.isUpdate = false
			  uni.hideLoading()
			
			  if (res?.msg == 'Success') {
			    console.log('✅ 提交成功！');
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
			    console.log('❌ 提交失败！');
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
				let _this = this;

				uni.previewImage({
					urls: [_this.fileList6[0].url],
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
				this.$Recipe.DeleteFile({
					FID: event.file.FID
				})

			},
			beforeReadHandler(file, lists, name) {},
			// 新增图片
			async afterRead(event) {
				
				 console.log('afterRead 事件触发', {
				    eventName: event.name,
				    fileCount: event.file.length
				  });
				  
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
						
						console.log(`开始上传文件 ${i+1}/${lists.length}`, {
						        fileUrl: lists[i].url?.substring(0, 50) + '...',
						        eventName: event.name
						      });
							  
						result = await this.uploadFilePromise(lists[i].url, event.name)
						 console.log(`文件上传响应`, {
						        responseLength: result?.length,
						        hasFID: result?.includes('FID')
						      });
  
					} catch (e) {
						console.log("文件上传失败,e--", e)
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
						"FID": item.FID,
					}
					if (event.name == '1') {
						this.prodImg.push(obj);
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
				
				console.log('上传完成后附件统计:')
				console.log('产品图片:', this.prodImg)
				console.log('故障图片:', this.errImg)
				console.log('故障视频:', this.video)
				console.log('购买凭证:', this.previewData)
				  
				this.isUpdate = false

			},
			uploadFilePromise(url, number) {
				let _this = this;
                let type = '';
                let uploadUrl = 'https://cy.klwsxx.com/File/FileUpload'; 
				if (number == '1') {
					type = 'BXYMSC_CPTP';
				}
				if (number == '4') {
					type = 'BXYMSC_GZTP';
				}
				if (number == '5') {
					type = 'BXYMSC_GZSP';
				}
				if (number == '6') {
					type = 'BXYMSC_GMPZ';
				}
				
				console.log('上传类型', { type });
				
				return new Promise((resolve, reject) => {
					
					 console.log('发起上传请求');
					 
					let a = uni.uploadFile({
						url: uploadUrl,
						filePath: url,
						name: 'FileName',
						formData: {
							type: type,
						},
						success: (res) => {
							
							console.log('请求成功', {
							          statusCode: res.statusCode,
							          dataLength: res.data?.length
							        });
									
							_this.isUpdate = false
							setTimeout(() => {
								resolve(res.data)
							}, 1000)
						},
						fail: (err) => {
							_this.isUpdate = false
							uni.showToast({
								icon: 'none',
								title: '上传失败'
							})
						}
					});
				})

			},

			/**
			 * 退出登录
			 */
			showLoginPage() {
				this.showLoginOut = false;
				/** 清理缓存  **/
				uni.removeStorageSync('openid');
				uni.removeStorageSync('userRoleList');
				uni.removeStorageSync('phone');
				uni.removeStorageSync('avatarUrl');
				uni.removeStorageSync('nickName');
				uni.removeStorageSync('unionid');
				uni.removeStorageSync('userNumber');
				uni.removeStorageSync('Fnumber');
				uni.removeStorageSync('customertype');
				uni.removeStorageSync('FISADMIN');
				uni.clearStorage();
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},
			/**
			 * 提取本地openid 和 phone 调用获取userinfo 接口 将值保存  当借口返回空时  则说明是司机 需要调用插入司机方法  插入成功后再次调用   本方法获取用户信息
			 */
			async getMiniUser() {
				let data = {
					openid: uni.getStorageSync('openid'),
					mobile: uni.getStorageSync('phone')
				}
				const res = await this.$Recipe.getMiniUserInfo(data);

				let len = res.data.length;
				if (len == 0) {
					this.showLoginOut = true;
					return
				}

				const roleList = res.data.filter(item => {
					if (item.customertype == 'Service_station' || item.customertype == 'Distributor') {
						return item
					}
				})

				let oldRoleList = uni.getStorageSync('userRoleList');

				if (JSON.stringify(oldRoleList) == JSON.stringify(roleList)) {
					return
				} else {
					this.showLoginOut = true;
					return
				}
			},

		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .uni-calendar__content.data-v-94becebc {
		z-index: 99999;
	}

	.add-box {
		padding: 0px;
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
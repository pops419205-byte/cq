import {
	axios
} from "@/common/SDK/interface/axios.js"

import Author from './Author.js'
import User from './user/index.js'

class Recipe {
	constructor() {
		/**
		 * 小程序默认配置
		 */
		this.defaultAppConfig = {
			'app_name': '重油',
			'version': '0.0.1'
		}
		/**
		 * 小程序场景值
		 */
		this.defaultAppScene = {
			//发现栏进入小程序
			'PORCH_SCENE_1001': 1001,
			//单人会话中进入
			'PORCH_SCENE_1007': 1007,
			//群聊进入
			'PORCH_SCENE_1008': 1008,
			//用户场景值数据
			'SCENEOPTIONS': null
		}
		/**
		 * 事件名称
		 */

		this.API_EVENT = {
			APP_INIT_EVENT: 'app_init_event',
			APP_HIDE_EVENT: 'app_hide_event'
		}

		/**
		 * 接口API
		 */
		this.API_REQUEST = {
			/**
			 * 登录相关
			 */
			'API_USER_LOGIN': '',
		}

		/**
		 * 权限模块
		 */
		this.Author = null;
		this.User = null;
		this.initModules()
	}
	/**
	 * 初始化功能模块
	 */
	initModules() {
		this.Author = new Author()
		this.User = new User()
	}
	/**
	 * 小程序创建初始化
	 */
	init(callback = null, options) {
		this.init_config((options) => {
			this.User.init((User) => {
				// console.log('User init')
			}, options)
			if (callback) {
				callback('小程序初始化完成')
			}
		}, options)
	}
	toLogin(customertype) {
			uni.redirectTo({
				url: '/pages/login/login',
				success() {
					// uni.showToast({
					// 	icon: 'none',
					// 	title: '请重新登录'
					// })
				}
			})
	}
	//nav 是否跳转登录页
	checkLogin(nav = false) {
		let openid = uni.getStorageSync('openid')
		let unionid = uni.getStorageSync('unionid')
		let phone = uni.getStorageSync('phone')
		let Fnumber = uni.getStorageSync('Fnumber')
		let userNumber = uni.getStorageSync('userNumber')
		let userNumberToken = uni.getStorageSync('userNumberToken')
		let customertype = uni.getStorageSync('customertype')
		// console.log('检查登录')
		if (!openid || !unionid || !phone || !Fnumber || !userNumber ||!userNumberToken) {
			// console.log('检查登录失败')
			uni.removeStorageSync('userRoleList')
			uni.removeStorageSync('openid')
			uni.removeStorageSync('unionid')
			uni.removeStorageSync('phone')
			uni.removeStorageSync('Fnumber')
			uni.removeStorageSync('userNumber')
			uni.removeStorageSync('nickName')
			uni.removeStorageSync('avatarUrl')
			uni.removeStorageSync('stationName')
			uni.removeStorageSync('FISADMIN')
			uni.removeStorageSync('userNumberToken')
			if (nav) {
				this.toLogin(customertype)
			}
			return false
		}
		return true
	}

	toast(title) {
		uni.showToast({
			title,
			icon: 'none'
		})
	}

	/**
	 * 获取初始小程序公共配置
	 */
	async init_config(callback = null, options) {
		this.defaultAppScene.SCENEOPTIONS = options;
		if (!this.Author.checkLogin()) {

		}
	}
// 报修
	
GetBaoXiuDetail(data) {
	return this.request({
		url: "/Common/GetBaoXiuDetail",
		method: "post", //请求方式
		query: data, //请求数据
	})
}

// 获取baoxiu驳回理由
GetASSIGNEND(data){
	return this.request({
		url: "/ASSIGNEND/GetASSIGNEND",
		method: "post", //请求方式
		query: data, //请求数据
	})
}

	 
	// 图片删除

	DeleteFile(data) {
		return this.request({
			url: "/File/DeleteFile",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	//获取维修单所有信息
	// 

	GetWeiXiuDetail(data) {
		return this.request({
			url: "/Common/GetWeiXiuDetail",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	changeProdcInfo1(data) {
		return this.request({
			url: "/RpmApplication/GetWeixiuRpmApplication",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	changeProdcInfo(data) {
		return this.request({
			url: "/RpmApplication/GetRpmApplication",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	errReason(data) {
		return this.request({
			url: "/AssistantData/SelectFaultDataList",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	deleteOrder(data) {
		return this.request({
			url: "/REPAIRREPORT/DeleteREPAIRREPORT",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	deleteStaff(data) {
		return this.request({
			url: "/MiniUser/DisableUser",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	newTreeList(data) {
		return this.request({
			url: "/ASSISTANT/SelectAssistantEntryTree",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	oldProduct(data) {
		return this.request({
			url: "/JiuJian/Savefahuo",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	deleteImg(data) {
		return this.request({
			url: "/WxOpen/GetCode",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	// 4.1.1	通过code获取openid
	getOpenid(data) {
		return this.request({
			url: "/WxOpen/GetCode",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	//4.1.2	通过参数获取手机号
	getTel(data) {
		return this.request({
			url: "/WxOpen/getPhoneNumber",
			method: "get", //请求方式
			query: data, //请求数据
		})
	}

	//4.1.3	司机信息保存
	addUser(data) {
		return this.request({
			url: "/MiniUser/InsertCustomer",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	
	
		// 中心库查询发货单列表
		GetAllSend(data){ 
			return this.request({
			    url: "/Common/GetAllSend",  
			    method: "post", //请求方式 
		        query: data, //请求数据
			})
		}
		
		// 中心库查询发货单明细
		GetSendByFnumber(data){ 
			return this.request({
			    url: "/SendInfo/GetSendByFnumber",  
			    method: "post", //请求方式 
		        query: data, //请求数据
			})
		}
		// 中心库查询发货单明细
		Savefahuo(data){ 
			return this.request({
			    url: "/JiuJian/Savefahuo",  
			    method: "post", //请求方式 
		        query: data, //请求数据
			})
		}
	
	
	
	
	
	
	

	// 4.1.4	服务站信息获取
	getFuwuzhanxinxi(data,method="post") {
		
		return this.request({
			url: "/MiniUser/getSUPPLIER",
			method, //请求方式
			query: data, //请求数据
		})
	}

	//4.1.5	用户详情
	getMiniUserInfo(data) {
		return this.request({
			url: "/MiniUser/userinfo",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}

	//4.1.6	服务站/中心库添加信息员
	addCustUser(data) {
		return this.request({
			url: "/MiniUser/add_cust_user",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//4.1.7	报修单添加
	InsertREPAIRREPORT(data) {
		return this.request({
			url: "/REPAIRREPORT/InsertREPAIRREPORT",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//4.1.8	根据物料编码获取FName
	getFname(data) {
		return this.request({
			url: "/MiniUser/getFname",
			method: "get", //请求方式 
			query: data, //请求数据
		})
	}
	//4.1.9	文件上传
	FileUpload(data) {
		return this.request({
			url: "/File/FileUpload",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//4.1.10	维修单添加
	addRepairOrder(data) {
		return this.request({
			url: "/RepairOrder/InsertRepairOrder",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	// 4.1.11	查询维修单列表
	SelectRepairOrderList(data) {
		return this.request({
			url: "/RepairOrder/SelectRepairOrderList",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	//4.1.12	根据单据编号查询维修单明细
	getSelectRepairOrderDetailByFBillNo(data) {
		return this.request({
			url: "/RepairOrder/SelectRepairOrderDetailByFBillNo",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	//4.1.13	根据服务站点查询旧件返回单列表及单据体列表 
	getCoreReturn(data) {
		return this.request({
			url: "/CoreReturn/SelectCoreReturnListByServiceStation",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	// 4.1.14	换件申请单保存接口  
	getInsertRpmApplication(data) {
		return this.request({
			url: "/RpmApplication/InsertRpmApplication",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	// 4.1.15	查询换件申请单列表 
	getSelectRpmApplicationList(data) {
		return this.request({
			url: "/RpmApplication/SelectRpmApplicationList",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	// 4.1.16	发货单添加 
	InsertInvoice(data) {
		return this.request({
			url: "/Invoice/InsertInvoice",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	//4.1.17	查询服务站发货单列表 
	getInsertInvoice(data) {
		return this.request({
			url: "/Invoice/SelectInvoiceList",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	//4.1.18	根据openid查询报修单列表
	getRepairReportListByOpenid(data) {
		return this.request({
			url: "/RepairOrder/GetWeixiuALL",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	// 4.1.19	查询辅助资料类别（车辆用途）
	getAssistantDataList(data) {
		return this.request({
			url: "/AssistantData/SelectAssistantDataList",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	//4.1.20	同步K3 数据测试接口
	getSyncStockData(data) {
		return this.request({
			url: "/SyncStock/SyncStockData",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	// 4.1.21	查询产品物料分组列表        弃用  
	getSelectMaterialList(data) {
		return this.request({
			url: "/Material/SelectMaterialList",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	//4.1.22	根据报修单编码查询报修单信息后将数据插入维修单保存接口
	InsertRepairOrderByFBillNo(data) {
		return this.request({
			url: "/RepairOrder/InsertRepairOrderByFBillNo",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//4.1.23	根据报修单号查询报修单明细
	getSelectRepairReportByFBillNo(data) {
		return this.request({
			url: "/REPAIRREPORT/SelectRepairReportByFBillNo",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	// 4.1.24	查询产品物料分组列表       弃用
	getSelectMaterialList(data) {
		return this.request({
			url: "/Material/SelectMaterialList",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	//4.1.26	换件申请单及商品保存接口
	// 
	InsertRpmApplicationProduct(data) {
		return this.request({
			url: "/RpmApplication/InsertRpmApplicationProduct",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	//获取具体物料
	getSelectMaterialDetailList(data) {
		return this.request({
			url: "/Material/SelectMaterialDetailList",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	//获取服务站人员列表
	GetUserlist(data) {
		return this.request({
			url: "/MiniUser/GetUserlist",
			method: "get", //请求方式
			query: data, //请求数据
		})
	}
	//获取维修价目表  
	SelectREPAIRPRICEList(data) {
		return this.request({
			url: "/REPAIRPRICE/SelectREPAIRPRICEList",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}

	getSelectMaterialList(data) {
		return this.request({
			url: "/ASSISTANT/SelectAssistantDataList",
			method: "get", //请求方式
			query: data, //请求数据
		})
	}

	//维修单确认接口
	UpdateRepairOrder(data) {
		console.log('========== UpdateRepairDesc 接口请求参数 ==========')
		console.log('接口地址: /RepairOrder/UpdateRepairDesc')
		console.log('请求方式: POST')
		console.log('请求参数:', JSON.stringify(data, null, 2))
		console.log('请求参数详情:')
		console.log('  - FBillNo:', data.FBillNo)
		console.log('  - FID:', data.FID)
		console.log('  - FWORKORDERNO1:', data.FWORKORDERNO1)
		console.log('  - introduc:', data.introduc)
		console.log('  - FileFIDS:', data.FileFIDS)
		console.log('  - Prodcuts:', data.Prodcuts)
		console.log('  - FCHECKRESULT:', data.FCHECKRESULT)
		console.log('  - FERRORMODE:', data.FERRORMODE)
		console.log('  - FWXCONFIRM:', data.FWXCONFIRM)
		console.log('  - FDISTANCE:', data.FDISTANCE)
		console.log('  - FDISTANCENUM:', data.FDISTANCENUM)
		console.log('  - FREPAIRSITE:', data.FREPAIRSITE)
		console.log('  - F_TESU_MANU:', data.F_TESU_MANU)
		console.log('  - FCLASSPRODUCT:', data.FCLASSPRODUCT)
		console.log('  - FCARUSING:', data.FCARUSING)
		console.log('  - FPURCHASEDATA:', data.FPURCHASEDATA)
		console.log('  - FPURCHASEDATAENTENTRY:', data.FPURCHASEDATAENTENTRY)
		console.log('  - FPOWERNUMBER:', data.FPOWERNUMBER)
		console.log('完整参数对象:', data)
		console.log('================================================')
		return this.request({
			url: "/RepairOrder/UpdateRepairDesc",
			method: "post", //请求方式
			query: data, //请求数据
		})
	}
	//树形节点  
	SelectAssistantTree(data) {
		return this.request({
			url: "/ASSISTANT/SelectAssistantTree",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}

	//获取收货单详情
	SelectInvoiceList(data) {
		return this.request({
			url: "/SendInfo/GetSendByFnumber",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	
	//获取收货单详情
	GetReceiveByFnumber(data){
		return this.request({
			url: "/SendInfo/GetReceiveByFnumber",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//确认收货
	SaveReceive(data) {
		return this.request({
			url: "/Invoice/SaveReceive",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}

	// //获取服务站信息
	getSupllier(data) {
		return this.request({
			url: "/supllier/getALL",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}

	// 4.1.32	获取所有换件申请单产品名称
	getSelectAssistantALL(data) {
		return this.request({
			url: "/ASSISTANT/SelectAssistantALL",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}

	//MiniUser/GetServiceStationLength
	GetServiceStationLength(data) {
		return this.request({
			url: "/MiniUser/GetServiceStationLength",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//查询维修单列表
	repairOrderList(data) {
		return this.request({
			url: "/RepairOrder/SelectRepairOrderList",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//旧件返回单列表及单据体列表
	repairOrderList(data) {
		return this.request({
			url: "/RepairOrder/SelectCoreReturnListByServiceStation",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}

	//4.1.30	添加服务站供应商人员
	AddCommonContact(data) {
		return this.request({
			url: "/CommonContact/AddCommonContact",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	// 4.1.36	服务站新用户登录更新openid等信息   
	InsertServiceCustomer(data) {
		return this.request({
			url: "/MiniUser/InsertServiceCustomer",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	
	//查询标准接口  
	GetAllDetail(data) {
		return this.request({
			url: "/Common/GetCommonDetail",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//查询中心库已补货/未补货 列表
	GetAllReceive(data) {
		return this.request({
			url: "/Common/GetAllReceive ",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//查询服务站已补货/未补货 列表
	GetAllReceiveBySender(data) {
		return this.request({
			url: "/Common/GetAllReceiveBySender",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}
	//查询服务站其他费用单
	GetAllReceiveOfCost(data) {
		return this.request({
			url: "/Cost/GetAllCost",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}

	//服务站其他费用单填报
	SaveCost(data) {
		return this.request({
			url: "/Cost/SaveCost",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	} 
	
	//服务站其他费用单填报 图片
	getCostImg(data) {
		return this.request({
			url: "/Cost/GetImagebyNumber",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}  
	
	//服务站结算单 头
	SettlementInfo(data) {
		return this.request({
			url: "/Settlement/Info",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}  
	
	//服务站结算单 列表 
	GetSettlementALL(data) {
		return this.request({
			url: "/Settlement/GetSettlementALL",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}  
	 
	//结算单 开发票
	UpdateSettle(data) {
		return this.request({
			url: "/Settlement/UpdateSettle",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}  
	//服务站经纬度
	UpdateLocation(data) {
		return this.request({
			url: "/MiniUser/UpdateCustomerLocation",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}  
	
	//中心库 结算单 详情
	CenterSettlementInfo(data) {
		return this.request({
			url: "/CenterSettlement/Info",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}  
	//中心库 结算单 
	CenterSettlementAll(data) {
		return this.request({
			url: "/CenterSettlement/GetSettlementALL",
			method: "post", //请求方式 
			query: data, //请求数据
		})
	}  
	
	//
	QueryAssistactBalance(data) {
		return this.request({
			url: "/Settlement/QueryAssistactBalance ",
			method: "post", //请求方式 
			query: {
				param: data
			}, //请求数据
		})
	}  
	
	/**
	 * 网络请求封装
	 */
	async request({
		isToken = false,
		url,
		method,
		query = {},
		baseUrl = '',
		header = {}
	}) {
		let item = {
			url,
			method
		}
		if (isToken) {
			item['auth_with'] = isToken;
		}
		try {
			// console.log('header:',header)
			// console.log('item:',item)
			// console.log('query:',query)
			return await axios(item, query, header, baseUrl)
		} catch (e) {
			uni.showToast({
				icon: ' none',
				title: e
			})
		}
	}
	/**
	 * 小程序销毁
	 */
	destoryed(callback = null) {
		if (callback) {
			callback()
		}
	}
}
export default new Recipe()

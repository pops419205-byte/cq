<template>
	<view class="page" > 
	 
		<view class="scroll-h">
			<u-subsection :list="list" fontSize="15" height="50" :current="current" @change="sectionChange"></u-subsection>
			
			<view style="margin: 1px 0;">
				<u-search :show-action="true" actionText="搜索" placeholder="请输入联系人姓名、电话搜索" @search="getlist"
					@custom='getlist' :animation="true" height="40">
				</u-search>
			</view>
		</view>	
		
		<scroll-view style="height: calc( 100vh - 110rpx) ;width: 100%;" scroll-y="true" refresher-enabled="true"
			:refresher-triggered="triggered" :refresher-threshold="100" @refresherrefresh="onRefresh"
			@refresherrestore="onRestore" :scroll-into-view="FBillNo"  scroll-with-animation='true'>
			<template>
				<view style="height: 95px;width: 100%;margin-bottom: 5px;background: #fff;"></view>
				<!-- 报修单-维修单列表 -->
				<view class="card" v-for="(item,index) in SelectRepairOrderList" :key='index'  :id="item.FWORKORDERNO1" :style="FBillNo==item.FWORKORDERNO1?'background: #ffdfd3;':''">
					<!-- 卡片头部-产品名称 -->
					<view class="head" @click="orderBtn(item)">
						<view class="left">
							<text class="materiel-name">产品名称: {{item.productname|| ''}}</text>
						</view>
					</view>
					<!-- 工单信息 -->
					<view class="middle" @click="orderBtn(item)" >
						<view style="display: flex;flex-direction: column;width: 100%;">
							<view class="new-item" v-for="(item2,index) in orderInfoList" :key='index' v-if="item2.type == 'all' || item2.type == status">
								<image :src="item2.image" mode=""></image>
								<text class="left">{{item2.value}}</text>
								
								<text v-if="item2.status == 'status' " class="right">
									{{ item.isDraft ? '报修单待提交' : ((item.F_REPAIRPRICESTATE==5 || item.F_REPAIRPRICESTATE==30) && item.FREPAIRDESC && status!='Customer') ? '服务站待提交维修费用' : item.REPAIRPRICE }}			 
								</text>

								<text v-if="item2.status == 'orderNo'" class="right">{{item.FWORKORDERNO1}}</text>
								<text v-if="item2.status == 'userName'" class="right">{{item.isDraft ? (item.username || '') : item.username}}</text>
								<text v-if="item2.status == 'date'" class="right">{{item.FCreateDate}}</text>
								<text v-if="item2.status == 'station'"
									class="right">{{item.customername?item.customername:'待服务中心分配'}}</text>
								
							</view>
							<view class="new-item" v-if="item.F_REPAIRPRICESTATE==18">
								<u-icon name="error-circle" size="20px" color="red"></u-icon>
									<text class="left" style="color: red;">温馨提示</text>
								<!-- <image src="../../../static/info_number.png" mode=""></image> -->
									<text  class="right" style="color: red;">{{item.msg}}！！</text>
							</view>
							
							
							<!-- <view class="new-item" v-if="item.F_REPAIRPRICESTATE==18">
								<u-icon name="error-circle" size="20px" color="red"></u-icon>
									<text class="left" style="color: red;">温馨提示</text>
									<text  class="right" style="color: red;">维修方案被驳回，点击查看驳回意见！！</text>
							</view> -->
					
						</view>
					</view>
					<!-- 操作按钮 -->
					<view class="bottom">
						<view class="label-wrap" v-if="item.F_REPAIRPRICESTATE==18">
							<!-- 保修未通过审核 -->
							<text style="background: white; color:#007AFF;"  @click="GetASSIGNEND(item.FBillNo)">点击查看驳回原因</text>
						</view>
						
						<view class="label-wrap" v-if="item.F_REPAIRPRICESTATE==0||item.F_REPAIRPRICESTATE==18">
							<text class="label" @click="deletOrder(item,index)">删除</text>
						</view>
						<view class="label-wrap" v-if="item.F_REPAIRPRICESTATE==0||item.F_REPAIRPRICESTATE==18">
							<text class="label" @click="commit(item)">修改</text>
						</view>
					
						
						<view class="label-wrap">
							<text class="label" @click="confirm(item)"
								v-if="item.F_REPAIRPRICESTATE==3 && status!='Customer'">是否接单</text>
						</view>
						<view class="label-wrap" @click="toreplace(item)"
							v-if="item.F_REPAIRPRICESTATE==4 && status!='Customer'">
							<text class="label">故障检测</text>
						</view>
						<view class="label-wrap" @click="toreplaceA(item)"
							v-if="item.F_REPAIRPRICESTATE==5 && status!='Customer'">
							<text class="label">编制维修方案</text>
						</view>
						<view class="label-wrap" @click="GetASSIGNEND(item.SINFNUMBER)"
							v-if="item.F_REPAIRPRICESTATE==28 && status!='Customer'">
							<text class="label">查看驳回原因</text>
						</view>
						<view class="label-wrap" @click="toreplaceA({item,EDIT:'1'})"
							v-if="item.F_REPAIRPRICESTATE==29 && status!='Customer'||item.F_REPAIRPRICESTATE==28 && status!='Customer'">
							<text class="label">提交维修方案</text>
						</view>
						<view class="label-wrap" @click="tosituation(item)"
							v-if="item.F_REPAIRPRICESTATE==30  && !item.FREPAIRDESC && status!='Customer'">
							<text class="label">填写维修情况</text>
						</view>
						<view class="label-wrap" @click="tobill(item)"
							v-if="(item.F_REPAIRPRICESTATE==5 ||  item.F_REPAIRPRICESTATE==30  ) && item.FREPAIRDESC  && status!='Customer' ">
							<text class="label">维修费用</text>
						</view>
					<!-- 	<view class="label-wrap" @click="send(item)"
							v-if="item.F_REPAIRPRICESTATE==31 && status!='Customer'">
							<text class="label">旧件发货</text>
						</view> -->
						<view class="label-wrap" @click="toreceive(item)"
							v-if="item.F_REPAIRPRICESTATE==6 && status!='Customer'">
							<text class="label">收货</text>
						</view>
						<!-- v-if="item.oldreturn && item.oldreturn ==12 &&  status=='Service_station'" -->
						<view class="label-wrap" @click="send(item)"  v-if="item.oldreturn && item.oldreturn ==12 &&  status=='Service_station'">
							<text class="label">旧件返还</text>
						</view>
						
					</view>
				</view>
				<view style="width: 100%;height: 30px;background: #fff;"> </view>
			</template>
		</scroll-view>
		
		
		
		
		<view v-if="SelectRepairOrderList.length == 0"
			style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);color: gray;">
			{{_freshing?'正在刷新':'当前暂无工单'}} 
		</view>
		<view class="btn"
			style="display: flex;flex-direction: column;align-items: center;width: 70px;position: fixed;top: 75%;right: 3%;"
			@click="toCommitOrder">
			<image style="height: 40px;width: 40px;" src="../../../static/ic_baoxiu.png" mode=""></image>
			<text style="color:#F3A73F;font-weight: bold;">立即报修</text>
		</view>
		
		
		
		
		
			 
	<!-- 维修方案驳回原因查看 -->
	<u-modal :show="show7" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="show7=false"
		:title="FanganBohui" @cancel="show7=false" @close="show7=false"></u-modal>
	<u-modal :show="content"  title="温馨提示"  :closeOnClickOverlay="true" @close="close" @confirm="close">
		<view class="slot-content"> <rich-text :nodes="content"></rich-text> </view>
	</u-modal>
	
	<!-- 重新登录 -->
	<u-modal :show="showLoginOut" :closeOnClickOverlay="false" :showCancelButton="false" @confirm="showLoginPage()"
		:title="'当前登录身份已失效，请重新登录'" @cancel="showLoginOut=false" @close="showLoginOut=false"></u-modal>
	
	
	<tab-bar @tab='tab' :current='0'></tab-bar>
	
	</view>
</template>

<script>
	// v-if="(item.F_REPAIRPRICESTATE==5 || item.F_REPAIRPRICESTATE==30 )  && !item.FREPAIRDESC && status!='Customer'">
	import {
		orderInfoList
	} from './data.js'
	export default {
		data() {
			return {
				list: ['进行中', '已完成'], //状态列表
				current: 0, //当前状态
				SelectRepairOrderList: [], //工单列表
				status: 'Customer', //用户类别
				triggered: false,
				_freshing: false,
				orderInfoList,
				content:'',
				show7: false, //显示维修方案驳回信息
				FanganBohui:'',
				showLoginOut:false,
				animationData: {},
				animation: null,
				FBillNo:"",
			}
		},
		onLoad: async function(option){
			console.log("?option:",option); 
		},
		watch: { //需要监听的字段
			'FBillNo': function (oldValue, newValue) {
				console.log('监听数据-FBillNo', oldValue, newValue)
			},
		},
		/**
		 * 判断用户类别 获取用户fnumber 获取工单列表
		 */
		onShow() {
			uni.hideTabBar()
			this.$Recipe.checkLogin(true)
			this.getMiniUser(); 
			this.getlist()
			 
		},
		created() {
			let _this = this;
			uni.$on('aEvenReInit', data=>{
				console.log('mine组件传来的数据：', data) 
				_this.getlist() ;
			})
		},
		methods: {
			  
			/**
			 * 获取维修方案被驳回原因
			 */
			async getFanganBohui() {
				
				const result = await this.$Recipe.getFanganBohui()
				if (result.code == 200) {
					this.show7 = true
					this.FanganBohui = [result.data]
				} else {
					uni.showToast({
						icon: 'none',
						title: '查看驳回原因失败'
					})
				}
			},
			close(){
				this.content=''
			},
			async deletOrder(item, index) {
				// 如果是草稿工单
				  if (item.isDraft) {
				    uni.showModal({
				      title: '提示',
				      content: `请确认是否删除草稿工单-${item.FBillNo}`,
				      confirmText: '确定',
				      success: ({ confirm }) => {
				        if (confirm) {
				            // 从缓存中删除草稿
				            let draftList = uni.getStorageSync('repairDrafts') || []
				            draftList = draftList.filter(draft => draft.draftId !== item.draftId) // 使用 draftId 而不是 FBillNo
				            uni.setStorageSync('repairDrafts', draftList)
				            this.SelectRepairOrderList.splice(index, 1)
				            this.$Recipe.toast('删除草稿成功')
				        }

				      }
				    })
				    return
				  }
				if (item.FDRIVER != '0' && this.status == 'Service_station') {
					uni.showToast({
						icon: 'none',
						title: '删除工单失败'
					})
					return
				}
				uni.showModal({
				    title: '提示',
				    content: `请确认是否删除工单-${item.FBillNo}`,
				    confirmText: '确定',
				    success: async ({ confirm }) => {
				      if (confirm) {
				        let result = await this.$Recipe.deleteOrder({
				          fbillno: item.FBillNo
				        });
				        if (result.code == 200) {
				          this.SelectRepairOrderList.splice(index, 1)
				          this.$Recipe.toast('删除工单成功')
				        } else {
				          this.$Recipe.toast('删除工单失败')
				        }
				      }
				    }
				  })
			},
			async getlist(searchValue) {
			    
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
			    
			    // 根据当前tab决定获取哪种状态的工单
			    let datastatus = 'running'
			    let completeDatastatus = 'complete'
			    
			    switch (this.current) {
			        case 0: // 进行中
			            datastatus = 'running';
			            // 额外获取旧件未返还且状态不是10的工单
			            completeDatastatus = 'complete';
			            break;
			        case 1: // 已完成
			            datastatus = 'complete';
			            completeDatastatus = null; // 已完成tab不需要额外数据
			            break;
			    }
			    
			    this.SelectRepairOrderList = [];
			    
			    // 获取主要状态的工单
			    const result = await this.$Recipe.getRepairReportListByOpenid({
			        type,
			        FID,
			        datastatus,
			        keywords: searchValue
			    })
			    
			    let completeResult = { data: [] }
			    // 额外获取已完成状态的工单，用于筛选旧件未返还的工单
			    if (this.current === 0 && completeDatastatus) {
			        completeResult = await this.$Recipe.getRepairReportListByOpenid({
			            type,
			            FID,
			            datastatus: completeDatastatus,
			            keywords: searchValue
			        })
			    }
			    
			    // 从本地缓存获取草稿工单
			    const draftList = uni.getStorageSync('repairDrafts') || []
				console.log('draftList = ', JSON.parse(JSON.stringify(draftList)))
			    const draftOrders = draftList.map(draft => {
			        // 获取产品名称 - 从第一个产品的数据中获取
			        let productname = ''
			        if (draft.productsData && draft.productsData.length > 0) {
			            const firstProd = draft.productsData[0]
			            if (firstProd.formData && firstProd.formData.FPRODUCTNAME) {
			              productname = firstProd.formData.FPRODUCTNAME   
			            }
			        }
					//草稿状态使用 DRAFT- 前缀
					const generateDraftOrderNo = (timestamp) => {
					    return `DRAFT-${timestamp}`
					}
			        // 正式工单使用 FW- 前缀
			        const generateFormalOrderNo = (timestamp) => {
			        const date = new Date(timestamp)
			        const year = date.getFullYear()
			        const month = (date.getMonth() + 1).toString().padStart(2, '0')
			        const day = date.getDate().toString().padStart(2, '0')
			        const hours = date.getHours().toString().padStart(2, '0')
			        const minutes = date.getMinutes().toString().padStart(2, '0')
			        const seconds = date.getSeconds().toString().padStart(2, '0')
			        return `FW-${year}${month}${day}${hours}${minutes}${seconds}`
			        }
			        // 格式化日期
			        const formatDate = (timestamp) => {
			        const date = new Date(timestamp)
			        const year = date.getFullYear()
			        const month = (date.getMonth() + 1).toString().padStart(2, '0')
			        const day = date.getDate().toString().padStart(2, '0')
			        const hours = date.getHours().toString().padStart(2, '0')
			        const minutes = date.getMinutes().toString().padStart(2, '0')
			         return `${year}/${month}/${day} ${hours}:${minutes}`
			        } 
			        // 使用 DRAFT-
			        const draftOrderNo = generateDraftOrderNo(draft.saveTime)
			        return {
			            FWORKORDERNO1: draftOrderNo,
			            FBillNo: draftOrderNo,
			            productname: productname,
			            username: draft.formData.F_USERREMAERK || '', // 联系人
			            FCreateDate: formatDate(draft.saveTime),
			            F_REPAIRPRICESTATE: 0, // 草稿状态
			            billtype: 'baoxiu',
			            status: 'draft', // 标记为草稿
			            isDraft: true, // 标记为草稿
			            draftData: draft, // 保存原始草稿数据
			            draftId: draft.draftId, // 保存原始草稿ID用于识别
			            // 添加工单状态显示
			            REPAIRPRICE: '报修单待提交'
			        }
			    })
			    let allOrders = []
			    if (this.current === 0) {			        
			        // 获取正常的进行中工单
			        const runningOrders = [...draftOrders, ...result.data]
			        // 从已完成中筛选出旧件未返还且状态不是10的工单
			        const oldReturnNotCompletedOrders = completeResult.data.filter(item => {
			        const isOldReturnNotDone = item.oldreturn && item.oldreturn == 12
			        const isNotCompleted = item.F_REPAIRPRICESTATE != 10
			        const shouldShowInProgress = isOldReturnNotDone && isNotCompleted
			            
			            return shouldShowInProgress
			        })
			        
			        // 合并所有工单
			        allOrders = [...runningOrders, ...oldReturnNotCompletedOrders]
			        
			        //  去重
			        const seen = new Set()
			        allOrders = allOrders.filter(item => {
			            if (!seen.has(item.FBillNo)) {
			                seen.add(item.FBillNo)
			                return true
			            }
			            return false
			        })
			        
			        //  按时间排序
			        allOrders.sort((a, b) => {
			            const dateA = new Date(a.FCreateDate || a.saveTime || 0)
			            const dateB = new Date(b.FCreateDate || b.saveTime || 0)
			            return dateB - dateA 
			        })
			        
			    } else {
			        // 只显示正常的已完成工单，但要排除旧件未返还且状态不是10的工单
			        const normalCompleteOrders = result.data.filter(item => {
			        const isOldReturnNotDone = item.oldreturn && item.oldreturn == 12
			        const isNotCompleted = item.F_REPAIRPRICESTATE != 10
			        const shouldExclude = isOldReturnNotDone && isNotCompleted    
			           
			            return !shouldExclude
			        })
			        
			        allOrders = [...draftOrders, ...normalCompleteOrders]
			        
			        // 按时间排序
			        allOrders.sort((a, b) => {
			            const dateA = new Date(a.FCreateDate || a.saveTime || 0)
			            const dateB = new Date(b.FCreateDate || b.saveTime || 0)
			            return dateB - dateA 
			        })
			    }
			    
			    this.SelectRepairOrderList = allOrders
			    uni.hideLoading(); 
			    this._freshing = false
			     
			    let MSG_TYPE = uni.getStorageSync('MSG_TYPE')
			    let MSG_INFO = uni.getStorageSync('MSG_INFO')
			    console.log("?MSG_INFO:",MSG_INFO);
			    if(MSG_TYPE == 'service_station'){ 
			        if(MSG_INFO){
			            this.FBillNo = MSG_INFO.FBillNo 
			            uni.setStorageSync('MSG_INFO','')
			        }
			    }
			    
			},
			/**
			 * 格式化日期
			 */
			formatDate(timestamp) {
			  const date = new Date(timestamp)
			  return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
			},
		async	onRefresh() {
				if (this._freshing) return;

				this._freshing = true;
				if (!this.triggered) //界面下拉触发，triggered可能不是true，要设为true  
					this.triggered = true;
				this.SelectRepairOrderList.splice(0)
			await	this.getlist()
					this.triggered = false;
					this._freshing = false;
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
			},
			/**
			 * @param {Object} item  确认维修单方法
			 */
			async confirm(item) {
				uni.navigateTo({
					url: '/pages2/order/repair/info?obj=' + encodeURIComponent(JSON.stringify(item))
				})
			},
			/**
			 * @param {Number} index 切换tabs状态 
			 */
			async sectionChange(index) {
				if (this.current == index) {
					return
				}
				this.current = index
				this._freshing = true 
				//显示加载框
				uni.showLoading({ title: '加载中' }); 
				await this.getlist() // 直接调用修改后的getlist方法
				uni.hideLoading(); 
				this._freshing = false
			},
			/**
			 * 去收货单页面
			 */
			toreceive(item) {
				uni.navigateTo({
					url: '/pages2/order/product/receive?obj=' + encodeURIComponent(JSON.stringify(item))
				})
			},
			/**
			 * @param {Object} item 跳转换件申请单界面
			 */
			toreplace(item) {
				uni.navigateTo({
					url: '/pages2/order/repair/errCheck?obj=' + encodeURIComponent(JSON.stringify(item))
				})
			},
			toreplaceA(item) {
				if(item.EDIT=='1'){
					item.item.EDIT=true;
					item =item.item;
				}
				item.status = 'changeProd'
				uni.navigateTo({
					url: '/pages2/order/repair/changeProd?obj=' + encodeURIComponent(JSON.stringify(item))
				})
			},
		async	GetASSIGNEND(FNUMBER){
			uni.showLoading()
			const {data}  =await this.$Recipe.GetASSIGNEND({FNUMBER});
			uni.hideLoading();
			let {FDISPOSITION,FCOMPLETEDTIME} = data[0];
				this.content = `驳回理由:${FDISPOSITION},<br>驳回时间:${FCOMPLETEDTIME}`
			},
			
			/**
			 * @param {Object} item  跳转报修单编辑页面
			 */
			commit(item) {
				if (item.isDraft) {
				    // 草稿工单，跳转到编辑页面并传递草稿数据
				    uni.navigateTo({
				      url: '/pages2/order/reportRepair/edit?obj=' + encodeURIComponent(JSON.stringify({
				        ...item,
				        isDraft: true,
				        draftData: item.draftData
				      }))
				    })
				  } else {
				    uni.navigateTo({
				      url: '/pages2/order/reportRepair/edit?obj=' + encodeURIComponent(JSON.stringify(item))
				    })
				  }
			},
			/**
			 *   send
			 */
			send(item) {
				uni.navigateTo({
					url: '/pages2/order/product/send?obj=' + encodeURIComponent(JSON.stringify(item))
				})
			},
			/**
			 * @param {Object} item  跳转到工单详情页面
			 */
			orderBtn(item) {
				if (item.billtype == 'baoxiu') {
					uni.navigateTo({
						url: '/pages2/order/reportRepair/info?obj=' + encodeURIComponent(JSON.stringify(item))
					});
				}
				if (item.billtype == 'weixiu') {
					uni.navigateTo({
						url: '/pages2/order/repair/info?obj=' + encodeURIComponent(JSON.stringify(item))
						// url: `/pages2/order/repair/repairInfo?obj=`+ encodeURIComponent(JSON.stringify(item))
					});
				}
			},
			/**
			 * 跳转到维修填写页面
			 */
			tosituation({FBillNo,FID,FWORKORDERNO1}) {
				// YH-20220419796
				uni.navigateTo({
					url: `/pages2/order/repair/situation?FBillNo=${FBillNo}&FID=${FID}&FWORKORDERNO1=${FWORKORDERNO1}`,
				});
			},
			/**
			 * 跳转到维修单费用界面
			 */
			tobill(item) {
				uni.navigateTo({
					url: '/pages2/order/repair/bill?obj=' + encodeURIComponent(JSON.stringify(item))
				});
			},
			/**
			 * 跳转到报修界面
			 */
			toCommitOrder() {
				uni.switchTab({
					url: '/pages/tabBar/order/index'
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
				
				let len =res.data.length;
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
				if(JSON.stringify(oldRoleList) == JSON.stringify(roleList)){
					return 
				} else{
					this.showLoginOut = true; 
					return 
				}
				 
			}, 
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #fff;
		position: relative;
		height: 100vh; 
	}

	.card {
		margin: 8px auto;
		box-sizing: border-box;
		padding: 14rpx 20rpx;
		font-size: 20rpx;
		background-color: #fff;
		box-shadow: 0 4rpx 8rpx 0 #e3eef5;
		border-radius: 10rpx;
		border: 4rpx solid #e3eef5;
		width: 95%;

		.head {
			margin: 16rpx 0 32rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 95% !important;

				.materiel-name {
					font-size: 32rpx;
					color: #030303;
					overflow:hidden;
					white-space: nowrap;//强制不换行 
					text-overflow: ellipsis;//文本溢出部分用...显示
				}
			}
		}

		.middle {
			margin-bottom: 8rpx;
			display: flex;
			flex-wrap: wrap;
			font-size: 26rpx;

			.item {
				padding-bottom: 8rpx;
				width: 50%;
				font-size: 24rpx;

				.left {
					padding-right: 16rpx;
					color: #707070;
				}

				.right {
					color: #666666;
				}
			}

			.new-item {
				padding-bottom: 16rpx;
				font-size: 32rpx;
				width: 100%;
				display: flex;
				align-items: center;

				image {
					width: 20px;
					height: 20px;
				}

				.left {
					padding-right: 16rpx;
					padding-left: 16rpx;
					color: #707070;
				}

				.right {
					color: #666666;
				}
			}

		}

		.bottom {
			display: flex;
			align-items: center;
			margin-top: 10rpx;
			.label-wrap {
				display: flex;
				margin-right: 20rpx;

				text {
					margin-right: 28rpx;
					padding: 6rpx 16rpx;
					display: flex;
					background: #169BD5;
					border-radius: 8rpx;
					font-size: 26rpx;
					height: 25px;
					color: #fff;
					justify-content: center;
					align-items: center;
				}
			}
		}

		&:first-child {
			margin-top: 0;
		}
	}

	.box-card {
		padding: 5px;
		margin: 10px;
		border: 1px solid #999;
	}

	.doing {
		color: #FFFFFF;
		background-color: #F0AD4E;
	}

	.addbtn {
		position: fixed;
		left: 10%;
		width: 80%;
		bottom: 10px;
		color: #FFFFFF;
		z-index: 99;
		background-color: #F0AD4E;
	}

	.service {
		width: 30%;
		font-size: 13px;
		right: -50%;
	}

	.card-actions-item {
		width: 50%;
		text-align: center;
		float: left;
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
	.scroll-h{
		position:fixed;
		z-index:99;
		top: 0;
		width: 100%;
	}
</style>
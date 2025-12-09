<template>

	<view class="page" style="padding-bottom: 65px;">
		<u-subsection :list="list" :current="current" @change="sectionChange"></u-subsection>
		
		<view v-if="current==0">
			
			 
			<!-- 故障检测结果 -->
			<uni-card :is-shadow="false" v-if=" allInfo.FFERRORTYPE.length>0 || info.FCHECKRESULT!= ' ' " title="故障检测结果">
				
				<uni-section title="故障类别" type="line"   v-if=" allInfo.FFERRORTYPE.length>0 ">
					 
					<view v-for="(item,index) in allInfo.FFERRORTYPE" :key='index'> {{item.FFERRORTYPE.FDataValue[0].Value}},</view>
				</uni-section>
				<uni-section title="检测结果" type="line" v-if="info.FCHECKRESULT">
					{{info.FCHECKRESULT}}
				</uni-section>
				<uni-section title="故障检测图片" type="line" v-if="info.JCTP.length != 0">
					<view class="img-box">
						<view class="img-box-gz" v-for="(item,index) in info.JCTP" :key='item.FattachmentName'  > <!-- v-if="item.des=='GZJCYMSC'" -->
							<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
								:src="item.FattachmentName" />
						</view>
					</view>
				</uni-section>
				<!-- {{info.JCSP}} -->
				<uni-section title="故障检测视频" type="line" v-if="info.JCSP.length != 0">
					<view class="img-box" v-for="(item,index) in info.JCSP" :key='index'> <!-- v-if="item.des=='GZJCYMSC'" -->
						<view class="img-box-gz">
							<video :src="item.FattachmentName" controls></video>
						</view>
					</view>
				</uni-section>
				<uni-section title="手续图片" type="line" v-if="info.SXTP.length != 0">
					<view class="img-box">
						<view class="img-box-gz" v-for="(item,index) in info.SXTP" :key='item.FattachmentName' >  <!-- v-if="item.des=='GZJCYMSC'" -->
							<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
								:src="item.FattachmentName" />
						</view>
					</view>
				</uni-section>

			</uni-card>

			</uni-card>
			
			<view v-if="allInfo.FFERRORTYPE.length == 0">
				<u-empty  mode="data" > </u-empty>
			</view>
		</view>
		
		<view v-if="current==1">
			<view v-if="_list.length>0">
			
				<view>
					<u-row style="padding: 0 20rpx;">
						<u-col span="12">
							<u-tabs :list="_list" keyName="FORDERNO" activeStyle="color:#3c9cff" :current='tabsIdx'
								@change='tabsChange'></u-tabs>
						</u-col>
					</u-row>
					<view class="body" v-for="(item,index) in _list" v-show="index==tabsIdx" :key="item.FORDERNOID">
						<view style="padding: 0 20rpx;">
							<u-row justify="space-between">
								<u-col span="4" style="font-weight: bold;">产品名称</u-col>
								<u-col textAlign="right" span="8">{{item.productname}}</u-col>
							</u-row>
						</view>


						<view style="margin-top: 20rpx;">
							<uni-collapse accordion v-model="repairPanel">
								<uni-collapse-item v-for="(item2,index2) in item.data" :key="index2" :name="'repairpanel'+'-'+index+'-'+index2" >
									<template v-slot:title>
										<view class="title_box">
											<view class="title_left u-page__item__title__slot-title">产品编号:</view>
											<view class="title_right">{{item2.FPRODUCTNUMBER1}}</view>
											<view class="weiXiu_fangan">
												<uni-easyinput class="disabled_class" disabled :value="'维修方案：'+item2.title" />
											</view>
										</view>
									</template>
									<view class="content">
										<view class="content_item" v-for="(item3,index3) in item2.data" :key="index3"
										v-if="item3.FWEIXIUSIN==2"
										>
											<u-tag class="tages"
												:text="item.FORDERNO+' >> '+(item2.FPRODUCTNUMBER1?item2.FPRODUCTNUMBER1:'--')+  ' >> 配件'+(index3+1)"
												plainsize="mini" />
											
											
												
											<uni-section title="服务站填报" type="line" >
												<u-cell title="配件名称" :value="item3.FPARTSNAMESTR" />
												<u-cell title="新配件数量" :value="item3.FQTY=='0'?'':item3.FQTY" /> 
												<u-cell title="故障原因件" :value="item3.FISERROR=='1'?'是' : item3.FISERROR=='0'?'不是':'-' " />  
												<u-cell title="新配件来源" :value="dd(item3.FNEWSOURCE)"  />
												<u-cell title="新配件订货号" :value="item3.F_ASSISTANT1?item3.F_ASSISTANT1:'-'" /> 
												<!-- <view v-if="item3.FNEWSOURCE =='3'">
													<u-cell title="有新配件编号" value="有" />
													<u-cell title="新配件编号" v-if="FNEWSOURCE =='3' " :value="item3.FSENDPRODUCTNUMBER1?item3.FSENDPRODUCTNUMBER1:''" />
												</view> -->
												<view v-if="item3.FNEWSOURCE !=='3'"> 
													<u-cell title="有新配件编号" :value="item3.FNEWSOURCECHECK=='1'?'有' : item3.FNEWSOURCECHECK=='0'?'没有':'没有' " /> 
													<u-cell title="新配件编号" v-if="item3.FNEWSOURCECHECK == '1' " :value="item3.FREMARKS?item3.FREMARKS:''" />
												</view> 
												
												
												<u-cell title="实际换件情况" v-if="current==2">
													<view slot="value">
														<span v-if="item3.FACTUALCHECK=='0'" style="color: #fa3534;">未换件</span>
														<span v-else style="color: #19be6b;">已换件</span>
													</view> 
												</u-cell>
											</uni-section>
											 
											<uni-section title="服务中心审核" type="line" bgcolor="cyan" v-if="item2.FDocumentStatus == 'C'">
												<view style="background-color: cyan;"> 
													<u-cell title="核定数量" :value="item3.FMIDCHECKNUMBER" /> 
													<!-- <u-cell title="新配件订货号" :value="item3.FPEIJIANFPARTSNAME?item3.F_ASSISTANT1:'-'" />  -->
													<!-- <view v-if="item3.FNEWSOURCE !=='3'">
														<u-cell title="有新配件编号" value="-" />
													</view> -->
													<view v-if="item3.FNEWSOURCE =='3'">
														<u-cell title="有新配件编号" :value="item3.FNEWSOURCECHECK=='1'?'有':'没有' " />
													</view>
													
													<u-cell title="是否旧件返还" :value="item3.FISRETURN=='1'?'是' : item3.FISRETURN=='0'?'否':'否' " /> 
													
													<u-cell title="是否补货" :value="item3.Freplenishment=='1' ? '是' : item3.Freplenishment=='0'?'否':'否' " /> 
													
													<u-cell title="是否结算" :value="item3.FNEWMATERALNUMBER=='1' ?'是' : item3.FNEWMATERALNUMBER=='0'?'否':'否' " /> 
												</view>		 
											</uni-section>
											 
										</view>
									</view>
								</uni-collapse-item>
							</uni-collapse>
						</view>
					</view>
				</view>
			</view>
			<view v-if="_list.length == 0">
				<u-empty  mode="data" > </u-empty>
			</view>
		</view>
		
		<view v-if="current==2 && _list.length>0">
			<view v-if="allInfo.FREPAIRDESC !== '' && allInfo.FREPAIRDESC !== ' ' ">
				<u-row style="padding: 0 20rpx;">
					<u-col span="12">
						<u-tabs :list="_list" keyName="FORDERNO" activeStyle="color:#3c9cff" :current='tabsIdx'
							@change='tabsChange'></u-tabs>
					</u-col>
				</u-row>
				<view class="body" v-for="(item,index) in _list" v-show="index==tabsIdx" :key="item.FORDERNOID">
					<view style="padding: 0 20rpx;">
						<u-row justify="space-between">
							<u-col span="4" style="font-weight: bold;">产品名称</u-col>
							<u-col textAlign="right" span="8">{{item.productname}}</u-col>
						</u-row>
					</view>
			
			
					<view style="margin-top: 20rpx;">
						<uni-collapse accordion v-model="repairPanel">
							<uni-collapse-item v-for="(item2,index2) in item.data" :key="index2" :name="'repairpanel'+'-'+index+'-'+index2" >
								<template v-slot:title>
									<view class="title_box">
										<view class="title_left u-page__item__title__slot-title">产品编号:</view>
										<view class="title_right">{{item2.FPRODUCTNUMBER1}}</view>
										<view class="weiXiu_fangan">
											<uni-easyinput class="disabled_class" disabled :value="'维修方案：'+item2.title" />
										</view>
									</view>
								</template>
								<view class="content">
									<view class="content_item" v-for="(item3,index3) in item2.data" :key="index3"
									v-if="item3.FWEIXIUSIN==2"
									>
										<u-tag class="tages"
											:text="item.FORDERNO+' >> '+(item2.FPRODUCTNUMBER1?item2.FPRODUCTNUMBER1:'--')+  ' >> 配件'+(index3+1)"
											plainsize="mini" />
										
										
											
										 
											<u-cell title="配件名称" :value="item3.FPARTSNAMESTR" /> 
											<u-cell title="更换数量" :value="item3.FMIDCHECKNUMBER" />
											<!-- <u-cell title="新配件数量" :value="item3.FQTY=='0'?'':item3.FQTY" /> -->
											<u-cell title="故障原因件" :value="item3.FISERROR=='1'?'是' : item3.FISERROR=='0'?'不是':'-' " />  
											<u-cell title="新配件来源" :value="dd(item3.FNEWSOURCE)"  />
											<u-cell title="新配件订货号" :value="item3.F_ASSISTANT1?item3.F_ASSISTANT1:'-'" />  
											<u-cell title="有新配件编号" :value="item3.FNEWSOURCECHECK=='1'?'有' : item3.FNEWSOURCECHECK=='0'?'没有':'没有' " />
											<view v-if="item3.FNEWSOURCE =='3'">
												<!-- <u-cell title="有新配件编号" value="有" /> -->
												<!-- <u-cell title="新配件编号"  :value="item3.FSENDPRODUCTNUMBER1?item3.FSENDPRODUCTNUMBER1:''" /> --> 
												<u-cell v-if="item3.FREMARKS" title="新配件编号"  :value="item3.FREMARKS" />
												<u-cell v-if="item3.FSENDPRODUCTNUMBER1" title="新配件编号"  :value="item3.FSENDPRODUCTNUMBER1?item3.FSENDPRODUCTNUMBER1:'-' " />
											</view>
											<view v-if="item3.FNEWSOURCE !=='3'">  
												<u-cell title="新配件编号" v-if="item3.FNEWSOURCECHECK == '1' " :value="item3.FREMARKS?item3.FREMARKS:'-'" />
											</view> 
											
											
											<u-cell title="实际换件情况" v-if="current==2">
												<view slot="value">
													<span v-if="item3.FACTUALCHECK=='0'" style="color: #fa3534;">未换件</span>
													<span v-else style="color: #19be6b;">已换件</span>
												</view> 
											</u-cell>
										 
										 
									</view>
								</view>
							</uni-collapse-item>
						</uni-collapse>
					</view>
				</view>
			</view>
			<view v-if="allInfo.FREPAIRDESC !== '' && allInfo.FREPAIRDESC !== ' ' ">
				<uni-section title="维修情况简介" type="line">
					<u-cell title="上门距离(Km)" v-if="allInfo.FWXCONFIRM=='1'" :value="allInfo.FDISTANCE" />
					<u-cell title="上门次数" v-if="allInfo.FWXCONFIRM=='1'" :value="allInfo.FDISTANCENUM?allInfo.FDISTANCENUM:1" />
				</uni-section>
				<view class="" style="display: flex;justify-content: center;">
					<textarea value="" v-model="allInfo.FREPAIRDESC" disabled style="border: 1px solid #cdcccc;margin-top: 10px;padding: 5px 5px 0 5px;
						border-radius: 10rpx;
						width: 90%;
						" />
				</view>
				<uni-section title="维修情况图片" type="line" v-if="info.WXQKIMAGE.length > 0">
					<view class="img-box">
						<view class="img-box-gz" v-for="(item,index) in info.WXQKIMAGE" :key='item.FattachmentName'>
							<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
								:src="item.FattachmentName" />
						</view>
					</view>
				</uni-section>
				<uni-section title="维修情况视频" type="line" v-if="info.WXQKVideo.length > 0">
					<view class="img-box" v-for="(item,index) in info.WXQKVideo" :key='index'>
						<view class="img-box-gz">
							<video :src="item.FattachmentName" controls></video>
						</view>
					</view>
				</uni-section>
			</view>	
			
			<view v-if="allInfo.FREPAIRDESC == '' || allInfo.FREPAIRDESC == ' ' ">
				<u-empty  mode="data" > </u-empty>
			</view>
			
		</view>
		
		<view v-if="current==3 && status!='Customer'">
			<view v-if=" priceList.length>0">
				<!-- 服务费明细 -->
				<view class="">
					<view class="title" style="padding:20px;margin-bottom: 10px;
					display: flex; justify-content: space-between; " >
						服务费明细 <text>单位: 元</text>
					</view>
				</view>
				<uni-table border stripe emptyText="暂无更多数据">
					<!-- 表头行 -->
					<uni-tr> 
						 
						<uni-th :align="align" :width="320">费用项目</uni-th> 
						<uni-th :align="align" :width="100">数量 * 单价</uni-th>
						<uni-th :align="align" :width="100">金额</uni-th>
						<uni-th :align="align" :width="100">核定费用</uni-th>
						<uni-th :align="align" :width="120">备注</uni-th>
							
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item,index) in priceList" :key='index'>  
							<uni-td :align="align">{{item.FEXPENSEITEM.FREPAIRITEM}}</uni-td>
							<uni-td :align="align"> <span style="color: #000;">{{item.FQTY==0?1:item.FQTY }} </span>  *  <span style="color: #000;">{{item.FPRICE }} </span>  </uni-td>
							<uni-td :align="align"> {{item.FAMOUNT}} </uni-td> 
							<uni-td :align="align"> 
								<span v-if="item.FAMOUNT == item.FCHECKAmount" style="color: blue;">{{item.FCHECKAmount>-1 ? item.FCHECKAmount :'待审'}} </span>
								<span v-if="item.FAMOUNT!== item.FCHECKAmount" style="color: red;">{{item.FCHECKAmount>-1 ? item.FCHECKAmount :'待审' }} </span>
								 
							</uni-td> 
							<uni-td :align="align">
								<u-button type="primary" size="small" text="查看" @click="showMK(item.FCOSTREMARK)" ></u-button>  
							</uni-td>
					</uni-tr> 
				</uni-table>
				<!-- 总费用小计 -->
				<view class="total" style="padding: 20px 10px;"> 
					<view style="padding: 10px 20px;">
						<view style="display: flex;justify-content: space-between;margin: 15px 0;">
							<text>服务上报费用</text>
							<text>{{getPrice()}}</text>
						</view>
					</view>
					<view style="padding: 10px 20px;">
						<view style="display: flex;justify-content: space-between;margin: 15px 0;color: #fa3534;">
							<text>核定服务费用</text>
							<text>{{getPriceA()}}</text>
						</view>
					</view>
				</view> 
				
			 
				
				<uni-section title="费用附件" type="line">
					<view class="img-box">
						<view class="img-box-gz" v-for="(item,index) in info.COSTIMAGE" :key='item.FattachmentName'>
							<image class="image" @click='previewImg(item.FattachmentName)' mode="widthFix"
								:src="item.FattachmentName" />
						</view>
					</view>
				</uni-section>

			</view>
			
			<view v-if=" priceList.length == 0 ">
				<u-empty  mode="data" > </u-empty>
			</view>
		</view>
	  
		  <u-modal :show="showModal" title="备注信息"  @confirm="showModal = false" >
			<view class="slot-content" style="width: 100%;"> 
				<view style="min-height:140px ;" >  
					<u--textarea v-model="mark" :placeholder="mark" :maxlength='-1' disabled :height="textareaH"  ></u--textarea> 
				</view> 
			</view> 
		  </u-modal>
	</view>
</template>
<script>
	const fanganList = [
		[{
				title: "不符合三包",
				id: "1"
			},
			{
				title: "更换配件",
				id: "2"
			},
			{
				title: "直接维修",
				id: "3"
			},
		]
	];
	const radioList = [{
			"value": 1,
			name: '重油预投件'
		},
		{
			"value": 2,
			name: '服务站自备件'
		},
		{
			"value": 3,
			name: '重油调货'
		}
	];
	import {
		FISSPP
	} from '@/common/SDK/tools/enum.js'

	export default {
		data() {
			return {
				showModal:false, 
				status:'',
				align:'center',
				textareaH:140,
				mark:'',
				tabsIdx: 0,
				list: ['故障检测结果', '维修方案', '维修情况', '维修费用'],
				current: 0, //当前状态
				allInfo: [],
				info: null,
				priceList: [],
				JCTP:[],//检测图片
				JCSP:[],//检测视频    // //JCTP JCSP SXTP
				SXTP:[],//手续图片

				_list: [],
				repairPanel:'',
			};
		},
		/**
		 */
		onLoad: async function(option) {
			// option.WXD = "WXD_202204240006";
			// option.YH = "FW-20220424591";
			uni.showLoading({ title: '加载中' }); 
			this.WXD = option.WXD;
			this.YH = option.YH;
			this.status = uni.getStorageSync('customertype')
			//详情
			let result = await this.$Recipe.getSelectRepairOrderDetailByFBillNo({
				FBillNo: this.WXD
			})
			let result2 = await this.$Recipe.GetWeiXiuDetail({
				fnumber: this.WXD
			})
			this.allInfo = result2.data;
			
			let _info = result.data[0];
			
			
			_info.JCTP = []; //检测图片
			_info.JCSP = []; //检测视频
			_info.SXTP = []; //手续图片 
			_info.GMPZ = []; //购买凭证

			_info.FGUZHANINFOLIST = [];
			_info.WXQKIMAGE = []; //维修情况图片
			_info.COSTIMAGE = []; //维修费用图片
			_info.WXQKVideo = []; //维修情况视频 
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
							case "COST":
							//维修费用图片/
							_info.COSTIMAGE.push(item);
							
							break;
						case "JCTP":
							//检测图片/
							_info.JCTP.push(item);
					 		break;
						case "JCSP":
							//检测视频/
							_info.JCSP.push(item);
					 		break;
						case "SXTP":
							//手续图片/
							_info.SXTP.push(item);
					 		break;



						default:
							break;
					}
				}
			})
			this.info = _info; 
			//故障检查情况
			//维修方案
			const result3 = await this.$Recipe.changeProdcInfo({
				FBillNo: this.YH
			});
			const _list = result3.data.Prodcuts;
			 
			this.$nextTick(() => {
				_list.map(item => {
					item.data.map(sitem => {
						
						 
						sitem.data.map(ssitem => {
							ssitem.sourceTitle = this.dd(ssitem.FNEWSOURCE);
							ssitem.FWEIXIUPRODUCT = sitem.FPRODUCTNUMBER1;
							ssitem.FORDERNO = item.FORDERNO;
							// ssitem.FACTUALCHECK = item.FACTUALCHECK;
							// if (!ssitem.FACTUALCHECK) {
							// 	ssitem.FACTUALCHECK = "1"
							// }
						})
						if(sitem.data[0].FWEIXIUSIN == '' || sitem.data[0].FWEIXIUSIN == ' '){
								sitem.title = '未选择';
						}else{ 
							fanganList[0].map(ssitem => { 
								if (ssitem.id == sitem.data[0].FWEIXIUSIN) { 
									sitem.title = ssitem.title?ssitem.title:'1';
								} 
							});
						}	 

					})
					
				})
				this._list = _list; 
			})

			//维修情况

			//费用清单
			this.priceList = result2.data.TESU_REPAIRORDER_ENTRY
			this.repairPanel = `repairpanel-0-0` 
			
			uni.hideLoading(); 
		},
		methods: {
			showMK(content) { 
				this.mark = content 
				this.showModal = true  
			},
			/**
			 * 确定点击
			 */
			confirmModel(){ 
				let index = this.indexTag ;
				if(this.tag == 1){
					this.content = Number(this.content)
					this.service[index].FQTY = this.content
					this.service[index].FAMOUNT = this.getTotal(index); 
				}
				if(this.tag == 2){
					this.service[index].mark = this.mark 
				} 
				this.showModal = false 
			},
			// tabs状态改变
			tabsChange({
				index
			}) {
				this.tabsIdx = index
			},
			dd(id) { 
				let t;
				radioList.map(item => {
					if (id == item.value) {
						t = item.name
					}
				})
				return t
			},
			/**
			 * @param {Number} index 切换tabs状态 
			 */
			async sectionChange(index) {
				if (this.current == index) {
					return
				}
				this.current = index
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
			/**
			 * 获取服务费表格小计
			 */
			getPrice() {
				let total = 0
				this.priceList.forEach(item => {
					
					if (!parseFloat( item.FAMOUNT)) {
						return
					}
					let price = parseFloat(item.FPRICE);
					if(price==0){
						total +=  parseFloat( item.FAMOUNT )
					}else{
						let num = item.FQTY==0?1:item.FQTY;
						let FAMOUNT= num*price 
						total += FAMOUNT
						// console.log(item.FAMOUNT,'--->',num,price,FAMOUNT,'--->',total)
					} 
					
					// if (!Number(item.FAMOUNT)) {
					// 	return
					// }
					// total += parseFloat(item.FAMOUNT)
				})
				return total
			},
			getPriceA(){
				
				let total = 0
				let isAuth = 0;
				this.priceList.forEach(item => {
					if (!Number(item.FCHECKAmount)) {
						return
					}
					if(parseFloat(item.FCHECKAmount) < 0){
						isAuth++ ;
					}
					total += parseFloat(item.FCHECKAmount)
					// console.log(item.FCHECKAmount,'--->',total)
				})
				if(isAuth>0){
					total = '待审'
				} 
				return total
				// console.log(this.priceList)
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

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		border-radius: 10px;
		background-color: #169BD5;
		width: 150px;
		height: 40px;
		margin: 50px auto;
	}

	.mark {
		margin-top: 20rpx;
	}

	.mark .title {
		padding-left: 30rpx;
		font-weight: bold;
		line-height: 60rpx;
		color: #000;
	}


	.content {
		background-color: #efefef;
		padding-top: 10rpx;
	}

	.u-slot-title {
		display: flex;
		align-items: center;
	}

	.body {
		margin-top: 10rpx;
		border-top: 1rpx solid #dee3c1;
		padding-top: 20rpx;
	}

	.page {
		height: 100vh;
		padding-bottom: 40px;
		// padding: 0 20rpx;
	}

	/deep/ .u-cell__body.data-v-1c4434ae {
		padding: 10rpx 25rpx !important;
	}

	/deep/ .u-cell__title-text.data-v-1c4434ae {
		font-size: 24rpx;
	}

	.title_box {
		position: relative;
		padding-left: 30rpx;
		line-height: 80rpx;
		background-color: #fff;
		color: #000;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.content_item {
		margin: 20rpx;
		padding: 10rpx 0;
		padding-top: 0;
		border: 1rpx solid #3c9cff;
		border-radius: 10rpx;
		position: relative;
		background-color: white;
	}

	.tages {
		position: absolute;
		left: 0;
		top: 0;
	}

	.title_right {
		padding-left: 10rpx;
		font-size: 26rpx;
	}

	.weiXiu_fangan {
		position: absolute;
		right: 20rpx;
		width: 300rpx;
		height: 76rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	/deep/ .uni-easyinput__content,
	.data-v-abe12412 .is-input-border .is-disabled,
	.disabled_class {
		width: 100% !important;
		height: 100% !important;
		border: none !important;
		background-color: white !important;
	}
</style>

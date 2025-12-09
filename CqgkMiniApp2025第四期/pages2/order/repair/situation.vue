<template>
	<view class="page">
		<u-row style="padding: 0 20rpx;">
			<!-- 	<u-col span="2" textAlign="center">
				<view class="demo-layout" style="font-weight: bold;">订单号</view>
			</u-col> -->
			<u-col span="12">
				<u-tabs :list="list" keyName="FORDERNO" activeStyle="color:#3c9cff" :current='tabsIdx'
					@change='tabsChange'></u-tabs>
			</u-col>
		</u-row>
		<view class="body" v-for="(item,index) in list" v-show="index==tabsIdx" :key="item.FORDERNOID">
			<view style="padding: 0 20rpx;">
				<u-row justify="space-between">
					<u-col span="4" style="font-weight: bold;">产品名称</u-col>
					<u-col textAlign="right" span="8">{{item.productname}}</u-col>
				</u-row>
			</view>


			<view style="margin-top: 20rpx;">
				<uni-collapse accordion>
					<uni-collapse-item v-for="(item2,index2) in item.data" :key="index2">
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
							<view class="content_item" v-for="(item3,index3) in item2.data" :key="index3" v-if="item3.FWEIXIUSIN =='2'">
								<u-tag class="tages" 
								:text="item.FORDERNO+' >> '+(item2.FPRODUCTNUMBER1?item2.FPRODUCTNUMBER1:'--')+  ' >> 配件'+(index3+1)" 
								plainsize="mini" />
								<u-cell title="配件名称" :value="getPartsName(item3)"  />
								<u-cell title="规格型号" :value="getSpecification(item3)"  />
								<u-cell title="更换数量" :value="item3.FMIDCHECKNUMBER=='0'?'':item3.FMIDCHECKNUMBER"  />
								<!-- <u-cell title="新配件来源" :value="item3.sourceTitle"  /> -->
								<u-cell title="新配件来源" :value="dd(item3.FNEWSOURCE)"  />
								
								<u-cell title="新配件订货号" :value="getOrderNo(item3)"  />
								<u-cell title="有新配件编号" :value="item3.FNEWSOURCECHECK=='1'?'有' : item3.FNEWSOURCECHECK=='0'?'没有':'没有'"  />
								<u-cell v-if="item3.FNEWSOURCE !== '3' && item3.FNEWSOURCECHECK == '1'"> 
									<view slot="title" class="u-slot-title" >
										<text class="u-cell-text" style="font-size: 30rpx;width: 160px;color: red;">
											新配件编号 
										</text>
										<u-input placeholder="请输入新配件编号" v-model="list[index].data[index2].data[index3].FREMARKS"  border="surround" inputAlign="right"  ></u-input>
									</view>
									
									<!-- <u-cell title="新配件编号" v-if="item3.FNEWSOURCECHECK == '1'  " :value="item3.FREMARKS?item3.FREMARKS:''"   /> -->
									
								</u-cell>
								<u-cell  v-if="item3.FNEWSOURCE == '3' && item3.FNEWSOURCECHECK == '1'" >
									<view slot="title" class="u-slot-title" >
										<text class="u-cell-text" style="font-size: 30rpx;width: 160px;color: red;">
											 新配件编号
										</text>
										<u-input placeholder="请输入新配件编号"  v-model="list[index].data[index2].data[index3].FSENDPRODUCTNUMBER1" border="surround" inputAlign="right"  ></u-input>
									</view>
								</u-cell>
								<u-cell title="实际换件情况" @click="showIna({index,index2,index3})" isLink  v-if="item2.title == '直接维修'">
									<view slot="value"> 
										<span  style="color: #19be6b;" >不换件</span>
									</view> 
								</u-cell>
								
								<u-cell @click="showIna({index,index2,index3})" isLink v-if="item2.title !== '直接维修'">
								  <view slot="title">
								    <text v-if="item2.title == '更换配件' && item3.FNEWSOURCE == '2'" style="color: red;">*</text>
								    <text> 实际换件情况</text>
								  </view>
								  <view slot="value">
								    <!-- 维修方案是更换配件且新配件来源是服务站自备件时，显示红色提示 -->
								    <span v-if="item2.title == '更换配件' && item3.FNEWSOURCE == '2' && (item3.FACTUALCHECK === '' || item3.FACTUALCHECK === null)" 
								          style="color: #ff0000; font-weight: bold;">请选择</span>
								    <span v-else-if="item3.FACTUALCHECK =='0'" style="color: #fa3534;">未换件</span>
								    <span v-else-if="item3.FACTUALCHECK =='1'" style="color: #19be6b;">已换件</span>
								    <span v-else style="color: #ff0000;">请选择</span>
								  </view>
								</u-cell>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>


		</view>


    <view class="mark" v-show="isshow">
			<view class="title">
				<span style="color: red;">*</span>维修情况描述
			</view>
			<!-- 填写简介框 -->
			<view class="" style="display: flex;justify-content: center;">
				<textarea value="" v-model="params.introduc" placeholder="请填写整个三包处理过程及结果，如拆下油泵，上试验台重新调试，装机试车正常。"
					style="border: 1px solid #cdcccc;margin-top: 10px;padding: 5px 5px 0 5px;
					border-radius: 10rpx;
					width: 90%;
					" />
			</view>
			<!-- 上传图片框 -->
			<view class="title">
				<span style="color: red;">*</span>维修情况图片
			</view>
			<view class="img-box" style="width: 90%;margin: 10px auto;">
				<u-upload class="img-box-cp" :fileList="fileList1" :previewFullImage="true" @afterRead="afterRead"
				uploadText="图片"
					@delete="deletePic" name="1" :multiple='true' :maxCount="3"></u-upload>
					</view>
					<view class="title">
						维修情况视频
					</view>
					<view class="img-box" style="width: 90%;margin: 10px auto;">
					<u-upload class="img-box-cp" :previewFullImage='false' @click.native="preVideo" :useBeforeRead='true' 
						@clickPreview='preVideo' uploadText="视频" accept="video" :fileList="fileList2" 
						@afterRead="afterRead" @delete="deletePic" @beforeRead='beforeReadHandler'  name="2" 
						:multiple='false' :maxCount="3">
					</u-upload>
			</view>
	
		<view class="btn" style="" @click="submit">
					确认提交
				</view>
		</view>
		<u-popup :show="show2" :round="10" mode="center" @close="videoclose">
			<view class="" style="display: flex;justify-content: center;align-items: center;">
				<video :src="fileList2[0].url" ref='video' controls></video>
			</view>
		</u-popup>
	<u-picker :show="show1" :closeOnClickOverlay='true' @cancel='show1=false' @close='show1=false'
			@confirm='AssistantDataConfirm' :columns="[inaList]" keyName="title"></u-picker>

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
		export default {
			data() {
				return {
					show1:false,
					show2:false,
					 inaList:[
						 {title:"未换件",id:"0"},
						 {title:"已换件",id:"1"},
					 ],
					formData: {
						FileFIDS: [] // 上传图片接口返回
					},
					item: null,
					fileList1: [], // 图片列表数组
					fileList2: [], // 视频
					FBillNo: '', // 订单号
					FID:'',
					FWORKORDERNO1:'',
					tabsIdx: 0, //选中下标
					list: [],
					indexs:{
						
					},
					isshow:false,
					params:{
						introduc:'',
					},
					
					imgs:[],
					videoUrl:'',
					videos:[]
				}
			},
			/**
			 * 获取路由过来的订单号
			 */
			onLoad(option) {
				// return;
				this.FBillNo = option.FBillNo;
				this.FID = option.FID;
				this.FWORKORDERNO1 = option.FWORKORDERNO1;
				this.getData(option.FWORKORDERNO1);
			},
			methods: {
				setInputValNow(e){
					console.log(e)
				},
				preVideo(url) { 
					if (this.fileList2.length == 0 || this.videos.length == 0) {
						return
					}
					
					// this.videoUrl = url
					this.show2 = true;
				},
				
				videoclose() {
					this.show2 = false;
					// this.videoUrl = ''
				},
				
			showIna(obj){
				this.indexs = obj
				this.show1 = true;
			},
			AssistantDataConfirm(e){
				const { title,id } = e.value[0];
				const {index,index2,index3} = this.indexs;
				console.log('-----',id)
				this.list[index].data[index2].data[index3].FACTUALCHECK =id;
				console.log(this.list)
				this.show1 = false;
			}
			,
				//通过FBillNo获取数据
				async getData(FWORKORDERNO1) {
					const result = await this.$Recipe.changeProdcInfo({
						FBillNo:FWORKORDERNO1
					});
					const list = result.data.Prodcuts;
					
					this.$nextTick(()=>{     
						list.map(item => {
							item.data.map(sitem => {
								sitem.data.map(ssitem=>{
									ssitem.sourceTitle = this.dd(ssitem.FNEWSOURCE);
									ssitem.FWEIXIUPRODUCT = sitem.FPRODUCTNUMBER1;
									ssitem.FORDERNO = item.FORDERNO;
									// if(!ssitem.FACTUALCHECK){
										ssitem.FACTUALCHECK=""
									// }
									ssitem.FSENDPRODUCTNUMBER1 = sitem.FSENDPRODUCTNUMBER1?sitem.FSENDPRODUCTNUMBER1:'';
									// 如果K3数据中有新配件编号，使用K3的数据作为默认值
									if (ssitem.FPARTSNAME && ssitem.FPARTSNAME.FNEWNUMBER && !ssitem.FREMARKS) {
										ssitem.FREMARKS = ssitem.FPARTSNAME.FNEWNUMBER;
									}
									// 如果K3数据中有新配件订货号，使用K3的数据
									if (ssitem.FPARTSNAME && ssitem.FPARTSNAME.F_ASSISTANT1 && !ssitem.F_ASSISTANT1) {
										ssitem.F_ASSISTANT1 = ssitem.FPARTSNAME.F_ASSISTANT1;
									}
								})
								fanganList[0].map(ssitem => {
									if (ssitem.id == sitem.data[0].FWEIXIUSIN) {	sitem.title = ssitem.title;}});
									this.isshow =true
								   
							})
						})
						this.list = list;
						// this.list = Object.assign({},this.list)
					}) 
				},
				/**
				 * 提交方法
				 */
				async submit() {
					let Prodcuts=[];
					let list= [...this.list]
					let tag = 0 ;
					let stat = 0 ;
					
					
					list.map((item,index)=>{
						let obj = {
							data:[]
						};
						Prodcuts.push(obj)
						item.data.map((sitem=>{
							sitem.data.map(ssitem=>{
								delete ssitem.sourceTitle;  
								Prodcuts[index].data.push(ssitem)
								
								if(ssitem.FNEWSOURCECHECK =='1'){ 
									if(ssitem.FNEWSOURCE !== '3'){ //服务站自备件，重邮预投件
										if(ssitem.FREMARKS == '' || ssitem.FREMARKS ==' ' ){
											// console.log('FNEWSOURCECHECK==1------', ssitem ,'FREMARKS==1------',ssitem.FREMARKS)
											tag++
										} 
									}
									if(ssitem.FNEWSOURCE == '3'){ //重邮调货
										if(ssitem.FSENDPRODUCTNUMBER1=='' || ssitem.FSENDPRODUCTNUMBER1 ==' ' ){
										// console.log('FNEWSOURCECHECK==1------', ssitem,'FSENDPRODUCTNUMBER1==1------',ssitem.FSENDPRODUCTNUMBER1 )
											tag++
										} 
									  }
									}
									
									// 实际换件情况验证
									 // 维修方案是更换配件且新配件来源是服务站自备件，必须填写
									 if (sitem.title == '更换配件' && ssitem.FNEWSOURCE == '2') {
									     if (ssitem.FACTUALCHECK === '' || ssitem.FACTUALCHECK === null || ssitem.FACTUALCHECK === undefined) {
									        stat++
									}
								}
									// 其他需要填写实际换件情况的情况
									else if (ssitem.FNEWSOURCECHECK == '1' && (ssitem.FACTUALCHECK === '' || ssitem.FACTUALCHECK === null || ssitem.FACTUALCHECK === undefined)) {
									    stat++
									}
							})
						}))
					})
					
					 console.log('验证结果:', { tag, stat }); 
					
					if(tag>0){
						uni.showToast({
							icon: 'none',
							title: '请录入新配件编号！'
						})
						return
					}
					
					if(stat>0){
						uni.showToast({
							icon: 'none',
							title: '请确定实际换件情况！'
						})
						return
					}
					if (!this.params.introduc) {
						uni.showToast({
							icon: 'none',
							title: '请填写维修情况描述' 
						})
						return;
					}
					//检查是否上传了维修情况图片
					if (this.fileList1.length === 0) {
						uni.showToast({
						    icon: 'none',
							title: '请上传维修情况图片'
						})
						return;
					}
					 
					let obj = {
						FBillNo: this.FBillNo,
						introduc: this.params.introduc,
						FileFIDS: [...this.imgs,...this.videos],
						FID:this.FID,
						FWORKORDERNO1: this.FWORKORDERNO1,
						Prodcuts,

					} 
					
					console.log('========== 维修情况填写页面 - 提交参数 ==========')
					console.log('页面: pages2/order/repair/situation.vue')
					console.log('提交参数对象:', JSON.stringify(obj, null, 2))
					console.log('Prodcuts 详情:', JSON.stringify(Prodcuts, null, 2))
					console.log('Prodcuts 数组长度:', Prodcuts ? Prodcuts.length : 0)
					console.log('FileFIDS 数组长度:', obj.FileFIDS ? obj.FileFIDS.length : 0)
					console.log('================================================')
					
					const result = await this.$Recipe.UpdateRepairOrder(obj)
					console.log('========== 维修情况填写页面 - 接口响应 ==========')
					console.log('响应结果:', result)
					console.log('响应码:', result ? result.code : '无响应')
					console.log('响应消息:', result ? result.msg : '无响应')
					console.log('================================================')
					if (result.code == 200) {
						uni.switchTab({
							url: '/pages/tabBar/report/index',
							success() {
								uni.showToast({
									icon: 'none',
									title: '维修情况已提交'
								})
							}
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '维修情况填写失败'
						})
					}

				},
				/**
				 * 删除图片方法
				 */
				deletePic(event) {
					
					
					this[`fileList${event.name}`].splice(event.index, 1)
					if (event.name == '1') {
						this.inaList.splice(event.index, 1)
					}
					if (event.name == '2') {
						this.videos.splice(event.index, 1)
					}
					this.$Recipe.DeleteFile( {FID:event.file.FID})
				
				},
				
				
				beforeReadHandler(file, lists, name) {},
				/**
				 * 新增方法
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
						const result = await this.uploadFilePromise(lists[i].url,event.name=='1'?"WXTP":"WXSP")
						try {
							JSON.parse(result).data.FID
						} catch (e) {
							console.log(e, 'ssssssssss')
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
				this.imgs.splice(0)
			}
			if (event.name == '2') {
				this.videos.splice(0)
			}
					this[`fileList${event.name}`].forEach(item => {
						let obj = {
							"FID": item.FID,
							 des :"维修情况"
						}
						if (event.name == '1') {
							this.imgs.push(obj)
						}
						if (event.name == '2') {
							this.videos.push(obj)
						}
					
					})
				},
				/**
				 * 上传图片方法
				 */
				uploadFilePromise(url,type) {
					return new Promise((resolve, reject) => {
						let a = uni.uploadFile({
							url: 'https://cy.klwsxx.com/File/FileUpload',
							filePath: url,
							name: 'FileName',
							formData: {
								type: `WXQKYMSC_${type}`,
							},
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

				dd(id) {
					let t ;
					radioList.map(item=>{
						if(id==item.value){
							t = item.name
						}
					})
					return t
				},
				/**
				 * 获取K3配件名称
				 */
				getPartsName(item3) {
					// 优先使用K3数据中的配件名称
					if (item3.FPARTSNAME && item3.FPARTSNAME.Name && item3.FPARTSNAME.Name[0] && item3.FPARTSNAME.Name[0].Value) {
						return item3.FPARTSNAME.Name[0].Value
					}
					// 如果没有K3数据，使用字符串字段作为后备
					return item3.FPARTSNAMESTR || '-'
				},
				/**
				 * 获取K3规格型号
				 */
				getSpecification(item3) {
					// 从K3数据中获取规格型号
					if (item3.FPARTSNAME && item3.FPARTSNAME.Specification && item3.FPARTSNAME.Specification[0] && item3.FPARTSNAME.Specification[0].Value) {
						return item3.FPARTSNAME.Specification[0].Value
					}
					return '-'
				},
				/**
				 * 获取新配件订货号（从K3数据中获取）
				 */
				getOrderNo(item3) {
					// 优先使用K3数据中的订货号
					if (item3.FPARTSNAME && item3.FPARTSNAME.F_ASSISTANT1) {
						return item3.FPARTSNAME.F_ASSISTANT1
					}
					// 如果没有K3数据，使用原有字段作为后备
					return item3.F_ASSISTANT1 ? item3.F_ASSISTANT1 : '-'
				},

				// tabs状态改变
				tabsChange({
					index
				}) {
					this.tabsIdx = index
				}
			}
		}
</script>

<style scoped lang="scss">
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
	.mark .title{
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

<template>
	<view class="page" style="position: relative;">
		<view class="" style="padding: 0 15px;" v-show="onShowNow">
			<!-- 切换产品 -->
			<!-- <u-tabs :list="list2" itemStyle="font-size:18px;height:30px" :current='tabIndex' @change='prodChange'>
			</u-tabs> -->

			<u-row style="padding: 0 20rpx;">
				<u-col span="12">
					<u-tabs :list="list2" activeStyle="color:#3c9cff" :current='tabsIdx' @change='prodChange'></u-tabs>
				</u-col>

				<!-- <u-col span="12">
					<u-tabs :list="_list" keyName="FORDERNO" activeStyle="color:#3c9cff" :current='tabsIdx' @change='tabsChange'></u-tabs>
				</u-col> -->

			</u-row>

			<!-- 产品信息 -->
			<view style="padding: 5px 10px;">
				<view class="">
					<view class="item" style="display: flex;justify-content: space-between;margin: 8px 0;">
						<text>产品名称</text>
						<text>{{list2[tabIndex].productname}}</text>
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" style="height: calc(100% - 134px );" v-show="onShowNow">
			<view v-for="(item,index) in list2" :key='index' v-show="tabIndex == index">


				<uni-collapse :ref='"collapse"+tabIndex+"-"+index' accordion v-model="foldedPanel">
					<uni-collapse-item v-for="(item2,index2) in item.data" :key="item2.FORDERNO"
						:name="'panel'+'-'+index+'-'+index2">
						<template v-slot:title>
							<view class="title_box">
								<view class="title_left u-page__item__title__slot-title">产品编号:</view>
								<view class="title_right">{{item2.FPRODUCTNO}}</view>
								<view class="weiXiu_fangan" @click.stop="showFangAnList(index,index2)">
									<uni-easyinput class="disabled_class" disabled placeholder="选择维修方案"
										:value="item2.title" />
								</view>
							</view>
						</template>




						<view class="content">
							<uni-list>
								<view class="add" v-if="item2.FangAnId=='2'">
									<!-- 选择更换配件才显示 -->
									<text style="color: #000000;font-weight: bold;">更换产品明细</text>
									<text @click="add(index,index2)">+增加更换件</text>
								</view>

							</uni-list>
							<view style="padding: 10px;" v-for="(item3,index3) in item2.children" :key="item3.id">
								<!-- 修改配件信息 -->
								<!-- {{ item.F_ASSISTANT +'-------'}} -->


								<changeProdCmp :ref='"cmp"+ tabIndex+"-"+index+"-"+index2+"-"+index3' :producInfo='{productname:item.productname,productnumber:item.productnumber,name:item.name,tipFPRODUCTNO:item2.FPRODUCTNO,F_ASSISTANT:item.F_ASSISTANT,
								FangAnId:item2.FangAnId
								}' :isEdit='isEdit' :item2='item2' :item="item3" :number='item.F_ASSISTANT' :minIndex="index3"
									:bigIndex="index" :maxIndex="index2" @changeBoxHeight="changeBoxHeight"
									@close='decrement' :key='item3.id' />
							</view>

						</view>


					</uni-collapse-item>

				</uni-collapse>




			</view>
			<view class="" style="height: 55px;">

			</view>

			<view
				style="display: flex;justify-content: space-around; position: fixed;bottom: 30px;z-index: 10;width: 100%;border:1px solid #169BD5;border-radius:6px">
				<!-- 保存按钮 -->
				<view class="btn" @click="submit('A')"
					style="width: 50%;height: 35px;background-color: #FFFFFF;color: black;border-radius: 5px;display: flex;justify-content: center;align-items: center;">
					保存维修方案
				</view>
				<!-- 提交按钮 -->
				<view @click="submit('B')" class="btn"
					style="width: 50%;height: 35px;background-color: #169BD5;color: #fff;border-radius: 5px;display: flex;justify-content: center;align-items: center;">
					确认提交
				</view>
			</view>


		</scroll-view>
		<u-picker :show="show1" :closeOnClickOverlay='true' @cancel='show1=false' @close='show1=false'
			@confirm='AssistantDataConfirm' :columns="fanganList" keyName="title"></u-picker>

		<!-- 保存确认 -->
		<u-modal :show="show5" :closeOnClickOverlay="true" :showCancelButton="true" @confirm="commit()" :title="'确认提交'"
			@cancel="show5=false" @close="show5=false"></u-modal>

	</view>
</template>

<script>
	import changeProdCmp from './changeProdCmp.vue';
	export default {
		components: {
			changeProdCmp
		},
		data() {
			return {
				show1: false,
				onShowNow: false,
				value: '', //FBillNo
				info: {}, //列表中info信息
				tabsIdx: 0,
				tabIndex: 0,
				fanganList: [
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
				],
				list2: [],
				isEdit: false,
				show5: false,
				currentListIndex: '', //弹起更换配件所在的下标
				// 维修方案下标
				foldedPanel: '', //折叠面板key

				tindex: 0, //订单号级别
				tindex2: '', //产品级别下标
				tindex3: '', //
				stype: 'A',
				allInfo: [],
			}
		},
		created() {

		},
		async onLoad(option) {

			let that = this;
			if (!option.obj) {
				return
			}
			this.onShowNow = false;
			uni.showLoading();
			let value = JSON.parse(decodeURIComponent(option.obj))

			value.productiids = value.productiids.map((item, index) => {
				switch (item.Fnumber) {
					case 'PDON.01':
						item.Fnumber = 'JXYB'
						break;
					case 'PDON.02':
						item.Fnumber = 'JXPYQ'
						break;
					case 'PDON.03':
						item.Fnumber = 'GGYB'
						break;
					case 'PDON.04':
						item.Fnumber = 'GGG'
						break;
					case 'PDON.05':
						item.Fnumber = 'GGPYQ'
						break;
					case 'PDON.06':
						item.Fnumber = 'ECU'
						break;
					case 'PDON.07':
						item.Fnumber = 'OTHER'
						break;
				}
				return item
			})
			this.info = value;

			console.log("onload,info--", this.info)
			let prodList = [];
			const res2 = await this.$Recipe.changeProdcInfo1({
				FBillNo: this.info.FBillNo
			});
			console.log('【接口 changeProdcInfo1 完整返回】', res2);
			console.log('【Prodcuts】', res2?.data?.Prodcuts);
			
			if (Array.isArray(res2?.data?.Prodcuts)) {
			  const other = res2.data.Prodcuts.find(p => 
			    p.F_ASSISTANT === '其他配件' || 
			    p.Fnumber === 'OTHER' ||
			    p.name === '其他配件'
			  );
			  console.log('【其他配件-接口原始数据】', other);
			}
			if (res2.data !== '') {
				//新增  
				prodList = res2.data.Prodcuts;
				console.log('走新增分支 prodList：', prodList);

				prodList.map((item, index) => {
					item.name = item.FORDERNO;
					item.data.map((sitem, sindex) => {
						sitem.children = [];
						sitem.FangAnId = '';
						sitem.id = sindex + '30';

					})

				})
				console.log('【处理后的 prodList】', prodList);
				
				const other2 = prodList.find(p =>
				  p.F_ASSISTANT === '其他配件' ||
				  p.Fnumber === 'OTHER' ||
				  p.name === '其他配件'
				);
				console.log('【处理后-其他配件】', other2);
			} else {
				this.isEdit = true;
				// 修改
				const res = await this.$Recipe.changeProdcInfo({
					FBillNo: this.info.FWORKORDERNO1
				})
				console.log('【接口 changeProdcInfo 完整返回】', res);
				console.log('【Prodcuts-修改】', res?.data?.Prodcuts);
				const otherEdit = res?.data?.Prodcuts?.find(p => p.F_ASSISTANT === '其他配件' || p.Fnumber === 'OTHER' || p.name === '其他配件');
                console.log('【修改分支-其他配件】', otherEdit);
				prodList = res.data.Prodcuts;
				console.log('走修改分支 prodList：', prodList);
				prodList.map((item, index) => {
					item.name = item.FORDERNO;
					item.data.map((sitem, index2) => {
						that.fanganList[0].map(ssitem => {
							if (ssitem.id == sitem.data[0].FWEIXIUSIN) {
								sitem.title = ssitem.title;
							}
						});
						sitem.FangAnId = sitem.data[0].FWEIXIUSIN;
						sitem.FPRODUCTNO = sitem.FPRODUCTNUMBER1;
						sitem.children = sitem.data
						// sitem.data
						// ;
					})
				})

			}
			this.list2 = prodList;
			console.log('最终 list2：', this.list2);

			let FBillNo = value.FBillNo
			this.value = value.FWORKORDERNO1

			let result2 = await this.$Recipe.GetWeiXiuDetail({
				fnumber: FBillNo
			})

			this.allInfo = result2.data
			this.onShowNow = true;
			uni.hideLoading()
			//默认展开第一项 
			this.foldedPanel = '';
			console.log("list2--", this.list2)

			if (Array.isArray(this.list2) &&this.list2.length > 0 && this.list2[0] && Array.isArray(this.list2[0].data) && this.list2[0].data.length > 0) {
				if (this.list2[0].data[0].title == '更换配件') {
					this.foldedPanel = `panel-0-0`
				}
			}

		},
		methods: {
			changeBoxHeight(e) {
				this.collapseAdaptive(e.index)
			},
			//选择维修方案类别
			AssistantDataConfirm(e) {
				const {
					id,
					title
				} = e.value[0];
				const tabIndex = this.tabIndex;
				const tindex = this.tindex;
				// 此时 tabIndex==tindex
				const tindex2 = this.tindex2;
				this.list2[tabIndex].data[tindex2].FangAnId = id
				this.list2[tabIndex].data[tindex2].title = title

				if (id != '2') {
					this.list2[tabIndex].data[tindex2].children = [];
					this.collapseAdaptive(tindex)
				} else {

					const length = this.list2[tabIndex].data[tindex2].children.length;

					if (length === 0) {
						this.add(tindex, tindex2);
					}
					this.foldedPanel = `panel-${tabIndex}-${tindex2}`

				}


				this.show1 = false;
			},
			showFangAnList(index, index2) {
				uni.hideKeyboard();
				this.tindex = index;
				this.tindex2 = index2;
				this.show1 = true;
			},
			prodChange(e) {
				this.tabsIdx = e.index
				this.tabIndex = e.index
			},
			// tabs状态改变
			// prodChange({
			// 	index
			// }) {
			// 	this.tabsIdx = index
			// },
			getSearchReault(item) {
				if (item.typeOrder == 'order') {

					this.$refs[`cmp${this.tabIndex}-${item.index}-${item.index2}-${item.index3}`][0].formdata.orderno =
						item.Fname
				} else {
					// console.log('replay', item);
					// replay
					this.$refs[`cmp${this.tabIndex}-${item.index}-${item.index2}-${item.index3}`][0].formdata.name.fname =
						item.Fname
					this.$refs[`cmp${this.tabIndex}-${item.index}-${item.index2}-${item.index3}`][0].formdata.name
						.Fentryid = item.Fentryid

					this.$refs[`cmp${this.tabIndex}-${item.index}-${item.index2}-${item.index3}`][0].formdata.name
						.FnumberCode = item.Fnumber

				}

			},
			decrement(obj) {
				if (this.list2[this.tabIndex].data[obj.index2].children.length == 1) {
					uni.showToast({
						icon: 'none',
						title: '最少一项'
					})
					return
				}
				this.list2[this.tabIndex].data[obj.index2].children.splice(obj.number, 1);
				this.collapseAdaptive(obj.index)

			},
			collapseAdaptive(index) {
				this.$nextTick(() => {
					this.$refs['collapse' + this.tabIndex + '-' + index][0].resize()
				})
			},
			show23() {
				if (this.nameLists.length == 0) {
					return
				}
				show2 = true
			},
			confirm2(n) {
				this.show2 = false
				this.formdata.model = n.value[0].FNAME
			},
			add(index, index2) {

				let lng = this.list2[index].data[index2].children.length;

				this.list2[index].data[index2].children.splice(lng + 1, 0, {
					id: +new Date() + '',
					Fname: '',
					F_ASSISTANT: this.list2[index].F_ASSISTANT
				})
				// 此处写方法展开方法
				this.foldedPanel = `panel-${index}-${index2}`


				this.$nextTick(() => {
					this.$refs['collapse' + this.tabIndex + '-' + index][0].resize();
				})
				// this.$forceUpdate();
			},

			submit(stype) {
				this.stype = stype;
				if (stype == 'B') {
					this.show5 = true;
				} else {
					this.commit();
				}
			},
			commit() {
				this.show5 = false;
				let that = this;
				// this.stype = stype;
				let stype = this.stype
				let dataList = [];
				// console.log('this.list2',this.list2)
				let flag = this.list2.some((item, index) => {
					return item.data.some((sitem, index2) => {

						if (sitem.FangAnId == '' || !sitem.FangAnId) {
							if (stype == 'B') {
								return uni.showModal({
									title: '提示',
									showCancel: false,
									content: `${item.name}-${item.productname}-产品编号${sitem.FPRODUCTNO}未选择维修方案`
								})
							}

						}

						if (sitem.FangAnId != '2') {
							dataList.push({
								maxName: item.name,
								FPARTSNAME: "",
								F_ASSISTANT: item.F_ASSISTANT, // 配件名称
								FQTY: "", //新配件数量
								FISERROR: "", //故障原因件
								FNEWSOURCE: "", //新建来源
								F_ASSISTANT1: "", //新配件订货号
								Forderno: "", //新配件订货号

								FREMARKS: "", //新建编号
								F_ASSISTANT2: item.FORDERNO, //维修订货号
								FNEWSOURCECHECK: "", //是否有新配件编号
								FPRODUCTNUMBER1: sitem.FPRODUCTNO, // 故障件编号
								FWEIXIUSIN: sitem.FangAnId,

							})

						} else {
							sitem.children.map((item3, index3) => {

								let data = that.$refs[
										`cmp${that.tabIndex}-${index}-${index2}-${index3}`][0]
									.add();
								// console.log('data------------',that.$refs[`cmp${that.tabIndex}-${index}-${index2}-${index3}`][0].add() )
								dataList.push(data)
							})
						}
					});
				})


				// 判断是否选择了维修方案
				if (flag) return;
				let result = dataList.some(item => {

					if (stype == 'B') {
						if (item.FWEIXIUSIN == '2') {
							if (!item.name.fname || !item.name.Fentryid) {
								return uni.showModal({
									title: '提示',
									showCancel: false,
									content: `${item.tipTitle}未选择配件名称`
								})

							}
							if (!item.number || item.number == 0) {
								return uni.showModal({
									title: '提示',
									showCancel: false,
									content: `${item.tipTitle}未填写新配件数量`
								})
							}
							if (!item.tipBoxList) {
								return uni.showModal({
									title: '提示',
									showCancel: false,
									content: `${item.tipTitle}未选择故障原因件`
								})
							}
							if (!item.needCenter) {
								return uni.showModal({
									title: '提示',
									showCancel: false,
									content: `${item.tipTitle}未选择新配件来源`
								})
							}
							let code = item.name.fcode ? item.name.fcode : item.FPARTSNAMENUMBER;


							if (code && code !== ' ') {
								let arrCode = code.split(".");
								if (arrCode.length == 1 && !item.Forderno) {
									return uni.showModal({
										title: '提示',
										showCancel: false,
										content: `${item.tipTitle}未填写新配件订货号`
									})
								}
							}

							if (item.needCenter != '3') {
								if (item.FNEWSOURCECHECK == 1 && !item.productnumber) {
									return uni.showModal({
										title: '提示',
										showCancel: false,
										content: `${item.tipTitle}未填写新配件编号`
									})
								}
							}

						}
					}

				})

				// 判断是够将字段填写完成
				if (result) return;
				let newList = [];
				this.list2.map((item, index) => {
					let obj = {
						data: []
					}
					newList.push(obj)
					dataList.map((sitem, sindex) => {
						if (item.name === sitem.maxName) {
							newList[index].data.push(sitem)
						}
					})

				})

				this.finalSubmit(newList);
				return;
			},

			async finalSubmit(dataList) {
				let _this = this;
				let data = {
					FBillNo: this.value,
					FDocumentStatus: this.stype,
					Prodcuts: []
				}
				dataList.map((Mitem, index) => {
					let obj = {
						data: []
					}
					data.Prodcuts.push(obj)
					Mitem.data.map(FFF => {

						if (FFF.FWEIXIUSIN == '2') {
							let item = {
								FPARTSNAME: FFF.name.Fentryid ? FFF.name.Fentryid : '',

								F_ASSISTANT: FFF.F_ASSISTANT ? FFF.F_ASSISTANT : '', // 维修名称


								FQTY: FFF.number ? FFF.number : '', //新配件数量
								FISERROR: FFF.isError ? '1' : '0', //故障原因件
								FNEWSOURCE: FFF.needCenter ? FFF.needCenter : '', //新件来源

								// F_ASSISTANT1STR:FFF.Forderno,// 新配件订货号名称

								F_ASSISTANT1: FFF.Forderno ? FFF.Forderno : '', //新配件订货号

								Forderno: FFF.Forderno ? FFF.Forderno : '', //新配件订货号

								FREMARKS: FFF.productnumber ? FFF.productnumber : '', //新件编号

								F_ASSISTANT2: FFF.WXDHH ? FFF.WXDHH : '', //维修订货号  B916-040S

								FPRODUCTNUMBER1: FFF.oldFPRODUCTNO ? FFF.oldFPRODUCTNO :
								'', // 故障件编号

								FWEIXIUSIN: FFF.FWEIXIUSIN ? FFF.FWEIXIUSIN : '',
								FNEWSOURCECHECK: FFF.FNEWSOURCECHECK,
							}


							data.Prodcuts[index].data.push(item)
						} else {
							delete FFF.maxName
							FFF.Forderno = ''; //新配件订货号
							FFF.FNEWSOURCECHECK = 0;
							data.Prodcuts[index].data.push(FFF)
						}
					})
				});
				// console.log(111,data)
				// debugger 
				//  if(this.stype =='B')
				// return
				if (data.Prodcuts.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '数据错误，请返回上一页重新执行！'
					})
					return
				}
				const result = await this.$Recipe.getInsertRpmApplication(data);
				if (result && result.code == 200) {
					// 检查是否有"不符合三包"或"直接维修"的维修方案
					    let hasSpecialRepair = this.list2.some(item => 
					      item.data.some(sitem => sitem.FangAnId === '1' || sitem.FangAnId === '3')
					    );
					    
					    if (this.stype == 'B' && hasSpecialRepair) {
					      // 跳转到维修情况页面
					      uni.navigateTo({
					        url:`/pages2/order/repair/situation?FBillNo=${this.info.FBillNo}&FID=${this.info.FID || this.allInfo.FID || ''}&FWORKORDERNO1=${this.value}`
					      });
					      
					      uni.showToast({
					        icon: 'none',
					        title: '维修方案提交成功，请填写维修情况'
					      });
					    } else {
					      // 正常返回报表页面
					      uni.switchTab({
					        url: '/pages/tabBar/report/index',
					        success() {
					          uni.showToast({
					            icon: 'none',
					            title: _this.stype == 'B' ? '维修方案提交成功' : '维修方案保存成功'
					          })
					        }
					      })
					    }
				} else {
					console.log("this.stype", _this.type)
					uni.showToast({
						icon: 'none',
						title: _this.stype == 'B' ? '维修方案提交失败' : '维修方案保存失败'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page {
		padding: 0;

		&__item {

			&__title {
				color: $u-tips-color;
				background-color: $u-bg-color;
				padding: 15px;
				font-size: 15px;

				&__slot-title {
					color: $u-primary;
					font-size: 14px;
				}
			}
		}
	}

	.title_box {

		position: relative;
		padding-left: 20rpx;
		line-height: 80rpx;
		background-color: #fff;
		color: #000;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.title_right {
		padding-left: 10rpx;
		font-size: 26rpx;
	}

	.weiXiu_fangan {
		position: absolute;
		right: 20rpx;
		width: 200rpx;
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
		background-color: white !important;
	}


	.page {
		height: 100vh;

		.title {
			font-weight: bold;
		}

		.add {
			color: #169BD5;
			font-size: 28rpx;
			height: 50rpx;
			line-height: 50rpx;
			margin-top: 20rpx;
			padding-right: 30rpx;
			padding-left: 30rpx;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
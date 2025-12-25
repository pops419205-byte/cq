<template>
	<view>
		<!-- 切换搜索方法 -->
		<view style="margin: 5px;">
			<!-- <u-radio-group labelColor='gray' v-model="value2" placement="row">
				<u-radio :customStyle="{margin: '10px'}" v-for="(item, index) in typelist" :key="index"
					:label="item.name" :name="item.name" @change="typeChange(index)">
				</u-radio>
			</u-radio-group> -->
			<view @click="typeChange(1)" style="padding: 5px;text-align: right; color: royalblue;margin-right: 15px;">按产品树搜索</view>
		</view>
		<!-- 模糊搜索的  搜索框和 搜索列表 -->
		<view v-show="value2 == '模糊搜索'">
			<u-search :show-action="true" v-model="message" actionText="搜索" @change='filter' :animation="true">
			</u-search>
			<scroll-view scroll-y="true" style="height: 400px;margin-top: 20px;margin-left: 10px;">
				<view class="options">
					<u-radio-group labelColor='gray' v-model="value" placement="column">
						<u-radio :customStyle="{marginBottom: '10px'}" v-for="(item, index) in showlist" :key="index"
							:label="item.Fname" :name="item.Fname" @change="radioChange(index)">
						</u-radio>
					</u-radio-group>
				</view>
			</scroll-view>
		</view>
		<!-- 树形菜单组件 -->
		<tki-tree ref="tkitree" :selectParent='true' :range="tree" rangeKey="Fname" @cancel='quit' :foldAll="true"
			@confirm='treeconfirm' confirmColor="#4e8af7" />
	</view>
</template>

<script>
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	export default {
		components: {
			tkiTree
		},
		data() {
			return {
				number: 0, //记录是第几个产品进入的搜索页面
				type: '', //区分是从那个页面进入的搜索页面  reply  是旧件申请页面过来的  
				arr: [], //搜索列表的总列表
				message: '', //搜索框中的value
				showlist: [], //搜索后用于展示的数组9
				value: '', //模糊搜索列表中单选框绑定的变量
				typelist: [{
					name: '模糊搜索',
				}, {
					name: '产品树',
				}], //搜索方式分类数组
				value2: '模糊搜索', //控制搜索模式绑定的变量  
				tree: [], //树形菜单数组
				typeOrder:'',
				index:'',
				index2:'',
			}
		},

		/**
		 * @param {Object} option  判断option 区分路由过来的页面  请求不同的列表接口     展示的列表只展示10条数据 
		 */
		async onLoad(option) {
			const obj = JSON.parse(decodeURIComponent(option.obj))
			console.log('search',obj);
			this.message = obj.forderno 
			let res
			if (obj.type == 'reply') {
				console.log("reply");
				res = await this.$Recipe.SelectAssistantTree()
				console.log('【SelectAssistantTree完整返回】', res)
				console.log('【SelectAssistantTree返回的data】', res.data)

			} else {
				res = await this.$Recipe.newTreeList()
				console.log('【newTreeList完整返回】', res)
			}
			

			this.tree = res.data
			console.log('【赋值后的tree】', this.tree)
			let arr3 = []
			this.tree.forEach((item, index) => {
				item.id = item.FID
				arr3.push(item)
				if (item.children.length != 0) {
					item.children.forEach((item2, index2) => {
						arr3.push(item2)
						item2.id = item2.FID
						if (item2.children.length != 0) {
							item2.children.forEach((item3, index3) => {
								arr3.push(item3)
								item3.id = item3.FID
							})
						}
					})
				}
			})
			let result
			if (obj.type == 'reply') {
				this.type = 'reply'
				this.number = obj.number,
				this.index=obj.index;
				this.index2=obj.index2;
				this.index3=obj.index3
				if (obj.Fnumber) {
				  const target = this.tree.find(item => item.Fname === obj.Fnumber)
				   console.log('【查找的Fnumber】', obj.Fnumber)
				   console.log('【找到的target】', target)
				  if (target) {
					target.open = true
				    this.tree = [target]
					console.log('【过滤后的tree】', this.tree)
				  }
				}
				let arr3 = []
				this.tree.forEach((item, index) => {
					item.id = item.FID
					arr3.push(item)
					if (item.children.length != 0) {
						item.children.forEach((item2, index2) => {
							arr3.push(item2)
							item2.id = item2.FID
							if (item2.children.length != 0) {
								item2.children.forEach((item3, index3) => {
									arr3.push(item3)
									item3.id = item3.FID
								})
							}
						})
					}
				})
				result = {
					data: arr3
				}

			} else {
				// this.number = obj.number
				let findIndex = 0;
				this.number = obj.number
				this.typeOrder = obj.typeOrder;
				
				this.index=obj.index;
				this.index2=obj.index2;
				this.index3=obj.index3
				 
				
				if (obj.number != '') {
					this.tree.forEach((item, index) => {
						if (item.Fentryid == obj.number) {
							findIndex = index
						}
					})
					this.tree = this.tree.splice(findIndex, 1)
				}
				
				
				result = await this.$Recipe.getSelectMaterialList({
					FID: obj.number
				})
			}
			this.message = obj.forderno 
			this.arr = result.data
			console.log('【所有配件名称arr】', this.arr)
			console.log('【arr数组长度】', this.arr.length)
			this.showlist = [...result.data].slice(0, 10)
			console.log('【默认显示的前10条showlist】', this.showlist)
		},
		methods: {
			/**
			 * @param {Object} index   切换搜索类型的 打开树形菜单
			 */
			typeChange(index) {
				if (index == 1) {
					this.$refs.tkitree._show()
				}
			},
			/**
			 * @param {Object} e 树形菜单确认事件
			 */
			treeconfirm(e) {
			 
				this.choose(e[0])
			},
			/**
			 * @param {Object} e 搜索框选择事件 
			 */
			radioChange(e) {
				this.choose(this.showlist[e])
			},
			/**
			 * @param {Object} item  完成选择事件    判断导航进页面的方式 执行不同的方法     当从旧件返回单过来的时候  将 接受到的number值返回出去  作为index知道那个组件进行了 搜索
			 */
			choose(item) {
				try{
					item.index=this.index;
					item.index2=this.index2;
					item.index3=this.index3;
				}catch(e){
					//TODO handle the exception
				}
				if (this.type == 'reply') {
					this.message = item.Fname
					let pages = getCurrentPages(); //获取所有页面栈实例列表
					let nowPage = pages[pages.length - 1]; //当前页页面实例
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					
					 
					prevPage.$vm.getSearchReault(item); //修改上一页data里面的tagIndex 参数值
					uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					});
				} else {
					this.message = item.Fname
					 
					item.number = this.number
					item.typeOrder = this.typeOrder
					let pages = getCurrentPages(); //获取所有页面栈实例列表
					let nowPage = pages[pages.length - 1]; //当前页页面实例
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					prevPage.$vm.getSearchReault(item); //修改上一页data里面的tagIndex 参数值
					uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					});
				}
			},
			/**
			 * @param {Object} 过滤显示数组
			 */
			filter(e) {
				let arr = this.arr.filter(item => {
					return item.Fname.indexOf(e) != -1
				})
				this.showlist = arr.slice(0, 10)
			},
			/**
			 * 返回上一个页面     
			 */
			quit() {
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style>

</style>

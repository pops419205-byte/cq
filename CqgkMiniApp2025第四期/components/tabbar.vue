<template>
    <view class="tab-bar">
        <view v-for="(item,index) in list" :key="item.index" v-if="type==1" class="tab-bar-item" @click="switchTab(item, index)">
            <image class="tab_img" :src="current === index ? item.selectedIconPath : item.iconPath"></image>
            <view class="tab_text" :style="{color: current === index ? selectedColor : color}">{{item.text}}</view>
        </view>
        <view v-for="(item,index) in lists" :key="item.index" v-if="type==2" class="tab-bar-item" @click="switchTab(item, index)">
            <image class="tab_img" :src="current === index ? item.selectedIconPath : item.iconPath"></image>
            <view class="tab_text" :style="{color: current === index ? selectedColor : color}">{{item.text}}</view>
        </view>
		
		
		
    </view>
 
</template>
 
 
 
<script>
    export default {
        props: {
            selected: { // 当前选中的tab index
                type: Number,
                default: 0
            },
            current: { // 当前选中的tab index
                type: Number,
                default: 0
            },
            userIdentity: { // 当前角色
                type: Number,
                default: 0
            }
 
        },
        data() {
            return { 
				type:1,
				indexed:0,
				color: "#7A7E83",
				selectedColor: "#007AFF", 
				borderStyle: "black",
				backgroundColor: "#F8F8F8", 
				list: [{
						type:1,
						index:0,
						pagePath: "/pages/tabBar/report/index",
						iconPath: "/static/list.png",
						selectedIconPath: "/static/list_select.png",
						text: "工单"
					},
					{
						type:1,
						index:1,
						pagePath: "/pages/tabBar/order/index",
						iconPath: "/static/baoxiu.png",
						selectedIconPath: "/static/baoxiu_select.png",
						text: "报修"
					}, {
						type:1,
						index:2,
						pagePath: "/pages/tabBar/mine/index",
						iconPath: "/static/my_1.png",
						selectedIconPath: "/static/my.png",
						text: "我的"
					}
				], 
				lists: [{
						type:2,
						index:0,
						pagePath: "/pages/agent/index",
						iconPath: "/static/list.png",
						selectedIconPath: "/static/list_select.png",
						text: "发货单"
					}, {
						type:2,
						index:1,
						pagePath: "/pages/agent/indexbh",
						iconPath: "/static/baoxiu.png",
						selectedIconPath: "/static/baoxiu_select.png",
						text: "补货单"
					},{
						type:2,
						index:2,
						pagePath: "/pages/tabBar/mine/index",
						iconPath: "/static/my_1.png",
						selectedIconPath: "/static/my.png",
						text: "我的"
					}  
				]
            }
        },
		created() { 
			let _this = this;
			this.indexed = this.$props.current 
			//  console.log('indexed---',this.$props.current)
			let type = uni.getStorageSync('customertype')
			if(type == 'Distributor'){
				getApp().globalData.index = 2;
			}
			 // if(type == 'Distributor'){
				// this.type = 2
			 // }else{
				// this.type = 1
			 // }	
			 this.type = getApp().globalData.index ;
			//  console.log('type-------',this.type)
			uni.$on('aEven', data=>{
				console.log('a组件传来的数据：', data) 
				getApp().globalData.index = data
				_this.type = data ;
			})
		},
		onShow() {
			
		},
        methods: {
            switchTab(item, index) {
				this.indexed = index;
                // console.log("item", item)
                // console.log("index", item.index)
                // console.log("url", item.pagePath)
				//  console.log('type-------',this.type)
				if(index==1){
					uni.$emit('reSetPage', '1')
				}
                let url = item.pagePath; 
                uni.switchTab({
                    url
                })
 
            }
        }
    }
</script>
 
<style lang="scss">
    .tab-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
		z-index: 999;
        height: 120rpx;
        background: #F8F8F8;
        display: flex;
        justify-content: center;
        align-items: center;
        // padding-bottom: env(safe-area-inset-bottom); // 适配iphoneX的底部
		padding-bottom: var(–window-bottom);
 
        .tab-bar-item {
            flex: 1;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
			padding-bottom: 20rpx;
            .tab_img {
                width: 37rpx;
                height: 41rpx; 
            }
 
            .tab_text {
                font-size: 20rpx;
                margin-top: 9rpx;
            }
        }
    }
</style>
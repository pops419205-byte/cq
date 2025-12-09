<template>
	<view class="mine">
		<!-- 个人信息 -->
		<uni-list>
			<uni-list-item :show-extra-icon="true" showArrow :extra-icon="Icon2" title="姓名" :rightText="name" />
			<uni-list-item :show-extra-icon="true" showArrow :extra-icon="Icon3" title="电话" :rightText="phone" />
		</uni-list>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				Icon2: {
					color: '#4cd964',
					size: '22',
					type: 'person'
				},
				Icon3: {
					color: '#4cd964',
					size: '22',
					type: 'phone'
				},
				name: '',   //姓名
				phone: ''   //电话
			}
		},
		/**
		 * 获取缓存信息
		 */
		onLoad() {
			this.name = uni.getStorageSync('nickName')
			this.phone = uni.getStorageSync('phone')
		},
		methods: {}
	}
</script>

<style>

</style>

<template>
	<u-popup v-model="show" mode="center" border-radius="14" :mask-close-able="false">
		<view class="ws-privacy-popup">
			<view class="ws-privacy-popup__header">
				<view class="ws-picker__title">用户隐私保护提示</view>
			</view>
			<view class="ws-privacy-popup__container">
				<text>感谢您使用本应用，您使用本应用的服务之前请仔细阅读并同意</text>
				<text class="ws-privacy-popup__container-protocol"
					@click="openPrivacyContract">《小程序隐私保护指引》</text>
				<text>。当您点击同意并开始使用产品服务时，即表示你已理解并同意该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法使用相应服务。</text>
			</view>
			<view class="ws-privacy-popup__footer">
				<button class="is-agree" id="agree-btn" open-type="agreePrivacyAuthorization"
					@agreeprivacyauthorization="handleAgree">
					同意并继续
				</button>
				<button class="is-disagree" id="disagree-btn" @click="handleDisagree">
					不同意
				</button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: "privacyAgreenPop",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			goback:{
				type: String,
				default: 'exit',//exit默认退出
			}
		},
		data() {
			return {};
		},
		mounted() {},
		methods: {
			handleAgree() {
				this.$emit("handleAgree")
				this.$emit("update:show", false)

			},
			handleDisagree() {
				if(this.goback == 'exit'){
					uni.exitMiniProgram({
						success: () => {
							uni.exitMiniProgram({success: (res) => { console.log("退出success")}})
						}
					})
				}
				this.$emit("handleDisagree")
				this.$emit("update:show", false)
			},
			/**
			 * 打开隐私协议
			 */
			openPrivacyContract() {
				wx.openPrivacyContract({
					success: (res) => {
					},
					fail: (res) => {
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.ws-privacy-popup {
		width: 600rpx;
		padding: 48rpx;
		box-sizing: border-box;
		overflow: hidden;
		width: 560rpx;
		background: #fff;
		border-radius: 24rpx;

		&__header {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 52rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 550;
			color: #1a1a1a;
			line-height: 52rpx;
			margin-bottom: 48rpx;
		}

		&__container {
			width: 100%;
			box-sizing: border-box;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			line-height: 48rpx;
			margin-bottom: 48rpx;

			&-protocol {
				font-weight: 550;
				color: #07c160;
			}
		}

		&__footer {
			display: flex;
			flex-direction: column;

			.is-disagree,
			.is-agree {
				width: 100%;
				height: 88rpx;
				background: #ffffff;
				border-radius: 44rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				border: 1px solid #07c160;
				font-weight: 400;
				color: #666666;
			}

			.is-agree {
				background: #07c160;
				color: #ffffff;
				margin-bottom: 18rpx;
			}

			button {
				border: none;
				outline: none;

				&::after {
					border: none;
				}
			}
		}
	}
</style>


<template>
	<view>
		<view :style="'height: ' + gaodu + ';overflow: auto;'">
			<view class="header">
				<!-- 地址 -->
				<view class="address">
					<view v-if="flag" @click="chooseAddress">
						<view>
							<view>收货人：{{ address.userName }}</view>
							<view>
								电话：{{ address.telNumber }}
								<uni-icons type="forward" size="16" />
							</view>
						</view>
						<view>
							收货地址：{{ address.provinceName }}{{ address.cityName }}{{ address.countyName }}{{ address.detailInfo }}
						</view>
					</view>
					<button v-else type="primary" size="mini" @click="chooseAddress">请选择收货地址+</button>
				</view>

				<!-- 地址 -->

				<image src="../../static/cart_border@2x.png" class="img" />
				<view class="icon">
					<uni-icons type="shop" size="24" />
					<text>购物车</text>
				</view>
			</view>

			<view class="goodsList">
				<view v-for="(item, index) in cartList" :key="item.goods_id">
					<uni-swipe-action>
						<uni-swipe-action-item :right-options="options" @click="del(item.goods_id)">
							<radio
								:checked="item.goods_checked"
								@click="changeChecked(item.goods_id, item.goods_checked)"
								color="red" />
							<view class="goods">
								<view>
									<!-- logo -->
									<image :src="item.goods_small_logo" mode="widthFix" @click="toDetail(item.goods_id)"></image>
								</view>
								<view class="detail">
									<!-- 名字 -->
									<view class="name">{{ item.goods_name }}</view>
									<!-- 价格 -->
									<view class="text">￥{{ item.goods_price.toFixed(2) }}</view>
									<!-- 数量 -->
									<uni-number-box min="1" :value="item.goods_count" @change="changeValue($event, index)" />
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</view>
		</view>
		<!-- 结算 -->
		<view class="footer">
			<view>
				<label class="radio" @click="changeAll(isAll)">
					<radio color="red" :checked="isAll" />
					全选
				</label>
			</view>
			<view>
				合计：
				<text>￥{{ price.toFixed(2) }}</text>
			</view>
			<view @click="submit">结算({{ count }})</view>
		</view>
		<!-- 结算 -->
	</view>
</template>

<script>
	import mix from '../../mixins/mixins'
	import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
	export default {
		mixins: [mix],
		data() {
			return {
				gaodu: 0,
				seconds: 4,
				timer: null,
				// 订单参数
				orderParmas: {
					order_price: 0,
					consignee_addr: '',
					order_detail: '',
					goods: []
				},
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: 'red'
						}
					}
				]
			}
		},
		computed: {
			...mapGetters('cart', ['total'])
		},
		watch: {
			total: {
				handler() {
					let pages = getCurrentPages().pop().route
					if (pages === 'subpkg/goods_detail/goods_detail') return
					uni.setTabBarBadge({
						index: 2,
						text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
					})
				}
			}
		},
		methods: {
			...mapMutations('cart', ['updataGoodsCount', 'upDataChecked', 'changeAll']),
			...mapActions('cart', ['getAddress']),
			// 选择地址
			chooseAddress() {
				this.getAddress()
			},
			// 跳转详情页
			toDetail(id) {
				uni.navigateTo({ url: '/subpkg/goods_detail/goods_detail?goods_id=' + id })
			},
			// 删除
			...mapMutations('cart', ['delGoods']),
			del(id) {
				this.delGoods(id)
			},
			// 单选
			changeChecked(id, isChecked) {
				this.upDataChecked({ id: id, isChecked: isChecked })
			},
			changeValue(e, index) {
				this.updataGoodsCount({
					value: e,
					index: index
				})
			},

			// 结算
			submit() {
				if (!this.flag) {
					uni.showToast({ title: '请选择收货地址', icon: 'error' })
					return
				}
				if (!this.count) {
					uni.showToast({ title: '请选择结算商品', icon: 'error' })
					return
				}
				if (!this.token) {
					this.seconds = 3
					this.toast()
					this.timer = setInterval(() => {
						if (this.seconds > 1) {
							this.seconds--
							this.toast()
						} else {
							clearInterval(this.timer)
							uni.switchTab({
								url: '/pages/my/my'
							})
							return
						}
					}, 1000)
					return
				}
				this.createOrder()
			},
			toast() {
				uni.showToast({
					title: `请登录,${this.seconds}秒后跳转到登录页`,
					icon: 'none',
					mask: true
				})
			},
			async createOrder() {
				this.orderParmas.consignee_addr =
					this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
				this.orderParmas.order_price = this.price

				this.cartList.forEach(item => {
					if (item.goods_checked) {
						this.orderParmas.goods.push({
							goods_id: item.goods_id,
							goods_name: item.goods_name,
							goods_price: item.goods_price
						})
					}
				})
				console.log('订单参数', this.orderParmas)
				let res = await uni.$http.post('/api/public/v1/my/orders/create', this.orderParmas)
				console.log('创建订单返回值', res)
				let order_number = 'GD20180507000000000050'
				let payRes = await uni.$http.post('/api/public/v1/my/orders/chkOrder',{order_number})
				console.log('支付返回值', payRes)
			}
		},
		computed: {
			...mapState('cart', ['cartList', 'address', 'flag']),
			...mapGetters('cart', ['isAll', 'price', 'count']),
			...mapState('user', ['token'])
		},
		onLoad(options) {
			this.gaodu = uni.getSystemInfoSync().windowHeight - 50 + 'px'
		}
	}
</script>

<style lang="scss">
	.header {
		.address {
			height: 150rpx;
			width: 100%;
			display: flex;
			justify-items: center;
			align-items: center;
			font-size: 24rpx;
			> view {
				//地址
				width: 100%;
				> view {
					width: 100%;
					&:nth-child(1) {
						//收货人
						display: flex;
						justify-content: space-between;
						> view:nth-child(2) {
							display: flex;
							align-items: center;
						}
					}
					&:nth-child(2) {
						//收货地址
						margin-top: 20rpx;
					}
				}
			}
			button {
				width: 40%;
			}
		}
		.img {
			width: 100%;
			height: 20rpx;
		}
		.icon {
			uni-icons {
				vertical-align: middle;
			}
		}
	}

	.goodsList {
		> view {
			position: relative;
			background-color: rgb(199, 188, 188);
		}

		radio {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			margin-right: 50rpx;
			margin-left: 10rpx;
			width: 50rpx;
			color: red;
		}

		.goods {
			display: flex;
			font-size: 30rpx;
			margin-top: 10rpx;
			margin-left: 70rpx;
			image {
				width: 250rpx;
				vertical-align: middle;
			}

			.detail {
				position: relative;
				padding: 10rpx;

				.text {
					position: absolute;
					left: 0;
					bottom: 10rpx;
					color: red;
				}
				uni-number-box {
					position: absolute;
					right: 10rpx;
					bottom: 10rpx;
				}
			}
		}
	}
	.footer {
		background-color: white;
		display: flex;
		position: fixed;
		bottom: 0rpx;
		justify-content: space-between;
		width: 100%;
		align-items: center;
		padding-left: 10rpx;
		view {
			&:nth-child(1) {
				display: flex;
				height: 100rpx;
				align-items: center;
			}
			&:nth-child(2) {
				text {
					color: red;
				}
			}
			&:nth-child(3) {
				background-color: red;
				color: white;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 250rpx;
			}
		}
	}
</style>

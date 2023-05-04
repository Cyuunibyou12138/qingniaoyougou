<template>
	<view>
		<scroll-view scroll-y class="top" :style="'height:' + gaodu + ';'">
			<!-- 轮播图 -->
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" circular>
				<swiper-item v-for="(item, index) in swiperList" :key="item.pics_id">
					<image :src="item.pics_big" @click="previewImage(index)" />
				</swiper-item>
			</swiper>
			<!-- 轮播图 -->
			<!-- 图片预览 -->

			<!-- 图片预览 -->

			<view class="detail">
				<!-- 价格 -->
				<view class="price">￥{{ goods_detail.goods_price }}</view>
				<!-- 名字/收藏 -->
				<view class="name">
					<view>{{ goods_detail.goods_name }}</view>
					<view>
						<uni-icons type="star" size="30"></uni-icons>
						<view>收藏</view>
					</view>
				</view>
				<!-- 快递免运费 -->
				<view class="kuaidi">快递免运费</view>
			</view>
			<rich-text :nodes="goods_detail.goods_introduce"></rich-text>
		</scroll-view>

		<view class="bar">
			<!-- icon -->
			<view class="goods-carts">
				<uni-goods-nav
					:options="options"
					:fill="true"
					:button-group="buttonGroup"
					@click="onClick"
					@buttonClick="buttonClick" />
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations,mapGetters } from 'vuex'
	export default {
		data() {
			return {
				parmas: {},
				swiperList: [],
				goods_detail: {},
				gaodu: '',

				options: [
					{
						icon: 'shop',
						text: '店铺'
					},
					{
						icon: 'cart',
						text: '购物车',
						info: 0
					}
				],
				buttonGroup: [
					{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			}
		},
		computed: {
			...mapState('cart', ['count']),
			...mapGetters('cart',['total'])
		},
		methods: {
			...mapMutations('cart', ['addCart']),
			// 图片预览
			previewImage(index) {
				let photoList = this.swiperList.map(item => {
					return item.pics_big
				})
				uni.previewImage({
					current: index,
					urls: photoList,
					loop: true
				})
			},
			async getDetail() {
				let res = await uni.$http.get('/api/public/v1/goods/detail', this.parmas)
				console.log(res)
				this.swiperList = res.data.message.pics
				this.goods_detail = res.data.message
			},
			onClick(e) {
				if(e.content.text!=='购物车') return
				uni.switchTab({ url: '/pages/cart/cart' })
			},
			buttonClick(e) {
				if (e.index === 0) {
					// 加入购物车
					let goods_detail = {
						goods_id:this.goods_detail.goods_id,
						goods_name:this.goods_detail.goods_name,
						goods_price:this.goods_detail.goods_price,
						goods_small_logo:this.goods_detail.goods_small_logo,
						goods_count:1,
						goods_checked:true
					}
					this.addCart(goods_detail)
					this.options[1].info = this.total
				} else {
					// 立即购买
				}
			}
		},
		onLoad(options) {
			this.parmas = options
			this.getDetail()
			this.gaodu = uni.getSystemInfoSync().windowHeight - 60 + 'px'
			this.options[1].info = this.total
		}
	}
</script>

<style lang="scss">
	.example-body {
		padding: 0;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}

	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}
	swiper {
		height: 750rpx;

		image {
			width: 750rpx;
			height: 750rpx;
		}
	}

	.detail {
		margin-top: 10px;
		padding: 0 20rpx;
		font-size: 24rpx;

		.price {
			color: red;
		}

		.name {
			display: flex;
			justify-content: space-between;
			margin-top: 20px;

			> view {
				// 名字
				&:nth-child(1) {
					width: 550rpx;
					padding-right: 50rpx;
					word-break: break-all;
					border-right: 1px solid #efefef;
				}

				// 收藏
				&:nth-child(2) {
					padding-right: 20rpx;

					view {
						color: lightgray;
					}
				}
			}
		}

		.kuaidi {
			margin-top: 10rpx;
			color: lightgray;
			font-size: 20rpx;
		}
	}

	.bar {
		position: fixed;
		// display: flex;
		// bottom: 0;
		// font-size: 24rpx;
		// padding: 10rpx;
		// width: 100%;

		// .icon {
		// 	display: flex;
		// 	width: 30%;
		// 	justify-content: space-between;
		// 	padding-left: 10rpx;

		// 	view {
		// 		text-align: center;

		// 		&:nth-child(2) {
		// 			position: relative;

		// 			.badge {
		// 				position: absolute;
		// 				z-index: 999;
		// 				right: -10rpx;
		// 				top: -10rpx;
		// 			}
		// 		}
		// 	}
		// }

		// .btn {
		// 	display: flex;
		// 	justify-content: space-between;
		// 	margin: 0 20rpx;
		// 	width: 100%;
		// 	border-radius: 50rpx;
		// 	overflow: hidden;

		// 	view {
		// 		width: 50%;
		// 		color: white;
		// 		display: flex;
		// 		justify-content: center;
		// 		align-items: center;

		// 		&:nth-child(1) {
		// 			background-color: #ff0000;
		// 		}

		// 		&:nth-child(2) {
		// 			background-color: rgb(255, 162, 0);
		// 		}
		// 	}
		// }
	}
</style>

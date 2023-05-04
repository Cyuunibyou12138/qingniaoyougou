<template>
	<view>
		<my-serach></my-serach>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
			<swiper-item class="swiperItem" v-for="(item, index) in swiperList" :key="item.goods_id">
				<navigator :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src" />
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类 -->
		<view class="cate">
			<view v-for="(item, index) in cartList" :key="index">
				<image :src="item.image_src" mode="" />
			</view>
		</view>
		<!-- 楼层导航 -->
		<view class="floor">
			<!-- 楼层 -->
			<view v-for="(item, index) in floorList" :key="index">
				<!-- title -->
				<view class="title">
					<image :src="item.floor_title.image_src" mode="widthFix"></image>
				</view>
				<view class="floorItem">
					<!-- 左floor -->
					<view>
						
							<image
								:src="item.product_list[0].image_src"
								
								mode="heightFix"
								@click="toGoodsList(item.product_list[0].navigator_url)" />
						
					</view>
					<!-- 右floor -->
					<view>
						<view
							v-for="(item2, index2) in item.product_list"
							@click="toGoodsList(item2.navigator_url)"
							v-if="index2 !== 0">
							<image :src="item2.image_src" mode="heightFix"/>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mix from '../../mixins/mixins'
	export default {
		mixins: [mix],
		data() {
			return {
				swiperList: [],
				cartList: [],
				floorList: [],
			}
		},
		methods: {
			toGoodsList(query) {
				let index = query.indexOf('=')
				query = query.slice(index + 1)
				console.log(query)
				uni.navigateTo({ url: `/subpkg/goods_list/goods_list?query=${query}`})
			},
			async getSwiperList() {
				const res = await uni.$http.get('/api/public/v1/home/swiperdata')
				this.swiperList = res.data.message
			},
			async getCartList() {
				const res = await uni.$http.get('/api/public/v1/home/catitems')
				console.log(res)
				this.cartList = res.data.message
			},
			async getFloorList() {
				const res = await uni.$http.get('/api/public/v1/home/floordata')
				console.log(res)
				this.floorList = res.data.message
			}
		},
		mounted() {
			this.getSwiperList()
			this.getCartList()
			this.getFloorList()
		}
	}
</script>

<style lang="scss">
	uni-swipe-action {
		view {
			width: 100%;
			height: 100rpx;
			background-color: yellow;
		}
	}
	.swiperItem {
		image {
			width: 100%;
			height: 330rpx;
		}
	}

	.cate {
		display: flex;
		justify-content: space-around;

		view {
			width: 100%;
			text-align: center;
		}

		image {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor {
		margin-top: 20rpx;

		.title {
			width: 100%;

			image {
				width: 100%;
			}
		}

		.floorItem {
			display: flex;
			justify-content: space-around;
			> view {
				&:nth-child(1) {
					height: 373rpx;
					width: 225rpx;
					image {
						height: 100%;
						width: 100%;
					}
				}

				&:nth-child(2) {
					width: 65%;
					display: flex;
					justify-content: space-around;
					flex-wrap: wrap;
					align-content: space-between;
					view {
						height: 48%;
						image {
							height: 100%;
						}
					}
				}
			}
		}
	}
</style>

<template>
	<view class="goodsList">
		<view v-for="(item, index) in goodsList" :key="item.cat_id" class="goods" @click="toDetail(item.goods_id)">
			<view>
				<!-- logo -->
				<image :src="item.goods_small_logo" mode="widthFix"></image>
			</view>
			<view class="detail">
				<!-- 名字 -->
				<view class="name">{{ item.goods_name }}</view>
				<!-- 价格 -->
				<view class="text">￥{{ item.goods_price }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList: [],
				parmas: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				total: 0
			}
		},
		onPullDownRefresh() {
			this.parmas.pagenum = 1
			this.total = 0
			this.goodsList = []
			this.getGoodsList(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if (this.parmas.pagenum * this.parmas.pagesize <= this.total) {
				console.log(this.total)
				this.parmas.pagenum++
				this.getGoodsList()
			}
		},
		methods: {
			async getGoodsList(cb) {
				let res = await uni.$http.get('/api/public/v1/goods/search', this.parmas)
				console.log(res)
				cb && cb()
				this.goodsList = [...this.goodsList, ...res.data.message.goods]
				this.total = res.data.message.total
			},
			toDetail(id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
				})
			}
		},
		onLoad(options) {
			this.parmas.query = options.query
			console.log('🚀 ~ options:', options)
			this.parmas.cid = options.cid || ''
			this.getGoodsList()
		}
	}
</script>

<style lang="scss">

	.goods {
		display: flex;
		font-size: 30rpx;
		margin-left: 10rpx;
		margin-top: 10rpx;

		image {
			width: 260rpx;
		}

		.detail {
			position: relative;
			padding: 10rpx;

			.name {
				word-break: break-all;
			}

			.text {
				position: absolute;
				left: 0;
				bottom: 10rpx;
				color: red;
			}
		}
	}
</style>

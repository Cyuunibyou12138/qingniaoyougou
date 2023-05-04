<template>
	<view class="bg">
		<view class="searchBox" @click="tzsearch">
			<!-- 图标 -->
			<uni-icons type="search" size="30"></uni-icons>
			<!-- text -->
			<text>搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-serach",
		data() {
			return {
				
			};
		},
		methods:{
			tzsearch(){
				uni.navigateTo({
					url: '/subpkg/goods_search/goods_search',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style lang="scss">
	.bg{
		background-color: red;
		height: 40px;
		padding: 5px 15px 0;
		.searchBox{
			height: 28px;
			line-height: 28px;
			background-color: white;
			border-radius: 17px;
			text-align: center;
			text{
				margin-left: 5px;
				font-size: 40rpx;
				vertical-align: middle;
			}
		}
	}
</style>
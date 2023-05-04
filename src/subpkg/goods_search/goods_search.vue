<template>
	<view>
		<!-- clearButton是否显示清除按钮:always,auto,none -->
		<!-- cancelButton是否显示取消按钮: always,auto,none-->
		<view class="bg">
			<uni-search-bar :radius="100" @confirm="search" confirm="input" placeholder="请输入搜索内容" @cancel="clear" @clear="clear"> </uni-search-bar>
		</view>

		<!-- 搜索建议区域 -->
		<view class="suggestList">
			<view v-for="(item,index) in suggestList" :key="item.goods_id">
				<text>{{item.goods_name}}</text>
				<uni-icons type="forward" size="17"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史部分 -->
		<view class="historyQuery"  v-if="flag">
			<view class="historyText">
				<text>搜索历史</text>
				<uni-icons type="trash-filled" size="20"></uni-icons>
			</view>
			<view class="historyCon">
				<text v-for="(item,index) in historyQuery" :key="index" @click="tzDetailList(item.cat_name,item.cat_id)">{{item}}</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				suggestList: [],
				query: '',
				timer:null,
				historyQuery:[],
				historyList:[],
				flag:true,
				obj:{}
			}
		},
		methods: {
			tzDetailList(query,cid){
				
			},
			search(e) {
				if(e.value===this.query) return
				this.flag = false
				this.query = e.value.trim()
				this.historyQuery.unshift(this.query)
				this.historyQuery = Array.from(new Set(	this.historyQuery))
				this.getSuggestList()
			},
			async getSuggestList() {
				const res = await uni.$http.get(`/api/public/v1/goods/qsearch?query=` + this.query)
				this.suggestList = res.data.message
				this.obj[this.query]=this.suggestList
				uni.setStorageSync('hisQuery',JSON.stringify(this.historyQuery))
				uni.setStorageSync('hisList',JSON.stringify(this.obj))
			},
			clear(){
				this.suggestList=[]
				this.query=''
				this.flag=true
			}

		},
		mounted(){
			this.historyQuery =JSON.parse(uni.getStorageSync('hisQuery')) ||[]
			this.historyList =JSON.parse(uni.getStorageSync('hisList')) ||[]
		}
	}
</script>

<style lang="scss">
	.bg {
		background-color: red;
	}
	.historyQuery{
		font-size: 24rpx;
		.historyText{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:0 10px
		}
		.historyCon{
			display: flex;
			flex-wrap: wrap;
			text{
				background-color: gainsboro;
				padding: 5px 10px;
				margin-left: 15px;
				border-radius: 5px;
			}
		}
	}
	.suggestList {
		view {
			display: flex;
			padding: 10px 5px;
			border-bottom: 1px solid lightgray;
			text {
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size: 24rpx;
				overflow: hidden;
			}

		}

	}
</style>

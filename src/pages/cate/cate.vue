<template>
	<view>
		<my-serach></my-serach> 
  <view class="cate">
    <!-- 左 -->
    <scroll-view scroll-y="true" class="navLeft" :style="'height:'+gaodu ">
      <view v-for="(item,index) in catList" :key="item.cat_id" @click="changeIndex(item.cat_id)" :class="{'border':item.cat_id===activeCatId}">
        {{item.cat_name}}
      </view>
    </scroll-view>
    <!-- 右 -->
    <scroll-view scroll-y="true" class="navRight" :style="'height:'+gaodu" :scroll-top="scrollTop" >
      <view v-for="(item1,index1) in catList" :key="item1.cat_id">
        <view v-for="(item2,index2) in item1.children" 
        v-show="item1.cat_id ==activeCatId" class="item">
          <view>
            <!-- 电视 -->
            /{{item2.cat_name}}/
          </view>
          <!-- 电视子项目 -->

          <!-- 具体项目 -->
          <view class="itemSon">
            <view v-for="(item3,index3) in item2.children"
						@click="tzList(item3.cat_name,item3.cat_id)">
             {{item3.cat_name}}
            </view>
          </view>

        </view>
      </view>
    </scroll-view>
  </view>
	</view>
</template>

<script>
  import mix from '../../mixins/mixins'
 export default {
  mixins:[mix],
    data() {
      return {
        catList: [],
        // 屏幕高度
        gaodu: '',
        activeCatId: 1,
				scrollTop:0
      }
    },
    methods: {
      async getCatList() {
        const res = await uni.$http.get('/api/public/v1/categories')
        this.catList = res.data.message
      },
      changeIndex(id) {
        this.activeCatId = id
				this.scrollTop=this.scrollTop===0?1:0
      },
			tzList(query,cid){
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?cid=${cid}&query=${query}`,
				});
			},
			
    },
    mounted() {
      this.getCatList()
      this.gaodu = uni.getSystemInfoSync().windowHeight-40 + 'px'
    }
  }
</script>

<style lang="less">
  .cate {
    display: flex;

    .navLeft {
      width: 30%;
			background-color: lightgray;
      view {
        text-align: center;
        height: 100rpx;
        line-height: 100rpx;
				border-left: 2px solid transparent;
				&.border{
					border-left: 2px solid red;
					background-color: white;
				}
      }
    }

    .navRight {
      width: 70%;
      text-align: center;

      .item {
        margin-bottom: 50rpx;
        .itemSon {
          display: flex;
          flex-wrap: wrap;
          width: 100%;

          >view {
            margin-top: 50rpx;
            width: 33%; 
          }

        }

      }
    }
  }
</style>

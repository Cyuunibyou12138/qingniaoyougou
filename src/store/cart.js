import Vue from 'vue'
export default {
	namespaced: true,
	state: {
		address: uni.getStorageSync('address')||{},
		// 是否填写地址
		flag:  uni.getStorageSync('flag'),
		cartList: uni.getStorageSync('shopCart') || []
	},

	mutations: {
		addCart(state, goods) {
			let tempGoods = state.cartList.find(item => {
				return item.goods_id === goods.goods_id
			})
			if (tempGoods) {
				tempGoods.goods_count++
			} else {
				state.cartList.push(goods)
			}
			uni.setStorageSync('shopCart', state.cartList)
		},
		getCartList(state, shopCart) {
			if (!shopCart) return
			state.cartList = shopCart
		},
		updataGoodsCount(state, obj) {
			Vue.set(state.cartList[obj['index']], 'goods_count', obj['value'])
			uni.setStorageSync('shopCart', state.cartList)
		},
		delGoods(state, id) {
			let index = state.cartList.findIndex(item => {
				return item.goods_id === id
			})
			state.cartList.splice(index, 1)
			uni.setStorageSync('shopCart', state.cartList)
		},
		upDataChecked(state, obj) {
			let index = state.cartList.findIndex(item => {
				return item.goods_id === obj['id']
			})
			Vue.set(state.cartList[index], 'goods_checked', !obj['isChecked'])
			uni.setStorageSync('shopCart', state.cartList)
		},
		changeAll(state,isAll) {
			state.cartList.forEach(item => {
				Vue.set(item,'goods_checked',!isAll)
			})
		},
		updataAddress(state, res) {
			state.address = res
			uni.setStorageSync('address',res)
			state.flag = true
			uni.setStorageSync('flag',true)
		},
	},
	actions:{
		getAddress(state) {
			uni.chooseAddress({
				success(res) {
					state.commit('updataAddress', res)
				}
			})
		},
	},
	getters: {
		total(state) {
			let count = 0
			state.cartList.forEach(item => {
				count += item.goods_count
			})
			return count
		},
		isAll(state) {
			let flag = state.cartList.every(item => {
				return item.goods_checked === true
			})
			return flag
		},
		price(state){
			let price = 0
			state.cartList.forEach(item => {
				if(item.goods_checked){
					price += item.goods_price*item.goods_count
				}
			})
			return price
		},
		count(state){
			let count = 0
			state.cartList.forEach(item => {
				if(item.goods_checked){
					count += item.goods_count
				}
			})
			return count
		}
	}
}

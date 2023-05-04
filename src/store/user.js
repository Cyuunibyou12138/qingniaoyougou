export default {
	namespaced: true,
	state: {
		
		user: {
			code: '',
			encryptedData: '',
			iv: '',
			rawData: '',
			signature: ''
		},
		token: uni.getStorageSync('token') || '',
		userInfo: uni.getStorageSync('userInfo') || {}
	},
	mutations: {
		
		login(state, res) {
			state.user.code = res.code
		},
		wxInfo(state, res) {
			state.user.encryptedData = res.encryptedData
			state.user.iv = res.iv
			state.user.rawData = res.rawData
			state.user.signature = res.signature
			console.log(state.token)
			state.token =
				'Loremipsumdolorsitametconsecteturadipisicingelit.Numquamsimiliqueeaquerationecumquamdoloribusmolestiaetemporavoluptateliberosit!'
			state.userInfo.nickName = '微信用户'
			state.userInfo.avatarUrl =
				'https://img1.baidu.com/it/u=2308636637,1163408392&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
			uni.setStorageSync('token', state.token)
			uni.setStorageSync('userInfo', state.userInfo)
		},
		logout(state){
			state.token = ''
			uni.removeStorageSync('token')
		}
	},
	actions: {
		
		uniLogin(state) {
			wx.showLoading({
				title: '登陆中',
				mask: true,
			})
			uni.login({
				provider: 'weixin', //使用微信登录
				success: result => {
					state.commit('login', result)
					console.log(result)
				},
				fail: error => {
					console.log(error)
				}
			})
			wx.getUserProfile({
				desc: '学习中捏',
				success: res => {
					state.commit('wxInfo', res)
					console.log(res)
					uni.$http.post('/api/public/v1/users/wxlogin', state.user).then(res => {
						if (res.data.meta.status === 400) {
							//获取头像，用户名
							wx.hideLoading()
						}
					})
				},
				fail: error => {
					console.log(error)
				}
			})
		}
	}
}

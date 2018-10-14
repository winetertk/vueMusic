import 'babel-polyfill';//解决ie浏览器不支持promise
import './assets/common/reset.css'
import './assets/common/common.css'
import './assets/iconfont/iconfont.css'
import 'mint-ui/lib/style.css'
import 'iview/dist/styles/iview.css';
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import axios from 'axios'
import iView from 'iview';
import store from './components/store/store'

Vue.use(MintUI)
Vue.use(iView);
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.prototype.$axios = axios;
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

// 路由切换loading
router.beforeEach(function(to, from, next){
  store.commit('loadingStatus', {'isLoading': true});
  next()
})
router.afterEach(function (to) {
  store.commit('loadingStatus', {'isLoading': false})
})

// axios请求中loading
// axios.interceptors.request.use(config => {
//   console.log('ajax begin request')
//   store.commit('loadingStatus', {'isLoading': true})
//   return config;
// })

// axios.interceptors.response.use(config => {
//   console.log('ajax end')
//   store.commit('loadingStatus', {'isLoading': false})
//   return config;
// })

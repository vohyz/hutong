// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './element/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'

import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://39.107.229.211:8081/api/test'
}))

Vue.use(VueAxios, axios)
Vue.use(ElementUI)
// 将axios绑定
Vue.prototype.$axios = axios
Vue.config.productionTip = false
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

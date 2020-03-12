import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import App from '../App.vue'
import { Message } from 'element-ui'
import login from '@/components/login'
import index from '@/components/Index'
import memoryDetails from '@/components/memoryDetails'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
	{
	  path: '/index',
	  name: 'index',
	  component: index,
		meta: {
			requireAuth: true,
			keepAlive: true, //此组件不需要被缓存
		}
	},
	{
	  path: '/login',
	  name: 'login',
	  component: login
	},
	{
	  path:'/memory/:id',
	  name: 'memory',
	  component:memoryDetails,
	},
  ]
})

router.beforeEach((to, from, next) => {
  // 获取用户登录成功后储存的登录标志
  let getFlag = localStorage.getItem('Flag')
  // 如果登录标志存在且为isLogin，即用户已登录
  if (getFlag === 'isLogin') {
    // 设置vuex登录状态为已登录
    store.state.isLogin = true
    next()
    // 如果已登录，还想想进入登录注册界面，则定向回首页
    if (to.meta.isLogin === false) {
      Message({
        message: '请先退出登录',
        showClose: true
      })
      next({
        path: '/'
      })
    }
  // 如果登录标志不存在，即未登录
  } else {
    // 用户想进入需要登录的页面，则定向回登录界面
    if (to.meta.isLogin) {
      next({
        path: '/'
      })
      Message({
        message: '请先登录',
        showClose: true
      })
    // 用户进入无需登录的界面，则跳转继续
    } else {
      next()
    }
  }
})

router.afterEach(route => {
  window.scroll(0, 0)
})

export default router

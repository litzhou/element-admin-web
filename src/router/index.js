import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'
import Login from '@/views/auth/Login'
import E404 from '@/views/auth/E404'
import store from '@/store/index'
import lazyLoading from './lazyLoading'
import api from '../api/api'
import NProgress from 'nprogress'
let _layout = Cookies.get('layout') ? Cookies.get('layout') : '固定布局'
console.log(_layout)
const Layout =
  _layout === '固定布局'
    ? lazyLoading('layout/Home1')
    : lazyLoading('layout/Home')
Vue.use(Router)

let constantRouterMap = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/',
    name: 'Top',
    component: Layout,
    redirect: '/index',
    meta: { title: '首页', icon: 'icon-createtask'},
    children: [
      {
        path: '/index',
        name: 'Index',
        component: lazyLoading('views/Index'),
        meta: { auth: "index", title: '控制台'}
      },
      {
        path: '/icon',
        name: 'Icon',
        component: lazyLoading('components/Icon'),
        meta: {auth: "icon", title: '字体图标'}
      },
      {
        path: '/dep',
        name: 'Dep',
        component: lazyLoading('views/sys/Dep'),
        meta: {auth: "dep", title: '项目依赖'}
      }
    ]
  },
  {
    path: '/',
    name: 'Sys',
    component: Layout,
    meta: { title: '系统管理', icon: 'icon-manage'},
    redirect: '/index',
    children: [
      {
        path: '/lang',
        name: 'Lang',
        component: lazyLoading('views/i18n/Lang'),
        meta: { auth: "lang", title: '语言国际化'}
      },
      {
        path: '/echarts',
        name: 'Echarts',
        component: lazyLoading('views/echarts/Index'),
        meta: { auth: "echarts", title: '百度图表'}
      },
      {
        path: '/editor',
        name: 'Editor',
        component: lazyLoading('views/editor/Editor'),
        meta: { auth: "editor", title: '富文本编辑器'}
      },
      {
        path: '/markdown',
        name: 'Markdown',
        component: lazyLoading('views/editor/Markdown'),
        meta: {auth: "markdown", title: 'Markdown编辑器'}
      },
      {
        path: '/crud',
        name: 'CRUD',
        component: lazyLoading('views/auth/CRUD'),
        meta: { auth: "crud", title: '增删改查'}
      }
    ]
  },
  {
    path: '/*',
    name: '404',
    component: E404,
    meta: { title: '页面找不到', hidden: true}
  }
]


// 处理登录
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 没有角色并且去的不是登录页 我们拉取角色 如果拉取不到角色 说明没有登录
  if (!store.state.sys.menu && to.path !== '/login') {
    api.GET_USER_INFO().then(res => {
      console.log(res)
      if (res.success) {
        store.commit('FILTER_MENU', res.data.menu)
        router.addRoutes(store.state.sys.menu)
        next(...to)
      } else {
        next({path: '/login', query: {redirect: to.fullPath}})
      }
    })
  }else{
    next()
  }
  next({query: {redirect: to.fullPath}})

  /**
  if (to.meta.auth) {
    // 登录验证 有token就一定有角色
    //let token = Cookies.get('userid')
    let token = to.meta.auth
    if (token) {
      if (to.path === '/login') {
        next({path: '/index'})
      }
      next({query: {redirect: to.fullPath}})
    } else {
      next({path: '/login', query: {redirect: to.fullPath}})
    }
  } else {
    next()
  }
   */
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
export default router

import * as types from '../mutation-types'
import {asyncRouterMap} from '@/router/index'
import Cookies from 'js-cookie'

// initial state
const state = {
  layout: '固定布局',
  isCollapse: false, // 菜单状态是否收起
  menu: null, // 菜单
  lang: 'zh' // 语言
}

function hasMenu(menu, route) {
  if (route.meta && route.meta.auth) {
    if(menu.indexOf(route.meta.auth) !== -1){
      return true
    }else{
      return false
    }
  } else {
    return true
  }
}

function filterMenuRouter(asyncRouterMap,menu){
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasMenu(menu, route)) {
      if (route.children && route.children.length) {
        route.children = filterMenuRouter(route.children, menu)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

// getters
const getters = {}

// mutations
const mutations = {
  /*
  当前菜单收展状态
  */
  [types.IS_COLLAPSE](state, payload) {
    state.isCollapse = !state.isCollapse
  },
  /*
  布局
  */
  [types.LAYOUT](state, payload) {
    state.layout = payload
    Cookies.set('layout', payload)
  },
/**
 * 
 * 过滤菜单
 * 
 */
  [types.FILTER_MENU](state, payload) {
    state.menu = filterMenuRouter(asyncRouterMap, payload)
  },


  // 设置语言
  [types.SET_LANG](state, payload) {
    state.lang = payload
    window.localStorage.setItem('lang', payload)
  }
}

// actions
const actions = {

}

export default {
  state,
  getters,
  actions,
  mutations
}

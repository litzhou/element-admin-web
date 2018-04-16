import fetch from './fetch'

/**
 * 登录
 * @param {String} username
 * @param {String} password
 */
const LOGIN = params => {
  return fetch({url: '/login/doLogin', method: 'post', data: params})
}

/**
 * 获取菜单
 */
const GET_MENU = params => {
  return fetch({url: `/api/menu`, method: 'get', params: params})
}
/**
 * 获取用户信息
 */
const GET_USER_INFO = params => {
  return fetch({url: `/login/info`, method: 'get', params: params})
}

/**
 * 获取用户列表
 */
const USER_LIST = params => {
  return fetch({url: `/user/list`, method: 'get', params: params})
}

/**
 * 删除用户列表
 */
const USER_DELETE = params => {
  return fetch({url: `/user/delete`, method: 'delete', data: params})
}

/**
 * 新增用户
 */
const USER_ADD = params => {
  return fetch({url: `/user/add`, method: 'post', data: params})
}

/**
 * 修改用户
 */
const USER_EDIT = params => {
  return fetch({url: `/user/edit`, method: 'put', data: params})
}

const apiList = {
  LOGIN,
  GET_MENU,
  GET_USER_INFO,
  //用户管理
  USER_LIST,
  USER_ADD,
  USER_DELETE,
  USER_EDIT
}

export default apiList

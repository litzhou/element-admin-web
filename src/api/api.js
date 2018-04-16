import fetch from './fetch'

export default {
  // 登录
   LOGIN : params => {return fetch({url: '/login/doLogin', method: 'post', data: params})},
  //获取菜单
   GET_MENU :  params => { return fetch({url: `/api/menu`, method: 'get', params: params})},
   //获取用户信息
   GET_USER_INFO :  params => {  return fetch({url: `/login/info`, method: 'get', params: params})},
   //分页获取用户列表
   USER_LIST : params => { return fetch({url: `/user/list`, method: 'get', params: params})},
  //删除用户列表
   USER_DELETE : params => {return fetch({url: `/user/delete`, method: 'delete', data: params})},
   //新增用户
   USER_ADD : params => { return fetch({url: `/user/add`, method: 'post', data: params})},
   //修改用户
   USER_EDIT : params => { return fetch({url: `/user/edit`, method: 'put', data: params})},

   //分页获取角色列表
   ROLE_LIST : params => { return fetch({url: `/role/list`, method: 'get', params: params})},
   //获取所有角色
   ROLE_ALL_LIST : params => { return fetch({url: `/role/allList`, method: 'get', params: params})},
  //删除角色列表
   ROLE_DELETE : params => {return fetch({url: `/role/delete`, method: 'delete', data: params})},
   //新增角色
   ROLE_ADD : params => { return fetch({url: `/role/add`, method: 'post', data: params})},
   //修改角色
   ROLE_EDIT : params => { return fetch({url: `/role/edit`, method: 'put', data: params})}
}
import fetch from './fetch'

export default {
  // 登录
   LOGIN : params => {return fetch({url: '/login/doLogin', method: 'post', data: params})},

   /**
    * 用户
    */
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

   /**
    * 角色
    */
   //分页获取角色列表
   ROLE_LIST : params => { return fetch({url: `/role/list`, method: 'get', params: params})},
   //获取所有角色
   ROLE_ALL_LIST : params => { return fetch({url: `/role/allList`, method: 'get', params: params})},
  //删除角色列表
   ROLE_DELETE : params => {return fetch({url: `/role/delete`, method: 'delete', data: params})},
   //新增角色
   ROLE_ADD : params => { return fetch({url: `/role/add`, method: 'post', data: params})},
   //修改角色
   ROLE_EDIT : params => { return fetch({url: `/role/edit`, method: 'put', data: params})},

   /**
    * 用户角色
    */
   ROLE_ID_BY_UID : params => { return fetch({url: `/userRole/getRoleIdByUid`, method: 'get', params: params})},

   /**
    * 部门
    */
  //分页获取部门列表
  DEPT_LIST : params => { return fetch({url: `/dept/list`, method: 'get', params: params})},
  //获取所有的部门
  DEPT_ALL_LIST : params => { return fetch({url: `/dept/Alllist`, method: 'get', params: params})},
  //删除部门列表
  DEPT_DELETE : params => {return fetch({url: `/dept/delete`, method: 'delete', data: params})},
  //新增部门
  DEPT_ADD : params => { return fetch({url: `/dept/add`, method: 'post', data: params})},
  //修改部门
  DEPT_EDIT : params => { return fetch({url: `/dept/edit`, method: 'put', data: params})},

  /**
   * 日志
   */
  //分页获取日志列表
  LOG_LIST : params => { return fetch({url: `/log/list`, method: 'get', params: params})},

  /**
   * 菜单/权限
   */
  //编辑菜单
  MENU_EDIT : params => { return fetch({url: `/menu/edit`, method: 'put', data: params})},
  //根据父级菜单ID获取子菜单列表
  MENU_BY_PID : params => { return fetch({url: `/menu/getListByPid`, method: 'get', params: params})},
  //根据角色ID获取角色权限，得到的结果角色用有的菜单ID集合
  FIND_MENU_ID_BY_ROLE_ID : params => { return fetch({url: `/roleMenu/getMenuIdByRoleId`, method: 'get', params: params})},
  //分配权限
  AUTH_SAVE : params => { return fetch({url: `/roleMenu/saveAuth`, method: 'post', params: params})}
}
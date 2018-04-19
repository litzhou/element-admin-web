<template>
  <div>
    <!-- 导航栏 -->
    <div style="padding: 10px;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>分配权限</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="10">
      <el-col :xs="6" :lg="6">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>选择角色</span>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top-start">
              <el-button style="float: right; padding: 3px 0" type="text" @click="getAllRole">
                <v-icon name="icon-refresh"></v-icon>
              </el-button>
            </el-tooltip>
          </div>
          <el-menu style="max-height:600px;overflow-y:auto;">
            <el-menu-item v-for="item in roleList" :index="item.id" @click="changeChecked(item.id)">
              {{ item.roleName }} <v-icon name="icon-enter" ></v-icon>
           </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :xs="18" :lg="18">
        <el-card class="no-shadow">
          <div slot="header" class="clearfix">
            <span>选择权限</span>
          </div>
          <el-container style="max-height:600px;overflow-y:auto;">
            <el-tree node-key="id" :default-checked-keys="checkedKeys"   default-expand-all ref="tree"
            :data="data" :props="defaultProps" lazy show-checkbox :load="loadNode">
              <span slot-scope="{ node, data }">
                <span>{{ node.label }} {{node.data.resource ? '('+node.data.resource+')' : ''}}</span>
              </span>
            </el-tree>
          </el-container>
          <div style="padding:10px;">
             <el-button type="primary" @click="handleSaveAuth" :disabled="this.roleId===null">保存权限</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleId: null,
      roleList: [],
      checkedKeys: [],
      defaultProps: {
        id: 'id',
        label: 'menuName'
      }
    }
  },
  methods: {
    //获取角色
    async getAllRole(){
      let res = await this.$api.ROLE_ALL_LIST()
      this.roleList = res.data
    },
    //获取菜单
    async loadNode(node, resolve){
      if(node.level === 3){
        return resolve([])
      }
      let pid = '0';
      if (node.id > 0) {
        pid = node.key
      }
      let res = await this.$api.MENU_BY_PID({pid:pid})
      return  resolve(res.data)

    },
    //选择角色，查询角色权限
    async changeChecked(id){
      this.roleId = id
      let res = await this.$api.FIND_MENU_ID_BY_ROLE_ID({roleId:id})
      this.checkedKeys = res.data;
      this.$refs.tree.setCheckedKeys(this.checkedKeys);
    },
    //保存权限
   async handleSaveAuth(){
      let chenckedIds = this.$refs.tree.getCheckedKeys();
      let res = await this.$api.AUTH_SAVE({roleId:this.roleId,authIds:chenckedIds})
    }
  },
  created() {
    this.getAllRole()
  }
}
</script>

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
          <el-menu style="height:600px;overflow-y:auto;">
            <el-menu-item v-for="item in roleList" :index="item.id" @click="changeChecked(item.id)">
              {{ item.roleName }} <v-icon name="icon-enter" ></v-icon>
           </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :xs="9" :lg="9">
        <el-card class="no-shadow">
          <div slot="header" class="clearfix">
            <span>选择权限</span>
          </div>
          <el-container style="height:550px;overflow-y:auto;">
            <el-tree node-key="id" :default-checked-keys="checkedKeys"   default-expand-all ref="tree" style="width:100%"
            :data="data" :props="defaultProps" lazy show-checkbox :load="loadNode"  @node-click="nodeClick">
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

      <el-col :xs="9" :lg="9">
        <el-card class="no-shadow">
          <div slot="header" class="clearfix">
            <span>编辑权限</span>
          </div>
          <el-form :model="form" v-loading="loading" style="height:600px;overflow-y:auto;" :rules="rules" ref="form">
            <el-form-item label="ID" :label-width="formLabelWidth" >
              <el-input v-model="form.id"  disabled auto-complete="off" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
              <el-input v-model="form.menuName" auto-complete="off" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="权限资源" :label-width="formLabelWidth" prop="resource">
              <el-input v-model="form.resource" auto-complete="off" placeholder="请输入菜单资源名称"></el-input>
            </el-form-item>
            <el-form-item label="URL" :label-width="formLabelWidth">
              <el-input v-model="form.url" auto-complete="off" placeholder="URL"></el-input>
            </el-form-item>
            <el-form-item label="图标" :label-width="formLabelWidth">
              <el-input v-model="form.icon" auto-complete="off" placeholder="图标"></el-input>
            </el-form-item>
            <el-form-item label="排序" :label-width="formLabelWidth">
              <el-input v-model="form.sort" auto-complete="off" type="number" placeholder="排序"></el-input>
            </el-form-item>
            <el-form-item label="编码" :label-width="formLabelWidth">
              <el-input v-model="form.code" auto-complete="off"  placeholder="编码"></el-input>
            </el-form-item>
            <el-form-item label="深度" :label-width="formLabelWidth">
              <el-input v-model="form.deep"  disabled auto-complete="off"  placeholder="深度"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth">
              <el-button type="primary" @click="handlerEdit" :disabled="form.id===''">保存</el-button>
              <el-button @click="form = {id:''}">取消</el-button>
            </el-form-item>
          </el-form>
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
      },
      formLabelWidth: '100px',
      form:{
        id: '',
        code: '',
        menuName: '',
        pid: '',
        resource: '',
        sort:'',
        deep:''
      },
      rules:{
        menuName:[
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ],
        resource:[
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ]
      },
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
      this.form = {id:''}
      this.roleId = id
      let res = await this.$api.FIND_MENU_ID_BY_ROLE_ID({roleId:id})
      this.checkedKeys = res.data;
      this.$refs.tree.setCheckedKeys(this.checkedKeys);
    },
    //保存权限
    async handleSaveAuth(){
      let chenckedIds = this.$refs.tree.getCheckedKeys();
      let res = await this.$api.AUTH_SAVE({roleId:this.roleId,authIds:chenckedIds})
    },
    //编辑权限
    handlerEdit(){
      this.$refs['form'].validate((valid) => {
        if(valid){ this.postData() }
      });
    },
    async postData(){
      let res = await this.$api.MENU_EDIT(this.form)
    },
    //节点点击
    nodeClick(data) {
      this.form = data
    }
  },
  created() {
    this.getAllRole()
  }
}
</script>

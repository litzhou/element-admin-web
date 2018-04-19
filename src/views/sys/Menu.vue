<template>
  <div>
    <!-- 导航栏 -->
    <div style="padding: 10px;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="10">
      <el-col :xs="8" :lg="8">
        <el-card class="no-shadow">
          <div slot="header" class="clearfix">
            <span>菜单/权限</span>
          </div>
          <el-container style="max-height:700px;overflow-y:auto;width:100%">
            <el-tree node-key="id" default-expand-all ref="tree" style="width:100%"
            :data="data" :props="defaultProps" lazy :load="loadNode" @node-click="nodeClick">
              <span slot-scope="{ node, data }">
                <span>{{ node.label }} {{node.data.resource ? '('+node.data.resource+')' : ''}}</span>
              </span>
            </el-tree>
          </el-container>
        </el-card>
      </el-col>
      <el-col :xs="16" :lg="16">
        <el-card class="no-shadow">
          <div slot="header" class="clearfix">
            <span>编辑</span>
          </div>
          <el-form :model="form" v-loading="loading">
            <el-form-item label="ID" :label-width="formLabelWidth" >
              <el-input v-model="form.id" readonly  auto-complete="off" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称" :label-width="formLabelWidth">
              <el-input v-model="form.menuName" auto-complete="off" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="权限资源" :label-width="formLabelWidth">
              <el-input v-model="form.resource" auto-complete="off" placeholder="请输入菜单资源名称"></el-input>
            </el-form-item>
            <el-form-item label="排序" :label-width="formLabelWidth">
              <el-input v-model="form.sort" auto-complete="off" type="number" placeholder="排序"></el-input>
            </el-form-item>
            <el-form-item label="编码" :label-width="formLabelWidth">
              <el-input v-model="form.code" auto-complete="off"  placeholder="编码"></el-input>
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
      defaultProps: {
        id: 'id',
        label: 'menuName'
      },
      formLabelWidth: '120px',
      form:{
        id: '',
        code: '',
        menuName: '',
        pid: '',
        resource: '',
        sort:'',
        deep:''
      }
    }
  },
  methods: {
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
    async handlerEdit(){
      let res = await this.$api.MENU_EDIT(this.form)
    },
    //节点点击
    nodeClick(data) {
      this.form = data
    }
  },
  created() {
  }
}
</script>

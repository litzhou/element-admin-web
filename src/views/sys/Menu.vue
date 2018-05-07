<template lang="html">
  <div>
    <div style="padding: 10px;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <!-- 菜单栏 -->
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-input placeholder="输入关键词按回车" v-model="search"  suffix-icon="el-icon-search" clearable style="width:200px;"  @keyup.enter.native="handleSearch"></el-input>
      </div>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="data"
        :columns="columns"
        :stripe="props.stripe"
        :border="props.border"
        :show-header="props.showHeader"
        :show-summary="props.showSummary"
        :show-row-hover="props.showRowHover"
        :show-index="props.showIndex"
        :tree-type="props.treeType"
        :is-fold="props.isFold"
        :expand-type="props.expandType"
        :selection-type="props.selectionType">
        <template slot="opts" slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popover trigger="click" placement="top" width="160" style="display:inline-block" v-model="scope.row.visible">
              <p>确定删除 {{scope.row.menuName}} 吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="hanleSingleDelete(scope.row)">确定</el-button>
              </div>
                <el-button type="text" slot="reference" @click="scope.row.visible = true" size="small" style="color:#f60">删除</el-button>
            </el-popover>
        </template>
      </zk-table>
    </el-card>
    <!-- 表单 -->
  <el-dialog :title="title" :visible.sync="dialogFormVisible" :append-to-body="true">
    <el-form :model="form" v-loading="loading" :rules="rules" ref="form">
      <el-form-item label="上级菜单" :label-width="formLabelWidth" prop="pid">
        <el-cascader
          :options="data"
          :props="cascaderProps"
          v-model="form.pid"
          :change-on-select="true"
          style="width:100%"
          placeholder="请选择上级菜单,默认不选为一级菜单"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
        <el-input v-model="form.menuName" auto-complete="off" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单URL" :label-width="formLabelWidth" prop="url">
        <el-input v-model="form.url" auto-complete="off" placeholder="请输入菜单URL"></el-input>
      </el-form-item>
      <el-form-item label="权限资源" :label-width="formLabelWidth">
        <el-input v-model="form.resource" auto-complete="off" placeholder="请输入菜单资源名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth">
        <el-input v-model="form.sort" auto-complete="off" type="number" placeholder="排序"></el-input>
      </el-form-item>
      <el-form-item label="图标" :label-width="formLabelWidth">
        <el-input v-model="form.icon" auto-complete="off"  placeholder="图标"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        cascaderProps:{
          label: 'menuName',
          value: 'id'
        },
        props: {
          stripe: true,
          border: true,
          showHeader: true,
          showSummary: false,
          showRowHover: true,
          showIndex: false,
          treeType: true,
          isFold: false,
          expandType: false,
          selectionType: true,
        },
        //查询参数
        search: '',
        loading: false,
        formLabelWidth: '120px',
        dialogFormVisible: false,
        title: '新增',
        form:{
          id: '',
          menuName: '',
          pid: ['0'], 
          icon: '',
          url: '',
          resource: '',
          sort:''
        },
        rules:{
          menuName:[
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
          ]
        },
        data: [],
        columns: [
          {
            label: '菜单名称',
            prop: 'menuName',
            width: '300px'
          },
          {
            label: '菜单URL',
            prop: 'url'
          },
          {
            label: '菜单图标',
            prop: 'icon'
          },
          {
            label: '排序',
            prop: 'sort'
          },
          {
            label: '深度(只读)',
            prop: 'deep'
          },
          {
            label: '资源标识',
            prop: 'resource'
          },
          {
            label: '操作',
            prop: 'opts',
            minWidth: '200px',
            type: 'template',
            template: 'opts',
          }
        ],
      };
    },
    created() {
      this.getData()
    },
    methods: {
      //查询数据
      async getData() {
        let res = await this.$api.MENU_LIST_ALL( {search: this.search} )
        this.data = res.data
      },
       //删除
      async hanleSingleDelete(row) {
        let res = await this.$api.MENU_DELETE({
          ids: [row.id]
        })
        this.getData()
      },
      //新增
      handleAdd() {
        this.title = '新增'
        this.form = {roleState:1,pid: ['0']}
        this.dialogFormVisible = true
      },
      //提交表单
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if(valid){ this.postData() }
        });
      },
      //取消表单
      cancelForm(){
        this.dialogFormVisible = false
        this.$refs["form"].resetFields()
      },
      //持久化数据
      async postData() {
        this.loading = true
        let res = ''
        let pid = this.form.pid
        if(pid){
          pid = pid[pid.length-1]
          this.form.pid = pid
        }else{
          this.form.pid = '0'
        }
        if (this.title === '新增') {
          res = await this.$api.MENU_ADD(this.form)
        } else {
          res = await this.$api.MENU_EDIT(this.form)
        }
        if(res.success){
          this.dialogFormVisible = false
          this.getData()
        }
        this.loading = false
      },
      //编辑
      handleEdit(row) {
        console.log(row)
        this.title = '编辑'
        this.dialogFormVisible = true
        this.form = row
        //this.form.pid = [row.pid]
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      //搜索
      handleSearch(){
        this.getData()
      }
    }
  };
</script>
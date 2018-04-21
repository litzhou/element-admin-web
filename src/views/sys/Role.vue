<template>
  <div>
    <!-- 导航栏 -->
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
        <el-popover
          placement="top"
          ref="popover5"
          v-model="batchDelVisible">
          <p>确定批量删除{{multipleSelection.length}}条记录？</p>
          <div style="text-align: right; margin: 5px;">
            <el-button size="mini" type="text" @click="batchDelVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="handleBatchDelete">确定</el-button>
          </div>
        </el-popover>
        <el-button v-popover:popover5 type="danger" @click="batchDelVisible=true" v-show="multipleSelection.length>0">批量删除</el-button>
        <el-input placeholder="输入关键词按回车" v-model="page.search"  suffix-icon="el-icon-search" clearable style="width:200px;"  @keyup.enter.native="handleSearch"></el-input>
      </div>
      <!-- 表格 -->
      <el-table :data="data" border stripe  @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column sortable  prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column sortable  prop="roleIdentification" label="角色唯一标识">
        </el-table-column>
        <el-table-column sortable prop="roleState" label="状态">
          <div slot-scope="scope">
            <span>{{ scope.row.roleState == 1 ? '启用' : '禁用' }}</span>
          </div>
        </el-table-column>
        <el-table-column sortable label="创建时间">
           <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleDesc" label="描述">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <div slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popover trigger="click" placement="top" width="160" style="display:inline-block" v-model="scope.row.visible">
              <p>确定删除{{scope.row.name}}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="hanleSingleDelete(scope.row)">确定</el-button>
              </div>
                <el-button type="text" slot="reference" @click="scope.row.visible = true" size="small" style="color:#f60">删除</el-button>
            </el-popover>
          </div>
        </el-table-column>
      </el-table>
      <!-- 分页条 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.current"
          :page-sizes="[10, 20, 30, 50, 100,200]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 表单 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-form :model="form" v-loading="loading" :rules="rules" ref="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" auto-complete="off" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="角色唯一标识" :label-width="formLabelWidth" prop="roleIdentification">
          <el-input v-model="form.roleIdentification" auto-complete="off" placeholder="请输入角色唯一标识"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="roleState">
          <el-select v-model="form.roleState" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.roleDesc">
          </el-input>
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
import {objectFly} from '@/util/index'
import { fail } from 'assert';
export default {
  data() {
    return {
      data: null,
      loading: false,
      multipleSelection: [],
      dialogFormVisible: false,
      title: '新增',
      batchDelVisible:false,
      formLabelWidth: '120px',
      form: {
        id:'',
        roleName: '',
        roleState: 1,
        roleDesc: ''
      },
      rules:{
        roleName:[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleIdentification:[{ required: true, message: '请输入角色唯一标识', trigger: 'blur' },],
        roleState:[{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      //分页查询参数
      page: {
        search: '',
        size: 10,
        total: 0,
        current: 1
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    //查询数据
    async getData() {
      let res = await this.$api.ROLE_LIST(this.page)
      this.data = res.data.records
      Object.assign(this.page,res.data)
      delete this.page.records
    },
    //批量删除
    async handleBatchDelete() {
      this.batchDelVisible = false
      let ids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id)
      }
      let res = await this.$api.ROLE_DELETE({
        ids: ids
      })
      this.getData()
    },
    //删除
    async hanleSingleDelete(row) {
      let res = await this.$api.ROLE_DELETE({
        ids: [row.id]
      })
      this.getData()
    },
    //新增
    handleAdd() {
      this.title = '新增'
      this.form = {roleState:1}
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
      if (this.title === '新增') {
        res = await this.$api.ROLE_ADD(this.form)
      } else {
        res = await this.$api.ROLE_EDIT(this.form)
      }
      if(res.success){
        this.dialogFormVisible = false
        this.getData()
      }
      this.loading = false
    },
    handleEdit(row) {
      this.title = '编辑'
      this.dialogFormVisible = true
      this.form = row
     // objectFly(this.form,row)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //搜索
    handleSearch(){
      this.page.current = 1
      this.getData()
    },
    //改变页大小
    handleSizeChange(size){
      this.page.size = size
      this.getData()
    },
    //改变当前页
    handleCurrentChange(current){
      this.page.current = current
      this.getData()
    }
  }
}
</script>

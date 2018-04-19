<template>
  <div>
    <!-- 导航栏 -->
    <div style="padding: 10px;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
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
        <el-table-column prop="userImg" label="头像" width="60">
          <template slot-scope="scope">
            <img :src="scope.row.userImg" style="width:30px;border-radius:20px">
          </template>
        </el-table-column>
        <el-table-column sortable  prop="userName" label="用户名">
        </el-table-column>
        <el-table-column sortable prop="userState" label="状态">
          <div slot-scope="scope">
            <span>{{ scope.row.userState == 1 ? '启用' : '禁用' }}</span>
          </div>
        </el-table-column>
        <el-table-column sortable label="创建时间">
           <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userDesc" label="描述">
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
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="form.userName" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入用密码"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="userState">
          <el-select v-model="form.userState" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth" prop="deptId">
         <el-select v-model="form.deptId" placeholder="请选择部门">
          <el-option
            v-for="item in depts"
            :key="item.id"
            :label="item.deptName"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select
            v-model="form.roleIds"
            multiple
            placeholder="请选择角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.userDesc">
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
export default {
  data() {
    return {
      data: null,
      loading: false,
      multipleSelection: [],
      dialogFormVisible: false,
      title: '新增',
      batchDelVisible:false,
      depts: [], //部门
      roles: [], //角色
      formLabelWidth: '120px',
      form: {
        id:'',
        userName: '',
        password: '',
        userState: 1,
        userDesc: '',
        deptId: '',
        roleIds: []
      },
      rules:{
        userName:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        password:[{ required: true, message: '请输入密码', trigger: 'blur' }],
        deptId:[{ required: true, message: '请选择部门', trigger: 'blur' }],
        userState:[{ required: true, message: '请选择状态', trigger: 'blur' }]
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
    this.getAllDept()
    this.getAllRole()
  },
  methods: {
    //获取用户列表
    async getData() {
      let res = await this.$api.USER_LIST(this.page)
      this.data = res.data.records
      Object.assign(this.page,res.data)
      delete this.page.records
    },
    //获取所有角色
    async getAllRole(){
      let res = await this.$api.ROLE_ALL_LIST()
      this.roles = res.data
    },
    //获取部门列表
    async getAllDept() {
      let res = await this.$api.DEPT_ALL_LIST()
      this.depts = res.data
    },
    //批量删除
    async handleBatchDelete() {
      this.batchDelVisible = false
      let ids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id)
      }
      let res = await this.$api.USER_DELETE({
        ids: ids
      })
      this.getData()
    },
    //单条删除
    async hanleSingleDelete(row) {
      let res = await this.$api.USER_DELETE({
        ids: [row.id]
      })
      this.getData()
    },
    //新增
    handleAdd() {
      this.title = '新增'
      this.form = {userState:1,roleIds:[]}
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
    async postData(){
      this.loading = true
      let res = ''
      if (this.title === '新增') {
        res = await this.$api.USER_ADD(this.form)
      } else {
        res = await this.$api.USER_EDIT(this.form)
      }
      if(res.success){
        this.dialogFormVisible = false
        this.getData()
      }
      this.loading = false
    },
    //编辑
    async handleEdit(row) {
      this.title = '编辑'
      this.dialogFormVisible = true
      Object.assign(this.form,row,{roleIds:[]})
      this.loading = true
      let res = await this.$api.ROLE_ID_BY_UID({userId:row.id})
      this.form.roleIds = res.data
      this.loading = false
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

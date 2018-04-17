<template>
  <div>
    <!-- 导航栏 -->
    <div style="padding: 10px;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <!-- 菜单栏 -->
      <div slot="header" class="clearfix">
        <el-input placeholder="输入关键词按回车" v-model="page.search"  suffix-icon="el-icon-search" clearable style="width:200px;"  @keyup.enter.native="handleSearch"></el-input>
      </div>
      <!-- 表格 -->
      <el-table :data="data" border stripe  style="width: 100%">
        <el-table-column sortable  prop="userName" label="用户" width="100">
        </el-table-column>
        <el-table-column prop="title" label="日志操作">
        </el-table-column>
        <el-table-column prop="url" label="地址">
        </el-table-column>
        <el-table-column prop="createTime" sortable label="时间">
        </el-table-column>
        <el-table-column prop="params" show-overflow-tooltip="true" label="参数">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <div slot-scope="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">详细参数</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: null,
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
    //获取数据
    async getData() {
      let res = await this.$api.LOG_LIST(this.page)
      this.data = res.data.records
      Object.assign(this.page,res.data)
      delete this.page.records
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
    },
    //查看参数
    handleView(row){
      this.$alert(row.params, {
          dangerouslyUseHTMLString: true
        });
    }
  }
}
</script>

<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="6" :lg="6">
          <el-menu>
            <el-menu-item v-for="item in roleList" index="itmm.id">{{ item.roleName }}</el-menu-item>
          </el-menu>
      </el-col>
      <el-col :xs="18" :lg="18">
        <el-card class="no-shadow">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: [{roleName:'超级管理员'},{roleName:'普通管理员'}],
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    async getAllRole(){
      let res = await this.$api.ROLE_ALL_LIST()
      this.roleList = res.data
    }
  },
  created() {
    //this.mockDemo()
    this.getAllRole()
  }
}
</script>

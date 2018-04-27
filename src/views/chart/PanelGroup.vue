<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel'>
        <div class="card-panel-icon-wrapper">
           <i class="icon iconfont icon-group_fill v-icon" style="color:#409EFF"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">New Visits</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="102400" :duration="2600"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper">
          <i class="icon iconfont icon-message_fill v-icon" style="color:#67C23A"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Messages</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="81212" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper">
          <i class="icon iconfont icon-redpacket_fill v-icon" style="color:#fbdb5a"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Purchases</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="9280" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <i class="icon iconfont icon-service_fill v-icon" style="color:#f2637b"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Shoppings</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="13600" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  name:'PanelGroup',
  components: {
    CountTo
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  .card-panel-col{
    margin-bottom: 20px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .card-panel-icon-wrapper {
      float: left;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      margin-left: 30px;
      .v-icon{
        font-size: 70px;
      }
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>

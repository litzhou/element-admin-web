<template>
  <el-container>
    <el-aside :style="{width:isCollapse?'64px':'200px'}" class="horizontal-collapse-transition">
      <el-menu @select="handleSelect"
        :background-color="theme.backgroundColor" 
        :text-color="theme.textColor" 
        :active-text-color="theme.activeTextColor" 
        :default-active="active" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-submenu v-for="(sub,i) in menu" :key="i" :index="i+'@'" v-show="!sub.meta.hidden">
          <div slot="title">
            <i class="el-icon iconfont" :class="sub.meta.icon"></i>
            <!-- <v-icon name="icon-qrcode_fill" class="el-icon-v"></v-icon> -->
            <span slot="title">{{sub.meta.title}}</span>
          </div>
          <el-menu-item v-if="menu" :index="item.path" v-for="item in sub.children" :key="item.path">{{item.meta.title}}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <v-icon name="icon-xuanxiang" class="menu" @click.native="handlerIsCollapse"></v-icon>
         <div id="t-title">基于ElementUI和SpringBoot的后台管理系统</div>
          <div class="logout">
            <el-tooltip :content="theme.name" placement="top">
              <el-switch
                v-model="theme.name"
                active-color="#dddddd"
                active-value="light"
                inactive-color="#545c64"
                inactive-value="dark" @change="changeTheme">
              </el-switch>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="userName" placement="top-end">
              <h2 style="float:left;padding-right:10px;">{{ userName }}</h2>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="screenfull? '还原': '全屏'" placement="top-end">
              <v-icon :name="screenfull ? 'icon-smallscreen' : 'icon-send'" @click.native="toggleScreen"></v-icon>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="布局" placement="top-end">
              <v-icon name="icon-workbench" @click.native="handleLayout" ></v-icon>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="退出" placement="top-end">
              <v-icon name="icon-tuichu1"  @click.native="logout"></v-icon>
            </el-tooltip>
          </div>
      </el-header>
      <el-main>
        <router-view/>
        <!-- <el-footer>Copyright © 2018 Artiely</el-footer> -->
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      screenfull: false,
      layout: Cookies.get('layout') ? Cookies.get('layout') : '固定布局',
      light:{name:'light', backgroundColor: "#ffffff" , textColor: "#303133" , activeTextColor: "#409EFF" },
      dark:{name:'dark', backgroundColor: "#545c64" , textColor: "#fff" , activeTextColor: "#ffd04b" }
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.sys.isCollapse
    },
    menu() {
      return this.$store.state.sys.menu
    },
    active() {
      return this.$route.path
    },
    userName(){
      return this.$store.state.sys.user.userName
    },
    theme(){
      return this.$store.state.sys.theme
    }
  },
  methods: {
    toggleScreen() {
      if (!this.screenfull) {
        var docElm = document.documentElement
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen()
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen()
        } else {
          this.$message({
            type: 'warning',
            message: '除了让你升级浏览器对方没什么好说的！'
          })
        }
        this.screenfull = true
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        } else {
          this.$message({
            type: 'warning',
            message: '请升级浏览器，不然我是不会理你的！'
          })
        }
        this.screenfull = false
      }
    },
    handlerIsCollapse() {
      this.$store.commit('IS_COLLAPSE')
    },
    handleLayout() {
      let _l = this.layout === '固定布局' ? '基础布局' : '固定布局'
      this.$store.commit('LAYOUT', _l)
      window.location.reload()
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleSelect(path) {
      this.$router.push(path)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    //退出
    async logout(){
      let res = await this.$api.LOGOUT()
      this.$router.push('login')
    },
    //改变主题
    changeTheme(value){
       this.$store.commit('SET_THEME', value === 'dark' ? this.dark : this.light)
       window.localStorage.setItem('theme',value)
    },
    //刷新初始化主题
    initTheme(){
      let theme = window.localStorage.getItem('theme') 
      this.$store.commit('SET_THEME',theme && theme === 'dark' ? this.dark :this.light )
    }
  },
  created(){
    this.initTheme()
  },
  mounted() {
    if (this.$store.state.sys.role === 'guest') {
      this.$notify.info({
        title: '消息',
        message: '游客没有权限查看所有菜单',
        offset: 60,
        duration: 0
      })
    }
  }
}
</script>
<style scoped lang="stylus">
.logout {
  height: 60px;
  float: right;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
}

.el-submenu__title i {
  font-size: 24px;
  margin-right: 4px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  max-width: 200px;
  min-width: 200px;
  flex: 0 0 200px;
}

.el-menu.el-menu-vertical-demo {
  border-right: none;
  min-height: 100vh;
}

.el-menu--collapse {
  max-width: 64px;
  min-width: 64px;
  flex: 0 0 64px;
}

.el-header {
  background-color: #fff;
  color: #333;
}

.el-footer {
  line-height: 60px;
  text-align: center;
  color: #666;
  background: #ddd;
  font-size: 16px;
}

.el-aside {
  box-shadow: 3px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: rgb(84, 92, 100);
  color: #333;
  text-align: left;
  position: relative;
  z-index: 99;
}

.el-main {
  background-color: #eee;
  color: #333;
  text-align: left;
}

.el-container {
  height: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}
#t-title{
  float: left;
  height: 60px;
  line-height: 60px;
  font-size: 17px;
  color: #000 !important;
}
</style>

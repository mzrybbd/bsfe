<template>
  <div class="layout">
    <el-container>
      <el-header class="header">
        <el-menu :default-active="this.$router.path" router mode="horizontal" class="menu" 
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
            {{ item.navItem }}
          </el-menu-item>
          <el-menu-item>
            <el-popover
              placement="bottom"
              width="400"
              trigger="hover">
              <div>
                <el-button type="primary" round size="small" @click="qiandao">签到</el-button>
                <el-button type="primary" round size="small" @click="qianli">签离</el-button>
              </div>
              <el-button slot="reference">签到</el-button>
            </el-popover>
          </el-menu-item>
          <el-menu-item>
            <el-button type="ghost" size="small" icon="iconfont icon-logout1" @click="logout">退出</el-button>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="main">
        <transition name="el-fade-in"><router-view></router-view></transition>
      </el-main>
      <el-footer class="footer">版权所有 &copy; 西北农林科技大学 2019 计算机组成原理实验系统</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList:[
        {name:'/',navItem:'首页'},
        {name:'/experiment',navItem:'实验'},
        {name:'/coursetable',navItem:'课表'},
        {name:'/message',navItem:'消息'},
        {name:'/personalCenter',navItem:'个人中心'}
      ]
    }
  },
  created() {
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      let userId = sessionStorage.getItem("uname");
      let role = sessionStorage.getItem("role");
      if (!userId || role !== '学生' ) {
        this.$message.info('请先登录')
        this.$router.push('/login')
        return;
      }
    },
    logout() {
      this.$confirm('确认退出系统?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.removeItem("uname");
        sessionStorage.removeItem("role");
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    },
    qiandao() {

    },
    qianli() {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.menu {
  display: flex;
  width: 70%;
  margin: 0 auto;
  justify-content: space-around;
}
.header {
  background-color: #545c64;
}
.main {
  width: 960px;
  background: #eee;
  margin: 0 auto;
}
.footer {
  margin: auto;
}
</style>

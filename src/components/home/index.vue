<template>
  <div class="hello">
    <el-menu :default-active="this.$router.path" router mode="horizontal">
      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
        {{ item.navItem }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList:[
        {name:'/',navItem:'首页'},
        {name:'/checkIn',navItem:'签到'},
        {name:'/experiment',navItem:'实验'},
        {name:'/coursetable',navItem:'课表'},
        {name:'/message',navItem:'消息'},
        {name:'/personalCenter',navItem:'个人中心'},
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
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

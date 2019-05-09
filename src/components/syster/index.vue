<template>
	<div class="layout">
		<el-container>
		  <el-header>
        <div class="layout-logo">
          <el-button size="small" type="text" icon="large iconfont icon-xueshimao-shi" style="font-size: 22px; color: #2d8cf0"> 计算机组成原理实验系统</el-button>
        </div>
          <div class="layout-nav">
	          <el-button-group>
	            <el-button type="ghost" size="small" icon="iconfont icon-user"> 当前用户：系统管理员</el-button>
	            <el-button type="ghost" size="small" icon="iconfont icon-logout1" @click="logout"> 退出</el-button>
	          </el-button-group>
        </div>
		  </el-header>
		  <el-container class="container">
		    <el-aside width="220px">
		    	<el-menu
		      default-active="1"
		      class="el-menu-vertical-demo"
		      @open="handleOpen"
		      @close="handleClose"
		      background-color="#545c64"
		      text-color="#fff"
		      active-text-color="#ffd04b"
		      @select="handleSelect">
		      <el-menu-item index="1">
		        <span slot="title">用户管理</span>
		      </el-menu-item>
		      <el-menu-item index="2">
		        <span slot="title">教师管理</span>
		      </el-menu-item>
		      <el-menu-item index="3">
		        <span slot="title">班级管理</span>
		      </el-menu-item>
		      <el-menu-item index="4">
		        <span slot="title">学生管理</span>
		      </el-menu-item>
		    </el-menu>
		    </el-aside>
		    <el-main class="main">
	        <el-col :span="24">
	          <div>
	            <transition name="el-fade-in"><router-view></router-view></transition>    <!-- 最重要的标签，用来显示跳转的页面 -->
	          </div>
	        </el-col>
		    </el-main>
		  </el-container>
      <el-footer>版权所有 &copy; 西北农林科技大学 2019 计算机组成原理实验系统</el-footer>
	</el-container>
	</div>
</template>
<script>
	export default {
		data() {
			return {

			}
    },
    created() {
      this.checkLogin()
    },
		methods: {
			handleSelect(key, keyPath){    
        switch(key){
          case '1':
            this.$router.push('/syster/user');
            break;
          case '2':
            this.$router.push('/syster/teacher');
            break;
          case '3':
            this.$router.push('/syster/class');
            break;
          case '4':
            this.$router.push('/syster/student');
            break;
        }
      },
      checkLogin() {
        let userId = sessionStorage.getItem("uname");
        let role = sessionStorage.getItem("role");
        if (!userId || role !== '管理员' ) {
          this.$message.info('请先登录')
          this.$router.push('/login')
          return;
        }
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
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
      }
		}
	}
</script>
<style lang="less">
  .el-table {
    margin: 0 auto;
  }
  .el-footer {
    margin: auto;
  }
  .el-table::before {
    height: 0;
  }
  .container {
    background-color: rgb(84, 92, 100);
    padding: 10px;
  }
	.layout{
      position: relative;
      height: 100%;
      overflow: hidden;
   }
  .layout-logo{
    height: 60px;
    line-height: 60px;
    color: #f5f7f9;
    float: left;
  }
  .layout-nav{
    height: 60px;
    line-height: 60px;
    margin-right: 5px;
    float: right;
  }
  .main {
    background-color: #eee;
    padding: 10px;
    border: 5px solid #fff;
  }
  .large {
    font-size: 24px;
  }
  .el-menu {
    height: 100%;
  }
</style>
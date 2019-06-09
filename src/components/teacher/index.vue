<template>
	<div class="layout">
		<el-container>
		  <el-header>
        <div class="layout-logo">
          <el-button size="small" type="text" icon="large iconfont icon-xueshimao-shi" style="font-size: 22px; color: #2d8cf0"> 计算机组成原理实验系统</el-button>
        </div>
          <div class="layout-nav">
	          <el-button-group>
	            <el-button type="ghost" size="small" icon="iconfont icon-user"> 当前用户：<em>{{ teacher[0].tname }}</em> 教师</el-button>
	            <el-button type="ghost" size="small" icon="iconfont icon-logout1" @click="logout"> 退出</el-button>
	          </el-button-group>
        </div>
		  </el-header>
		  <el-container class="container">
		    <el-aside width="220px">
		    	<el-menu
		      default-active="1-1"
		      class="el-menu-vertical-demo"
		      @open="handleOpen"
		      @close="handleClose"
		      background-color="#545c64"
		      text-color="#fff"
		      active-text-color="#ffd04b"
		      @select="handleSelect">
          <el-menu-item index="0">
		        <span slot="title">实验设置</span>
		      </el-menu-item>
          <el-menu-item index="1-1">
		        <span slot="title">学生管理</span>
		      </el-menu-item>
          <el-menu-item index="1-2">
		        <span slot="title">考勤管理</span>
		      </el-menu-item>
<!--           
		      <el-submenu index="1">
		        <template slot="title">学生管理</template>
            <el-menu-item index="1-1">学生管理</el-menu-item>
            <el-menu-item index="1-2">班级考勤</el-menu-item>
            <el-menu-item index="1-3">班级学情</el-menu-item>
		      </el-submenu> -->
		      <el-menu-item index="2">
		        <span slot="title">课表管理</span>
		      </el-menu-item>
		      <el-submenu index="3">
		        <template slot="title">实验管理</template>
            <el-menu-item index="3-1">实验上传</el-menu-item>
            <el-menu-item index="3-2">实验成绩</el-menu-item>
            <el-menu-item index="3-3">实验记录</el-menu-item>
		      </el-submenu>
		      <el-menu-item index="4">
		        <template slot="title">消息管理</template>
		      </el-menu-item>
          <el-menu-item index="5">
		        <template slot="title">个人中心</template>
		      </el-menu-item>
		    </el-menu>
		    </el-aside>
		    <el-main class="main">
	        <el-col :span="24">
	          <div>
	            <router-view></router-view>   <!-- 最重要的标签，用来显示跳转的页面 -->
	          </div>
	        </el-col>
		    </el-main>
		  </el-container>
      <el-footer>版权所有 &copy; 西北农林科技大学 2019 计算机组成原理实验系统</el-footer>
	</el-container>
	</div>
</template>
<script>
  import person_info from './chirdren/person_info.vue'
	export default {
    components: { person_info },
		data() {
			return {
        teacher: [{tname: ''}]
			}
    },
    created() {
      this.checkLogin()
    },
    mounted() {
      this.getTeacher()
    },
		methods: {
			handleSelect(key, keyPath){    
        switch(key){
          case '0':
            this.$router.push('/teacher/introduction')
            break;
          case '1-1':
            this.$router.push('/teacher/class_manager');
            break;
          case '1-2':
            this.$router.push('/teacher/kq_manager');
            break;
          case '2':
            this.$router.push('/teacher/coursetable_manager');
            break;
          case '3-1':
            this.$router.push('/teacher/expriment_manager');
            break;
          case '3-2':
            this.$router.push('/teacher/score_manager');
            break;
          case '3-3':
            this.$router.push('/teacher/expriment_record');
            break;
          case '4':
            this.$router.push('/teacher/message_manager');
            break;
          case '5':
            this.$router.push('/teacher/person_info');
            break;
        }
      },
      checkLogin() {
        let userId = this.teacher.tno = sessionStorage.getItem("uname");
        let role = this.teacher.role = sessionStorage.getItem("role");
        if (!userId || role !== '教师') {
          this.$message.info('请先登录')
          this.$router.push('/login')
          return;
        }
      },
      getTeacher() {
        this.$nextTick(function() {
          this.$ajax({
            url: "/teacher/one",
            data: {
              tno: this.teacher.tno
            }
          }).then(res => {
            this.teacher = res.data
          }).catch(err => {
            console.log(err)
          })
        })
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
    height: 550px;
    border: 5px solid #fff;
  }
  .large {
    font-size: 24px;
  }
  .el-menu {
    height: 100%;
  }
</style>
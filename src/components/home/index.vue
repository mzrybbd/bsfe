<template>
  <div class="layout">
    <el-container>
      <el-header class="header">
        <el-menu :default-active="this.$router.path" router mode="horizontal" class="menu" 
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
           <el-menu-item>
            <el-button type="text" icon="large iconfont icon-xueshimao-shi"> 计算机组成原理实验系统</el-button>
          </el-menu-item>
          <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
            {{ item.navItem }}
          </el-menu-item>
          <el-menu-item>
            <el-popover
              placement="bottom"
              width="400"
              trigger="hover">
              <div>
                <el-button type="primary" round size="small" @click="qiandao" :disabled="disabled">签到</el-button>
                <el-button type="primary" round size="small" @click="qianli" :disabled="disabled2">签离</el-button>
                <el-link type="info"  :underline="false">  {{ this.msg }}</el-link>
                <!-- <span> {{ this.msg }}</span> -->
              </div>
              <div>上课前5分钟内和下课后5分钟内为正常签到时间，无法提前签到或是延后签离</div>
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
      ],
      date: '',
      class: '',
      stime: '',
      etime: '',
      time: '',
      record: {},
      type: -1,
      msg: 'wode',
      disabled:　false,
      disabled2: false,
      id: -1,
    }
  },
  mounted() {
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
      this.$ajax({
        url: "/stu/one",
        data: {
          sno: sessionStorage.getItem('uname')
        }
      }).then(res => {
        if(res.status === 'success'){
          this.class = res.data[0].cname
        }
        else{
          this.$message.error(res.msg)
        }
      }).then((res) => {
        if(this.class){
          this.getCourseToday()
        }
      }).catch(err => {
        console.log(err)
      })
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
          message: '已取消退出'
        });          
      })
    },
    now() {
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let day = now.getDate()
      if(month < 10) {
          month = '0' + month
      }
      if(day < 10) {
          day = '0' + day
      }
      this.date = year + '-' + month + '-' + day
    },
    timeCha (date) {
      // 提前5分钟以上，不可以签到
      let now = new Date()
      let hour = now.getHours()
      let minutes = now.getMinutes()
      let seconds = now.getSeconds()
      if(hour < 10) {
        hour = '0' + hour
      }
      if(minutes < 10) {
        minutes = '0' + minutes
      }
      if(seconds < 10) {
        seconds = '0' + seconds
      }
      this.time = hour + ':' + minutes + ':' + seconds
      
      let ctTime = new Date(date).getTime()
      let ch = now.getTime() -  ctTime
      if(ch < -300000 || ch > 3600000) {
        this.type = 2
      }
      // 迟到0分钟，迟到
      else if(ch  > 0 ) {
        this.type = 1
      }
      // 提前5分钟可以签到
      else if(ch  >= -300000){
        this.type = 0
      }
      console.log('wowo', ch, this.time)
    },
    getCourseToday() {
      this.now()
      this.$ajax({
        url: "/stu/earlyTime",
        data: {
          cname: this.class,
          cdate: this.date
        }
      }).then(res => {
          console.log('getCourseToday', res.data)
          if(res.status === 'success' && res.data){
            this.record = res.data
            this.stime = res.data.cdate + ' ' + res.data.stime
            this.etime = res.data.cdate + ' ' + res.data.etime
            console.log('hhh', this.etime)
          } 
          else if(!res.data) {
            this.disabled2 = this.disabled = true;
            this.msg = '今天没有课程，不需要签到'
            this.$message.info('今天没有课程，不需要签到')
          }
          else {
            this.$message.error(res.msg)
          }
      }).then(() => {
        if(this.stime){
          this.msg = '签到时间为' + this.record.stime +'~' + this.record.etime
          this.checkQiaodao()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkQiaodao() {
      this.$nextTick(function() {
        this.$ajax({
          url: 'stu/check',
          data: {
            sno: sessionStorage.getItem("uname"),
          }
        }).then(res =>　{
          if(res.status === 'success'){
            console.log(res.data)
            this.disabled = res.data.wish
            if(this.disabled) {
              this.id = res.data.id
            }
            if(res.data.data && res.data.data.etime !== res.data.data.stime){
              this.disabled2 = res.data.wish
            }
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    daka(type) {
      this.$nextTick(function() {
        this.$ajax({
          url: 'stu/qiandao',
          data: {
            sno: sessionStorage.getItem("uname"),
            stime: this.time,
            etime: this.time,
            stype: type,
            etype: 1,
            date: this.date
          }
        }).then(res =>　{
          if(res.status=== 'success'){
            console.log(this.disabled)
            this.disabled = true
            if(this.type === 1) {
              this.$message.warning('迟到，签到成功！')
            }else{
              this.$message.success('签到成功！')
            }
          }else{
            this.$message.info(res.msg)
          }
          
        }).catch(err => {
          console.log(err)
        })
      })
    },

    qiandao() {
      this.checkLogin()
      
      if(!this.disabled){
        this.$nextTick(function() {
          this.$ajax({
            url: "/stu/checkIsQd",
            data: {
              cname: this.class,
              cdate: this.date
            }
          }).then(res => {
              console.log('qiandao',res.data)
            if(res.status === 'success' && res.data){
              this.record = res.data
              this.stime = res.data.cdate + ' ' + res.data.stime
              console.log(this.stime, res.data)
              this.timeCha(this.stime)
              console.log(this.type)
              if(this.type !== -1) {
                this.daka(this.type)
              }
            } 
            else if(!res.data) {
              this.$message.info('时间过早或过晚上无法签到')
            }
            else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        })
         this.checkLogin()
      }
      
    },
    cha(date) {
      let now = new Date()
      let hour = now.getHours()
      let minutes = now.getMinutes()
      let seconds = now.getSeconds()
      if(hour < 10) {
        hour = '0' + hour
      }
      if(minutes < 10) {
        minutes = '0' + minutes
      }
      if(seconds < 10) {
        seconds = '0' + seconds
      }
      this.time = hour + ':' + minutes + ':' + seconds
      let ctTime = new Date(date).getTime()
      let ch = now.getTime() - ctTime
      // 不可以签到
      if(ch  > 300000 ) {
        this.type = 2
      }
       // 早退0分钟
      else if(ch  < 0 ) {
        this.type = 1
      }
      // 下课后5分钟可以签到
      else if(ch - ctTime  < 300000){
        this.type = 0
      }
      console.log('wowo', ch, this.time)
    },
    updateDaka(type){
      console.log('updateDaka', this.time, type, sessionStorage.getItem('uname'),)
      this.$ajax({
        url: 'stu/updateQd',
        data: {
          // id: this.id,
          sno: sessionStorage.getItem('uname'),
          etype: type,
          etime: this.time
        }
      }).then(res =>　{
        if(res.status=== 'success'){
          this.disabled2 = true
          if(type === 1) {
            this.$message.warning('早退，签到成功！')
          }else{
            this.$message.warning('签到成功！')
          }
        }else{
          this.$message.info(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    qianli() {
      this.checkLogin()
      console.log(this.id, this.type, this.time)
      let self = this
      if(self.disabled && !self.disabled2) {
        this.checkLogin()
        self.cha(self.etime)
        if(self.type === 2) {
          self.$message.warning('下课太晚，下课后5分钟内签到！')
        }else if(self.type === 1){
          self.$confirm('现在为早退， 确定签离？', '确认签离', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.updateDaka(self.type)
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消签离'
            });          
          })
        }else{
          self.updateDaka(self.type)
        }
      }
     if(!this.disabled){
        self.$message.warning('请先签到！')
     }
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

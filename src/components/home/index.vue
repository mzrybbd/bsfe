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
                
                 <el-link :underline="false">  &nbsp; &nbsp;{{ this.msg }}</el-link>
                <!-- <span> {{ this.msg }}</span> -->
              </div>
              <p class="kqtable" @click="handleCommand()">查看考勤表</p>
              <i class="iconfont icon-ico_info_pointstishi"></i>
              <span>上课前5分钟内和下课后5分钟内为正常签到时间，上课1小时后无法签到将视为旷课，无法提前签到或是延后签离</span>
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
      msg: '',
      disabled:　false,
      disabled2: false,
      id: -1,
      weekArray: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
      flag: false
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
          console.log(this.class)
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
          if(res.status === 'success' && res.data.length){
            this.flag = true
            this.record = res.data
            for(let i=0; i < this.record.length; i++) {
              this.stime = res.data[i].cdate + ' ' + res.data[i].stime
              this.etime = res.data[i].cdate + ' ' + res.data[i].etime
              let now = new Date().getTime()
              let ch1 = new Date(this.stime).getTime() - now
              let ch2 = now - new Date(this.etime).getTime()
              console.log('第一次检查' ,this.stime, this.etime, ch1, ch2, now)

              if(ch1 <= 300000 && ch2 <= 300000){
                console.log('第一次检查' ,this.stime, this.etime, ch1, ch2, now)
                break
              }else{
                this.stime = ''
                this.etime = ''
              }
            }
            console.log('hhh', this.etime)
          } 
          else if(!res.data.length) {
            this.disabled2 = true
            this.disabled = true;
            this.msg = '今天没有课程，不需要签到'
            this.$message.info('今天没有课程，不需要签到')
          }
          else {
            this.$message.error(res.msg)
          }
      }).then(() => {
        console.log(this.flag)
        if(this.flag){
          let sktime = ''
          for(let i=0; i<this.record.length; i++) {
            sktime += this.record[i].stime +'~' + this.record[i].etime + ';'
          }
          this.msg = '上课时间为' + sktime
          this.checkQiaodao()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkQiaodao() {
      if(!this.disabled) {
        this.$nextTick(function() {
          this.$ajax({
            url: 'stu/check',
            data: {
              sno: sessionStorage.getItem("uname"),
            }
          }).then(res =>　{
            if(res.status === 'success'){
              console.log('考勤表情况', res.data)
              this.disabled = res.data.wish
              if(this.disabled) {
                console.log('检查签到',  this.date +' ' +res.data.data.stime, this.stime, this.etime )
                let now = new Date(this.date +' ' +res.data.data.stime).getTime()
                let ch1 = new Date(this.stime).getTime() - now
                let ch2 = now - new Date(this.etime).getTime()
                console.log(ch1, ch2)
                if(ch1 <= 300000 && ch2 <= 300000) {
                  this.id = res.data.id
                  this.disabled = true
                  if(res.data.data.etime !== res.data.data.stime) {
                    this.disabled2 = true
                  }
                }else{
                  this.disabled = false
                }
              }
            }
          }).catch(err => {
            console.log(err)
          })
        })
      }
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
            date: this.date,
            kweek: this.weekArray[new Date(this.date).getDay()],
            v_cname: this.class
          }
        }).then(res =>　{
          if(res.status=== 'success'){
            this.disabled = true
            console.log(this.disabled, res.data)
            if(this.type === 1) {
              this.$message.warning('迟到，签到成功！')
            }else{
              this.$message.success('签到成功！')
              // handleCommand()
            }
          }else{
            this.$message.info(res.msg)
          }
          
        }).catch(err => {
          console.log(err)
        })
      })
    },
    handleCommand() {
      // this.$ajax({
      //   url: '/stu/total_kq',
      //   data: {
      //     v_sno: sessionStorage.getItem('uname'),
      //     v_cname: this.class
      //   }
      // }).then(res => {
      //   if(res.status === 'success') {
      //     console.log(res.data)
      //   }
      // }).then(err => {
      //   console.log(err)
      // })
      this.$router.push('/checkIn')
    },
    qiandao() {
      this.checkLogin()
      this.judge()
    },
    judge() {
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
              console.log(this.disabled)
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
      else if(ch  <  0 ) {
        this.type = 1
      }
      // 下课后5分钟可以签到
      else if(ch  < 300000){
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
          v_cname: this.class,
          etype: type,
          etime: this.time,
        }
      }).then(res =>　{
        if(res.status === 'success'){
          console.log(res.data)
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
        }else if(self.type!=-1){
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
.kqtable {
  font-size:14px;
  line-height:14px;
  color: blue;
  cursor: pointer;
}
</style>

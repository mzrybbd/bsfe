<template>
  <div> 
    <div style="display: flex;"> 
      <el-carousel :interval="5000" arrow="always" class="d_jump"  style="width:616px;">
        <el-carousel-item>
          <el-row>
            <el-col :span="24"><img ref="imgHeight" src="../../../assets/img/1.png" class="banner_img" style="width:616px;" ></img></el-col>
          </el-row>
        </el-carousel-item>
        <el-carousel-item>
          <el-row>
            <el-col :span="24"><img ref="imgHeight" src="../../../assets/img/2.jpg" class="banner_img" style="width:616px;" ></img></el-col>
          </el-row>
        </el-carousel-item>
        <el-carousel-item>
          <el-row>
            <el-col :span="24"><img ref="imgHeight" src="../../../assets/img/3.jpg" class="banner_img" style="width:616px;"></img></el-col>
          </el-row>
        </el-carousel-item>
      </el-carousel>
      <el-card class="box-card" style="width: 330px; margin-left:14px">
        <div slot="header" class="clearfix">
          <span style="font-size:16px;font-weight:bold">实验意义</span>
        </div>
        <p style="font-size: 16px; margin:0;font-weight:600px">计算机组成原理是计算机专业必修的专业基础课，是理解和掌握计算机基本组成和基本工作原理的重要实践环节，通过此实践，可以深入了解计算机核心部件运算器和控制器的电路组成和控制方法，其先修课程包括汇编语言、数字逻辑电路等，后续课程包括编译原理，操作系统等，具有承上启下的重要性。</p>
      </el-card>
    </div>
    <!-- <div class='box'>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/实验室硬件设备介绍.docx" >实验箱</a>
      </div>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/运算器AM2901的组成和控制.docx" >运算器</a></div>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/微程序控制器的基本组成和控制方法.docx" >微程序控制器</a></div>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/组合逻辑控制器的基本电路组成和控制方法.docx" >组合逻辑控制器</a></div>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/isp MACH芯片.docx" >isp MACH芯片</a></div>
    </div> -->
    <div style="display: flex;height:300px; margin-top:15px; ">
      <el-card class="box-card" style="width: 612px;">
        <div slot="header" class="clearfix">
          <span style="font-size:16px;font-weight:bold">其他资源</span>
          <el-button style="float: right; padding: 3px 0;" type="text" @click="redirect">更多</el-button>
        </div>
        <div style="height:202px; overflow:hidden">
        <div v-for="(o,index) in source" :key="index" class="text item" >
          <a :href="o.path">{{o.name}}</a>
          <div style="float: right">{{o.time}}</div>
        </div>
        </div>
      </el-card>
      <el-card class="box-card" style="width: 330px; margin-left:14px">
        <div slot="header" class="clearfix">
          <span style="font-size:16px;font-weight:bold">教师信息</span>
        </div>
        <div class="text item">
          <div v-if="show2">
            <p><i class="iconfont icon-PersonalCenteron"></i> 姓名： {{teacherInfo.tname}}</p>
            <p><i class="iconfont icon-phone"></i>  电话： {{teacherInfo.phone}}</p>
            <p><i class="iconfont icon-emailFilled"></i>  邮箱： {{teacherInfo.email}}</p>
            <p><i class="iconfont icon-daqiashise"></i>  地址： {{teacherInfo.address}}</p>
          </div>  
          <div v-else>
            <p><i class="iconfont icon-PersonalCenteron"></i>  姓名： {{teacherInfo.tname}}</p>
            <p><i class="iconfont icon-phone"></i>  电话： 保密</p>
            <p><i class="iconfont icon-emailFilled"></i>  邮箱： 保密</p>
            <p><i class="iconfont icon-daqiashise"></i>  地址： 保密</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show2: false,
      imgHeight: '300px',
      source: [],
      teacherInfo: {},
      sno: sessionStorage.getItem('uname')
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    redirect(){
      this.$router.push('/detail')
    },
    getList() {
      this.$ajax({
        url: 'teacher/allFile',
        data: {
          tno: './uploads/home'
        }
      }).then(res => {
        if(res.status === 'success') {
          this.source = res.data
          this.source.forEach(item=> {
            item.path = "http://localhost:3000/teacher/downloadFile?filename="+item.path
          })
        }
        console.log(res.data)
      }).catch(err => {
      console.log(err)
    })
      this.$ajax({
        url: '/teacher/stu',
        data:{
          str: "select * from teacher where  tno = (select tno from s_t where sno='"+this.sno+"')",
          tno: ''
        }
      }).then(res => {
        console.log("select * from teacher where  tno = (select tno from s_t where sno='"+ this.sno+"')")
        if(res.status === 'success' && res.data[0].status3) {
          this.teacherInfo = res.data[0];
          this.show2 = true;
          console.log(this.show2)
        }if(!res.data[0].status3){
          console.log('hh')
          this.show2=false;
        }
        console.log(res.data[0],this.show2,res.data[0].status3)
      })
    }
  }
}
</script>

<style>
.box {
  display: flex;
  justify-content: space-around;
}
.box div{
  height: 100px;
  line-height: 100px;
  border: 1px solid #000;
  margin-right: 15px;
  text-align: center;
  width:200px;
  background-color: #eee;
}
</style>

<template>
  <div>  
    <el-carousel :interval="5000" arrow="always" class="d_jump" :height="imgHeight">
      <el-carousel-item v-for="item in imgList" :key="item.id">
        <el-row>
          <el-col :span="24"><img ref="imgHeight" src="../../../assets/img/dog.jpg" class="banner_img" ></img></el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
    <h3>计算机组成原理是计算机专业必修的专业基础课，是理解和掌握计算机基本组成和基本工作原理的重要实践环节，通过此实践，可以深入了解计算机核心部件运算器和控制器的电路组成和控制方法，其先修课程包括汇编语言、数字逻辑电路等，后续课程包括编译原理，操作系统等，具有承上启下的重要性。</h3>
    <div class='box'>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/实验室硬件设备介绍.docx" >实验箱</a>
      </div>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/运算器AM2901的组成和控制.docx" >运算器</a></div>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/微程序控制器的基本组成和控制方法.docx" >微程序控制器</a></div>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/组合逻辑控制器的基本电路组成和控制方法.docx" >组合逻辑控制器</a></div>
      <div><a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/home/isp MACH芯片.docx" >isp MACH芯片</a></div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>其他资源</span>
        <el-button style="float: right; padding: 3px 0" type="text">2019-05-28</el-button>
      </div>
      <div v-for="(o,index) in source" :key="index" class="text item">
        <a :href="o.path">{{o.name}}</a>
        <div style="float: right">{{o.time}}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img1: require("../../../assets/img/dog.jpg") ,
      img2: require("../../../assets/img/dog2.jpg") ,
      img3: require("../../../assets/img/壁纸.jpg") ,
      imgList: [
        {id: 0, idView: require("../../../assets/img/dog.jpg") },
        {id: 1, name: '详情', idView: require("../../../assets/img/dog.jpg") },
        {id: 2, name: '推荐', idView: require("../../../assets/img/dog.jpg") }
      ],
      imgHeight: '300px',
      source: [],
      // img: [img1,img2,img3]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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

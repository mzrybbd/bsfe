<template>
  <div>
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="实验次数">
        <el-input-number v-model="num" :min="1" :max="5" label="请输入实验总次数"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建实验</el-button>
      </el-form-item>
       <!-- <el-form-item>
        <el-input v-model="exp_name" placeholder="请输入实验名字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addExp">添加实验</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-select
          v-model="name"
          default-first-option
          placeholder="全部实验">
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="delExp">删除实验</el-button>
      </el-form-item>
    </el-form>
      <el-upload
      class="upload-demo"
      action="http://localhost:3000/teacher/uploadFile"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList" ref="elupload">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <a href="http://localhost:3000/teacher/downloadFile?filename='15cf6daeb6ac93052ef8c150a753dcb0.jpg'&oldname='cat.jpg'">wenjian</a>
  </div>
</template>

<script>
import dowloadUtil from '../../../lib/config.js'
export default {
  data() {
    return {
      exp_name:'',
      fileList: [],
      filename: '15cf6daeb6ac93052ef8c150a753dcb0.jpg',
      oldname: 'cat.jpg',
      num: 1,
      expName: [],
      options: [],
      name: ''
    }
  },
  mounted(){
    this.getList()
  },
  methods: {
    handlePreview() {
      dowloadUtil(`${process.env.BASE_API}/teacher/downloadFile?filename=${filename}&oldname=${oldname}`);
    },
    handleRemove() {

    },
    handleExceed() {

    },
    beforeRemove() {

    },

    getList() {
      this.$ajax({
        url: "/teacher/exp_one",
        data: {
          tno: sessionStorage.getItem('uname')
        }
      })
      .then(res => {
        this.options = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    },
    addExp() {
      this.$ajax({
        url: '/teacher/add_exp',
        data: {
          tno: sessionStorage.getItem('uname'),
          name: this.exp_name
        }
      }).then(res => {
        if(res.status === 'success'){
          this.getList()
          this.$message.success('添加成功')
          console.log(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    delExp() {
      this.$ajax({
        url: '/teacher/exp_del',
        data: {
          tno: sessionStorage.getItem('uname'),
          name: this.name
        }
      }).then(res => {
        if(res.status === 'success'){
          this.getList()
          console.log(res.data)
          this.$message.success('删除成功')

        }
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit(){
      console.log(this.num)
      for(let i=1; i<=this.num; i++) {
        this.expName[i] = '实验' + i
      
        this.$ajax({
          url: '/teacher/add_exp',
          data: {
            tno: sessionStorage.getItem('uname'),
            name: this.expName[i]
          }
        }).then(res => {
          if(res.status === 'success'){
            this.getList()
            console.log(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
    
  }
}
</script>

<style>

</style>

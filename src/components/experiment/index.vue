<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="资源浏览">
        <ul>
          <li v-for="item in options">
            <a :href="item.path">{{item.name}}</a>
            <div style="float: right">{{item.size}}</div>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="提交作业">
        <ul>
          <li v-for="item in options2">
            <el-link type="primary" @click="redirect(item.name)">{{item.name}}</el-link>
            <div style="float: right">{{item.time}}</div>
          </li>
        </ul>
        <el-form ref="form" :model="form" label-width="120px" v-show="show">
          <el-form-item label="请选择实验">
            <el-select
              v-model="name"
              @change="change"
              default-first-option
              placeholder="全部实验">
              <el-option
                v-for="item in options3"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择文件">
            <el-upload
              class="upload-demo"
              :action=src
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-error="handleError"
              accept=".doc,.docx,.pdf,.zip,.rar"
              :file-list="fileList" ref="elupload">
              <el-button size="small" type="primary" @click="submit">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传docx,doc,pdf,zip,rar的附件,且不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <a href="http://localhost:3000/teacher/downloadFile?filename=./sumbit/2015012000/信息152班/2015012947_李娟_实验一"></a>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default{
  data() {
    return {
      options: [],
      options2: [],
      tno: '',
      options3: [],
      name: '',
      form: {},
      fileList: [],
      info: '',
      url: '',
      show: false,
      src: 'http://localhost:3000/teacher/submitFile?tno='
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    redirect(name){
      this.url = name
      this.show = true
      console.log(this.url)
    },
    change(){
      this.$ajax({
        url: '/stu/checkSubmit',
        data: {
          sno:sessionStorage.getItem('uname'),
          name: this.name,
        }
      }).then(res =>　{
        if(res.status === 'success' && res.data.status){
          this.$message.info('已经提交过！')
        }
      })
    },
    getList() {
       this.$ajax({
         url: '/stu/tno2',
         data: {
           sno: sessionStorage.getItem('uname')
         }
       }).then(res => {
          if(res.status === 'success') {
            this.tno = res.data.tno
            this.info = res.data
          }
       }).then(() =>{
         this.$ajax({
          url: 'teacher/allFile',
          data: {
            tno: './uploads/' +  this.tno
          }
        }).then(res => {
          if(res.status === 'success') {
            this.options = res.data
            this.options.forEach(item=> {
              item.path = "http://localhost:3000/teacher/downloadFile?filename="+item.path
            })
          }
          console.log(res.data)
        })
       }).then(() =>{
         this.$ajax({
          url: 'teacher/allDir',
          data: {
            tno: this.tno
          }
        }).then(res => {
          if(res.status === 'success') {
            this.options2 = res.data
          }
          console.log(res.data)
        })
       }).then(()=>{
         this.getExp()
       }).catch(err=>{
         console.log(err)
       })
    },
    getExp() {
       this.$ajax({
        url: "/teacher/exp_one",
        data: {
          tno: this.tno
        }
      })
      .then(res => {
        this.options3 = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    },
    beforeUpload(file){
      //文件过滤，html用了accept，不过不考虑兼容下面可以不要
      var FileExt = file.name.replace(/.+\./, ""); 
      if (['doc', 'docx', 'pdf', 'zip', 'rar'].indexOf(FileExt.toLowerCase()) === -1){ 
        this.$message({ type: 'warning', message: '请上传后缀名为[doc,docx,pdf,zip,rar]的附件！' }); 
        return false; 
      }
      if(!this.name){
        this.$message({ type: 'warning', message: '请选择实验' }); 
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if(!isLt2M) {
					this.$message({
						message: '上传文件大小不能超过 5MB!',
						type: 'warning'
          });
         return false; 
				}
    },
    submit() {
      this.src = 'http://localhost:3000/teacher/submitFile?tno='
      this.src = this.src + this.tno+'/'+this.url +'&filename='+this.info.sno+'_'+this.info.sname+'_'+this.name
      console.log(sessionStorage.getItem('uname')+'/'+this.url, this.info.sno+'_'+this.info.sname+'_'+this.name )
    },
    handleRemove() {

    },
    handlePreview(){},
    handleSuccess(res, file, fileList){
      this.$ajax({
        url: '/stu/submitRecord',
        data: {
          sno:sessionStorage.getItem('uname'),
          name: this.name,
          filename: this.info.sno+'_'+this.info.sname+'_'+this.name,
          path: './sumbit/'+ this.tno+'/'+this.url
        }
      }).then(res => {
        if(res.status === 'success'){
          this.$message.success('提交成功')
        }
      })
    },
    handleError(){},
  }
}
</script>
<style lang="less" scoped>
  ul{
    list-style-type: none;
  }
</style>
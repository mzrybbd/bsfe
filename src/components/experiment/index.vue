<template>
  <div>
    <el-tabs type="border-card" style="min-height: 436px">
      <el-tab-pane label="资源浏览">
        <h3 v-for="item in options3" style="color: red; margin-left:38px" v-show="flag">{{item.name}}最晚提交时间为: {{item.last_date}}</h3>
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
        <el-form ref="form" :model="form" label-width="110px" v-show="show" style="margin-left: 8px;">
          <!-- <el-form-item >
            <h3 v-for="item in options3" style="color: red; margin-left" v-show="flag">{{item.name}}最晚提交时间为: {{item.last_date}}</h3>
          </el-form-item> -->
          <el-form-item label="实验名称">{{url}}</el-form-item>
          <el-form-item label="选择实验">
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
            <span style="font-size: 16px; margin-left:10px;color:red;">{{infos}}</span>
          </el-form-item>
          <!-- <el-form-item>{{ infos }}</el-form-item> -->
          <!-- <span style="color:red">
            {{infos}}
          </span> -->
          <el-form-item label="选择文件">
            <el-upload
              class="upload-demo"
              :action=src
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :on-error="handleError"
              accept=".doc,.docx,.pdf,.zip,.rar"
              :file-list="fileList" ref="elupload">
              <el-button type="primary" @click="submit">点击上传</el-button>
              <span slot="tip" class="el-upload__tip" style="font-size:16px; color:red; margin-left:10px;">请按照实验模板来提交实验报告，只能上传docx,doc,pdf,zip,rar的附件,且不超过10M</span>
            </el-upload>
          </el-form-item>
        </el-form>
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
      flag: false,
      url: '',
      size: '',
      show: false,
      src: 'http://localhost:3000/teacher/submitFile?tno=',
      suffix: '',
      infos:　''
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
        console.log(res, this.name, sessionStorage.getItem('uname'))
        if(res.status === 'success' && res.data.status){
          this.$message.info('本次报告已提交！')
          this.infos = ''
        }else{
          this.infos = '本次报告未提交......'
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
            console.log(res.data)
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
         this.$ajax({
            url: '/teacher/one',
            data: {
              tno: this.tno
            }
          }).then(res => {
            if(res.status === 'success' && res.data[0].status2){
              this.getExp()
              this.flag = true
            }else{
              this.getExp2()
            }
          })
         
       }).catch(err=>{
         console.log(err)
       })
    },
    getExp() {
       this.$ajax({
        url: "/stu/expSearch",
        data: {
          sno: sessionStorage.getItem('uname')
        }
      })
      .then(res => {
        if(res.status === 'success'){
          this.options3 = res.data;
          console.log(res.data)
        }
      })
      .catch(err => {
        console.log(err);
      });
    },
     getExp2() {
       this.$ajax({
        url: "/teacher/exp_one",
        data: {
          tno: this.tno
        }
      })
      .then(res => {
        if(res.status === 'success'){
          this.options3 = res.data;
          console.log(res.data)
        }
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
      this.suffix = FileExt
      console.log(this.suffix)
      if(!this.name){
        this.$message({ type: 'warning', message: '请选择实验' }); 
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if(!isLt2M) {
					this.$message({
						message: '上传文件大小不能超过 10MB!',
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
    sizeFormat(size) {
      let sizeKb = size / 1024
      let sizeMb=0;
      let sizeGb=0;
      if(sizeKb >= 1024){
        sizeMb = sizeKb / 1024
        if(sizeMb >= 1024){
          sizeGb = sizeMb / 1024
        }
      }
      return sizeGb>0 ? sizeGb.toFixed(2) + 'Gb' :(sizeMb > 0 ? sizeMb.toFixed(2)  + 'Mb':sizeKb.toFixed(2)  + 'kb')  ;//文件大小，以字节为单位
    },
    handlePreview(){},
    handleSuccess(res, file, fileList){
      // this.fileList=[]
      console.log(file.size,this.sizeFormat(file.size),this.info.sno+'_'+this.info.sname+'_'+this.name + '.' + this.suffix,'./sumbit/'+ this.tno+'/'+this.url,)
      this.$ajax({
        url: '/stu/submitRecord',
        data: {
          sno: sessionStorage.getItem('uname'),
          name: this.name,
          filename: this.info.sno+'_'+this.info.sname+'_'+this.name + '.' + this.suffix,
          path: './submit/'+ this.tno+'/'+this.url,
          size: this.sizeFormat(file.size)
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
<style lang="less">
  ul{
    list-style-type: none;
  }
  li{
    margin-bottom: 5px;
  }
  .el-link{
    font-size: 16px;
    color: #0000ee;
    text-decoration: underline;
  }
  .el-form-item__content {
    font-size: 16px;
  }
  .el-form-item__label {
    font-size: 16px;
  }

</style>
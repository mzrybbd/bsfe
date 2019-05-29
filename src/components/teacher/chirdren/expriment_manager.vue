<template>
  <div>
    <el-form>
      <el-upload
        class="upload-demo"
        :action=src
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-progress="handleProgress"
        multiple
        :on-success="handleSuccess"
        :limit="10"
        :before-upload="beforeUpload"
        :show-file-list="false"
        :on-error="handleError"
        :on-exceed="handleExceed"
        :file-list="fileList" ref="elupload">
        <el-button size="small" type="primary" @click="upload">点击上传</el-button>
      </el-upload>
    </el-form>
    <!-- <a href="http://10.1.2.106:3000/teacher/downloadFile?filename=./uploads/2015012000/壁纸.jpg">wenjian</a> -->
<!--  
 {{tableData}}
    <div>
      <ul v-for="item in tableData">
        <a :href="item.path">{{item.name}}</a>
      </ul>
    </div> -->
  <el-table
      height="500"
	    ref="filterTable"
	    :data="tableData">
      <el-table-column
	      prop="name"
	      label="文件名"
        >
	    </el-table-column>
	    <el-table-column
	      prop="size"
	      label="文件大小"
	    >
      </el-table-column>
      <el-table-column
	      prop="time"
	      label="上传时间"
	    >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">点击下载</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="handleDelete(scope.$index, scope.row, tableData)">点击删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      fileList: [],
      src: 'http://localhost:3000/teacher/uploadFile?tno=' + sessionStorage.getItem('uname')
    }
  },
  mounted(){
    this.getList()
  },
  methods: {
    getList() {
      this.$ajax({
        url: 'teacher/allFile',
        data: {
          tno: './uploads/'+sessionStorage.getItem('uname')
        }
      }).then(res => {
        if(res.status === 'success') {
          this.tableData = res.data
        }
        console.log(res.data)
      })
    },
    handlePreview() {
      // dowloadUtil(`${process.env.BASE_API}/teacher/downloadFile?filename=f9bf3e4df7762d7ba44883fd66bd61fa.PNG&oldname=1.PNG`);
    },
    handleEdit(index, row) {
      let url = "http://localhost:3000/teacher/downloadFile?filename="+row.path
      console.log(url)
      this.downloadUrl(url)
    },
    handleDelete(index, row, rows) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax({
            url: '/teacher/delFile',
            data: {
              url: row.path
            }
          }).then(res => {
            if(res.status === 'success')
              rows.splice(index, 1)
          }).catch(err => {
            console.log(err)
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        })
      },
    downloadUrl(url){
      let iframe = document.createElement('iframe');
      iframe.style.display = 'none'
      iframe.src = url
      iframe.onload = function () {
        document.body.removeChild(iframe)
      }
      document.body.appendChild(iframe)
    },
    handleRemove() {

    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove() {

    },
    handleError(err, file, fileList) {
      // this.tempArr.forEach((element, index) => {
      //   if (element.uid === file.uid) {
      //     this.tempArr.splice(index, 1); // 上传失败删除该记录
      //     this.$message.error('文件上传失败');
      //     this.$emit('changeFileList', this.tempArr);
      //   }
      // });
    },
    objAddItem(tempArr, file) {
      const tempObj = {
        uid: file.uid, // uid用于辨别文件
        originalName: file.name, // 列表显示的文件名
        progress: 0, // 进度条
        code: 200, // 上传状态
      };
      tempArr.push(tempObj);
      this.$emit('changeFileList', tempArr);
    },
    handleProgress(event, file, fileList){
      // this.tempArr.forEach((element, index)=>{
      //   if(element.uid === file.uid){
      //     const progress = Math.floor(event.percent)
      //     element.progress = progress === 100 ? 99 : progress;
      //   this.$set(this.tempArr, index, element);
      //   this.$emit('changeFileList', this.tempArr);
      //   }
      // })
    },
    beforeUpload(file){
      console.log(file)
      let fd = new FormData();
      fd.append('tno', sessionStorage.getItem('uname'))
      this.$ajax({
        url:'/teacher/uploadFile',
        data:fd,
         onUploadProgress(progressEvent){
            if (progressEvent.lengthComputable) {
              let val = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
              that.formData.showProgress = true;
              that.formData.startValue = parseInt(val)
            }
          }
      }).then(res =>{
        console.log(fd)
        // this.$message.success('上传成功')
      })
    },
    handleSuccess(res, file, fileList) {
      this.getList()
      this.$message.success('上传成功')
    },
    upload(){

    },    
  }
}
</script>

<style>

</style>

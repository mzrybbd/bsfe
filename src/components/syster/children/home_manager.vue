<template>
  <div>
    <el-form>
      <el-form-item>
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
          <el-button type="primary" @click="upload">点击上传</el-button>
          <span slot="tip" class="el-upload__tip" style="font-size: 16px; color: red; margin-left:10px;">注意：一次最多上传10个文件</span>
        </el-upload>
       </el-form-item> 
    </el-form>
  <el-table
      height="450"
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
      src: 'http://localhost:3000/teacher/uploadFile?tno=home' 
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
          tno: './uploads/home'
        }
      }).then(res => {
        if(res.status === 'success') {
          this.tableData = res.data
        }
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

    },
    beforeUpload(file){
      console.log(file.length)
      
      
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

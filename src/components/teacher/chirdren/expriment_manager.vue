<template>
  <div>
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
      fileList: [],
      filename: '15cf6daeb6ac93052ef8c150a753dcb0.jpg',
      oldname: 'cat.jpg'
    }
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

    }
    
  }
}
</script>

<style>

</style>

<template>
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
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
    handlePreview() {

    },
    handleRemove() {

    },
    handleExceed() {

    },
    
  }
}
</script>

<style>

</style>

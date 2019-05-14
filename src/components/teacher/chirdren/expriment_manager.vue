<template>
  <div>
    <el-form :model="form" ref="form">
      <el-form-item label="上传文件:" :label-width="formLabelWidth">
        <el-upload
          class="uploade"
          ref="upload"
          :action="uploadUrl"
          name="file"
          multiple
          :show-file-list="true"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          drag
          :file-list="fileList"
          :auto-upload="false">
        </el-upload>
        <el-button size="small" type="primary" @click="insert('form')">点击上传</el-button>
        <div slot="tip" class="el-upload_tip">上传文件只能是 JPG/PNG/BMP/TXT/DOCX/PDF/XLSX/zip 格式，且不超过2M</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: [],
      form: [],
      formLabelWidth: '120px',
      uploadUrl: 'http://localhost:3000/teacher/upload',
      fileList: [],
    }
  },
  methods: {
    uploadSuccess (response, file, fileList) {
      console.log('上传文件', response)
    },
    // 上传错误
    uploadError (response, file, fileList) {
      console.log('上传失败，请重试！')
    },
    beforeRemove (file, fileList) {
       return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 上传前对文件的大小的判断
    beforeUpload (file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const extension3 = file.name.split('.')[1] === 'doc'
      const extension4 = file.name.split('.')[1] === 'docx'
      const isLt2M = file.size / 1024 / 1024 / 1024 / 1024 < 10
      if (!extension && !extension2 && !extension3 && !extension4) {
        console.log('上传模板只能是 xls、xlsx、doc、docx 格式!')
      }
      let fd = new FormData();
      fd.append('file', file)
      console.log(fd)
      this.$ajax({url: "/teacher/upload", data: fd}).then(res => {
        this.$message.success('上传成功！');
      })
      if (!isLt2M) {
        console.log('上传模板大小不能超过 10MB!')
      }
      return extension || extension2 || extension3 || extension4 && isLt2M
    },
    insert(formName) {
      this.$refs.upload.submit();
    },
  }
}
</script>

<style>

</style>

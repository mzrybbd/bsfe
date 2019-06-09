<template>
  <el-dialog title="学生管理" :visible.sync="dialogFormVisible">
    <el-form label-position="right" :rules="rules" ref="form" :model="form" label-width="106px" size="small">
      <el-form-item label="请选择班级" prop="cname">
        <el-input v-model="form.cname" disabled></el-input>
      </el-form-item>
      <el-form-item label="请选择实验" prop='name'>
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="最晚提交时间" prop='last_date'>
        <el-date-picker
          v-model="form.last_date"
          type="date"
          :picker-options="pickerOptions0"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">取消</el-button>
      <el-button type="primary" @click="submitForm('form')">更新</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      dialogFormVisible: false,
      rules:  {
        name: [
          { required: true, message: '请选择实验', trigger: 'blur' }
        ],
        last_date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        cname: [
          { required: true, message: '请选择班级', trigger: 'blur' }
        ],
      },
      options: [],
      options2:[],
      cname: '',
      name: '',
      pickerOptions0: {
        disabledDate(time) {
          // console.log(time)
           return  time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的 
        }
      },
    }
  },
  methods: {
    setRuleForm(form) {
      this.showFrame()
      this.form = form
      this.cname = form.cname
      this.name = form.name
    },
    resetForm (name){
      this.$refs[name].resetFields()
      // this.form = {}
    },
    showFrame() {
      this.dialogFormVisible = true
    },
    submitForm(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
            this.$ajax({
              url: '/teacher/updateSys',
              data: {
                name: this.name,
                cname: this.cname,
                last_date: this.form.last_date
              }
            }).then(res=> {
              console.log(this.form.last_date)
              if(res.status === 'success') {
                this.$message.success('更新成功')
                this.$emit('update', [])
                this.dialogFormVisible = false
              }else{
                this.$message.error(res.msg)
              }
            }).catch(err => {
              console.log(err)
            })
          }
      });
    },
  }
}
</script>

<style>
  .el-input--small .el-input__inner {
    width: 300px;
  }
  .el-dialog{
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
    width: auto;
  }
  .el-dialog__body{
    padding-bottom: 0;
    padding-top: 5px;
  }
  .el-dialog__title {
    line-height: 18px;
    font-size: 18px;
    color: #464c5b;
    /* color: #303133; */
    font-weight: 700;
  }
</style>

<template>
  <div>
    <el-dialog title="班级管理" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" size="small">
        <el-form-item prop="tno" :label-width="formLabelWidth"  label="教师">
          <el-select v-model="ruleForm.tno" filterable size="small" placeholder="请选择教师">
				    <el-option
				      v-for="item in options"
				      :key="item.tno"
				      :label="item.tno"
				      :value="item.tno">
              <span style="float: left">{{ item.tno }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tname }}</span>
				    </el-option>
				  </el-select> 
          </el-form-item>
          <el-form-item prop="cname" :label-width="formLabelWidth" label="班级">
            <el-input v-model="ruleForm.cname" placeholder="班级"></el-input>
          </el-form-item>
      </el-form>
		  <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false" size="small">取 消</el-button>
		    <el-button type="primary" @click="submitForm('ruleForm')" size="small">确 定</el-button>
		  </div>
		</el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      options: [],
      ruleForm: {},
      dialogFormVisible: false,
      oldCname: '',
      formLabelWidth: '70px',
      rules: {
        cname: [
          { required: true, message:'请输入班级',trigger: 'blur' },
        ],
        tno: [
          { required: true, message: '请选择教师', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.getTeacherList()
  },
  methods: {
    getTeacherList() {
      this.$ajax({
        url: "/teacher/all",
        data: {
        }
      })
      .then(res => {
        this.options = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    },
    setRuleForm(form) {
      this.dialogFormVisible = true
      this.ruleForm = form
      this.oldCname = form.cname
    },
    submitForm(name) { 
      this.$refs[name].validate(valid => {
        if(valid) {
          this.$ajax({
            url: '/teacher/updateClass',
            data: {
              tno: this.ruleForm.tno,
              newCname: this.ruleForm.cname,
              oldCname: this.oldCname,
            }
          }).then(res => {
            if(res.status === 'error') {
              this.$message.error(res.msg)
            }else{
              this.row = this.ruleForm
              this.$emit('update', [])
              this.$message.success('更新成功!')
              this.dialogFormVisible = false
            }
          }).catch(err => {
            this.message.error('更新失败')
          })
        }
      });
  	}
  }
}
</script>

<style>

</style>

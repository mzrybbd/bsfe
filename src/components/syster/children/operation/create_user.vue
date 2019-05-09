<template>
	<div>
	  <el-dialog title="用户管理" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" size="small">
        <el-form-item prop="uname" :label-width="formLabelWidth" label="用户名">
          <el-input v-model="ruleForm.uname" placeholder="用户名"></el-input>
        </el-form-item>
         <el-form-item prop="upwd" :label-width="formLabelWidth" label="密码">
          <el-input v-model="ruleForm.upwd" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="role" :label-width="formLabelWidth" label="角色">
         	<el-select v-model="ruleForm.role" disabled filterable placeholder="请选择角色">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select> 
        </el-form-item>
      </el-form>
		  <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button @click="resetForm('ruleForm')" v-show='see'>重置</el-button>
		    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
      dialogFormVisible: false,
      oldUid: '',
      see: true,
	 		ruleForm: {
      	
      },
      options: [{
          value: '管理员',
          label: '管理员'
        }, {
          value: '学生',
          label: '学生'
        }, {
          value: '教师',
          label: '教师'
        }],
      formLabelWidth: '120px',
      rules: {
        uname: [
          { required: true, message:'请输入账号', trigger: 'blur' },
          { min: 10, max: 15, message: '长度在10到15个字符', trigger: 'blur' }
        ],
        upwd: [
          { required: true, message:'请输入密码',trigger: 'blur' },
          { min: 2, message: '至少两个字符', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
		}
	},
	methods: {
    setRuleForm(form) {
      this.showFrame()
      this.see = false
      this.ruleForm = form
      this.oldUid = form.uname
    },
		showFrame() {
			this.dialogFormVisible = true
		},
    resetForm(name) {
       this.$refs[name].resetFields()
    },
		submitForm(name) {
      this.$refs[name].validate(valid => {
        if(valid) {
          this.$ajax({
            url: '/user/update',
            data: {
              newUid: this.ruleForm.uname,
              oldUid: this.oldUid,
              upwd: this.ruleForm.upwd,
              role: this.ruleForm.role,
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

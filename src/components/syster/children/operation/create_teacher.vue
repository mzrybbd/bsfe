<template>
  <div>
    <el-dialog title="教师管理" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" size="small">
        <el-form-item prop="tno" :label-width="formLabelWidth" label="工号">
          <el-input v-model="ruleForm.tno" placeholder="工号"></el-input>
        </el-form-item>
        <el-form-item prop="tname" :label-width="formLabelWidth" label="姓名">
          <el-input v-model="ruleForm.tname" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="女"></el-radio>
            <el-radio label="男"></el-radio>
          </el-radio-group>
			  </el-form-item>
        <el-form-item prop="email" :label-width="formLabelWidth" label="邮箱">
          <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="phone" :label-width="formLabelWidth" label="电话">
          <el-input v-model="ruleForm.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item prop="address" :label-width="formLabelWidth" label="地址">
          <el-input v-model="ruleForm.address" placeholder="地址" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible=false">取 消</el-button>
          <el-button @click="resetForm('ruleForm')" v-show="!update">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      dialogFormVisible: false,
      update: false,
      oldUid: '',
      ruleForm: {
        tno: '',
        tname: '',
        sex: '女',
        email: '4@qq.com',
        phone: '13474229060',
        address: '学院楼5楼'
      },
      formLabelWidth: '120px',
      rules: {
        tno: [
          { required: true, message:'请输入工号', trigger: 'blur' },
          { min: 10, max: 15, message: '长度在10到15个字符', trigger: 'blur' }
        ],
        tname: [
          { required: true, message:'请输入姓名',trigger: 'blur' },
          { min: 2, message: '至少两个字符', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ] 
      }
    }
  },
	methods: {
    setRuleForm(form) {
      this.showFrame()
      this.ruleForm = form
      this.update = true
      this.oldUid = form.tno
    },
		showFrame() {
			this.dialogFormVisible = true
		},
    resetForm(name) {
       this.$refs[name].resetFields()
    },
		submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid && !this.update) {
          //注册
          this.$ajax({
            url: "/user/register",
            data: {
              uid: this.ruleForm.tno,
              uname:  this.ruleForm.tname,
              pwd: '123456',
              role: '教师',
              email: this.ruleForm.email,
              phone: this.ruleForm.phone,
              address: this.ruleForm.address,
              sex: this.ruleForm.sex
            }
          }).then(res => {
          	if(res.status === "error") {
              this.$message.error(res.msg);
            }
            else {
              this.$emit('create', [this.ruleForm])
              this.$message.success('注册成功!')
              this.dialogFormVisible = false
            }
          }).catch(err => {
            this.$message.error('注册失败')
          });
        }
        if(valid && this.update) {
          this.$ajax({
            url: '/teacher/update',
            data: {
              newUid: this.ruleForm.tno,
              oldUid: this.oldUid,
              tname: this.ruleForm.tname,
              email: this.ruleForm.email,
              phone: this.ruleForm.phone,
              address: this.ruleForm.address,
              sex: this.ruleForm.sex
            }
          }).then(res => {
            if(res.status === 'error') {
              this.$message.error(res.msg)
            }else{
              this.row = this.ruleForm
              this.$emit('update', [this.ruleForm])
              this.$message.success('更新成功!')
              this.dialogFormVisible = false
            }
          }).catch(err => {
            this.$message.error('更新失败')
          })
        }
      });
  	}
	}
}
</script>

<style>

</style>

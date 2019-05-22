<template>
  <div class="person">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人资料</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="submit('ruleForm')">保存修改</el-button>
      </div>
      <div  class="text item">
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
            <el-input v-model="ruleForm.address" placeholder="地址" @keyup.enter.native="submit('ruleForm')"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="updatePass('teacher')">保存修改</el-button>
      </div>
      <div  class="text item">
        <el-form :model="teacher" status-icon :rules="rules2" ref="teacher" label-width="100px" class="demo-ruleForm">
          <el-form-item label="密码" prop="oldPass">
            <el-input type="password" v-model="teacher.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input type="password" v-model="teacher.newPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="teacher.checkPass" autocomplete="off" @keyup.enter.native="updatePass('teacher')"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.teacher.checkPass !== '') {
          this.$refs.teacher.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.teacher.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

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
      ruleForm: {},
      formLabelWidth: '80px',
      oldPass: '',
      teacher: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
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
      },
      rules2: {
        oldPass: [
          { required: true, message:'当前密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        newPass: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getTeacher()
  },
  methods: {
    updatePass(name) {
      this.$refs[name].validate(valid => {
        if(valid && this.oldPass === this.teacher.oldPass && this.oldPass !== this.teacher.newPass) {
          this.$ajax({
            url: '/teacher/updatePwd',
            data: {
              tno: sessionStorage.getItem('uname'),
              pwd: this.teacher.newPass
            }
          }).then(res => {
            if(res.status === 'error'){
              this.$message.error(res.msg)
            }else{
              this.$message.success('更新成功')
              this.teacher = {}
            }
          }).catch(err => {
            this.$message.error('更新失败')
          })
        }
        if(this.oldPass !== this.teacher.oldPass) {
          this.$message.info('当前密码不正确')
        }
        if(this.oldPass === this.teacher.newPass) {
          this.$message.info('新旧密码不能相同')
        }
      })
    },
    submit(name) {
       this.$refs[name].validate(valid => {
        this.$ajax({
          url: '/teacher/update',
          data: {
            newUid: this.ruleForm.tno,
            oldUid: sessionStorage.getItem('uname'),
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
            sessionStorage.setItem('uname', this.ruleForm.tno)
            this.$router.go(0)
            this.$message.success('更新成功')
          }
        }).catch(err => {
          this.$message.error('更新失败')
        })
       })
    },
    getTeacher() {
      this.$nextTick(function() {
        this.$ajax({
          url: "/teacher/one",
          data: {
            tno: sessionStorage.getItem('uname')
          }
        }).then(res => {
          this.ruleForm = res.data[0]
        }).catch(err => {
          console.log(err)
        })
        this.$ajax({
          url: '/user/check',
          data: {
            uname: sessionStorage.getItem('uname')
          }
        }).then(res=> {
          if(res.status === 'error'){
            this.$message.error(res.msg)
          }else{
            this.oldPass = res.data.upwd
            console.log(this.oldPass)
          }
        })
      })
    },
  }
}
</script>

<style lang="less" scoped>
  .person {
    display: flex;
    justify-content: space-around
  }
  .text {
    font-size: 14px;
  }
  h2 {
    margin: .67em 0;
  }
  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 48%;
  }
</style>


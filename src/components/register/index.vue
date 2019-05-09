<template>
	 <div class="register-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" size="small">
        <el-form-item>
          <h1><i class="el-icon-edit"></i>&nbsp;学生注册</h1>
        </el-form-item>
        <el-form-item prop="uid">
          <el-input v-model="ruleForm.uid" placeholder="学号"></el-input>
        </el-form-item>
         <el-form-item prop="name">
          <el-input v-model="ruleForm.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="ruleForm.pass" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="rePass">
          <el-input type="password" v-model="ruleForm.rePass" placeholder="确认密码"></el-input>
        </el-form-item>
         <el-form-item prop="class">
         	<el-select v-model="ruleForm.class" filterable placeholder="请选择班级" @keyup.enter.native="submitForm('ruleForm')">
				    <el-option
				      v-for="item in options"
				      :key="item.cname"
				      :label="item.cname"
				      :value="item.cname">
				    </el-option>
				  </el-select> 
        </el-form-item>
			  <el-form-item label="性别" prop="sex">
			    <el-radio-group v-model="ruleForm.sex" @keyup.enter.native="submitForm('ruleForm')">
			      <el-radio label="女"></el-radio>
			      <el-radio label="男"></el-radio>
			    </el-radio-group>
			  </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册
          </el-button>
          <p class="register">注: 账号为学生学号</p>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
	 export default {
    data() {
    	var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.rePass !== '') {
            this.$refs.ruleForm.validateField('rePass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
        	uid: '',
        	name: '',
        	pass: '',
        	rePass: '',
        	class: '',
        	sex: '男',
        	avatar: ''
        },
        options: [],
        rules: {
          uid: [
          	{ required: true, message:'请输入学号', trigger: 'blur' },
          	{ min: 10, max: 15, message: '长度在10到15个字符', trigger: 'blur' }
          ],
          name: [
          	{ required: true, message:'请输入姓名',trigger: 'blur' },
          	{ min: 2, message: '至少两个字符', trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' },
            { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
          ],
          rePass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          class: [
          	{ required: true, message: '请选择班级', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
    	this.getList()
    },
    methods: {
  	  getList() {
        this.$ajax({
          url: "/user/class",
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
      submitForm(name) {
	      this.$refs[name].validate(valid => {
	        if (valid) {
	          //注册
	          this.$ajax({
	            url: "/user/register",
	            data: {
                uid: this.ruleForm.uid,
                uname:  this.ruleForm.name,
                pwd: this.ruleForm.pass,
                role: '学生',
                cname: this.ruleForm.class,
                avatar: this.ruleForm.avatar,
                sex: this.ruleForm.sex
	            }              
	          }).then(res => {
	          	if(res.status === "error") {
                this.$message.error(res.msg);
              }
	            else{
		            this.$message.success('注册成功，请您重新登录')
	            	this.$router.push('/login')
	            }
	          }).catch(err => {
	            this.$message.error('注册失败')
	          });
	        }
        });
    	}
    }
  }
</script>
<style lang="less" scoped>
.register-box {
  width: 240px;
  margin: auto;
}
.el-button, .el-select {
  width: 100%;
}
</style>

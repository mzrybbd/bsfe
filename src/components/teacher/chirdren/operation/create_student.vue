<template>
	<div>
	  <el-dialog title="学生管理" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm"  size="small" label-width="80px" >
        <el-form-item prop="sno" label="学号">
          <el-input v-model="ruleForm.sno" placeholder="学号"></el-input>
        </el-form-item>
         <el-form-item prop="sname" label="姓名">
          <el-input v-model="ruleForm.sname" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item prop="cname" label="班级">
         	<el-select v-model="ruleForm.cname" filterable placeholder="请选择班级">
				    <el-option
				      v-for="item in options"
				      :key="item.cname"
				      :label="item.cname"
				      :value="item.cname">
				    </el-option>
				  </el-select> 
        </el-form-item>
			  <el-form-item label="性别" prop="sex">
			    <el-radio-group v-model="ruleForm.sex">
			      <el-radio label="女"></el-radio>
			      <el-radio label="男"></el-radio>
			    </el-radio-group>
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
		return {
      dialogFormVisible: false,
      update: false,
      oldUid: '',
	 		ruleForm: {
      	sno: '',
      	sname: '',
      	cname: '',
        sex: '男',
        avatar: '',
        pwd: '123456'
      },
      options: [],
      rules: {
         sno: [
            { required: true, message:'请输入学号', trigger: 'blur' },
          	{ min: 10, max: 15, message: '长度在10到15个字符', trigger: 'blur' }
          ],
          sname: [
          	{ required: true, message:'请输入姓名',trigger: 'blur' },
          	{ min: 2, message: '至少两个字符', trigger: 'blur' }
          ],
          cname: [
          	{ required: true, message: '请选择班级', trigger: 'change' }
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
      this.oldUid = form.sno
    },
		showFrame() {
      this.getList()
			this.dialogFormVisible = true
		},
		getList() {
      this.$ajax({
        url: "/class/one",
        data: {
          tno: sessionStorage.getItem('uname')
        }
      })
      .then(res => {
        this.options = res.data;
      })
      .catch(err => {
        console.log(err);
      });
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
              uid: this.ruleForm.sno,
              uname:  this.ruleForm.sname,
              pwd: this.ruleForm.pwd,
              role: '学生',
              cname: this.ruleForm.cname,
              avatar: this.ruleForm.avatar,
              sex: this.ruleForm.sex
            }
          }).then(res => {
          	if(res.status === "error") {
              this.$message.error(res.msg);
            }
            else {
              this.$emit('create', [this.ruleForm, this.index])
              this.$message.success('注册成功!')
              this.dialogFormVisible = false
            }
          }).catch(err => {
            this.$message.error('注册失败')
          });
        }
        if(valid && this.update) {
          this.$ajax({
            url: '/stu/update',
            data: {
              newUid: this.ruleForm.sno,
              oldUid: this.oldUid,
              sname: this.ruleForm.sname,
              cname: this.ruleForm.cname,
              sex: this.ruleForm.sex
            }
          }).then(res => {
            if(res.status === 'error') {
              this.$message.error(res.msg)
            }else{
              this.row = this.ruleForm
              this.$emit('update', [this.ruleForm, this.index])
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

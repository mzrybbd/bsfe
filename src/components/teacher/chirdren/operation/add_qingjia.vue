<template>
  <div>
    <el-dialog title="学生管理" :visible.sync="dialogFormVisible">
      <div class ="box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  size="small" label-width="80px" >
          <el-form-item prop="sno" label="学号" >
            <el-input v-model="ruleForm.sno" placeholder="学号" @blur="getCname"></el-input>
          </el-form-item>
        <el-form-item prop="coursetime" label="班级">
         	<el-select v-model="ruleForm.coursetime" filterable placeholder="请选择班级" value-key="id">
				    <el-option
				      v-for="item in options"
				      :key="item.id"
				      :label="item.cdate"
				      :value="item">
              <span style="float: left">{{ item.cdate }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.stime }} ~ {{ item.etime }}</span>
				    </el-option>
				  </el-select> 
        </el-form-item>
          <!-- <el-form-item prop="coursetime" label="课程时间">
            <el-select v-model="ruleForm.coursetime" filterable placeholder="请选择课程" @change="change">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.cdate"
                :value="item">
                <span style="float: left">{{ item.cdate }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.stime }} ~ {{ item.etime }}</span>
              </el-option>
            </el-select> 
          </el-form-item> -->
        </el-form>
      </div>
		  <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
		    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
export default {
  data() {
    return {
      cname: '',
      ruleForm: {
        coursetime:''
      },
      dialogFormVisible: false,
      options: [],
      rules: {
        sno: [
          { required: true, message:'请输入学号', trigger: 'blur' },
          { min: 10, max: 15, message: '长度在10到15个字符', trigger: 'blur' }
        ],
        coursetime: [
          { required: true, message: '请选择请假课程的时间', trigger: 'blur' }
        ]
      }
    }
  },

  methods:{
    showFrame() {
			this.dialogFormVisible = true
    },
    submitForm(name) {
      console.log(this.ruleForm)
      this.$refs[name].validate(valid => {
        this.$ajax({
          url: '/stu/qiandao',
          data: {
            sno: this.ruleForm.sno,
            stime: this.ruleForm.coursetime.stime,
            etime: this.ruleForm.coursetime.etime,
            stype: 0,
            etype: 0,
            date: this.ruleForm.coursetime.cdate,
            kweek: this.ruleForm.coursetime.cweek,
            v_cname: this.cname
          }
        }).then(res =>　{
          if(res.status=== 'success'){
            console.log(res.data)
            this.$message.success('请假成功！')
            this.dialogFormVisible = false
          }else{
            this.$message.info(res.msg)
          }
          
        }).catch(err => {
          console.log(err)
        })
      })
    },
    change() {
      console.log(this.ruleForm.coursetime.cdate)
      this.$forceUpdate()
    },
    getData() {
      this.$nextTick(function() {
        this.$ajax({
          url: "/stu/select",
          data: {
            cname: this.cname
          }
        }).then(res => {
          if(res.status === 'success'){
            this.options = res.data
          }
          console.log('tableData', res.data)
        }).catch(err => {
          console.log(err)
        })
      })
    },
    getCname() {
      this.$ajax({
        url: "/stu/one",
        data: {
          sno: this.ruleForm.sno
        }
      }).then(res => {
        if(res.status === 'success'){
          this.cname = res.data[0].cname
          this.getData()
        }
        else{
          this.$message.error(res.msg)
        }
      }).then(() => {
        this.getData()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less">
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
    overflow: auto;
    padding: 10px 20px;
  }
  .el-dialog__footer {
    padding: 0px 20px 15px;
  }
</style>

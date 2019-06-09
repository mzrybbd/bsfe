<template>
  <el-dialog title="学生管理" :visible.sync="dialogFormVisible">
    <el-form label-position="right" :rules="rules" ref="form" :model="form" label-width="106px" size="small">
      <el-form-item label="请选择班级" prop="cname">
        <el-select v-model="form.cname" multiple placeholder="请选择班级">
          <el-option
            v-for="item in options"
            :key="item.cname"
            :label="item.cname"
            :value="item.cname">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择实验" prop='name'>
        <el-select
          v-model="form.name"
          default-first-option
          placeholder="全部实验">
          <el-option
            v-for="item in options2"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
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
      <!-- <el-form-item>
        <el-button  @click="dialogFormVisible=false">取消</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button type="primary" @click="submitForm('form')">创建</el-button>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">取消</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
      <el-button type="primary" @click="submitForm('form')">创建</el-button>
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
          { type: 'array', required: true, message: '请选择班级', trigger: 'blur' }
        ],
      },
      options: [],
      options2:[],
      pickerOptions0: {
        disabledDate(time) {
          // console.log(time)
           return  time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的 
        }
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    resetForm (name){
      this.$refs[name].resetFields()
      // this.form = {}
    },
    showFrame() {
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
        if(res.status === 'success')
          this.options = res.data;
       })
      .catch(err => {
        console.log(err);
      });
      this.$ajax({
        url: "/teacher/exp_one",
        data: {
          tno: sessionStorage.getItem('uname')
        }
      })
      .then(res => {
        this.options2 = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    },
     submitForm(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          for(let i=0; i< this.form.cname.length; i++){
            this.$ajax({
              url: '/teacher/addSys',
              data: {
                // str: "insert into experiment_submit_time(tno, name, cname, last_date) values(?,'"+ this.form.name + "','"+ this.form.cname[i]+"','"+this.form.last_date+")",
                tno:sessionStorage.getItem('uname'),
                name: this.form.name,
                cname: this.form.cname[i],
                last_date: this.form.last_date
              }
            }).then(res=> {
              console.log(this.form.last_date)
              if(res.status === 'success') {
                this.$message.success('添加成功')
                this.$emit('create', [])
                this.dialogFormVisible = false
              }else{
                this.$message.error(res.msg)
              }
            }).catch(err => {
              console.log(err)
            })
          }
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

<template>
   <div class="block">
    <el-dialog title="课表管理" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="实验日期" prop="cdate">
          <el-date-picker
            type="date"
            v-model="form.cdate"
            placeholder="选择日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="cname" label="班级">
          <el-select v-model="form.cname" filterable placeholder="请选择班级">
            <el-option
              v-for="item in options"
              :key="item.cname"
              :label="item.cname"
              :value="item.cname">
          </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item prop="time" label="上课时间">
          <el-time-picker
            is-range
            value-format="HH:mm"
            format='HH:mm' 
            v-model="time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="form.address" placeholder="地址"></el-input>
        </el-form-item>
      </el-form>
    	<div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
		    <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
		  </div>
		</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: 1,
      form: [],
      time: [new Date(2016, 9, 10, 14), new Date(2016, 9, 10, 15, 50)],
      dialogFormVisible: false,
      rules: {
        last_date: [
          { required: true, message:'请选择日期', trigger: 'blur' }
        ],
        cname: [
          { required: true, message:'请选择班级', trigger: 'blur' }
        ],
        address: [
          { required: true, message:'请输入地址', trigger: 'blur' }
        ]
      },
      options: [],
      weekArray: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
        this.options = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    },
    setRuleForm(form) {
      this.showFrame()
      this.form = form
      this.time = [form.stime, form.etime]
      this.update = true
      this.id = form.id
    },
    onSubmit(name) {
      this.$refs[name].validate(valid => {
        if(valid){
          this.$ajax({
            url: "/teacher/updateCt",
            data: {
              cname: this.form.cname,
              cdate: this.form.cdate,
              stime: this.time[0],
              etime: this.time[1],
              address: this.form.address,
              cweek: this.weekArray[new Date(this.form.cdate).getDay()],
              id: this.id
            }
          })
          .then(res => {
            if(res.status === "error") {
              this.$message.error(res.msg)
            }
            else {
              this.$emit('update', [])
              this.$message.success('更新成功!')
              this.dialogFormVisible = false
            }
          })
          .catch(err => {
            console.log(err);
          })
        }
      })
    },

  }
}
</script>

<style>

</style>

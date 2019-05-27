<template>
  <div class="block">
    <el-dialog title="课表管理" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="实验日期" prop="dates">
          <el-date-picker
            type="dates"
            v-model="form.dates"
            placeholder="选择一个或多个日期"
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
        <el-form-item label="上课时间" prop="time">
          <el-select v-model="form.time" @change="change" placeholder="请选择">
            <el-option
              v-for="item in times"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time">
          <el-time-picker
            v-show="timeFlag"
            is-range
            value-format="HH:mm"
            format='HH:mm' 
            v-model="value"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="form.address" placeholder="地址"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
          <el-button @click="reset('form')">重置</el-button>
        </el-form-item> -->
      </el-form>
    	<div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button @click="reset('form')" v-show="!update">重置</el-button>
		    <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
		  </div>
		</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        address: '机房3楼',
        dates: [],
        startTime: '',
        endTime: ''
      },
      weekArray: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
      id: '',
      dialogFormVisible: false,
      update: false,
      value: [new Date(2016, 9, 10, 14), new Date(2016, 9, 10, 15, 50)],
      rules: {
        dates: [
          { required: true, message:'请选择日期', trigger: 'blur' }
        ],
        cname: [
          { required: true, message:'请选择班级', trigger: 'blur' }
        ],
        time: [
          { required: true, message:'请选择时间', trigger: 'blur' }
        ],
        address: [
          { required: true, message:'请输入地址', trigger: 'blur' }
        ]
      },
      timeFlag: false,
      options: [],
      times: [
        {label: '8:00 ~ 9:50（1、2节）', value: '1'}, 
        {label: '10:10 ~ 12:00（3、4节）', value: '2'}, 
        {label: '14:00 ~ 15:50（冬季5、6节）', value: '3-1'}, 
        {label: '14:30 ~ 16:20（冬季5、6节）', value: '3-2'}, 
        {label: '16:00 ~ 17:50（夏季7、8节）', value: '4-1'}, 
        {label: '16:30 ~ 18:20（冬季7、8节）', value: '4-2'}, 
        {label: '19:30 ~ 21:20（9、10节）', value: '5'}, 
        {label: '其他', value: '0'}]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    showFrame() {
			this.dialogFormVisible = true
		},
    onSubmit(name) {
      this.$refs[name].validate(valid => {
        let len = this.form.dates.length
        if(this.timeFlag) {
            this.form.startTime = this.value[0]
            this.form.endTime = this.value[1]
        }
        if(valid){
          for(let i = 0; i < len; i++){
            let week = this.weekArray[new Date(this.form.dates[i]).getDay()]
            this.$ajax({
              url: "/teacher/addCourse",
              data: {
                tno: sessionStorage.getItem('uname'),
                cname: this.form.cname,
                cdate: this.form.dates[i],
                cweek: week,
                stime: this.form.startTime,
                etime: this.form.endTime,
                address: this.form.address
              }
            })
            .then(res => {
              if(res.status === "error") {
                this.$message.error(res.msg)
              }
              else {
                this.$emit('create', [])
                this.$message.success('添加成功!')
                this.dialogFormVisible = false
              }
            })
            .catch(err => {
              console.log(err);
            })
          }
        }
      })
    },
    reset(name) {
      this.$refs[name].resetFields()
      this.form.address='机房三层南'
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
    change(item) {
      switch (item){
        case '1':
          this.timeFlag = false
          this.form.startTime = '08:00:00'
          this.form.endTime = '09:50:00'
          break;
        case '2':
          this.timeFlag = false
          this.form.startTime = '10:10:00'
          this.form.endTime = '12:00:00'
          break;
        case '3-1':
          this.timeFlag = false
          this.form.startTime = '14:00:00'
          this.form.endTime = '15:50:00'
          break;
        case '3-2':
          this.timeFlag = false
          this.form.startTime = '14:30:00'
          this.form.endTime = '16:20:00'
          break;
        case '4-1':
          this.timeFlag = false
          this.form.startTime = '16:10:00'
          this.form.endTime = '17:50:00'
          break;
        case '4-2':
          this.timeFlag = false
          this.form.startTime = '16:30:00'
          this.form.endTime = '18:20:00'
          break;
        case '5':
          this.timeFlag = false
          this.form.startTime = '19:30:00'
          this.form.endTime = '21:20:00'
          break;
        default:
          this.timeFlag = true
          
      }
    }
  }
}
</script>

<style>

</style>

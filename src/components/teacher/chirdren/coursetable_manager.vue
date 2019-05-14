<template>
  <div class="block">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="实验时间" prop="dates">
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
      <el-form-item prop="address" label="地址">
        <el-input v-model="form.address" placeholder="地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </el-form-item>
    </el-form>
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
    onSubmit(name) {
      this.$refs[name].validate(valid => {
        let len = this.form.dates.length
        if(valid && len > 0){
          for(let i = 0; i < len; i++){
            this.$ajax({
              url: "/teacher/addCourse",
              data: {
                tno: sessionStorage.getItem('uname'),
                cname: this.form.cname,
                cdate: this.form.dates[i],
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
                this.$message.success('添加成功!')
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
      this.form.address='机房3层'
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
    change(item) {
      switch (item){
        case '1':
          this.form.startTime = '08:00:00'
          this.form.endTime = '09:50:00'
          break;
        case '2':
          this.form.startTime = '10:10:00'
          this.form.endTime = '12:00:00'
          break;
        case '3-1':
          this.form.startTime = '14:00:00'
          this.form.endTime = '15:50:00'
          break;
        case '3-2':
          this.form.startTime = '14:30:00'
          this.form.endTime = '16:20:00'
          break;
        case '4-1':
          this.form.startTime = '16:10:00'
          this.form.endTime = '17:50:00'
          break;
        case '4-2':
          this.form.startTime = '16:30:00'
          this.form.endTime = '18:20:00'
          break;
        case '5':
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

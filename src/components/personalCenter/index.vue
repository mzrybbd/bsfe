<template>
  <div style="height: 100%">
    <el-tabs :tab-position="tabPosition" >
      <el-tab-pane label="个人资料">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人资料</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="submit('ruleForm')">保存修改</el-button>
          </div>
          <div  class="text item">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" size="small">
              <el-form-item prop="sno" :label-width="formLabelWidth" label="学号">
                <el-input v-model="ruleForm.sno" placeholder="学号"></el-input>
              </el-form-item>
              <el-form-item prop="sname" :label-width="formLabelWidth" label="姓名">
                <el-input v-model="ruleForm.sname" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item prop="cname" :label-width="formLabelWidth" label="班级">
                <el-select v-model="ruleForm.cname" filterable placeholder="请选择班级">
                  <el-option
                    v-for="item in options"
                    :key="item.cname"
                    :label="item.cname"
                    :value="item.cname">
                  </el-option>
                </el-select> 
              </el-form-item>
              <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
                <el-radio-group v-model="ruleForm.sex">
                  <el-radio label="女"></el-radio>
                  <el-radio label="男"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
      </el-card>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>修改密码</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="updatePass('student')">保存修改</el-button>
          </div>
          <div  class="text item">
            <el-form :model="student" status-icon :rules="rules2" ref="student" label-width="100px" class="demo-ruleForm">
              <el-form-item label="密码" prop="oldPass">
                <el-input type="password" v-model="student.oldPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPass">
                <el-input type="password" v-model="student.newPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop="checkPass">
                <el-input type="password" v-model="student.checkPass" autocomplete="off" @keyup.enter.native="updatePass('student')"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="考勤管理">
        <el-table
          height="500"
          ref="filterTable"
          :data="tableData.filter(data => !search || data.sno.toLowerCase().includes(search.toLowerCase()) || data.stime.toLowerCase().includes(search.toLowerCase()) || data.sname.toLowerCase().includes(search.toLowerCase()))">
          <el-table-column
            prop="sno"
            label="学号"
            sortable>
          </el-table-column>
          <el-table-column
            prop="sname"
            label="姓名"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期"
          >
          </el-table-column>
          <el-table-column
            prop="kweek"
            label="星期"
          >
          </el-table-column>
          <el-table-column
            prop="stime"
            sortable
            label="开始时间">
          </el-table-column>
          <el-table-column
            prop="etime"
            sortable
            label="结束时间">
          </el-table-column>
          <el-table-column
            prop="stype"
            label="签到状态"
            width="100"
            :filters="[{ text: '迟到', value: '迟到' }, { text: '正常', value: '正常'}]"
            :filter-method="filterStype"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="stypeArray[scope.row.stype] === '迟到' ? 'warning' : 'success'"
                disable-transitions>{{stypeArray[scope.row.stype]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="etype"
            label="签离状态"
            width="100"
            :filters="[{ text: '早退', value: '早退' }, { text: '正常', value: '正常'}]"
            :filter-method="filterEtype"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="etypeArray[scope.row.etype] === '早退' ? 'warning' : 'success'"
                disable-transitions>{{etypeArray[scope.row.etype]}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="成绩管理">
        <div>
          <div v-if="show">教师端未开启
            <el-table
              height="500"
              :data="tableData3">
              <el-table-column
                prop="sno"
                label="学号"
                sortable>
              </el-table-column>
              <el-table-column
                prop="sname"
                label="姓名"
              ></el-table-column>
              <el-table-column
                prop="cname"
                label="班级"
              >
              </el-table-column>
              <el-table-column
                prop='exp1'
                label='实验一'
                sortable            
              >
              </el-table-column>
              <el-table-column
                prop='exp2'
                label='实验二'
                sortable
              >
              </el-table-column>
              <el-table-column
                prop='exp3'
                label='实验三'
                sortable
              >
              </el-table-column>
              <el-table-column
                prop='exp4'
                label='实验四'
                sortable
              >
              </el-table-column>
              <el-table-column
                prop='exp5'
                label='实验五'
                sortable
              >
              </el-table-column>
              <el-table-column
                prop='avg_score'
                label='实验成绩'
              >
              </el-table-column>
              <el-table-column
                prop='kq_score'
                label='考勤成绩'
              >
              </el-table-column>
              <el-table-column
                prop='final_score'
                label='最终成绩'
              >
              </el-table-column>
            </el-table>
          </div>
          <div v-else  style="color: red;">教师端未开启</div>
        </div>
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.student.checkPass !== '') {
          this.$refs.student.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.student.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      tableData3: [],
      show: false,
      tabPosition: 'left',
      stypeArray: ['正常','迟到'],
      etypeArray: ['正常','早退'],
      tableData: [],
      student: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      ruleForm: {
      	sno: '',
      	sname: '',
      	cname: '',
        sex: '',
        avatar: '',
      },
      options: [],
      formLabelWidth: '120px',
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
      },
      search: ''
    }
  },
  mounted() {
    this.getStudent()
    this.getList()
    this.getKq_table()
    this.getScore()
  },
	methods: {
    getScore() {
      this.$ajax({
          url: "/teacher/scoreOne",
          data: {
            sno: sessionStorage.getItem('uname')
          }
        }).then(res => {
         if(res.status === 'success'){
           this.tableData3 = res.data
           console.log(this.tableData3)
         }
        }).catch(err => {
          console.log(err)
        })
    },
    filterStype(value, row) {
      return this.stypeArray[row.stype] === value;
    },
    filterEtype(value, row) {
      return this.etypeArray[row.etype] === value;
    },
    getStudent() {
      this.$nextTick(function() {
        this.$ajax({
          url: "/stu/one",
          data: {
            sno: sessionStorage.getItem('uname')
          }
        }).then(res => {
          this.ruleForm = res.data[0]
          console.log(this.ruleForm)
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
    updatePass(name) {
      this.$refs[name].validate(valid => {
        if(valid && this.oldPass === this.student.oldPass && this.oldPass !== this.student.newPass) {
          this.$ajax({
            url: '/teacher/updatePwd',
            data: {
              tno: sessionStorage.getItem('uname'),
              pwd: this.student.newPass
            }
          }).then(res => {
            if(res.status === 'error'){
              this.$message.error(res.msg)
            }else{
              this.$message.success('更新成功')
              this.student = {}
            }
          }).catch(err => {
            this.$message.error('更新失败')
          })
        }
        if(this.oldPass !== this.student.oldPass) {
          this.$message.info('当前密码不正确')
        }
        if(this.oldPass === this.student.newPass) {
          this.$message.info('新旧密码不能相同')
        }
      })
    },
    getList() {
      this.$ajax({
        url: "/user/class",
        data: {
        }
      })
      .then(res => {
        this.options = res.data;
      }).then(res =>{
        this.$ajax({
          url: '/stu/tno',
          data: {
            sno:　sessionStorage.getItem('uname')
          }
        }).then(res => {
          if(res.status === 'success'){
            this.tno = res.data.tno
          }
        }).then(() => {
            this.$ajax({
          url: '/teacher/one',
          data: {
            tno: this.tno
          }
        }).then(res => {
          if(res.status === 'success'){
            console.log(res.data,res.data[0].status)
            if(res.data[0].status){
              this.show = true
              console.log(res.data,res.data[0].status)
            }
          }
        })
        })
      })
      .catch(err => {
        console.log(err);
      });
    },
    submit(name) {
       this.$refs[name].validate(valid => {
        this.$ajax({
          url: '/stu/update',
          data: {
            newUid: this.ruleForm.sno,
            oldUid: sessionStorage.getItem('uname'),
            sname: this.ruleForm.sname,
            cname: this.ruleForm.cname,
            sex: this.ruleForm.sex
          }
        }).then(res => {
          if(res.status === 'error') {
            this.$message.error(res.msg)
          }else{
            sessionStorage.setItem('uname', this.ruleForm.sno)
            this.$message.success('更新成功')
          }
        }).catch(err => {
          this.$message.error('更新失败')
        })
       })
    },
    getKq_table() {
      this.$ajax({
        url: '/stu/ka_one',
        data: {
          sno: sessionStorage.getItem('uname')
        }
      }).then(res => {
        if(res.status === 'success') {
          this.tableData = res.data
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }
}
</script>

<style lang="less" scoped>
  .text {
    font-size: 14px;
  }
  h2 {
    margin: .67em 0;
  }
  .item {
    margin-bottom: 18px;
    height: auto;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

</style>

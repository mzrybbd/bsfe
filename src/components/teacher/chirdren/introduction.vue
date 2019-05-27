<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="实验设置">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>班级管理</span>
            <el-tooltip placement="top">
              <div slot="content">全部班级可添加或者选择多个进行删除，更新班级还需使用文本框<br/>删除班级须谨慎，会连带删除班级学生课表，最好在课程完成后删除</div>
              <el-button style="float: right; padding: 3px 0" >操作说明</el-button>
            </el-tooltip>
          </div>
          <div>
            <el-form :inline="true" class="demo-form-inline" :model="form">
              <el-form-item>
                <el-select
                  v-model="form.cname"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="全部班级">
                  <el-option
                    v-for="item in options"
                    :key="item.cname"
                    :label="item.cname"
                    :value="item.cname">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addClass('form')">添加班级</el-button>
              </el-form-item>
              <el-form-item>
                <el-button  type="primary" @click="deleteClass('form')">删除班级</el-button>
              </el-form-item>
              <el-form-item>
                <el-input v-model="cname"   placeholder="请输入修改后的班级名称" clearable @keyup.enter.native="updateClass()"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateClass()">更新班级</el-button>
              </el-form-item>
          </el-form>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>考勤规则</span>
            <el-tooltip placement="top">
              <div slot="content">全部输入后回车保存提交<br />考勤占比为0-100</div>
              <el-button style="float: right; padding: 3px 0">操作说明</el-button>
            </el-tooltip>
          </div>
          <div> 
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
              <el-form-item label="迟到扣分" prop="late_score">
                <el-input  v-model.number="ruleForm.late_score" type='text' @keyup.enter.native="save('ruleForm')"></el-input>
              </el-form-item>
              <el-form-item label="早退扣分" prop="early_score">
                <el-input  v-model.number="ruleForm.early_score" type='text' @keyup.enter.native="save('ruleForm')"></el-input>
              </el-form-item>
              <el-form-item label="迟到早退扣分" prop="late_early_score">
                <el-input  v-model.number="ruleForm.late_early_score" type='text' @keyup.enter.native="save('ruleForm')"></el-input>
              </el-form-item>
              <el-form-item label="缺勤扣分" prop="absence_score">
                <el-input  v-model.number="ruleForm.absence_score" type='text' @keyup.enter.native="save('ruleForm')"></el-input>
              </el-form-item>
              <el-form-item label="考勤占比" prop="kq_rate">
                <el-input  v-model.number="ruleForm.kq_rate" type='text' @keyup.enter.native="save('ruleForm')"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>实验管理</span>
            <el-tooltip placement="top">
              <div slot="content">输入需要提交作业的最大次数<br/>若输入过多，可删除后边实验</div>
              <el-button style="float: right; padding: 3px 0">操作说明</el-button>
            </el-tooltip>
          </div>
          <div>
            <el-form :inline="true"  class="demo-form-inline">
              <el-form-item label="实验次数">
                <el-input-number v-model="num" :min="1" :max="5" label="请输入实验总次数"></el-input-number>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">创建实验</el-button>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="name"
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
              <el-form-item>
                <el-button type="primary" @click="delExp">删除实验</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-button type="text" @click="redirect">课表管理</el-button>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="使用说明">
        <h3>使用说明:</h3>
        <hr />
        <p>必须创建班级，学生可选择班级，进行注册，若学生已注册，谨慎删除班级，会连带删除课表和学生，建议课堂结束后删除</p>
        <p>必须先设置考勤扣分制度，最终可以统计出考勤总分</p>
        <p>必须添加实验时候输入最大需要提交实验的次数</p>
        <p>必须先输入实验课表，否则无法进行签到</p>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      options: [],
      options2: [],
      cname: '',
      name: '',
      num: 1,
      expName: [],
      hanzi:['0', '一','二','三','四','五'],
      ruleForm: {},
      rules:{
        late_score:[
          { required: true, message: '请输入迟到扣分', trigger: 'change' },
          { type: 'number', message: '只能输入数字', trigger: 'blur' },
        ],
        early_score:[
          { required: true, message: '请输入早退扣分', trigger: 'change' },
          { type: 'number', message: '只能输入数字', trigger: 'blur' },
        ],
        late_early_score:[
          { required: true, message: '请输入迟到早退扣分', trigger: 'change' },
          { type: 'number', message: '只能输入数字', trigger: 'blur' },
        ],
        absence_score:[
          { required: true, message: '请输入缺勤扣分', trigger: 'change' },
          { type: 'number', message: '只能输入数字', trigger: 'blur' },
        ],
        kq_rate:[
          { required: true, message: '请输入考勤占比', trigger: 'change' },
          { type: 'number', message: '只能输入数字', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    redirect() {
      this.$router.push('/teacher/coursetable_manager')
    },
    save(name) {
      this.$refs[name].validate(valid => {
        if (!valid) {
          return
        } 
        this.$ajax({
          url: "/teacher/update_kq_system",
          data: {
            tno: sessionStorage.getItem('uname'),
            early_score: this.ruleForm.early_score,
            late_score: this.ruleForm.late_score,
            late_early_score: this.ruleForm.late_early_score,
            absence_score:this.ruleForm.absence_score
          }
        })
        .then(res => {
          if(res.status === 'success') {
            this.$message.success('更新成功')
          }
        })
        .catch(err => {
          console.log(err);
        });
      })
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
        url: "/teacher/query_kq_system",
        data: {
          tno: sessionStorage.getItem('uname')
        }
      })
      .then(res => {
        if(res.status === 'success')
          this.ruleForm = res.data[0];
          console.log(this.ruleForm)
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
    updateClass() {
      if(this.cname === '') {
        this.$message.warning('更新的班级名称不能为空')
      }
      else if(this.form.cname.length > 1){
        this.$message.warning('只能选择一个班级更新')
      }else {
        console.log(this.cname, this.form.cname[0])
        this.$ajax({
          url: '/teacher/updateC',
          data: {
            newCname: this.cname,
            oldCname: this.form.cname[0],
          }
        }).then(res => {
          if(res.status === 'error') {
            this.$message.error(res.msg)
          }else{
            this.$message.success('更新成功!')
            this.getList()
            this.form = {}
            this.cname = ''
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    addExp() {
      this.$ajax({
        url: '/teacher/add_exp',
        data: {
          tno: sessionStorage.getItem('uname'),
          name: this.exp_name
        }
      }).then(res => {
        if(res.status === 'success'){
          this.getList()
          this.$message.success('添加成功')
          console.log(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    delExp() {
      this.$ajax({
        url: '/teacher/exp_del',
        data: {
          tno: sessionStorage.getItem('uname'),
          name: this.name
        }
      }).then(res => {
        if(res.status === 'success'){
          this.getList()
          console.log(res.data)
          this.$message.success('删除成功')

        }
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit(){
      console.log(this.num)
      for(let i=1; i<=this.num; i++) {
        this.expName[i] = '实验' + this.hanzi[i]
      
        this.$ajax({
          url: '/teacher/add_exp',
          data: {
            tno: sessionStorage.getItem('uname'),
            name: this.expName[i]
          }
        }).then(res => {
          if(res.status === 'success'){
            this.getList()
            this.$message.success('添加成功！')
            console.log(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    addClass(name) {
      let len = this.form.cname.length
        if(len > 0) {
          for(let i = 0; i < len; i++){
            this.$ajax({
              url: "/teacher/addClass",
              data: {
                tno: sessionStorage.getItem('uname'),
                cname: this.form.cname[i]
              }
            }).then(res => {
            if(res.status === "error") {
              this.$message.error(res.msg);
            } else {
              this.$message.success('添加班级成功')
              this.getList()
              this.form = {}
            }
            }).catch(err => {
              console.log(err)
            })
          }
        }
        else{
          this.$message.info('请输入班级')
        }
    },
    deleteClass(name) {
      let len = this.form.cname.length
      if(len > 0) {
        this.$confirm('此操作将永久删除班级，学生，以及班级课表, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for(let i=0; i<len; i++){
            this.$ajax({
              url: "/teacher/deleteClass",
              data: {
                tno: sessionStorage.getItem('uname'),
                cname: this.form.cname[i]
              }
            }).then(res => {
            if(res.status === "error") {
              this.$message.error(res.msg);
            } else {
              this.$message.success('删除班级成功')
              this.getList()
              this.form = {}
            }
            }).catch(err => {
              console.log(err)
            })
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        })
      }
      else{
        this.$message.info('请选择班级')
      }
    },
  }
}
</script>

<style>
  .text {
    font-size: 14px
  }
</style>

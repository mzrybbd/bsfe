<template>
	<div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="init">
      <el-tab-pane label="实时考勤" name="first" style="min-height: 430px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="search"  prefix-icon="el-icon-search" placeholder="请输入学号或姓名或班级或日期" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="上课时间" prop="time">
            <el-select v-model="time" @change="change" placeholder="请选择">
              <el-option
                v-for="item in times"
                :key="item.value"
                :label="item.label"""
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
          <el-form-item>
            <el-button  type="primary" @click="query2">查询考勤</el-button>
          </el-form-item> -->
          <el-form-item>
            <el-button  type="primary" @click="tongji">考勤统计</el-button>
          </el-form-item>
           <el-form-item>
            <el-button  type="primary" @click="handleAdd">请假录入</el-button>
          </el-form-item>
         <div>
          <div v-if="flagInfo">
            <p>应到人数： {{sj_kq.total_num}}，实到人数：{{sj_kq.true_num}}，缺勤人数：{{sj_kq.absence_num}}，迟到人数：{{sj_kq.late_num}}，早退人数：{{sj_kq.early_num}}，迟到早退人数：{{sj_kq.late_early_num}}，正常人数：{{sj_kq.normal_num}}</p>
            缺勤名单为：<span  v-for="item in sno_list">{{item.sname+'_'+item.sno+','}}</span>
          </div>
          <div v-else>
            <h3 style="color:red">现在没有课程!!</h3>
          </div>
          </div>
        </el-form>
         <el-table
         v-show="flagInfo"
          height="312"
          ref="filterTable"
          :data="tableData1.filter(data => !search || data.date.toLowerCase().includes(search.toLowerCase()) || data.sno.toLowerCase().includes(search.toLowerCase()) || data.sname.toLowerCase().includes(search.toLowerCase()) || data.cname.toLowerCase().includes(search.toLowerCase()))">
          <el-table-column
            prop="sno"
            label="学号"
            sortable>
          </el-table-column>
          <el-table-column
            prop="sname"
            label="姓名"
            sortable
          ></el-table-column>
          <el-table-column
            prop="cname"
            label="班级"
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
            :filters="[{ text: '迟到', value: '迟到' }, { text: '正常', value: '正常'}]"
            :filter-method="filterStype"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="stypeArray[scope.row.stype]=== '迟到' ? 'warning' : 'success'"
                disable-transitions>{{stypeArray[scope.row.stype]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="etype"
            label="签离状态"
            :filters="[{ text: '早退', value: '早退' }, { text: '正常', value: '正常'}]"
            :filter-method="filterEtype"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="etypeArray[scope.row.etype] === '早退' ? 'warning' : 'success'"
                disable-transitions>{{etypeArray[scope.row.etype]}}</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click.native.prevent="handleDelete(scope.$index, scope.row, tableData)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="考勤详情" name="second">
        <el-form :inline="true" class="demo-form-inline" :model="form">
          <el-form-item>
            <el-input v-model="form.search"  prefix-icon="el-icon-search" placeholder="请输入学号或姓名或班级或日期" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.cname"
              filterable
              placeholder="请选择班级">
              <el-option
                v-for="item in options"
                :key="item.cname"
                :label="item.cname"
                :value="item.cname">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="query()">查询考勤</el-button>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="reset('form')">清空查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          height="386"
          ref="filterTable"
          :data="tableData.filter(data => !form.search || data.date.toLowerCase().includes(form.search.toLowerCase()) || data.sno.toLowerCase().includes(form.search.toLowerCase()) || data.sname.toLowerCase().includes(form.search.toLowerCase()) || data.cname.toLowerCase().includes(form.search.toLowerCase()))">
          <!-- (!search &&　!cname && !date) || data.sno.toLowerCase().includes(search.toLowerCase()) || data.sname.toLowerCase().includes(search.toLowerCase()) || data.cname.toLowerCase().includes(cname.toLowerCase()) || data.date.toLowerCase().includes(date) -->
          <el-table-column
            prop="sno"
            label="学号"
            sortable>
          </el-table-column>
          <el-table-column
            prop="sname"
            label="姓名"
            sortable
          ></el-table-column>
          <el-table-column
            prop="cname"
            label="班级"
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
            :filters="[{ text: '迟到', value: '迟到' }, { text: '正常', value: '正常'}]"
            :filter-method="filterStype"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="stypeArray[scope.row.stype]=== '迟到' ? 'warning' : 'success'"
                disable-transitions>{{stypeArray[scope.row.stype]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="etype"
            label="签离状态"
            :filters="[{ text: '早退', value: '早退' }, { text: '正常', value: '正常'}]"
            :filter-method="filterEtype"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="etypeArray[scope.row.etype] === '早退' ? 'warning' : 'success'"
                disable-transitions>{{etypeArray[scope.row.etype]}}</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click.native.prevent="handleDelete(scope.$index, scope.row, tableData)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="考勤记录" name="third">
        <el-form :inline="true" class="demo-form-inline" :model="form">
          <el-form-item>
            <el-input v-model="search1"  prefix-icon="el-icon-search" placeholder="请输入学号或姓名或班级或日期" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="query()">查询考勤</el-button>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="reset('form')">清空查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="total_kq">矫正信息</el-button>
          </el-form-item>
        </el-form>
        <el-table
          height="386"
          ref="filterTable"
          :data="tableData2.filter(data => !search1 ||  data.sno.toLowerCase().includes(search1.toLowerCase()) || data.sname.toLowerCase().includes(search1.toLowerCase()) || data.cname.toLowerCase().includes(search1.toLowerCase()))">
          <!-- (!search &&　!cname && !date) || data.sno.toLowerCase().includes(search.toLowerCase()) || data.sname.toLowerCase().includes(search.toLowerCase()) || data.cname.toLowerCase().includes(cname.toLowerCase()) || data.date.toLowerCase().includes(date) -->
          <el-table-column
            prop="sno"
            label="学号"
            sortable>
          </el-table-column>
          <el-table-column
            prop="sname"
            label="姓名"
            sortable
          ></el-table-column>
          <el-table-column
            prop="cname"
            label="班级"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="total_num"
            sortable
            label="应签次数">
          </el-table-column>
          <el-table-column
            prop="late_num"
            sortable
            label="迟到次数"
          >
          </el-table-column>
          <el-table-column
            prop="early_num"
            sortable
            label="早退次数"
          ></el-table-column>
          <el-table-column
            prop="late_early_num"
            sortable
            label="迟到早退"
          >
          </el-table-column>
          <el-table-column
            prop="absence_num"
            sortable
            label="缺勤次数">
          </el-table-column>
          <el-table-column
            prop="normal_num"
            sortable
            label="正常次数">
          </el-table-column>
          <el-table-column
            prop="kq_score"
            sortable
            label="考勤成绩">
          </el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click.native.prevent="handleDelete(scope.$index, scope.row, tableData)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-tab-pane>
      <!-- <el-tab-pane label="考勤规则" name="forth">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>考勤规则</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="update()">操作按钮</el-button>
          </div>
          <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
              <el-form-item label="迟到扣分" prop="late_score">
                <el-input  v-model.number="ruleForm.late_score" type='text'></el-input>
              </el-form-item>
              <el-form-item label="早退扣分" prop="early_score">
                <el-input  v-model.number="ruleForm.early_score" type='text'></el-input>
              </el-form-item>
              <el-form-item label="迟到早退扣分" prop="late_early_score">
                <el-input  v-model.number="ruleForm.late_early_score" type='text'></el-input>
              </el-form-item>
              <el-form-item label="缺勤扣分" prop="absence_score">
                <el-input  v-model.number="ruleForm.absence_score" type='text'></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane> -->
    </el-tabs>
    <add_qingjia ref="add_qingjia"></add_qingjia>
	</div>
</template>

<script>
  // import create_user from './operation/create_student'
  import add_qingjia from './operation/add_qingjia'
  export default {
    components:　{ add_qingjia },
    data() {
      return {
        ruleForm: {},
        search1: '',
        sj_kq: {},
        value: [new Date(2016, 9, 10, 14), new Date(2016, 9, 10, 15, 50)],
        form: {},
        timeFlag: false,
        search: '',
        activeName: 'first',
        options: [],
        tableData: [],
        tableData1: [],
        tableData2: [],
        cname: '',
        date: '',
        search: '',
        time: '',
        rules:{
          late_score:[
            { required: true, message: '请输入工号', trigger: 'change' },
            { type: 'number', message: '只能输入数字', trigger: 'blur' },
          ],
          early_score:[
            { required: true, message: '请输入工号', trigger: 'change' },
            { type: 'number', message: '只能输入数字', trigger: 'blur' },
          ],
          late_early_score:[
            { required: true, message: '请输入工号', trigger: 'change' },
            { type: 'number', message: '只能输入数字', trigger: 'blur' },
          ],
          absence_score:[
            { required: true, message: '请输入工号', trigger: 'change' },
            { type: 'number', message: '只能输入数字', trigger: 'blur' },
          ],
        },
        times: [
          {label: '8:00 ~ 9:50（1、2节）', value: '1'}, 
          {label: '10:10 ~ 12:00（3、4节）', value: '2'}, 
          {label: '14:00 ~ 15:50（冬季5、6节）', value: '3-1'}, 
          {label: '14:30 ~ 16:20（冬季5、6节）', value: '3-2'}, 
          {label: '16:00 ~ 17:50（夏季7、8节）', value: '4-1'}, 
          {label: '16:30 ~ 18:20（冬季7、8节）', value: '4-2'}, 
          {label: '19:30 ~ 21:20（9、10节）', value: '5'}, 
          {label: '其他', value: '0'}
        ],
        stypeArray: ['正常','迟到'],
        etypeArray: ['正常','早退'],
        startTime: '',
        endTime: '',
        sno_list: [],
        flagInfo: false
      }
    },
    mounted(){
      this.getData()
      this.total_kq2()
      this.getList()
      this.tongji()
    },
    methods: {
      init(){
        this.getData()
        this.total_kq2()
        this.getList()
        this.tongji()
      },
      reset(formName) {
        this.getData()
        this.form={}
      },
      handleEdit(index, row) {
        this.$refs.update_user.setRuleForm(Object.assign({}, row))
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
     tongji() {
       this.$ajax({
          url: '/teacher/sj_kq',
          data: {
            tno: sessionStorage.getItem('uname'),
            // stime: this.startTime,
            // cname: this.sj_kq.sj_cname
          }
        }).then(res =>{
          if(res.status === 'success' && res.data.length) {
            this.flagInfo = true
            this.sj_kq = res.data[0]
            this.startTime = res.data[0].v_stime
            this.query2()
            console.log(res.data[0],this.startTime)
          }
          else if(res.status === 'success' && !res.data.length){
            this.$message.info('现在没有课程')
            this.flagInfo = false
          }
        }).then(() => {
          this.$ajax({
              url: '/teacher/qq_sno',
              data: {
                stime: this.startTime,
                etime: this.startTime,
                cname: this.sj_kq.sj_cname
              }
            }).then(res =>{
              console.log(this.sj_kq.sj_cname,this.startTime)
              if(res.status === 'success') {
                this.sno_list = res.data
                console.log(this.sno_list)
              }
            }).catch(err => {
              console.log(err)
            })
        }).catch(err => {
          console.log(err)
        })
        
     },
      query() {
        if(this.form.cname === ''){
          this.$message.info('请选择班级')
        }
        else if(this.form.date === ''){
          this.$message.info('请选择日期')
        }
        else{
          console.log(this.form.date, this.form.cname)
          this.$ajax({
            url: '/teacher/ka_jl_query',
            data: {
              tno: sessionStorage.getItem('uname'),
              cname: this.form.cname,
              date: this.form.date
            }
          }).then(res =>{
            if(res.status === 'success') {
              this.tableData = res.data 
            }
          }).catch(err => {
            console.log(err)
          })
        }
      },
      change(item) {
        switch (item){
          case '1':
            this.timeFlag = false
            this.startTime = '08:00:00'
            this.endTime = '09:50:00'
            break;
          case '2':
            this.timeFlag = false
            this.startTime = '10:10:00'
            this.endTime = '12:00:00'
            break;
          case '3-1':
            this.timeFlag = false
            this.startTime = '14:00:00'
            this.endTime = '15:50:00'
            break;
          case '3-2':
            this.timeFlag = false
            this.startTime = '14:30:00'
            this.endTime = '16:20:00'
            break;
          case '4-1':
            this.timeFlag = false
            this.startTime = '16:10:00'
            this.endTime = '17:50:00'
            break;
          case '4-2':
            this.timeFlag = false
            this.startTime = '16:30:00'
            this.endTime = '18:20:00'
            break;
          case '5':
            this.timeFlag = false
            this.startTime = '19:30:00'
            this.endTime = '21:20:00'
            break;
          default:
            this.timeFlag = true
            this.startTime = this.value[0]
        }
      },
      total_kq() {
        this.$nextTick(function() {
          this.$ajax({
            url: '/teacher/total_kqt',
            data: {
              tno: sessionStorage.getItem('uname')
            }
          }).then(res => {
            console.log(sessionStorage.getItem('uname'))
            if(res.status === 'success') {
              this.tableData2 = res.data
              console.log('hhh',this.tableData2)
            }
          }).catch(err => {
            console.log(err);
          });
        })
      },
      total_kq2() {
        this.$nextTick(function() {
          this.$ajax({
            url: '/teacher/total_kq',
            data: {
              tno: sessionStorage.getItem('uname')
            }
          }).then(res => {
            console.log(sessionStorage.getItem('uname'))
            if(res.status === 'success') {
              this.tableData2 = res.data
              console.log('hhh',this.tableData2)
            }
          }).catch(err => {
            console.log(err);
          });
        })
      },
      handleDelete(index, row, rows) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax({
            url: '/user/delete',
            data: {
              uname: row.sno
            }
          }).then(res => {
            rows.splice(index, 1)
          }).catch(err => {
            console.log(err)
          })
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
      },
      handleAdd() {
        this.$refs.add_qingjia.showFrame()
        this.init()
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      filterStype(value, row) {
        return this.stypeArray[row.stype] === value;
      },
      filterEtype(value, row) {
        return this.etypeArray[row.etype] === value;
      },
      getData() {
        this.$nextTick(function() {
          this.$ajax({
            url: '/teacher/ka_jl',
            data: {
              tno: sessionStorage.getItem('uname')
            }
          }).then(res => {
            if(res.status === 'success') {
              this.tableData = res.data
            }
          }).catch(err => {
            console.log(err);
          });
        })
      },
      query2() {
        // if(this.timeFlag) {
        //   this.startTime = this.value[0]
        // }
        // console.log(this.startTime)

        this.$nextTick(function() {
          this.$ajax({
            url: '/teacher/kq_sj',
            data: {
              tno: sessionStorage.getItem('uname'),
              stime: this.startTime,
              etime: this.startTime,
            }
          }).then(res => {
            console.log(this.startTime)
            if(res.status === 'success') {
              this.tableData1 = res.data
              console.log(this.tableData1, this.startTime)
            }
          }).catch(err => {
            console.log(err);
          });
        })
      },
    }
  }
</script>
<style lang="less" scoped>
.el-input--mini .el-input__inner {
  height: 32px;
  line-height: 32px
}
</style>

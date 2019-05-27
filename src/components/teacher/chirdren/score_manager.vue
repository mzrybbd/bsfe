<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="getList">
      <el-tab-pane label="添加成绩" name="first">
        <el-form :inline="true" class="demo-form-inline" :model="form">
          <el-form-item>
            <el-input v-model="form.search"  prefix-icon="el-icon-search" placeholder="请输入学号或姓名或班级" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.cname"
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
            <el-select
              v-model="form.expName"
              placeholder="请选择实验">
              <el-option
                v-for="item in options2"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="query()">查询</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button  type="primary" @click="reset('form')">清空查询</el-button>
          </el-form-item> -->
        </el-form>
        <el-table
          height="500"
          ref="filterTable"
          :data="tableData.filter(data => !form.search || data.sno.toLowerCase().includes(form.search.toLowerCase()) || data.sname.toLowerCase().includes(form.search.toLowerCase()) || data.cname.toLowerCase().includes(form.search.toLowerCase()))">
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
            :prop=expN
            :label=title
            sortable
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="实验成绩" name="secord">
        <el-form :inline="true" class="demo-form-inline" :model="form">
          <el-form-item>
            <el-input v-model="form2.search"  prefix-icon="el-icon-search" placeholder="请输入学号或姓名或班级" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form2.cname"
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
            <el-button  type="primary" @click="query2()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="reset2('form')">清空查询</el-button>
          </el-form-item>        
          <el-form-item>
            <el-button @click="exportExcel" style="margin-top: 2px;" size="medium" type="success" icon='iconfont icon-upload-demo'>导出</el-button>
          </el-form-item>  
        </el-form>

        <el-table
          height="500"
          ref="filterTable2"
          class="filterTable2"
          :data="tableData2.filter(data => !form2.search || data.sno.toLowerCase().includes(form2.search.toLowerCase()) || data.sname.toLowerCase().includes(form2.search.toLowerCase()) || data.cname.toLowerCase().includes(form2.search.toLowerCase()))">
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
            prop='total_score'
            label='总分'
            sortable
          >
          </el-table-column>
           <el-table-column
            prop='avg_score'
            label='平均分'
            sortable
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="成绩汇总" name="third">
        <el-form :inline="true" class="demo-form-inline" :model="form3">
          <el-form-item>
            <el-input v-model="form3.search"  prefix-icon="el-icon-search" placeholder="请输入学号或姓名或班级" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form3.cname"
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
            <el-button  type="primary" @click="query3()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="reset3('form')">清空查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="exportExcel2" style="margin-top: 2px;" size="medium" type="success" icon='iconfont icon-upload-demo'>导出</el-button>
          </el-form-item>  
        </el-form>
        <el-table
          height="500"
          ref="filterTable3"
          class="filterTable3"
          :data="tableData3.filter(data => !form3.search || data.sno.toLowerCase().includes(form3.search.toLowerCase()) || data.sname.toLowerCase().includes(form3.search.toLowerCase()) || data.cname.toLowerCase().includes(form3.search.toLowerCase()))">
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
            prop='kq_score'
            label='考勤成绩'
          >
          </el-table-column>
          <el-table-column
            prop='avg_score'
            label='实验成绩'
          >
          </el-table-column>
          <el-table-column
            prop='final_score'
            label='最终成绩'
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      activeName: 'first',
      options2: [],
      options: [],
      times: 1,
      form: {
        expName: '实验一',
        search: '',
        cname: '',
      },
      form2: {
        cname: ''
      },
      form3: {},
      tableData2:[],
      tableData: [],
      tableData3:[],
      expN: 'exp1',
      title: '实验一成绩',
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    exportExcel () {
      /* generate workbook object from table */
      let wb = XLSX.utils.table_to_book(document.querySelector('.filterTable2'),{ raw: true } );
      /* get binary string as output */
      let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
      try {
        let name = this.form2.cname?this.form2.cname + '成绩.xlsx':'全部成绩.xlsx'
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name);
      } catch (e)
      {
      if (typeof console !== 'undefined')
        console.log(e, wbout)
      }
      return wbout
    },
    exportExcel2 () {
      /* generate workbook object from table */
      let wb = XLSX.utils.table_to_book(document.querySelector('.filterTable3'),{ raw: true } );
      /* get binary string as output */
      let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
      try {
        let name = this.form3.cname?this.form3.cname + '成绩.xlsx':'全部成绩.xlsx'
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name);
      } catch (e)
      {
      if (typeof console !== 'undefined')
        console.log(e, wbout)
      }
      return wbout
    },
    reset2() {
      this.form2 = {};
      this.getList()
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
      }).then(() => {
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
      }).then(() => {
        this.$ajax({
          url: "/teacher/score",
          data: {
            str: 'select a.sno, a.sname, a.cname, b.exp1, b.exp2, b.exp3, b.exp4,b.exp5, b.total_score,b.avg_score from stu_experiment_score as b join (select * from stu where cname in (select cname from class where tno=?)) as a where a.sno=b.sno',
            tno: sessionStorage.getItem('uname')
          }
        })
        .then(res => {
          if(res.status === 'success'){
            this.tableData = res.data;
            this.tableData2 = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
      }).then(()=>{
        this.$ajax({
          url: "/teacher/total_score",
          data: {
            tno: sessionStorage.getItem('uname')
          }
        })
        .then(res => {
          if(res.status === 'success'){
            this.tableData3 = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        console.log(err);
      });
    },
    query2() {
      this.$ajax({
          url: "/teacher/score",
          data: {
            str: 'select a.sno, a.sname, a.cname, b.exp1, b.exp2, b.exp3, b.exp4,b.exp5, b.total_score,b.avg_score from stu_experiment_score as b join (select * from stu where cname=?) as a where a.sno=b.sno',
            tno: this.form2.cname
          }
        })
        .then(res => {
          if(res.status === 'success'){
            // this.tableData = res.data;
            this.tableData2 = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    query3(){
      this.$ajax({
          url: "/teacher/score",
          data: {
            str: 'select * from total_score where cname=?',
            tno: this.form3.cname
          }
        })
        .then(res => {
          if(res.status === 'success'){
            // this.tableData = res.data;
            this.tableData3 = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    query() {
      if(this.form.expName === '实验一'){
        this.expN = 'exp1'
        this.times = 1
      }else  if(this.form.expName === '实验二'){
        this.expN = 'exp2'
        this.times = 2
      }else if(this.form.expName === '实验三'){
        this.expN = 'exp3'
        this.times = 3
      } else if(this.form.expName === '实验四'){
        this.expN = 'exp4'
        this.times = 4
      } else{
        this.expN = 'exp5'
        this.times = 5
      }
      let str;
      console.log(!this.form['cname'])
      if(this.form.cname)
        str = "select a.sno, a.sname, a.cname, b." + this.expN + " from stu_experiment_score as b join (select * from stu where cname in (select cname from class where tno=?)) as a where a.sno=b.sno and a.cname=" + "'" + this.form.cname + "'"
      else {
        str = "select a.sno, a.sname, a.cname, b." + this.expN + " from stu_experiment_score as b join (select * from stu where cname in (select cname from class where tno=?)) as a where a.sno=b.sno"
      }
      this.title = this.form.expName + '成绩'
      this.$ajax({
        url: "/teacher/score",
        data: {
          str: str,
          tno: sessionStorage.getItem('uname')
        }
      })
      .then(res => {
        this.tableData = res.data;
        console.log(res.data)
      })
      .catch(err => {
        console.log(err);
      });
    },
    reset(name) {
      this.form = {};
      this.getList()
    },
    handleEdit(index, row) {
      this.$prompt('请输入成绩', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(^[1-9][0-9]$|^[0-9]$|^100$)/,
        inputErrorMessage: '成绩为0-100'
      }).then(({ value }) => {
        this.$ajax({
          url: "/teacher/score",
          data: {
            str: "update stu_experiment_score set " + this.expN + "=" + value + ", total_score=(exp1+exp2+exp3+exp4+exp5),avg_score=total_score/" + this.times +" where sno=" +row.sno,
            tno: sessionStorage.getItem('uname')
          }
        })
        .then(res => {
          if(res.status === 'success')
            row[this.expN] = value
        })
        .catch(err => {
          console.log(err);
        });
        // this.$message({
        //   type: 'success',
        //   message: '输入成绩: ' + value
        // });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    }
  }
}
</script>

<style>

</style>

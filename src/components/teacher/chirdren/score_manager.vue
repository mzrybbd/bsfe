<template>
  <div>
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
      <el-form-item>
        <el-button  type="primary" @click="reset('form')">清空查询</el-button>
      </el-form-item>
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
        prop=expN
        label="成绩"
      >
      <el-input v-model="input" placeholder="请输入内容"></el-input>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options2: [],
      options: [],
      form: {},
      tableData: [],
      expN: 'exp1',
      input: '',
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
        if(this.expName==='实验一'){
          this.expN = 'exp1'
        }else  if(this.expName==='实验二'){
          this.expN = 'exp2'
        }else if(this.expName==='实验三'){
          this.expN = 'exp3'
        } else if(this.expName==='实验四'){
          this.expN = 'exp4'
        } else {
          this.expN = 'exp5'
        } 
        this.$ajax({
          url: "/teacher/score",
          data: {
            str: 'select a.sno, a.sname, a.cname, b.' + this.expN + ' from stu_experiment_score as b join (select * from stu where cname in (select cname from class where tno=?)) as a where a.sno=b.sno',
            tno: sessionStorage.getItem('uname')
          }
        })
        .then(res => {
          console.log('select a.sno, a.sname, a.cname, b.' + this.expN + ' from stu_experiment_score as b join (select * from stu where cname in (select cname from class where tno=?)) as a where a.sno=b.sno',
            )
          this.tableData = res.data;
          console.log(res.data)
        })
        .catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        console.log(err);
      });
    },
    query() {
      this.$ajax({
          url: "/teacher/score",
          data: {
            str: 'select a.sno, a.sname, a.cname, b.' + this.expN + ' from stu_experiment_score as b join (select * from stu where cname in (select cname from class where tno=?)) as a where a.sno=b.sno and a.cname=' + this.form.cname,
            tno: sessionStorage.getItem('uname')
          }
        })
        .then(res => {
          console.log('select a.sno, a.sname, a.cname, b.' + this.expN + ' from stu_experiment_score as b join (select * from stu where cname in (select cname from class where tno=?)) as a where a.sno=b.snoand a.cname=' + this.form.cname,
            )
          this.tableData = res.data;
          console.log(res.data)
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  
}
</script>

<style>

</style>

<template>
<el-tabs type="border-card">
  <el-tab-pane label="提交时间">
    <!-- <el-form label-position="left" :rules="rules" ref="form" :model="form" label-width="110px" >
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
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
   </el-form> -->
    <el-checkbox v-model="see" @change="changeStatus" id="checkbox">是否设置实验最晚提交时间</el-checkbox>
    <div>
      <el-form :inline="true" class="demo-form-inline" :model="form">
        <el-form-item>
          <el-input v-model="search"  prefix-icon="el-icon-search" placeholder="请输入班级或日期或实验" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd" :disabled="!see">添加最晚提交时间</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="check" @change="getData">过滤已经结束的实验</el-checkbox>
        </el-form-item>
      </el-form>
      <create_st ref="create_ct" @create="update"></create_st>
      <update_st ref="update_ct" @update="update"></update_st>
      <el-table
        height="356"
        ref="filterTable"
        :data="tableData.filter(data => !search || data.last_date.toLowerCase().includes(search.toLowerCase()) || data.name.toLowerCase().includes(search.toLowerCase()) || data.cname.toLowerCase().includes(search.toLowerCase()))">
        <el-table-column
          prop="name"
          sortable
          label="实验">
        </el-table-column>

        <el-table-column
          prop="cname"
          label="班级"
          sortable>
        </el-table-column>
        <el-table-column
          prop="last_date"
          label="最晚提交日期"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="week"
          label="周次"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit2(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click.native.prevent="handleDelete2(scope.$index, scope.row, tableData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table> 
    </div>
  </el-tab-pane>
  <el-tab-pane label="目录管理">
    <el-form :inline="true" class="demo-form-inline" :model="form1">
      <el-form-item>
      <el-button @click="mkdir" icon="iconfont icon-xinjian" class="mkdir" color="#9266f9">
        创建目录
      </el-button>
      </el-form-item>
      <el-form-item>
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
      <el-form-item>
       <el-button @click="download" type="primary">
        下载实验
      </el-button>
      </el-form-item>
    </el-form>
     <el-table
      height="388"
	    ref="filterTable"
	    :data="source">
      <el-table-column
	      prop="name"
	      label="文件夹"
        >
	    </el-table-column>
      <el-table-column
	      prop="time"
	      label="上传时间"
	    >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">全部下载</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="handleDelete(scope.$index, scope.row, source)">点击删除</el-button>
              <el-button
            size="mini"
            type="danger"
            @click.native.prevent="handleClear(scope.$index, scope.row, source)">清空目录</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-tab-pane>
  <el-tab-pane label="实验记录">
    <el-form :inline="true" class="demo-form-inline" :model="form2">
        <el-form-item>
          <el-input v-model="search"  prefix-icon="el-icon-search" placeholder="请输入班级或日期或实验" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.name"
            default-first-option
            placeholder="全部实验">
            <el-option
              v-for="item in options3"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.cname"
            default-first-option
            placeholder="全部班级">
            <el-option
              v-for="item in classes"
              :key="item.cname"
              :label="item.cname"
              :value="item.cname">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="query" type="primary">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset" type="primary">
            清空
          </el-button>
        </el-form-item>
         <el-form-item>
          <el-button @click="noList" type="primary">
            未提交名单
          </el-button>
        </el-form-item>
        <div v-if="flagInfo">
          <!-- 6fb1f9 -->
          <div v-if="isClass" >
            未提交的名单有：<span  v-for="item in list" style="color:#9266f9;font-weight:600;">{{item.sno+'_'+item.sname+', '}}</span>
          </div>
          <div v-else>
            未提交的名单有：<span  v-for="item in list" style="color:#9266f9;font-weight:600;">{{item.sno+'_'+item.sname+'_'+item.cname+', '}}</span>
          </div>
        </div>
      </el-form>
     <el-table
      height="390"
	    ref="filterTable"
	    :data="tableData2.filter(data => !search || data.sno.toLowerCase().includes(search.toLowerCase()) || data.sname.toLowerCase().includes(search.toLowerCase()) || data.cname.toLowerCase().includes(search.toLowerCase()) || data.name.toLowerCase().includes(search.toLowerCase()))">
      <el-table-column
          prop='sno'
          label='学号'
          sortable
        >
      </el-table-column>
        <el-table-column
          prop='sname'
          label='姓名'
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop='cname'
          label='班级'
          sortable
        ></el-table-column>
       <el-table-column
          prop='name'
          label='实验'
        > </el-table-column>
        <el-table-column
          prop='filename'
          label='文件名'
          width="240px"
        >
        </el-table-column>
        <el-table-column
          prop='size'
          label='大小'
          width="80px"
        >
        </el-table-column>
        <el-table-column
          prop='submit_time'
          label='提交时间'
        >
        </el-table-column>
    </el-table>
  </el-tab-pane>
</el-tabs>
  
</template>

<script>
import create_st from './operation/add_latest_submission_time.vue'
import update_st from './operation/update_latest_submission_time.vue'
export default {
  components: { create_st, update_st },
  data() {
    return {
      isClass: false,
      flagInfo: false,
      see: true,
      options: [],
      options2: [],
      options3: [],
      source: [],
      form: {},
      form1: {},
      form2:{},
      expList: [],
      tableData: [],
      tableData2: [],
      search: '',
      name: [],
      check: true,
      form: {},
      weekArray: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
      rules:  {
        name: [
          { required: true, message: '请选择实验', trigger: 'change' }
        ],
        last_date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        cname: [
          { type: 'array', required: true, message: '请选择班级', trigger: 'blur' }
        ],
      },
      classes: [],
      list: [],
    }
  },
  mounted() {
    this.getList()
    this.getData()
    this.getStatus()
    this.getTableData()
  },
  methods: {
    noList(){
      console.log(this.form.cname,this.form.name)
      let str = ''
      if(!this.form.name){
        this.$message.warning('请选择选择实验！')
        return
      }
      if(!this.form.cname) {
        str = "select * from s_t  where sno not in (select sno from stu_submit_record where name='" + this.form.name + "') and tno=?"
      }else{
        this.isClass = true
        str = "select * from s_t  where sno not in (select sno from stu_submit_record where name='" + this.form.name + "') and tno=? and cname='" + this.form.cname + "'";
      }
      console.log(str)
      this.$ajax({
        url: '/teacher/stu',
        data:{
          str: str,
          tno:sessionStorage.getItem('uname')
        }
      }).then(res => {
        if(res.status === 'success') {
          this.list = res.data
          if(this.list.length === 0){
            this.flagInfo = false
            this.$message.success('所有人都提交了!')
          }else{
            this.flagInfo = true;
          }
        }
      })
    },
    reset(){
      this.form = {}
      this.getTableData()
    },
    query(){
      let str = ''
      if(!this.form.name && this.form.cname){
        str = "select * from stu_submit_record where tno=? and cname='"+ this.form.cname+"'"
      }else if(this.form.name && !this.form.cname){
        console.log('2',this.form.name,str)
        str = "select * from stu_submit_record where tno=? and name='"+ this.form.name+"'"
      }else if(this.form.name && this.form.cname) {
        str = "select * from stu_submit_record where tno=? and name='"+ this.form.name+"'"+" and cname='"+ this.form.cname+"'"
      }else{
        str = 'select * from stu_submit_record where tno=?'
      }
      this.$ajax({
        url: '/teacher/stu',
        data: {
          str: str,
          tno: sessionStorage.getItem('uname')
        }
      }).then(res => {
        if(res.status === 'success') {
          this.tableData2 = res.data
          console.log(this.tableData2)
        }
      })
    },
    getTableData() {
      this.$ajax({
        url: "/class/one",
        data: {
          tno: sessionStorage.getItem('uname')
        }
      })
      .then(res => {
        if(res.status === 'success')
          this.classes = res.data;
       })
      .catch(err => {
        console.log(err);
      });
      this.$ajax({
        url: '/teacher/stu',
        data: {
          str: 'select * from stu_submit_record where tno=?',
          tno: sessionStorage.getItem('uname')
        }
      }).then(res => {
        if(res.status === 'success') {
          this.tableData2 = res.data
          console.log(this.tableData2)
        }
      })
    },
     getStatus() {
       this.$ajax({
        url: '/teacher/score',
        data: {
          str: 'select status2 from teacher where tno=?',
          tno: sessionStorage.getItem('uname')
        }
      }).then(res=> {
        if(res.status === 'success') {
         this.see = res.data[0].status2 > 0 ? true : false
         console.log(this.see)
        }
      })
    },
    changeStatus() {
      let status = 0
      if(this.see) {
        status = 1
      }
      console.log(status)
      this.$ajax({
        url: '/teacher/score',
        data: {
          str: 'update teacher set status2=' + status +' where tno=?',
          tno: sessionStorage.getItem('uname')
        }
      }).then(res=> {
        if(res.status === 'success') {
          if(this.see)
            this.$message.success('设置成功')
          else
            this.$message.success('不设置')
        }
      })
    },
    update() {
      this.getData()
    },
    handleAdd() {
      this.$refs.create_ct.showFrame()
    },
    handleEdit2(index, row){
      this.$refs.update_ct.setRuleForm(Object.assign({}, row))
      console.log(row)
    },
    handleDelete2(index, row, rows) {
      this.$confirm('此操作将删除该文件夹以及里边的文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          url: '/teacher/deleteSys',
          data: {
            name: row.name,
            cname: row.cname
          }
        }).then(res => {
          if(res.status === 'error'){
            this.$message.error(res.msg)
          }else{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            rows.splice(index, 1)
          }
        }).catch(err => {
          console.log(err)
        })
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    },
    handleClear(index, row, rows) {
      this.$confirm('此操作将清空该文件夹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          let url = './submit/'+ sessionStorage.getItem('uname')+'/'+row.name
        console.log(url)
        this.$ajax({
          url:'/teacher/clearDir',
          data:{
            url: url
          }
        }).then(res => {
          if(res.status === 'success'){
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
        url: "/teacher/exp_one",
        data: {
          tno: sessionStorage.getItem('uname')
        }
      })
      .then(res => {
        if(res.status === 'success'){
          this.options2 = res.data;
          this.options3 = res.data;
        }
      })
      .catch(err => {
        console.log(err);
      });
      this.$ajax({
        url: 'teacher/allDir',
        data: {
          tno: sessionStorage.getItem('uname')
        }
      }).then(res => {
        if(res.status === 'success') {
          this.source = res.data
          console.log(this.source)
          }
      }).catch(err => {
        console.log(err);
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    download() {
      this.$ajax({
        url: '/teacher/one_exp',
        data:{
          name: this.form.name
        }
      }).then(res => {
        if(res.status === 'success' && res.data[0]){
          this.expList = res.data
          console.log(res.data)
          for(let i=0; i<this.expList.length; i++) {
            let url = "http://localhost:3000/teacher/downloadFile?filename="+this.expList[i].submit_path+'/'+this.expList[i].filename
            this.downloadUrl(url)
          }
        }
      })
    },
    getData() {
      let url = ''
      if(this.check){
        url = "select * from experiment_submit_time where tno=? and last_date >= curdate() order by last_date,name"
      }
      else{
        url = "select * from experiment_submit_time where tno=? order by last_date,name "
      }
      this.$ajax({
        url: '/teacher/stu',
        data: {
          str: url,
          tno: sessionStorage.getItem('uname')
        }
      }).then(res => {
        this.tableData = res.data
        this.tableData.forEach(item => {
          item.week = this.weekArray[new Date(item.last_date).getDay()]
        })
      }).catch(err => {
        console.log(err)
      })
    },
    mkdir(index, row) {
      this.$prompt('输入文件夹名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$ajax({
          url: "/teacher/mkdir",
          data: {
            tno: sessionStorage.getItem('uname') +'/' + value
          }
        })
        .then(res => {
          console.log(sessionStorage.getItem('uname') +'/' + value)
          if(res.status === 'success'){
            this.$message.success('创建成功')
            this.getList()
          }else{
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          console.log(err);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消创建'
        });       
      });
    },
    handleEdit(index, row) {
      let fileList = []
      this.$ajax({
        url: 'teacher/allFile',
        data: {
          tno: './submit/'+ sessionStorage.getItem('uname')+'/'+row.name
        }
      }).then(res => {
        if(res.status === 'success') {
          fileList = res.data
        }
        console.log(res.data)
        for(let i=0; i<fileList.length; i++) {
          let url = "http://localhost:3000/teacher/downloadFile?filename="+fileList[i].path
          console.log(url)
          this.downloadUrl(url)
        }
        this.downloadUrl()
      })
    },
    handleDelete(index, row, rows) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           let url = './submit/'+ sessionStorage.getItem('uname')+'/'+row.name
          console.log(url)
          this.$ajax({
            url:'/teacher/delDir',
            data:{
              url: url
            }
          }).then(res => {
            if(res.status === 'success'){
              rows.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        })
      },
      downloadUrl(url){
        console.log('hhh',url)
        let iframe = document.createElement('iframe');
        iframe.style.display = 'none'
        iframe.src = url
        iframe.onload = function () {
          document.body.removeChild(iframe)
        }
        document.body.appendChild(iframe)
      },
  }
}
</script>

<style scoped>
#checkbox{
  margin-bottom: 15px;
}

.iconfont{
  color: #fff; 
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  color: #fff;
  margin-left: 15px;
  cursor: pointer;
  position: relative;
  
}
</style>

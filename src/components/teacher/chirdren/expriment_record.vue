<template>
<el-tabs type="border-card">
  <el-tab-pane label="用户管理">
    <el-form label-position="left" :rules="rules" ref="form" :model="form">
      <el-form-item label="请选择实验" prop="cname">
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
   </el-form>
   <!-- <el-form :inline="true" class="demo-form-inline" :model="form">
      <el-form-item>
        <el-input v-model="search"  prefix-icon="el-icon-search" placeholder="请输入班级或日期或时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增课表</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="check" @change="getData">过滤已经完成的课程</el-checkbox>
      </el-form-item>
    </el-form>
    <create_ct ref="create_ct" @create="update"></create_ct>
    <update_ct ref="update_ct" @update="update"></update_ct>
	  <el-table
      height="500"
	    ref="filterTable"
	    :data="tableData.filter(data => !search || data.cdate.toLowerCase().includes(search.toLowerCase()) || data.stime.toLowerCase().includes(search.toLowerCase()) || data.cname.toLowerCase().includes(search.toLowerCase()))">
      <el-table-column
	      prop="cname"
	      label="班级"
	      width="180"
        sortable>
	    </el-table-column>
	    <el-table-column
	      prop="cdate"
	      label="日期"
	      sortable
	    >
      </el-table-column>
      <el-table-column
	      prop="cweek"
	      label="周次"
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
	      prop="address"
	      label="上课地址">
	    </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="handleDelete(scope.$index, scope.row, tableData)">删除</el-button>
        </template>
      </el-table-column>
  	</el-table> -->
  </el-tab-pane>
  <el-tab-pane label="目录管理">
    <el-button @click="mkdir">
      创建目录
    </el-button>
     <el-table
      height="500"
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
        </template>
      </el-table-column>
    </el-table>

  </el-tab-pane>
</el-tabs>
  
</template>

<script>
export default {
  data() {
    return {
      options: [],
      options2: [],
      source: [],
      form: {},
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
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
              console.log("insert into experiment_submit_time(tno, name, cname, last_date) values(?,'"+ this.form.name + "','"+ this.form.cname[i]+"','"+this.form.last_date+"')")
              console.log(this.form.last_date)
              if(res.status === 'success') {
                this.$message.success('添加成功')
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }
      });
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
          let url = "http://10.1.2.106:3000/teacher/downloadFile?filename="+fileList[i].path
          console.log(url)
          this.downloadUrl(url)
        }
      })
      // this.downloadUrl(url)
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

<style>

</style>

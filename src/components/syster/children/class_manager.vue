<template>
  	<div>
    <el-form :inline="true" :rules="rules" :model="form" ref='form' class="demo-form-inline">
       <el-form-item>
          <el-input v-model="search"  :rules="rules" prefix-icon="el-icon-search" placeholder="请输入工号或班级" clearable></el-input>
        </el-form-item>
        <el-form-item prop="tno">
         	<el-select v-model="form.tno" filterable placeholder="请选择教师">
				    <el-option
				      v-for="item in options"
				      :key="item.tno"
				      :label="item.tno"
				      :value="item.tno">
              <span style="float: left">{{ item.tno }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tname }}</span>
				    </el-option>
				  </el-select> 
        </el-form-item>
        <el-form-item prop="cname">
          <el-input v-model="form.cname" placeholder="班级" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="handleAdd('form')">添加</el-button>
        </el-form-item>
    </el-form>
	  <el-table
      height="450"
	    ref="filterTable"
	    :data="tableData.filter(data => !search || data.cname.toLowerCase().includes(search.toLowerCase()) || data.tno.toLowerCase().includes(search.toLowerCase()))">
	    <el-table-column
	      prop="cname"
	      label="班级"
	      sortable
	    >
	    </el-table-column>
	    <el-table-column
	      prop="tno"
	      label="工号"
        sortable>
	    </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row, tableData)">删除</el-button>
        </template>
      </el-table-column>
  	</el-table>
    <update_class ref="update" @update="update"></update_class>
	</div>
</template>

<script>
import update_class from './operation/update_class'
export default {
  components: { update_class },
  data() {
    return {
      tableData: [],
      search: '',
      options: [],
      form: {},
      rules: {
        cname: [
          { required: true, message:'请输入班级',trigger: 'blur' },
        ],
        tno: [
          { required: true, message: '请选择教师', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getData()
    this.getTeacherList()
  },
  methods: {
    update() {
      this.getData()
    },
    getTeacherList() {
      this.$nextTick(function() {
        this.$ajax({
          url: "/teacher/all",
          data: {
          }
        })
        .then(res => {
          this.options = res.data;
        })
        .catch(err => {
          console.log(err);
        })
      })
    },
    handleEdit(index, row) {
      this.$refs.update.setRuleForm(Object.assign({}, row))
    },
    handleDelete(index, row, rows) {
      console.log(row.cname)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      this.$ajax({
        url: '/teacher/deleteClass',
        data: {
          cname: row.cname
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
      handleAdd(name) {
        console.log(this.$refs[name])
        this.$refs[name].validate(valid => {
          if(valid) {
            this.$ajax({
              url: "/teacher/addClass",
              data: {
                tno: this.form.tno,
                cname: this.form.cname
              }
            }).then(res => {
            if(res.status === "error") {
                this.$message.error(res.msg);
              }
              else{
                this.$message.success('添加班级成功')
                this.form = {}
                this.getData()
              }
              
            }).catch(err => {
              this.$message.err('添加班级失败')
            })
          }
        })
      },
      getData() {
        this.$nextTick(function() {
          this.$ajax({
            url: "/user/class",
            data: {
            }
          }).then(res => {
            this.tableData = res.data
          }).catch(err => {
            console.log(err)
          })
        })
      },
  }
}
</script>

<style>

</style>

<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="form">
      <el-form-item>
        <el-input v-model="search"  prefix-icon="el-icon-search" placeholder="请输入班级或日期或时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增课表</el-button>
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
  	</el-table>
	</div>
</template>

<script>
import create_ct from './operation/create_courseTable.vue'
import update_ct from './operation/update_courseTable.vue'
export default {
  components: { create_ct, update_ct },
  data() {
    return {
      tableData: [],
      search:　'',
      form: {},
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$ajax({
        url: "/teacher/search",
        data: {
          tno: sessionStorage.getItem('uname')
        }
      }).then(res => {
        this.tableData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    update() {
      this.getData()
    },
    handleAdd() {
      this.$refs.create_ct.showFrame()
    },
     handleEdit(index, row) {
      this.$refs.update_ct.setRuleForm(Object.assign({}, row))
      console.log(row)
    },
    handleDelete(index, row, rows) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          url: '/teacher/deleteCt',
          data: {
            id: row.id
          }
        }).then(res => {
          if(res.status === 'error'){
            this.$message.error(res.msg)
          }else{
            rows.splice(index, 1)
          }
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
  }
}
</script>

<style>

</style>

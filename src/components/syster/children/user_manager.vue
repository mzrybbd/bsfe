<template>
	<div class="layout">
    <el-form :inline="true" class="demo-form-inline layout-content">
       <el-form-item>
          <el-input v-model="search" prefix-icon="el-icon-search" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="clearFilter">清空筛选</el-button>
        </el-form-item>
    </el-form>
    <nickname ref="nickname" @update="update"></nickname>
	  <el-table
      height="450"
	    ref="filterTable"
	    :data="tableData.filter(data => !search || data.uname.toLowerCase().includes(search.toLowerCase()))"
	    >
	    <el-table-column
	      prop="uname"
	      label="用户名"
	      sortable
	    >
	    </el-table-column>
	    <el-table-column
	      prop="upwd"
	      label="密码">
	    </el-table-column>
	    <el-table-column
	      prop="role"
	      label="角色"
	      :filters="[{ text: '学生', value: '学生' }, { text: '教师', value: '教师'}, { text: '管理员', value: '管理员' }]"
	      :filter-method="filterRole"
	      filter-placement="bottom-end">
	      <template slot-scope="scope">
	        <el-tag
	          :type="scope.row.role === '学生' ? 'primary' : 'success'"
	          disable-transitions>{{scope.row.role}}</el-tag>
	      </template>
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
	</div>
</template>

<script>
  import nickname from './operation/create_user.vue'
  export default {
    components:　{ nickname },
    data() {
      return {
        tableData: [],
        search: '',
      }
    },
    mounted(){
      this.getData()
    },
    methods: {
      filterRole(value, row) {
        return row.role === value;
      },
      update() {
        this.getData()
      },
      handleEdit(index, row) {
        this.$refs.nickname.setRuleForm(Object.assign({}, row))
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
              uname: row.uname
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
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      getData() {
        this.$nextTick(function() {
          this.$ajax({
            url: "/user/all",
            data: {
            }
          }).then(res => {
            this.tableData = res.data
          }).catch(err => {
            console.log(err)
          })
        })
      }
    }
  }
</script>
<style lang="less" scoped>
 .el-table {
   margin: 0 auto;
 }
 .el-input{
   width:auto;
 }
</style>

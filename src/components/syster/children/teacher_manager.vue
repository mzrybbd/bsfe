<template>
	<div>
    <el-form :inline="true" class="demo-form-inline">
       <el-form-item>
          <el-input v-model="search"  prefix-icon="el-icon-search" placeholder="请输入工号或姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="clearFilter">清空筛选</el-button>
        </el-form-item>
    </el-form>
    <create_user ref="create_user" @create="update"></create_user>
    <create_user ref="update_user" @update="update"></create_user>
	  <el-table
      height="450"
	    ref="filterTable"
	    :data="tableData.filter(data => !search || data.tno.toLowerCase().includes(search.toLowerCase()) || data.tname.toLowerCase().includes(search.toLowerCase()))"
	    >
	    <el-table-column
	      prop="tno"
	      label="工号"
	      sortable
	    >
	    </el-table-column>
	    <el-table-column
	      prop="tname"
	      label="姓名">
	    </el-table-column>
	    <el-table-column
	      prop="sex"
	      label="性别"
	      width="100"
	      :filters="[{ text: '男', value: '男' }, { text: '女', value: '女'}]"
	      :filter-method="filterSex"
	      filter-placement="bottom-end">
	      <template slot-scope="scope">
	        <el-tag
	          :type="scope.row.sex === '男' ? 'primary' : 'success'"
	          disable-transitions>{{scope.row.sex}}</el-tag>
	      </template>
	    </el-table-column>
      <el-table-column
	      prop="email"
	      label="邮箱"
	      width="180">
	    </el-table-column>
      <el-table-column
	      prop="phone"
	      label="电话"
	      width="180">
	    </el-table-column>
      <el-table-column
	      prop="address"
	      label="地址"
	      width="180">
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
  import create_user from './operation/create_teacher'
  export default {
    components:　{ create_user },
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
      filterSex(value, row) {
        return row.sex === value;
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      handleEdit(index, row) {
        this.$refs.update_user.setRuleForm(Object.assign({}, row))
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
              uname: row.tno
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
        this.$refs.create_user.showFrame()
      },
      update() {
        this.getData()
      },
      getData() {
        this.$nextTick(function() {
          this.$ajax({
            url: "/teacher/all",
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
<template>
	<div>
    <el-form :inline="true" class="demo-form-inline" :model="form">
       <el-form-item>
          <el-input v-model="search"  prefix-icon="el-icon-search" placeholder="请输入工号或姓名或班级" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增学生</el-button>
        </el-form-item>
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
          <el-input v-model="cname"   placeholder="请输入修改后的班级名称" clearable @keyup.enter.native="updateClass()"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="addClass('form')">添加班级</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="deleteClass('form')">删除班级</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="updateClass()">更新班级</el-button>
        </el-form-item>
    </el-form>
    <create_user ref="create_user" @create="update"></create_user>
    <create_user ref="update_user" @update="update"></create_user>
	  <el-table
      height="600"
	    ref="filterTable"
	    :data="tableData.filter(data => !search || data.sno.toLowerCase().includes(search.toLowerCase()) || data.sname.toLowerCase().includes(search.toLowerCase()) || data.cname.toLowerCase().includes(search.toLowerCase()))"
	    >
	    <el-table-column
	      prop="sno"
	      label="学号"
	      sortable
	    >
	    </el-table-column>
	    <el-table-column
	      prop="sname"
	      label="姓名">
	    </el-table-column>
      <el-table-column
	      prop="cname"
	      label="班级"
	      width="180">
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
  import create_user from './operation/create_student'
  export default {
    components:　{ create_user },
    data() {
      return {
        tableData: [],
        search: '',
        form: {},
        options: [],
        cname: '',
      }
    },
    mounted(){
      this.getData()
      this.getList()
    },
    methods: {
      filterSex(value, row) {
        return row.sex === value;
      },
      handleEdit(index, row) {
        this.$refs.update_user.setRuleForm(Object.assign({}, row))
      },
      update() {
        this.getData()
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
              this.getData()
            }
          }).catch(err => {
            this.message.error('更新失败')
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
                this.getData()
              }
              }).catch(err => {
                this.$message.err('添加班级失败')
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
                this.getData()
              }
              }).catch(err => {
                this.$message.err('删除班级失败')
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
        this.$refs.create_user.showFrame()
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      getData() {
        this.$nextTick(function() {
          this.$ajax({
            url: "/teacher/stu",
            data: {
              str: 'select * from stu where cname in (select cname from class where tno=?)',
              tno: sessionStorage.getItem('uname')
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
<style lang="less" scoped>
.el-input--mini .el-input__inner {
  height: 32px;
  line-height: 32px
}
</style>

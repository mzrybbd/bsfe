<template>
  <div style="margin-top: -10px;">
    <h3 style="text-align:center; padding-top: 18px;height: 25px; margin-top: 10px; font-size: 15px; font-weight: bold;color: #CC0000;letter-spacing: 2px;">
      - 学生实验课表： {{ sno }} 班级： {{ cname }}-
    </h3>

    <el-table
	    ref="filterTable"
      height="380px"
	    :data="tableData">
      <!-- <el-table-column
	      prop="cname"
	      label="班级"
	      width="180"
        sortable>
	    </el-table-column> -->
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
  	</el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      cname: '',
      sno: sessionStorage.getItem('uname')
    }
  },
  mounted(){
    // this.getData()
    this.getCname()
  },
  methods: {
    filterSex(value, row) {
      return row.sex === value;
    },  
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    getData() {
      this.$nextTick(function() {
        this.$ajax({
          url: "/stu/select",
          data: {
            cname: this.cname
          }
        }).then(res => {
          if(res.status === 'success'){
            this.tableData = res.data
          }
          console.log('tableData', res.data)
        }).catch(err => {
          console.log(err)
        })
      })
    },
    getCname() {
      this.$ajax({
        url: "/stu/one",
        data: {
          sno: sessionStorage.getItem('uname')
        }
      }).then(res => {
        if(res.status === 'success'){
          this.cname = res.data[0].cname
        }
        else{
          this.$message.error(res.msg)
        }
      }).then(() => {
        this.getData()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>

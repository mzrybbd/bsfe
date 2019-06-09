<template>
<el-dialog title="学生管理" :visible.sync="dialogFormVisible">
  <el-form>
    <el-form-item>
      <el-select
          v-model="cname"
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
      <el-upload 
        action=""
        :auto-upload="false"  
        :show-file-list="false" 
        accept=".xlsx, .xls"
        :on-change="importExcel"> 
        <el-button type="primary"> 选择文件 </el-button>
        <span style="margin-left: 10px;font-size: 16px">{{filename}}</span>
        <div slot="tip" class="el-upload__tip"  style="font-size:16px;">请使用模板上传，只能上传xlsx,xls的文件，初始密码为123456，登录后请修改</div>
      </el-upload>
      <a href="http://localhost:3000/teacher/downloadFile?filename=./uploads/stu.xlsx" style="font-size: 16px;">下载模板</a>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible=false">取 消</el-button>
    <el-button type="primary" @click="submitForm()">确 定</el-button>
  </div>
</el-dialog>

</template>

<script>
import XLSX from 'xlsx'
export default {
  data() {
    return {
      dialogFormVisible: false,
      stuList: [],
      filename: '',
      cname: '',
      options: [],
    }
  },
  mounted(){
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
        })
        .catch(err => {
          console.log(err);
        });
     },
    showFrame() {
      this.dialogFormVisible = true
    },
    importExcel(file, fileList){
      const fileReader = new FileReader();
        fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          // console.log(workbook)
          let sheet = Object.keys(workbook.Sheets)[0];
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);  //获得以第一列为键名的sheet数组对象
          this.stuList = json
          this.filename = file.name
          console.log(this.filename)
          } catch (e) {
            console.log(e)
          }
        };
        fileReader.readAsBinaryString(file.raw);
    },
    submitForm() {
      let count=0
      let i=0
      let num = 0
      if(this.stuList.length){
        for(i=0; i<this.stuList.length; i++) {
          this.$ajax({
            url: '/user/manyAdd',
            data:{
              uid: this.stuList[i]['学号'],
              uname: this.stuList[i]['姓名'],
              role: '学生',
              pwd: '123456',
              cname: this.cname
            }
          }).then(res => {
            if(res.status === 'success') {
              count++
            }
            num++
            if(num === this.stuList.length) {
              this.$message.success('成功添加了'+count+'个学生')  
              this.$emit('create', [])
              this.dialogFormVisible = false 
            }
          })
          .catch(err => {
            console.log(err)
            num++
          })
        }
        
      }
    }
  }
}
</script>

<style scoped>

</style>

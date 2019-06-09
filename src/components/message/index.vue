<template>
  <div>
    <el-tabs type="border-card" @tab-click="as" style="min-height:436px;">
      <el-tab-pane v-for="item in options" :label="item.name" :key="item.name">
        <el-form ref="form" :model="form" :rules="rules" >
          <h3>评论区</h3>
          <el-form-item  prop="content"
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="form.content"
              maxlength="500"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submit('form')">        
              提交
            </el-button>
          </el-form-item>
        </el-form>
        <div v-for="item in discuss1" style="margin-bottom:20px">
            <el-row>
              <el-col :span="1">
                <div class="grid-content bg-purple">
                  <div><i class="el-icon-s-custom" style="font-size:40px"></i></div>
                </div>
              </el-col>
              <el-col :span="23">
                <div class="grid-content bg-purple-light">
                    <div class="user">{{item.tname}}老师</div>
                    <div>{{item.time}} </div>
                </div>
                <div>
                  {{item.content}}
                </div>
              </el-col>
            </el-row>
          </div>
         <div v-for="item in discuss2" style="margin-bottom:20px">
            <el-row>
              <el-col :span="1">
                <div class="grid-content bg-purple">
                  <div><i class="el-icon-s-custom" style="font-size:40px"></i></div>
                </div>
              </el-col>
              <el-col :span="23">
                <div class="grid-content bg-purple-light">
                    <div class="user">{{item.sname}}_{{item.cname}}</div>
                    <div>{{item.time}} </div>
                </div>
                <div>
                  {{item.content}}
                </div>
              </el-col>
            </el-row>
          </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      options: [],
      discuss1: [],
      discuss2: [],
      name: '实验一',
      tno: '',
      rules: {
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    as(tab, event) {
      this.name = tab.label
      this.getList()
    },
    submit(name) {
      console.log(!this.form.content)
      if(this.form.content) {
        this.$ajax({
          url:'/teacher/discuss',
          data: {
            uid: sessionStorage.getItem('uname'),
            content: this.form.content,
            name: this.name,
            role: 0
          }
        }).then(res => {
          if(res.status === 'success') {
            this.$message.success('发送成功')
            this.form={}
            this.getList()
          }
        })
      }
    },
    getList() {
      this.$ajax({
        url: '/teacher/stu',
        data:{
          str: 'select tno from s_t where sno='+ sessionStorage.getItem('uname'),
          tno: sessionStorage.getItem('uname')
        }
      }).then(res => {
        if(res.status === 'success')
          this.tno = res.data[0].tno
          console.log(this.tno)
      }).then(()=>{
        this.$ajax({
          url: "/teacher/exp_one",
          data: {
            tno: this.tno
          }
        })
        .then(res => {
          this.options = res.data.sort();
        }).then(() => {
          this.$ajax({
            url: '/teacher/discussTeacher',
            data:　{
              tno: this.tno,
              name: this.name
            }
          }).then(res => {
            if(res.status === 'success'){
              this.discuss1 = res.data
              console.log(res.data)
            }
          })
        }).then(()=>{
          this.$ajax({
            url: '/teacher/discussStu',
            data:　{
              tno: this.tno,
              name: this.name
            }
          }).then(res => {
            if(res.status === 'success'){
              this.discuss2 = res.data
              console.log(res.data)
            }
          })
        })
        .catch(err => {
          console.log(err);
        });
      })
    }
  }
}
</script>

<style>
.bg-purple-light{
  display: flex;
  justify-content: space-between;
}
.user{
  color: blue;
}
.el-button{
  margin-top: 4px;
}
</style>

<template>
  <div>
    <el-card class="box-card" style="min-height: 420px">
      <div slot="header" class="clearfix">
        <span>其他资源</span>
      </div>
      <div v-for="(o,index) in source" :key="index" class="text item">
        <a :href="o.path">{{o.name}}</a>
        <div style="float: right">{{o.time}}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      source: [],

    }
  },
   mounted() {
    this.getList()
  },
  methods: {
    getList(){
      this.$ajax({
        url: 'teacher/allFile',
        data: {
          tno: './uploads/home'
        }
      }).then(res => {
        if(res.status === 'success') {
          this.source = res.data
          this.source.forEach(item=> {
            item.path = "http://localhost:3000/teacher/downloadFile?filename="+item.path
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>

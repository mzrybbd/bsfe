<template>
<div>
  <h3>not fount 404</h3>
  <el-button @click="redirect" type="text">返回首页</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    redirect() {
       this.$router.push('/')
    }
  }
}
</script>

<style>

</style>

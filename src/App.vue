<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
@import url("./assets/iconfont/iconfont.css");
  #app {
    font-family: 'Helvetica Neue','Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
  }
  body {
    margin: 0;
  }
  .el-dialog{
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
    width: auto;
    border-radius: 15px;
  }
  .el-dialog__body{
    overflow: auto;
    padding: 10px 20px;
  }
  .el-dialog__footer {
    padding: 0px 20px 15px;
  }
  .el-dialog__body{
    padding-bottom: 0;
  }
  .el-dialog__title,.el-message-box__title {
    line-height: 18px;
    font-size: 18px;
    color: #464c5b;
    /* color: #303133; */
    font-weight: 700;
  }

</style>

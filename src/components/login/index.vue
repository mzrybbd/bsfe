<template>
    <div class="login-wrap">
        <div class="landscape"></div>
        <div class="filter"></div>
        <canvas id="canvas"></canvas>
        <div class="login-box">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" size="small">
            <el-form-item>
              <h1><i class="el-icon-edit"></i>&nbsp;计算机组成原理实验系统</h1>
            </el-form-item>
            <el-form-item prop="name">
              <el-input v-model="ruleForm.name" placeholder="账号" clearable @keyup.enter.native="submitForm('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item prop="pass">
              <el-input type="password" v-model="ruleForm.pass" placeholder="密码" clearable @keyup.enter.native="submitForm('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" class="fit" @click="submitForm('ruleForm')">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
              </el-button>
              <p class="register" @click="handleCommand()">注册</p>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        ruleForm: {
          name: '',
          pass: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 10, max: 15, message: '长度为 10-15 个字符', trigger: 'blur' }
          ],
          pass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      window.onresize = function() {
        WIDTH = document.documentElement.clientWidth,
        HEIGHT = document.documentElement.clientHeight;
      }
      function Star(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = Math.floor(Math.random() * 2) + 1;
        var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
        this.color = "rgba(255,255,255," + alpha + ")";
      }

      Star.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.r * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
      }

      Star.prototype.move = function () {
        this.y -= .15;
        if (this.y <= -10) this.y = HEIGHT + 10;
        this.draw();
      }

      Star.prototype.die = function () {
        stars[this.id] = null;
        delete stars[this.id];
      }


      function Dot(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.maxLinks = 2;
        this.speed = .5;
        this.a = .5;
        this.aReduction = .005;
        this.color = "rgba(255,255,255," + this.a + ")";
        this.linkColor = "rgba(255,255,255," + this.a / 4 + ")";

        this.dir = Math.floor(Math.random() * 140) + 200;
      }

      Dot.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.r * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
      }

      Dot.prototype.link = function () {
        if (this.id == 0) return;
        var previousDot1 = getPreviousDot(this.id, 1);
        var previousDot2 = getPreviousDot(this.id, 2);
        var previousDot3 = getPreviousDot(this.id, 3);
        if (!previousDot1) return;
        ctx.strokeStyle = this.linkColor;
        ctx.moveTo(previousDot1.x, previousDot1.y);
        ctx.beginPath();
        ctx.lineTo(this.x, this.y);
        if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y);
        if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y);
        ctx.stroke();
        ctx.closePath();
      }

      function getPreviousDot(id, stepback) {
        if (id == 0 || id - stepback < 0) return false;
        if (typeof dots[id - stepback] != "undefined") return dots[id - stepback];
        else return false;//getPreviousDot(id - stepback);
      }

      Dot.prototype.move = function () {
        this.a -= this.aReduction;
        if (this.a <= 0) {
            this.die();
            return
        }
        this.color = "rgba(255,255,255," + this.a + ")";
        this.linkColor = "rgba(255,255,255," + this.a / 4 + ")";
        this.x = this.x + Math.cos(degToRad(this.dir)) * this.speed,
            this.y = this.y + Math.sin(degToRad(this.dir)) * this.speed;

        this.draw();
        this.link();
      }

      Dot.prototype.die = function () {
        dots[this.id] = null;
        delete dots[this.id];
      }
      var canvas = document.getElementById('canvas'),
          ctx = canvas.getContext('2d'),
          WIDTH,
          HEIGHT,
          mouseMoving = false,
          mouseMoveChecker,
          mouseX,
          mouseY,
          stars = [],
          initStarsPopulation = 80,
          dots = [],
          dotsMinDist = 2,
          maxDistFromCursor = 50;
      setCanvasSize();
      init();

      function setCanvasSize() {
        WIDTH = document.documentElement.clientWidth,
        HEIGHT = document.documentElement.clientHeight;

        canvas.setAttribute("width", WIDTH);
        canvas.setAttribute("height", HEIGHT);
      }

      function init() {
        ctx.strokeStyle = "white";
        ctx.shadowColor = "white";
        for (var i = 0; i < initStarsPopulation; i++) {
            stars[i] = new Star(i, Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT));
        }
        ctx.shadowBlur = 0;
        animate();
      }

      function animate() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (var i in stars) {
            stars[i].move();
        }
        for (i in dots) {
            dots[i].move();
        }
        drawIfMouseMoving();
        requestAnimationFrame(animate);
      }

      window.onmousemove = function (e) {
          mouseMoving = true;
          mouseX = e.clientX;
          mouseY = e.clientY;
          clearInterval(mouseMoveChecker);
          mouseMoveChecker = setTimeout(function () {
              mouseMoving = false;
          }, 100);
      }
      function drawIfMouseMoving() {
        if (!mouseMoving) return;

        if (dots.length == 0) {
            dots[0] = new Dot(0, mouseX, mouseY);
            dots[0].draw();
            return;
        }

        var previousDot = getPreviousDot(dots.length, 1);
        var prevX = previousDot.x;
        var prevY = previousDot.y;

        var diffX = Math.abs(prevX - mouseX);
        var diffY = Math.abs(prevY - mouseY);

        if (diffX < dotsMinDist || diffY < dotsMinDist) return;

        var xVariation = Math.random() > .5 ? -1 : 1;
        xVariation = xVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
        var yVariation = Math.random() > .5 ? -1 : 1;
        yVariation = yVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
        dots[dots.length] = new Dot(dots.length, mouseX + xVariation, mouseY + yVariation);
        dots[dots.length - 1].draw();
        dots[dots.length - 1].link();
      }
      //setInterval(drawIfMouseMoving, 17);

      function degToRad(deg) {
        return deg * (Math.PI / 180);
      }
    },
        
    methods: {
      submitForm(name) {
        this.$refs[name].validate(valid => {
          if (!valid) {
            return
          } 
          if (valid) {
            this.loading = true
          //登录
            this.$ajax({
              timeOut: 2000,
              url: "/user/login",
              data: {
                uid: this.ruleForm.name
              }
            }).then(res => {
                if(res.status === "error") {
                  this.$message.error(res.msg);
                  console.log(res)
                  this.loading = false
                }else {
                  if(res.data.upwd == this.ruleForm.pass) {
                    this.$message.success("登录成功")
                    if(sessionStorage) {
                      sessionStorage.setItem('role', res.data.role)
                      sessionStorage.setItem('uname', res.data.uname)
                    }
                    let path = ''
                    switch(res.data.role) {
                      case '管理员':
                        this.$router.push('/syster/user')
                        break
                      case '教师':
                        this.$router.push('/teacher')
                        break
                      default:
                        this.$router.push('/index')
                    }
                  }else {
                    this.loading = false
                    this.$message.error("用户名或密码错误!");
                  }
                }
            }).catch(err => {
              this.$message.error("网络出现问题!");
            });
          } 
        });
      },
      handleCommand() {
        this.$router.push('/register')
      }
    }
  }
</script>
<style lang="less" scoped>
    .login-wrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      border-radius: 10px;
    }
    .login-box {
      width: 360px;
      height: 280px;
      padding: 30px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 3px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    html, body {
      margin: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      /* cursor: none; */
      background: black;
      background: linear-gradient(to bottom, #000000 0%, #5788fe 100%);
    }

    .filter {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: #fe5757;
      animation: colorChange 30s ease-in-out infinite;
      animation-fill-mode: both;
      mix-blend-mode: overlay;
    }

    @keyframes colorChange {
      0%, 100% {
          opacity: 0;
      }
      50% {
          opacity: .9;
      }
    }
    .landscape {
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .fit {
      width: 100%;
    }
    h1 {
      font-size: 22px;
      font-family: "微软雅黑","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
      text-align: center;
      line-height: 0em;
    }
    .register {
      font-size:14px;
      line-height:10px;
      color:#999;
      cursor: pointer;
      float:right;
    }
</style>

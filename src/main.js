import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'
// 引用API文件
import axios from './lib/util.js'
Vue.use(ElementUI, { locale })
Vue.config.devtools = true

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);
// 将API方法绑定到全局
Vue.prototype.$ajax = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

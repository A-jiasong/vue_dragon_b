import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
//导入vue-quill-editor（富文本编辑器）
import VueQuillEditor from 'vue-quill-editor'

// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
//导入vue-quill-editor的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入axios
// import axios from 'axios'

// 导入NProgress 包对应的JS和css
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// 配置请求的根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
// axios.interceptors.request.use((config) => {
//   // 在request拦截器中显示进度条NProgress.start()
//   NProgress.start()
//   //为请求头对象，添加token验证的Authorization字段
//   // config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
// 响应拦截器
// axios.interceptors.response.use((res) => {
//   // 在response拦截器中隐藏进度条NProgress.done()
//   NProgress.done()
//   // if(res.data.meta.msg === '无效的token' && res.data.meta.status === 400) {
//   // 	location.href = '/#/login'
//   // }
//   return res
// })

// Vue.prototype.$http = axios
// 全局注册组件
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
//创建过滤器将秒数过滤为年月日，时分秒
Vue.filter('dateFormat', function(originVal) {
  // 数据库中获取的时间与实际时间相差8个小时
  const cutTime = 8 * 60 * 60 * 1000
  originVal = originVal - cutTime
  // console.log(originVal)
  const dt = new Date(originVal)
  // console.log(dt)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//全局注册富文本组件
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')

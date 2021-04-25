// 封装axios请求模块
import axios from 'axios'
// 引入store，来获取token数据
// import store from '@/store'
import { getItem } from '@/utils/storage'
// 导入NProgress 包对应的JS和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const request = axios.create({
  // 接口的基准地址
  baseURL: 'http://localhost:8061/'
})

// 请求拦截器
// request.interceptors.request.use(
//   function(config) {
//     // 将userToken解构出来
//     const { userToken } = store.state
//     // 用户存在且用户的token存在，再配置headers
//     if (userToken) {
//       config.headers.Authorization = `${userToken}`
//       // console.log(userToken)
//     }
//     return config
//   },
//   function(err) {
//     return Promise.reject(err)
//   }
// )
// 请求拦截器
request.interceptors.request.use((config) => {
  // 在request拦截器中显示进度条NProgress.start()
  NProgress.start()
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = getItem('token')
  return config
})
// 响应拦截器
request.interceptors.response.use((res) => {
  // 在response拦截器中隐藏进度条NProgress.done()
  NProgress.done()
  if (res.data.msg === '无效的token' && res.data.status === 400) {
    location.href = '/#/login'
  }
  return res
})

export default request

import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () =>
  import(
    /* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue'
  )

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },

      {
        path: '/userself',
        component: () => import('../components/user/Userself.vue')
      },
      {
        path: '/ebcycls',
        component: () => import('../components/ebcycl/Ebcycl.vue')
      },
      {
        path: '/esoterShaolin',
        component: () => import('../components/esoter/EsoterShaolin.vue')
      },
      {
        path: '/esoterWudang',
        component: () => import('../components/esoter/EsoterWudang.vue')
      },
      {
        path: '/contestGame',
        component: () => import('../components/contest/ContestGame.vue')
      },
      {
        path: '/contestShow',
        component: () => import('../components/contest/ContestShow.vue')
      },
      {
        path: '/forumShaolin',
        component: () => import('../components/forum/ForumShaolin.vue')
      },
      {
        path: '/forumWudang',
        component: () => import('../components/forum/ForumWudang.vue')
      },
      {
        path: '/clothes',
        component: () => import('../components/mall/Clothes.vue')
      },
      {
        path: '/weapon',
        component: () => import('../components/mall/Weapon.vue')
      },
      {
        path: '/cate',
        component: () => import('../components/mall/Cate.vue')
      },
      {
        path: '/logistics',
        component: () => import('../components/mall/Logistics.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数,表示放行
  if (to.path === '/welcome') {
    window.sessionStorage.setItem('activePath', '')
  } else {
    window.sessionStorage.setItem('activePath', to.path)
  }
  if (to.path === '/login') return next()
  // 获取token
  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  next()
})

export default router

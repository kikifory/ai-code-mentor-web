import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/Home.vue') },
      { path: 'analyze', name: 'Analyze', component: () => import('@/views/Analyze.vue') },
      { path: 'report/:id', name: 'Report', component: () => import('@/views/Report.vue') },
      { path: 'history', name: 'History', component: () => import('@/views/History.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const whiteList = ['/login', '/register']

  if (whiteList.includes(to.path)) return true

  if (!token) {
    ElMessage.warning('token 无效或已过期，请重新登录')
    return '/login'
  }

  return true
})

export default router
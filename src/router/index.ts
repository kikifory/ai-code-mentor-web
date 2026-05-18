import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

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
      { path: 'history', name: 'History', component: () => import('@/views/History.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：未登录跳转登录页
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.path !== '/login' && to.path !== '/register' && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
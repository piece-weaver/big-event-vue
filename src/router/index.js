import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'
import { ElMessage } from 'element-plus'

const routes = [
  { 
    path: '/login', 
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/views/Main.vue'),
    meta: { title: '大事件管理系统' },
    children: [
      { 
        path: '/article/category', 
        component: () => import('@/views/article/ArticleCategory.vue'),
        meta: { title: '文章分类' }
      },
      { 
        path: '/article/manage', 
        component: () => import('@/views/article/ArticleManage.vue'),
        meta: { title: '文章管理' }
      },
      { 
        path: '/user/info', 
        component: () => import('@/views/user/UserInfo.vue'),
        meta: { title: '基本资料' }
      },
      { 
        path: '/user/avatar', 
        component: () => import('@/views/user/UserAvatar.vue'),
        meta: { title: '更换头像' }
      },
      { 
        path: '/user/resetpassword', 
        component: () => import('@/views/user/UserResetPassword.vue'),
        meta: { title: '重置密码' }
      },
    ],
    redirect: '/article/manage',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  const isAuthenticated = tokenStore.isAuthenticated()

  document.title = to.meta.title || '大事件管理系统'

  if (to.path === '/login') {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    if (isAuthenticated) {
      next()
    } else {
      ElMessage.warning('请先登录')
      next('/login')
    }
  }
})

export default router

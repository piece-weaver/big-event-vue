import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'
import useTagsViewStore from '@/stores/tagsView.js'
import { ElMessage } from 'element-plus'

const routes = [
  { 
    path: '/login', 
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/redirect',
    component: () => import('@/views/Redirect.vue'),
    meta: { title: '' },
    children: [
      {
        path: ':path(.*)',
        component: () => import('@/views/Redirect.vue'),
        meta: { title: '' }
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/views/Main.vue'),
    meta: { title: '大事件管理系统' },
    children: [
      { 
        path: 'home', 
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页', closable: false, affix: true }
      },
      { 
        path: 'article/category', 
        component: () => import('@/views/article/ArticleCategory.vue'),
        meta: { title: '文章分类' }
      },
      { 
        path: 'article/manage', 
        component: () => import('@/views/article/ArticleManage.vue'),
        meta: { title: '文章管理' }
      },
      { 
        path: 'user/info', 
        component: () => import('@/views/user/UserInfo.vue'),
        meta: { title: '基本资料' }
      },
      { 
        path: 'user/avatar', 
        component: () => import('@/views/user/UserAvatar.vue'),
        meta: { title: '更换头像' }
      },
      { 
        path: 'user/resetpassword', 
        component: () => import('@/views/user/UserResetPassword.vue'),
        meta: { title: '重置密码' }
      },
    ],
    redirect: '/home',
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
  const tagsViewStore = useTagsViewStore()
  const isAuthenticated = tokenStore.isAuthenticated()

  document.title = to.meta.title || '大事件管理系统'

  if (to.path === '/login') {
    if (isAuthenticated) {
      next('/home')
    } else {
      next()
    }
  } else {
    if (isAuthenticated) {
      if (to.meta && to.meta.title) {
        tagsViewStore.addTagsView(to)
      }
      next()
    } else {
      ElMessage.warning('请先登录')
      next('/login')
    }
  }
})

export default router

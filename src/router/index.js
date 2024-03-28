import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores'

// 创建路由实例
const router = createRouter({
  // 配置history模式
  // vite中的环境变量,配置vite.config.js中的base配置变量
  history: createWebHistory(import.meta.env.BASE_URL), // 带#
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/loginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/layoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/articleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/articleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/userProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/userAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/userPassword.vue')
        },
      ]
    },
  ]
})

// 登录访问拦截
// 根据返回值决定是否放行
// undefined / true 直接放行
// false 拦截回from的地址页面
router.beforeEach((to, from) => {
  // 如果没有token，且访问的是非登录页，拦截到登录，其他情况放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') {
    return '/login'
  }
  return true
})

export default router

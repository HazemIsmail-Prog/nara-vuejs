import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLocaleStore } from '../stores/locale'

function applyDocumentDir(path) {
  if (path.startsWith('/admin')) {
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'
    return
  }

  const locale = useLocaleStore()
  document.documentElement.lang = locale.lang
  document.documentElement.dir = locale.dir
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'menu',
      component: () => import('../views/PublicMenu.vue'),
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLogin.vue'),
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: { name: 'admin-categories' },
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('../views/admin/AdminCategories.vue'),
        },
        {
          path: 'items',
          name: 'admin-items',
          component: () => import('../views/admin/AdminItems.vue'),
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  applyDocumentDir(to.path)

  if (!to.meta.requiresAuth) {
    return true
  }

  const auth = useAuthStore()
  if (!auth.ready) {
    await auth.fetchUser()
  }

  if (!auth.isAuthenticated) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }

  return true
})

router.afterEach((to) => {
  applyDocumentDir(to.path)
})

export default router

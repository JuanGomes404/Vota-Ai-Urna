import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Importar componentes
import Login from '@/views/Login.vue'
import AdminDashboard from '@/views/admin/Dashboard.vue'
import AdminEleicoes from '@/views/admin/Eleicoes.vue'
import AdminResultados from '@/views/admin/Resultados.vue'
import MesarioDashboard from '@/views/mesario/Dashboard.vue'
import UrnaEletronica from '@/views/urna/UrnaEletronica.vue'
import SelecaoVoto from '@/views/urna/SelecaoVoto.vue'
import VotoSucesso from '@/views/urna/VotoSucesso.vue'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/admin/eleicoes',
    name: 'AdminEleicoes',
    component: AdminEleicoes,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/admin/eleicoes/:id',
    name: 'AdminEleicaoDetalhes',
    component: AdminEleicoes,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/admin/resultados/:id',
    name: 'AdminResultados',
    component: AdminResultados,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/mesario',
    name: 'MesarioDashboard',
    component: MesarioDashboard,
    meta: { requiresAuth: true, requiresRole: 'mesario' }
  },
  {
    path: '/urna',
    name: 'UrnaEletronica',
    component: UrnaEletronica
  },
  {
    path: '/urna/votar',
    name: 'SelecaoVoto',
    component: SelecaoVoto
  },
  {
    path: '/urna/sucesso',
    name: 'VotoSucesso',
    component: VotoSucesso
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegação
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Inicializar autenticação se necessário
  if (!authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresRole = to.meta.requiresRole

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresGuest && authStore.isAuthenticated) {
    // Redirecionar baseado no role
    if (authStore.isAdmin) {
      next('/admin')
    } else if (authStore.isMesario) {
      next('/mesario')
    } else {
      next('/')
    }
  } else if (requiresRole && authStore.user?.role !== requiresRole) {
    // Redirecionar baseado no role atual
    if (authStore.isAdmin) {
      next('/admin')
    } else if (authStore.isMesario) {
      next('/mesario')
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router

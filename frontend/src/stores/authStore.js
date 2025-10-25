import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isMesario: (state) => state.user?.role === 'mesario',
    userName: (state) => state.user?.nome || 'Usuário'
  },

  actions: {
    async login(credentials) {
      this.loading = true
      try {
        const response = await authService.login(credentials)
        this.user = response.user
        this.token = response.token
        this.isAuthenticated = true
        return response
      } catch (error) {
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Erro no logout:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
      }
    },

    async refreshToken() {
      try {
        const response = await authService.refreshToken()
        this.user = response.user
        this.token = response.token
        this.isAuthenticated = true
        return response
      } catch (error) {
        this.logout()
        throw error
      }
    },

    initializeAuth() {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      
      if (token && userData) {
        this.token = token
        this.user = JSON.parse(userData)
        this.isAuthenticated = true
      }
    }
  }
})

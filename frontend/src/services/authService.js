import api from './api'

// Serviço de Autenticação
export const authService = {
  // Login unificado (admin ou mesário)
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      // Extrair mensagem de erro específica
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Erro ao realizar login. Tente novamente.'
      throw { error: errorMessage, status: error.response?.status }
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Verificar se usuário está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  },

  // Obter dados do usuário
  getUserData() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  }
}

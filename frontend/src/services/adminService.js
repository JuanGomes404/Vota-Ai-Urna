import api from './api'

// Serviço de Administração
export const adminService = {
  // Eleições
  async criarEleicao(eleicaoData) {
    try {
      const response = await api.post('/admin/eleicoes', eleicaoData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async listarEleicoes() {
    try {
      const response = await api.get('/admin/eleicoes')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async buscarEleicao(eleicaoId) {
    try {
      const response = await api.get(`/admin/eleicoes/${eleicaoId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async ativarEleicao(eleicaoId) {
    try {
      const response = await api.post(`/admin/eleicoes/${eleicaoId}/ativar`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async encerrarEleicao(eleicaoId) {
    try {
      const response = await api.post(`/admin/eleicoes/${eleicaoId}/encerrar`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async visualizarResultado(eleicaoId) {
    try {
      const response = await api.get(`/admin/eleicoes/${eleicaoId}/resultado`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Chapas
  async criarChapa(chapaData) {
    try {
      const response = await api.post('/admin/chapas', chapaData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async deletarChapa(chapaId) {
    try {
      const response = await api.delete(`/admin/chapas/${chapaId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Eleitores
  async importarEleitores(eleitores) {
    try {
      const response = await api.post('/admin/eleitores/importar', eleitores)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

import api from './api'

// Serviço da Urna Eletrônica (endpoints públicos)
export const urnaService = {
  // Validar credencial de voto
  async validarCredencial(token) {
    try {
      const response = await api.post('/urna/validar-credencial', { token })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Listar chapas de uma eleição
  async listarChapas(eleicaoId) {
    try {
      const response = await api.get(`/urna/chapas?eleicaoId=${eleicaoId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Confirmar voto
  async confirmarVoto(votoData) {
    try {
      const response = await api.post('/urna/confirmar', votoData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Status da urna (para mesários)
  async statusUrna() {
    try {
      const response = await api.get('/urna/status')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

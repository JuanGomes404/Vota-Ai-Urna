import api from './api'

// Serviço de Mesário
export const mesarioService = {
  // Listar eleições ativas
  async listarEleicoesAtivas() {
    try {
      const response = await api.get('/mesario/eleicoes')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Listar todos os eleitores aptos a votar em uma eleição
  async listarEleitoresAptos(eleicaoId) {
    try {
      const response = await api.get(`/mesario/eleitores/${eleicaoId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Buscar eleitor por matrícula
  async buscarEleitor(matricula, eleicaoId) {
    try {
      const response = await api.get(`/mesario/eleitor/${matricula}?eleicaoId=${eleicaoId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Habilitar eleitor para votar
  async habilitarEleitor(matricula, eleicaoId) {
    try {
      const response = await api.post('/mesario/habilitar', { matricula, eleicaoId })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

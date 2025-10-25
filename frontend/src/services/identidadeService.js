import api from './api'

// Serviço de Validação de Identidade
export const identidadeService = {
  // Validar identidade do eleitor
  async validarIdentidade(dadosIdentidade) {
    try {
      const response = await api.post('/identidade/validar', dadosIdentidade)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

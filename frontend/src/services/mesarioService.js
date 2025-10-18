import api from './api'

// Serviço de Mesário
export const mesarioService = {
  // Buscar eleitor por matrícula
  async buscarEleitor(matricula) {
    try {
      const response = await api.get(`/mesario/eleitor/${matricula}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Habilitar eleitor para votar
  async habilitarEleitor(matricula) {
    try {
      const response = await api.post('/mesario/habilitar', { matricula })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

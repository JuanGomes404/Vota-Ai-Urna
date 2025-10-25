import { defineStore } from 'pinia'
import { adminService } from '@/services/adminService'

export const useEleicaoStore = defineStore('eleicao', {
  state: () => ({
    eleicoes: [],
    eleicaoAtiva: null,
    chapas: [],
    eleitores: [],
    resultados: null,
    loading: false
  }),

  getters: {
    eleicoesAtivas: (state) => state.eleicoes.filter(e => e.status === 'Ativa'),
    eleicoesEncerradas: (state) => state.eleicoes.filter(e => e.status === 'Encerrada'),
    eleicoesCriadas: (state) => state.eleicoes.filter(e => e.status === 'Criada')
  },

  actions: {
    async carregarEleicoes() {
      this.loading = true
      try {
        const response = await adminService.listarEleicoes()
        this.eleicoes = response
      } catch (error) {
        console.error('Erro ao carregar eleições:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async buscarEleicao(eleicaoId) {
      this.loading = true
      try {
        const response = await adminService.buscarEleicao(eleicaoId)
        return response
      } catch (error) {
        console.error('Erro ao buscar eleição:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async criarEleicao(eleicaoData) {
      this.loading = true
      try {
        const response = await adminService.criarEleicao(eleicaoData)
        this.eleicoes.push(response)
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async ativarEleicao(eleicaoId) {
      try {
        const response = await adminService.ativarEleicao(eleicaoId)
        const index = this.eleicoes.findIndex(e => e.id === eleicaoId)
        if (index !== -1) {
          this.eleicoes[index] = response
        }
        return response
      } catch (error) {
        throw error
      }
    },

    async encerrarEleicao(eleicaoId) {
      try {
        const response = await adminService.encerrarEleicao(eleicaoId)
        const index = this.eleicoes.findIndex(e => e.id === eleicaoId)
        if (index !== -1) {
          this.eleicoes[index] = response
        }
        return response
      } catch (error) {
        throw error
      }
    },

    async criarChapa(chapaData) {
      try {
        const response = await adminService.criarChapa(chapaData)
        this.chapas.push(response)
        return response
      } catch (error) {
        throw error
      }
    },

    async deletarChapa(chapaId) {
      try {
        const response = await adminService.deletarChapa(chapaId)
        // Remover chapa da lista local
        const index = this.chapas.findIndex(c => c.id === chapaId)
        if (index !== -1) {
          this.chapas.splice(index, 1)
        }
        return response
      } catch (error) {
        throw error
      }
    },

    async importarEleitores(eleitores) {
      try {
        const response = await adminService.importarEleitores(eleitores)
        return response
      } catch (error) {
        throw error
      }
    },

    async carregarResultados(eleicaoId) {
      try {
        const response = await adminService.visualizarResultado(eleicaoId)
        this.resultados = response
        return response
      } catch (error) {
        throw error
      }
    },

    setEleicaoAtiva(eleicao) {
      this.eleicaoAtiva = eleicao
    }
  }
})

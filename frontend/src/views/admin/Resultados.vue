<template>
  <v-app>
    <v-app-bar color="primary" dark density="comfortable">
      <v-app-bar-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-chart-line</v-icon>
        <span class="d-none d-sm-inline">Resultados da Eleição</span>
        <span class="d-inline d-sm-none">Resultados</span>
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-btn
        color="white"
        variant="text"
        @click="$router.push('/admin')"
        size="small"
        class="mr-1 mr-sm-2"
      >
        <v-icon :class="{ 'mr-1': $vuetify.display.smAndUp }">mdi-arrow-left</v-icon>
        <span class="d-none d-sm-inline">Voltar</span>
      </v-btn>
      
      <v-btn
        color="white"
        variant="text"
        @click="$router.push('/')"
        size="small"
      >
        <v-icon :class="{ 'mr-1': $vuetify.display.smAndUp }">mdi-home</v-icon>
        <span class="d-none d-sm-inline">Início</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4 pa-sm-6 pa-md-8">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 font-weight-bold mb-6">
              RESULTADOS DA ELEIÇÃO
            </h1>
            <p class="text-h6 grey--text mb-6">
              {{ eleicao?.nome || 'Carregando...' }}
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="8">
            <v-card elevation="4" class="pa-6">
              <v-card-title>
                <h3 class="text-h5">Distribuição de Votos</h3>
              </v-card-title>
              <v-card-text>
                <div class="chart-container">
                  <canvas ref="chartCanvas"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card elevation="4" class="pa-6">
              <v-card-title>
                <h3 class="text-h5">Estatísticas</h3>
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Total de Eleitores</v-list-item-title>
                    <v-list-item-subtitle class="text-h6 font-weight-bold">
                      {{ totalEleitores }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Total de Votos</v-list-item-title>
                    <v-list-item-subtitle class="text-h6 font-weight-bold">
                      {{ totalVotos }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Votos Válidos</v-list-item-title>
                    <v-list-item-subtitle class="text-h6 font-weight-bold success--text">
                      {{ votosValidos }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Votos em Branco</v-list-item-title>
                    <v-list-item-subtitle class="text-h6 font-weight-bold warning--text">
                      {{ votosBrancos }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Votos Nulos</v-list-item-title>
                    <v-list-item-subtitle class="text-h6 font-weight-bold error--text">
                      {{ votosNulos }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Abstenções</v-list-item-title>
                    <v-list-item-subtitle class="text-h6 font-weight-bold grey--text">
                      {{ abstencoes }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col cols="12">
            <v-card elevation="4" class="pa-6">
              <v-card-title>
                <h3 class="text-h5">Resultado por Chapa</h3>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headersResultados"
                  :items="resultadosChapas"
                  :loading="loading"
                  class="elevation-1"
                >
                  <template v-slot:item.votos="{ item }">
                    <span class="font-weight-bold">{{ item.votos }}</span>
                  </template>
                  <template v-slot:item.numero="{ item }">
                    <v-chip color="primary" size="small">
                      {{ item.numero }}
                    </v-chip>
                  </template>
                  <template v-slot:item.percentual="{ item }">
                    <v-progress-linear
                      :model-value="item.percentual"
                      color="primary"
                      height="20"
                      rounded
                    >
                      <template v-slot:default="{ value }">
                        <strong>{{ value.toFixed(1) }}%</strong>
                      </template>
                    </v-progress-linear>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog de Alerta -->
        <v-dialog v-model="dialogAlerta" max-width="500" persistent>
          <v-card rounded="lg">
            <v-card-title class="text-h5 font-weight-bold pa-6 bg-error">
              <div class="d-flex align-center justify-center w-100">
                <v-icon color="white" class="mr-2">mdi-alert</v-icon>
                <span class="text-white">Erro</span>
              </div>
            </v-card-title>
            <v-card-text class="pa-6 text-center">
              <p class="text-h6 mb-0">{{ mensagemAlerta }}</p>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn
                color="error"
                size="large"
                variant="elevated"
                @click="dialogAlerta = false"
              >
                <v-icon left>mdi-check</v-icon>
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { adminService } from '@/services/adminService'

Chart.register(...registerables)

export default {
  name: 'AdminResultados',
  data() {
    return {
      eleicao: null,
      loading: false,
      totalEleitores: 0,
      totalVotos: 0,
      votosValidos: 0,
      votosBrancos: 0,
      votosNulos: 0,
      abstencoes: 0,
      resultadosChapas: [],
      // Variáveis para alerta
      dialogAlerta: false,
      mensagemAlerta: '',
      headersResultados: [
        { title: 'Número', key: 'numero' },
        { title: 'Chapa', key: 'nome' },
        { title: 'Votos', key: 'votos' },
        { title: 'Percentual', key: 'percentual' }
      ]
    }
  },
  async mounted() {
    await this.carregarResultados()
    if (this.resultadosChapas.length > 0) {
      this.criarGrafico()
    }
  },
  methods: {
    async carregarResultados() {
      this.loading = true
      try {
        const eleicaoId = this.$route.params.id
        
        // Carregar resultados reais da API
        const resultado = await adminService.visualizarResultado(eleicaoId)
        
        this.eleicao = resultado.eleicao
        this.totalEleitores = resultado.totalEleitores || 0
        this.totalVotos = resultado.totalVotos || 0
        this.votosValidos = resultado.votosValidos || 0
        this.votosBrancos = resultado.votosBrancos || 0
        this.votosNulos = resultado.votosNulos || 0
        this.abstencoes = resultado.abstencoes || 0
        this.resultadosChapas = resultado.chapas || []
      } catch (error) {
        console.error('Erro ao carregar resultados:', error)
        this.mensagemAlerta = 'Erro ao carregar resultados: ' + (error.error || error.message || 'Erro desconhecido')
        this.dialogAlerta = true
      } finally {
        this.loading = false
      }
    },
    criarGrafico() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      // Preparar dados para o gráfico (incluir brancos e nulos)
      const labels = [...this.resultadosChapas.map(item => `${item.numero} - ${item.nome}`)]
      const votos = [...this.resultadosChapas.map(item => item.votos)]
      
      if (this.votosBrancos > 0) {
        labels.push('Votos em Branco')
        votos.push(this.votosBrancos)
      }
      
      if (this.votosNulos > 0) {
        labels.push('Votos Nulos')
        votos.push(this.votosNulos)
      }
      
      // Gerar cores dinamicamente
      const baseColors = ['#1976D2', '#388E3C', '#FFA000', '#9C27B0', '#FF5722', '#00BCD4']
      const colors = votos.map((_, index) => {
        if (labels[index] === 'Votos em Branco') return '#9E9E9E'
        if (labels[index] === 'Votos Nulos') return '#D32F2F'
        return baseColors[index % baseColors.length]
      })
      
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: votos,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentual = ((context.parsed / total) * 100).toFixed(1)
                  return `${context.label}: ${context.parsed} votos (${percentual}%)`
                }
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.2;
}

/* Títulos específicos em cards */
.v-card h3 {
  min-height: 1.5em;
  word-break: break-word;
  overflow-wrap: break-word;
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>

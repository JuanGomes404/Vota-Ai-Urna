<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>
        <v-icon left>mdi-chart-line</v-icon>
        Resultados da Eleição
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-btn
        color="white"
        variant="text"
        @click="$router.push('/admin')"
      >
        <v-icon left>mdi-arrow-left</v-icon>
        Voltar
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-8">
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
                  <template v-slot:item.percentual="{ item }">
                    <v-progress-linear
                      :model-value="item.percentual"
                      color="primary"
                      height="20"
                      rounded
                    >
                      <template v-slot:default="{ value }">
                        <strong>{{ Math.ceil(value) }}%</strong>
                      </template>
                    </v-progress-linear>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'AdminResultados',
  data() {
    return {
      eleicao: null,
      loading: false,
      totalVotos: 0,
      votosValidos: 0,
      votosBrancos: 0,
      votosNulos: 0,
      abstencoes: 0,
      resultadosChapas: [],
      headersResultados: [
        { title: 'Chapa', key: 'nome' },
        { title: 'Votos', key: 'votos' },
        { title: 'Percentual', key: 'percentual' }
      ]
    }
  },
  async mounted() {
    await this.carregarResultados()
    this.criarGrafico()
  },
  methods: {
    async carregarResultados() {
      this.loading = true
      try {
        const eleicaoId = this.$route.params.id
        // Em produção, carregar resultados reais
        this.eleicao = { id: eleicaoId, nome: 'Eleição de Exemplo' }
        
        // Dados de exemplo
        this.resultadosChapas = [
          { nome: 'Chapa Inovação', votos: 600, percentual: 48 },
          { nome: 'Chapa Avança', votos: 400, percentual: 32 },
          { nome: 'Votos em Branco', votos: 150, percentual: 12 },
          { nome: 'Votos Nulos', votos: 100, percentual: 8 }
        ]
        
        this.totalVotos = 1250
        this.votosValidos = 1000
        this.votosBrancos = 150
        this.votosNulos = 100
        this.abstencoes = 350
      } catch (error) {
        console.error('Erro ao carregar resultados:', error)
      } finally {
        this.loading = false
      }
    },
    criarGrafico() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.resultadosChapas.map(item => item.nome),
          datasets: [{
            data: this.resultadosChapas.map(item => item.votos),
            backgroundColor: [
              '#1976D2',
              '#388E3C',
              '#FFA000',
              '#D32F2F'
            ],
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

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>

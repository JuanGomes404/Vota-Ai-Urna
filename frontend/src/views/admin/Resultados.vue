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

    <v-main class="main-content">
      <v-container fluid class="pa-4 pa-sm-6 pa-md-8">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 text-sm-h3 font-weight-bold mb-4 mb-sm-6">
              RESULTADOS DA ELEIÇÃO
            </h1>
            <p class="text-subtitle-1 text-sm-h6 grey--text mb-4 mb-sm-6">
              {{ eleicao?.nome || 'Carregando...' }}
            </p>
          </v-col>
        </v-row>

        <!-- Card do Vencedor -->
        <v-row v-if="vencedor && !loading">
          <v-col cols="12">
            <v-card 
              elevation="8" 
              class="winner-card pa-4 pa-sm-6 mb-4"
              color="success"
            >
              <v-card-text class="text-center">
                <v-icon size="48" color="white" class="mb-3">mdi-trophy</v-icon>
                <h2 class="text-h5 text-sm-h4 font-weight-bold text-white mb-2">
                  VENCEDOR DA ELEIÇÃO
                </h2>
                <div class="winner-info">
                  <v-chip 
                    color="white" 
                    size="large" 
                    class="ma-2 winner-chip"
                  >
                    <span class="text-h6 font-weight-bold">Nº {{ vencedor.numero }}</span>
                  </v-chip>
                  <h3 class="text-h5 text-sm-h4 font-weight-bold text-white mb-2">
                    {{ vencedor.nome }}
                  </h3>
                  <div class="winner-stats d-flex flex-column flex-sm-row justify-center align-center gap-2 gap-sm-4 mt-3">
                    <div class="stat-item">
                      <v-icon color="white" class="mr-1">mdi-vote</v-icon>
                      <span class="text-h6 text-white font-weight-bold">
                        {{ vencedor.votos }} votos
                      </span>
                    </div>
                    <div class="stat-item">
                      <v-icon color="white" class="mr-1">mdi-percent</v-icon>
                      <span class="text-h6 text-white font-weight-bold">
                        {{ vencedor.percentual.toFixed(1) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="8" class="mb-4 mb-md-0">
            <v-card elevation="4" class="pa-4 pa-sm-6">
              <v-card-title>
                <h3 class="text-h6 text-sm-h5">Distribuição de Votos</h3>
              </v-card-title>
              <v-card-text>
                <div class="chart-container">
                  <canvas ref="chartCanvas"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card elevation="4" class="pa-4 pa-sm-6 stats-card">
              <v-card-title>
                <h3 class="text-h6 text-sm-h5">Estatísticas</h3>
              </v-card-title>
              <v-card-text>
                <v-list class="stats-list">
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-account-multiple</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-sm-body-1">
                      Total de Eleitores
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-list-item-subtitle class="text-h6 font-weight-bold">
                        {{ totalEleitores }}
                      </v-list-item-subtitle>
                    </template>
                  </v-list-item>
                  
                  <v-divider class="my-2"></v-divider>
                  
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-vote</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-sm-body-1">
                      Total de Votos
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-list-item-subtitle class="text-h6 font-weight-bold">
                        {{ totalVotos }}
                      </v-list-item-subtitle>
                    </template>
                  </v-list-item>
                  
                  <v-divider class="my-2"></v-divider>
                  
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-sm-body-1">
                      Votos Válidos
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-list-item-subtitle class="text-h6 font-weight-bold success--text">
                        {{ votosValidos }}
                      </v-list-item-subtitle>
                    </template>
                  </v-list-item>
                  
                  <v-divider class="my-2"></v-divider>
                  
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="warning">mdi-minus-circle</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-sm-body-1">
                      Votos em Branco
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-list-item-subtitle class="text-h6 font-weight-bold warning--text">
                        {{ votosBrancos }}
                      </v-list-item-subtitle>
                    </template>
                  </v-list-item>
                  
                  <v-divider class="my-2"></v-divider>
                  
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="error">mdi-close-circle</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-sm-body-1">
                      Votos Nulos
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-list-item-subtitle class="text-h6 font-weight-bold error--text">
                        {{ votosNulos }}
                      </v-list-item-subtitle>
                    </template>
                  </v-list-item>
                  
                  <v-divider class="my-2"></v-divider>
                  
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="grey">mdi-account-off</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-sm-body-1">
                      Abstenções
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-list-item-subtitle class="text-h6 font-weight-bold grey--text">
                        {{ abstencoes }}
                      </v-list-item-subtitle>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4 mt-sm-6">
          <v-col cols="12">
            <v-card elevation="4" class="pa-4 pa-sm-6">
              <v-card-title>
                <h3 class="text-h6 text-sm-h5">Resultado por Chapa</h3>
              </v-card-title>
              <v-card-text>
                <!-- Versão Desktop -->
                <v-data-table
                  v-if="$vuetify.display.mdAndUp"
                  :headers="headersResultados"
                  :items="resultadosChapas"
                  :loading="loading"
                  class="elevation-1"
                  :items-per-page="-1"
                  hide-default-footer
                >
                  <template v-slot:item.votos="{ item }">
                    <span class="font-weight-bold">{{ item.votos }}</span>
                  </template>
                  <template v-slot:item.numero="{ item }">
                    <v-chip 
                      :color="item === vencedor ? 'success' : 'primary'" 
                      size="small"
                    >
                      {{ item.numero }}
                    </v-chip>
                  </template>
                  <template v-slot:item.nome="{ item }">
                    <div class="d-flex align-center">
                      <span :class="{ 'font-weight-bold': item === vencedor }">
                        {{ item.nome }}
                      </span>
                      <v-icon 
                        v-if="item === vencedor" 
                        color="success" 
                        class="ml-2"
                      >
                        mdi-crown
                      </v-icon>
                    </div>
                  </template>
                  <template v-slot:item.percentual="{ item }">
                    <v-progress-linear
                      :model-value="item.percentual"
                      :color="item === vencedor ? 'success' : 'primary'"
                      height="25"
                      rounded
                    >
                      <template v-slot:default="{ value }">
                        <strong>{{ value.toFixed(1) }}%</strong>
                      </template>
                    </v-progress-linear>
                  </template>
                </v-data-table>

                <!-- Versão Mobile -->
                <div v-else class="mobile-results">
                  <v-card
                    v-for="(item, index) in resultadosChapas"
                    :key="index"
                    :color="item === vencedor ? 'success lighten-5' : 'grey lighten-4'"
                    class="mb-3 pa-3"
                    elevation="2"
                  >
                    <div class="d-flex justify-space-between align-center mb-2">
                      <v-chip 
                        :color="item === vencedor ? 'success' : 'primary'" 
                        size="small"
                      >
                        Nº {{ item.numero }}
                      </v-chip>
                      <v-icon 
                        v-if="item === vencedor" 
                        color="success" 
                        size="large"
                      >
                        mdi-crown
                      </v-icon>
                    </div>
                    
                    <h4 
                      class="text-h6 mb-2"
                      :class="{ 'success--text font-weight-bold': item === vencedor }"
                    >
                      {{ item.nome }}
                    </h4>
                    
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-2">Votos:</span>
                      <span class="text-h6 font-weight-bold">{{ item.votos }}</span>
                    </div>
                    
                    <v-progress-linear
                      :model-value="item.percentual"
                      :color="item === vencedor ? 'success' : 'primary'"
                      height="25"
                      rounded
                      class="mt-2"
                    >
                      <template v-slot:default="{ value }">
                        <strong>{{ value.toFixed(1) }}%</strong>
                      </template>
                    </v-progress-linear>
                  </v-card>
                </div>
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
      vencedor: null,
      // Variáveis para alerta
      dialogAlerta: false,
      mensagemAlerta: '',
      headersResultados: [
        { title: 'Número', key: 'numero', align: 'center' },
        { title: 'Chapa', key: 'nome' },
        { title: 'Votos', key: 'votos', align: 'center' },
        { title: 'Percentual', key: 'percentual' }
      ]
    }
  },
  async mounted() {
    await this.carregarResultados()
    if (this.resultadosChapas.length > 0) {
      this.identificarVencedor()
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
    identificarVencedor() {
      if (this.resultadosChapas.length === 0) {
        this.vencedor = null
        return
      }
      
      // Ordenar chapas por número de votos (decrescente)
      const chapasSorted = [...this.resultadosChapas].sort((a, b) => b.votos - a.votos)
      
      // O vencedor é a chapa com mais votos
      this.vencedor = chapasSorted[0]
      
      // Verificar se há empate (múltiplas chapas com o mesmo número de votos mais alto)
      const votosMaximos = this.vencedor.votos
      const empatadas = chapasSorted.filter(chapa => chapa.votos === votosMaximos)
      
      // Se houver empate, podemos indicar isso (opcional)
      if (empatadas.length > 1 && votosMaximos > 0) {
        console.log('Atenção: Há empate entre chapas com', votosMaximos, 'votos')
        // Aqui você pode adicionar lógica adicional para casos de empate
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
              position: 'bottom',
              labels: {
                padding: 15,
                font: {
                  size: 12
                }
              }
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
/* Correção crítica para o scroll funcionar corretamente */
.v-main.main-content {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  height: 100vh;
  -webkit-overflow-scrolling: touch; /* Suaviza o scroll no iOS */
}

/* Garantir que o container não force altura mínima */
.v-main.main-content .v-container {
  min-height: auto;
}

.v-card {
  border-radius: 12px;
}

/* Card do Vencedor */
.winner-card {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4) !important;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.6);
  }
}

.winner-info {
  padding: 16px 0;
}

.winner-chip {
  font-size: 1.2rem !important;
  padding: 8px 16px !important;
  height: auto !important;
}

.winner-stats {
  margin-top: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.3;
}

/* Títulos específicos em cards */
.v-card h3 {
  min-height: 1.5em;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* Container do gráfico */
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

/* Melhorias para a lista de estatísticas */
.stats-card .v-list {
  background: transparent !important;
}

.stats-list .v-list-item {
  padding: 8px 0;
  min-height: 48px;
}

/* Melhorias para versão mobile */
.mobile-results {
  max-width: 100%;
}

.mobile-results .v-card {
  border-radius: 12px;
}

/* Responsividade Mobile */
@media (max-width: 960px) {
  .chart-container {
    height: 300px;
  }
  
  .winner-card {
    margin-bottom: 16px;
  }
  
  .winner-chip {
    font-size: 1rem !important;
  }
  
  .stat-item {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .chart-container {
    height: 250px;
  }
  
  .winner-stats {
    flex-direction: column;
    width: 100%;
  }
  
  .stat-item {
    width: 100%;
    justify-content: center;
  }
  
  /* Melhor espaçamento no mobile */
  .v-container {
    padding: 12px !important;
  }
  
  .v-card {
    margin-bottom: 12px;
  }
  
  /* Melhorar legibilidade de textos pequenos */
  .text-body-2 {
    font-size: 0.875rem !important;
  }
}

/* Garantir que progress bars sejam visíveis no mobile */
.v-progress-linear {
  border-radius: 12px;
  overflow: hidden;
}

/* Melhorar aparência dos chips */
.v-chip {
  font-weight: 600;
}

/* Hover effects para desktop */
@media (min-width: 960px) {
  .v-card:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease-in-out;
  }
  
  .mobile-results .v-card:hover {
    transform: scale(1.02);
    transition: all 0.2s ease-in-out;
  }
}

/* Garantir que os ícones estejam alinhados */
.v-list-item__prepend {
  margin-right: 12px;
}

/* Dividers mais sutis */
.v-divider {
  opacity: 0.5;
}
</style>

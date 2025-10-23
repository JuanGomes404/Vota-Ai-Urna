<template>
  <v-container fluid class="votacao-container pa-4">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="11" md="10" lg="9" xl="8">
        <v-card elevation="12" class="pa-4 pa-sm-6 pa-md-8">
          <!-- Cronômetro -->
          <v-alert
            :type="tempoRestante <= 60 ? 'error' : tempoRestante <= 120 ? 'warning' : 'info'"
            :prominent="tempoRestante <= 60"
            class="mb-4 mb-md-6 text-center"
          >
            <div class="d-flex align-center justify-center">
              <v-icon size="large" class="mr-2">mdi-clock-outline</v-icon>
              <div>
                <div class="text-h6 text-sm-h5 font-weight-bold">
                  {{ formatarTempo(tempoRestante) }}
                </div>
                <div class="text-caption text-sm-body-2">
                  Tempo restante para confirmar seu voto
                </div>
              </div>
            </div>
          </v-alert>

          <v-card-title class="text-center mb-4 mb-md-6 px-0">
            <h1 class="text-h6 text-sm-h5 text-md-h4 font-weight-bold" style="color: #005A9C;">
              {{ eleicao?.nome || 'ELEIÇÃO' }}
            </h1>
            <p class="text-body-2 text-sm-body-1 text-md-h6 mt-2" style="color: #666;">
              Selecione sua opção de voto:
            </p>
          </v-card-title>

          <v-row v-if="chapas.length > 0" class="mb-4 mb-md-6">
            <v-col
              v-for="chapa in chapas"
              :key="chapa.id"
              cols="12"
              sm="6"
              lg="4"
              class="mb-3 mb-sm-4"
            >
              <v-card
                elevation="4"
                class="chapa-card pa-3 pa-sm-4 text-center h-100 d-flex flex-column"
                :class="{ 'selected': votoSelecionado === chapa.id }"
                hover
                @click="selecionarVoto(chapa.id, 'valido')"
              >
                <v-chip
                  color="primary"
                  size="large"
                  class="mb-2 mb-sm-3 numero-chip"
                >
                  {{ chapa.numero }}
                </v-chip>
                <v-icon size="48" size-sm="64" color="primary" class="mb-2 mb-sm-3">
                  mdi-account-group
                </v-icon>
                <h3 class="text-subtitle-1 text-sm-h6 font-weight-bold mb-2 flex-grow-1">
                  {{ chapa.nome }}
                </h3>
                <v-chip
                  v-if="votoSelecionado === chapa.id"
                  color="success"
                  size="small"
                  class="mt-2"
                >
                  <v-icon size="small" class="mr-1">mdi-check</v-icon>
                  Selecionado
                </v-chip>
              </v-card>
            </v-col>
          </v-row>

          <!-- Opções de voto em branco e nulo -->
          <v-row class="mb-4 mb-md-6">
            <v-col cols="12" sm="6" class="mb-3 mb-sm-4">
              <v-card
                elevation="4"
                class="voto-card pa-3 pa-sm-4 text-center h-100"
                :class="{ 'selected': tipoVoto === 'branco' }"
                hover
                @click="selecionarVoto(null, 'branco')"
              >
                <v-icon size="48" size-sm="64" color="grey" class="mb-2 mb-sm-3">
                  mdi-checkbox-blank-outline
                </v-icon>
                <h3 class="text-subtitle-1 text-sm-h6 font-weight-bold mb-2">
                  VOTO EM BRANCO
                </h3>
                <v-chip
                  v-if="tipoVoto === 'branco'"
                  color="success"
                  size="small"
                  class="mt-2"
                >
                  <v-icon size="small" class="mr-1">mdi-check</v-icon>
                  Selecionado
                </v-chip>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" class="mb-3 mb-sm-4">
              <v-card
                elevation="4"
                class="voto-card pa-3 pa-sm-4 text-center h-100"
                :class="{ 'selected': tipoVoto === 'nulo' }"
                hover
                @click="selecionarVoto(null, 'nulo')"
              >
                <v-icon size="48" size-sm="64" color="error" class="mb-2 mb-sm-3">
                  mdi-close-circle-outline
                </v-icon>
                <h3 class="text-subtitle-1 text-sm-h6 font-weight-bold mb-2">
                  VOTO NULO
                </h3>
                <v-chip
                  v-if="tipoVoto === 'nulo'"
                  color="success"
                  size="small"
                  class="mt-2"
                >
                  <v-icon size="small" class="mr-1">mdi-check</v-icon>
                  Selecionado
                </v-chip>
              </v-card>
            </v-col>
          </v-row>

          <v-alert
            v-if="error"
            type="error"
            class="mb-4"
            closable
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>

          <div class="text-center mb-4">
            <v-btn
              v-if="votoSelecionado || tipoVoto"
              color="success"
              size="large"
              @click="abrirConfirmacao"
              class="px-6 px-sm-8"
              block
            >
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              REVISAR E CONFIRMAR
            </v-btn>
            <p v-else class="text-body-1 text-sm-h6" style="color: #666;">
              Selecione uma opção para continuar
            </p>
          </div>

          <v-divider class="my-4 my-md-6" />

          <div class="text-center">
            <v-btn
              variant="text"
              color="secondary"
              @click="$router.push('/')"
              block
            >
              <v-icon class="mr-2">mdi-home</v-icon>
              Voltar ao Início
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de Confirmação -->
    <v-dialog v-model="dialogConfirmacao" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h5 text-center py-4 bg-primary">
          <v-icon left size="large" color="white">mdi-check-circle</v-icon>
          <span class="text-white">Confirmação de Voto</span>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-alert type="warning" class="mb-4">
            <strong>ATENÇÃO:</strong> Após confirmar, seu voto não poderá ser alterado!
          </v-alert>

          <div class="text-center py-4">
            <p class="text-h6 mb-4">Você selecionou:</p>
            
            <!-- Mostrar chapa selecionada -->
            <v-card v-if="tipoVoto === 'valido'" elevation="2" class="pa-4 mb-4">
              <v-chip color="primary" size="x-large" class="mb-2">
                {{ chapaEscolhida?.numero }}
              </v-chip>
              <h3 class="text-h5 font-weight-bold">
                {{ chapaEscolhida?.nome }}
              </h3>
            </v-card>
            
            <!-- Mostrar voto em branco -->
            <v-card v-else-if="tipoVoto === 'branco'" elevation="2" class="pa-4 mb-4">
              <v-icon size="80" color="grey" class="mb-2">
                mdi-checkbox-blank-outline
              </v-icon>
              <h3 class="text-h5 font-weight-bold">
                VOTO EM BRANCO
              </h3>
            </v-card>
            
            <!-- Mostrar voto nulo -->
            <v-card v-else-if="tipoVoto === 'nulo'" elevation="2" class="pa-4 mb-4">
              <v-icon size="80" color="error" class="mb-2">
                mdi-close-circle-outline
              </v-icon>
              <h3 class="text-h5 font-weight-bold">
                VOTO NULO
              </h3>
            </v-card>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-btn
            variant="outlined"
            color="grey"
            size="large"
            @click="fecharConfirmacao"
            :disabled="loading"
          >
            <v-icon left>mdi-arrow-left</v-icon>
            Voltar
          </v-btn>
          <v-spacer />
          <v-btn
            color="success"
            size="large"
            @click="confirmarVoto"
            :loading="loading"
          >
            <v-icon left>mdi-check</v-icon>
            CONFIRMAR VOTO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { urnaService } from '@/services/urnaService'

export default {
  name: 'SelecaoVoto',
  data() {
    return {
      chapas: [],
      eleicao: null,
      votoSelecionado: null,
      tipoVoto: null,
      dialogConfirmacao: false,
      loading: false,
      error: null,
      // Cronômetro de 5 minutos (300 segundos)
      tempoRestante: 300,
      intervaloCronometro: null
    }
  },
  computed: {
    chapaEscolhida() {
      if (!this.votoSelecionado) return null
      return this.chapas.find(c => c.id === this.votoSelecionado)
    }
  },
  async mounted() {
    await this.carregarDados()
    this.iniciarCronometro()
  },
  beforeUnmount() {
    this.pararCronometro()
  },
  methods: {
    iniciarCronometro() {
      this.intervaloCronometro = setInterval(() => {
        this.tempoRestante--
        
        if (this.tempoRestante <= 0) {
          this.tempoEsgotado()
        }
      }, 1000)
    },
    pararCronometro() {
      if (this.intervaloCronometro) {
        clearInterval(this.intervaloCronometro)
        this.intervaloCronometro = null
      }
    },
    formatarTempo(segundos) {
      const minutos = Math.floor(segundos / 60)
      const segs = segundos % 60
      return `${minutos}:${segs.toString().padStart(2, '0')}`
    },
    tempoEsgotado() {
      this.pararCronometro()
      alert('Tempo esgotado! Você será redirecionado para a tela inicial.')
      // Limpar credenciais
      localStorage.removeItem('urna_credencial')
      localStorage.removeItem('urna_eleicao_id')
      this.$router.push('/urna')
    },
    async carregarDados() {
      try {
        const eleicaoId = localStorage.getItem('urna_eleicao_id')
        if (!eleicaoId) {
          this.$router.push('/urna')
          return
        }

        // Carregar dados da eleição
        const eleicaoResponse = await urnaService.buscarEleicao(eleicaoId)
        if (eleicaoResponse.eleicao) {
          this.eleicao = eleicaoResponse.eleicao
        }

        // Carregar chapas
        const chapasResponse = await urnaService.listarChapas(eleicaoId)
        this.chapas = chapasResponse
      } catch (error) {
        this.error = 'Erro ao carregar dados da eleição'
        console.error('Erro ao carregar dados:', error)
      }
    },
    selecionarVoto(chapaId, tipo) {
      this.votoSelecionado = chapaId
      this.tipoVoto = tipo
    },
    abrirConfirmacao() {
      if (!this.votoSelecionado && !this.tipoVoto) return
      this.dialogConfirmacao = true
    },
    fecharConfirmacao() {
      this.dialogConfirmacao = false
    },
    async confirmarVoto() {
      if (!this.votoSelecionado && !this.tipoVoto) return

      this.loading = true
      this.error = null

      try {
        const credencial = localStorage.getItem('urna_credencial')
        const eleicaoId = localStorage.getItem('urna_eleicao_id')
        if (!credencial || !eleicaoId) {
          this.$router.push('/urna')
          return
        }

        const votoData = {
          token: credencial,
          eleicaoId: eleicaoId,
          chapaId: this.tipoVoto === 'valido' ? this.votoSelecionado : null,
          tipo: this.tipoVoto
        }

        const response = await urnaService.confirmarVoto(votoData)
        
        if (response.message) {
          // Parar cronômetro
          this.pararCronometro()
          // Limpar credenciais e ir para tela de sucesso
          localStorage.removeItem('urna_credencial')
          localStorage.removeItem('urna_eleicao_id')
          this.$router.push('/urna/sucesso')
        }
      } catch (error) {
        this.error = error.error || 'Erro ao confirmar voto'
        this.dialogConfirmacao = false
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.votacao-container {
  background: linear-gradient(135deg, #005A9C 0%, #0277BD 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 20px;
}

.chapa-card, .voto-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chapa-card:hover, .voto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.chapa-card.selected, .voto-card.selected {
  border: 3px solid #00843D;
  background-color: rgba(0, 132, 61, 0.1);
}

.numero-chip {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 8px 16px;
  height: auto !important;
}

/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.2;
}

/* Títulos específicos em cards */
.chapa-card h3, .voto-card h3 {
  min-height: 1.5em;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* Mobile optimizations */
@media (max-width: 599px) {
  .v-card {
    border-radius: 12px;
  }
  
  .chapa-card, .voto-card {
    border-radius: 12px;
  }
  
  .numero-chip {
    font-size: 1.25rem;
    padding: 6px 12px;
  }
}

@media (min-width: 600px) {
  .numero-chip {
    font-size: 1.75rem;
    padding: 10px 20px;
  }
}
</style>

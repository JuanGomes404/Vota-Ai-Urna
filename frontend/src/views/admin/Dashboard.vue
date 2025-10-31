<template>
  <v-app>
    <v-app-bar color="primary" dark density="comfortable">
      <v-app-bar-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-cog</v-icon>
        <span class="d-none d-sm-inline">Painel do Administrador</span>
        <span class="d-inline d-sm-none">Admin</span>
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-btn
        color="white"
        variant="text"
        @click="$router.push('/')"
        size="small"
        class="mr-1 mr-sm-2"
      >
        <v-icon class="mr-1">mdi-home</v-icon>
        <span class="d-none d-sm-inline">Início</span>
      </v-btn>
      
      <v-btn
        color="white"
        variant="text"
        @click="handleLogout"
        size="small"
      >
        <v-icon class="mr-1">mdi-logout</v-icon>
        <span class="d-none d-sm-inline">Sair</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-2 pa-sm-4 pa-md-6 pa-lg-8">
        <v-row>
          <v-col cols="12">
            <h1 class="page-title text-h6 text-sm-h5 text-md-h4 font-weight-bold mb-3 mb-md-6">
              <span class="d-none d-sm-inline">PAINEL DO ADMINISTRADOR</span>
              <span class="d-inline d-sm-none">ADMIN</span>
            </h1>
          </v-col>
        </v-row>

        <!-- Cards de Estatísticas -->
        <v-row class="mb-3 mb-md-6">
          <v-col cols="12" sm="6" md="4" class="mb-2 mb-sm-0">
            <v-card elevation="4" class="stats-card pa-3 pa-sm-4 text-center h-100">
              <v-icon :size="iconSize" color="primary" class="mb-2 mb-sm-3">
                mdi-vote
              </v-icon>
              <h3 class="text-subtitle-1 text-sm-h6 mb-1 mb-sm-2">Eleições Ativas</h3>
              <p class="text-h5 text-sm-h4 font-weight-bold primary--text ma-0">
                {{ eleicaoStore.eleicoesAtivas.length }}
              </p>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="4" class="mb-2 mb-sm-0">
            <v-card elevation="4" class="stats-card pa-3 pa-sm-4 text-center h-100">
              <v-icon :size="iconSize" color="success" class="mb-2 mb-sm-3">
                mdi-check-circle
              </v-icon>
              <h3 class="text-subtitle-1 text-sm-h6 mb-1 mb-sm-2">Eleições Encerradas</h3>
              <p class="text-h5 text-sm-h4 font-weight-bold success--text ma-0">
                {{ eleicaoStore.eleicoesEncerradas.length }}
              </p>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="12" md="4">
            <v-card elevation="4" class="stats-card pa-3 pa-sm-4 text-center h-100">
              <v-icon :size="iconSize" color="warning" class="mb-2 mb-sm-3">
                mdi-file-document-outline
              </v-icon>
              <h3 class="text-subtitle-1 text-sm-h6 mb-1 mb-sm-2">Rascunhos</h3>
              <p class="text-h5 text-sm-h4 font-weight-bold warning--text ma-0">
                {{ eleicaoStore.eleicoesCriadas.length }}
              </p>
            </v-card>
          </v-col>
        </v-row>

        <!-- Botão Criar Eleição -->
        <v-row class="mb-3 mb-md-6">
          <v-col cols="12">
            <v-btn
              color="primary"
              size="large"
              @click="criarEleicao"
              :loading="loading"
              block
              class="text-none"
              elevation="2"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              <span class="d-none d-sm-inline">CRIAR NOVA ELEIÇÃO</span>
              <span class="d-inline d-sm-none">CRIAR ELEIÇÃO</span>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Eleições Ativas -->
        <v-row v-if="eleicaoStore.eleicoesAtivas.length > 0" class="mb-4 mb-md-6">
          <v-col cols="12">
            <h2 class="section-title text-h6 text-sm-h5 font-weight-bold mb-3 mb-md-4">Eleições Ativas</h2>
            <v-card
              v-for="eleicao in eleicaoStore.eleicoesAtivas"
              :key="eleicao.id"
              elevation="2"
              class="election-card mb-3 pa-3 pa-sm-4"
            >
              <v-row align="center">
                <v-col cols="12" md="7" class="mb-2 mb-md-0">
                  <h3 class="text-subtitle-1 text-sm-h6 font-weight-bold mb-1">{{ eleicao.nome }}</h3>
                  <p class="text-caption text-sm-body-2 text-medium-emphasis mb-2">{{ eleicao.descricao }}</p>
                  <v-chip color="success" size="small" class="text-uppercase">
                    {{ eleicao.status }}
                  </v-chip>
                </v-col>
                <v-col cols="12" md="5">
                  <div class="d-flex flex-column flex-sm-row gap-2 justify-end">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      size="small"
                      @click="gerenciarEleicao(eleicao)"
                      block
                      class="d-sm-none text-none"
                    >
                      <v-icon size="small" class="mr-1">mdi-cog</v-icon>
                      Gerenciar
                    </v-btn>
                    <v-btn
                      color="primary"
                      variant="outlined"
                      size="small"
                      @click="gerenciarEleicao(eleicao)"
                      class="d-none d-sm-inline-flex text-none"
                    >
                      <v-icon size="small" class="mr-1">mdi-cog</v-icon>
                      Gerenciar
                    </v-btn>
                    <v-btn
                      color="error"
                      variant="outlined"
                      size="small"
                      @click="encerrarEleicao(eleicao.id)"
                      block
                      class="d-sm-none text-none"
                    >
                      <v-icon size="small" class="mr-1">mdi-stop</v-icon>
                      Encerrar
                    </v-btn>
                    <v-btn
                      color="error"
                      variant="outlined"
                      size="small"
                      @click="encerrarEleicao(eleicao.id)"
                      class="d-none d-sm-inline-flex text-none"
                    >
                      <v-icon size="small" class="mr-1">mdi-stop</v-icon>
                      Encerrar
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Eleições Encerradas/Futuras -->
        <v-row>
          <v-col cols="12">
            <h2 class="section-title text-h6 text-sm-h5 font-weight-bold mb-3 mb-md-4">Outras Eleições</h2>
            <v-card
              v-for="eleicao in [...eleicaoStore.eleicoesEncerradas, ...eleicaoStore.eleicoesCriadas]"
              :key="eleicao.id"
              elevation="2"
              class="election-card mb-3 pa-3 pa-sm-4"
            >
              <v-row align="center">
                <v-col cols="12" md="7" class="mb-2 mb-md-0">
                  <h3 class="text-subtitle-1 text-sm-h6 font-weight-bold mb-1">{{ eleicao.nome }}</h3>
                  <p class="text-caption text-sm-body-2 text-medium-emphasis mb-2">{{ eleicao.descricao }}</p>
                  <v-chip
                    :color="eleicao.status === 'Encerrada' ? 'success' : 'warning'"
                    size="small"
                    class="text-uppercase"
                  >
                    {{ eleicao.status }}
                  </v-chip>
                </v-col>
                <v-col cols="12" md="5">
                  <div class="d-flex flex-column flex-sm-row gap-2 justify-end">
                    <!-- Eleições Encerradas: Ver Resultados -->
                    <v-btn
                      v-if="eleicao.status === 'Encerrada'"
                      color="info"
                      variant="outlined"
                      size="small"
                      @click="verResultados(eleicao.id)"
                      block
                      class="text-none"
                    >
                      <v-icon size="small" class="mr-1">mdi-chart-line</v-icon>
                      Resultados
                    </v-btn>
                    
                    <!-- Eleições Criadas (Rascunho): Gerenciar E Iniciar -->
                    <template v-if="eleicao.status === 'Criada'">
                      <v-btn
                        color="primary"
                        variant="outlined"
                        size="small"
                        @click="gerenciarEleicao(eleicao)"
                        block
                        class="text-none"
                      >
                        <v-icon size="small" class="mr-1">mdi-cog</v-icon>
                        Gerenciar
                      </v-btn>
                      <v-btn
                        color="success"
                        variant="outlined"
                        size="small"
                        @click="iniciarEleicao(eleicao.id)"
                        block
                        class="text-none"
                      >
                        <v-icon size="small" class="mr-1">mdi-play-circle</v-icon>
                        Iniciar
                      </v-btn>
                    </template>
                    
                    <!-- Eleições Ativas: Apenas Gerenciar -->
                    <v-btn
                      v-if="eleicao.status === 'Ativa'"
                      color="primary"
                      variant="outlined"
                      size="small"
                      @click="gerenciarEleicao(eleicao)"
                      block
                      class="text-none"
                    >
                      <v-icon size="small" class="mr-1">mdi-cog</v-icon>
                      Gerenciar
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog para criar eleição -->
        <v-dialog v-model="dialogCriarEleicao" max-width="600" persistent>
          <v-card rounded="lg">
            <v-card-title class="text-h5 font-weight-bold pa-6 bg-primary">
              <v-icon color="white" class="mr-2">mdi-plus-circle</v-icon>
              <span class="text-white">Criar Nova Eleição</span>
            </v-card-title>
            
            <v-card-text class="pa-6">
              <v-form ref="formEleicao" @submit.prevent="salvarEleicao">
                <v-text-field
                  v-model="novaEleicao.nome"
                  label="Nome da Eleição"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-text"
                  class="mb-4"
                />
                
                <v-textarea
                  v-model="novaEleicao.descricao"
                  label="Descrição"
                  rows="3"
                  variant="outlined"
                  prepend-inner-icon="mdi-text-box"
                  class="mb-4"
                />
              </v-form>
            </v-card-text>
            
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn
                variant="outlined"
                color="grey"
                size="large"
                @click="dialogCriarEleicao = false"
                :disabled="loading"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                size="large"
                variant="elevated"
                @click="salvarEleicao"
                :loading="loading"
              >
                <v-icon left>mdi-check</v-icon>
                Criar Eleição
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog de Confirmação Genérico -->
        <v-dialog v-model="dialogConfirmacao" max-width="500" persistent>
          <v-card rounded="lg">
            <v-card-title class="text-h5 font-weight-bold pa-6 bg-warning">
              <div class="d-flex align-center justify-center w-100">
                <v-icon color="white" class="mr-2">mdi-alert-circle</v-icon>
                <span class="text-white">Confirmação</span>
              </div>
            </v-card-title>
            <v-card-text class="pa-6 text-center">
              <p class="text-h6 mb-0">{{ mensagemConfirmacao }}</p>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn
                variant="outlined"
                color="grey"
                size="large"
                @click="cancelarConfirmacao"
                :disabled="loading"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="warning"
                size="large"
                variant="elevated"
                @click="confirmarAcao"
                :loading="loading"
              >
                <v-icon left>mdi-check</v-icon>
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useEleicaoStore } from '@/stores/eleicaoStore'
import { useDisplay } from 'vuetify'

export default {
  name: 'AdminDashboard',
  setup() {
    const authStore = useAuthStore()
    const eleicaoStore = useEleicaoStore()
    const display = useDisplay()
    return { authStore, eleicaoStore, display }
  },
  computed: {
    iconSize() {
      return this.display.xs ? 36 : this.display.sm ? 42 : 48
    }
  },
  data() {
    return {
      loading: false,
      dialogCriarEleicao: false,
      novaEleicao: {
        nome: '',
        descricao: ''
      },
      // Variáveis para confirmação
      dialogConfirmacao: false,
      mensagemConfirmacao: '',
      acaoConfirmada: null,
      rules: {
        required: value => !!value || 'Campo obrigatório'
      }
    }
  },
  async mounted() {
    console.log('🏠 Dashboard montado')
    console.log('👤 Auth Store - isAuthenticated:', this.authStore.isAuthenticated)
    console.log('👤 Auth Store - user:', this.authStore.user)
    console.log('🔑 Token no localStorage:', localStorage.getItem('auth_token') ? 'SIM' : 'NÃO')
    
    await this.carregarEleicoes()
  },
  methods: {
    async carregarEleicoes() {
      console.log('📥 Iniciando carregamento de eleições...')
      
      this.loading = true
      try {
        await this.eleicaoStore.carregarEleicoes()
        console.log('✅ Eleições carregadas com sucesso')
      } catch (error) {
        console.error('❌ Erro ao carregar eleições:', error)
      } finally {
        this.loading = false
      }
    },
    criarEleicao() {
      this.novaEleicao = { nome: '', descricao: '' }
      this.dialogCriarEleicao = true
    },
    async salvarEleicao() {
      const { valid } = await this.$refs.formEleicao.validate()
      if (!valid) return

      this.mensagemConfirmacao = 'Tem certeza que deseja criar esta eleição?'
      this.acaoConfirmada = this.executarCriacaoEleicao
      this.dialogConfirmacao = true
    },
    async executarCriacaoEleicao() {
      this.loading = true
      try {
        await this.eleicaoStore.criarEleicao(this.novaEleicao)
        this.dialogCriarEleicao = false
        this.novaEleicao = { nome: '', descricao: '' }
      } catch (error) {
        console.error('Erro ao criar eleição:', error)
      } finally {
        this.loading = false
        this.dialogConfirmacao = false
      }
    },
    gerenciarEleicao(eleicao) {
      this.$router.push(`/admin/eleicoes/${eleicao.id}`)
    },
    async encerrarEleicao(eleicaoId) {
      this.mensagemConfirmacao = 'Tem certeza que deseja encerrar esta eleição?'
      this.acaoConfirmada = () => this.executarEncerramentoEleicao(eleicaoId)
      this.dialogConfirmacao = true
    },
    async executarEncerramentoEleicao(eleicaoId) {
      this.loading = true
      try {
        await this.eleicaoStore.encerrarEleicao(eleicaoId)
      } catch (error) {
        console.error('Erro ao encerrar eleição:', error)
      } finally {
        this.loading = false
        this.dialogConfirmacao = false
      }
    },
    verResultados(eleicaoId) {
      this.$router.push(`/admin/resultados/${eleicaoId}`)
    },
    async iniciarEleicao(eleicaoId) {
      this.mensagemConfirmacao = 'Tem certeza que deseja INICIAR esta eleição? Uma vez iniciada, estará aberta para votação.'
      this.acaoConfirmada = () => this.executarInicioEleicao(eleicaoId)
      this.dialogConfirmacao = true
    },
    async executarInicioEleicao(eleicaoId) {
      this.loading = true
      try {
        await this.eleicaoStore.ativarEleicao(eleicaoId)
      } catch (error) {
        console.error('Erro ao iniciar eleição:', error)
      } finally {
        this.loading = false
        this.dialogConfirmacao = false
      }
    },
    confirmarAcao() {
      if (this.acaoConfirmada) {
        this.acaoConfirmada()
      }
    },
    cancelarConfirmacao() {
      this.dialogConfirmacao = false
      this.mensagemConfirmacao = ''
      this.acaoConfirmada = null
    },
    async handleLogout() {
      try {
        await this.authStore.logout()
        // Redirecionar com parâmetro de sucesso
        this.$router.push({ path: '/login', query: { logout: 'success' } })
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        // Mesmo com erro, redirecionar
        this.$router.push({ path: '/login', query: { logout: 'success' } })
      }
    }
  }
}
</script>

<style scoped>
/* Page Title */
.page-title {
  color: #005A9C;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
}

/* Section Titles */
.section-title {
  color: #1a1a1a;
  margin-bottom: 16px;
}

/* Stats Cards */
.stats-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
}

/* Election Cards */
.election-card {
  border-radius: 12px;
  transition: box-shadow 0.2s ease;
}

.election-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Gap utility for flex containers */
.gap-2 {
  gap: 8px;
}

/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* Mobile Optimizations */
@media (max-width: 599px) {
  .page-title {
    font-size: 1.25rem !important;
    margin-bottom: 12px;
  }
  
  .section-title {
    font-size: 1.1rem !important;
    margin-bottom: 12px;
  }
  
  .stats-card {
    border-radius: 8px;
  }
  
  .stats-card:hover {
    transform: none;
  }
  
  .stats-card:active {
    transform: scale(0.98);
  }
  
  .election-card {
    border-radius: 8px;
  }
  
  /* Botões em coluna no mobile */
  .election-card .v-btn {
    font-size: 0.875rem;
    min-height: 40px;
  }
  
  /* Chips menores */
  .v-chip {
    font-size: 0.75rem;
  }
  
  /* Textos otimizados */
  .text-caption {
    line-height: 1.4 !important;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 959px) {
  .page-title {
    font-size: 1.5rem !important;
  }
  
  .section-title {
    font-size: 1.25rem !important;
  }
  
  /* Botões em linha no tablet */
  .election-card .gap-2 {
    flex-direction: row;
  }
}

/* Desktop */
@media (min-width: 960px) {
  .election-card .gap-2 {
    gap: 12px;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>

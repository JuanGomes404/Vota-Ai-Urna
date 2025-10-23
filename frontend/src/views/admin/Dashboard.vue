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
        <v-icon :class="{ 'mr-1': $vuetify.display.smAndUp }">mdi-home</v-icon>
        <span class="d-none d-sm-inline">Início</span>
      </v-btn>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="white" variant="text" v-bind="props" size="small">
            <v-icon :class="{ 'mr-1': $vuetify.display.smAndUp }">mdi-account</v-icon>
            <span class="d-none d-sm-inline">{{ authStore.userName }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="handleLogout">
            <v-list-item-title>
              <v-icon class="mr-2">mdi-logout</v-icon>
              Sair
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4 pa-sm-6 pa-md-8">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h5 text-sm-h4 text-md-h3 font-weight-bold mb-4 mb-md-6" style="color: #005A9C;">
              PAINEL DO ADMINISTRADOR
            </h1>
          </v-col>
        </v-row>

        <v-row class="mb-4 mb-md-6">
          <v-col cols="12" sm="6" md="4">
            <v-card elevation="4" class="pa-4 text-center">
              <v-icon size="48" color="primary" class="mb-3">
                mdi-vote
              </v-icon>
              <h3 class="text-h6 mb-2">Eleições Ativas</h3>
              <p class="text-h4 font-weight-bold primary--text">
                {{ eleicaoStore.eleicoesAtivas.length }}
              </p>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="4">
            <v-card elevation="4" class="pa-4 text-center">
              <v-icon size="48" color="success" class="mb-3">
                mdi-check-circle
              </v-icon>
              <h3 class="text-h6 mb-2">Eleições Encerradas</h3>
              <p class="text-h4 font-weight-bold" style="color: #00843D;">
                {{ eleicaoStore.eleicoesEncerradas.length }}
              </p>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="4">
            <v-card elevation="4" class="pa-4 text-center">
              <v-icon size="48" color="warning" class="mb-3">
                mdi-file-document-outline
              </v-icon>
              <h3 class="text-h6 mb-2">Rascunhos</h3>
              <p class="text-h4 font-weight-bold" style="color: #FDB913;">
                {{ eleicaoStore.eleicoesCriadas.length }}
              </p>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mb-4 mb-md-6">
          <v-col cols="12">
            <v-btn
              color="primary"
              size="large"
              @click="criarEleicao"
              :loading="loading"
              block
              class="d-sm-none"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              CRIAR ELEIÇÃO
            </v-btn>
            <div class="text-right d-none d-sm-block">
              <v-btn
                color="primary"
                size="large"
                @click="criarEleicao"
                :loading="loading"
              >
                <v-icon class="mr-2">mdi-plus</v-icon>
                CRIAR ELEIÇÃO
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Eleições Ativas -->
        <v-row v-if="eleicaoStore.eleicoesAtivas.length > 0" class="mb-6">
          <v-col cols="12">
            <h2 class="text-h5 font-weight-bold mb-4">Eleições Ativas</h2>
            <v-card
              v-for="eleicao in eleicaoStore.eleicoesAtivas"
              :key="eleicao.id"
              elevation="2"
              class="mb-4 pa-4"
            >
              <v-row align="center">
                <v-col cols="12" md="6">
                  <h3 class="text-h6 font-weight-bold">{{ eleicao.nome }}</h3>
                  <p class="text-body-2 grey--text">{{ eleicao.descricao }}</p>
                  <v-chip color="success" size="small">
                    STATUS: {{ eleicao.status }}
                  </v-chip>
                </v-col>
                <v-col cols="12" md="6" class="text-right">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    class="mr-2"
                    @click="gerenciarEleicao(eleicao)"
                  >
                    <v-icon left>mdi-cog</v-icon>
                    Gerenciar
                  </v-btn>
                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="encerrarEleicao(eleicao.id)"
                  >
                    <v-icon left>mdi-stop</v-icon>
                    Encerrar
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Eleições Encerradas/Futuras -->
        <v-row>
          <v-col cols="12">
            <h2 class="text-h5 font-weight-bold mb-4">Outras Eleições</h2>
            <v-card
              v-for="eleicao in [...eleicaoStore.eleicoesEncerradas, ...eleicaoStore.eleicoesCriadas]"
              :key="eleicao.id"
              elevation="2"
              class="mb-4 pa-4"
            >
              <v-row align="center">
                <v-col cols="12" md="6">
                  <h3 class="text-h6 font-weight-bold">{{ eleicao.nome }}</h3>
                  <p class="text-body-2 grey--text">{{ eleicao.descricao }}</p>
                  <v-chip
                    :color="eleicao.status === 'Encerrada' ? 'success' : 'warning'"
                    size="small"
                  >
                    {{ eleicao.status }}
                  </v-chip>
                </v-col>
                <v-col cols="12" md="6" class="text-right">
                  <!-- Eleições Encerradas: Ver Resultados -->
                  <v-btn
                    v-if="eleicao.status === 'Encerrada'"
                    color="info"
                    variant="outlined"
                    class="mr-2"
                    @click="verResultados(eleicao.id)"
                  >
                    <v-icon left>mdi-chart-line</v-icon>
                    Resultados
                  </v-btn>
                  
                  <!-- Eleições Criadas (Rascunho): Gerenciar E Iniciar -->
                  <template v-if="eleicao.status === 'Criada'">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      class="mr-2"
                      @click="gerenciarEleicao(eleicao)"
                    >
                      <v-icon left>mdi-cog</v-icon>
                      Gerenciar
                    </v-btn>
                    <v-btn
                      color="success"
                      variant="outlined"
                      @click="iniciarEleicao(eleicao.id)"
                    >
                      <v-icon left>mdi-play-circle</v-icon>
                      Iniciar
                    </v-btn>
                  </template>
                  
                  <!-- Eleições Ativas: Apenas Gerenciar -->
                  <v-btn
                    v-if="eleicao.status === 'Ativa'"
                    color="primary"
                    variant="outlined"
                    @click="gerenciarEleicao(eleicao)"
                  >
                    <v-icon left>mdi-cog</v-icon>
                    Gerenciar
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog para criar eleição -->
        <v-dialog v-model="dialogCriarEleicao" max-width="600">
          <v-card>
            <v-card-title>
              <h3 class="text-h5">Criar Nova Eleição</h3>
            </v-card-title>
            
            <v-card-text>
              <v-form ref="formEleicao" @submit.prevent="salvarEleicao">
                <v-text-field
                  v-model="novaEleicao.nome"
                  label="Nome da Eleição"
                  :rules="[rules.required]"
                  class="mb-4"
                />
                
                <v-textarea
                  v-model="novaEleicao.descricao"
                  label="Descrição"
                  rows="3"
                  class="mb-4"
                />
              </v-form>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer />
              <v-btn
                variant="text"
                @click="dialogCriarEleicao = false"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                @click="salvarEleicao"
                :loading="loading"
              >
                Criar Eleição
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

export default {
  name: 'AdminDashboard',
  setup() {
    const authStore = useAuthStore()
    const eleicaoStore = useEleicaoStore()
    return { authStore, eleicaoStore }
  },
  data() {
    return {
      loading: false,
      dialogCriarEleicao: false,
      novaEleicao: {
        nome: '',
        descricao: ''
      },
      rules: {
        required: value => !!value || 'Campo obrigatório'
      }
    }
  },
  async mounted() {
    await this.carregarEleicoes()
  },
  methods: {
    async carregarEleicoes() {
      this.loading = true
      try {
        await this.eleicaoStore.carregarEleicoes()
      } catch (error) {
        console.error('Erro ao carregar eleições:', error)
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

      if (!confirm('Tem certeza que deseja criar esta eleição?')) {
        return
      }

      this.loading = true
      try {
        await this.eleicaoStore.criarEleicao(this.novaEleicao)
        this.dialogCriarEleicao = false
        this.novaEleicao = { nome: '', descricao: '' }
      } catch (error) {
        console.error('Erro ao criar eleição:', error)
      } finally {
        this.loading = false
      }
    },
    gerenciarEleicao(eleicao) {
      this.$router.push(`/admin/eleicoes/${eleicao.id}`)
    },
    async encerrarEleicao(eleicaoId) {
      if (confirm('Tem certeza que deseja encerrar esta eleição?')) {
        this.loading = true
        try {
          await this.eleicaoStore.encerrarEleicao(eleicaoId)
        } catch (error) {
          console.error('Erro ao encerrar eleição:', error)
        } finally {
          this.loading = false
        }
      }
    },
    verResultados(eleicaoId) {
      this.$router.push(`/admin/resultados/${eleicaoId}`)
    },
    async iniciarEleicao(eleicaoId) {
      if (confirm('Tem certeza que deseja INICIAR esta eleição? Uma vez iniciada, estará aberta para votação.')) {
        this.loading = true
        try {
          await this.eleicaoStore.ativarEleicao(eleicaoId)
        } catch (error) {
          console.error('Erro ao iniciar eleição:', error)
        } finally {
          this.loading = false
        }
      }
    },
    async handleLogout() {
      await this.authStore.logout()
      this.$router.push('/')
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

/* Descrições em cards */
.v-card .text-body-2 {
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}
</style>

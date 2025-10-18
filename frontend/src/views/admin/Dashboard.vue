<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>
        <v-icon left>mdi-cog</v-icon>
        Painel do Administrador
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="white" variant="text" v-bind="props">
            <v-icon left>mdi-account</v-icon>
            {{ authStore.userName }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="handleLogout">
            <v-list-item-title>
              <v-icon left>mdi-logout</v-icon>
              Sair
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-8">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 font-weight-bold mb-6">
              PAINEL DO ADMINISTRADOR
            </h1>
          </v-col>
        </v-row>

        <v-row class="mb-6">
          <v-col cols="12" md="4">
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
          
          <v-col cols="12" md="4">
            <v-card elevation="4" class="pa-4 text-center">
              <v-icon size="48" color="success" class="mb-3">
                mdi-check-circle
              </v-icon>
              <h3 class="text-h6 mb-2">Eleições Encerradas</h3>
              <p class="text-h4 font-weight-bold success--text">
                {{ eleicaoStore.eleicoesEncerradas.length }}
              </p>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card elevation="4" class="pa-4 text-center">
              <v-icon size="48" color="warning" class="mb-3">
                mdi-file-document-outline
              </v-icon>
              <h3 class="text-h6 mb-2">Rascunhos</h3>
              <p class="text-h4 font-weight-bold warning--text">
                {{ eleicaoStore.eleicoesCriadas.length }}
              </p>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mb-6">
          <v-col cols="12" class="text-right">
            <v-btn
              color="primary"
              size="large"
              @click="criarEleicao"
              :loading="loading"
            >
              <v-icon left>mdi-plus</v-icon>
              CRIAR ELEIÇÃO
            </v-btn>
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
                  <v-btn
                    v-else
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
</style>

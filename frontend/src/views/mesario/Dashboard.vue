<template>
  <v-app>
    <v-app-bar color="primary" dark density="comfortable">
      <v-app-bar-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-account-tie</v-icon>
        <span class="d-none d-sm-inline">Painel do Mesário</span>
        <span class="d-inline d-sm-none">Mesário</span>
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
              PAINEL DO MESÁRIO
            </h1>
          </v-col>
        </v-row>

        <!-- Seleção de Eleição -->
        <v-row justify="center" v-if="!eleicaoSelecionada">
          <v-col cols="12" sm="11" md="10" lg="8" xl="6">
            <v-card elevation="8" class="pa-4 pa-sm-6 pa-md-8">
              <v-card-title class="text-center mb-4 mb-md-6 px-0">
                <h2 class="text-subtitle-1 text-sm-h6 text-md-h5 font-weight-bold">
                  Selecione a Eleição Ativa
                </h2>
              </v-card-title>

              <v-alert v-if="eleicoes.length === 0" type="info" class="mb-4">
                Não há eleições ativas no momento.
              </v-alert>

              <v-list v-else>
                <v-list-item
                  v-for="eleicao in eleicoes"
                  :key="eleicao.id"
                  @click="selecionarEleicao(eleicao)"
                  class="mb-2"
                  border
                  rounded
                >
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-vote</v-icon>
                  </template>
                  <v-list-item-title class="text-h6">{{ eleicao.nome }}</v-list-item-title>
                  <v-list-item-subtitle v-if="eleicao.descricao">{{ eleicao.descricao }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <div class="d-flex align-center gap-2">
                      <v-chip color="success" size="small">{{ eleicao.status }}</v-chip>
                      <v-btn
                        icon="mdi-information-outline"
                        size="small"
                        variant="text"
                        @click.stop="abrirAuditoriaEleicao(eleicao)"
                        title="Informações de Auditoria"
                      />
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <!-- Busca de Eleitor -->
        <v-row justify="center" v-if="eleicaoSelecionada">
          <v-col cols="12" sm="11" md="10" lg="9" xl="8">
            <v-card elevation="8" class="pa-4 pa-sm-6 pa-md-8">
              <div class="position-relative">
                <v-btn
                  icon
                  size="small"
                  @click="voltarSelecaoEleicao"
                  class="back-button-mesario"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-card-title class="text-center mb-3 mb-md-4 px-0">
                  <h2 class="text-subtitle-1 text-sm-h6 text-md-h5 font-weight-bold">
                    {{ eleicaoSelecionada.nome }}
                  </h2>
                </v-card-title>
              </div>

              <v-card-subtitle class="text-center mb-4 mb-md-6 px-0">
                Digite a Matrícula ou Selecione o Eleitor da Lista:
              </v-card-subtitle>

              <v-form @submit.prevent="buscarEleitor" ref="formEleitor">
                <v-text-field
                  v-model="matricula"
                  label="Matrícula"
                  prepend-inner-icon="mdi-card-account-details"
                  variant="outlined"
                  :rules="[rules.required, rules.matricula]"
                  class="mb-4 mb-md-6"
                  autofocus
                  density="comfortable"
                  persistent-placeholder
                />

                <v-alert
                  v-if="error"
                  type="error"
                  class="mb-4"
                  closable
                  @click:close="error = null"
                >
                  {{ error }}
                </v-alert>

                <div class="text-center mb-4 mb-md-6">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    :loading="loading"
                    class="px-6 px-sm-8"
                    block
                  >
                    <v-icon class="mr-2">mdi-magnify</v-icon>
                    BUSCAR ELEITOR
                  </v-btn>
                </div>
              </v-form>

              <!-- Lista de Eleitores -->
              <v-divider class="my-4 my-md-6"></v-divider>
              
              <v-card-subtitle class="text-center mb-3 mb-md-4 px-0">
                <h3 class="text-subtitle-1 text-sm-h6 font-weight-bold">Lista de Eleitores</h3>
              </v-card-subtitle>

              <v-text-field
                v-model="searchEleitores"
                label="Buscar na lista"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                clearable
                persistent-placeholder
              />

              <v-alert v-if="loadingEleitores" type="info" class="mb-4">
                Carregando lista de eleitores...
              </v-alert>

              <v-list v-if="!loadingEleitores && eleitoresFiltrados.length > 0" class="pa-0" max-height="400" style="overflow-y: auto;">
                <v-list-item
                  v-for="eleitor in eleitoresFiltrados"
                  :key="eleitor.id"
                  @click="selecionarEleitorDaLista(eleitor)"
                  class="mb-2"
                  border
                  rounded
                  :class="{ 'bg-grey-lighten-3': eleitor.jaVotou }"
                >
                  <template v-slot:prepend>
                    <v-icon :color="eleitor.jaVotou ? 'grey' : 'success'">
                      {{ eleitor.jaVotou ? 'mdi-check-circle' : 'mdi-account-circle' }}
                    </v-icon>
                  </template>
                  <v-list-item-title>{{ eleitor.nome }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Matrícula: {{ eleitor.matricula }} | Curso: {{ eleitor.curso }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-chip 
                      :color="eleitor.jaVotou ? 'grey' : 'success'" 
                      size="small"
                      variant="flat"
                    >
                      {{ eleitor.jaVotou ? 'JÁ VOTOU' : 'APTO' }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>

              <v-alert v-if="!loadingEleitores && eleitoresFiltrados.length === 0" type="info" class="mb-4">
                Nenhum eleitor encontrado.
              </v-alert>
            </v-card>
          </v-col>
        </v-row>

        <!-- Resultado da busca -->
        <v-row v-if="eleitor" justify="center" class="mt-4 mt-md-6">
          <v-col cols="12" sm="11" md="10" lg="8" xl="6">
            <v-card elevation="8" class="pa-4 pa-sm-6">
              <v-card-title class="text-center mb-3 mb-md-4 px-0">
                <h3 class="text-subtitle-1 text-sm-h6 text-md-h5 font-weight-bold">Dados do Eleitor</h3>
              </v-card-title>

              <v-card-text class="px-0">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :model-value="eleitor.nome"
                      label="Nome"
                      readonly
                      variant="outlined"
                      class="mb-3 mb-md-4"
                      density="comfortable"
                      persistent-placeholder
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-text-field
                      :model-value="eleitor.matricula"
                      label="Matrícula"
                      readonly
                      variant="outlined"
                      class="mb-3 mb-md-4"
                      density="comfortable"
                      persistent-placeholder
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-text-field
                      :model-value="eleitor.curso"
                      label="Curso"
                      readonly
                      variant="outlined"
                      class="mb-3 mb-md-4"
                      density="comfortable"
                      persistent-placeholder
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-chip
                      :color="eleitor.jaVotou ? 'error' : 'success'"
                      size="large"
                      class="mb-4"
                    >
                      <v-icon left>
                        {{ eleitor.jaVotou ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
                      </v-icon>
                      STATUS: {{ eleitor.jaVotou ? 'JÁ VOTOU' : 'APTO A VOTAR' }}
                    </v-chip>
                  </v-col>
                </v-row>

                <div v-if="!eleitor.jaVotou" class="text-center mt-4 mt-md-6">
                  <v-btn
                    color="success"
                    size="large"
                    :loading="loadingHabilitar"
                    @click="habilitarEleitor"
                    class="px-6 px-sm-8"
                    block
                  >
                    <v-icon class="mr-2">mdi-check-circle</v-icon>
                    AUTORIZAR VOTO
                  </v-btn>
                </div>

                <div v-else class="text-center mt-6">
                  <v-alert type="warning" class="mb-4">
                    Este eleitor já votou e não pode votar novamente.
                  </v-alert>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog para mostrar credencial -->
        <v-dialog v-model="dialogCredencial" max-width="500" persistent>
          <v-card rounded="lg">
            <v-card-title class="text-h5 font-weight-bold text-center pa-6 bg-success">
              <div class="d-flex align-center justify-center w-100">
                <v-icon color="white" size="large" class="mr-2">mdi-check-circle</v-icon>
                <span class="text-white">Credencial Gerada</span>
              </div>
            </v-card-title>
            
            <v-card-text class="text-center pa-6">
              <v-icon size="80" color="success" class="mb-4">
                mdi-key
              </v-icon>
              <p class="text-h5 font-weight-bold mb-4 pa-4 bg-grey-lighten-4 rounded">
                {{ credencialGerada }}
              </p>
              <v-alert type="warning" variant="tonal" class="mb-4">
                <v-icon left>mdi-clock-alert</v-icon>
                <strong>Validade: 5 minutos</strong>
              </v-alert>
              <p class="text-body-1 mb-2">
                Forneça esta credencial ao eleitor para que ele possa votar.
              </p>
              <p class="text-body-2 text-grey">
                Expira em: <strong>{{ expiracaoCredencial }}</strong>
              </p>
            </v-card-text>
            
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn
                color="success"
                size="large"
                variant="elevated"
                @click="fecharDialogCredencial"
              >
                <v-icon left>mdi-check</v-icon>
                Entendido
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
                :disabled="loadingHabilitar"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="warning"
                size="large"
                variant="elevated"
                @click="confirmarAcao"
                :loading="loadingHabilitar"
              >
                <v-icon left>mdi-check</v-icon>
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog de Auditoria da Eleição (RNF05) -->
        <v-dialog v-model="dialogAuditoria" max-width="600" scrollable>
          <v-card rounded="lg">
            <v-card-title class="text-h5 font-weight-bold pa-6 bg-primary">
              <div class="d-flex align-center justify-center w-100">
                <v-icon color="white" class="mr-2">mdi-file-document-outline</v-icon>
                <span class="text-white">Informações de Auditoria</span>
              </div>
            </v-card-title>
            
            <v-card-text class="pa-6" v-if="eleicaoAuditoria">
              <v-alert type="info" variant="tonal" class="mb-4">
                <v-icon left>mdi-shield-check</v-icon>
                Dados para verificação e auditoria do processo eleitoral
              </v-alert>

              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-vote</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">Nome da Eleição</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 mt-1">
                    {{ eleicaoAuditoria.nome }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider class="my-3"></v-divider>

                <v-list-item v-if="eleicaoAuditoria.descricao">
                  <template v-slot:prepend>
                    <v-icon color="grey-darken-1">mdi-text</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">Descrição</v-list-item-title>
                  <v-list-item-subtitle class="mt-1">
                    {{ eleicaoAuditoria.descricao }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider class="my-3"></v-divider>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">Status Atual</v-list-item-title>
                  <v-list-item-subtitle class="mt-1">
                    <v-chip color="success" size="small">{{ eleicaoAuditoria.status }}</v-chip>
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider class="my-3"></v-divider>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="blue">mdi-calendar-plus</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">Data de Criação</v-list-item-title>
                  <v-list-item-subtitle class="mt-1">
                    {{ formatarDataHora(eleicaoAuditoria.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider class="my-3"></v-divider>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="orange">mdi-calendar-edit</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">Última Atualização</v-list-item-title>
                  <v-list-item-subtitle class="mt-1">
                    {{ formatarDataHora(eleicaoAuditoria.updatedAt) }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider class="my-3"></v-divider>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="grey-darken-1">mdi-identifier</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">ID da Eleição</v-list-item-title>
                  <v-list-item-subtitle class="mt-1 text-caption font-monospace">
                    {{ eleicaoAuditoria.id }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-alert type="warning" variant="tonal" class="mt-4">
                <div class="text-caption">
                  <v-icon size="small" left>mdi-information</v-icon>
                  Estas informações são registradas automaticamente pelo sistema para fins de auditoria e rastreabilidade do processo eleitoral.
                </div>
              </v-alert>
            </v-card-text>
            
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn
                color="primary"
                size="large"
                variant="elevated"
                @click="dialogAuditoria = false"
              >
                <v-icon left>mdi-close</v-icon>
                Fechar
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
import { mesarioService } from '@/services/mesarioService'

export default {
  name: 'MesarioDashboard',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      eleicoes: [],
      eleicaoSelecionada: null,
      matricula: '',
      eleitor: null,
      eleitores: [],
      searchEleitores: '',
      loading: false,
      loadingHabilitar: false,
      loadingEleitores: false,
      error: null,
      dialogCredencial: false,
      credencialGerada: '',
      expiracaoCredencial: '',
      // Variáveis para auditoria (RNF05)
      dialogAuditoria: false,
      eleicaoAuditoria: null,
      // Variáveis para confirmação
      dialogConfirmacao: false,
      mensagemConfirmacao: '',
      acaoConfirmada: null,
      rules: {
        required: value => !!value || 'Campo obrigatório',
        matricula: value => {
          if (!value) return true
          return value.length >= 8 || 'Matrícula deve ter pelo menos 8 caracteres'
        }
      }
    }
  },
  computed: {
    eleitoresFiltrados() {
      if (!this.searchEleitores) {
        return this.eleitores
      }
      const search = this.searchEleitores.toLowerCase()
      return this.eleitores.filter(eleitor => 
        eleitor.nome.toLowerCase().includes(search) ||
        eleitor.matricula.toLowerCase().includes(search) ||
        eleitor.curso.toLowerCase().includes(search)
      )
    }
  },
  mounted() {
    this.carregarEleicoes()
  },
  methods: {
    async carregarEleicoes() {
      try {
        const response = await mesarioService.listarEleicoesAtivas()
        this.eleicoes = response.eleicoes || []
      } catch (error) {
        console.error('Erro ao carregar eleições:', error)
        this.error = 'Erro ao carregar eleições ativas'
      }
    },
    async selecionarEleicao(eleicao) {
      this.eleicaoSelecionada = eleicao
      this.matricula = ''
      this.eleitor = null
      this.error = null
      this.eleitores = []
      this.searchEleitores = ''
      await this.carregarEleitores()
    },
    voltarSelecaoEleicao() {
      this.eleicaoSelecionada = null
      this.matricula = ''
      this.eleitor = null
      this.eleitores = []
      this.searchEleitores = ''
      this.error = null
    },
    async carregarEleitores() {
      if (!this.eleicaoSelecionada) return
      
      this.loadingEleitores = true
      try {
        const response = await mesarioService.listarEleitoresAptos(this.eleicaoSelecionada.id)
        this.eleitores = response.eleitores || []
      } catch (error) {
        console.error('Erro ao carregar eleitores:', error)
        this.error = 'Erro ao carregar lista de eleitores'
      } finally {
        this.loadingEleitores = false
      }
    },
    selecionarEleitorDaLista(eleitor) {
      this.matricula = eleitor.matricula
      this.eleitor = eleitor
      this.error = null
      // Scroll para a seção de dados do eleitor
      this.$nextTick(() => {
        const eleitorCard = document.querySelector('.v-row:has(.v-card)')
        if (eleitorCard) {
          eleitorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      })
    },
    async buscarEleitor() {
      const { valid } = await this.$refs.formEleitor.validate()
      if (!valid) return

      this.loading = true
      this.error = null
      this.eleitor = null

      try {
        const response = await mesarioService.buscarEleitor(this.matricula, this.eleicaoSelecionada.id)
        this.eleitor = response.eleitor
      } catch (error) {
        this.error = error.error || 'Eleitor não encontrado'
      } finally {
        this.loading = false
      }
    },
    async habilitarEleitor() {
      if (!this.eleitor) return

      this.mensagemConfirmacao = 'Tem certeza que deseja autorizar este eleitor para votar?'
      this.acaoConfirmada = this.executarHabilitacaoEleitor
      this.dialogConfirmacao = true
    },
    async executarHabilitacaoEleitor() {
      this.loadingHabilitar = true
      this.error = null
      this.dialogConfirmacao = false

      try {
        const response = await mesarioService.habilitarEleitor(this.matricula, this.eleicaoSelecionada.id)
        this.credencialGerada = response.credencial
        
        // Formatar data de expiração
        if (response.expiresAt) {
          const expiresAt = new Date(response.expiresAt)
          this.expiracaoCredencial = expiresAt.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })
        }
        
        this.dialogCredencial = true
        
        // Nota: O status "já votou" NÃO é atualizado aqui
        // Ele só será atualizado após a confirmação do voto na urna
      } catch (error) {
        this.error = error.error || 'Erro ao habilitar eleitor'
      } finally {
        this.loadingHabilitar = false
      }
    },
    fecharDialogCredencial() {
      this.dialogCredencial = false
      // Recarregar lista de eleitores para atualizar status
      this.carregarEleitores()
      // Limpar seleção
      this.matricula = ''
      this.eleitor = null
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
    /**
     * RNF05: Exibir informações de auditoria da eleição
     * Mostra dados de criação e atualização para rastreabilidade
     */
    abrirAuditoriaEleicao(eleicao) {
      this.eleicaoAuditoria = eleicao
      this.dialogAuditoria = true
    },
    /**
     * Formata data e hora para exibição no formato brasileiro
     * @param {string} dataISO - Data em formato ISO string
     * @returns {string} Data formatada em pt-BR
     */
    formatarDataHora(dataISO) {
      if (!dataISO) return 'N/A'
      
      const data = new Date(dataISO)
      
      // Verificar se a data é válida
      if (isNaN(data.getTime())) return 'Data inválida'
      
      // Formatar data e hora
      const dataFormatada = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      
      const horaFormatada = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      
      return `${dataFormatada} às ${horaFormatada}`
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
.v-card {
  border-radius: 16px;
}

.back-button-mesario {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.2;
}

/* Títulos específicos em cards */
.v-card h2, .v-card h3 {
  min-height: 1.5em;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* Lista de eleitores */
.v-list-item-title {
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
}

.v-list-item-subtitle {
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
}

/* Mobile optimizations */
@media (max-width: 599px) {
  .v-card {
    border-radius: 12px;
  }
}

@media (max-width: 959px) {
  .back-button-mesario {
    position: relative;
    margin-bottom: 8px;
  }
}
</style>

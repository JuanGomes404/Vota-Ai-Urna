<template>
  <v-app>
    <v-app-bar color="primary" dark density="comfortable">
      <v-app-bar-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-cog</v-icon>
        <span class="d-none d-sm-inline">Gerenciar Eleição</span>
        <span class="d-inline d-sm-none">Eleição</span>
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
              GERENCIAR ELEIÇÃO
            </h1>
            <p class="text-h6 grey--text mb-6">
              {{ eleicao?.nome || 'Carregando...' }}
            </p>
          </v-col>
        </v-row>

        <v-tabs v-model="tab" class="mb-6">
          <v-tab value="detalhes">
            <v-icon left>mdi-information</v-icon>
            Detalhes
          </v-tab>
          <v-tab value="chapas">
            <v-icon left>mdi-account-group</v-icon>
            Chapas
          </v-tab>
          <v-tab value="eleitores">
            <v-icon left>mdi-account-multiple</v-icon>
            Eleitores
          </v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <!-- Aba Detalhes -->
          <v-window-item value="detalhes">
            <v-card elevation="4" class="pa-6">
              <v-card-title>
                <h3 class="text-h5">Informações da Eleição</h3>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :model-value="eleicao?.nome"
                      label="Nome"
                      readonly
                      variant="outlined"
                      persistent-placeholder
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :model-value="eleicao?.status"
                      label="Status"
                      readonly
                      variant="outlined"
                      persistent-placeholder
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      :model-value="eleicao?.descricao"
                      label="Descrição"
                      readonly
                      variant="outlined"
                      rows="3"
                      persistent-placeholder
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Aba Chapas -->
          <v-window-item value="chapas">
            <v-card elevation="4" class="pa-6">
              <v-card-title class="d-flex justify-space-between align-center">
                <h3 class="text-h5">Chapas</h3>
                <v-btn
                  color="primary"
                  @click="criarChapa"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Nova Chapa
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headersChapas"
                  :items="chapas"
                  :loading="loading"
                  class="elevation-1"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      color="error"
                      size="small"
                      variant="text"
                      @click="removerChapa(item.id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Aba Eleitores -->
          <v-window-item value="eleitores">
            <v-card elevation="4" class="pa-6">
              <v-card-title class="d-flex justify-space-between align-center">
                <h3 class="text-h5">Eleitores</h3>
                <div>
                  <v-btn
                    color="primary"
                    @click="abrirDialogImportacao"
                  >
                    <v-icon left>mdi-upload</v-icon>
                    Importar Arquivo
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="pesquisaEleitor"
                  label="Pesquisar eleitor"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  class="mb-4"
                />
                <v-data-table
                  :headers="headersEleitores"
                  :items="eleitoresFiltrados"
                  :loading="loading"
                  class="elevation-1"
                >
                  <template v-slot:item.jaVotou="{ item }">
                    <v-chip
                      :color="item.jaVotou ? 'error' : 'success'"
                      size="small"
                    >
                      {{ item.jaVotou ? 'Já Votou' : 'Apto' }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>

        <!-- Dialog para criar chapa -->
        <v-dialog v-model="dialogChapa" max-width="500">
          <v-card>
            <v-card-title>
              <h3 class="text-h5">Nova Chapa</h3>
            </v-card-title>
            <v-card-text>
              <v-form ref="formChapa" @submit.prevent="salvarChapa">
                <v-text-field
                  v-model="novaChapa.numero"
                  label="Número da Chapa"
                  type="number"
                  :rules="[rules.required]"
                  variant="outlined"
                  class="mb-4"
                />
                <v-text-field
                  v-model="novaChapa.nome"
                  label="Nome da Chapa"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                variant="text"
                @click="dialogChapa = false"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                @click="salvarChapa"
                :loading="loading"
              >
                Criar Chapa
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog para importar eleitores -->
        <v-dialog v-model="dialogImportacao" max-width="800">
          <v-card>
            <v-card-title>
              <h3 class="text-h5">Importar Eleitores</h3>
            </v-card-title>
            <v-card-text>
              <v-alert
                v-if="importacaoErrors.length > 0"
                type="error"
                class="mb-4"
                closable
                @click:close="importacaoErrors = []"
              >
                <div>
                  <strong>Erros encontrados:</strong>
                  <ul class="mt-2">
                    <li v-for="error in importacaoErrors" :key="error">{{ error }}</li>
                  </ul>
                </div>
              </v-alert>

              <v-alert
                v-if="importacaoSuccess"
                type="success"
                class="mb-4"
                closable
                @click:close="importacaoSuccess = false"
              >
                {{ importacaoSuccessMessage }}
              </v-alert>

              <v-file-input
                v-model="arquivoImportacao"
                label="Selecionar arquivo CSV ou Excel"
                accept=".csv,.xlsx,.xls"
                prepend-icon="mdi-file-document"
                variant="outlined"
                class="mb-4"
                @change="processarArquivo"
              />

              <v-card v-if="previewEleitores.length > 0" elevation="2" class="pa-4">
                <v-card-title>
                  <h4 class="text-h6">Preview dos Eleitores ({{ previewEleitores.length }} encontrados)</h4>
                </v-card-title>
                <v-data-table
                  :headers="previewHeaders"
                  :items="previewEleitores"
                  :items-per-page="5"
                  class="elevation-1"
                />
              </v-card>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                variant="text"
                @click="fecharDialogImportacao"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                @click="confirmarImportacao"
                :loading="loading"
                :disabled="previewEleitores.length === 0 || importacaoErrors.length > 0"
              >
                Importar {{ previewEleitores.length }} Eleitores
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useEleicaoStore } from '@/stores/eleicaoStore'
import { fileImportService } from '@/services/fileImportService'

export default {
  name: 'AdminEleicoes',
  setup() {
    const eleicaoStore = useEleicaoStore()
    return { eleicaoStore }
  },
  data() {
    return {
      tab: 'detalhes',
      eleicao: null,
      chapas: [],
      eleitores: [],
      loading: false,
      dialogChapa: false,
      novaChapa: { nome: '', numero: '' },
      pesquisaEleitor: '',
      // Variáveis para importação
      dialogImportacao: false,
      arquivoImportacao: null,
      previewEleitores: [],
      importacaoErrors: [],
      importacaoSuccess: false,
      importacaoSuccessMessage: '',
      headersChapas: [
        { title: 'Número', key: 'numero' },
        { title: 'Nome', key: 'nome' },
        { title: 'Ações', key: 'actions', sortable: false }
      ],
      headersEleitores: [
        { title: 'Nome', key: 'nome' },
        { title: 'Matrícula', key: 'matricula' },
        { title: 'Curso', key: 'curso' },
        { title: 'Status', key: 'jaVotou' }
      ],
      previewHeaders: [
        { title: 'Nome', key: 'nome' },
        { title: 'Matrícula', key: 'matricula' },
        { title: 'Curso', key: 'curso' }
      ],
      rules: {
        required: value => !!value || 'Campo obrigatório'
      }
    }
  },
  computed: {
    eleitoresFiltrados() {
      if (!this.pesquisaEleitor) return this.eleitores
      return this.eleitores.filter(eleitor =>
        eleitor.nome.toLowerCase().includes(this.pesquisaEleitor.toLowerCase()) ||
        eleitor.matricula.includes(this.pesquisaEleitor)
      )
    }
  },
  async mounted() {
    await this.carregarDados()
  },
  methods: {
    async carregarDados() {
      this.loading = true
      try {
        const eleicaoId = this.$route.params.id
        if (!eleicaoId) {
          throw new Error('ID da eleição não fornecido')
        }
        
        // Carregar dados reais da eleição específica
        this.eleicao = await this.eleicaoStore.buscarEleicao(eleicaoId)
        
        if (!this.eleicao) {
          throw new Error('Eleição não encontrada')
        }
        
        // Usar dados carregados da eleição
        this.chapas = this.eleicao.chapas || []
        this.eleitores = this.eleicao.eleitores || []
        
        console.log('Eleição carregada:', this.eleicao)
        console.log('Chapas:', this.chapas)
        console.log('Eleitores:', this.eleitores)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        // Mostrar mensagem de erro para o usuário
        this.$toast?.error('Erro ao carregar dados da eleição')
      } finally {
        this.loading = false
      }
    },
    criarChapa() {
      this.novaChapa = { nome: '', numero: '' }
      this.dialogChapa = true
    },
    async salvarChapa() {
      const { valid } = await this.$refs.formChapa.validate()
      if (!valid) return

      if (!confirm('Tem certeza que deseja criar esta chapa?')) {
        return
      }

      this.loading = true
      try {
        const chapaData = {
          nome: this.novaChapa.nome,
          numero: this.novaChapa.numero.toString(),
          eleicaoId: this.eleicao.id
        }
        await this.eleicaoStore.criarChapa(chapaData)
        this.dialogChapa = false
        await this.carregarDados()
      } catch (error) {
        console.error('Erro ao criar chapa:', error)
      } finally {
        this.loading = false
      }
    },
    async removerChapa(chapaId) {
      if (confirm('Tem certeza que deseja remover esta chapa?')) {
        // Implementar remoção de chapa
        console.log('Remover chapa:', chapaId)
      }
    },
    abrirDialogImportacao() {
      this.dialogImportacao = true
      this.resetarImportacao()
    },
    fecharDialogImportacao() {
      this.dialogImportacao = false
      this.resetarImportacao()
    },
    resetarImportacao() {
      this.arquivoImportacao = null
      this.previewEleitores = []
      this.importacaoErrors = []
      this.importacaoSuccess = false
      this.importacaoSuccessMessage = ''
    },
    async processarArquivo() {
      if (!this.arquivoImportacao || !this.eleicao?.id) {
        return
      }

      try {
        this.loading = true
        this.importacaoErrors = []
        this.previewEleitores = []

        // Processar arquivo
        const dadosArquivo = await fileImportService.processFile(this.arquivoImportacao)
        
        // Validar dados
        const { eleitores, errors } = fileImportService.validateEleitores(dadosArquivo, this.eleicao.id)
        
        this.importacaoErrors = errors
        this.previewEleitores = eleitores

        if (errors.length === 0) {
          console.log(`${eleitores.length} eleitores válidos encontrados`)
        } else {
          console.log(`${errors.length} erros encontrados`)
        }
      } catch (error) {
        console.error('Erro ao processar arquivo:', error)
        this.importacaoErrors = [error.message]
      } finally {
        this.loading = false
      }
    },
    async confirmarImportacao() {
      if (this.previewEleitores.length === 0 || this.importacaoErrors.length > 0) {
        return
      }

      if (!confirm(`Tem certeza que deseja importar ${this.previewEleitores.length} eleitores?`)) {
        return
      }

      try {
        this.loading = true
        
        // Importar eleitores via API
        const resultado = await this.eleicaoStore.importarEleitores(this.previewEleitores)
        
        // Recarregar dados da eleição
        await this.carregarDados()
        
        // Processar resultado
        if (resultado.erros && resultado.erros.length > 0) {
          // Mostrar erros específicos do backend
          this.importacaoErrors = resultado.erros.map(erro => 
            `${erro.nome} (${erro.matricula}): ${erro.erro}`
          )
        }
        
        // Mostrar sucesso com detalhes
        this.importacaoSuccess = true
        this.importacaoSuccessMessage = `${resultado.totalProcessados} eleitores processados com sucesso!`
        
        if (resultado.totalErros > 0) {
          this.importacaoSuccessMessage += ` ${resultado.totalErros} erros encontrados.`
        }
        
        // Limpar preview
        this.previewEleitores = []
        
        console.log('Resultado da importação:', resultado)
      } catch (error) {
        console.error('Erro ao importar eleitores:', error)
        this.importacaoErrors = [`Erro ao importar eleitores: ${error.message}`]
      } finally {
        this.loading = false
      }
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

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
                  class="elevation-1 mobile-friendly-table"
                  density="comfortable"
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
                  class="elevation-1 mobile-friendly-table"
                  density="comfortable"
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
        <v-dialog v-model="dialogChapa" max-width="500" persistent>
          <v-card rounded="lg">
            <v-card-title class="text-h5 font-weight-bold pa-6 bg-primary">
              <v-icon color="white" class="mr-2">mdi-account-group</v-icon>
              <span class="text-white">Nova Chapa</span>
            </v-card-title>
            <v-card-text class="pa-6">
              <v-form ref="formChapa" @submit.prevent="salvarChapa">
                <v-text-field
                  v-model="novaChapa.numero"
                  label="Número da Chapa"
                  type="number"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-numeric"
                  class="mb-4"
                />
                <v-text-field
                  v-model="novaChapa.nome"
                  label="Nome da Chapa"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-text"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn
                variant="outlined"
                color="grey"
                size="large"
                @click="dialogChapa = false"
                :disabled="loading"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                size="large"
                @click="salvarChapa"
                :loading="loading"
                variant="elevated"
              >
                <v-icon left>mdi-check</v-icon>
                Criar Chapa
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog para importar eleitores -->
        <v-dialog v-model="dialogImportacao" max-width="900" persistent>
          <v-card rounded="lg">
            <v-card-title class="text-h5 font-weight-bold pa-6 bg-primary">
              <v-icon color="white" class="mr-2">mdi-upload</v-icon>
              <span class="text-white">Importar Eleitores</span>
            </v-card-title>
            <v-card-text class="pa-6">
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
                  class="elevation-1 preview-table-mobile"
                  density="comfortable"
                />
              </v-card>
            </v-card-text>
            <v-card-actions class="pa-4 dialog-actions-mobile">
              <v-spacer class="d-none d-sm-flex" />
              <!-- Mostrar apenas OK quando a importação for bem-sucedida -->
              <template v-if="importacaoSuccess">
                <v-btn
                  color="success"
                  size="large"
                  variant="elevated"
                  @click="fecharDialogImportacao"
                  block
                  class="action-button"
                >
                  <v-icon left>mdi-check</v-icon>
                  OK
                </v-btn>
              </template>
              <!-- Mostrar botões de Cancelar/Importar antes da importação -->
              <template v-else>
                <v-btn
                  variant="outlined"
                  color="grey"
                  size="large"
                  @click="fecharDialogImportacao"
                  :disabled="loading"
                  class="action-button"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  size="large"
                  variant="elevated"
                  @click="confirmarImportacao"
                  :loading="loading"
                  :disabled="previewEleitores.length === 0 || importacaoErrors.length > 0"
                  class="action-button"
                >
                  <v-icon left>mdi-upload</v-icon>
                  Importar {{ previewEleitores.length }} Eleitores
                </v-btn>
              </template>
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
import { useEleicaoStore } from '@/stores/eleicaoStore'
import { fileImportService } from '@/services/fileImportService'
import { applyMobileTableLabels } from '@/utils/mobileTable'

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
      // Variáveis para confirmação
      dialogConfirmacao: false,
      mensagemConfirmacao: '',
      acaoConfirmada: null,
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
  updated() {
    // Aplicar labels mobile sempre que o componente atualizar
    this.$nextTick(() => {
      applyMobileTableLabels()
    })
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

      this.mensagemConfirmacao = 'Tem certeza que deseja criar esta chapa?'
      this.acaoConfirmada = this.executarCriacaoChapa
      this.dialogConfirmacao = true
    },
    async executarCriacaoChapa() {
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
        this.dialogConfirmacao = false
      }
    },
    async removerChapa(chapaId) {
      this.mensagemConfirmacao = 'Tem certeza que deseja remover esta chapa?'
      this.acaoConfirmada = () => this.executarRemocaoChapa(chapaId)
      this.dialogConfirmacao = true
    },
    async executarRemocaoChapa(chapaId) {
      this.loading = true
      try {
        await this.eleicaoStore.deletarChapa(chapaId)
        // Recarregar dados para atualizar a lista
        await this.carregarDados()
      } catch (error) {
        console.error('Erro ao remover chapa:', error)
        // Mostrar mensagem de erro se houver
        const mensagemErro = error.message || 'Erro ao remover chapa'
        this.$toast?.error(mensagemErro)
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

        // Aplicar labels mobile após carregar preview
        this.$nextTick(() => {
          applyMobileTableLabels()
        })
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

      this.mensagemConfirmacao = `Tem certeza que deseja importar ${this.previewEleitores.length} eleitores?`
      this.acaoConfirmada = this.executarImportacao
      this.dialogConfirmacao = true
    },
    async executarImportacao() {
      try {
        this.loading = true
        this.dialogConfirmacao = false
        
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

/* Estilos específicos para tabela de preview em mobile */
@media (max-width: 959px) {
  /* Estilos para todas as tabelas mobile-friendly */
  .mobile-friendly-table :deep(.v-data-table__wrapper),
  .preview-table-mobile :deep(.v-data-table__wrapper) {
    overflow-x: visible !important;
  }
  
  .mobile-friendly-table :deep(thead),
  .preview-table-mobile :deep(thead) {
    display: none;
  }
  
  .mobile-friendly-table :deep(tbody tr),
  .preview-table-mobile :deep(tbody tr) {
    display: block;
    margin-bottom: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .mobile-friendly-table :deep(tbody td),
  .preview-table-mobile :deep(tbody td) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0 !important;
    border-bottom: 1px solid #f5f5f5;
    text-align: right;
    min-height: 36px;
  }
  
  .mobile-friendly-table :deep(tbody td:last-child),
  .preview-table-mobile :deep(tbody td:last-child) {
    border-bottom: none;
  }
  
  .mobile-friendly-table :deep(tbody td::before),
  .preview-table-mobile :deep(tbody td::before) {
    content: attr(data-label);
    font-weight: 600;
    text-align: left;
    flex: 1;
    color: #555;
    font-size: 0.875rem;
    padding-right: 12px;
  }
  
  /* Melhorar espaçamento do conteúdo da célula */
  .mobile-friendly-table :deep(tbody td > *),
  .preview-table-mobile :deep(tbody td > *) {
    flex: 1;
    text-align: right;
  }
  
  /* Botões de ação em mobile */
  .mobile-friendly-table :deep(tbody td .v-btn) {
    margin-left: auto;
  }
  
  /* Ajustar paginação em mobile */
  .mobile-friendly-table :deep(.v-data-table-footer),
  .preview-table-mobile :deep(.v-data-table-footer) {
    flex-wrap: wrap;
    justify-content: center;
    padding: 8px !important;
  }
  
  .mobile-friendly-table :deep(.v-data-table-footer__items-per-page),
  .preview-table-mobile :deep(.v-data-table-footer__items-per-page) {
    margin-bottom: 8px;
    width: 100%;
    justify-content: center;
  }
  
  .mobile-friendly-table :deep(.v-data-table-footer__pagination),
  .preview-table-mobile :deep(.v-data-table-footer__pagination) {
    margin: 0 !important;
  }
  
  /* Ajustar botões do dialog em mobile */
  .dialog-actions-mobile {
    flex-direction: column !important;
    gap: 8px;
  }
  
  .dialog-actions-mobile .action-button {
    width: 100% !important;
    max-width: none !important;
  }
}
</style>

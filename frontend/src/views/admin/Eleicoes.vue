<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>
        <v-icon left>mdi-cog</v-icon>
        Gerenciar Eleição
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
                      :value="eleicao?.nome"
                      label="Nome"
                      readonly
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="eleicao?.status"
                      label="Status"
                      readonly
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      :value="eleicao?.descricao"
                      label="Descrição"
                      readonly
                      variant="outlined"
                      rows="3"
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
                <v-btn
                  color="primary"
                  @click="importarEleitores"
                >
                  <v-icon left>mdi-upload</v-icon>
                  Importar CSV
                </v-btn>
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
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useEleicaoStore } from '@/stores/eleicaoStore'

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
      novaChapa: { nome: '' },
      pesquisaEleitor: '',
      headersChapas: [
        { title: 'Nome', key: 'nome' },
        { title: 'Ações', key: 'actions', sortable: false }
      ],
      headersEleitores: [
        { title: 'Nome', key: 'nome' },
        { title: 'Matrícula', key: 'matricula' },
        { title: 'Curso', key: 'curso' },
        { title: 'Status', key: 'jaVotou' }
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
        // Em produção, carregar dados da eleição específica
        this.eleicao = { id: eleicaoId, nome: 'Eleição de Exemplo', status: 'Criada', descricao: 'Descrição da eleição' }
        await this.eleicaoStore.carregarChapas(eleicaoId)
        await this.eleicaoStore.carregarEleitores(eleicaoId)
        this.chapas = this.eleicaoStore.chapas
        this.eleitores = this.eleicaoStore.eleitores
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        this.loading = false
      }
    },
    criarChapa() {
      this.novaChapa = { nome: '' }
      this.dialogChapa = true
    },
    async salvarChapa() {
      const { valid } = await this.$refs.formChapa.validate()
      if (!valid) return

      this.loading = true
      try {
        const chapaData = {
          nome: this.novaChapa.nome,
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
    importarEleitores() {
      // Implementar importação de CSV
      console.log('Importar eleitores')
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>

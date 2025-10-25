<template>
  <v-container fluid class="urna-container pa-4">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="11" md="10" lg="8" xl="6">
        <v-card elevation="12" class="pa-4 pa-sm-6 pa-md-8">
          <v-card-title class="text-center mb-4 mb-md-6 px-0">
            <h1 class="text-h5 text-sm-h4 text-md-h3 font-weight-bold" style="color: #005A9C;">
              URNA ELETRÔNICA
            </h1>
          </v-card-title>

          <!-- Etapa 1: Seleção de Eleição -->
          <div v-if="!eleicaoSelecionada">
            <v-card-text class="text-center mb-4 mb-md-6 px-0">
              <p class="text-body-1 text-sm-h6" style="color: #666;">
                Selecione a eleição para votar:
              </p>
            </v-card-text>

            <v-alert v-if="eleicoes.length === 0" type="info" class="mb-4">
              Não há eleições ativas no momento.
            </v-alert>

            <v-list v-else class="pa-0">
              <v-list-item
                v-for="eleicao in eleicoes"
                :key="eleicao.id"
                @click="selecionarEleicao(eleicao)"
                class="mb-2 mb-sm-3"
                border
                rounded
              >
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-vote</v-icon>
                </template>
                <v-list-item-title class="text-subtitle-1 text-sm-h6">{{ eleicao.nome }}</v-list-item-title>
                <v-list-item-subtitle v-if="eleicao.descricao">{{ eleicao.descricao }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip color="success" size="small">{{ eleicao.status }}</v-chip>
                </template>
              </v-list-item>
            </v-list>

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
          </div>

          <!-- Etapa 2: Inserção de Credencial -->
          <div v-else>
            <v-form @submit.prevent="validarCredencial" ref="credentialForm">
              <div class="position-relative">
                <v-btn
                  icon
                  size="small"
                  @click="voltarSelecaoEleicao"
                  class="back-button"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-card-text class="text-center mb-4 px-0 pt-0">
                  <h2 class="text-subtitle-1 text-sm-h6 text-md-h5 font-weight-bold mb-2">
                    {{ eleicaoSelecionada.nome }}
                  </h2>
                  <p class="text-body-2 text-sm-body-1 text-md-h6" style="color: #666;">
                    Por favor, digite sua credencial de voto:
                  </p>
                </v-card-text>
              </div>

              <v-text-field
                v-model="credencial"
                label="Credencial"
                placeholder="Digite os 6 dígitos da credencial"
                prepend-inner-icon="mdi-key"
                variant="outlined"
                :rules="[rules.required, rules.credencial]"
                class="mb-6"
                autofocus
                density="comfortable"
                persistent-placeholder
                maxlength="6"
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

              <div class="text-center">
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  :loading="loading"
                  class="px-6 px-sm-8"
                  block
                >
                  <v-icon class="mr-2">mdi-check</v-icon>
                  CONFIRMAR
                </v-btn>
              </div>
            </v-form>

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
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { urnaService } from '@/services/urnaService'

export default {
  name: 'UrnaEletronica',
  data() {
    return {
      eleicoes: [],
      eleicaoSelecionada: null,
      credencial: '',
      loading: false,
      error: null,
      rules: {
        required: value => !!value || 'Campo obrigatório',
        credencial: value => {
          if (!value) return true
          return /^\d{6}$/.test(value) || 'Credencial deve ter exatamente 6 dígitos numéricos'
        }
      }
    }
  },
  mounted() {
    this.carregarEleicoes()
  },
  methods: {
    async carregarEleicoes() {
      try {
        const response = await urnaService.listarEleicoesAtivas()
        this.eleicoes = response.eleicoes || []
      } catch (error) {
        console.error('Erro ao carregar eleições:', error)
        this.error = 'Erro ao carregar eleições ativas'
      }
    },
    selecionarEleicao(eleicao) {
      this.eleicaoSelecionada = eleicao
      this.credencial = ''
      this.error = null
    },
    voltarSelecaoEleicao() {
      this.eleicaoSelecionada = null
      this.credencial = ''
      this.error = null
    },
    async validarCredencial() {
      const { valid } = await this.$refs.credentialForm.validate()
      if (!valid) return

      this.loading = true
      this.error = null

      try {
        const response = await urnaService.validarCredencial(this.credencial, this.eleicaoSelecionada.id)
        
        if (response.valid) {
          const eleicaoId = response.eleicaoId || this.eleicaoSelecionada.id
          localStorage.setItem('urna_credencial', this.credencial)
          localStorage.setItem('urna_eleicao_id', eleicaoId)
          this.$router.push('/urna/votar')
        } else {
          this.error = response.error || 'Credencial inválida'
        }
      } catch (error) {
        this.error = error.error || 'Erro ao validar credencial'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.urna-container {
  background: linear-gradient(135deg, #005A9C 0%, #0277BD 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 20px;
}

/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.2;
}

/* Títulos específicos em cards */
.v-card h2 {
  min-height: 1.5em;
  word-break: break-word;
  overflow-wrap: break-word;
}

.back-button {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

/* Mobile optimizations */
@media (max-width: 599px) {
  .v-card {
    border-radius: 12px;
  }
}

@media (max-width: 959px) {
  .back-button {
    position: relative;
    margin-bottom: 8px;
  }
}
</style>

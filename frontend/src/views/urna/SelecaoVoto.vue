<template>
  <v-container fluid class="votacao-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="12" class="pa-8">
          <v-card-title class="text-center mb-6">
            <h1 class="text-h3 font-weight-bold primary--text">
              {{ eleicao?.nome || 'ELEIÇÃO' }}
            </h1>
            <p class="text-h6 grey--text mt-2">
              Selecione sua opção de voto:
            </p>
          </v-card-title>

          <v-row v-if="chapas.length > 0" class="mb-6">
            <v-col
              v-for="chapa in chapas"
              :key="chapa.id"
              cols="12"
              sm="6"
              md="4"
              class="mb-4"
            >
              <v-card
                elevation="4"
                class="chapa-card pa-4 text-center"
                :class="{ 'selected': votoSelecionado === chapa.id }"
                hover
                @click="selecionarVoto(chapa.id)"
              >
                <v-icon size="64" color="primary" class="mb-3">
                  mdi-account-group
                </v-icon>
                <h3 class="text-h6 font-weight-bold mb-2">
                  {{ chapa.nome }}
                </h3>
                <v-btn
                  v-if="votoSelecionado === chapa.id"
                  color="success"
                  size="small"
                  class="mt-2"
                >
                  <v-icon left>mdi-check</v-icon>
                  Selecionado
                </v-btn>
              </v-card>
            </v-col>
          </v-row>

          <!-- Opções de voto em branco e nulo -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6" class="mb-4">
              <v-card
                elevation="4"
                class="voto-card pa-4 text-center"
                :class="{ 'selected': votoSelecionado === 'branco' }"
                hover
                @click="selecionarVoto('branco')"
              >
                <v-icon size="64" color="grey" class="mb-3">
                  mdi-checkbox-blank-outline
                </v-icon>
                <h3 class="text-h6 font-weight-bold mb-2">
                  VOTO EM BRANCO
                </h3>
                <v-btn
                  v-if="votoSelecionado === 'branco'"
                  color="success"
                  size="small"
                  class="mt-2"
                >
                  <v-icon left>mdi-check</v-icon>
                  Selecionado
                </v-btn>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" class="mb-4">
              <v-card
                elevation="4"
                class="voto-card pa-4 text-center"
                :class="{ 'selected': votoSelecionado === 'nulo' }"
                hover
                @click="selecionarVoto('nulo')"
              >
                <v-icon size="64" color="error" class="mb-3">
                  mdi-close-circle-outline
                </v-icon>
                <h3 class="text-h6 font-weight-bold mb-2">
                  VOTO NULO
                </h3>
                <v-btn
                  v-if="votoSelecionado === 'nulo'"
                  color="success"
                  size="small"
                  class="mt-2"
                >
                  <v-icon left>mdi-check</v-icon>
                  Selecionado
                </v-btn>
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

          <div class="text-center">
            <v-btn
              v-if="votoSelecionado"
              color="primary"
              size="x-large"
              :loading="loading"
              @click="confirmarVoto"
              class="px-8"
            >
              CONFIRMAR VOTO
            </v-btn>
            <p v-else class="text-h6 grey--text">
              Selecione uma opção para continuar
            </p>
          </div>

          <v-divider class="my-6" />

          <div class="text-center">
            <v-btn
              variant="text"
              color="grey"
              @click="$router.push('/urna')"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              Voltar
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
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
      loading: false,
      error: null
    }
  },
  async mounted() {
    await this.carregarChapas()
  },
  methods: {
    async carregarChapas() {
      try {
        // Por enquanto, vamos usar uma eleição fixa
        // Em produção, isso viria da credencial validada
        const eleicaoId = 'eleicao-exemplo'
        const response = await urnaService.listarChapas(eleicaoId)
        this.chapas = response
      } catch (error) {
        this.error = 'Erro ao carregar chapas da eleição'
        console.error('Erro ao carregar chapas:', error)
      }
    },
    selecionarVoto(opcao) {
      this.votoSelecionado = opcao
    },
    async confirmarVoto() {
      if (!this.votoSelecionado) return

      this.loading = true
      this.error = null

      try {
        const credencial = localStorage.getItem('urna_credencial')
        if (!credencial) {
          this.$router.push('/urna')
          return
        }

        const votoData = {
          token: credencial,
          eleicaoId: 'eleicao-exemplo', // Em produção, viria da credencial
          chapaId: this.votoSelecionado === 'branco' || this.votoSelecionado === 'nulo' 
            ? null 
            : this.votoSelecionado
        }

        const response = await urnaService.confirmarVoto(votoData)
        
        if (response.message) {
          // Limpar credencial e ir para tela de sucesso
          localStorage.removeItem('urna_credencial')
          this.$router.push('/urna/sucesso')
        }
      } catch (error) {
        this.error = error.error || 'Erro ao confirmar voto'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.votacao-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  border: 3px solid #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
}
</style>

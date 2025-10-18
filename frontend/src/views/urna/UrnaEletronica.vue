<template>
  <v-container fluid class="urna-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="12" class="pa-8">
          <v-card-title class="text-center mb-6">
            <h1 class="text-h3 font-weight-bold primary--text">
              URNA ELETRÔNICA
            </h1>
          </v-card-title>

          <v-form @submit.prevent="validarCredencial" ref="credentialForm">
            <v-card-text class="text-center mb-6">
              <p class="text-h6 grey--text">
                Por favor, digite sua credencial de voto:
              </p>
            </v-card-text>

            <v-text-field
              v-model="credencial"
              label="Credencial"
              prepend-inner-icon="mdi-key"
              variant="outlined"
              size="large"
              :rules="[rules.required, rules.credencial]"
              class="mb-6"
              autofocus
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
                size="x-large"
                :loading="loading"
                class="px-8"
              >
                CONFIRMAR
              </v-btn>
            </div>
          </v-form>

          <v-divider class="my-6" />

          <div class="text-center">
            <v-btn
              variant="text"
              color="grey"
              @click="$router.push('/')"
            >
              <v-icon left>mdi-home</v-icon>
              Voltar ao Início
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
  name: 'UrnaEletronica',
  data() {
    return {
      credencial: '',
      loading: false,
      error: null,
      rules: {
        required: value => !!value || 'Campo obrigatório',
        credencial: value => {
          if (!value) return true
          return value.length >= 6 || 'Credencial deve ter pelo menos 6 caracteres'
        }
      }
    }
  },
  methods: {
    async validarCredencial() {
      const { valid } = await this.$refs.credentialForm.validate()
      if (!valid) return

      this.loading = true
      this.error = null

      try {
        const response = await urnaService.validarCredencial(this.credencial)
        
        if (response.valid) {
          // Armazenar credencial válida e ir para seleção de voto
          localStorage.setItem('urna_credencial', this.credencial)
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 20px;
}

.v-text-field {
  font-size: 1.2rem;
}
</style>

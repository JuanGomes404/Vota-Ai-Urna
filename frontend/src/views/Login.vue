<template>
  <v-container fluid class="login-container pa-4">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card elevation="8" class="pa-4 pa-sm-6 pa-md-8">
          <v-card-title class="text-center mb-4 mb-md-6 px-0">
            <h2 class="text-h6 text-sm-h5 text-md-h4 font-weight-bold" style="color: #005A9C;">
              SISTEMA DE GERENCIAMENTO ELEITORAL
            </h2>
          </v-card-title>

          <v-form @submit.prevent="handleLogin" ref="loginForm">
            <v-text-field
              v-model="credentials.usuario"
              label="Usuário"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              :rules="[rules.required]"
              class="mb-4"
              density="comfortable"
              persistent-placeholder
            />

            <v-text-field
              v-model="credentials.senha"
              label="Senha"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              type="password"
              :rules="[rules.required]"
              class="mb-6"
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

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              class="mb-4"
            >
              <v-icon class="mr-2">mdi-login</v-icon>
              ENTRAR
            </v-btn>

            <v-divider class="my-4" />

            <div class="d-flex flex-column gap-2">
              <v-btn
                variant="text"
                color="primary"
                @click="goToUrna"
                block
              >
                <v-icon class="mr-2">mdi-vote</v-icon>
                Acessar Urna Eletrônica
              </v-btn>
              
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
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        usuario: '',
        senha: ''
      },
      loading: false,
      error: null,
      rules: {
        required: value => !!value || 'Campo obrigatório'
      }
    }
  },
  methods: {
    async handleLogin() {
      const { valid } = await this.$refs.loginForm.validate()
      if (!valid) return

      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        await authStore.login(this.credentials)
        
        // Redirecionar baseado no role
        if (authStore.isAdmin) {
          this.$router.push('/admin')
        } else if (authStore.isMesario) {
          this.$router.push('/mesario')
        }
      } catch (error) {
        this.error = error.error || 'Erro ao fazer login. Verifique suas credenciais.'
      } finally {
        this.loading = false
      }
    },
    goToUrna() {
      this.$router.push('/urna')
    }
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #005A9C 0%, #0277BD 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 16px;
}

/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.2;
}

.v-card {
  border-radius: 16px;
}

/* Mobile optimizations */
@media (max-width: 599px) {
  .v-card {
    border-radius: 8px;
  }
}

.gap-2 {
  gap: 8px;
}
</style>

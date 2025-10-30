<template>
  <v-container fluid class="login-container pa-4">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card elevation="8" class="pa-4 pa-sm-6 pa-md-8">
          <v-card-title class="text-center mb-4 mb-md-6 px-0">
            <h2 class="text-h6 text-sm-h5 text-md-h4 font-weight-bold" style="color: #005A9C;">
              Login Vota Aí
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

            <!-- Indicador de Loading (Backend acordando) -->
            <div v-if="loading && showBackendWakingAlert" class="text-center mb-4">
              <v-progress-circular
                indeterminate
                color="primary"
                size="48"
                width="5"
              />
              <p class="text-body-2 text-medium-emphasis mt-3">
                Aguarde, conectando ao servidor...
              </p>
            </div>

            <!-- Alerta de Erro -->
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              prominent
              border="start"
              @click:close="error = null"
            >
              <v-alert-title class="text-h6 mb-2">
                <v-icon class="mr-2">mdi-alert-circle</v-icon>
                Falha na Autenticação
              </v-alert-title>
              {{ error }}
            </v-alert>

            <!-- Alerta de Sucesso (Logout) -->
            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mb-4"
              closable
              prominent
              border="start"
              @click:close="successMessage = null"
            >
              <v-alert-title class="text-h6 mb-2">
                <v-icon class="mr-2">mdi-check-circle</v-icon>
                Sucesso
              </v-alert-title>
              {{ successMessage }}
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
      successMessage: null,
      showBackendWakingAlert: false,
      backendWakingTimer: null,
      rules: {
        required: value => !!value || 'Campo obrigatório'
      }
    }
  },
  mounted() {
    // Verificar se há mensagem de logout na query
    if (this.$route.query.logout === 'success') {
      this.successMessage = 'Logout realizado com sucesso!'
      // Limpar a query da URL sem recarregar a página
      this.$router.replace({ query: {} })
      // Auto-fechar após 5 segundos
      setTimeout(() => {
        this.successMessage = null
      }, 5000)
    }
  },
  methods: {
    async handleLogin() {
      const { valid } = await this.$refs.loginForm.validate()
      if (!valid) return

      this.loading = true
      this.error = null
      this.successMessage = null

      // Mostrar alerta de "backend acordando" após 2 segundos de loading
      this.backendWakingTimer = setTimeout(() => {
        this.showBackendWakingAlert = true
      }, 2000)

      try {
        console.log('🔐 Iniciando login...')
        console.log('👤 Usuário:', this.credentials.usuario)
        
        const authStore = useAuthStore()
        const response = await authStore.login(this.credentials)
        
        console.log('✅ Login bem-sucedido!')
        console.log('👤 User data:', response.user)
        console.log('🎭 Role:', response.user?.role)
        console.log('🔑 Token recebido:', response.token ? 'SIM' : 'NÃO')
        
        // Redirecionar baseado no role
        if (authStore.isAdmin) {
          console.log('➡️ Redirecionando para /admin')
          await this.$router.push('/admin')
        } else if (authStore.isMesario) {
          console.log('➡️ Redirecionando para /mesario')
          await this.$router.push('/mesario')
        } else {
          console.warn('⚠️ Role não identificado:', response.user?.role)
          this.error = 'Tipo de usuário não reconhecido'
        }
      } catch (error) {
        console.error('❌ Erro no login:', error)
        console.error('❌ Error details:', {
          message: error.message,
          error: error.error,
          response: error.response,
          status: error.status
        })
        
        // Exibir mensagem de erro específica
        this.error = error.error || error.message || 'Erro ao fazer login. Verifique suas credenciais.'
        
        // Limpar apenas o campo de senha após erro
        this.credentials.senha = ''
        
        // Focar no campo de senha para nova tentativa
        setTimeout(() => {
          const senhaField = this.$el.querySelector('input[type="password"]')
          if (senhaField) senhaField.focus()
        }, 100)
      } finally {
        // Limpar timer e ocultar alerta
        if (this.backendWakingTimer) {
          clearTimeout(this.backendWakingTimer)
          this.backendWakingTimer = null
        }
        this.showBackendWakingAlert = false
        this.loading = false
      }
    },
    goToUrna() {
      this.$router.push('/urna')
    }
  },
  beforeUnmount() {
    // Limpar timer ao sair do componente
    if (this.backendWakingTimer) {
      clearTimeout(this.backendWakingTimer)
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

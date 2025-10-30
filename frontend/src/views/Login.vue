<template>
  <v-container fluid class="login-container pa-2 pa-sm-4">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-2 pa-sm-3">
        <v-card elevation="8" class="login-card pa-3 pa-sm-6 pa-md-8">
          <!-- Logo ou Título -->
          <v-card-title class="text-center mb-3 mb-md-6 px-0">
            <h2 class="login-title text-h6 text-sm-h5 text-md-h4 font-weight-bold">
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
              class="mb-3"
              density="comfortable"
              persistent-placeholder
              hide-details="auto"
            />

            <v-text-field
              v-model="credentials.senha"
              label="Senha"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              type="password"
              :rules="[rules.required]"
              class="mb-4"
              density="comfortable"
              persistent-placeholder
              hide-details="auto"
            />

            <!-- Indicador de Loading (Backend acordando) -->
            <div v-if="loading && showBackendWakingAlert" class="text-center my-3">
              <v-progress-circular
                indeterminate
                color="primary"
                size="40"
                width="4"
              />
              <p class="text-caption text-sm-body-2 text-medium-emphasis mt-2">
                Aguarde, conectando ao servidor...
              </p>
            </div>

            <!-- Alerta de Erro - Compacto para mobile -->
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mb-3"
              closable
              density="compact"
              border="start"
              @click:close="error = null"
            >
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-2">mdi-alert-circle</v-icon>
                <div>
                  <div class="text-subtitle-2 font-weight-bold">Falha na Autenticação</div>
                  <div class="text-caption text-sm-body-2">{{ error }}</div>
                </div>
              </div>
            </v-alert>

            <!-- Alerta de Sucesso (Logout) - Compacto para mobile -->
            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mb-3"
              closable
              density="compact"
              border="start"
              @click:close="successMessage = null"
            >
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-2">mdi-check-circle</v-icon>
                <div>
                  <div class="text-subtitle-2 font-weight-bold">Sucesso</div>
                  <div class="text-caption text-sm-body-2">{{ successMessage }}</div>
                </div>
              </div>
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              :disabled="loading"
              class="mb-3 mb-sm-4 text-none"
              elevation="2"
            >
              <v-icon class="mr-2" size="small">mdi-login</v-icon>
              Entrar
            </v-btn>

            <v-divider class="my-3 my-sm-4" />

            <div class="d-flex flex-column mobile-buttons">
              <v-btn
                variant="outlined"
                color="primary"
                @click="goToUrna"
                block
                size="default"
                class="mb-2 text-none"
              >
                <v-icon class="mr-2" size="small">mdi-vote</v-icon>
                <span class="d-none d-sm-inline">Acessar Urna Eletrônica</span>
                <span class="d-inline d-sm-none">Urna Eletrônica</span>
              </v-btn>
              
              <v-btn
                variant="text"
                color="secondary"
                @click="$router.push('/')"
                block
                size="default"
                class="text-none"
              >
                <v-icon class="mr-2" size="small">mdi-home</v-icon>
                <span class="d-none d-sm-inline">Voltar ao Início</span>
                <span class="d-inline d-sm-none">Início</span>
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
        
        // Determinar mensagem de erro apropriada
        let errorMessage = 'Erro ao fazer login. Tente novamente.'
        
        // Se for erro 401 (Unauthorized), é credencial inválida
        if (error.status === 401) {
          errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.'
        } 
        // Se houver mensagem específica do backend
        else if (error.error) {
          // Verificar se a mensagem indica credenciais inválidas
          const msgLower = error.error.toLowerCase()
          if (msgLower.includes('inválid') || msgLower.includes('invalid') || 
              msgLower.includes('incorret') || msgLower.includes('credenc')) {
            errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.'
          } else {
            errorMessage = error.error
          }
        }
        // Se for erro de timeout ou conexão
        else if (error.message && error.message.includes('timeout')) {
          errorMessage = 'Tempo de conexão esgotado. Verifique sua conexão e tente novamente.'
        }
        
        this.error = errorMessage
        
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
  display: flex;
  align-items: center;
  padding: 8px;
}

.login-card {
  border-radius: 16px;
  max-width: 100%;
  width: 100%;
}

.login-title {
  color: #005A9C;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
}

/* Otimizações para mobile */
@media (max-width: 599px) {
  .login-container {
    padding: 4px;
  }
  
  .login-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }
  
  .login-title {
    font-size: 1.25rem !important;
    line-height: 1.4;
  }
  
  /* Botões mais compactos no mobile */
  .mobile-buttons .v-btn {
    min-height: 42px;
    font-size: 0.9rem;
  }
  
  /* Alertas mais compactos */
  .v-alert {
    padding: 8px 12px !important;
  }
  
  /* Campos de input otimizados */
  :deep(.v-field) {
    font-size: 16px; /* Previne zoom no iOS */
  }
  
  :deep(.v-field__input) {
    min-height: 48px; /* Touch-friendly */
  }
}

/* Tablets */
@media (min-width: 600px) and (max-width: 959px) {
  .login-card {
    border-radius: 16px;
  }
}

/* Desktop */
@media (min-width: 960px) {
  .login-container {
    padding: 16px;
  }
}

/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* Espaçamento consistente */
.mobile-buttons {
  gap: 8px;
}

/* Smooth transitions */
.v-btn, .v-alert {
  transition: all 0.2s ease-in-out;
}

/* Focus states acessíveis */
.v-btn:focus-visible {
  outline: 2px solid #005A9C;
  outline-offset: 2px;
}
</style>

<template>
  <v-container fluid class="login-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" class="pa-8">
          <v-card-title class="text-center mb-6">
            <h2 class="text-h4 font-weight-bold primary--text">
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
            />

            <v-text-field
              v-model="credentials.senha"
              label="Senha"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              type="password"
              :rules="[rules.required]"
              class="mb-6"
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
              ENTRAR
            </v-btn>

            <v-divider class="my-4" />

            <div class="text-center">
              <v-btn
                variant="text"
                color="primary"
                @click="goToUrna"
              >
                <v-icon left>mdi-vote</v-icon>
                Acessar Urna Eletrônica
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 16px;
}
</style>

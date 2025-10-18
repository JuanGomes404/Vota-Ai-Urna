<template>
  <v-container fluid class="home-container">
    <v-row>
      <v-col cols="12">
        <v-app-bar color="primary" dark>
          <v-toolbar-title>
            <v-icon left>mdi-vote</v-icon>
            Vota AI - Sistema de Votação Eletrônica
          </v-toolbar-title>
          
          <v-spacer />
          
          <v-btn
            v-if="!authStore.isAuthenticated"
            color="white"
            variant="text"
            @click="$router.push('/login')"
          >
            <v-icon left>mdi-login</v-icon>
            Login
          </v-btn>
          
          <v-menu v-else>
            <template v-slot:activator="{ props }">
              <v-btn color="white" variant="text" v-bind="props">
                <v-icon left>mdi-account</v-icon>
                {{ authStore.userName }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="handleLogout">
                <v-list-item-title>
                  <v-icon left>mdi-logout</v-icon>
                  Sair
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="10">
        <v-card elevation="4" class="pa-8">
          <v-card-title class="text-center mb-6">
            <h1 class="text-h3 font-weight-bold primary--text">
              Sistema de Votação Eletrônica
            </h1>
            <p class="text-h6 grey--text mt-2">
              TCC UNIRIO - Sistema de Urna Eletrônica
            </p>
          </v-card-title>

          <v-row class="mt-8">
            <v-col cols="12" md="6" class="text-center">
              <v-card
                elevation="2"
                class="pa-6 h-100"
                hover
                @click="$router.push('/urna')"
              >
                <v-icon size="64" color="primary" class="mb-4">
                  mdi-vote
                </v-icon>
                <h3 class="text-h5 mb-4">Urna Eletrônica</h3>
                <p class="text-body-1 grey--text">
                  Acesse a urna eletrônica para realizar seu voto de forma segura e transparente.
                </p>
                <v-btn
                  color="primary"
                  size="large"
                  class="mt-4"
                  @click="$router.push('/urna')"
                >
                  Votar Agora
                </v-btn>
              </v-card>
            </v-col>

            <v-col cols="12" md="6" class="text-center">
              <v-card
                elevation="2"
                class="pa-6 h-100"
                hover
                @click="$router.push('/login')"
              >
                <v-icon size="64" color="secondary" class="mb-4">
                  mdi-cog
                </v-icon>
                <h3 class="text-h5 mb-4">Painel Administrativo</h3>
                <p class="text-body-1 grey--text">
                  Acesse o painel para administradores e mesários gerenciarem as eleições.
                </p>
                <v-btn
                  color="secondary"
                  size="large"
                  class="mt-4"
                  @click="$router.push('/login')"
                >
                  Acessar Painel
                </v-btn>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-8" />

          <v-row>
            <v-col cols="12" md="4" class="text-center">
              <v-icon size="48" color="success" class="mb-2">
                mdi-shield-check
              </v-icon>
              <h4 class="text-h6 mb-2">Seguro</h4>
              <p class="text-body-2 grey--text">
                Sistema com múltiplas camadas de segurança e criptografia.
              </p>
            </v-col>
            
            <v-col cols="12" md="4" class="text-center">
              <v-icon size="48" color="info" class="mb-2">
                mdi-eye-off
              </v-icon>
              <h4 class="text-h6 mb-2">Anônimo</h4>
              <p class="text-body-2 grey--text">
                Votos são registrados de forma anônima, garantindo o sigilo.
              </p>
            </v-col>
            
            <v-col cols="12" md="4" class="text-center">
              <v-icon size="48" color="warning" class="mb-2">
                mdi-chart-line
              </v-icon>
              <h4 class="text-h6 mb-2">Transparente</h4>
              <p class="text-body-2 grey--text">
                Resultados em tempo real e auditoria completa do processo.
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  methods: {
    async handleLogout() {
      const authStore = useAuthStore()
      await authStore.logout()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.home-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 12px;
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-4px);
}
</style>

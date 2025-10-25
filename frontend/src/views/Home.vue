<template>
  <v-container fluid class="home-container pa-0">
    <v-app-bar color="primary" dark elevation="4" density="comfortable">
      <v-app-bar-title class="d-flex align-center header-title">
        <v-icon class="mr-2">mdi-vote</v-icon>
        <span class="d-none d-sm-inline">Vota Aí! - Sistema de Votação Acadêmica</span>
        <span class="d-inline d-sm-none">Vota Aí!</span>
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-btn
        v-if="!authStore.isAuthenticated"
        color="white"
        variant="text"
        @click="$router.push('/login')"
        size="small"
      >
        <v-icon :left="$vuetify.display.smAndUp">mdi-login</v-icon>
        <span class="d-none d-sm-inline ml-1">Login</span>
      </v-btn>
      
      <v-menu v-else>
        <template v-slot:activator="{ props }">
          <v-btn color="white" variant="text" v-bind="props" size="small">
            <v-icon :left="$vuetify.display.smAndUp">mdi-account</v-icon>
            <span class="d-none d-sm-inline ml-1">{{ authStore.userName }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="handleLogout">
            <v-list-item-title>
              <v-icon class="mr-2">mdi-logout</v-icon>
              Sair
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-container class="pt-6 pt-md-12">
      <v-row justify="center">
        <v-col cols="12" sm="11" md="10" lg="9" xl="8">
          <v-card elevation="4" class="pa-4 pa-sm-6 pa-md-8">
          <v-row class="mt-4 mt-md-8">
            <v-col cols="12" md="6" class="mb-4 mb-md-0">
              <v-card
                elevation="2"
                class="pa-4 pa-sm-6 h-100 d-flex flex-column"
                hover
                @click="$router.push('/urna')"
              >
                <v-icon size="48" size-sm="64" color="primary" class="mb-3 mb-sm-4">
                  mdi-vote
                </v-icon>
                <h3 class="text-h6 text-sm-h5 mb-2 mb-sm-4">Urna Eletrônica</h3>
                <p class="text-body-2 text-sm-body-1 mb-4 flex-grow-1" style="color: #666;">
                  Acesse a urna eletrônica para realizar seu voto de forma segura e transparente.
                </p>
                <v-btn
                  color="primary"
                  size="large"
                  block
                  class="mt-auto"
                  @click.stop="$router.push('/urna')"
                >
                  Votar Agora
                </v-btn>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card
                elevation="2"
                class="pa-4 pa-sm-6 h-100 d-flex flex-column"
                hover
                @click="$router.push('/login')"
              >
                <v-icon size="48" size-sm="64" color="secondary" class="mb-3 mb-sm-4">
                  mdi-cog
                </v-icon>
                <h3 class="text-h6 text-sm-h5 mb-2 mb-sm-4">Painel Administrativo</h3>
                <p class="text-body-2 text-sm-body-1 mb-4 flex-grow-1" style="color: #666;">
                  Acesse o painel para administradores e mesários gerenciarem as eleições.
                </p>
                <v-btn
                  color="secondary"
                  size="large"
                  block
                  class="mt-auto"
                  @click.stop="$router.push('/login')"
                >
                  Acessar Painel
                </v-btn>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-6 my-md-8" />

          <v-row>
            <v-col cols="12" sm="4" class="text-center mb-4 mb-sm-0">
              <v-icon size="40" size-sm="48" color="success" class="mb-2">
                mdi-shield-check
              </v-icon>
              <h4 class="text-subtitle-1 text-sm-h6 mb-2 font-weight-bold">Seguro</h4>
              <p class="text-body-2" style="color: #666;">
                Sistema com múltiplas camadas de segurança e criptografia.
              </p>
            </v-col>
            
            <v-col cols="12" sm="4" class="text-center mb-4 mb-sm-0">
              <v-icon size="40" size-sm="48" color="info" class="mb-2">
                mdi-eye-off
              </v-icon>
              <h4 class="text-subtitle-1 text-sm-h6 mb-2 font-weight-bold">Anônimo</h4>
              <p class="text-body-2" style="color: #666;">
                Votos são registrados de forma anônima, garantindo o sigilo.
              </p>
            </v-col>
            
            <v-col cols="12" sm="4" class="text-center">
              <v-icon size="40" size-sm="48" color="warning" class="mb-2">
                mdi-chart-line
              </v-icon>
              <h4 class="text-subtitle-1 text-sm-h6 mb-2 font-weight-bold">Transparente</h4>
              <p class="text-body-2" style="color: #666;">
                Resultados em tempo real e auditoria completa do processo.
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    </v-container>
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
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 12px;
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-4px);
}

/* Estilo para o título do cabeçalho */
.header-title {
  font-size: 1.25rem;
  font-weight: 500;
}

@media (max-width: 959px) {
  .header-title {
    font-size: 1rem;
  }
}

/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.3;
}

/* Título principal */
.main-title {
  line-height: 1.4;
  margin-bottom: 8px;
  padding: 0;
  word-wrap: break-word;
  white-space: normal;
}

.subtitle-text {
  line-height: 1.5;
  word-wrap: break-word;
  white-space: normal;
}

/* Títulos específicos em cards */
.v-card h3, .v-card h4 {
  min-height: 1.5em;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* Mobile optimizations */
@media (max-width: 599px) {
  .v-card {
    border-radius: 8px;
  }
  
  .v-btn {
    font-size: 0.875rem;
  }
}

/* Ensure proper spacing on small devices */
@media (max-width: 959px) {
  .v-app-bar-title {
    font-size: 1rem;
  }
}
</style>

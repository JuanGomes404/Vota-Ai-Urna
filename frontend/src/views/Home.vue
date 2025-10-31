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
      
      <v-menu v-else location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn 
            color="white" 
            variant="text" 
            v-bind="props" 
            size="small"
          >
            <v-icon :left="$vuetify.display.smAndUp">mdi-account</v-icon>
            <span class="d-none d-sm-inline ml-1">{{ authStore.userName }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="handleLogout">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-container class="pt-4 pt-sm-6 pt-md-12 px-2 px-sm-3">
      <v-row justify="center">
        <v-col cols="12" sm="11" md="10" lg="9" xl="8">
          <v-card elevation="4" class="main-card pa-3 pa-sm-6 pa-md-8">
          <v-row class="mt-2 mt-sm-4 mt-md-8">
            <v-col cols="12" md="6" class="mb-3 mb-md-4">
              <v-card
                elevation="2"
                class="action-card pa-4 pa-sm-6 h-100 d-flex flex-column"
                hover
                @click="$router.push('/urna')"
              >
                <v-icon :size="iconSize" color="primary" class="mb-3 mb-sm-4">
                  mdi-vote
                </v-icon>
                <h3 class="card-title text-h6 text-sm-h5 mb-2 mb-sm-4">Urna Eletrônica</h3>
                <p class="card-description text-body-2 text-sm-body-1 mb-3 mb-sm-4 flex-grow-1">
                  Acesse a urna eletrônica para realizar seu voto de forma segura e transparente.
                </p>
                <v-btn
                  color="primary"
                  size="large"
                  block
                  class="mt-auto text-none"
                  @click.stop="$router.push('/urna')"
                >
                  Votar Agora
                </v-btn>
              </v-card>
            </v-col>

            <v-col cols="12" md="6" class="mb-3 mb-md-4">
              <v-card
                elevation="2"
                class="action-card pa-4 pa-sm-6 h-100 d-flex flex-column"
                hover
                @click="$router.push('/login')"
              >
                <v-icon :size="iconSize" color="secondary" class="mb-3 mb-sm-4">
                  mdi-cog
                </v-icon>
                <h3 class="card-title text-h6 text-sm-h5 mb-2 mb-sm-4">Painel Administrativo</h3>
                <p class="card-description text-body-2 text-sm-body-1 mb-3 mb-sm-4 flex-grow-1">
                  Acesse o painel para administradores e mesários gerenciarem as eleições.
                </p>
                <v-btn
                  color="secondary"
                  size="large"
                  block
                  class="mt-auto text-none"
                  @click.stop="$router.push('/login')"
                >
                  Acessar Painel
                </v-btn>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-4 my-sm-6 my-md-8" />

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
import { useDisplay } from 'vuetify'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    const display = useDisplay()
    return { authStore, display }
  },
  computed: {
    iconSize() {
      // Responsivo: menor em mobile, maior em desktop
      return this.display.xs ? 40 : this.display.sm ? 48 : 64
    }
  },
  methods: {
    async handleLogout() {
      const authStore = useAuthStore()
      try {
        await authStore.logout()
        // Redirecionar com parâmetro de sucesso
        this.$router.push({ path: '/login', query: { logout: 'success' } })
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        // Mesmo com erro, redirecionar
        this.$router.push({ path: '/login', query: { logout: 'success' } })
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  min-height: 100vh;
}

.main-card {
  border-radius: 16px;
}

.action-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.card-title {
  color: #1a1a1a;
  font-weight: 600;
}

.card-description {
  color: #666;
  line-height: 1.6;
}

.header-title {
  font-size: 1rem;
  font-weight: 500;
}

/* Mobile optimizations */
@media (max-width: 599px) {
  .main-card {
    border-radius: 12px;
  }
  
  .action-card {
    border-radius: 8px;
    min-height: auto;
  }
  
  .action-card:hover {
    transform: none; /* Desabilita hover em mobile */
  }
  
  .action-card:active {
    transform: scale(0.98);
  }
  
  .header-title {
    font-size: 0.9rem;
  }
  
  .card-title {
    font-size: 1.1rem !important;
  }
  
  .card-description {
    font-size: 0.875rem !important;
    line-height: 1.5;
  }
}

/* Tablets */
@media (min-width: 600px) and (max-width: 959px) {
  .header-title {
    font-size: 1.1rem;
  }
}

/* Desktop */
@media (min-width: 960px) {
  .header-title {
    font-size: 1.25rem;
  }
}
</style>

<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>
        <v-icon left>mdi-account-tie</v-icon>
        Painel do Mesário
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-menu>
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

    <v-main>
      <v-container fluid class="pa-8">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 font-weight-bold mb-6">
              PAINEL DO MESÁRIO
            </h1>
            <p class="text-h6 grey--text mb-6">
              Eleição DCE UNIRIO 2025
            </p>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <v-card elevation="8" class="pa-8">
              <v-card-title class="text-center mb-6">
                <h2 class="text-h5 font-weight-bold">
                  Digite a Matrícula do Eleitor:
                </h2>
              </v-card-title>

              <v-form @submit.prevent="buscarEleitor" ref="formEleitor">
                <v-text-field
                  v-model="matricula"
                  label="Matrícula"
                  prepend-inner-icon="mdi-card-account-details"
                  variant="outlined"
                  size="large"
                  :rules="[rules.required, rules.matricula]"
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
                    size="large"
                    :loading="loading"
                    class="px-8"
                  >
                    <v-icon left>mdi-magnify</v-icon>
                    BUSCAR ELEITOR
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>
        </v-row>

        <!-- Resultado da busca -->
        <v-row v-if="eleitor" justify="center" class="mt-6">
          <v-col cols="12" md="8" lg="6">
            <v-card elevation="8" class="pa-6">
              <v-card-title class="text-center mb-4">
                <h3 class="text-h5 font-weight-bold">Dados do Eleitor</h3>
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :value="eleitor.nome"
                      label="Nome"
                      readonly
                      variant="outlined"
                      class="mb-4"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-text-field
                      :value="eleitor.matricula"
                      label="Matrícula"
                      readonly
                      variant="outlined"
                      class="mb-4"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-text-field
                      :value="eleitor.curso"
                      label="Curso"
                      readonly
                      variant="outlined"
                      class="mb-4"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-chip
                      :color="eleitor.jaVotou ? 'error' : 'success'"
                      size="large"
                      class="mb-4"
                    >
                      <v-icon left>
                        {{ eleitor.jaVotou ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
                      </v-icon>
                      STATUS: {{ eleitor.jaVotou ? 'JÁ VOTOU' : 'APTO A VOTAR' }}
                    </v-chip>
                  </v-col>
                </v-row>

                <div v-if="!eleitor.jaVotou" class="text-center mt-6">
                  <v-btn
                    color="success"
                    size="x-large"
                    :loading="loadingHabilitar"
                    @click="habilitarEleitor"
                    class="px-8"
                  >
                    <v-icon left>mdi-check-circle</v-icon>
                    AUTORIZAR VOTO
                  </v-btn>
                </div>

                <div v-else class="text-center mt-6">
                  <v-alert type="warning" class="mb-4">
                    Este eleitor já votou e não pode votar novamente.
                  </v-alert>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog para mostrar credencial -->
        <v-dialog v-model="dialogCredencial" max-width="400">
          <v-card>
            <v-card-title class="text-center">
              <h3 class="text-h5">Credencial Gerada</h3>
            </v-card-title>
            
            <v-card-text class="text-center">
              <v-icon size="64" color="success" class="mb-4">
                mdi-key
              </v-icon>
              <p class="text-h6 font-weight-bold mb-4">
                {{ credencialGerada }}
              </p>
              <p class="text-body-2 grey--text">
                Forneça esta credencial ao eleitor para que ele possa votar.
              </p>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                @click="dialogCredencial = false"
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { mesarioService } from '@/services/mesarioService'

export default {
  name: 'MesarioDashboard',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      matricula: '',
      eleitor: null,
      loading: false,
      loadingHabilitar: false,
      error: null,
      dialogCredencial: false,
      credencialGerada: '',
      rules: {
        required: value => !!value || 'Campo obrigatório',
        matricula: value => {
          if (!value) return true
          return value.length >= 8 || 'Matrícula deve ter pelo menos 8 caracteres'
        }
      }
    }
  },
  methods: {
    async buscarEleitor() {
      const { valid } = await this.$refs.formEleitor.validate()
      if (!valid) return

      this.loading = true
      this.error = null
      this.eleitor = null

      try {
        const response = await mesarioService.buscarEleitor(this.matricula)
        this.eleitor = response.eleitor
      } catch (error) {
        this.error = error.error || 'Eleitor não encontrado'
      } finally {
        this.loading = false
      }
    },
    async habilitarEleitor() {
      if (!this.eleitor) return

      this.loadingHabilitar = true
      this.error = null

      try {
        const response = await mesarioService.habilitarEleitor(this.matricula)
        this.credencialGerada = response.credencial
        this.dialogCredencial = true
        
        // Atualizar status do eleitor
        this.eleitor.jaVotou = true
      } catch (error) {
        this.error = error.error || 'Erro ao habilitar eleitor'
      } finally {
        this.loadingHabilitar = false
      }
    },
    async handleLogout() {
      await this.authStore.logout()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>

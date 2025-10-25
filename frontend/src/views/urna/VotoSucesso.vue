<template>
  <v-container fluid class="sucesso-container pa-4">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card elevation="12" class="pa-4 pa-sm-6 pa-md-8 text-center">
          <v-icon size="80" size-sm="100" size-md="120" color="success" class="mb-4 mb-md-6">
            mdi-check-circle
          </v-icon>

          <v-card-title class="text-center mb-4 px-0">
            <h1 class="text-h6 text-sm-h5 text-md-h4 text-lg-h3 font-weight-bold" style="color: #00843D;">
              VOTO REGISTRADO COM SUCESSO!
            </h1>
          </v-card-title>

          <v-card-text class="mb-4 mb-md-6 px-0">
            <p class="text-body-1 text-sm-h6" style="color: #666;">
              Obrigado por participar da eleição.
            </p>
            <p class="text-body-2 text-sm-body-1 mt-2" style="color: #666;">
              Seu voto foi registrado de forma segura e anônima.
            </p>
          </v-card-text>

          <v-progress-linear
            :model-value="progresso"
            color="success"
            height="8"
            rounded
            class="mb-3 mb-md-4"
          />

          <p class="text-body-2 text-sm-body-1" style="color: #666;">
            Esta tela será reiniciada em {{ tempoRestante }} segundos...
          </p>

          <v-divider class="my-4 my-md-6" />

          <v-btn
            color="primary"
            size="large"
            @click="voltarInicio"
            class="px-6 px-sm-8"
            block
          >
            <v-icon class="mr-2">mdi-home</v-icon>
            Voltar ao Início
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'VotoSucesso',
  data() {
    return {
      tempoRestante: 10,
      progresso: 100,
      intervalId: null
    }
  },
  mounted() {
    this.iniciarContagem()
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    iniciarContagem() {
      this.intervalId = setInterval(() => {
        this.tempoRestante--
        this.progresso = (this.tempoRestante / 10) * 100

        if (this.tempoRestante <= 0) {
          this.voltarInicio()
        }
      }, 1000)
    },
    voltarInicio() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
      this.$router.push('/urna')
    }
  }
}
</script>

<style scoped>
/* Garantir que títulos não sejam cortados */
h1, h2, h3, h4, h5, h6 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.2;
}

.sucesso-container {
  background: linear-gradient(135deg, #00843D 0%, #4CAF50 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 20px;
}

/* Mobile optimizations */
@media (max-width: 599px) {
  .v-card {
    border-radius: 12px;
  }
}
</style>

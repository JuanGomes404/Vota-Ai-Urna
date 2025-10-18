<template>
  <v-container fluid class="sucesso-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="12" class="pa-8 text-center">
          <v-icon size="120" color="success" class="mb-6">
            mdi-check-circle
          </v-icon>

          <v-card-title class="text-center mb-4">
            <h1 class="text-h3 font-weight-bold success--text">
              VOTO REGISTRADO COM SUCESSO!
            </h1>
          </v-card-title>

          <v-card-text class="mb-6">
            <p class="text-h6 grey--text">
              Obrigado por participar da eleição.
            </p>
            <p class="text-body-1 grey--text mt-2">
              Seu voto foi registrado de forma segura e anônima.
            </p>
          </v-card-text>

          <v-progress-linear
            :model-value="progresso"
            color="success"
            height="8"
            rounded
            class="mb-4"
          />

          <p class="text-body-2 grey--text">
            Esta tela será reiniciada em {{ tempoRestante }} segundos...
          </p>

          <v-divider class="my-6" />

          <v-btn
            color="primary"
            size="large"
            @click="voltarInicio"
            class="px-8"
          >
            <v-icon left>mdi-home</v-icon>
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
.sucesso-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 20px;
}
</style>

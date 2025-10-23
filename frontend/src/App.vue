<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* Mobile-first responsive utilities */
* {
  box-sizing: border-box;
}

/* Ensure all containers are responsive */
.v-container {
  padding-left: 12px;
  padding-right: 12px;
}

@media (min-width: 600px) {
  .v-container {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (min-width: 960px) {
  .v-container {
    padding-left: 24px;
    padding-right: 24px;
  }
}

/* Ensure buttons are touch-friendly on mobile */
.v-btn {
  min-height: 44px;
}

/* Ensure text is readable on mobile */
body {
  font-size: 16px;
  line-height: 1.5;
}

/* ========================================
   PADRONIZAÇÃO DE DIÁLOGOS (v-dialog)
   ======================================== */

/* Estilo base para todos os cards dentro de diálogos */
.v-dialog .v-card {
  border-radius: 16px !important;
  overflow: hidden;
}

/* Títulos de diálogo padronizados */
.v-dialog .v-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Conteúdo de diálogo padronizado */
.v-dialog .v-card-text {
  padding: 24px;
  font-size: 1rem;
  line-height: 1.6;
}

/* Ações de diálogo padronizadas */
.v-dialog .v-card-actions {
  padding: 16px 24px;
  gap: 12px;
}

/* Botões dentro de diálogos */
.v-dialog .v-card-actions .v-btn {
  min-width: 100px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Formulários dentro de diálogos */
.v-dialog .v-form .v-text-field,
.v-dialog .v-form .v-textarea {
  margin-bottom: 16px;
}

/* Alerts dentro de diálogos */
.v-dialog .v-alert {
  border-radius: 8px;
  font-size: 0.95rem;
}

/* ========================================
   ANIMAÇÕES DE TRANSIÇÃO
   ======================================== */

.v-dialog {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-dialog--active {
  animation: dialogFadeIn 0.3s ease-out;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========================================
   RESPONSIVIDADE DE DIÁLOGOS
   ======================================== */

@media (max-width: 600px) {
  .v-dialog .v-card-title {
    font-size: 1.25rem;
    padding: 20px 16px;
  }
  
  .v-dialog .v-card-text {
    padding: 16px;
  }
  
  .v-dialog .v-card-actions {
    padding: 12px 16px;
    flex-direction: column;
  }
  
  .v-dialog .v-card-actions .v-btn {
    width: 100%;
  }
}
</style>

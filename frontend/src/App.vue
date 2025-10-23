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
</style>

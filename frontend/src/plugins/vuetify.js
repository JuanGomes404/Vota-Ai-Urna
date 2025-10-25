import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // UNIRIO Color Palette
          primary: '#005A9C',      // Azul UNIRIO
          secondary: '#00843D',    // Verde UNIRIO
          accent: '#FDB913',       // Amarelo UNIRIO
          background: '#FFFFFF',   // Branco
          surface: '#FFFFFF',
          error: '#D32F2F',
          info: '#0277BD',
          success: '#00843D',      // Verde UNIRIO
          warning: '#FDB913',      // Amarelo UNIRIO
        },
      },
    },
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    'vuetify-nuxt-module'
  ],

  devtools: {
    enabled: true
  },

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/css/main.css'
  ],

  build: {
    transpile: ['vuetify']
  },

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  vuetify: {
    moduleOptions: {
      prefixComposables: false
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#00A155',
              'on-primary': '#ffffff',
              secondary: '#007F45',
              'on-secondary': '#ffffff',
              surface: '#ffffff',
              'on-surface': '#1a1a1a',
              background: '#ffffff',
              'on-background': '#1a1a1a',
              error: '#ef4444',
              'on-error': '#ffffff',
              info: '#3b82f6',
              success: '#22c55e',
              warning: '#f59e0b'
            }
          },
          dark: {
            dark: true,
            colors: {
              primary: '#4ade80',
              'on-primary': '#0a0a0a',
              secondary: '#22c55e',
              'on-secondary': '#0a0a0a',
              surface: '#1b1718',
              'on-surface': '#e0e0e0',
              background: '#0a0a0a',
              'on-background': '#e0e0e0',
              error: '#ef4444',
              'on-error': '#ffffff',
              info: '#3b82f6',
              success: '#22c55e',
              warning: '#f59e0b'
            }
          }
        }
      }
    }
  }
})

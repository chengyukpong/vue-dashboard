// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'vuetify-nuxt-module'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  build: {
    transpile: ['@vuetify/v0']
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
      prefixComposables: true
    }
  }
})

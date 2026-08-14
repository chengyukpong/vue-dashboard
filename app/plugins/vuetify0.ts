import { createThemePlugin } from '@vuetify/v0'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    createThemePlugin({
      default: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            'primary': '#16a34a',
            'surface': '#ffffff',
            'on-primary': '#ffffff',
            'on-surface': '#212121'
          }
        },
        dark: {
          dark: true,
          colors: {
            'primary': '#4ade80',
            'surface': '#1e1e1e',
            'on-primary': '#1a1a1a',
            'on-surface': '#e0e0e0'
          }
        }
      }
    })
  )
})

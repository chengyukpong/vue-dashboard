<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<template>
  <VApp>
    <VMain>
      <div class="d-flex flex-column align-center justify-center h-screen ga-4 text-center">
        <h1 class="text-h2 font-weight-bold">
          {{ error.statusCode }}
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          {{ error.statusMessage || 'We are sorry but this page could not be found.' }}
        </p>
        <VBtn
          color="primary"
          @click="clearError({ redirect: '/' })"
        >
          Back to home
        </VBtn>
      </div>
    </VMain>
  </VApp>
</template>

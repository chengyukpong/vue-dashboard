<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{ items: DropdownMenuItem[] }>()
</script>

<template>
  <div class="text-right">
    <UDropdownMenu :items="items" :content="{ align: 'end' }">
      <UButton
        icon="i-lucide-ellipsis-vertical"
        color="neutral"
        variant="ghost"
        class="ml-auto"
      />
    </UDropdownMenu>
  </div>
</template>

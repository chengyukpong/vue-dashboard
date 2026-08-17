<script setup lang="ts">
defineProps<{ items: any[] }>()
</script>

<template>
  <div class="d-flex justify-end">
    <VMenu>
      <template #activator="{ props }">
        <VBtn
          v-bind="props"
          icon="mdi-dots-vertical"
          variant="text"
          size="small"
        />
      </template>
      <VList density="compact" min-width="200">
        <template v-for="(item, i) in items" :key="i">
          <VDivider v-if="item.type === 'separator'" />
          <VListItem
            v-else
            :prepend-icon="item.icon"
            :title="item.label"
            :base-color="item.color === 'error' ? 'error' : undefined"
            link
            @click="item.onSelect?.()"
          />
        </template>
      </VList>
    </VMenu>
  </div>
</template>

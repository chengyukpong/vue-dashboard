<script setup lang="ts">
const props = withDefaults(defineProps<{
  ids?: number[]
}>(), {
  ids: () => []
})

const toast = useToast()
const { remove } = useCustomers()
const emit = defineEmits<{ deleted: [] }>()
const open = ref(false)

async function onSubmit() {
  try {
    await remove(props.ids)
    emit('deleted')
    toast.add({
      title: 'Customers deleted',
      description: `${props.ids.length} customer${props.ids.length > 1 ? 's' : ''} have been deleted.`
    })
    open.value = false
  } catch {
    toast.add({
      title: 'Delete failed',
      description: 'The customers could not be deleted.',
      color: 'error'
    })
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${ids.length} customer${ids.length > 1 ? 's' : ''}`"
    :description="`Are you sure, this action cannot be undone.`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>

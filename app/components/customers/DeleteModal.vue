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
      text: `${props.ids.length} customer${props.ids.length > 1 ? 's' : ''} have been deleted.`
    })
    open.value = false
  } catch {
    toast.add({
      title: 'Delete failed',
      text: 'The customers could not be deleted.'
    })
  }
}
</script>

<template>
  <VDialog v-model="open" max-width="420">
    <template #activator="{ props: activatorProps }">
      <VBtn
        v-if="ids.length"
        v-bind="activatorProps"
        color="error"
        variant="tonal"
        prepend-icon="mdi-delete"
      >
        Delete
        <VChip size="small" class="ml-2">
          {{ ids.length }}
        </VChip>
      </VBtn>
    </template>
    <VCard :title="`Delete ${ids.length} customer${ids.length > 1 ? 's' : ''}`">
      <VCardText>
        Are you sure? This action cannot be undone.
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="open = false">
          Cancel
        </VBtn>
        <VBtn color="error" variant="flat" @click="onSubmit">
          Delete
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type { User } from '~/types'

const toast = useToast()
const { data, status, refresh, remove } = useCustomers()

if (data.value.length === 0 && status.value === 'idle') {
  await refresh()
}

const selected = ref<User['id'][]>([])
const dialog = ref(false)

const headers = [
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Email', key: 'email' },
  { title: 'Location', key: 'location', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
]

const statusColor = (status: User['status']) => ({
  subscribed: 'success',
  unsubscribed: 'error',
  bounced: 'warning'
})[status]

async function onDelete() {
  try {
    await remove(selected.value)
    toast.add({
      title: 'Customers deleted',
      description: `${selected.value.length} customer${selected.value.length > 1 ? 's' : ''} have been deleted.`
    })
    selected.value = []
    dialog.value = false
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
  <VApp class="flex-1 min-w-0">
    <div class="pa-4 d-flex flex-column">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <div class="text-h6 font-weight-bold">
            Customers (Vuetify)
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ selected.length }} row(s) selected.
          </div>
        </div>

        <VBtn
          v-if="selected.length"
          color="error"
          variant="tonal"
          @click="dialog = true"
        >
          Delete ({{ selected.length }})
        </VBtn>
      </div>

      <VDataTable
        v-model="selected"
        :headers="headers"
        :items="data"
        item-value="id"
        show-select
        hover
        :loading="status === 'pending'"
        :items-per-page="10"
        :items-per-page-options="[5, 10, 25, 50]"
        @click:row="(_event: Event, { internalItem, toggleSelect }: any) => toggleSelect(internalItem)"
      >
        <template #[`item.name`]="{ item }">
          <div class="d-flex align-center ga-3">
            <VAvatar :image="item.avatar?.src" size="36" />
            <div>
              <div class="font-weight-medium">
                {{ item.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                @{{ item.name }}
              </div>
            </div>
          </div>
        </template>

        <template #[`item.status`]="{ item }">
          <VChip :color="statusColor(item.status)" size="small">
            {{ item.status }}
          </VChip>
        </template>
      </VDataTable>

      <VDialog v-model="dialog" max-width="420">
        <VCard title="Delete customers">
          <VCardText>
            Are you sure? This action cannot be undone.
          </VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn variant="text" @click="dialog = false">
              Cancel
            </VBtn>
            <VBtn color="error" @click="onDelete">
              Delete
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </div>
  </VApp>
</template>

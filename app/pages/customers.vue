<script setup lang="ts">
import { upperFirst } from 'scule'
import type { User } from '~/types'

const toast = useToast()
const search = ref('')
const statusFilter = ref('all')

const { data, status, refresh, remove } = useCustomers()

if (data.value.length === 0 && status.value === 'idle') {
  await refresh()
}

const selected = ref<User[]>([])

async function deleteCustomer(row: User) {
  try {
    await remove([row.id])
    selected.value = selected.value.filter(s => s.id !== row.id)
    toast.add({
      title: 'Customer deleted',
      text: `${row.name} has been deleted.`
    })
  } catch {
    toast.add({
      title: 'Delete failed',
      text: 'The customer could not be deleted.',
      color: 'error'
    })
  }
}

function getRowItems(row: User) {
  return [
    { type: 'label' as const, label: 'Actions' },
    {
      label: 'Copy customer ID',
      icon: 'mdi-content-copy',
      onSelect() {
        navigator.clipboard.writeText(row.id.toString())
        toast.add({
          title: 'Copied to clipboard',
          text: 'Customer ID copied to clipboard'
        })
      }
    },
    { type: 'separator' as const },
    {
      label: 'View customer details',
      icon: 'mdi-format-list-bulleted'
    },
    {
      label: 'View customer payments',
      icon: 'mdi-wallet'
    },
    { type: 'separator' as const },
    {
      label: 'Delete customer',
      icon: 'mdi-delete',
      color: 'error',
      onSelect() {
        deleteCustomer(row)
      }
    }
  ]
}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Location', key: 'location' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const }
]

const statusColor = (status: User['status']) => ({
  subscribed: 'success',
  unsubscribed: 'error',
  bounced: 'warning'
})[status]

const filteredData = computed(() => {
  if (statusFilter.value === 'all') return data.value
  return data.value.filter(item => item.status === statusFilter.value)
})

const selectedIds = computed(() => selected.value.map(s => s.id))

const columnItems = computed(() => {
  return headers
    .filter(h => h.key !== 'actions' && h.key !== 'id')
    .map(h => ({
      label: upperFirst(h.key),
      key: h.key,
      visible: true
    }))
})
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h5 font-weight-bold">
        Customers
      </h1>
      <CustomersAddModal />
    </div>

    <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-4">
      <VTextField
        v-model="search"
        density="compact"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        placeholder="Filter emails..."
        hide-details
        style="max-width: 300px"
      />

      <div class="d-flex align-center ga-2">
        <CustomersDeleteModal :ids="selectedIds" @deleted="selected = []">
          <template v-if="selected.length">
            <VBtn color="error" variant="tonal" prepend-icon="mdi-delete">
              Delete
              <VChip size="small" class="ml-2">
                {{ selected.length }}
              </VChip>
            </VBtn>
          </template>
        </CustomersDeleteModal>

        <VSelect
          v-model="statusFilter"
          :items="[
            { title: 'All', value: 'all' },
            { title: 'Subscribed', value: 'subscribed' },
            { title: 'Unsubscribed', value: 'unsubscribed' },
            { title: 'Bounced', value: 'bounced' }
          ]"
          item-title="title"
          item-value="value"
          density="compact"
          variant="outlined"
          hide-details
          style="max-width: 180px"
        />
      </div>
    </div>

    <VCard variant="flat" border>
      <VDataTable
        v-model="selected"
        :headers="headers"
        :items="filteredData"
        :search="search"
        :loading="status === 'pending'"
        item-value="id"
        show-select
        hover
        :items-per-page="10"
        :items-per-page-options="[5, 10, 25, 50]"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center ga-3">
            <VAvatar size="36" :image="item.avatar?.src" />
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

        <template #item.status="{ item }">
          <VChip :color="statusColor(item.status)" size="small" class="text-capitalize">
            {{ item.status }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <VMenu>
            <template #activator="{ props }">
              <VBtn v-bind="props" icon="mdi-dots-vertical" variant="text" size="small" />
            </template>
            <VList density="compact" min-width="200">
              <template v-for="(menuItem, i) in getRowItems(item)" :key="i">
                <VDivider v-if="menuItem.type === 'separator'" />
                <VListItem
                  v-else-if="menuItem.type !== 'label'"
                  :prepend-icon="menuItem.icon"
                  :title="menuItem.label"
                  :base-color="menuItem.color === 'error' ? 'error' : undefined"
                  link
                  @click="menuItem.onSelect?.()"
                />
              </template>
            </VList>
          </VMenu>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>

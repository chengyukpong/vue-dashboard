<script setup lang="ts">
import { createDataTable, Pagination } from '@vuetify/v0'
import type { User } from '~/types'

const toast = useToast()
const { data, status, refresh, remove } = useCustomers()

if (data.value.length === 0 && status.value === 'idle') {
  await refresh()
}

type UserRow = User & Record<string, unknown>

const table = createDataTable<UserRow>({
  pagination: { itemsPerPage: 10 }
})

table.columns.onboard([
  { id: 'name', title: 'Name' },
  { id: 'email', title: 'Email', sortable: true, filterable: true },
  { id: 'location', title: 'Location' },
  { id: 'status', title: 'Status', filterable: true }
])

watch(data, (rows) => {
  table.clear()
  table.onboard(rows.map(row => ({ id: row.id, value: row as UserRow })))
}, { immediate: true })

const search = computed({
  get: () => table.query.value,
  set: (value: string) => table.search(value)
})

const page = ref(1)

watch(() => table.pagination.page.value, (p) => {
  if (p !== page.value) {
    page.value = p
  }
})

watch(page, (p) => {
  table.pagination.select(p)
})

const selectedIds = computed<number[]>(() => [...table.selection.selectedIds] as number[])
const selectedCount = computed(() => table.selection.selectedIds.size)

const dialog = ref(false)

async function onDelete() {
  try {
    await remove(selectedIds.value)
    table.selection.unselectAll()
    toast.add({
      title: 'Customers deleted',
      description: `${selectedIds.value.length} customer${selectedIds.value.length > 1 ? 's' : ''} have been deleted.`
    })
    dialog.value = false
  } catch {
    toast.add({
      title: 'Delete failed',
      description: 'The customers could not be deleted.',
      color: 'error'
    })
  }
}

const paginationBtnClass = 'min-w-7 h-7 flex items-center justify-center border border-default rounded text-xs bg-surface hover:bg-elevated disabled:opacity-50 disabled:cursor-not-allowed'
const paginationPageBtnClass = `${paginationBtnClass} data-[selected]:bg-primary data-[selected]:border-primary data-[selected]:text-white`
const paginationEllipsisClass = 'min-w-7 flex items-center justify-center text-xs opacity-60'

const statusColor = (status: User['status']) => ({
  subscribed: 'success',
  unsubscribed: 'error',
  bounced: 'warning'
})[status]

const sortArrow = (id: string) => {
  const direction = table.sort.direction(id)
  return direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↕'
}
</script>

<template>
  <VApp class="flex-1 min-w-0">
    <div class="pa-4 d-flex flex-column">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <div class="text-h6 font-weight-bold">
            Customers (Vuetify Zero)
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ selectedCount }} row(s) selected.
          </div>
        </div>

        <div class="d-flex align-center ga-2">
          <VTextField
            v-model="search"
            label="Search"
            density="compact"
            hide-details
            style="max-width: 220px"
          />
          <VBtn
            v-if="selectedCount"
            color="error"
            variant="tonal"
            @click="dialog = true"
          >
            Delete ({{ selectedCount }})
          </VBtn>
        </div>
      </div>

      <VTable hover>
        <thead>
          <tr>
            <th style="width: 48px">
              <VCheckbox
                :model-value="table.selection.isAllSelected.value"
                :indeterminate="table.selection.isMixed.value"
                :aria-label="'Select all'"
                hide-details
                @update:model-value="value => value ? table.selection.toggleAll() : table.selection.unselectAll()"
              />
            </th>
            <th>Name</th>
            <th>
              <VBtn
                size="x-small"
                variant="text"
                class="text-none text-body-2"
                @click="table.sort.toggle('email')"
              >
                Email {{ sortArrow('email') }}
              </VBtn>
            </th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="status === 'pending'">
            <td colspan="5" class="text-center text-medium-emphasis">
              Loading...
            </td>
          </tr>
          <tr
            v-for="row in table.items.value"
            :key="row.id"
            class="cursor-pointer"
            @click="table.selection.toggle(row.id)"
          >
            <td @click.stop>
              <VCheckbox
                :model-value="table.selection.isSelected(row.id)"
                :aria-label="`Select ${row.name}`"
                hide-details
                @update:model-value="() => table.selection.toggle(row.id)"
              />
            </td>
            <td>
              <div class="d-flex align-center ga-3">
                <VAvatar :image="row.avatar?.src" size="36" />
                <div>
                  <div class="font-weight-medium">
                    {{ row.name }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    @{{ row.name }}
                  </div>
                </div>
              </div>
            </td>
            <td>{{ row.email }}</td>
            <td>{{ row.location }}</td>
            <td>
              <VChip :color="statusColor(row.status)" size="small">
                {{ row.status }}
              </VChip>
            </td>
          </tr>
        </tbody>
      </VTable>

      <div class="d-flex align-center justify-space-between pa-2 text-caption">
        <span>
          {{ table.items.value.length }} of {{ table.allItems.value.length }} row(s) — page
          {{ table.pagination.page.value }} / {{ table.pagination.pages }}
        </span>

        <Pagination.Root
          v-slot="{ items }"
          v-model="page"
          :size="table.allItems.value.length"
          :items-per-page="table.pagination.itemsPerPage"
          :total-visible="7"
          class="d-flex align-center ga-1"
        >
          <Pagination.First :class="paginationBtnClass">
            «
          </Pagination.First>
          <Pagination.Prev :class="paginationBtnClass">
            ‹
          </Pagination.Prev>

          <template v-for="(item, index) in items" :key="index">
            <Pagination.Ellipsis v-if="item.type === 'ellipsis'" :class="paginationEllipsisClass">
              …
            </Pagination.Ellipsis>
            <Pagination.Item v-else :class="paginationPageBtnClass" :value="item.value as number">
              {{ item.value }}
            </Pagination.Item>
          </template>

          <Pagination.Next :class="paginationBtnClass">
            ›
          </Pagination.Next>
          <Pagination.Last :class="paginationBtnClass">
            »
          </Pagination.Last>
        </Pagination.Root>
      </div>

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

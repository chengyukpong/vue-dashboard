<script setup lang="ts">
import type { Period, Range, Sale } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

const sampleEmails = [
  'james.anderson@example.com',
  'mia.white@example.com',
  'william.brown@example.com',
  'emma.davis@example.com',
  'ethan.harris@example.com'
]

const { data } = await useAsyncData('sales', async () => {
  const sales: Sale[] = []
  const currentDate = new Date()

  for (let i = 0; i < 5; i++) {
    const hoursAgo = randomInt(0, 48)
    const date = new Date(currentDate.getTime() - hoursAgo * 3600000)

    sales.push({
      id: (4600 - i).toString(),
      date: date.toISOString(),
      status: randomFrom(['paid', 'failed', 'refunded']),
      email: randomFrom(sampleEmails),
      amount: randomInt(100, 1000)
    })
  }

  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}, {
  watch: [() => props.period, () => props.range],
  default: () => []
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Date', key: 'date' },
  { title: 'Status', key: 'status' },
  { title: 'Email', key: 'email' },
  { title: 'Amount', key: 'amount', align: 'end' as const }
]

const statusColor = (status: string) => ({
  paid: 'success',
  failed: 'error',
  refunded: 'grey'
})[status] || 'grey'

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>

<template>
  <VCard class="shrink-0">
    <VDataTable
      :headers="headers"
      :items="data"
      hover
      density="comfortable"
    >
      <template #item.id="{ value }">
        #{{ value }}
      </template>
      <template #item.date="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #item.status="{ value }">
        <VChip :color="statusColor(value)" size="small" class="text-capitalize">
          {{ value }}
        </VChip>
      </template>
      <template #item.amount="{ value }">
        <div class="text-right font-weight-medium">
          {{ formatAmount(Number.parseFloat(value)) }}
        </div>
      </template>
    </VDataTable>
  </VCard>
</template>

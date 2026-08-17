<script setup lang="ts">
import type { Period, Range, Stat } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
}

const baseStats = [{
  title: 'Customers',
  icon: 'mdi-account-group',
  minValue: 400,
  maxValue: 1000,
  minVariation: -15,
  maxVariation: 25
}, {
  title: 'Conversions',
  icon: 'mdi-chart-pie',
  minValue: 1000,
  maxValue: 2000,
  minVariation: -10,
  maxVariation: 20
}, {
  title: 'Revenue',
  icon: 'mdi-cash',
  minValue: 200000,
  maxValue: 500000,
  minVariation: -20,
  maxVariation: 30,
  formatter: formatCurrency
}, {
  title: 'Orders',
  icon: 'mdi-cart',
  minValue: 100,
  maxValue: 300,
  minVariation: -5,
  maxVariation: 15
}]

const { data: stats } = await useAsyncData<Stat[]>('stats', async () => {
  return baseStats.map((stat) => {
    const value = randomInt(stat.minValue, stat.maxValue)
    const variation = randomInt(stat.minVariation, stat.maxVariation)

    return {
      title: stat.title,
      icon: stat.icon,
      value: stat.formatter ? stat.formatter(value) : value,
      variation
    }
  })
}, {
  watch: [() => props.period, () => props.range],
  default: () => []
})
</script>

<template>
  <VRow class="ga-4">
    <VCol
      v-for="(stat, index) in stats"
      :key="index"
      cols="12"
      sm="6"
      lg="3"
    >
      <VCard
        variant="tonal"
        class="h-100 cursor-pointer"
        :to="'/customers'"
        link
      >
        <VCardItem>
          <template #prepend>
            <VAvatar color="primary" variant="tonal" rounded="lg">
              <VIcon :icon="stat.icon" />
            </VAvatar>
          </template>
          <VCardSubtitle class="text-uppercase text-caption">
            {{ stat.title }}
          </VCardSubtitle>
        </VCardItem>
        <VCardText>
          <div class="d-flex align-center ga-2">
            <span class="text-h5 font-weight-bold">
              {{ stat.value }}
            </span>
            <VChip
              :color="stat.variation > 0 ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
            </VChip>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

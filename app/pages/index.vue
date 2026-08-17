<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [
  { title: 'New mail', icon: 'mdi-send', to: '/inbox' },
  { title: 'New customer', icon: 'mdi-account-plus', to: '/customers' }
]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 class="text-h5 font-weight-bold">
          Home
        </h1>
      </div>
      <div class="d-flex align-center ga-2">
        <VBtn
          icon
          variant="text"
          size="small"
          @click="isNotificationsSlideoverOpen = true"
        >
          <VBadge dot color="error">
            <VIcon>mdi-bell</VIcon>
          </VBadge>
        </VBtn>
        <VMenu>
          <template #activator="{ props: menuProps }">
            <VBtn v-bind="menuProps" icon="mdi-plus" color="primary" variant="flat" rounded="circle" />
          </template>
          <VList density="compact" min-width="200">
            <VListItem
              v-for="item in items"
              :key="item.title"
              :prepend-icon="item.icon"
              :title="item.title"
              :to="item.to"
              link
            />
          </VList>
        </VMenu>
      </div>
    </div>

    <div class="d-flex align-center ga-2 mb-4">
      <HomeDateRangePicker v-model="range" />
      <HomePeriodSelect v-model="period" :range="range" />
    </div>

    <div class="d-flex flex-column ga-4">
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </div>
  </div>
</template>

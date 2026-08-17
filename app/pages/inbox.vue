<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { breakpointsTailwind } from '@vueuse/core'
import type { Mail } from '~/types'

const tabItems = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' }
]
const selectedTab = ref('all')

const { data: mails } = await useFetch<Mail[]>('/api/mails', { default: () => [] })

const filteredMails = computed(() => {
  if (selectedTab.value === 'unread') {
    return mails.value.filter(mail => !!mail.unread)
  }

  return mails.value
})

const selectedMail = ref<Mail | null>(null)

const isMailPanelOpen = computed({
  get() {
    return !!selectedMail.value
  },
  set(value: boolean) {
    if (!value) {
      selectedMail.value = null
    }
  }
})

watch(filteredMails, () => {
  if (!filteredMails.value.find(mail => mail.id === selectedMail.value?.id)) {
    selectedMail.value = null
  }
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = computed(() => breakpoints.smaller('lg').value)
</script>

<template>
  <div class="d-flex flex-column flex-lg-row" style="height: calc(100vh - 96px); min-height: 480px">
    <VCard
      variant="flat"
      border
      class="d-flex flex-column flex-shrink-0"
      :width="isMobile ? '100%' : '360'"
      height="100%"
    >
      <VCardItem>
        <div class="d-flex align-center justify-space-between">
          <VCardTitle class="text-h6">
            Inbox
          </VCardTitle>
          <VChip size="small" variant="tonal">
            {{ filteredMails.length }}
          </VChip>
        </div>
      </VCardItem>
      <VTabs v-model="selectedTab" density="compact" class="px-2">
        <VTab v-for="tab in tabItems" :key="tab.value" :value="tab.value">
          {{ tab.label }}
        </VTab>
      </VTabs>
      <VDivider />
      <VList density="compact" class="flex-1-1-0 overflow-y-auto">
        <VListItem
          v-for="mail in filteredMails"
          :key="mail.id"
          :active="selectedMail?.id === mail.id"
          link
          @click="selectedMail = mail"
        >
          <template #prepend>
            <VAvatar size="32" class="mr-3">
              <VImg
                v-if="mail.from.avatar?.src"
                :src="mail.from.avatar.src"
                :alt="mail.from.name"
              />
              <VIcon v-else>mdi-account</VIcon>
            </VAvatar>
          </template>
          <VListItemTitle :class="{ 'font-weight-bold': mail.unread }">
            {{ mail.from.name }}
          </VListItemTitle>
          <VListItemSubtitle class="text-wrap">
            {{ mail.subject }}
          </VListItemSubtitle>
          <template #append>
            <span class="text-caption text-medium-emphasis">
              {{ new Date(mail.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
            </span>
          </template>
        </VListItem>
      </VList>
    </VCard>

    <ClientOnly>
      <div v-if="selectedMail" class="flex-1-1-0 d-flex flex-column min-w-0">
        <InboxMail :mail="selectedMail" @close="selectedMail = null" />
      </div>
      <div v-else class="flex-1-1-0 d-flex align-center justify-center">
        <VIcon size="128" class="text-medium-emphasis opacity-20">
          mdi-inbox
        </VIcon>
      </div>

      <template #fallback>
        <div class="flex-1-1-0 d-flex align-center justify-center">
          <VIcon size="128" class="text-medium-emphasis opacity-20">
            mdi-inbox
          </VIcon>
        </div>
      </template>
    </ClientOnly>

    <ClientOnly>
      <VNavigationDrawer
        v-if="isMobile"
        v-model="isMailPanelOpen"
        location="bottom"
        temporary
        style="height: 80%"
      >
        <InboxMail v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
      </VNavigationDrawer>
    </ClientOnly>
  </div>
</template>

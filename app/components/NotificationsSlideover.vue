<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import type { Notification } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()

const { data: notifications } = await useFetch<Notification[]>('/api/notifications')
</script>

<template>
  <VNavigationDrawer
    v-model="isNotificationsSlideoverOpen"
    location="right"
    temporary
    width="400"
  >
    <VListItem class="px-4 py-3">
      <VListItemTitle class="text-h6 font-weight-bold">
        Notifications
      </VListItemTitle>
    </VListItem>
    <VDivider />
    <VList density="compact" class="overflow-y-auto">
      <VListItem
        v-for="notification in notifications"
        :key="notification.id"
        :to="`/inbox?id=${notification.id}`"
        link
        class="py-2"
      >
        <template #prepend>
          <VAvatar size="32" class="mr-3">
            <VImg
              v-if="notification.sender.avatar?.src"
              :src="notification.sender.avatar.src"
              :alt="notification.sender.name"
            />
            <VIcon v-else>mdi-account</VIcon>
          </VAvatar>
          <VBadge
            v-if="notification.unread"
            color="error"
            dot
            offset
          />
        </template>
        <VListItemTitle class="font-weight-medium">
          {{ notification.sender.name }}
        </VListItemTitle>
        <VListItemSubtitle class="text-wrap">
          {{ notification.body }}
        </VListItemSubtitle>
        <template #append>
          <span class="text-caption text-medium-emphasis">
            {{ formatTimeAgo(new Date(notification.date)) }}
          </span>
        </template>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

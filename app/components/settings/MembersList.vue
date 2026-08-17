<script setup lang="ts">
import type { Member } from '~/types'

defineProps<{
  members: Member[]
}>()

const items = [
  { title: 'Edit member', action: () => console.log('Edit member') },
  { title: 'Remove member', color: 'error', action: () => console.log('Remove member') }
]
</script>

<template>
  <VList density="comfortable">
    <template v-for="(member, index) in members" :key="index">
      <VListItem>
        <template #prepend>
          <VAvatar size="40" class="mr-3">
            <VImg :src="member.avatar?.src" :alt="member.name" />
          </VAvatar>
        </template>
        <VListItemTitle class="font-weight-medium">
          {{ member.name }}
        </VListItemTitle>
        <VListItemSubtitle>
          {{ member.username }}
        </VListItemSubtitle>
        <template #append>
          <div class="d-flex align-center ga-3">
            <VSelect
              :model-value="member.role"
              :items="['member', 'owner']"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 140px"
              class="text-capitalize"
            />
            <VMenu>
              <template #activator="{ props }">
                <VBtn v-bind="props" icon="mdi-dots-vertical" variant="text" size="small" />
              </template>
              <VList density="compact" min-width="200">
                <VListItem
                  v-for="item in items"
                  :key="item.title"
                  :title="item.title"
                  :base-color="item.color === 'error' ? 'error' : undefined"
                  link
                  @click="item.action()"
                />
              </VList>
            </VMenu>
          </div>
        </template>
      </VListItem>
      <VDivider v-if="index < members.length - 1" />
    </template>
  </VList>
</template>

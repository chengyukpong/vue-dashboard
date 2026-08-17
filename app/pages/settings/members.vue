<script setup lang="ts">
import type { Member } from '~/types'

const { data: members } = await useFetch<Member[]>('/api/members', { default: () => [] })

const q = ref('')

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return member.name.search(new RegExp(q.value, 'i')) !== -1 || member.username.search(new RegExp(q.value, 'i')) !== -1
  })
})
</script>

<template>
  <div>
    <VCard class="mb-4" variant="flat" border>
      <VCardItem>
        <div class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div>
            <VCardTitle class="text-h6">
              Members
            </VCardTitle>
            <VCardSubtitle>
              Invite new members by email address.
            </VCardSubtitle>
          </div>
          <VBtn color="primary" variant="flat">
            Invite people
          </VBtn>
        </div>
      </VCardItem>
    </VCard>

    <VCard variant="flat" border>
      <VCardItem>
        <VTextField
          v-model="q"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search members"
          variant="outlined"
          density="compact"
          hide-details
          autofocus
        />
      </VCardItem>
      <VDivider />
      <SettingsMembersList :members="filteredMembers" />
    </VCard>
  </div>
</template>

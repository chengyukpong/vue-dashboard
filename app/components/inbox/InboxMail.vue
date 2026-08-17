<script setup lang="ts">
import { format } from 'date-fns'
import type { Mail } from '~/types'

defineProps<{
  mail: Mail
}>()

const emits = defineEmits(['close'])

const dropdownItems = [
  [{ title: 'Mark as unread', icon: 'mdi-check-circle' }, { title: 'Mark as important', icon: 'mdi-alert' }],
  [{ title: 'Star thread', icon: 'mdi-star' }, { title: 'Mute thread', icon: 'mdi-pause-circle' }]
]

const toast = useToast()

const reply = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  setTimeout(() => {
    reply.value = ''

    toast.add({
      title: 'Email sent',
      text: 'Your email has been sent successfully',
      color: 'success'
    })

    loading.value = false
  }, 1000)
}
</script>

<template>
  <div class="d-flex flex-column h-100">
    <div class="d-flex align-center justify-space-between pa-2 border-b">
      <div class="d-flex align-center ga-2">
        <VBtn icon="mdi-close" variant="text" size="small" @click="emits('close')" />
        <span class="text-body-1 font-weight-medium text-truncate">
          {{ mail.subject }}
        </span>
      </div>
      <div class="d-flex align-center ga-1">
        <VTooltip text="Archive">
          <template #activator="{ props: tipProps }">
            <VBtn v-bind="tipProps" icon="mdi-archive" variant="text" size="small" />
          </template>
        </VTooltip>
        <VTooltip text="Reply">
          <template #activator="{ props: tipProps }">
            <VBtn v-bind="tipProps" icon="mdi-reply" variant="text" size="small" />
          </template>
        </VTooltip>
        <VMenu>
          <template #activator="{ props: menuProps }">
            <VBtn v-bind="menuProps" icon="mdi-dots-vertical" variant="text" size="small" />
          </template>
          <VList density="compact" min-width="200">
            <template v-for="(group, gi) in dropdownItems" :key="gi">
              <VListItem
                v-for="(item, ii) in group"
                :key="ii"
                :prepend-icon="item.icon"
                :title="item.title"
                link
              />
              <VDivider v-if="gi < dropdownItems.length - 1" />
            </template>
          </VList>
        </VMenu>
      </div>
    </div>

    <div class="d-flex flex-sm-row flex-column justify-space-between ga-1 pa-4 border-b">
      <div class="d-flex align-start ga-4">
        <VAvatar size="48">
          <VImg
            v-if="mail.from.avatar?.src"
            :src="mail.from.avatar.src"
            :alt="mail.from.name"
          />
          <VIcon v-else>mdi-account</VIcon>
        </VAvatar>
        <div>
          <div class="font-weight-bold">
            {{ mail.from.name }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ mail.from.email }}
          </div>
        </div>
      </div>
      <span class="text-body-2 text-medium-emphasis">
        {{ format(new Date(mail.date), 'dd MMM HH:mm') }}
      </span>
    </div>

    <div class="flex-1-1-0 overflow-y-auto pa-4">
      <p style="white-space: pre-wrap">
        {{ mail.body }}
      </p>
    </div>

    <div class="pa-4">
      <VCard variant="tonal">
        <VCardItem>
          <template #prepend>
            <VIcon>mdi-reply</VIcon>
          </template>
          <VCardSubtitle class="text-truncate">
            Reply to {{ mail.from.name }} ({{ mail.from.email }})
          </VCardSubtitle>
        </VCardItem>
        <VCardText>
          <VTextarea
            v-model="reply"
            variant="solo"
            auto-grow
            rows="4"
            placeholder="Write your reply..."
            :disabled="loading"
          />
          <div class="d-flex align-center justify-space-between mt-2">
            <VTooltip text="Attach file">
              <template #activator="{ props: tipProps }">
                <VBtn v-bind="tipProps" icon="mdi-paperclip" variant="text" size="small" />
              </template>
            </VTooltip>
            <div class="d-flex align-center ga-2">
              <VBtn variant="text">
                Save draft
              </VBtn>
              <VBtn
                color="primary"
                variant="flat"
                :loading="loading"
                prepend-icon="mdi-send"
                @click="onSubmit"
              >
                Send
              </VBtn>
            </div>
          </div>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

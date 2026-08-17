<script setup lang="ts">
import { format, isToday } from 'date-fns'
import type { Mail } from '~/types'

const props = defineProps<{
  mails: Mail[]
}>()

const mailsRefs = ref<Record<number, Element | null>>({})

const selectedMail = defineModel<Mail | null>()

watch(selectedMail, () => {
  if (!selectedMail.value) {
    return
  }
  const ref = mailsRefs.value[selectedMail.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

const keys = useMagicKeys()

watch(() => keys.arrowdown?.value, (v) => {
  if (!v) return
  const index = props.mails.findIndex((mail: Mail) => mail.id === selectedMail.value?.id)
  if (index === -1) {
    selectedMail.value = props.mails[0] ?? null
  } else if (index < props.mails.length - 1) {
    selectedMail.value = props.mails[index + 1] ?? null
  }
})

watch(() => keys.arrowup?.value, (v) => {
  if (!v) return
  const index = props.mails.findIndex((mail: Mail) => mail.id === selectedMail.value?.id)
  if (index === -1) {
    selectedMail.value = props.mails[props.mails.length - 1] ?? null
  } else if (index > 0) {
    selectedMail.value = props.mails[index - 1] ?? null
  }
})
</script>

<template>
  <div class="overflow-y-auto">
    <div
      v-for="(mail, index) in mails"
      :key="index"
      :ref="el => { if (el) mailsRefs[mail.id] = el as Element }"
    >
      <div
        class="pa-4 cursor-pointer"
        :class="[
          mail.unread ? 'font-weight-medium' : 'text-medium-emphasis',
          selectedMail && selectedMail.id === mail.id
            ? 'bg-primary-container'
            : ''
        ]"
        style="border-left: 3px solid; border-left-color: transparent"
        :style="selectedMail && selectedMail.id === mail.id
          ? 'border-left-color: rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-primary), 0.1)'
          : 'border-left-color: transparent'"
        @click="selectedMail = mail"
      >
        <div class="d-flex align-center justify-space-between">
          <span>{{ mail.from.name }}</span>
          <span class="text-caption">
            {{ isToday(new Date(mail.date)) ? format(new Date(mail.date), 'HH:mm') : format(new Date(mail.date), 'dd MMM') }}
          </span>
        </div>
        <div class="text-body-2 text-truncate">
          {{ mail.subject }}
        </div>
        <div class="text-caption text-medium-emphasis text-truncate">
          {{ mail.body }}
        </div>
      </div>
    </div>
  </div>
</template>

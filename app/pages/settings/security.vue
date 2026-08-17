<script setup lang="ts">
import * as z from 'zod'

const passwordSchema = z.object({
  current: z.string().min(8, 'Must be at least 8 characters'),
  new: z.string().min(8, 'Must be at least 8 characters')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: '',
  new: ''
})

const errors = ref<Record<string, string>>({})

function validate() {
  const errs: Record<string, string> = {}

  if (password.current && password.current.length < 8) {
    errs.current = 'Must be at least 8 characters'
  }
  if (password.new && password.new.length < 8) {
    errs.new = 'Must be at least 8 characters'
  }
  if (password.current && password.new && password.current === password.new) {
    errs.new = 'Passwords must be different'
  }

  errors.value = errs
  return Object.keys(errs).length === 0
}

function onSubmit() {
  if (!validate()) return
  console.log({ ...password })
}
</script>

<template>
  <VCard variant="flat" border class="mb-6">
    <VCardItem>
      <VCardTitle class="text-h6">
        Password
      </VCardTitle>
      <VCardSubtitle>
        Confirm your current password before setting a new one.
      </VCardSubtitle>
    </VCardItem>
    <VCardText>
      <form class="d-flex flex-column ga-4" style="max-width: 360px" @submit.prevent="onSubmit">
        <VTextField
          v-model="password.current"
          type="password"
          label="Current password"
          variant="outlined"
          density="compact"
          :error-messages="errors.current"
          hide-details="auto"
        />
        <VTextField
          v-model="password.new"
          type="password"
          label="New password"
          variant="outlined"
          density="compact"
          :error-messages="errors.new"
          hide-details="auto"
        />
        <div>
          <VBtn type="submit" color="primary" variant="flat">
            Update
          </VBtn>
        </div>
      </form>
    </VCardText>
  </VCard>

  <VCard variant="flat" border>
    <VCardItem>
      <VCardTitle class="text-h6">
        Account
      </VCardTitle>
      <VCardSubtitle>
        No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently.
      </VCardSubtitle>
    </VCardItem>
    <VCardActions>
      <VBtn color="error" variant="flat">
        Delete account
      </VBtn>
    </VCardActions>
  </VCard>
</template>

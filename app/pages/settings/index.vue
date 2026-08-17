<script setup lang="ts">
import * as z from 'zod'

const fileRef = ref<HTMLInputElement>()

const profileSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  username: z.string().min(2, 'Too short'),
  avatar: z.string().optional(),
  bio: z.string().optional()
})

type ProfileSchema = z.output<typeof profileSchema>

const profile = reactive<Partial<ProfileSchema>>({
  name: 'Benjamin Canac',
  email: 'ben@nuxtlabs.com',
  username: 'benjamincanac',
  avatar: undefined,
  bio: undefined
})

const toast = useToast()

async function onSubmit() {
  const valid = profileSchema.safeParse(profile)
  if (!valid.success) return

  toast.add({
    title: 'Success',
    text: 'Your settings have been updated.',
    color: 'success'
  })
  console.log(valid.data)
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  profile.avatar = URL.createObjectURL(input.files[0]!)
}

function onFileClick() {
  fileRef.value?.click()
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <VCard class="mb-4" variant="flat" border>
      <VCardItem>
        <div class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div>
            <VCardTitle class="text-h6">
              Profile
            </VCardTitle>
            <VCardSubtitle>
              These informations will be displayed publicly.
            </VCardSubtitle>
          </div>
          <VBtn type="submit" color="primary" variant="flat">
            Save changes
          </VBtn>
        </div>
      </VCardItem>
    </VCard>

    <VCard variant="flat" border>
      <VCardItem>
        <div class="d-flex flex-sm-row flex-column justify-space-between align-start ga-4 py-2">
          <div>
            <div class="text-body-1 font-weight-medium">
              Name
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Will appear on receipts, invoices, and other communication.
            </div>
          </div>
          <VTextField
            v-model="profile.name"
            variant="outlined"
            density="compact"
            autocomplete="off"
            hide-details
            style="max-width: 320px; width: 100%"
          />
        </div>
      </VCardItem>
      <VDivider />
      <VCardItem>
        <div class="d-flex flex-sm-row flex-column justify-space-between align-start ga-4 py-2">
          <div>
            <div class="text-body-1 font-weight-medium">
              Email
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Used to sign in, for email receipts and product updates.
            </div>
          </div>
          <VTextField
            v-model="profile.email"
            type="email"
            variant="outlined"
            density="compact"
            autocomplete="off"
            hide-details
            style="max-width: 320px; width: 100%"
          />
        </div>
      </VCardItem>
      <VDivider />
      <VCardItem>
        <div class="d-flex flex-sm-row flex-column justify-space-between align-start ga-4 py-2">
          <div>
            <div class="text-body-1 font-weight-medium">
              Username
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Your unique username for logging in and your profile URL.
            </div>
          </div>
          <VTextField
            v-model="profile.username"
            type="username"
            variant="outlined"
            density="compact"
            autocomplete="off"
            hide-details
            style="max-width: 320px; width: 100%"
          />
        </div>
      </VCardItem>
      <VDivider />
      <VCardItem>
        <div class="d-flex flex-sm-row flex-column justify-space-between align-center ga-4 py-2">
          <div>
            <div class="text-body-1 font-weight-medium">
              Avatar
            </div>
            <div class="text-body-2 text-medium-emphasis">
              JPG, GIF or PNG. 1MB Max.
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <VAvatar size="40">
              <VImg v-if="profile.avatar" :src="profile.avatar" :alt="profile.name" />
              <VIcon v-else>mdi-account</VIcon>
            </VAvatar>
            <VBtn variant="tonal" @click="onFileClick">
              Choose
            </VBtn>
            <input
              ref="fileRef"
              type="file"
              class="d-none"
              accept=".jpg, .jpeg, .png, .gif"
              @change="onFileChange"
            >
          </div>
        </div>
      </VCardItem>
      <VDivider />
      <VCardItem>
        <div class="py-2 w-100">
          <div class="text-body-1 font-weight-medium mb-1">
            Bio
          </div>
          <div class="text-body-2 text-medium-emphasis mb-2">
            Brief description for your profile. URLs are hyperlinked.
          </div>
          <VTextarea
            v-model="profile.bio"
            variant="outlined"
            auto-grow
            rows="5"
            class="w-100"
          />
        </div>
      </VCardItem>
    </VCard>
  </form>
</template>

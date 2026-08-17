<script setup lang="ts">
import * as z from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email')
})
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: '',
  email: ''
})

const toast = useToast()
const { create } = useCustomers()

async function onSubmit() {
  const valid = schema.safeParse(state)
  if (!valid.success) {
    return
  }

  try {
    const customer = await create(valid.data as Schema)
    toast.add({ title: 'Success', text: `New customer ${customer.name} added` })
    open.value = false
    state.name = ''
    state.email = ''
  } catch {
    toast.add({ title: 'Error', text: 'The customer could not be added.' })
  }
}
</script>

<template>
  <VDialog v-model="open" max-width="500">
    <template #activator="{ props: activatorProps }">
      <VBtn v-bind="activatorProps" prepend-icon="mdi-plus" color="primary" variant="flat">
        New customer
      </VBtn>
    </template>
    <VCard title="New customer" subtitle="Add a new customer to the database">
      <VCardText>
        <VTextField
          v-model="state.name"
          label="Name"
          placeholder="John Doe"
          variant="outlined"
          :error-messages="state.name && state.name.length < 2 ? 'Too short' : ''"
          class="mb-3"
        />
        <VTextField
          v-model="state.email"
          label="Email"
          placeholder="john.doe@example.com"
          variant="outlined"
          :error-messages="state.email && !state.email.includes('@') ? 'Invalid email' : ''"
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="open = false">
          Cancel
        </VBtn>
        <VBtn color="primary" variant="flat" @click="onSubmit">
          Create
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

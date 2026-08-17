<script setup lang="ts">
const state = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  product_updates: true,
  weekly_digest: false,
  important_updates: true
})

const sections = [{
  title: 'Notification channels',
  description: 'Where can we notify you?',
  fields: [{
    name: 'email',
    label: 'Email',
    description: 'Receive a daily email digest.'
  }, {
    name: 'desktop',
    label: 'Desktop',
    description: 'Receive desktop notifications.'
  }]
}, {
  title: 'Account updates',
  description: 'Receive updates about Nuxt UI.',
  fields: [{
    name: 'weekly_digest',
    label: 'Weekly digest',
    description: 'Receive a weekly digest of news.'
  }, {
    name: 'product_updates',
    label: 'Product updates',
    description: 'Receive a monthly email with all new features and updates.'
  }, {
    name: 'important_updates',
    label: 'Important updates',
    description: 'Receive emails about important updates like security fixes, maintenance, etc.'
  }]
}]

async function onChange() {
  console.log(state)
}
</script>

<template>
  <div>
    <template v-for="(section, index) in sections" :key="index">
      <VCard class="mb-4" variant="flat" border>
        <VCardItem>
          <VCardTitle class="text-h6">
            {{ section.title }}
          </VCardTitle>
          <VCardSubtitle>
            {{ section.description }}
          </VCardSubtitle>
        </VCardItem>
      </VCard>

      <VCard variant="flat" border class="mb-6">
        <VList density="comfortable">
          <template v-for="(field, fi) in section.fields" :key="field.name">
            <VListItem>
              <div class="d-flex align-center justify-space-between">
                <div class="flex-1-1-0">
                  <div class="text-body-1 font-weight-medium">
                    {{ field.label }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ field.description }}
                  </div>
                </div>
                <VSwitch
                  v-model="state[field.name]"
                  color="primary"
                  hide-details
                  @update:model-value="onChange"
                />
              </div>
            </VListItem>
            <VDivider v-if="fi < section.fields.length - 1" />
          </template>
        </VList>
      </VCard>
    </template>
  </div>
</template>

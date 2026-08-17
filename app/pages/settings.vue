<script setup lang="ts">
const links = [
  { label: 'General', icon: 'mdi-account', to: '/settings', exact: true },
  { label: 'Members', icon: 'mdi-account-group', to: '/settings/members' },
  { label: 'Notifications', icon: 'mdi-bell', to: '/settings/notifications' },
  { label: 'Security', icon: 'mdi-shield', to: '/settings/security' },
  { label: 'Documentation', icon: 'mdi-book-open', to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt', external: true }
]
</script>

<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">
      Settings
    </h1>
    <VCard variant="flat" border class="mb-4">
      <VList density="compact" nav>
        <VListItem
          v-for="item in links"
          :key="item.label"
          :prepend-icon="item.icon"
          :title="item.label"
          :to="item.external ? undefined : item.to"
          :href="item.external ? item.to : undefined"
          :target="item.external ? '_blank' : undefined"
          link
          :active="item.exact ? $route.path === item.to : $route.path.startsWith(item.to)"
        />
      </VList>
    </VCard>

    <div class="mx-auto" style="max-width: 800px">
      <NuxtPage />
    </div>
  </div>
</template>

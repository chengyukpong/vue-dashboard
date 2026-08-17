<script setup lang="ts">
import type { NavigationItem } from '~/types'

const route = useRoute()
const toast = useToast()

const drawerOpen = ref(false)
const railMode = ref(false)

const { isCommandPaletteOpen, isDark, toggleTheme } = useDashboard()

const { lgAndUp } = useDisplay()

const mainLinks: NavigationItem[] = [
  { label: 'Home', icon: 'mdi-home', to: '/' },
  { label: 'Inbox', icon: 'mdi-inbox', to: '/inbox', badge: '4' },
  { label: 'Customers', icon: 'mdi-account-group', to: '/customers' },
  { label: 'Settings', icon: 'mdi-cog', to: '/settings', children: [
    { label: 'General', to: '/settings', exact: true },
    { label: 'Members', to: '/settings/members' },
    { label: 'Notifications', to: '/settings/notifications' },
    { label: 'Security', to: '/settings/security' }
  ] }
]

const footerLinks: NavigationItem[] = [
  { label: 'Feedback', icon: 'mdi-message-text', to: 'https://github.com/nuxt-ui-templates/dashboard', external: true },
  { label: 'Help & Support', icon: 'mdi-information', to: 'https://github.com/nuxt-ui-templates/dashboard', external: true }
]

const searchItems = computed(() => {
  return [...mainLinks, ...footerLinks]
    .filter(item => item.to)
    .map(item => ({
      title: item.label,
      value: item.to as string,
      prependIcon: item.icon
    }))
})

const searchQuery = ref('')
const filteredSearchItems = computed(() => {
  if (!searchQuery.value) return searchItems.value
  return searchItems.value.filter(item =>
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function onSearchSelect(item: any) {
  if (item?.value) {
    navigateTo(item.value)
  }
  isCommandPaletteOpen.value = false
}

const { add: addToast, remove: removeToast, toasts } = useToast()

onMounted(() => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') return

  addToast({
    title: 'We use first-party cookies to enhance your experience on our website.',
    timeout: -1
  })

  setTimeout(() => {
    if (useCookie('cookie-consent').value !== 'accepted') {
      cookie.value = 'accepted'
    }
  }, 500)
})
</script>

<template>
  <VNavigationDrawer
    v-if="lgAndUp"
    :rail="railMode"
    rail-width="64"
    width="280"
    permanent
    class="border-r"
  >
    <template #prepend>
      <div class="pa-3 d-flex align-center" style="height: 64px">
        <VAvatar color="primary" size="32" class="flex-shrink-0">
          <VIcon>mdi-view-dashboard</VIcon>
        </VAvatar>
        <VListItemTitle v-if="!railMode" class="font-weight-bold ml-3">
          Dashboard
        </VListItemTitle>
      </div>
    </template>

    <VList nav density="compact" :opened="railMode ? [] : ['Settings']">
      <VListItem
        v-for="item in mainLinks.filter(i => !i.children)"
        :key="item.label"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="railMode ? undefined : item.label"
        link
        density="compact"
      >
        <template v-if="item.badge" #append>
          <VBadge :content="item.badge" color="error" inline />
        </template>
      </VListItem>

      <VListGroup
        v-for="item in mainLinks.filter(i => i.children)"
        :key="item.label"
        :value="item.label"
      >
        <template #activator="{ props }">
          <VListItem
            v-bind="props"
            :prepend-icon="item.icon"
            :title="railMode ? undefined : item.label"
            density="compact"
          />
        </template>
        <VListItem
          v-for="child in item.children"
          :key="child.label"
          :to="child.to"
          :title="child.label"
          link
          density="compact"
          :active="route.path === child.to"
        />
      </VListGroup>
    </VList>

    <template #append>
      <VDivider />
      <VList nav density="compact">
        <VListItem
          v-for="item in footerLinks"
          :key="item.label"
          :prepend-icon="item.icon"
          :title="railMode ? undefined : item.label"
          :href="item.external ? item.to : undefined"
          :target="item.external ? '_blank' : undefined"
          link
          density="compact"
        />
      </VList>
    </template>
  </VNavigationDrawer>

  <VNavigationDrawer
    v-else
    v-model="drawerOpen"
    temporary
    class="border-r"
  >
    <template #prepend>
      <div class="pa-3 d-flex align-center" style="height: 64px">
        <VAvatar color="primary" size="32" class="flex-shrink-0">
          <VIcon>mdi-view-dashboard</VIcon>
        </VAvatar>
        <VListItemTitle class="font-weight-bold ml-3">
          Dashboard
        </VListItemTitle>
      </div>
    </template>

    <VList nav density="compact" :opened="['Settings']">
      <VListItem
        v-for="item in mainLinks.filter(i => !i.children)"
        :key="item.label"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.label"
        link
        density="compact"
      >
        <template v-if="item.badge" #append>
          <VBadge :content="item.badge" color="error" inline />
        </template>
      </VListItem>

      <VListGroup
        v-for="item in mainLinks.filter(i => i.children)"
        :key="item.label"
        :value="item.label"
      >
        <template #activator="{ props }">
          <VListItem
            v-bind="props"
            :prepend-icon="item.icon"
            :title="item.label"
            density="compact"
          />
        </template>
        <VListItem
          v-for="child in item.children"
          :key="child.label"
          :to="child.to"
          :title="child.label"
          link
          density="compact"
          :active="route.path === child.to"
        />
      </VListGroup>
    </VList>

    <template #append>
      <VDivider />
      <VList nav density="compact">
        <VListItem
          v-for="item in footerLinks"
          :key="item.label"
          :prepend-icon="item.icon"
          :title="item.label"
          :href="item.external ? item.to : undefined"
          :target="item.external ? '_blank' : undefined"
          link
          density="compact"
        />
      </VList>
    </template>
  </VNavigationDrawer>

  <VAppBar
    flat
    density="compact"
    class="border-b"
  >
    <VBtn
      icon
      variant="text"
      size="small"
      @click="railMode = !railMode"
    >
      <VIcon>{{ railMode ? 'mdi-format-indent-increase' : 'mdi-format-indent-decrease' }}</VIcon>
    </VBtn>
    <VAppBarNavIcon class="d-lg-none" @click="drawerOpen = !drawerOpen" />
    <VBtn
      icon
      variant="text"
      size="small"
      @click="isCommandPaletteOpen = true"
    >
      <VIcon>mdi-magnify</VIcon>
    </VBtn>
    <VSpacer />
    <VBtn
      icon
      variant="text"
      size="small"
      @click="toggleTheme"
    >
      <VIcon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waxing-crescent' }}</VIcon>
    </VBtn>
    <VBtn
      icon
      variant="text"
      size="small"
      @click="useDashboard().isNotificationsSlideoverOpen.value = true"
    >
      <VBadge dot color="error">
        <VIcon>mdi-bell</VIcon>
      </VBadge>
    </VBtn>
    <VMenu>
      <template #activator="{ props }">
        <VBtn v-bind="props" variant="text" size="small">
          <VAvatar size="28" class="mr-2">
            <VIcon>mdi-account</VIcon>
          </VAvatar>
        </VBtn>
      </template>
      <VList density="compact" min-width="200">
        <VListItem title="Profile" prepend-icon="mdi-account" />
        <VListItem title="Billing" prepend-icon="mdi-credit-card" />
        <VListItem title="Settings" prepend-icon="mdi-cog" to="/settings" link />
        <VDivider />
        <VListItem title="Log out" prepend-icon="mdi-logout" />
      </VList>
    </VMenu>
  </VAppBar>

  <VMain>
    <VContainer fluid class="pa-4">
      <slot />
    </VContainer>
  </VMain>

  <VDialog
    v-model="isCommandPaletteOpen"
    max-width="600"
  >
    <VCard>
      <VTextField
        v-model="searchQuery"
        placeholder="Search or jump to..."
        variant="solo"
        prepend-inner-icon="mdi-magnify"
        autofocus
        hide-details
        @keyup.enter="onSearchSelect(filteredSearchItems[0])"
      />
      <VDivider />
      <VList
        density="compact"
        nav
        max-height="400"
        class="overflow-y-auto"
      >
        <VListItem
          v-for="item in filteredSearchItems"
          :key="item.value"
          :prepend-icon="item.prependIcon"
          :title="item.title"
          link
          @click="onSearchSelect(item)"
        />
      </VList>
    </VCard>
  </VDialog>

  <NotificationsSlideover />

  <VSnackbar
    v-for="toast in toasts"
    :key="toast.id"
    :model-value="true"
    :color="toast.color"
    :timeout="toast.timeout"
    @update:model-value="removeToast(toast.id)"
  >
    <div class="d-flex flex-column">
      <span class="font-weight-bold">{{ toast.title }}</span>
      <span v-if="toast.text">{{ toast.text }}</span>
    </div>
    <template #actions>
      <VBtn icon="mdi-close" variant="text" size="small" @click="removeToast(toast.id)" />
    </template>
  </VSnackbar>
</template>

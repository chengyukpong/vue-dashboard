import { createSharedComposable, useMagicKeys } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const { global: themeGlobal } = useTheme()
  const isNotificationsSlideoverOpen = ref(false)
  const isCommandPaletteOpen = ref(false)
  const isDark = ref(false)

  function toggleTheme() {
    isDark.value = !isDark.value
    themeGlobal.name.value = isDark.value ? 'dark' : 'light'
  }

  const keys = useMagicKeys()

  watch(() => keys['g_h']?.value, (v) => {
    if (v) router.push('/')
  })
  watch(() => keys['g_i']?.value, (v) => {
    if (v) router.push('/inbox')
  })
  watch(() => keys['g_c']?.value, (v) => {
    if (v) router.push('/customers')
  })
  watch(() => keys['g_s']?.value, (v) => {
    if (v) router.push('/settings')
  })
  watch(() => keys['n']?.value, (v) => {
    if (v) isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value
  })
  watch(() => keys['k_ctrl']?.value, (v) => {
    if (v) isCommandPaletteOpen.value = !isCommandPaletteOpen.value
  })

  watch(() => route.fullPath, () => {
    isNotificationsSlideoverOpen.value = false
  })

  return {
    isNotificationsSlideoverOpen,
    isCommandPaletteOpen,
    isDark,
    toggleTheme
  }
}

export const useDashboard = createSharedComposable(_useDashboard)

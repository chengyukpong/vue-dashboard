interface ToastItem {
  id: number
  title: string
  text?: string
  color?: string
  timeout?: number
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

export function useToast() {
  function add(item: { title: string, text?: string, color?: string, timeout?: number }) {
    const id = ++nextId
    const toast: ToastItem = {
      id,
      timeout: 4000,
      ...item
    }
    toasts.value.push(toast)

    if (toast.timeout && toast.timeout > 0) {
      setTimeout(() => remove(id), toast.timeout)
    }
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { add, remove, toasts }
}

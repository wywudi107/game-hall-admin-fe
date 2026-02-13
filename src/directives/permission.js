import { useUserStore } from '@/store/user'

export const permission = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const value = binding.value
    if (value && !userStore.hasPermission(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
}

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const adminInfo = ref(JSON.parse(localStorage.getItem('admin_info') || 'null'))

  const permissions = computed(() => {
    return adminInfo.value?.permissions || []
  })

  const roleKey = computed(() => {
    return adminInfo.value?.role_key || ''
  })

  function setLoginData(data) {
    token.value = data.token
    adminInfo.value = data.admin_info
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_info', JSON.stringify(data.admin_info))
  }

  function logout() {
    token.value = ''
    adminInfo.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
  }

  function hasPermission(perm) {
    if (roleKey.value === 'super_admin') return true
    return permissions.value.includes(perm)
  }

  return { token, adminInfo, permissions, roleKey, setLoginData, logout, hasPermission }
})

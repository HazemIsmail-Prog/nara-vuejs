import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import http, { csrf } from '../api/http'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const ready = ref(false)

  const isAuthenticated = computed(() => Boolean(user.value))

  async function fetchUser() {
    try {
      const { data } = await http.get('/user')
      user.value = data.user
    } catch {
      user.value = null
    } finally {
      ready.value = true
    }
  }

  async function login(email, password) {
    await csrf()
    const { data } = await http.post('/login', { email, password })
    user.value = data.user
    return user.value
  }

  async function logout() {
    await csrf()
    await http.post('/logout')
    user.value = null
  }

  return { user, ready, isAuthenticated, fetchUser, login, logout }
})

<template>
  <div class="flex min-h-screen items-center justify-center bg-cream px-5" dir="ltr">
    <form
      class="w-full max-w-sm rounded-3xl border border-stone bg-white p-6 shadow-sm sm:p-8"
      @submit.prevent="submit"
    >
      <div class="mb-8 text-center">
        <img
          src="/branding/logo.png"
          alt="NARA"
          class="mx-auto h-16 w-16 rounded-full object-cover"
        />
        <h1 class="mt-4 font-display text-3xl text-bronze">NARA</h1>
        <p class="mt-1 text-xs tracking-[0.3em] text-bronze/60 uppercase">Admin</p>
      </div>

      <label class="mb-4 block text-sm text-bronze">
        Email
        <input
          v-model="email"
          type="email"
          required
          class="mt-1 w-full rounded-xl border border-stone px-3 py-2 text-ink outline-none focus:border-bronze"
        />
      </label>
      <label class="mb-6 block text-sm text-bronze">
        Password
        <input
          v-model="password"
          type="password"
          required
          class="mt-1 w-full rounded-xl border border-stone px-3 py-2 text-ink outline-none focus:border-bronze"
        />
      </label>

      <p v-if="error" class="mb-4 text-sm text-red-700">{{ error }}</p>

      <button
        type="submit"
        class="w-full rounded-full bg-bronze py-2.5 text-sm tracking-wide text-cream disabled:opacity-60"
        :disabled="loading"
      >
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('admin@nara.cafe')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    await router.replace(route.query.redirect || '/admin/categories')
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not sign in.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-cream text-ink" dir="ltr">
    <header class="sticky top-0 z-20 border-b border-stone bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div class="flex min-w-0 items-center gap-3">
          <img src="/branding/logo.png" alt="" class="h-9 w-9 shrink-0 rounded-full object-cover" />
          <div class="min-w-0">
            <p class="font-display text-xl leading-none text-bronze">NARA</p>
            <p class="text-[10px] tracking-[0.25em] text-bronze/50 uppercase">Admin</p>
          </div>
        </div>
        <button type="button" class="shrink-0 text-sm text-bronze/70" @click="signOut">
          Sign out
        </button>
      </div>
      <nav class="mx-auto grid max-w-5xl grid-cols-2 border-t border-stone md:flex md:justify-end md:gap-6 md:border-t-0 md:px-4 md:pb-3">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="flex min-h-11 items-center justify-center px-2 text-xs md:min-h-0 md:px-0 md:text-sm"
          :class="isActive(tab) ? 'font-medium text-bronze' : 'text-bronze/50 hover:text-bronze'"
        >
          {{ tab.label }}
        </RouterLink>
      </nav>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-6 md:px-5 md:py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const tabs = [
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/items', label: 'Items' },
]

function isActive(tab) {
  return route.path.startsWith(tab.to)
}

async function signOut() {
  await auth.logout()
  await router.replace('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-cream text-ink">
    <div
      ref="topBar"
      class="sticky top-0 z-40 border-b border-stone/70 bg-cream/95 backdrop-blur-md"
    >
      <div dir="ltr" class="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2.5">
        <div class="flex min-w-0 items-center gap-2">
          <img src="/branding/logo.png" alt="" class="h-9 w-9 shrink-0 object-contain" />
          <span class="truncate font-display text-xl tracking-[0.12em] text-bronze sm:tracking-[0.2em]">NARA</span>
        </div>
        <LanguageSwitch />
      </div>
      <div
        ref="chipBar"
        class="mx-auto flex max-w-4xl gap-2 overflow-x-auto overscroll-x-contain px-4 pb-3 [scrollbar-width:none]"
      >
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          :data-slug="category.slug"
          class="flex shrink-0 items-center gap-2 rounded-full border py-1 pe-4 ps-1 text-sm"
          :class="
            activeSlug === category.slug
              ? 'border-bronze bg-bronze text-cream'
              : 'border-stone bg-white text-bronze'
          "
          @click="scrollTo(category.slug)"
        >
          <NaraMark
            :src="category.image_url"
            :alt="i18n.t(category.name_ar, category.name_en)"
          />
          {{ i18n.t(category.name_ar, category.name_en) }}
        </button>
      </div>
    </div>

    <header class="relative isolate h-[calc(100dvh-6.75rem)] min-h-[22rem] overflow-hidden">
      <div
        class="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat md:bg-fixed"
        :style="{ backgroundImage: `url(${heroImage})` }"
      />
      <div class="absolute inset-0 bg-bronze/50" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(247_241_240/0.92)_0%,rgb(247_241_240/0.55)_42%,rgb(26_18_18/0.35)_100%)]" />
      <div class="absolute inset-0 bg-linear-to-t from-cream via-cream/40 to-transparent" />
      <div class="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-5 text-center">
        <img
          src="/branding/logo.png"
          alt="NARA Café & Restaurant"
          class="h-44 w-44 object-contain sm:h-56 sm:w-56"
        />
        <p class="mt-6 max-w-md text-sm leading-relaxed text-bronze">
          {{ i18n.t('قائمة المائدة — أطباق ومشروبات مختارة بعناية.', 'Table menu — dishes and drinks, chosen with care.') }}
        </p>
      </div>
    </header>

    <main class="relative z-10 bg-cream px-4 py-10 sm:px-6">
      <div class="mx-auto max-w-4xl">
        <p v-if="loading" class="py-20 text-center text-sm text-bronze/60">
          {{ i18n.t('جاري تحميل المنيو…', 'Loading the menu…') }}
        </p>
        <p v-else-if="error" class="py-20 text-center text-sm text-red-700">
          {{ error }}
        </p>

        <section
          v-for="category in categories"
          :id="category.slug"
          :key="category.id"
          class="mb-14"
          :style="{ scrollMarginTop: `${navHeight + 8}px` }"
        >
          <div v-if="category.image_url" class="relative mb-6 h-44 overflow-hidden rounded-[1.5rem] sm:h-52">
            <FoodPhoto :src="category.image_url" :alt="i18n.t(category.name_ar, category.name_en)" />
            <div class="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/25 to-transparent" />
            <div class="absolute inset-x-0 bottom-0 p-6">
              <p class="text-[11px] tracking-[0.35em] text-cream/70 uppercase">NARA</p>
              <h2 class="font-display text-4xl break-words text-cream sm:text-5xl">
                {{ i18n.t(category.name_ar, category.name_en) }}
              </h2>
            </div>
          </div>
          <div v-else class="mb-6 flex items-center gap-4">
            <img src="/branding/logo.png" alt="" class="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20" />
            <div class="min-w-0">
              <h2 class="font-display text-4xl break-words text-bronze sm:text-5xl">
                {{ i18n.t(category.name_ar, category.name_en) }}
              </h2>
            </div>
          </div>

          <div class="relative px-4 py-4 sm:px-6 sm:py-5">
            <div class="pointer-events-none absolute inset-0 rounded-3xl border border-stone/50 bg-white/60" />
            <div class="relative">
              <MenuItemCard v-for="item in category.items" :key="item.id" :item="item" />
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="border-t border-stone/60 bg-cream px-5 pt-12 pb-[max(7rem,calc(env(safe-area-inset-bottom)+5rem))] text-center">
      <img src="/branding/logo.png" alt="" class="mx-auto h-16 w-16 object-contain" />
      <p class="mt-4 max-w-full px-2 text-xs tracking-[0.2em] text-bronze/50 uppercase sm:tracking-[0.3em]">NARA Café & Restaurant</p>
    </footer>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import http from '../api/http'
import { useLocaleStore } from '../stores/locale'
import FoodPhoto from '../components/FoodPhoto.vue'
import LanguageSwitch from '../components/LanguageSwitch.vue'
import MenuItemCard from '../components/MenuItemCard.vue'
import NaraMark from '../components/NaraMark.vue'

const heroImage =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&h=1200&q=80'

const i18n = useLocaleStore()
const categories = ref([])
const loading = ref(true)
const error = ref('')
const activeSlug = ref('')
const chipBar = ref(null)
const topBar = ref(null)
const navHeight = ref(112)

async function loadMenu() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await http.get('/menu')
    categories.value = data.data ?? data
    activeSlug.value = ''
  } catch {
    error.value = i18n.t('تعذر تحميل المنيو.', 'Could not load the menu.')
  } finally {
    loading.value = false
  }
}

function scrollChipsTo(slug) {
  const scroller = chipBar.value
  if (!scroller || !slug) {
    return
  }

  const chip = scroller.querySelector(`[data-slug="${CSS.escape(slug)}"]`)
  chip?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' })
}

function keepActiveChipCentered() {
  const slug = activeSlug.value
  if (!slug) {
    return
  }

  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollChipsTo(slug))
    })
  })
}

function scrollTo(slug) {
  activeSlug.value = slug
  document.getElementById(slug)?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

function measureNav() {
  navHeight.value = topBar.value?.offsetHeight ?? 112
}

function onScroll() {
  const offset = navHeight.value + 16
  const first = document.getElementById(categories.value[0]?.slug ?? '')
  if (!first || first.getBoundingClientRect().top > offset) {
    activeSlug.value = ''
    return
  }

  let current = categories.value[0]?.slug ?? ''
  for (const category of categories.value) {
    const el = document.getElementById(category.slug)
    if (el && el.getBoundingClientRect().top <= offset) {
      current = category.slug
    }
  }
  activeSlug.value = current
}

watch(activeSlug, (slug) => {
  nextTick(() => scrollChipsTo(slug))
})

watch(
  () => i18n.lang,
  () => keepActiveChipCentered(),
)

watch(categories, () => {
  nextTick(measureNav)
})

onMounted(() => {
  loadMenu()
  measureNav()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measureNav)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measureNav)
})
</script>

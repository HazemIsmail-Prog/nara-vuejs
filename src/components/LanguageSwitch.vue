<template>
  <div
    class="relative z-50 flex shrink-0 rounded-full border border-bronze/20 bg-white p-0.5 text-xs shadow-sm"
    role="group"
    :aria-label="i18n.t('اللغة', 'Language')"
  >
    <button
      type="button"
      class="rounded-full px-3 py-1.5 font-medium transition"
      :class="lang === 'ar' ? 'bg-bronze text-cream' : 'text-bronze/70 hover:text-bronze'"
      @click="useArabic"
    >
      العربية
    </button>
    <button
      type="button"
      class="rounded-full px-3 py-1.5 font-medium transition"
      :class="lang === 'en' ? 'bg-bronze text-cream' : 'text-bronze/70 hover:text-bronze'"
      @click="useEnglish"
    >
      English
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useLocaleStore } from '../stores/locale'

const i18n = useLocaleStore()
const { lang } = storeToRefs(i18n)

function useArabic() {
  i18n.setLang('ar')
}

function useEnglish() {
  i18n.setLang('en')
}
</script>

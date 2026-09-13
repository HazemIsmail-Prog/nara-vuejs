import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useLocaleStore = defineStore('nara-i18n', () => {
  const lang = ref(localStorage.getItem('nara-locale') === 'ar' ? 'ar' : 'en')

  const isRtl = computed(() => lang.value === 'ar')
  const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))

  watch(
    lang,
    (value) => {
      localStorage.setItem('nara-locale', value)
      document.documentElement.lang = value
      document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr'
    },
    { immediate: true },
  )

  function setLang(value) {
    lang.value = value === 'ar' ? 'ar' : 'en'
  }

  function t(ar, en) {
    return lang.value === 'ar' ? ar : en
  }

  return { lang, isRtl, dir, setLang, t }
})

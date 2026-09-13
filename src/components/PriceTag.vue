<template>
  <div class="shrink-0 text-end leading-tight">
    <template v-if="item.price_large">
      <div class="whitespace-nowrap text-[13px] font-semibold tabular-nums text-bronze">
        <span class="me-1 text-[9px] font-normal tracking-wider text-bronze/45 uppercase">M</span>
        {{ format(item.price) }}
      </div>
      <div class="mt-0.5 whitespace-nowrap text-[13px] font-semibold tabular-nums text-bronze">
        <span class="me-1 text-[9px] font-normal tracking-wider text-bronze/45 uppercase">L</span>
        {{ format(item.price_large) }}
      </div>
    </template>
    <template v-else>
      <span class="whitespace-nowrap text-[13px] font-semibold tabular-nums text-bronze">{{ format(item.price) }}</span>
    </template>
  </div>
</template>

<script setup>
import { useLocaleStore } from '../stores/locale'

defineProps({
  item: { type: Object, required: true },
})

const i18n = useLocaleStore()

function format(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  const amount = Number(value).toLocaleString(i18n.lang === 'ar' ? 'ar-EG' : 'en-EG', {
    maximumFractionDigits: 0,
  })
  return i18n.t(`${amount} ج.م.`, `${amount} EGP`)
}
</script>

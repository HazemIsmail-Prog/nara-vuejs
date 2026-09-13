<template>
  <article
    class="relative flex min-w-0 items-start gap-4 py-5 last:border-b-0"
    :class="
      item.is_new
        ? 'my-3 rounded-2xl bg-cream px-3 py-4 ring-2 ring-inset ring-bronze sm:px-4'
        : 'border-b border-stone/50'
    "
  >
    <div
      v-if="!isPlaceholder"
      class="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-stone/60 sm:h-28 sm:w-28"
    >
      <FoodPhoto
        :src="photoSrc"
        :alt="i18n.t(item.name_ar, item.name_en)"
        @missing="useLogo"
      />
    </div>
    <img
      v-else
      :src="logo"
      alt=""
      class="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
    />

    <div class="min-w-0 flex-1">
      <span
        v-if="item.is_new"
        class="mb-1.5 inline-flex items-center rounded-full bg-bronze px-2.5 py-1 text-xs font-semibold tracking-[0.16em] text-cream uppercase"
      >
        {{ i18n.t('جديد', 'New') }}
      </span>
      <div class="flex min-w-0 items-start gap-2">
        <h3 class="min-w-0 flex-1 text-[1.05rem] font-medium leading-snug break-words text-ink sm:text-lg">
          {{ i18n.t(item.name_ar, item.name_en) }}
        </h3>
        <PriceTag :item="item" />
      </div>
      <p
        v-if="i18n.t(item.description_ar, item.description_en)"
        class="mt-1.5 max-w-xl text-[13px] leading-relaxed text-bronze/70"
      >
        {{ i18n.t(item.description_ar, item.description_en) }}
      </p>
    </div>
  </article>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLocaleStore } from '../stores/locale'
import FoodPhoto from './FoodPhoto.vue'
import PriceTag from './PriceTag.vue'

const props = defineProps({
  item: { type: Object, required: true },
})

const logo = '/branding/logo.png'
const i18n = useLocaleStore()
const photoSrc = ref(props.item.image_url || logo)
const isPlaceholder = ref(!props.item.image_url)

watch(
  () => props.item.image_url,
  (value) => {
    photoSrc.value = value || logo
    isPlaceholder.value = !value
  },
)

function useLogo() {
  photoSrc.value = logo
  isPlaceholder.value = true
}
</script>

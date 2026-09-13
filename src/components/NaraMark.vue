<template>
  <img
    v-if="showLogo"
    src="/branding/logo.png"
    alt=""
    :class="logoClass"
  />
  <img
    v-else
    :src="src"
    :alt="alt"
    :class="photoClass"
    loading="lazy"
    decoding="async"
    referrerpolicy="no-referrer"
    @error="showLogo = true"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  logoClass: { type: String, default: 'h-7 w-7 object-contain' },
  photoClass: { type: String, default: 'h-7 w-7 rounded-full object-cover' },
})

const showLogo = ref(!props.src)

watch(
  () => props.src,
  (value) => {
    showLogo.value = !value
  },
)
</script>

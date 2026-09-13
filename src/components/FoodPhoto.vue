<template>
  <img
    v-if="current"
    :src="current"
    :alt="alt"
    :class="imgClass"
    loading="lazy"
    decoding="async"
    referrerpolicy="no-referrer"
    @error="onError"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  imgClass: { type: String, default: 'h-full w-full object-cover' },
})

const emit = defineEmits(['missing'])
const current = ref(props.src || '')

watch(
  () => props.src,
  (value) => {
    current.value = value || ''
  },
)

function onError() {
  current.value = ''
  emit('missing')
}
</script>

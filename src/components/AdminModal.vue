<template>
  <Teleport to="body">
    <div
      v-if="open"
      dir="ltr"
      class="fixed inset-0 z-50 flex items-end justify-center overflow-hidden sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
    >
      <button
        type="button"
        class="absolute inset-0 bg-ink/45"
        aria-label="Close"
        @click="emit('close')"
      />
      <div
        class="relative flex w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[min(85dvh,40rem)] sm:max-w-lg sm:rounded-3xl"
        :style="panelStyle"
      >
        <header class="flex shrink-0 items-center justify-between gap-3 border-b border-stone px-4 py-3">
          <h2 class="min-w-0 truncate font-display text-2xl text-bronze">{{ title }}</h2>
          <button
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-bronze/50 hover:bg-cream"
            aria-label="Close"
            @click="emit('close')"
          >
            ×
          </button>
        </header>
        <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [-webkit-overflow-scrolling:touch]">
          <slot />
        </div>
        <div class="shrink-0 border-t border-stone bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
})

const emit = defineEmits(['close'])
const panelStyle = ref({})

function viewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight
}

function syncHeight() {
  if (!props.open) {
    return
  }

  if (window.matchMedia('(min-width: 640px)').matches) {
    panelStyle.value = {}
    return
  }

  const height = Math.max(280, Math.floor(viewportHeight()))
  panelStyle.value = { height: `${height}px`, maxHeight: `${height}px` }
}

function onKey(event) {
  if (event.key === 'Escape' && props.open) {
    emit('close')
  }
}

function bindViewport() {
  window.visualViewport?.addEventListener('resize', syncHeight)
  window.visualViewport?.addEventListener('scroll', syncHeight)
  window.addEventListener('resize', syncHeight)
}

function unbindViewport() {
  window.visualViewport?.removeEventListener('resize', syncHeight)
  window.visualViewport?.removeEventListener('scroll', syncHeight)
  window.removeEventListener('resize', syncHeight)
}

watch(
  () => props.open,
  async (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (isOpen) {
      window.addEventListener('keydown', onKey)
      bindViewport()
      await nextTick()
      syncHeight()
    } else {
      window.removeEventListener('keydown', onKey)
      unbindViewport()
      panelStyle.value = {}
    }
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  unbindViewport()
})
</script>

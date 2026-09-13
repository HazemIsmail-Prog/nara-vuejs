<template>
  <div class="flex shrink-0 flex-col gap-1">
    <button
      type="button"
      class="flex h-11 w-11 items-center justify-center rounded-xl border border-stone text-bronze disabled:opacity-30"
      :disabled="index === 0 || busy"
      aria-label="Move up"
      @click="$emit('move', -1)"
    >
      <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M10 4.5 4.5 10h3.5v5.5h4V10h3.5L10 4.5Z" />
      </svg>
    </button>
    <button
      type="button"
      class="flex h-11 w-11 items-center justify-center rounded-xl border border-stone text-bronze disabled:opacity-30"
      :disabled="index >= total - 1 || busy"
      aria-label="Move down"
      @click="$emit('move', 1)"
    >
      <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M10 15.5 15.5 10h-3.5V4.5h-4V10H4.5L10 15.5Z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  busy: { type: Boolean, default: false },
})

defineEmits(['move'])
</script>

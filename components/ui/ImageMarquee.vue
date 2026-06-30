<template>
  <div class="relative w-full overflow-hidden py-6">
    <div class="flex gap-4 marquee-track">
      <img v-for="(src, i) in doubled" :key="i" :src="src" class="h-32 w-44 flex-shrink-0 object-contain bg-white border border-esp-gray p-2" />
    </div>
    <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-esp-gray to-transparent"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-esp-gray to-transparent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  images: { type: Array, required: true }
})

const doubled = computed(() => [...props.images, ...props.images])
</script>

<style scoped>
.marquee-track {
  width: max-content;
  animation: marquee-scroll 30s linear infinite;
}
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>

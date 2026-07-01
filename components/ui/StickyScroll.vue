<template>
  <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-10">
    <div class="space-y-6">
      <div
        v-for="(item, i) in items"
        :key="i"
        ref="stepRefs"
        class="p-6 transition-all duration-300 cursor-pointer"
        :class="active === i ? 'bg-white shadow-lg border-l-4 border-esp-blue' : 'bg-transparent opacity-50 hover:opacity-80'"
        @click="active = i"
      >
        <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">{{ item.title }}</h3>
        <p class="text-esp-black/70 text-sm leading-relaxed">{{ item.description }}</p>
      </div>
    </div>

    <div class="hidden lg:block sticky top-24 h-[400px] self-start">
      <div class="h-full w-full flex items-center justify-center text-white text-center p-8 transition-colors duration-500" :style="{ background: items[active]?.gradient }">
        <div>
          <div class="text-5xl mb-4">{{ items[active]?.icon }}</div>
          <p class="font-rounded text-xl font-semibold">{{ items[active]?.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  items: { type: Array, required: true } // [{ title, description, icon, gradient }]
})

const active = ref(0)
</script>

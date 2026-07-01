<template>
  <div class="relative">
    <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-esp-gray md:-translate-x-1/2"></div>
    <div v-for="(item, i) in items" :key="i" class="relative mb-10 md:grid md:grid-cols-2 md:gap-10" :class="i % 2 === 0 ? '' : ''">
      <div
        class="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full bg-esp-blue -translate-x-1/2 ring-4 ring-white z-10"
      ></div>
      <div :class="i % 2 === 0 ? 'md:text-right md:pr-14' : 'md:col-start-2 md:pl-14'" class="pl-12 md:pl-0">
        <span class="text-esp-blue font-rounded font-bold text-lg">{{ item.title }}</span>
        <div class="mt-2 bg-esp-gray p-5">
          <slot name="content" :item="item">
            <p class="text-esp-black/70 text-sm">{{ item.content }}</p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true } // [{ title, content }]
})
</script>

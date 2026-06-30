<template>
  <nav aria-label="breadcrumb" class="flex items-center gap-2 text-sm text-esp-black/50 font-inter flex-wrap">
    <template v-for="(item, i) in items" :key="i">
      <NuxtLink v-if="item.to && i < items.length - 1" :to="item.to" class="hover:text-esp-blue transition">
        {{ item.label }}
      </NuxtLink>
      <span v-else class="text-esp-black" aria-current="page">{{ item.label }}</span>
      <svg v-if="i < items.length - 1" class="w-4 h-4 text-esp-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </template>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
    // [{ label: 'Оборудование', to: '/equipment' }, { label: 'Флотатор' }]
  }
})
</script>

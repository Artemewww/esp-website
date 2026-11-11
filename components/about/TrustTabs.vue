<template>
  <!-- Переключатель между страницами доверия: отзывы · сертификаты · документация (#63) -->
  <nav class="tt" aria-label="Документы ESP">
    <NuxtLink v-for="t in tabs" :key="t.to" :to="t.to" class="tt-a" :class="{ 'is-on': route.path === t.to }">{{ t.label }}</NuxtLink>
  </nav>
</template>

<script setup>
const route = useRoute()
const tabs = [
  { to: '/about/reviews', label: 'Отзывы' },
  { to: '/about/certifications', label: 'Сертификаты' },
  { to: '/about/documentation', label: 'Документация' }
]
</script>

<style scoped>
.tt { display: flex; justify-content: center; gap: 4px; width: fit-content; max-width: 100%; margin: 0 auto; padding: 4px; border-radius: var(--r-pill); background: #f5f5f7; overflow-x: auto; scrollbar-width: none; font-family: var(--dj-font); }
.tt-a { flex-shrink: 0; padding: 8px 18px; border-radius: var(--r-pill); font-size: 14px; letter-spacing: -0.016em; color: #1d1d1f; white-space: nowrap; transition: background .3s, color .3s; }
.tt-a:hover { color: #0a3a8c; }
.tt-a.is-on { background: #fff; color: #002366; font-weight: 600; box-shadow: var(--sh-1); }
</style>

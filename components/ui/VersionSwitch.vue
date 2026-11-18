<template>
  <!-- Переключатель для показа клиенту: старая главная «/» ↔ новая «/home-2026». -->
  <nav class="vs" aria-label="Версия главной страницы">
    <NuxtLink to="/" class="vs-btn" :class="{ 'is-on': !isNew }">Старая версия</NuxtLink>
    <NuxtLink to="/home-2026" class="vs-btn" :class="{ 'is-on': isNew }">Новая версия</NuxtLink>
  </nav>
</template>

<script setup>
const route = useRoute()
const isNew = computed(() => route.path.replace(/\/$/, '') === '/home-2026')
</script>

<style scoped>
.vs {
  position: fixed;
  left: 50%;
  top: 96px; /* под шапкой: внизу hero у обеих главных заняты слайдером и кнопкой фильма */
  transform: translateX(-50%);
  z-index: 45; /* ниже шапок (50/60): открытое меню перекрывает переключатель */
  display: flex;
  gap: 2px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(14, 18, 26, 0.78);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  backdrop-filter: blur(14px) saturate(1.4);
  box-shadow: 0 8px 28px rgba(0, 10, 30, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
}
.vs-btn {
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}
.vs-btn:hover { color: #fff; }
.vs-btn.is-on { background: #fff; color: #002366; }
@media (max-width: 380px) {
  .vs-btn { padding: 8px 12px; font-size: 13px; }
}
</style>

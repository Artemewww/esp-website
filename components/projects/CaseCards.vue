<template>
  <!-- Реализованные объекты: фото (живой клип) во всю карточку, текст поверх — как на странице отраслей -->
  <ul class="cc" :class="`cc--${Math.min(items.length, 3)}`">
    <li v-for="p in items" :key="p.slug" class="cc-i dj-reveal">
      <NuxtLink :to="`/projects/${p.slug}`" class="cc-card">
        <img v-if="p.poster" class="cc-poster" :src="p.poster" :alt="p.name" loading="lazy" decoding="async" />
        <video v-if="p.video" v-lazy-video :data-src="p.video" :poster="p.poster" muted loop playsinline preload="none" aria-hidden="true" />
        <span class="cc-body">
          <span v-if="p.category" class="cc-cat">{{ p.category }}</span>
          <b class="cc-title">{{ p.name }}</b>
          <span class="cc-place">{{ [p.place, p.capacity].filter(Boolean).join(' · ') }}</span>
        </span>
        <span class="cc-more">Подробнее ›</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
defineProps({ items: { type: Array, required: true } })
</script>

<style scoped>
.cc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; width: min(980px, 87.5vw); margin: 0 auto; padding: 0; list-style: none; }
.cc--1 { grid-template-columns: minmax(0, 720px); justify-content: center; }
.cc--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.cc-card { position: relative; display: flex; flex-direction: column; justify-content: space-between; aspect-ratio: 3 / 2; min-height: 300px; overflow: hidden; isolation: isolate; border-radius: var(--r-lg, 28px); background: #0b0d10; color: #fff; text-decoration: none; }
.cc--3 .cc-card { aspect-ratio: 4 / 5; }
.cc-card img, .cc-card video { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.cc-card:hover img, .cc-card:hover video { transform: scale(1.04); }
.cc-card::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 12, 32, 0.6) 0%, rgba(0, 12, 32, 0.15) 38%, rgba(0, 12, 32, 0) 60%, rgba(0, 12, 32, 0.45) 100%); }
.cc-body { display: grid; gap: 8px; padding: clamp(22px, 2.6vw, 34px); }
.cc-cat { font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.85); }
.cc-title { font-size: clamp(22px, 2.4vw, 32px); line-height: 1.14; font-weight: 600; letter-spacing: -0.015em; text-wrap: balance; }
.cc-place { font-size: 15px; color: rgba(255, 255, 255, 0.82); }
.cc-more { padding: 0 clamp(22px, 2.6vw, 34px) clamp(22px, 2.6vw, 30px); font-size: 16px; }
@media (max-width: 1000px) { .cc { grid-template-columns: repeat(2, minmax(0, 1fr)); } .cc--3 .cc-card { aspect-ratio: 3 / 4; } }
@media (max-width: 734px) { .cc { width: calc(100% - 32px); } }
@media (max-width: 680px) { .cc, .cc--2 { grid-template-columns: 1fr; } .cc-card, .cc--3 .cc-card { aspect-ratio: 4 / 5; } }
</style>

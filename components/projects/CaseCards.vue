<template>
  <!-- Превью реализованных объектов: живая съёмка (или фото), категория,
       название, место и мощность, короткое описание. Видео грузится у экрана. -->
  <ul class="cc" :class="`cc--${Math.min(items.length, 3)}`">
    <li v-for="p in items" :key="p.slug" class="cc-i dj-reveal">
      <NuxtLink :to="`/projects/${p.slug}`" class="cc-card">
        <span class="cc-media">
          <img v-if="p.poster" class="cc-poster" :src="p.poster" :alt="p.name" loading="lazy" decoding="async" />
          <video v-if="p.video" v-lazy-video :data-src="p.video" :poster="p.poster" muted loop playsinline preload="none" aria-hidden="true" />
          <span v-if="p.capacity" class="cc-cap">{{ p.capacity }}</span>
        </span>
        <span class="cc-body">
          <span v-if="p.category" class="cc-cat">{{ p.category }}</span>
          <b class="cc-title">{{ p.name }}</b>
          <span v-if="p.place" class="cc-place">{{ p.place }}</span>
          <span v-if="p.desc" class="cc-desc">{{ p.desc }}</span>
          <span class="cc-more">Подробнее об объекте ›</span>
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
defineProps({ items: { type: Array, required: true } })
</script>

<style scoped>
.cc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; width: min(980px, 87.5vw); margin: 0 auto; padding: 0; list-style: none; }
.cc--1 { grid-template-columns: minmax(0, 560px); justify-content: center; }
.cc--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.cc-card { display: flex; flex-direction: column; height: 100%; overflow: hidden; border-radius: var(--r-lg, 28px); background: #fff; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06); color: #1A1A1A; text-decoration: none; transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.cc-card:hover { transform: translateY(-4px); }
.cc-media { position: relative; display: block; aspect-ratio: 16 / 10; overflow: hidden; background: #0b0d10; }
.cc-media img, .cc-media video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.cc-cap { position: absolute; left: 14px; bottom: 14px; padding: 6px 12px; border-radius: 999px; background: rgba(10, 14, 20, 0.55); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); color: #fff; font-size: 13px; font-weight: 600; }
.cc-body { display: flex; flex-direction: column; gap: 8px; flex: 1; padding: 22px 24px 26px; }
.cc-cat { font-size: 13px; font-weight: 600; color: #002366; }
.cc-title { font-size: 21px; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
.cc-place { font-size: 15px; color: #5E5E5E; }
.cc-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-size: 15px; line-height: 1.45; color: #5E5E5E; }
.cc-more { margin-top: auto; padding-top: 10px; font-size: 15px; color: #002366; }
@media (max-width: 1000px) { .cc { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 734px) { .cc { width: calc(100% - 48px); } }
@media (max-width: 680px) { .cc, .cc--2 { grid-template-columns: 1fr; } }
</style>

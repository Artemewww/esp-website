<template>
  <!-- Блок сравнения моделей («Which … is right for you?») с apple.com:
       колонки с кадром, названием, кнопками и строками характеристик. -->
  <div class="cp" :class="{ 'cp--dark': dark }" :style="{ '--n': Math.min(columns.length, 4) }">
    <article v-for="c in columns" :key="c.title" class="cp-col dj-reveal">
      <span v-if="c.image" class="cp-media" :class="{ 'is-contain': c.contain }">
        <img :src="c.image" :alt="c.title" loading="lazy" decoding="async" />
      </span>
      <span v-if="c.eyebrow" class="cp-eyebrow">{{ c.eyebrow }}</span>
      <h3 class="cp-title">{{ c.title }}</h3>
      <p v-if="c.text" class="cp-text">{{ c.text }}</p>
      <div v-if="c.to || c.more" class="cp-act">
        <NuxtLink v-if="c.to" :to="c.to" class="cp-btn">{{ c.cta || 'Подробнее' }}</NuxtLink>
        <NuxtLink v-if="c.more" :to="c.more.to" class="cp-link">{{ c.more.label }}</NuxtLink>
      </div>
      <ul v-if="c.rows?.length" class="cp-rows">
        <li v-for="(r, j) in c.rows" :key="j">
          <b v-if="r.value">{{ r.value }}</b>
          <span>{{ r.label }}</span>
        </li>
      </ul>
    </article>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, required: true },
  dark: { type: Boolean, default: false }
})
</script>

<style scoped>
.cp { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: clamp(24px, 3vw, 44px); width: min(1080px, 87.5vw); margin: 0 auto; font-family: var(--dj-font); }
.cp-col { display: flex; flex-direction: column; align-items: center; text-align: center; min-width: 0; }
.cp-media { display: block; width: 100%; aspect-ratio: 4 / 3; margin-bottom: 28px; overflow: hidden; border-radius: 18px; background: #f5f5f7; }
.cp--dark .cp-media { background: #1d1d1f; }
.cp-media img { width: 100%; height: 100%; object-fit: cover; }
.cp-media.is-contain img { object-fit: contain; padding: 8%; }
.cp-eyebrow { font-size: 12px; line-height: 1.33; font-weight: 600; letter-spacing: -0.01em; color: #b64400; }
.cp--dark .cp-eyebrow { color: #f56300; }
.cp-title { margin: 6px 0 0; font-size: clamp(21px, 2vw, 24px); line-height: 1.17; font-weight: 600; letter-spacing: 0.009em; color: #1d1d1f; text-wrap: balance; }
.cp--dark .cp-title { color: #f5f5f7; }
@media (min-width: 834px) {
  .cp-title { min-height: 2.34em; }
  .cp-text { min-height: 2.94em; }
}
.cp-text { margin: 10px 0 0; max-width: 28em; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.cp--dark .cp-text { color: #86868b; }
.cp-act { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px 20px; margin-top: 22px; }
.cp-btn { display: inline-flex; align-items: center; min-height: 36px; padding: 0 16px; border-radius: 980px; font-size: 14px; letter-spacing: -0.016em; background: #002366; color: #fff; transition: background-color 0.2s ease; }
.cp--dark .cp-btn { background: #0071e3; }
.cp-btn:hover { background: #0b3a8c; }
.cp--dark .cp-btn:hover { background: #0077ed; }
.cp-link { display: inline-flex; gap: 3px; font-size: 14px; letter-spacing: -0.016em; color: #0066cc; }
.cp--dark .cp-link { color: #2997ff; }
.cp-link::after { content: '›'; font-size: 1.15em; line-height: 1; }
.cp-link:hover { text-decoration: underline; }
.cp-rows { align-self: stretch; margin: 32px 0 0; padding: 0; list-style: none; border-top: 1px solid #d2d2d7; }
.cp--dark .cp-rows { border-color: #424245; }
.cp-rows li { display: flex; flex-direction: column; gap: 4px; padding: 22px 0; border-bottom: 1px solid #d2d2d7; }
.cp--dark .cp-rows li { border-color: #424245; }
.cp-rows b { font-size: clamp(19px, 1.7vw, 24px); line-height: 1.17; font-weight: 600; letter-spacing: 0.009em; color: #1d1d1f; overflow-wrap: anywhere; }
.cp--dark .cp-rows b { color: #f5f5f7; }
.cp-rows span { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.cp--dark .cp-rows span { color: #86868b; }

@media (max-width: 833px) {
  .cp { display: flex; gap: 20px; width: 100%; padding: 0 6.25vw; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 6.25vw; scrollbar-width: none; }
  .cp::-webkit-scrollbar { display: none; }
  .cp-col { flex: 0 0 74%; scroll-snap-align: start; }
}
</style>

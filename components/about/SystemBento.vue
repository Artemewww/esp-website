<template>
  <!-- «Что даёт одна система»: бенто как AppleBento, плюс плитки
       с прозрачным рендером на светлом фоне (art) и с людьми (people). -->
  <ul class="sb">
    <li
      v-for="(it, i) in items"
      :key="i"
      class="sb-tile dj-reveal"
      :class="[`sb--${it.size || 'sm'}`, { 'sb--tall': it.tall, 'sb--photo': it.image, 'sb--ink': it.tone === 'ink', 'sb--art': it.art, 'sb--people': it.people }]"
    >
      <img v-if="it.image" class="sb-img" :srcset="srcset(it.image)" sizes="(max-width: 734px) 100vw, 33vw" :src="it.image" :alt="it.alt || ''" loading="lazy" decoding="async" />
      <img v-if="it.art" class="sb-art" :srcset="srcset(it.art)" sizes="(max-width: 734px) 100vw, 33vw" :src="it.art" :alt="it.alt || ''" width="1400" height="933" loading="lazy" decoding="async" />
      <img v-if="it.people" class="sb-people" :srcset="srcset(it.people)" sizes="(max-width: 734px) 100vw, 33vw" :src="it.people" :alt="it.alt || ''" width="1200" height="1100" loading="lazy" decoding="async" />
      <span v-if="it.kicker" class="sb-kicker">{{ it.kicker }}</span>
      <b v-if="it.value" class="sb-value">{{ it.value }}</b>
      <span v-if="it.label" class="sb-label">{{ it.label }}</span>
    </li>
  </ul>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
defineProps({ items: { type: Array, required: true } })
</script>

<style scoped>
.sb { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-auto-flow: dense; gap: 16px; width: min(1080px, 87.5vw); margin: 0 auto; padding: 0; list-style: none; font-family: var(--dj-font); }
.sb-tile { position: relative; display: flex; flex-direction: column; justify-content: flex-end; gap: 6px; min-height: 260px; padding: clamp(24px, 2.6vw, 36px); overflow: hidden; border-radius: var(--r-lg); background: #fff; color: #1A1A1A; isolation: isolate; }
.sb--xs { grid-column: span 3; }
.sb--sm { grid-column: span 4; }
.sb--md { grid-column: span 6; }
.sb--lg { grid-column: span 8; grid-row: span 2; }
.sb--tall { grid-row: span 2; }
.sb-kicker { font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #5E5E5E; }
.sb-value { font-size: clamp(44px, 5vw, 72px); line-height: 1.04; font-weight: 600; letter-spacing: -0.015em; color: #002366; font-variant-numeric: tabular-nums; }
.sb-label { font-size: clamp(17px, 1.5vw, 21px); line-height: 1.24; font-weight: 600; letter-spacing: 0.011em; }

/* Фото во всю плитку */
.sb--photo { min-height: 420px; color: #EDEDED; background: #000; }
.sb-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1); }
.sb--photo::after { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--scrim-b, linear-gradient(180deg, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.6) 100%)); }
.sb--photo:hover .sb-img { transform: scale(1.03); }
.sb--photo .sb-kicker { color: rgba(237, 237, 237, 0.82); }
.sb--photo .sb-value { color: #fff; }

/* Фирменный синий */
.sb--ink { background: #002366; color: #fff; }
.sb--ink .sb-value { color: #fff; }
.sb--ink .sb-kicker { color: rgba(255, 255, 255, 0.72); }

/* Рендер на светлом фоне: картинка целиком сверху, подпись снизу, без заливок поверх */
.sb--art { min-height: 420px; padding-top: clamp(16px, 2vw, 24px); background: #fff; }
.sb-art { display: block; flex: 1 1 0; min-height: 0; width: 100%; margin-bottom: 14px; object-fit: contain; transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1); }
.sb--art:hover .sb-art { transform: scale(1.03); }
.sb--art .sb-label { max-width: 26ch; }

/* Плитка с людьми: пара стоит над цифрой и выходит за верхний край плитки,
   к низу мягко растворяется в белом — цифру не перекрывает */
.sb--people { overflow: visible; min-height: 520px; }
.sb--people .sb-value, .sb--people .sb-label { position: relative; z-index: 1; }
.sb-people { position: absolute; left: 50%; top: -44px; z-index: 0; width: min(100%, 380px); height: auto; transform: translateX(-50%); pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, #000 72%, transparent 98%); mask-image: linear-gradient(180deg, #000 72%, transparent 98%); }

@media (max-width: 833px) {
  .sb { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .sb--xs, .sb--sm { grid-column: span 1; }
  .sb--md, .sb--lg, .sb--people { grid-column: 1 / -1; grid-row: auto; }
  .sb-tile { min-height: 200px; border-radius: var(--r-md); padding: 22px; }
  .sb--photo { min-height: 380px; }
  .sb--art { min-height: 340px; }
  .sb-value { font-size: clamp(34px, 9vw, 48px); }
  .sb--people { min-height: 470px; margin-top: 36px; }
  .sb-people { width: min(92%, 360px); top: -36px; }
}
@media (max-width: 420px) {
  .sb--xs, .sb--sm { grid-column: 1 / -1; min-height: 0; }
  .sb--people { min-height: 440px; }
  .sb--art { min-height: 300px; }
}
@media (prefers-reduced-motion: reduce) {
  .sb-img, .sb-art { transition: none; }
}
</style>

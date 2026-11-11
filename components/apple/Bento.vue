<template>
  <!-- Бенто-сетка цифр и фактов, как на apple.com. size: sm (треть),
       md (половина), lg (две трети, две строки), full (вся ширина). -->
  <ul class="bn" :class="{ 'bn--dark': dark }">
    <li
      v-for="(it, i) in items"
      :key="i"
      class="bn-tile dj-reveal"
      :class="[`bn--${it.size || 'sm'}`, { 'bn--photo': it.image, 'bn--ink': it.tone === 'ink' }]"
    >
      <img v-if="it.image" class="bn-img" :src="it.image" :alt="it.alt || ''" loading="lazy" decoding="async" />
      <span v-if="it.kicker" class="bn-kicker">{{ it.kicker }}</span>
      <b v-if="it.value" class="bn-value" :class="{ 'is-long': String(it.value).length > 12 }">{{ it.value }}</b>
      <span v-if="it.label" class="bn-label">{{ it.label }}</span>
      <span v-if="it.text" class="bn-text">{{ it.text }}</span>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  dark: { type: Boolean, default: false }
})
</script>

<style scoped>
.bn { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-flow: dense; gap: 16px; width: min(1080px, 87.5vw); margin: 0 auto; padding: 0; list-style: none; font-family: var(--dj-font); }
.bn-tile { position: relative; display: flex; flex-direction: column; justify-content: flex-end; gap: 6px; min-height: 260px; padding: clamp(24px, 2.6vw, 36px); overflow: hidden; border-radius: var(--r-lg); background: #fff; color: #1A1A1A; isolation: isolate; }
.bn--dark .bn-tile { background: #1A1A1A; color: #EDEDED; }
.bn--sm { grid-column: span 2; }
.bn--md { grid-column: span 3; }
.bn--lg { grid-column: span 4; grid-row: span 2; }
.bn--full { grid-column: 1 / -1; }
.bn-kicker { font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #5E5E5E; }
.bn-value { font-size: clamp(44px, 5vw, 72px); line-height: 1.04; font-weight: 600; letter-spacing: -0.015em; background: linear-gradient(90deg, #002366 0%, #002366 100%); -webkit-background-clip: text; background-clip: text; color: transparent; font-variant-numeric: tabular-nums; }
.bn-value.is-long { font-size: clamp(26px, 2.6vw, 36px); line-height: 1.12; }
.bn--lg .bn-value { font-size: clamp(64px, 9vw, 128px); }
.bn--dark .bn-value, .bn--photo .bn-value, .bn--ink .bn-value { background-image: linear-gradient(90deg, #fff 0%, #a9cdff 100%); }
.bn-label { font-size: clamp(17px, 1.5vw, 21px); line-height: 1.24; font-weight: 600; letter-spacing: 0.011em; }
.bn-text { max-width: 34em; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.bn--dark .bn-text, .bn--dark .bn-kicker { color: #8A8A8A; }
.bn--ink { background: #002366 !important; color: #fff; }
.bn--ink .bn-text, .bn--ink .bn-kicker { color: rgba(255, 255, 255, 0.72); }
.bn--photo { min-height: 420px; color: #EDEDED; background: #000; }
.bn-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1); }
.bn--photo::after { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--scrim-b); }
.bn--photo:hover .bn-img { transform: scale(1.03); }
.bn--photo .bn-text, .bn--photo .bn-kicker { color: rgba(237, 237, 237, 0.82); }

@media (max-width: 833px) {
  .bn { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .bn--sm { grid-column: span 1; }
  .bn--md, .bn--lg, .bn--full { grid-column: 1 / -1; grid-row: auto; }
  .bn-tile { min-height: 200px; border-radius: var(--r-md); padding: 22px; }
  .bn--photo { min-height: 380px; }
  .bn-value { font-size: clamp(34px, 9vw, 48px); }
  .bn--lg .bn-value { font-size: clamp(64px, 18vw, 96px); }
  .bn-value.is-long { font-size: 22px; }
}
@media (max-width: 420px) {
  .bn--sm { grid-column: 1 / -1; min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .bn-img { transition: none; }
}
</style>

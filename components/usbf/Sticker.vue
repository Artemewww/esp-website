<template>
  <!-- Наклейка из стикер-пака USBF: вырубка с белым кантом, тень, лёгкий наклон.
       Каждая — один факт о технологии, который подтверждён на сайте. -->
  <span class="us" :class="`us--${kind}`" :style="{ '--tilt': tilt + 'deg', '--s': size }" :title="title" role="img" :aria-label="title">
    <template v-if="kind === 'main'">
      <svg class="us-ring" viewBox="0 0 120 120" aria-hidden="true">
        <defs><path id="us-ring-p" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" /></defs>
        <circle cx="60" cy="60" r="58" fill="#002366" />
        <text font-size="9.4" font-weight="600" letter-spacing="2.2" fill="#fff" fill-opacity=".86"><textPath href="#us-ring-p">UPFLOW · SLUDGE · BLANKET · FILTRATION ·</textPath></text>
      </svg>
      <span class="us-core"><UsbfMark bg="#FFFFFF" fg="#002366" accent="#1B9BE0" /><b>USBF</b></span>
    </template>
    <template v-else-if="kind === 'chip'">
      <span class="us-chipmark"><UsbfMark /></span><b>USBF</b>
    </template>
    <template v-else>
      <b>{{ KINDS[kind].big }}</b><small>{{ KINDS[kind].small }}</small>
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  kind: { type: String, default: 'main' },
  tilt: { type: Number, default: -6 },
  size: { type: Number, default: 1 }
})
// Факты — из описания станции ВС и главы «Технология USBF» на сайте
const KINDS = {
  98: { big: 'до 98 %', small: 'очистка по БПК и ХПК', t: 'До 98 % очистки по БПК/ХПК' },
  np: { big: 'N + P', small: 'азот и фосфор — биологически', t: 'Полная нитрификация, денитрификация и биологическая дефосфоризация' },
  one: { big: '1 резервуар', small: 'предочистка + биология', t: 'Механическая предочистка и биологическая очистка в одном резервуаре' },
  up: { big: '↑ снизу вверх', small: 'вода фильтруется через ил', t: 'Восходящий поток через слой активного ила' },
  steel: { big: 'AISI 304', small: 'нержавейка внутри', t: 'Внутренние конструкции — нержавеющая сталь AISI-304' },
  years: { big: '28 лет', small: 'в биологической очистке', t: '28 лет практики в биологической очистке' }
}
const title = computed(() => (props.kind === 'main' || props.kind === 'chip' ? 'USBF — Upflow Sludge Blanket Filtration: восходящая фильтрация через слой активного ила' : KINDS[props.kind]?.t || ''))
</script>

<style scoped>
.us {
  --tilt: -6deg; --s: 1;
  position: relative; display: inline-flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 2px;
  padding: calc(10px * var(--s)) calc(16px * var(--s)); border-radius: calc(16px * var(--s));
  font-family: var(--dj-font); color: #fff; background: #002366;
  /* белый кант вырубки + мягкая тень, как у настоящей наклейки */
  box-shadow: 0 0 0 calc(4px * var(--s)) #fff, 0 calc(6px * var(--s)) calc(16px * var(--s)) rgba(0, 20, 60, 0.22), 0 1px 2px rgba(0, 20, 60, 0.18);
  transform: rotate(var(--tilt)); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
  white-space: nowrap; user-select: none;
}
.us:hover { transform: rotate(0deg) translateY(-3px) scale(1.04); }
/* блик по плёнке */
.us::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(120deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 38%); }
.us b { font-size: calc(22px * var(--s)); line-height: 1.05; font-weight: 600; letter-spacing: -0.01em; }
.us small { font-size: calc(12px * var(--s)); line-height: 1.2; opacity: 0.86; }
.us--98 { background: #006039; }
.us--np { background: #fff; color: #002366; }
.us--np small { color: #5E5E5E; opacity: 1; }
.us--up { background: #1B9BE0; }
.us--steel { background: linear-gradient(135deg, #F4F5F7, #C9CDD3 55%, #EEF0F2); color: #1A1A1A; }
.us--steel small { color: #4A4A4A; opacity: 1; }
.us--years { background: #1A1A1A; }
.us--main { width: calc(120px * var(--s)); height: calc(120px * var(--s)); padding: 0; border-radius: 50%; background: none; align-items: center; }
.us--main::after { border-radius: 50%; }
.us-ring { position: absolute; inset: 0; width: 100%; height: 100%; }
.us-core { position: relative; display: grid; justify-items: center; gap: calc(3px * var(--s)); }
.us-core :deep(.um) { width: calc(42px * var(--s)); height: calc(42px * var(--s)); }
.us-core b { font-size: calc(17px * var(--s)); letter-spacing: 0.04em; }
.us--chip { flex-direction: row; align-items: center; gap: calc(7px * var(--s)); padding: calc(5px * var(--s)) calc(12px * var(--s)) calc(5px * var(--s)) calc(5px * var(--s)); border-radius: 999px; }
.us--chip b { font-size: calc(15px * var(--s)); letter-spacing: 0.04em; }
.us-chipmark { display: block; width: calc(26px * var(--s)); height: calc(26px * var(--s)); }
.us-chipmark :deep(rect) { fill: #fff; fill-opacity: 0.14; }
@media (prefers-reduced-motion: reduce) { .us { transition: none; } }
</style>

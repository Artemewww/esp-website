<template>
  <!-- Живое небо над съёмкой объекта (только страницы объектов).
       Облака — реальные PNG без фона; уникальность каждого облака задаётся
       своим масштабом, сжатием, зеркалом, наклоном, яркостью и «глубиной» (размытие).
       Ветер дует в одну сторону, дальние слои медленнее (параллакс); облако
       медленно проявляется, плывёт и тает — как в жизни, без рывков и разворотов.
       seam — гряда поверх стыка неба и съёмки: всегда перекрыта несколькими слоями. -->
  <div :class="seam ? 'seam' : 'sky'" aria-hidden="true">
    <span v-if="!seam" class="sky-sun" />
    <img
      v-for="(c, i) in list"
      :key="i"
      class="cl"
      :src="`/images/sky/${c.s}.webp`"
      alt=""
      decoding="async"
      :style="style(c)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ seam: { type: Boolean, default: false } })

// x/y — % контейнера (yb — от низа); w — ширина, % контейнера; sy — сжатие по высоте;
// f — зеркало; r — наклон; o — непрозрачность; b — размытие (глубина); l — яркость;
// d — длительность цикла, с; dx — путь ветра, vw; ph — фаза 0–1 (разный старт)
const SKY = [
  { s: 'veil', x: -12, y: -8, w: 72, sy: 1, f: -1, o: 0.55, d: 260, dx: 10, ph: 0.15 },
  { s: 'veil', x: 42, y: -12, w: 78, sy: 0.85, f: 1, o: 0.45, d: 320, dx: 10, ph: 0.6 },
  { s: 'cum-big', x: 73, y: 3, w: 30, sy: 0.92, f: 1, r: -2, o: 0.96, d: 230, dx: 9, ph: 0.35 },
  { s: 'cum-big', x: -13, yb: 9, w: 33, sy: 0.82, f: -1, r: 1.5, o: 0.95, d: 250, dx: 9, ph: 0.7 },
  { s: 'puff-1', x: 21, y: 13, w: 6.5, sy: 0.9, f: 1, o: 0.85, b: 0.4, d: 170, dx: 8, ph: 0.2 },
  { s: 'puff-2', x: 63, y: 31, w: 5.5, sy: 0.8, f: -1, o: 0.8, b: 0.6, d: 190, dx: 8, ph: 0.85 },
  { s: 'band', x: -4, yb: 16, w: 58, sy: 0.55, f: 1, o: 0.7, b: 1.2, l: 0.97, d: 340, dx: 7, ph: 0.4 },
  { s: 'band', x: 48, yb: 24, w: 54, sy: 0.45, f: -1, o: 0.6, b: 1.6, l: 0.96, d: 380, dx: 7, ph: 0.05 },
  { s: 'cum-big', x: 40, yb: 10, w: 13, sy: 0.62, f: -1, o: 0.6, b: 1.2, l: 0.95, d: 300, dx: 6, ph: 0.55 }
]
const SEAM = [
  { s: 'band', x: -16, y: 26, w: 72, sy: 1, f: 1, o: 0.97, d: 260, dx: 12, ph: 0.1 },
  { s: 'band', x: 38, y: 34, w: 76, sy: 1.2, f: -1, o: 0.97, d: 300, dx: 12, ph: 0.5 },
  { s: 'band', x: 12, y: 48, w: 56, sy: 0.85, f: -1, o: 0.85, d: 280, dx: 12, ph: 0.8 },
  { s: 'band', x: 62, y: 46, w: 52, sy: 0.9, f: 1, o: 0.85, d: 320, dx: 12, ph: 0.3 },
  { s: 'veil', x: 4, y: 4, w: 62, sy: 0.8, f: 1, o: 0.6, d: 340, dx: 11, ph: 0.65 },
  { s: 'cum-big', x: 70, y: -14, w: 27, sy: 0.78, f: 1, r: 2, o: 0.92, d: 240, dx: 11, ph: 0.45 },
  { s: 'cum-big', x: -7, y: -20, w: 23, sy: 0.85, f: -1, r: -1.5, o: 0.92, d: 270, dx: 11, ph: 0.9 },
  { s: 'puff-1', x: 30, y: 4, w: 7.5, sy: 0.85, f: -1, o: 0.9, d: 200, dx: 10, ph: 0.25 },
  { s: 'puff-2', x: 54, y: 12, w: 6.5, sy: 0.9, f: 1, o: 0.88, d: 210, dx: 10, ph: 0.7 }
]
const list = computed(() => (props.seam ? SEAM : SKY))

const style = (c) => ({
  left: `${c.x}%`,
  ...(c.yb != null ? { bottom: `${c.yb}%` } : { top: `${c.y}%` }),
  width: `calc(${c.w}% * var(--k, 1))`,
  '--fx': c.f || 1,
  '--sy': c.sy || 1,
  '--r': `${c.r || 0}deg`,
  '--o': c.o,
  '--dx': `${c.dx}vw`,
  filter: `blur(${c.b || 0}px) brightness(${c.l || 1})`,
  animationDuration: `${c.d}s`,
  animationDelay: `${-(c.ph || 0) * c.d}s`
})
</script>

<style scoped>
.sky { position: absolute; inset: 0; overflow: hidden; background: linear-gradient(180deg, #1d4f93 0%, #3b72b8 38%, #7ea6d6 72%, #bdd6ed 100%); }
.sky-sun { position: absolute; right: 8%; top: -30%; width: 70vw; height: 70vw; max-width: 1100px; max-height: 1100px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 248, 230, 0.45) 0%, rgba(255, 248, 230, 0) 60%); }
.seam { position: absolute; overflow: hidden; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 50%, transparent 92%); mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 50%, transparent 92%); }

.cl {
  position: absolute; max-width: none; height: auto; pointer-events: none; user-select: none;
  opacity: 0; will-change: transform, opacity;
  transform: translate3d(calc(var(--dx) * -1), 0, 0) rotate(var(--r)) scale(var(--fx), var(--sy));
  animation-name: wind; animation-timing-function: linear; animation-iteration-count: infinite;
}
/* Облако проявляется, плывёт по ветру и тает; рестарт цикла приходится на невидимую фазу */
@keyframes wind {
  0% { opacity: 0; transform: translate3d(calc(var(--dx) * -1), 0, 0) rotate(var(--r)) scale(var(--fx), var(--sy)); }
  14% { opacity: var(--o); }
  86% { opacity: var(--o); }
  100% { opacity: 0; transform: translate3d(var(--dx), 0, 0) rotate(var(--r)) scale(calc(var(--fx) * 1.04), calc(var(--sy) * 1.04)); }
}

@media (max-width: 734px) { .sky, .seam { --k: 1.9; } }
@media (prefers-reduced-motion: reduce) {
  .cl { animation: none; opacity: var(--o); transform: rotate(var(--r)) scale(var(--fx), var(--sy)); }
}
</style>

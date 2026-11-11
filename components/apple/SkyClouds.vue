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
  { s: 'cum-big', x: 76, y: -6, w: 26, sy: 0.9, f: 1, r: -2, o: 0.95, d: 260, dx: 9, ph: 0.35 },
  { s: 'cum-big', x: -10, y: 18, w: 24, sy: 0.78, f: -1, r: 1.5, o: 0.92, d: 280, dx: 9, ph: 0.7 },
  { s: 'puff-1', x: 22, y: 12, w: 5.5, sy: 0.9, f: 1, o: 0.85, b: 0.4, d: 190, dx: 8, ph: 0.2 },
  { s: 'puff-2', x: 66, y: 34, w: 5, sy: 0.8, f: -1, o: 0.8, b: 0.6, d: 210, dx: 8, ph: 0.85 },
  { s: 'puff-1', x: 84, y: 52, w: 4, sy: 0.75, f: -1, o: 0.7, b: 0.8, d: 230, dx: 7, ph: 0.5 },
  { s: 'puff-2', x: 8, y: 4, w: 4.5, sy: 0.85, f: 1, o: 0.75, b: 0.6, d: 200, dx: 7, ph: 0.1 },
  { s: 'band', x: -6, yb: 14, w: 46, sy: 0.5, f: 1, o: 0.6, b: 1.4, l: 0.97, d: 360, dx: 6, ph: 0.4 },
  { s: 'band', x: 56, yb: 20, w: 44, sy: 0.42, f: -1, o: 0.55, b: 1.8, l: 0.96, d: 400, dx: 6, ph: 0.05 }
]
// Гряда на стыке: только кучевые облака с естественными краями, цепочкой по всей ширине.
// Низ облаков заходит в кадр примерно на 10 % его высоты; гряда не тает, а мягко покачивается.
const SEAM = [
  { s: 'cum-big', x: -9, yb: 0, w: 22, sy: 0.55, f: 1, o: 1, d: 70, dx: 2.2, ph: 0.1 },
  { s: 'puff-1', x: 9, yb: 6, w: 9, sy: 0.7, f: -1, o: 1, d: 55, dx: 1.8, ph: 0.6 },
  { s: 'cum-big', x: 14, yb: -4, w: 19, sy: 0.48, f: -1, o: 1, d: 80, dx: 2.4, ph: 0.35 },
  { s: 'puff-2', x: 30, yb: 4, w: 8, sy: 0.65, f: 1, o: 1, d: 60, dx: 1.6, ph: 0.8 },
  { s: 'cum-big', x: 35, yb: -2, w: 17, sy: 0.42, f: 1, o: 1, d: 75, dx: 2, ph: 0.55 },
  { s: 'puff-1', x: 49, yb: 3, w: 8.5, sy: 0.6, f: 1, o: 1, d: 65, dx: 1.8, ph: 0.25 },
  { s: 'cum-big', x: 54, yb: -3, w: 18, sy: 0.46, f: -1, o: 1, d: 85, dx: 2.2, ph: 0.9 },
  { s: 'puff-2', x: 70, yb: 5, w: 8, sy: 0.7, f: -1, o: 1, d: 58, dx: 1.6, ph: 0.4 },
  { s: 'cum-big', x: 74, yb: -2, w: 20, sy: 0.5, f: 1, o: 1, d: 78, dx: 2.4, ph: 0.15 },
  { s: 'puff-1', x: 91, yb: 2, w: 10, sy: 0.65, f: 1, o: 1, d: 62, dx: 1.8, ph: 0.7 }
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
.seam { position: absolute; pointer-events: none; }
.seam .cl { opacity: var(--o); animation-name: sway; animation-timing-function: ease-in-out; animation-direction: alternate; filter: drop-shadow(0 10px 18px rgba(20, 45, 90, 0.18)); }
@keyframes sway { from { transform: translate3d(calc(var(--dx) * -1), 0, 0) rotate(var(--r)) scale(var(--fx), var(--sy)); } to { transform: translate3d(var(--dx), -2%, 0) rotate(var(--r)) scale(calc(var(--fx) * 1.03), calc(var(--sy) * 1.03)); } }

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

@media (max-width: 734px) { .sky { --k: 1.9; } .seam { --k: 1.5; } }
@media (prefers-reduced-motion: reduce) {
  .cl { animation: none; opacity: var(--o); transform: rotate(var(--r)) scale(var(--fx), var(--sy)); }
}
</style>

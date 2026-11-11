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
// Каждое облако на экране встречается ровно один раз — никаких повторов формы.
const SKY = [
  { s: 'veil', x: -8, y: 2, w: 62, sy: 0.9, f: 1, o: 0.7, d: 150, dx: 4, ph: 0.2 },
  { s: 'cum-big', x: 70, y: -4, w: 30, sy: 0.92, f: 1, r: -1.5, o: 0.96, d: 130, dx: 3.5, ph: 0.6 },
  { s: 'puff-1', x: 14, y: 46, w: 6, sy: 0.9, f: -1, o: 0.88, b: 0.3, d: 110, dx: 3, ph: 0.35 }
]
// Гряда на стыке: широкая слоистая полоса во всю ширину + два небольших облака на концах.
// Низ гряды заходит в кадр примерно на 10 % его высоты.
const SEAM = [
  { s: 'band', x: -12, yb: -6, w: 124, sy: 0.55, f: 1, o: 0.98, d: 140, dx: 3, ph: 0.3 },
  { s: 'puff-2', x: -2, yb: 18, w: 10, sy: 0.8, f: 1, o: 0.95, d: 100, dx: 2, ph: 0.7 },
  { s: 'puff-3', x: 88, yb: 22, w: 9, sy: 0.85, f: -1, o: 0.95, d: 110, dx: 2, ph: 0.1 }
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
.seam .cl { transform-origin: 50% 100%; opacity: var(--o); animation-name: sway; animation-timing-function: ease-in-out; animation-direction: alternate; filter: drop-shadow(0 10px 18px rgba(20, 45, 90, 0.18)); }
@keyframes sway { from { transform: translate3d(calc(var(--dx) * -1), 0, 0) rotate(var(--r)) scale(var(--fx), var(--sy)); } to { transform: translate3d(var(--dx), -2%, 0) rotate(var(--r)) scale(calc(var(--fx) * 1.03), calc(var(--sy) * 1.03)); } }

.cl {
  position: absolute; max-width: none; height: auto; pointer-events: none; user-select: none;
  opacity: 0;
  transform: translate3d(calc(var(--dx) * -1), 0, 0) rotate(var(--r)) scale(var(--fx), var(--sy));
  animation-name: sway; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; opacity: var(--o);
}
/* Облако проявляется, плывёт по ветру и тает; рестарт цикла приходится на невидимую фазу */
@keyframes wind {
  0% { opacity: 0; transform: translate3d(calc(var(--dx) * -1), 0, 0) rotate(var(--r)) scale(var(--fx), var(--sy)); }
  14% { opacity: var(--o); }
  86% { opacity: var(--o); }
  100% { opacity: 0; transform: translate3d(var(--dx), 0, 0) rotate(var(--r)) scale(calc(var(--fx) * 1.04), calc(var(--sy) * 1.04)); }
}

@media (max-width: 734px) { .sky { --k: 1.8; } .seam { --k: 1.5; } }
@media (prefers-reduced-motion: reduce) {
  .cl { animation: none; opacity: var(--o); transform: rotate(var(--r)) scale(var(--fx), var(--sy)); }
}
</style>

<template>
  <!-- Первый экран в подаче Watergen: блок закреплён на время прокрутки,
       в центре — флотационная установка ESP на облачном небе. Прокрутка
       ведёт её по фазам из описания в каталоге, счётчик справа показывает
       фазу, на насыщении воздухом поднимаются пузырьки, в конце небо светлеет. -->
  <section ref="root" class="wh" aria-label="ЭкоСервисПроект">
    <div class="wh-sticky">
      <WgSky class="wh-sky" :style="{ opacity: 1 - fadeOut }" />
      <div class="wh-white" :style="{ opacity: fadeOut }" aria-hidden="true"></div>

      <div class="wh-machine" :style="machineStyle">
        <img src="/images/equipment/flotation.webp" alt="Флотационная установка производства ESP" fetchpriority="high" decoding="async" />
        <canvas ref="bubbles" class="wh-bubbles" aria-hidden="true"></canvas>
      </div>

      <div class="wh-copy">
        <span class="wh-badge"><FlagBy class="text-sm" /> {{ slide.badge }}</span>
        <h1 class="wh-title">{{ slide.title }}</h1>
        <p class="wh-desc">{{ slide.description }}</p>
        <div class="wh-actions">
          <NuxtLink :to="slide.link || '/contacts'" class="wg-pill wg-pill--solid">
            Заказать технический аудит
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </NuxtLink>
          <NuxtLink to="/technologies" class="wg-pill wg-pill--ghost">Изучить технологии</NuxtLink>
        </div>
      </div>

      <!-- Счётчик фаз, как «02 /04 CONDENSATION» у Watergen -->
      <div class="wh-phase" aria-live="polite">
        <span class="wh-phase-num"><b>{{ String(phase + 1).padStart(2, '0') }}</b> /{{ String(PHASES.length).padStart(2, '0') }}</span>
        <span class="wh-phase-name">{{ PHASES[phase] }}</span>
        <span class="wh-phase-bar"><i :style="{ transform: `scaleX(${phaseFill})` }"></i></span>
      </div>

      <ul class="wh-facts">
        <li v-for="f in facts" :key="f">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3c3.5 4.2 6 7.5 6 10.5a6 6 0 01-12 0C6 10.5 8.5 7.2 12 3z" /></svg>
          {{ f }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import heroSlides from '~~/content/defaults/hero-slides.json'

const slide = heroSlides.find((s) => s.type === 'hero') || heroSlides[0]
// Фазы — из описания флотационной установки в каталоге ESP
const PHASES = ['Зона флокуляции', 'Насыщение воздухом', 'Флотационная камера', 'Очищенная вода']
// Короткие факты — из подзаголовка первого экрана
const facts = ['Произведено в Беларуси', '28 лет опыта', '30 000 элементов экосистемы']

const root = ref(null)
const bubbles = ref(null)
const progress = ref(0)
const phase = computed(() => Math.min(PHASES.length - 1, Math.floor(progress.value * PHASES.length * 0.999)))
const phaseFill = computed(() => {
  const k = progress.value * PHASES.length - phase.value
  return Math.max(0, Math.min(1, k))
})
const clamp = (x) => Math.max(0, Math.min(1, x))
const fadeOut = computed(() => clamp((progress.value - 0.78) / 0.2))

// Установка слегка приближается, на второй-третьей фазе подсвечивается контуром
const machineStyle = computed(() => {
  const p = progress.value
  const glow = clamp((p - 0.22) / 0.12) * (1 - clamp((p - 0.72) / 0.12))
  const s = 1 + 0.06 * p
  return {
    transform: `translate(-50%, -50%) scale(${s.toFixed(4)})`,
    filter: `drop-shadow(0 0 ${(glow * 14).toFixed(1)}px rgba(255,255,255,${(glow * 0.95).toFixed(2)})) drop-shadow(0 24px 40px rgba(0,35,102,0.16))`
  }
})

let raf = 0
let scrollRaf = 0
let reduced = false
const read = () => {
  scrollRaf = 0
  const el = root.value
  if (!el) return
  const range = el.offsetHeight - window.innerHeight
  progress.value = range > 0 ? clamp(-el.getBoundingClientRect().top / range) : 0
}
const onScroll = () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(read) }

// Пузырьки на фазе насыщения воздухом: мелкие белые точки поднимаются в камере
const drops = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6, v: 0.15 + Math.random() * 0.35 }))
const tick = (time) => {
  raf = requestAnimationFrame(tick)
  const c = bubbles.value
  if (!c) return
  const w = c.clientWidth; const h = c.clientHeight
  if (c.width !== w * 2) { c.width = w * 2; c.height = h * 2 }
  const ctx = c.getContext('2d')
  ctx.setTransform(2, 0, 0, 2, 0, 0)
  ctx.clearRect(0, 0, w, h)
  const p = progress.value
  const on = clamp((p - 0.25) / 0.08) * (1 - clamp((p - 0.5) / 0.08))
  if (on < 0.01 || reduced) return
  ctx.fillStyle = `rgba(255,255,255,${(0.85 * on).toFixed(2)})`
  for (const d of drops) {
    d.y -= d.v * 0.004
    if (d.y < 0) { d.y = 1; d.x = Math.random() }
    ctx.beginPath()
    ctx.arc((0.12 + d.x * 0.62) * w, (0.2 + d.y * 0.55) * h, d.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  read()
  window.addEventListener('scroll', onScroll, { passive: true })
  raf = requestAnimationFrame(tick)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
})
</script>

<style scoped>
.wh { position: relative; height: 320vh; margin-top: -5rem; }
.wh-sticky { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
.wh-sky, .wh-white { position: absolute; inset: 0; }
.wh-white { background: var(--wg-sky-2); }

.wh-machine {
  position: absolute;
  left: 50%;
  top: 44%;
  width: min(46vw, 640px);
  will-change: transform, filter;
}
.wh-machine img { display: block; width: 100%; height: auto; }
.wh-bubbles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

.wh-copy {
  position: absolute;
  left: max(1.5rem, calc((100% - 90rem) / 2 + 1.5rem));
  bottom: clamp(5.5rem, 13vh, 8rem);
  max-width: 30rem;
}
.wh-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 600;
  color: var(--wg-ink);
}
.wh-title {
  margin-top: 0.9rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.9rem, 2.7vw, 2.5rem);
  line-height: 1.08;
  letter-spacing: -0.015em;
  color: var(--wg-ink);
}
.wh-desc { margin-top: 0.8rem; font-size: 0.95rem; line-height: 1.55; color: var(--wg-text); max-width: 26rem; }
.wh-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.4rem; }

.wh-phase {
  position: absolute;
  right: max(1.5rem, calc((100% - 90rem) / 2 + 1.5rem));
  bottom: clamp(9rem, 22vh, 12rem);
  display: grid;
  justify-items: end;
  gap: 0.3rem;
  color: var(--wg-ink);
}
.wh-phase-num { font-size: 13px; color: var(--wg-muted); font-variant-numeric: tabular-nums; }
.wh-phase-num b { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; color: var(--wg-ink); letter-spacing: -0.02em; }
.wh-phase-name { font-size: 11.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--wg-label); }
.wh-phase-bar { width: 7.5rem; height: 2px; background: rgba(0, 35, 102, 0.15); overflow: hidden; }
.wh-phase-bar i { display: block; height: 100%; background: var(--wg-label); transform-origin: left; }

.wh-facts {
  position: absolute;
  left: max(1.5rem, calc((100% - 90rem) / 2 + 1.5rem));
  right: max(1.5rem, calc((100% - 90rem) / 2 + 1.5rem));
  bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.75rem;
  list-style: none;
  padding: 0;
  font-size: 12.5px;
  color: var(--wg-text);
}
.wh-facts li { display: inline-flex; align-items: center; gap: 0.45rem; }
.wh-facts svg { width: 14px; height: 14px; color: var(--wg-label); }

@media (max-width: 767px) {
  .wh-machine { width: 92vw; top: 34%; }
  .wh-copy { bottom: 5rem; right: 1.25rem; left: 1.25rem; }
  .wh-phase { top: 5.5rem; bottom: auto; }
  .wh-facts { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .wh { height: 100vh; }
}
</style>

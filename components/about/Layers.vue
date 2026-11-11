<template>
  <!-- «Природа очищает воду слой за слоем»: схематичный разрез грунта вместо фото.
       Слои раздвигаются при появлении, капли проходят их сверху вниз. -->
  <section class="al">
    <div class="dj-wrap al-in">
      <div class="al-text">
        <h2 class="al-h dj-reveal">{{ title }}</h2>
        <p class="dj-lede al-lede dj-reveal">{{ lede }}</p>
      </div>
      <div class="al-cut dj-reveal" aria-hidden="true">
        <div class="al-drops"><i v-for="n in 5" :key="n" :style="{ '--d': `${n * 0.7}s`, '--x': `${12 + n * 15}%` }"></i></div>
        <div v-for="(l, i) in layers" :key="l.name" class="al-layer" :class="`al-layer--${l.kind}`" :style="{ '--i': i }">
          <svg v-if="l.kind === 'roots'" class="al-roots" viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M60 0c0 22-14 30-10 52M60 18c10 10 26 12 30 30M180 0c4 26-8 38 0 70M180 26c-14 8-30 10-34 26M300 0c-6 20 6 32 2 56M300 22c12 6 30 8 38 22" /></svg>
          <span class="al-name">{{ l.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  lede: { type: String, default: '' },
  layers: {
    type: Array,
    default: () => [
      { name: 'Песок', kind: 'sand' },
      { name: 'Глина', kind: 'clay' },
      { name: 'Корни', kind: 'roots' }
    ]
  }
})
</script>

<style scoped>
.al { padding: clamp(96px, 12vw, 176px) 0; background: linear-gradient(180deg, #fff 0%, #eef4fb 100%); overflow: hidden; }
.al-in { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(40px, 6vw, 96px); align-items: center; }
.al-h { max-width: 14ch; font-size: clamp(36px, 5vw, 72px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); }
.al-lede { margin-top: 20px; max-width: 40ch; font-size: clamp(17px, 1.5vw, 21px); }

.al-cut { position: relative; display: grid; gap: 10px; padding-top: 72px; }
.al-drops { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
.al-drops i { position: absolute; top: 0; left: var(--x); width: 8px; height: 12px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: #002366; opacity: 0; animation: al-fall 4.2s cubic-bezier(0.45, 0, 0.55, 1) var(--d) infinite; }
@keyframes al-fall {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.9; }
  80% { opacity: 0.8; background: #002366; }
  100% { transform: translateY(calc(var(--h, 360px))); opacity: 0; background: #8fd3ff; }
}
.al-cut { --h: 380px; }

.al-layer { position: relative; display: flex; align-items: center; height: 96px; padding: 0 28px; border-radius: var(--r-md); overflow: hidden; opacity: 0; transform: translateY(calc(-24px * var(--i) - 12px)); transition: opacity 0.8s var(--dj-ease), transform 1s var(--dj-ease); transition-delay: calc(var(--i) * 0.12s); }
.al-cut.is-in .al-layer { opacity: 1; transform: none; }
.al-name { position: relative; z-index: 1; font-size: clamp(19px, 1.6vw, 24px); font-weight: 600; letter-spacing: -0.01em; }
/* Песок: светлый фон с мелкой зернистостью */
.al-layer--sand { color: #5b4a2c; background-color: #efe6d2; background-image: radial-gradient(rgba(140, 112, 64, 0.35) 1.2px, transparent 1.4px), radial-gradient(rgba(140, 112, 64, 0.22) 1px, transparent 1.2px); background-size: 14px 14px, 9px 9px; background-position: 0 0, 5px 6px; }
/* Глина: плотные волнистые пласты */
.al-layer--clay { color: #fff; background-color: #b9906c; background-image: repeating-linear-gradient(172deg, rgba(255, 255, 255, 0.12) 0 2px, transparent 2px 16px); }
/* Корни: тёмная почва и линии корней */
.al-layer--roots { color: #fff; background: #5e4d3d; }
.al-roots { position: absolute; inset: 0; width: 100%; height: 100%; }
.al-roots path { fill: none; stroke: rgba(236, 221, 196, 0.5); stroke-width: 2; stroke-linecap: round; }

@media (max-width: 767px) {
  .al-in { grid-template-columns: 1fr; }
  .al-h { overflow-wrap: break-word; }
  .al-layer { height: 76px; padding: 0 20px; border-radius: var(--r-md); }
  .al-cut { padding-top: 48px; --h: 300px; }
}
@media (prefers-reduced-motion: reduce) {
  .al-drops { display: none; }
  .al-layer { opacity: 1; transform: none; transition: none; }
}
</style>

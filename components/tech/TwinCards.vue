<template>
  <!-- Карточки цифрового двойника в стиле Apple: этапная линия сверху,
       кадр-«изделие» на мягком градиенте, подсветка-прожектор за курсором. -->
  <div class="tw" :class="[`tw--${tone}`, { 'tw--rail': rail }]" :style="{ '--n': items.length }">
    <div class="tw-grid">
      <component
        :is="it.to ? NuxtLinkCmp : 'article'"
        v-for="(it, i) in items"
        :key="i"
        v-bind="it.to ? { to: it.to } : {}"
        class="tw-card dj-reveal"
        @pointermove="spot"
      >
        <span v-if="rail" class="tw-step" aria-hidden="true"><i />{{ it.step || `Этап ${String(i + 1).padStart(2, '0')}` }}</span>
        <span class="tw-media">
          <img :src="it.image" :alt="it.alt || it.title" :class="{ 'is-blend': it.blend, 'is-screen': it.screen }" loading="lazy" decoding="async" />
          <span v-if="it.drone" class="tw-drone" aria-hidden="true">
            <img src="/images/digital-twin/drone.webp" alt="" loading="lazy" decoding="async" />
            <span class="tw-beam" />
          </span>
          <span v-if="it.badge" class="tw-badge">{{ it.badge }}</span>
        </span>
        <span class="tw-body">
          <span v-if="it.kicker" class="tw-kicker">{{ it.kicker }}</span>
          <h3 class="tw-title">{{ it.title }}</h3>
          <p class="tw-text">{{ it.text }}</p>
          <span v-if="it.tags?.length" class="tw-tags">
            <span v-for="t in it.tags" :key="t">{{ t }}</span>
          </span>
          <span v-if="it.to && it.cta" class="tw-cta">{{ it.cta }} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></span>
        </span>
      </component>
    </div>
  </div>
</template>

<script setup>
import { resolveComponent } from 'vue'

defineProps({
  items: { type: Array, required: true },
  tone: { type: String, default: 'light' },
  rail: { type: Boolean, default: false }
})
const NuxtLinkCmp = resolveComponent('NuxtLink')

// Прожектор: координаты курсора в CSS-переменные карточки
const spot = (e) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
</script>

<style scoped>
.tw { font-family: var(--dj-font); }
.tw-grid { --pad: max(6.25vw, calc((100% - 1260px) / 2)); position: relative; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 20px; padding: 0 var(--pad); }
.tw--rail .tw-grid { padding-top: 44px; }
.tw--rail .tw-grid::before { content: ''; position: absolute; top: 9px; left: var(--pad); right: var(--pad); height: 2px; border-radius: 2px; background: linear-gradient(90deg, #0a3a8c, #2f7ff0 60%, rgba(47, 127, 240, 0.15)); }

.tw-card { position: relative; display: flex; flex-direction: column; min-width: 0; border-radius: 28px; overflow: visible; color: inherit; text-decoration: none; isolation: isolate; transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease; }
.tw-card::after { content: ''; position: absolute; inset: 0; z-index: 2; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity 0.4s ease; background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(47, 127, 240, 0.16), transparent 60%); }
.tw-card:hover { transform: translateY(-4px); }
.tw-card:hover::after { opacity: 1; }

.tw-step { position: absolute; top: -44px; left: 0; display: inline-flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; color: #0a3a8c; }
.tw-step i { width: 20px; height: 20px; border-radius: 50%; background: #fff; box-shadow: inset 0 0 0 5px #0a3a8c; }

.tw-media { position: relative; display: grid; place-items: center; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 28px 28px 0 0; }
.tw-media > img { width: 88%; height: 88%; object-fit: contain; filter: drop-shadow(0 22px 28px rgba(0, 35, 102, 0.22)); transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1); }
.tw-card:hover .tw-media > img { transform: scale(1.04) translateY(-2%); }
.tw-media > img.is-blend { mix-blend-mode: multiply; filter: none; }
.tw-media > img.is-screen { width: 86%; height: auto; border-radius: 12px; filter: none; box-shadow: 0 24px 40px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08); }
.tw-badge { position: absolute; left: 16px; bottom: 14px; padding: 6px 12px; border-radius: 980px; font-size: 12px; font-weight: 600; letter-spacing: 0.02em; color: #0a3a8c; background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }

/* Дрон над рельефом: парит и «сканирует» лучом */
.tw-drone { position: absolute; top: 6%; left: 50%; width: 42%; transform: translateX(-50%); animation: tw-hover 4s ease-in-out infinite; pointer-events: none; }
.tw-drone img { display: block; width: 100%; height: auto; filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.25)); }
.tw-beam { position: absolute; top: 70%; left: 50%; width: 120%; height: 200%; transform: translateX(-50%); clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%); background: linear-gradient(180deg, rgba(47, 127, 240, 0.45), rgba(47, 127, 240, 0)); mix-blend-mode: screen; animation: tw-scan 2.6s ease-in-out infinite; }
@keyframes tw-hover { 50% { transform: translate(-50%, -6px); } }
@keyframes tw-scan { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.85; } }

.tw-body { position: relative; display: flex; flex-direction: column; flex: 1; gap: 8px; padding: 22px 26px 28px; border-radius: 0 0 28px 28px; }
.tw-kicker { font-size: 14px; font-weight: 600; color: #0a3a8c; }
.tw-title { margin: 0; font-size: clamp(21px, 1.8vw, 24px); line-height: 1.17; font-weight: 600; letter-spacing: 0.009em; }
.tw-text { margin: 0; font-size: 16px; line-height: 1.45; letter-spacing: -0.01em; }
.tw-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.tw-tags span { padding: 5px 11px; border-radius: 980px; font-size: 12px; letter-spacing: 0.01em; }
.tw-cta { display: inline-flex; align-items: center; gap: 2px; margin-top: auto; padding-top: 10px; font-size: 16px; color: #0a5bd6; }
.tw-cta svg { width: 16px; height: 16px; transition: transform 0.3s ease; }
.tw-card:hover .tw-cta svg { transform: translateX(3px); }

/* Светлая тема */
.tw--light .tw-media { background: radial-gradient(120% 90% at 50% 0%, #ffffff 0%, #e8f0fb 70%, #dbe7f7 100%); }
.tw--light .tw-body { background: #fff; }
.tw--light .tw-card { box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03), 0 24px 48px -32px rgba(0, 35, 102, 0.35); }
.tw--light .tw-title { color: #1d1d1f; }
.tw--light .tw-text { color: #6e6e73; }
.tw--light .tw-tags span { color: #0a3a8c; background: #eef3fb; }

/* Тёмная тема */
.tw--dark .tw-media { background: radial-gradient(120% 90% at 50% 0%, #1a2b4a 0%, #0b1220 65%, #05080f 100%); }
.tw--dark .tw-media > img { filter: drop-shadow(0 22px 30px rgba(47, 127, 240, 0.25)); }
.tw--dark .tw-body { background: #161617; }
.tw--dark .tw-card { box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06); }
.tw--dark .tw-card::after { background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(47, 127, 240, 0.22), transparent 60%); }
.tw--dark .tw-kicker { color: #6fa8ff; }
.tw--dark .tw-title { color: #f5f5f7; }
.tw--dark .tw-text { color: #a1a1a6; }
.tw--dark .tw-tags span { color: #d6e4ff; background: rgba(47, 127, 240, 0.16); }
.tw--dark .tw-cta { color: #6fa8ff; }
.tw--dark .tw-step { color: #6fa8ff; }

@media (max-width: 1068px) {
  .tw-grid { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: minmax(280px, 72%); overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 var(--pad); padding-bottom: 8px; scrollbar-width: none; }
  .tw-grid::-webkit-scrollbar { display: none; }
  .tw-card { scroll-snap-align: start; }
  .tw-card:hover { transform: none; }
  .tw--rail .tw-grid::before { right: auto; width: calc(var(--n) * (72% + 20px)); }
}
@media (max-width: 734px) {
  .tw-grid { grid-auto-columns: 84%; gap: 14px; }
  .tw-body { padding: 18px 20px 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .tw-drone, .tw-beam { animation: none; }
}
</style>

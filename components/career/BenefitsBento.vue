<template>
  <!-- #86 Что мы даём — бенто разного размера: синяя «главная» плитка,
       плитки на реальных кадрах, подсветка-прожектор за курсором -->
  <div class="bb">
    <article
      v-for="(b, i) in items"
      :key="b.title"
      class="bb-tile dj-reveal"
      :class="[`bb-tile--${b.kind}`]"
      :style="{ '--d': i * 80 + 'ms' }"
      @pointermove="spot"
    >
      <img v-if="b.img" :srcset="srcset(b.img)" sizes="(max-width: 734px) 100vw, 33vw" :src="b.img" alt="" loading="lazy" decoding="async" class="bb-img" />
      <span class="bb-num">{{ b.num }}</span>
      <div class="bb-body">
        <h3 class="bb-h3">{{ b.title }}</h3>
        <ul class="bb-list">
          <li v-for="(t, k) in b.items" :key="k">{{ t }}</li>
        </ul>
      </div>
    </article>
  </div>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
defineProps({ items: { type: Array, required: true } })

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}
</script>

<style scoped>
.bb { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 16px; max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }
.bb-tile {
  position: relative; display: flex; flex-direction: column; justify-content: space-between; gap: 28px;
  min-height: 360px; padding: clamp(26px, 2.6vw, 40px); border-radius: var(--r-lg); overflow: hidden; isolation: isolate;
  background: #EDEDED; color: var(--dj-ink);
}
.bb-tile::before {
  content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0; transition: opacity 0.4s ease;
  background: radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(29, 91, 214, 0.16), transparent 60%);
}
.bb-tile:hover::before { opacity: 1; }
.bb-tile > * { position: relative; z-index: 1; }
.bb-tile--hero { grid-column: span 4; color: #fff; background: radial-gradient(110% 120% at 0% 0%, #002366 0%, #002366 40%, #002366 100%); }
.bb-tile--hero::before { background: radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.18), transparent 60%); }
.bb-tile--soft { grid-column: span 2; }
.bb-tile--photo { grid-column: span 2; color: #fff; background: #0b1630; }
.bb-tile--wide { grid-column: span 4; }
.bb-tile--photo .bb-img { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.15); transition: transform 1.2s var(--dj-ease); }
.bb-tile--photo::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 20, 50, 0.25) 0%, rgba(0, 20, 50, 0.82) 100%); }
.bb-tile--photo:hover .bb-img { transform: scale(1.04); }
.bb-tile--wide .bb-img { position: absolute; right: 0; top: 0; bottom: 0; z-index: 0; width: 46%; height: 100%; object-fit: cover; filter: saturate(1.12); -webkit-mask-image: linear-gradient(90deg, transparent, #000 40%); mask-image: linear-gradient(90deg, transparent, #000 40%); }
.bb-tile--wide .bb-body { max-width: 52%; }
.bb-num { font-size: clamp(44px, 4.4vw, 64px); line-height: 1; font-weight: 700; letter-spacing: -0.03em; color: var(--dj-blue); font-variant-numeric: tabular-nums; }
.bb-tile--hero .bb-num, .bb-tile--photo .bb-num { color: rgba(255, 255, 255, 0.9); }
.bb-tile--hero .bb-num { font-size: clamp(64px, 7vw, 112px); }
.bb-h3 { font-size: clamp(22px, 2vw, 30px); line-height: 1.12; font-weight: 600; letter-spacing: -0.01em; }
.bb-tile--hero .bb-h3 { font-size: clamp(28px, 3vw, 44px); }
.bb-tile--hero .bb-h3, .bb-tile--photo .bb-h3 { color: #fff; }
.bb-list { display: grid; gap: 8px; margin: 14px 0 0; padding: 0; list-style: none; }
.bb-list li { position: relative; padding-left: 16px; font-size: 17px; line-height: 1.4; letter-spacing: -0.022em; color: #5E5E5E; }
.bb-list li::before { content: ''; position: absolute; left: 0; top: 0.62em; width: 5px; height: 5px; border-radius: 50%; background: var(--dj-blue); }
.bb-tile--hero .bb-list li, .bb-tile--photo .bb-list li { color: rgba(255, 255, 255, 0.88); }
.bb-tile--hero .bb-list li::before, .bb-tile--photo .bb-list li::before { background: #fff; }
@media (max-width: 1023px) {
  .bb-tile--hero, .bb-tile--wide { grid-column: span 6; }
  .bb-tile--soft, .bb-tile--photo { grid-column: span 3; }
}
@media (max-width: 767px) {
  .bb { padding: 0 16px; gap: 12px; }
  .bb-tile, .bb-tile--soft, .bb-tile--photo { grid-column: span 6; min-height: 0; border-radius: var(--r-md); }
  .bb-tile--photo { min-height: 340px; }
  .bb-tile--wide .bb-img { position: relative; width: calc(100% + 52px); height: 200px; margin: 0 -26px -26px; order: 3; -webkit-mask-image: none; mask-image: none; }
  .bb-tile--wide .bb-body { max-width: none; }
}
@media (prefers-reduced-motion: reduce) { .bb-img { transition: none; } }
</style>

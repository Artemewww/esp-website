<template>
  <!-- «Книжная полка»: 9 корешков услуг. Десктоп — наведение/фокус раскрывает
       корешок на большую часть ширины; мобильный — вертикальный аккордеон. -->
  <div
    class="sh"
    :class="{ 'sh--active': active !== null }"
    @mouseleave="onLeave"
  >
    <NuxtLink
      v-for="(s, i) in items"
      :key="s.id"
      :to="`/services/${s.slug}`"
      class="sh-book"
      :class="[`sh-tone-${i % TONES}`, { 'is-open': active === i }]"
      :aria-label="`${num(i)}. ${s.title}`"
      @mouseenter="onEnter(i)"
      @focus="active = i"
      @click.capture="onClick($event, i)"
    >
      <!-- Корешок -->
      <span class="sh-spine" aria-hidden="true">
        <span class="sh-band"></span>
        <span class="sh-num">{{ num(i) }}</span>
        <span class="sh-vtitle">{{ s.title }}</span>
        <svg class="sh-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[s.icon]"></svg>
        <span class="sh-band"></span>
      </span>

      <!-- Раскрытая книга: фото + текст -->
      <span class="sh-open"><span class="sh-inner">
        <span class="sh-photo" :class="{ 'sh-photo--split': imgs(s).length > 1 }">
          <img
            v-for="src in imgs(s)"
            :key="src"
            :src="src"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
        <span class="sh-panel">
          <span class="sh-pnum">{{ num(i) }}</span>
          <span class="sh-title">{{ s.title }}</span>
          <span class="sh-desc">{{ s.desc }}</span>
          <span class="sh-stages">
            <span v-for="st in s.stages" :key="st.title" class="sh-stage">{{ st.title }}</span>
          </span>
          <span class="sh-more">Подробнее ›</span>
        </span>
      </span></span>
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ items: { type: Array, required: true } })

const TONES = 9

// Фото услуг (реальные кадры ESP из public/)
const IMAGES = {
  'design-of-engineering-networks': ['/images/services/networks.webp'],
  'designing-of-treatment-facilities': ['/images/services/treatment-bim.webp'],
  design: ['/images/services/architecture-model.webp'],
  production: ['/images/real4k/laser-head.webp'],
  installation: ['/images/services/installation.webp'],
  start: ['/images/services/start-blue.webp', '/images/services/start-black.webp'],
  service: ['/images/services/service.webp'],
  repair: ['/images/services/aerotank-run.webp'],
  support: ['/images/services/equip-drum-run.webp']
}

// Линейные иконки 24×24, штрих 1.5
const ICONS = {
  design: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6 7.8l5 8.4M18 7.8l-5 8.4"/>',
  treatment: '<path d="M12 3c-3.5 4-6 7.2-6 10.5a6 6 0 0 0 12 0C18 10.2 15.5 7 12 3z"/><path d="M8.5 14.5c1.2.8 2.3.8 3.5 0s2.3-.8 3.5 0"/>',
  networks: '<path d="M4 20V9l8-5 8 5v11"/><path d="M2.5 20h19M9.5 20v-5h5v5M9 10.5h6"/>',
  production: '<path d="M3 20V10.5l5 3v-3l5 3V5h4v15"/><path d="M2 20h20M6.5 17h2M10.5 17h2"/>',
  installation: '<path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3.8 17.2a1.6 1.6 0 0 0 2.3 2.3l5.7-5.7a4 4 0 0 0 5.2-5.2l-2.5 2.5-2.3-.4-.4-2.3z"/>',
  start: '<path d="M12 3.5v8"/><path d="M7.4 6.6a7 7 0 1 0 9.2 0"/>',
  service: '<rect x="5" y="4.5" width="14" height="16" rx="2"/><path d="M9 4.5V3h6v1.5M9 12l2 2 4-4M9 17h6"/>',
  repair: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
  support: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19c0 1.4-1.4 2-3.5 2H13"/>'
}

const active = ref(null)
const num = (i) => String(i + 1).padStart(2, '0')
const imgs = (s) => IMAGES[s.slug] || []

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (min-width: 768px)').matches

function onEnter (i) { if (canHover()) active.value = i }
function onLeave () {
  if (!canHover()) return
  const el = document.activeElement
  if (!el || !el.classList?.contains('sh-book')) active.value = null
}
// Касание (мобильный аккордеон / планшет): первый тап раскрывает, второй ведёт на страницу
function onClick (e, i) {
  if (!canHover() && active.value !== i) {
    e.preventDefault()
    active.value = i
  }
}
</script>

<style scoped>
.sh {
  --sh-h: clamp(520px, 64vh, 600px);
  --sh-ease: var(--dj-ease, cubic-bezier(0.28, 0.11, 0.32, 1));
  display: flex;
  gap: 6px;
  height: var(--sh-h);
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 12px;
  font-family: var(--dj-font);
}

/* Книга */
.sh-book {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  border-radius: 8px 8px 4px 4px;
  color: var(--sh-ink);
  background: var(--sh-bg);
  box-shadow:
    inset 7px 0 12px -8px rgba(255, 255, 255, 0.55),
    inset -9px 0 14px -8px rgba(0, 0, 0, 0.16),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: flex-grow 0.6s var(--sh-ease), box-shadow 0.6s var(--sh-ease);
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.sh-book.is-open { flex-grow: 10; }
.sh-book:focus-visible { box-shadow: 0 0 0 3px #fff, 0 0 0 5px #0071e3; }

/* Тона корешков: синие, серые, белые ESP */
.sh-tone-0 { --sh-bg: linear-gradient(90deg, #eef1f6, #f8f9fb 45%, #e6eaf1); --sh-ink: #1d1d1f; --sh-sub: #6e6e73; }
.sh-tone-1 { --sh-bg: linear-gradient(90deg, #0a2a63, #12377a 45%, #082457); --sh-ink: #f5f5f7; --sh-sub: rgba(245, 245, 247, 0.62); }
.sh-tone-2 { --sh-bg: linear-gradient(90deg, #dde3ec, #e9edf3 45%, #d4dbe6); --sh-ink: #1d1d1f; --sh-sub: #6e6e73; }
.sh-tone-3 { --sh-bg: linear-gradient(90deg, #f4f4f6, #ffffff 45%, #ececf0); --sh-ink: #002366; --sh-sub: #6e6e73; }
.sh-tone-4 { --sh-bg: linear-gradient(90deg, #2e4a7c, #3a5689 45%, #284371); --sh-ink: #f5f5f7; --sh-sub: rgba(245, 245, 247, 0.62); }
.sh-tone-5 { --sh-bg: linear-gradient(90deg, #c9d3e2, #d6deea 45%, #c0cbdc); --sh-ink: #12274d; --sh-sub: #4a5568; }
.sh-tone-6 { --sh-bg: linear-gradient(90deg, #1d1d1f, #2a2b30 45%, #18181b); --sh-ink: #f5f5f7; --sh-sub: rgba(245, 245, 247, 0.6); }
.sh-tone-7 { --sh-bg: linear-gradient(90deg, #e9edf4, #f4f6fa 45%, #e1e6ef); --sh-ink: #002366; --sh-sub: #6e6e73; }
.sh-tone-8 { --sh-bg: linear-gradient(90deg, #002366, #0b3a8c 45%, #001d55); --sh-ink: #f5f5f7; --sh-sub: rgba(245, 245, 247, 0.62); }

/* Корешок */
.sh-spine {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 14px 0;
  transition: opacity 0.35s var(--sh-ease);
}
.sh-band { flex: none; width: 100%; height: 7px; border-top: 1px solid currentColor; border-bottom: 1px solid currentColor; opacity: 0.22; }
.sh-num { flex: none; font-size: 14px; line-height: 1; font-weight: 600; letter-spacing: 0.02em; font-variant-numeric: tabular-nums; color: var(--sh-sub); }
.sh-vtitle {
  flex: 1 1 auto;
  min-height: 0;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: clamp(17px, 1.45vw, 21px);
  line-height: 1.19;
  font-weight: 600;
  letter-spacing: 0.011em;
  text-align: start;
  overflow: hidden;
}
.sh-ico { flex: none; width: 28px; height: 28px; opacity: 0.85; }

/* Раскрытая книга */
.sh-open {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.45s var(--sh-ease), visibility 0s linear 0.45s;
  color: #fff;
  background: #1d1d1f;
}
.sh-book.is-open .sh-open { opacity: 1; visibility: visible; transition: opacity 0.5s var(--sh-ease) 0.12s, visibility 0s; }
.sh-book.is-open .sh-spine { opacity: 0; }

.sh-inner { position: absolute; inset: 0; display: block; }
.sh-photo { position: absolute; inset: 0; display: flex; }
.sh-photo img { flex: 1 1 0; min-width: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform 1.2s var(--sh-ease); }
.sh-photo--split img + img { border-left: 2px solid #1d1d1f; }
.sh-book.is-open .sh-photo img { transform: scale(1); }
.sh-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.35) 55%, rgba(0, 0, 0, 0.82) 100%); }

.sh-panel {
  position: absolute;
  left: 0;
  bottom: 0;
  width: min(540px, calc(55vw - 96px));
  padding: 0 clamp(28px, 3vw, 44px) clamp(28px, 3vw, 40px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transform: translateY(16px);
  opacity: 0;
  transition: transform 0.6s var(--sh-ease), opacity 0.4s var(--sh-ease);
}
.sh-book.is-open .sh-panel { transform: none; opacity: 1; transition-delay: 0.22s; }
.sh-pnum { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; color: rgba(255, 255, 255, 0.7); font-variant-numeric: tabular-nums; }
.sh-title { font-size: clamp(26px, 2.4vw, 32px); line-height: 1.125; font-weight: 600; letter-spacing: 0.004em; text-wrap: balance; }
.sh-desc { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: rgba(255, 255, 255, 0.86); }
.sh-stages { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.sh-stage { padding: 5px 11px; border-radius: 999px; font-size: 13px; line-height: 1.3; letter-spacing: -0.01em; color: #fff; background: rgba(255, 255, 255, 0.16); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.sh-more { margin-top: 6px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #2997ff; }
.sh-book:hover .sh-more { text-decoration: underline; }

/* Мобильный: вертикальный аккордеон */
@media (max-width: 767px) {
  .sh { flex-direction: column; height: auto; gap: 6px; padding: 0 16px; }
  .sh-book { flex: none; display: block; border-radius: 12px; transition: none; }
  .sh-book.is-open { flex-grow: 0; }
  .sh-spine { position: relative; inset: auto; flex-direction: row; gap: 14px; min-height: 68px; padding: 0 18px; }
  .sh-band { width: 5px; height: 100%; min-height: 68px; border: 0; border-left: 1px solid currentColor; border-right: 1px solid currentColor; }
  .sh-band:last-child { display: none; }
  .sh-vtitle { writing-mode: horizontal-tb; transform: none; font-size: 17px; line-height: 1.24; padding: 14px 0; }
  .sh-ico { width: 24px; height: 24px; }
  .sh-book.is-open .sh-spine { opacity: 1; }
  .sh-open {
    position: relative;
    inset: auto;
    display: grid;
    grid-template-rows: 0fr;
    visibility: visible;
    opacity: 1;
    transition: grid-template-rows 0.5s var(--sh-ease);
  }
  .sh-book.is-open .sh-open { grid-template-rows: 1fr; transition: grid-template-rows 0.5s var(--sh-ease); }
  .sh-inner { position: static; min-height: 0; overflow: hidden; }
  .sh-photo { position: relative; inset: auto; }
  .sh-photo img { display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; transform: none; }
  .sh-photo--split img { width: 50%; aspect-ratio: 3 / 4; }
  .sh-photo::after { display: none; }
  .sh-panel { position: static; width: auto; padding: 20px 20px 24px; transform: none; opacity: 1; }
  .sh-title { font-size: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .sh-book, .sh-spine, .sh-open, .sh-panel, .sh-photo img { transition: none !important; }
  .sh-photo img { transform: none; }
}
</style>

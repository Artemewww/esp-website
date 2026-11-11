<template>
  <!-- Фото-аккордеон услуг (приём «interactive image accordion», 21st.dev):
       узкие скруглённые панели, в каждой — приглушённый фрагмент своего фото,
       вертикальная подпись и иконка на стекле. Наведение/фокус раскрывает
       панель: фото в полный цвет, снизу — текст на стеклянной подложке.
       Мобильный — вертикальный аккордеон из тех же панелей. -->
  <div class="ia">
    <NuxtLink
      v-for="(s, i) in items"
      :key="s.id"
      :to="`/services/${s.slug}`"
      class="ia-panel"
      :class="{ 'is-open': active === i }"
      :aria-label="`${num(i)}. ${s.title}`"
      :aria-expanded="active === i"
      @mouseenter="onEnter(i)"
      @pointerdown="wasOpen = active === i"
      @focus="onFocus(i)"
      @click.capture="onClick($event, i)"
    >
      <span class="ia-photo" :class="{ 'ia-photo--split': imgs(s).length > 1 }">
        <img v-for="src in imgs(s)" :key="src" :src="src" alt="" loading="lazy" decoding="async" />
      </span>
      <span class="ia-shade" />

      <!-- Свёрнутое состояние -->
      <span class="ia-rail" aria-hidden="true">
        <span class="ia-num">{{ num(i) }}</span>
        <span class="ia-vtitle">{{ s.title }}</span>
        <span class="ia-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[s.icon]"></svg></span>
      </span>

      <!-- Раскрытое состояние -->
      <span class="ia-card">
        <span class="ia-cnum">{{ num(i) }} / {{ items.length }}</span>
        <span class="ia-title">{{ s.title }}</span>
        <span class="ia-desc">{{ s.desc }}</span>
        <span class="ia-stages"><span v-for="st in s.stages" :key="st.title">{{ st.title }}</span></span>
        <span class="ia-more">Подробнее <i>›</i></span>
      </span>
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ items: { type: Array, required: true } })

const TONES = 9

// Фото услуг (реальные кадры ESP из public/)
const IMAGES = {
  'design-of-engineering-networks': ['/images/services/networks-desk.webp'],
  'designing-of-treatment-facilities': ['/images/services/treatment-screen.webp'],
  design: ['/images/services/design-team-top.webp'],
  production: ['/images/equipment/gen/rotary-drum-sieve-hall.webp'],
  installation: ['/images/services/installation.webp'],
  start: ['/images/services/start-blue.webp'],
  service: ['/images/services/start-black.webp'],
  repair: ['/images/real4k/aerial-aerotank.webp'],
  support: ['/images/real4k/aerial-octagons.webp']
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

// Первая панель открыта сразу — как в фото-аккордеонах 21st.dev
const active = ref(0)
const num = (i) => String(i + 1)
const imgs = (s) => IMAGES[s.slug] || []

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (min-width: 768px)').matches

function onEnter (i) { if (canHover()) active.value = i }
// #19. Касание (мобильный аккордеон / планшет): первый тап раскрывает, второй ведёт на страницу.
// Состояние «было ли открыто» фиксируем на pointerdown: тап сначала фокусирует ссылку,
// и раньше @focus успевал раскрыть панель — клик тут же уводил на страницу.
let wasOpen = null
function onFocus (i) { if (wasOpen === null) active.value = i }
function onClick (e, i) {
  const open = wasOpen === null ? active.value === i : wasOpen
  wasOpen = null
  if (!canHover() && !open) {
    e.preventDefault()
    active.value = i
  }
}
</script>
<style scoped>
.ia { display: flex; gap: 0; height: calc(100svh - var(--dj-header-h, 44px)); min-height: 560px; font-family: var(--dj-font); background: #000; }
.ia-panel { position: relative; flex: 1 1 0; min-width: 0; overflow: hidden; border-radius: 0; background: #002366; border-left: 1px solid rgba(255, 255, 255, 0.12); color: #fff; isolation: isolate; transition: flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease; outline: none; }
.ia-panel.is-open { flex-grow: 9; }
.ia-panel:focus-visible { box-shadow: 0 0 0 3px #002366; }

.ia-photo { position: absolute; inset: 0; display: flex; z-index: -2; }
.ia-photo img { flex: 1; min-width: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.85) brightness(0.55) contrast(1.05); transform: scale(1.12); transition: filter 0.8s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.ia-photo--split img + img { border-left: 2px solid rgba(255, 255, 255, 0.6); }
.ia-panel:hover .ia-photo img { filter: grayscale(0.4) brightness(0.7); }
.ia-panel.is-open .ia-photo img { filter: none; transform: scale(1); }
.ia-panel::before { content: ''; position: absolute; inset: 0; z-index: -1; background: #002366; opacity: 1; transition: opacity 0.6s ease, background-color 0.4s ease; pointer-events: none; }
.ia-panel:hover::before { background: #002366; }
.ia-panel.is-open::before { opacity: 0; }
.ia-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 20, 50, 0.12) 0%, rgba(0, 20, 50, 0) 30%, rgba(0, 20, 50, 0) 70%, rgba(0, 12, 30, 0.45) 100%); transition: opacity 0.6s ease; }

/* Свёрнутая панель: иконка сверху, вертикальное название, номер снизу */
.ia-rail { position: absolute; inset: clamp(18px, 1.8vw, 32px) 0; display: flex; flex-direction: column; align-items: center; gap: clamp(14px, 1.4vw, 24px); transition: opacity 0.35s ease; }
.ia-chip { flex: none; display: grid; place-items: center; width: clamp(28px, 2vw, 40px); height: clamp(28px, 2vw, 40px); color: rgba(255, 255, 255, 0.88); }
.ia-chip svg { width: 100%; height: 100%; }
.ia-vtitle { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: flex-start; writing-mode: vertical-rl; transform: rotate(180deg); font-size: clamp(15px, 1.15vw, 24px); line-height: 1.2; font-weight: 600; letter-spacing: -0.005em; text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35); overflow: hidden; }
.ia-num { flex: none; font-size: clamp(30px, 2.8vw, 60px); line-height: 1; font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; color: rgba(255, 255, 255, 0.92); }
.ia-panel.is-open .ia-rail { opacity: 0; pointer-events: none; }

/* Раскрытая панель: стеклянная карточка снизу */
.ia-card { position: absolute; left: clamp(16px, 2.4vw, 32px); bottom: clamp(16px, 2.4vw, 32px); display: grid; gap: clamp(6px, 0.5vw, 10px); width: min(clamp(340px, 26vw, 540px), calc(100% - 32px)); padding: clamp(16px, 1.3vw, 26px) clamp(20px, 1.6vw, 30px); border-radius: clamp(16px, 1.2vw, 24px); background: rgba(10, 20, 40, 0.42); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18); backdrop-filter: blur(18px) saturate(140%); -webkit-backdrop-filter: blur(18px) saturate(140%); opacity: 0; transform: translateY(18px); transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); pointer-events: none; }
.ia-panel.is-open .ia-card { opacity: 1; transform: none; transition-delay: 0.25s; pointer-events: auto; }
.ia-cnum { font-size: clamp(13px, 0.85vw, 16px); font-weight: 600; letter-spacing: 0.06em; color: rgba(255, 255, 255, 0.7); }
.ia-title { font-size: clamp(20px, 1.7vw, 34px); line-height: 1.12; font-weight: 600; letter-spacing: -0.005em; }
.ia-desc { font-size: clamp(14px, 0.95vw, 18px); line-height: 1.4; color: rgba(255, 255, 255, 0.86); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ia-stages { display: none; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.ia-stages span { padding: 5px 11px; border-radius: var(--r-pill); font-size: 12px; background: rgba(255, 255, 255, 0.14); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2); }
.ia-more { margin-top: 2px; font-size: clamp(14px, 0.95vw, 18px); font-weight: 500; color: #8fc2ff; }
.ia-more i { font-style: normal; display: inline-block; transition: transform 0.3s ease; }
.ia-panel:hover .ia-more i { transform: translateX(4px); }


@media (min-width: 768px) and (max-width: 1068px) { .ia-vtitle { font-size: 14px; line-height: 1.15; } }
@media (max-width: 767px) {
  .ia { flex-direction: column; height: auto; min-height: 0; gap: 0; }
  .ia-panel { border-left: 0; border-top: 1px solid rgba(255, 255, 255, 0.12); }
  .ia-panel { flex: none; height: 72px; border-radius: 0; transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
  .ia-panel.is-open { height: 460px; }
  .ia-rail { inset: 0 16px; flex-direction: row; gap: 16px; }
  .ia-vtitle { writing-mode: horizontal-tb; transform: none; font-size: 16px; line-height: 1.2; }
  .ia-num { width: 28px; font-size: 30px; text-align: left; }
  .ia-chip { width: 26px; height: 26px; }
  .ia-card { left: 12px; right: 12px; bottom: 12px; padding: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .ia-panel, .ia-photo img, .ia-card, .ia-rail { transition: none; }
}
</style>

<template>
  <!-- Первый экран страницы оборудования в подаче Apple: подпись,
       огромное название, подзаголовок, синяя капсула и ссылка «Подробнее ›»
       по центру сверху, под ними — слайдер с точками и паузой Apple. Слайд «студия» — светлый бесшовный фон DJI с мягкими
       полосами света и настоящим рендером позиции; слайды-фото — кадры
       оборудования в работе. Внизу точки и пауза. -->
  <section ref="root" class="ehb" :style="{ '--ehb-top': top ? top + 'px' : null }" :class="{ 'ehb--dark': slide.dark, 'ehb--left': slide.type === 'photo' }" aria-roledescription="carousel" :aria-label="product.name">
    <div class="ehb-stage" @pointerdown="down" @pointerup="up">
      <div
        v-for="(s, i) in slides"
        :key="s.key"
        class="ehb-slide"
        :class="[`ehb-slide--${s.type}`, { 'is-on': i === cur }]"
        :aria-hidden="i !== cur"
      >
        <template v-if="s.type === 'studio'">
          <span class="ehb-beam ehb-beam--a" /><span class="ehb-beam ehb-beam--b" />
          <img class="ehb-cut" :class="{ 'is-blend': s.blend }" :src="s.src" :alt="s.alt" :fetchpriority="i === 0 ? 'high' : 'low'" />
        </template>
        <EquipBrand v-else-if="s.type === 'brand'" :item="product" />
        <img v-else class="ehb-photo" :src="s.src" :alt="s.alt" loading="lazy" decoding="async" />
      </div>
    </div>

    <div ref="copy" class="ehb-copy">
      <span v-if="product.category" class="ehb-eyebrow">{{ product.category }}</span>
      <h1 class="ehb-title">{{ product.name }}</h1>
      <p v-if="tagline" class="ehb-tag">{{ tagline }}</p>
      <div class="ehb-act">
        <NuxtLink to="/contacts#contact-form" class="ehb-btn">Обсудить проект</NuxtLink>
        <a href="#overview" class="ehb-more" @click.prevent="$emit('more')">Подробнее</a>
      </div>
    </div>

    <div v-if="slides.length > 1" class="ehb-nav">
      <div class="ehb-dots">
        <button v-for="(s, i) in slides" :key="s.key" :class="{ 'is-on': i === cur }" :aria-label="`Слайд ${i + 1}`" @click="go(i)">
          <i v-if="i === cur" :style="{ animationDuration: DUR + 'ms', animationPlayState: paused ? 'paused' : 'running' }" />
        </button>
      </div>
      <button class="ehb-pause" :aria-label="paused ? 'Продолжить' : 'Пауза'" @click="paused = !paused">
        <svg v-if="paused" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5.5v13l11-6.5z" /></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5.5v13M16 5.5v13" /></svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  product: { type: Object, required: true },
  slides: { type: Array, required: true },
  tagline: { type: String, default: '' }
})
defineEmits(['more'])

const DUR = 6500
// Низ блока с текстом и кнопками: изображение рисуется строго ниже него
const root = ref(null)
const copy = ref(null)
const top = ref(0)
let ro = null
const measure = () => { const c = copy.value; if (c) top.value = Math.ceil(c.offsetTop + c.offsetHeight) }
const cur = ref(0)
const paused = ref(false)
const slide = computed(() => props.slides[cur.value] || {})
let timer = null
const go = (i) => { cur.value = (i + props.slides.length) % props.slides.length; restart() }
const restart = () => { clearTimeout(timer); if (!paused.value && props.slides.length > 1) timer = setTimeout(() => go(cur.value + 1), DUR) }
watch(paused, restart)
let px = 0
const down = (e) => { px = e.clientX }
const up = (e) => { const d = e.clientX - px; if (Math.abs(d) > 40) go(cur.value + (d < 0 ? 1 : -1)) }
onMounted(() => {
  restart(); measure()
  if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(measure); ro.observe(copy.value); ro.observe(root.value) }
  document.fonts?.ready?.then(measure)
})
onBeforeUnmount(() => { clearTimeout(timer); ro?.disconnect() })
</script>

<style scoped>
.ehb { --ehb-top: 380px; --ehb-gap: clamp(20px, 3vh, 32px); --ehb-bot: 84px; position: relative; height: max(min(100svh - var(--dj-header-h), 900px), calc(var(--ehb-top) + var(--ehb-gap) + 220px + var(--ehb-bot))); min-height: 600px; overflow: hidden; background: #FAFAFA; color: #1A1A1A; font-family: var(--dj-font); }
.ehb-stage { position: absolute; inset: 0; touch-action: pan-y; }
.ehb-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1s cubic-bezier(0.4, 0, 0.6, 1); }
.ehb-slide.is-on { opacity: 1; }

/* Схема EquipBrand: отдельная зона под кнопками, табличка — над точками */
.ehb-slide--brand { --ehb-bot: 160px; }
.ehb-slide--brand :deep(.ebr .ebr-fig) { top: calc(var(--ehb-top) + var(--ehb-gap)); bottom: auto; height: calc(100% - var(--ehb-top) - var(--ehb-gap) - var(--ehb-bot)); max-height: 440px; max-width: calc(100% - 32px); transform: translateX(-50%); }
.ehb-slide--brand :deep(.ebr .ebr-plate) { left: 50%; right: auto; bottom: 84px; transform: translateX(-50%); width: max-content; max-width: min(420px, calc(100% - 32px)); }
.ehb-slide--brand :deep(.ebr .ebr-glow) { top: calc(var(--ehb-top) + (100% - var(--ehb-top) - 160px) / 2); }
@media (min-width: 1200px) {
  .ehb-slide--brand { --ehb-bot: 84px; }
  .ehb-slide--brand :deep(.ebr .ebr-plate) { left: auto; right: clamp(24px, 3vw, 40px); bottom: 24px; transform: none; max-width: 360px; }
}

/* Светлая студия Apple: бесшовный фон, мягкий свет, тень на полу */
.ehb-slide--brand { background: #eef2f8; }
.ehb-slide--studio { background: radial-gradient(120% 80% at 50% 74%, #ffffff 0%, #EDEDED 56%, #EDEDED 100%); }
.ehb-beam { position: absolute; top: -10%; width: 34%; height: 130%; background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0)); filter: blur(30px); transform: skewX(-18deg); opacity: 0.6; }
.ehb-beam--a { left: 8%; }
.ehb-beam--b { right: 6%; width: 22%; opacity: 0.4; }
.ehb-cut { position: absolute; left: 50%; top: calc(var(--ehb-top) + var(--ehb-gap)); width: min(60vw, 940px); height: calc(100% - var(--ehb-top) - var(--ehb-gap) - var(--ehb-bot)); object-fit: contain; object-position: 50% 100%; transform: translateX(-50%) translateY(24px) scale(0.97); opacity: 0.001; transition: transform 1.6s var(--dj-ease), opacity 1.2s ease; }
.ehb-cut.is-blend { mix-blend-mode: multiply; }
.ehb-slide.is-on .ehb-cut { transform: translateX(-50%); opacity: 1; }

.ehb-photo { width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform 8s linear; }
.ehb-slide.is-on .ehb-photo { transform: scale(1); }
.ehb-slide--photo::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: var(--scrim-t); }

/* Копия по центру сверху, как на apple.com/airpods-pro */
.ehb-copy { position: absolute; inset: clamp(40px, 8vh, 84px) 0 auto 0; display: flex; flex-direction: column; align-items: center; padding: 0 24px; text-align: center; pointer-events: none; }
.ehb-copy a, .ehb-copy button { pointer-events: auto; }
.ehb-eyebrow { font-size: clamp(17px, 1.6vw, 21px); line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #5E5E5E; transition: color 0.6s ease; }
.ehb-title { margin-top: 6px; max-width: min(16ch, 100%); font-size: clamp(32px, 5.6vw, 80px); overflow-wrap: break-word; hyphens: auto; line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: #1A1A1A; text-wrap: balance; transition: color 0.6s ease; }
.ehb-tag { margin-top: 12px; max-width: min(40ch, 100%); overflow-wrap: break-word; font-size: clamp(19px, 1.9vw, 28px); line-height: 1.143; font-weight: 600; letter-spacing: 0.007em; color: #1A1A1A; text-wrap: balance; transition: color 0.6s ease; }
.ehb-act { display: flex; align-items: center; gap: 14px 28px; margin-top: 26px; flex-wrap: wrap; justify-content: center; }
.ehb-btn { display: inline-flex; align-items: center; min-height: 44px; padding: 0 22px; border-radius: var(--r-pill); font-size: 17px; line-height: 1.18; letter-spacing: -0.022em; color: #fff; background: var(--dj-blue); transition: background-color 0.25s ease; }
.ehb-btn:hover { background: #002366; }
.ehb-more { display: inline-flex; align-items: center; gap: 3px; font-size: 17px; line-height: 1.18; letter-spacing: -0.022em; color: #002366; }
.ehb-more::after { content: '›'; font-size: 1.25em; line-height: 1; transform: translateY(-1px); transition: transform 0.3s var(--dj-ease); }
.ehb-more:hover { text-decoration: underline; }
.ehb-more:hover::after { transform: translate(3px, -1px); }
.ehb-btn:focus-visible, .ehb-more:focus-visible { outline: 2px solid #002366; outline-offset: 3px; }
.ehb--dark .ehb-eyebrow { color: rgba(255, 255, 255, 0.8); }
.ehb--dark .ehb-title, .ehb--dark .ehb-tag { color: #fff; }
.ehb--dark .ehb-btn { background: #002366; }
.ehb--dark .ehb-btn:hover { background: #002366; }
.ehb--dark .ehb-more { color: #FFFFFF; }

/* Точки и пауза Apple: капсула с точками и отдельная круглая кнопка */
.ehb-nav { position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; }
.ehb-dots { display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 20px; border-radius: var(--r-pill); background: rgba(237, 237, 237, 0.72); backdrop-filter: blur(14px) saturate(180%); -webkit-backdrop-filter: blur(14px) saturate(180%); }
.ehb-dots button { position: relative; width: 8px; height: 8px; border-radius: var(--r-pill); background: rgba(0, 0, 0, 0.42); overflow: hidden; transition: width 0.4s var(--dj-ease); }
.ehb-dots button.is-on { width: 44px; background: rgba(0, 0, 0, 0.2); }
.ehb-dots button i { position: absolute; inset: 0; border-radius: inherit; background: #1A1A1A; transform-origin: left; animation: ehb-prog linear forwards; }
@keyframes ehb-prog { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.ehb-pause { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; color: #1A1A1A; background: rgba(237, 237, 237, 0.72); backdrop-filter: blur(14px) saturate(180%); -webkit-backdrop-filter: blur(14px) saturate(180%); transition: background-color 0.25s ease; }
.ehb-pause:hover { background: rgba(214, 214, 214, 0.85); }
.ehb-pause svg { width: 16px; height: 16px; }
.ehb-dots button:focus-visible, .ehb-pause:focus-visible { outline: 2px solid #002366; outline-offset: 2px; }

@media (max-width: 734px) {
  .ehb { --ehb-bot: 72px; height: max(82svh, calc(var(--ehb-top) + var(--ehb-gap) + 200px + var(--ehb-bot))); min-height: 560px; }
  .ehb-slide--brand { --ehb-bot: 140px; }
  .ehb-slide--brand :deep(.ebr .ebr-plate) { bottom: 72px; }
  .ehb-title { font-size: clamp(28px, 8.2vw, 40px); }
  .ehb-copy { padding: 0 16px; }
  .ehb-cut { width: 92vw; }
  .ehb-dots { height: 36px; padding: 0 16px; }
  .ehb-pause { width: 36px; height: 36px; }
}
@media (prefers-reduced-motion: reduce) {
  .ehb-slide, .ehb-cut, .ehb-photo { transition: none; }
  .ehb-cut, .ehb-slide.is-on .ehb-cut { transform: translateX(-50%); opacity: 1; }
  .ehb-photo { transform: none; }
  .ehb-dots button i { animation: none; transform: none; }
}
</style>

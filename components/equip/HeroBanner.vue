<template>
  <!-- Первый экран страницы оборудования, как у продукта DJI: подпись,
       крупное название, слоган и две кнопки по центру сверху, под ними —
       слайдер. Слайд «студия» — светлый бесшовный фон DJI с мягкими
       полосами света и настоящим рендером позиции; слайды-фото — кадры
       оборудования в работе. Внизу точки и пауза. -->
  <section class="ehb" :class="{ 'ehb--dark': slide.dark }" aria-roledescription="carousel" :aria-label="product.name">
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
          <img class="ehb-cut" :src="s.src" :alt="s.alt" :fetchpriority="i === 0 ? 'high' : 'low'" />
          <span class="ehb-floor" />
        </template>
        <img v-else class="ehb-photo" :src="s.src" :alt="s.alt" loading="lazy" decoding="async" />
      </div>
    </div>

    <div class="ehb-copy">
      <span v-if="product.category" class="ehb-eyebrow">{{ product.category }}</span>
      <h1 class="ehb-title">{{ product.name }}</h1>
      <p v-if="tagline" class="ehb-tag">{{ tagline }}</p>
      <div class="ehb-act">
        <NuxtLink to="/contacts#contact-form" class="dj-btn" :class="slide.dark ? 'dj-btn--white' : ''">Запросить КП</NuxtLink>
        <a href="#overview" class="dj-btn" :class="slide.dark ? 'dj-btn--glass' : 'dj-btn--line'" @click.prevent="$emit('more')">Подробнее</a>
      </div>
    </div>

    <div v-if="slides.length > 1" class="ehb-dots">
      <button v-for="(s, i) in slides" :key="s.key" :class="{ 'is-on': i === cur }" :aria-label="`Слайд ${i + 1}`" @click="go(i)">
        <i v-if="i === cur" :style="{ animationDuration: DUR + 'ms', animationPlayState: paused ? 'paused' : 'running' }" />
      </button>
      <button class="ehb-pause" :aria-label="paused ? 'Продолжить' : 'Пауза'" @click="paused = !paused">
        <svg v-if="paused" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
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
onMounted(restart)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.ehb { position: relative; height: min(100svh - var(--dj-header-h), 900px); min-height: 560px; overflow: hidden; background: #eef0f3; color: var(--dj-ink); font-family: var(--dj-font); }
.ehb-stage { position: absolute; inset: 0; touch-action: pan-y; }
.ehb-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.9s ease; }
.ehb-slide.is-on { opacity: 1; }

/* Светлая студия DJI: бесшовный фон, мягкие лучи, тень на полу */
.ehb-slide--studio { background: radial-gradient(120% 80% at 50% 70%, #ffffff 0%, #eef0f3 55%, #dde1e6 100%); }
.ehb-beam { position: absolute; top: -10%; width: 34%; height: 130%; background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0)); filter: blur(30px); transform: skewX(-18deg); opacity: 0.75; }
.ehb-beam--a { left: 8%; }
.ehb-beam--b { right: 6%; width: 22%; opacity: 0.5; }
.ehb-cut { position: absolute; left: 50%; bottom: 9%; width: min(62vw, 980px); max-height: 58%; object-fit: contain; transform: translateX(-50%) scale(0.96); transition: transform 7s var(--dj-ease); filter: drop-shadow(0 30px 40px rgba(20, 30, 45, 0.18)); }
.ehb-slide.is-on .ehb-cut { transform: translateX(-50%) scale(1); }
.ehb-floor { position: absolute; left: 50%; bottom: 7%; width: min(54vw, 860px); height: 46px; transform: translateX(-50%); background: radial-gradient(50% 50% at 50% 50%, rgba(20, 30, 45, 0.22), rgba(20, 30, 45, 0) 70%); filter: blur(6px); }

.ehb-photo { width: 100%; height: 100%; object-fit: cover; transform: scale(1.04); transition: transform 7s linear; }
.ehb-slide.is-on .ehb-photo { transform: scale(1); }
.ehb-slide--photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.12) 40%, rgba(0, 0, 0, 0) 60%); pointer-events: none; }

.ehb-copy { position: absolute; inset: clamp(36px, 7vh, 72px) 0 auto 0; display: flex; flex-direction: column; align-items: center; padding: 0 24px; text-align: center; pointer-events: none; }
.ehb-copy a, .ehb-copy button { pointer-events: auto; }
.ehb-eyebrow { font-size: clamp(16px, 1.4vw, 20px); font-weight: 600; letter-spacing: -0.03em; color: var(--dj-text); transition: color 0.6s ease; }
.ehb-title { margin-top: 8px; max-width: 18ch; font-size: clamp(34px, 5vw, 72px); line-height: 1.11; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-ink); text-wrap: balance; transition: color 0.6s ease; }
.ehb-tag { margin-top: 10px; max-width: 46ch; font-size: clamp(16px, 1.6vw, 24px); line-height: 1.33; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-text); transition: color 0.6s ease; }
.ehb-act { display: flex; gap: 12px; margin-top: 22px; flex-wrap: wrap; justify-content: center; }
.ehb--dark .ehb-eyebrow, .ehb--dark .ehb-tag { color: rgba(255, 255, 255, 0.85); }
.ehb--dark .ehb-title { color: #fff; }

.ehb-dots { position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.ehb-dots button:not(.ehb-pause) { position: relative; width: 8px; height: 8px; border-radius: 999px; background: rgba(0, 0, 0, 0.25); overflow: hidden; transition: width 0.4s var(--dj-ease); }
.ehb-dots button.is-on { width: 36px; }
.ehb-dots button i { position: absolute; inset: 0; background: var(--dj-ink); transform-origin: left; animation: ehb-prog linear forwards; }
@keyframes ehb-prog { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.ehb-pause { display: grid; place-items: center; width: 22px; height: 22px; margin-left: 4px; color: var(--dj-ink); }
.ehb-pause svg { width: 14px; height: 14px; }

@media (max-width: 767px) {
  .ehb { height: 78svh; min-height: 520px; }
  .ehb-cut { width: 92vw; bottom: 14%; max-height: 42%; }
  .ehb-floor { width: 80vw; bottom: 12%; }
}
@media (prefers-reduced-motion: reduce) { .ehb-cut, .ehb-photo { transition: none; transform: translateX(-50%); } .ehb-photo { transform: none; } }
</style>

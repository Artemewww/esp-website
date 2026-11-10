<template>
  <!-- Первый экран страницы оборудования в подаче Apple: подпись,
       огромное название, подзаголовок, синяя капсула и ссылка «Подробнее ›»
       по центру сверху, под ними — слайдер с точками и паузой Apple. Слайд «студия» — светлый бесшовный фон DJI с мягкими
       полосами света и настоящим рендером позиции; слайды-фото — кадры
       оборудования в работе. Внизу точки и пауза. -->
  <section class="ehb" :class="{ 'ehb--dark': slide.dark, 'ehb--left': slide.type === 'photo' }" aria-roledescription="carousel" :aria-label="product.name">
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
        <NuxtLink to="/contacts#contact-form" class="ehb-btn">Запросить КП</NuxtLink>
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
.ehb { position: relative; height: min(100svh - var(--dj-header-h), 900px); min-height: 600px; overflow: hidden; background: #fafafc; color: #1d1d1f; font-family: var(--dj-font); }
.ehb-stage { position: absolute; inset: 0; touch-action: pan-y; }
.ehb-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1s cubic-bezier(0.4, 0, 0.6, 1); }
.ehb-slide.is-on { opacity: 1; }

/* Светлая студия Apple: бесшовный фон, мягкий свет, тень на полу */
.ehb-slide--studio { background: radial-gradient(120% 80% at 50% 74%, #ffffff 0%, #f5f5f7 56%, #e8e8ed 100%); }
.ehb-beam { position: absolute; top: -10%; width: 34%; height: 130%; background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0)); filter: blur(30px); transform: skewX(-18deg); opacity: 0.6; }
.ehb-beam--a { left: 8%; }
.ehb-beam--b { right: 6%; width: 22%; opacity: 0.4; }
.ehb-cut { position: absolute; left: 50%; bottom: 11%; width: min(60vw, 940px); max-height: max(30%, min(50%, calc(89% - 500px))); object-fit: contain; transform: translateX(-50%) translateY(24px) scale(0.97); opacity: 0.001; transition: transform 1.6s var(--dj-ease), opacity 1.2s ease; filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.14)); }
.ehb-slide.is-on .ehb-cut { transform: translateX(-50%); opacity: 1; }
.ehb-floor { position: absolute; left: 50%; bottom: 10%; width: min(52vw, 820px); height: 44px; transform: translateX(-50%); background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0) 70%); filter: blur(6px); }

.ehb-photo { width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform 8s linear; }
.ehb-slide.is-on .ehb-photo { transform: scale(1); }
.ehb-slide--photo::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.22) 38%, rgba(0, 0, 0, 0) 60%); }

/* Копия по центру сверху, как на apple.com/airpods-pro */
.ehb-copy { position: absolute; inset: clamp(40px, 8vh, 84px) 0 auto 0; display: flex; flex-direction: column; align-items: center; padding: 0 24px; text-align: center; pointer-events: none; }
.ehb-copy a, .ehb-copy button { pointer-events: auto; }
.ehb-eyebrow { font-size: clamp(17px, 1.6vw, 21px); line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #6e6e73; transition: color 0.6s ease; }
.ehb-title { margin-top: 6px; max-width: 16ch; font-size: clamp(40px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: #1d1d1f; text-wrap: balance; hyphens: manual; transition: color 0.6s ease; }
.ehb-tag { margin-top: 12px; max-width: 40ch; font-size: clamp(19px, 1.9vw, 28px); line-height: 1.143; font-weight: 600; letter-spacing: 0.007em; color: #1d1d1f; text-wrap: balance; transition: color 0.6s ease; }
.ehb-act { display: flex; align-items: center; gap: 14px 28px; margin-top: 26px; flex-wrap: wrap; justify-content: center; }
.ehb-btn { display: inline-flex; align-items: center; min-height: 44px; padding: 0 22px; border-radius: 980px; font-size: 17px; line-height: 1.18; letter-spacing: -0.022em; color: #fff; background: var(--dj-blue); transition: background-color 0.25s ease; }
.ehb-btn:hover { background: #0b3a8c; }
.ehb-more { display: inline-flex; align-items: center; gap: 3px; font-size: 17px; line-height: 1.18; letter-spacing: -0.022em; color: #0066cc; }
.ehb-more::after { content: '›'; font-size: 1.25em; line-height: 1; transform: translateY(-1px); transition: transform 0.3s var(--dj-ease); }
.ehb-more:hover { text-decoration: underline; }
.ehb-more:hover::after { transform: translate(3px, -1px); }
.ehb-btn:focus-visible, .ehb-more:focus-visible { outline: 2px solid #0071e3; outline-offset: 3px; }
.ehb--dark .ehb-eyebrow { color: rgba(255, 255, 255, 0.8); }
.ehb--dark .ehb-title, .ehb--dark .ehb-tag { color: #fff; }
.ehb--dark .ehb-btn { background: #0071e3; }
.ehb--dark .ehb-btn:hover { background: #0077ed; }
.ehb--dark .ehb-more { color: #2997ff; }

/* Точки и пауза Apple: капсула с точками и отдельная круглая кнопка */
.ehb-nav { position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; }
.ehb-dots { display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 20px; border-radius: 980px; background: rgba(232, 232, 237, 0.72); backdrop-filter: blur(14px) saturate(180%); -webkit-backdrop-filter: blur(14px) saturate(180%); }
.ehb-dots button { position: relative; width: 8px; height: 8px; border-radius: 999px; background: rgba(0, 0, 0, 0.42); overflow: hidden; transition: width 0.4s var(--dj-ease); }
.ehb-dots button.is-on { width: 44px; background: rgba(0, 0, 0, 0.2); }
.ehb-dots button i { position: absolute; inset: 0; border-radius: inherit; background: #1d1d1f; transform-origin: left; animation: ehb-prog linear forwards; }
@keyframes ehb-prog { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.ehb-pause { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; color: #1d1d1f; background: rgba(232, 232, 237, 0.72); backdrop-filter: blur(14px) saturate(180%); -webkit-backdrop-filter: blur(14px) saturate(180%); transition: background-color 0.25s ease; }
.ehb-pause:hover { background: rgba(223, 223, 227, 0.85); }
.ehb-pause svg { width: 16px; height: 16px; }
.ehb-dots button:focus-visible, .ehb-pause:focus-visible { outline: 2px solid #0071e3; outline-offset: 2px; }

@media (max-width: 734px) {
  .ehb { height: 82svh; min-height: 560px; }
  .ehb-copy { padding: 0 16px; }
  .ehb-cut { width: 92vw; bottom: 17%; max-height: 38%; }
  .ehb-floor { width: 80vw; bottom: 15%; }
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

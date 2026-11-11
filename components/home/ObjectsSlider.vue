<template>
  <!-- Слайдер объектов в подаче главной DJI: ролик во весь экран, текст
       по центру сверху. На слайде объекта главный акцент — производительность
       крупной цифрой, под ней название и кнопка «Подробнее». Слева внизу —
       соседние объекты списком, по бокам — стрелки, справа внизу — превью
       фильма о компании с кнопкой Play. Объекты идут от крупного к малому. -->
  <section class="os" :class="{ 'os--left': alignLeft }" aria-roledescription="carousel" :aria-label="label" @touchstart.passive="tStart" @touchend.passive="tEnd">
    <div class="os-media">
      <template v-for="(s, i) in items" :key="s.key">
        <video
          v-if="s.video && near(i)"
          :ref="(el) => setVideo(el, i)"
          class="os-layer"
          :class="{ 'is-on': i === cur }"
          :poster="s.poster"
          muted
          playsinline
          preload="auto"
          @ended="i === cur && next()"
          @timeupdate="(e) => i === cur && onTime(e)"
        >
          <source :src="smooth(s.video)" type="video/mp4" />
        </video>
        <img v-else-if="near(i)" class="os-layer os-layer--img" :class="{ 'is-on': i === cur }" :src="s.poster" :alt="s.title" />
      </template>
      <div class="os-shade" />
    </div>

    <div class="os-copy">
      <Transition name="os-txt" mode="out-in">
        <div :key="cur" class="os-copy__in">
          <template v-if="slide.intro">
            <span class="os-eyebrow os-eyebrow--flag">
              <svg class="os-flag" viewBox="0 0 30 15" aria-hidden="true"><rect width="30" height="10" fill="#c8313e" /><rect y="10" width="30" height="5" fill="#006039" /><rect width="4" height="15" fill="#fff" /><path d="M0.5 1.5h3M0.5 4h3M0.5 6.5h3M0.5 9h3M0.5 11.5h3M0.5 14h3" stroke="#c8313e" stroke-width="1.1" /></svg>
              {{ slide.eyebrow }}
            </span>
            <component :is="headingTag" class="os-title">{{ slide.title }}</component>
            <p class="os-desc">{{ slide.desc }}</p>
          </template>
          <template v-else>
            <span class="os-eyebrow">{{ slide.eyebrow }}</span>
            <p class="os-value" aria-label="Производительность">
              <b>{{ slide.value }}</b><span>{{ slide.unit }}</span>
            </p>
            <component :is="headingTag" class="os-name">{{ slide.title }}</component>
          </template>
          <div class="os-links">
            <NuxtLink :to="slide.link" class="os-pill">{{ slide.intro ? 'Обсудить проект' : 'Подробнее' }}<i>›</i></NuxtLink>
          </div>
        </div>
      </Transition>
    </div>

    <button class="os-arrow os-arrow--l" aria-label="Предыдущий объект" @click="go(cur - 1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 5l-7 7 7 7" /></svg></button>
    <button class="os-arrow os-arrow--r" aria-label="Следующий объект" @click="go(cur + 1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 5l7 7-7 7" /></svg></button>

    <!-- Соседние объекты, как DJI Air 3S / Mavic 3 Pro слева внизу -->
    <ol class="os-list" aria-label="Объекты">
      <li v-for="k in [-1, 0, 1]" :key="k" :class="{ 'is-cur': k === 0 }">
        <button @click="go(cur + k)">
          <i v-if="k === 0" class="os-list__bar"><i :style="{ transform: `scaleY(${progress})` }" /></i>
          {{ items[wrap(cur + k)]?.short }}
        </button>
      </li>
    </ol>

    <!-- Пагинация: какой объект из скольких + сегменты, активный заполняется по ходу ролика -->
    <div class="os-pager" role="group" aria-label="Пагинация объектов">
      <span class="os-pager__n"><b>{{ String(cur + 1).padStart(2, '0') }}</b> / {{ String(items.length).padStart(2, '0') }}</span>
      <span class="os-pager__segs">
        <button v-for="(s, i) in items" :key="s.key" :class="{ 'is-on': i === cur, 'is-past': i < cur }" :aria-label="`Объект ${i + 1} из ${items.length}`" :aria-current="i === cur ? 'true' : undefined" @click="go(i)">
          <i :style="i === cur ? { transform: `scaleX(${progress})` } : null" />
        </button>
      </span>
    </div>

    <!-- Превью фильма -->
    <button v-if="film" class="os-film" aria-label="Смотреть фильм о компании" @click="filmOpen = true">
      <span class="os-film__thumb">
        <video :src="film.preview" :poster="film.poster" muted loop playsinline autoplay preload="none" />
        <span class="os-film__play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg></span>
      </span>
      <span class="os-film__txt"><b>Смотреть фильм</b><small>О компании ESP</small></span>
    </button>

    <Teleport to="body">
      <Transition name="os-fade">
        <div v-if="filmOpen" class="os-modal" role="dialog" aria-label="Фильм о компании ESP" @click.self="filmOpen = false">
          <button class="os-modal__x" aria-label="Закрыть" @click="filmOpen = false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
          <video class="os-modal__v" :src="film.src" :poster="film.poster" controls autoplay playsinline />
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  label: { type: String, default: 'Объекты ESP' },
  film: { type: Object, default: () => ({ src: '/videos/hero/ESP_final_040926_1080.mp4', preview: '/videos/hero/ESP_preview_200826.mp4', poster: '/images/ESP_video_final_poster.jpg' }) },
  h1: { type: Boolean, default: true },
  // Текст слева по левому краю, над списком объектов (главная, десктоп)
  alignLeft: { type: Boolean, default: false }
})

const cur = ref(0)
const progress = ref(0)
const filmOpen = ref(false)
const videos = {}
const IMAGE_MS = 7000
const MAX_MS = 14000
let raf = 0
let imgStart = 0

const slide = computed(() => props.items[cur.value] || {})
const headingTag = computed(() => (props.h1 && cur.value === 0 ? 'h1' : 'h2'))
const wrap = (i) => (i + props.items.length) % props.items.length
const near = (i) => { const n = props.items.length; const d = Math.min(Math.abs(i - cur.value), n - Math.abs(i - cur.value)); return d <= 1 }
const setVideo = (el, i) => { if (el) videos[i] = el; else delete videos[i] }
// Съёмка 50 к/с на экране 60 Гц идёт рывками (кадры показываются неравномерно).
// Для таких роликов есть версии 60 к/с с интерполяцией движения — плавные.
const SMOOTH = new Set(['fanipol_230926', 'mstislavl_230926', 'postavsky_230926', 'vitkonprodukt_230926', 'skidel', 'BelarusMapESP'])
const smooth = (src = '') => { const m = src.match(/\/videos\/hero\/([\w-]+)\.mp4$/); return m && SMOOTH.has(m[1]) ? `/videos/hero60/${m[1]}.mp4` : src }

const playCurrent = async () => {
  await nextTick()
  Object.entries(videos).forEach(([i, v]) => {
    if (+i === cur.value) { v.currentTime = 0; if (!filmOpen.value) v.play().catch(() => {}) } else v.pause()
  })
  imgStart = performance.now()
  progress.value = 0
}
const onTime = (e) => {
  const v = e.target
  if (!v.duration || !isFinite(v.duration)) return
  const span = Math.min(MAX_MS / 1000, v.duration)
  progress.value = Math.min(1, v.currentTime / span)
  if (v.currentTime >= span - 0.05) next()
}
const loop = () => {
  if (!slide.value.video && !filmOpen.value) {
    progress.value = Math.min(1, (performance.now() - imgStart) / IMAGE_MS)
    if (progress.value >= 1) next()
  }
  raf = requestAnimationFrame(loop)
}
const go = (i) => { cur.value = wrap(i) }
let tx = 0
const tStart = (e) => { tx = e.touches[0].clientX }
const tEnd = (e) => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) go(cur.value + (d < 0 ? 1 : -1)) }
const next = () => go(cur.value + 1)

watch(cur, playCurrent)
watch(filmOpen, (o) => { const v = videos[cur.value]; if (v) o ? v.pause() : v.play().catch(() => {}) })
const onKey = (e) => { if (e.key === 'Escape') filmOpen.value = false }
onMounted(() => { playCurrent(); raf = requestAnimationFrame(loop); window.addEventListener('keydown', onKey) })
onBeforeUnmount(() => { cancelAnimationFrame(raf); window.removeEventListener('keydown', onKey) })
</script>

<style scoped>
.os { position: relative; height: 100svh; min-height: 600px; overflow: hidden; background: #0b0d10; color: #fff; font-family: var(--dj-font); }
.os-media { position: absolute; inset: 0; }
.os-layer { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity 1.1s ease, transform 7s linear; }
.os-layer.is-on { opacity: 1; transform: scale(1); }
/* Зум поверх движущейся съёмки даёт дрожание — у видео только плавная смена прозрачностью */
video.os-layer { transform: none; transition: opacity 1.1s ease; }
.os-shade { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(110% 62% at 50% 22%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.16) 55%, rgba(0, 0, 0, 0) 78%), linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 32%); }

.os-copy { position: absolute; inset: calc(var(--dj-header-h) + clamp(28px, 7vh, 72px)) 0 auto 0; display: flex; justify-content: center; padding: 0 24px; text-align: center; }
.os-copy__in { display: flex; flex-direction: column; align-items: center; max-width: 980px; }
.os-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: clamp(17px, 1.6vw, 21px); font-weight: 600; letter-spacing: 0.011em; color: rgba(255, 255, 255, 0.86); }
.os-flag { width: 26px; height: 13px; border-radius: 2px; box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35); }
.os-title { margin-top: 8px; font-size: clamp(40px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: #fff; text-wrap: balance; }
.os-desc { margin-top: 12px; max-width: 640px; font-size: clamp(19px, 2.2vw, 28px); line-height: 1.14286; font-weight: 400; letter-spacing: 0.007em; color: #fff; text-wrap: balance; }
/* Акцент — масштаб объекта */
.os-value { display: flex; align-items: baseline; gap: 0.25em; margin-top: 6px; line-height: 1; }
.os-value b { font-size: clamp(56px, 9vw, 128px); font-weight: 600; letter-spacing: -0.015em; font-variant-numeric: tabular-nums; color: #fff; }
.os-value span { font-size: clamp(21px, 2.6vw, 32px); font-weight: 600; letter-spacing: 0.004em; color: rgba(255, 255, 255, 0.9); }
.os-name { margin-top: 12px; max-width: 30ch; font-size: clamp(19px, 2.2vw, 28px); line-height: 1.14286; font-weight: 600; letter-spacing: 0.007em; color: #fff; text-wrap: balance; }
.os-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 22px; }
.os-pill { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 11px 21px; border-radius: var(--r-pill); font-size: 17px; line-height: 1.17648; letter-spacing: -0.022em; color: #fff; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.85); transition: background-color 0.25s ease; }
.os-pill i { font-style: normal; font-size: 18px; line-height: 1; transform: translateY(-1px); }
.os-pill:hover { background: rgba(255, 255, 255, 0.14); }
/* Как на apple.com: основная кнопка залита синим, вторая — контурная */
.os-pill:first-child { background: var(--dj-apple); box-shadow: none; }
.os-pill:first-child:hover { background: var(--dj-apple-hover); }
.os-pill i { display: none; }
.os-txt-enter-active { transition: opacity 0.7s ease 0.15s, transform 0.9s var(--dj-ease) 0.15s; }
.os-txt-leave-active { transition: opacity 0.35s ease; }
.os-txt-enter-from { opacity: 0; transform: translateY(16px); }
.os-txt-leave-to { opacity: 0; }

.os-arrow { position: absolute; top: 50%; width: 44px; height: 44px; margin-top: -22px; display: grid; place-items: center; color: #fff; opacity: 0.8; transition: opacity 0.2s ease; }
.os-arrow:hover { opacity: 1; }
.os-arrow svg { width: 26px; height: 26px; }
.os-arrow--l { left: clamp(8px, 1.5vw, 24px); }
.os-arrow--r { right: clamp(8px, 1.5vw, 24px); }

.os-list { position: absolute; left: clamp(20px, 7vw, 130px); bottom: clamp(28px, 6vh, 64px); list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.os-list button { position: relative; padding: 2px 0 2px 16px; font-size: 14px; letter-spacing: -0.016em; color: rgba(255, 255, 255, 0.5); text-align: left; transition: color 0.3s ease; }
.os-list li.is-cur button { color: #fff; font-weight: 600; }
.os-list button:hover { color: #fff; }
.os-list__bar { position: absolute; left: 0; top: 2px; bottom: 2px; width: 2px; background: rgba(255, 255, 255, 0.3); overflow: hidden; }
.os-list__bar i { position: absolute; inset: 0; background: #fff; transform-origin: top; }

/* Пагинация */
.os-pager { position: absolute; right: clamp(16px, 3vw, 40px); bottom: calc(clamp(24px, 5vh, 52px) + 108px); display: flex; align-items: center; gap: 14px; font-size: 12px; letter-spacing: 0.02em; color: rgba(255, 255, 255, 0.6); font-variant-numeric: tabular-nums; }
.os-pager__n b { color: #fff; font-weight: 600; }
.os-pager__segs { display: flex; gap: 6px; }
.os-pager__segs button { position: relative; width: 16px; height: 16px; padding: 0; }
.os-pager__segs button::before, .os-pager__segs i { content: ''; position: absolute; left: 0; right: 0; top: 7px; height: 2px; border-radius: 2px; }
.os-pager__segs button::before { background: rgba(255, 255, 255, 0.3); transition: background-color 0.3s ease; }
.os-pager__segs button:hover::before, .os-pager__segs button.is-past::before { background: rgba(255, 255, 255, 0.6); }
.os-pager__segs i { background: #fff; transform: scaleX(0); transform-origin: left; }
.os-pager__segs button.is-on { width: 34px; transition: width 0.4s var(--dj-ease); }

/* Вариант главной: текст слева по левому краю, ровно над списком объектов */
@media (min-width: 768px) {
  .os--left .os-copy { inset: auto auto calc(clamp(28px, 6vh, 64px) + 118px) clamp(20px, 7vw, 130px); justify-content: flex-start; padding: 0; text-align: left; max-width: min(760px, calc(100vw - 2 * clamp(20px, 7vw, 130px))); }
  .os--left .os-copy__in { align-items: flex-start; }
  .os--left .os-links { justify-content: flex-start; }
  .os--left .os-title { font-size: clamp(40px, 5vw, 72px); }
  .os--left .os-shade { background: linear-gradient(90deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.18) 48%, rgba(0, 0, 0, 0) 72%), linear-gradient(0deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 45%); }
}

/* Превью фильма справа внизу */
.os-film { position: absolute; right: clamp(16px, 3vw, 40px); bottom: clamp(24px, 5vh, 52px); display: flex; align-items: center; gap: 14px; padding: 8px 18px 8px 8px; border-radius: var(--r-md); color: #fff; text-align: left; background: rgba(15, 18, 24, 0.42); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); transition: background-color 0.25s ease, transform 0.4s var(--dj-ease); }
.os-film:hover { background: rgba(15, 18, 24, 0.6); transform: translateY(-2px); }
.os-film__thumb { position: relative; width: 136px; aspect-ratio: 16 / 9; overflow: hidden; border-radius: var(--r-xs); background: #000; }
.os-film__thumb video { width: 100%; height: 100%; object-fit: cover; }
.os-film__play { position: absolute; inset: 0; display: grid; place-items: center; }
.os-film__play svg { width: 34px; height: 34px; padding: 9px 8px 9px 10px; border-radius: 50%; color: var(--dj-ink); background: rgba(255, 255, 255, 0.92); }
.os-film__txt { display: grid; gap: 2px; }
.os-film__txt b { font-size: 14px; font-weight: 600; letter-spacing: -0.016em; }
.os-film__txt small { font-size: 12px; color: rgba(255, 255, 255, 0.65); }

.os-modal { position: fixed; inset: 0; z-index: 160; display: grid; place-items: center; padding: 4vw; background: rgba(0, 0, 0, 0.9); }
.os-modal__v { width: min(1280px, 100%); max-height: 86vh; border-radius: var(--r-sm); background: #000; }
.os-modal__x { position: absolute; top: 18px; right: 18px; width: 44px; height: 44px; display: grid; place-items: center; color: #fff; border-radius: 50%; background: rgba(255, 255, 255, 0.12); }
.os-modal__x svg { width: 22px; height: 22px; }
.os-fade-enter-active, .os-fade-leave-active { transition: opacity 0.35s ease; }
.os-fade-enter-from, .os-fade-leave-to { opacity: 0; }

@media (max-width: 767px) {
  .os-copy { inset: auto 0 158px 0; }
  .os-pager { left: 16px; right: 16px; justify-content: center; gap: 10px; bottom: 112px; }
  .os-pager__segs { gap: 4px; min-width: 0; }
  .os-pager__segs button { width: 12px; flex: 0 1 auto; }
  .os-pager__segs button.is-on { width: 26px; }
  .os-shade { background: linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 55%, rgba(0, 0, 0, 0.3) 100%); }
  .os-list, .os-arrow { display: none; }
  .os-film { left: 16px; right: 16px; bottom: 24px; justify-content: flex-start; }
  .os-film__thumb { width: 96px; }
  .os-pill { min-height: 44px; padding: 8px 15px; font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) { .os-layer { transition: opacity 0.4s ease; transform: none; } }
</style>

<template>
  <!-- Первый экран как у DJI: ролик во весь экран, по центру — подпись,
       крупный заголовок и две ссылки. Слева снизу — перечень соседних
       слайдов, справа — счётчик, пауза и фильм о компании. Порядок роликов
       и тексты — из админки (/api/site-content/hero-slides). -->
  <section class="dh" aria-roledescription="carousel" aria-label="Объекты ESP">
    <div class="dh-media">
      <template v-for="(s, i) in slides" :key="s.video || s.image">
        <video
          v-if="s.video && near(i)"
          :ref="(el) => setVideo(el, i)"
          class="dh-layer"
          :class="{ 'is-on': i === cur }"
          :poster="poster(s)"
          muted
          playsinline
          preload="auto"
          @ended="i === cur && next()"
          @timeupdate="(e) => i === cur && onTime(e)"
        >
          <source :src="s.video" type="video/mp4" />
        </video>
        <img v-else-if="s.image && near(i)" class="dh-layer dh-layer--img" :class="{ 'is-on': i === cur }" :src="s.image" :alt="s.title" />
      </template>
      <div class="dh-shade" />
    </div>

    <div class="dh-copy">
      <Transition name="dh-txt" mode="out-in">
        <div :key="cur" class="dh-copy__in">
          <span class="dh-eyebrow">{{ slide.badge }}</span>
          <component :is="cur === 0 ? 'h1' : 'h2'" class="dh-title">{{ slide.title }}</component>
          <p class="dh-desc">{{ slide.description }}</p>
          <div class="dh-links">
            <NuxtLink :to="slide.link || '/projects'" class="dj-btn dj-btn--glass">{{ cur === 0 ? 'Обсудить проект' : 'Подробнее ›' }}</NuxtLink>
            <button class="dj-btn dj-btn--glass" @click="film = true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
              Смотреть фильм
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Перечень слайдов слева снизу: предыдущий, текущий, следующий -->
    <ol class="dh-list" aria-label="Слайды">
      <li v-for="k in [-1, 0, 1]" :key="k" :class="{ 'is-cur': k === 0 }">
        <button :aria-current="k === 0" @click="go(cur + k)">
          <i v-if="k === 0" class="dh-list__bar"><i :style="{ transform: `scaleY(${progress})` }" /></i>
          {{ shortName(slides[wrap(cur + k)]) }}
        </button>
      </li>
    </ol>

    <div class="dh-ctrl">
      <span class="dh-count">{{ String(cur + 1).padStart(2, '0') }} / {{ String(slides.length).padStart(2, '0') }}</span>
      <button class="dh-round" aria-label="Предыдущий слайд" @click="go(cur - 1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 6l-6 6 6 6" /></svg></button>
      <button class="dh-round" :aria-label="paused ? 'Продолжить' : 'Пауза'" @click="toggle">
        <svg v-if="paused" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M8 5.5v13l11-6.5z" /></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
      </button>
      <button class="dh-round" aria-label="Следующий слайд" @click="go(cur + 1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6l6 6-6 6" /></svg></button>
    </div>

    <a href="#metrics" class="dh-scroll" aria-label="Листать дальше"><i /></a>

    <Teleport to="body">
      <Transition name="dh-film">
        <div v-if="film" class="dh-film" role="dialog" aria-label="Фильм о компании ESP" @click.self="film = false">
          <button class="dh-film__x" aria-label="Закрыть" @click="film = false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
          <video class="dh-film__v" src="/videos/hero/ESP_final_040926_1080.mp4" poster="/images/ESP_video_final_poster.jpg" controls autoplay playsinline />
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import heroSlideDefaults from '~~/content/defaults/hero-slides.json'

const { data } = await useFetch('/api/site-content/hero-slides', { default: () => heroSlideDefaults })
const slides = computed(() => {
  const raw = Array.isArray(data.value) && data.value.length ? data.value : heroSlideDefaults
  const ok = raw.filter((s) => s && (s.video || s.image))
  return ok.length ? ok : heroSlideDefaults
})

const cur = ref(0)
const progress = ref(0)
const paused = ref(false)
const film = ref(false)
const videos = {}
const IMAGE_MS = 7000
const MAX_MS = 14000
let timer = null
let imgStart = 0
let raf = 0

const slide = computed(() => slides.value[cur.value] || {})
const wrap = (i) => (i + slides.value.length) % slides.value.length
// В DOM держим только текущий и соседние ролики: двенадцать видео сразу — это лишний трафик
const near = (i) => { const n = slides.value.length; const d = Math.min(Math.abs(i - cur.value), n - Math.abs(i - cur.value)); return d <= 1 }
const poster = (s) => s.poster || (s.video ? s.video.replace(/\.mp4$/, '.jpg') : undefined)
const shortName = (s) => {
  if (!s) return ''
  const m = s.title.match(/(?:города|деревне|СПК|ОАО|ООО|завода)\s+(.+)$/)
  const t = (m ? m[1] : s.title).replace(/[«»"]/g, '')
  return t.length > 34 ? t.slice(0, 32) + '…' : t
}
const setVideo = (el, i) => { if (el) videos[i] = el; else delete videos[i] }

const playCurrent = async () => {
  await nextTick()
  Object.entries(videos).forEach(([i, v]) => {
    if (+i === cur.value) { v.currentTime = 0; if (!paused.value) v.play().catch(() => {}) }
    else v.pause()
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
  if (!slide.value.video && !paused.value) {
    progress.value = Math.min(1, (performance.now() - imgStart) / IMAGE_MS)
    if (progress.value >= 1) next()
  }
  raf = requestAnimationFrame(loop)
}

const go = (i) => { cur.value = wrap(i) }
const next = () => go(cur.value + 1)
const toggle = () => {
  paused.value = !paused.value
  const v = videos[cur.value]
  if (v) paused.value ? v.pause() : v.play().catch(() => {})
  if (!paused.value) imgStart = performance.now() - progress.value * IMAGE_MS
}

watch(cur, playCurrent)
watch(film, (v) => { const cv = videos[cur.value]; if (cv) v ? cv.pause() : (!paused.value && cv.play().catch(() => {})) })

const onKey = (e) => { if (e.key === 'Escape') film.value = false }
onMounted(() => { playCurrent(); raf = requestAnimationFrame(loop); window.addEventListener('keydown', onKey) })
onBeforeUnmount(() => { cancelAnimationFrame(raf); clearTimeout(timer); window.removeEventListener('keydown', onKey) })
</script>

<style scoped>
.dh { position: relative; height: 100svh; min-height: 560px; overflow: hidden; background: #0b0d10; color: #fff; font-family: var(--dj-font); }
.dh-media { position: absolute; inset: 0; }
.dh-layer { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity 1.1s ease, transform 7s linear; }
.dh-layer.is-on { opacity: 1; transform: scale(1); }
.dh-shade { position: absolute; inset: 0; background: radial-gradient(120% 70% at 50% 28%, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.12) 55%, rgba(0, 0, 0, 0) 75%), linear-gradient(0deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0) 30%); pointer-events: none; }

.dh-copy { position: absolute; inset: calc(var(--dj-header-h) + clamp(28px, 7vh, 80px)) 0 auto 0; display: flex; justify-content: center; padding: 0 24px; text-align: center; }
.dh-copy__in { display: flex; flex-direction: column; align-items: center; max-width: 920px; }
.dh-eyebrow { font-size: clamp(16px, 1.4vw, 20px); font-weight: 600; letter-spacing: 0.011em; color: rgba(255, 255, 255, 0.85); }
.dh-title { margin-top: 10px; font-size: clamp(34px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: #fff; text-wrap: balance; }
.dh-desc { margin-top: 12px; max-width: 680px; font-size: clamp(16px, 1.4vw, 20px); line-height: 1.381; letter-spacing: 0.011em; color: rgba(255, 255, 255, 0.85); text-wrap: pretty; }
.dh-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 22px; }
.dh-txt-enter-active { transition: opacity 0.7s ease 0.15s, transform 0.9s var(--dj-ease) 0.15s; }
.dh-txt-leave-active { transition: opacity 0.35s ease; }
.dh-txt-enter-from { opacity: 0; transform: translateY(16px); }
.dh-txt-leave-to { opacity: 0; }

.dh-list { position: absolute; left: clamp(16px, 3vw, 40px); bottom: clamp(28px, 5vh, 48px); list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.dh-list button { position: relative; display: flex; align-items: center; gap: 10px; padding: 2px 0 2px 14px; font-size: 13px; color: rgba(255, 255, 255, 0.5); text-align: left; transition: color 0.3s ease; }
.dh-list li.is-cur button { color: #fff; font-weight: 500; }
.dh-list button:hover { color: #fff; }
.dh-list__bar { position: absolute; left: 0; top: 2px; bottom: 2px; width: 2px; background: rgba(255, 255, 255, 0.3); overflow: hidden; }
.dh-list__bar i { position: absolute; inset: 0; background: #fff; transform-origin: top; }

.dh-ctrl { position: absolute; right: clamp(16px, 3vw, 40px); bottom: clamp(24px, 5vh, 44px); display: flex; align-items: center; gap: 8px; }
.dh-count { margin-right: 6px; font-size: 13px; color: rgba(255, 255, 255, 0.75); font-variant-numeric: tabular-nums; }
.dh-round { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; color: #fff; background: rgba(255, 255, 255, 0.12); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: background-color 0.2s ease; }
.dh-round:hover { background: rgba(255, 255, 255, 0.26); }
.dh-round svg { width: 16px; height: 16px; }

.dh-scroll { position: absolute; left: 50%; bottom: 22px; width: 22px; height: 34px; margin-left: -11px; border-radius: 12px; box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.7); }
.dh-scroll i { position: absolute; left: 50%; top: 7px; width: 2px; height: 7px; margin-left: -1px; border-radius: 2px; background: #fff; animation: dh-wheel 1.8s var(--dj-ease) infinite; }
@keyframes dh-wheel { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(10px); } }

.dh-film { position: fixed; inset: 0; z-index: 120; display: grid; place-items: center; padding: 4vw; background: rgba(0, 0, 0, 0.88); }
.dh-film__v { width: min(1280px, 100%); max-height: 86vh; border-radius: 12px; background: #000; }
.dh-film__x { position: absolute; top: 18px; right: 18px; width: 44px; height: 44px; display: grid; place-items: center; color: #fff; border-radius: 50%; background: rgba(255, 255, 255, 0.12); }
.dh-film__x svg { width: 22px; height: 22px; }
.dh-film-enter-active, .dh-film-leave-active { transition: opacity 0.35s ease; }
.dh-film-enter-from, .dh-film-leave-to { opacity: 0; }

@media (max-width: 767px) {
  .dh-copy { inset: auto 0 112px 0; }
  .dh-shade { background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 55%, rgba(0, 0, 0, 0.25) 100%); }
  .dh-list { display: none; }
  .dh-ctrl { left: 16px; right: 16px; bottom: 28px; justify-content: center; }
  .dh-scroll { display: none; }
}
@media (prefers-reduced-motion: reduce) { .dh-layer { transition: opacity 0.4s ease; transform: none; } }
</style>

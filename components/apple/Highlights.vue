<template>
  <!-- «Get the highlights» с apple.com: горизонтальная галерея крупных
       карточек с подписью, точки-прогресс, пауза и стрелки. -->
  <section ref="sec" class="hl" :class="`hl--${tone}`" :aria-label="title">
    <div class="hl-head dj-reveal">
      <span v-if="eyebrow" class="hl-eyebrow">{{ eyebrow }}</span>
      <h2 class="hl-title">{{ title }}</h2>
      <div v-if="$slots.default" class="hl-extra"><slot /></div>
    </div>

    <div ref="track" class="hl-track" @scroll.passive="onScroll">
      <component
        :is="it.to ? NuxtLinkCmp : (it.click ? 'button' : 'div')"
        v-for="(it, i) in items"
        :key="i"
        v-bind="it.to ? { to: it.to } : (it.click ? { type: 'button' } : {})"
        class="hl-item"
        :class="{ 'is-on': i === cur, 'hl-item--contain': it.contain, 'hl-item--light': it.light }"
        :aria-label="it.label || it.title || null"
        @click="it.click && it.click()"
      >
        <span class="hl-media">
          <video v-if="it.video" :src="it.video" :poster="it.image" muted loop playsinline preload="none" aria-hidden="true" />
          <img v-else-if="it.image" :src="it.image" :alt="it.alt || it.title || ''" loading="lazy" decoding="async" />
        </span>
        <span v-if="it.title || it.text" class="hl-cap"><b v-if="it.title">{{ it.title }}</b> {{ it.text }}</span>
        <span v-if="it.chip" class="hl-chip">{{ it.chip }}</span>
      </component>
    </div>

    <div v-if="items.length > 1" class="hl-ctrl">
      <div class="hl-dots" role="group" aria-label="Слайды">
        <button
          v-for="(it, i) in items"
          :key="i"
          type="button"
          class="hl-dot"
          :class="{ 'is-on': i === cur }"
          :aria-label="`Слайд ${i + 1} из ${items.length}`"
          :aria-current="i === cur ? 'true' : null"
          @click="goTo(i, true)"
        >
          <span
            v-if="i === cur && autoplay"
            :key="tick"
            class="hl-fill"
            :style="{ animationDuration: `${interval}ms`, animationPlayState: running ? 'running' : 'paused' }"
            @animationend="next(false)"
          />
        </button>
      </div>
      <button v-if="autoplay" type="button" class="hl-play" :aria-label="playing ? 'Пауза' : 'Воспроизвести'" @click="playing = !playing">
        <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="6" width="3.2" height="12" rx="1" /><rect x="13.8" y="6" width="3.2" height="12" rx="1" /></svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 6.2v11.6c0 .7.8 1.1 1.4.7l8.6-5.8c.5-.4.5-1.1 0-1.5L9.9 5.5c-.6-.4-1.4 0-1.4.7z" /></svg>
      </button>
      <div class="hl-paddles">
        <button type="button" aria-label="Назад" :disabled="cur === 0" @click="goTo(cur - 1, true)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" aria-label="Вперёд" :disabled="cur === items.length - 1" @click="goTo(cur + 1, true)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, resolveComponent } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Главное.' },
  eyebrow: { type: String, default: '' },
  items: { type: Array, required: true },
  tone: { type: String, default: 'light' },
  interval: { type: Number, default: 6000 }
})

const NuxtLinkCmp = resolveComponent('NuxtLink')
const sec = ref(null)
const track = ref(null)
const cur = ref(0)
const tick = ref(0)
const playing = ref(true)
const visible = ref(false)
const autoplay = ref(false)
const running = computed(() => playing.value && visible.value)
let io = null
let lock = 0
let scrollT = 0

const goTo = (i, user) => {
  const n = props.items.length
  const idx = (i + n) % n
  const el = track.value?.children[idx]
  if (!el) return
  if (user) tick.value++
  cur.value = idx
  lock = Date.now()
  const pad = parseFloat(getComputedStyle(track.value).paddingLeft) || 0
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  track.value.scrollTo({ left: el.offsetLeft - pad, behavior: reduce ? 'auto' : 'smooth' })
}
const next = () => { tick.value++; goTo(cur.value + 1) }

// Ручная прокрутка: активной становится ближайшая к левому краю карточка
const onScroll = () => {
  if (Date.now() - lock < 900) return
  clearTimeout(scrollT)
  scrollT = setTimeout(() => {
    const t = track.value
    if (!t) return
    const pad = parseFloat(getComputedStyle(t).paddingLeft) || 0
    let best = 0, d = Infinity
    Array.from(t.children).forEach((c, i) => {
      const x = Math.abs(c.offsetLeft - pad - t.scrollLeft)
      if (x < d) { d = x; best = i }
    })
    if (best !== cur.value) { cur.value = best; tick.value++ }
  }, 120)
}

// Ролик играет только в активной карточке
watch([cur, running], () => {
  Array.from(track.value?.querySelectorAll('video') || []).forEach((v) => {
    const on = v.closest('.hl-item') === track.value.children[cur.value] && running.value
    on ? v.play().catch(() => {}) : v.pause()
  })
})

onMounted(() => {
  autoplay.value = !matchMedia('(prefers-reduced-motion: reduce)').matches
  io = new IntersectionObserver(([e]) => { visible.value = e.isIntersecting }, { threshold: 0.35 })
  io.observe(sec.value)
})
onBeforeUnmount(() => { io?.disconnect(); clearTimeout(scrollT) })
</script>

<style scoped>
.hl { padding: clamp(80px, 11vw, 160px) 0 clamp(64px, 8vw, 120px); font-family: var(--dj-font); overflow: hidden; }
.hl--light { background: #f5f5f7; }
.hl--white { background: #fff; }
.hl--dark { background: #000; }
.hl-head { width: min(980px, 87.5vw); margin: 0 auto clamp(36px, 4vw, 56px); }
.hl-eyebrow { display: block; margin-bottom: 8px; font-size: clamp(19px, 1.7vw, 24px); line-height: 1.17; font-weight: 600; color: #6e6e73; }
.hl-title { margin: 0; font-size: clamp(40px, 4.6vw, 56px); line-height: 1.07; font-weight: 600; letter-spacing: -0.005em; color: #1d1d1f; }
.hl--dark .hl-title { color: #f5f5f7; }
.hl--dark .hl-eyebrow { color: #86868b; }
.hl-extra { margin-top: 16px; }

.hl-track { --pad: max(6.25vw, calc((100% - 980px) / 2)); display: flex; gap: 20px; padding: 0 var(--pad); scroll-padding: 0 var(--pad); overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-x: contain; }
.hl-track::-webkit-scrollbar { display: none; }
.hl-item { position: relative; flex: 0 0 min(980px, 87.5vw); aspect-ratio: 16 / 10; max-height: 76vh; overflow: hidden; border-radius: 28px; scroll-snap-align: start; background: #000; color: #f5f5f7; text-align: left; isolation: isolate; padding: 0; border: 0; cursor: pointer; }
div.hl-item { cursor: default; }
.hl-media { position: absolute; inset: 0; z-index: -1; }
.hl-media img, .hl-media video { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
.hl-item:hover .hl-media img, .hl-item:hover .hl-media video { transform: scale(1.025); }
.hl-item::before { content: ''; position: absolute; inset: 0 0 auto; z-index: -1; height: 55%; background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%); pointer-events: none; }
.hl-cap { position: absolute; top: clamp(24px, 3.4vw, 48px); left: clamp(24px, 3.4vw, 48px); right: clamp(24px, 3.4vw, 48px); max-width: 26em; font-size: clamp(17px, 1.6vw, 21px); line-height: 1.24; font-weight: 400; letter-spacing: 0.011em; color: rgba(245, 245, 247, 0.86); }
.hl-cap b { font-weight: 600; color: #f5f5f7; }
.hl-chip { position: absolute; left: clamp(24px, 3.4vw, 48px); bottom: clamp(24px, 3.4vw, 40px); padding: 8px 16px; border-radius: 980px; font-size: 14px; color: #f5f5f7; background: rgba(66, 66, 69, 0.72); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.hl-item--contain, .hl-item--light { background: #fff; color: #1d1d1f; }
.hl--white .hl-item--contain, .hl--white .hl-item--light { background: #f5f5f7; }
.hl-item--contain .hl-media { inset: 28% 8% 6%; }
.hl-item--contain .hl-media img { object-fit: contain; }
.hl-item--contain::before, .hl-item--light::before { display: none; }
.hl-item--contain .hl-cap, .hl-item--light .hl-cap { color: #6e6e73; }
.hl-item--contain .hl-cap b, .hl-item--light .hl-cap b { color: #1d1d1f; }

/* Управление: точки-прогресс в капсуле, пауза, стрелки */
.hl-ctrl { position: relative; display: flex; align-items: center; justify-content: center; gap: 14px; width: min(980px, 87.5vw); margin: clamp(28px, 3vw, 40px) auto 0; }
.hl-dots { display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 22px; border-radius: 980px; background: rgba(210, 210, 215, 0.64); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.hl--dark .hl-dots { background: rgba(66, 66, 69, 0.72); }
.hl-dot { position: relative; width: 8px; height: 8px; padding: 0; border: 0; border-radius: 980px; overflow: hidden; background: rgba(0, 0, 0, 0.42); cursor: pointer; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease; }
.hl--dark .hl-dot { background: rgba(255, 255, 255, 0.42); }
.hl-dot.is-on { width: 48px; background: rgba(0, 0, 0, 0.28); }
.hl--dark .hl-dot.is-on { background: rgba(255, 255, 255, 0.28); }
.hl-fill { position: absolute; inset: 0; border-radius: inherit; background: #1d1d1f; transform-origin: left; animation: hl-fill linear forwards; }
.hl--dark .hl-fill { background: #f5f5f7; }
@keyframes hl-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.hl-play { display: grid; place-items: center; width: 56px; height: 56px; border: 0; border-radius: 50%; background: rgba(210, 210, 215, 0.64); color: #1d1d1f; cursor: pointer; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); transition: background-color 0.2s ease; }
.hl--dark .hl-play { background: rgba(66, 66, 69, 0.72); color: #f5f5f7; }
.hl-play:hover { background: rgba(223, 223, 227, 0.8); }
.hl-play svg { width: 22px; height: 22px; fill: currentColor; }
.hl-paddles { position: absolute; right: 0; display: flex; gap: 14px; }
.hl-paddles button { display: grid; place-items: center; width: 36px; height: 36px; border: 0; border-radius: 50%; background: #e8e8ed; color: #1d1d1f; cursor: pointer; transition: background-color 0.2s ease, opacity 0.2s ease; }
.hl--white .hl-paddles button { background: #f5f5f7; }
.hl--dark .hl-paddles button { background: #333336; color: #f5f5f7; }
.hl-paddles button:hover:not(:disabled) { background: #dcdce1; }
.hl--dark .hl-paddles button:hover:not(:disabled) { background: #424245; }
.hl-paddles button:disabled { opacity: 0.36; cursor: default; }
.hl-paddles svg { width: 18px; height: 18px; }

@media (max-width: 734px) {
  .hl-track { gap: 12px; }
  .hl-item { aspect-ratio: 4 / 5; flex-basis: 87.5vw; border-radius: 22px; }
  .hl-paddles { display: none; }
  .hl-dots { height: 48px; padding: 0 18px; gap: 10px; }
  .hl-dot.is-on { width: 36px; }
  .hl-play { width: 48px; height: 48px; }
}
@media (prefers-reduced-motion: reduce) {
  .hl-media img, .hl-media video, .hl-dot { transition: none; }
}
</style>

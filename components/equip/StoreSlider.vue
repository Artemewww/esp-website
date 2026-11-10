<template>
  <!-- Слайдер витрины как на главной DJI Store: изделие справа на мягком
       градиенте «небо — горизонт» с глянцевым полом и отражением, слева —
       название, короткая строка и контурная кнопка; стрелки по бокам,
       полоски-индикаторы внизу по центру. -->
  <section class="ss" aria-roledescription="carousel" aria-label="Оборудование ESP" @touchstart.passive="ts" @touchend.passive="te">
    <div
      v-for="(s, i) in slides"
      :key="s.slug"
      class="ss-slide"
      :class="{ 'is-on': i === cur }"
      :style="{ '--sky': s.sky, '--glow': s.glow, '--floor': s.floor }"
      :aria-hidden="i !== cur"
    >
      <img v-if="s.banner" class="ss-banner" :src="s.banner" :alt="s.name" :fetchpriority="i === 0 ? 'high' : 'low'" decoding="async" />
      <div class="ss-in" :class="{ 'ss-in--banner': s.banner }">
        <div class="ss-copy">
          <component :is="i === 0 ? 'h2' : 'h3'" class="ss-name">{{ s.name }}</component>
          <p class="ss-tag">{{ s.tag }}</p>
          <NuxtLink :to="`/equipment/${s.slug}`" class="ss-pill" :tabindex="i === cur ? 0 : -1">Подробнее</NuxtLink>
        </div>
        <div v-if="!s.banner" class="ss-prod">
          <img class="ss-img" :src="s.cut" :alt="s.name" :loading="i === 0 ? 'eager' : 'lazy'" decoding="async" />
          <span class="ss-shadow" />
          <img class="ss-refl" :src="s.cut" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>

    <button class="ss-arrow ss-arrow--l" aria-label="Предыдущее оборудование" @click="go(cur - 1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 5l-7 7 7 7" /></svg></button>
    <button class="ss-arrow ss-arrow--r" aria-label="Следующее оборудование" @click="go(cur + 1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 5l7 7-7 7" /></svg></button>
    <div class="ss-dots">
      <button v-for="(s, i) in slides" :key="s.slug" :class="{ 'is-on': i === cur }" :aria-label="s.name" @click="go(i)" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({ items: { type: Array, required: true } })

// Палитры «небо — горизонт — пол» в духе баннеров DJI
const TONES = [
  { sky: '#3b4f66', glow: '#d9b48f', floor: '#1d242c' },
  { sky: '#5d7187', glow: '#e6ddd0', floor: '#2a333d' },
  { sky: '#26384f', glow: '#9fc0de', floor: '#141b24' },
  { sky: '#6a7b8c', glow: '#f1e2cc', floor: '#323b45' }
]
const firstSentence = (t) => { const s = String(t || '').split(/(?<=[.!?])\s/)[0]; return s.length > 150 ? s.slice(0, 148).replace(/\s+\S*$/, "") + "…" : s }
// Готовые баннеры-кадры: изделие уже в сцене, текст ставим слева
const BANNERS = { 'flotation-units': '/images/equipment/gen/flotation-banner.webp' }
const slides = props.items.map((e, i) => ({
  banner: BANNERS[e.slug],
  slug: e.slug,
  name: e.name,
  tag: firstSentence(e.desc),
  cut: e.photo.replace('/images/equipment/', '/images/equipment/cut/'),
  ...TONES[i % TONES.length]
}))

const cur = ref(0)
const DUR = 6000
let timer = null
const go = (i) => { cur.value = (i + slides.length) % slides.length; restart() }
const restart = () => { clearTimeout(timer); timer = setTimeout(() => go(cur.value + 1), DUR) }
let tx = 0
const ts = (e) => { tx = e.touches[0].clientX }
const te = (e) => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) go(cur.value + (d < 0 ? 1 : -1)) }
onMounted(restart)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.ss { position: relative; height: clamp(420px, 34vw, 560px); overflow: hidden; background: #1d242c; font-family: var(--dj-font); color: #fff; }
.ss-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.9s ease; background:
  radial-gradient(70% 34% at 62% 60%, color-mix(in srgb, var(--glow) 70%, transparent) 0%, transparent 70%),
  linear-gradient(180deg, var(--sky) 0%, color-mix(in srgb, var(--sky) 55%, var(--glow)) 52%, var(--glow) 60%, var(--floor) 61%, color-mix(in srgb, var(--floor) 70%, #000) 100%); }
.ss-slide.is-on { opacity: 1; }
.ss-banner { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 70% 50%; transform: scale(1.03); transition: transform 7s linear; }
.ss-slide.is-on .ss-banner { transform: scale(1); }
.ss-slide:has(.ss-banner)::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(5, 12, 22, 0.55) 0%, rgba(5, 12, 22, 0.2) 34%, rgba(5, 12, 22, 0) 55%); pointer-events: none; }
.ss-in { z-index: 1; }
.ss-in { position: relative; height: 100%; max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: 46% 54%; align-items: center; padding: 0 clamp(24px, 6vw, 96px); }
.ss-copy { padding-left: clamp(0px, 11vw, 200px); transform: translateY(-12%); }
.ss-name { font-size: clamp(30px, 3.4vw, 48px); line-height: 1.1; font-weight: 600; letter-spacing: -0.03em; color: #fff; text-wrap: balance; }
.ss-tag { margin-top: 10px; max-width: 38ch; font-size: clamp(15px, 1.25vw, 18px); line-height: 1.45; font-weight: 600; letter-spacing: -0.02em; color: rgba(255, 255, 255, 0.85); }
.ss-pill { display: inline-flex; align-items: center; height: 34px; margin-top: 22px; padding: 0 16px; border-radius: 999px; font-size: 13px; color: #fff; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.85); transition: background-color 0.25s ease; }
.ss-pill:hover { background: rgba(255, 255, 255, 0.14); }
.ss-copy > * { opacity: 0; transform: translateY(14px); transition: opacity 0.7s ease, transform 0.9s var(--dj-ease); }
.ss-slide.is-on .ss-copy > * { opacity: 1; transform: none; }
.ss-slide.is-on .ss-copy > :nth-child(2) { transition-delay: 0.08s; }
.ss-slide.is-on .ss-copy > :nth-child(3) { transition-delay: 0.16s; }

.ss-prod { position: relative; align-self: stretch; height: 100%; }
.ss-img, .ss-refl { position: absolute; left: 50%; width: min(100%, 760px); height: 70%; object-fit: contain; object-position: center bottom; transform: translateX(-50%); }
.ss-img { bottom: 35%; height: 54%; filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.35)) brightness(0.96) contrast(1.05); transition: transform 6s var(--dj-ease); }
.ss-slide.is-on .ss-img { transform: translateX(-50%) scale(1.03); }
.ss-shadow { position: absolute; left: 50%; top: 63%; width: min(86%, 640px); height: 26px; transform: translateX(-50%); background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0) 70%); filter: blur(6px); }
/* Отражение на глянцевом полу */
.ss-refl { top: 65%; height: 54%; transform: translateX(-50%) scaleY(-1); opacity: 0.22; filter: blur(1.5px) brightness(0.8); -webkit-mask-image: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, transparent 45%); mask-image: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, transparent 45%); }

.ss-arrow { position: absolute; top: 50%; width: 40px; height: 40px; margin-top: -20px; display: grid; place-items: center; color: #fff; opacity: 0.85; }
.ss-arrow svg { width: 22px; height: 22px; }
.ss-arrow--l { left: 8px; }
.ss-arrow--r { right: 8px; }
.ss-dots { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); display: flex; gap: 6px; }
.ss-dots button { width: 14px; height: 2px; padding: 6px 0; background-clip: content-box; background-color: rgba(255, 255, 255, 0.35); }
.ss-dots button.is-on { background-color: #fff; }

@media (max-width: 767px) {
  .ss { height: 520px; }
  .ss-banner { object-position: 68% 50%; }
  .ss-slide:has(.ss-banner)::after { background: linear-gradient(180deg, rgba(5, 12, 22, 0.6) 0%, rgba(5, 12, 22, 0) 45%); }
  .ss-in { grid-template-columns: 1fr; grid-template-rows: auto 1fr; align-items: start; padding: 40px 24px 0; }
  .ss-copy { padding: 0; transform: none; text-align: center; }
  .ss-tag { margin-left: auto; margin-right: auto; }
  .ss-slide { background:
    radial-gradient(90% 30% at 50% 72%, color-mix(in srgb, var(--glow) 70%, transparent) 0%, transparent 70%),
    linear-gradient(180deg, var(--sky) 0%, color-mix(in srgb, var(--sky) 55%, var(--glow)) 66%, var(--glow) 72%, var(--floor) 73%, color-mix(in srgb, var(--floor) 70%, #000) 100%); }
  .ss-arrow { display: none; }
}
@media (prefers-reduced-motion: reduce) { .ss-img { transition: none; } .ss-copy > * { transition: none; } }
</style>

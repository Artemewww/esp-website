<template>
  <!-- Промо-слайдер в подаче DJI Agras: широкий кинокадр во всю ширину,
       изделие справа на переднем плане, слева — название, одна строка и
       кнопка-обводка. Стрелки по краям, точки внизу, автопрокрутка 6 с. -->
  <section
    class="ps"
    aria-roledescription="carousel"
    aria-label="Оборудование ESP"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @focusin="hover = true"
    @focusout="hover = false"
    @touchstart.passive="ts"
    @touchend.passive="te"
  >
    <div
      v-for="(s, i) in slides"
      :key="s.slug"
      class="ps-slide"
      :class="[`ps-slide--${s.tone}`, { 'is-on': i === cur }]"
      role="group"
      aria-roledescription="slide"
      :aria-label="`${i + 1} из ${slides.length}: ${s.name}`"
      :aria-hidden="i !== cur"
    >
      <picture class="ps-pic">
        <source media="(max-width: 767px)" :srcset="`/images/equipment/promo/${s.slug}-m.webp`" width="960" height="1200" />
        <img
          :srcset="srcset(`/images/equipment/promo/${s.slug}.webp`)" sizes="(max-width: 734px) 100vw, 50vw" :src="`/images/equipment/promo/${s.slug}.webp`"
          :alt="s.name"
          width="2400"
          height="1050"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : 'low'"
          decoding="async"
        />
      </picture>
      <div class="ps-in">
        <div class="ps-copy">
          <component :is="i === 0 ? 'h2' : 'h3'" class="ps-name">{{ s.name }}</component>
          <p class="ps-tag">{{ s.tag }}</p>
          <NuxtLink :to="`/equipment/${s.slug}`" class="ps-btn" :tabindex="i === cur ? 0 : -1">Подробнее</NuxtLink>
        </div>
      </div>
    </div>

    <button type="button" class="ps-arrow ps-arrow--l" aria-label="Предыдущий слайд" @click="go(cur - 1)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
    <button type="button" class="ps-arrow ps-arrow--r" aria-label="Следующий слайд" @click="go(cur + 1)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
    </button>
    <div class="ps-dots" :class="`ps-dots--${slides[cur]?.tone}`">
      <button
        v-for="(s, i) in slides"
        :key="s.slug"
        type="button"
        :class="{ 'is-on': i === cur, 'is-run': i === cur && !hover }"
        :aria-label="`Слайд ${i + 1}: ${s.name}`"
        :aria-current="i === cur"
        @click="go(i)"
      ><i :style="{ animationDuration: `${DELAY}ms` }" /></button>
    </div>
  </section>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// items: позиции каталога (slug, name, desc); порядок и тон кадра задаёт PROMO
const props = defineProps({ items: { type: Array, required: true } })

// tone: dark — белый текст со скримом, light — тёмный текст
const PROMO = [
  { slug: 'flotation-units', tone: 'dark' },
  { slug: 'rotary-drum-sieve', tone: 'light' },
  { slug: 'filter-press', tone: 'dark' },
  { slug: 'microfilters-sand-traps', tone: 'light' },
  { slug: 'polymer-dosing-station', tone: 'light' }
]
const DELAY = 6000
const firstSentence = (t) => String(t || '').split(/(?<=[.!?])\s/)[0]

const slides = computed(() => PROMO.map((p) => {
  const e = props.items.find((x) => x.slug === p.slug)
  return e ? { ...p, name: e.name, tag: firstSentence(e.desc) } : null
}).filter(Boolean))

const cur = ref(0)
const hover = ref(false)
const go = (i) => { const n = slides.value.length; cur.value = ((i % n) + n) % n }

let t = null
const stop = () => { clearTimeout(t); t = null }
const arm = () => { stop(); if (!hover.value) t = setTimeout(() => go(cur.value + 1), DELAY) }
watch([cur, hover], arm)
onMounted(arm)
onBeforeUnmount(stop)

let x0 = null
const ts = (e) => { x0 = e.touches[0].clientX }
const te = (e) => {
  if (x0 == null) return
  const dx = e.changedTouches[0].clientX - x0
  if (Math.abs(dx) > 40) go(cur.value + (dx < 0 ? 1 : -1))
  x0 = null
}
</script>

<style scoped>
.ps { position: relative; width: 100%; height: clamp(480px, 76vh, 860px); overflow: hidden; background: #0b0f14; font-family: var(--dj-font); }
.ps-slide { position: absolute; inset: 0; opacity: 0; visibility: hidden; transition: opacity 0.9s ease, visibility 0s linear 0.9s; }
.ps-slide.is-on { opacity: 1; visibility: visible; transition: opacity 0.9s ease, visibility 0s; z-index: 1; }
.ps-pic, .ps-pic img { position: absolute; inset: 0; width: 100%; height: 100%; }
.ps-pic img { object-fit: cover; object-position: 72% 60%; transform: scale(1.06); transition: transform 7s cubic-bezier(0.2, 0.6, 0.2, 1); }
.ps-slide.is-on .ps-pic img { transform: scale(1); }

/* Скрим под текст: слева, мягкий */
.ps-slide::after { content: ""; position: absolute; inset: 0; pointer-events: none; }
.ps-slide--dark::after { background: linear-gradient(90deg, rgba(5, 10, 20, 0.55) 0%, rgba(5, 10, 20, 0.25) 32%, rgba(5, 10, 20, 0) 55%); }
.ps-slide--light::after { background: linear-gradient(90deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.2) 34%, rgba(255, 255, 255, 0) 56%); }

.ps-in { position: relative; z-index: 2; height: 100%; max-width: 1280px; margin: 0 auto; padding: 0 clamp(64px, 7vw, 96px); display: flex; align-items: center; }
.ps-copy { max-width: min(440px, 32vw); }
.ps-name { margin: 0; font-size: clamp(34px, 3.6vw, 56px); line-height: 1.08; font-weight: 600; letter-spacing: -0.02em; text-wrap: balance; }
.ps-tag { margin: 14px 0 0; font-size: clamp(16px, 1.25vw, 19px); line-height: 1.45; opacity: 0.9; text-wrap: pretty; }
.ps-btn { display: inline-flex; align-items: center; margin-top: 28px; height: 44px; padding: 0 26px; border: 1.5px solid currentColor; border-radius: 999px; font-size: 15px; font-weight: 500; color: inherit; text-decoration: none; transition: background 0.25s, color 0.25s; }
.ps-slide--dark .ps-copy { color: #fff; text-shadow: 0 1px 18px rgba(0, 0, 0, 0.25); }
.ps-slide--light .ps-copy { color: #0d1626; }
.ps-slide--dark .ps-btn:hover { background: #fff; color: #0d1626; text-shadow: none; }
.ps-slide--light .ps-btn:hover { background: #002366; border-color: #002366; color: #fff; }
.ps-btn:focus-visible, .ps-arrow:focus-visible, .ps-dots button:focus-visible { outline: 2px solid #0a3a8c; outline-offset: 3px; }

.ps-slide.is-on .ps-copy > * { animation: ps-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
.ps-slide.is-on .ps-tag { animation-delay: 0.08s; }
.ps-slide.is-on .ps-btn { animation-delay: 0.16s; }
@keyframes ps-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }

.ps-arrow { position: absolute; z-index: 3; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; display: grid; place-items: center; border: 0; border-radius: 50%; background: rgba(255, 255, 255, 0.16); color: #fff; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); cursor: pointer; opacity: 0; transition: opacity 0.3s, background 0.25s; }
.ps:hover .ps-arrow, .ps-arrow:focus-visible { opacity: 1; }
.ps-arrow:hover { background: rgba(255, 255, 255, 0.32); }
.ps-arrow svg { width: 22px; height: 22px; }
.ps-arrow--l { left: clamp(12px, 2vw, 28px); }
.ps-arrow--r { right: clamp(12px, 2vw, 28px); }

.ps-dots { position: absolute; z-index: 3; left: 0; right: 0; bottom: clamp(18px, 3vh, 32px); display: flex; justify-content: center; gap: 8px; }
.ps-dots button { position: relative; width: 8px; height: 8px; padding: 0; border: 0; border-radius: 999px; background: rgba(255, 255, 255, 0.45); overflow: hidden; cursor: pointer; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s; }
.ps-dots--light button { background: rgba(13, 22, 38, 0.22); }
.ps-dots button.is-on { width: 36px; }
.ps-dots button i { position: absolute; inset: 0; transform-origin: left; transform: scaleX(0); background: #fff; border-radius: inherit; }
.ps-dots--light button i { background: #0d1626; }
.ps-dots button.is-on i { transform: scaleX(1); }
.ps-dots button.is-run i { animation: ps-fill linear both; }
@keyframes ps-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }

@media (max-width: 767px) {
  .ps { height: auto; aspect-ratio: 4 / 5; }
  .ps-pic img { object-position: center; }
  .ps-slide--dark::after { background: linear-gradient(180deg, rgba(5, 10, 20, 0.55) 0%, rgba(5, 10, 20, 0.2) 34%, rgba(5, 10, 20, 0) 50%); }
  .ps-slide--light::after { background: linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.3) 34%, rgba(255, 255, 255, 0) 50%); }
  .ps-in { align-items: flex-start; padding: 32px 20px 0; }
  .ps-copy { max-width: 100%; }
  .ps-name { font-size: 30px; }
  .ps-tag { margin-top: 8px; font-size: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ps-btn { margin-top: 16px; height: 40px; padding: 0 22px; font-size: 14px; }
  .ps-arrow { display: none; }
  .ps-dots button { background: rgba(255, 255, 255, 0.55); }
  .ps-dots--light button { background: rgba(255, 255, 255, 0.55); }
  .ps-dots--light button i { background: #fff; }
}
@media (hover: none) { .ps-arrow { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .ps-slide, .ps-pic img, .ps-dots button { transition: none; }
  .ps-pic img { transform: none; }
  .ps-slide.is-on .ps-copy > *, .ps-dots button.is-run i { animation: none; }
}
</style>

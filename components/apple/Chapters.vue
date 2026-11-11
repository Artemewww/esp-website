<template>
  <!-- Раздел с липким медиа, как на apple.com: кадр стоит на месте,
       справа прокручиваются главы, кадр и подпись меняются вслед за ними. -->
  <div class="ch" :class="{ 'ch--dark': dark, 'ch--single': !hasOwn }">
    <div class="ch-media" aria-hidden="true">
      <div class="ch-frame">
        <template v-if="hasOwn">
          <img
            v-for="(it, i) in items"
            :key="i"
            :src="it.image"
            alt=""
            :class="{ 'is-on': i === cur }"
            loading="lazy"
            decoding="async"
          />
        </template>
        <template v-else>
          <video v-if="video && motionOk" :src="video" :poster="image" muted loop playsinline autoplay preload="none" />
          <img v-else :src="image" alt="" class="is-on" loading="lazy" decoding="async" />
        </template>
        <span :key="cur" class="ch-cap">
          <b>{{ items[cur]?.kicker || String(cur + 1).padStart(2, '0') }}</b>
          {{ items[cur]?.chip || items[cur]?.title }}
        </span>
        <span class="ch-prog"><i v-for="(it, i) in items" :key="i" :class="{ 'is-on': i === cur }" /></span>
      </div>
    </div>

    <ol class="ch-list">
      <li v-for="(it, i) in items" :key="i" ref="steps" class="ch-step" :class="{ 'is-on': i === cur }" :data-i="i">
        <img v-if="it.image" class="ch-mimg" :src="it.image" :alt="it.title" loading="lazy" decoding="async" />
        <span class="ch-kicker">{{ it.kicker || String(i + 1).padStart(2, '0') }}</span>
        <h3 class="ch-title">{{ it.title }}</h3>
        <p class="ch-text">{{ it.text }}</p>
        <span v-if="it.chip" class="ch-chip">{{ it.chip }}</span>
        <NuxtLink v-if="it.to" :to="it.to" class="ch-more">{{ it.linkLabel || 'Подробнее' }}</NuxtLink>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  image: { type: String, default: '' },
  video: { type: String, default: '' },
  dark: { type: Boolean, default: false }
})

const hasOwn = computed(() => props.items.every((it) => it.image))
const cur = ref(0)
const steps = ref([])
const motionOk = ref(false)
let io = null

onMounted(() => {
  motionOk.value = !matchMedia('(prefers-reduced-motion: reduce)').matches
  io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) cur.value = +e.target.dataset.i })
  }, { rootMargin: '-45% 0px -45% 0px' })
  steps.value.forEach((s) => io.observe(s))
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
.ch { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); gap: clamp(32px, 5vw, 80px); width: min(1260px, 87.5vw); margin: 0 auto; font-family: var(--dj-font); }
.ch-media { position: relative; }
.ch-frame { position: sticky; top: calc(var(--dj-header-h, 56px) + 52px + 32px); height: min(calc(100vh - 56px - 52px - 64px), 760px); overflow: hidden; border-radius: var(--r-lg); background: #1A1A1A; isolation: isolate; }
.ch-frame img, .ch-frame video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ch-frame img { opacity: 0; transform: scale(1.05); transition: opacity 0.8s ease, transform 1.6s cubic-bezier(0.16, 1, 0.3, 1); }
.ch-frame img.is-on { opacity: 1; transform: none; }
.ch-frame::after { content: ''; position: absolute; inset: auto 0 0; height: 75%; background: var(--scrim-b); pointer-events: none; }
.ch-cap { position: absolute; z-index: 1; left: 28px; right: 80px; bottom: 26px; font-size: clamp(17px, 1.5vw, 21px); line-height: 1.24; letter-spacing: 0.011em; color: var(--on-photo-muted); text-shadow: var(--on-photo-shadow); animation: ch-cap 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
.ch-cap b { display: block; margin-bottom: 4px; font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #EDEDED; opacity: 0.72; }
.ch-prog { position: absolute; z-index: 1; right: 28px; bottom: 30px; display: flex; flex-direction: column; gap: 6px; }
.ch-prog i { width: 6px; height: 6px; border-radius: 3px; background: rgba(255, 255, 255, 0.4); transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease; }
.ch-prog i.is-on { height: 22px; background: #fff; }
@keyframes ch-cap { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

.ch-list { margin: 0; padding: 0; list-style: none; }
.ch-step { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; min-height: 72vh; padding: 40px 0; opacity: 0.32; transition: opacity 0.6s ease; }
.ch-step:first-child { min-height: 60vh; justify-content: flex-start; padding-top: 18vh; }
.ch-step.is-on { opacity: 1; }
.ch-mimg { display: none; }
.ch-kicker { font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #5E5E5E; font-variant-numeric: tabular-nums; }
.ch-title { margin: 8px 0 0; font-size: clamp(24px, 2.4vw, 32px); line-height: 1.125; font-weight: 600; letter-spacing: 0.004em; color: #1A1A1A; text-wrap: balance; }
.ch-text { margin: 14px 0 0; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.ch-chip { margin-top: 18px; font-size: clamp(24px, 2.4vw, 32px); line-height: 1.125; font-weight: 600; letter-spacing: 0.004em; background: linear-gradient(90deg, #002366 0%, #002366 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ch-more { display: inline-flex; gap: 4px; margin-top: 18px; font-size: 17px; letter-spacing: -0.022em; color: #002366; }
.ch-more::after { content: '›'; font-size: 1.15em; line-height: 1; }
.ch-more:hover { text-decoration: underline; }

.ch--dark .ch-title { color: #EDEDED; }
.ch--dark .ch-text, .ch--dark .ch-kicker { color: #8A8A8A; }
.ch--dark .ch-chip { background-image: linear-gradient(90deg, #6fb1ff 0%, #c7e0ff 100%); }
.ch--dark .ch-more { color: #FFFFFF; }

@media (max-width: 833px) {
  .ch { grid-template-columns: 1fr; gap: 0; }
  .ch-media { display: none; }
  .ch--single .ch-media { display: block; margin-bottom: 40px; }
  .ch--single .ch-frame { position: relative; top: 0; height: 72vw; max-height: 480px; border-radius: var(--r-md); }
  .ch--single .ch-cap, .ch--single .ch-prog { display: none; }
  .ch-step, .ch-step:first-child { min-height: 0; padding: 0 0 56px; opacity: 1; justify-content: flex-start; }
  .ch-mimg { display: block; width: 100%; aspect-ratio: 4 / 3; margin-bottom: 22px; border-radius: var(--r-md); object-fit: cover; background: #1A1A1A; }
}
@media (prefers-reduced-motion: reduce) {
  .ch-frame img, .ch-step, .ch-prog i { transition: none; }
  .ch-cap { animation: none; }
}
</style>

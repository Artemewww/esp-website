<template>
  <!-- Загрузка как у jazakvoda: кадр объекта под синей вуалью, счётчик
       процентов и знак ESP, который наполняется водой по мере загрузки. -->
  <div class="ld" :class="{ 'is-out': out }" role="status" :aria-label="`Загрузка ${pct}%`">
    <img class="ld-bg" :class="{ 'is-bright': bright }" :src="bg" alt="" />
    <div class="ld-in">
      <span class="ld-pct"><b>{{ pct }}</b>%</span>
      <div class="ld-logo" aria-hidden="true">
        <span class="ld-logo__base" />
        <span class="ld-logo__fill">
          <i class="ld-water" :style="{ transform: `translateY(${100 - pct}%)` }"><i class="ld-wave" /></i>
        </span>
      </div>
      <span class="ld-cap">{{ caption }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  assets: { type: Array, default: () => [] },
  minTime: { type: Number, default: 1800 },
  bg: { type: String, default: '/images/about-story/aerial-sm.webp' },
  caption: { type: String, default: '28 лет опыта' },
  // Яркая вода без синей вуали — как загрузка jazakvoda
  bright: { type: Boolean, default: false }
})
const emit = defineEmits(['done'])

const pct = ref(0)
const out = ref(false)
let raf = 0

onMounted(() => {
  const t0 = performance.now()
  let loaded = 0
  const total = Math.max(props.assets.length, 1)
  props.assets.forEach((src) => {
    const img = new Image()
    img.onload = img.onerror = () => { loaded++ }
    img.src = src
  })
  // Счётчик догоняет реальную загрузку, но не быстрее minTime —
  // иначе на быстром интернете вода не успевает «налиться».
  let shown = 0
  const tick = (now) => {
    const real = props.assets.length ? loaded / total : 1
    const timeCap = Math.min(1, (now - t0) / props.minTime)
    const target = Math.min(real, timeCap) * 100
    shown += (target - shown) * 0.08
    if (target >= 100 && shown > 99.4) shown = 100
    pct.value = Math.round(shown)
    if (pct.value < 100) raf = requestAnimationFrame(tick)
    else setTimeout(() => { out.value = true; setTimeout(() => emit('done'), 900) }, 350)
  }
  raf = requestAnimationFrame(tick)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<style scoped>
.ld { position: fixed; inset: 0; z-index: 120; display: grid; place-items: center; background: #002366; color: #fff; transition: opacity 0.9s ease, visibility 0.9s; }
.ld.is-out { opacity: 0; visibility: hidden; }
.ld-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.28; mix-blend-mode: luminosity; transform: scale(1.08); animation: ld-drift 14s ease-in-out infinite alternate; }
.ld-bg.is-bright { opacity: 0.9; mix-blend-mode: normal; filter: saturate(1.15) brightness(0.72); }
.ld-in { position: relative; display: grid; justify-items: center; gap: 1.1rem; }
.ld-pct { font-family: var(--font-display); font-size: 15px; font-weight: 600; letter-spacing: 0.08em; color: #8fc1ff; }
.ld-pct b { font-weight: 700; }
.ld-logo { position: relative; width: clamp(190px, 22vw, 280px); aspect-ratio: 120 / 61; }
.ld-logo__base, .ld-logo__fill {
  position: absolute; inset: 0;
  -webkit-mask: url(/logo-esp.svg) center / contain no-repeat;
  mask: url(/logo-esp.svg) center / contain no-repeat;
}
.ld-logo__base { background: rgba(255, 255, 255, 0.16); }
.ld-logo__fill { overflow: hidden; }
.ld-water { position: absolute; inset: 0; background: #fff; transition: transform 0.25s linear; }
/* Гребень волны над водой */
.ld-wave {
  position: absolute; left: 0; bottom: 100%; width: 200%; height: 14px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 14'%3E%3Cpath d='M0 7c15 0 15-6 30-6s15 6 30 6 15-6 30-6 15 6 30 6v7H0z' fill='%23fff'/%3E%3C/svg%3E") 0 100% / 50% 100% repeat-x;
  animation: ld-wave 1.6s linear infinite;
}
.ld-cap { font-size: 11px; font-weight: 600; letter-spacing: 0.32em; text-transform: uppercase; color: rgba(255, 255, 255, 0.6); }
@keyframes ld-wave { to { transform: translateX(-50%); } }
@keyframes ld-drift { to { transform: scale(1.16) translate(-1.5%, -1%); } }
@media (prefers-reduced-motion: reduce) { .ld-bg, .ld-wave { animation: none; } }
</style>

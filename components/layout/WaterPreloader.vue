<template>
  <!-- Прелоадер: контур знака ESP наполняется водой снизу вверх, поверхность
       колышется двумя волнами. Уходит, когда страница загрузилась и вода
       дошла до верха; показывается один раз за визит. -->
  <Transition name="wp">
    <div v-if="visible" class="wp" role="status" aria-label="Загрузка сайта ESP">
      <svg class="wp-logo" viewBox="0 0 120 61" aria-hidden="true">
        <defs>
          <clipPath id="wp-clip">
            <path v-for="(d, i) in LOGO_PATHS" :key="i" :d="d" />
          </clipPath>
          <linearGradient id="wp-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#3f8fe0" />
            <stop offset="1" stop-color="#002366" />
          </linearGradient>
        </defs>
        <g clip-path="url(#wp-clip)">
          <rect x="0" y="0" width="120" height="61" fill="#e8edf3" />
          <g :style="{ transform: `translateY(${level}px)` }" class="wp-water">
            <path class="wp-wave wp-wave--back" :d="wave" fill="#7fb2e8" />
            <path class="wp-wave" :d="wave" fill="url(#wp-water)" />
          </g>
        </g>
      </svg>
      <span class="wp-pct">{{ Math.round(progress * 100) }}%</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { LOGO_PATHS } from './logoPaths'

const visible = useState('preloader-visible', () => true)
// До первой отрисовки: если заставку в этом визите уже видели, прячем её
// классом на <html>, чтобы при повторных переходах не мигал белый экран.
useHead({
  script: [{
    key: 'wp-seen',
    innerHTML: "try{if(sessionStorage.getItem('esp-preloader')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('wp-seen')}catch(e){}",
    tagPosition: 'head'
  }]
})
const progress = ref(0)
// Вода стартует ниже знака (y=64) и поднимается выше верха (y=-6)
const level = computed(() => 64 - progress.value * 70)
// Волна шире знака вдвое, чтобы её можно было бесшовно сдвигать по X
const wave = (() => {
  let d = 'M-120 4'
  for (let x = -120; x < 240; x += 30) d += ` Q${x + 7.5} 0 ${x + 15} 4 T${x + 30} 4`
  return d + ' V80 H-120 Z'
})()

let raf = 0
let target = 0.18
let done = false
const t0 = performance.now ? performance.now() : 0
const MIN_MS = 1400

// Один шаг анимации; true — заставка закончилась
const step = () => {
  // Плавно догоняем цель; до загрузки страницы цель растёт не выше 0.88
  const elapsed = performance.now() - t0
  target = done ? 1 : Math.min(0.88, 0.18 + elapsed / 2600)
  progress.value += (target - progress.value) * (done ? 0.09 : 0.05)
  if (done && progress.value > 0.995 && elapsed > MIN_MS) {
    progress.value = 1
    setTimeout(() => { visible.value = false; document.documentElement.classList.remove('wp-lock') }, 260)
    return true
  }
  return false
}
let ended = false
const tick = () => { if (ended) return; ended = step(); if (!ended) raf = requestAnimationFrame(tick) }
let bgTimer = null

onMounted(() => {
  let seen = false
  try { seen = sessionStorage.getItem('esp-preloader') === '1' } catch (e) {}
  if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { visible.value = false; return }
  // Фоновая вкладка не крутит requestAnimationFrame — догоняем по таймеру
  bgTimer = setInterval(() => { if (ended) return clearInterval(bgTimer); if (document.hidden) ended = step() }, 120)
  try { sessionStorage.setItem('esp-preloader', '1') } catch (e) {}
  document.documentElement.classList.add('wp-lock')
  const finish = () => { done = true }
  if (document.readyState === 'complete') finish()
  else window.addEventListener('load', finish, { once: true })
  // Страховка от зависшего ресурса
  setTimeout(finish, 6000)
  raf = requestAnimationFrame(tick)
})
onBeforeUnmount(() => { cancelAnimationFrame(raf); clearInterval(bgTimer); document.documentElement.classList.remove('wp-lock') })
</script>

<style scoped>
.wp { position: fixed; inset: 0; z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; background: #fff; }
.wp-logo { width: min(220px, 52vw); height: auto; overflow: visible; }
.wp-water { transition: none; }
.wp-wave { animation: wp-flow 2.2s linear infinite; }
.wp-wave--back { opacity: 0.6; animation-duration: 3.4s; animation-direction: reverse; }
@keyframes wp-flow { from { transform: translateX(0); } to { transform: translateX(30px); } }
.wp-pct { font-family: var(--dj-font-display); font-size: 12px; letter-spacing: 0.08em; color: #6c7073; font-variant-numeric: tabular-nums; }
.wp-leave-active { transition: opacity 0.6s ease, transform 0.8s var(--dj-ease); }
.wp-leave-to { opacity: 0; transform: scale(1.02); }
</style>

<style>
html.wp-lock { overflow: hidden; }
html.wp-seen .wp { display: none; }
</style>

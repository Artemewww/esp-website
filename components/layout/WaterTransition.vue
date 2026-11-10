<template>
  <!-- Переход между страницами: вода поднимается снизу волной и закрывает
       экран, знак ESP наполняется, страница меняется, и вода уходит вверх.
       Механика как у gebfield.com (две панели «занавеса»), только край —
       живая волна, а вместо колец горизонта — круги на воде. -->
  <div class="wt" :class="`wt--${phase}`" aria-hidden="true">
    <div class="wt-panel wt-back">
      <svg class="wt-wave wt-wave--top" viewBox="0 0 1440 80" preserveAspectRatio="none"><path :d="WAVE" /></svg>
      <svg class="wt-wave wt-wave--bottom" viewBox="0 0 1440 80" preserveAspectRatio="none"><path :d="WAVE" /></svg>
    </div>
    <div class="wt-panel wt-front">
      <svg class="wt-wave wt-wave--top" viewBox="0 0 1440 80" preserveAspectRatio="none"><path :d="WAVE" /></svg>
      <svg class="wt-wave wt-wave--bottom" viewBox="0 0 1440 80" preserveAspectRatio="none"><path :d="WAVE" /></svg>
      <span class="wt-ripples"><i /><i /><i /></span>
      <svg class="wt-logo" viewBox="0 0 120 61">
        <defs>
          <clipPath id="wt-clip"><path v-for="(d, i) in LOGO_PATHS" :key="i" :d="d" /></clipPath>
        </defs>
        <g clip-path="url(#wt-clip)">
          <rect width="120" height="61" fill="rgba(255,255,255,0.22)" />
          <rect class="wt-fill" y="0" width="120" height="61" fill="#fff" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { LOGO_PATHS } from './logoPaths'

// Волна шире экрана вдвое, чтобы её можно было бесшовно гнать по X
const WAVE = (() => {
  let d = 'M0 40'
  for (let x = 0; x < 2880; x += 360) d += ` C${x + 90} 8 ${x + 270} 72 ${x + 360} 40`
  return d + ' V80 H0 Z'
})()

const phase = ref('idle')
const COVER_MS = 680
const UNCOVER_MS = 900
let reduced = false
let removeGuard = null
let unhook = null
let waitingFinish = null

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const router = useRouter()
  const nuxtApp = useNuxtApp()

  removeGuard = router.beforeEach(async (to, from) => {
    // Якоря и переходы в админку — без занавеса
    if (reduced || to.path === from.path || to.path.startsWith('/admin') || from.path.startsWith('/admin')) return true
    phase.value = 'cover'
    await sleep(COVER_MS)
    phase.value = 'covered'
    // Страховка: если страница не сообщила о готовности, вода всё равно уходит
    clearTimeout(waitingFinish)
    waitingFinish = setTimeout(async () => {
      if (phase.value !== 'covered') return
      phase.value = 'uncover'
      await sleep(UNCOVER_MS)
      phase.value = 'idle'
    }, 2600)
    return true
  })

  unhook = nuxtApp.hook('page:finish', async () => {
    if (phase.value !== 'covered') return
    clearTimeout(waitingFinish)
    await sleep(120)
    phase.value = 'uncover'
    await sleep(UNCOVER_MS)
    phase.value = 'idle'
  })
})

onBeforeUnmount(() => { removeGuard?.(); unhook?.(); clearTimeout(waitingFinish) })
</script>

<style scoped>
.wt { position: fixed; inset: 0; z-index: 150; pointer-events: none; overflow: hidden; visibility: hidden; }
.wt:not(.wt--idle) { visibility: visible; pointer-events: auto; }

.wt-panel { position: absolute; inset: 0; transform: translateY(112%); will-change: transform; }
.wt-back { background: linear-gradient(180deg, #6fb3e6 0%, #2f78c4 100%); }
.wt-front { display: grid; place-items: center; background: radial-gradient(120% 90% at 70% 100%, #0d4f9a 0%, #062a5e 55%, #031737 100%); }

/* Край воды: волна сверху при подъёме и снизу при уходе */
.wt-wave { position: absolute; left: 0; width: 200%; height: 9vh; min-height: 48px; animation: wt-flow 2.4s linear infinite; }
.wt-wave--top { bottom: 100%; margin-bottom: -1px; }
.wt-wave--bottom { top: 100%; margin-top: -1px; transform: scaleY(-1); animation-direction: reverse; }
.wt-back .wt-wave path { fill: #6fb3e6; }
.wt-back .wt-wave--bottom path { fill: #2f78c4; }
.wt-front .wt-wave path { fill: #0b4a93; }
.wt-front .wt-wave--bottom path { fill: #031737; }
.wt-front .wt-wave--top { animation-duration: 1.9s; }
@keyframes wt-flow { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.wt-wave--bottom { animation-name: wt-flow-b; }
@keyframes wt-flow-b { from { transform: scaleY(-1) translateX(0); } to { transform: scaleY(-1) translateX(-50%); } }

/* Круги на воде под знаком */
.wt-ripples { position: absolute; left: 50%; bottom: -46vw; width: 140vw; height: 70vw; transform: translateX(-50%); }
.wt-ripples i { position: absolute; inset: 0; border-radius: 50%; border: 1px solid rgba(159, 211, 255, 0.28); opacity: 0; }
.wt-ripples i:nth-child(2) { inset: -6vw; border-color: rgba(159, 211, 255, 0.16); }
.wt-ripples i:nth-child(3) { inset: -13vw; border-color: rgba(159, 211, 255, 0.08); }

.wt-logo { position: relative; width: clamp(150px, 18vw, 260px); height: auto; opacity: 0; transform: translateY(24px); }
.wt-fill { transform: translateY(61px); }

/* Подъём: задняя волна, за ней передняя с задержкой */
.wt--cover .wt-back, .wt--covered .wt-back { animation: wt-cover 0.62s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
.wt--cover .wt-front, .wt--covered .wt-front { animation: wt-cover 0.62s 0.07s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
.wt--cover .wt-logo, .wt--covered .wt-logo { animation: wt-logo-in 0.45s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.wt--cover .wt-fill, .wt--covered .wt-fill { animation: wt-fill 0.9s 0.3s cubic-bezier(0.33, 1, 0.68, 1) forwards; }
.wt--cover .wt-ripples i, .wt--covered .wt-ripples i { animation: wt-ripple 1.6s 0.35s ease-out infinite; }
.wt--covered .wt-ripples i:nth-child(2) { animation-delay: 0.6s; }
.wt--covered .wt-ripples i:nth-child(3) { animation-delay: 0.85s; }

/* Уход вверх: передняя первой, волна остаётся снизу */
.wt--uncover .wt-front { transform: translateY(0); animation: wt-uncover 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
.wt--uncover .wt-back { transform: translateY(0); animation: wt-uncover 0.86s 0.06s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
.wt--uncover .wt-logo { opacity: 1; transform: none; animation: wt-logo-out 0.38s forwards; }
.wt--uncover .wt-fill { transform: none; }

@keyframes wt-cover { from { transform: translateY(112%); } to { transform: translateY(0); } }
@keyframes wt-uncover { from { transform: translateY(0); } to { transform: translateY(-115%); } }
@keyframes wt-logo-in { to { opacity: 1; transform: none; } }
@keyframes wt-logo-out { to { opacity: 0; transform: translateY(-28px); } }
@keyframes wt-fill { to { transform: translateY(0); } }
@keyframes wt-ripple { 0% { opacity: 0; transform: scale(0.92); } 30% { opacity: 1; } 100% { opacity: 0; transform: scale(1.08); } }

@media (max-width: 767px) {
  .wt-ripples { width: 220vw; height: 110vw; bottom: -80vw; }
}
@media (prefers-reduced-motion: reduce) { .wt { display: none; } }
</style>

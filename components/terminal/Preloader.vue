<template>
  <!-- Заставка как у Terminal: светлый экран, тонкая линия прорисовывает знак,
       счётчик в углу, затем экран уезжает вверх. Один раз за визит. -->
  <Transition name="tp">
    <div v-if="show" class="tp" aria-hidden="true">
      <svg class="tp-mark" :viewBox="ESP_LOGO_VIEWBOX" fill="none">
        <path
          v-for="(d, i) in ESP_LOGO_PATHS"
          :key="i"
          :d="d"
          class="tp-path"
          pathLength="1"
          :style="{ strokeDashoffset: 1 - progress }"
        />
      </svg>
      <span class="tp-count t-label">{{ String(Math.round(progress * 100)).padStart(3, '0') }}</span>
      <span class="tp-name t-label">ЭкоСервисПроект</span>
      <svg class="tp-curve" viewBox="0 0 400 300" preserveAspectRatio="none">
        <path d="M400 40 C 330 60, 300 150, 320 180 S 380 240, 400 260" pathLength="1" :style="{ strokeDashoffset: 1 - progress }" />
      </svg>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ESP_LOGO_PATHS, ESP_LOGO_VIEWBOX } from '~/components/ui/espLogoPaths'

const show = ref(true)
const progress = ref(0)

onMounted(() => {
  let seen = false
  try { seen = sessionStorage.getItem('esp-intro') === '1' } catch (e) {}
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (seen || reduced) { show.value = false; return }
  try { sessionStorage.setItem('esp-intro', '1') } catch (e) {}
  // Счётчик идёт по времени, а не по загрузке: заставка не держит сайт дольше 1,2 с
  const DUR = 1100
  const t0 = performance.now()
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / DUR)
    progress.value = 1 - Math.pow(1 - k, 3)
    if (k < 1) requestAnimationFrame(tick)
    else setTimeout(() => { show.value = false }, 120)
  }
  requestAnimationFrame(tick)
})
</script>

<style scoped>
.tp {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  background: var(--t-paper, #ededed);
  /* Заставка приходит уже в HTML, чтобы не мигала страница; если скрипт не
     запустится, она всё равно уйдёт сама через 3 секунды */
  animation: tp-fallback 0.4s ease 3s forwards;
}
@keyframes tp-fallback { to { opacity: 0; visibility: hidden; } }
.tp-mark { width: min(220px, 46vw); height: auto; overflow: visible; }
.tp-path {
  stroke: var(--t-ink, #071a3a);
  stroke-width: 0.45;
  stroke-dasharray: 1;
  vector-effect: non-scaling-stroke;
}
.tp-count { position: absolute; left: 1.5rem; bottom: 1.5rem; color: var(--t-ink, #071a3a); }
.tp-name { position: absolute; right: 1.5rem; bottom: 1.5rem; }
.tp-curve { position: absolute; right: 0; top: 18%; width: 22vw; height: 40vh; }
.tp-curve path {
  fill: none;
  stroke: rgba(7, 26, 58, 0.18);
  stroke-width: 1;
  stroke-dasharray: 1;
  vector-effect: non-scaling-stroke;
}
.tp-leave-active { transition: transform 0.7s cubic-bezier(0.76, 0, 0.24, 1); }
.tp-leave-to { transform: translateY(-100%); }
</style>

<template>
  <!-- Карта Беларуси из точек: сетка внутри контура + реальные объекты ESP из реестра -->
  <svg class="bdm" :viewBox="`0 0 ${VW} ${VH}`" aria-hidden="true" focusable="false">
    <g class="bdm__grid">
      <circle v-for="(d, i) in grid" :key="i" :cx="d[0]" :cy="d[1]" r="2.3" />
    </g>
    <g class="bdm__obj">
      <circle v-for="(d, i) in objects" :key="i" :cx="d[0]" :cy="d[1]" :r="d[2]" :style="{ animationDelay: `${d[3]}s` }" />
    </g>
  </svg>
</template>

<script setup>
import { projectRegistry } from '~/composables/useProjectRegistry'
import { projectGeo } from '~/composables/useProjectGeo'

// Упрощённый контур Беларуси (lng, lat), Natural Earth 1:110m — вшит, без внешних запросов
const BY = [
  [23.48, 53.91], [24.45, 53.91], [25.54, 54.28], [25.77, 54.85], [26.59, 55.17], [26.49, 55.62],
  [27.10, 55.78], [28.18, 56.17], [29.23, 55.92], [29.37, 55.67], [29.90, 55.79], [30.87, 55.55],
  [30.97, 55.08], [30.76, 54.81], [31.38, 54.16], [31.79, 53.97], [31.73, 53.79], [32.41, 53.62],
  [32.69, 53.35], [32.30, 53.13], [31.50, 52.74], [31.79, 52.10], [30.93, 52.04], [30.62, 51.82],
  [30.56, 51.32], [30.16, 51.42], [29.25, 51.37], [28.99, 51.60], [28.62, 51.43], [28.24, 51.57],
  [27.45, 51.59], [26.34, 51.83], [25.33, 51.91], [24.55, 51.89], [24.01, 51.62], [23.53, 51.58],
  [23.51, 52.02], [23.20, 52.49], [23.80, 53.09], [23.53, 53.47]
]
const LNG0 = 23.05, LAT0 = 56.3, K = 100, COS = Math.cos(53.7 * Math.PI / 180)
const px = (lng, lat) => [(lng - LNG0) * COS * K, (LAT0 - lat) * K]
const poly = BY.map(([a, b]) => px(a, b))
const VW = Math.ceil((32.8 - LNG0) * COS * K)
const VH = Math.ceil((LAT0 - 51.2) * K)

const inside = (x, y) => {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

const STEP = 11
const grid = []
for (let y = STEP / 2; y < VH; y += STEP) {
  for (let x = STEP / 2; x < VW; x += STEP) if (inside(x, y)) grid.push([+x.toFixed(1), +y.toFixed(1)])
}

// Объекты: реестр (240) + флагманы; точки снапим к сетке, чтобы карта оставалась «пиксельной»
const seen = new Set()
const objects = []
const add = (lng, lat, big) => {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return
  const [x, y] = px(lng, lat)
  const gx = Math.round((x - STEP / 2) / STEP) * STEP + STEP / 2
  const gy = Math.round((y - STEP / 2) / STEP) * STEP + STEP / 2
  const key = `${gx}:${gy}`
  if (seen.has(key)) { if (big) objects.find(o => o[4] === key)[2] = 4.6; return }
  seen.add(key)
  objects.push([+gx.toFixed(1), +gy.toFixed(1), big ? 4.6 : 3.2, +((objects.length * 0.37) % 4).toFixed(2), key])
}
projectRegistry.forEach(p => add(+p.lng, +p.lat, false))
Object.values(projectGeo).forEach(([lng, lat]) => add(lng, lat, true))
</script>

<style scoped>
.bdm { display: block; width: 100%; height: auto; overflow: visible; }
.bdm__grid circle { fill: #7fb2ff; opacity: 0.22; }
.bdm__obj circle { fill: #cfe2ff; filter: drop-shadow(0 0 4px rgba(127, 178, 255, 0.9)); animation: bdm-tw 4s ease-in-out infinite both; }
@keyframes bdm-tw {
  0%, 100% { opacity: 0.95; }
  50% { opacity: 0.35; }
}
@media (prefers-reduced-motion: reduce) {
  .bdm__obj circle { animation: none; opacity: 0.9; }
}
</style>

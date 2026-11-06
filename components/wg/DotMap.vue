<template>
  <!-- Точечная карта вместо глобуса Watergen: каждая точка — объект ESP из
       реестра по его координатам; карта медленно покачивается в наклоне. -->
  <canvas ref="cv" class="dm" role="img" :aria-label="`Карта объектов ESP: ${points.length} точек`"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({ points: { type: Array, required: true } })
const cv = ref(null)
let raf = 0
let io = null
let visible = false

onMounted(() => {
  const el = cv.value
  const ctx = el.getContext('2d')
  const pts = props.points.filter((p) => p.lat && p.lng)
  if (!pts.length) return
  const lat0 = pts.reduce((s, p) => s + p.lat, 0) / pts.length
  const lng0 = pts.reduce((s, p) => s + p.lng, 0) / pts.length
  const k = Math.cos((lat0 * Math.PI) / 180)
  const xy = pts.map((p) => [(p.lng - lng0) * k, p.lat - lat0])
  // Радиус по 95-му процентилю: единичные дальние объекты не сжимают карту
  const dists = xy.map(([x, y]) => Math.hypot(x, y)).sort((a, b) => a - b)
  const R = dists[Math.floor(dists.length * 0.95)] || 1
  // Фоновая россыпь мелких точек по эллипсу — «поверхность», на которой стоят объекты
  const field = []
  for (let gy = -1; gy <= 1; gy += 0.045) for (let gx = -1.2; gx <= 1.2; gx += 0.045) if ((gx / 1.2) ** 2 + gy * gy < 1) field.push([gx * R, gy * R * 0.85])
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const draw = (time) => {
    raf = 0
    const W = el.clientWidth; const H = el.clientHeight
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    if (el.width !== Math.round(W * dpr)) { el.width = Math.round(W * dpr); el.height = Math.round(H * dpr) }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    const t = reduced ? 0 : time * 0.00018
    const yaw = Math.sin(t) * 0.35
    const tilt = 0.95
    const s = (Math.min(W * 0.45, H * 0.62)) / R
    const proj = ([x, y], z = 0) => {
      const xr = x * Math.cos(yaw) - y * Math.sin(yaw)
      const yr = x * Math.sin(yaw) + y * Math.cos(yaw)
      const py = yr * Math.cos(tilt) - z * Math.sin(tilt)
      const depth = yr * Math.sin(tilt)
      const f = 1 / (1 + depth / (R * 4))
      return [W / 2 + xr * s * f, H / 2 - py * s * f, f]
    }
    ctx.fillStyle = 'rgba(0, 35, 102, 0.16)'
    for (const p of field) { const [x, y] = proj(p); ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4) }
    for (const p of xy) {
      const [x, y, f] = proj(p)
      ctx.fillStyle = 'rgba(47, 111, 184, 0.9)'
      ctx.beginPath(); ctx.arc(x, y, 2.6 * f, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = 'rgba(47, 111, 184, 0.25)'
      ctx.beginPath(); ctx.arc(x, y, 5 * f, 0, Math.PI * 2); ctx.stroke()
    }
    if (visible && !reduced) raf = requestAnimationFrame(draw)
  }
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(draw) })
  io.observe(el)
  requestAnimationFrame(draw)
})
onUnmounted(() => { io?.disconnect(); if (raf) cancelAnimationFrame(raf) })
</script>

<style scoped>
.dm { display: block; width: 100%; height: 100%; }
</style>

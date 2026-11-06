<template>
  <canvas ref="cv" class="wi" aria-hidden="true"></canvas>
</template>

<script setup>
// Линейная 3D-иконка, как сетчатые иконки у Terminal: каркас фигуры медленно
// вращается, узлы — точки фирменного зелёного. Рисуется на 2D-канвасе без
// WebGL: четыре иконки на странице не должны поднимать четыре 3D-контекста.
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({ shape: { type: String, default: 'ico' } })
const cv = ref(null)

const GREEN = '0, 96, 57'
const NAVY = '0, 35, 102'

// ── Геометрия: вершины и рёбра ──
const ico = () => {
  const t = (1 + Math.sqrt(5)) / 2
  const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
    .map((p) => p.map((c) => c / Math.hypot(1, t)))
  const e = []
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
    if (Math.abs(Math.hypot(...v[i].map((c, k) => c - v[j][k])) - 1.0515) < 0.01) e.push([i, j])
  }
  return { v, e }
}
const globe = () => {
  const v = []; const e = []
  const lat = 5; const lon = 12
  for (let a = 1; a < lat; a++) {
    const phi = (a / lat) * Math.PI
    const base = v.length
    for (let b = 0; b < lon; b++) {
      const th = (b / lon) * Math.PI * 2
      v.push([Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)])
      e.push([base + b, base + ((b + 1) % lon)])
      if (a > 1) e.push([base + b, base - lon + b])
    }
  }
  return { v, e }
}
const lattice = () => {
  const v = []; const e = []
  const n = 3; const idx = (x, y, z) => x * n * n + y * n + z
  for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) {
    v.push([x - 1, y - 1, z - 1].map((c) => c * 0.62))
    if (x < n - 1) e.push([idx(x, y, z), idx(x + 1, y, z)])
    if (y < n - 1) e.push([idx(x, y, z), idx(x, y + 1, z)])
    if (z < n - 1) e.push([idx(x, y, z), idx(x, y, z + 1)])
  }
  return { v, e }
}
const torus = () => {
  const v = []; const e = []
  const R = 0.72; const r = 0.3; const U = 16; const V = 7
  for (let a = 0; a < U; a++) for (let b = 0; b < V; b++) {
    const u = (a / U) * Math.PI * 2; const w = (b / V) * Math.PI * 2
    v.push([(R + r * Math.cos(w)) * Math.cos(u), r * Math.sin(w), (R + r * Math.cos(w)) * Math.sin(u)])
    const i = a * V + b
    e.push([i, a * V + ((b + 1) % V)])
    e.push([i, ((a + 1) % U) * V + b])
  }
  return { v, e }
}
const SHAPES = { ico, globe, lattice, torus }

let raf = 0
let io = null
let visible = false
let reduced = false
let onResize = null

onMounted(() => {
  const el = cv.value
  const ctx = el.getContext('2d')
  const { v, e } = (SHAPES[props.shape] || ico)()
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let W = 0; let H = 0
  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    W = el.clientWidth; H = el.clientHeight
    el.width = Math.round(W * dpr); el.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  const draw = (time) => {
    raf = 0
    // Канвас мог получить размер позже монтирования (ленивая вёрстка карточек)
    if (!W || el.clientWidth !== W || el.clientHeight !== H) resize()
    if (!W || !H) return
    const t = reduced ? 0.6 : time * 0.00025
    const ry = t; const rx = 0.45 + Math.sin(t * 0.7) * 0.15
    const cy = Math.cos(ry); const sy = Math.sin(ry); const cx = Math.cos(rx); const sx = Math.sin(rx)
    const s = Math.min(W, H) * 0.36
    const P = v.map(([x, y, z]) => {
      const x1 = x * cy + z * sy; const z1 = -x * sy + z * cy
      const y2 = y * cx - z1 * sx; const z2 = y * sx + z1 * cx
      const k = 2.6 / (2.6 + z2)
      return [W / 2 + x1 * s * k, H / 2 + y2 * s * k, z2]
    })
    ctx.clearRect(0, 0, W, H)
    ctx.lineWidth = 1
    for (const [a, b] of e) {
      const depth = (P[a][2] + P[b][2]) / 2
      ctx.strokeStyle = `rgba(${NAVY}, ${(0.22 + 0.3 * (1 - (depth + 1) / 2)).toFixed(3)})`
      ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke()
    }
    for (const p of P) {
      const near = 1 - (p[2] + 1) / 2
      ctx.fillStyle = `rgba(${GREEN}, ${(0.45 + 0.55 * near).toFixed(3)})`
      ctx.beginPath(); ctx.arc(p[0], p[1], 1.6 + 1.6 * near, 0, Math.PI * 2); ctx.fill()
    }
    if (visible && !reduced) raf = requestAnimationFrame(draw)
  }
  io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible && !raf) raf = requestAnimationFrame(draw)
  })
  io.observe(el)
  onResize = () => { resize(); if (!raf) raf = requestAnimationFrame(draw) }
  window.addEventListener('resize', onResize)
  requestAnimationFrame(draw)
})

onUnmounted(() => {
  if (onResize) window.removeEventListener('resize', onResize)
  io?.disconnect()
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.wi { display: block; width: 100%; height: 100%; }
</style>

<template>
  <!-- «Как у нас это собирается»: облако точек слетается в знак ESP, счётчик идёт синхронно (progress 0→1) -->
  <canvas ref="cv" class="bpt" aria-hidden="true" />
</template>

<script setup>
import { ESP_LOGO_PATHS } from '~/components/ui/espLogoPaths'

const emit = defineEmits(['progress'])
const cv = ref(null)

const LW = 120, LH = 61 // viewBox знака
const T = 2400 // длительность сборки, мс
const COLORS = ['#002366', '#002366', '#002366', '#0a3a8c', '#0a3a8c', '#1b56b8', '#7fb2ff']

let ctx = null, W = 0, H = 0, dpr = 1
let pts = [] // { sx, sy, tx, ty, c, d, ph, cu, r }
let raf = 0, t0 = 0, state = 'idle' // idle → run → done
let io = null, vis = null, ro = null, visible = false, reduced = false

const rnd = (a, b) => a + Math.random() * (b - a)
const easeIO = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
const easeOut = (k) => 1 - Math.pow(1 - k, 3)

// Область рисования: от верха плитки до цифры (цифру и подпись не перекрываем)
const measure = () => {
  const el = cv.value, host = el?.parentElement
  if (!host) return false
  const num = host.querySelector('.hm-bn__num')
  const w = host.clientWidth
  const h = Math.max(56, (num ? num.offsetTop : host.clientHeight * 0.5) - 6)
  if (w === W && h === H) return false
  W = w; H = h; dpr = Math.min(2, window.devicePixelRatio || 1)
  el.style.width = `${W}px`; el.style.height = `${H}px`
  el.width = Math.round(W * dpr); el.height = Math.round(H * dpr)
  ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return true
}

// Целевые точки — заливка знака ESP, вписанного в правый верх
const build = () => {
  const pad = Math.max(14, Math.min(28, W * 0.07))
  const top = pad * 0.75, gap = W < 240 ? 10 : 8 // зазор до цифры
  const s = Math.min((W - pad * 2) * 0.78 / LW, (H - top - gap) / LH)
  const lw = LW * s, lh = LH * s
  const ox = W - pad - lw, oy = top
  const R = 3 // разрешение выборки
  const off = document.createElement('canvas')
  off.width = Math.ceil(lw * R); off.height = Math.ceil(lh * R)
  const oc = off.getContext('2d')
  oc.scale(s * R, s * R)
  ESP_LOGO_PATHS.forEach((d) => oc.fill(new Path2D(d)))
  const data = oc.getImageData(0, 0, off.width, off.height).data
  const fill = []
  for (let y = 0; y < off.height; y += 1) for (let x = 0; x < off.width; x += 1) if (data[(y * off.width + x) * 4 + 3] > 128) fill.push(x, y)
  const total = fill.length / 2
  const n = Math.round(Math.max(500, Math.min(W < 500 ? 1200 : 2600, (total / (R * R)) / 1.6)))
  const done = state === 'done'
  pts = Array.from({ length: n }, (_, i) => {
    const j = Math.floor(Math.random() * total)
    const tx = ox + (fill[j * 2] + Math.random()) / R, ty = oy + (fill[j * 2 + 1] + Math.random()) / R
    const old = pts[i]
    return {
      tx, ty,
      sx: old && !done ? old.sx : rnd(-W * 0.1, W * 1.1), sy: old && !done ? old.sy : rnd(-H * 0.2, H * 1.15),
      c: COLORS[i % COLORS.length], d: Math.random() * 0.38, ph: Math.random() * Math.PI * 2,
      cu: rnd(-1, 1) * Math.min(W, H) * 0.35, r: rnd(0.55, 1.05)
    }
  })
}

const draw = (now) => {
  ctx.clearRect(0, 0, W, H)
  const k = state === 'run' ? Math.min(1, (now - t0) / T) : state === 'done' ? 1 : 0
  const breath = state === 'done' && !reduced
  const tm = now / 1000
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    let x, y, a
    if (k >= 1) {
      x = p.tx; y = p.ty; a = 0.92
      if (breath) { x += Math.sin(tm * 1.3 + p.ph) * 0.45; y += Math.cos(tm * 1.1 + p.ph) * 0.45; a = 0.72 + 0.28 * Math.sin(tm * 2.2 + p.ph * 3) }
    } else {
      const q = easeIO(Math.min(1, Math.max(0, (k - p.d) / (1 - 0.38))))
      const dx = p.tx - p.sx, dy = p.ty - p.sy, len = Math.hypot(dx, dy) || 1
      const bend = Math.sin(Math.PI * q) * p.cu
      x = p.sx + dx * q - (dy / len) * bend
      y = p.sy + dy * q + (dx / len) * bend
      if (state === 'idle' || q === 0) { x += Math.sin(tm * 0.9 + p.ph) * 3; y += Math.cos(tm * 0.7 + p.ph) * 3 }
      a = 0.28 + 0.64 * q
    }
    ctx.globalAlpha = a
    ctx.fillStyle = p.c
    const r = p.r * (k >= 1 ? 1 : 0.85 + 0.15 * k)
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  ctx.globalAlpha = 1
  return k
}

const loop = (now) => {
  raf = 0
  if (!visible) return
  const k = draw(now)
  if (state === 'run') {
    emit('progress', easeOut(k))
    if (k >= 1) state = 'done'
  }
  raf = requestAnimationFrame(loop)
}
const start = () => { if (!raf && visible && !reduced) raf = requestAnimationFrame(loop) }
const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0 }

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  measure(); build()
  if (reduced) { state = 'done'; draw(0); emit('progress', 1) }
  ro = new ResizeObserver(() => { if (measure()) { build(); if (reduced || !raf) draw(performance.now()) } })
  ro.observe(cv.value.parentElement)
  if (reduced) return
  // Пауза вне экрана
  vis = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop() })
  vis.observe(cv.value)
  // Старт сборки — один раз, когда плитка видна на 40%
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    io.disconnect(); io = null
    state = 'run'; t0 = performance.now(); emit('progress', 0)
  }, { threshold: 0.4 })
  io.observe(cv.value.parentElement)
})
onBeforeUnmount(() => { stop(); io?.disconnect(); vis?.disconnect(); ro?.disconnect() })
</script>

<style scoped>
.bpt { position: absolute; top: 0; left: 0; z-index: 0; display: block; pointer-events: none; }
</style>

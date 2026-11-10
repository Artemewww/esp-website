<template>
  <!-- Экосистема из 30 000 элементов: чёрный фон, мелкие круглые точки слетаются
       со всех сторон и при прокрутке собираются в знак ESP. Всё в одну высоту окна. -->
  <section ref="root" class="la" aria-labelledby="la-h">
    <div class="la-sticky">
      <canvas ref="canvas" class="la-canvas" aria-hidden="true"></canvas>

      <div class="la-layout">
        <header class="la-head">
          <span class="la-eyebrow">Экосистема ESP</span>
          <h2 id="la-h" class="la-title">
            <span class="la-num">{{ counter }}</span>
            <span class="la-num-label">технических элементов</span>
          </h2>
        </header>

        <div ref="slot" class="la-slot" aria-hidden="true">
          <svg class="la-logo" viewBox="0 0 120 61" :style="{ opacity: solidOn }">
            <path v-for="(d, i) in LOGO_PATHS" :key="i" :d="d" fill="#fff" />
          </svg>
        </div>

        <div class="la-copy">
          <div class="la-part" :class="{ 'is-on': part === 0 }" :aria-hidden="part !== 0">
            <p class="la-part-title">Единая управляемая экосистема</p>
            <p class="la-lead">Насосы, фильтры, датчики, контроллеры — каждый элемент передаёт своё состояние.</p>
          </div>
          <div class="la-part" :class="{ 'is-on': part === 1 }" :aria-hidden="part !== 1">
            <p class="la-part-title">Мы решаем масштабные задачи</p>
            <p class="la-lead">Вместе они складываются в одну систему — и она собирается прямо сейчас.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { LOGO_PATHS } from '~/components/layout/logoPaths.js'
import { stableVh } from '~/composables/useStableVh'

const VB_W = 120
const VB_H = 61

const root = ref(null)
const canvas = ref(null)
const slot = ref(null)
const progress = ref(0)

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// Фазы в долях прокрутки блока
const FLY = [0.04, 0.74]     // элементы слетаются
const SOLID = [0.76, 0.84]   // появляется заливка знака, точки уходят под неё

const counter = computed(() => Math.round(smoothstep(FLY[0], FLY[1], progress.value) * 30000).toLocaleString('ru-RU'))
const solidOn = computed(() => smoothstep(SOLID[0], SOLID[1], progress.value).toFixed(3))
const part = computed(() => (progress.value < 0.45 ? 0 : 1))

// ── Частицы: типизированные массивы, одна заливка на цветовую группу
let ctx = null
let W = 0
let H = 0
let N = 0
let tx, ty, ox, oy, ang, dl, sz
// Мелкие идеально круглые точки: белые и приглушённые. Каждая рисуется готовым
// спрайтом-кругом — так круг ровный и кадр укладывается в 60 fps.
const GROUPS = ['#ffffff', 'rgba(255,255,255,0.62)', 'rgba(255,255,255,0.38)']
const GROUP_W = [0.55, 0.28, 0.17]
let sprites = []
const makeSprites = (dpr) => {
  sprites = GROUPS.map((c) => {
    const n = Math.ceil(8 * dpr)
    const sp = document.createElement('canvas')
    sp.width = sp.height = n
    const g = sp.getContext('2d')
    g.fillStyle = c
    g.beginPath()
    g.arc(n / 2, n / 2, n / 2, 0, Math.PI * 2)
    g.fill()
    return sp
  })
}
let groupEnds = [0, 0, 0]
let raf = 0
let reduced = false
let lastP = -1

// Цели — непрозрачные пиксели знака, отрисованного в размер слота
const build = () => {
  const cv = canvas.value
  const sl = slot.value
  if (!cv || !sl) return
  const box = cv.getBoundingClientRect()
  const s = sl.getBoundingClientRect()
  W = box.width
  H = box.height
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  cv.width = Math.round(W * dpr)
  cv.height = Math.round(H * dpr)
  ctx = cv.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  makeSprites(dpr)

  const scale = Math.min(s.width / VB_W, s.height / VB_H)
  const lw = Math.max(2, Math.round(VB_W * scale))
  const lh = Math.max(2, Math.round(VB_H * scale))
  const lx = s.left - box.left + (s.width - lw) / 2
  const ly = s.top - box.top + (s.height - lh) / 2

  const off = document.createElement('canvas')
  off.width = lw
  off.height = lh
  const o = off.getContext('2d', { willReadFrequently: true })
  o.setTransform(scale, 0, 0, scale, 0, 0)
  o.fillStyle = '#fff'
  for (const d of LOGO_PATHS) o.fill(new Path2D(d))
  const data = o.getImageData(0, 0, lw, lh).data
  const hits = []
  for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) if (data[(y * lw + x) * 4 + 3] > 140) hits.push(x, y)
  const total = hits.length / 2
  if (!total) return

  N = Math.min(W < 734 ? 5000 : 10000, Math.max(2000, Math.round(total / 4)))
  tx = new Float32Array(N); ty = new Float32Array(N)
  ox = new Float32Array(N); oy = new Float32Array(N)
  ang = new Float32Array(N); dl = new Float32Array(N); sz = new Float32Array(N)
  const cx = lx + lw / 2
  const cy = ly + lh / 2
  const far = Math.hypot(W, H) * 0.75
  // Группы цветов подряд — рисуем их тремя проходами без смены fillStyle
  let k = 0
  groupEnds = []
  GROUP_W.forEach((w, g) => {
    const end = g === GROUP_W.length - 1 ? N : Math.round(k + N * w)
    for (; k < end; k++) {
      const h = (Math.random() * total) | 0
      const x = lx + hits[h * 2] + Math.random()
      const y = ly + hits[h * 2 + 1] + Math.random()
      tx[k] = x
      ty[k] = y
      // Вылет из-за пределов знака по радиусу, с разбросом
      const a = Math.atan2(y - cy, x - cx) + (Math.random() - 0.5) * 1.6
      const r = far * (0.45 + Math.random() * 0.75)
      ox[k] = Math.cos(a) * r
      oy[k] = Math.sin(a) * r
      ang[k] = (Math.random() - 0.5) * 2.2
      dl[k] = Math.random() * 0.55
      sz[k] = (W < 734 ? 1.3 : 1.5) + Math.random() * (W < 734 ? 0.8 : 1.0)
    }
    groupEnds.push(end)
  })
  lastP = -1
  draw()
}

const draw = () => {
  raf = 0
  if (!ctx || !N) return
  const pr = progress.value
  if (pr === lastP) return
  lastP = pr
  const p = reduced ? 1 : smoothstep(FLY[0], FLY[1], pr)
  ctx.clearRect(0, 0, W, H)
  // Как только проявилась заливка знака, точки гаснут под ней полностью
  const fade = 1 - Number(solidOn.value)
  if (fade <= 0.001) return
  ctx.globalAlpha = fade
  let start = 0
  for (let g = 0; g < groupEnds.length; g++) {
    const sp = sprites[g]
    const end = groupEnds[g]
    for (let i = start; i < end; i++) {
      let t = (p * 1.55 - dl[i]) / 1
      if (t <= 0) continue
      if (t > 1) t = 1
      const e = 1 - (1 - t) * (1 - t) * (1 - t)
      const k = 1 - e
      let x = tx[i]
      let y = ty[i]
      if (k > 0) {
        const a = ang[i] * k
        const c = Math.cos(a)
        const s = Math.sin(a)
        const dx = ox[i] * k
        const dy = oy[i] * k
        x += dx * c - dy * s
        y += dx * s + dy * c
      }
      const z = sz[i] * (1 + k * 0.6)
      ctx.drawImage(sp, x - z / 2, y - z / 2, z, z)
    }
    start = end
  }
  ctx.globalAlpha = 1
}

const read = () => {
  const el = root.value
  if (!el) return
  const range = el.offsetHeight - stableVh()
  progress.value = range > 0 ? clamp01(-el.getBoundingClientRect().top / range) : 0
  if (!raf) raf = requestAnimationFrame(draw)
}
let scrollRaf = 0
const onScroll = () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; read() }) }

let ro = null
let lastW = 0
let lastH = 0
const onResize = () => {
  const cv = canvas.value
  if (!cv) return
  const w = cv.clientWidth
  const h = cv.clientHeight
  // Мобильная адресная строка меняет высоту на десятки пикселей — сцену не пересобираем
  if (lastW && Math.abs(w - lastW) < 1 && Math.abs(h - lastH) < 120) return
  lastW = w
  lastH = h
  build()
  read()
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  onResize()
  window.addEventListener('scroll', onScroll, { passive: true })
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(onResize)
    ro.observe(canvas.value)
  } else window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  ro?.disconnect()
  if (raf) cancelAnimationFrame(raf)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
})
</script>

<style scoped>
.la {
  position: relative;
  height: 300vh;
  height: 300svh;
  background: #000;
  color: #fff;
  font-family: var(--dj-font);
}
.la-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: #000;
}
.la-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

.la-layout {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(12px, 3svh, 36px);
  padding: calc(44px + clamp(16px, 5svh, 64px)) 22px clamp(20px, 5svh, 64px);
}
.la-head { flex: none; }
.la-eyebrow { display: block; font-size: clamp(15px, min(1.6vw, 2.6svh), 21px); line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #86868b; }
.la-title { margin: clamp(4px, 1svh, 10px) 0 0; display: flex; flex-direction: column; align-items: center; color: #fff; font-weight: 600; }
.la-num { font-size: clamp(48px, min(11vw, 13svh), 144px); line-height: 1; letter-spacing: -0.015em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.la-num-label { margin-top: clamp(2px, 0.8svh, 8px); font-size: clamp(19px, min(2.2vw, 3.4svh), 32px); line-height: 1.125; letter-spacing: 0.004em; }

.la-slot { flex: 1 1 auto; min-height: 0; width: min(100%, 820px); display: grid; place-items: center; }
.la-logo { width: 100%; height: 100%; max-height: 100%; }

.la-copy { flex: none; display: grid; width: min(100%, 680px); }
.la-part { grid-area: 1 / 1; opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.8s var(--dj-ease, ease); }
.la-part.is-on { opacity: 1; transform: none; }
.la-part-title { margin: 0; font-size: clamp(19px, min(2.2vw, 3.4svh), 32px); line-height: 1.125; font-weight: 600; letter-spacing: 0.004em; color: #fff; text-wrap: balance; }
.la-lead { margin: clamp(4px, 1svh, 10px) 0 0; font-size: clamp(15px, min(1.5vw, 2.6svh), 21px); line-height: 1.381; letter-spacing: 0.011em; color: rgba(255, 255, 255, 0.78); text-wrap: balance; }

@media (prefers-reduced-motion: reduce) {
  .la-part { transition: opacity 0.2s linear; transform: none; }
}
</style>

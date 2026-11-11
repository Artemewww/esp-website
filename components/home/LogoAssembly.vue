<template>
  <!-- Экосистема из 30 000 элементов: синий фон ESP, мелкие круглые точки слетаются
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
            <p class="la-lead">Насосы, фильтры, датчики, контроллеры — каждый элемент передаёт своё состояние.</p>
          </div>
          <div class="la-part" :class="{ 'is-on': part === 1 }" :aria-hidden="part !== 1">
            <p class="la-part-title">Единый контур управления</p>
            <p class="la-lead">Вместе они работают как одна система с общим диспетчерским контуром.</p>
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

// ── Частицы: WebGL-точки. Вся анимация считается в вершинном шейдере —
// на кадр в GPU уходит одно число (прогресс), поэтому 200 000 точек идут в 60 fps.
// Мелкие идеально круглые точки трёх яркостей: белые и приглушённые.
const ALPHAS = [1, 0.62, 0.38]
const GROUP_W = [0.55, 0.28, 0.17]
const STRIDE = 8 // tx, ty, ox, oy, ang, delay, size, alpha
let gl = null
let prog = null
let buf = null
let uni = {}
let ctx2d = null // запасной путь без WebGL
let data2d = null
let W = 0
let H = 0
let N = 0
let dpr = 1
let raf = 0
let reduced = false
let lastP = -1

const VS = `
attribute vec2 aT;
attribute vec2 aO;
attribute vec4 aP;
uniform float uP;
uniform vec2 uRes;
uniform float uDpr;
uniform float uFade;
varying float vA;
varying float vS;
void main() {
  float t = clamp(uP * 1.55 - aP.y, 0.0, 1.0);
  if (t <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; vA = 0.0; vS = 1.0; return; }
  float k = (1.0 - t) * (1.0 - t) * (1.0 - t);
  float a = aP.x * k;
  float c = cos(a);
  float s = sin(a);
  vec2 d = aO * k;
  vec2 pos = aT + vec2(d.x * c - d.y * s, d.x * s + d.y * c);
  float sz = aP.z * (1.0 + k * 0.6) * uDpr;
  gl_PointSize = max(sz, 1.0);
  // Точка меньше пикселя не мерцает, а просто становится прозрачнее
  vA = aP.w * uFade * min(1.0, sz);
  vS = gl_PointSize;
  vec2 clip = pos / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`
const FS = `
precision mediump float;
varying float vA;
varying float vS;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float edge = 1.0 / vS;
  float m = 1.0 - smoothstep(0.5 - edge, 0.5, r);
  float a = vA * m;
  gl_FragColor = vec4(a, a, a, a);
}`

const initGL = (cv) => {
  const g = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' })
  if (!g) return null
  const sh = (type, src) => {
    const s = g.createShader(type)
    g.shaderSource(s, src)
    g.compileShader(s)
    return g.getShaderParameter(s, g.COMPILE_STATUS) ? s : null
  }
  const vs = sh(g.VERTEX_SHADER, VS)
  const fs = sh(g.FRAGMENT_SHADER, FS)
  if (!vs || !fs) return null
  const p = g.createProgram()
  g.attachShader(p, vs)
  g.attachShader(p, fs)
  g.linkProgram(p)
  if (!g.getProgramParameter(p, g.LINK_STATUS)) return null
  g.useProgram(p)
  prog = p
  buf = g.createBuffer()
  uni = {
    p: g.getUniformLocation(p, 'uP'),
    res: g.getUniformLocation(p, 'uRes'),
    dpr: g.getUniformLocation(p, 'uDpr'),
    fade: g.getUniformLocation(p, 'uFade')
  }
  g.enable(g.BLEND)
  g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA)
  g.clearColor(0, 0, 0, 0)
  return g
}

const bindAttrs = () => {
  const B = STRIDE * 4
  const at = (name, size, off) => {
    const loc = gl.getAttribLocation(prog, name)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, B, off * 4)
  }
  at('aT', 2, 0)
  at('aO', 2, 2)
  at('aP', 4, 4)
}

// Цели — непрозрачные пиксели знака, отрисованного в размер слота
const build = () => {
  const cv = canvas.value
  const sl = slot.value
  if (!cv || !sl) return
  const box = cv.getBoundingClientRect()
  const s = sl.getBoundingClientRect()
  W = box.width
  H = box.height
  dpr = Math.min(2, window.devicePixelRatio || 1)
  cv.width = Math.round(W * dpr)
  cv.height = Math.round(H * dpr)
  if (!gl && !ctx2d) {
    gl = initGL(cv)
    if (!gl) ctx2d = cv.getContext('2d')
  }

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
  const px = o.getImageData(0, 0, lw, lh).data
  const hits = []
  for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) if (px[(y * lw + x) * 4 + 3] > 140) hits.push(x, y)
  const total = hits.length / 2
  if (!total) return

  const mobile = W < 734
  // В 20 раз больше прежних 10 000 / 5 000; на телефоне меньше ради плавности
  N = ctx2d ? (mobile ? 5000 : 10000) : mobile ? 60000 : 200000
  const arr = new Float32Array(N * STRIDE)
  const cx = lx + lw / 2
  const cy = ly + lh / 2
  const far = Math.hypot(W, H) * 0.75
  let k = 0
  GROUP_W.forEach((w, g) => {
    const end = g === GROUP_W.length - 1 ? N : Math.round(k + N * w)
    for (; k < end; k++) {
      const h = (Math.random() * total) | 0
      const x = lx + hits[h * 2] + Math.random()
      const y = ly + hits[h * 2 + 1] + Math.random()
      // Вылет из-за пределов знака по радиусу, с разбросом
      const a = Math.atan2(y - cy, x - cx) + (Math.random() - 0.5) * 1.6
      const r = far * (0.45 + Math.random() * 0.75)
      const j = k * STRIDE
      arr[j] = x
      arr[j + 1] = y
      arr[j + 2] = Math.cos(a) * r
      arr[j + 3] = Math.sin(a) * r
      arr[j + 4] = (Math.random() - 0.5) * 2.2
      arr[j + 5] = Math.random() * 0.55
      arr[j + 6] = ctx2d ? 1.5 + Math.random() : (mobile ? 0.9 : 0.75) + Math.random() * (mobile ? 0.6 : 0.65)
      arr[j + 7] = ALPHAS[g]
    }
  })
  if (gl) {
    gl.viewport(0, 0, cv.width, cv.height)
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW)
    bindAttrs()
  } else {
    data2d = arr
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  lastP = -1
  draw()
}

const draw = () => {
  raf = 0
  if (!N) return
  const pr = progress.value
  if (pr === lastP) return
  lastP = pr
  const p = reduced ? 1 : smoothstep(FLY[0], FLY[1], pr)
  // Как только проявилась заливка знака, точки гаснут под ней полностью
  const fade = 1 - Number(solidOn.value)
  if (gl) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (fade <= 0.001) return
    gl.uniform1f(uni.p, p)
    gl.uniform2f(uni.res, W, H)
    gl.uniform1f(uni.dpr, dpr)
    gl.uniform1f(uni.fade, fade)
    gl.drawArrays(gl.POINTS, 0, N)
    return
  }
  if (!ctx2d) return
  ctx2d.clearRect(0, 0, W, H)
  if (fade <= 0.001) return
  ctx2d.fillStyle = '#fff'
  for (let i = 0; i < N; i++) {
    const j = i * STRIDE
    let t = p * 1.55 - data2d[j + 5]
    if (t <= 0) continue
    if (t > 1) t = 1
    const k = (1 - t) * (1 - t) * (1 - t)
    const a = data2d[j + 4] * k
    const c = Math.cos(a)
    const sn = Math.sin(a)
    const dx = data2d[j + 2] * k
    const dy = data2d[j + 3] * k
    const z = data2d[j + 6] * (1 + k * 0.6)
    ctx2d.globalAlpha = fade * data2d[j + 7]
    ctx2d.fillRect(data2d[j] + dx * c - dy * sn - z / 2, data2d[j + 1] + dx * sn + dy * c - z / 2, z, z)
  }
  ctx2d.globalAlpha = 1
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
  canvas.value?.addEventListener('webglcontextlost', (e) => { e.preventDefault(); gl = null; N = 0 })
  canvas.value?.addEventListener('webglcontextrestored', () => { build(); read() })
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
  background: #002366;
  color: #fff;
  font-family: var(--dj-font);
}
.la-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  /* Фирменный синий ESP: глубокий градиент, светлее к центру знака */
  background:
    radial-gradient(90% 70% at 50% 48%, #0a3a8f 0%, rgba(0, 35, 102, 0) 70%),
    linear-gradient(180deg, #002366 0%, #001c52 100%);
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
.la-eyebrow { display: block; font-size: clamp(15px, min(1.6vw, 2.6svh), 21px); line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: rgba(255, 255, 255, 0.62); }
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

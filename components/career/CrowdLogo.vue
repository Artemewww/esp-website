<template>
  <!-- «100+»: маленькие люди сверху сходятся из толпы в знак ESP, счётчик идёт синхронно (progress 0→1) -->
  <canvas ref="cv" class="crw" aria-hidden="true" />
</template>

<script setup>
import { ESP_LOGO_PATHS } from '~/components/ui/espLogoPaths'

const emit = defineEmits(['progress'])
const cv = ref(null)

const LW = 120, LH = 61 // viewBox знака
const T = 3000 // длительность сборки, мс
const SHIRTS = ['#002366', '#002366', '#0a2f78', '#0a3a8c', '#13294f', '#1b4fa8']
const HAIR = ['#2a211c', '#3b2c22', '#1c1a19', '#5a4330', '#8a6a48', '#6e6a66', '#c9a36b']
const HAT = '#f4f6fa' // белая каска у части инженеров

let ctx = null, W = 0, H = 0, dpr = 1
let ppl = [] // { sx, sy, tx, ty, d, cu, ph, sc, shirt, hair, hat, a0 }
let avg = 0 // средняя доля пройденного пути — по ней идёт счётчик
let raf = 0, t0 = 0, state = 'idle' // idle → run → done
let io = null, vis = null, ro = null, visible = false, reduced = false

const rnd = (a, b) => a + Math.random() * (b - a)
const easeIO = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const lerpAng = (a, b, t) => { let d = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI; return a + d * t }

// Область: правый верх карточки — от строки «Команда» до большой цифры
const measure = () => {
  const el = cv.value, host = el?.parentElement
  if (!host) return false
  const w = host.clientWidth, h = host.clientHeight
  if (w === W && h === H) return false
  W = w; H = h; dpr = Math.min(2, window.devicePixelRatio || 1)
  el.style.width = `${W}px`; el.style.height = `${H}px`
  el.width = Math.round(W * dpr); el.height = Math.round(H * dpr)
  ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return true
}

const build = () => {
  const host = cv.value.parentElement
  const val = host.querySelector('.sb-val')
  const pad = Math.max(20, Math.min(36, W * 0.055))
  const top = pad + 30
  const bottom = (val ? val.offsetTop : H * 0.55) - 16
  const left = W * (W < 500 ? 0.2 : 0.3)
  const s = Math.min((W - pad - left) / LW, (bottom - top) / LH)
  const lw = LW * s, lh = LH * s
  const ox = W - pad - lw, oy = top + (bottom - top - lh) * 0.35
  // Растр знака → пиксели заливки
  const R = 1.5
  const off = document.createElement('canvas')
  off.width = Math.ceil(lw * R); off.height = Math.ceil(lh * R)
  const oc = off.getContext('2d')
  oc.scale(s * R, s * R)
  ESP_LOGO_PATHS.forEach((d) => oc.fill(new Path2D(d)))
  const data = oc.getImageData(0, 0, off.width, off.height).data
  const fx = [], fy = []
  for (let y = 0; y < off.height; y += 1) for (let x = 0; x < off.width; x += 1) if (data[(y * off.width + x) * 4 + 3] > 128) { fx.push(x / R); fy.push(y / R) }
  const N = W < 500 ? 104 : 112
  // Ровная расстановка: k-средних по пикселям заливки (покрывает и тонкие штрихи)
  const M = Math.min(fx.length, 6000), step = fx.length / M
  const sx = new Float32Array(M), sy = new Float32Array(M)
  for (let i = 0; i < M; i++) { const j = Math.floor(i * step); sx[i] = fx[j]; sy[i] = fy[j] }
  const cx = new Float32Array(N), cy = new Float32Array(N)
  for (let i = 0; i < N; i++) { const j = Math.floor(Math.random() * M); cx[i] = sx[j]; cy[i] = sy[j] }
  const ax = new Float32Array(N), ay = new Float32Array(N), an = new Float32Array(N), own = new Int32Array(M)
  for (let it = 0; it < 10; it++) {
    ax.fill(0); ay.fill(0); an.fill(0)
    for (let i = 0; i < M; i++) {
      let b = 0, bd = 1e9
      for (let c = 0; c < N; c++) { const dx = sx[i] - cx[c], dy = sy[i] - cy[c], dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; b = c } }
      own[i] = b; ax[b] += sx[i]; ay[b] += sy[i]; an[b] += 1
    }
    for (let c = 0; c < N; c++) if (an[c]) { cx[c] = ax[c] / an[c]; cy[c] = ay[c] / an[c] }
  }
  // Центр кластера мог выйти за контур (изгиб буквы) — прижимаем к ближайшему своему пикселю
  for (let c = 0; c < N; c++) {
    let bd = 1e9, bx = cx[c], by = cy[c]
    for (let i = 0; i < M; i++) if (own[i] === c) { const dx = sx[i] - cx[c], dy = sy[i] - cy[c], dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; bx = sx[i]; by = sy[i] } }
    if (bd > 2) { cx[c] = bx; cy[c] = by }
  }
  // Масштаб человека — от медианы расстояния до ближайшего соседа в строю (плечи ≈ 80% шага)
  const nn = []
  for (let a = 0; a < N; a++) { let m = 1e9; for (let b = 0; b < N; b++) if (a !== b) m = Math.min(m, Math.hypot(cx[a] - cx[b], cy[a] - cy[b])); nn.push(m) }
  nn.sort((a, b) => a - b)
  const spacing = nn[N >> 1]
  const base = Math.min(1.6, Math.max(0.5, spacing / 11))
  // Свободная толпа — слева-снизу от знака, люди стоят как попало
  const gx = W * (W < 500 ? 0.42 : 0.4), gy = top + (bottom - top) * 0.62
  const done = state === 'done'
  const old = ppl
  ppl = Array.from({ length: N }, (_, i) => {
    const o = old[i]
    const r = Math.sqrt(Math.random()) * Math.min(W, H) * 0.34, a = Math.random() * Math.PI * 2
    return {
      tx: ox + cx[i], ty: oy + cy[i],
      sx: o && !done ? o.sx : gx + Math.cos(a) * r * 1.35, sy: o && !done ? o.sy : gy + Math.sin(a) * r * 0.75,
      d: o ? o.d : 0, cu: rnd(-1, 1) * spacing * 2.2, ph: o ? o.ph : Math.random() * Math.PI * 2,
      sc: base * rnd(0.86, 1.12), shirt: o ? o.shirt : SHIRTS[i % SHIRTS.length],
      hair: o ? o.hair : HAIR[Math.floor(Math.random() * HAIR.length)], hat: o ? o.hat : Math.random() < 0.12,
      a0: o ? o.a0 : Math.random() * Math.PI * 2
    }
  })
  // Задержка — кто ближе к знаку, тот выходит раньше: строй собирается волной
  if (!old.length || done) {
    const dist = ppl.map((p) => Math.hypot(p.tx - p.sx, p.ty - p.sy)), mx = Math.max(...dist) || 1
    ppl.forEach((p, i) => { p.d = (1 - dist[i] / mx) * 0.18 + Math.random() * 0.14 })
  }
}

const person = (x, y, ang, sc, p, walk) => {
  const sw = 6 * sc, sd = 3.1 * sc, hr = 2.5 * sc
  // мягкая тень
  ctx.globalAlpha = 0.13
  ctx.fillStyle = '#0b1d3f'
  ctx.beginPath(); ctx.ellipse(x + 1.4 * sc, y + 2.2 * sc, sw * 1.12, sd * 1.35, ang + Math.PI / 2, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
  // плечи (перпендикулярно направлению взгляда), лёгкое покачивание при ходьбе
  const sway = walk ? Math.sin(walk) * 0.22 : 0
  ctx.fillStyle = p.shirt
  ctx.beginPath(); ctx.ellipse(x, y, sw, sd, ang + Math.PI / 2 + sway, 0, Math.PI * 2); ctx.fill()
  // голова чуть впереди
  const hx = x + Math.cos(ang) * sd * 0.35, hy = y + Math.sin(ang) * sd * 0.35
  ctx.fillStyle = p.hat ? HAT : p.hair
  ctx.beginPath(); ctx.arc(hx, hy, p.hat ? hr * 1.12 : hr, 0, Math.PI * 2); ctx.fill()
  if (p.hat) { ctx.strokeStyle = 'rgba(0,35,102,0.18)'; ctx.lineWidth = 0.6; ctx.stroke() }
}

const draw = (now) => {
  ctx.clearRect(0, 0, W, H)
  const k = state === 'run' ? Math.min(1, (now - t0) / T) : state === 'done' ? 1 : 0
  const tm = now / 1000
  const FACE = Math.PI / 2 // в строю все смотрят вниз — на цифру
  let sum = 0
  for (const p of ppl) {
    let x, y, ang, walk = 0
    if (k >= 1) {
      x = p.tx; y = p.ty; ang = FACE
      if (!reduced) ang += Math.sin(tm * 0.6 + p.ph) * 0.25 * Math.max(0, Math.sin(tm * 0.23 + p.ph * 2)) // иногда оглядываются
    } else {
      const span = 1 - 0.32
      const u = Math.min(1, Math.max(0, (k - p.d) / span))
      const q = easeIO(u)
      sum += q
      const dx = p.tx - p.sx, dy = p.ty - p.sy, len = Math.hypot(dx, dy) || 1
      const bend = Math.sin(Math.PI * q) * p.cu
      x = p.sx + dx * q - (dy / len) * bend
      y = p.sy + dy * q + (dx / len) * bend
      // направление движения = производная пути
      const dq = Math.PI * Math.cos(Math.PI * q) * p.cu
      const mvx = dx - (dy / len) * dq, mvy = dy + (dx / len) * dq
      const mv = Math.atan2(mvy, mvx)
      if (u <= 0) {
        // ждут в толпе, переминаются
        x += Math.sin(tm * 0.8 + p.ph) * 1.2; y += Math.cos(tm * 0.6 + p.ph) * 1.2
        ang = p.a0 + Math.sin(tm * 0.5 + p.ph) * 0.4
        if (state === 'run') ang = lerpAng(ang, mv, smooth(-0.08, 0, k - p.d))
      } else {
        ang = lerpAng(lerpAng(p.a0, mv, smooth(0, 0.08, u)), FACE, smooth(0.82, 1, u))
        if (u < 1) walk = (u * len) / (3.2 * p.sc) // шаги пропорциональны пройденному
      }
    }
    person(x, y, ang, p.sc, p, walk)
  }
  avg = k >= 1 ? 1 : sum / (ppl.length || 1)
  return k
}

const loop = (now) => {
  raf = 0
  if (!visible) return
  const k = draw(now)
  if (state === 'run') {
    emit('progress', avg)
    if (k >= 1) state = 'done'
  }
  raf = requestAnimationFrame(loop)
}
const start = () => { if (!raf && visible && !reduced) raf = requestAnimationFrame(loop) }
const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0 }

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  measure()
  if (reduced) state = 'done'
  build()
  emit('progress', reduced ? 1 : 0)
  draw(performance.now())
  ro = new ResizeObserver(() => { if (measure()) { build(); if (reduced || !raf) draw(performance.now()) } })
  ro.observe(cv.value.parentElement)
  if (reduced) return
  // Пауза вне экрана
  vis = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop() })
  vis.observe(cv.value)
  // Старт — один раз, когда карточка видна наполовину
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    io.disconnect(); io = null
    state = 'run'; t0 = performance.now()
  }, { threshold: 0.5 })
  io.observe(cv.value.parentElement)
})
onBeforeUnmount(() => { stop(); io?.disconnect(); vis?.disconnect(); ro?.disconnect() })
</script>

<style scoped>
.crw { position: absolute; top: 0; left: 0; z-index: -1; display: block; pointer-events: none; }
</style>

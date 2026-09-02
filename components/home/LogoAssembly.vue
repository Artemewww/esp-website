<template>
  <section ref="root" class="la-scroll" aria-label="Экосистема ESP">
    <div class="la-sticky">
      <div class="la-grid" aria-hidden="true"></div>
      <div class="la-glow" aria-hidden="true"></div>

      <canvas ref="canvas" class="la-canvas" aria-hidden="true"></canvas>

      <div class="la-copy">
        <span class="la-eyebrow">
          <span class="la-eyebrow-dot"></span>
          Экосистема ESP
        </span>
        <h2 class="la-title font-rounded">
          <b>30 000</b> технических элементов —<br />
          единая управляемая экосистема
        </h2>
        <p class="la-lead">
          <b class="la-lead-strong">Мы решаем масштабные задачи!</b>
          Насосы, фильтры, датчики, контроллеры — каждый элемент передаёт
          своё состояние. Вместе они складываются в одну управляемую систему.
        </p>
      </div>

      <span class="la-hint" aria-hidden="true">{{ assembledLabel }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { LOGO_PATHS, LOGO_VIEWBOX } from './logoPath.js'

const root = ref(null)
const canvas = ref(null)
const progress = ref(0)

const COUNT = 3800
const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// Доля собранных элементов — та же цифра, что и в тексте блока.
const assembledLabel = computed(() => {
  const n = Math.round(smoothstep(0.05, 0.86, progress.value) * 30000)
  return `${n.toLocaleString('ru-RU')} / 30 000`
})

let ctx = null
let raf = 0
let scrollRaf = 0
let ro = null
let reduced = false
let width = 0
let height = 0
let pts = []
const pointer = { x: 0, y: 0, active: false }

// Целевые позиции берём с самой формы знака: заливаем путь в offscreen-канвас
// и сэмплируем непрозрачные пиксели. Так точки ложатся ровно в логотип и
// подстраиваются под любой размер экрана без отдельных карт.
const sampleLogo = (w, h) => {
  const off = document.createElement('canvas')
  const scale = Math.min(w / LOGO_VIEWBOX.w, h / LOGO_VIEWBOX.h)
  off.width = Math.max(2, Math.round(LOGO_VIEWBOX.w * scale))
  off.height = Math.max(2, Math.round(LOGO_VIEWBOX.h * scale))
  const octx = off.getContext('2d', { willReadFrequently: true })
  octx.setTransform(scale, 0, 0, scale, 0, 0)
  octx.fillStyle = '#fff'
  for (const d of LOGO_PATHS) octx.fill(new Path2D(d))

  const { data } = octx.getImageData(0, 0, off.width, off.height)
  // Границы знака считаем по самой форме: контуры не начинаются в нуле
  // координат, и без этого знак уезжал из центра сцены.
  const hits = []
  let minX = off.width
  let minY = off.height
  let maxX = 0
  let maxY = 0
  for (let y = 0; y < off.height; y += 2) {
    for (let x = 0; x < off.width; x += 2) {
      if (data[(y * off.width + x) * 4 + 3] > 128) {
        hits.push([x, y])
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  if (!hits.length) return { hits, w: off.width, h: off.height }
  for (const hit of hits) {
    hit[0] -= minX
    hit[1] -= minY
  }
  return { hits, w: maxX - minX + 1, h: maxY - minY + 1 }
}

const buildPoints = () => {
  const targetW = Math.min(width * 0.6, 760)
  const targetH = targetW * (LOGO_VIEWBOX.h / LOGO_VIEWBOX.w)
  const { hits, w: ow, h: oh } = sampleLogo(targetW, targetH)
  if (!hits.length) return

  // Знак делаем компактнее и чуть смещаем вправо от геометрического центра —
  // тогда левая часть остаётся свободной для текста и ничего не наезжает.
  const cxf = width * 0.56
  const cyf = height * 0.46
  const ox = cxf - ow / 2
  const oy = cyf - oh / 2
  pts = []
  for (let i = 0; i < COUNT; i++) {
    const [hx, hy] = hits[(Math.random() * hits.length) | 0]
    // Старт — точка на широкой орбите вокруг знака: сборка читается как
    // стягивание разрозненных элементов в одну форму.
    const ang = Math.random() * Math.PI * 2
    const rad = 0.55 + Math.random() * 0.75
    pts.push({
      tx: ox + hx,
      ty: oy + hy,
      sx: width / 2 + Math.cos(ang) * width * 0.42 * rad,
      sy: height / 2 + Math.sin(ang) * height * 0.62 * rad,
      delay: Math.random() * 0.35,
      size: 0.9 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random()
    })
  }
}

const TAU = Math.PI * 2

const resize = () => {
  const el = canvas.value
  const box = el?.parentElement
  if (!el || !box) return
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  width = box.clientWidth
  height = box.clientHeight
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  el.style.width = width + 'px'
  el.style.height = height + 'px'
  ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  buildPoints()
}

const draw = (time) => {
  raf = 0
  if (!ctx || !pts.length) return
  const p = progress.value
  const t = time * 0.001

  ctx.clearRect(0, 0, width, height)

  for (let i = 0; i < pts.length; i++) {
    const pt = pts[i]
    // Каждая точка стартует со своей задержкой — форма набирается волной,
    // а не схлопывается вся разом.
    const k = smoothstep(pt.delay * 0.5, 0.55 + pt.delay * 0.45, p)
    // До сборки точки гуляют широко, после — продолжают едва заметно
    // дышать: собранный знак должен остаться живым организмом, а не
    // застывшей картинкой.
    const drift = reduced ? 0 : Math.sin(t * 1.6 + pt.phase) * ((1 - k) * 9 + k * 1.7)
    let x = pt.sx + (pt.tx - pt.sx) * k + drift
    let y = pt.sy + (pt.ty - pt.sy) * k + drift * 0.6

    // Курсор расталкивает уже собранную форму — знак «дышит» под рукой.
    if (pointer.active && k > 0.2) {
      const dx = x - pointer.x
      const dy = y - pointer.y
      const d2 = dx * dx + dy * dy
      const r = 130
      if (d2 < r * r) {
        const d = Math.sqrt(d2) || 1
        const push = (1 - d / r) * 26
        x += (dx / d) * push
        y += (dy / d) * push
      }
    }

    const alpha = (0.25 + 0.75 * k) * (reduced ? 1 : 0.78 + 0.22 * Math.sin(t * 2.2 + pt.phase))
    const size = pt.size + k * 0.5
    // Ядро в белом, ореол в лидарном циане: собранный знак читается как
    // светящийся логотип, а не как размытое пятно.
    ctx.beginPath()
    ctx.arc(x, y, size * 1.6, 0, TAU)
    ctx.fillStyle = `rgba(0, 190, 255, ${(alpha * 0.2).toFixed(3)})`
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x, y, size * 0.55, 0, TAU)
    ctx.fillStyle = pt.hue > 0.75
      ? `rgba(255, 255, 255, ${Math.min(1, alpha).toFixed(3)})`
      : `rgba(140, 236, 255, ${Math.min(1, alpha * 0.95).toFixed(3)})`
    ctx.fill()
  }

  if (!reduced) raf = requestAnimationFrame(draw)
}

const requestDraw = () => {
  if (!raf) raf = requestAnimationFrame(draw)
}

const readProgress = () => {
  scrollRaf = 0
  const el = root.value
  if (!el) return
  const range = el.offsetHeight - window.innerHeight
  progress.value = range > 0 ? clamp01(-el.getBoundingClientRect().top / range) : 0
  requestDraw()
}

const onScroll = () => {
  if (!scrollRaf) scrollRaf = requestAnimationFrame(readProgress)
}

const onPointerMove = (e) => {
  const el = canvas.value
  if (!el) return
  const r = el.getBoundingClientRect()
  pointer.x = e.clientX - r.left
  pointer.y = e.clientY - r.top
  pointer.active = true
}

const onPointerLeave = () => {
  pointer.active = false
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  readProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerleave', onPointerLeave, { passive: true })
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => {
      resize()
      requestDraw()
    })
    if (canvas.value?.parentElement) ro.observe(canvas.value.parentElement)
  } else {
    window.addEventListener('resize', resize)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerleave', onPointerLeave)
  window.removeEventListener('resize', resize)
  if (raf) cancelAnimationFrame(raf)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  ro?.disconnect()
})
</script>

<style scoped>
.la-scroll {
  position: relative;
  height: 260vh;
  background: #0b0e13;
}
.la-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(120% 90% at 50% 45%, #141c27 0%, #0b0e13 62%, #070910 100%);
  color: #eef3f8;
}
.la-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(70% 60% at 50% 50%, #000 0%, transparent 100%);
  -webkit-mask-image: radial-gradient(70% 60% at 50% 50%, #000 0%, transparent 100%);
}
.la-glow {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 70vw;
  height: 70vw;
  max-width: 780px;
  max-height: 780px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(0, 212, 255, 0.16) 0%, rgba(0, 212, 255, 0) 62%);
  pointer-events: none;
}
.la-canvas {
  position: absolute;
  inset: 0;
  z-index: 2;
}
.la-copy {
  position: absolute;
  z-index: 3;
  left: clamp(1.25rem, 5vw, 5.5rem);
  top: 50%;
  transform: translateY(-52%);
  width: min(40vw, 24rem);
  pointer-events: none;
}
.la-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(238, 243, 248, 0.6);
}
.la-eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.18);
}
.la-title {
  margin: 0.9rem 0 0.8rem;
  font-size: clamp(1.5rem, 2.1vw, 1.95rem);
  line-height: 1.14;
  font-weight: 700;
  letter-spacing: -0.015em;
}
/* Число — главный акцент: кидаем на него циан, остальные слова остаются светлыми */
.la-title b { color: #00d4ff; font-weight: 800; }
.la-lead-strong {
  display: block;
  color: #00d4ff;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.la-lead {
  font-size: clamp(0.84rem, 0.9vw, 0.95rem);
  line-height: 1.55;
  color: rgba(238, 243, 248, 0.62);
  max-width: 21rem;
}
.la-hint {
  position: absolute;
  z-index: 3;
  right: clamp(1.25rem, 5vw, 5.5rem);
  top: clamp(5rem, 12vh, 8rem);
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  font-variant-numeric: tabular-nums;
  color: rgba(0, 212, 255, 0.75);
}

@media (max-width: 1024px) {
  .la-scroll { height: 230vh; }
  .la-copy {
    left: 50%;
    top: auto;
    bottom: 6%;
    transform: translateX(-50%);
    width: min(92%, 34rem);
    text-align: center;
  }
  .la-hint { right: 50%; transform: translateX(50%); }
}
</style>

<template>
  <section ref="root" class="la-scroll" aria-label="Экосистема ESP">
    <div class="la-sticky">
      <div class="la-grid" aria-hidden="true"></div>
      <div class="la-glow" aria-hidden="true"></div>

      <canvas ref="canvas" class="la-canvas" aria-hidden="true"></canvas>

      <div class="la-copy">
        <span class="la-eyebrow">
          <span class="la-eyebrow-dot"></span>
          Экосистема
        </span>
        <h2 class="la-title font-rounded">
          30 000 элементов —<br />
          <span class="la-title-accent">одна система</span>
        </h2>
        <p class="la-lead">
          Насосы, воздуходувки, датчики, задвижки, контроллеры. Каждый элемент считает
          и передаёт своё состояние, и вместе они складываются в один управляемый организм.
        </p>
      </div>

      <span class="la-hint" aria-hidden="true">{{ assembledLabel }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { LOGO_PATH, LOGO_VIEWBOX } from './logoPath.js'

const root = ref(null)
const canvas = ref(null)
const progress = ref(0)

const COUNT = 2600
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
  octx.setTransform(scale, 0, 0, scale, -LOGO_VIEWBOX.x * scale, -LOGO_VIEWBOX.y * scale)
  octx.fillStyle = '#fff'
  octx.fill(new Path2D(LOGO_PATH))

  const { data } = octx.getImageData(0, 0, off.width, off.height)
  const hits = []
  for (let y = 0; y < off.height; y += 2) {
    for (let x = 0; x < off.width; x += 2) {
      if (data[(y * off.width + x) * 4 + 3] > 128) hits.push([x, y])
    }
  }
  return { hits, w: off.width, h: off.height }
}

const buildPoints = () => {
  const targetW = Math.min(width * 0.52, 620)
  const targetH = targetW * (LOGO_VIEWBOX.h / LOGO_VIEWBOX.w)
  const { hits, w: ow, h: oh } = sampleLogo(targetW, targetH)
  if (!hits.length) return

  const ox = (width - ow) / 2
  const oy = (height - oh) / 2
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
    const drift = reduced ? 0 : Math.sin(t * 1.6 + pt.phase) * (1 - k) * 9
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
    ctx.fillStyle = `rgba(0, 190, 255, ${(alpha * 0.2).toFixed(3)})`
    ctx.fillRect(x - size, y - size, size * 3, size * 3)
    ctx.fillStyle = pt.hue > 0.75
      ? `rgba(255, 255, 255, ${Math.min(1, alpha).toFixed(3)})`
      : `rgba(140, 236, 255, ${Math.min(1, alpha * 0.95).toFixed(3)})`
    ctx.fillRect(x, y, size, size)
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
  bottom: clamp(2.5rem, 9vh, 6rem);
  width: min(90%, 30rem);
  pointer-events: none;
}
.la-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.78rem;
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
  margin: 1rem 0 0.9rem;
  font-size: clamp(1.7rem, 3vw, 2.9rem);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.015em;
}
.la-title-accent { color: rgba(238, 243, 248, 0.42); }
.la-lead {
  font-size: clamp(0.92rem, 1.05vw, 1.05rem);
  line-height: 1.6;
  color: rgba(238, 243, 248, 0.6);
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
    transform: translateX(-50%);
    width: min(92%, 34rem);
    text-align: center;
  }
  .la-hint { right: 50%; transform: translateX(50%); }
}
</style>

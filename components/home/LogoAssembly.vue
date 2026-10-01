<template>
  <section ref="root" class="la-scroll" aria-label="Экосистема ESP">
    <div class="la-sticky">
      <div class="la-grid" aria-hidden="true"></div>
      <div class="la-glow" :style="{ opacity: glowOn }" aria-hidden="true"></div>

      <canvas ref="canvas" class="la-canvas" aria-hidden="true"></canvas>

      <!-- Сценарий по скроллу: текст набирается по частям в центре и никуда
           не пропадает. Собравшись, уезжает целиком в левый нижний угол —
           и в освободившемся центре из точек собирается знак ESP. -->
      <div class="la-copy" :style="copyStyle">
        <div class="la-part" :style="partStyle(0)">
          <span class="la-eyebrow">
            <span class="la-eyebrow-dot"></span>
            Экосистема ESP
          </span>
          <h2 class="la-title font-rounded la-title-count">
            <span class="la-num">{{ counter }}</span>
            <span class="la-num-label">технических элементов</span>
          </h2>
        </div>

        <div class="la-part" :style="partStyle(1)" aria-hidden="true">
          <h2 class="la-title font-rounded">Единая управляемая экосистема</h2>
          <p class="la-lead">Насосы, фильтры, датчики, контроллеры — каждый элемент передаёт своё состояние.</p>
        </div>

        <div class="la-part" :style="partStyle(2)" aria-hidden="true">
          <h2 class="la-title font-rounded">Мы решаем масштабные задачи</h2>
          <p class="la-lead">Вместе они складываются в одну систему — и она собирается прямо сейчас.</p>
        </div>
      </div>

      <span class="la-hint" :style="{ opacity: hintOn }" aria-hidden="true">{{ assembledLabel }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { LOGO_PATHS, LOGO_VIEWBOX } from './logoPath.js'
import { stableVh } from '~/composables/useStableVh'

const root = ref(null)
const canvas = ref(null)
const progress = ref(0)
const vw = ref(1440)
const boxH = ref(900)

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// Фазы блока в долях прокрутки. Текст набирается один раз: части выходят
// друг за другом и остаются на месте. Когда он собран целиком — целиком же
// уезжает в левый нижний угол, освобождая центр под знак.
const PARTS = [
  [0.00, 0.10],
  [0.14, 0.26],
  [0.30, 0.42]
]
const TEXT_MOVE = [0.46, 0.62]  // переезд собранного текста в угол
const ASSEMBLE = [0.60, 0.95]   // сборка знака

// Часть текста: приходит снизу с расфокусом и остаётся. Расфокус только на
// десктопе — blur на крупном тексте перерисовывает слой каждый кадр.
const partStyle = (i) => {
  const t = smoothstep(PARTS[i][0], PARTS[i][1], progress.value)
  const soft = vw.value > 1024
  const blur = soft ? (1 - t) * 7 : 0
  return {
    opacity: t.toFixed(3),
    transform: `translateY(${((1 - t) * 22).toFixed(1)}px)`,
    filter: blur ? `blur(${blur.toFixed(1)}px)` : 'none'
  }
}

// Отступ блока от края. Держим его в скрипте, чтобы вёрстка угла и расчёт
// центра не разъехались.
const gutter = computed(() => (vw.value <= 1024 ? 20 : Math.max(24, Math.min(88, vw.value * 0.05))))

// Переезд в угол. Блок свёрстан уже стоящим в левом нижнем углу, а в начале
// отодвинут трансформом ровно в центр сцены. Проценты в translate считаются
// от самого блока, поэтому его размеры мерить не нужно — только размер сцены,
// а он меняется лишь при настоящем ресайзе.
const copyStyle = computed(() => {
  const m = smoothstep(TEXT_MOVE[0], TEXT_MOVE[1], progress.value)
  const k = 1 - m
  const g = gutter.value
  const dx = (vw.value / 2 - g) * k
  const dy = (g - boxH.value / 2) * k
  const pct = (50 * k).toFixed(2)
  return {
    left: g + 'px',
    bottom: g + 'px',
    transform: `translate(calc(${dx.toFixed(1)}px - ${pct}%), calc(${pct}% + ${dy.toFixed(1)}px)) scale(${(1 - 0.42 * m).toFixed(3)})`
  }
})

// Число набирается вместе с появлением заголовка
const counter = computed(() => {
  const n = Math.round(smoothstep(0.02, 0.14, progress.value) * 30000)
  return n.toLocaleString('ru-RU')
})

const narrow = computed(() => vw.value <= 1024)

// Текст сначала крупно по центру, потом уменьшается и уходит в левый нижний
// угол; знак собирается ровно по центру экрана.
const glowOn = computed(() => (0.25 + 0.75 * smoothstep(ASSEMBLE[0], ASSEMBLE[0] + 0.25, progress.value)).toFixed(3))
const hintOn = computed(() => smoothstep(ASSEMBLE[0], ASSEMBLE[0] + 0.05, progress.value).toFixed(3))

// Счётчик у знака — доля собранных элементов
const assembledLabel = computed(() => {
  const n = Math.round(smoothstep(ASSEMBLE[0], ASSEMBLE[1], progress.value) * 30000)
  return `${n.toLocaleString('ru-RU')} / 30 000`
})

let ctx = null
let raf = 0
let scrollRaf = 0
let ro = null
let reduced = false
let width = 0
let height = 0
// Точки знака и фоновая «пыль» — в типизированных массивах: их десятки тысяч
let logo = null
let dust = null
const pointer = { x: 0, y: 0, active: false }

// Палитра — как у точек в футере: фирменный синий, лидарный циан, немного
// зелёного и редкие белые искры. Точки без ореолов, по одному-два пикселя.
const PALETTE = ['#00d4ff', '#39b8ff', '#7fe9ff', '#1fc9a0', '#ffffff']
const PALETTE_W = [0.42, 0.22, 0.2, 0.07, 0.09]
const pickColor = () => {
  let r = Math.random()
  for (let i = 0; i < PALETTE_W.length; i++) {
    if ((r -= PALETTE_W[i]) <= 0) return i
  }
  return 0
}

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
  const count = width < 700 ? 9000 : 22000
  const targetW = Math.min(width * (narrow.value ? 0.82 : 0.52), 800)
  const targetH = targetW * (LOGO_VIEWBOX.h / LOGO_VIEWBOX.w)
  const { hits, w: ow, h: oh } = sampleLogo(targetW, targetH)
  if (!hits.length) return

  // Знак собирается ровно по центру сцены: реплики к этому моменту уже
  // растворились, и делить место больше не с кем. Чуть выше геометрического
  // центра — так оптически ровно при счётчике сверху.
  const cxf = width * 0.5
  const cyf = height * 0.46
  const ox = cxf - ow / 2
  const oy = cyf - oh / 2
  // tx, ty, sx, sy, delay, phase, color
  logo = { n: count, tx: new Float32Array(count), ty: new Float32Array(count), sx: new Float32Array(count), sy: new Float32Array(count), delay: new Float32Array(count), phase: new Float32Array(count), col: new Uint8Array(count), size: new Float32Array(count) }
  for (let i = 0; i < count; i++) {
    const [hx, hy] = hits[(Math.random() * hits.length) | 0]
    logo.tx[i] = ox + hx + (Math.random() - 0.5) * 2
    logo.ty[i] = oy + hy + (Math.random() - 0.5) * 2
    // Старт — широкая россыпь по всей сцене: знак стягивается из «пыли»
    const ang = Math.random() * Math.PI * 2
    const rad = 0.35 + Math.random() * 0.9
    logo.sx[i] = cxf + Math.cos(ang) * width * 0.55 * rad
    logo.sy[i] = cyf + Math.sin(ang) * height * 0.7 * rad
    logo.delay[i] = Math.random()
    logo.phase[i] = Math.random() * Math.PI * 2
    logo.col[i] = pickColor()
    logo.size[i] = Math.random() < 0.85 ? 1 : 1.6
  }

  // Фоновая пыль: живёт всё время, медленно течёт и огибает знак
  const dn = width < 700 ? 700 : 1800
  dust = { n: dn, x: new Float32Array(dn), y: new Float32Array(dn), vx: new Float32Array(dn), vy: new Float32Array(dn), phase: new Float32Array(dn), col: new Uint8Array(dn) }
  for (let i = 0; i < dn; i++) {
    dust.x[i] = Math.random() * width
    dust.y[i] = Math.random() * height
    const a = Math.random() * Math.PI * 2
    const sp = 6 + Math.random() * 16
    dust.vx[i] = Math.cos(a) * sp
    dust.vy[i] = Math.sin(a) * sp
    dust.phase[i] = Math.random() * Math.PI * 2
    dust.col[i] = pickColor()
  }
  logoCenter.x = cxf
  logoCenter.y = cyf
  logoCenter.r = Math.max(ow, oh) * 0.62
}

const logoCenter = { x: 0, y: 0, r: 200 }

let lastW = 0
let lastH = 0

const resize = () => {
  const el = canvas.value
  const box = el?.parentElement
  if (!el || !box) return
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const w = box.clientWidth
  const h = box.clientHeight
  // На телефоне адресная строка прячется и появляется при прокрутке, и браузер
  // шлёт resize с изменением высоты на 40–80 пикселей. Пересобирать сцену на
  // каждое такое событие — это и есть рывки при скролле: реагируем только на
  // смену ширины или заметный скачок высоты (поворот экрана).
  if (lastW && Math.abs(w - lastW) < 1 && Math.abs(h - lastH) < 120) return
  lastW = w
  lastH = h
  width = w
  height = h
  vw.value = window.innerWidth
  boxH.value = h
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  el.style.width = width + 'px'
  el.style.height = height + 'px'
  ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  buildPoints()
}

let lastT = 0
// Анимация крутится, только пока блок на экране
let visible = false
let io = null

const draw = (time) => {
  raf = 0
  if (!ctx || !logo) return
  const p = progress.value
  const t = time * 0.001
  const dt = Math.min(0.05, lastT ? t - lastT : 0.016)
  lastT = t

  ctx.clearRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'lighter'

  // ── Фоновая пыль: течёт по кругу вокруг знака, у знака ускоряется ──
  const assembleT = smoothstep(ASSEMBLE[0], ASSEMBLE[1], p)
  for (let c = 0; c < PALETTE.length; c++) {
    ctx.fillStyle = PALETTE[c]
    for (let i = 0; i < dust.n; i++) {
      if (dust.col[i] !== c) continue
      const x = dust.x[i]
      const y = dust.y[i]
      const tw = reduced ? 0.5 : 0.35 + 0.35 * Math.sin(t * 1.3 + dust.phase[i])
      ctx.globalAlpha = tw * (0.35 + 0.25 * assembleT)
      ctx.fillRect(x, y, 1, 1)
    }
  }
  if (!reduced) {
    for (let i = 0; i < dust.n; i++) {
      // Вихрь вокруг центра знака: касательная скорость + собственный дрейф
      const dx = dust.x[i] - logoCenter.x
      const dy = dust.y[i] - logoCenter.y
      const d = Math.sqrt(dx * dx + dy * dy) || 1
      const swirl = (18 + 40 * assembleT) * Math.exp(-d / (logoCenter.r * 1.6))
      dust.x[i] += (dust.vx[i] + (-dy / d) * swirl) * dt
      dust.y[i] += (dust.vy[i] + (dx / d) * swirl) * dt
      if (dust.x[i] < -4) dust.x[i] = width + 4
      else if (dust.x[i] > width + 4) dust.x[i] = -4
      if (dust.y[i] < -4) dust.y[i] = height + 4
      else if (dust.y[i] > height + 4) dust.y[i] = -4
    }
  }

  // ── Точки знака ──
  if (p > ASSEMBLE[0] - 0.06) {
    const span = ASSEMBLE[1] - ASSEMBLE[0]
    for (let c = 0; c < PALETTE.length; c++) {
      ctx.fillStyle = PALETTE[c]
      for (let i = 0; i < logo.n; i++) {
        if (logo.col[i] !== c) continue
        const d0 = ASSEMBLE[0] + logo.delay[i] * span * 0.45
        const k = smoothstep(d0, d0 + span * 0.55, p)
        const appear = smoothstep(ASSEMBLE[0] - 0.06, ASSEMBLE[0] + 0.06, p)
        const ph = logo.phase[i]
        // Собранный знак продолжает едва заметно «дышать»
        const drift = reduced ? 0 : Math.sin(t * 1.4 + ph) * ((1 - k) * 10 + 0.8)
        let x = logo.sx[i] + (logo.tx[i] - logo.sx[i]) * k + drift
        let y = logo.sy[i] + (logo.ty[i] - logo.sy[i]) * k + Math.cos(t * 1.1 + ph) * ((1 - k) * 8 + 0.6)

        if (pointer.active && k > 0.3) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < 120 * 120) {
            const d = Math.sqrt(d2) || 1
            const push = (1 - d / 120) * 22
            x += (dx / d) * push
            y += (dy / d) * push
          }
        }
        const tw = reduced ? 1 : 0.65 + 0.35 * Math.sin(t * 2 + ph)
        ctx.globalAlpha = Math.min(1, appear * (0.4 + 0.6 * k) * tw * 1.15)
        const sz = logo.size[i]
        ctx.fillRect(x, y, sz, sz)
      }
    }
  }
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'

  if (!reduced && visible) raf = requestAnimationFrame(draw)
}
const requestDraw = () => {
  if (!raf) raf = requestAnimationFrame(draw)
}

const readProgress = () => {
  scrollRaf = 0
  const el = root.value
  if (!el) return
  const range = el.offsetHeight - stableVh()
  progress.value = range > 0 ? clamp01(-el.getBoundingClientRect().top / range) : 0
  requestDraw()
}

const onScroll = () => {
  if (!scrollRaf) scrollRaf = requestAnimationFrame(readProgress)
}

const onPointerMove = (e) => {
  // На телефоне палец — инструмент прокрутки, а не указатель: разгонять им
  // собравшийся знак не нужно, да и кадры на это тратить незачем.
  if (e.pointerType === 'touch' || vw.value <= 1024) return
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
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      lastT = 0
      if (visible) requestDraw()
    })
    if (root.value) io.observe(root.value)
  } else {
    visible = true
  }
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
  io?.disconnect()
})
</script>

<style scoped>
.la-scroll {
  position: relative;
  height: 360vh;
  background: #0b0e13;
}
.la-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  /* На телефонах адресная строка то прячется, то возвращается, и 100vh
     скачет вместе с ней — секция дёргалась прямо во время прокрутки.
     svh — «маленькая» высота окна, она постоянна. Строка выше остаётся
     запасным вариантом для старых браузеров. */
  height: 100svh;
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
  left: 1.25rem;
  bottom: 1.25rem;
  z-index: 3;
  width: min(32rem, 44vw);
  text-align: left;
  transform-origin: left bottom;
  pointer-events: none;
  will-change: transform;
}
.la-part + .la-part { margin-top: 1.6rem; }
.la-part { will-change: opacity, transform, filter; }
.la-num,
.la-eyebrow,
.la-lead { will-change: opacity, transform; }
/* Число — главный аргумент блока, поэтому набрано крупно и всегда стоит
   в одну строку: раньше «30 000» разъезжалось по строкам вместе со словами
   и масштаб не читался. Подпись уходит под него отдельной строкой. */
.la-title-count { margin-top: 0.7rem; }
.la-num {
  display: block;
  color: #00d4ff;
  font-weight: 800;
  font-size: clamp(2.8rem, 17vw, 8rem);
  line-height: 0.95;
  letter-spacing: -0.03em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.la-num-label {
  display: block;
  margin-top: 0.35rem;
  font-size: clamp(1.05rem, 2.4vw, 2rem);
  font-weight: 600;
  line-height: 1.15;
  color: rgba(238, 243, 248, 0.9);
}
.la-word { display: inline-block; margin-right: 0.28em; }
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
  margin: 0.9rem 0 1rem;
  font-size: clamp(2rem, 3.6vw, 3.4rem);
  line-height: 1.1;
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
  font-size: clamp(0.95rem, 1.25vw, 1.2rem);
  line-height: 1.55;
  color: rgba(238, 243, 248, 0.66);
  max-width: 34rem;
  margin: 0;
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
  .la-scroll { height: 300vh; }
  /* На телефоне та же раскладка: текст у левого края, знак по центру. */
  .la-copy { width: min(86vw, 30rem); }
  .la-part + .la-part { margin-top: 1.1rem; }
  .la-title { font-size: clamp(1.5rem, 6vw, 2.2rem); margin: 0.7rem 0 0.8rem; }
  .la-lead { font-size: 0.92rem; margin: 0; }
  .la-hint { right: 50%; transform: translateX(50%); }
}
</style>

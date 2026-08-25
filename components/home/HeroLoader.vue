<template>
  <!-- Пока грузится кадр — облако точек кружит по центру; как только ролик
       готов, точки слетаются в «Лист» из брендбука, и только после этого
       наверху проявляется текст. -->
  <div class="hl" aria-hidden="true">
    <canvas ref="canvas" class="hl-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { LEAF_PATH } from '~/components/ui/leafPath.js'

const props = defineProps({
  // Кадр готов: точки перестают кружить и собираются в знак.
  done: { type: Boolean, default: false }
})
const emit = defineEmits(['finished'])

const canvas = ref(null)

const W = 240
const H = 180
const COUNT = 190
const GATHER_MS = 900   // сборка знака
const HOLD_MS = 420     // пауза на собранном знаке

let ctx = null
let dpr = 1
let raf = 0
let particles = []
let gatherStart = 0
let finished = false
let reduced = false

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

// Точки берём по контуру фирменного «Листа»: временный path в скрытом svg
// умеет отдавать координаты по длине, вручную считать безье не нужно.
const sampleLeaf = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.opacity = '0'
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', LEAF_PATH)
  svg.appendChild(path)
  document.body.appendChild(svg)

  const total = path.getTotalLength()
  const box = path.getBBox()

  // Тот же разворот, что у «Листа» в ленте суперграфики: знак лежит на боку,
  // иначе прелоадер показывал бы элемент в другой ориентации, чем блок CTA.
  const raw = []
  for (let i = 0; i < COUNT; i++) {
    const p = path.getPointAtLength((i / COUNT) * total)
    raw.push({ x: p.y, y: box.width - p.x })
  }
  svg.remove()

  const w = box.height
  const h = box.width
  const pad = 22
  const scale = Math.min((W - pad * 2) / w, (H - pad * 2) / h)
  const offX = (W - w * scale) / 2 - box.y * scale
  const offY = (H - h * scale) / 2

  return raw.map((p) => ({ x: p.x * scale + offX, y: p.y * scale + offY }))
}

const build = () => {
  const targets = sampleLeaf()
  particles = targets.map((t, i) => ({
    tx: t.x,
    ty: t.y,
    // Стартовое облако: точки разбросаны по эллипсу вокруг центра и медленно
    // вращаются, пока ролик тянется.
    angle: Math.random() * Math.PI * 2,
    radius: 38 + Math.random() * 52,
    speed: 0.25 + Math.random() * 0.35,
    wobble: Math.random() * Math.PI * 2,
    size: 1.1 + Math.random() * 1.3,
    delay: (i / COUNT) * 0.35,
    x: 0,
    y: 0,
    fromX: 0,
    fromY: 0
  }))
}

const draw = (time) => {
  raf = 0
  if (!ctx) return
  const t = time * 0.001
  ctx.clearRect(0, 0, W, H)

  const gathering = gatherStart > 0
  const gp = gathering ? Math.min(1, (time - gatherStart) / GATHER_MS) : 0

  for (const p of particles) {
    if (!gathering) {
      // Свободное кружение вокруг центра
      const a = p.angle + t * p.speed
      p.x = W / 2 + Math.cos(a) * p.radius * 1.15
      p.y = H / 2 + Math.sin(a) * p.radius * 0.8 + Math.sin(t * 1.4 + p.wobble) * 3
      p.fromX = p.x
      p.fromY = p.y
    } else {
      // Каждая точка стартует с небольшой задержкой — знак «наливается»
      const k = easeOutCubic(Math.min(1, Math.max(0, (gp - p.delay) / (1 - p.delay))))
      p.x = p.fromX + (p.tx - p.fromX) * k
      p.y = p.fromY + (p.ty - p.fromY) * k
    }

    // На собранном знаке точки чуть ярче и плотнее
    const glow = gathering ? 0.55 + 0.45 * gp : 0.55
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(120, 236, 255, ${glow.toFixed(3)})`
    ctx.fill()
  }

  if (gathering && gp >= 1) {
    if (!finished) {
      finished = true
      setTimeout(() => emit('finished'), HOLD_MS)
    }
    // держим собранный знак на экране до ухода блока
  }

  raf = requestAnimationFrame(draw)
}

const start = () => {
  if (!raf) raf = requestAnimationFrame(draw)
}

watch(() => props.done, (v) => {
  if (!v || gatherStart) return
  if (reduced) {
    emit('finished')
    return
  }
  gatherStart = performance.now()
  start()
})

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = canvas.value
  if (!el) return
  dpr = Math.min(2, window.devicePixelRatio || 1)
  el.width = W * dpr
  el.height = H * dpr
  el.style.width = W + 'px'
  el.style.height = H + 'px'
  ctx = el.getContext('2d')
  ctx.scale(dpr, dpr)
  build()
  if (reduced) {
    // Без анимации: сразу показываем собранный знак
    gatherStart = performance.now() - GATHER_MS
  }
  start()
  if (props.done) {
    gatherStart = performance.now()
  }
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.hl {
  display: flex;
  align-items: center;
  justify-content: center;
}
.hl-canvas {
  display: block;
  filter: drop-shadow(0 0 12px rgba(0, 212, 255, 0.35));
}
</style>

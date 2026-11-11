<template>
  <!-- Замкнутый водный цикл: живая схема-контур (капля бежит по кругу оборота)
       и синхронный список шагов с прогрессом. Без декоративных фото. -->
  <div ref="root" class="el" :class="{ 'is-in': inView }">
    <div class="el-loop" aria-hidden="true">
      <svg ref="svg" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="el-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#2f7ff0" />
            <stop offset="1" stop-color="#002366" />
          </linearGradient>
          <filter id="el-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <path class="el-track" :d="PATH" />
        <path class="el-flow" :d="PATH" pathLength="100" />
        <g v-if="!reduce">
          <circle r="14" fill="#2f7ff0" opacity="0.5" filter="url(#el-glow)">
            <animateMotion :dur="`${STEP * 4}s`" repeatCount="indefinite" :path="PATH" />
          </circle>
          <circle r="6" fill="#fff" stroke="#2f7ff0" stroke-width="3">
            <animateMotion :dur="`${STEP * 4}s`" repeatCount="indefinite" :path="PATH" />
          </circle>
        </g>
        <g v-for="(n, i) in NODES" :key="i" class="el-node" :class="{ 'is-on': i === cur }">
          <circle :cx="n[0]" :cy="n[1]" r="22" />
          <text :x="n[0]" :y="n[1] + 6" text-anchor="middle">{{ i + 1 }}</text>
        </g>
      </svg>
      <div class="el-core">
        <b>{{ shown }}%</b>
        <span>{{ stat.label }}</span>
      </div>
    </div>

    <div class="el-side">
      <p class="el-lead">{{ stat.text }}</p>
      <ol class="el-steps">
        <li v-for="(s, i) in steps" :key="i" :class="{ 'is-on': i === cur, 'is-done': i < cur }">
          <span class="el-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="el-copy"><b>{{ s.title }}</b><small>{{ s.desc }}</small></span>
          <span class="el-bar"><i :style="i === cur ? { animationDuration: `${STEP}s` } : null" /></span>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  stat: { type: Object, required: true }, // { value: 98, label, text }
  steps: { type: Array, required: true }
})

const STEP = 2.4
// Контур из прямых и скруглённых углов, старт — верх по центру, по часовой стрелке
const PATH = 'M200 50 H290 Q350 50 350 110 V290 Q350 350 290 350 H110 Q50 350 50 290 V110 Q50 50 110 50 Z'
const NODES = [[200, 50], [350, 200], [200, 350], [50, 200]]

const root = ref(null)
const svg = ref(null)
const cur = ref(0)
const inView = ref(false)
const shown = ref(0)
const reduce = ref(false)
let timer = 0, io = null, t0 = 0

const countUp = () => {
  const target = props.stat.value
  if (reduce.value) { shown.value = target; return }
  const start = performance.now()
  const f = (now) => {
    const k = Math.min(1, (now - start) / 1400)
    shown.value = Math.round(target * (1 - Math.pow(1 - k, 3)))
    if (k < 1) requestAnimationFrame(f)
  }
  requestAnimationFrame(f)
}

onMounted(() => {
  reduce.value = matchMedia('(prefers-reduced-motion: reduce)').matches
  t0 = performance.now()
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !inView.value) { inView.value = true; countUp() }
  }, { threshold: 0.3 })
  io.observe(root.value)
  if (!reduce.value) {
    // шаг сменяется синхронно с бегущей каплей
    timer = setInterval(() => {
      // шаг — ближайший к капле узел (время берём из SVG-анимации)
      const t = svg.value?.getCurrentTime?.() ?? (performance.now() - t0) / 1000
      cur.value = Math.round(t / STEP) % props.steps.length
    }, 200)
  }
})
onUnmounted(() => { clearInterval(timer); io?.disconnect() })
</script>

<style scoped>
.el { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); align-items: center; width: min(1100px, 87.5vw); margin: 0 auto; font-family: var(--dj-font); }

.el-loop { position: relative; width: 100%; max-width: 480px; aspect-ratio: 1; margin: 0 auto; border-radius: 40px; background: radial-gradient(100% 100% at 50% 0%, #ffffff 0%, #eaf2fc 100%); box-shadow: 0 30px 60px -40px rgba(0, 35, 102, 0.45); }
.el-loop svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.el-track { fill: none; stroke: #d6e3f5; stroke-width: 14; }
.el-flow { fill: none; stroke: url(#el-g); stroke-width: 4; stroke-linecap: round; stroke-dasharray: 6 4; animation: el-dash 3s linear infinite; }
@keyframes el-dash { to { stroke-dashoffset: -100; } }
.el-node circle { fill: #fff; stroke: #c4d6f0; stroke-width: 2; transition: fill 0.4s ease, stroke 0.4s ease; }
.el-node text { font-size: 17px; font-weight: 600; fill: #0a3a8c; font-family: var(--dj-font); transition: fill 0.4s ease; }
.el-node.is-on circle { fill: #0a3a8c; stroke: #0a3a8c; }
.el-node.is-on text { fill: #fff; }

.el-core { position: absolute; inset: 26%; display: grid; place-content: center; text-align: center; gap: 6px; }
.el-core b { font-size: clamp(56px, 7vw, 96px); line-height: 1; font-weight: 700; letter-spacing: -0.03em; background: linear-gradient(180deg, #2f7ff0, #002366); -webkit-background-clip: text; background-clip: text; color: transparent; font-variant-numeric: tabular-nums; }
.el-core span { font-size: clamp(14px, 1.2vw, 17px); line-height: 1.3; font-weight: 600; color: #1d1d1f; }

.el-lead { margin: 0 0 24px; font-size: clamp(19px, 1.6vw, 21px); line-height: 1.38; color: #1d1d1f; }
.el-steps { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; }
.el-steps li { position: relative; display: grid; grid-template-columns: 44px 1fr; gap: 4px 12px; padding: 16px 18px 18px; border-radius: 18px; cursor: default; transition: background-color 0.4s ease, box-shadow 0.4s ease; }
.el-steps li.is-on { background: #fff; box-shadow: 0 18px 36px -28px rgba(0, 35, 102, 0.5); }
.el-num { font-size: 15px; font-weight: 600; line-height: 1.6; color: #86868b; transition: color 0.4s ease; }
.el-steps li.is-on .el-num, .el-steps li.is-done .el-num { color: #0a3a8c; }
.el-copy { display: grid; gap: 2px; }
.el-copy b { font-size: clamp(18px, 1.5vw, 21px); line-height: 1.25; font-weight: 600; color: #1d1d1f; }
.el-copy small { font-size: 15px; line-height: 1.4; color: #6e6e73; }
.el-bar { grid-column: 2; height: 2px; margin-top: 10px; border-radius: 2px; background: #e3e8ef; overflow: hidden; opacity: 0; transition: opacity 0.3s ease; }
.el-steps li.is-on .el-bar { opacity: 1; }
.el-bar i { display: block; width: 100%; height: 100%; background: #0a3a8c; transform-origin: left; transform: scaleX(0); }
.el-steps li.is-on .el-bar i { animation: el-fill linear forwards; }
@keyframes el-fill { to { transform: scaleX(1); } }

@media (max-width: 833px) {
  .el { grid-template-columns: 1fr; gap: 32px; }
  .el-loop { max-width: 360px; border-radius: 32px; }
}
@media (prefers-reduced-motion: reduce) {
  .el-flow { animation: none; }
  .el-bar { display: none; }
}
</style>

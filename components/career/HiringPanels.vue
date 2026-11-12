<template>
  <!-- Отбор — инфографика «труба»: по линии течёт капля ESP, этапы загораются при прокрутке.
       ПК — волнистая трасса во всю ширину, мобайл — вертикальная. Тексты — из hiringSteps. -->
  <div ref="root" class="hp" :class="{ 'is-done': done, 'is-static': reduced }" :style="{ '--p': p }">
    <div ref="track" class="hp-track" aria-hidden="true">
      <svg class="hp-svg" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hpFlow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stop-color="#002366" />
            <stop offset="0.75" stop-color="#0a3a8c" />
            <stop offset="1" stop-color="#006039" />
          </linearGradient>
        </defs>
        <path class="hp-pipe" :d="d" />
        <path ref="flow" class="hp-flow" :d="d" pathLength="1" :style="{ strokeDashoffset: 1 - p }" />
      </svg>
      <span class="hp-drop" :style="dropStyle"><svg viewBox="0 0 24 24"><path d="M12 2.5c3.8 4.3 6.5 7.6 6.5 11.3a6.5 6.5 0 0 1-13 0c0-3.7 2.7-7 6.5-11.3z" /></svg></span>
    </div>

    <ol class="hp-list">
      <li
        v-for="(s, i) in items"
        :key="s.title"
        ref="nodes"
        class="hp-st"
        :class="{ 'is-on': i <= active, 'is-fin': s.fin }"
        :style="{ '--y': ys[i] + 'px', '--i': i }"
      >
        <span class="hp-node">
          <ApIcon :name="s.icon" :size="26" />
          <i v-if="s.fin" class="hp-burst" aria-hidden="true"><b v-for="k in 10" :key="k" :style="{ '--k': k }" /></i>
        </span>
        <span class="hp-card">
          <span class="hp-num">{{ s.fin ? '✓' : String(i + 1).padStart(2, '0') }}</span>
          <b class="hp-t">{{ s.title }}</b>
          <span class="hp-d">{{ s.line }}</span>
          <span v-if="s.meta" class="hp-meta">{{ s.meta }}</span>
        </span>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ steps: { type: Array, required: true } })

// Иконка, короткая строка и метка — сокращения формулировок из hiringSteps и FAQ страницы
const extra = {
  'Отклик': { icon: 'mail', line: 'Письмо на вакансию или анкета на почту отдела кадров.', meta: 'Письмо или анкета' },
  'Рассмотрение': { icon: 'search', line: 'Отдел кадров изучает анкету и при совпадении по опыту связывается с вами.', meta: 'В рабочие дни' },
  'Собеседование': { icon: 'chat', line: 'Разговор с руководителем направления: задачи, условия, зарплата.', meta: 'С руководителем' },
  'Выход на работу': { icon: 'doc', line: 'Официальное оформление и знакомство с командой на площадке.', meta: 'По ТК РБ' }
}
const items = computed(() => [
  ...props.steps.map((s) => ({ title: s.title, icon: extra[s.title]?.icon || 'circle', line: extra[s.title]?.line || s.desc, meta: extra[s.title]?.meta })),
  { title: 'Вы в команде ESP', icon: 'users', line: 'Добро пожаловать!', fin: true }
])

const H = 170
const W = ref(1000)
const n = computed(() => items.value.length)
const ys = computed(() => items.value.map((_, i) => (i % 2 ? 122 : 48)))
const xs = computed(() => items.value.map((_, i) => ((i + 0.5) / n.value) * W.value))
const d = computed(() => {
  const x = xs.value, y = ys.value, h = W.value / n.value / 2
  let s = `M${x[0] - h * 0.9} ${y[0]} L${x[0]} ${y[0]}`
  for (let i = 1; i < x.length; i++) s += ` C${x[i - 1] + h} ${y[i - 1]} ${x[i] - h} ${y[i]} ${x[i]} ${y[i]}`
  return s
})

const root = ref(null), track = ref(null), flow = ref(null), nodes = ref([])
const p = ref(0), done = ref(false), reduced = ref(false), mobile = ref(false)
const pt = ref({ x: 0, y: 48 })

// Порог этапа на длине пути (первый узел стоит после короткого «входа» трубы)
const thresholds = ref([])
const active = computed(() => {
  let a = -1
  thresholds.value.forEach((t, i) => { if (p.value >= t - 0.005) a = i })
  return a
})
const dropStyle = computed(() => mobile.value
  ? { top: `calc(${p.value * 100}% - 11px)` }
  : { transform: `translate(${pt.value.x - 11}px, ${pt.value.y - 14}px)` })

function measure() {
  if (!root.value) return
  mobile.value = window.matchMedia('(max-width: 767px)').matches
  if (!mobile.value && track.value) W.value = Math.max(600, track.value.clientWidth)
  requestAnimationFrame(() => {
    if (mobile.value) {
      const r = track.value.getBoundingClientRect()
      thresholds.value = nodes.value.map((el) => {
        const nr = el.querySelector('.hp-node').getBoundingClientRect()
        return (nr.top + nr.height / 2 - r.top) / r.height
      })
    } else if (flow.value) {
      const path = flow.value, len = path.getTotalLength()
      // длина до каждого узла: бинарный поиск по x
      thresholds.value = xs.value.map((tx) => {
        let lo = 0, hi = len
        for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; path.getPointAtLength(m).x < tx ? (lo = m) : (hi = m) }
        return lo / len
      })
    }
    update()
  })
}

function update() {
  raf = 0
  if (!root.value) return
  const vh = window.innerHeight
  let v
  if (reduced.value) v = 1
  else if (mobile.value) {
    const r = track.value.getBoundingClientRect()
    v = (vh * 0.62 - r.top) / r.height
  } else {
    const r = root.value.getBoundingClientRect()
    v = (vh * 0.8 - r.top) / (vh * 0.5)
  }
  p.value = Math.min(1, Math.max(0, v))
  if (!mobile.value && flow.value) {
    const path = flow.value
    const q = path.getPointAtLength(p.value * path.getTotalLength())
    pt.value = { x: q.x, y: q.y }
  }
  if (p.value >= 0.995) done.value = true
}

let raf = 0, io, ro, mq
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  measure()
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) window.addEventListener('scroll', onScroll, { passive: true })
    else window.removeEventListener('scroll', onScroll)
    onScroll()
  })
  io.observe(root.value)
  ro = new ResizeObserver(() => measure())
  ro.observe(root.value)
})
onBeforeUnmount(() => {
  io?.disconnect(); ro?.disconnect()
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.hp { --blue: #002366; --green: #006039; --line: #e3e9f2; position: relative; max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }
.hp-track { position: relative; height: 170px; }
.hp-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.hp-pipe, .hp-flow { fill: none; stroke-linecap: round; }
.hp-pipe { stroke: var(--line); stroke-width: 14; }
.hp-flow { stroke: url(#hpFlow); stroke-width: 6; stroke-dasharray: 1 1; }
.hp-drop { position: absolute; left: 0; top: 0; width: 22px; height: 28px; z-index: 3; filter: drop-shadow(0 4px 8px rgba(0, 35, 102, 0.35)); will-change: transform; }
.hp-drop svg { width: 100%; height: 100%; fill: #0a3a8c; stroke: #fff; stroke-width: 1.6; }
.is-done .hp-drop { opacity: 0; transition: opacity 0.4s ease 0.2s; }

.hp-list { list-style: none; margin: -170px 0 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); position: relative; z-index: 2; }
.hp-st { position: relative; padding-top: 170px; text-align: center; }
.hp-node { position: absolute; left: 50%; top: var(--y); display: grid; place-items: center; width: 64px; height: 64px; margin: -32px 0 0 -32px; border-radius: 50%; color: var(--blue); background: #fff; box-shadow: 0 0 0 1px var(--line), 0 6px 18px rgba(0, 35, 102, 0.08); transition: background 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.5s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s; }
.hp-st.is-on .hp-node { color: #fff; background: var(--blue); transform: scale(1.08); box-shadow: 0 0 0 6px rgba(0, 35, 102, 0.1), 0 10px 24px rgba(0, 35, 102, 0.25); }
.hp-st.is-fin.is-on .hp-node { background: var(--green); box-shadow: 0 0 0 8px rgba(0, 96, 57, 0.12), 0 0 40px rgba(0, 96, 57, 0.35); }

.hp-card { display: grid; justify-items: center; gap: 8px; padding: 22px 12px 0; opacity: 0.4; transform: translateY(10px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.hp-st.is-on .hp-card { opacity: 1; transform: none; }
.hp-num { font-size: clamp(40px, 4vw, 56px); line-height: 1; font-weight: 700; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; color: transparent; -webkit-text-stroke: 1.5px #c5d0e2; transition: color 0.5s, -webkit-text-stroke-color 0.5s; }
.hp-st.is-on .hp-num { color: var(--blue); -webkit-text-stroke-color: transparent; }
.hp-st.is-fin.is-on .hp-num { color: var(--green); }
.hp-t { font-size: clamp(18px, 1.5vw, 22px); line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; color: #1a1a1a; }
.hp-d { max-width: 24ch; font-size: 15px; line-height: 1.4; color: #5b6472; }
.hp-meta { margin-top: 2px; padding: 5px 12px; border-radius: 999px; font-size: 13px; font-weight: 500; color: var(--blue); background: rgba(0, 35, 102, 0.07); }
.is-fin .hp-t { color: var(--green); }
.is-fin .hp-d { font-weight: 600; color: var(--green); }

/* праздничный акцент: капли-конфетти разлетаются от финального узла один раз */
.hp-burst { position: absolute; inset: 0; pointer-events: none; }
.hp-burst b { position: absolute; left: 50%; top: 50%; width: 8px; height: 10px; margin: -5px 0 0 -4px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: var(--green); opacity: 0; --a: calc(var(--k) * 36deg); }
.hp-burst b:nth-child(3n) { background: var(--blue); }
.hp-burst b:nth-child(4n) { background: #7fb8a0; }
.is-done .hp-burst b { animation: hp-pop 1.3s cubic-bezier(0.2, 0.7, 0.3, 1) forwards; animation-delay: calc(var(--k) * 25ms + 0.15s); }
@keyframes hp-pop {
  0% { opacity: 0; transform: rotate(var(--a)) translateY(0) scale(0.4); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: rotate(var(--a)) translateY(-58px) scale(1); }
}

@media (max-width: 767px) {
  .hp { padding: 0 16px; }
  .hp-track { position: absolute; left: 41px; top: 28px; bottom: 28px; width: 6px; height: auto; border-radius: 3px; background: var(--line); }
  .hp-track::after { content: ''; position: absolute; left: 0; right: 0; top: 0; height: calc(var(--p) * 100%); border-radius: 3px; background: linear-gradient(var(--blue), #0a3a8c 80%, var(--green)); }
  .hp-svg { display: none; }
  .hp-drop { left: -8px; transform: none; }
  .hp-list { margin: 0; grid-template-columns: 1fr; gap: 28px; }
  .hp-st { padding: 0 0 0 76px; text-align: left; min-height: 64px; }
  .hp-node { left: 0; top: 0; width: 56px; height: 56px; margin: 0; }
  .hp-card { justify-items: start; gap: 4px; padding: 0; transform: translateX(8px); }
  .hp-num { position: absolute; right: 0; top: -4px; font-size: 40px; }
  .hp-t { padding-right: 56px; }
  .hp-d { max-width: none; }
  .hp-burst b { width: 7px; height: 9px; }
}

.is-static .hp-node, .is-static .hp-card, .is-static .hp-num { transition: none; }
@media (prefers-reduced-motion: reduce) {
  .hp-burst, .hp-drop { display: none; }
}
</style>

<template>
  <!-- Мнемосхема станции очистки (перерисовка SCADA-экрана hmi-4): те же узлы и данные,
       светлый «экран» Apple × брендбук ESP. Масштабируется целиком через viewBox. -->
  <span ref="root" class="hmi" :class="{ 'is-paused': paused }">
    <svg viewBox="0 0 800 560" role="img" aria-label="Мнемосхема станции очистки: решётки, аэротенки, денитрификаторы, микрофильтр, резервуар NVV">
      <defs>
        <clipPath id="hmi-tank"><rect x="25" y="213" width="750" height="130" rx="11" /></clipPath>
        <clipPath id="hmi-nvv"><rect x="561" y="373" width="214" height="118" rx="11" /></clipPath>
        <marker id="hmi-ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M1 1 L8 5 L1 9" fill="none" stroke="context-stroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </marker>
      </defs>

      <rect width="800" height="560" fill="#FAFAFA" />

      <!-- ── Трубопроводы (под узлами) ── -->
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- воздух -->
        <path d="M752 118 V198 H119 V326 M681 118 V326" class="p-air" />
        <path d="M567 154 V178 H330 V210 M470 178 V210" class="p-air" marker-end="url(#hmi-ar)" />
        <path d="M752 118 V198 H119 V326 M681 118 V326 M567 154 V178 H330 V210 M470 178 V210" class="p-flow p-flow--air" />
        <!-- сток -->
        <path d="M86 27 H344 M110 27 V56 M344 27 V56" class="p-raw" />
        <path d="M142 114 V186 H400 V210 M376 114 V186" class="p-raw" marker-end="url(#hmi-ar)" />
        <path d="M200 344 V408 H230" class="p-raw" marker-end="url(#hmi-ar)" />
        <path d="M86 27 H344 M110 27 V56 M344 27 V56 M142 114 V186 H400 V210 M376 114 V186 M200 344 V408 H230" class="p-flow" />
        <!-- очищенная вода -->
        <path d="M472 408 H556" class="p-clean" marker-end="url(#hmi-ar)" />
        <path d="M472 408 H556" class="p-flow" />
      </g>

      <!-- вход -->
      <rect x="16" y="14" width="70" height="26" rx="13" fill="#002366" />
      <text x="51" y="32" class="t-chip" text-anchor="middle">RO2.1</text>

      <!-- ── Барабанные сита + шнековые транспортёры ── -->
      <g v-for="s in sieves" :key="s.id" :transform="`translate(${s.x} 0)`">
        <rect x="0" y="58" width="110" height="56" rx="14" class="u-body" />
        <path d="M18 64 V108 M30 64 V108 M42 64 V108 M54 64 V108 M66 64 V108 M78 64 V108 M90 64 V108" stroke="#D3DCEA" stroke-width="1.5" />
        <rect x="-4" y="72" width="7" height="28" rx="2" fill="#002366" />
        <rect x="107" y="72" width="7" height="28" rx="2" fill="#002366" />
        <path d="M18 114 L12 128 M92 114 L98 128" class="u-leg" />
        <path d="M110 98 L126 116" class="u-leg" />
        <line x1="130" y1="124" x2="186" y2="76" stroke="#002366" stroke-width="16" stroke-linecap="round" />
        <line x1="130" y1="124" x2="186" y2="76" stroke="#fff" stroke-width="12" stroke-linecap="round" />
        <line x1="134" y1="120" x2="182" y2="80" stroke="#002366" stroke-width="1.5" stroke-dasharray="2 5" />
        <path d="M176 100 H222 L216 128 H182 Z" fill="#fff" stroke="#C9D3E3" stroke-width="2" stroke-linejoin="round" />
        <path d="M179 114 H219 L216 128 H182 Z" fill="#C8B79A" />
        <text x="0" y="148" class="t-unit">{{ s.id }}</text>
        <text x="187" y="148" class="t-unit" text-anchor="middle">{{ s.sd }}</text>
      </g>

      <!-- ── Узел SF ── -->
      <rect x="508" y="50" width="118" height="104" rx="12" class="u-card" />
      <text x="520" y="69" class="t-cap">SF</text>

      <!-- ── Воздуходувки ── -->
      <g v-for="b in blowers" :key="b.id">
        <rect :x="b.x - 34" y="50" width="68" height="22" rx="11" fill="#EEF2F8" />
        <text :x="b.x" y="66" class="t-hz" text-anchor="middle">{{ b.hz }} Гц</text>
        <circle :cx="b.x" cy="96" r="22" class="u-body" />
        <g :transform="`translate(${b.x} 96)`">
          <g :class="{ spin: b.on }">
            <path v-for="a in [0, 60, 120, 180, 240, 300]" :key="a" d="M0 -4 Q8 -9 4 -17" :transform="`rotate(${a})`" class="u-blade" />
            <circle r="4" fill="#002366" />
          </g>
        </g>
        <circle :cx="b.x + 16" cy="80" r="4.5" class="dot" />
        <text :x="b.x" y="142" class="t-unit" text-anchor="middle">{{ b.id }}</text>
      </g>

      <!-- ── Линия ёмкостей (прямоугольные) ── -->
      <rect x="24" y="212" width="752" height="132" rx="12" fill="#fff" />
      <g clip-path="url(#hmi-tank)">
        <rect x="24" y="236" width="752" height="110" fill="#EAF1FB" />
        <path class="wave" d="M-40 238 q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V246 H-40 Z" fill="#EAF1FB" />
      </g>
      <rect x="24" y="212" width="752" height="132" rx="12" fill="none" stroke="#C9D3E3" stroke-width="2" />
      <path d="M214 213 V343 M300 213 V343 M400 213 V343 M500 213 V343 M586 213 V343" stroke="#C9D3E3" stroke-width="2" />
      <path d="M84 222 V343 M154 222 V343 M646 222 V343 M716 222 V343" stroke="#C9D3E3" stroke-width="1.5" stroke-dasharray="4 4" />
      <text v-for="l in zoneLabels" :key="l.x + l.t" :x="l.x" y="231" class="t-cap" :text-anchor="l.a || 'middle'">{{ l.t }}</text>

      <!-- аэрация: диффузоры и пузырьки -->
      <g v-for="z in [119, 681]" :key="z">
        <path :d="`M${z - 23} 330 H${z + 23}`" stroke="#002366" stroke-width="3" stroke-linecap="round" />
        <circle v-for="(bx, k) in [-16, -6, 4, 14, -11, 9]" :key="k" :cx="z + bx" cy="324" r="2.5" class="bub" :style="{ animationDelay: `${k * 0.37}s` }" />
      </g>

      <!-- датчики -->
      <g v-for="c in sensors" :key="c.x">
        <rect :x="c.x" y="220" width="74" height="56" rx="10" class="u-card" />
        <text :x="c.x + 10" y="237" class="t-kpi-l">O₂, мг/л</text>
        <text :x="c.x + 10" y="264" class="t-kpi">{{ c.o2 }}</text>
        <rect :x="c.x" y="282" width="74" height="56" rx="10" class="u-card" />
        <text :x="c.x + 10" y="299" class="t-kpi-l">Темп, °C</text>
        <text :x="c.x + 10" y="326" class="t-kpi">{{ c.t }}</text>
      </g>

      <!-- мешалки DN -->
      <g v-for="m in mixers" :key="m.id">
        <circle :cx="m.x" cy="282" r="16" class="u-body" />
        <g :transform="`translate(${m.x} 282)`">
          <g class="spin spin--slow">
            <path v-for="a in [0, 120, 240]" :key="a" d="M0 0 C4 -3 4 -10 0 -12 C-4 -10 -4 -3 0 0 Z" :transform="`rotate(${a})`" fill="#002366" />
            <circle r="2.5" fill="#fff" stroke="#002366" stroke-width="1.5" />
          </g>
        </g>
        <circle :cx="m.x + 12" cy="270" r="4" class="dot" />
        <text :x="m.x" y="322" class="t-sm" text-anchor="middle">{{ m.id }}</text>
      </g>

      <!-- ── Микрофильтр ── -->
      <text x="352" y="370" class="t-unit" text-anchor="middle">Микрофильтр MCFa</text>
      <rect x="232" y="380" width="240" height="56" rx="28" class="u-body" />
      <path d="M262 386 V430 M274 386 V430 M286 386 V430 M298 386 V430 M310 386 V430 M322 386 V430 M334 386 V430 M346 386 V430 M358 386 V430 M370 386 V430 M382 386 V430 M394 386 V430 M406 386 V430 M418 386 V430 M430 386 V430 M442 386 V430" stroke="#E1E8F2" stroke-width="1.5" />
      <path d="M270 436 V452 M318 436 V452 M434 436 V452" class="u-leg" />

      <!-- ── Резервуар NVV ── -->
      <rect x="560" y="372" width="216" height="120" rx="12" fill="#fff" />
      <g clip-path="url(#hmi-nvv)">
        <path class="wave wave--nvv" d="M520 420 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V500 H520 Z" fill="#DCE8F8" />
      </g>
      <rect x="560" y="372" width="216" height="120" rx="12" fill="none" stroke="#C9D3E3" stroke-width="2" />
      <text x="574" y="395" class="t-unit">NVV</text>
      <text x="574" y="411" class="t-sm t-grey">Резервуар</text>

      <!-- насосы (единая иконка) -->
      <g v-for="p in pumps" :key="p.id">
        <circle :cx="p.x" :cy="p.y" :r="p.r" class="u-body" />
        <path :d="`M${p.x} ${p.y - p.r} H${p.x + p.r + 5}`" stroke="#002366" stroke-width="3" stroke-linecap="round" />
        <path :d="`M${p.x - p.r * 0.6} ${p.y - p.r * 0.8} L${p.x + p.r} ${p.y} L${p.x - p.r * 0.6} ${p.y + p.r * 0.8}`" fill="none" stroke="#002366" stroke-width="2" stroke-linejoin="round" />
        <circle :cx="p.x - p.r * 0.72" :cy="p.y - p.r * 0.72" r="4" class="dot" />
        <text :x="p.x" :y="p.y + p.r + 17" class="t-sm" text-anchor="middle">{{ p.id }}</text>
      </g>

      <!-- статусные пилюли -->
      <g v-for="(pl, k) in pills" :key="k" :class="`pill pill--${pl.k}`">
        <rect :x="pl.x" :y="pl.y" :width="pl.w" height="18" rx="9" />
        <text :x="pl.x + pl.w / 2" :y="pl.y + 13" text-anchor="middle">{{ pl.t }}</text>
      </g>

      <!-- легенда -->
      <g class="t-sm t-grey">
        <path d="M24 384 H50" class="p-raw" /><text x="58" y="388">Сток</text>
        <path d="M24 406 H50" class="p-clean" /><text x="58" y="410">Очищенная вода</text>
        <path d="M24 428 H50" class="p-air" /><text x="58" y="432">Воздух</text>
        <circle cx="30" cy="452" r="4.5" class="dot" /><text x="40" y="456">Авто</text>
        <circle cx="90" cy="452" r="4.5" fill="#C7C7CC" /><text x="100" y="456">Выкл</text>
      </g>

      <!-- ── Нижняя панель ── -->
      <rect x="12" y="508" width="776" height="42" rx="12" fill="#fff" stroke="#E5E5EA" />
      <g class="btn">
        <rect x="20" y="516" width="112" height="26" rx="9" />
        <path d="M32 524 H48 M32 534 H48" stroke="#002366" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="43" cy="524" r="3" fill="#fff" stroke="#002366" stroke-width="1.8" />
        <circle cx="37" cy="534" r="3" fill="#fff" stroke="#002366" stroke-width="1.8" />
        <text x="56" y="534">Настройки</text>
      </g>
      <g class="btn">
        <rect x="140" y="516" width="112" height="26" rx="9" />
        <path d="M157 521 L165 535 H149 Z" fill="none" stroke="#002366" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M157 526 V530" stroke="#002366" stroke-width="1.8" stroke-linecap="round" />
        <text x="174" y="534">Тревоги</text>
        <rect x="226" y="521" width="18" height="16" rx="8" fill="#006039" />
        <text x="235" y="533" class="t-badge" text-anchor="middle">0</text>
      </g>
      <g class="btn">
        <rect x="260" y="516" width="124" height="26" rx="9" />
        <rect x="273" y="521" width="16" height="16" rx="3" fill="none" stroke="#006039" stroke-width="1.8" />
        <path d="M273 527 H289 M273 532 H289 M281 521 V537" stroke="#006039" stroke-width="1.4" />
        <text x="296" y="534">Отчёт Excel</text>
      </g>
      <text x="774" y="534" class="t-clock" text-anchor="end"><tspan class="t-grey">{{ date }}</tspan>  {{ time }}</text>
    </svg>
  </span>
</template>

<script setup>
const root = ref(null)
const paused = ref(true)

const o2 = reactive({ a: 3.12, b: 2.98 })
const temp = reactive({ a: 18.8, b: 18.8 })
const hzA = ref(43.2)
const date = ref('')
const time = ref('')

const f2 = (v) => v.toFixed(2)
const sieves = [{ id: 'RBSa', sd: 'SD2a', x: 40 }, { id: 'RBSb', sd: 'SD2b', x: 274 }]
const blowers = computed(() => [
  { id: 'DMa', x: 681, hz: f2(hzA.value), on: true },
  { id: 'DMb', x: 752, hz: '0.00', on: false }
])
const sensors = computed(() => [
  { x: 220, o2: f2(o2.a), t: f2(temp.a) },
  { x: 506, o2: f2(o2.b), t: f2(temp.b) }
])
const mixers = [{ id: 'PM2a', x: 325 }, { id: 'PM2b', x: 375 }, { id: 'PM2c', x: 425 }, { id: 'PM2d', x: 475 }]
const pumps = [
  { id: 'Psfa', x: 541, y: 104, r: 18 }, { id: 'Psfb', x: 593, y: 104, r: 18 },
  { id: 'P2a', x: 54, y: 282, r: 16 }, { id: 'P2b', x: 184, y: 282, r: 16 },
  { id: 'P2c', x: 616, y: 282, r: 16 }, { id: 'P2d', x: 746, y: 282, r: 16 },
  { id: 'Рпр1', x: 270, y: 466, r: 14 }, { id: 'Рпр2', x: 318, y: 466, r: 14 }, { id: 'Рил', x: 434, y: 466, r: 14 }
]
const zoneLabels = [
  { x: 54, t: 'PZK' }, { x: 90, t: 'АКТ', a: 'start' }, { x: 184, t: 'PZK' },
  { x: 350, t: 'DN' }, { x: 450, t: 'DN' },
  { x: 616, t: 'PZK' }, { x: 652, t: 'АКТ', a: 'start' }, { x: 746, t: 'PZK' }
]
// Режим/состояние агрегатов как на исходном экране: Выкл + Авто
const pill = (x, y, t) => ({ x, y, t, k: t === 'Авто' ? 'auto' : t === 'Выкл' ? 'off' : 'ext', w: t === 'ExtRUN' ? 54 : 36 })
const pills = [
  ...[40, 274].flatMap((x) => [pill(x, 156, 'Выкл'), pill(x + 39, 156, 'Авто'), pill(x + 150, 156, 'Выкл'), pill(x + 189, 156, 'Авто')]),
  pill(286, 399, 'Выкл'), pill(325, 399, 'Авто'), pill(364, 399, 'ExtRUN')
]

// Время Минска
const fmtD = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Minsk', day: '2-digit', month: '2-digit', year: '2-digit', weekday: 'short' })
const fmtT = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Minsk', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
const tick = () => {
  const now = new Date()
  const p = Object.fromEntries(fmtD.formatToParts(now).map((x) => [x.type, x.value]))
  const wd = (p.weekday || '').replace('.', '')
  date.value = `${p.day}.${p.month}.${p.year} ${wd.charAt(0).toUpperCase()}${wd.slice(1)}`
  time.value = fmtT.format(now)
}
// Правдоподобный дрейф показаний вокруг значений исходного экрана
const drift = (v, base, range, step) => Math.min(base + range, Math.max(base - range, v + (Math.random() - 0.5) * step))
const jitter = () => {
  o2.a = drift(o2.a, 3.12, 0.12, 0.05)
  o2.b = drift(o2.b, 2.98, 0.12, 0.05)
  temp.a = drift(temp.a, 18.8, 0.1, 0.03)
  temp.b = drift(temp.b, 18.8, 0.1, 0.03)
  hzA.value = drift(hzA.value, 43.2, 0.3, 0.12)
}

let clock, live, io
onMounted(() => {
  tick()
  clock = setInterval(tick, 1000)
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  io = new IntersectionObserver(([e]) => {
    paused.value = !e.isIntersecting
    clearInterval(live)
    if (e.isIntersecting && !still) live = setInterval(jitter, 2200)
  })
  io.observe(root.value)
})
onBeforeUnmount(() => { clearInterval(clock); clearInterval(live); io?.disconnect() })
</script>

<style scoped>
.hmi { display: block; width: 92%; aspect-ratio: 800 / 560; border-radius: 12px; overflow: hidden; background: #FAFAFA; box-shadow: 0 24px 40px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08); transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1); }
.hmi svg { display: block; width: 100%; height: 100%; font-family: inherit; }
text { font-family: inherit; fill: #1D1D1F; }

.u-body { fill: #fff; stroke: #002366; stroke-width: 2; }
.u-card { fill: #fff; stroke: #E5E5EA; stroke-width: 1.5; }
.u-leg { fill: none; stroke: #8E9AAF; stroke-width: 2; stroke-linecap: round; }
.u-blade { fill: none; stroke: #002366; stroke-width: 2.2; stroke-linecap: round; }
.dot { fill: #006039; stroke: #fff; stroke-width: 1.5; }

.p-raw { fill: none; stroke: #002366; stroke-width: 4; }
.p-clean { fill: none; stroke: #3D7BE0; stroke-width: 4; }
.p-air { fill: none; stroke: #8CCBF2; stroke-width: 3; }
.p-flow { fill: none; stroke: rgba(255, 255, 255, 0.75); stroke-width: 1.6; stroke-dasharray: 5 13; animation: hmi-flow 1.1s linear infinite; }
.p-flow--air { stroke-width: 1.2; stroke-dasharray: 3 9; animation-duration: 0.8s; }

.t-chip { fill: #fff; font-size: 14px; font-weight: 600; }
.t-unit { font-size: 14px; font-weight: 600; }
.t-cap { font-size: 12px; font-weight: 600; fill: #6E6E73; letter-spacing: 0.02em; }
.t-sm { font-size: 12.5px; font-weight: 500; }
.t-grey, .t-grey text { fill: #6E6E73; }
.t-hz, .t-kpi, .t-clock, .t-badge { font-variant-numeric: tabular-nums; }
.t-hz { font-size: 13px; font-weight: 600; fill: #002366; }
.t-kpi-l { font-size: 10.5px; font-weight: 500; fill: #6E6E73; }
.t-kpi { font-size: 22px; font-weight: 700; fill: #002366; }
.t-clock { font-size: 14px; font-weight: 600; }
.t-badge { font-size: 11px; font-weight: 700; fill: #fff; }

.pill text { font-size: 11px; font-weight: 600; }
.pill--auto rect { fill: #006039; }
.pill--auto text { fill: #fff; }
.pill--off rect { fill: #E5E5EA; }
.pill--off text { fill: #3A3A3C; }
.pill--ext rect { fill: #E8EEF8; }
.pill--ext text { fill: #002366; }
.btn rect:first-child { fill: #F2F4F8; }
.btn text { font-size: 13px; font-weight: 500; }

.spin { animation: hmi-spin 1.6s linear infinite; }
.spin--slow { animation-duration: 3.2s; }
.bub { fill: #fff; stroke: #8CCBF2; stroke-width: 1.2; opacity: 0; animation: hmi-bub 2.2s ease-in infinite; }
.wave { animation: hmi-wave 6s linear infinite; }
.wave--nvv { animation-duration: 8s; }

.is-paused * { animation-play-state: paused !important; }

@keyframes hmi-flow { to { stroke-dashoffset: -18; } }
@keyframes hmi-spin { to { transform: rotate(360deg); } }
@keyframes hmi-bub { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(-78px); } }
@keyframes hmi-wave { to { transform: translateX(40px); } }

@media (prefers-reduced-motion: reduce) {
  .hmi * { animation: none !important; }
  .bub { opacity: 0.6; }
}
</style>

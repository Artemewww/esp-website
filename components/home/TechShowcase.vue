<template>
  <section ref="root" class="tw-scroll" aria-label="Цифровой двойник объекта">
    <div class="tw-sticky">
      <div class="tw-grid-bg" aria-hidden="true"></div>
      <div class="tw-glow" aria-hidden="true"></div>

      <div class="tw-layout">
        <!-- Левая колонка: заголовок блока, активный этап, рельс шагов -->
        <div class="tw-panel">
          <span class="tw-eyebrow">
            <span class="tw-eyebrow-dot"></span>
            Цифровой двойник
          </span>

          <h2 class="tw-title font-rounded">
            От облака точек —<br />
            <span class="tw-title-accent">до объекта под управлением ИИ</span>
          </h2>

          <div class="tw-copy">
            <div
              v-for="(stage, i) in stages"
              :key="stage.title"
              class="tw-copy-item"
              :class="{ 'is-active': active === i }"
              :aria-hidden="active !== i"
            >
              <p class="tw-copy-title">{{ String(i + 1).padStart(2, '0') }} · {{ stage.title }}</p>
              <p class="tw-copy-text">{{ stage.text }}</p>
              <ul class="tw-meta">
                <li v-for="tag in stage.meta" :key="tag" class="tw-meta-item">{{ tag }}</li>
              </ul>
            </div>
          </div>

          <ol class="tw-rail">
            <li v-for="(stage, i) in stages" :key="stage.short">
              <button
                type="button"
                class="tw-step"
                :class="{ 'is-active': active === i, 'is-done': active > i }"
                :aria-current="active === i ? 'step' : undefined"
                @click="scrollToStage(i)"
              >
                <span class="tw-step-num">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="tw-step-name">{{ stage.short }}</span>
                <span class="tw-step-track" aria-hidden="true">
                  <span class="tw-step-fill" :style="{ transform: `scaleX(${stageFill(i)})` }"></span>
                </span>
              </button>
            </li>
          </ol>
        </div>

        <!-- Правая колонка: изометрическая сцена -->
        <div class="tw-stage">
          <div ref="scene" class="tw-scene">
            <div class="tw-shadow" :style="{ opacity: 0.35 + 0.35 * layer(2) }" aria-hidden="true"></div>

            <img
              class="tw-shot"
              src="/images/digital-twin/cut/stage-00-old.webp"
              alt="Старые очистные сооружения: поля фильтрации, иловые пруды и бетонные отстойники у реки"
              :style="shotStyle(0)"
              decoding="async"
            />
            <canvas ref="canvas" class="tw-points" aria-hidden="true"></canvas>
            <img
              class="tw-shot tw-shot--wire"
              src="/images/digital-twin/cut/stage-02.webp"
              alt="Каркасная BIM-модель новой станции в изометрии"
              :style="shotStyle(1)"
              loading="lazy"
              decoding="async"
            />
            <img
              class="tw-shot"
              src="/images/digital-twin/cut/stage-03-build.webp"
              alt="Новая станция построена на месте старых сооружений, часть старых прудов ещё работает"
              :style="shotStyle(2)"
              loading="lazy"
              decoding="async"
            />
            <img
              class="tw-shot"
              src="/images/digital-twin/cut/stage-04-result.webp"
              alt="Новая станция после рекультивации: на месте старых полей фильтрации лес и газон"
              :style="shotStyle(3)"
              loading="lazy"
              decoding="async"
            />

            <!-- Точки взаимодействия появляются вместе с готовым объектом -->
            <div class="tw-hotspots" :style="{ opacity: hotspotsOn, pointerEvents: hotspotsOn > 0.9 ? 'auto' : 'none' }">
              <div
                v-for="(spot, i) in hotspots"
                :key="spot.title"
                class="tw-hotspot"
                :class="{ 'is-open': openSpot === i }"
                :style="hotspotStyle(spot)"
              >
                <button
                  type="button"
                  class="tw-hotspot-dot"
                  :aria-label="spot.title"
                  :aria-expanded="openSpot === i"
                  @click="openSpot = openSpot === i ? -1 : i"
                  @mouseenter="openSpot = i"
                  @mouseleave="openSpot = -1"
                >
                  <span class="tw-hotspot-pulse"></span>
                </button>
                <div class="tw-hotspot-card" :class="spot.side === 'left' ? 'is-left' : 'is-right'">
                  <span class="tw-hotspot-title">{{ spot.title }}</span>
                  <span class="tw-hotspot-text">{{ spot.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <span class="tw-counter" aria-hidden="true">
            <b>{{ String(active + 1).padStart(2, '0') }}</b> / {{ String(stages.length).padStart(2, '0') }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { TWIN_POINTS, TWIN_POINT_COUNT } from './twinCloud.js'

// Путь объекта от А до Я: старые очистные → скан → проект → стройка на месте
// старого → рекультивация. Так заказчик рассказывает историю на объекте.
const stages = [
  {
    short: 'Обследование объекта',
    title: 'Старые очистные',
    text: 'Приезжаем на объект: советские очистные, поля фильтрации и иловые пруды занимают гектары и уже не справляются с нагрузкой. Оцениваем, какие сооружения ещё жизнеспособны, а какие пора заменить.',
    meta: ['Аудит сооружений', 'Оценка нагрузки', 'Выезд на объект']
  },
  {
    short: 'Сканирование местности',
    title: 'Лидарное сканирование',
    text: 'Лазерное сканирование территории и сооружений с точностью до 1 мм. Собираем облако из миллионов точек — точный слепок рельефа и существующих конструкций для всех дальнейших работ.',
    meta: ['Точность 1 мм', 'Облако точек', 'Без остановки очистки']
  },
  {
    short: 'Проектирование объекта',
    title: 'BIM-проектирование',
    text: 'На облаке точек проектируем новую станцию в Revit: она встаёт на место старых сооружений и занимает в разы меньше площади. Коллизии находим на модели, а не на стройплощадке.',
    meta: ['Revit / IFC', 'Контроль коллизий', 'Рабочая документация']
  },
  {
    short: 'Строительство',
    title: 'Строительство без остановки',
    text: 'Возводим станцию, не останавливая очистку: пока новая не вышла на режим, часть старых прудов продолжает работать. Затем старое демонтируем.',
    meta: ['Шеф-монтаж', 'Пусконаладка', 'Демонтаж старого']
  },
  {
    short: 'Рекультивация и эксплуатация',
    title: 'Рекультивация и эксплуатация',
    text: 'Старые поля фильтрации рекультивируем — на их месте лес или поле. В реку уходит только очищенная вода, а станцией управляет ИИ: IoT-мониторинг и диспетчерский контроль 24/7.',
    meta: ['Рекультивация', 'IoT 24/7', 'ИИ-оптимизация']
  }
]

// Координаты — доли кадра рендера, а не контейнера: кадр вписан по contain,
// и привязка к контейнеру уводила бы метки с объекта на широких экранах.
const hotspots = [
  {
    x: 0.40,
    y: 0.40,
    side: 'right',
    title: 'Аэротенки и отстойники',
    text: 'Датчики качества воды, расхода и давления передают показания в реальном времени.'
  },
  {
    x: 0.60,
    y: 0.44,
    side: 'left',
    title: 'Здание управления',
    text: 'ИИ подбирает режим аэрации и дозирования, SCADA сводит данные в один диспетчерский контур.'
  },
  {
    x: 0.36,
    y: 0.70,
    side: 'right',
    title: 'Периметр и сети',
    text: 'Онлайн-мониторинг узлов и сетей 24/7: отклонение видно раньше, чем оно станет аварией.'
  }
]

const root = ref(null)
const scene = ref(null)
const canvas = ref(null)
const progress = ref(0)
const openSpot = ref(-1)
// Размер сцены нужен и разметке (метки), и канвасу (точки) — держим в ref,
// чтобы метки переезжали вместе с кадром при ресайзе.
const sceneW = ref(0)
const sceneH = ref(0)

// Границы между этапами и ширина кроссфейда — в долях общего прогресса блока.
const STOPS = [0.17, 0.37, 0.57, 0.77]
const FADE = 0.08
// Когда вступает каждый кадр: старые очистные, BIM-каркас, стройка, итог.
const SHOT_AT = [0, STOPS[1], STOPS[2], STOPS[3]]

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// Насколько кадр i вступил: 0 — ещё не показан, 1 — полностью накрыл нижние.
// Переход заканчивается ровно на своей отметке, а не сидит верхом на ней:
// иначе в момент, когда в рельсе загорается следующий шаг, предыдущий кадр
// ещё наполовину виден и просвечивает из-под нового.
const layer = (i) => {
  if (i === 0) return 1
  return smoothstep(SHOT_AT[i] - FADE, SHOT_AT[i], progress.value)
}

// Приходящий кадр не просто проявляется, а «вычерчивается» снизу вверх:
// маска идёт фронтом, поэтому BIM-каркас читается как построение, стройка —
// как материализация поверх чертежа, а итог — как уход старых прудов под лес.
const shotStyle = (i) => {
  const a = layer(i)
  if (i === 0) {
    // На скане и проекте старые очистные уходят в тень: иначе пестрота
    // прудов спорит с облаком точек и линиями BIM.
    const dim = smoothstep(STOPS[0] - FADE, STOPS[0], progress.value)
    return {
      opacity: +(1 - layer(2)).toFixed(3),
      zIndex: 1,
      filter: `brightness(${(1 - 0.55 * dim).toFixed(3)}) saturate(${(1 - 0.65 * dim).toFixed(3)})`
    }
  }
  const edge = a * 118 - 9
  // Каркас гаснет под стройкой, чтобы линии не просвечивали за границами объекта.
  const fade = i === 1 ? 1 - layer(2) : 1
  return {
    opacity: a > 0 ? +fade.toFixed(3) : 0,
    zIndex: i + 2,
    transform: `scale(${(1.015 - 0.015 * a).toFixed(4)})`,
    maskImage: `linear-gradient(to top, #000 ${edge}%, rgba(0,0,0,0) ${edge + 9}%)`,
    WebkitMaskImage: `linear-gradient(to top, #000 ${edge}%, rgba(0,0,0,0) ${edge + 9}%)`
  }
}

const active = computed(() => STOPS.filter((s) => progress.value >= s).length)

// Заполнение полоски у шага: 0 — не начат, 1 — пройден.
const stageFill = (i) => {
  const from = i === 0 ? 0 : STOPS[i - 1]
  const to = i === stages.length - 1 ? 1 : STOPS[i]
  return +clamp01((progress.value - from) / (to - from)).toFixed(3)
}

const hotspotsOn = computed(() => +smoothstep(STOPS[3] + 0.04, STOPS[3] + 0.11, progress.value).toFixed(3))

// Метка садится в тот же вписанный прямоугольник, что и сам кадр объекта.
const hotspotStyle = (spot) => {
  const w = sceneW.value
  const h = sceneH.value
  if (!w || !h) return { left: spot.x * 100 + '%', top: spot.y * 100 + '%' }
  let dw = w
  let dh = w / SHOT_RATIO
  if (dh > h) {
    dh = h
    dw = h * SHOT_RATIO
  }
  return {
    left: ((w - dw) / 2 + spot.x * dw) + 'px',
    top: ((h - dh) / 2 + spot.y * dh) + 'px'
  }
}

const scrollToStage = (i) => {
  const el = root.value
  if (!el) return
  const range = el.offsetHeight - window.innerHeight
  const edges = [0, ...STOPS, 1]
  const centers = STOPS.concat(1).map((to, k) => (edges[k] + to) / 2)
  window.scrollTo({ top: el.offsetTop + centers[i] * range, behavior: 'smooth' })
}

// ── Облако точек ────────────────────────────────────────────────────────
// На первом этапе точки рассыпаны по площадке — это координаты изометрического
// ромба (u, v ∈ [0,1]). На втором они перелетают в позиции с карты конструктива
// реального объекта, поэтому облако собирается не в абстрактную сетку, а в
// очертания сооружений, которые дальше и достраиваются каркасом.
const POINTS = TWIN_POINT_COUNT
let pts = []
let ctx = null
let raf = 0
let scrollRaf = 0
let ro = null
let reduced = false
let width = 0
let height = 0

// Палитра jet, которой лидарные программы красят облако по высоте.
const lidarColor = (t) => {
  const c = clamp01(t)
  const ch = (x) => Math.round(255 * clamp01(1.5 - Math.abs(4 * c - x)))
  return [ch(3), ch(2), ch(1)]
}

const buildPoints = () => {
  pts = []
  for (let i = 0; i < POINTS; i++) {
    const u = Math.random()
    const v = Math.random()
    // лёгкий рельеф, чтобы облако повторяло холмы, а не лежало плоско
    const relief = Math.sin(u * 6.1) * Math.cos(v * 5.3) * 0.035 + Math.sin((u + v) * 3.4) * 0.02
    pts.push({
      u,
      v,
      relief,
      // Цель на этапе проектирования — точка конструктива объекта, в долях кадра.
      tx: TWIN_POINTS[i * 2],
      ty: TWIN_POINTS[i * 2 + 1],
      size: 1.3 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      // Цвет — как у настоящего лидара: по высоте и глубине, синий → жёлтый → красный.
      rgb: lidarColor(0.12 + (1 - (u + v) / 2) * 0.62 + relief * 5 + (Math.random() - 0.5) * 0.12)
    })
  }
}

const resizeCanvas = () => {
  const el = canvas.value
  const box = scene.value
  if (!el || !box) return
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  width = box.clientWidth
  height = box.clientHeight
  sceneW.value = width
  sceneH.value = height
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  el.style.width = width + 'px'
  el.style.height = height + 'px'
  ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

// Рендеры лежат в контейнере как object-fit: contain, поэтому и точки, и
// метки кладём в тот же вписанный прямоугольник кадра.
const SHOT_RATIO = 1536 / 1024
const shotRect = () => {
  let dw = width
  let dh = width / SHOT_RATIO
  if (dh > height) {
    dh = height
    dw = height * SHOT_RATIO
  }
  return [(width - dw) / 2, (height - dh) / 2, dw, dh]
}

// Углы верхней грани участка на рендерах, в долях кадра:
// левый, дальний, правый, ближний.
const CORNERS = [[0.003, 0.427], [0.497, 0.008], [0.997, 0.43], [0.499, 0.918]]

// Экранная позиция точки участка (u, v ∈ [0,1]) — билинейно по углам грани.
const project = (u, v, lift) => {
  const [ox, oy, dw, dh] = shotRect()
  const [l, t, r, b] = CORNERS
  const k = [(1 - u) * (1 - v), u * (1 - v), u * v, (1 - u) * v]
  const x = k[0] * l[0] + k[1] * t[0] + k[2] * r[0] + k[3] * b[0]
  const y = k[0] * l[1] + k[1] * t[1] + k[2] * r[1] + k[3] * b[1]
  return [ox + x * dw, oy + y * dh - lift * dh]
}

const draw = (time) => {
  raf = 0
  if (!ctx) return
  const p = progress.value
  // фазы: скан старой площадки → сборка в конструктив новой станции →
  // уход под кадр стройки
  const scan = clamp01((p - (STOPS[0] - FADE)) / (STOPS[1] - 0.03 - (STOPS[0] - FADE)))
  const morph = smoothstep(STOPS[1] - 0.05, STOPS[2] - 0.06, p)
  const vanish = 1 - smoothstep(STOPS[2] - FADE, STOPS[2], p)

  ctx.clearRect(0, 0, width, height)
  if (vanish <= 0.001 || scan <= 0) return

  const t = time * 0.001
  const [ox, oy, dw, dh] = shotRect()

  for (let i = 0; i < pts.length; i++) {
    const pt = pts[i]
    const depth = (pt.u + pt.v) / 2
    // точка «просыпается» ровно в тот момент, когда через неё прошёл луч
    const born = clamp01((scan - depth) * 7)
    if (born <= 0) continue

    // Старт — точка на площадке, финиш — точка конструктива объекта.
    const [sx, sy] = project(pt.u, pt.v, pt.relief * (1 - morph))
    let x = sx
    let y = sy
    if (morph > 0) {
      x = sx + (ox + pt.tx * dw - sx) * morph
      y = sy + (oy + pt.ty * dh - sy) * morph
    }

    const twinkle = reduced ? 1 : 0.72 + 0.28 * Math.sin(t * 2 + pt.phase)
    const alpha = born * vanish * twinkle
    const size = pt.size + morph * 0.5
    // На проекте облако остывает в фирменный голубой — в цвет каркаса BIM.
    const [cr, cg, cb] = pt.rgb
    const r = Math.round(cr + (60 - cr) * morph)
    const g = Math.round(cg + (210 - cg) * morph)
    const b = Math.round(cb + (255 - cb) * morph)
    // ореол + ядро: точка читается и на траве, и на тёмном фоне,
    // при этом дешевле, чем shadowBlur на каждой из полутора тысяч точек
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.22).toFixed(3)})`
    ctx.fillRect(x - size, y - size, size * 3, size * 3)
    ctx.fillStyle = `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, ${Math.min(1, alpha * 0.95).toFixed(3)})`
    ctx.fillRect(x, y, size, size)
  }

  // Луч сканера: линия постоянной глубины u + v, обрезанная краями участка
  if (scan > 0.001 && scan < 1) {
    const d = scan * 2
    const [x1, y1] = d <= 1 ? project(d, 0, 0) : project(1, d - 1, 0)
    const [x2, y2] = d <= 1 ? project(0, d, 0) : project(d - 1, 1, 0)
    const grad = ctx.createLinearGradient(x1, y1, x2, y2)
    grad.addColorStop(0, 'rgba(0,212,255,0)')
    grad.addColorStop(0.5, 'rgba(160,255,120,0.95)')
    grad.addColorStop(1, 'rgba(0,212,255,0)')
    ctx.strokeStyle = grad
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.globalAlpha = 0.25
    ctx.lineWidth = 26
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  if (!reduced && vanish > 0.001) raf = requestAnimationFrame(draw)
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

// Кадры проекта, стройки и итога нужны уже через пол-экрана прокрутки, а lazy-загрузка
// стартует слишком поздно — к переходу картинка не успевает декодироваться.
const prefetchStages = () => {
  for (const src of ['/images/digital-twin/cut/stage-02.webp', '/images/digital-twin/cut/stage-03-build.webp', '/images/digital-twin/cut/stage-04-result.webp']) {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  }
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  buildPoints()
  if ('requestIdleCallback' in window) requestIdleCallback(prefetchStages, { timeout: 3000 })
  else setTimeout(prefetchStages, 1200)
  resizeCanvas()
  readProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => {
      resizeCanvas()
      requestDraw()
    })
    if (scene.value) ro.observe(scene.value)
  } else {
    window.addEventListener('resize', resizeCanvas)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', resizeCanvas)
  if (raf) cancelAnimationFrame(raf)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  ro?.disconnect()
})
</script>

<style scoped>
/* Сцена держится на sticky, а не на пине GSAP: пин кэширует размеры и после
   поздней загрузки соседних медиа промахивается мимо секции. */
.tw-scroll {
  --ink: #eef3f8;
  --dim: rgba(238, 243, 248, 0.6);
  --line: rgba(255, 255, 255, 0.09);
  --lidar: #00d4ff;
  position: relative;
  height: 520vh;
  background: #0e1116;
}

.tw-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(120% 90% at 78% 18%, #182231 0%, #0e1116 58%, #090b0f 100%);
  color: var(--ink);
}

/* Техническая сетка «пола» и мягкий свет над объектом */
.tw-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 68px 68px;
  mask-image: radial-gradient(78% 66% at 70% 52%, #000 0%, rgba(0, 0, 0, 0.25) 62%, transparent 100%);
  -webkit-mask-image: radial-gradient(78% 66% at 70% 52%, #000 0%, rgba(0, 0, 0, 0.25) 62%, transparent 100%);
  opacity: 0.85;
}
.tw-glow {
  position: absolute;
  top: -22%;
  right: 2%;
  width: 70vw;
  height: 70vw;
  max-width: 900px;
  max-height: 900px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.14) 0%, rgba(0, 212, 255, 0) 62%);
  pointer-events: none;
}

.tw-layout {
  position: relative;
  z-index: 2;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 5vw, 5.5rem);
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
  align-items: center;
  gap: clamp(1.5rem, 4vw, 4rem);
}

/* ── Левая колонка ── */
.tw-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--dim);
}
.tw-eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--lidar);
  box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.18);
}

.tw-title {
  margin: 1.1rem 0 0;
  font-size: clamp(1.8rem, 3.1vw, 3.1rem);
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.015em;
}
.tw-title-accent {
  color: rgba(238, 243, 248, 0.42);
}

/* Тексты этапов лежат стопкой: высота колонки не скачет при переключении */
.tw-copy {
  position: relative;
  margin-top: clamp(1.25rem, 2.6vh, 2rem);
  min-height: 11.5rem;
}
/* Уходящий текст гаснет быстро, приходящий вступает с задержкой: на быстрой
   прокрутке два описания иначе читаются наложенными друг на друга. */
.tw-copy-item {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.12s ease, transform 0.12s ease;
  pointer-events: none;
}
.tw-copy-item.is-active {
  opacity: 1;
  transform: none;
  transition: opacity 0.3s ease 0.12s, transform 0.3s ease 0.12s;
}
.tw-copy-text {
  max-width: 34rem;
  font-size: clamp(0.95rem, 1.05vw, 1.08rem);
  line-height: 1.62;
  color: var(--dim);
}
.tw-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1.1rem;
  list-style: none;
  padding: 0;
}
.tw-meta-item {
  padding: 0.34rem 0.7rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(238, 243, 248, 0.72);
  background: rgba(255, 255, 255, 0.03);
}

.tw-rail {
  list-style: none;
  margin: clamp(1.25rem, 3vh, 2.25rem) 0 0;
  padding: 0;
  border-top: 1px solid var(--line);
}
.tw-step {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 0.85rem 0 0.9rem;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: none;
  color: rgba(238, 243, 248, 0.5);
  text-align: left;
  cursor: pointer;
  transition: color 0.25s ease;
}
.tw-step:hover { color: rgba(238, 243, 248, 0.82); }
.tw-step.is-active { color: var(--ink); }
.tw-step:focus-visible {
  outline: 2px solid var(--lidar);
  outline-offset: 3px;
}
.tw-step-num {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
  color: inherit;
  opacity: 0.75;
}
.tw-step.is-active .tw-step-num { color: var(--lidar); opacity: 1; }
.tw-step-name {
  font-size: clamp(0.95rem, 1.15vw, 1.12rem);
  font-weight: 600;
  letter-spacing: 0.01em;
}
/* Заголовок этапа над текстом нужен только на узком экране, где рельс
   сжат до полосок без подписей */
.tw-copy-title { display: none; }

/* Пять этапов на невысоком ноутбуке: рельс ужимаем, чтобы влез целиком */
@media (min-width: 1025px) and (max-height: 860px) {
  .tw-step { padding: 0.55rem 0 0.6rem; }
  .tw-step-track { margin-top: 0.4rem !important; }
  .tw-rail { margin-top: 1rem; }
}

.tw-step-track {
  grid-column: 1 / -1;
  height: 2px;
  margin-top: 0.55rem;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.tw-step-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--lidar), #6ce7ff);
  transform-origin: left center;
  transform: scaleX(0);
}

/* ── Сцена ── */
.tw-stage {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tw-scene {
  position: relative;
  width: 100%;
  max-width: 68rem;
  aspect-ratio: 3 / 2;
}
.tw-shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  will-change: opacity, transform;
}
.tw-shot--wire {
  filter: drop-shadow(0 0 18px rgba(0, 150, 255, 0.35));
}
.tw-points {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}
/* Подложка-тень: остров не висит в пустоте */
.tw-shadow {
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: 12%;
  height: 22%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 70%);
  filter: blur(6px);
  z-index: 0;
}

.tw-counter {
  position: absolute;
  top: clamp(1rem, 5vh, 3rem);
  right: 0;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  color: rgba(238, 243, 248, 0.48);
  font-variant-numeric: tabular-nums;
}
.tw-counter b { color: var(--lidar); font-weight: 700; }

/* ── Хотспоты ── */
.tw-hotspots {
  position: absolute;
  inset: 0;
  z-index: 6;
  transition: opacity 0.3s ease;
}
.tw-hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  /* Без явного слоя точки соседних меток рисовались поверх раскрытой плашки
     и лезли прямо в текст. Раскрытая метка поднимается над всеми. */
  z-index: 1;
}
.tw-hotspot.is-open {
  z-index: 6;
}
.tw-hotspot-dot {
  position: relative;
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: rgba(0, 212, 255, 0.9);
  cursor: pointer;
  padding: 0;
}
.tw-hotspot-dot:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}
/* Метка маленькая по рисунку, но зона нажатия должна быть пальцевой */
.tw-hotspot-dot::after {
  content: '';
  position: absolute;
  inset: -14px;
}
.tw-hotspot-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(0, 212, 255, 0.75);
  animation: tw-pulse 2.4s ease-out infinite;
}
@keyframes tw-pulse {
  0% { transform: scale(0.75); opacity: 0.9; }
  70% { transform: scale(1.9); opacity: 0; }
  100% { transform: scale(1.9); opacity: 0; }
}
.tw-hotspot-card {
  position: absolute;
  top: 50%;
  width: max-content;
  max-width: 15rem;
  transform: translateY(-50%) scale(0.96);
  display: grid;
  gap: 0.3rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.7rem;
  background: rgba(10, 13, 18, 0.92);
  backdrop-filter: blur(8px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.tw-hotspot-card.is-right { left: 28px; }
.tw-hotspot-card.is-left { right: 28px; }
.tw-hotspot.is-open .tw-hotspot-card {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}
.tw-hotspot-title {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--lidar);
}
.tw-hotspot-text {
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(238, 243, 248, 0.82);
}

/* ── Планшет и мобильные ── */
@media (max-width: 1024px) {
  .tw-scroll { height: 470vh; }
  .tw-layout {
    grid-template-columns: 1fr;
    align-content: center;
    gap: clamp(0.75rem, 2.5vh, 1.75rem);
    padding-top: clamp(1.5rem, 6vh, 3rem);
    padding-bottom: clamp(1.5rem, 5vh, 3rem);
  }
  .tw-stage { order: -1; height: auto; }
  /* На узком экране сцена берёт долю высоты, а не пропорцию: иначе панель с
     текстом и рельсом не помещается в один экран sticky. */
  .tw-scene {
    max-width: 34rem;
    aspect-ratio: auto;
    height: clamp(190px, 31vh, 330px);
  }
  .tw-counter { top: 0; }
  .tw-title { font-size: clamp(1.35rem, 5vw, 2.1rem); margin-top: 0.8rem; }
  .tw-copy { min-height: 10.5rem; margin-top: 0.9rem; }
  .tw-copy-text { font-size: 0.92rem; line-height: 1.5; }
  .tw-meta { margin-top: 0.8rem; }
  /* Пять этапов столбиком не помещаются в экран: рельс становится строкой
     из полосок с номерами, а название этапа выводится над текстом */
  .tw-rail {
    margin-top: 0.9rem;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.5rem;
    border-top: 0;
  }
  .tw-step { padding: 0.35rem 0 0.2rem; border-bottom: 0; gap: 0.3rem; }
  .tw-step-name { display: none; }
  .tw-step-track { margin-top: 0.3rem; }
  .tw-copy-title {
    display: block;
    margin-bottom: 0.45rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--lidar);
  }
  .tw-hotspot-card { max-width: 13rem; }
}

@media (max-width: 640px) {
  .tw-copy { min-height: 11rem; }
  /* Чипы (SCADA-интеграция, ИИ-оптимизация и т.п.) держим одной горизонтальной
     строкой с прокруткой: столбиком они выстраивались и наезжали на рельс
     шагов («01 Сканирование местности») ниже, а в одну строку помещаются. */
  .tw-meta {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    gap: 0.4rem;
    scrollbar-width: none;
    padding-bottom: 0.15rem;
  }
  .tw-meta::-webkit-scrollbar { display: none; }
  .tw-meta-item {
    flex: 0 0 auto;
    white-space: nowrap;
    font-size: 0.66rem;
    padding: 0.28rem 0.55rem;
  }
  .tw-hotspot-card.is-right,
  .tw-hotspot-card.is-left {
    left: 50%;
    right: auto;
    top: 26px;
    transform: translate(-50%, 0) scale(0.96);
  }
  .tw-hotspot.is-open .tw-hotspot-card { transform: translate(-50%, 0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .tw-hotspot-pulse { animation: none; }
  .tw-copy-item { transition: none; }
}
</style>

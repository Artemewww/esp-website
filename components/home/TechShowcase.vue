<template>
  <section ref="root" class="tw-scroll" data-immersive aria-label="Цифровой двойник объекта">
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
              alt="Участок со старыми советскими очистными: прямоугольные отстойники, поля фильтрации и пруды у реки"
              :style="shotStyle(0)"
              decoding="async"
            />
            <img
              class="tw-shot"
              src="/images/digital-twin/cut/stage-01-lidar.webp"
              alt="Лидарное облако точек участка: высоты окрашены от синего к красному"
              :style="shotStyle(1)"
              loading="lazy"
              decoding="async"
            />
            <img
              class="tw-shot tw-shot--wire"
              src="/images/digital-twin/cut/stage-02-design.webp"
              alt="Линии проекта новой станции поверх облака точек"
              :style="shotStyle(2)"
              loading="lazy"
              decoding="async"
            />
            <img
              class="tw-shot"
              src="/images/digital-twin/cut/stage-03-build.webp"
              alt="Стройка: новая станция на месте старых сооружений, часть старых прудов ещё работает"
              :style="shotStyle(3)"
              loading="lazy"
              decoding="async"
            />
            <img
              class="tw-shot"
              src="/images/digital-twin/cut/stage-05-launch.webp"
              alt="Запуск: новая станция, на месте старых полей фильтрации лес и газон"
              :style="shotStyle(4)"
              loading="lazy"
              decoding="async"
            />
            <!-- Дрон с лидаром и луч сканера -->
            <canvas ref="canvas" class="tw-points" aria-hidden="true"></canvas>

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
                <div class="tw-hotspot-card" :class="hotspotSide(spot)">
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
import { stableVh } from '~/composables/useStableVh'
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Путь объекта от А до Я — как рассказывает заказчик: старые советские
// очистные → лидар с дрона → линии проекта → стройка → запуск.
const stages = [
  {
    short: 'Старые сооружения',
    title: 'Земля со старыми сооружениями',
    text: 'Приезжаем на объект: советские очистные — бетонные отстойники, поля фильтрации и иловые пруды — занимают гектары и уже не справляются с нагрузкой.',
    meta: ['Выезд на объект', 'Аудит сооружений', 'Оценка нагрузки']
  },
  {
    short: 'Лидарное сканирование',
    title: 'Лидарное сканирование',
    text: 'Дрон с лидаром облетает площадку и собирает облако из миллионов точек с сантиметровой точностью — точный слепок рельефа и всех существующих сооружений.',
    meta: ['LiDAR на БПЛА', 'Облако точек', 'Без остановки очистки']
  },
  {
    short: 'Проектирование',
    title: 'Проектирование',
    text: 'На облаке точек рисуем линии новой станции: она встаёт на место старых сооружений и занимает в разы меньше площади. Жизнеспособное оставляем, остальное — под демонтаж.',
    meta: ['3D / BIM', 'Контроль коллизий', 'Меньше площадь застройки']
  },
  {
    short: 'Стройка',
    title: 'Стройка',
    text: 'Строим станцию на месте снесённых сооружений, не останавливая очистку: часть старых прудов работает, пока новая не выйдет на режим. Добавляем новые иловые площадки.',
    meta: ['Шеф-монтаж', 'Без остановки очистки', 'Иловые площадки']
  },
  {
    short: 'Запуск',
    title: 'Запуск',
    text: 'Станция запущена. Старые поля фильтрации сносим и рекультивируем — на их месте лес или поле. В реку уходит только очищенная вода, станцией управляет ИИ 24/7.',
    meta: ['Рекультивация', 'IoT 24/7', 'ИИ-управление']
  }
]

// Координаты — доли кадра рендера, а не контейнера: кадр вписан по contain,
// и привязка к контейнеру уводила бы метки с объекта на широких экранах.
const hotspots = [
  {
    x: 0.545,
    y: 0.30,
    side: 'left',
    title: 'Новые иловые площадки',
    text: 'Осадок обезвоживается на компактных площадках рядом со станцией — вместо гектаров старых прудов.'
  },
  {
    x: 0.330,
    y: 0.560,
    side: 'right',
    title: 'Рекультивация',
    text: 'На месте снесённых полей фильтрации — лес и газон. Площадь застройки сократилась в разы.'
  },
  {
    x: 0.385,
    y: 0.330,
    side: 'right',
    title: 'Аэротенки и отстойники',
    text: 'Датчики качества воды, расхода и давления передают показания в реальном времени.'
  },
  {
    x: 0.618,
    y: 0.575,
    side: 'left',
    title: 'Здание управления',
    text: 'ИИ подбирает режим аэрации и дозирования, SCADA сводит данные в один диспетчерский контур.'
  },
  {
    x: 0.823,
    y: 0.585,
    side: 'left',
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

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// Насколько кадр i вступил: 0 — ещё не показан, 1 — полностью накрыл нижние.
// Кадры: 0 старые очистные, 1 облако лидара, 2 линии проекта, 3 стройка, 4 запуск.
// Облако проявляется медленно, весь второй этап — вслед за дроном.
const layer = (i) => {
  const p = progress.value
  if (i === 0) return 1
  if (i === 1) return smoothstep(STOPS[0] - 0.04, STOPS[1] - 0.05, p)
  return smoothstep(STOPS[i - 1] - FADE, STOPS[i - 1], p)
}

// Приходящий кадр «вычерчивается» снизу вверх фронтом маски.
const shotStyle = (i) => {
  const a = layer(i)
  if (i === 0) {
    return { opacity: +(1 - layer(3)).toFixed(3), zIndex: 1 }
  }
  const edge = a * 118 - 9
  const mask = `linear-gradient(to top, #000 ${edge}%, rgba(0,0,0,0) ${edge + 9}%)`
  const style = {
    opacity: a > 0 ? 1 : 0,
    zIndex: i + 1,
    transform: `scale(${(1.015 - 0.015 * a).toFixed(4)})`,
    maskImage: mask,
    WebkitMaskImage: mask
  }
  if (i === 1) {
    // Под линиями проекта облако приглушаем, чтобы читался чертёж
    const dim = layer(2)
    style.filter = `brightness(${(1 - 0.55 * dim).toFixed(3)})`
    style.opacity = a > 0 ? +(1 - layer(3)).toFixed(3) : 0
    if (a >= 1) { style.maskImage = 'none'; style.WebkitMaskImage = 'none' }
  }
  if (i === 2) style.opacity = a > 0 ? +(1 - layer(3)).toFixed(3) : 0
  return style
}

// Метка «NEW» над новой станцией — только на этапе проектирования
const active = computed(() => STOPS.filter((s) => progress.value >= s).length)

// Заполнение полоски у шага: 0 — не начат, 1 — пройден.
const stageFill = (i) => {
  const from = i === 0 ? 0 : STOPS[i - 1]
  const to = i === stages.length - 1 ? 1 : STOPS[i]
  return +clamp01((progress.value - from) / (to - from)).toFixed(3)
}

const hotspotsOn = computed(() => +smoothstep(STOPS[3] + 0.04, STOPS[3] + 0.11, progress.value).toFixed(3))

// Метка садится в тот же вписанный прямоугольник, что и сам кадр объекта.
const hotspotSide = (spot) => {
  const w = sceneW.value
  if (!w) return spot.side === 'left' ? 'is-left' : 'is-right'
  let dw = w
  if (w / SHOT_RATIO > sceneH.value) dw = sceneH.value * SHOT_RATIO
  return (w - dw + spot.x * dw) > w * 0.55 ? 'is-left' : 'is-right'
}

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
  // Кадр прижат к правому краю — метки считаем от того же края.
  const left = w - dw + spot.x * dw
  // Сколько места под карточку с каждой стороны и при выносе по центру
  // (так она раскрывается на телефоне). Без этих чисел карточка у края
  // объекта уезжала за экран.
  const side = left > w * 0.55 ? 'left' : 'right'
  const sideMax = Math.max(120, (side === 'left' ? left : w - left) - 36)
  const centerMax = Math.max(120, 2 * Math.min(left, w - left) - 24)
  return {
    left: left + 'px',
    top: ((h - dh) / 2 + spot.y * dh) + 'px',
    '--card-side-max': sideMax + 'px',
    '--card-center-max': centerMax + 'px'
  }
}

const scrollToStage = (i) => {
  const el = root.value
  if (!el) return
  const range = el.offsetHeight - stableVh()
  const edges = [0, ...STOPS, 1]
  const centers = STOPS.concat(1).map((to, k) => (edges[k] + to) / 2)
  window.scrollTo({ top: el.offsetTop + centers[i] * range, behavior: 'smooth' })
}

// ── Дрон с лидаром ──────────────────────────────────────────────────────
// На втором этапе над площадкой пролетает дрон: веер лазера упирается в
// фронт, за которым старая площадка превращается в облако точек.
let ctx = null
let raf = 0
let scrollRaf = 0
let ro = null
let reduced = false
let width = 0
let height = 0
let lastW = 0
let lastH = 0

const resizeCanvas = () => {
  const el = canvas.value
  const box = scene.value
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
  sceneW.value = width
  sceneH.value = height
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  el.style.width = width + 'px'
  el.style.height = height + 'px'
  ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

// Кадры лежат в контейнере как object-fit: contain — считаем вписанный прямоугольник
const SHOT_RATIO = 1227 / 975
const shotRectFor = (w, h) => {
  let dw = w
  let dh = w / SHOT_RATIO
  if (dh > h) {
    dh = h
    dw = h * SHOT_RATIO
  }
  return [w - dw, (h - dh) / 2, dw, dh]
}

// Углы верхней грани участка на кадрах, в долях кадра: левый, дальний, правый, ближний
const CORNERS = [[0.020, 0.410], [0.468, 0.000], [1.000, 0.489], [0.553, 0.905]]

// Горизонталь y пересекает ромб участка: возвращаем её левый и правый край
const spanAt = (y) => {
  const [ox, oy, dw, dh] = shotRectFor(width, height)
  const pts = CORNERS.map(([x, yy]) => [ox + x * dw, oy + yy * dh])
  const xs = []
  for (let i = 0; i < 4; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % 4]
    if ((y - y1) * (y - y2) <= 0 && y1 !== y2) xs.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1))
  }
  if (xs.length < 2) return null
  return [Math.min(...xs), Math.max(...xs)]
}

// Дрон — снимок реального аппарата: векторная схема рядом с фотокадрами
// площадки читалась как иконка из другого макета.
const droneImg = typeof Image !== 'undefined' ? new Image() : null
if (droneImg) {
  droneImg.decoding = 'async'
  droneImg.src = '/images/digital-twin/drone.webp'
  droneImg.onload = () => requestDraw()
}
// Ширина аппарата в кадре: растёт вместе со сценой, но не мельчает до точки
// на телефоне и не заслоняет площадку на большом мониторе.
const droneWidth = (dw) => Math.min(190, Math.max(86, dw * 0.155))

const drawDrone = (x, y, w) => {
  if (!droneImg || !droneImg.naturalWidth) return
  const h = w * droneImg.naturalHeight / droneImg.naturalWidth
  ctx.drawImage(droneImg, x - w / 2, y - h / 2, w, h)
}

const draw = (time) => {
  raf = 0
  if (!ctx) return
  const p = progress.value
  const t = time * 0.001
  ctx.clearRect(0, 0, width, height)

  // Дрон виден, пока идёт скан (второй этап)
  const a = layer(1)
  const on = smoothstep(STOPS[0] - 0.05, STOPS[0], p) * (1 - smoothstep(STOPS[1] - 0.06, STOPS[1] - 0.02, p))
  if (on > 0.01) {
    // Фронт маски облака: та же формула, что в shotStyle
    const edge = a * 118 - 9
    const fy = height * (1 - (edge + 4.5) / 100)
    const span = spanAt(Math.min(height - 1, Math.max(1, fy)))
    if (span) {
      const [x1, x2] = span
      const cx = (x1 + x2) / 2
      const half = (x2 - x1) / 2
      const dx = reduced ? 0 : Math.sin(t * 1.3) * half * 0.45
      const droneX = cx + dx
      const dWidth = droneWidth(shotRectFor(width, height)[2])
      // Подвес с лидаром висит под корпусом — оттуда и бьёт луч.
      const dBelly = dWidth * 0.17
      const droneY = Math.max(dWidth * 0.22, fy - height * 0.24) + (reduced ? 0 : Math.sin(t * 2.1) * 4)
      ctx.globalAlpha = on
      // веер лазера
      const spread = Math.max(40, half * 0.5)
      const grad = ctx.createLinearGradient(0, droneY, 0, fy)
      grad.addColorStop(0, 'rgba(255, 150, 60, 0.05)')
      grad.addColorStop(1, 'rgba(120, 236, 255, 0.28)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(droneX, droneY + dBelly)
      ctx.lineTo(Math.max(x1, droneX - spread), fy)
      ctx.lineTo(Math.min(x2, droneX + spread), fy)
      ctx.closePath()
      ctx.fill()
      // отдельные лучи
      ctx.strokeStyle = 'rgba(160, 245, 255, 0.35)'
      ctx.lineWidth = 1
      for (let k = -3; k <= 3; k++) {
        const jitter = reduced ? 0 : Math.sin(t * 9 + k) * 6
        ctx.beginPath()
        ctx.moveTo(droneX, droneY + dBelly)
        ctx.lineTo(droneX + (k / 3) * spread + jitter, fy)
        ctx.stroke()
      }
      // линия сканирования по всей ширине участка
      const lg = ctx.createLinearGradient(x1, 0, x2, 0)
      lg.addColorStop(0, 'rgba(120,236,255,0)')
      lg.addColorStop(0.5, 'rgba(190,255,150,0.95)')
      lg.addColorStop(1, 'rgba(120,236,255,0)')
      ctx.strokeStyle = lg
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x1, fy)
      ctx.lineTo(x2, fy)
      ctx.stroke()
      drawDrone(droneX, droneY, dWidth)
      ctx.globalAlpha = 1
    }
    if (!reduced) raf = requestAnimationFrame(draw)
  }
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

// Кадры проекта, стройки и итога нужны уже через пол-экрана прокрутки, а lazy-загрузка
// стартует слишком поздно — к переходу картинка не успевает декодироваться.
const prefetchStages = () => {
  for (const src of ['/images/digital-twin/cut/stage-01-lidar.webp', '/images/digital-twin/cut/stage-02-design.webp', '/images/digital-twin/cut/stage-03-build.webp', '/images/digital-twin/cut/stage-05-launch.webp']) {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  }
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
  /* На телефонах адресная строка то прячется, то возвращается, и 100vh
     скачет вместе с ней — секция дёргалась прямо во время прокрутки.
     svh — «маленькая» высота окна, она постоянна. Строка выше остаётся
     запасным вариантом для старых браузеров. */
  height: 100svh;
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
  /* Справа отступа нет: у кадра срезан угол, он должен упираться в край
     экрана. Слева текст держит ту же линию, что и .container-custom
     (max-w-7xl + гуттер) остального сайта. */
  padding: 0 0 0 max(1.5rem, calc((100% - 80rem) / 2 + 1.5rem));
  display: grid;
  /* Текст не растягиваем бесконечно: всё, что шире, отдаём сцене — на широком
     мониторе объект крупнее, а колонка текста остаётся читаемой. */
  grid-template-columns: minmax(0, clamp(17.5rem, 32vw, 34rem)) minmax(0, 1fr);
  align-items: center;
  gap: clamp(1.25rem, 3vw, 3rem);
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
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.tw-scene {
  position: relative;
  width: min(100%, calc(92vh * (1227 / 975)));
  max-width: none;
  height: auto;
  aspect-ratio: 1227 / 975;
  margin-left: auto;
}
.tw-shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: right center;
  will-change: opacity, transform;
}
.tw-shot--wire {
  filter: drop-shadow(0 0 18px rgba(0, 150, 255, 0.35));
}
.tw-points {
  position: absolute;
  inset: 0;
  z-index: 7;
  pointer-events: none;
}
/* Подложка-тень: остров не висит в пустоте */
.tw-shadow {
  /* Полутень под площадкой: центр совпадает с ближним углом кадра (54% по
     ширине, низ — на 93% высоты), иначе тень уезжает от объекта. */
  position: absolute;
  left: 6%;
  right: 4%;
  bottom: 2%;
  height: 20%;
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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(0, 212, 255, 0.92);
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
  inset: -5px;
  border-radius: 50%;
  border: 1px solid rgba(0, 212, 255, 0.55);
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
  max-width: min(15rem, var(--card-side-max, 15rem));
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
.tw-hotspot-card.is-right { left: 22px; }
.tw-hotspot-card.is-left { right: 22px; }
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
    /* Текст получает поле справа, а кадр выходит за него обратной
       отрицательной отбивкой — объект остаётся прижат к краю. */
    padding: clamp(1.5rem, 6vh, 3rem) 1.25rem clamp(1.5rem, 5vh, 3rem) 1.25rem;
  }
  /* Площадка занимает всю ширину экрана: поля секции снимаем с обеих
     сторон, иначе кадр стоит в рамке и объект мельчает. */
  .tw-stage { order: -1; height: auto; margin-left: -1.25rem; margin-right: -1.25rem; }
  /* На узком экране сцена берёт долю высоты, а не пропорцию: иначе панель с
     текстом и рельсом не помещается в один экран sticky. */
  .tw-scene {
    width: 100%;
    max-width: none;
    /* Держим пропорции кадра — так объект занимает всю ширину без полей
       по бокам, а высота получается сама. */
    aspect-ratio: 1227 / 975;
    height: auto;
    max-height: 40vh;
  }
  /* Счётчик этапов на телефоне убираем: он висел в правом верхнем углу
     поверх кадра и ничего не добавлял. */
  .tw-counter { display: none; }
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
    top: 22px;
    transform: translate(-50%, 0) scale(0.96);
    max-width: min(15rem, var(--card-center-max, 15rem));
  }
  .tw-hotspot.is-open .tw-hotspot-card { transform: translate(-50%, 0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .tw-hotspot-pulse { animation: none; }
  .tw-copy-item { transition: none; }
}
</style>

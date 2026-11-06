<template>
  <!-- «О компании» в подаче jazakvoda.rs: загрузка с наполняющимся знаком,
       история на прокрутке (вид сверху → слои объекта → природа → знак
       качества), звуковой фон по сценам, кнопка «Пропустить вступление».
       Тексты — согласованные, картинки — реальный объект ESP с дрона,
       материалы бренда и природные слои. -->
  <div ref="root" class="st">
    <StoryLoader v-if="!loaderGone" :assets="preload" :min-time="seen ? 700 : 1900" @done="onLoaded" />

    <button v-show="inIntro && loaderGone" type="button" class="st-skip" :class="{ 'is-dark': onLight }" @click="skipIntro">Пропустить вступление</button>
    <button
      type="button"
      class="st-sound"
      :class="{ 'is-on': soundOn, 'is-docked': !inIntro, 'is-dark': onLight && inIntro }"
      :aria-pressed="soundOn"
      :aria-label="soundOn ? 'Выключить звук' : 'Включить звук'"
      @click="toggleSound"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line v-for="(x, i) in [5, 9, 13, 17, 21]" :key="x" :x1="x" :x2="x" y1="6" y2="18" :style="{ animationDelay: `${i * 0.12}s` }" />
      </svg>
    </button>

    <!-- 1. Сверху: отстойники ESP с дрона, облака расходятся -->
    <section ref="skyEl" class="st-sky">
      <div class="st-stick">
        <div ref="aerialEl" class="st-aerial">
          <img
            src="/images/about-story/aerial.webp"
            srcset="/images/about-story/aerial-sm.webp 1280w, /images/about-story/aerial.webp 2560w"
            sizes="140vw"
            alt="Отстойники очистных сооружений ESP, вид с дрона"
            fetchpriority="high"
          />
        </div>
        <img v-for="n in 4" :key="n" :ref="(el) => (clouds[n - 1] = el)" :src="`/images/about-story/cloud-${n % 2 ? 'a' : 'b'}.webp`" alt="" class="st-cloud" :class="`st-cloud--${n}`" />
        <div class="st-sky-text">
          <div v-for="(t, i) in skyTexts" :key="i" class="st-say" :class="{ 'is-on': skyStep === i }" :aria-hidden="skyStep !== i">
            <component :is="i === 0 ? 'h1' : 'p'" class="st-say__top">{{ t.top }}</component>
            <span class="st-dl" aria-hidden="true"><i /><b /><i /></span>
            <p class="st-say__bottom">{{ t.bottom }}</p>
          </div>
        </div>
        <span class="st-hint" :class="{ 'is-off': skyStep > 0 }" aria-hidden="true">Прокрутите</span>
        <div ref="veilEl" class="st-veil" />
      </div>
    </section>

    <!-- 2. Слои: площадка → модель → объект, как скалы у jazakvoda -->
    <section ref="layersEl" class="st-layers">
      <div class="st-stick st-stick--light">
        <div class="st-layers__grid">
          <div class="st-layers__text">
            <span class="st-label st-label--blue">Одна система ESP</span>
            <p class="st-lede">Проектирование и производство работают внутри одной компании: то, что рассчитали инженеры, изготавливается на нашем заводе и запускается той же командой.</p>
            <ol class="st-steps">
              <li v-for="(l, i) in layers" :key="l.title" :class="{ 'is-on': layerStep === i, 'is-past': layerStep > i }">
                <span class="st-steps__num">{{ l.num }}</span>
                <b>{{ l.title }}</b>
                <p>{{ l.text }}</p>
              </li>
            </ol>
          </div>
          <div class="st-plates">
            <img v-for="(l, i) in layers" :key="l.src" :ref="(el) => (plates[i] = el)" :src="l.src" :alt="l.alt" class="st-plate" />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Природа: заросли поднимаются снизу и открывают зелёную сцену -->
    <section ref="natureEl" class="st-nature">
      <img ref="bushesEl" src="/images/about-story/bushes.webp" alt="" class="st-bushes" loading="lazy" />
      <img ref="branchEl" src="/images/about-story/branch.webp" alt="" class="st-branch" loading="lazy" />
      <div class="st-wrap st-nature__in">
        <span class="st-dl st-dl--center" aria-hidden="true"><i /><b /><i /></span>
        <div class="st-two">
          <h2 class="st-h">Что даёт<br />одна система</h2>
          <ul class="st-caps">
            <li v-for="c in systemCaps" :key="c" class="st-cap">{{ c }}</li>
          </ul>
        </div>
      </div>
      <img ref="fernEl" src="/images/about-story/fern.webp" alt="" class="st-fern" loading="lazy" />
      <img ref="reedsEl" src="/images/about-story/reeds.webp" alt="" class="st-reeds" loading="lazy" />
    </section>

    <!-- 4. Знак качества: капля на островке, рябь воды, горячая точка -->
    <section id="quality" ref="qualityEl" class="st-quality">
      <div class="st-wrap st-center">
        <span class="st-label st-label--blue">Эталон качества</span>
      </div>
      <div class="st-sign">
        <img src="/images/about-story/branch.webp" alt="" class="st-sign__branch st-sign__branch--l" loading="lazy" />
        <img src="/images/about-story/branch.webp" alt="" class="st-sign__branch st-sign__branch--r" loading="lazy" />
        <div ref="signEl" class="st-sign__pic">
          <img src="/images/about-story/kapla.webp" alt="Знак качества ESP — капля с логотипом на островке у воды" loading="lazy" />
          <img src="/images/about-story/kapla.webp" alt="" aria-hidden="true" class="st-sign__water" loading="lazy" />
          <button type="button" class="st-hot" :class="{ 'is-open': hotOpen }" :aria-expanded="hotOpen" aria-label="Что означает знак" @click="hotOpen = !hotOpen">
            <svg viewBox="0 0 60 60" aria-hidden="true">
              <circle class="st-hot__big" cx="30" cy="30" r="26" />
              <circle class="st-hot__small" cx="30" cy="30" r="15" />
              <circle class="st-hot__dot" cx="30" cy="30" r="5" />
              <path class="st-hot__x" d="M25 25l10 10M35 25L25 35" />
            </svg>
          </button>
          <p class="st-hot__card" :class="{ 'is-open': hotOpen }" role="note">
            Знак качества ESP, разработанный для экологических объектов. Подтверждает надёжность и экологичность объекта.
          </p>
        </div>
      </div>
      <svg class="st-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="st-water" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.07" numOctaves="2" seed="4">
            <animate attributeName="baseFrequency" dur="14s" values="0.012 0.07;0.016 0.09;0.012 0.07" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="14" />
        </filter>
      </svg>

      <div ref="aboutEl" class="st-wrap st-about">
        <img v-for="n in 8" :key="n" :ref="(el) => (leaves[n - 1] = el)" :src="`/images/about-story/leaf-${n}.webp`" alt="" class="st-leaf" loading="lazy" />
        <div class="st-two st-two--ink">
          <h2 class="st-h st-h--ink">Знак, который ставится на объекте</h2>
          <ul class="st-facts">
            <li><b>5 м</b><span>кристальный просвет — стандарт прозрачности очищенной воды</span></li>
            <li><b>ISO 9001</b><span>система менеджмента качества, эко-сертификация, патенты</span></li>
            <li><b>100%</b><span>ответственность за результат: проект, оборудование, пусконаладка</span></li>
          </ul>
        </div>
      </div>

      <figure class="st-wrap st-proof st-rise">
        <img src="/images/about-story/quality-standard.webp" alt="Фирменная капля ESP на здании управления очистных сооружений" loading="lazy" />
        <figcaption>
          <b>Очистные сооружения после пусконаладки.</b>
          Капля на фасаде — отметка о том, что объект принят по внутреннему стандарту ESP.
        </figcaption>
      </figure>

      <div class="st-wrap st-clarity">
        <div class="st-two st-two--ink st-rise">
          <h3 class="st-h st-h--ink st-h--sm">Путь к кристальной чистоте</h3>
          <p class="st-sub">Шесть контролируемых ступеней — от механической очистки до обеззараживания. Показатели на каждой фиксируются лабораторно.</p>
        </div>
        <ol class="st-stages">
          <li v-for="(s, i) in clarityStages" :key="s.label" class="st-rise" :style="{ '--c': stageColors[i] }">
            <span class="st-stages__drop" aria-hidden="true" />
            <span class="st-stages__n">0{{ i + 1 }}</span>
            <b>{{ s.label }}</b>
            <span>{{ s.result }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- 5. Путь компании: годы листаются по горизонтали -->
    <section id="history" ref="historyEl" class="st-history">
      <div class="st-stick st-stick--navy">
        <div class="st-wrap st-history__head">
          <span class="st-label">Путь компании</span>
          <p class="st-lede st-lede--light">28 лет практики: от подрядных работ до собственного инжиниринга и производства</p>
        </div>
        <div ref="trackEl" class="st-track">
          <article v-for="(ev, i) in timelineEvents" :key="`${ev.year}-${i}`" class="st-year" :class="{ 'is-future': isFuture(ev) }">
            <span class="st-year__num">{{ ev.year }}</span>
            <span class="st-dl st-dl--row" aria-hidden="true"><i /><b /><i /></span>
            <h3>{{ ev.title }}</h3>
            <p>{{ ev.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 6. География работ -->
    <section id="map" class="st-plain">
      <div class="st-wrap">
        <div class="st-two st-two--ink st-rise">
          <h2 class="st-h st-h--ink">География работ</h2>
          <p class="st-sub">Объекты, которые мы спроектировали, изготовили и запустили</p>
        </div>
        <div class="st-mapbox st-rise">
          <ClientOnly>
            <ProjectsMap :points="mapPoints" class="w-full aspect-video" />
            <template #fallback><div class="st-mapbox__wait">Загрузка карты…</div></template>
          </ClientOnly>
        </div>
        <p class="st-mapnote">150+ проектов по всей Беларуси — <NuxtLink to="/projects">смотреть полный список →</NuxtLink></p>
      </div>
    </section>

    <!-- 7. Медиа-центр: карточки из админки -->
    <section id="media" class="st-plain st-plain--gray">
      <div class="st-wrap">
        <div class="st-two st-two--ink st-rise">
          <h2 class="st-h st-h--ink">Медиа-центр</h2>
          <p class="st-sub">Видео о компании и презентации для заказчиков и партнёров</p>
        </div>
        <div class="st-media">
          <template v-for="(item, i) in media" :key="`${item.title}-${i}`">
            <article v-if="item.kind !== 'presentation'" class="st-mcard st-rise">
              <div class="st-mcard__pic">
                <video
                  :ref="(el) => { mediaVideos[i] = el }"
                  :src="item.file"
                  :poster="item.poster || undefined"
                  muted
                  loop
                  playsinline
                  preload="metadata"
                  @pause="mediaPlaying[i] = false"
                />
                <button
                  type="button"
                  class="st-play"
                  :class="{ 'is-playing': mediaPlaying[i] }"
                  :aria-label="mediaPlaying[i] ? `Пауза: ${item.title}` : `Смотреть: ${item.title}`"
                  @click="toggleMedia(i)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path v-if="!mediaPlaying[i]" d="M8 5.5v13l11-6.5z" /><path v-else d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
                </button>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
              <span v-if="item.duration" class="st-mcard__meta">{{ item.duration }}</span>
            </article>
            <a v-else :href="item.file" download target="_blank" rel="noopener" class="st-mcard st-rise">
              <div class="st-mcard__pic st-mcard__pic--doc">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" /></svg>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
              <span class="st-mcard__meta">{{ item.duration || 'Скачать презентацию' }}</span>
            </a>
          </template>
        </div>
      </div>
    </section>

    <!-- 8. Финал -->
    <section class="st-final">
      <img src="/images/about-story/fern.webp" alt="" class="st-final__fern" loading="lazy" />
      <div class="st-wrap st-center st-final__in st-rise">
        <span class="st-dl st-dl--center" aria-hidden="true"><i /><b /><i /></span>
        <h2 class="st-h st-h--xl">Готовы создать Эталон качества?</h2>
        <p class="st-final__sub">Обсудим ваш объект и подготовим решение — от обследования площадки до запуска очистных сооружений</p>
        <div class="st-final__actions">
          <NuxtLink to="/contacts" class="st-btn">Обсудить проект</NuxtLink>
          <NuxtLink to="/projects" class="st-btn st-btn--ghost">Посмотреть кейсы</NuxtLink>
        </div>
      </div>
      <img src="/images/about-story/reeds.webp" alt="" class="st-final__reeds" loading="lazy" />
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// На боевой сборке нет глобального плагина Lenis, который регистрировал ScrollTrigger
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)
import { useProjectGeo } from '~/composables/useProjectGeo'

const { mapPoints } = useProjectGeo()
const { timeline } = useTimeline()
const { media } = useMediaCenter()
const { on: soundOn, toggle: toggleSound, setScene, dispose: disposeSound } = useStoryAmbience()

// ===== Тексты сцен (согласованные формулировки) =====
const skyTexts = [
  { top: 'Инженерия, которой доверяют', bottom: '28 лет опыта' },
  { top: '28 лет практики', bottom: 'от подрядных работ до собственного инжиниринга и производства' },
  { top: 'Проектируем, изготавливаем и запускаем очистные сооружения', bottom: 'отвечая за результат целиком' }
]
const layers = [
  { src: '/images/about-story/layer-1.webp', alt: 'Площадка будущего объекта', num: 'Площадка', title: 'Лидарное сканирование площадки', text: 'С точностью до миллиметра.' },
  { src: '/images/about-story/layer-2.webp', alt: 'BIM-модель очистных сооружений', num: '01 · Проектируем', title: 'Инжиниринговый центр', text: 'Расчёты, технологические решения и рабочая документация. Модель объекта собирается до начала стройки — 30 000 элементов стыкуются ещё на этапе проекта.' },
  { src: '/images/about-story/layer-3.webp', alt: 'Построенные очистные сооружения', num: '02 · Изготавливаем', title: 'Производственная база', text: 'Собственное производство в Заславле. Оборудование выпускается по нашей же документации, каждый узел проверяется до отгрузки на объект.' }
]
const systemCaps = [
  '3D-проектирование и BIM-модель объекта',
  'Лидарное сканирование площадки с точностью до миллиметра',
  'Цифровой двойник для простой эксплуатации',
  'Собственное производство в Заславле',
  'Локализация узлов и импортозамещение',
  'Бережливое производство по принципам Lean',
  'Контроль качества на каждом этапе',
  '100+ специалистов в штате'
]
const clarityStages = [
  { label: 'Механическая', result: 'Отделение крупных примесей и песка' },
  { label: 'Физико-химическая', result: 'Связывание фосфора и тонкой взвеси' },
  { label: 'Биологическая USBF', result: 'Удаление органики и азота' },
  { label: 'Механическое обезвоживание осадков', result: 'Сокращение объёма осадка' },
  { label: 'Микрофильтрация', result: 'Доочистка от мельчайших частиц' },
  { label: 'Обеззараживание', result: 'Безопасная вода на выпуске' }
]
// Цвет воды по ступеням: от мутной охры к прозрачной синеве
const stageColors = ['#8a6b3f', '#958857', '#6f8f7a', '#4f86a8', '#3c8ed6', '#8fc1ff']

// ===== Путь компании: годы из админки + «вектор в будущее» =====
const isFuture = (ev) => !/^\d{4}$/.test(String(ev?.year ?? '').trim())
const timelineEvents = computed(() => {
  const list = timeline.value.filter(Boolean)
  return [...list.filter((ev) => !isFuture(ev)), ...list.filter(isFuture).slice(0, 1)]
})

// ===== Состояние истории =====
const preload = ['/images/about-story/aerial.webp', '/images/about-story/cloud-a.webp', '/images/about-story/cloud-b.webp', '/images/about-story/layer-1.webp', '/images/about-story/layer-2.webp', '/images/about-story/layer-3.webp']
const root = ref(null)
const skyEl = ref(null)
const aerialEl = ref(null)
const veilEl = ref(null)
const layersEl = ref(null)
const natureEl = ref(null)
const bushesEl = ref(null)
const branchEl = ref(null)
const fernEl = ref(null)
const reedsEl = ref(null)
const qualityEl = ref(null)
const signEl = ref(null)
const aboutEl = ref(null)
const historyEl = ref(null)
const trackEl = ref(null)
const clouds = []
const plates = []
const leaves = []

const loaderGone = ref(false)
const seen = ref(false)
const inIntro = ref(true)
const skyStep = ref(0)
const layerStep = ref(0)
const hotOpen = ref(false)
// Кнопки поверх белой сцены слоёв перекрашиваются в синий
const onLight = ref(false)

const lenis = () => (typeof window !== 'undefined' ? window.__lenis : null)
const setIntro = (v) => {
  inIntro.value = v
  document.documentElement.classList.toggle('st-intro', v)
}

// Пока идёт загрузка, страница не прокручивается: Lenis может появиться
// чуть позже страницы, поэтому ловим его в следующих кадрах.
const holdScroll = () => {
  if (loaderGone.value) return
  const l = lenis()
  if (l) l.stop()
  else requestAnimationFrame(holdScroll)
}

const onLoaded = () => {
  loaderGone.value = true
  document.documentElement.classList.remove('st-loading')
  try { sessionStorage.setItem('st-seen', '1') } catch {}
  lenis()?.start()
  ScrollTrigger.refresh()
}

const skipIntro = () => {
  const l = lenis()
  if (l) l.scrollTo(natureEl.value, { duration: 2.2 })
  else natureEl.value?.scrollIntoView({ behavior: 'smooth' })
}

// ===== Сцены на прокрутке =====
let ctx = null
let prevRestoration = 'auto'

onMounted(async () => {
  try { seen.value = sessionStorage.getItem('st-seen') === '1' } catch {}
  prevRestoration = history.scrollRestoration
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  document.documentElement.classList.add('st-loading')
  setIntro(true)
  holdScroll()
  await nextTick()

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()
    mm.add({ desk: '(min-width: 768px)', mob: '(max-width: 767px)', still: '(prefers-reduced-motion: reduce)' }, (c) => {
      const { desk, still } = c.conditions
      if (still) return

      // 1. Сверху: камера снижается, облака уходят вверх с разной скоростью
      const sky = gsap.timeline({
        scrollTrigger: {
          trigger: skyEl.value,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (s) => { skyStep.value = s.progress < 0.3 ? 0 : s.progress < 0.62 ? 1 : 2 },
          onToggle: (s) => s.isActive && setScene('sky')
        }
      })
      sky.fromTo(aerialEl.value, { scale: 1.15 }, { scale: 1.7, x: desk ? 180 : 40, y: desk ? -320 : -120, rotation: -3, ease: 'none', duration: 1 }, 0)
      const moves = desk
        ? [{ y: '-78vw' }, { y: '-21vw', x: '2.6vw' }, { y: '-42vw', x: '5.2vw' }, { y: '-104vw', x: '5.2vw' }]
        : [{ y: '-120vh' }, { y: '-40vh' }, { y: '-80vh' }, { y: '-170vh' }]
      clouds.forEach((el, i) => el && sky.to(el, { ...moves[i], ease: 'none', duration: 1 }, 0))
      sky.to(veilEl.value, { opacity: 1, ease: 'none', duration: 0.14 }, 0.86)

      // 2. Слои: площадка вырастает из глубины, поверх ложатся модель и объект
      const lay = gsap.timeline({
        scrollTrigger: {
          trigger: layersEl.value,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (s) => { layerStep.value = s.progress < 0.36 ? 0 : s.progress < 0.7 ? 1 : 2 },
          onToggle: (s) => { onLight.value = s.isActive; if (s.isActive) setScene('layers') },
          onLeave: () => setIntro(false),
          onEnterBack: () => setIntro(true)
        }
      })
      lay.fromTo(plates[0], { scale: 0.5, opacity: 0, yPercent: 14 }, { scale: 1, opacity: 1, yPercent: 0, ease: 'power2.out', duration: 1 })
        .fromTo(plates[1], { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, ease: 'none', duration: 1 }, 1.15)
        .fromTo(plates[2], { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, ease: 'none', duration: 1 }, 2.3)
        .to({}, { duration: 0.5 })

      // 3. Природа: кусты поднимаются, папоротник и камыш — свои скорости
      const nature = { trigger: natureEl.value, scrub: true }
      gsap.fromTo(bushesEl.value, { yPercent: 18 }, { yPercent: -30, ease: 'none', scrollTrigger: { ...nature, start: 'top bottom', end: 'top top' } })
      gsap.fromTo(branchEl.value, { xPercent: 35, rotation: 10 }, { xPercent: 0, rotation: 0, ease: 'none', scrollTrigger: { ...nature, start: 'top bottom', end: 'center center' } })
      gsap.fromTo(fernEl.value, { yPercent: 35, rotation: -8 }, { yPercent: 0, rotation: 0, ease: 'none', scrollTrigger: { ...nature, start: 'top center', end: 'bottom bottom' } })
      gsap.fromTo(reedsEl.value, { yPercent: 30 }, { yPercent: 0, ease: 'none', scrollTrigger: { ...nature, start: 'center bottom', end: 'bottom bottom' } })
      gsap.from('.st-cap', { opacity: 0, y: 24, stagger: 0.06, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.st-caps', start: 'top 80%', once: true } })
      ScrollTrigger.create({ trigger: natureEl.value, start: 'top center', end: 'bottom center', onToggle: (s) => s.isActive && setScene('nature') })

      // 4. Знак: капля приближается, ветки раздвигаются, листья разлетаются
      gsap.fromTo(signEl.value, { scale: 0.84, yPercent: 10 }, { scale: 1, yPercent: 0, ease: 'none', scrollTrigger: { trigger: signEl.value, start: 'top bottom', end: 'center center', scrub: true } })
      gsap.fromTo('.st-sign__branch--l', { xPercent: -45 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: signEl.value, start: 'top bottom', end: 'center center', scrub: true } })
      gsap.fromTo('.st-sign__branch--r', { xPercent: 45 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: signEl.value, start: 'top bottom', end: 'center center', scrub: true } })
      // На телефоне листья уводим к краям, чтобы не ложились на текст
      const kx = desk ? 1 : 1.1
      const ky = desk ? 1 : 0.5
      const spread = [[-34, -26, -40], [32, -30, 35], [-44, 6, -70], [42, 10, 60], [-30, 34, 20], [34, 38, -25], [-14, -40, 90], [16, 44, -80]]
      leaves.forEach((el, i) => el && gsap.fromTo(el,
        { x: 0, y: 0, rotation: 0, scale: 0.4, opacity: 0 },
        { x: `${spread[i][0] * kx}vw`, y: `${spread[i][1] * ky}vh`, rotation: spread[i][2], scale: 1, opacity: 1, ease: 'power1.out', scrollTrigger: { trigger: aboutEl.value, start: 'top 85%', end: 'center 40%', scrub: 1 } }
      ))
      ScrollTrigger.create({ trigger: qualityEl.value, start: 'top center', end: 'bottom center', onToggle: (s) => s.isActive && setScene('quality') })

      // 5. Годы по горизонтали (на телефоне — обычным списком)
      ScrollTrigger.create({ trigger: historyEl.value, start: 'top center', onEnter: () => setScene('calm'), onLeaveBack: () => setScene('quality') })
      let fit = null
      if (desk) {
        fit = () => {
          if (historyEl.value && trackEl.value) historyEl.value.style.height = `${window.innerHeight + Math.max(0, trackEl.value.scrollWidth - window.innerWidth)}px`
        }
        fit()
        ScrollTrigger.addEventListener('refreshInit', fit)
        gsap.to(trackEl.value, {
          x: () => -Math.max(0, trackEl.value.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: { trigger: historyEl.value, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true }
        })
      }

      // Остальные блоки — мягкое появление
      gsap.utils.toArray('.st-rise').forEach((el) => {
        gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })

      return () => {
        if (fit) ScrollTrigger.removeEventListener('refreshInit', fit)
        if (historyEl.value) historyEl.value.style.height = ''
      }
    })
  }, root.value)
})

onBeforeUnmount(() => {
  ctx?.revert()
  disposeSound()
  document.documentElement.classList.remove('st-intro', 'st-loading')
  history.scrollRestoration = prevRestoration
  lenis()?.start()
})

// ===== Медиа-центр: ролик запускается по кнопке =====
const mediaVideos = {}
const mediaPlaying = reactive({})
const toggleMedia = (i) => {
  const el = mediaVideos[i]
  if (!el) return
  if (el.paused) el.play().then(() => { mediaPlaying[i] = true }).catch(() => {})
  else { el.pause(); mediaPlaying[i] = false }
}

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead({
  title: 'О компании ESP | EcoServiceProject — 28 лет опыта, 30 000 элементов',
  meta: [
    { name: 'description', content: 'История EcoServiceProject с 1999 года: собственный инжиниринг и производство очистных сооружений, таймлайн компании, сертификаты качества.' },
    { property: 'og:title', content: 'О компании ESP | 28 лет опыта' },
    { property: 'og:description', content: 'История EcoServiceProject с 1999 года: собственный инжиниринг и производство, сертификаты качества, 150+ объектов в Беларуси.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/about' }]
})
</script>

<style>
/* Во время вступления шапка сайта уходит вверх, как меню у jazakvoda */
html.st-intro header.fixed { transform: translateY(-120%) !important; }
html.st-loading { overflow: hidden; }
</style>

<style scoped>
.st {
  --st-green: #0b2b1d;
  --st-navy: #002366;
  --st-deep: #00163f;
  --st-cream: #efe9dc;
  --st-sky: #8fc1ff;
  --st-blue: #2f6fb8;
  --st-ink: #1d1d1f;
  --st-muted: #6e6e73;
  overflow-x: clip;
  background: var(--st-green);
  color: var(--st-cream);
}
.st-wrap { max-width: 76rem; margin: 0 auto; padding: 0 1.5rem; }
.st-center { text-align: center; }
.st-label { display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--st-sky); }
.st-label--blue { color: var(--st-blue); }
.st-lede { margin-top: 1rem; max-width: 34rem; font-size: 1.05rem; line-height: 1.55; color: var(--st-muted); }
.st-lede--light { color: rgba(239, 233, 220, 0.72); }
.st-sub { font-size: 1.05rem; line-height: 1.55; color: var(--st-muted); max-width: 36rem; }
.st-h { font-family: var(--font-display); font-weight: 700; font-size: clamp(1.7rem, 2.7vw, 2.6rem); line-height: 1.08; letter-spacing: 0.01em; text-transform: uppercase; color: var(--st-cream); }
.st-h--ink { color: var(--st-ink); }
.st-h--sm { font-size: clamp(1.4rem, 2vw, 2rem); }
.st-h--xl { font-size: clamp(2rem, 4.2vw, 4rem); }
.st-two { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 2rem 6vw; align-items: start; }

/* Разделитель «точка — линия — точка», как у jazakvoda */
.st-dl { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.st-dl i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.st-dl b { width: 1px; height: 56px; background: currentColor; opacity: 0.7; }
.st-dl--center { margin: 0 auto 3rem; color: var(--st-sky); }
.st-dl--row { flex-direction: row; justify-content: flex-start; margin: 1.6rem 0 1.4rem; color: var(--st-sky); }
.st-dl--row b { width: 64px; height: 1px; }

/* ---------- Кнопки поверх ---------- */
.st-skip {
  position: fixed; top: 24px; left: 24px; z-index: 110;
  padding: 0.65rem 1.2rem; border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.85); color: #fff;
  font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
  background: rgba(0, 0, 0, 0.12); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  transition: background-color 0.2s ease, color 0.2s ease;
}
.st-skip:hover { background: #fff; color: var(--st-navy); }
.st-skip.is-dark, .st-sound.is-dark { border-color: rgba(0, 35, 102, 0.55); color: var(--st-navy); background: rgba(255, 255, 255, 0.7); }
.st-skip.is-dark:hover { background: var(--st-navy); color: #fff; }
.st-sound {
  position: fixed; top: 24px; right: 24px; z-index: 110;
  width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center;
  border: 1.5px solid rgba(255, 255, 255, 0.85); color: #fff;
  background: rgba(0, 0, 0, 0.12); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  transition: top 0.5s ease, background-color 0.3s ease;
}
.st-sound.is-docked { top: calc(100% - 72px); background: rgba(11, 43, 29, 0.82); }
.st-sound svg { width: 22px; height: 22px; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.st-sound line { transform-origin: center; transform: scaleY(0.25); transition: transform 0.3s ease; }
.st-sound.is-on line { animation: st-bars 0.9s ease-in-out infinite alternate; }
@keyframes st-bars { from { transform: scaleY(0.25); } to { transform: scaleY(1); } }

/* ---------- Липкие сцены ---------- */
.st-stick { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
.st-stick--light { background: #fff; color: var(--st-ink); }
.st-stick--navy { background: var(--st-deep); }

/* 1. Сверху */
.st-sky { height: 400vh; background: #fff; }
.st-aerial { position: absolute; inset: -12%; will-change: transform; }
.st-aerial img { width: 100%; height: 100%; object-fit: cover; }
.st-cloud { position: absolute; max-width: none; pointer-events: none; will-change: transform; animation: st-float 18s ease-in-out infinite alternate; }
.st-cloud--1 { left: -14%; top: 46%; width: 92vw; }
.st-cloud--2 { right: -26%; top: -6%; width: 92vw; scale: -1 1; animation-duration: 22s; }
.st-cloud--3 { left: -34%; top: 6%; width: 78vw; scale: -1 -1; opacity: 0.92; animation-duration: 26s; }
.st-cloud--4 { left: -6%; top: 72%; width: 135vw; scale: 1 -1; animation-duration: 20s; }
@keyframes st-float { to { translate: 3vw 0; } }
.st-sky-text { position: absolute; inset: 0; display: grid; place-items: center; padding: 0 1.5rem; text-align: center; color: #fff; }
.st-say { grid-area: 1 / 1; display: grid; justify-items: center; gap: 1.1rem; max-width: 52rem; opacity: 0; transform: translateY(24px); filter: blur(6px); transition: opacity 0.7s ease, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s ease; pointer-events: none; }
.st-say.is-on { opacity: 1; transform: none; filter: none; }
.st-say__top { font-family: var(--font-display); font-weight: 700; font-size: clamp(1.9rem, 3.6vw, 3.5rem); line-height: 1.08; text-transform: uppercase; letter-spacing: 0.01em; text-shadow: 0 2px 30px rgba(0, 20, 50, 0.45); }
.st-say__bottom { max-width: 34rem; font-size: clamp(12px, 1vw, 15px); font-weight: 700; line-height: 1.6; letter-spacing: 0.22em; text-transform: uppercase; text-shadow: 0 1px 16px rgba(0, 20, 50, 0.5); }
.st-hint { position: absolute; left: 50%; bottom: 28px; translate: -50% 0; font-size: 11px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #fff; transition: opacity 0.5s ease; }
.st-hint::after { content: ''; display: block; width: 1px; height: 36px; margin: 10px auto 0; background: #fff; animation: st-hint 1.8s ease-in-out infinite; transform-origin: top; }
.st-hint.is-off { opacity: 0; }
@keyframes st-hint { 0% { transform: scaleY(0); } 50% { transform: scaleY(1); } 100% { transform: scaleY(1); opacity: 0; } }
.st-veil { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; }

/* 2. Слои */
.st-layers { height: 340vh; background: #fff; }
.st-layers__grid { height: 100%; max-width: 84rem; margin: 0 auto; padding: 6rem 1.5rem 3rem; display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 3rem; align-items: center; }
.st-steps { list-style: none; padding: 0; margin: 2.2rem 0 0; display: grid; gap: 1.1rem; }
.st-steps li { padding-left: 1.2rem; border-left: 2px solid #e5e5ea; opacity: 0.4; transition: opacity 0.5s ease, border-color 0.5s ease; }
.st-steps li.is-on { opacity: 1; border-color: var(--st-blue); }
.st-steps li.is-past { opacity: 0.6; }
.st-steps__num { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--st-blue); }
.st-steps b { display: block; margin-top: 0.3rem; font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; text-transform: uppercase; color: var(--st-ink); }
.st-steps p { max-height: 0; overflow: hidden; margin-top: 0; font-size: 15px; line-height: 1.5; color: var(--st-muted); transition: max-height 0.6s ease, margin-top 0.6s ease; }
.st-steps li.is-on p { max-height: 8rem; margin-top: 0.45rem; }
.st-plates { position: relative; width: 100%; aspect-ratio: 3 / 2; }
.st-plate { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; will-change: transform, opacity; }

/* 3. Природа */
.st-nature { position: relative; z-index: 2; padding: 14vw 0 26vw; background: var(--st-green); }
.st-bushes { position: absolute; left: 0; top: -30vw; width: 100%; max-width: none; pointer-events: none; z-index: 1; -webkit-mask-image: linear-gradient(#000 62%, transparent); mask-image: linear-gradient(#000 62%, transparent); }
.st-branch { position: absolute; top: 4vw; right: -8vw; width: 40vw; max-width: none; scale: -1 1; z-index: 2; pointer-events: none; animation: st-sway 7s ease-in-out infinite alternate; transform-origin: top right; }
@keyframes st-sway { to { rotate: 2.5deg; } }
.st-nature__in { position: relative; z-index: 3; }
.st-caps { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.1rem 2.5rem; }
.st-cap { position: relative; padding-left: 1.3rem; font-size: 16px; line-height: 1.5; color: rgba(239, 233, 220, 0.9); }
.st-cap::before { content: ''; position: absolute; left: 0; top: 0.55em; width: 7px; height: 7px; border-radius: 50%; background: var(--st-sky); }
.st-fern { position: absolute; left: -5vw; bottom: 3vw; width: 36vw; max-width: none; z-index: 2; pointer-events: none; transform-origin: bottom left; }
.st-reeds { position: absolute; left: 0; bottom: -27vw; width: 100%; max-width: none; z-index: 3; pointer-events: none; }

/* 4. Знак качества */
.st-quality { position: relative; z-index: 3; padding: 7rem 0 6rem; background: #fff; color: var(--st-ink); }
.st-sign { position: relative; width: min(62vw, 860px); margin: 1.5rem auto 0; }
.st-sign__pic { position: relative; }
.st-sign__pic > img:first-child { width: 100%; height: auto; display: block; }
.st-sign__water { position: absolute; inset: 0; width: 100%; height: 100%; clip-path: inset(79% 0 0 0); filter: url(#st-water); }
.st-sign__branch { position: absolute; top: -10%; width: 46%; max-width: none; z-index: 2; pointer-events: none; animation: st-sway 8s ease-in-out infinite alternate; }
.st-sign__branch--l { left: -30%; transform-origin: top left; }
.st-sign__branch--r { right: -30%; scale: -1 1; transform-origin: top right; animation-duration: 9s; }
.st-defs { position: absolute; width: 0; height: 0; }
.st-hot { position: absolute; left: 45%; top: 25%; width: 60px; height: 60px; translate: -50% -50%; z-index: 3; }
.st-hot svg { width: 100%; height: 100%; overflow: visible; }
.st-hot__big { fill: none; stroke: var(--st-blue); stroke-width: 2; transform-origin: center; animation: st-pulse 2.2s ease-out infinite; }
.st-hot__small { fill: #fff; stroke: var(--st-navy); stroke-width: 2; filter: drop-shadow(0 4px 10px rgba(0, 35, 102, 0.25)); }
.st-hot__dot { fill: var(--st-navy); transition: opacity 0.2s ease; }
.st-hot__x { stroke: var(--st-navy); stroke-width: 2; stroke-linecap: round; opacity: 0; transition: opacity 0.2s ease; }
.st-hot.is-open .st-hot__dot { opacity: 0; }
.st-hot.is-open .st-hot__x { opacity: 1; }
@keyframes st-pulse { from { transform: scale(0.6); opacity: 1; } to { transform: scale(1.35); opacity: 0; } }
.st-hot__card { position: absolute; left: calc(45% + 44px); top: 25%; z-index: 3; width: min(300px, 70vw); padding: 1rem 1.2rem; border-radius: 16px; background: rgba(255, 255, 255, 0.96); box-shadow: 0 18px 50px rgba(0, 35, 102, 0.16); font-size: 14px; line-height: 1.5; color: var(--st-ink); opacity: 0; translate: 0 -40%; transform: translateY(8px); pointer-events: none; transition: opacity 0.3s ease, transform 0.3s ease; }
.st-hot__card.is-open { opacity: 1; transform: none; pointer-events: auto; }

.st-about { position: relative; padding-top: 9rem; padding-bottom: 7rem; }
.st-leaf { position: absolute; left: 50%; top: 50%; width: clamp(48px, 5vw, 84px); margin: -40px 0 0 -40px; z-index: 0; pointer-events: none; opacity: 0; }
.st-about .st-two { position: relative; z-index: 1; }
.st-facts { list-style: none; padding: 0; margin: 0; display: grid; gap: 1.6rem; }
.st-facts li { display: grid; grid-template-columns: 9.5rem minmax(0, 1fr); gap: 1.2rem; align-items: baseline; }
.st-facts b { font-family: var(--font-display); font-size: clamp(1.8rem, 2.6vw, 2.5rem); font-weight: 700; color: var(--st-navy); white-space: nowrap; }
.st-facts span { font-size: 15px; line-height: 1.5; color: var(--st-muted); }
.st-proof { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 2rem 4vw; align-items: end; }
.st-proof img { width: 100%; border-radius: 22px; display: block; }
.st-proof figcaption { font-size: 15px; line-height: 1.6; color: var(--st-muted); }
.st-proof figcaption b { display: block; margin-bottom: 0.4rem; font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--st-ink); }
.st-clarity { padding-top: 7rem; }
.st-stages { list-style: none; padding: 0; margin: 3rem 0 0; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1.5rem; }
.st-stages li { position: relative; display: grid; gap: 0.35rem; align-content: start; padding-top: 2.1rem; }
.st-stages li::before { content: ''; position: absolute; top: 7px; left: 22px; right: -1.5rem; height: 1px; background: #d9d9de; }
.st-stages li:last-child::before { display: none; }
.st-stages__drop { position: absolute; top: 0; left: 0; width: 15px; height: 15px; border-radius: 50% 50% 50% 0; rotate: -45deg; background: var(--c); }
.st-stages__n { font-size: 12px; font-weight: 700; letter-spacing: 0.16em; color: var(--st-blue); }
.st-stages b { font-family: var(--font-display); font-size: 1rem; font-weight: 700; line-height: 1.25; color: var(--st-ink); }
.st-stages span:last-child { font-size: 14px; line-height: 1.45; color: var(--st-muted); }

/* 5. Путь компании */
.st-history { position: relative; z-index: 3; }
.st-history .st-stick { display: flex; flex-direction: column; justify-content: center; }
.st-history__head { width: 100%; padding-top: 5rem; }
.st-track { display: flex; width: max-content; padding: 3rem 0 3rem max(1.5rem, calc((100vw - 76rem) / 2 + 1.5rem)); will-change: transform; }
.st-year { width: clamp(320px, 34vw, 520px); padding-right: 5vw; }
.st-year__num { display: block; font-family: var(--font-display); font-weight: 700; font-size: clamp(5rem, 10vw, 9.5rem); line-height: 0.9; color: transparent; -webkit-text-stroke: 1.5px rgba(239, 233, 220, 0.6); }
.st-year.is-future .st-year__num { font-size: clamp(3.2rem, 6vw, 6rem); color: var(--st-sky); -webkit-text-stroke: 0; }
.st-year h3 { font-family: var(--font-display); font-size: 1.35rem; font-weight: 700; text-transform: uppercase; color: var(--st-cream); }
.st-year p { margin-top: 0.7rem; max-width: 30ch; font-size: 15px; line-height: 1.6; color: rgba(239, 233, 220, 0.72); }

/* 6–7. Обычные блоки */
.st-plain { position: relative; z-index: 3; padding: 7rem 0; background: #fff; color: var(--st-ink); }
.st-plain--gray { background: #f5f5f7; }
.st-mapbox { margin-top: 3rem; border-radius: 24px; overflow: hidden; background: #f5f5f7; }
.st-mapbox__wait { aspect-ratio: 16 / 9; display: grid; place-items: center; color: var(--st-muted); }
.st-mapnote { margin-top: 1.5rem; text-align: center; color: var(--st-muted); }
.st-mapnote a { color: var(--st-blue); }
.st-mapnote a:hover { text-decoration: underline; }
.st-media { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; margin-top: 3rem; }
.st-mcard { display: grid; align-content: start; gap: 0.5rem; color: var(--st-ink); }
.st-mcard__pic { position: relative; aspect-ratio: 16 / 9; border-radius: 18px; overflow: hidden; background: var(--st-deep); margin-bottom: 0.6rem; }
.st-mcard__pic video { width: 100%; height: 100%; object-fit: cover; }
.st-mcard__pic--doc { display: grid; place-items: center; background: var(--st-navy); }
.st-mcard__pic--doc svg { width: 56px; height: 56px; fill: none; stroke: #fff; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.st-mcard h3 { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; }
.st-mcard p { font-size: 14px; line-height: 1.5; color: var(--st-muted); }
.st-mcard__meta { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--st-blue); }
.st-play { position: absolute; left: 50%; top: 50%; translate: -50% -50%; width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: rgba(255, 255, 255, 0.92); color: var(--st-navy); transition: opacity 0.3s ease, scale 0.3s ease; }
.st-play:hover { scale: 1.08; }
.st-play svg { width: 26px; height: 26px; fill: currentColor; }
.st-play.is-playing { opacity: 0; }
.st-mcard__pic:hover .st-play.is-playing { opacity: 1; }

/* 8. Финал */
.st-final { position: relative; z-index: 3; padding: 9rem 0 24vw; background: var(--st-green); overflow: hidden; }
.st-final__in { position: relative; z-index: 2; }
.st-final__sub { max-width: 40rem; margin: 1.2rem auto 0; font-size: 1.1rem; line-height: 1.55; color: rgba(239, 233, 220, 0.78); }
.st-final__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.8rem; margin-top: 2.2rem; }
.st-btn { padding: 0.9rem 1.6rem; border-radius: 999px; background: var(--st-blue); color: #fff; font-weight: 600; transition: background-color 0.2s ease; }
.st-btn:hover { background: #245aa0; }
.st-btn--ghost { background: transparent; box-shadow: inset 0 0 0 1.5px rgba(239, 233, 220, 0.6); color: var(--st-cream); }
.st-btn--ghost:hover { background: rgba(239, 233, 220, 0.1); }
.st-final__fern { position: absolute; right: -6vw; bottom: 6vw; width: 34vw; max-width: none; scale: -1 1; z-index: 1; pointer-events: none; }
.st-final__reeds { position: absolute; left: 0; bottom: -27vw; width: 100%; max-width: none; z-index: 2; pointer-events: none; }

@media (max-width: 1023px) {
  .st-stages { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 2.5rem; }
  .st-stages li:nth-child(3)::before { display: none; }
}
@media (max-width: 767px) {
  .st-skip { top: 16px; left: 16px; padding: 0.55rem 0.95rem; font-size: 11px; }
  .st-sound { top: 16px; right: 16px; width: 42px; height: 42px; }
  .st-sound.is-docked { top: calc(100% - 62px); }
  .st-sky { height: 300vh; }
  .st-layers { height: 300vh; }
  .st-layers__grid { grid-template-columns: 1fr; grid-template-rows: auto 1fr; gap: 1rem; padding: 5rem 1.25rem 2rem; align-items: start; }
  .st-layers__text { order: 2; }
  .st-plates { order: 1; }
  .st-lede { display: none; }
  .st-steps { margin-top: 1rem; }
  .st-steps li:not(.is-on) { display: none; }
  .st-two { grid-template-columns: 1fr; }
  .st-caps { grid-template-columns: 1fr; }
  .st-nature { padding: 22vw 0 34vw; }
  .st-bushes { top: -40vw; width: 160%; left: -30%; }
  .st-branch { width: 70vw; right: -24vw; top: 2vw; }
  .st-fern { width: 60vw; }
  .st-sign { width: 88vw; }
  .st-sign__branch { width: 40%; top: -16%; }
  .st-sign__branch--l { left: -14%; }
  .st-sign__branch--r { right: -14%; }
  .st-hot__card { left: 50%; top: calc(25% + 40px); translate: -50% 0; }
  .st-leaf { width: 38px; margin: -19px 0 0 -19px; }
  .st-facts li { grid-template-columns: 1fr; gap: 0.2rem; }
  .st-proof { grid-template-columns: 1fr; }
  .st-stages { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .st-stages li::before { display: none; }
  .st-history { height: auto !important; }
  .st-history .st-stick { position: relative; height: auto; }
  .st-track { flex-direction: column; width: auto; padding: 2rem 1.5rem 4rem; gap: 2.5rem; transform: none !important; }
  .st-year { width: auto; padding-right: 0; }
  .st-media { grid-template-columns: 1fr; }
  .st-final { padding-bottom: 34vw; }
  .st-final__fern { width: 62vw; }
}
@media (prefers-reduced-motion: reduce) {
  .st-sky { height: 100vh; }
  .st-layers { height: auto; }
  .st-layers .st-stick { position: relative; height: auto; }
  .st-steps li { opacity: 1; }
  .st-steps p { max-height: none; margin-top: 0.45rem; }
  .st-history { height: auto !important; }
  .st-history .st-stick { position: relative; height: auto; }
  .st-track { flex-wrap: wrap; width: auto; }
  .st-cloud, .st-branch, .st-sign__branch, .st-hot__big, .st-hint::after { animation: none; }
}
</style>

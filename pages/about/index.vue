<template>
  <!-- «О компании» в подаче apple.com/environment: заявление на весь экран,
       липкая подполоса, короткие крупные заголовки, текст, проявляющийся при
       прокрутке, фото во всю ширину между главами, крупные цифры, главы
       «кадр + текст» с липким кадром, горизонтальные галереи карточек, финал. -->
  <div ref="root" class="dj ap">
    <!-- ===== Первый экран: заявление и кадр во всю ширину ===== -->
    <!-- ===== Первый экран: заставка ESP (начало фильма о компании, зациклена) ===== -->
    <section class="ap-hero">
      <h1 class="ap-sr">О компании ESP — инженерия, которой доверяют</h1>
      <video ref="heroVideo" v-lazy-video class="ap-hero__v" :data-src="IMAGES.introLoop" :poster="IMAGES.introPoster" muted loop playsinline preload="none" aria-hidden="true" />
      <div class="ap-hero__fade" aria-hidden="true"></div>
      <a href="#film" class="ap-hero__cue" @click.prevent="jumpTo('#film')">
        <span>Фильм о компании</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5l6 6 6-6" /></svg>
      </a>
      <button type="button" class="ap-hero__pause" :aria-label="heroPaused ? 'Воспроизвести заставку' : 'Пауза заставки'" @click="toggleHero">
        <svg v-if="heroPaused" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z" /></svg>
      </button>
    </section>

    <DjSubnav title="О компании" :links="subnav" :cta="{ to: '/contacts', label: 'Обсудить проект' }" />

    <!-- ===== Полный фильм о компании ===== -->
    <AboutFilm
      id="film"
      :src="IMAGES.film"
      :poster="IMAGES.filmPoster"
      title="Инженерия, которой доверяют"
      lede="28 лет практики: от подрядных работ до собственного инжиниринга и производства. Проектируем, изготавливаем и запускаем очистные сооружения, отвечая за результат целиком."
      duration="6:42"
    />

    <!-- ===== Заявление и цифры: фраза проявляется при прокрутке, цифры досчитываются ===== -->
    <section class="ap-statement">
      <div class="dj-wrap">
        <p ref="statement" class="ap-statement__h"><span class="ap-sr">{{ statementText }}</span>
          <template v-for="(w, i) in statementWords" :key="i"><span class="ap-word" :class="{ 'is-lit': i < litWords, 'is-key': i === statementWords.length - 1 }" aria-hidden="true">{{ w }}</span>{{ ' ' }}</template>
        </p>
        <!-- Волна над цифрами: тонкая синусоида фирменного синего, фаза плавно «течёт» -->
        <svg class="ap-wave" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="apWaveG" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#002366" />
              <stop offset="1" stop-color="#7fa6dc" />
            </linearGradient>
            <mask id="apWaveM" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="24">
              <path class="ap-wave__p" d="M-120 12 q30 -9 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#fff" stroke-width="1.6" vector-effect="non-scaling-stroke" />
            </mask>
          </defs>
          <rect width="1200" height="24" fill="url(#apWaveG)" mask="url(#apWaveM)" />
        </svg>
        <ul ref="statsEl" class="ap-stats">
          <li v-for="(s, i) in stats" :key="s.value" class="dj-reveal" :style="{ transitionDelay: `${i * 0.08}s` }">
            <b>{{ statShown[i] }}</b>
            <span>{{ s.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ===== Природа очищает воду: схематичный разрез слоёв ===== -->
    <AboutLayers title="Природа очищает воду слой за слоем" lede="Песок, глина и корни фильтруют её веками. Мы переняли этот принцип у самой земли." />

    <!-- ===== Путь компании: вертикальная лента со шкалой прокрутки ===== -->
    <section id="history" class="dj-sec ap-sec ap-sec--visible">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">Путь компании</h2>
        <p class="dj-lede dj-reveal">От подрядных работ до собственного инжиниринга и производства</p>
      </div>
      <div class="dj-wrap">
        <AboutTimeline :events="timelineEvents" />
      </div>
    </section>

    <!-- ===== Одна система ESP: карточки глав наезжают друг на друга (sticky stack) ===== -->
    <section id="ecosystem" class="dj-sec dj-sec--soft ap-sec ap-sec--visible">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">Одна система ESP</h2>
        <p class="dj-lede dj-reveal">
          Проектирование и производство работают внутри одной компании: то, что рассчитали инженеры, изготавливается на нашем заводе и запускается той же командой.
        </p>
      </div>

      <div class="dj-wrap ap-stack">
        <article v-for="(st, i) in chapters" :key="st.title" class="ap-chap" :class="{ 'ap-chap--rev': i % 2 }" :style="{ '--i': i }">
          <div class="ap-chap__media">
            <img :srcset="srcset(IMAGES[st.img])" sizes="100vw" :src="IMAGES[st.img]" :alt="st.alt" width="2400" height="1350" loading="lazy" decoding="async" />
          </div>
          <div class="ap-chap__body">
            <span class="ap-chap__k">{{ st.kicker }}</span>
            <h3 class="ap-chap__h">{{ st.title }}</h3>
            <p v-for="p in st.text" :key="p" class="ap-chap__p">{{ p }}</p>
            <NuxtLink v-if="st.link" :to="st.link.to" class="dj-more">{{ st.link.label }}</NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <!-- ===== Оборудование ESP: горизонтальная галерея ===== -->
    <section class="dj-sec ap-sec">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">Собственный цех</h2>
        <p class="dj-lede dj-reveal">Оборудование ESP производится в Заславле. Качество контролируется на каждом узле.</p>
        <div class="dj-links dj-reveal"><NuxtLink to="/equipment" class="dj-more">Каталог оборудования</NuxtLink></div>
      </div>
      <!-- Реальный кадр цеха в Заславле (фото из журнальной статьи) -->
      <figure class="dj-wrap ap-shop dj-reveal">
        <img :srcset="srcset(IMAGES.workshop)" sizes="100vw" :src="IMAGES.workshop" alt="Ленточный фильтр-пресс в цехе ESP в Заславле" width="1280" height="960" loading="lazy" decoding="async" />
      </figure>
      <div class="ap-gal dj-reveal">
        <div ref="eqGal" class="ap-gal__track ap-gal__track--eq" tabindex="0" aria-label="Оборудование ESP">
          <EquipCard v-for="p in products" :key="p.slug" :item="p" class="ap-eq" />
        </div>
        <div class="dj-wrap ap-gal__ctrl">
          <button type="button" class="ap-arrow" aria-label="Назад" @click="scrollGal(eqGal, -1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg></button>
          <button type="button" class="ap-arrow" aria-label="Вперёд" @click="scrollGal(eqGal, 1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg></button>
        </div>
      </div>
    </section>

    <!-- ===== Что даёт одна система + команда ===== -->
    <section class="dj-sec dj-sec--soft ap-sec">
      <div class="dj-wrap">
        <div class="ap-head">
          <h2 class="ap-h dj-reveal">Что даёт одна система</h2>
        </div>
      </div>
      <AboutSystemBento :items="systemBento" />
    </section>

    <!-- ===== Эталон качества ===== -->
    <section id="quality" class="dj-sec ap-sec">
      <div class="dj-wrap">
        <div class="ap-q">
          <figure class="ap-q__drop dj-reveal">
            <img :srcset="srcset(IMAGES.qualitySign)" sizes="100vw" :src="IMAGES.qualitySign" alt="Знак качества ESP — фирменная капля «Эталон качества»" width="792" height="1156" loading="lazy" decoding="async" />
          </figure>
          <div class="ap-q__text">
            <span class="dj-eyebrow dj-reveal">Эталон качества</span>
            <h2 class="ap-h dj-reveal">Знак, который ставится на объекте</h2>
            <p class="dj-lede dj-reveal">Знак качества ESP для экологических объектов.</p>
            <ul class="ap-q__facts">
              <li v-for="f in qualityFacts" :key="f.value" class="dj-reveal"><b>{{ f.value }}</b><span>{{ f.label }}</span></li>
            </ul>
            <div class="ap-q__links dj-reveal">
              <NuxtLink to="/about/certifications" class="dj-more">Сертификаты</NuxtLink>
              <NuxtLink to="/about/documentation" class="dj-more">Документация</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Просвет: схема вместо фото ===== -->
    <AboutClarity
      eyebrow="Кристальный просвет — стандарт прозрачности очищенной воды"
      title="Прозрачность очищенной воды: просвет 4&nbsp;метра"
      lede="Произведено в Республике Беларусь."
      :depth="4"
    />

    <!-- ===== Шесть ступеней очистки: вертикальные панели ===== -->
    <section id="stages" class="dj-sec ap-sec">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">Шесть ступеней очистки</h2>
        <p class="dj-lede dj-reveal">От механической очистки до обеззараживания. Показатели на каждой фиксируются лабораторно.</p>
      </div>
      <AboutStages :stages="clarityStages" class="dj-reveal" />
    </section>

    <!-- ===== География работ ===== -->
    <section id="map" class="dj-sec dj-sec--soft ap-sec">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">География работ</h2>
          <p class="dj-lede dj-reveal">Объекты, которые мы спроектировали, изготовили и запустили</p>
      </div>
      <!-- Карта от края до края экрана -->
      <div class="ap-map dj-reveal">
        <ClientOnly>
          <ProjectsMap :points="mapPoints" class="ap-map__canvas" />
          <template #fallback>
            <div class="ap-map__canvas ap-map__wait">Загрузка карты…</div>
          </template>
        </ClientOnly>
      </div>
      <div class="dj-wrap">
        <p class="ap-map__note">
          Объекты по всей Беларуси — <NuxtLink to="/projects" class="dj-more">смотреть полный список</NuxtLink>
        </p>
      </div>
    </section>

    <!-- ===== Партнёрство: руки с каплей ESP (как финал презентации) ===== -->
    <section class="ap-hands" aria-labelledby="ap-hands-h">
      <img :srcset="srcset(IMAGES.hands)" sizes="100vw" :src="IMAGES.hands" alt="" width="1792" height="768" loading="lazy" decoding="async" class="dj-reveal" />
      <h2 id="ap-hands-h" class="ap-hands__h dj-reveal">Один исполнитель — от&nbsp;первого звонка до&nbsp;сервиса.</h2>
    </section>

    <!-- ===== Финал ===== -->
    <AppleCta title="Обсудим ваш объект" lede="Подготовим решение — от обследования площадки до пусконаладки очистных сооружений." />
  </div>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useProjectGeo } from '~/composables/useProjectGeo'
import { useReveal } from '~/composables/useReveal'

// Все кадры страницы в одном месте: замените пути, когда будут готовы новые фото.
const IMAGES = {
  introLoop: '/videos/hero/about-intro.mp4', // первый экран: первые 10 с фильма ESP, зациклены
  introPoster: '/videos/hero/about-intro.jpg',
  film: '/videos/hero/ESP_final_040926_1080.mp4', // полный фильм о компании
  filmPoster: '/images/ESP_video_final_poster.jpg',
  design: '/images/services/idea-table.webp', // глава «Проектирование»
  lidar: '/images/digital-twin/pointcloud-esp.webp', // глава «Облако точек»
  production: '/images/about/press-brake-closeup.webp', // глава «Производственная база»
  usbf: '/images/home/covers/usbf-cutaway.webp', // глава «Технология USBF»: разрез блока USBF (сгенерировано по правке владельца)
  qualitySign: '/images/quality-sign-etalon-a.webp', // знак «Эталон качества» целиком, с прозрачным фоном
  // Пути картинок только через привязку :src — статичный src="/images/…" в шаблоне
  // давал hydration mismatch (клиент собирал «/&/images/…» → 404, пустое место в «Собственном цехе»)
  workshop: '/images/about/workshop-beltpress-hall.webp', // «Собственный цех»: реальный кадр цеха (press.jpg из статьи)
  hands: '/images/brand/hands-drop.webp'
}

const { mapPoints } = useProjectGeo()
const { timeline } = useTimeline()
const { getBySlug } = useEquipment()

const subnav = [
  { href: '#film', label: 'Фильм' },
  { href: '#history', label: 'История' },
  { href: '#ecosystem', label: 'Система ESP' },
  { href: '#quality', label: 'Качество' },
  { href: '#stages', label: 'Очистка' },
  { href: '#map', label: 'География' }
]

// Фраза без повторов: цифры (28 лет, 30 000 элементов) идут ниже отдельной строкой
const statementText = 'Мы проектируем технологии очистки воды.'
const statementWords = statementText.split(' ')
const litWords = ref(0)

const stats = [
  { value: '28', label: 'лет опыта' },
  { value: '2 000+', label: 'реализованных проектов' },
  { value: '100+', label: 'специалистов в штате' },
  { value: '30 000', label: 'элементов в экосистеме ESP' }
]
// Досчёт цифр при появлении: на сервере и без JS сразу итоговые значения
const statShown = ref(stats.map((s) => s.value))
const statsEl = ref(null)
const fmt = (n) => (n < 1000 ? String(n) : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'))
const countUp = () => {
  const parts = stats.map((s) => { const m = s.value.match(/^([\d\s]+)(.*)$/); return m ? { n: Number(m[1].replace(/\s/g, '')), suf: m[2] } : null })
  const t0 = performance.now()
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 1600)
    const e = 1 - Math.pow(1 - k, 3)
    statShown.value = stats.map((s, i) => (parts[i] ? fmt(Math.round(parts[i].n * e)) + parts[i].suf : s.value))
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// Путь компании: годы из админки + «вектор в будущее» последней карточкой
const isFuture = (ev) => !/^\d{4}$/.test(String(ev?.year ?? '').trim())
const timelineEvents = computed(() => {
  const list = timeline.value.filter(Boolean)
  const past = list.filter((ev) => !isFuture(ev))
  const future = list.find((ev) => isFuture(ev))
  return future ? [...past, future] : past
})

// Главы «Одной системы»: липкий кадр слева, подписи меняются
const chapters = [
  {
    img: 'design', kicker: '01 · Проектируем', title: 'Инжиниринговый центр', alt: 'Инженер ESP за 3D-моделью станции',
    text: [
      'Расчёты, технологические решения и рабочая документация. Модель объекта собирается до начала стройки — 30 000 элементов стыкуются ещё на этапе проекта.',
      'Проектируем очистные сооружения под условия конкретного объекта.'
    ]
  },
  {
    img: 'lidar', kicker: 'Лидарное сканирование', title: 'Облако из миллионов точек', alt: 'Очистные сооружения с высоты',
    text: [
      'Дрон с лидаром облетает площадку и собирает облако из миллионов точек с сантиметровой точностью.',
      'На облаке точек проектируем новую станцию: она размещается на месте старых сооружений и занимает в разы меньше площади. Всё работоспособное сохраняем, остальное — под демонтаж.'
    ]
  },
  {
    img: 'production', kicker: '02 · Изготавливаем', title: 'Производственная база', alt: 'Листогибочный пресс на производстве ESP',
    text: [
      'Собственное производство в Заславле. Оборудование выпускается по нашей же документации, каждый узел проверяется до отгрузки на объект.',
      'Каждый узел проходит контроль качества до отгрузки.'
    ],
    link: { to: '/equipment', label: 'Каталог оборудования' }
  },
  {
    img: 'usbf', kicker: 'Решения на базе USBF', title: 'Технология USBF', alt: 'Блок USBF в разрезе: аноксидная зона, аэрация, осветлитель со слоем ила',
    text: ['Внедряем технологию USBF под задачи конкретного объекта. Опираемся на 28 лет практики в биологической очистке сточных вод.']
  }
]

const products = [
  ['flotation', 'flotation-units'],
  ['polymer-station', 'polymer-dosing-station'],
  ['microfilter', 'microfilters-sand-traps'],
  ['belt-filter-press', 'filter-press'],
  ['rotary-drum-sieve', 'rotary-drum-sieve'],
  ['sand-separator', 'sand-separator'],
  ['screw-conveyor', 'screw-conveyor']
].map(([file, slug]) => ({ src: `/images/equipment/cut/${file}.webp`, slug, name: getBySlug(slug)?.name || '' }))

// «Что даёт одна система»: бенто (components/about/SystemBento.vue); лидар и двойник — утверждённые слои /images/digital-twin
const systemBento = [
  { size: 'lg', image: '/images/about/press-brake-team.webp', alt: 'Листогибочный пресс в цехе ESP', kicker: 'Производство', label: 'Собственное производство в Заславле' },
  { size: 'sm', tall: true, kicker: 'Команда', label: 'Собственный штат специалистов', people: '/images/about/team-pair.webp', alt: 'Сотрудники ESP в фирменных поло' },
  { size: 'md', art: '/images/digital-twin/layer-lidar-b.webp', alt: 'Облако точек: дрон с лидаром сканирует площадку очистных сооружений', label: 'Лидарное сканирование площадки с сантиметровой точностью' },
  { size: 'md', image: '/images/digital-twin/pointcloud-esp.webp', alt: 'Цифровой двойник очистных сооружений', label: 'Цифровой двойник для эксплуатации' },
  { size: 'sm', image: '/images/about/lean-gears.webp', alt: 'Стальные шестерни в зацеплении — бережливое производство', value: 'Lean', label: 'Бережливое производство по принципам Lean' },
  { size: 'sm', art: '/images/digital-twin/layer-bim-b.webp', alt: 'BIM-модель очистных сооружений', label: '3D-проектирование и BIM-модель объекта' },
  { size: 'sm', art: '/images/brand/esp-drop-quality.webp', alt: 'Знак «Эталон качества ESP»', label: 'Контроль качества на каждом этапе' }
]

const qualityFacts = [
  { value: 'Аттестат', label: '2-й категории сложности проектирования' },
  { value: 'Под ключ', label: 'единая ответственность: проект, оборудование, пусконаладка' }
]

// Шесть ступеней очистки: единый набор утверждённых кадров, все панели object-fit: cover
const clarityStages = [
  { label: 'Механическая', result: 'Отделение крупных примесей и песка', img: '/images/about/stages/1-mechanical.webp' },
  { label: 'Физико-химическая', result: 'Связывание фосфора и тонкой взвеси', img: '/images/about/stages/2-physchem.webp' },
  { label: 'Биологическая USBF', result: 'Удаление органики и азота', img: '/images/about/stages/3-bio.webp' },
  { label: 'Механическое обезвоживание осадков', result: 'Сокращение объёма осадка', img: '/images/about/stages/4-dewatering.webp' },
  { label: 'Микрофильтрация', result: 'Доочистка от мельчайших частиц', img: '/images/about/stages/5-microfilter.webp' },
  { label: 'Обеззараживание', result: 'Безопасная вода на выпуске', img: '/images/about/stages/6-uv.webp' }
]

const root = ref(null)
const statement = ref(null)
const heroVideo = ref(null)
const eqGal = ref(null)
const heroPaused = ref(false)
const toggleHero = () => {
  const v = heroVideo.value
  if (!v) return
  if (v.paused) { v.play().catch(() => {}); heroPaused.value = false } else { v.pause(); heroPaused.value = true }
}

const jumpTo = (href) => {
  const el = document.querySelector(href)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56 - 52, behavior: 'smooth' })
}
const scrollGal = (el, dir) => {
  if (!el) return
  const card = el.firstElementChild
  const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8
  el.scrollBy({ left: dir * step, behavior: 'smooth' })
}

useReveal(root)

// Движение: медленный наезд кадров и проявление слов — один обработчик прокрутки
let raf = 0
let zoomEls = []
let videoIo = null
let statsIo = null
let reduced = false
const clamp = (v) => Math.min(1, Math.max(0, v))
const tick = () => {
  raf = 0
  const vh = window.innerHeight
  for (const el of zoomEls) {
    const r = el.getBoundingClientRect()
    if (r.bottom < 0 || r.top > vh) continue
    el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(3))
  }
  if (statement.value) {
    const r = statement.value.getBoundingClientRect()
    const p = clamp((vh * 0.85 - r.top) / (vh * 0.85 - vh * 0.3 + r.height * 0.4))
    litWords.value = Math.round(p * statementWords.length)
  }
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    litWords.value = statementWords.length
    heroVideo.value?.pause()
    heroPaused.value = true
  } else {
    zoomEls = Array.from(root.value?.querySelectorAll('[data-zoom]') || [])
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    tick()
  }
  if ('IntersectionObserver' in window) {
    // Ролики играют только в кадре и не при «меньше движения»
    videoIo = new IntersectionObserver((es) => {
      es.forEach((e) => {
        const v = e.target
        if (e.isIntersecting && !reduced && !heroPaused.value) v.play().catch(() => {})
        else v.pause()
      })
    }, { threshold: 0.2 })
    ;[heroVideo.value].filter(Boolean).forEach((v) => videoIo.observe(v))
    if (!reduced && statsEl.value) {
      statShown.value = stats.map((s) => s.value.replace(/[\d\s]+/, '0'))
      statsIo = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) { countUp(); statsIo.disconnect() }
      }, { threshold: 0.4 })
      statsIo.observe(statsEl.value)
    }
  } else {
    litWords.value = statementWords.length
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
  videoIo?.disconnect()
  statsIo?.disconnect()
})

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead({
  title: 'О компании ESP | ЭкоСервисПроект — 28 лет опыта, 30 000 элементов',
  meta: [
    { name: 'description', content: 'История ЭкоСервисПроект с 1999 года: собственный инжиниринг и производство очистных сооружений, таймлайн компании, сертификаты качества.' },
    { property: 'og:title', content: 'О компании ESP | 28 лет опыта' },
    { property: 'og:description', content: 'История ЭкоСервисПроект с 1999 года: собственный инжиниринг и производство, сертификаты качества, 150+ объектов в Беларуси.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [
    { rel: 'canonical', href: 'https://ecoservisproekt.by/about' },
    { rel: 'preload', as: 'image', href: IMAGES.introPoster, fetchpriority: 'high' }
  ]
})
</script>

<style scoped>
.ap { overflow-x: clip; }
.ap-sec { overflow: hidden; }
.ap-sec--visible { overflow: visible; }

/* Крупные короткие заголовки, как на apple.com/environment */
.ap-h { font-size: clamp(36px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); }
.ap-h--sm { font-size: clamp(30px, 3.6vw, 48px); }
.ap-head { max-width: 1200px; margin-bottom: clamp(36px, 5vw, 64px); }
.ap-head .dj-lede { margin-top: 18px; max-width: 46ch; font-size: clamp(17px, 1.5vw, 21px); }
.ap-head .dj-links { justify-content: flex-start; }

/* ===== Первый экран: заставка-ролик во весь экран ===== */
.ap-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.ap-hero { position: relative; height: calc(100svh - var(--dj-header-h, 56px)); min-height: 420px; max-height: 1100px; overflow: hidden; background: #06121f; }
.ap-hero__v { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ap-hero__fade { position: absolute; inset: auto 0 0 0; height: 30%; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 8, 20, 0.45) 100%); pointer-events: none; }
.ap-hero__cue { position: absolute; left: 50%; bottom: clamp(20px, 4vh, 40px); transform: translateX(-50%); display: inline-flex; flex-direction: column; align-items: center; gap: 4px; font-size: 15px; font-weight: 600; color: #fff; text-shadow: 0 1px 10px rgba(0, 0, 0, 0.35); }
.ap-hero__cue svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; animation: ap-cue 1.8s ease-in-out infinite; }
@keyframes ap-cue { 50% { transform: translateY(5px); } }
.ap-hero__pause { position: absolute; right: clamp(16px, 3vw, 32px); bottom: clamp(20px, 4vh, 40px); display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; color: #fff; background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); transition: background-color 0.2s ease; }
.ap-hero__pause:hover { background: rgba(255, 255, 255, 0.3); }
.ap-hero__pause svg { width: 16px; height: 16px; fill: currentColor; }

/* ===== Заявление ===== */
.ap-statement { padding: clamp(64px, 9vw, 120px) 0; }
.ap-statement__h { max-width: 18ch; font-size: clamp(34px, 5.6vw, 80px); line-height: 1.08; font-weight: 600; letter-spacing: -0.015em; }
.ap-word { color: #d2d4d6; transition: color 0.5s var(--dj-ease); }
.ap-word.is-lit { color: var(--dj-ink); }
.ap-word.is-key.is-lit { color: var(--dj-blue); }
/* Волна над цифрами (вместо серой линии) */
.ap-wave { display: block; width: 100%; height: 24px; margin: clamp(40px, 5vw, 76px) 0 0; overflow: hidden; }
.ap-wave__p { animation: ap-wave 4.5s linear infinite; }
@keyframes ap-wave { to { transform: translateX(120px); } }

/* ===== Цифры ===== */
.ap-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0 clamp(20px, 3vw, 48px); list-style: none; margin: 0; padding: 0; }
.ap-stats li { display: grid; gap: 6px; padding-top: 22px; align-content: start; }
.ap-stats b { font-size: clamp(36px, 4.2vw, 68px); line-height: 1; font-weight: 500; letter-spacing: -0.025em; color: var(--dj-blue); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ap-stats span { font-size: clamp(14px, 1.15vw, 17px); line-height: 1.35; color: var(--dj-text); }
@media (max-width: 900px) { .ap-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px; } .ap-stats b { font-size: clamp(36px, 9vw, 56px); } }

/* ===== Горизонтальные галереи ===== */
.ap-gal__track {
  --gut: max(24px, calc((100vw - 1200px) / 2 + 24px));
  display: flex; gap: 20px; overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--gut); padding: 4px var(--gut) 24px; scrollbar-width: none; outline: none;
}
.ap-gal__track::-webkit-scrollbar { display: none; }
.ap-gal__track > * { flex: 0 0 auto; scroll-snap-align: start; }
.ap-gal__ctrl { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
.ap-arrow { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(0, 0, 0, 0.06); color: var(--dj-ink); transition: background-color 0.2s ease; }
.ap-arrow:hover { background: rgba(0, 0, 0, 0.12); }
.ap-arrow svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Оборудование */
.ap-gal__track--eq { padding-top: 120px; }
.ap-eq { width: min(300px, 82vw); }

/* ===== Главы «Одной системы»: белые карточки, каждая следующая наезжает поверх (sticky stack) ===== */
.ap-stack { display: grid; gap: 28px; padding-bottom: 4vh; }
.ap-chap {
  position: sticky;
  top: calc(var(--dj-header-h, 44px) + 52px + 24px + var(--i, 0) * 14px);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  min-height: min(540px, calc(100vh - var(--dj-header-h, 44px) - 52px - 120px));
  border-radius: var(--r-lg);
  overflow: hidden;
  background: #fff;
  box-shadow: var(--sh-2, 0 10px 40px rgba(0, 0, 0, 0.08));
}
.ap-chap__media { position: relative; min-height: 100%; background: #EDEDED; }
.ap-chap__media img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; }
.ap-chap--rev .ap-chap__media { order: 2; }
.ap-chap__body { display: flex; flex-direction: column; justify-content: center; padding: clamp(28px, 4vw, 64px); }
.ap-chap__k { font-size: 15px; font-weight: 600; color: var(--dj-blue); }
.ap-chap__h { margin-top: 8px; font-size: clamp(28px, 3vw, 44px); line-height: 1.1; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); }
.ap-chap__p { margin-top: 16px; font-size: clamp(16px, 1.25vw, 18px); line-height: 1.55; color: var(--dj-text); max-width: 44ch; }
.ap-chap .dj-more { margin-top: 18px; }

/* Собственный цех: реальный кадр во всю ширину контейнера */
.ap-shop { margin-top: 0; margin-bottom: clamp(24px, 4vw, 48px); }
.ap-shop img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; object-position: 50% 45%; border-radius: var(--r-lg); background: #EDEDED; }

/* ===== Качество ===== */
.ap-q { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 96px); align-items: center; }
.ap-q__drop { margin: 0; display: grid; place-items: center; padding: 0; background: none; }
.ap-q__drop img { display: block; width: auto; height: auto; max-width: 100%; max-height: min(70vh, 640px); object-fit: contain; }
.ap-q__text .dj-eyebrow { color: var(--dj-blue); margin-bottom: 12px; }
.ap-q__text .dj-lede { margin-top: 18px; max-width: 44ch; }
.ap-q__facts { list-style: none; margin: 32px 0 0; padding: 0; }
.ap-q__facts li { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); gap: 20px; align-items: baseline; padding: 18px 0; border-top: 1px solid var(--dj-line); }
.ap-q__facts b { font-size: clamp(32px, 3.4vw, 48px); line-height: 1; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); white-space: nowrap; }
.ap-q__facts span { font-size: 16px; line-height: 1.45; color: var(--dj-text); }
.ap-q__links { display: flex; flex-wrap: wrap; gap: 10px 24px; margin-top: 24px; }

/* ===== Карта ===== */
.ap-map { width: 100%; background: #fff; }
.ap-map__canvas { display: block; width: 100%; height: 70vh; min-height: 420px; }
.ap-map__wait { display: grid; place-items: center; font-size: 14px; color: rgba(26, 26, 26, 0.4); }
.ap-map__note { margin-top: 20px; font-size: 16px; color: var(--dj-text); }

@media (max-width: 1023px) {
  .ap-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  /* Планшет и телефон: фото сверху, текст снизу — та же стопка */
  .ap-stack { gap: 20px; }
  .ap-chap { grid-template-columns: minmax(0, 1fr); min-height: 0; top: calc(var(--dj-header-h, 44px) + 48px + 12px + var(--i, 0) * 10px); border-radius: var(--r-md); }
  .ap-chap__media { min-height: 0; aspect-ratio: 16 / 10; }
  .ap-chap--rev .ap-chap__media { order: 0; }
  .ap-chap__body { padding: 22px 20px 26px; }
  .ap-chap__p { margin-top: 12px; }
}
@media (max-width: 767px) {
  .ap-stats { gap: 0 20px; }
  .ap-stats b { font-size: clamp(40px, 12vw, 56px); }
  .ap-stats span { font-size: 15px; }
  .ap-shop img { aspect-ratio: 4 / 3; border-radius: var(--r-md); }
  .ap-q__drop { border-radius: var(--r-md); }
  .ap-map__canvas { height: 60vh; min-height: 360px; }
  .ap-q { grid-template-columns: 1fr; }
  .ap-q__drop img { max-height: 420px; }
  .ap-q__facts li { grid-template-columns: 1fr; gap: 6px; }
  .ap-gal__ctrl { display: none; }
  .ap-h, .ap-statement__h { overflow-wrap: break-word; hyphens: manual; }
}
@media (prefers-reduced-motion: reduce) {
  .ap-word { transition: none; }
  .ap-wave__p { animation: none; }
  .ap-hero__cue svg { animation: none; }
  .ap-gal__track { scroll-behavior: auto; }
}
.ap-hands { padding: clamp(56px, 7vw, 104px) 0 clamp(8px, 2vw, 24px); background: #fff; text-align: center; }
.ap-hands img { display: block; width: 100%; height: auto; margin: 0 auto; mix-blend-mode: multiply; }
.ap-hands__h { margin: clamp(8px, 1.5vw, 20px) auto 0; width: min(92%, 980px); font-size: clamp(36px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); text-wrap: balance; }
</style>

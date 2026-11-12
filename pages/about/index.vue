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
      <video ref="heroVideo" class="ap-hero__v" :poster="IMAGES.introPoster" autoplay muted loop playsinline preload="auto" aria-hidden="true">
        <source :src="IMAGES.introLoop" type="video/mp4" />
      </video>
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
        <p ref="statement" class="ap-statement__h" :aria-label="statementText">
          <template v-for="(w, i) in statementWords" :key="i"><span class="ap-word" :class="{ 'is-lit': i < litWords }" aria-hidden="true">{{ w }}</span>{{ ' ' }}</template>
        </p>
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

    <!-- ===== Одна система ESP: липкий кадр, меняющиеся подписи ===== -->
    <section id="ecosystem" class="dj-sec dj-sec--soft ap-sec">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">Одна система ESP</h2>
        <p class="dj-lede dj-reveal">
          Проектирование и производство работают внутри одной компании: то, что рассчитали инженеры, изготавливается на нашем заводе и запускается той же командой.
        </p>
      </div>

      <div class="dj-wrap ap-sticky">
        <div class="ap-sticky__media" aria-hidden="true">
          <div class="ap-sticky__frame">
            <img v-for="(st, i) in chapters" :key="st.img" :src="IMAGES[st.img]" alt="" :class="{ 'is-on': i === activeChapter }" loading="lazy" decoding="async" />
          </div>
        </div>
        <div class="ap-sticky__steps">
          <article v-for="(st, i) in chapters" :key="st.title" :ref="(el) => { stepEls[i] = el }" class="ap-step" :class="{ 'is-on': i === activeChapter }" :data-i="i">
            <img :src="IMAGES[st.img]" :alt="st.alt" class="ap-step__img" loading="lazy" decoding="async" />
            <span class="ap-step__k">{{ st.kicker }}</span>
            <h3 class="ap-step__h">{{ st.title }}</h3>
            <p v-for="p in st.text" :key="p" class="ap-step__p">{{ p }}</p>
            <NuxtLink v-if="st.link" :to="st.link.to" class="dj-more">{{ st.link.label }}</NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== Оборудование ESP: горизонтальная галерея ===== -->
    <section class="dj-sec ap-sec">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">Собственный цех</h2>
        <p class="dj-lede dj-reveal">Оборудование ESP производится в Заславле. Качество контролируется на каждом узле.</p>
        <div class="dj-links dj-reveal"><NuxtLink to="/equipment" class="dj-more">Каталог оборудования</NuxtLink></div>
      </div>
      <!-- Акцент: всё оборудование ESP на подиумах (перенесено с /equipment) -->
      <figure class="ap-podium dj-reveal">
        <img src="/images/equipment/banner/podium.webp" alt="Оборудование ESP собственного производства на подиумах" width="1082" height="1280" loading="lazy" decoding="async" />
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
      <AppleBento :items="systemBento" />
    </section>

    <!-- ===== Эталон качества ===== -->
    <section id="quality" class="dj-sec ap-sec">
      <div class="dj-wrap">
        <div class="ap-q">
          <figure class="ap-q__drop dj-reveal">
            <img :src="IMAGES.qualitySign" alt="Знак качества ESP — фирменная капля «Эталон качества»" width="792" height="1156" loading="lazy" decoding="async" />
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
      <div class="dj-wrap">
        <div class="ap-head">
          <h2 class="ap-h dj-reveal">География работ</h2>
          <p class="dj-lede dj-reveal">Объекты, которые мы спроектировали, изготовили и запустили</p>
        </div>
        <div class="ap-map dj-reveal">
          <ClientOnly>
            <ProjectsMap :points="mapPoints" class="w-full aspect-video" />
            <template #fallback>
              <div class="w-full aspect-video flex items-center justify-center text-esp-black/40 text-sm">Загрузка карты…</div>
            </template>
          </ClientOnly>
        </div>
        <p class="ap-map__note">
          2 000+ проектов по всей Беларуси — <NuxtLink to="/projects" class="dj-more">смотреть полный список</NuxtLink>
        </p>
      </div>
    </section>

    <!-- ===== Партнёрство: руки с каплей ESP (как финал презентации) ===== -->
    <section class="ap-hands" aria-labelledby="ap-hands-h">
      <img src="/images/brand/hands-drop.webp" alt="" width="1792" height="768" loading="lazy" decoding="async" class="dj-reveal" />
      <h2 id="ap-hands-h" class="ap-hands__h dj-reveal">Один исполнитель — от&nbsp;первого звонка до&nbsp;сервиса.</h2>
    </section>

    <!-- ===== Финал ===== -->
    <AppleCta title="Обсудим ваш объект" lede="Подготовим решение — от обследования площадки до пусконаладки очистных сооружений." />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useProjectGeo } from '~/composables/useProjectGeo'
import { useReveal } from '~/composables/useReveal'

// Все кадры страницы в одном месте: замените пути, когда будут готовы новые фото.
const IMAGES = {
  introLoop: '/videos/hero/about-intro.mp4', // первый экран: первые 10 с фильма ESP, зациклены
  introPoster: '/videos/hero/about-intro.jpg',
  film: '/videos/hero/ESP_final_040926_1080.mp4', // полный фильм о компании
  filmPoster: '/images/ESP_video_final_poster.jpg',
  design: '/images/real4k/cad-screen.webp', // глава «Проектирование»
  lidar: '/images/real4k/aerial-octagons.webp', // глава «Облако точек»
  production: '/images/real4k/laser-head.webp', // глава «Производственная база»
  usbf: '/images/real4k/aerial-aerotank.webp', // глава «Технология USBF»
  qualitySign: '/images/quality-sign-etalon-a.webp' // знак «Эталон качества» целиком, с прозрачным фоном
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
    img: 'production', kicker: '02 · Изготавливаем', title: 'Производственная база', alt: 'Лазерная резка металла на производстве ESP',
    text: [
      'Собственное производство в Заславле. Оборудование выпускается по нашей же документации, каждый узел проверяется до отгрузки на объект.',
      'Каждый узел проходит контроль качества до отгрузки.'
    ],
    link: { to: '/equipment', label: 'Каталог оборудования' }
  },
  {
    img: 'usbf', kicker: 'Решения на базе USBF', title: 'Технология USBF', alt: 'Аэротенки очистных сооружений ESP',
    text: ['Внедряем технологию USBF под задачи конкретного объекта. Опираемся на 28 лет практики в биологической очистке сточных вод.']
  }
]
const activeChapter = ref(0)
const stepEls = []

const products = [
  ['flotation', 'flotation-units'],
  ['polymer-station', 'polymer-dosing-station'],
  ['microfilter', 'microfilters-sand-traps'],
  ['belt-filter-press', 'filter-press'],
  ['rotary-drum-sieve', 'rotary-drum-sieve'],
  ['sand-separator', 'sand-separator'],
  ['screw-conveyor', 'screw-conveyor']
].map(([file, slug]) => ({ src: `/images/equipment/cut/${file}.webp`, slug, name: getBySlug(slug)?.name || '' }))

// «Что даёт одна система»: бенто из реальных кадров и фактов (вместо общего фото команды)
const systemBento = [
  { size: 'lg', image: '/images/real4k/laser-head.webp', alt: 'Лазерная резка металла на производстве ESP', kicker: 'Производство', label: 'Собственное производство в Заславле' },
  { size: 'sm', value: '100+', label: 'специалистов в штате' },
  { size: 'sm', tone: 'ink', value: 'Lean', label: 'Бережливое производство по принципам Lean' },
  { size: 'md', image: '/images/tech/lidar-scan.webp', alt: 'Облако точек лидарного сканирования площадки', label: 'Лидарное сканирование площадки с сантиметровой точностью' },
  { size: 'md', image: '/images/tech/twin-scan.webp', alt: 'Цифровой двойник очистных сооружений', label: 'Цифровой двойник для эксплуатации' },
  { size: 'sm', value: '3D', label: '3D-проектирование и BIM-модель объекта' },
  { size: 'sm', kicker: 'Узлы', label: 'Локализация узлов и импортозамещение' },
  { size: 'sm', kicker: 'Контроль', label: 'Контроль качества на каждом этапе' }
]

const qualityFacts = [
  { value: '4 м', label: 'кристальный просвет — стандарт прозрачности очищенной воды' },
  { value: 'Аттестат', label: '2-й категории сложности проектирования' },
  { value: 'Под ключ', label: 'единая ответственность: проект, оборудование, пусконаладка' }
]

// Шесть ступеней очистки: реальные кадры из public/images
const clarityStages = [
  { label: 'Механическая', result: 'Отделение крупных примесей и песка', img: '/images/technologies/cards/mechanical-filtration.webp' },
  { label: 'Физико-химическая', result: 'Связывание фосфора и тонкой взвеси', img: '/images/technologies/cards/physiochemical-methods.webp' },
  { label: 'Биологическая USBF', result: 'Удаление органики и азота', img: '/images/real4k/aerial-aerotank.webp' },
  { label: 'Механическое обезвоживание осадков', result: 'Сокращение объёма осадка', img: '/images/equipment/beltpress-real.webp' },
  { label: 'Микрофильтрация', result: 'Доочистка от мельчайших частиц', img: '/images/equipment/real/microfilter.webp', contain: true },
  { label: 'Обеззараживание', result: 'Безопасная вода на выпуске', img: '/images/technologies/cards/uv-disinfection.webp' }
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
let stepIo = null
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
    stepIo = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) activeChapter.value = Number(e.target.dataset.i) })
    }, { rootMargin: '-45% 0px -45% 0px' })
    stepEls.filter(Boolean).forEach((el) => stepIo.observe(el))
  } else {
    litWords.value = statementWords.length
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
  videoIo?.disconnect()
  stepIo?.disconnect()
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
.ap-podium { margin: clamp(8px, 2vw, 24px) auto clamp(24px, 4vw, 48px); padding: 0 16px; display: flex; justify-content: center; }
.ap-podium img { display: block; width: auto; height: clamp(300px, 38vw, 560px); max-width: 100%; object-fit: contain; }
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
.ap-statement { padding: clamp(72px, 10vw, 144px) 0 clamp(80px, 10vw, 144px); }
.ap-statement__h { max-width: 18ch; font-size: clamp(34px, 5.6vw, 80px); line-height: 1.08; font-weight: 600; letter-spacing: -0.015em; }
.ap-word { color: #d2d4d6; transition: color 0.5s var(--dj-ease); }
.ap-word.is-lit { color: var(--dj-ink); }

/* ===== Цифры ===== */
.ap-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0 clamp(20px, 3vw, 48px); list-style: none; margin: clamp(48px, 6vw, 88px) 0 0; padding: 0; border-top: 1px solid var(--dj-line); }
.ap-stats li { display: grid; gap: 6px; padding-top: 28px; align-content: start; }
.ap-stats b { font-size: clamp(36px, 4.2vw, 68px); line-height: 1; font-weight: 500; letter-spacing: -0.025em; color: var(--dj-ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
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

/* ===== Главы с липким кадром ===== */
.ap-sticky { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); }
.ap-sticky__media { position: relative; }
.ap-sticky__frame { position: sticky; top: calc(var(--dj-header-h) + 52px + 6vh); aspect-ratio: 4 / 5; max-height: calc(100vh - var(--dj-header-h) - 52px - 12vh); width: 100%; border-radius: var(--r-lg); overflow: hidden; background: #dfe3e6; }
.ap-sticky__frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.06); transition: opacity 0.9s var(--dj-ease), transform 1.6s var(--dj-ease); }
.ap-sticky__frame img.is-on { opacity: 1; transform: none; }
.ap-step { display: flex; flex-direction: column; justify-content: center; min-height: 80vh; padding: 8vh 0; opacity: 0.28; transition: opacity 0.6s var(--dj-ease); }
.ap-step.is-on { opacity: 1; }
.ap-step__img { display: none; }
.ap-step__k { font-size: 15px; font-weight: 600; color: var(--dj-muted); }
.ap-step__h { margin-top: 8px; font-size: clamp(30px, 3.4vw, 48px); line-height: 1.1; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); }
.ap-step__p { margin-top: 16px; font-size: clamp(17px, 1.3vw, 19px); line-height: 1.55; color: var(--dj-text); max-width: 42ch; }
.ap-step .dj-more { margin-top: 18px; }

/* ===== Качество ===== */
.ap-q { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 96px); align-items: center; }
.ap-q__drop { margin: 0; display: grid; place-items: center; padding: 0; background: none; }
.ap-q__drop img { display: block; width: auto; height: auto; max-width: 100%; max-height: min(70vh, 640px); object-fit: contain; }
.ap-q__text .dj-eyebrow { color: var(--dj-blue); margin-bottom: 12px; }
.ap-q__text .ap-h { font-size: clamp(34px, 4.4vw, 64px); }
.ap-q__text .dj-lede { margin-top: 18px; max-width: 44ch; }
.ap-q__facts { list-style: none; margin: 32px 0 0; padding: 0; }
.ap-q__facts li { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); gap: 20px; align-items: baseline; padding: 18px 0; border-top: 1px solid var(--dj-line); }
.ap-q__facts b { font-size: clamp(32px, 3.4vw, 48px); line-height: 1; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); white-space: nowrap; }
.ap-q__facts span { font-size: 16px; line-height: 1.45; color: var(--dj-text); }
.ap-q__links { display: flex; flex-wrap: wrap; gap: 10px 24px; margin-top: 24px; }

/* ===== Карта ===== */
.ap-map { border-radius: var(--r-lg); overflow: hidden; background: #fff; }
.ap-map__note { margin-top: 20px; font-size: 16px; color: var(--dj-text); }

@media (max-width: 1023px) {
  .ap-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .ap-stats { gap: 0 20px; }
  .ap-stats b { font-size: clamp(40px, 12vw, 56px); }
  .ap-stats span { font-size: 15px; }
  .ap-sticky { grid-template-columns: 1fr; }
  .ap-sticky__media { display: none; }
  .ap-step { min-height: 0; padding: 0 0 56px; opacity: 1; }
  .ap-step__img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--r-md); margin-bottom: 24px; }
  .ap-q__drop, .ap-map { border-radius: var(--r-md); }
  .ap-q { grid-template-columns: 1fr; }
  .ap-q__drop img { max-height: 420px; }
  .ap-q__facts li { grid-template-columns: 1fr; gap: 6px; }
  .ap-gal__ctrl { display: none; }
  .ap-h, .ap-statement__h { overflow-wrap: break-word; hyphens: manual; }
}
@media (prefers-reduced-motion: reduce) {
  .ap-word { transition: none; }
  .ap-hero__cue svg { animation: none; }
  .ap-sticky__frame img, .ap-step,   .ap-gal__track { scroll-behavior: auto; }
}
.ap-hands { padding: clamp(56px, 7vw, 104px) 0 clamp(8px, 2vw, 24px); background: #fff; text-align: center; }
.ap-hands img { display: block; width: 100%; height: auto; margin: 0 auto; mix-blend-mode: multiply; }
.ap-hands__h { margin: clamp(8px, 1.5vw, 20px) auto 0; width: min(92%, 760px); font-size: clamp(26px, 3.2vw, 44px); line-height: 1.1; font-weight: 600; letter-spacing: -0.015em; color: #1A1A1A; text-wrap: balance; }
</style>

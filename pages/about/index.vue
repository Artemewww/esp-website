<template>
  <div class="about-page">
    <!-- Hero Video Section (Full Screen Brand Film) -->
    <section data-header="dark" class="hero-video relative min-h-screen flex items-center justify-center overflow-hidden bg-esp-black">
      
      <!-- Video Background -->
      <div class="hero-video__bg absolute inset-0 w-full h-full">
        <!-- Ролик первого экрана берётся из админки (раздел «about-hero»: video, poster).
             Пока раздела нет или он пуст — играет ролик из сборки. -->
        <video
          ref="brandVideo"
          :key="aboutHero.video"
          class="w-full h-full object-cover"
          :poster="aboutHero.poster"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
        >
          <source :src="aboutHero.video" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        
        <!-- Overlay для читаемости -->
        <div class="hero-video__overlay absolute inset-0 bg-gradient-to-b from-esp-black/70 via-esp-black/50 to-esp-black/80" />
        
        <!-- Паттерн «Лист трансформации» -->
        <div class="hero-video__pattern absolute inset-0 opacity-[0.08]" />
      </div>
      
      <!-- Content -->
      <div class="container relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <div class="hero-video__badge inline-flex items-center gap-2 px-4 py-2 bg-esp-black/60 backdrop-blur-sm text-white rounded-full font-semibold text-sm mb-6 animate-on-scroll border border-white/30">
            <span class="w-2 h-2 bg-esp-green rounded-full animate-pulse" />
            28 лет опыта
          </div>
          
          <h1 class="hero-video__title text-white mb-6 animate-on-scroll" style="animation-delay: 0.1s">
            Инженерия, которой <span class="text-esp-green">доверяют</span>
          </h1>

          <p class="hero-video__subtitle text-lg text-white/90 mb-10 max-w-2xl mx-auto animate-on-scroll" style="animation-delay: 0.2s">
            28 лет практики: от подрядных работ до собственного инжиниринга и производства. Проектируем, изготавливаем и запускаем очистные сооружения, отвечая за результат целиком.
          </p>
          
          <div class="hero-video__actions flex flex-wrap justify-center gap-4 animate-on-scroll" style="animation-delay: 0.3s">
            <a href="#history" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition">
              Наша история
            </a>
            <a href="#ecosystem" class="bg-white text-esp-black px-8 py-4 font-medium hover:bg-esp-gray transition">
              Экосистема ESP
            </a>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <button 
        @click="scrollToHistory" 
        class="hero-video__scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors z-10"
        aria-label="Прокрутить вниз"
      >
        <span class="text-xs font-medium">Прокрутите</span>
        <div class="w-6 h-10 border-2 border-white/50 rounded-full relative">
          <div class="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-white rounded-full animate-scroll" />
        </div>
      </button>
    </section>

    <!-- History & Timeline Section -->
    <section id="history" class="section history bg-white">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">Путь компании</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            28 лет практики: от подрядных работ до собственного инжиниринга и производства
          </p>
        </div>
        
        <!-- Интерактивная линия: годы и тексты из админки (useTimeline).
             Пункт без года («Дальше») рисуется не точкой, а стрелкой за
             последним годом — линия уходит в будущее. -->
        <div class="max-w-4xl mx-auto">
          <div class="tl mb-12" :class="{ 'tl--open': futureEvent }">
            <div class="tl-rail">
              <span class="tl-line" aria-hidden="true"></span>
              <span class="tl-line tl-line--done" :style="{ width: progressWidth }" aria-hidden="true"></span>
              <span
                v-if="futureEvent"
                class="tl-future"
                :class="{ 'is-active': activeIsFuture }"
                aria-hidden="true"
              >
                <svg class="tl-arrow" viewBox="0 0 14 14"><path d="M2 2l9 5-9 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <button
                v-for="(ev, i) in timelineEvents"
                :key="`${ev.year}-${i}`"
                type="button"
                class="tl-stop"
                :class="{
                  'is-passed': i <= activeYearIndex,
                  'is-active': i === activeYearIndex,
                  'tl-stop--future': isFuture(ev)
                }"
                :style="{ left: stopLeft(i) }"
                :aria-pressed="i === activeYearIndex"
                @click="activeYearIndex = i"
              >
                <span class="tl-dot" aria-hidden="true"></span>
                <span class="tl-year">{{ ev.year }}</span>
              </button>
            </div>
          </div>

          <!-- Active year content, animated on change -->
          <Transition name="fade-slide" mode="out-in">
            <div
              v-if="activeEvent"
              :key="activeYearIndex"
              class="tl-card"
              :class="{ 'tl-card--future': activeIsFuture }"
            >
              <h3 class="text-2xl font-semibold mb-3 text-esp-black">{{ activeEvent.title }}</h3>
              <p class="text-esp-black/70 max-w-2xl mx-auto">{{ activeEvent.text }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Одна система ESP: инжиниринг и производство как две части одного целого -->
    <section id="ecosystem" class="section brain-body bg-esp-gray" style="scroll-margin-top: 100px;">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">Одна система ESP</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            Проектирование и производство работают внутри одной компании: то, что рассчитали инженеры, изготавливается на нашем заводе и запускается той же командой.
          </p>
        </div>

        <div class="sys animate-on-scroll">
          <div class="sys-parts">
            <article class="sys-part sys-part--eng">
              <span class="sys-part-num">01 · Проектируем</span>
              <h3 class="sys-part-title">Инжиниринговый центр</h3>
              <p class="sys-part-text">
                Расчёты, технологические решения и рабочая документация. Модель объекта
                собирается до начала стройки — 30 000 элементов стыкуются ещё на этапе проекта.
              </p>
            </article>

            <div class="sys-link" aria-hidden="true">
              <span class="sys-link-node">
                <img src="/logo-esp.svg" alt="" width="56" height="28" />
              </span>
            </div>

            <article class="sys-part sys-part--prod">
              <span class="sys-part-num">02 · Изготавливаем</span>
              <h3 class="sys-part-title">Производственная база</h3>
              <p class="sys-part-text">
                Собственное производство в Заславле. Оборудование выпускается по нашей же
                документации, каждый узел проверяется до отгрузки на объект.
              </p>
            </article>
          </div>

          <div class="sys-caps">
            <h4 class="sys-caps-title">Что даёт одна система</h4>
            <ul class="sys-caps-list">
              <li v-for="cap in systemCaps" :key="cap">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                <span>{{ cap }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Схема взаимодействия: этапы внахлёст вместо звезды с логотипом -->
        <div class="mt-16 animate-on-scroll" style="animation-delay: 0.2s">
          <div class="ecosystem-scheme bg-esp-black p-6 md:p-10 shadow-lg">
            <h3 class="text-xl md:text-2xl font-semibold mb-8 text-white font-rounded">Как проходит объект</h3>
            <EcosystemFlow />
          </div>
        </div>

      </div>
    </section>

    <!-- Quality Standard Section -->
    <section id="quality" class="section quality bg-white" style="scroll-margin-top: 100px;">
      <div class="container">
        <!-- Знак вперёд текста: «эталон качества» у ESP — не абстракция,
             а физическая капля, которую монтируют на сданном объекте. -->
        <div class="ql-lead">
          <figure class="ql-drop animate-on-scroll">
            <!-- Чистый знак без травы и грунта: кадр вырезан из рендера kapla.png -->
            <img src="/images/quality-sign.jpg" alt="Знак качества ESP — фирменная капля «Эталон качества»" width="540" height="760" decoding="async" />
          </figure>

          <div class="ql-lead-text animate-on-scroll">
            <span class="ql-kicker">Эталон качества</span>
            <h2 class="section__title mb-5">Знак, который ставится на объекте</h2>
            <p class="ql-lede">
              Знак качества ESP, разработанный для экологических объектов.
              Подтверждает надёжность и экологичность объекта.
            </p>

            <ul class="ql-facts">
              <li>
                <b>5 м</b>
                <span>кристальный просвет — стандарт прозрачности очищенной воды</span>
              </li>
              <li>
                <b>ISO 9001</b>
                <span>система менеджмента качества, эко-сертификация, патенты</span>
              </li>
              <li>
                <b>100%</b>
                <span>ответственность за результат: проект, оборудование, пусконаладка</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- TODO: заменить фото. Здесь будет кадр процесса: руки в перчатках
             создают знак и наносят его на оборудование — присвоение статуса
             «Эталон». Изображение будет добавлено отдельно; пока стоит прежнее фото. -->
        <figure class="ql-proof animate-on-scroll">
          <img src="/images/team/quality-standard.png" alt="Фирменная капля ESP на здании управления очистных сооружений" loading="lazy" />
          <figcaption>
            <b>Очистные сооружения после пусконаладки.</b>
            Капля на фасаде — отметка о том, что объект принят по внутреннему стандарту ESP.
          </figcaption>
        </figure>

        <!-- Стандарты очистки: путь к кристальной чистоте -->
        <div class="ql-stages animate-on-scroll">
          <div class="ql-stages-head">
            <h3>Путь к кристальной чистоте</h3>
            <p>Шесть контролируемых ступеней — от механической очистки до обеззараживания.
              Показатели на каждой фиксируются лабораторно.</p>
          </div>

          <div class="ql-track">
            <div
              v-for="(stage, i) in clarityStages"
              :key="stage.label"
              class="ql-stage"
              :style="{ animationDelay: `${i * 0.08}s` }"
            >
              <span class="ql-stage-num" :class="{ 'is-final': i === clarityStages.length - 1 }">{{ i + 1 }}</span>
              <span class="ql-stage-bar">
                <span
                  class="ql-stage-fill"
                  :class="{ 'is-final': i === clarityStages.length - 1 }"
                  :style="{ width: `${((i + 1) / clarityStages.length) * 100}%` }"
                ></span>
              </span>
              <b class="ql-stage-label">{{ stage.label }}</b>
              <i class="ql-stage-result">{{ stage.result }}</i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Global Presence Section -->
    <section id="map" class="section global bg-esp-gray" style="scroll-margin-top: 100px;">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">География работ</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            Объекты, которые мы спроектировали, изготовили и запустили
          </p>
        </div>
        
        <!-- Real map with all 12 project locations (interactive) -->
        <div class="global-map bg-white overflow-hidden shadow-2xl mb-12 animate-on-scroll">
          <ClientOnly>
            <ProjectsMap :points="mapPoints" class="w-full aspect-video" />
            <template #fallback>
              <div class="w-full aspect-video flex items-center justify-center text-esp-black/40 text-sm">Загрузка карты…</div>
            </template>
          </ClientOnly>
        </div>
        <p class="text-center text-esp-black/50 text-sm -mt-8 mb-12">
          150+ проектов по всей Беларуси — <NuxtLink to="/projects" class="text-esp-blue hover:underline">смотреть полный список →</NuxtLink>
        </p>
      </div>
    </section>

    <!-- Media Center Section -->
    <section id="media" class="section media bg-white" style="scroll-margin-top: 100px;">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">Медиа-центр</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            Видео о компании и презентации для заказчиков и партнёров
          </p>
        </div>
        
        <!-- Карточки из админки (useMediaCenter): видео — с воспроизведением
             по клику, презентации — ссылкой на скачивание файла. -->
        <div class="grid md:grid-cols-3 gap-8">
          <template v-for="(item, i) in media" :key="`${item.title}-${i}`">
            <div
              v-if="item.kind !== 'presentation'"
              class="media-card bg-esp-gray/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-on-scroll"
              :style="{ animationDelay: `${i * 0.1}s` }"
            >
              <div class="media-card__thumbnail aspect-video relative overflow-hidden bg-esp-black">
                <video
                  :ref="(el) => { mediaVideos[i] = el }"
                  class="w-full h-full object-cover"
                  :src="item.file"
                  :poster="item.poster || undefined"
                  muted
                  loop
                  playsinline
                  preload="metadata"
                  @pause="mediaPlaying[i] = false"
                ></video>
                <div
                  class="absolute inset-0 bg-esp-black/30 flex items-center justify-center transition-opacity duration-300"
                  :class="mediaPlaying[i] ? 'opacity-0' : ''"
                  @click="mediaPlaying[i] && toggleMedia(i)"
                >
                  <button
                    type="button"
                    class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    :aria-label="mediaPlaying[i] ? `Пауза: ${item.title}` : `Смотреть: ${item.title}`"
                    @click.stop="toggleMedia(i)"
                  >
                    <span class="text-esp-blue text-2xl ml-1">▶</span>
                  </button>
                </div>
              </div>
              <div class="media-card__content p-6">
                <h3 class="media-card__title text-lg font-semibold mb-2">{{ item.title }}</h3>
                <p class="media-card__desc text-sm text-esp-black/70 mb-4">{{ item.desc }}</p>
                <span v-if="item.duration" class="text-xs text-esp-black/60 flex items-center gap-1"><Icon name="clock" cls="w-3.5 h-3.5" />{{ item.duration }}</span>
              </div>
            </div>

            <a
              v-else
              :href="item.file"
              download
              target="_blank"
              rel="noopener"
              class="media-card block bg-esp-gray/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-on-scroll"
              :style="{ animationDelay: `${i * 0.1}s` }"
            >
              <div class="media-card__thumbnail aspect-video relative overflow-hidden bg-esp-blue flex items-center justify-center">
                <img v-if="item.poster" :src="item.poster" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
                <img v-else src="/logo-esp.svg" alt="" class="w-1/2 max-h-16 object-contain media-card__logo" />
              </div>
              <div class="media-card__content p-6">
                <h3 class="media-card__title text-lg font-semibold mb-2">{{ item.title }}</h3>
                <p class="media-card__desc text-sm text-esp-black/70 mb-4">{{ item.desc }}</p>
                <span class="text-xs text-esp-black/60 flex items-center gap-1"><Icon name="download" cls="w-3.5 h-3.5" />{{ item.duration || 'Скачать презентацию' }}</span>
              </div>
            </a>
          </template>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta relative overflow-hidden" style="background: linear-gradient(135deg, #002366 0%, #1a1a1a 100%)">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full" style="background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%); animation: rotate 20s linear infinite" />
      </div>
      
      <div class="container relative z-10 text-center text-white">
        <h2 class="section__title cta__title mb-6 animate-on-scroll">Готовы создать Эталон качества?</h2>
        <p class="cta__desc text-lg opacity-95 mb-10 max-w-2xl mx-auto animate-on-scroll">
          Обсудим ваш объект и подготовим решение — от обследования площадки до запуска очистных сооружений
        </p>
        <div class="cta__actions flex flex-wrap justify-center gap-4 animate-on-scroll">
          <RouterLink to="/contacts" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition">Обсудить проект</RouterLink>
          <RouterLink to="/projects" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition">Посмотреть кейсы</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectGeo } from '~/composables/useProjectGeo'

const { mapPoints } = useProjectGeo()

// og-картинки лежат в этом проекте: origin берём из runtimeConfig,
// чтобы смена домена правилась в одном месте.
const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead({
  title: 'О компании ESP | EcoServiceProject — 28 лет опыта, 30 000 элементов',
  meta: [
    {
      name: 'description',
      content: 'История EcoServiceProject с 1999 года: собственный инжиниринг и производство очистных сооружений, таймлайн компании, сертификаты качества.'
    },
    { property: 'og:title', content: 'О компании ESP | 28 лет опыта' },
    { property: 'og:description', content: 'История EcoServiceProject с 1999 года: собственный инжиниринг и производство, сертификаты качества, 150+ объектов в Беларуси.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/about' }]
})

const router = useRouter()
const brandVideo = ref(null)

// ===== Первый экран: ролик из админки =====
// Раздел «about-hero» ({ video, poster }) заводится в админке; пока его нет,
// сервер отвечает 404 и useEditableList отдаёт ролик из сборки.
const aboutHeroList = useEditableList('about-hero', [
  { video: '/videos/hero/about-water.mp4', poster: '/images/hero-bg.jpg' }
])
const aboutHero = computed(() => {
  const item = aboutHeroList.value.find((h) => h && h.video) || {}
  return {
    video: item.video || '/videos/hero/about-water.mp4',
    poster: item.poster || '/images/hero-bg.jpg'
  }
})

// ===== Путь компании: годы из админки + «вектор в будущее» =====
const { timeline } = useTimeline()
// Пункт без четырёхзначного года («Дальше») — не точка, а стрелка за линией.
const isFuture = (ev) => !/^\d{4}$/.test(String(ev?.year ?? '').trim())
const pastEvents = computed(() => timeline.value.filter((ev) => ev && !isFuture(ev)))
const futureEvent = computed(() => timeline.value.find((ev) => ev && isFuture(ev)) || null)
const timelineEvents = computed(() =>
  futureEvent.value ? [...pastEvents.value, futureEvent.value] : pastEvents.value
)
const activeYearIndex = ref(Math.max(pastEvents.value.length - 1, 0))
// Пришли правки из админки — снова встаём на последний год.
watch(() => pastEvents.value.length, (n) => { activeYearIndex.value = Math.max(n - 1, 0) })
const activeEvent = computed(() => timelineEvents.value[activeYearIndex.value] || timelineEvents.value[0])
const activeIsFuture = computed(() => !!activeEvent.value && isFuture(activeEvent.value))

// Позиция точки на линии: прошлые годы равномерно до начала «хвоста»,
// будущее — на острие стрелки.
const stopLeft = (i) => {
  const n = pastEvents.value.length
  if (i >= n) return '100%'
  const frac = n > 1 ? i / (n - 1) : 0
  return futureEvent.value ? `calc((100% - var(--tl-tail)) * ${frac})` : `${frac * 100}%`
}
const progressWidth = computed(() =>
  activeYearIndex.value >= pastEvents.value.length ? 'calc(100% - var(--tl-tail))' : stopLeft(activeYearIndex.value)
)

// ===== Одна система ESP: общий список возможностей =====
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

// ===== Ступени очистки (без мембранной) =====
const clarityStages = [
  { label: 'Механическая', result: 'Отделение крупных примесей и песка' },
  { label: 'Физико-химическая', result: 'Связывание фосфора и тонкой взвеси' },
  { label: 'Биологическая USBF', result: 'Удаление органики и азота' },
  { label: 'Механическое обезвоживание осадков', result: 'Сокращение объёма осадка' },
  { label: 'Микрофильтрация', result: 'Доочистка от мельчайших частиц' },
  { label: 'Обеззараживание', result: 'Безопасная вода на выпуске' }
]

// ===== Медиа-центр из админки =====
const { media } = useMediaCenter()



const scrollToHistory = () => {
  document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })
}

// Scroll animations
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, { threshold: 0.1 })
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
  
  // Add CSS animations
  const style = document.createElement('style')
  style.textContent = `
    @keyframes scroll {
      0% { opacity: 0; transform: translateX(-50%) translateY(0); }
      50% { opacity: 1; }
      100% { opacity: 0; transform: translateX(-50%) translateY(12px); }
    }
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
    }
    @keyframes ping-slow {
      0% { transform: scale(1); opacity: 0.4; }
      75%, 100% { transform: scale(1.6); opacity: 0; }
    }
    .animate-scroll { animation: scroll 1.5s infinite; }
    .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
    .animate-ping-slow { animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
    .fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
    .fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
    .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-on-scroll.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `
  document.head.appendChild(style)
})

// Воспроизведение видео в Медиа-центре: по клику на ▶ запускаем ролик
const mediaVideos = {}
const mediaPlaying = reactive({})
const toggleMedia = (i) => {
  const el = mediaVideos[i]
  if (!el) return
  if (el.paused) {
    el.play().then(() => { mediaPlaying[i] = true }).catch(() => {})
  } else {
    el.pause()
    mediaPlaying[i] = false
  }
}
</script>

<style scoped>
/* ===== ПУТЬ КОМПАНИИ: линия с «вектором в будущее» ===== */
.tl {
  --tl-tail: 0px;
  position: relative;
  height: 3.5rem;
  padding: 0 1.25rem;
}
.tl--open { --tl-tail: clamp(5rem, 16%, 8rem); }
.tl-rail {
  position: relative;
  height: 100%;
}
.tl-line {
  position: absolute;
  left: 0;
  top: 7px;
  height: 2px;
  width: calc(100% - var(--tl-tail));
  background: #ededed;
}
.tl-line--done {
  background: #006039;
  transition: width 0.5s ease;
}
/* Хвост за последним годом: пунктир и стрелка — линия не заканчивается */
.tl-future {
  position: absolute;
  top: 0;
  right: -2px;
  height: 16px;
  width: var(--tl-tail);
  color: rgba(26, 26, 26, 0.35);
  transition: color 0.3s ease;
}
.tl-future::before {
  content: '';
  position: absolute;
  left: 0;
  right: 8px;
  top: 7px;
  border-top: 2px dashed currentColor;
}
.tl-future.is-active { color: #006039; }
.tl-arrow {
  position: absolute;
  right: 0;
  top: 1px;
  width: 14px;
  height: 14px;
}
.tl-stop {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 0 0.25rem;
  background: none;
  border: 0;
  cursor: pointer;
}
.tl-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ededed;
  border: 4px solid #fff;
  box-shadow: 0 0 0 1px #ededed;
  transition: background 0.3s ease, transform 0.3s ease;
}
.tl-stop:hover .tl-dot { background: rgba(0, 35, 102, 0.4); }
.tl-stop.is-passed .tl-dot { background: #006039; box-shadow: 0 0 0 1px #006039; }
.tl-stop.is-active .tl-dot { transform: scale(1.25); }
.tl-year {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgba(26, 26, 26, 0.45);
  white-space: nowrap;
  transition: color 0.3s ease;
}
.tl-stop:hover .tl-year { color: #1a1a1a; }
.tl-stop.is-active .tl-year { color: #006039; }
/* У будущего нет точки: метка стоит под острием стрелки */
.tl-stop--future {
  transform: translateX(-100%);
  align-items: flex-end;
  padding-right: 0;
}
.tl-stop--future .tl-dot { visibility: hidden; }
.tl-card {
  background: rgba(237, 237, 237, 0.6);
  padding: clamp(1.75rem, 4vw, 2.5rem);
  text-align: center;
  border-top: 2px solid transparent;
}
.tl-card--future { border-top-color: #006039; }

/* ===== ОДНА СИСТЕМА ESP ===== */
.sys {
  background: #fff;
  box-shadow: 0 24px 60px -32px rgba(26, 26, 26, 0.25);
}
.sys-parts {
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
}
@media (min-width: 900px) {
  .sys-parts { grid-template-columns: minmax(0, 1fr) 0 minmax(0, 1fr); }
}
.sys-part {
  padding: clamp(1.75rem, 4vw, 3rem);
  border-top: 3px solid #002366;
}
.sys-part--prod { border-top-color: #006039; }
@media (max-width: 899px) {
  .sys-part--prod { padding-top: 3.25rem; }
}
.sys-part-num {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #002366;
  margin-bottom: 0.9rem;
}
.sys-part--prod .sys-part-num { color: #006039; }
.sys-part-title {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: clamp(1.35rem, 2vw, 1.75rem);
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.8rem;
}
.sys-part-text {
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(26, 26, 26, 0.7);
  max-width: 34rem;
}
/* Узел-связка: знак ESP на стыке двух направлений */
.sys-link {
  position: relative;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.sys-link-node {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ededed;
  box-shadow: 0 10px 30px -12px rgba(26, 26, 26, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sys-link-node img { width: 2.75rem; height: auto; }
@media (min-width: 900px) {
  .sys-link { height: auto; align-items: flex-start; }
  .sys-link::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-left: 1px solid #ededed;
  }
  .sys-link-node { position: absolute; top: calc(50% - 2.25rem); left: -2.25rem; }
}
.sys-caps {
  border-top: 1px solid #ededed;
  padding: clamp(1.75rem, 4vw, 2.5rem) clamp(1.75rem, 4vw, 3rem);
  background: rgba(237, 237, 237, 0.35);
}
.sys-caps-title {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(26, 26, 26, 0.55);
  margin-bottom: 1.25rem;
}
.sys-caps-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem 2rem;
}
@media (min-width: 640px) { .sys-caps-list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1100px) { .sys-caps-list { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.sys-caps-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.95rem;
  line-height: 1.45;
  color: rgba(26, 26, 26, 0.8);
}
.sys-caps-list svg {
  flex: none;
  width: 1rem;
  height: 1rem;
  margin-top: 0.15rem;
  color: #006039;
}

/* ===== ЭТАЛОН КАЧЕСТВА ===== */
.ql-lead {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 4vw, 3.5rem);
  align-items: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
}
@media (min-width: 900px) {
  .ql-lead { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
}

/* Капля лежит на мягком световом пятне, а не на пустом белом: рендер
   сделан на прозрачном фоне и без подложки выглядит вырезанным. */
/* Фон рендера запечён белым, поэтому секция тоже белая — кадр читается
   как студийный снимок, без видимой рамки вокруг картинки. */
.ql-drop {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.5rem, 2vw, 1.5rem);
}
.ql-drop img {
  position: relative;
  width: 100%;
  max-width: clamp(220px, 60vw, 300px);
  height: auto;
  /* Края кадра (постамент, лёгкая виньетка рендера) растворяем в белом —
     остаётся только знак */
  -webkit-mask-image: radial-gradient(ellipse 58% 56% at 50% 46%, #000 78%, transparent 100%);
  mask-image: radial-gradient(ellipse 58% 56% at 50% 46%, #000 78%, transparent 100%);
}

.ql-kicker {
  display: inline-block;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #002366;
  font-weight: 600;
  margin-bottom: 0.9rem;
}
.ql-lede {
  font-size: clamp(1rem, 1.15vw, 1.12rem);
  line-height: 1.65;
  color: rgba(26, 26, 26, 0.72);
  margin-bottom: 2rem;
}

/* Факты — строками с крупным значением слева: три равные плитки читались
   как реклама, строки читаются как характеристики. */
.ql-facts {
  display: grid;
  gap: 0;
  border-top: 1px solid #ededed;
}
.ql-facts li {
  display: grid;
  grid-template-columns: minmax(4.5rem, max-content) 1fr;
  gap: 1.25rem;
  align-items: baseline;
  padding: 1rem 0;
  border-bottom: 1px solid #ededed;
}
.ql-facts b {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 1.35rem;
  color: #002366;
  white-space: nowrap;
}
.ql-facts span {
  font-size: 0.93rem;
  line-height: 1.5;
  color: rgba(26, 26, 26, 0.65);
}

/* ===== Доказательство на объекте ===== */
.ql-proof {
  position: relative;
  margin-bottom: clamp(3rem, 6vw, 5rem);
  overflow: hidden;
}
.ql-proof img {
  width: 100%;
  height: clamp(260px, 42vw, 520px);
  object-fit: cover;
  display: block;
}
.ql-proof figcaption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: clamp(1.2rem, 3vw, 2rem);
  background: linear-gradient(to top, rgba(26, 26, 26, 0.88), rgba(26, 26, 26, 0));
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.92rem;
  line-height: 1.55;
}
.ql-proof figcaption b {
  color: #fff;
  font-weight: 600;
}

/* ===== Ступени очистки ===== */
.ql-stages {
  border: 1px solid #ededed;
  padding: clamp(1.5rem, 4vw, 2.5rem);
}
.ql-stages-head { margin-bottom: 2.25rem; max-width: 46rem; }
.ql-stages-head h3 {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: clamp(1.25rem, 2vw, 1.6rem);
  color: #1a1a1a;
  margin-bottom: 0.6rem;
}
.ql-stages-head p {
  font-size: 0.94rem;
  line-height: 1.6;
  color: rgba(26, 26, 26, 0.6);
}

.ql-track {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 760px) {
  .ql-track { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.75rem 1.25rem; }
}
@media (min-width: 1100px) {
  .ql-track { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1rem; }
}

.ql-stage {
  display: grid;
  gap: 0.5rem;
  align-content: start;
}
.ql-stage-num {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  background: #002366;
}
.ql-stage-num.is-final { background: #006039; }
.ql-stage-bar {
  display: block;
  height: 4px;
  background: #ededed;
  overflow: hidden;
}
.ql-stage-fill {
  display: block;
  height: 100%;
  background: #002366;
  transition: width 1s ease;
}
.ql-stage-fill.is-final { background: #006039; }
.ql-stage-label {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1a1a1a;
}
.ql-stage-result {
  font-style: normal;
  font-size: 0.82rem;
  line-height: 1.45;
  color: rgba(26, 26, 26, 0.6);
}

/* ===== CONTAINER ===== */
/* Та же сетка, что на главной: ширина контента 1280 и поля у секции.
   Здесь было 1440 и гуттер 24 px — из-за этого страница шла заметно шире
   остальных, а заголовки стояли почти у края экрана. */
.container {
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0;
}

/* ===== SECTIONS ===== */
.section {
  @apply py-20 md:py-32 px-6 md:px-12 lg:px-24;
}

.section__title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
}

.section__subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
}

/* ===== HERO VIDEO ===== */
.hero-video__bg {
  z-index: 0;
}

.hero-video__bg video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-video__overlay {
  z-index: 1;
}

.hero-video__pattern {
  z-index: 1;
  background-image: 
    radial-gradient(ellipse at 20% 80%, rgba(0,96,57,0.15) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 20%, rgba(0,35,102,0.15) 0%, transparent 40%);
  pointer-events: none;
}

.hero-video__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.1;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.hero-video__subtitle {
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
}

.hero-video__scroll {
  z-index: 10;
}

/* ===== TIMELINE ===== */
.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline__line {
  z-index: 0;
}

@media (max-width: 768px) {
  .timeline__line {
    left: 20px !important;
  }
  
  .timeline__item {
    grid-template-columns: 1fr !important;
  }
  
  .timeline__content {
    text-align: left !important;
    padding-left: 50px !important;
  }
  
  .timeline__marker {
    left: 20px !important;
    transform: translateX(-50%) !important;
  }
}

.timeline__year {
  font-size: 1.25rem;
}

.timeline__title {
  font-size: 1.25rem;
}

.timeline__desc {
  font-size: 0.95rem;
}

/* ===== ИНЖИНИРИНГ И ПРОИЗВОДСТВО ===== */
.media-card__logo { filter: brightness(0) invert(1); }

/* ===== QUALITY ===== */
.quality-card {
  border: 1px solid transparent;
}

.quality-card:hover {
  border-color: rgba(0, 96, 57, 0.2);
}

.quality-card__value {
  font-family: 'SF Pro Rounded', sans-serif;
}

/* ===== GLOBAL ===== */
.global-map {
  position: relative;
}

.map-placeholder {
  min-height: 400px;
}

.partner-logo {
  border: 1px solid rgba(237, 237, 237, 0.5);
}

/* ===== MEDIA ===== */
.media-card {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.media-card:hover {
  border-color: rgba(0, 96, 57, 0.2);
  transform: translateY(-4px);
}

.media-card__thumbnail {
  position: relative;
}

/* ===== CTA ===== */
.cta {
  position: relative;
  overflow: hidden;
}

/* ===== ANIMATIONS ===== */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .section {
    padding: 3.5rem 1rem;
  }
  
  .hero-video__title {
    font-size: 2rem;
  }
  
  .hero-video__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-video__actions .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}

/* ===== PAGE WIDTH FIX ===== */
.about-page {
  width: 100%;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}
</style>
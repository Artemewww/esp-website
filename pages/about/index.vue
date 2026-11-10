<template>
  <!-- «О компании» в подаче apple.com/environment: заявление на весь экран,
       липкая подполоса, короткие крупные заголовки, текст, проявляющийся при
       прокрутке, фото во всю ширину между главами, крупные цифры, главы
       «кадр + текст» с липким кадром, горизонтальные галереи карточек, финал. -->
  <div ref="root" class="dj ap">
    <!-- ===== Первый экран: заявление и кадр во всю ширину ===== -->
    <section class="ap-hero">
      <div class="dj-wrap dj-center ap-hero__text">
        <span class="dj-eyebrow ap-hero__eyebrow dj-reveal">28 лет опыта</span>
        <h1 class="ap-hero__h dj-reveal">Инженерия, которой доверяют</h1>
        <p class="dj-lede ap-hero__lede dj-reveal">
          28 лет практики: от подрядных работ до собственного инжиниринга и производства. Проектируем, изготавливаем и запускаем очистные сооружения, отвечая за результат целиком.
        </p>
        <div class="ap-btns dj-reveal">
          <a href="#history" class="dj-btn dj-btn--line" @click.prevent="jumpTo('#history')">Наша история</a>
          <a href="#ecosystem" class="dj-btn" @click.prevent="jumpTo('#ecosystem')">Экосистема ESP</a>
        </div>
      </div>
      <!-- Ролик из админки (раздел «about-hero»: video, poster); без него — IMAGES.hero -->
      <div class="ap-hero__media" data-zoom>
        <video ref="heroVideo" :key="aboutHero.video" :poster="aboutHero.poster" muted loop playsinline preload="metadata" aria-hidden="true">
          <source :src="aboutHero.video" type="video/mp4" />
        </video>
      </div>
    </section>

    <DjSubnav title="О компании" :links="subnav" :cta="{ to: '/contacts', label: 'Обсудить проект' }" />

    <!-- ===== Заявление: слова проявляются при прокрутке ===== -->
    <section class="ap-statement">
      <div class="dj-wrap">
        <p ref="statement" class="ap-statement__h" aria-label="Мы архитекторы технологий очистки воды. 28 лет опыта. Экосистема, состоящая из 30 000 элементов.">
          <template v-for="(w, i) in statementWords" :key="i"><span class="ap-word" :class="{ 'is-lit': i < litWords }" aria-hidden="true">{{ w }}</span>{{ ' ' }}</template>
        </p>
      </div>
    </section>

    <!-- ===== Цифры ===== -->
    <section class="ap-stats-sec">
      <div class="dj-wrap">
        <ul class="ap-stats">
          <li v-for="s in stats" :key="s.value" class="dj-reveal">
            <b>{{ s.value }}</b>
            <span>{{ s.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ===== Кадр во всю ширину: природа очищает воду ===== -->
    <section class="ap-band" data-zoom>
      <img :src="IMAGES.nature" alt="Очистные сооружения ESP с высоты" class="ap-band__img" loading="lazy" decoding="async" />
      <div class="ap-band__veil" aria-hidden="true"></div>
      <div class="dj-wrap ap-band__text">
        <h2 class="dj-h2 dj-reveal">Природа очищает воду слой за слоем</h2>
        <p class="dj-lede dj-reveal">Песок, глина и корни фильтруют её веками. Мы переняли этот принцип у самой земли.</p>
      </div>
    </section>

    <!-- ===== Путь компании: горизонтальная галерея лет ===== -->
    <section id="history" class="dj-sec ap-sec">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">Путь компании</h2>
        <p class="dj-lede dj-reveal">28 лет практики: от подрядных работ до собственного инжиниринга и производства</p>
      </div>
      <div class="ap-gal dj-reveal">
        <div ref="tlGal" class="ap-gal__track" tabindex="0" aria-label="Годы истории компании">
          <article v-for="(ev, i) in timelineEvents" :key="`${ev.year}-${i}`" class="ap-year" :class="{ 'ap-year--future': isFuture(ev) }">
            <span class="ap-year__y">
              {{ ev.year }}
              <svg v-if="isFuture(ev)" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l9 5-9 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <h3 class="ap-year__h">{{ ev.title }}</h3>
            <p class="ap-year__p">{{ ev.text }}</p>
          </article>
        </div>
        <div class="dj-wrap ap-gal__ctrl">
          <button type="button" class="ap-arrow" aria-label="Назад" @click="scrollGal(tlGal, -1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg></button>
          <button type="button" class="ap-arrow" aria-label="Вперёд" @click="scrollGal(tlGal, 1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg></button>
        </div>
      </div>
    </section>

    <!-- ===== Одна система ESP: липкий кадр, меняющиеся подписи ===== -->
    <section id="ecosystem" class="dj-sec dj-sec--soft ap-sec">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">Одна система ESP</h2>
        <p class="dj-lede dj-reveal">
          Проектирование и производство работают внутри одной компании: то, что рассчитали инженеры, изготавливается на нашем заводе и запускается той же командой.
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
        <p class="dj-lede dj-reveal">Оборудование ESP производится в Заславле. Точность в каждой детали. Качество в каждом узле.</p>
        <div class="dj-links dj-reveal"><NuxtLink to="/equipment" class="dj-more">Каталог оборудования</NuxtLink></div>
      </div>
      <div class="ap-gal dj-reveal">
        <div ref="eqGal" class="ap-gal__track" tabindex="0" aria-label="Оборудование ESP">
          <NuxtLink v-for="p in products" :key="p.slug" :to="`/equipment/${p.slug}`" class="ap-eq">
            <span class="ap-eq__img"><img :src="p.src" :alt="p.name" loading="lazy" decoding="async" /></span>
            <b class="ap-eq__name">{{ p.name }}</b>
          </NuxtLink>
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
          <h2 class="ap-h dj-reveal">Что даёт одна система</h2>
        </div>
        <ul class="ap-caps">
          <li v-for="cap in systemCaps" :key="cap" class="dj-reveal">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span>{{ cap }}</span>
          </li>
        </ul>
      </div>
      <div class="dj-wrap dj-wrap--wide">
        <figure class="ap-photo dj-reveal" data-zoom>
          <img :src="IMAGES.team" alt="Команда ESP" loading="lazy" decoding="async" />
        </figure>
      </div>
      <div class="dj-wrap ap-flow dj-reveal">
        <h3 class="dj-h3 ap-flow__h">Как проходит объект</h3>
        <EcosystemFlow />
      </div>
    </section>

    <!-- ===== Кадр во всю ширину: природа возвращается ===== -->
    <section class="ap-band" data-zoom>
      <img :src="IMAGES.reclaim" alt="Площадка очистных сооружений ESP с высоты" class="ap-band__img" loading="lazy" decoding="async" />
      <div class="ap-band__veil" aria-hidden="true"></div>
      <div class="dj-wrap ap-band__text">
        <h2 class="dj-h2 dj-reveal">И природа возвращается</h2>
        <p class="dj-lede dj-reveal">Старые поля фильтрации рекультивируем — на их месте лес или поле. Станцией управляет ИИ 24/7.</p>
      </div>
    </section>

    <!-- ===== Эталон качества ===== -->
    <section id="quality" class="dj-sec ap-sec">
      <div class="dj-wrap">
        <div class="ap-q">
          <figure class="ap-q__drop dj-reveal">
            <img :src="IMAGES.qualitySign" alt="Знак качества ESP — фирменная капля «Эталон качества»" width="540" height="760" loading="lazy" decoding="async" />
          </figure>
          <div class="ap-q__text">
            <span class="dj-eyebrow dj-reveal">Эталон качества</span>
            <h2 class="ap-h dj-reveal">Знак, который ставится на объекте</h2>
            <p class="dj-lede dj-reveal">Знак качества ESP, разработанный для экологических объектов. Подтверждает надёжность и экологичность объекта.</p>
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

    <!-- Кадр во всю ширину: просвет и производство в Беларуси -->
    <section class="ap-band ap-band--low" data-zoom>
      <img :src="IMAGES.clarity" alt="Очищенная вода на объекте ESP" class="ap-band__img" loading="lazy" decoding="async" />
      <div class="ap-band__veil" aria-hidden="true"></div>
      <div class="dj-wrap ap-band__text">
        <span class="dj-eyebrow ap-band__eyebrow dj-reveal">Кристальный просвет — стандарт прозрачности очищенной воды</span>
        <h2 class="dj-h2 dj-reveal">Кристальная чистота воды с&nbsp;просветом 4&nbsp;метра</h2>
        <p class="dj-lede dj-reveal">Произведено в Республике Беларусь.</p>
      </div>
    </section>

    <section class="dj-sec ap-sec">
      <div class="dj-wrap">
        <figure class="ap-proof dj-reveal">
          <div class="ap-proof__img" data-zoom><img :src="IMAGES.qualityProof" alt="Фирменная капля ESP на здании управления очистных сооружений" loading="lazy" decoding="async" /></div>
          <figcaption><b>Очистные сооружения после пусконаладки.</b> Капля на фасаде — отметка о том, что объект принят по внутреннему стандарту ESP.</figcaption>
        </figure>

        <div class="ap-head ap-head--stages">
          <h3 class="ap-h ap-h--sm dj-reveal">Путь к кристальной чистоте</h3>
          <p class="dj-lede dj-reveal">Шесть контролируемых ступеней — от механической очистки до обеззараживания. Показатели на каждой фиксируются лабораторно.</p>
        </div>
        <ol class="ap-stages">
          <li v-for="(stage, i) in clarityStages" :key="stage.label" class="ap-stage dj-reveal" :class="{ 'is-final': i === clarityStages.length - 1 }">
            <span class="ap-stage__n">{{ i + 1 }}</span>
            <span class="ap-stage__bar"><i :style="{ '--w': `${((i + 1) / clarityStages.length) * 100}%` }"></i></span>
            <b class="ap-stage__label">{{ stage.label }}</b>
            <span class="ap-stage__res">{{ stage.result }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- ===== География работ ===== -->
    <section id="map" class="dj-sec dj-sec--soft ap-sec">
      <div class="dj-wrap">
        <div class="ap-head">
          <h2 class="ap-h dj-reveal">География работ</h2>
          <p class="dj-lede dj-reveal">Объекты, которые мы спроектировали, изготовили и запустили</p>
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
          150+ проектов по всей Беларуси — <NuxtLink to="/projects" class="dj-more">смотреть полный список</NuxtLink>
        </p>
      </div>
    </section>

    <!-- ===== Медиа-центр: горизонтальная галерея ===== -->
    <section id="media" class="dj-sec ap-sec">
      <div class="dj-wrap ap-head">
        <h2 class="ap-h dj-reveal">Медиа-центр</h2>
        <p class="dj-lede dj-reveal">Видео о компании и презентации для заказчиков и партнёров</p>
      </div>
      <div class="ap-gal dj-reveal">
        <div ref="mdGal" class="ap-gal__track" tabindex="0" aria-label="Медиа-центр">
          <template v-for="(item, i) in media" :key="`${item.title}-${i}`">
            <div v-if="item.kind !== 'presentation'" class="ap-mcard">
              <div class="ap-mcard__thumb">
                <video :ref="(el) => { mediaVideos[i] = el }" :src="item.file" :poster="item.poster || undefined" muted loop playsinline preload="metadata" @pause="mediaPlaying[i] = false"></video>
                <div class="ap-mcard__veil" :class="{ 'is-off': mediaPlaying[i] }" @click="mediaPlaying[i] && toggleMedia(i)">
                  <button type="button" class="ap-play" :aria-label="mediaPlaying[i] ? `Пауза: ${item.title}` : `Смотреть: ${item.title}`" @click.stop="toggleMedia(i)">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
                  </button>
                </div>
              </div>
              <div class="ap-mcard__body">
                <h3 class="ap-mcard__h">{{ item.title }}</h3>
                <p class="ap-mcard__p">{{ item.desc }}</p>
                <span v-if="item.duration" class="ap-mcard__meta"><Icon name="clock" cls="w-3.5 h-3.5" />{{ item.duration }}</span>
              </div>
            </div>
            <a v-else :href="item.file" download target="_blank" rel="noopener" class="ap-mcard">
              <div class="ap-mcard__thumb ap-mcard__thumb--doc">
                <img v-if="item.poster" :src="item.poster" :alt="item.title" loading="lazy" />
                <img v-else src="/logo-esp.svg" alt="" class="ap-mcard__logo" />
              </div>
              <div class="ap-mcard__body">
                <h3 class="ap-mcard__h">{{ item.title }}</h3>
                <p class="ap-mcard__p">{{ item.desc }}</p>
                <span class="ap-mcard__meta"><Icon name="download" cls="w-3.5 h-3.5" />{{ item.duration || 'Скачать презентацию' }}</span>
              </div>
            </a>
          </template>
        </div>
        <div class="dj-wrap ap-gal__ctrl">
          <button type="button" class="ap-arrow" aria-label="Назад" @click="scrollGal(mdGal, -1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg></button>
          <button type="button" class="ap-arrow" aria-label="Вперёд" @click="scrollGal(mdGal, 1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg></button>
        </div>
      </div>
    </section>

    <!-- ===== Финал ===== -->
    <section class="ap-cta">
      <video ref="ctaVideo" class="ap-cta__bg" :poster="IMAGES.ctaPoster" muted loop playsinline preload="none" aria-hidden="true">
        <source :src="IMAGES.ctaVideo" type="video/mp4" />
      </video>
      <div class="ap-cta__veil" aria-hidden="true"></div>
      <div class="dj-wrap dj-center ap-cta__in">
        <h2 class="ap-h ap-cta__h dj-reveal">Готовы создать Эталон качества?</h2>
        <p class="dj-lede ap-cta__p dj-reveal">Обсудим ваш объект и подготовим решение — от обследования площадки до запуска очистных сооружений</p>
        <div class="ap-btns dj-reveal">
          <NuxtLink to="/contacts" class="dj-btn dj-btn--white dj-btn--lg">Обсудить проект</NuxtLink>
          <NuxtLink to="/projects" class="dj-btn dj-btn--glass dj-btn--lg">Посмотреть кейсы</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useProjectGeo } from '~/composables/useProjectGeo'
import { useReveal } from '~/composables/useReveal'

// Все кадры страницы в одном месте: замените пути, когда будут готовы новые фото.
const IMAGES = {
  heroVideo: '/videos/hero/about-water.mp4', // первый экран, если в админке нет «about-hero»
  heroPoster: '/videos/hero/about-water.jpg',
  nature: '/images/real4k/aerial-orbit.webp', // «Природа очищает воду слой за слоем»
  design: '/images/real4k/cad-screen.webp', // глава «Проектирование»
  lidar: '/images/real4k/aerial-octagons.webp', // глава «Облако точек»
  production: '/images/real4k/laser-head.webp', // глава «Производственная база»
  usbf: '/images/real4k/aerial-aerotank.webp', // глава «Технология USBF»
  team: '/images/team/real/team-studio.webp', // общее фото команды
  reclaim: '/images/real4k/aerial-reveal.webp', // «И природа возвращается»
  qualitySign: '/images/quality-sign.jpg', // знак «Эталон качества»
  clarity: '/images/projects/fanipol/1.webp', // «Кристальная чистота воды с просветом 4 метра»
  qualityProof: '/images/team/quality-standard.png', // капля на фасаде
  ctaVideo: '/media/reel/DJI_0715.mp4', // фон финала
  ctaPoster: '/videos/hero/DJI_0715.jpg'
}

const { mapPoints } = useProjectGeo()
const { timeline } = useTimeline()
const { media } = useMediaCenter()
const { getBySlug } = useEquipment()

const subnav = [
  { href: '#history', label: 'История' },
  { href: '#ecosystem', label: 'Система ESP' },
  { href: '#quality', label: 'Качество' },
  { href: '#map', label: 'География' },
  { href: '#media', label: 'Медиа' }
]

// Ролик из админки (раздел «about-hero»); пока раздела нет — ролик из сборки
const aboutHeroList = useEditableList('about-hero', [{ video: IMAGES.heroVideo, poster: IMAGES.heroPoster }])
const aboutHero = computed(() => {
  const item = aboutHeroList.value.find((h) => h && h.video) || {}
  return { video: item.video || IMAGES.heroVideo, poster: item.poster || IMAGES.heroPoster }
})

const statementWords = 'Мы архитекторы технологий очистки воды. 28 лет опыта. Экосистема, состоящая из 30 000 элементов.'.split(' ')
const litWords = ref(0)

const stats = [
  { value: '28', label: 'лет опыта' },
  { value: '2000+', label: 'реализованных проектов' },
  { value: '100+', label: 'специалистов в штате' },
  { value: '30 000', label: 'элементов в экосистеме ESP' }
]

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
      'Расчёты, технологические решения и рабочая документация. Модель объекта собирается до начала стройки — 30 000 элементов стыкуются ещё на этапе проекта.',
      'Проектируем будущее с точностью до миллиметра.'
    ]
  },
  {
    img: 'lidar', kicker: 'Лидарное сканирование', title: 'Облако из миллионов точек', alt: 'Очистные сооружения с высоты',
    text: [
      'Дрон с лидаром облетает площадку и собирает облако из миллионов точек с сантиметровой точностью.',
      'На облаке точек рисуем линии новой станции: она встаёт на место старых сооружений и занимает в разы меньше площади. Жизнеспособное оставляем, остальное — под демонтаж.'
    ]
  },
  {
    img: 'production', kicker: '02 · Изготавливаем', title: 'Производственная база', alt: 'Лазерная резка металла на производстве ESP',
    text: [
      'Собственное производство в Заславле. Оборудование выпускается по нашей же документации, каждый узел проверяется до отгрузки на объект.',
      'Точность в каждой детали. Качество в каждом узле.'
    ],
    link: { to: '/equipment', label: 'Каталог оборудования' }
  },
  {
    img: 'usbf', kicker: 'Решения на базе USBF', title: 'Технология USBF', alt: 'Аэротенки очистных сооружений ESP',
    text: ['Внедряем технологию USBF под задачи конкретного объекта. Опираемся на 28 лет практики в биологической очистке сточных вод. Используем передовые разработки.']
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

const qualityFacts = [
  { value: '5 м', label: 'кристальный просвет — стандарт прозрачности очищенной воды' },
  { value: 'ISO 9001', label: 'система менеджмента качества, эко-сертификация, патенты' },
  { value: '100%', label: 'ответственность за результат: проект, оборудование, пусконаладка' }
]

const clarityStages = [
  { label: 'Механическая', result: 'Отделение крупных примесей и песка' },
  { label: 'Физико-химическая', result: 'Связывание фосфора и тонкой взвеси' },
  { label: 'Биологическая USBF', result: 'Удаление органики и азота' },
  { label: 'Механическое обезвоживание осадков', result: 'Сокращение объёма осадка' },
  { label: 'Микрофильтрация', result: 'Доочистка от мельчайших частиц' },
  { label: 'Обеззараживание', result: 'Безопасная вода на выпуске' }
]

// Медиа-центр: видео по клику на ▶
const mediaVideos = {}
const mediaPlaying = reactive({})
const toggleMedia = (i) => {
  const el = mediaVideos[i]
  if (!el) return
  if (el.paused) el.play().then(() => { mediaPlaying[i] = true }).catch(() => {})
  else { el.pause(); mediaPlaying[i] = false }
}

const root = ref(null)
const statement = ref(null)
const heroVideo = ref(null)
const ctaVideo = ref(null)
const tlGal = ref(null)
const eqGal = ref(null)
const mdGal = ref(null)

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
        if (e.isIntersecting && !reduced) v.play().catch(() => {})
        else v.pause()
      })
    }, { threshold: 0.2 })
    ;[heroVideo.value, ctaVideo.value].filter(Boolean).forEach((v) => videoIo.observe(v))
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
})

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead({
  title: 'О компании ESP | EcoServiceProject — 28 лет опыта, 30 000 элементов',
  meta: [
    { name: 'description', content: 'История EcoServiceProject с 1999 года: собственный инжиниринг и производство очистных сооружений, таймлайн компании, сертификаты качества.' },
    { property: 'og:title', content: 'О компании ESP | 28 лет опыта' },
    { property: 'og:description', content: 'История EcoServiceProject с 1999 года: собственный инжиниринг и производство, сертификаты качества, 150+ объектов в Беларуси.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [
    { rel: 'canonical', href: 'https://ecoservisproekt.by/about' },
    { rel: 'preload', as: 'image', href: IMAGES.heroPoster, fetchpriority: 'high' }
  ]
})
</script>

<style scoped>
.ap { overflow-x: clip; }
.ap-sec { overflow: hidden; }
.ap-btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 28px; }

/* Крупные короткие заголовки, как на apple.com/environment */
.ap-h { font-size: clamp(36px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-ink); }
.ap-h--sm { font-size: clamp(30px, 3.6vw, 48px); }
.ap-head { max-width: 1200px; margin-bottom: clamp(36px, 5vw, 64px); }
.ap-head .dj-lede { margin-top: 18px; max-width: 46ch; font-size: clamp(17px, 1.5vw, 21px); }
.ap-head .dj-links { justify-content: flex-start; }

/* ===== Первый экран ===== */
.ap-hero { padding-top: clamp(48px, 6vw, 88px); background: #fff; }
.ap-hero__text { position: relative; z-index: 1; }
.ap-hero__lede { margin-left: auto; margin-right: auto; }
.ap-hero__h { margin: 10px auto 0; max-width: 20ch; font-size: clamp(44px, 6.6vw, 96px); line-height: 1.02; font-weight: 600; letter-spacing: -0.035em; color: var(--dj-ink); }
.ap-hero__lede { margin-top: 20px; max-width: 52ch; font-size: clamp(17px, 1.5vw, 21px); }
.ap-hero__media { position: relative; margin-top: clamp(48px, 6vw, 80px); height: min(78vh, 56vw); min-height: 320px; overflow: hidden; background: #dfe6ea; }
.ap-hero__media video { width: 100%; height: 100%; object-fit: cover; transform: scale(calc(1.12 - var(--p, 0) * 0.12)); will-change: transform; }

/* ===== Заявление ===== */
.ap-statement { padding: clamp(96px, 14vw, 200px) 0 clamp(56px, 8vw, 104px); }
.ap-statement__h { max-width: 18ch; font-size: clamp(34px, 5.6vw, 80px); line-height: 1.08; font-weight: 600; letter-spacing: -0.03em; }
.ap-word { color: #d2d4d6; transition: color 0.5s var(--dj-ease); }
.ap-word.is-lit { color: var(--dj-ink); }

/* ===== Цифры ===== */
.ap-stats-sec { padding-bottom: clamp(80px, 10vw, 144px); }
.ap-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px; list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--dj-line); }
.ap-stats li { display: grid; gap: 6px; padding-top: 28px; align-content: start; }
.ap-stats b { font-size: clamp(48px, 6vw, 96px); line-height: 1; font-weight: 600; letter-spacing: -0.04em; color: var(--dj-ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ap-stats span { font-size: 17px; line-height: 1.4; color: var(--dj-text); }

/* ===== Фото во всю ширину с медленным наездом ===== */
.ap-band { position: relative; display: flex; align-items: flex-end; min-height: min(100vh, 900px); overflow: hidden; background: #0b0d10; color: #fff; isolation: isolate; }
.ap-band--low { min-height: min(86vh, 780px); }
.ap-band__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; transform: scale(calc(1.16 - var(--p, 0) * 0.16)); will-change: transform; }
.ap-band__veil { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.62) 100%); }
.ap-band__text { width: 100%; padding-bottom: clamp(48px, 7vw, 96px); }
.ap-band__text h2 { max-width: 14ch; color: #fff; }
.ap-band__text .dj-lede { margin-top: 18px; max-width: 42ch; color: rgba(255, 255, 255, 0.85); font-size: clamp(17px, 1.5vw, 21px); }
.ap-band__eyebrow { color: rgba(255, 255, 255, 0.75); margin-bottom: 12px; max-width: 40ch; }

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

/* Карточки лет */
.ap-year { width: min(380px, 78vw); min-height: 340px; padding: 32px; border-radius: 24px; background: var(--dj-soft); display: flex; flex-direction: column; }
.ap-year__y { display: inline-flex; align-items: center; gap: 10px; font-size: clamp(44px, 4.4vw, 64px); line-height: 1; font-weight: 600; letter-spacing: -0.04em; color: var(--dj-blue); }
.ap-year__y svg { width: 28px; height: 28px; }
.ap-year__h { margin-top: auto; padding-top: 32px; font-size: 22px; line-height: 1.25; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); }
.ap-year__p { margin-top: 10px; font-size: 16px; line-height: 1.5; color: var(--dj-text); }
.ap-year--future { background: var(--dj-blue); }
.ap-year--future .ap-year__y, .ap-year--future .ap-year__h { color: #fff; }
.ap-year--future .ap-year__p { color: rgba(255, 255, 255, 0.78); }

/* Оборудование */
.ap-eq { width: min(300px, 70vw); display: flex; flex-direction: column; gap: 16px; }
.ap-eq__img { display: grid; place-items: center; aspect-ratio: 1; border-radius: 24px; background: linear-gradient(180deg, #f6f7f9 0%, #e9ecef 100%); overflow: hidden; }
.ap-eq__img img { width: 82%; height: 82%; object-fit: contain; transition: transform 0.8s var(--dj-ease); }
.ap-eq:hover .ap-eq__img img { transform: scale(1.05); }
.ap-eq__name { font-size: 17px; line-height: 1.35; font-weight: 600; color: var(--dj-ink); }

/* ===== Главы с липким кадром ===== */
.ap-sticky { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); }
.ap-sticky__media { position: relative; }
.ap-sticky__frame { position: sticky; top: calc(var(--dj-header-h) + 52px + 6vh); aspect-ratio: 4 / 5; max-height: calc(100vh - var(--dj-header-h) - 52px - 12vh); width: 100%; border-radius: 28px; overflow: hidden; background: #dfe3e6; }
.ap-sticky__frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.06); transition: opacity 0.9s var(--dj-ease), transform 1.6s var(--dj-ease); }
.ap-sticky__frame img.is-on { opacity: 1; transform: none; }
.ap-step { display: flex; flex-direction: column; justify-content: center; min-height: 80vh; padding: 8vh 0; opacity: 0.28; transition: opacity 0.6s var(--dj-ease); }
.ap-step.is-on { opacity: 1; }
.ap-step__img { display: none; }
.ap-step__k { font-size: 15px; font-weight: 600; color: var(--dj-muted); }
.ap-step__h { margin-top: 8px; font-size: clamp(30px, 3.4vw, 48px); line-height: 1.1; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-ink); }
.ap-step__p { margin-top: 16px; font-size: clamp(17px, 1.3vw, 19px); line-height: 1.55; color: var(--dj-text); max-width: 42ch; }
.ap-step .dj-more { margin-top: 18px; }

/* ===== Что даёт система ===== */
.ap-caps { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 48px; list-style: none; margin: 0; padding: 0; }
.ap-caps li { display: flex; gap: 14px; align-items: flex-start; padding: 20px 0; border-top: 1px solid var(--dj-line); font-size: clamp(17px, 1.4vw, 21px); line-height: 1.4; color: var(--dj-ink); }
.ap-caps svg { flex: none; width: 20px; height: 20px; margin-top: 3px; color: var(--dj-blue); }
.ap-photo { margin: clamp(56px, 7vw, 96px) 0 0; border-radius: 28px; overflow: hidden; aspect-ratio: 2400 / 1230; background: #dfe3e6; }
.ap-photo img { width: 100%; height: 100%; object-fit: cover; transform: scale(calc(1.1 - var(--p, 0) * 0.1)); }
.ap-flow { margin-top: clamp(56px, 7vw, 96px); }
.ap-flow__h { margin-bottom: 28px; }

/* ===== Качество ===== */
.ap-q { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 96px); align-items: center; }
.ap-q__drop { margin: 0; border-radius: 28px; overflow: hidden; background: var(--dj-soft); }
.ap-q__drop img { width: 100%; height: auto; display: block; }
.ap-q__text .dj-eyebrow { color: var(--dj-blue); margin-bottom: 12px; }
.ap-q__text .ap-h { font-size: clamp(34px, 4.4vw, 64px); }
.ap-q__text .dj-lede { margin-top: 18px; max-width: 44ch; }
.ap-q__facts { list-style: none; margin: 32px 0 0; padding: 0; }
.ap-q__facts li { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); gap: 20px; align-items: baseline; padding: 18px 0; border-top: 1px solid var(--dj-line); }
.ap-q__facts b { font-size: clamp(32px, 3.4vw, 48px); line-height: 1; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-ink); white-space: nowrap; }
.ap-q__facts span { font-size: 16px; line-height: 1.45; color: var(--dj-text); }
.ap-q__links { display: flex; flex-wrap: wrap; gap: 10px 24px; margin-top: 24px; }

.ap-proof { margin: 0 0 clamp(72px, 9vw, 128px); }
.ap-proof__img { border-radius: 28px; overflow: hidden; aspect-ratio: 1672 / 941; background: #dfe3e6; }
.ap-proof__img img { width: 100%; height: 100%; object-fit: cover; transform: scale(calc(1.08 - var(--p, 0) * 0.08)); }
.ap-proof figcaption { margin-top: 16px; max-width: 60ch; font-size: 15px; line-height: 1.5; color: var(--dj-muted); }
.ap-proof figcaption b { color: var(--dj-ink); font-weight: 600; }

.ap-stages { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; list-style: none; margin: 0; padding: 0; }
.ap-stage { display: flex; flex-direction: column; gap: 10px; padding: 28px; border-radius: 24px; background: var(--dj-soft); }
.ap-stage__n { font-size: 40px; line-height: 1; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-blue); }
.ap-stage.is-final .ap-stage__n { color: #1f8a5b; }
.ap-stage__bar { position: relative; height: 4px; margin: 8px 0 6px; border-radius: 4px; background: #e1e4e7; overflow: hidden; }
.ap-stage__bar i { position: absolute; inset: 0 auto 0 0; width: 0; border-radius: inherit; background: var(--dj-blue); transition: width 1.4s var(--dj-ease) 0.2s; }
.ap-stage.is-in .ap-stage__bar i { width: var(--w); }
.ap-stage.is-final .ap-stage__bar i { background: #1f8a5b; }
.ap-stage__label { font-size: 19px; line-height: 1.3; font-weight: 600; color: var(--dj-ink); }
.ap-stage__res { font-size: 15px; line-height: 1.45; color: var(--dj-text); }

/* ===== Карта ===== */
.ap-map { border-radius: 28px; overflow: hidden; background: #fff; }
.ap-map__note { margin-top: 20px; font-size: 16px; color: var(--dj-text); }

/* ===== Медиа ===== */
.ap-mcard { width: min(400px, 80vw); display: flex; flex-direction: column; border-radius: 24px; overflow: hidden; background: var(--dj-soft); }
.ap-mcard__thumb { position: relative; aspect-ratio: 16 / 9; background: #0b0d10; }
.ap-mcard__thumb video, .ap-mcard__thumb img { width: 100%; height: 100%; object-fit: cover; }
.ap-mcard__thumb--doc { background: #e9ecef; display: grid; place-items: center; }
.ap-mcard__logo { width: 40% !important; height: auto !important; object-fit: contain !important; }
.ap-mcard__veil { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(0, 0, 0, 0.18); transition: opacity 0.3s ease; }
.ap-mcard__veil.is-off { opacity: 0; }
.ap-mcard__veil.is-off:hover { opacity: 1; }
.ap-play { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; background: rgba(255, 255, 255, 0.9); color: var(--dj-ink); }
.ap-play svg { width: 22px; height: 22px; fill: currentColor; }
.ap-mcard__body { display: flex; flex-direction: column; gap: 8px; padding: 24px; flex: 1; }
.ap-mcard__h { font-size: 19px; line-height: 1.3; font-weight: 600; color: var(--dj-ink); }
.ap-mcard__p { font-size: 15px; line-height: 1.5; color: var(--dj-text); }
.ap-mcard__meta { display: inline-flex; align-items: center; gap: 6px; margin-top: auto; padding-top: 8px; font-size: 13px; color: var(--dj-muted); }

/* ===== Финал ===== */
.ap-cta { position: relative; display: grid; place-items: center; min-height: min(90vh, 820px); padding: 120px 0; overflow: hidden; background: #0b0d10; isolation: isolate; }
.ap-cta__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.ap-cta__veil { position: absolute; inset: 0; z-index: -1; background: rgba(5, 10, 18, 0.55); }
.ap-cta__h { margin: 0 auto; max-width: 14ch; color: #fff; }
.ap-cta__p { margin-top: 20px; max-width: 46ch; color: rgba(255, 255, 255, 0.82); font-size: clamp(17px, 1.5vw, 21px); }

@media (max-width: 1023px) {
  .ap-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ap-stages { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .ap-hero__media { height: 62vh; }
  .ap-stats { gap: 0 20px; }
  .ap-stats b { font-size: clamp(40px, 12vw, 56px); }
  .ap-stats span { font-size: 15px; }
  .ap-band { min-height: 78vh; }
  .ap-sticky { grid-template-columns: 1fr; }
  .ap-sticky__media { display: none; }
  .ap-step { min-height: 0; padding: 0 0 56px; opacity: 1; }
  .ap-step__img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 20px; margin-bottom: 24px; }
  .ap-caps { grid-template-columns: 1fr; }
  .ap-photo, .ap-proof__img, .ap-q__drop, .ap-map { border-radius: 20px; }
  .ap-q { grid-template-columns: 1fr; }
  .ap-q__drop { max-width: 320px; }
  .ap-q__facts li { grid-template-columns: 1fr; gap: 6px; }
  .ap-stages { grid-template-columns: 1fr; }
  .ap-gal__ctrl { display: none; }
  .ap-year { min-height: 300px; padding: 26px; }
  .ap-h, .ap-hero__h, .ap-statement__h, .ap-band__text h2 { overflow-wrap: break-word; hyphens: manual; }
}
@media (prefers-reduced-motion: reduce) {
  .ap-hero__media video, .ap-band__img, .ap-photo img, .ap-proof__img img { transform: none; }
  .ap-word { transition: none; }
  .ap-sticky__frame img, .ap-step, .ap-stage__bar i, .ap-eq__img img { transition: none; }
  .ap-stage__bar i { width: var(--w); }
  .ap-gal__track { scroll-behavior: auto; }
}
</style>

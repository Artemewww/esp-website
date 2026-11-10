<template>
  <!-- О компании: сначала история «Путь воды ESP» (подача jazakvoda: спуск из
       облаков, земля смыкается слоями, белорусский лес, капля ESP), затем —
       разделы в стиле DJI/Apple с содержанием прежней страницы «О компании». -->
  <div class="ab">
    <StoryAboutJazak @jump="jumpTo" />

    <!-- ===== Разделы в стиле DJI/Apple: содержание прежней страницы ===== -->
    <div ref="rest" class="ab-rest">
      <DjSubnav title="О компании" :links="subnav" :cta="{ to: '/contacts', label: 'Обсудить проект' }" />

      <!-- Инженерия, которой доверяют (прежний первый экран) -->
      <section id="about-intro" class="dj-sec ab-intro">
        <div class="dj-wrap dj-center">
          <span class="dj-eyebrow dj-reveal">28 лет опыта</span>
          <h2 class="dj-h1 ab-intro__h dj-reveal">Инженерия, которой доверяют</h2>
          <p class="dj-lede ab-intro__p dj-reveal">
            28 лет практики: от подрядных работ до собственного инжиниринга и производства. Проектируем, изготавливаем и запускаем очистные сооружения, отвечая за результат целиком.
          </p>
          <div class="ab-intro__btns dj-reveal">
            <a href="#history" class="dj-btn dj-btn--line" @click.prevent="jumpTo('#history')">Наша история</a>
            <a href="#ecosystem" class="dj-btn" @click.prevent="jumpTo('#ecosystem')">Экосистема ESP</a>
          </div>
        </div>
        <!-- Ролик из админки (раздел «about-hero»: video, poster) -->
        <div class="dj-wrap dj-wrap--wide">
          <div class="ab-film dj-reveal">
            <video ref="brandVideo" :key="aboutHero.video" :poster="aboutHero.poster" muted loop playsinline preload="none">
              <source :src="aboutHero.video" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <!-- Путь компании -->
      <section id="history" class="dj-sec dj-sec--soft">
        <div class="dj-wrap">
          <div class="dj-center ab-head">
            <h2 class="dj-h2 dj-reveal">Путь компании</h2>
            <p class="dj-lede dj-reveal">28 лет практики: от подрядных работ до собственного инжиниринга и производства</p>
          </div>
          <div class="ab-narrow dj-reveal">
            <div class="tl mb-12" :class="{ 'tl--open': futureEvent }">
              <div class="tl-rail">
                <span class="tl-line" aria-hidden="true"></span>
                <span class="tl-line tl-line--done" :style="{ width: progressWidth }" aria-hidden="true"></span>
                <span v-if="futureEvent" class="tl-future" :class="{ 'is-active': activeIsFuture }" aria-hidden="true">
                  <svg class="tl-arrow" viewBox="0 0 14 14"><path d="M2 2l9 5-9 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </span>
                <button
                  v-for="(ev, i) in timelineEvents"
                  :key="`${ev.year}-${i}`"
                  type="button"
                  class="tl-stop"
                  :class="{ 'is-passed': i <= activeYearIndex, 'is-active': i === activeYearIndex, 'tl-stop--future': isFuture(ev) }"
                  :style="{ left: stopLeft(i) }"
                  :aria-pressed="i === activeYearIndex"
                  @click="activeYearIndex = i"
                >
                  <span class="tl-dot" aria-hidden="true"></span>
                  <span class="tl-year">{{ ev.year }}</span>
                </button>
              </div>
            </div>
            <Transition name="ab-fade" mode="out-in">
              <div v-if="activeEvent" :key="activeYearIndex" class="tl-card" :class="{ 'tl-card--future': activeIsFuture }">
                <h3 class="dj-h3 ab-card__h">{{ activeEvent.title }}</h3>
                <p class="ab-card__p">{{ activeEvent.text }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </section>

      <!-- Одна система ESP -->
      <section id="ecosystem" class="dj-sec">
        <div class="dj-wrap">
          <div class="dj-center ab-head">
            <h2 class="dj-h2 dj-reveal">Одна система ESP</h2>
            <p class="dj-lede dj-reveal">
              Проектирование и производство работают внутри одной компании: то, что рассчитали инженеры, изготавливается на нашем заводе и запускается той же командой.
            </p>
          </div>

          <div class="sys dj-reveal">
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
                <span class="sys-link-node"><img src="/logo-esp.svg" alt="" width="56" height="28" /></span>
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

          <div class="ab-flow dj-reveal">
            <h3 class="dj-h3 ab-flow__h">Как проходит объект</h3>
            <EcosystemFlow />
          </div>
        </div>
      </section>

      <!-- Эталон качества -->
      <section id="quality" class="dj-sec dj-sec--soft">
        <div class="dj-wrap">
          <div class="ql-lead">
            <figure class="ql-drop dj-reveal">
              <img src="/images/quality-sign.jpg" alt="Знак качества ESP — фирменная капля «Эталон качества»" width="540" height="760" decoding="async" loading="lazy" />
            </figure>
            <div class="ql-lead-text dj-reveal">
              <span class="ql-kicker">Эталон качества</span>
              <h2 class="dj-h2 mb-5">Знак, который ставится на объекте</h2>
              <p class="ql-lede">
                Знак качества ESP, разработанный для экологических объектов.
                Подтверждает надёжность и экологичность объекта.
              </p>
              <ul class="ql-facts">
                <li><b>5 м</b><span>кристальный просвет — стандарт прозрачности очищенной воды</span></li>
                <li><b>ISO 9001</b><span>система менеджмента качества, эко-сертификация, патенты</span></li>
                <li><b>100%</b><span>ответственность за результат: проект, оборудование, пусконаладка</span></li>
              </ul>
            </div>
          </div>

          <figure class="ql-proof dj-reveal">
            <img src="/images/team/quality-standard.png" alt="Фирменная капля ESP на здании управления очистных сооружений" loading="lazy" />
            <figcaption>
              <b>Очистные сооружения после пусконаладки.</b>
              Капля на фасаде — отметка о том, что объект принят по внутреннему стандарту ESP.
            </figcaption>
          </figure>

          <div class="ql-stages dj-reveal">
            <div class="ql-stages-head">
              <h3>Путь к кристальной чистоте</h3>
              <p>Шесть контролируемых ступеней — от механической очистки до обеззараживания.
                Показатели на каждой фиксируются лабораторно.</p>
            </div>
            <div class="ql-track">
              <div v-for="(stage, i) in clarityStages" :key="stage.label" class="ql-stage">
                <span class="ql-stage-num" :class="{ 'is-final': i === clarityStages.length - 1 }">{{ i + 1 }}</span>
                <span class="ql-stage-bar">
                  <span class="ql-stage-fill" :class="{ 'is-final': i === clarityStages.length - 1 }" :style="{ width: `${((i + 1) / clarityStages.length) * 100}%` }"></span>
                </span>
                <b class="ql-stage-label">{{ stage.label }}</b>
                <i class="ql-stage-result">{{ stage.result }}</i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- География работ -->
      <section id="map" class="dj-sec">
        <div class="dj-wrap">
          <div class="dj-center ab-head">
            <h2 class="dj-h2 dj-reveal">География работ</h2>
            <p class="dj-lede dj-reveal">Объекты, которые мы спроектировали, изготовили и запустили</p>
          </div>
          <div class="ab-map dj-reveal">
            <ClientOnly>
              <ProjectsMap :points="mapPoints" class="w-full aspect-video" />
              <template #fallback>
                <div class="w-full aspect-video flex items-center justify-center text-esp-black/40 text-sm">Загрузка карты…</div>
              </template>
            </ClientOnly>
          </div>
          <p class="ab-map__note">
            150+ проектов по всей Беларуси — <NuxtLink to="/projects" class="dj-more">смотреть полный список ›</NuxtLink>
          </p>
        </div>
      </section>

      <!-- Медиа-центр -->
      <section id="media" class="dj-sec dj-sec--soft">
        <div class="dj-wrap">
          <div class="dj-center ab-head">
            <h2 class="dj-h2 dj-reveal">Медиа-центр</h2>
            <p class="dj-lede dj-reveal">Видео о компании и презентации для заказчиков и партнёров</p>
          </div>
          <div class="ab-media">
            <template v-for="(item, i) in media" :key="`${item.title}-${i}`">
              <div v-if="item.kind !== 'presentation'" class="ab-mcard dj-reveal">
                <div class="ab-mcard__thumb">
                  <video
                    :ref="(el) => { mediaVideos[i] = el }"
                    :src="item.file"
                    :poster="item.poster || undefined"
                    muted
                    loop
                    playsinline
                    preload="metadata"
                    @pause="mediaPlaying[i] = false"
                  ></video>
                  <div class="ab-mcard__veil" :class="{ 'is-off': mediaPlaying[i] }" @click="mediaPlaying[i] && toggleMedia(i)">
                    <button type="button" class="ab-play" :aria-label="mediaPlaying[i] ? `Пауза: ${item.title}` : `Смотреть: ${item.title}`" @click.stop="toggleMedia(i)">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
                    </button>
                  </div>
                </div>
                <div class="ab-mcard__body">
                  <h3 class="ab-mcard__h">{{ item.title }}</h3>
                  <p class="ab-mcard__p">{{ item.desc }}</p>
                  <span v-if="item.duration" class="ab-mcard__meta"><Icon name="clock" cls="w-3.5 h-3.5" />{{ item.duration }}</span>
                </div>
              </div>
              <a v-else :href="item.file" download target="_blank" rel="noopener" class="ab-mcard dj-reveal">
                <div class="ab-mcard__thumb ab-mcard__thumb--doc">
                  <img v-if="item.poster" :src="item.poster" :alt="item.title" loading="lazy" />
                  <img v-else src="/logo-esp.svg" alt="" class="ab-mcard__logo" />
                </div>
                <div class="ab-mcard__body">
                  <h3 class="ab-mcard__h">{{ item.title }}</h3>
                  <p class="ab-mcard__p">{{ item.desc }}</p>
                  <span class="ab-mcard__meta"><Icon name="download" cls="w-3.5 h-3.5" />{{ item.duration || 'Скачать презентацию' }}</span>
                </div>
              </a>
            </template>
          </div>
        </div>
      </section>
    </div>

    <!-- Финал в пуще: светлячки, камыш — призыв из прежней страницы -->
    <section class="hs hs-final">
      <img src="/images/about-story/fern.webp" alt="" class="hs-final__fern" loading="lazy" />
      <div class="hs-final__in hs-fin">
        <span class="hs-say__line hs-say__line--static" aria-hidden="true"><i /><b /><i /></span>
        <h2 class="hs-final__h">Готовы создать Эталон качества?</h2>
        <p class="hs-final__p">Обсудим ваш объект и подготовим решение — от обследования площадки до запуска очистных сооружений</p>
        <div class="hs-final__btns">
          <NuxtLink to="/contacts" class="hs-btn">Обсудить проект</NuxtLink>
          <NuxtLink to="/projects" class="hs-btn hs-btn--ghost">Посмотреть кейсы</NuxtLink>
        </div>
      </div>
      <i v-for="n in 14" :key="`ff${n}`" class="hs-firefly" :style="fireflyStyle(n)" />
      <img src="/images/about-story/reeds.webp" alt="" class="hs-final__reeds" loading="lazy" />
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useProjectGeo } from '~/composables/useProjectGeo'
import { useReveal } from '~/composables/useReveal'

const { mapPoints } = useProjectGeo()
const { timeline } = useTimeline()
const { media } = useMediaCenter()

// ===== Разделы после истории =====
const subnav = [
  { href: '#history', label: 'История' },
  { href: '#ecosystem', label: 'Система ESP' },
  { href: '#quality', label: 'Качество' },
  { href: '#map', label: 'География' },
  { href: '#media', label: 'Медиа' }
]

// Ролик из админки (раздел «about-hero»); пока раздела нет — ролик из сборки
const aboutHeroList = useEditableList('about-hero', [
  { video: '/videos/hero/about-water.mp4', poster: '/images/hero-bg.jpg' }
])
const aboutHero = computed(() => {
  const item = aboutHeroList.value.find((h) => h && h.video) || {}
  return { video: item.video || '/videos/hero/about-water.mp4', poster: item.poster || '/images/hero-bg.jpg' }
})

// Путь компании: годы из админки + «вектор в будущее»
const isFuture = (ev) => !/^\d{4}$/.test(String(ev?.year ?? '').trim())
const pastEvents = computed(() => timeline.value.filter((ev) => ev && !isFuture(ev)))
const futureEvent = computed(() => timeline.value.find((ev) => ev && isFuture(ev)) || null)
const timelineEvents = computed(() => (futureEvent.value ? [...pastEvents.value, futureEvent.value] : pastEvents.value))
const activeYearIndex = ref(Math.max(pastEvents.value.length - 1, 0))
watch(() => pastEvents.value.length, (n) => { activeYearIndex.value = Math.max(n - 1, 0) })
const activeEvent = computed(() => timelineEvents.value[activeYearIndex.value] || timelineEvents.value[0])
const activeIsFuture = computed(() => !!activeEvent.value && isFuture(activeEvent.value))
const stopLeft = (i) => {
  const n = pastEvents.value.length
  if (i >= n) return '100%'
  const frac = n > 1 ? i / (n - 1) : 0
  return futureEvent.value ? `calc((100% - var(--tl-tail)) * ${frac})` : `${frac * 100}%`
}
const progressWidth = computed(() =>
  activeYearIndex.value >= pastEvents.value.length ? 'calc(100% - var(--tl-tail))' : stopLeft(activeYearIndex.value)
)

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

// Медиа-центр: видео по клику на ▶
const mediaVideos = {}
const mediaPlaying = reactive({})
const toggleMedia = (i) => {
  const el = mediaVideos[i]
  if (!el) return
  if (el.paused) el.play().then(() => { mediaPlaying[i] = true }).catch(() => {})
  else { el.pause(); mediaPlaying[i] = false }
}

const jumpTo = (href) => {
  const el = document.querySelector(href)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56 - 52, behavior: 'smooth' })
}

const brandVideo = ref(null)
const rest = ref(null)

const fireflyStyle = (n) => {
  const r = (k) => Math.round((((Math.sin(n * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1) * 1000) / 1000
  return { left: `${(6 + r(1) * 88).toFixed(1)}%`, top: `${(20 + r(2) * 60).toFixed(1)}%`, animationDelay: `${(r(3) * 6).toFixed(2)}s`, animationDuration: `${(5 + r(4) * 5).toFixed(2)}s` }
}

useReveal(rest)

let filmIo = null
onMounted(() => {
  // Ролик о компании играет только в кадре
  if (brandVideo.value && 'IntersectionObserver' in window) {
    filmIo = new IntersectionObserver(([e]) => {
      const v = brandVideo.value
      if (!v) return
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.25 })
    filmIo.observe(brandVideo.value)
  }
})
onBeforeUnmount(() => { filmIo?.disconnect() })

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
    { rel: 'preload', as: 'image', href: '/images/about-jz/sea.webp', fetchpriority: 'high' }
  ]
})
</script>

<style scoped>
.hs {
  --hs-ink: #050c07;
  --hs-cream: #f3efe4;
  --hs-blue: #4aa3ff;
  background: var(--hs-ink);
  color: var(--hs-cream);
  overflow-x: clip;
}
.hs-say__line { display: flex; flex-direction: column; align-items: center; }
.hs-say__line i { width: 7px; height: 7px; border-radius: 50%; background: #fff; flex: none; }
.hs-say__line b { width: 1px; flex: 1 1 auto; background: rgba(255, 255, 255, 0.85); }
.hs-final { position: relative; padding: 16vh 1.5rem 30vw; text-align: center; overflow: hidden; }
.hs-final__in { position: relative; z-index: 3; max-width: 46rem; margin: 0 auto; display: grid; justify-items: center; }
.hs-say__line--static { height: 90px; margin: 0 0 1.5rem; }
.hs-say__line--static i { opacity: 1; background: var(--hs-blue); }
.hs-say__line--static b { transform: none; background: var(--hs-blue); }
.hs-final__h { margin-top: 0.8rem; font-family: var(--font-display); font-size: clamp(2.2rem, 4.6vw, 4.4rem); font-weight: 700; line-height: 1.04; text-transform: uppercase; color: #fff; }
.hs-final__p { margin-top: 1.4rem; font-size: 1.05rem; line-height: 1.6; color: rgba(243, 239, 228, 0.78); }
.hs-final__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.8rem; margin-top: 2.2rem; }
.hs-btn { padding: 0.95rem 1.7rem; border-radius: 999px; background: #1f6fd6; color: #fff; font-weight: 600; transition: background-color 0.2s ease; }
.hs-btn:hover { background: #185bb2; }
.hs-btn--ghost { background: transparent; box-shadow: inset 0 0 0 1.5px rgba(243, 239, 228, 0.6); color: var(--hs-cream); }
.hs-btn--ghost:hover { background: rgba(243, 239, 228, 0.1); }
.hs-final__fern { position: absolute; left: -6vw; bottom: 8vw; width: 32vw; max-width: none; z-index: 1; opacity: 0.85; }
.hs-final__reeds { position: absolute; left: 0; bottom: -27vw; width: 100%; max-width: none; z-index: 2; filter: brightness(0.62); }
.hs-firefly { position: absolute; z-index: 2; width: 5px; height: 5px; border-radius: 50%; background: #ffe9a3; box-shadow: 0 0 12px 3px rgba(255, 220, 120, 0.7); animation: hs-firefly 7s ease-in-out infinite; opacity: 0; }
@keyframes hs-firefly { 0%, 100% { opacity: 0; transform: translate(0, 0); } 30% { opacity: 1; } 50% { transform: translate(18px, -26px); } 70% { opacity: 0.8; } }
@media (max-width: 767px) {
  .hs-final { padding-bottom: 40vw; }
  .hs-final__fern { width: 60vw; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-firefly { animation: none; }
}

/* ===== Прежние блоки «О компании»: линия лет, система, качество ===== */
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


/* ===== Разделы после истории (DJI/Apple) ===== */
.ab { overflow-x: clip; }
.ab-rest { position: relative; background: #fff; }
.hs-dark__fade { height: 14vh; }
.ab-head { max-width: 46rem; margin: 0 auto clamp(36px, 5vw, 64px); display: grid; gap: 14px; }
.ab-narrow { max-width: 56rem; margin: 0 auto; }
.ab-intro { padding-bottom: 0; }
.ab-intro__h { margin: 10px auto 0; max-width: 18ch; }
.ab-intro__p { max-width: 40rem; margin-top: 18px; }
.ab-intro__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 28px; }
.ab-film { margin-top: clamp(40px, 6vw, 72px); border-radius: 28px; overflow: hidden; aspect-ratio: 21 / 9; background: #0b0d10; }
.ab-film video { width: 100%; height: 100%; object-fit: cover; display: block; }
.ab-card__h { margin-bottom: 10px; }
.ab-card__p { max-width: 40rem; margin: 0 auto; color: var(--dj-muted); line-height: 1.6; }
.tl-card { text-align: center; }
.ab-flow { margin-top: clamp(48px, 6vw, 80px); padding: clamp(24px, 4vw, 48px); border-radius: 28px; background: #0b0d10; }
.ab-flow__h { color: #fff !important; margin-bottom: 32px; }
.ab-map { overflow: hidden; border-radius: 28px; background: #fff; box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.25); }
.ab-map__note { margin-top: 20px; text-align: center; font-size: 14px; color: var(--dj-muted); }
.ab-media { display: grid; gap: 24px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ab-mcard { display: block; overflow: hidden; border-radius: 24px; background: #fff; transition: transform 0.4s var(--dj-ease), box-shadow 0.4s var(--dj-ease); }
.ab-mcard:hover { transform: translateY(-4px); box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.25); }
.ab-mcard__thumb { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #0b0d10; }
.ab-mcard__thumb--doc { display: grid; place-items: center; background: #002366; }
.ab-mcard__thumb video, .ab-mcard__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ab-mcard__thumb .ab-mcard__logo { width: 50%; max-height: 64px; object-fit: contain; filter: brightness(0) invert(1); }
.ab-mcard__veil { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(0, 0, 0, 0.28); transition: opacity 0.3s ease; }
.ab-mcard__veil.is-off { opacity: 0; }
.ab-play { width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center; background: rgba(255, 255, 255, 0.92); color: var(--dj-ink); transition: transform 0.3s var(--dj-ease); }
.ab-play:hover { transform: scale(1.08); }
.ab-play svg { width: 22px; height: 22px; fill: currentColor; margin-left: 3px; }
.ab-mcard__body { padding: 22px 24px 26px; display: grid; gap: 8px; }
.ab-mcard__h { font-size: 18px; font-weight: 600; color: var(--dj-ink); }
.ab-mcard__p { font-size: 14px; line-height: 1.55; color: var(--dj-muted); }
.ab-mcard__meta { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dj-muted); }
.ab-fade-enter-active, .ab-fade-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.ab-fade-enter-from { opacity: 0; transform: translateY(10px); }
.ab-fade-leave-to { opacity: 0; transform: translateY(-10px); }
.ql-drop img, .ql-proof img { border-radius: 22px; }
.tl-card, .sys, .ql-stages { border-radius: 22px; }
.sys-caps { border-radius: 16px; }
.ql-facts { border-radius: 14px; }
@media (max-width: 899px) {
  .ab-media { grid-template-columns: 1fr; }
  .ab-film { aspect-ratio: 4 / 3; border-radius: 20px; }
}
</style>

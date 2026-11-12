<template>
  <div ref="root" class="hm">
    <!-- 1. Видео-слайдер объектов: та же лента роликов, что на боевом сайте -->
    <HomeObjectsSlider :items="heroItems" label="Объекты ESP" align-left />

    <!-- 2. Ключевые метрики: бенто со счётчиками (только реальные данные проекта) -->
    <section id="metrics" ref="metricsEl" class="hm-metrics" aria-label="ESP в цифрах">
      <div class="hm-bento">
        <div v-for="m in metrics" :key="m.label" class="hm-bn dj-reveal" :class="[`hm-bn--${m.kind}`, m.art && `hm-bn--art hm-bn--${m.art}`, m.dots && 'hm-bn--dots']">
          <!-- «Живая» плитка: объект выходит за верхний край, низ прячется в плитке (#bento) -->
          <img v-if="m.art" class="hm-bn__art" :class="`hm-bn__art--${m.art}`" :srcset="srcset(artSrc[m.art])" sizes="(max-width: 734px) 100vw, 33vw" :src="artSrc[m.art]" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <HomeBentoDotMap v-if="m.kind === 'hero'" class="hm-bn__map" />
          <!-- «30 000»: точки слетаются в знак ESP, счётчик идёт синхронно со сборкой -->
          <HomeBentoParticles v-if="m.dots" class="hm-bn__dots" @progress="(p) => { m.display = Math.round(m.value * p) }" />
          <span v-if="m.eyebrow" class="hm-bn__eyebrow">{{ m.eyebrow }}</span>
          <b class="hm-bn__num"><small v-if="m.prefix">{{ m.prefix }}</small>{{ m.display.toLocaleString('ru-RU') }}<em>{{ m.suffix }}</em></b>
          <span class="hm-bn__label">{{ m.label }}</span>
          <NuxtLink v-if="m.to && m.link" :to="m.to" class="hm-bn__go">{{ m.link }} ›</NuxtLink>
          <!-- Вся плитка — ссылка на свой раздел -->
          <NuxtLink v-if="m.to" :to="m.to" class="hm-bn__hit" :aria-label="m.label" tabindex="-1" />
        </div>
      </div>
    </section>

    <!-- 3. Бренд-высказывание: фирменный «Лист» наполняется водой при прокрутке (#70) -->
    <HomeWaveFill />

    <!-- 4. Почему нам доверяют: четыре плитки 2×2, как у DJI -->
    <section class="hm-trust" aria-labelledby="trust-h">
      <div class="dj-wrap dj-center hm-head dj-reveal">
        <h2 id="trust-h" class="dj-h2">Почему нам доверяют</h2>
      </div>
      <div class="hm-tt-grid">
        <!-- Компактные карточки в духе apple.com: чёткая картинка в своём окне сверху, ниже подпись, заголовок, текст, круглая стрелка -->
        <NuxtLink v-for="f in trustFactors" :key="f.title" :to="f.to" class="hm-tt dj-reveal" :aria-label="f.title">
          <span class="hm-tt__media"><img :srcset="srcset(f.image)" sizes="(max-width: 734px) 100vw, 33vw" :src="f.image" :alt="f.alt" loading="lazy" decoding="async" /></span>
          <span class="hm-tt__text">
            <span class="hm-tt__eyebrow">{{ f.caption }}</span>
            <span class="hm-tt__title">{{ f.title }}</span>
            <span class="hm-tt__sub">{{ f.text }}</span>
          </span>
          <span class="hm-tt__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg></span>
        </NuxtLink>
      </div>
    </section>

    <!-- 5. Технологии — цифровой двойник (скан → BIM → эксплуатация) -->
    <HomeTechShowcase />

    <!-- 6. Полный цикл: карусель роликов с объектов -->
    <section class="hm-reel" aria-labelledby="reel-h">
      <div class="dj-wrap dj-center hm-head dj-reveal">
        <h2 id="reel-h" class="dj-h2">Полный цикл:<br />от проекта до пусконаладки</h2>
      </div>
      <div class="hm-reel__stage" @pointerdown="dragStart" @pointerup="dragEnd" @pointercancel="dragEnd" @wheel="onReelWheel">
        <div class="hm-reel__track" :style="{ transform: `translateX(calc(${-reel} * (var(--reel-w) + var(--reel-gap))))` }">
          <div v-for="(v, i) in reelVideos" :key="v" class="hm-reel__slide" :class="{ 'is-on': i === reel }" @click="reel = i">
            <video :ref="(el) => (reelEls[i] = el)" muted loop playsinline preload="metadata" :poster="reelPoster(v)">
              <source :src="v" type="video/mp4" />
            </video>
          </div>
        </div>
        <button class="hm-reel__nav hm-reel__nav--l" aria-label="Предыдущий ролик" @click="reelGo(-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 6l-6 6 6 6" /></svg></button>
        <button class="hm-reel__nav hm-reel__nav--r" aria-label="Следующий ролик" @click="reelGo(1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6l6 6-6 6" /></svg></button>
      </div>
      <div class="hm-reel__dots">
        <button v-for="(v, i) in reelVideos" :key="v" :class="{ 'is-on': i === reel }" :aria-label="`Ролик ${i + 1}`" @click="reel = i" />
      </div>
    </section>

    <!-- 7. Решения для бизнеса: отрасли высокими карточками -->
    <section class="hm-fields" aria-labelledby="fields-h">
      <div class="dj-wrap dj-center hm-head dj-reveal">
        <h2 id="fields-h" class="dj-h2">Решения по отраслям</h2>
        <div class="dj-links"><NuxtLink to="/solutions" class="dj-more">Все отрасли</NuxtLink></div>
      </div>
      <div class="dj-tiles dj-tiles--2 hm-fields__grid">
        <!-- Карточка как в образце владельца: светлое небо кадра, заголовок слева сверху, объект внизу -->
        <div v-for="s in solutions" :key="s.slug" class="hm-sc dj-reveal">
          <img class="hm-sc__img" :srcset="srcset(FIELD_COVERS[s.slug] || s.cover)" sizes="(max-width: 734px) 100vw, 33vw" :src="FIELD_COVERS[s.slug] || s.cover" :alt="s.title" loading="lazy" decoding="async" />
          <NuxtLink :to="`/solutions/${s.slug}`" class="hm-sc__hit" :aria-label="s.title" tabindex="-1" />
          <div class="hm-sc__text">
            <h3 class="hm-sc__title">{{ s.title }}</h3>
            <p class="hm-sc__sub">{{ s.short }}</p>
            <div class="hm-sc__act">
              <NuxtLink :to="`/solutions/${s.slug}`" class="hm-sc__btn">Подробнее <i>›</i></NuxtLink>
              <NuxtLink to="/contacts#contact-form" class="hm-sc__btn hm-sc__btn--line">Обсудить проект</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Сборка знака из точек -->
    <HomeLogoAssembly />

    <!-- 9. Оборудование: предметные кадры на светлом градиенте -->
    <section class="hm-equip" aria-labelledby="equip-h">
      <div class="dj-wrap dj-center hm-head dj-reveal">
        <h2 id="equip-h" class="dj-h2">Оборудование ESP</h2>
        <div class="dj-links"><NuxtLink to="/equipment" class="dj-more">Весь каталог</NuxtLink></div>
      </div>
      <div class="dj-tiles dj-tiles--2">
        <!-- Текст сверху, изделие целиком ниже в своей зоне (contain), тень — под опорами -->
        <div v-for="e in equipShow" :key="e.slug" class="hm-et dj-reveal">
          <NuxtLink :to="`/equipment/${e.slug}`" class="dj-tile__hit" :aria-label="e.name" tabindex="-1" />
          <div class="hm-et__text">
            <h3 class="dj-tile__title">{{ e.name }}</h3>
            <p class="dj-tile__sub">{{ e.desc }}</p>
            <div class="dj-links">
              <NuxtLink :to="`/equipment/${e.slug}`" class="dj-btn">Подробнее ›</NuxtLink>
              <NuxtLink to="/equipment" class="dj-btn dj-btn--line">Весь каталог</NuxtLink>
            </div>
          </div>
          <span class="hm-et__media">
            <span class="hm-et__fig">
              <img :srcset="srcset(cutOf(e))" sizes="(max-width: 734px) 100vw, 33vw" :src="cutOf(e)" :alt="e.name" loading="lazy" decoding="async" @load="setRatio" />
            </span>
          </span>
        </div>
      </div>

      <!-- Остальное оборудование рядом карточек (без повтора четырёх плиток выше) -->
      <EquipNovRow :items="equipRest" layout="grid" bare />
    </section>

    <!-- 10. Стандарт качества: СТБ 2672-2025 -->
    <section class="dj-sec dj-sec--soft hm-lean" aria-labelledby="lean-h">
      <div class="dj-wrap">
        <div class="dj-center dj-reveal">
          <span class="dj-eyebrow">Стандарт качества</span>
          <h2 id="lean-h" class="dj-h2 hm-lean__h">Система бережливого менеджмента по СТБ 2672-2025</h2>
          <p class="dj-lede hm-lean__lede">
            Мы придерживаемся принципов бережливого производства и непрерывного совершенствования: минимум потерь,
            максимум ценности для заказчика и прозрачность на каждом этапе — от проектирования до эксплуатации.
          </p>
          <div class="hm-lean__tags"><span>#кайдзен</span><span>#5S</span><span>#TQM</span><span>#JIT</span></div>
        </div>
        <figure class="hm-lean__photo dj-reveal">
          <img :srcset="srcset(LEAN_IMAGE)" sizes="(max-width: 734px) 100vw, 33vw" :src="LEAN_IMAGE" alt="Инженер ESP управляет станцией с пульта" loading="lazy" decoding="async" />
        </figure>
        <div class="hm-lean__grid">
          <article v-for="p in leanPrinciples" :key="p.title" class="hm-lean__card dj-reveal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="p.icon" /></svg>
            <h3>{{ p.title }}</h3>
            <p>{{ p.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- #64: отзывы заказчиков и логотипы клиентов -->
    <HomeTrustBlock />

    <!-- 11. Призыв к сотрудничеству: единый блок с сотрудниками ESP, как на остальных страницах -->
    <AppleCta eyebrow="Следующий шаг" title="Обсудим ваш проект" lede="Подготовим решение под требования объекта: технологию, оборудование и состав работ." />
  </div>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
import { cutSrc } from '~/composables/useEquipCut'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { solutions, renderedEquipment } from '~/composables/useSiteNav'
import { useReveal } from '~/composables/useReveal'
import { slidesFromHero } from '~/composables/useObjectSlides'
import heroSlideDefaults from '~~/content/defaults/hero-slides.json'

const { data: heroData } = await useFetch('/api/site-content/hero-slides', { default: () => heroSlideDefaults })
const heroItems = computed(() => slidesFromHero(Array.isArray(heroData.value) && heroData.value.length ? heroData.value : heroSlideDefaults))

useSeoMeta({
  title: 'ESP — ЭкоСервисПроект | Очистные сооружения под ключ в Беларуси',
  description: 'Проектирование, производство оборудования, строительство и пусконаладка очистных сооружений под ключ. 28 лет опыта, 2000+ реализованных проектов.'
})

const root = ref(null)
useReveal(root)

// ── Метрики со счётчиком
// Цифры: о компании (/about), крупнейший объект — content/defaults/projects.json (Речица),
// гарантия — useEquipment, число позиций — каталог renderedEquipment.
const metrics = ref([
  { kind: 'hero', label: 'Реализованных проектов очистки сточных вод', value: 2000, suffix: '+', to: '/projects', link: 'Смотреть объекты' },
  { kind: 'sm', art: 'shield', label: 'Лет гарантии на оборудование', value: 5, suffix: '', to: '/equipment#support' },
  { kind: 'sm', art: 'eqp', label: 'Видов оборудования собственного производства', value: renderedEquipment.length, suffix: '', to: '/equipment#catalog', link: 'Каталог' },
  { kind: 'sm', art: 'years', label: 'Лет опыта', value: 28, suffix: '', to: '/about#history' },
  { kind: 'sm', dots: true, label: 'Элементов в экосистеме ESP', value: 30000, suffix: '', to: '/about#ecosystem' },
  { kind: 'wide', art: 'team', label: 'Экспертов в команде', value: 100, suffix: '+', to: '/career' },
  { kind: 'blue', art: 'photo', eyebrow: 'Крупнейший объект — Речица', label: 'Очистные сооружения города, м³ в сутки', value: 18000, suffix: '', to: '/projects/rechitsa', link: 'Об объекте' }

// SSR и клиент без JS видят итоговые цифры; обнуление и отсчёт — только в браузере (onMounted).
].map((m) => ({ ...m, display: m.value })))
// Объекты «живых» плиток: настоящие кадры и рендеры ESP (вырезка, без генерации объектов)
const artSrc = { team: '/images/home/bento/team.webp', shield: '/images/home/bento/shield.webp', eqp: '/images/equipment/cut/flotation.webp', photo: '/images/home/bento/rechitsa-photo.webp', years: '/images/about/years-28.webp' }
const metricsEl = ref(null)
let metricsIo = null
const countUp = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { metrics.value.forEach((m) => { m.display = m.value }); return }
  const t0 = performance.now()
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 2000)
    const e = 1 - Math.pow(1 - k, 3)
    metrics.value.forEach((m) => { if (!m.dots) m.display = Math.round(m.value * e) })
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// ── Фото плиток — меняются только здесь
// «Почему нам доверяют»: по порядку USBF, Инжиниринг, Производство, Ввод в эксплуатацию
const TRUST_IMAGES = [
  '/images/home/covers/usbf-cutaway.webp',
  '/images/real4k/cad-screen.webp',
  '/images/home/covers/production-drum-hall.webp',
  '/images/home/covers/commissioning-hmi.webp'
]
// «Решения для бизнеса»: обложка по slug отрасли (пусто — берётся cover из useSiteNav)
const FIELD_COVERS = {
  vodokanaly: '/images/solutions/cover/vodokanaly.webp',
  agrokompleksy: '/images/solutions/cover/agrokompleksy.webp',
  'pishchevaya-promyshlennost': '/images/solutions/cover/pishchevaya-promyshlennost.webp',
  'chastnye-i-kommercheskie': '/images/solutions/cover/chastnye-i-kommercheskie.webp'
}
// «Система бережливого менеджмента по СТБ 2672-2025»: фото на всю ширину блока
const LEAN_IMAGE = '/images/services/start-blue.webp'

const trustFactors = [
  { title: 'Решения на базе USBF', caption: 'Технология USBF', image: TRUST_IMAGES[0], alt: 'Решения на базе технологии USBF', to: '/technologies', text: 'Внедряем технологию USBF под задачи конкретного объекта. Опираемся на 28 лет практики в биологической очистке сточных вод.' },
  { title: 'Инжиниринг', caption: 'Проектирование', image: TRUST_IMAGES[1], alt: 'Инжиниринг — проектирование и подготовка проекта', to: '/services', text: 'Проектируем очистные сооружения под условия конкретного объекта: от исходных данных до рабочей документации.' },
  { title: 'Производство', caption: 'Собственный цех', image: TRUST_IMAGES[2], alt: 'Производство оборудования в собственном цехе ESP', to: '/equipment', text: 'Оборудование изготавливаем в собственном цехе и контролируем качество на каждом узле.' },
  { title: 'Ввод в эксплуатацию', caption: 'Пусконаладка и контроль', image: TRUST_IMAGES[3], alt: 'Ввод объекта в эксплуатацию — пусконаладка и контроль', to: '/services', text: 'Выводим объект на проектные показатели. Процессы на всех этапах прозрачны для заказчика.' }
]

// ── Карусель роликов (те же девять, что в прежней галерее)
const reelVideos = [
  '/videos/mosaic/esp_hero_190826.mp4', '/videos/mosaic/esp_seg1_190826.mp4', '/videos/mosaic/esp_seg2_190826.mp4',
  '/videos/mosaic/esp_seg3_190826.mp4', '/videos/mosaic/esp_seg4_190826.mp4', '/media/reel/DJI_0715.mp4',
  '/videos/mosaic/esp_seg6_190826.mp4', '/videos/mosaic/esp_seg7_190826.mp4', '/videos/mosaic/esp_drone3_200826.mp4'
]
const reelPoster = (v) => v.replace('/videos/mosaic/', '/images/reel/').replace('/media/reel/', '/images/reel/').replace(/\.mp4$/, '.jpg')
const reel = ref(1)
const reelEls = []
const reelGo = (d) => { reel.value = (reel.value + d + reelVideos.length) % reelVideos.length }
let px = 0
const dragStart = (e) => { px = e.clientX }
const dragEnd = (e) => { const dx = e.clientX - px; if (Math.abs(dx) > 40) reelGo(dx < 0 ? 1 : -1) }
// Колесо и тачпад: горизонтальный жест (или Shift + колесо) листает ролики,
// вертикальная прокрутка страницы не перехватывается
let wheelAcc = 0
let wheelLock = 0
const onReelWheel = (e) => {
  const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0)
  if (!dx) return
  e.preventDefault()
  const now = performance.now()
  if (now < wheelLock) return
  wheelAcc += dx
  if (Math.abs(wheelAcc) > 50) {
    reelGo(wheelAcc > 0 ? 1 : -1)
    wheelAcc = 0
    wheelLock = now + 650
  }
}
const syncReel = () => reelEls.forEach((v, i) => { if (!v) return; if (i === reel.value) v.play().catch(() => {}); else v.pause() })
watch(reel, syncReel)
let reelIo = null

const cutOf = (e) => cutSrc(e.photo) || e.photo
// Пропорции кадра изделия — по ним тень под опорами подстраивается под ширину изделия
const setRatio = (ev) => { const im = ev.target; if (im.naturalWidth) im.parentNode.style.setProperty('--r', (im.naturalWidth / im.naturalHeight).toFixed(3)) }
const equipShow = renderedEquipment.filter((e) => ['flotation-units', 'filter-press', 'polymer-dosing-station', 'rotary-drum-sieve'].includes(e.slug))
const equipRest = renderedEquipment.filter((e) => !equipShow.includes(e))

const leanPrinciples = [
  { title: 'Устранение потерь', text: 'Исключаем перепроизводство, ожидания и лишние перемещения в каждом процессе.', icon: 'M4 12h10M4 6h16M4 18h6M17 15l3 3-3 3' },
  { title: 'Фокус на людях', text: 'Развиваем компетенции сотрудников и создаём культуру постоянного улучшения.', icon: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.5M18 14a6.5 6.5 0 013.5 6' },
  { title: 'Встроенное качество', text: 'Качество закладываем на каждом этапе, а не исправляем в конце. Контроль на всех стадиях.', icon: 'M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6L12 3zM8.5 12l2.5 2.5 4.5-5' },
  { title: 'Непрерывное улучшение', text: 'Постоянно совершенствуем процессы на основе данных, обратной связи и анализа.', icon: 'M20 12a8 8 0 11-2.34-5.66M20 4v4.5h-4.5' }
]

onMounted(() => {
  root.value?.querySelectorAll('.hm-et__fig img').forEach((im) => { if (im.complete) setRatio({ target: im }) })
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) metrics.value.forEach((m) => { m.display = 0 })
  metricsIo = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { countUp(); metricsIo.disconnect() } }, { threshold: 0.4 })
  if (metricsEl.value) metricsIo.observe(metricsEl.value)
  const stage = root.value?.querySelector('.hm-reel')
  reelIo = new IntersectionObserver((es) => { es[0].isIntersecting ? syncReel() : reelEls.forEach((v) => v && v.pause()) }, { threshold: 0.25 })
  if (stage) reelIo.observe(stage)
})
onBeforeUnmount(() => { metricsIo?.disconnect(); reelIo?.disconnect() })
</script>

<style scoped>
.hm { background: #fff; }
/* Заголовок раздела Apple: 56/60, по центру, ссылка «› » под ним */
.hm-head { padding: clamp(64px, 8vw, 104px) 22px clamp(28px, 3.4vw, 44px); }
.hm-head .dj-h2 { text-wrap: balance; }
.hm-metrics { padding: clamp(48px, 6vw, 88px) clamp(16px, 2vw, 24px); background: #fff; }
.hm-bento { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: minmax(clamp(170px, 15vw, 220px), auto); gap: clamp(12px, 1.4vw, 20px); max-width: 1240px; margin: 0 auto; }
.hm-bn { position: relative; display: flex; flex-direction: column; justify-content: flex-end; gap: 6px; padding: clamp(20px, 2.2vw, 32px); overflow: hidden; border-radius: var(--r-lg); background: #EDEDED; color: #1A1A1A; isolation: isolate; }
.hm-bn__eyebrow { margin-bottom: auto; font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #5E5E5E; }
.hm-bn__num { font-size: clamp(44px, 4.6vw, 68px); line-height: 1; font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.hm-bn__num small { font-size: 0.42em; font-weight: 600; letter-spacing: 0; margin-right: 0.12em; }
.hm-bn__num em { font-style: normal; color: #002366; }
.hm-bn__label { max-width: 24ch; font-size: clamp(15px, 1.2vw, 17px); line-height: 1.3; letter-spacing: -0.016em; color: #3D3D3D; }
.hm-bn__go { margin-top: 10px; font-size: 15px; font-weight: 500; color: #002366; }
.hm-bn__go:hover { text-decoration: underline; }
.hm-bn--hero { grid-column: span 2; grid-row: span 2; color: #fff; background: radial-gradient(120% 90% at 85% 10%, #1b56b8 0%, rgba(27, 86, 184, 0) 55%), linear-gradient(160deg, #002366 0%, #002366 70%); }
.hm-bn--hero .hm-bn__num { font-size: clamp(72px, 10vw, 156px); }
.hm-bn--hero .hm-bn__num em { color: #7fb2ff; }
.hm-bn--hero .hm-bn__eyebrow, .hm-bn--hero .hm-bn__label { color: rgba(255, 255, 255, 0.78); }
.hm-bn--hero .hm-bn__label { font-size: clamp(17px, 1.5vw, 21px); max-width: 26ch; }
.hm-bn--hero .hm-bn__go, .hm-bn--blue .hm-bn__go { color: #fff; }
.hm-bn--blue { grid-column: span 2; color: #fff; background: linear-gradient(120deg, #002366, #1b56b8); }
.hm-bn--blue .hm-bn__eyebrow, .hm-bn--blue .hm-bn__label { color: rgba(255, 255, 255, 0.8); }
.hm-bn--blue .hm-bn__num em { color: #fff; }
.hm-bn--blue .hm-bn__label { max-width: 20ch; }
.hm-bn--wide { grid-column: span 2; }
/* «Живые» плитки: объект выходит за верхний край, текст поверх и не перекрывается.
   team — низ обрезан краем плитки (clip-path по нижним скруглениям), shield/eqp — «пробивают» верхний край; Речица — фото внутри плитки. */
.hm-metrics { overflow-x: clip; }
.hm-bn--art { overflow: visible; }
.hm-bn--art > :not(.hm-bn__art):not(.hm-bn__bar) { position: relative; z-index: 2; }
.hm-bn--team { clip-path: inset(-400px 0 0 0 round var(--r-lg)); }
/* Речица: кадр с первого экрана внутри синей плитки, мягкий переход в синий под текстом */
.hm-bn--art.hm-bn--photo { overflow: hidden; }
.hm-bn__art--photo { top: 0; right: 0; bottom: 0; width: 64%; height: 100%; object-fit: cover; -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 55%); mask-image: linear-gradient(90deg, transparent 0%, #000 55%); }
/* 2 000+: карта Беларуси из точек фоном справа */
.hm-bn > .hm-bn__hit { position: absolute !important; inset: 0; z-index: 3 !important; border-radius: inherit; }
.hm-bn__go { position: relative; z-index: 4; }
.hm-bn:has(.hm-bn__hit) { cursor: pointer; }
.hm-bn__map { position: absolute; top: 5%; right: 4%; width: 54%; z-index: 0; pointer-events: none; }
.hm-bn--hero > :not(.hm-bn__map):not(.hm-bn__bar) { position: relative; z-index: 1; }
/* «30 000»: холст точек над цифрой (высоту считает BentoParticles по .hm-bn__num) */
.hm-bn--dots > :not(.hm-bn__dots) { position: relative; z-index: 1; }
.hm-bn__art { position: absolute; z-index: 1; display: block; width: auto; max-width: none; pointer-events: none; user-select: none; transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.hm-bn__art--team { right: 3%; bottom: -12%; height: 128%; }
.hm-bn--team .hm-bn__label { max-width: 11ch; }
.hm-bn__art--shield { right: 9%; top: 14%; height: min(54%, 124px); }
/* «28 лет»: объёмные стальные цифры под водой — сама цифра на картинке, текстовое число скрыто для зрения, но читается скринридером */
.hm-bn--art.hm-bn--years { overflow: hidden; background: #002366; color: #fff; }
.hm-bn__art--years { inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 28%; }
.hm-bn--years::after { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, transparent 55%, rgba(0, 20, 60, 0.75) 100%); pointer-events: none; }
.hm-bn--years .hm-bn__num { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.hm-bn--years .hm-bn__label { margin-top: auto; color: #fff; }
.hm-bn__art--eqp { right: 4%; top: -26px; width: min(58%, 180px); height: auto; }
.hm-bn--art:hover .hm-bn__art--team, .hm-bn--art:hover .hm-bn__art--eqp { transform: translateY(-6px); }
.hm-bn--art:hover .hm-bn__art--shield { transform: translateY(-6px); }
@media (prefers-reduced-motion: reduce) { .hm-bn__art { transition: none; } }
@media (max-width: 1068px) {
  .hm-bento { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hm-bn--hero { grid-row: span 1; min-height: 300px; }
  /* 2 колонки: малые плитки с объектами первыми — объекты выходят в поле секции, а не на текст соседей */
  .hm-bn--shield, .hm-bn--eqp { order: -1; }
  .hm-bn--sm:not(.hm-bn--art) { order: 1; }
  .hm-bn--blue { order: 2; }
  .hm-bn__art--shield { top: 12%; }
  .hm-bn__art--eqp { top: -22px; }
  .hm-bn__art--photo { width: 58%; }
}
@media (max-width: 734px) {
  .hm-bento { gap: 10px; grid-auto-rows: minmax(150px, auto); }
  .hm-bn { border-radius: var(--r-md); padding: 18px; }
  .hm-bn--hero { min-height: 260px; }
  .hm-bn__num { font-size: clamp(34px, 10vw, 44px); }
  .hm-bn--hero .hm-bn__num { font-size: clamp(64px, 20vw, 88px); }
  .hm-bn__label { font-size: 14px; }
  .hm-bn__art--team { right: 2%; bottom: -6%; height: 118%; }
  .hm-bn--team { clip-path: inset(-400px 0 0 0 round var(--r-md)); }
  .hm-bn__art--photo { width: 62%; -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 60%); mask-image: linear-gradient(90deg, transparent 0%, #000 60%); }
  .hm-bn--photo .hm-bn__eyebrow, .hm-bn--photo .hm-bn__label { max-width: 52%; }
  .hm-bn__map { width: 50%; top: 4%; right: 4%; }
  .hm-bn__art--shield { top: 12%; right: 8%; height: 84px; }
  .hm-bn__art--eqp { top: -20px; right: 3%; width: 54%; }
}

/* Карусель: галерея Apple — активный кадр, соседи приглушены, точки в капсуле */
.hm-reel { padding-bottom: clamp(48px, 6vw, 80px); --reel-w: min(76vw, 1180px); --reel-gap: 20px; }
.hm-reel__stage { position: relative; overflow: hidden; touch-action: pan-y; }
.hm-reel__track { display: flex; gap: var(--reel-gap); padding-left: calc((100vw - var(--reel-w)) / 2); transition: transform 1s var(--dj-ease); }
.hm-reel__slide { flex: 0 0 var(--reel-w); aspect-ratio: 16 / 9; overflow: hidden; border-radius: var(--r-lg); background: #000; cursor: pointer; opacity: 0.4; transition: opacity 0.6s ease; }
.hm-reel__slide.is-on { opacity: 1; cursor: default; }
.hm-reel__slide video { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.hm-reel__nav { position: absolute; top: 50%; width: 36px; height: 36px; margin-top: -18px; display: grid; place-items: center; border-radius: 50%; color: rgba(0, 0, 0, 0.56); background: rgba(214, 214, 214, 0.64); backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); transition: background-color 0.2s ease, color 0.2s ease; }
.hm-reel__nav:hover { background: rgba(214, 214, 214, 0.7); color: rgba(0, 0, 0, 0.64); }
.hm-reel__nav svg { width: 18px; height: 18px; }
.hm-reel__nav--l { left: calc((100vw - var(--reel-w)) / 2 + 18px); }
.hm-reel__nav--r { right: calc((100vw - var(--reel-w)) / 2 + 18px); }
.hm-reel__dots { display: flex; justify-content: center; align-items: center; gap: 12px; width: max-content; margin: 26px auto 0; padding: 0 20px; height: 56px; border-radius: var(--r-lg); background: rgba(237, 237, 237, 0.7); backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); }
.hm-reel__dots button { width: 8px; height: 8px; border-radius: var(--r-pill); background: rgba(0, 0, 0, 0.42); transition: width 0.5s var(--dj-ease), background-color 0.3s ease; }
.hm-reel__dots button.is-on { width: 48px; background: rgba(0, 0, 0, 0.8); }

/* Общая раскладка плиток: текст в потоке сверху, медиа — отдельной зоной ниже, без наложения */
.hm-ft, .hm-et { position: relative; display: flex; flex-direction: column; align-items: center; overflow: hidden; text-align: center; isolation: isolate; }
.hm-ft__text, .hm-et__text { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; padding: 0 clamp(20px, 3vw, 40px); pointer-events: none; }
.hm-ft__text .dj-links, .hm-et__text .dj-links { pointer-events: auto; }
.hm-ft .dj-tile__title, .hm-et .dj-tile__title { font-size: clamp(26px, 3vw, 40px); }
.hm-ft .dj-tile__sub, .hm-et .dj-tile__sub { font-size: clamp(17px, 1.5vw, 21px); line-height: 1.25; }
.hm-ft .dj-links, .hm-et .dj-links { margin-top: clamp(14px, 1.4vw, 18px); }

/* Доверие: тёмная плитка, текст на сплошном поле, фото — ниже своей зоной */

/* Отрасли: плитки с фото, скругление 18px как у Apple */
.hm-fields__grid { padding: 0 12px 12px; }
.hm-ft { min-height: clamp(520px, 46vw, 680px); padding-top: clamp(36px, 3.6vw, 52px); border-radius: var(--r-md); background: var(--dj-soft, #EDEDED); }
.hm-ft .dj-tile__sub { max-width: 34ch; }
.hm-ft__media { position: relative; flex: 1 1 auto; width: 100%; min-height: clamp(260px, 28vw, 440px); margin-top: clamp(22px, 2.6vw, 36px); }
.hm-ft__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.hm-ft:hover .hm-ft__media img { transform: scale(1.03); }

/* Оборудование: изделие целиком (contain) в зоне под текстом, тень под опорами */
.hm-et { min-height: clamp(540px, 46vw, 680px); padding: clamp(40px, 4vw, 56px) 0 clamp(28px, 3vw, 44px); background: #fff; border-radius: var(--r-lg); box-shadow: none; }
.hm-et .dj-tile__sub { max-width: 30ch; }
.hm-et__media { position: relative; flex: 1 1 auto; width: 100%; min-height: clamp(220px, 24vw, 360px); margin-top: clamp(20px, 2.4vw, 32px); }
.hm-et__fig { position: absolute; inset: 0 7% 4px; container-type: size; }
.hm-et__fig img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: contain; object-position: center bottom; }
/* Ширина тени = ширина вписанного изделия: min(ширина зоны, высота зоны × пропорция кадра) */
.hm-eq-floor { position: absolute; left: 50%; bottom: 0; width: calc(min(100cqw, 100cqh * var(--r, 1.3)) * 0.9); height: clamp(14px, 1.6vw, 24px); transform: translate(-50%, 50%); background: radial-gradient(50% 50% at 50% 50%, rgba(20, 30, 45, 0.24), rgba(20, 30, 45, 0) 72%); }
/* Карточки «Neuheiten»: изделие выходит за верхний край */
/* #65: белые карточки Apple — изделие на белом, без тонированного фона */
.hm-equip { background: #EDEDED; padding-bottom: clamp(48px, 6vw, 80px); }
.hm-equip .dj-tiles { gap: 20px; padding: 0 clamp(16px, 2vw, 24px); }

/* Стандарт качества: bento-карточки Apple */
.hm-lean__h { max-width: 22ch; margin: 8px auto 0; text-wrap: balance; }
.hm-lean__lede { max-width: 50ch; margin-top: 20px; }
.hm-lean__tags { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
.hm-lean__tags span { padding: 4px 11px; border-radius: var(--r-pill); background: #fff; font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; color: var(--dj-ink); }
.hm-lean__photo { margin: clamp(40px, 5vw, 64px) 0 0; aspect-ratio: 21 / 9; overflow: hidden; border-radius: var(--r-md); background: #EDEDED; }
.hm-lean__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 60% 20%; }
.hm-lean__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: clamp(40px, 5vw, 64px); }
.hm-lean__card { padding: 32px 28px 34px; border-radius: var(--r-md); background: #fff; }
.hm-lean__card svg { width: 32px; height: 32px; color: var(--dj-blue); }
.hm-lean__card h3 { margin-top: 20px; font-size: 21px; line-height: 1.19048; font-weight: 600; letter-spacing: 0.011em; }
.hm-lean__card p { margin-top: 8px; font-size: 14px; line-height: 1.42859; letter-spacing: -0.016em; color: var(--dj-muted); }

/* Призыв: финальный блок Apple на тёмном */

@media (max-width: 1068px) {
  .hm-lean__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 734px) {
  .hm-reel { --reel-w: 86vw; --reel-gap: 10px; }
  .hm-reel__slide { aspect-ratio: 4 / 5; border-radius: var(--r-md); }
  .hm-reel__nav { display: none; }
  .hm-reel__dots { height: 44px; padding: 0 16px; gap: 10px; }
  .hm-reel__dots button.is-on { width: 32px; }
  .hm-lean__grid { grid-template-columns: 1fr; }
  .hm-lean__photo { aspect-ratio: 4 / 3; }
  .hm-ft, .hm-et { min-height: 0; }
  .hm-ft__media { min-height: 0; aspect-ratio: 5 / 4; flex: none; }
  .hm-et__media { min-height: 0; aspect-ratio: 4 / 3; flex: none; }
}

/* «Почему нам доверяют»: карточки как «Today at Apple» */
.hm-trust { padding-bottom: clamp(56px, 7vw, 104px); }
.hm-tt-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; width: min(1240px, 92vw); margin: 0 auto; }
.hm-tt { position: relative; display: flex; flex-direction: column; overflow: hidden; border-radius: var(--r-lg); background: #F5F5F7; color: #1A1A1A; text-decoration: none; transition: transform 0.4s var(--dj-ease), box-shadow 0.4s var(--dj-ease); }
.hm-tt:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.25); }
.hm-tt__media { position: relative; display: block; aspect-ratio: 4 / 3; margin: 10px 10px 0; overflow: hidden; border-radius: calc(var(--r-lg) - 8px); background: #fff; }
.hm-tt__media img { width: 100%; height: 100%; object-fit: cover; object-position: center; transition: transform 1s var(--dj-ease); }
.hm-tt:hover .hm-tt__media img { transform: scale(1.04); }
.hm-tt__text { display: grid; gap: 8px; padding: 22px 24px 72px; text-align: left; }
.hm-tt__eyebrow { font-size: 12px; line-height: 1.3; font-weight: 600; letter-spacing: 0.01em; text-transform: uppercase; color: #6E6E73; }
.hm-tt__title { font-size: clamp(21px, 1.7vw, 24px); line-height: 1.17; font-weight: 600; letter-spacing: -0.012em; color: #1A1A1A; }
.hm-tt__sub { font-size: 15px; line-height: 1.45; letter-spacing: -0.012em; color: #3D3D3D; }
.hm-tt__go { position: absolute; right: 18px; bottom: 18px; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; color: #fff; background: #1A1A1A; transition: transform 0.3s var(--dj-ease), background-color 0.3s ease; }
.hm-tt__go svg { width: 16px; height: 16px; }
.hm-tt:hover .hm-tt__go { transform: scale(1.08); background: #002366; }
.hm-tt:focus-visible { outline: 3px solid #002366; outline-offset: 3px; }
@media (max-width: 1068px) { .hm-tt-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 734px) { .hm-tt-grid { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 78%; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; width: 100%; padding: 0 16px; } .hm-tt-grid::-webkit-scrollbar { display: none; } .hm-tt { scroll-snap-align: start; } }

/* «Решения по отраслям»: карточки по образцу владельца */
.hm-fields__grid { gap: 20px; padding: 0 clamp(16px, 2vw, 24px) 24px; }
.hm-sc { position: relative; aspect-ratio: 1 / 1; overflow: hidden; border-radius: var(--r-lg); background: #dbe9f8; isolation: isolate; box-shadow: var(--sh-2); transition: transform 0.6s var(--dj-ease), box-shadow 0.6s var(--dj-ease); }
.hm-sc:hover { transform: translateY(-4px); box-shadow: var(--sh-3); }
.hm-sc__img { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; object-fit: cover; object-position: center bottom; transition: transform 1.4s var(--dj-ease); }
.hm-sc:hover .hm-sc__img { transform: scale(1.03); }
.hm-sc__hit { position: absolute; inset: 0; z-index: 0; }
.hm-sc__text { position: relative; z-index: 1; display: grid; justify-items: start; gap: 10px; padding: clamp(28px, 3.6vw, 52px) clamp(26px, 3.6vw, 52px) 0; pointer-events: none; }
.hm-sc__title { margin: 0; max-width: 12em; font-size: clamp(28px, 3.3vw, 48px); line-height: 1.06; font-weight: 700; letter-spacing: -0.02em; color: #1A1A1A; text-wrap: balance; }
.hm-sc__sub { margin: 0; max-width: 24ch; font-size: clamp(17px, 1.55vw, 22px); line-height: 1.3; letter-spacing: -0.012em; color: #2b2f36; }
.hm-sc__act { display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(10px, 1.4vw, 18px); pointer-events: auto; }
.hm-sc__btn { display: inline-flex; align-items: center; gap: 8px; min-height: 48px; padding: 0 28px; border-radius: var(--r-pill); font-size: 17px; letter-spacing: -0.016em; color: #fff; background: #002366; box-shadow: var(--sh-2); transition: background-color 0.25s ease, transform 0.25s ease; }
.hm-sc__btn:hover { background: #002366; }
.hm-sc__btn i { font-style: normal; transition: transform 0.25s ease; }
.hm-sc__btn:hover i { transform: translateX(3px); }
.hm-sc__btn--line { color: #002366; background: rgba(255, 255, 255, 0.55); box-shadow: inset 0 0 0 1.5px #002366; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.hm-sc__btn--line:hover { background: rgba(255, 255, 255, 0.85); }
@media (max-width: 734px) {
  .hm-fields__grid { gap: 14px; }
  .hm-sc { aspect-ratio: 4 / 5; border-radius: var(--r-lg); }
  .hm-sc__btn { min-height: 44px; padding: 0 20px; font-size: 16px; }
  .dj-btn { min-height: 44px; }
  .dj-more { min-height: 44px; align-items: center; }
  .hm-reel__nav { width: 44px; height: 44px; margin-top: -22px; }
}
</style>

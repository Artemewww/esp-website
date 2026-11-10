<template>
  <div ref="root" class="hm">
    <!-- 1. Видео-слайдер объектов: та же лента роликов, что на боевом сайте -->
    <HomeObjectsSlider :items="heroItems" label="Объекты ESP" />

    <!-- 2. Ключевые метрики -->
    <section id="metrics" ref="metricsEl" class="dj-sec hm-metrics">
      <div class="dj-wrap">
        <ul class="dj-stats">
          <li v-for="m in metrics" :key="m.label" class="dj-reveal">
            <b>{{ m.display.toLocaleString('ru-RU') }}{{ m.suffix }}</b>
            <span>{{ m.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 3. Бренд-высказывание: фирменный «Лист» с аэрофото -->
    <BrandStatement />

    <!-- 4. Почему нам доверяют лидеры: четыре плитки 2×2, как у DJI -->
    <section class="hm-trust" aria-labelledby="trust-h">
      <div class="dj-wrap dj-center hm-head dj-reveal">
        <h2 id="trust-h" class="dj-h2">Почему нам доверяют лидеры</h2>
      </div>
      <div class="dj-tiles dj-tiles--2">
        <!-- Текст на сплошном поле сверху, фото ниже отдельной зоной: текст не тонет в кадре -->
        <div v-for="f in trustFactors" :key="f.title" class="hm-tt dj-reveal">
          <NuxtLink :to="f.to" class="dj-tile__hit" :aria-label="f.title" tabindex="-1" />
          <div class="hm-tt__text">
            <span class="dj-tile__eyebrow">{{ f.caption }}</span>
            <h3 class="dj-tile__title">{{ f.title }}</h3>
            <p class="dj-tile__sub">{{ f.text }}</p>
            <div class="dj-links">
              <NuxtLink :to="f.to" class="dj-btn dj-btn--apple">Подробнее</NuxtLink>
              <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--line-d">Обсудить проект</NuxtLink>
            </div>
          </div>
          <span class="hm-tt__media"><img :src="f.image" :alt="f.alt" loading="lazy" decoding="async" /></span>
        </div>
      </div>
    </section>

    <!-- 5. Технологии — цифровой двойник (скан → BIM → эксплуатация) -->
    <HomeTechShowcase />

    <!-- 6. Полный цикл: карусель роликов с объектов -->
    <section class="hm-reel" aria-labelledby="reel-h">
      <div class="dj-wrap dj-center hm-head dj-reveal">
        <h2 id="reel-h" class="dj-h2">Полный цикл решений<br />для очистки воды</h2>
      </div>
      <div class="hm-reel__stage" @pointerdown="dragStart" @pointerup="dragEnd" @pointercancel="dragEnd" @wheel="onReelWheel">
        <div class="hm-reel__track" :style="{ transform: `translateX(calc(${-reel} * (var(--reel-w) + var(--reel-gap))))` }">
          <div v-for="(v, i) in reelVideos" :key="v" class="hm-reel__slide" :class="{ 'is-on': i === reel }" @click="reel = i">
            <video :ref="(el) => (reelEls[i] = el)" muted loop playsinline preload="metadata" :poster="reelPoster(v)">
              <source :src="v" type="video/mp4" />
            </video>
          </div>
        </div>
        <button class="hm-reel__nav hm-reel__nav--l" aria-label="Предыдущий ролик" @click="reelGo(-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 6l-6 6 6 6" /></svg></button>
        <button class="hm-reel__nav hm-reel__nav--r" aria-label="Следующий ролик" @click="reelGo(1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6l6 6-6 6" /></svg></button>
      </div>
      <div class="hm-reel__dots">
        <button v-for="(v, i) in reelVideos" :key="v" :class="{ 'is-on': i === reel }" :aria-label="`Ролик ${i + 1}`" @click="reel = i" />
      </div>
    </section>

    <!-- 7. Решения для бизнеса: отрасли высокими карточками -->
    <section class="hm-fields" aria-labelledby="fields-h">
      <div class="dj-wrap dj-center hm-head dj-reveal">
        <h2 id="fields-h" class="dj-h2">Решения для бизнеса</h2>
        <div class="dj-links"><NuxtLink to="/solutions" class="dj-more">Все отрасли</NuxtLink></div>
      </div>
      <div class="dj-tiles dj-tiles--2 hm-fields__grid">
        <div v-for="s in solutions" :key="s.slug" class="hm-ft dj-reveal">
          <NuxtLink :to="`/solutions/${s.slug}`" class="dj-tile__hit" :aria-label="s.title" tabindex="-1" />
          <div class="hm-ft__text">
            <h3 class="dj-tile__title">{{ s.title }}</h3>
            <p class="dj-tile__sub">{{ s.short }}</p>
            <div class="dj-links">
              <NuxtLink :to="`/solutions/${s.slug}`" class="dj-btn">Подробнее</NuxtLink>
              <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--line">Обсудить проект</NuxtLink>
            </div>
          </div>
          <span class="hm-ft__media"><img :src="FIELD_COVERS[s.slug] || s.cover" :alt="s.title" loading="lazy" decoding="async" /></span>
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
              <NuxtLink :to="`/equipment/${e.slug}`" class="dj-btn">Подробнее</NuxtLink>
              <NuxtLink to="/equipment" class="dj-btn dj-btn--line">Весь каталог</NuxtLink>
            </div>
          </div>
          <span class="hm-et__media">
            <span class="hm-eq-beam" />
            <span class="hm-et__fig">
              <span class="hm-eq-floor" />
              <img :src="cutOf(e)" :alt="e.name" loading="lazy" decoding="async" @load="setRatio" />
            </span>
          </span>
        </div>
      </div>

      <!-- Весь ряд оборудования: карточки, из которых изделие выходит за верхний край, как «Neuheiten» у DJI -->
      <div class="hm-novs">
        <NuxtLink v-for="(e, i) in renderedEquipment" :key="e.slug" :to="`/equipment/${e.slug}`" class="hm-nov dj-reveal" :style="{ '--tone': tones[i % tones.length] }">
          <img class="hm-nov__img" :src="cutOf(e)" :alt="e.name" loading="lazy" decoding="async" />
          <span class="hm-nov__body">
            <b>{{ e.name }}</b>
            <small>{{ e.desc }}</small>
            <span class="hm-nov__foot"><span>Каталог ESP</span><span class="hm-nov__btn">Подробнее</span></span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- 10. Стандарт качества: СТБ 2672-2025 -->
    <section class="dj-sec dj-sec--soft hm-lean" aria-labelledby="lean-h">
      <div class="dj-wrap">
        <div class="dj-center dj-reveal">
          <span class="dj-eyebrow">Стандарт качества</span>
          <h2 id="lean-h" class="dj-h2 hm-lean__h">Система бережливого менеджмента по СТБ 2672-2025</h2>
          <p class="dj-lede hm-lean__lede">
            Мы придерживаемся принципов бережливого производства и непрерывного совершенствования. Это значит: минимум потерь,
            максимум ценности для заказчика и абсолютная прозрачность на каждом этапе — от проектирования до эксплуатации.
          </p>
          <div class="hm-lean__tags"><span>#кайдзен</span><span>#5S</span><span>#TQM</span><span>#JIT</span></div>
        </div>
        <figure class="hm-lean__photo dj-reveal">
          <img :src="LEAN_IMAGE" alt="Сварка узла оборудования в цехе ESP" loading="lazy" decoding="async" />
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

    <!-- 11. Призыв к сотрудничеству -->
    <section class="hm-cta">
      <video class="hm-cta__bg" src="/videos/hero/about-water.mp4" poster="/videos/hero/about-water.jpg" muted loop playsinline autoplay preload="none" />
      <div class="dj-wrap dj-center hm-cta__in dj-reveal">
        <span class="dj-eyebrow">Следующий шаг</span>
        <h2 class="dj-h1">Готовы к сотрудничеству?</h2>
        <p class="dj-lede">
          Обсудим Ваш проект, подготовим индивидуальное решение и покажем, как опыт и передовые технологии в руках наших
          экспертов приводят к кристально чистому результату.
        </p>
        <div class="dj-links hm-cta__act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--apple">Обсудить проект</NuxtLink>
          <NuxtLink to="/contacts" class="dj-btn dj-btn--line-d">Запросить презентацию</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import BrandStatement from '~/components/ui/BrandStatement.vue'
import { solutions, renderedEquipment } from '~/composables/useSiteNav'
import { useReveal } from '~/composables/useReveal'
import { slidesFromHero } from '~/composables/useObjectSlides'
import heroSlideDefaults from '~~/content/defaults/hero-slides.json'

const { data: heroData } = await useFetch('/api/site-content/hero-slides', { default: () => heroSlideDefaults })
const heroItems = computed(() => slidesFromHero(Array.isArray(heroData.value) && heroData.value.length ? heroData.value : heroSlideDefaults))

useSeoMeta({
  title: 'ESP — ЭкоСервисПроект | Очистные сооружения под ключ в Беларуси',
  description: 'Мы архитекторы технологий очистки воды. 28 лет опыта, 2000+ реализованных проектов: проектирование, производство оборудования, строительство и ввод в эксплуатацию очистных сооружений.'
})

const root = ref(null)
useReveal(root)

// ── Метрики со счётчиком
const metrics = ref([
  { label: 'Реализовано проектов', value: 2000, suffix: '+', display: 0 },
  { label: 'Экспертов в команде', value: 100, suffix: '+', display: 0 },
  { label: 'Лет опыта', value: 28, suffix: '', display: 0 }
])
const metricsEl = ref(null)
let metricsIo = null
const countUp = () => {
  const t0 = performance.now()
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 1600)
    const e = 1 - Math.pow(1 - k, 3)
    metrics.value.forEach((m) => { m.display = Math.round(m.value * e) })
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// ── Фото плиток — меняются только здесь
// «Почему нам доверяют лидеры»: по порядку USBF, Инжиниринг, Производство, Ввод в эксплуатацию
const TRUST_IMAGES = [
  '/images/home/covers/usbf.webp',
  '/images/real4k/cad-screen.webp',
  '/images/real4k/laser-head.webp',
  '/images/real4k/aerial-blue-roofs.webp'
]
// «Решения для бизнеса»: обложка по slug отрасли (пусто — берётся cover из useSiteNav)
const FIELD_COVERS = {
  vodokanaly: '/images/home/covers/vodokanaly.webp',
  agrokompleksy: '/images/home/covers/agro.webp',
  'pishchevaya-promyshlennost': '/images/home/covers/food.webp',
  'chastnye-i-kommercheskie': '/images/home/covers/homes.webp'
}
// «Система бережливого менеджмента по СТБ 2672-2025»: фото на всю ширину блока
const LEAN_IMAGE = '/images/home/covers/lean.webp'

const trustFactors = [
  { title: 'Решения на базе USBF', caption: 'Технология USBF', image: TRUST_IMAGES[0], alt: 'Решения на базе технологии USBF', to: '/technologies', text: 'Внедряем технологию USBF под задачи конкретного объекта. Опираемся на 28 лет практики в биологической очистке сточных вод.' },
  { title: 'Инжиниринг', caption: 'Проектирование', image: TRUST_IMAGES[1], alt: 'Инжиниринг — проектирование и подготовка проекта', to: '/services', text: 'Проектируем будущее с точностью до миллиметра.' },
  { title: 'Производство', caption: 'Собственный цех', image: TRUST_IMAGES[2], alt: 'Производство оборудования в собственном цехе ESP', to: '/equipment', text: 'Точность в каждой детали. Качество в каждом узле.' },
  { title: 'Ввод в эксплуатацию', caption: 'Пусконаладка и контроль', image: TRUST_IMAGES[3], alt: 'Ввод объекта в эксплуатацию — пусконаладка и контроль', to: '/services', text: 'Выводим объект на проектные показатели. 100% результата и полная прозрачность всех процессов — наш внутренний стандарт.' }
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

const cutOf = (e) => e.photo.replace('/images/equipment/', '/images/equipment/cut/')
// Пропорции кадра изделия — по ним тень под опорами подстраивается под ширину изделия
const setRatio = (ev) => { const im = ev.target; if (im.naturalWidth) im.parentNode.style.setProperty('--r', (im.naturalWidth / im.naturalHeight).toFixed(3)) }
const tones = ['#9aa8b6', '#7f93a8', '#a3b0bd', '#8696a7']
const equipShow = renderedEquipment.filter((e) => ['flotation-units', 'filter-press', 'polymer-dosing-station', 'rotary-drum-sieve'].includes(e.slug))

const leanPrinciples = [
  { title: 'Устранение потерь', text: 'Исключаем перепроизводство, ожидания и лишние перемещения в каждом процессе.', icon: 'M4 12h10M4 6h16M4 18h6M17 15l3 3-3 3' },
  { title: 'Фокус на людях', text: 'Развиваем компетенции сотрудников и создаём культуру постоянного улучшения.', icon: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.5M18 14a6.5 6.5 0 013.5 6' },
  { title: 'Встроенное качество', text: 'Качество закладываем на каждом этапе, а не исправляем в конце. Контроль без компромиссов.', icon: 'M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6L12 3zM8.5 12l2.5 2.5 4.5-5' },
  { title: 'Непрерывное улучшение', text: 'Постоянно совершенствуем процессы на основе данных, обратной связи и анализа.', icon: 'M20 12a8 8 0 11-2.34-5.66M20 4v4.5h-4.5' }
]

onMounted(() => {
  root.value?.querySelectorAll('.hm-et__fig img').forEach((im) => { if (im.complete) setRatio({ target: im }) })
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
.hm-metrics { padding: clamp(64px, 8vw, 104px) 0; }

/* Карусель: галерея Apple — активный кадр, соседи приглушены, точки в капсуле */
.hm-reel { padding-bottom: clamp(48px, 6vw, 80px); --reel-w: min(76vw, 1180px); --reel-gap: 20px; }
.hm-reel__stage { position: relative; overflow: hidden; touch-action: pan-y; }
.hm-reel__track { display: flex; gap: var(--reel-gap); padding-left: calc((100vw - var(--reel-w)) / 2); transition: transform 1s var(--dj-ease); }
.hm-reel__slide { flex: 0 0 var(--reel-w); aspect-ratio: 16 / 9; overflow: hidden; border-radius: 28px; background: #000; cursor: pointer; opacity: 0.4; transition: opacity 0.6s ease; }
.hm-reel__slide.is-on { opacity: 1; cursor: default; }
.hm-reel__slide video { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.hm-reel__nav { position: absolute; top: 50%; width: 36px; height: 36px; margin-top: -18px; display: grid; place-items: center; border-radius: 50%; color: rgba(0, 0, 0, 0.56); background: rgba(210, 210, 215, 0.64); backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); transition: background-color 0.2s ease, color 0.2s ease; }
.hm-reel__nav:hover { background: rgba(223, 223, 227, 0.7); color: rgba(0, 0, 0, 0.64); }
.hm-reel__nav svg { width: 18px; height: 18px; }
.hm-reel__nav--l { left: calc((100vw - var(--reel-w)) / 2 + 18px); }
.hm-reel__nav--r { right: calc((100vw - var(--reel-w)) / 2 + 18px); }
.hm-reel__dots { display: flex; justify-content: center; align-items: center; gap: 12px; width: max-content; margin: 26px auto 0; padding: 0 20px; height: 56px; border-radius: 28px; background: rgba(232, 232, 237, 0.7); backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); }
.hm-reel__dots button { width: 8px; height: 8px; border-radius: 999px; background: rgba(0, 0, 0, 0.42); transition: width 0.5s var(--dj-ease), background-color 0.3s ease; }
.hm-reel__dots button.is-on { width: 48px; background: rgba(0, 0, 0, 0.8); }

/* Общая раскладка плиток: текст в потоке сверху, медиа — отдельной зоной ниже, без наложения */
.hm-tt, .hm-ft, .hm-et { position: relative; display: flex; flex-direction: column; align-items: center; overflow: hidden; text-align: center; isolation: isolate; }
.hm-tt__text, .hm-ft__text, .hm-et__text { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; padding: 0 clamp(20px, 3vw, 40px); pointer-events: none; }
.hm-tt__text .dj-links, .hm-ft__text .dj-links, .hm-et__text .dj-links { pointer-events: auto; }
.hm-tt .dj-tile__title, .hm-ft .dj-tile__title, .hm-et .dj-tile__title { font-size: clamp(26px, 3vw, 40px); }
.hm-tt .dj-tile__sub, .hm-ft .dj-tile__sub, .hm-et .dj-tile__sub { font-size: clamp(17px, 1.5vw, 21px); line-height: 1.25; }
.hm-tt .dj-links, .hm-ft .dj-links, .hm-et .dj-links { margin-top: clamp(14px, 1.4vw, 18px); }

/* Доверие: тёмная плитка, текст на сплошном поле, фото — ниже своей зоной */
.hm-tt { min-height: clamp(560px, 50vw, 740px); padding-top: clamp(40px, 4vw, 56px); background: #000; color: #f5f5f7; }
.hm-tt .dj-tile__eyebrow { color: rgba(245, 245, 247, 0.72); }
.hm-tt .dj-tile__title, .hm-tt .dj-tile__sub { color: #f5f5f7; }
.hm-tt .dj-tile__sub { max-width: 34ch; }
.hm-tt__media { position: relative; flex: 1 1 auto; width: 100%; min-height: clamp(220px, 24vw, 380px); margin-top: clamp(24px, 3vw, 40px); }
.hm-tt__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hm-tt__media::after { content: ''; position: absolute; inset: 0 0 auto; height: 48px; background: linear-gradient(#000, rgba(0, 0, 0, 0)); }

/* Отрасли: плитки с фото, скругление 18px как у Apple */
.hm-fields__grid { padding: 0 12px 12px; }
.hm-ft { min-height: clamp(520px, 46vw, 680px); padding-top: clamp(36px, 3.6vw, 52px); border-radius: 18px; background: var(--dj-soft, #f5f5f7); }
.hm-ft .dj-tile__sub { max-width: 34ch; }
.hm-ft__media { position: relative; flex: 1 1 auto; width: 100%; min-height: clamp(260px, 28vw, 440px); margin-top: clamp(22px, 2.6vw, 36px); }
.hm-ft__media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.hm-ft:hover .hm-ft__media img { transform: scale(1.03); }

/* Оборудование: изделие целиком (contain) в зоне под текстом, тень под опорами */
.hm-et { min-height: clamp(540px, 46vw, 680px); padding: clamp(40px, 4vw, 56px) 0 clamp(28px, 3vw, 44px); background: var(--dj-soft, #f5f5f7); }
.hm-et .dj-tile__sub { max-width: 30ch; }
.hm-et__media { position: relative; flex: 1 1 auto; width: 100%; min-height: clamp(220px, 24vw, 360px); margin-top: clamp(20px, 2.4vw, 32px); }
.hm-et__fig { position: absolute; inset: 0 9% 14px; container-type: size; }
.hm-et__fig img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: contain; object-position: center bottom; filter: drop-shadow(0 6px 6px rgba(20, 30, 45, 0.16)); }
.hm-eq-beam { position: absolute; top: -40%; left: 18%; width: 30%; height: 140%; background: linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0)); filter: blur(24px); transform: skewX(-16deg); pointer-events: none; }
/* Ширина тени = ширина вписанного изделия: min(ширина зоны, высота зоны × пропорция кадра) */
.hm-eq-floor { position: absolute; left: 50%; bottom: 0; width: calc(min(100cqw, 100cqh * var(--r, 1.3)) * 0.9); height: clamp(14px, 1.6vw, 24px); transform: translate(-50%, 50%); background: radial-gradient(50% 50% at 50% 50%, rgba(20, 30, 45, 0.24), rgba(20, 30, 45, 0) 72%); }
/* Карточки «Neuheiten»: изделие выходит за верхний край */
.hm-novs { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(300px, 1fr); gap: 20px; overflow-x: auto; padding: 120px max(22px, calc((100vw - 1200px) / 2)) 24px; scroll-snap-type: x mandatory; scrollbar-width: none; }
.hm-novs::-webkit-scrollbar { display: none; }
.hm-nov { position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-height: 380px; border-radius: 18px; scroll-snap-align: start; color: #fff; background: linear-gradient(180deg, color-mix(in srgb, var(--tone) 60%, #fff) 0%, var(--tone) 55%, color-mix(in srgb, var(--tone) 70%, #1d2733) 100%); box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s ease; }
.hm-nov:hover { box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.16); }
.hm-nov__img { position: absolute; left: 50%; top: -96px; width: 82%; height: 250px; object-fit: contain; object-position: center bottom; transform: translateX(-50%); filter: drop-shadow(0 20px 22px rgba(10, 20, 35, 0.28)); transition: transform 0.7s var(--dj-ease); }
.hm-nov:hover .hm-nov__img { transform: translateX(-50%) translateY(-8px) scale(1.03); }
.hm-nov__body { display: grid; gap: 6px; padding: 0 28px 26px; }
.hm-nov__body b { font-size: 24px; line-height: 1.16667; font-weight: 600; letter-spacing: 0.009em; }
.hm-nov__body small { font-size: 14px; line-height: 1.42859; letter-spacing: -0.016em; color: rgba(255, 255, 255, 0.82); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.hm-nov__foot { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; font-size: 12px; letter-spacing: -0.01em; color: rgba(255, 255, 255, 0.82); }
.hm-nov__btn { padding: 4px 11px; border-radius: 980px; background: #fff; color: var(--dj-ink); font-size: 12px; line-height: 1.33337; }

/* Стандарт качества: bento-карточки Apple */
.hm-lean__h { max-width: 22ch; margin: 8px auto 0; text-wrap: balance; }
.hm-lean__lede { max-width: 50ch; margin-top: 20px; }
.hm-lean__tags { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
.hm-lean__tags span { padding: 4px 11px; border-radius: 980px; background: #fff; font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; color: var(--dj-ink); }
.hm-lean__photo { margin: clamp(40px, 5vw, 64px) 0 0; aspect-ratio: 21 / 9; overflow: hidden; border-radius: 18px; background: #e8e8ed; }
.hm-lean__photo img { width: 100%; height: 100%; object-fit: cover; }
.hm-lean__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: clamp(40px, 5vw, 64px); }
.hm-lean__card { padding: 32px 28px 34px; border-radius: 18px; background: #fff; }
.hm-lean__card svg { width: 32px; height: 32px; color: var(--dj-blue); }
.hm-lean__card h3 { margin-top: 20px; font-size: 21px; line-height: 1.19048; font-weight: 600; letter-spacing: 0.011em; }
.hm-lean__card p { margin-top: 8px; font-size: 14px; line-height: 1.42859; letter-spacing: -0.016em; color: var(--dj-muted); }

/* Призыв: финальный блок Apple на тёмном */
.hm-cta { position: relative; overflow: hidden; padding: clamp(104px, 14vw, 180px) 0; background: #000; color: #f5f5f7; }
.hm-cta__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.5; }
.hm-cta__in { position: relative; }
.hm-cta .dj-eyebrow { color: #f5f5f7; }
.hm-cta .dj-h1 { margin-top: 8px; color: #f5f5f7; text-wrap: balance; }
.hm-cta .dj-lede { max-width: 46ch; margin-top: 20px; color: rgba(245, 245, 247, 0.86); }
.hm-cta__act { margin-top: 32px; gap: 14px; }

@media (max-width: 1068px) {
  .hm-lean__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 734px) {
  .hm-reel { --reel-w: 86vw; --reel-gap: 10px; }
  .hm-reel__slide { aspect-ratio: 4 / 5; border-radius: 18px; }
  .hm-reel__nav { display: none; }
  .hm-reel__dots { height: 44px; padding: 0 16px; gap: 10px; }
  .hm-reel__dots button.is-on { width: 32px; }
  .hm-lean__grid { grid-template-columns: 1fr; }
  .hm-lean__photo { aspect-ratio: 4 / 3; }
  .hm-tt, .hm-ft, .hm-et { min-height: 0; }
  .hm-tt__media { min-height: 0; aspect-ratio: 4 / 3; flex: none; }
  .hm-ft__media { min-height: 0; aspect-ratio: 5 / 4; flex: none; }
  .hm-et__media { min-height: 0; aspect-ratio: 4 / 3; flex: none; }
}
</style>

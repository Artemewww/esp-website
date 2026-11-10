<template>
  <div ref="root" class="hm">
    <!-- 1. Видео-слайдер объектов: та же лента роликов, что на боевом сайте -->
    <HomeDjiHero />

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
        <NuxtLink v-for="f in trustFactors" :key="f.title" :to="f.to" class="dj-tile dj-tile--photo dj-reveal">
          <span class="dj-tile__eyebrow">{{ f.caption }}</span>
          <h3 class="dj-tile__title">{{ f.title }}</h3>
          <p class="dj-tile__sub">{{ f.text }}</p>
          <span class="dj-links"><span class="dj-more dj-more--light">Подробнее</span></span>
          <span class="dj-tile__media"><img :src="f.image" :alt="f.alt" loading="lazy" decoding="async" /></span>
        </NuxtLink>
      </div>
    </section>

    <!-- 5. Технологии — цифровой двойник (скан → BIM → эксплуатация) -->
    <HomeTechShowcase />

    <!-- 6. Полный цикл: карусель роликов с объектов -->
    <section class="hm-reel" aria-labelledby="reel-h">
      <div class="dj-wrap dj-center hm-head dj-reveal">
        <h2 id="reel-h" class="dj-h2">Полный цикл решений<br />для очистки воды</h2>
      </div>
      <div class="hm-reel__stage" @pointerdown="dragStart" @pointerup="dragEnd" @pointercancel="dragEnd">
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
      <div class="dj-tiles hm-fields__grid">
        <NuxtLink v-for="s in solutions" :key="s.slug" :to="`/solutions/${s.slug}`" class="dj-tile dj-tile--field dj-reveal">
          <h3 class="dj-tile__title">{{ s.title }}</h3>
          <p class="dj-tile__sub">{{ s.short }}</p>
          <span class="dj-links"><span class="dj-more dj-more--light">Подробнее</span></span>
          <span class="dj-tile__media"><img :src="s.cover" :alt="s.title" loading="lazy" decoding="async" /></span>
        </NuxtLink>
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
        <NuxtLink v-for="e in equipShow" :key="e.slug" :to="`/equipment/${e.slug}`" class="dj-tile dj-reveal">
          <h3 class="dj-tile__title">{{ e.name }}</h3>
          <p class="dj-tile__sub">{{ e.desc }}</p>
          <span class="dj-links"><span class="dj-more">Подробнее</span></span>
          <span class="dj-tile__media dj-tile__media--contain"><img :src="e.photo" :alt="e.name" loading="lazy" decoding="async" /></span>
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
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--white dj-btn--lg">Обсудить проект</NuxtLink>
          <NuxtLink to="/contacts" class="dj-btn dj-btn--glass dj-btn--lg">Запросить презентацию</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import BrandStatement from '~/components/ui/BrandStatement.vue'
import { solutions, renderedEquipment } from '~/composables/useSiteNav'
import { useReveal } from '~/composables/useReveal'

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

const trustFactors = [
  { title: 'Решения на базе USBF', caption: 'Технология USBF', image: '/images/real4k/aerial-octagons.webp', alt: 'Решения на базе технологии USBF', to: '/technologies', text: 'Внедряем технологию USBF под задачи конкретного объекта. Опираемся на 28 лет практики в биологической очистке сточных вод.' },
  { title: 'Инжиниринг', caption: 'Проектирование', image: '/images/real4k/cad-screen.webp', alt: 'Инжиниринг — проектирование и подготовка проекта', to: '/services', text: 'Проектируем будущее с точностью до миллиметра.' },
  { title: 'Производство', caption: 'Собственный цех', image: '/images/real4k/laser-head.webp', alt: 'Производство оборудования в собственном цехе ESP', to: '/equipment', text: 'Точность в каждой детали. Качество в каждом узле.' },
  { title: 'Ввод в эксплуатацию', caption: 'Пусконаладка и контроль', image: '/images/real4k/aerial-blue-roofs.webp', alt: 'Ввод объекта в эксплуатацию — пусконаладка и контроль', to: '/services', text: 'Выводим объект на проектные показатели. 100% результата и полная прозрачность всех процессов — наш внутренний стандарт.' }
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
const syncReel = () => reelEls.forEach((v, i) => { if (!v) return; if (i === reel.value) v.play().catch(() => {}); else v.pause() })
watch(reel, syncReel)
let reelIo = null

const equipShow = renderedEquipment.filter((e) => ['flotation-units', 'filter-press', 'polymer-dosing-station', 'rotary-drum-sieve'].includes(e.slug))

const leanPrinciples = [
  { title: 'Устранение потерь', text: 'Исключаем перепроизводство, ожидания и лишние перемещения в каждом процессе.', icon: 'M4 12h10M4 6h16M4 18h6M17 15l3 3-3 3' },
  { title: 'Фокус на людях', text: 'Развиваем компетенции сотрудников и создаём культуру постоянного улучшения.', icon: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 6.5M18 14a6.5 6.5 0 013.5 6' },
  { title: 'Встроенное качество', text: 'Качество закладываем на каждом этапе, а не исправляем в конце. Контроль без компромиссов.', icon: 'M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6L12 3zM8.5 12l2.5 2.5 4.5-5' },
  { title: 'Непрерывное улучшение', text: 'Постоянно совершенствуем процессы на основе данных, обратной связи и анализа.', icon: 'M20 12a8 8 0 11-2.34-5.66M20 4v4.5h-4.5' }
]

onMounted(() => {
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
.hm-head { padding: clamp(56px, 7vw, 96px) 24px clamp(24px, 3vw, 36px); }
.hm-metrics { padding: clamp(56px, 7vw, 88px) 0; }

/* Карусель */
.hm-reel { padding-bottom: clamp(40px, 5vw, 64px); --reel-w: min(76vw, 1180px); --reel-gap: 16px; }
.hm-reel__stage { position: relative; overflow: hidden; touch-action: pan-y; }
.hm-reel__track { display: flex; gap: var(--reel-gap); padding-left: calc((100vw - var(--reel-w)) / 2); transition: transform 0.9s var(--dj-ease); }
.hm-reel__slide { flex: 0 0 var(--reel-w); aspect-ratio: 16 / 9; overflow: hidden; background: #0b0d10; cursor: pointer; opacity: 0.45; transition: opacity 0.6s ease; }
.hm-reel__slide.is-on { opacity: 1; cursor: default; }
.hm-reel__slide video { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.hm-reel__nav { position: absolute; top: 50%; width: 44px; height: 44px; margin-top: -22px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: rgba(0, 0, 0, 0.35); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: background-color 0.2s ease; }
.hm-reel__nav:hover { background: rgba(0, 0, 0, 0.55); }
.hm-reel__nav svg { width: 20px; height: 20px; }
.hm-reel__nav--l { left: calc((100vw - var(--reel-w)) / 2 + 16px); }
.hm-reel__nav--r { right: calc((100vw - var(--reel-w)) / 2 + 16px); }
.hm-reel__dots { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
.hm-reel__dots button { width: 8px; height: 8px; border-radius: 999px; background: #c9cdd1; transition: width 0.4s var(--dj-ease), background-color 0.3s ease; }
.hm-reel__dots button.is-on { width: 24px; background: var(--dj-ink); }

/* Отрасли — четыре карточки в ряд */
.hm-fields__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.hm-fields__grid .dj-tile__title { font-size: clamp(22px, 2vw, 30px); }

/* Стандарт качества */
.hm-lean__h { max-width: 24ch; margin: 8px auto 0; }
.hm-lean__lede { max-width: 62ch; margin-top: 16px; }
.hm-lean__tags { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.hm-lean__tags span { padding: 6px 14px; border-radius: 999px; background: #fff; font-size: 13px; color: var(--dj-text); }
.hm-lean__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: clamp(36px, 5vw, 56px); }
.hm-lean__card { padding: 28px 24px 30px; background: #fff; }
.hm-lean__card svg { width: 32px; height: 32px; color: var(--dj-blue); }
.hm-lean__card h3 { margin-top: 18px; font-size: 18px; font-weight: 600; }
.hm-lean__card p { margin-top: 8px; font-size: 14px; line-height: 1.55; color: var(--dj-muted); }

/* Призыв */
.hm-cta { position: relative; overflow: hidden; padding: clamp(96px, 14vw, 180px) 0; background: #0b0d10; color: #fff; }
.hm-cta__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.55; }
.hm-cta__in { position: relative; }
.hm-cta .dj-eyebrow { color: rgba(255, 255, 255, 0.72); }
.hm-cta .dj-h1 { margin-top: 10px; color: #fff; }
.hm-cta .dj-lede { max-width: 60ch; margin-top: 16px; color: rgba(255, 255, 255, 0.82); }
.hm-cta__act { margin-top: 28px; gap: 12px; }

@media (max-width: 1023px) {
  .hm-fields__grid { grid-template-columns: 1fr 1fr; }
  .hm-lean__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 767px) {
  .hm-reel { --reel-w: 86vw; --reel-gap: 10px; }
  .hm-reel__slide { aspect-ratio: 4 / 5; }
  .hm-reel__nav { display: none; }
  .hm-fields__grid { grid-template-columns: 1fr; }
  .hm-lean__grid { grid-template-columns: 1fr; }
}
</style>

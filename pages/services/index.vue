<template>
  <!-- Услуги в подаче обзорной страницы продукта DJI: кадр на первом экране,
       плитки услуг, этапы «под ключ» горизонтальной шкалой, призыв. -->
  <div ref="root" class="dj sv">


    <!-- Линейка услуг: фото-аккордеон из 9 панелей -->
    <section id="services" class="sv-anchor sv-services">
      <h1 class="sv-sr">Услуги ESP — от консультации до пусконаладки: полный цикл работ по очистным сооружениям</h1>
      <ServicesShelf :items="servicesList" />
    </section>

    <!-- Turnkey Process: 7 шагов в подаче «глава» Apple -->
    <section id="process" class="dj-sec dj-sec--soft sv-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <span class="dj-eyebrow">Комплексный подход под ключ</span>
        <h2 class="dj-h2 sv-h2">От замысла до запуска</h2>
        <p class="dj-lede sv-lede">
          Мы не поставляем разрозненное оборудование. Мы проектируем, производим, монтируем и передаём работающие очистные сооружения с гарантией результата и последующим обучением персонала. Семь этапов от проектирования до пусконаладки.
        </p>
      </div>

      <TurnkeyChapter :steps="turnkeyStages" />
    </section>

    <!-- Сроки: ориентировочные типовые диапазоны по этапам -->
    <section id="timing" class="dj-sec sv-anchor dj-bp dj-bp--grain">
      <div class="dj-wrap dj-reveal">
        <span class="dj-eyebrow">Сроки</span>
        <h2 class="dj-h2 sv-h2 dj-ink">Сколько времени занимает проект</h2>
        <p class="dj-lede sv-lede">Типовые диапазоны для станций очистки от 50 до 20 000 м³/сут. Ориентировочно, точный график — после обследования объекта.</p>
        <!-- Итог одной строкой: сколько весь путь для малого и для крупного объекта -->
        <div class="gt-sum">
          <div class="gt-sum__i"><b>≈&nbsp;6<small>мес</small></b><span>блочная станция: обследование, проект, монтаж и запуск</span></div>
          <div class="gt-sum__i"><b>≈&nbsp;17<small>мес</small></b><span>крупные сооружения с госэкспертизой и выходом биологии на режим</span></div>
          <div class="gt-sum__i gt-sum__i--par"><b>2–4<small>мес</small></b><span>экономии: оборудование делаем в своём цехе, пока идёт экспертиза</span></div>
        </div>
        <!-- Диаграмма Ганта: насыщенная часть полосы — минимальный срок, светлая — до максимального -->
        <div ref="gtEl" class="gt" :class="{ 'is-in': gtIn }" role="table" aria-label="Сроки проекта по этапам">
          <div class="gt-axis" aria-hidden="true">
            <span v-for="m in GT_TICKS" :key="m" :class="{ 'gt-minor': m % 6 }" :style="{ left: (m / GT_MAX * 100) + '%' }">{{ m === 0 ? 'старт' : m + '\u00a0мес' }}</span>
          </div>
          <div v-for="(t, i) in timing" :key="t.stage" class="gt-row" role="row" :style="{ '--i': i }">
            <div class="gt-label" role="rowheader">
              <span class="gt-n" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              <b>{{ t.stage }}</b>
              <span class="gt-range">{{ t.range }}</span>
            </div>
            <div class="gt-track" role="cell">
              <i v-for="m in GT_TICKS" :key="m" class="gt-grid" :class="{ 'gt-minor': m % 6 }" :style="{ left: (m / GT_MAX * 100) + '%' }" aria-hidden="true" />
              <span class="gt-bar" :style="{ left: (t.start / GT_MAX * 100) + '%', width: ((t.max - t.start) / GT_MAX * 100) + '%' }">
                <span class="gt-bar__min" :style="{ width: ((t.min - t.start) / (t.max - t.start) * 100) + '%' }" />
              </span>
            </div>
            <p class="gt-note">{{ t.note }}</p>
          </div>
          <div class="gt-legend" aria-hidden="true"><span><i class="gt-sw" />минимальный срок</span><span><i class="gt-sw gt-sw--max" />до максимального</span></div>
        </div>
        <p class="sv-time__foot">Производство оборудования идёт параллельно с экспертизой и строительной частью, поэтому этапы частично перекрываются.</p>
      </div>
    </section>

    <!-- #21: единый финальный призыв -->
    <AppleCta title="Обсудите задачу с инженером ESP" lede="Консультация бесплатная. Оценка объекта и рекомендации по оптимизации.">
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Обсудить проект</NuxtLink>
      <NuxtLink to="/equipment" class="ax-link">Каталог оборудования</NuxtLink>
    </AppleCta>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { servicesList } from '~/composables/useServices'
import ServicesShelf from '~/components/services/ServicesShelf.vue'
import TurnkeyChapter from '~/components/services/TurnkeyChapter.vue'
import { turnkeyStagesList } from '~/composables/useTurnkeyProcess'
import { useReveal } from '~/composables/useReveal'

const root = ref(null)
useReveal(root)

// og-картинки лежат в этом проекте: origin берём из runtimeConfig,
// чтобы смена домена правилась в одном месте.
const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead({
  title: 'Услуги ESP | Проектирование, пусконаладка, поддержка очистных сооружений',
  meta: [
    {
      name: 'description',
      content: 'Услуги ЭкоСервисПроект: консультация, BIM-проектирование, поставка оборудования, монтаж, пусконаладка, техническое обслуживание, поддержка 24/7.'
    },
    { property: 'og:title', content: 'Услуги ESP | Проектирование, монтаж, пусконаладка' },
    { property: 'og:description', content: 'Полный цикл услуг под ключ: BIM-проектирование, производство, монтаж, пусконаладка, сервис и ремонт очистных сооружений.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/services' }]
})

const turnkeyStages = turnkeyStagesList

// Ориентировочные типовые сроки (не гарантия): уточняются после обследования объекта.
// start/min/max — в месяцах от старта проекта (типовой проект средней мощности)
const timing = [
  { stage: 'Обследование и ТЗ', range: '2–4 недели', start: 0, min: 0.5, max: 1, note: 'Выезд на объект, анализ стоков, техническое задание' },
  { stage: 'Проектирование с экспертизой', range: '3–9 месяцев', start: 1, min: 4, max: 10, note: 'Зависит от производительности и сроков госэкспертизы' },
  { stage: 'Производство оборудования', range: '2–4 месяца', start: 5, min: 7, max: 9, note: 'Собственный цех ESP, параллельно с экспертизой' },
  { stage: 'Монтаж', range: '1–6 месяцев', start: 9, min: 10, max: 15, note: 'От блочных станций до крупных сооружений' },
  { stage: 'Пусконаладка и выход биологии на режим', range: '1–3 месяца', start: 14, min: 15, max: 17, note: 'Наращивание активного ила; дольше в холодный период' }
]
const GT_MAX = 18
// Полосы «вырастают» слева направо, когда диаграмма появляется на экране
const gtEl = ref(null)
const gtIn = ref(false)
onMounted(() => {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { gtIn.value = true; io.disconnect() } }, { threshold: 0.25 })
  if (gtEl.value) io.observe(gtEl.value)
})
const GT_TICKS = [0, 3, 6, 9, 12, 15, 18]
</script>

<style scoped>
.sv-anchor { scroll-margin-top: 120px; }
@media (max-width: 734px) {
}
.sv-h2 { margin-top: 8px; }
.sv-lede { margin-top: 16px; max-width: 40em; }
.dj-sec--soft .sv-lede { color: #5E5E5E; }
.sv-services { padding: 0; }
.sv-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 767px) {
  .sv-services { padding: 8px 0 16px; }
}
.sv-time__foot { margin-top: 16px; color: #5E5E5E; font-size: .875rem; max-width: 46em; }
/* Итог по срокам */
.gt-sum { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 32px; }
.gt-sum__i { display: grid; gap: 6px; align-content: start; padding: 20px 22px 22px; border-radius: var(--r-md); background: #F5F5F7; }
.gt-sum__i b { font-size: clamp(32px, 3.4vw, 44px); line-height: 1; font-weight: 600; letter-spacing: -0.01em; color: #002366; font-variant-numeric: tabular-nums; white-space: nowrap; }
.gt-sum__i small { margin-left: 4px; font-size: 0.42em; font-weight: 600; letter-spacing: 0; color: #1A1A1A; }
.gt-sum__i span { font-size: 14px; line-height: 1.4; color: #5E5E5E; text-wrap: pretty; }
.gt-sum__i--par b { color: #006039; }
/* Диаграмма Ганта */
.gt { position: relative; margin-top: 40px; --lab: 300px; }
.gt-axis { position: relative; height: 24px; margin-left: var(--lab); border-bottom: 1px solid #D6D6D6; font-size: 12px; color: #8A8A8A; font-variant-numeric: tabular-nums; }
.gt-axis span { position: absolute; top: 0; transform: translateX(-50%); white-space: nowrap; }
.gt-axis span:first-child { transform: none; }
.gt-axis span:last-child { transform: translateX(-100%); }
.gt-row { display: grid; grid-template-columns: var(--lab) minmax(0, 1fr); grid-template-areas: 'lab track' 'lab note'; column-gap: 0; row-gap: 6px; align-items: center; padding: 18px 0; border-bottom: 1px solid #EDEDED; }
.gt-label { grid-area: lab; display: grid; grid-template-columns: 34px minmax(0, 1fr); grid-template-areas: 'n t' 'n r'; column-gap: 10px; row-gap: 2px; align-items: baseline; padding-right: 24px; }
.gt-n { grid-area: n; font-size: 13px; font-weight: 600; color: #8A8A8A; font-variant-numeric: tabular-nums; }
.gt-label b { grid-area: t; font-size: 17px; line-height: 1.25; font-weight: 600; color: #1A1A1A; text-wrap: balance; }
.gt-range { grid-area: r; font-size: 14px; font-weight: 600; color: #002366; white-space: nowrap; }
.gt-track { grid-area: track; position: relative; height: 14px; }
.gt-grid { position: absolute; top: -6px; bottom: -6px; width: 1px; background: #E3E3E6; }
.gt-grid.gt-minor { background: #F0F0F2; }
.gt-bar { position: absolute; top: 0; height: 14px; border-radius: 999px; background: rgba(0, 35, 102, 0.14); box-shadow: inset 0 0 0 1px rgba(0, 35, 102, 0.12); overflow: hidden; transform-origin: left center; transform: scaleX(0); transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i) * 0.12s); }
.gt.is-in .gt-bar { transform: none; }
.gt-bar__min { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #002366, #1b56b8); }
.gt-note { grid-area: note; margin: 0; font-size: 13px; line-height: 1.4; color: #6E6E73; text-wrap: pretty; }
.gt-legend { display: flex; flex-wrap: wrap; gap: 8px 22px; margin: 16px 0 0 var(--lab); font-size: 13px; color: #6E6E73; }
.gt-legend span { display: inline-flex; align-items: center; gap: 8px; }
.gt-sw { width: 22px; height: 8px; border-radius: 999px; background: linear-gradient(90deg, #002366, #1b56b8); }
.gt-sw--max { background: rgba(0, 35, 102, 0.14); box-shadow: inset 0 0 0 1px rgba(0, 35, 102, 0.12); }
@media (prefers-reduced-motion: reduce) { .gt-bar { transform: none; transition: none; } }
@media (max-width: 767px) {
  .gt-sum { grid-template-columns: 1fr; gap: 8px; margin-top: 24px; }
  .gt-sum__i { grid-template-columns: 96px minmax(0, 1fr); align-items: center; gap: 14px; padding: 14px 16px; }
  .gt-sum__i b { font-size: 28px; }
  .gt-sum__i span { font-size: 13px; }
  .gt { --lab: 0px; margin-top: 28px; }
  .gt-axis { margin-left: 0; }
  .gt-axis .gt-minor { display: none; }
  .gt-row { grid-template-columns: 1fr; grid-template-areas: 'lab' 'track' 'note'; row-gap: 10px; padding: 16px 0; }
  .gt-label { grid-template-columns: 26px minmax(0, 1fr) auto; grid-template-areas: 'n t r'; padding: 0; }
  .gt-label b { font-size: 15px; }
  .gt-range { font-size: 13px; }
  .gt-grid.gt-minor { display: none; }
  .gt-bar, .gt-track { height: 12px; }
  .gt-note { font-size: 12.5px; padding-left: 36px; }
  .gt-legend { margin-left: 0; }
}
</style>

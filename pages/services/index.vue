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
    <section id="timing" class="dj-sec sv-anchor">
      <div class="dj-wrap dj-reveal">
        <span class="dj-eyebrow">Сроки</span>
        <h2 class="dj-h2 sv-h2">Сколько времени занимает проект</h2>
        <p class="dj-lede sv-lede">Типовые диапазоны для станций очистки от 50 до 20 000 м³/сут. Ориентировочно, точный график — после обследования объекта.</p>
        <!-- Диаграмма Ганта: насыщенная часть полосы — минимальный срок, светлая — до максимального -->
        <div class="gt" role="table" aria-label="Сроки проекта по этапам">
          <div class="gt-axis" aria-hidden="true">
            <span v-for="m in GT_TICKS" :key="m" :style="{ left: (m / GT_MAX * 100) + '%' }">{{ m === 0 ? 'старт' : m + ' мес' }}</span>
          </div>
          <div v-for="t in timing" :key="t.stage" class="gt-row" role="row">
            <div class="gt-label" role="rowheader">
              <b>{{ t.stage }}</b>
              <span class="gt-range">{{ t.range }}</span>
            </div>
            <div class="gt-track" role="cell">
              <i v-for="m in GT_TICKS" :key="m" class="gt-grid" :style="{ left: (m / GT_MAX * 100) + '%' }" aria-hidden="true" />
              <span class="gt-bar" :style="{ left: (t.start / GT_MAX * 100) + '%', width: ((t.max - t.start) / GT_MAX * 100) + '%' }">
                <span class="gt-bar__min" :style="{ width: ((t.min - t.start) / (t.max - t.start) * 100) + '%' }" />
              </span>
              <span class="gt-note">{{ t.note }}</span>
            </div>
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
import { ref } from 'vue'
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
/* Диаграмма Ганта */
.gt { position: relative; margin-top: 36px; --lab: 280px; }
.gt-axis { position: relative; height: 22px; margin-left: var(--lab); border-bottom: 1px solid #D6D6D6; font-size: 12px; color: #8A8A8A; }
.gt-axis span { position: absolute; top: 0; transform: translateX(-50%); white-space: nowrap; }
.gt-axis span:first-child { transform: none; }
.gt-axis span:last-child { transform: translateX(-100%); }
.gt-row { display: grid; grid-template-columns: var(--lab) minmax(0, 1fr); align-items: center; min-height: 76px; border-bottom: 1px solid #EDEDED; }
.gt-label { display: grid; gap: 2px; padding-right: 20px; }
.gt-label b { font-size: 16px; line-height: 1.3; font-weight: 600; color: #1A1A1A; }
.gt-range { font-size: 14px; font-weight: 600; color: #002366; }
.gt-track { position: relative; height: 100%; min-height: 76px; }
.gt-grid { position: absolute; top: 0; bottom: 0; width: 1px; background: #F0F0F2; }
.gt-bar { position: absolute; top: 18px; height: 14px; border-radius: 999px; background: rgba(0, 35, 102, 0.16); overflow: hidden; }
.gt-bar__min { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #002366, #1b56b8); }
.gt-note { position: absolute; left: 0; right: 0; top: 40px; font-size: 13px; line-height: 1.35; color: #6E6E73; }
.gt-legend { display: flex; flex-wrap: wrap; gap: 8px 22px; margin: 14px 0 0 var(--lab); font-size: 13px; color: #6E6E73; }
.gt-legend span { display: inline-flex; align-items: center; gap: 8px; }
.gt-sw { width: 22px; height: 8px; border-radius: 999px; background: linear-gradient(90deg, #002366, #1b56b8); }
.gt-sw--max { background: rgba(0, 35, 102, 0.16); }
@media (max-width: 834px) {
  .gt { --lab: 0px; }
  .gt-axis { margin-left: 0; }
  .gt-row { grid-template-columns: 1fr; align-items: start; padding: 14px 0; min-height: 0; }
  .gt-label { grid-template-columns: 1fr auto; align-items: baseline; gap: 8px; padding: 0 0 10px; }
  .gt-label b { font-size: 15px; }
  .gt-track { min-height: 52px; }
  .gt-bar { top: 0; height: 12px; }
  .gt-note { top: 20px; font-size: 12.5px; }
  .gt-legend { margin-left: 0; }
}
</style>

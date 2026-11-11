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
        <ol class="sv-time">
          <li v-for="t in timing" :key="t.stage" class="sv-time__row">
            <span class="sv-time__stage">{{ t.stage }}</span>
            <span class="sv-time__range">{{ t.range }}</span>
            <span class="sv-time__note">{{ t.note }}</span>
          </li>
        </ol>
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
const timing = [
  { stage: 'Обследование и ТЗ', range: '2–4 недели', note: 'Выезд на объект, анализ стоков, техническое задание' },
  { stage: 'Проектирование с экспертизой', range: '3–9 месяцев', note: 'Зависит от производительности и сроков государственной экспертизы' },
  { stage: 'Производство оборудования', range: '2–4 месяца', note: 'Собственный цех ESP, параллельно с экспертизой' },
  { stage: 'Монтаж', range: '1–6 месяцев', note: 'От блочных станций до крупных сооружений' },
  { stage: 'Пусконаладка и выход биологии на режим', range: '1–3 месяца', note: 'Наращивание активного ила; дольше в холодный период' }
]
</script>

<style scoped>
.sv-anchor { scroll-margin-top: 120px; }
.sv-time { list-style: none; margin: 32px 0 0; padding: 0; border-top: 1px solid #D6D6D6; }
.sv-time__row { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr) minmax(0, 1.6fr); gap: 8px 24px; align-items: baseline; padding: 18px 0; border-bottom: 1px solid #D6D6D6; }
.sv-time__stage { font-weight: 600; color: #1A1A1A; }
.sv-time__range { font-weight: 600; color: #002366; white-space: nowrap; }
.sv-time__note { color: #5E5E5E; font-size: .9375em; }
.sv-time__foot { margin-top: 16px; color: #5E5E5E; font-size: .875rem; max-width: 46em; }
@media (max-width: 734px) {
  .sv-time__row { grid-template-columns: 1fr auto; }
  .sv-time__note { grid-column: 1 / -1; }
}
.sv-h2 { margin-top: 8px; }
.sv-lede { margin-top: 16px; max-width: 40em; }
.dj-sec--soft .sv-lede { color: #5E5E5E; }
.sv-services { padding: 0; }
.sv-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 767px) {
  .sv-services { padding: 8px 0 16px; }
}
</style>

<template>
  <!-- Услуги в подаче обзорной страницы продукта DJI: кадр на первом экране,
       плитки услуг, этапы «под ключ» горизонтальной шкалой, призыв. -->
  <div ref="root" class="dj sv">


    <!-- Линейка услуг: фото-аккордеон из 9 панелей -->
    <section id="services" class="sv-anchor sv-services">
      <h1 class="sv-sr">Услуги ESP — от консультации до пусконаладки: полный цикл работ по очистным сооружениям</h1>
      <ServicesShelf :items="servicesList" />
    </section>

    <!-- Turnkey Process: 7 шагов в подаче «глава» Apple -->
    <section id="process" class="dj-sec dj-sec--soft sv-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <span class="dj-eyebrow">Комплексный подход под ключ</span>
        <h2 class="dj-h2 sv-h2">От замысла до запуска</h2>
        <p class="dj-lede sv-lede">
          Мы не поставляем разрозненное оборудование. Мы проектируем, производим, монтируем и передаём работающие очистные сооружения с гарантией результата и последующим обучением персонала. Семь этапов от проектирования до пусконаладки.
        </p>
      </div>

      <TurnkeyChapter :steps="turnkeyStages" />
    </section>

    <!-- #21: единый финальный призыв -->
    <AppleCta title="Обсудите задачу с инженером ESP" lede="Консультация бесплатная. Оценка объекта и рекомендации по оптимизации.">
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Запросить консультацию</NuxtLink>
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
      content: 'Услуги EcoServiceProject: консультация, BIM-проектирование, поставка оборудования, монтаж, пусконаладка, техническое обслуживание, поддержка 24/7.'
    },
    { property: 'og:title', content: 'Услуги ESP | Проектирование, монтаж, пусконаладка' },
    { property: 'og:description', content: 'Полный цикл услуг под ключ: BIM-проектирование, производство, монтаж, пусконаладка, сервис и ремонт очистных сооружений.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/services' }]
})

const turnkeyStages = turnkeyStagesList
</script>

<style scoped>
.sv-anchor { scroll-margin-top: 120px; }
.sv-h2 { margin-top: 8px; }
.sv-lede { margin-top: 16px; max-width: 40em; }
.dj-sec--soft .sv-lede { color: #6e6e73; }
.sv-services { padding: 0; }
.sv-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 767px) {
  .sv-services { padding: 8px 0 16px; }
}
</style>

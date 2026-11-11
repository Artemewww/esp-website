<template>
  <!-- Услуги в подаче обзорной страницы продукта DJI: кадр на первом экране,
       плитки услуг, этапы «под ключ» горизонтальной шкалой, призыв. -->
  <div ref="root" class="dj sv">
    <DjPageHero
      eyebrow="Полный спектр услуг"
      title="Услуги ESP"
      lede="От консультации до пусконаладки: полный цикл обслуживания систем очистки воды. Гарантия качества и 24/7 поддержка."
      image="/images/developer/ИНЖИНИРИНГ.webp"
      alt="Инжиниринг — проектирование и подготовка проекта"
      short
    >
      <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--white">Запросить консультацию</NuxtLink>
      <a href="#process" class="dj-more dj-more--light">Комплексный подход «под ключ»</a>
    </DjPageHero>

    <DjSubnav
      title="Услуги ESP"
      :links="[
        { href: '#services', label: 'Услуги' },
        { href: '#process', label: 'Процесс' }
      ]"
      :cta="{ to: '/contacts#contact-form', label: 'Консультация' }"
    />

    <!-- Линейка услуг: «книжная полка» из 9 корешков -->
    <section id="services" class="sv-anchor sv-services">
      <ServicesShelf :items="servicesList" />
    </section>

    <!-- Turnkey Process: 7 шагов в подаче «глава» Apple -->
    <section id="process" class="dj-sec dj-sec--soft sv-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <span class="dj-eyebrow">Комплексный подход «под ключ»</span>
        <h2 class="dj-h2 sv-h2">От замысла до кристальной воды</h2>
        <p class="dj-lede sv-lede">
          Мы не поставляем разрозненное оборудование. Мы проектируем, производим, монтируем и передаём работающую интеллектуальную экосистему с гарантией результата и последующим обучением персонала. 7 шагов проектирования и строительства вашего очистного комплекса.
        </p>
      </div>

      <TurnkeyChapter :steps="turnkeyStages" />
    </section>

    <!-- CTA -->
    <section class="dj-sec dj-sec--dark dj-center">
      <div class="dj-wrap dj-reveal">
        <h2 class="dj-h2">Обсудите вашу задачу с инженером ESP</h2>
        <p class="dj-lede sv-lede">
          Консультация совершенно бесплатна. Профессиональная оценка объекта и рекомендации по оптимизации.
        </p>
        <div class="dj-links sv-cta-act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--white dj-btn--lg">Запросить консультацию</NuxtLink>
          <NuxtLink to="/equipment" class="dj-more dj-more--light">Каталог оборудования</NuxtLink>
        </div>
      </div>
    </section>
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
      content: 'Услуги EcoServiceProject: консультация, проектирование BIM, поставка оборудования, монтаж, пусконаладка, техническое обслуживание, 24/7 поддержка.'
    },
    { property: 'og:title', content: 'Услуги ESP | Проектирование, монтаж, пусконаладка' },
    { property: 'og:description', content: 'Полный цикл услуг «под ключ»: проектирование BIM, производство, монтаж, пусконаладка, сервис и ремонт очистных сооружений.' },
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
.dj-sec--dark .sv-lede { color: #86868b; }
.sv-services { padding: 12px 0 12px; }
.sv-cta-act { margin-top: 30px; }
@media (max-width: 767px) {
  .sv-services { padding: 16px 0; }
}
</style>

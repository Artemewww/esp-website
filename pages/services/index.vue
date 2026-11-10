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

    <!-- Линейка услуг: плитки на светлом градиенте -->
    <section id="services" class="sv-anchor sv-services">
      <div class="sv-tiles">
        <NuxtLink
          v-for="service in servicesList"
          :key="service.id"
          :to="`/services/${service.slug}`"
          class="sv-tile dj-reveal"
        >
          <ApIcon :name="serviceGlyphs[service.icon]" class="sv-ico" />
          <h2 class="sv-title">{{ service.title }}</h2>
          <p class="sv-desc">{{ service.desc }}</p>
          <ul class="sv-points">
            <li v-for="point in service.points" :key="point">{{ point }}</li>
          </ul>
          <span class="dj-more sv-foot">Подробнее об услуге</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Turnkey Process: горизонтальная шкала этапов -->
    <section id="process" class="dj-sec dj-sec--soft sv-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <span class="dj-eyebrow">Комплексный подход «под ключ»</span>
        <h2 class="dj-h2 sv-h2">От замысла до кристальной воды</h2>
        <p class="dj-lede sv-lede">
          Мы не поставляем разрозненное оборудование. Мы проектируем, производим, монтируем и передаём работающую интеллектуальную экосистему с гарантией результата и последующим обучением персонала. 7 шагов проектирования и строительства вашего очистного комплекса.
        </p>
      </div>

      <ol class="sv-line">
        <li v-for="stage in turnkeyStages" :key="stage.num" class="sv-step dj-reveal">
          <span class="sv-dot" aria-hidden="true"></span>
          <span class="sv-num">{{ stage.num }}</span>
          <NuxtLink :to="`/services/process/${stage.slug}`" class="sv-step-img">
            <img :src="stage.image" :alt="stage.title" loading="lazy" decoding="async" />
          </NuxtLink>
          <b class="sv-step-title">{{ stage.title }}</b>
          <span class="sv-step-desc">{{ stage.desc }}</span>
          <ul class="sv-points">
            <li v-for="d in stage.details" :key="d">{{ d }}</li>
          </ul>
          <NuxtLink :to="`/services/process/${stage.slug}`" class="dj-more sv-foot">
            Открыть страницу этапа
          </NuxtLink>
        </li>
      </ol>
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
import { servicesList, serviceGlyphs } from '~/composables/useServices'
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
.sv-h2 { margin-top: 6px; }
.sv-lede { margin-top: 12px; max-width: 62ch; }

/* Плитки услуг */
.sv-services { padding: 12px 0 0; }
.sv-tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; max-width: 1440px; margin: 0 auto; padding: 0 12px 12px; }
.sv-tile { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; min-height: 420px; padding: clamp(36px, 4vw, 52px) clamp(24px, 3vw, 40px) clamp(28px, 3vw, 40px); text-align: center; background: linear-gradient(180deg, #f6f7f9 0%, #e9ecef 100%); overflow: hidden; isolation: isolate; }
.sv-tile::after { content: ''; position: absolute; inset: 0; z-index: -1; background: radial-gradient(120% 70% at 50% 110%, rgba(47, 111, 184, 0.14) 0%, rgba(47, 111, 184, 0) 60%); opacity: 0; transition: opacity 0.5s var(--dj-ease); }
.sv-tile:hover::after { opacity: 1; }
.sv-ico { width: 44px; height: 44px; margin-bottom: 10px; color: var(--dj-ink); transition: transform 0.6s var(--dj-ease); }
.sv-tile:hover .sv-ico { transform: translateY(-4px); }
.sv-title { font-size: clamp(22px, 2vw, 28px); line-height: 1.15; font-weight: 600; color: var(--dj-ink); letter-spacing: -0.02em; max-width: 20ch; }
.sv-desc { font-size: 15px; line-height: 1.55; color: var(--dj-text); max-width: 38ch; }
.sv-tile .sv-points { justify-items: center; }
.sv-tile .sv-points li { padding-left: 0; }
.sv-tile .sv-points li::before { display: none; }
.sv-foot { margin-top: auto; padding-top: 14px; }

.sv-points { display: grid; gap: 6px; margin: 4px 0 0; list-style: none; padding: 0; }
.sv-points li { position: relative; padding-left: 18px; font-size: 14px; line-height: 1.45; color: var(--dj-muted); }
.sv-points li::before { content: ''; position: absolute; left: 2px; top: 0.35em; width: 5px; height: 9px; border: solid var(--dj-accent); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }

/* Этапы: горизонтальная шкала, листается пальцем */
.sv-line {
  --sv-pad: max(24px, calc((100% - 1200px) / 2 + 24px));
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(260px, 24vw, 320px);
  column-gap: 12px;
  margin: clamp(36px, 5vw, 56px) 0 0;
  padding: 0 var(--sv-pad) 12px;
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-left: var(--sv-pad);
  scrollbar-width: thin;
}
.sv-step { position: relative; display: flex; flex-direction: column; gap: 8px; padding-top: 34px; scroll-snap-align: start; }
.sv-step::before { content: ''; position: absolute; left: 0; right: -12px; top: 7px; height: 1px; background: #cfd3d8; }
.sv-step:last-child::before { right: 0; }
.sv-dot { position: absolute; left: 0; top: 2px; width: 11px; height: 11px; background: var(--dj-ink); }
.sv-num { position: absolute; left: 22px; top: -2px; font-size: 13px; font-weight: 600; color: var(--dj-ink); font-variant-numeric: tabular-nums; background: var(--dj-soft); padding: 0 8px; }
.sv-step-img { display: block; aspect-ratio: 4 / 3; overflow: hidden; background: #e2e5e9; margin-bottom: 10px; }
.sv-step-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.sv-step-img:hover img { transform: scale(1.04); }
.sv-step-title { font-size: 19px; line-height: 1.25; font-weight: 600; color: var(--dj-ink); letter-spacing: -0.01em; }
.sv-step-desc { font-size: 14px; line-height: 1.55; color: var(--dj-text); }
.sv-step .sv-foot { padding-top: 10px; }

.sv-cta-act { margin-top: 26px; }

@media (max-width: 1023px) {
  .sv-tiles { grid-template-columns: 1fr 1fr; }
  .sv-tiles > :last-child:nth-child(odd) { grid-column: 1 / -1; }
}
@media (max-width: 767px) {
  .sv-tiles { grid-template-columns: minmax(0, 1fr); gap: 8px; padding: 0 8px 8px; }
  .sv-tile { min-height: 0; }
  .sv-line { grid-auto-columns: 80vw; --sv-pad: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .sv-tile::after, .sv-ico, .sv-step-img img { transition: none; }
}
</style>

<template>
  <div class="ap">
    <!-- Шапка в подаче Apple: надзаголовок, заголовок, вводный абзац -->
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Полный спектр услуг</span>
        <h1 class="ap-title">Услуги ESP</h1>
        <p class="ap-lede">
          От консультации до пусконаладки: полный цикл обслуживания систем очистки воды. Гарантия качества и 24/7 поддержка.
        </p>

        <!-- Линейка услуг: белые плашки, тихая иконка, название, описание -->
        <div class="ap-grid ap-grid--3">
          <NuxtLink
            v-for="service in servicesList"
            :key="service.id"
            :to="`/services/${service.slug}`"
            class="ap-card"
          >
            <ApIcon :name="serviceGlyphs[service.icon]" class="ap-ico" />
            <h2 class="ap-h3">{{ service.title }}</h2>
            <p class="ap-text">{{ service.desc }}</p>
            <ul class="sv-points">
              <li v-for="point in service.points" :key="point">{{ point }}</li>
            </ul>
            <span class="ap-card-foot ap-link">Подробнее об услуге ›</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Turnkey Process -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Комплексный подход «под ключ»</span>
        <h2 class="ap-h2">От замысла до кристальной воды</h2>
        <p class="ap-lede">
          Мы не поставляем разрозненное оборудование. Мы проектируем, производим, монтируем и передаём работающую интеллектуальную экосистему с гарантией результата и последующим обучением персонала. 7 шагов проектирования и строительства вашего очистного комплекса.
        </p>

        <div class="ap-rows sv-stages">
          <div v-for="(stage, i) in turnkeyStages" :key="stage.num" class="sv-stage">
            <button
              type="button"
              class="sv-stage-btn"
              :aria-expanded="openStage === i"
              @click="openStage = openStage === i ? null : i"
            >
              <span class="sv-num">{{ stage.num }}</span>
              <span class="sv-stage-txt">
                <b class="sv-stage-title">{{ stage.title }}</b>
                <span class="ap-text">{{ stage.desc }}</span>
              </span>
              <span class="sv-plus" :class="{ 'is-open': openStage === i }" aria-hidden="true"></span>
            </button>
            <div v-show="openStage === i" class="sv-stage-body">
              <ul class="sv-points">
                <li v-for="d in stage.details" :key="d">{{ d }}</li>
              </ul>
              <NuxtLink :to="`/services/process/${stage.slug}`" class="ap-link">
                Открыть страницу этапа ›
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="ap-sec ap-cta">
      <div class="ap-wrap">
        <h2 class="ap-h2">Обсудите вашу задачу с инженером ESP</h2>
        <p class="ap-lede">
          Консультация совершенно бесплатна. Профессиональная оценка объекта и рекомендации по оптимизации.
        </p>
        <div class="ap-actions">
          <NuxtLink to="/contacts#contact-form" class="ap-btn">Запросить консультацию</NuxtLink>
          <NuxtLink to="/equipment" class="ap-link">Каталог оборудования ›</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { servicesList, serviceGlyphs } from '~/composables/useServices'
import { turnkeyStagesList } from '~/composables/useTurnkeyProcess'

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

const openStage = ref(null)
const turnkeyStages = turnkeyStagesList
</script>

<style scoped>
.ap-cta .ap-actions { justify-content: center; }

/* Пункты с тонкой галочкой вместо зелёных ✓ */
.sv-points { display: grid; gap: 0.4rem; margin-top: 0.5rem; list-style: none; padding: 0; }
.sv-points li { position: relative; padding-left: 1.2rem; font-size: 14px; line-height: 1.45; color: var(--ap-muted); }
.sv-points li::before { content: ''; position: absolute; left: 0.15rem; top: 0.4em; width: 0.4rem; height: 0.7rem; border: solid var(--ap-accent); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }

/* Этапы «под ключ» — аккордеон строками */
.sv-stage + .sv-stage { border-top: 1px solid var(--ap-line); }
.sv-stage-btn { display: flex; align-items: flex-start; gap: 1.1rem; width: 100%; padding: 1.25rem 0; text-align: left; }
.sv-num { flex: 0 0 2.2rem; font-weight: 700; font-size: 1.05rem; color: var(--ap-blue); }
.sv-stage-txt { display: grid; gap: 0.2rem; flex: 1; min-width: 0; }
.sv-stage-title { font-weight: 600; font-size: 1.05rem; color: var(--ap-ink); }
.sv-plus { position: relative; flex: 0 0 18px; height: 18px; margin-top: 0.2rem; }
.sv-plus::before, .sv-plus::after { content: ''; position: absolute; left: 50%; top: 50%; width: 12px; height: 1.5px; background: var(--ap-muted); transform: translate(-50%, -50%); transition: transform 0.3s ease; }
.sv-plus::after { transform: translate(-50%, -50%) rotate(90deg); }
.sv-plus.is-open::after { transform: translate(-50%, -50%) rotate(0deg); }
.sv-stage-body { padding: 0 0 1.4rem 3.3rem; display: grid; gap: 0.9rem; justify-items: start; }

@media (max-width: 767px) {
  .sv-stage-body { padding-left: 0; }
}
</style>

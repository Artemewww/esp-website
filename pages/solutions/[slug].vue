<template>
  <div ref="root" class="sl">
    <DjPageHero
      eyebrow="Решения для бизнеса"
      :title="sol.title"
      :lede="sol.lede"
      :image="sol.banner || sol.cover"
      align="left"
    >
      <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--glass">Оставить заявку</NuxtLink>
      <a v-if="items.length" href="#objects" class="dj-more dj-more--light" @click.prevent="jump('#objects')">Реализованные объекты</a>
    </DjPageHero>

    <DjSubnav :title="sol.title" :links="subLinks" :cta="{ to: '/contacts#contact-form', label: 'Связаться' }" />

    <!-- Реализованные объекты: лента крупных карточек -->
    <section v-if="items.length" id="objects" class="dj-sec sl-anchor" aria-labelledby="sl-obj-h">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 id="sl-obj-h" class="dj-h2">Реализованные объекты</h2>
        <div class="dj-links"><NuxtLink to="/projects" class="dj-more">Все объекты</NuxtLink></div>
      </div>
      <div class="sl-rail-wrap dj-reveal">
        <div ref="rail" class="sl-rail" :class="{ 'sl-rail--few': items.length < 3 }">
          <NuxtLink v-for="p in items" :key="p.slug" :to="`/projects/${p.slug}`" class="sl-card">
            <span class="sl-card__media">
              <img v-if="p.poster || p.gallery?.[0]" :src="p.poster || p.gallery[0]" :alt="p.name" loading="lazy" decoding="async" />
            </span>
            <span class="sl-card__copy">
              <span class="sl-card__eyebrow">{{ p.category }}</span>
              <b class="sl-card__title">{{ p.name }}</b>
              <span class="sl-card__meta">{{ [p.location !== p.name ? p.location : '', p.region].filter(Boolean).join(', ') }}</span>
              <span class="sl-card__nums">
                <span v-if="p.capacity"><b>{{ p.capacity }}</b>производительность</span>
                <span v-if="p.year"><b>{{ p.year }}</b>год</span>
              </span>
              <span class="dj-more dj-more--light">Подробнее</span>
            </span>
          </NuxtLink>
        </div>
        <div v-if="items.length > 2" class="sl-rail-nav">
          <button type="button" aria-label="Назад" @click="scrollRail(-1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" aria-label="Вперёд" @click="scrollRail(1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Оборудование: предметные кадры на светлом градиенте -->
    <section v-if="eq.length" id="equipment" class="sl-anchor sl-eq" aria-labelledby="sl-eq-h">
      <div class="dj-wrap dj-center sl-head dj-reveal">
        <h2 id="sl-eq-h" class="dj-h2">Оборудование</h2>
        <div class="dj-links"><NuxtLink to="/equipment" class="dj-more">Весь каталог</NuxtLink></div>
      </div>
      <div class="dj-tiles dj-tiles--3">
        <NuxtLink v-for="e in eq" :key="e.slug" :to="`/equipment/${e.slug}`" class="dj-tile sl-eq__tile dj-reveal">
          <h3 class="dj-tile__title sl-eq__title">{{ e.name }}</h3>
          <p class="dj-tile__sub sl-eq__sub">{{ e.desc }}</p>
          <span class="dj-links"><span class="dj-more">Подробнее</span></span>
          <span class="dj-tile__media dj-tile__media--contain"><img :src="e.photo" :alt="e.name" loading="lazy" decoding="async" /></span>
        </NuxtLink>
      </div>
    </section>

    <!-- Технологии -->
    <section id="tech" class="dj-sec dj-sec--soft sl-anchor" aria-labelledby="sl-tech-h">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 id="sl-tech-h" class="dj-h2">Технологии</h2>
        <div class="dj-links"><NuxtLink to="/technologies" class="dj-more">Все технологии</NuxtLink></div>
      </div>
      <div class="dj-wrap dj-wrap--wide sl-tech">
        <NuxtLink v-for="t in tech" :key="t.to" :to="t.to" class="sl-tech__card dj-reveal">
          <b>{{ t.title }}</b>
          <span v-if="t.desc">{{ t.desc }}</span>
          <span class="dj-more">Подробнее</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Связаться -->
    <section id="contact" class="dj-sec dj-center sl-anchor" aria-labelledby="sl-cta-h">
      <div class="dj-wrap dj-reveal">
        <h2 id="sl-cta-h" class="dj-h1">Обсудим ваш объект</h2>
        <p class="dj-lede sl-cta__lede">
          Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта.
        </p>
        <div class="dj-links sl-cta__act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg">Оставить заявку</NuxtLink>
          <a :href="contacts.phoneHref" class="dj-more">{{ contacts.phone }}</a>
        </div>
      </div>
    </section>

    <!-- Другие отрасли -->
    <section class="sl-other" aria-labelledby="sl-other-h">
      <div class="dj-wrap dj-center sl-head dj-reveal">
        <h2 id="sl-other-h" class="dj-h2">Другие отрасли</h2>
        <div class="dj-links"><NuxtLink to="/solutions" class="dj-more">Все решения</NuxtLink></div>
      </div>
      <div class="dj-tiles dj-tiles--3">
        <NuxtLink v-for="o in others" :key="o.slug" :to="`/solutions/${o.slug}`" class="dj-tile dj-tile--photo sl-other__tile dj-reveal">
          <h3 class="dj-tile__title">{{ o.title }}</h3>
          <p class="dj-tile__sub">{{ o.short }}</p>
          <span class="dj-links"><span class="dj-more dj-more--light">Подробнее</span></span>
          <span class="dj-tile__media"><img :src="o.cover" :alt="o.title" loading="lazy" decoding="async" /></span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { solutions, solutionProjects, solutionEquipment, technologies, contacts } from '~/composables/useSiteNav'
import { technologiesList } from '~/composables/useTechnologies'
import { useReveal } from '~/composables/useReveal'

const route = useRoute()
const sol = solutions.find((s) => s.slug === route.params.slug)
if (!sol) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена', fatal: true })
}

const root = ref(null)
useReveal(root)

const items = solutionProjects(sol)
const eq = solutionEquipment(sol)
const others = solutions.filter((s) => s.slug !== sol.slug)
const tech = technologies.map((t) => ({
  ...t,
  desc: technologiesList.find((x) => t.to.endsWith('/' + x.slug))?.desc || ''
}))

const subLinks = computed(() => [
  items.length && { href: '#objects', label: 'Объекты' },
  eq.length && { href: '#equipment', label: 'Оборудование' },
  { href: '#tech', label: 'Технологии' },
  { href: '#contact', label: 'Связаться' }
].filter(Boolean))

const rail = ref(null)
const scrollRail = (dir) => {
  const el = rail.value
  if (!el) return
  const card = el.querySelector('.sl-card')
  const step = card ? card.getBoundingClientRect().width + 12 : el.clientWidth * 0.8
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
}

const jump = (href) => {
  const el = document.querySelector(href)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56 - 52, behavior: 'smooth' })
}

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead({
  title: `${sol.title} | Решения для бизнеса ESP`,
  meta: [
    { name: 'description', content: sol.lede },
    { property: 'og:title', content: `${sol.title} | ESP` },
    { property: 'og:description', content: sol.lede },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: `https://ecoservisproekt.by/solutions/${sol.slug}` }]
})

useSchemaOrg([
  defineBreadcrumb([
    { name: 'Решения для бизнеса', item: '/solutions' },
    { name: sol.title }
  ])
])
</script>

<style scoped>
.sl-anchor { scroll-margin-top: 108px; }
.sl-head { padding: clamp(56px, 7vw, 96px) 24px clamp(24px, 3vw, 36px); }

/* Лента объектов */
.sl-rail-wrap { position: relative; margin-top: clamp(28px, 3.5vw, 44px); }
.sl-rail { display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 48px) / 2.35); gap: 12px; padding: 0 12px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 12px; scrollbar-width: none; }
.sl-rail::-webkit-scrollbar { display: none; }
.sl-rail--few { grid-auto-columns: calc((100% - 36px) / 2); }
.sl-card { position: relative; display: block; aspect-ratio: 4 / 5; max-height: 78vh; overflow: hidden; scroll-snap-align: start; background: #0b0d10; color: #fff; isolation: isolate; }
.sl-card__media { position: absolute; inset: 0; z-index: -1; }
.sl-card__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.sl-card:hover .sl-card__media img { transform: scale(1.04); }
.sl-card::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 38%, rgba(0, 0, 0, 0.78) 100%); }
.sl-card__copy { position: absolute; inset: auto 0 0 0; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: clamp(22px, 2.6vw, 36px); }
.sl-card__eyebrow { font-size: 13px; color: rgba(255, 255, 255, 0.72); }
.sl-card__title { font-size: clamp(22px, 2.2vw, 32px); line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; }
.sl-card__meta { font-size: 14px; color: rgba(255, 255, 255, 0.78); }
.sl-card__nums { display: flex; flex-wrap: wrap; gap: 8px 28px; margin: 10px 0 8px; }
.sl-card__nums > span { display: grid; font-size: 12px; color: rgba(255, 255, 255, 0.66); }
.sl-card__nums b { font-size: clamp(22px, 2vw, 30px); line-height: 1.1; font-weight: 300; letter-spacing: -0.02em; color: #fff; font-variant-numeric: tabular-nums; }
.sl-rail-nav { display: flex; justify-content: flex-end; gap: 10px; max-width: 1440px; margin: 16px auto 0; padding: 0 24px; }
.sl-rail-nav button { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: var(--dj-soft); color: var(--dj-ink); transition: background-color 0.2s ease; }
.sl-rail-nav button:hover { background: #e6e8eb; }
.sl-rail-nav svg { width: 18px; height: 18px; }

/* Оборудование: картинка без белого фона на светлом градиенте */
.sl-eq__tile { min-height: clamp(420px, 36vw, 540px); }
.sl-eq__title { font-size: clamp(22px, 2vw, 30px); }
.sl-eq__sub { font-size: 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.sl-eq__tile .dj-tile__media { height: 52%; }

/* Технологии */
.sl-tech { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: clamp(28px, 3.5vw, 44px); padding: 0 12px; }
.sl-tech__card { display: flex; flex-direction: column; gap: 10px; min-height: 220px; padding: 28px 24px; background: #fff; transition: box-shadow 0.3s ease; }
.sl-tech__card:hover { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); }
.sl-tech__card b { font-size: 20px; line-height: 1.2; font-weight: 600; color: var(--dj-ink); letter-spacing: -0.01em; }
.sl-tech__card > span:not(.dj-more) { font-size: 14px; line-height: 1.5; color: var(--dj-muted); }
.sl-tech__card .dj-more { margin-top: auto; }

.sl-cta__lede { max-width: 56ch; margin-top: 16px; }
.sl-cta__act { margin-top: 28px; }

.sl-other { padding-bottom: 12px; }
.sl-other__tile { min-height: clamp(380px, 32vw, 480px); }
.sl-other__tile .dj-tile__title { font-size: clamp(22px, 2vw, 30px); }

@media (max-width: 1023px) {
  .sl-rail, .sl-rail--few { grid-auto-columns: 62%; }
  .sl-tech { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 767px) {
  .sl-rail, .sl-rail--few { grid-auto-columns: 84%; gap: 8px; padding: 0 8px; scroll-padding: 0 8px; }
  .sl-card { aspect-ratio: 3 / 4; }
  .sl-rail-nav { display: none; }
  .sl-tech { grid-template-columns: 1fr; gap: 8px; padding: 0 8px; }
  .sl-tech__card { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .sl-card__media img { transition: none; }
}
</style>

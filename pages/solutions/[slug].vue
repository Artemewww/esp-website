<template>
  <div id="top" ref="root" class="sl">
    <!-- Название отрасли — в подполосе сразу под меню (это h1), без повторов;
         дальше картинка во всю ширину и описание под ней -->
    <AppleSubBar :title="sol.title" :links="subLinks" :cta="{ to: '/contacts#contact-form', label: 'Обсудить проект' }" h1 />

    <section class="sl-hero">
      <div class="sl-hero__img"><img :src="sol.banner || sol.cover" :alt="sol.title" fetchpriority="high" /></div>
      <div class="sl-hero__copy">
        <p class="sl-hero__lede">{{ sol.lede }}</p>
        <a v-if="items.length" href="#objects" class="sl-hero__link" @click.prevent="jump('#objects')">Реализованные объекты ›</a>
      </div>
    </section>

    <!-- Реализованные объекты: галерея «Главное» с паузой и стрелками -->
    <div v-if="items.length" id="objects" class="sl-anchor">
      <AppleHighlights title="Реализованные объекты" :items="objectSlides">
        <NuxtLink to="/projects" class="ax-link">Все объекты</NuxtLink>
      </AppleHighlights>
    </div>

    <!-- Цифры отрасли: бенто -->
    <section v-if="facts.length" class="ax-sec sl-facts" aria-label="Цифры">
      <AppleBento :items="facts" />
    </section>

    <!-- Оборудование: «Рассмотрите ближе» -->
    <!-- Оборудование: ряд карточек DJI Store — изделие выходит за верх карточки -->
    <section v-if="eq.length" id="equipment" class="sl-eq sl-anchor" aria-labelledby="sl-eq-h">
      <div class="ax-wrap ax-head dj-reveal">
        <h2 id="sl-eq-h" class="ax-h2">Оборудование</h2>
        <div class="ax-actions"><NuxtLink to="/equipment" class="ax-link">Весь каталог</NuxtLink></div>
      </div>
      <EquipNovRow class="sl-eq__row" :items="eq" bare />
    </section>

    <!-- Технологии: карусель карточек -->
    <section id="tech" class="ax-sec sl-anchor" aria-labelledby="sl-tech-h">
      <div class="ax-wrap ax-head dj-reveal">
        <h2 id="sl-tech-h" class="ax-h2">Технологии</h2>
        <div class="ax-actions"><NuxtLink to="/technologies" class="ax-link">Все технологии</NuxtLink></div>
      </div>
      <AppleWhy :items="techCards" />
    </section>

    <!-- Связаться -->
    <div id="contact" class="sl-anchor">
      <AppleCta
        tone="light"
        title="Обсудим ваш объект"
        lede="Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта."
      >
        <NuxtLink to="/contacts#contact-form" class="ax-btn">Обсудить проект</NuxtLink>
        <a :href="contacts.phoneHref" class="ax-link">{{ contacts.phone }}</a>
      </AppleCta>
    </div>

    <!-- Другие отрасли: блок сравнения -->
    <section class="ax-sec" aria-labelledby="sl-other-h">
      <div class="ax-wrap ax-head ax-head--center dj-reveal">
        <h2 id="sl-other-h" class="ax-h2">Другие отрасли</h2>
        <div class="ax-actions"><NuxtLink to="/solutions" class="ax-link">Все решения</NuxtLink></div>
      </div>
      <AppleCompare :columns="otherColumns" />
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
].filter(Boolean))

// ===== Раскладка по блокам страницы продукта apple.com =====
const objectSlides = items.map((p) => ({
  title: `${p.name}.`,
  // регион не повторяем, если он уже есть в адресе («Минская область» ≈ «Минская обл.»)
  text: [p.location !== p.name ? p.location : '', p.region && !String(p.location || '').includes(String(p.region).split(/\s/)[0]) ? p.region : ''].filter(Boolean).join(', '),
  chip: [p.capacity, p.year].filter(Boolean).join(' · '),
  image: p.poster || p.gallery?.[0],
  video: p.video || '',
  to: `/projects/${p.slug}`
}))
const facts = [
  items.length && { size: 'md', value: String(items.length), label: 'Реализованные объекты', tone: 'ink' },
  eq.length && { size: 'md', value: String(eq.length), label: 'Оборудование' }
].filter(Boolean)
// Картинки карточек — сцены с нашим оборудованием: барабанное сито, прямоугольные аэротенки, флотатор, УФ
const techCards = tech.map((t) => ({ title: t.title, text: t.desc, to: t.to, cover: `/images/technologies/cards/${t.to.split('/').pop()}.webp` }))
const otherColumns = others.map((o) => ({ title: o.title, text: o.short, image: o.cover, to: `/solutions/${o.slug}`, cta: 'Подробнее' }))

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

<style scoped src="../../components/apple/apple.css"></style>
<style scoped>
.sl-hero { padding-bottom: clamp(40px, 5vw, 72px); background: #fff; font-family: var(--dj-font); }
.sl-hero__img { position: relative; height: clamp(300px, 40vw, 640px); overflow: hidden; background: #dbe9f8; }
.sl-hero__img img { width: 100%; height: 100%; object-fit: cover; object-position: center 70%; animation: sl-in 1.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes sl-in { from { transform: scale(1.06); opacity: 0.4; } to { transform: none; opacity: 1; } }
.sl-hero__copy { display: flex; flex-direction: column; align-items: center; gap: 18px; width: min(860px, calc(100% - 48px)); margin: clamp(36px, 4.5vw, 64px) auto 0; text-align: center; }
.sl-hero__eyebrow { margin: 0; font-size: clamp(17px, 1.4vw, 21px); font-weight: 600; color: #002366; }
.sl-hero__title { margin: 8px 0 0; font-size: clamp(40px, 5.4vw, 80px); line-height: 1.03; font-weight: 700; letter-spacing: -0.025em; color: #1A1A1A; text-wrap: balance; }
.sl-hero__lede { margin: 0; font-size: clamp(21px, 2vw, 28px); line-height: 1.32; font-weight: 600; letter-spacing: -0.01em; color: #1A1A1A; text-wrap: balance; }
.sl-hero__act { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 28px; margin-top: 22px; }
.sl-hero__btn { display: inline-flex; align-items: center; min-height: 48px; padding: 0 28px; border-radius: var(--r-pill); font-size: 17px; color: #fff; background: #002366; transition: background-color 0.25s ease; }
.sl-hero__btn:hover { background: #002366; }
.sl-hero__link { font-size: 17px; color: #002366; }
.sl-hero__link:hover { text-decoration: underline; }
@media (max-width: 834px) { .sl-hero__copy { grid-template-columns: 1fr; } .sl-hero__img { height: 62vw; min-height: 260px; } }
@media (prefers-reduced-motion: reduce) { .sl-hero__img img { animation: none; } }
.sl-eq { padding-top: clamp(64px, 8vw, 120px); background: #EDEDED; }
.sl-eq { padding-bottom: clamp(40px, 5vw, 64px); }
.sl { background: #fff; }
.sl-anchor { scroll-margin-top: 108px; }
.sl :deep(.dsn-title) { min-width: 0; }
.sl-facts { padding-bottom: 0; }
.sl-facts :deep(.bn-tile) { background: #EDEDED; }
.sl-facts :deep(.bn--ink) { background: #002366 !important; }
@media (max-width: 734px) {
  .sl :deep(.sb-title) { min-width: 0; }
  .ax-h2 { overflow-wrap: break-word; hyphens: auto; }
}
</style>

<template>
  <div id="top" ref="root" class="sl">
    <!-- Первый экран: баннер отрасли, текст слева -->
    <AppleHero
      variant="banner"
      align="left"
      eyebrow="Решения для бизнеса"
      :title="sol.title"
      :lede="sol.lede"
      :image="sol.banner || sol.cover"
    >
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Оставить заявку</NuxtLink>
      <a v-if="items.length" href="#objects" class="ax-link" @click.prevent="jump('#objects')">Реализованные объекты</a>
    </AppleHero>

    <AppleSubBar :title="sol.title" :links="subLinks" :cta="{ to: '/contacts#contact-form', label: 'Связаться' }" />

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
    <section v-if="eq.length" id="equipment" class="ax-sec ax-light sl-anchor" aria-labelledby="sl-eq-h">
      <div class="ax-wrap ax-head dj-reveal">
        <h2 id="sl-eq-h" class="ax-h2">Оборудование</h2>
        <div class="ax-actions"><NuxtLink to="/equipment" class="ax-link">Весь каталог</NuxtLink></div>
      </div>
      <AppleCloserLook class="dj-reveal" light :items="eqItems" label="Оборудование" />
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
        lede="Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта."
      >
        <NuxtLink to="/contacts#contact-form" class="ax-btn">Оставить заявку</NuxtLink>
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
  { href: '#contact', label: 'Связаться' }
].filter(Boolean))

// ===== Раскладка по блокам страницы продукта apple.com =====
const objectSlides = items.map((p) => ({
  title: `${p.name}.`,
  text: [p.location !== p.name ? p.location : '', p.region].filter(Boolean).join(', '),
  chip: [p.capacity, p.year].filter(Boolean).join(' · '),
  image: p.poster || p.gallery?.[0],
  video: p.video || '',
  to: `/projects/${p.slug}`
}))
const facts = [
  items.length && { size: 'md', value: String(items.length), label: 'Реализованные объекты', tone: 'ink' },
  eq.length && { size: 'md', value: String(eq.length), label: 'Оборудование' }
].filter(Boolean)
const eqItems = eq.map((e) => ({ label: e.name, text: e.desc, image: e.photo, contain: true, to: `/equipment/${e.slug}` }))
const techCards = tech.map((t) => ({ title: t.title, text: t.desc, to: t.to }))
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
.sl { background: #fff; }
.sl-anchor { scroll-margin-top: 108px; }
.sl :deep(.dsn-title) { min-width: 0; }
.sl-facts { padding-bottom: 0; }
.sl-facts :deep(.bn-tile) { background: #f5f5f7; }
.sl-facts :deep(.bn--ink) { background: #002366 !important; }
@media (max-width: 734px) {
  .ax-h2 { overflow-wrap: break-word; hyphens: auto; }
}
</style>

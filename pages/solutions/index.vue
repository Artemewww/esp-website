<template>
  <div id="top" ref="root" class="so">
    <!-- Первый экран: кадр объекта во весь экран, текст слева -->
    <AppleHero
      variant="banner"
      align="left"
      eyebrow="ESP"
      title="Решения для бизнеса"
      :lede="solutions.map((s) => s.title).join(' · ')"
      :video="solutions[0].video"
      :image="solutions[0].cover"
    >
      <a href="#fields" class="ax-btn" @click.prevent="jump('#fields')">Выбрать отрасль</a>
      <NuxtLink to="/contacts#contact-form" class="ax-link">Обсудить проект</NuxtLink>
    </AppleHero>

    <AppleSubBar
      title="Решения"
      :links="[{ href: '#fields', label: 'Отрасли' }, { href: '#compare', label: 'Сравнение' }, { href: '#steps', label: 'Под ключ' }]"
      :cta="{ to: '/contacts#contact-form', label: 'Обсудить проект' }"
    />

    <!-- Отрасли: широкие баннеры, кадр и текст чередуются сторонами -->
    <section id="fields" class="so-fields so-anchor" aria-labelledby="so-fields-h">
      <div class="ax-wrap ax-head dj-reveal">
        <h2 id="so-fields-h" class="ax-h2">Отрасли</h2>
      </div>
      <div class="so-rows">
        <article
          v-for="(s, i) in solutions"
          :key="s.slug"
          class="so-row dj-reveal"
          :class="{ 'so-row--flip': i % 2 }"
        >
          <NuxtLink :to="`/solutions/${s.slug}`" class="so-row__media" :aria-label="s.title" @mouseenter="play" @mouseleave="pause">
            <video v-if="s.video && canHover" :src="s.video" :poster="s.cover" muted loop playsinline preload="none" />
            <img v-else :src="s.cover" :alt="s.title" loading="lazy" decoding="async" />
          </NuxtLink>
          <div class="so-row__copy">
            <span class="so-row__eyebrow">{{ s.short }}</span>
            <h3 class="so-row__title">{{ s.title }}</h3>
            <p class="so-row__lede">{{ s.lede }}</p>
            <ul v-if="counts[s.slug].projects || counts[s.slug].equipment" class="so-row__nums">
              <li v-if="counts[s.slug].projects"><b>{{ counts[s.slug].projects }}</b><span>{{ plural(counts[s.slug].projects, ['ключевой объект', 'ключевых объекта', 'ключевых объектов']) }}</span></li>
              <li v-if="counts[s.slug].equipment"><b>{{ counts[s.slug].equipment }}</b><span>{{ plural(counts[s.slug].equipment, ['вид', 'вида', 'видов']) }} оборудования</span></li>
            </ul>
            <div class="so-row__links">
              <NuxtLink :to="`/solutions/${s.slug}`" class="ax-btn">Подробнее</NuxtLink>
              <NuxtLink :to="`/solutions/${s.slug}#equipment`" class="ax-link">Оборудование</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Сравнение отраслей: колонки как «Which … is right for you?» -->
    <section id="compare" class="ax-sec so-anchor" aria-labelledby="so-cmp-h">
      <div class="ax-wrap ax-head ax-head--center dj-reveal">
        <h2 id="so-cmp-h" class="ax-h2">Сравните отрасли</h2>
      </div>
      <AppleCompare :columns="compareColumns" />
    </section>

    <!-- Как мы работаем: этапы «под ключ» — карусель карточек -->
    <section id="steps" class="ax-sec ax-light so-anchor" aria-labelledby="so-steps-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Комплексный подход «под ключ»</span>
        <h2 id="so-steps-h" class="ax-h2">От замысла до ввода в эксплуатацию</h2>
        <div class="ax-actions"><NuxtLink to="/services" class="ax-link">Все услуги</NuxtLink></div>
      </div>
      <AppleWhy :items="stepCards" />
    </section>

    <!-- CTA -->
    <AppleCta
      title="Обсудим ваш объект"
      lede="Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта."
    >
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Обсудить проект</NuxtLink>
      <a :href="contacts.phoneHref" class="ax-link">{{ contacts.phone }}</a>
    </AppleCta>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { solutions, solutionProjects, solutionEquipment, contacts } from '~/composables/useSiteNav'
import { turnkeyStagesList } from '~/composables/useTurnkeyProcess'
import { useReveal } from '~/composables/useReveal'

const root = ref(null)
useReveal(root)

const counts = Object.fromEntries(solutions.map((s) => [s.slug, {
  projects: solutionProjects(s).length,
  equipment: solutionEquipment(s).length
}]))

// Сравнение отраслей и этапы «под ключ» в форматах apple.com
const compareColumns = solutions.map((s) => ({
  title: s.title,
  text: s.short,
  image: s.cover,
  to: `/solutions/${s.slug}`,
  cta: 'Подробнее',
  more: { to: `/solutions/${s.slug}#equipment`, label: 'Оборудование' },
  rows: [
    counts[s.slug].projects && { value: String(counts[s.slug].projects), label: plural(counts[s.slug].projects, ['ключевой объект', 'ключевых объекта', 'ключевых объектов']) },
    counts[s.slug].equipment && { value: String(counts[s.slug].equipment), label: `${plural(counts[s.slug].equipment, ['вид', 'вида', 'видов'])} оборудования` }
  ].filter(Boolean)
}))
const stepCards = turnkeyStagesList.map((st) => ({ kicker: st.num, title: st.title, text: st.desc, to: `/services/process/${st.slug}` }))

function plural (n, f) {
  const a = n % 100, b = n % 10
  if (a > 10 && a < 20) return f[2]
  if (b === 1) return f[0]
  if (b > 1 && b < 5) return f[1]
  return f[2]
}

// Ролик в ряду оживает только при наведении мышью и без «уменьшения движения»
const canHover = ref(false)
onMounted(() => {
  canHover.value = matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches
})
const play = (e) => { const v = e.currentTarget.querySelector('video'); v && v.play().catch(() => {}) }
const pause = (e) => { const v = e.currentTarget.querySelector('video'); v && v.pause() }

const jump = (href) => {
  const el = document.querySelector(href)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56 - 52, behavior: 'smooth' })
}

const ogOrigin = useRuntimeConfig().public.ogOrigin
const desc = solutions.map((s) => `${s.title}: ${s.short.toLowerCase()}`).join('. ') + '.'
useHead({
  title: 'Решения для бизнеса | ESP',
  meta: [
    { name: 'description', content: desc },
    { property: 'og:title', content: 'Решения для бизнеса | ESP' },
    { property: 'og:description', content: desc },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/solutions' }]
})
</script>

<style scoped src="../../components/apple/apple.css"></style>
<style scoped>
.so { background: #fff; }
.so-anchor { scroll-margin-top: 108px; }
.so-fields { padding-top: clamp(80px, 11vw, 160px); }

/* Баннеры отраслей: прежняя раскладка (кадр + текст), типографика apple.com */
.so-rows { display: grid; gap: 12px; padding: 0 12px 12px; }
.so-row { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 12px; min-height: clamp(460px, 46vw, 680px); }
.so-row--flip .so-row__media { order: 2; }
.so-row__media { position: relative; display: block; overflow: hidden; background: #0b0d10; }
.so-row__media img, .so-row__media video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.so-row__media:hover img, .so-row__media:hover video { transform: scale(1.03); }
.so-row__copy { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: clamp(32px, 4.5vw, 72px); background: #f5f5f7; }
.so-row__eyebrow { font-size: clamp(17px, 1.5vw, 21px); line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #6e6e73; }
.so-row__title { margin: 8px 0 0; font-size: clamp(32px, 3.6vw, 48px); line-height: 1.08; font-weight: 600; letter-spacing: -0.003em; color: #1d1d1f; text-wrap: balance; }
.so-row__lede { margin: 16px 0 0; max-width: 34em; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.so-row__nums { display: flex; gap: 40px; margin: 28px 0 0; padding: 0; list-style: none; }
.so-row__nums li { display: grid; gap: 4px; }
.so-row__nums b { font-size: clamp(40px, 4vw, 56px); line-height: 1.07; font-weight: 600; letter-spacing: -0.005em; background: linear-gradient(90deg, #002366 0%, #0a62c9 100%); -webkit-background-clip: text; background-clip: text; color: transparent; font-variant-numeric: tabular-nums; }
.so-row__nums span { font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }
.so-row__links { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 28px; margin-top: 32px; }

@media (max-width: 899px) {
  .so-row { grid-template-columns: 1fr; min-height: 0; }
  .so-row--flip .so-row__media { order: 0; }
  .so-row__media { aspect-ratio: 4 / 3; }
}
@media (max-width: 767px) {
  .so-rows { padding: 0 8px 8px; gap: 8px; }
  .so-row { gap: 0; }
  .so-row__copy { padding: 32px 24px 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .so-row__media img, .so-row__media video { transition: none; }
}
</style>

<template>
  <div id="top" ref="root" class="so">
    <!-- Первый экран: светлое небо, заголовок слева, ниже четыре отрасли раскрывающимися панелями -->
    <section class="so-hero">
      <div class="so-hero__copy">
        <p class="so-hero__eyebrow">ESP</p>
        <h1 class="so-hero__title">Решения для бизнеса</h1>
        <p class="so-hero__lede">Очистные сооружения под задачи отрасли: от водоканалов до частных домов.</p>
        <div class="so-hero__act">
          <a href="#fields" class="so-hero__btn" @click.prevent="jump('#fields')">Выбрать отрасль</a>
          <NuxtLink to="/contacts#contact-form" class="so-hero__btn so-hero__btn--line">Обсудить проект</NuxtLink>
        </div>
      </div>
      <div class="so-hero__panels">
        <NuxtLink
          v-for="(s, i) in solutions"
          :key="s.slug"
          :to="`/solutions/${s.slug}`"
          class="so-pn"
          :class="{ 'is-open': heroOpen === i }"
          @mouseenter="heroOpen = i"
          @focus="heroOpen = i"
        >
          <img :src="s.banner || s.cover" :alt="s.title" :loading="i ? 'lazy' : 'eager'" decoding="async" />
          <span class="so-pn__shade" />
          <span class="so-pn__text">
            <b>{{ s.title }}</b>
            <small>{{ s.short }}</small>
          </span>
          <span class="so-pn__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg></span>
        </NuxtLink>
      </div>
    </section>

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
          <NuxtLink :to="`/solutions/${s.slug}`" class="so-row__media" :aria-label="s.title">
            <img :src="s.banner || s.cover" :alt="s.title" loading="lazy" decoding="async" />
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
const heroOpen = ref(0)
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
const STEP_IMG = {
  '3d-bim-design': '/images/services/station-model.webp',
  'training-support': '/images/services/steps/service.webp'
}
const stepCards = turnkeyStagesList.map((st) => ({ kicker: st.num, title: st.title, text: st.desc, to: `/services/process/${st.slug}`, cover: STEP_IMG[st.slug] || `/images/services/steps/${st.slug}.webp` }))

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
.so-row__media { position: relative; display: block; overflow: hidden; border-radius: 24px; background: #dbe9f8; }
.so-row__media img, .so-row__media video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.so-row__media:hover img, .so-row__media:hover video { transform: scale(1.03); }
.so-row__copy { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: clamp(32px, 4.5vw, 72px); border-radius: 24px; background: #f5f5f7; }
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

/* Первый экран «Решения для бизнеса» */
.so-hero { padding: clamp(40px, 6vw, 88px) 0 clamp(48px, 6vw, 88px); background: linear-gradient(180deg, #d9e8f8 0%, #eef5fc 55%, #f5f5f7 100%); font-family: var(--dj-font); }
.so-hero__copy { width: min(1200px, calc(100% - 48px)); margin: 0 auto; }
.so-hero__eyebrow { margin: 0; font-size: clamp(17px, 1.4vw, 21px); font-weight: 600; color: #0a3a8c; }
.so-hero__title { margin: 8px 0 0; font-size: clamp(44px, 6.4vw, 88px); line-height: 1.02; font-weight: 700; letter-spacing: -0.025em; color: #111; }
.so-hero__lede { margin: 16px 0 0; max-width: 30em; font-size: clamp(18px, 1.6vw, 22px); line-height: 1.35; color: #2b2f36; }
.so-hero__act { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.so-hero__btn { display: inline-flex; align-items: center; min-height: 48px; padding: 0 28px; border-radius: 980px; font-size: 17px; color: #fff; background: #0a3a8c; box-shadow: 0 8px 18px -10px rgba(0, 35, 102, 0.6); transition: background-color 0.25s ease; }
.so-hero__btn:hover { background: #002366; }
.so-hero__btn--line { color: #0a5bd6; background: rgba(255, 255, 255, 0.6); box-shadow: inset 0 0 0 1.5px #2f7ff0; }
.so-hero__panels { display: flex; gap: 14px; width: min(1440px, calc(100% - 32px)); height: clamp(380px, 48vh, 560px); margin: clamp(36px, 4vw, 56px) auto 0; }
.so-pn { position: relative; flex: 1 1 0; min-width: 0; overflow: hidden; border-radius: 26px; color: #fff; isolation: isolate; box-shadow: 0 18px 40px -26px rgba(0, 35, 102, 0.45); transition: flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.so-pn.is-open { flex-grow: 2.6; }
.so-pn img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: 65% bottom; transform: scale(1.04); transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.so-pn.is-open img { transform: scale(1); }
.so-pn__shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 20, 50, 0) 45%, rgba(0, 20, 50, 0.55) 100%); }
.so-pn__text { position: absolute; left: 22px; right: 70px; bottom: 22px; display: grid; gap: 4px; }
.so-pn__text b { font-size: clamp(19px, 1.6vw, 26px); line-height: 1.15; font-weight: 600; letter-spacing: -0.01em; text-shadow: 0 1px 14px rgba(0, 0, 0, 0.3); }
.so-pn__text small { font-size: 15px; line-height: 1.35; color: rgba(255, 255, 255, 0.9); max-height: 0; opacity: 0; overflow: hidden; transition: opacity 0.4s ease, max-height 0.5s ease; }
.so-pn.is-open .so-pn__text small { max-height: 3em; opacity: 1; transition-delay: 0.2s; }
.so-pn__go { position: absolute; right: 18px; bottom: 18px; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; color: #111; background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.so-pn__go svg { width: 18px; height: 18px; }
@media (max-width: 900px) {
  .so-hero__panels { overflow-x: auto; scroll-snap-type: x mandatory; height: 420px; padding-bottom: 6px; scrollbar-width: none; }
  .so-hero__panels::-webkit-scrollbar { display: none; }
  .so-pn, .so-pn.is-open { flex: 0 0 78%; scroll-snap-align: center; }
  .so-pn__text small { max-height: 3em; opacity: 1; }
}
</style>

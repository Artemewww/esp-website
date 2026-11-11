<template>
  <div id="top" ref="root" class="so">
    <!-- Первый экран: светлое небо, заголовок слева, ниже четыре отрасли раскрывающимися панелями -->
    <section id="fields" class="so-hero so-anchor" aria-labelledby="so-h">
      <div class="so-hero__copy">
        <p class="so-hero__eyebrow">ESP</p>
        <h1 id="so-h" class="so-hero__title">Решения для&nbsp;бизнеса</h1>
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
            <small class="so-pn__eyebrow">{{ s.short }}</small>
            <b>{{ s.title }}</b>
            <span class="so-pn__more">
              <span class="so-pn__lede">{{ s.lede }}</span>
              <span v-if="counts[s.slug].projects || counts[s.slug].equipment" class="so-pn__nums">
                <span v-if="counts[s.slug].projects"><b>{{ counts[s.slug].projects }}</b><i>{{ plural(counts[s.slug].projects, ['ключевой объект', 'ключевых объекта', 'ключевых объектов']) }}</i></span>
                <span v-if="counts[s.slug].equipment"><b>{{ counts[s.slug].equipment }}</b><i>{{ plural(counts[s.slug].equipment, ['вид', 'вида', 'видов']) }} оборудования</i></span>
              </span>
              <span class="so-pn__cta">Подробнее</span>
            </span>
          </span>
          <span class="so-pn__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg></span>
        </NuxtLink>
      </div>
    </section>

    <AppleSubBar
      title="Решения"
      :links="[{ href: '#fields', label: 'Отрасли' }, { href: '#steps', label: 'Под ключ' }]"
      :cta="{ to: '/contacts#contact-form', label: 'Обсудить проект' }"
    />

    <!-- Как мы работаем: этапы «под ключ» — карусель карточек -->
    <section id="steps" class="ax-sec ax-light so-anchor" aria-labelledby="so-steps-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Комплексный подход «под ключ»</span>
        <h2 id="so-steps-h" class="ax-h2">От замысла до ввода в эксплуатацию</h2>
        <div class="ax-actions"><NuxtLink to="/services" class="ax-link">Все услуги</NuxtLink></div>
      </div>
      <AppleWhy :items="stepCards" />
    </section>

    <!-- CTA -->
    <AppleCta
      title="Обсудим ваш объект"
      lede="Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта."
    >
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Обсудить проект</NuxtLink>
      <a :href="contacts.phoneHref" class="ax-link">{{ contacts.phone }}</a>
    </AppleCta>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const heroOpen = ref(0)
import { solutions, solutionProjects, solutionEquipment, contacts } from '~/composables/useSiteNav'
import { turnkeyStagesList } from '~/composables/useTurnkeyProcess'
import { useReveal } from '~/composables/useReveal'

const root = ref(null)
useReveal(root)

const counts = Object.fromEntries(solutions.map((s) => [s.slug, {
  projects: solutionProjects(s).length,
  equipment: solutionEquipment(s).length
}]))

const STEP_IMG = {
  '3d-bim-design': '/images/services/station-model.webp',
  'own-production': '/images/services/steps/own-production-v2.webp',
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
/* Первый экран «Решения для бизнеса» */
.so-hero { padding: clamp(40px, 6vw, 88px) 0 clamp(48px, 6vw, 88px); background: linear-gradient(180deg, #d9e8f8 0%, #eef5fc 55%, #EDEDED 100%); font-family: var(--dj-font); }
.so-hero__copy { width: min(1200px, calc(100% - 48px)); margin: 0 auto; }
.so-hero__eyebrow { margin: 0; font-size: clamp(17px, 1.4vw, 21px); font-weight: 600; color: #002366; }
.so-hero__title { margin: 8px 0 0; font-size: clamp(44px, 6.4vw, 88px); line-height: 1.02; font-weight: 700; letter-spacing: -0.025em; color: #1A1A1A; }
.so-hero__panels { display: flex; gap: 12px; width: calc(100% - 24px); height: max(560px, calc(100svh - 150px)); margin: clamp(28px, 3vw, 44px) auto 0; }
.so-pn { position: relative; flex: 1 1 0; min-width: 0; overflow: hidden; border-radius: var(--r-lg); color: #fff; isolation: isolate; box-shadow: var(--sh-2); transition: flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.so-pn.is-open { flex-grow: 3.2; }
.so-pn img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: 65% bottom; transform: scale(1.04); transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.so-pn.is-open img { transform: scale(1); }
.so-pn__shade { position: absolute; inset: 0; z-index: -1; background: var(--scrim-b); }
.so-pn__text { position: absolute; left: clamp(22px, 2.6vw, 44px); right: 80px; bottom: clamp(22px, 2.6vw, 44px); display: grid; gap: 6px; }
.so-pn__eyebrow { font-size: 15px; font-weight: 600; color: rgba(255, 255, 255, 0.85); }
.so-pn__text > b { font-size: clamp(20px, 2.2vw, 40px); line-height: 1.08; font-weight: 600; letter-spacing: -0.015em; text-shadow: 0 1px 14px rgba(0, 0, 0, 0.3); text-wrap: balance; }
.so-pn__more { display: grid; gap: 20px; max-width: 38em; max-height: 0; opacity: 0; overflow: hidden; transition: opacity 0.4s ease, max-height 0.6s ease; }
.so-pn.is-open .so-pn__more { max-height: 22em; opacity: 1; transition-delay: 0.25s; }
.so-pn__lede { margin-top: 6px; font-size: 17px; line-height: 1.47; color: rgba(255, 255, 255, 0.92); }
.so-pn__nums { display: flex; gap: 36px; }
.so-pn__nums > span { display: grid; gap: 2px; }
.so-pn__nums b { font-size: clamp(36px, 3.4vw, 52px); line-height: 1.05; font-weight: 600; font-variant-numeric: tabular-nums; }
.so-pn__nums i { font-style: normal; font-size: 14px; color: rgba(255, 255, 255, 0.82); }
.so-pn__cta { justify-self: start; display: inline-flex; align-items: center; min-height: 44px; padding: 0 22px; border-radius: var(--r-pill); font-size: 16px; color: #1A1A1A; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.so-pn__go { position: absolute; right: 22px; bottom: 22px; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; color: #1A1A1A; background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.so-pn__go svg { width: 18px; height: 18px; }
.so-pn:not(.is-open) .so-pn__eyebrow { opacity: 0; }
@media (max-width: 900px) {
  .so-hero__panels { flex-direction: column; height: auto; width: calc(100% - 16px); gap: 8px; }
  .so-pn, .so-pn.is-open { flex: none; min-height: min(78svh, 560px); border-radius: var(--r-md); }
  .so-pn__text { right: 24px; bottom: 80px; }
  .so-pn:not(.is-open) .so-pn__eyebrow { opacity: 1; }
  .so-pn__more { max-height: none; opacity: 1; gap: 16px; }
  .so-pn__cta { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .so-pn, .so-pn img, .so-pn__more { transition: none; }
}
</style>
<style scoped>
.so { background: #fff; }
.so-anchor { scroll-margin-top: 108px; }
/* Первый экран «Решения для бизнеса» */
.so-hero { padding: clamp(40px, 6vw, 88px) 0 clamp(48px, 6vw, 88px); background: linear-gradient(180deg, #d9e8f8 0%, #eef5fc 55%, #EDEDED 100%); font-family: var(--dj-font); }
.so-hero__copy { width: min(1200px, calc(100% - 48px)); margin: 0 auto; }
.so-hero__eyebrow { margin: 0; font-size: clamp(17px, 1.4vw, 21px); font-weight: 600; color: #002366; }
.so-hero__title { margin: 8px 0 0; font-size: clamp(44px, 6.4vw, 88px); line-height: 1.02; font-weight: 700; letter-spacing: -0.025em; color: #1A1A1A; }
.so-hero__panels { display: flex; gap: 14px; width: min(1440px, calc(100% - 32px)); height: clamp(380px, 48vh, 560px); margin: clamp(36px, 4vw, 56px) auto 0; }
.so-pn { position: relative; flex: 1 1 0; min-width: 0; overflow: hidden; border-radius: var(--r-lg); color: #fff; isolation: isolate; box-shadow: var(--sh-2); transition: flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.so-pn.is-open { flex-grow: 2.6; }
.so-pn img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: 65% bottom; transform: scale(1.04); transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.so-pn.is-open img { transform: scale(1); }
.so-pn__shade { position: absolute; inset: 0; z-index: -1; background: var(--scrim-b); }
.so-pn__text { position: absolute; left: 22px; right: 70px; bottom: 22px; display: grid; gap: 4px; }
.so-pn__text b { font-size: clamp(19px, 1.6vw, 26px); line-height: 1.15; font-weight: 600; letter-spacing: -0.01em; text-shadow: 0 1px 14px rgba(0, 0, 0, 0.3); }
.so-pn__text small { font-size: 15px; line-height: 1.35; color: rgba(255, 255, 255, 0.9); max-height: 0; opacity: 0; overflow: hidden; transition: opacity 0.4s ease, max-height 0.5s ease; }
.so-pn.is-open .so-pn__text small { max-height: 3em; opacity: 1; transition-delay: 0.2s; }
.so-pn__go { position: absolute; right: 18px; bottom: 18px; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; color: #1A1A1A; background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.so-pn__go svg { width: 18px; height: 18px; }
@media (max-width: 900px) {
  .so-hero__panels { overflow-x: auto; scroll-snap-type: x mandatory; height: 420px; padding-bottom: 6px; scrollbar-width: none; }
  .so-hero__panels::-webkit-scrollbar { display: none; }
  .so-pn, .so-pn.is-open { flex: 0 0 78%; scroll-snap-align: center; }
  .so-pn__text small { max-height: 3em; opacity: 1; }
}
</style>

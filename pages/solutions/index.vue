<template>
  <div ref="root" class="so">
    <!-- Первый экран: кадр объекта во весь экран, заголовок сверху по центру -->
    <DjPageHero
      eyebrow="ESP"
      title="Решения для бизнеса"
      :lede="solutions.map((s) => s.title).join(' · ')"
      :video="solutions[0].video"
      :image="solutions[0].cover"
      align="left"
    >
      <a href="#fields" class="dj-btn dj-btn--glass" @click.prevent="jump('#fields')">Выбрать отрасль</a>
      <NuxtLink to="/contacts#contact-form" class="dj-more dj-more--light">Оставить заявку</NuxtLink>
    </DjPageHero>

    <!-- Отрасли: широкие ряды, кадр и текст чередуются сторонами -->
    <section id="fields" class="so-fields" aria-labelledby="so-fields-h">
      <div class="dj-wrap dj-center so-head dj-reveal">
        <h2 id="so-fields-h" class="dj-h2">Отрасли</h2>
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
            <span class="dj-eyebrow">{{ s.short }}</span>
            <h3 class="so-row__title">{{ s.title }}</h3>
            <p class="so-row__lede">{{ s.lede }}</p>
            <ul v-if="counts[s.slug].projects || counts[s.slug].equipment" class="so-row__nums">
              <li v-if="counts[s.slug].projects"><b>{{ counts[s.slug].projects }}</b><span>{{ plural(counts[s.slug].projects, ['ключевой объект', 'ключевых объекта', 'ключевых объектов']) }}</span></li>
              <li v-if="counts[s.slug].equipment"><b>{{ counts[s.slug].equipment }}</b><span>{{ plural(counts[s.slug].equipment, ['вид', 'вида', 'видов']) }} оборудования</span></li>
            </ul>
            <div class="so-row__links">
              <NuxtLink :to="`/solutions/${s.slug}`" class="dj-btn">Подробнее</NuxtLink>
              <NuxtLink :to="`/solutions/${s.slug}#equipment`" class="dj-more">Оборудование</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Как мы работаем: этапы «под ключ» со страницы услуг -->
    <section class="dj-sec dj-sec--soft so-steps" aria-labelledby="so-steps-h">
      <div class="dj-wrap dj-center dj-reveal">
        <span class="dj-eyebrow">Комплексный подход «под ключ»</span>
        <h2 id="so-steps-h" class="dj-h2 so-steps__h">От замысла до кристальной воды</h2>
        <div class="dj-links"><NuxtLink to="/services" class="dj-more">Все услуги</NuxtLink></div>
      </div>
      <ol class="so-steps__list">
        <li v-for="st in turnkeyStagesList" :key="st.slug" class="dj-reveal">
          <NuxtLink :to="`/services/process/${st.slug}`" class="so-step">
            <span class="so-step__num">{{ st.num }}</span>
            <b class="so-step__title">{{ st.title }}</b>
            <span class="so-step__desc">{{ st.desc }}</span>
            <span class="dj-more so-step__more">Подробнее</span>
          </NuxtLink>
        </li>
      </ol>
    </section>

    <!-- CTA -->
    <section class="dj-sec dj-center so-cta">
      <div class="dj-wrap dj-reveal">
        <h2 class="dj-h1">Обсудим ваш объект</h2>
        <p class="dj-lede so-cta__lede">
          Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта.
        </p>
        <div class="dj-links so-cta__act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg">Оставить заявку</NuxtLink>
          <a :href="contacts.phoneHref" class="dj-more">{{ contacts.phone }}</a>
        </div>
      </div>
    </section>
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

const plural = (n, f) => {
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
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: 'smooth' })
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

<style scoped>
.so-head { padding: clamp(56px, 7vw, 96px) 24px clamp(24px, 3vw, 36px); }

/* Ряды отраслей: квадратные края, зазор 12px, как плитки DJI */
.so-rows { display: grid; gap: 12px; padding: 0 12px 12px; }
.so-row { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 12px; min-height: clamp(460px, 46vw, 680px); }
.so-row--flip .so-row__media { order: 2; }
.so-row__media { position: relative; display: block; overflow: hidden; background: #0b0d10; }
.so-row__media img, .so-row__media video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.so-row__media:hover img, .so-row__media:hover video { transform: scale(1.03); }
.so-row__copy { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: clamp(32px, 4.5vw, 72px); background: linear-gradient(180deg, #f6f7f9 0%, #e9ecef 100%); }
.so-row__title { margin-top: 8px; font-size: clamp(30px, 3.4vw, 48px); line-height: 1.08; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-ink); }
.so-row__lede { margin-top: 16px; max-width: 44ch; font-size: clamp(16px, 1.25vw, 18px); line-height: 1.55; color: var(--dj-text); }
.so-row__nums { display: flex; gap: 36px; margin: 28px 0 0; padding: 0; list-style: none; }
.so-row__nums li { display: grid; gap: 4px; }
.so-row__nums b { font-size: clamp(36px, 3.6vw, 52px); line-height: 1; font-weight: 300; letter-spacing: -0.03em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.so-row__nums span { font-size: 13px; color: var(--dj-muted); }
.so-row__links { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 22px; margin-top: 32px; }

/* Этапы: лента карточек, на телефоне листается */
.so-steps__h { margin-top: 6px; }
.so-steps__list { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 12px; max-width: 1440px; margin: clamp(32px, 4vw, 48px) auto 0; padding: 0 12px; list-style: none; }
.so-steps__list > li { display: flex; }
.so-step { display: flex; flex-direction: column; gap: 10px; width: 100%; padding: 24px 20px; background: #fff; color: var(--dj-text); transition: box-shadow 0.3s ease, transform 0.4s var(--dj-ease); }
.so-step:hover { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); transform: translateY(-2px); }
.so-step__num { font-size: 40px; line-height: 1; font-weight: 200; letter-spacing: -0.03em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.so-step__title { margin-top: 8px; font-size: 16px; line-height: 1.3; font-weight: 600; color: var(--dj-ink); }
.so-step__desc { font-size: 13px; line-height: 1.5; color: var(--dj-muted); }
.so-step__more { margin-top: auto; padding-top: 6px; font-size: 14px; }

.so-cta__lede { max-width: 56ch; margin-top: 16px; }
.so-cta__act { margin-top: 28px; }

@media (max-width: 1279px) {
  .so-steps__list { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: minmax(220px, 1fr); overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 4px; }
  .so-steps__list::-webkit-scrollbar { display: none; }
  .so-steps__list > li { scroll-snap-align: start; }
}
@media (max-width: 899px) {
  .so-row { grid-template-columns: 1fr; min-height: 0; }
  .so-row--flip .so-row__media { order: 0; }
  .so-row__media { aspect-ratio: 4 / 3; }
}
@media (max-width: 767px) {
  .so-rows { padding: 0 8px 8px; gap: 8px; }
  .so-row { gap: 0; }
  .so-steps__list { padding: 0 8px; gap: 8px; grid-auto-columns: 78%; }
}
@media (prefers-reduced-motion: reduce) {
  .so-row__media img, .so-row__media video, .so-step { transition: none; }
}
</style>

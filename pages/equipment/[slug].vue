<template>
  <!-- Страница оборудования в подаче Watergen (product-page): первый экран с
       огромным названием и рендером, ключевые параметры колонками, фото и
       ролик с объектов, таблица характеристик, «где работает», финал.
       Блоки без данных у конкретной позиции не показываются. -->
  <div v-if="product" class="wgp">
    <section class="wgp-hero">
      <div class="wgp-hero-copy">
        <NuxtLink to="/equipment" class="wgp-back">← Всё оборудование</NuxtLink>
        <h1 class="wgp-title">{{ product.name }}</h1>
        <p v-if="cap" class="wgp-sub">
          <template v-if="cap.num">{{ cap.prefix }} {{ cap.num }} {{ cap.unit }}<span v-if="cap.rest"> {{ cap.rest }}</span></template>
          <template v-else>{{ cap.text }}</template>
        </p>
        <p class="wgp-app">{{ product.application }}</p>
        <p class="wgp-desc">{{ product.desc }}</p>
        <div class="wgp-actions">
          <NuxtLink to="/contacts#contact-form" class="wg-pill wg-pill--solid">
            Запросить КП
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </NuxtLink>
          <a v-if="product.specs?.length" href="#specs" class="wg-pill wg-pill--ghost">Характеристики</a>
        </div>
      </div>
      <!-- Рендер на белом фоне кладём на белую плашку: края вырезки не видны.
           Где рендера ещё нет — серая иконка типа оборудования -->
      <div class="wgp-hero-media" :class="{ 'is-empty': !render }">
        <img v-if="render" :src="render" :alt="product.name" fetchpriority="high" decoding="async" />
        <EquipPlaceholder v-else :kind="placeholderOf(product)" />
      </div>
    </section>

    <!-- «Why GENNY+?»: подробное описание и ключевые параметры колонками -->
    <section class="wgp-sec wgp-center">
      <span class="wg-label">О решении</span>
      <h2 class="wg-h2 wgp-mt">{{ product.name }}</h2>
      <div class="wgp-long">
        <p v-for="(para, i) in descParagraphs" :key="i">{{ para }}</p>
      </div>
      <ul v-if="keySpecs.length" class="wgp-why">
        <li v-for="s in keySpecs" :key="s.label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.5l2.3 2.3 4.7-5" /></svg>
          <b>{{ s.label }}</b>
          <span>{{ s.value }}</span>
        </li>
      </ul>
    </section>

    <!-- Галерея: фото объектов, где стоит это оборудование -->
    <section v-if="gallery.length" class="wgp-gallery" aria-label="Фото с объектов">
      <div ref="track" class="wgp-track">
        <figure v-for="g in gallery" :key="g.src" class="wgp-shot">
          <img :src="g.src" :alt="g.alt" loading="lazy" decoding="async" />
        </figure>
      </div>
    </section>

    <!-- «The Film»: ролик с объекта, если он есть у связанного проекта -->
    <section v-if="film" class="wgp-sec wgp-center">
      <span class="wg-label">Ролик с объекта</span>
      <div class="wgp-film">
        <video :poster="film.poster" controls preload="none" playsinline>
          <source :src="film.video" type="video/mp4" />
        </video>
        <p class="wgp-film-cap">{{ film.name }}</p>
      </div>
    </section>

    <section v-if="product.specs?.length" id="specs" class="wgp-sec wgp-center">
      <h2 class="wg-h2">Технические характеристики</h2>
      <dl class="wgp-specs">
        <div v-for="s in product.specs" :key="s.label" class="wgp-spec">
          <dt>{{ s.label }}</dt>
          <dd>{{ s.value }}</dd>
        </div>
      </dl>
    </section>

    <!-- «Built for the spaces…»: объекты, где работает это оборудование -->
    <section v-if="related.length" class="wgp-sec wgp-center">
      <span class="wg-label">Где работает</span>
      <h2 class="wg-h2 wgp-mt">Проекты с этим оборудованием</h2>
      <div class="wgp-where">
        <NuxtLink v-for="p in related" :key="p.slug" :to="`/projects/${p.slug}`" class="wgp-where-card">
          <img :src="cover(p)" :alt="p.name" loading="lazy" decoding="async" />
          <b>{{ p.name }}</b>
          <span>{{ p.location }}<template v-if="p.capacity"> · {{ p.capacity }}</template></span>
          <i>Подробнее →</i>
        </NuxtLink>
      </div>
      <NuxtLink to="/projects" class="wgp-link">Все проекты →</NuxtLink>
    </section>

    <section class="wgp-cta">
      <WgSky class="wgp-cta-sky" />
      <h2 class="wgp-cta-title">Готовы<br /><span>к сотрудничеству?</span></h2>
      <div class="wgp-cta-actions">
        <NuxtLink to="/contacts#contact-form" class="wg-pill wg-pill--solid">
          Обсудить проект
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
        <NuxtLink to="/equipment" class="wg-pill wg-pill--ghost">Всё оборудование</NuxtLink>
      </div>
      <p class="wgp-cta-note">Гарантия до 5 лет · Коммерческое предложение за 24 часа</p>
    </section>
  </div>

  <div v-else class="wgp-missing">
    <h1 class="wg-h2">Оборудование не найдено</h1>
    <NuxtLink to="/equipment" class="wg-pill wg-pill--solid">Всё оборудование</NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjects } from '~/composables/useProjects'
import { splitCapacity } from '~/utils/equipCapacity'
import { renderOf, placeholderOf } from '~/utils/equipVisual'

const { getBySlug } = useEquipment()
const { projects } = useProjects()
const route = useRoute()
const product = computed(() => getBySlug(route.params.slug))
const photo = computed(() => product.value?.photo || product.value?.image)
const render = computed(() => renderOf(product.value))
const cap = computed(() => splitCapacity(product.value?.capacity))
const descParagraphs = computed(() => (product.value?.longDesc || product.value?.desc || '').split('\n\n'))
// Первые четыре характеристики — ключевые параметры колонками
const keySpecs = computed(() => (product.value?.specs || []).slice(0, 4))

// Связанные объекты: в каталоге ссылки бывают длиннее слага проекта
// («krichev-vodokanal» → «krichev»), поэтому сверяем и по началу
const related = computed(() => {
  const refs = product.value?.relatedProjects || []
  return projects.value.filter((p) => refs.some((r) => r === p.slug || r.startsWith(p.slug + '-')))
})
const cover = (p) => (Array.isArray(p.gallery) && p.gallery[0]) || p.poster || p.image
const gallery = computed(() => related.value.flatMap((p) => (Array.isArray(p.gallery) ? p.gallery : []).slice(0, 4).map((src) => ({ src, alt: p.name }))))
const film = computed(() => related.value.find((p) => p.video))

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead(() => ({
  title: product.value ? `${product.value.name} | Оборудование ESP` : 'Оборудование не найдено | ESP',
  meta: [
    { name: 'description', content: product.value ? `${product.value.desc} Технические характеристики и расчёт под ваш объект.` : '' },
    { property: 'og:title', content: product.value ? product.value.name : '' },
    { property: 'og:description', content: product.value ? product.value.desc : '' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: product.value ? `https://ecoservisproekt.by/equipment/${product.value.slug}` : '' }]
}))

useSchemaOrg([
  defineProduct(() => ({
    name: product.value?.name,
    description: product.value?.desc,
    image: product.value ? `${ogOrigin}${photo.value}` : undefined,
    category: product.value?.category,
    brand: 'ESP'
  })),
  defineBreadcrumb(() => ([
    { name: 'Оборудование', item: '/equipment' },
    { name: product.value?.name }
  ]))
])
</script>

<style scoped>
.wgp { background: var(--wg-sky-2); color: var(--wg-text); }
.wgp-hero {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 4rem);
  max-width: 76rem;
  margin: 0 auto;
  padding: clamp(3rem, 6vw, 5rem) 1.5rem clamp(4rem, 7vw, 6rem);
}
.wgp-back { font-size: 14px; font-weight: 400; color: #0b5cad; }
.wgp-title { margin-top: 1rem; font-family: var(--font-sans); font-weight: 700; font-size: clamp(2.2rem, 4.6vw, 4rem); line-height: 1.06; letter-spacing: -0.025em; color: var(--wg-ink); }
.wgp-sub { margin-top: 0.75rem; font-family: var(--font-sans); font-weight: 600; font-size: clamp(1.2rem, 1.8vw, 1.5rem); line-height: 1.25; color: #002366; }
.wgp-app { margin-top: 0.3rem; font-size: 0.9rem; color: var(--wg-muted); }
.wgp-desc { margin-top: 1rem; max-width: 30rem; font-size: 1rem; line-height: 1.6; }
.wgp-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.6rem; }
.wgp-hero-media { aspect-ratio: 5 / 4; border-radius: 28px; overflow: hidden; background: #fff; display: grid; place-items: center; }
.wgp-hero-media img { width: 88%; height: 88%; object-fit: contain; mix-blend-mode: multiply; }
.wgp-hero-media.is-empty { background: #ebebef; }
.wgp-hero-media .eqp { width: 38%; }

.wgp-sec { padding: clamp(3.5rem, 7vw, 6rem) 1.5rem; }
.wgp-sec:nth-of-type(even) { background: #fff; }
.wgp-center { display: flex; flex-direction: column; align-items: center; text-align: center; }
.wgp-mt { margin-top: 0.9rem; max-width: 40rem; }
.wgp-long { max-width: 46rem; margin-top: 1.4rem; display: grid; gap: 0.9rem; font-size: 1rem; line-height: 1.7; color: var(--wg-text); text-align: left; }
.wgp-why { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.75rem; max-width: 64rem; width: 100%; margin-top: 3.5rem; list-style: none; padding: 0; text-align: left; }
.wgp-why li { display: grid; gap: 0.4rem; align-content: start; }
.wgp-why svg { width: 26px; height: 26px; color: var(--wg-label); margin-bottom: 0.3rem; }
.wgp-why b { font-size: 0.98rem; color: var(--wg-ink); }
.wgp-why span { font-size: 0.9rem; line-height: 1.5; color: var(--wg-text); }

.wgp-gallery { padding: 0 0 clamp(3rem, 6vw, 5rem); }
.wgp-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(18rem, 42vw, 38rem);
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 0 max(1.5rem, calc((100% - 76rem) / 2 + 1.5rem));
  scroll-padding-left: max(1.5rem, calc((100% - 76rem) / 2 + 1.5rem));
  scrollbar-width: none;
}
.wgp-track::-webkit-scrollbar { display: none; }
.wgp-shot { scroll-snap-align: start; aspect-ratio: 16 / 10; border-radius: 22px; overflow: hidden; }
.wgp-shot img { width: 100%; height: 100%; object-fit: cover; }

.wgp-film { width: 100%; max-width: 64rem; margin-top: 1.4rem; }
.wgp-film video { width: 100%; aspect-ratio: 16 / 9; border-radius: 22px; background: #1d1d1f; }
.wgp-film-cap { margin-top: 0.8rem; font-size: 0.9rem; color: var(--wg-muted); }

.wgp-specs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 3rem;
  width: 100%;
  max-width: 64rem;
  margin-top: 2.5rem;
  text-align: left;
}
.wgp-spec { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--wg-line); }
.wgp-spec dt { font-size: 13px; font-weight: 500; color: var(--wg-muted); }
.wgp-spec dd { font-size: 0.95rem; line-height: 1.45; color: var(--wg-ink); }

.wgp-where { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 22rem)); justify-content: center; gap: 1.25rem; width: 100%; margin-top: 2.5rem; }
.wgp-where-card { display: grid; gap: 0.35rem; padding: 0.75rem 0.75rem 1.1rem; border-radius: 18px; background: #fff; text-align: left; }
.wgp-where-card img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; border-radius: 16px; margin-bottom: 0.4rem; }
.wgp-where-card b { padding: 0 0.4rem; font-size: 1rem; color: var(--wg-ink); }
.wgp-where-card span { padding: 0 0.4rem; font-size: 0.88rem; color: var(--wg-muted); }
.wgp-where-card i { padding: 0 0.4rem; font-style: normal; font-size: 13.5px; font-weight: 600; color: var(--wg-label); }
.wgp-link { margin-top: 1.75rem; font-size: 15px; color: #0b5cad; }

.wgp-cta { position: relative; overflow: hidden; padding: clamp(3.5rem, 7vw, 6rem) 1.5rem; text-align: center; background: #fff; }
.wgp-cta-sky { display: none; }
.wgp-cta-title { position: relative; font-family: var(--font-sans); font-weight: 700; font-size: clamp(2rem, 3.6vw, 2.8rem); line-height: 1.12; letter-spacing: -0.025em; color: var(--wg-ink); }
.wgp-cta-title span { color: var(--wg-muted); }
.wgp-cta-actions { position: relative; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
.wgp-cta-note { position: relative; margin-top: 1rem; font-size: 0.85rem; color: var(--wg-muted); }

.wgp-missing { min-height: 60vh; display: grid; place-content: center; justify-items: center; gap: 1.5rem; }

@media (max-width: 899px) {
  .wgp-hero { grid-template-columns: 1fr; }
  .wgp-hero-media { order: -1; }
  .wgp-why { grid-template-columns: 1fr 1fr; }
  .wgp-specs { grid-template-columns: 1fr; }
}
@media (max-width: 767px) {
  .wgp-hero { padding-top: 2rem; padding-bottom: 3rem; gap: 1.5rem; }
  .wgp-hero-media { aspect-ratio: 4 / 3; border-radius: 20px; }
  .wgp-center { align-items: flex-start; text-align: left; }
  .wgp-why { margin-top: 2rem; gap: 1.25rem; }
  .wgp-where { grid-template-columns: 1fr; }
  .wgp-cta { text-align: left; }
  .wgp-cta-actions { justify-content: flex-start; }
}
@media (max-width: 540px) {
  .wgp-why { grid-template-columns: 1fr; }
  .wgp-spec { grid-template-columns: 1fr; gap: 0.25rem; }
}
</style>

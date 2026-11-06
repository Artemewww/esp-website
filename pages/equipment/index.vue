<template>
  <!-- Каталог в подаче Apple «Explore the lineup»: светлая страница, белые
       плашки без рамок, под ними название, описание, строка характеристик,
       кнопка-капсула и ссылка; лента листается стрелками и пальцем. -->
  <div class="al">
    <section class="al-sec">
      <div class="al-wrap">
        <div class="al-head">
          <h1 class="al-title">Каталог оборудования ESP.</h1>
          <NuxtLink to="/equipment/compare" class="al-link">Сравнить оборудование ›</NuxtLink>
        </div>
        <p class="al-lede">
          Собственное производство ESP: флотационные установки, станции дозирования реагентов,
          механическая очистка и обезвоживание осадка. Подберём оборудование под состав ваших сточных вод.
        </p>
        <div class="al-tabs" role="tablist" aria-label="Группы оборудования">
          <button
            v-for="t in tabs"
            :key="t"
            type="button"
            role="tab"
            :aria-selected="tab === t"
            class="al-tab"
            :class="{ 'is-on': tab === t }"
            @click="pick(t)"
          >{{ t }}</button>
        </div>
      </div>

      <div id="catalog" ref="track" class="al-track" @scroll.passive="onScroll">
        <article v-for="p in shown" :key="p.slug" class="al-card">
          <NuxtLink :to="`/equipment/${p.slug}`" class="al-tile" :class="{ 'is-empty': !renderOf(p) }" tabindex="-1" :aria-label="p.name">
            <EquipPlaceholder v-if="!renderOf(p)" :kind="placeholderOf(p)" class="al-ph" />
            <img
              v-else
              :src="renderOf(p)"
              :alt="p.name"
              loading="lazy"
              decoding="async"
              class="al-img"
            />
          </NuxtLink>
          <span class="al-cat">{{ p.category }}</span>
          <h2 class="al-name">{{ p.name }}</h2>
          <p class="al-desc">{{ p.desc }}</p>
          <p v-if="p.capacity" class="al-meta">Производительность: {{ p.capacity }}</p>
          <p v-else-if="p.application" class="al-meta">{{ p.application }}</p>
          <div class="al-actions">
            <NuxtLink :to="`/equipment/${p.slug}`" class="al-btn">Подробнее</NuxtLink>
            <NuxtLink to="/contacts#contact-form" class="al-more">Запросить КП ›</NuxtLink>
          </div>
        </article>
      </div>

      <div class="al-wrap al-ctrl">
        <button type="button" class="al-arrow" :disabled="atStart" aria-label="Назад" @click="go(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" class="al-arrow" :disabled="atEnd" aria-label="Вперёд" @click="go(1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
        </button>
      </div>
      <div id="tools"></div>
      <div id="specs"></div>
      <div id="filters"></div>
      <div id="pumps"></div>
    </section>

    <!-- Сервис и поддержка — согласованные тексты без изменений -->
    <section id="support" class="al-sec al-sec--white">
      <div id="docs"></div>
      <div id="parts"></div>
      <div class="al-wrap">
        <h2 class="al-h2">Оборудование ESP — это не покупка. Это партнёрство на весь жизненный цикл.</h2>
        <p class="al-lede">Каждая единица поставляется с полным пакетом документации, гарантийными обязательствами и доступом к инженерной поддержке 24/7.</p>
        <ul class="al-support">
          <li v-for="w in support" :key="w.title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="w.icon" /></svg>
            <b>{{ w.title }}</b>
            <span>{{ w.text }}</span>
          </li>
        </ul>
        <ul class="al-stats">
          <li v-for="s in stats" :key="s.label"><b>{{ s.value }}</b><span>{{ s.label }}</span></li>
        </ul>
      </div>
    </section>

    <section class="al-sec al-cta">
      <h2 class="al-h2">Не знаете, что подойдёт?</h2>
      <p class="al-cta-sub">Подберём оборудование под состав ваших сточных вод.</p>
      <div class="al-actions al-actions--center">
        <NuxtLink to="/contacts#contact-form" class="al-btn">Обсудить проект</NuxtLink>
        <NuxtLink to="/equipment/compare" class="al-more">Сравнить оборудование ›</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { renderOf, placeholderOf } from '~/utils/equipVisual'

const { equipment } = useEquipment()

// Сначала позиции с готовыми рендерами — лента открывается «лицом»
const ordered = computed(() => [...equipment.value].sort((a, b) => (renderOf(b) ? 1 : 0) - (renderOf(a) ? 1 : 0)))
const ALL = 'Всё оборудование'
const tabs = computed(() => [ALL, ...new Set(ordered.value.map((p) => p.category).filter(Boolean))])
const tab = ref(ALL)
const shown = computed(() => (tab.value === ALL ? ordered.value : ordered.value.filter((p) => p.category === tab.value)))

const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
const onScroll = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
}
// Листаем на столько карточек, сколько видно целиком
const go = (dir) => {
  const el = track.value
  const card = el?.querySelector('.al-card')
  if (!card) return
  const w = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 20)
  el.scrollBy({ left: dir * w * Math.max(1, Math.floor(el.clientWidth / w) - 1), behavior: 'smooth' })
}
const pick = async (t) => {
  tab.value = t
  await nextTick()
  if (track.value) track.value.scrollLeft = 0
  onScroll()
}
onMounted(onScroll)

const stats = [
  { value: '5 лет', label: 'гарантии на оборудование' },
  { value: '4 часа', label: 'реакция сервисной службы' },
  { value: '100%', label: 'оборудования с BIM-моделью' },
  { value: '24 часа', label: 'на подготовку КП' }
]
const support = [
  { title: 'Гарантия до 5 лет', text: 'Расширенная гарантия на всё оборудование ESP. SLA реакции — 4 часа. Устранение неисправностей без доп. платы.', icon: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zM9 12l2 2 4-4' },
  { title: 'Склады запасных частей', text: 'Складская программа ESP — 98% запчастей в наличии. Поставка по Беларуси и СНГ в течение 24–48 часов.', icon: 'M3 9l9-5 9 5v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9zM8 20v-6h8v6' },
  { title: 'Техническая документация', text: 'Полный пакет: исполнительные чертежи, схемы автоматизации, паспорта оборудования, инструкции по эксплуатации.', icon: 'M7 3h7l5 5v13H7V3zM14 3v5h5M10 13h6M10 17h6' }
]

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead({
  title: 'Оборудование ESP | Каталог оборудования для очистки сточных вод',
  meta: [
    { name: 'description', content: 'Каталог оборудования ЭкоСервисПроект: флотационные установки, КНС, станции биологической очистки, микрофильтры, ленточные фильтр-прессы, станции дозирования реагентов. Гарантия 5 лет.' },
    { property: 'og:title', content: 'Оборудование ESP | Каталог оборудования для очистки сточных вод' },
    { property: 'og:description', content: 'Флотационные установки, КНС, станции очистки, фильтры и станции дозирования собственного производства ESP. Гарантия 5 лет.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/equipment' }]
})
</script>

<style scoped>
/* Пропорции Apple: светло-серая страница, почти чёрный текст, белые плашки
   без рамок; кнопка — фирменный синий ESP */
.al { --al-bg: #f5f5f7; --al-ink: #1d1d1f; --al-muted: #6e6e73; --al-blue: #002366; --al-link: #0b5cad; background: var(--al-bg); color: var(--al-ink); }
.al-sec { padding: clamp(6.5rem, 9vw, 8rem) 0 clamp(3.5rem, 6vw, 5rem); }
.al-sec + .al-sec { padding-top: clamp(3.5rem, 7vw, 6rem); }
.al-sec--white { background: #fff; }
.al-wrap { max-width: 76rem; margin: 0 auto; padding: 0 1.5rem; }
.al-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem 1.5rem; flex-wrap: wrap; }
.al-title, .al-h2 { font-family: var(--font-sans); font-weight: 700; font-size: clamp(2rem, 3.6vw, 3rem); line-height: 1.08; letter-spacing: -0.025em; color: var(--al-ink); }
.al-h2 { max-width: 46rem; }
.al-link, .al-more { font-size: 15px; color: var(--al-link); white-space: nowrap; }
.al-link:hover, .al-more:hover { text-decoration: underline; }
.al-lede { max-width: 44rem; margin-top: 0.9rem; font-size: 1.05rem; line-height: 1.5; color: var(--al-muted); }

.al-tabs { display: flex; gap: 0.5rem; margin-top: 1.75rem; overflow-x: auto; scrollbar-width: none; padding-bottom: 0.25rem; }
.al-tabs::-webkit-scrollbar { display: none; }
.al-tab { flex: 0 0 auto; padding: 0.5rem 1rem; border-radius: 999px; font-size: 14px; color: var(--al-ink); background: rgba(0, 0, 0, 0.05); transition: background-color 0.2s ease, color 0.2s ease; }
.al-tab:hover { background: rgba(0, 0, 0, 0.09); }
.al-tab.is-on { background: var(--al-ink); color: #fff; }

.al-track {
  --al-pad: max(1.5rem, calc((100% - 76rem) / 2 + 1.5rem));
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(16.5rem, 22vw, 19rem);
  column-gap: 1.25rem;
  margin-top: 2.25rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  padding: 0 var(--al-pad) 0.5rem;
  scroll-padding-left: var(--al-pad);
  scrollbar-width: none;
}
.al-track::-webkit-scrollbar { display: none; }
.al-card { scroll-snap-align: start; display: flex; flex-direction: column; align-items: center; text-align: center; }

/* Белая плашка под рендером, светло-серая — под заглушкой */
.al-tile { position: relative; display: grid; place-items: center; width: 100%; aspect-ratio: 290 / 346; border-radius: 18px; overflow: hidden; background: #fff; }
.al-tile.is-empty { background: #ebebef; }
.al-img {
  width: 86%;
  height: 86%;
  object-fit: contain;
  /* Белый фон рендера сливается с белой плашкой — никаких следов вырезки */
  mix-blend-mode: multiply;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.al-ph { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.al-tile:hover .al-img, .al-tile:hover .al-ph { transform: scale(1.04); }

.al-cat { margin-top: 1.4rem; font-size: 12px; font-weight: 600; color: #2f6fb8; }
.al-name { margin-top: 0.35rem; font-family: var(--font-sans); font-weight: 600; font-size: 1.35rem; line-height: 1.2; letter-spacing: -0.015em; color: var(--al-ink); }
.al-desc { margin-top: 0.6rem; font-size: 14px; font-weight: 600; line-height: 1.4; color: var(--al-ink); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.al-meta { margin-top: 0.7rem; font-size: 12px; line-height: 1.4; color: var(--al-muted); }
.al-actions { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: auto; padding-top: 1.4rem; }
.al-actions--center { margin-top: 1.5rem; padding-top: 0; }
.al-btn { padding: 0.55rem 1.1rem; border-radius: 999px; background: var(--al-blue); color: #fff; font-size: 14px; transition: background-color 0.2s ease; }
.al-btn:hover { background: #0b3a8c; }

.al-ctrl { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1.75rem; }
.al-arrow { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: #e8e8ed; color: var(--al-ink); transition: background-color 0.2s ease, opacity 0.2s ease; }
.al-arrow svg { width: 16px; height: 16px; }
.al-arrow:hover:not(:disabled) { background: #dcdce1; }
.al-arrow:disabled { opacity: 0.4; cursor: default; }

.al-support { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; margin-top: 2.5rem; list-style: none; padding: 0; }
.al-support li { display: grid; gap: 0.5rem; align-content: start; padding: 1.75rem; border-radius: 18px; background: var(--al-bg); }
.al-support svg { width: 28px; height: 28px; color: var(--al-blue); margin-bottom: 0.4rem; }
.al-support b { font-size: 1.1rem; font-weight: 600; }
.al-support span { font-size: 14px; line-height: 1.5; color: var(--al-muted); }
.al-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.25rem; margin-top: 2.5rem; list-style: none; padding: 0; }
.al-stats li { display: grid; gap: 0.25rem; }
.al-stats b { font-size: clamp(1.6rem, 2.6vw, 2.2rem); font-weight: 700; letter-spacing: -0.02em; color: var(--al-blue); }
.al-stats span { font-size: 13px; color: var(--al-muted); }

.al-cta { text-align: center; }
.al-cta .al-h2 { margin: 0 auto; }
.al-cta-sub { margin-top: 0.5rem; font-size: 1.15rem; color: var(--al-muted); }

@media (max-width: 767px) {
  .al-track { grid-auto-columns: 78vw; }
  .al-support { grid-template-columns: 1fr; }
  .al-stats { grid-template-columns: 1fr 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .al-img, .al-ph { transition: none; }
}
</style>

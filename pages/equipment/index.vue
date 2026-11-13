<template>
  <!-- Каталог в подаче DJI Store: белая страница, крупный баннер-флагман,
       фильтр-капсулы по группам, сетка плиток с рендером на светло-сером поле. -->
  <div ref="root" class="eqc" :class="{ 'is-tucked': tucked }">
    <h1 class="eqc-sr">Каталог оборудования ESP</h1>
    <!-- Сверху сразу ряд карточек изделий ESP -->
    <EquipNovRow class="eqc-top" :items="renderedEquipment" />

    <section id="catalog" ref="catEl" class="eqc-cat">
      <!-- Телефон: каталог — меню второго уровня, липнет под шапкой; под ним липнут фильтры -->
      <div class="eqc-bar">
        <span class="eqc-bar__t">Каталог оборудования</span>
        <NuxtLink to="/contacts#form" class="eqc-bar__cta">Подобрать</NuxtLink>
      </div>
      <div class="dj-wrap">
        <!-- Шапка каталога в подаче DJI Product Support: заголовок и капсулы по центру -->
        <div class="eqc-head">
          <h2 class="eqc-h">Каталог оборудования</h2>
          <p class="eqc-sub">
            Собственное производство ESP: флотационные установки, станции дозирования реагентов,
            механическая очистка и обезвоживание осадка. Подберём оборудование под состав ваших сточных вод.
          </p>
          <NuxtLink v-if="compareOn" to="/equipment/compare" class="dj-more">Сравнить оборудование</NuxtLink>
        </div>
        <!-- Слева — группы оборудования с линией-указателем (как DJI Product Support), справа — сетка -->
        <div class="eqc-body">
          <nav ref="sideEl" class="eqc-side" role="tablist" aria-label="Группы оборудования">
            <button
              v-for="t in tabs"
              :key="t"
              type="button"
              role="tab"
              :aria-selected="tab === t"
              class="eqc-side__i"
              :class="{ 'is-on': tab === t }"
              @click="pick(t)"
            >{{ t }}<span class="eqc-side__n">{{ countOf(t) }}</span></button>
          </nav>
          <div ref="gridEl" class="eqc-grid" :class="{ 'is-one': shown.length === 1 }">
            <EquipNovRow :key="tab" class="eqc-cards" :items="shown" layout="grid" bare :meta-of="(p) => p.capacity || ''" />
          </div>
        </div>
      </div>
      <div id="tools"></div>
      <div id="specs"></div>
      <div id="filters"></div>
      <div id="pumps"></div>
    </section>

    <!-- Сервис и поддержка — согласованные тексты без изменений -->
    <section id="support" class="dj-sec dj-sec--soft dj-bp dj-bp--grain">
      <div id="docs"></div>
      <div id="parts"></div>
      <div class="dj-wrap">
        <div class="eqc-sup-head dj-reveal">
          <h2 class="dj-h2 dj-ink">Оборудование ESP — это не покупка. Это партнёрство на весь жизненный цикл.</h2>
          <p class="dj-lede">Каждая единица поставляется с полным пакетом документации, гарантийными обязательствами и доступом к инженерной поддержке 24/7.</p>
        </div>
        <ul class="eqc-support">
          <li v-for="w in support" :key="w.title" class="dj-reveal">
            <GlintShield v-if="w.glyph === 'shieldcheck'" class="eqc-shield" />
            <ApIcon v-else :name="w.glyph" />
            <b>{{ w.title }}</b>
            <span>{{ w.text }}</span>
          </li>
        </ul>
      </div>
    </section>

    <AppleCta title="Не знаете, что подойдёт?" lede="Подберём оборудование под состав ваших сточных вод." />
  </div>
</template>

<script setup>
import { renderedEquipment } from '~/composables/useSiteNav'
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { renderOf } from '~/utils/equipVisual'
import { useReveal } from '~/composables/useReveal'
import { isV1Hidden } from '~/composables/useSiteMenu'
// Сравнение скрыто в первой версии (V1_HIDDEN) — ссылка вела бы редиректом обратно сюда.
const compareOn = !isV1Hidden('/equipment/compare')

const { equipment } = useEquipment()
const root = ref(null)
useReveal(root)

// Сначала позиции с готовыми рендерами — сетка открывается «лицом»
const ordered = computed(() => [...equipment.value].sort((a, b) => (renderOf(b) ? 1 : 0) - (renderOf(a) ? 1 : 0)))
const featured = computed(() => ordered.value.find((p) => p.slug === 'flotation-units') || ordered.value[0])
const ALL = 'Всё оборудование'
const tabs = computed(() => [ALL, ...new Set(ordered.value.map((p) => p.category).filter(Boolean))])
const tab = ref(ALL)
const shown = computed(() => (tab.value === ALL ? ordered.value : ordered.value.filter((p) => p.category === tab.value)))
const countOf = (t) => (t === ALL ? ordered.value.length : ordered.value.filter((p) => p.category === t).length)
// Телефон: когда каталог прилип, шапка сайта уезжает вверх (useState 'hdr-hide'),
// а полоса «Каталог» и фильтры занимают её место. Порог по верху секции — без дребезга.
const catEl = ref(null), gridEl = ref(null), sideEl = ref(null)
const tucked = ref(false)
const hdrHide = useState('hdr-hide', () => false)
let raf = 0
const isPhone = () => window.matchMedia('(max-width: 734px)').matches
const onScroll = () => {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const r = catEl.value?.getBoundingClientRect()
    if (!r || !isPhone()) { tucked.value = false; hdrHide.value = false; return }
    const on = tucked.value ? r.top < 12 && r.bottom > 260 : r.top < -12 && r.bottom > 320
    tucked.value = on
    hdrHide.value = on
  })
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); hdrHide.value = false })

const pick = async (t) => {
  if (tab.value === t) return
  // Запоминаем, где стоит сетка, меняем набор и мгновенно возвращаем верх сетки
  // под прилипшие полосы — фильтр остаётся на месте, страница не прыгает.
  const wasIn = catEl.value && catEl.value.getBoundingClientRect().top < 0
  tab.value = t
  await nextTick()
  sideEl.value?.querySelector('.is-on')?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
  if (!wasIn) return
  // Телефон: шапка спрятана, сверху полоса «Каталог» (52px) и фильтры
  const stack = isPhone() ? 52 + (sideEl.value?.offsetHeight || 0) : 60
  const y = window.scrollY + gridEl.value.getBoundingClientRect().top - stack
  window.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
}

const plural = (n) => {
  const a = n % 10, b = n % 100
  if (a === 1 && b !== 11) return 'позиция'
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'позиции'
  return 'позиций'
}

const support = [
  { title: 'Гарантия 5 лет', text: 'Расширенная гарантия на всё оборудование ESP. Время реакции — 4 часа. Устранение неисправностей без дополнительной платы.', glyph: 'shieldcheck' },
  { title: 'Склады запасных частей', text: 'Складская программа ESP — 98% запчастей в наличии. Поставка по Беларуси и СНГ в течение 24–48 часов.', glyph: 'warehouse' },
  { title: 'Техническая документация', text: 'Полный пакет: исполнительные чертежи, схемы автоматизации, паспорта оборудования, инструкции по эксплуатации.', glyph: 'doc' }
]

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead({
  title: 'Оборудование ESP | Каталог оборудования для очистки сточных вод',
  meta: [
    { name: 'description', content: 'Каталог оборудования ЭкоСервисПроект: флотационные установки, КНС, станции биологической очистки, микрофильтры, ленточные фильтр-прессы, станции дозирования реагентов. Гарантия 5 лет.' },
    { property: 'og:title', content: 'Оборудование ESP | Каталог оборудования для очистки сточных вод' },
    { property: 'og:description', content: 'Флотационные установки, КНС, станции очистки, фильтры и станции дозирования собственного производства ESP. Гарантия 5 лет.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/equipment' }]
})
</script>

<style scoped>
.eqc-cards { margin-top: 8px; }
/* Каталог в подаче Apple Store: серая полка, белые карточки-скругления
   с мягкой тенью, капсулы-фильтры, ссылки «Подробнее ›». */
.eqc-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.eqc { background: #fff; color: var(--dj-ink); font-family: var(--dj-font); letter-spacing: -0.022em; }

.eqc-cat { padding: clamp(48px, 6vw, 80px) 0 clamp(48px, 8vw, 104px); background: #EDEDED; }
/* Шапка каталога — по центру, как DJI Product Support */
.eqc-head { max-width: 760px; margin: 0 auto 8px; text-align: center; }
.eqc-h { margin: 0; font-size: clamp(32px, 4vw, 48px); line-height: 1.08; font-weight: 600; letter-spacing: -0.015em; color: #1A1A1A; }
.eqc-sub { margin: 14px auto 0; max-width: 620px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.eqc-head .dj-more { display: inline-block; margin-top: 12px; font-size: 14px; color: #002366; }

/* Боковой список позиций с вертикальной линией и чёрным указателем */
.eqc-body { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 40px; align-items: start; margin-top: 8px; }
.eqc-side { position: sticky; top: 132px; display: flex; flex-direction: column; align-items: stretch; gap: 8px; margin-top: 120px; }
/* Категории — округлые кнопки-капсулы; выбранная — чёрная */
.eqc-side__i { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 40px; padding: 0 16px; border-radius: var(--r-pill, 999px); border: 0; background: #fff; text-align: left; font-size: 14px; line-height: 1.25; letter-spacing: -0.016em; color: #1A1A1A; cursor: pointer; transition: background-color 0.2s ease, color 0.2s ease; }
.eqc-side__i:hover { background: #F5F5F7; }
.eqc-side__i.is-on { background: #1A1A1A; color: #fff; }
.eqc-side__i:focus-visible { outline: 2px solid #002366; outline-offset: 2px; }
.eqc-side__n { flex: none; color: #8A8A8A; font-variant-numeric: tabular-nums; }
.eqc-side__i.is-on .eqc-side__n { color: rgba(255, 255, 255, 0.6); }
.eqc-grid { min-width: 0; }
.eqc-grid :deep(.dj-reveal) { opacity: 1 !important; transform: none !important; }
.eqc-cat > .dj-wrap { width: min(1280px, 92vw); max-width: none; }
.eqc-grid :deep(.nr-row--grid) { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); justify-content: stretch; max-width: none; }

/* Сервис — полка «разница ESP» */
.eqc-sup-head { max-width: 820px; }
.eqc-sup-head .dj-lede { margin-top: 16px; }
.eqc-support { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin: 48px 0 0; padding: 0; list-style: none; }
.eqc-support li { display: grid; gap: 8px; align-content: start; padding: 32px 30px 36px; border-radius: var(--r-md); background: #fff; box-shadow: var(--sh-1); }
.eqc-support :deep(svg) { width: var(--ico); height: var(--ico); color: #1A1A1A; margin-bottom: calc(var(--ico-gap) - 8px); }
.eqc-support .eqc-shield { width: calc(var(--ico) * 1.5); height: calc(var(--ico) * 1.5); object-fit: contain; margin: -8px 0 calc(var(--ico-gap) - 16px) -6px; }
.eqc-support b { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1A1A1A; }
.eqc-support span { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }

.eqc-cta-sub { margin-top: 14px; }
.eqc-cta-act { margin-top: 28px; gap: 12px 28px; }
.eqc-cta-act .dj-more { font-size: 17px; color: #002366; }


@media (max-width: 860px) {
  .eqc-support { grid-template-columns: 1fr; }
}
@media (max-width: 734px) {
  /* три карточки поддержки: иконка слева, компактный текст */
  .eqc-support { gap: 10px; margin-top: 28px; }
  .eqc-support li { grid-template-columns: 32px 1fr; column-gap: 14px; row-gap: 2px; padding: 16px 16px 18px; }
  .eqc-support li > :first-child { grid-row: span 2; width: 28px; height: 28px; margin: 2px 0 0; }
  /* Гарантия доминирует: щит крупнее остальных иконок */
  .eqc-support li:has(.eqc-shield) { grid-template-columns: 48px 1fr; }
  .eqc-support li > .eqc-shield { width: 48px; height: 48px; margin: -2px 0 0 -4px; }
  .eqc-support b { font-size: 17px; }
  .eqc-support span { font-size: 14px; line-height: 1.4; }
}
@media (max-width: 900px) {
  .eqc-body { grid-template-columns: 1fr; }
  .eqc-side { position: static; flex-direction: row; gap: 8px; margin: 16px -16px 0; padding: 2px 16px; overflow-x: auto; scrollbar-width: none; }
  .eqc-side::-webkit-scrollbar { display: none; }
  .eqc-side__i { flex: 0 0 auto; }
}

/* Телефон: каталог — две колонки. Между карточками без выступа — тот же зазор 10px,
   что по горизонтали; над карточкой с выступающим изделием — место под изделие. */
@media (max-width: 734px) {
  .eqc-top { display: none; }
  .eqc-grid { min-height: calc(100svh - 52px); }
  .eqc-grid :deep(.nr-row--grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-flow: row; grid-auto-columns: auto; gap: 10px; align-items: end; overflow: visible; padding: 10px 0 8px; margin: 0; scroll-snap-type: none; }
  .eqc-grid :deep(.ec) { min-height: 0; }
  .eqc-grid :deep(.ec:not(.ec--inset)) { margin-top: calc(var(--ec-pro, 46px) + 10px); padding-top: 92px; --ec-ib: 86px; --ec-ih: 132px; }
  .eqc-grid :deep(.ec__img) { width: 88%; }
  .eqc-grid :deep(.ec__inset) { margin: 10px 10px 8px; height: 104px; }
  .eqc-grid :deep(.ec__body) { padding: 0 12px 14px; gap: 4px; }
  .eqc-grid :deep(.ec__body b) { font-size: 15px; line-height: 1.2; }
  .eqc-grid :deep(.ec__body small) { font-size: 12px; }
  /* Одна позиция в группе — карточка на всю ширину и почти на весь экран */
  .eqc-grid.is-one :deep(.nr-row--grid) { grid-template-columns: 1fr; }
  .eqc-grid.is-one :deep(.ec) { min-height: calc(100svh - 52px - 60px - 30px); margin-top: 0; padding-top: 0; }
  .eqc-grid.is-one :deep(.ec:not(.ec--inset)) { margin-top: calc(var(--ec-pro, 60px) + 10px); min-height: calc(100svh - 52px - 60px - 100px); --ec-ib: 52%; --ec-ih: 62%; }
  .eqc-grid.is-one :deep(.ec__img) { width: 92%; }
  .eqc-grid.is-one :deep(.ec__inset) { flex: 1 1 auto; height: auto; min-height: 200px; margin: 16px; }
  .eqc-grid.is-one :deep(.ec__body) { padding: 0 20px 22px; gap: 6px; }
  .eqc-grid.is-one :deep(.ec__body b) { font-size: 24px; }
  .eqc-grid.is-one :deep(.ec__body small) { font-size: 14px; -webkit-line-clamp: 4; }
  .eqc-cards { animation: eqc-in 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
}
@keyframes eqc-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
/* Меню второго уровня каталога — только на телефоне */
.eqc-bar { display: none; }
@media (max-width: 734px) {
  .eqc-cat { padding-top: 0; }
  .eqc-head { display: none; }
  .eqc { --eqc-top: var(--dj-header-h, 44px); }
  .eqc.is-tucked { --eqc-top: 0px; }
  .eqc-bar { position: sticky; top: var(--eqc-top); z-index: 31; display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 52px; padding: 0 16px; background: rgba(237, 237, 237, 0.86); -webkit-backdrop-filter: saturate(180%) blur(20px); backdrop-filter: saturate(180%) blur(20px); box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1); transition: top 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
  .eqc-bar__t { font-size: 21px; line-height: 1.14; font-weight: 600; letter-spacing: 0.011em; color: #1A1A1A; white-space: nowrap; }
  .eqc-bar__cta { flex: none; display: inline-flex; align-items: center; min-height: 30px; padding: 0 14px; border-radius: var(--r-pill, 999px); background: #002366; color: #fff; font-size: 14px; letter-spacing: -0.01em; text-decoration: none; }
  /* Фильтры липнут сразу под полосой; когда шапка спряталась — вдвое компактнее */
  .eqc-side { position: sticky; top: calc(var(--eqc-top) + 52px); z-index: 30; margin: 0 -16px; padding: 10px 16px; background: rgba(237, 237, 237, 0.86); -webkit-backdrop-filter: saturate(180%) blur(20px); backdrop-filter: saturate(180%) blur(20px); transition: top 0.45s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease; }
  .eqc-side__i { min-height: 36px; font-size: 14px; transition: min-height 0.3s ease, font-size 0.3s ease, padding 0.3s ease, background-color 0.2s ease, color 0.2s ease; }
  .is-tucked .eqc-side { padding: 6px 16px; gap: 6px; }
  .is-tucked .eqc-side__i { min-height: 24px; padding: 0 10px; gap: 6px; font-size: 12px; }
}
</style>

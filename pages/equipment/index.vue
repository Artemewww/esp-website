<template>
  <!-- Каталог в подаче DJI Store: белая страница, крупный баннер-флагман,
       фильтр-капсулы по группам, сетка плиток с рендером на светло-сером поле. -->
  <div ref="root" class="eqc">
    <h1 class="eqc-sr">Каталог оборудования ESP</h1>
    <!-- Сверху сразу ряд карточек изделий ESP -->
    <EquipNovRow :items="renderedEquipment" />

    <section id="catalog" class="eqc-cat">
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
          <nav class="eqc-side" role="tablist" aria-label="Группы оборудования">
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
          <div class="eqc-grid">
            <EquipNovRow class="eqc-cards" :items="shown" layout="grid" bare :meta-of="(p) => p.capacity || ''" />
          </div>
        </div>
      </div>
      <div id="tools"></div>
      <div id="specs"></div>
      <div id="filters"></div>
      <div id="pumps"></div>
    </section>

    <!-- Сервис и поддержка — согласованные тексты без изменений -->
    <section id="support" class="dj-sec dj-sec--soft">
      <div id="docs"></div>
      <div id="parts"></div>
      <div class="dj-wrap">
        <div class="eqc-sup-head dj-reveal">
          <h2 class="dj-h2">Оборудование ESP — это не покупка. Это партнёрство на весь жизненный цикл.</h2>
          <p class="dj-lede">Каждая единица поставляется с полным пакетом документации, гарантийными обязательствами и доступом к инженерной поддержке 24/7.</p>
        </div>
        <ul class="eqc-support">
          <li v-for="w in support" :key="w.title" class="dj-reveal">
            <ApIcon :name="w.glyph" />
            <b>{{ w.title }}</b>
            <span>{{ w.text }}</span>
          </li>
        </ul>
        <ul class="dj-stats eqc-stats">
          <li v-for="s in stats" :key="s.label" class="dj-reveal"><b>{{ s.value }}</b><span>{{ s.label }}</span></li>
        </ul>
      </div>
    </section>

    <AppleCta title="Не знаете, что подойдёт?" lede="Подберём оборудование под состав ваших сточных вод." />
  </div>
</template>

<script setup>
import { renderedEquipment } from '~/composables/useSiteNav'
import { ref, computed } from 'vue'
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
const pick = (t) => {
  tab.value = t
  const top = document.getElementById('catalog')?.getBoundingClientRect().top
  if (top < 0) window.scrollTo({ top: window.scrollY + top - 60, behavior: 'smooth' })
}

const plural = (n) => {
  const a = n % 10, b = n % 100
  if (a === 1 && b !== 11) return 'позиция'
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'позиции'
  return 'позиций'
}

// «5 лет» и «4 часа» уже в карточке «Гарантия» — в ряду цифр только новые факты
const stats = [
  { value: '100%', label: 'оборудования с BIM-моделью' },
  { value: '24 часа', label: 'на подготовку КП' }
]
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

.eqc-cat { padding: clamp(48px, 6vw, 80px) 0 clamp(64px, 8vw, 104px); background: #EDEDED; }
/* Шапка каталога — по центру, как DJI Product Support */
.eqc-head { max-width: 760px; margin: 0 auto 8px; text-align: center; }
.eqc-h { margin: 0; font-size: clamp(32px, 4vw, 48px); line-height: 1.08; font-weight: 600; letter-spacing: -0.015em; color: #1A1A1A; }
.eqc-sub { margin: 14px auto 0; max-width: 620px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.eqc-head .dj-more { display: inline-block; margin-top: 12px; font-size: 14px; color: #002366; }

/* Боковой список позиций с вертикальной линией и чёрным указателем */
.eqc-body { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 40px; align-items: start; margin-top: 8px; }
.eqc-side { position: sticky; top: 132px; display: flex; flex-direction: column; margin-top: 120px; border-left: 1px solid #D6D6D6; }
.eqc-side__i { position: relative; padding: 9px 0 9px 18px; text-align: left; font-size: 14px; line-height: 1.3; letter-spacing: -0.016em; color: #5E5E5E; background: none; border: 0; cursor: pointer; transition: color 0.2s ease; }
.eqc-side__i::before { content: ''; position: absolute; left: -1px; top: 8px; bottom: 8px; width: 2px; background: transparent; transition: background-color 0.2s ease; }
.eqc-side__i:hover { color: #1A1A1A; }
.eqc-side__i.is-on { color: #1A1A1A; font-weight: 600; }
.eqc-side__i.is-on::before { background: #1A1A1A; }
.eqc-side__i { display: flex; justify-content: space-between; gap: 12px; padding-right: 4px; }
.eqc-side__n { flex: none; font-weight: 400; color: #8A8A8A; }
.eqc-grid { min-width: 0; }
.eqc-cat > .dj-wrap { width: min(1280px, 92vw); max-width: none; }
.eqc-grid :deep(.nr-row--grid) { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); justify-content: stretch; max-width: none; }

/* Сервис — полка «разница ESP» */
.eqc-sup-head { max-width: 820px; }
.eqc-sup-head .dj-lede { margin-top: 16px; }
.eqc-support { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin: 48px 0 0; padding: 0; list-style: none; }
.eqc-support li { display: grid; gap: 8px; align-content: start; padding: 32px 30px 36px; border-radius: var(--r-md); background: #fff; box-shadow: var(--sh-1); }
.eqc-support :deep(svg) { width: var(--ico); height: var(--ico); color: #1A1A1A; margin-bottom: calc(var(--ico-gap) - 8px); }
.eqc-support b { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1A1A1A; }
.eqc-support span { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.eqc-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 760px; margin-left: auto; margin-right: auto; text-align: center; margin-top: clamp(56px, 7vw, 88px); }
.eqc-stats b { font-size: clamp(40px, 4.4vw, 64px); line-height: 1.06; letter-spacing: -0.009em; color: #1A1A1A; }
.eqc-stats span { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }

.eqc-cta-sub { margin-top: 14px; }
.eqc-cta-act { margin-top: 28px; gap: 12px 28px; }
.eqc-cta-act .dj-more { font-size: 17px; color: #002366; }


@media (max-width: 860px) {
  .eqc-support { grid-template-columns: 1fr; }
  .eqc-stats { grid-template-columns: 1fr 1fr; gap: 36px 16px; }
}
@media (max-width: 900px) {
  .eqc-body { grid-template-columns: 1fr; }
  .eqc-side { position: static; flex-direction: row; gap: 8px; margin: 16px -16px 0; padding: 2px 16px; overflow-x: auto; border-left: 0; scrollbar-width: none; }
  .eqc-side::-webkit-scrollbar { display: none; }
  .eqc-side__i { flex: 0 0 auto; padding: 0 16px; height: 36px; align-items: center; border-radius: var(--r-pill); background: #fff; font-weight: 400; }
  .eqc-side__i::before { display: none; }
  .eqc-side__i.is-on { background: #1A1A1A; color: #fff; font-weight: 400; }
  .eqc-side__i.is-on .eqc-side__n { color: rgba(255,255,255,.6); }
}

</style>

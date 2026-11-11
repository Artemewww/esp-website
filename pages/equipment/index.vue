<template>
  <!-- Каталог в подаче DJI Store: белая страница, крупный баннер-флагман,
       фильтр-капсулы по группам, сетка плиток с рендером на светло-сером поле. -->
  <div ref="root" class="eqc">
    <h1 class="eqc-sr">Каталог оборудования ESP</h1>
    <!-- Витрина как на главной DJI Store: слайдер и ряд «Новинки» -->
    <EquipStoreSlider :items="renderedEquipment" />
    <EquipNovRow :items="renderedEquipment" title="Оборудование ESP" />

    <section id="catalog" class="eqc-cat">
      <div class="dj-wrap">
        <div class="eqc-intro">
          <p class="dj-lede">
            Собственное производство ESP: флотационные установки, станции дозирования реагентов,
            механическая очистка и обезвоживание осадка. Подберём оборудование под состав ваших сточных вод.
          </p>
          <NuxtLink to="/equipment/compare" class="dj-more">Сравнить оборудование</NuxtLink>
        </div>
        <div class="eqc-bar">
          <div class="eqc-tabs" role="tablist" aria-label="Группы оборудования">
            <button
              v-for="t in tabs"
              :key="t"
              type="button"
              role="tab"
              :aria-selected="tab === t"
              class="eqc-tab"
              :class="{ 'is-on': tab === t }"
              @click="tab = t"
            >{{ t }}</button>
          </div>
          <span class="eqc-count">{{ shown.length }} {{ plural(shown.length) }}</span>
        </div>

        <ul class="eqc-grid">
          <li v-for="p in shown" :key="p.slug" class="eqc-card">
            <NuxtLink :to="`/equipment/${p.slug}`" class="eqc-media" tabindex="-1" :aria-label="p.name">
              <EquipShot :item="p" />
            </NuxtLink>
            <div class="eqc-body">
              <span class="eqc-cat-name">{{ p.category }}</span>
              <h2 class="eqc-name"><NuxtLink :to="`/equipment/${p.slug}`">{{ p.name }}</NuxtLink></h2>
              <p class="eqc-desc">{{ p.desc }}</p>
              <p v-if="p.capacity" class="eqc-meta">Производительность: {{ p.capacity }}</p>
              <p v-else-if="p.application" class="eqc-meta">{{ p.application }}</p>
              <div class="eqc-actions">
                <NuxtLink :to="`/equipment/${p.slug}`" class="dj-more">Подробнее</NuxtLink>
                <NuxtLink to="/contacts#contact-form" class="dj-more">Запросить консультацию</NuxtLink>
              </div>
            </div>
          </li>
        </ul>
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
          <h2 class="dj-h2">Оборудование ESP — это не покупка. Это партнёрство на весь жизненный цикл.</h2>
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

    <section class="dj-sec dj-center eqc-cta">
      <div class="dj-wrap">
        <h2 class="dj-h2">Не знаете, что подойдёт?</h2>
        <p class="dj-lede eqc-cta-sub">Подберём оборудование под состав ваших сточных вод.</p>
        <div class="dj-links eqc-cta-act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg">Обсудить проект</NuxtLink>
          <NuxtLink to="/equipment/compare" class="dj-more">Сравнить оборудование</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { renderedEquipment } from '~/composables/useSiteNav'
import { ref, computed } from 'vue'
import { renderOf } from '~/utils/equipVisual'
import { useReveal } from '~/composables/useReveal'

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
const plural = (n) => {
  const a = n % 10, b = n % 100
  if (a === 1 && b !== 11) return 'позиция'
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'позиции'
  return 'позиций'
}

const stats = [
  { value: '5 лет', label: 'гарантии на оборудование' },
  { value: '4 часа', label: 'реакция сервисной службы' },
  { value: '100%', label: 'оборудования с BIM-моделью' },
  { value: '24 часа', label: 'на подготовку КП' }
]
const support = [
  { title: 'Гарантия до 5 лет', text: 'Расширенная гарантия на всё оборудование ESP. Время реакции — 4 часа. Устранение неисправностей без дополнительной платы.', glyph: 'shieldcheck' },
  { title: 'Склады запасных частей', text: 'Складская программа ESP — 98% запчастей в наличии. Поставка по Беларуси и СНГ в течение 24–48 часов.', glyph: 'warehouse' },
  { title: 'Техническая документация', text: 'Полный пакет: исполнительные чертежи, схемы автоматизации, паспорта оборудования, инструкции по эксплуатации.', glyph: 'doc' }
]

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead({
  title: 'Оборудование ESP | Каталог оборудования для очистки сточных вод',
  meta: [
    { name: 'description', content: 'Каталог оборудования ЭкоСервисПроект: флотационные установки, КНС, станции биологической очистки, микрофильтры, ленточные фильтр-прессы, станции дозирования реагентов. Гарантия 5 лет.' },
    { property: 'og:title', content: 'Оборудование ESP | Каталог оборудования для очистки сточных вод' },
    { property: 'og:description', content: 'Флотационные установки, КНС, станции очистки, фильтры и станции дозирования собственного производства ESP. Гарантия 5 лет.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/equipment' }]
})
</script>

<style scoped>
/* Каталог в подаче Apple Store: серая полка, белые карточки-скругления
   с мягкой тенью, капсулы-фильтры, ссылки «Подробнее ›». */
.eqc-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.eqc { background: #fff; color: var(--dj-ink); font-family: var(--dj-font); letter-spacing: -0.022em; }

.eqc-cat { padding: clamp(48px, 6vw, 80px) 0 clamp(64px, 8vw, 104px); background: #f5f5f7; }
.eqc-intro { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 12px 40px; margin-bottom: 28px; }
.eqc-intro .dj-lede { max-width: 640px; font-size: clamp(19px, 1.5vw, 21px); line-height: 1.381; letter-spacing: 0.011em; color: #6e6e73; }

.eqc-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px 24px; flex-wrap: wrap; }
.eqc-tabs { display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; }
.eqc-tab { height: 36px; padding: 0 18px; border-radius: 980px; font-size: 14px; letter-spacing: -0.016em; color: #1d1d1f; background: #fff; box-shadow: inset 0 0 0 1px #d2d2d7; transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease; }
.eqc-tab:hover { box-shadow: inset 0 0 0 1px #86868b; }
.eqc-tab.is-on { background: #1d1d1f; color: #fff; box-shadow: none; }
.eqc-tab:focus-visible { outline: 2px solid #0071e3; outline-offset: 2px; }
.eqc-count { font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; white-space: nowrap; }

.eqc-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin: 32px 0 0; padding: 0; list-style: none; }
.eqc-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border-radius: 18px; background: #fff; box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s cubic-bezier(0, 0, 0.5, 1), transform 0.3s cubic-bezier(0, 0, 0.5, 1); }
.eqc-card:hover { box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.16); transform: scale3d(1.01, 1.01, 1.01); }
.eqc-media { display: block; aspect-ratio: 1 / 1; padding: 12px 12px 0; }
.eqc-media :deep(.esh) { border-radius: 12px; background: #fff; }
.eqc-media :deep(.esh.is-empty) { background: #f5f5f7; }
.eqc-card:hover :deep(.esh-img) { transform: scale(1.03); }
.eqc-body { display: flex; flex-direction: column; flex: 1; padding: 18px 24px 24px; }
.eqc-cat-name { font-size: 12px; line-height: 1.33; font-weight: 600; letter-spacing: -0.01em; color: #b64400; }
.eqc-name { margin-top: 6px; font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1d1d1f; overflow-wrap: break-word; hyphens: manual; }
.eqc-name a:hover { color: #0066cc; }
.eqc-desc { margin-top: 8px; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #1d1d1f; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.eqc-meta { margin-top: 8px; font-size: 12px; line-height: 1.33; letter-spacing: -0.01em; color: #6e6e73; }
.eqc-actions { display: flex; flex-wrap: wrap; gap: 6px 20px; margin-top: auto; padding-top: 16px; }
.eqc-actions .dj-more, .eqc-intro .dj-more { font-size: 14px; color: #0066cc; }

/* Сервис — полка «разница ESP» */
.eqc-sup-head { max-width: 820px; }
.eqc-sup-head .dj-lede { margin-top: 16px; }
.eqc-support { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin: 48px 0 0; padding: 0; list-style: none; }
.eqc-support li { display: grid; gap: 8px; align-content: start; padding: 32px 30px 36px; border-radius: 18px; background: #fff; box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08); }
.eqc-support :deep(svg) { width: 36px; height: 36px; color: #1d1d1f; margin-bottom: 10px; }
.eqc-support b { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1d1d1f; }
.eqc-support span { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.eqc-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: clamp(56px, 7vw, 88px); }
.eqc-stats b { font-size: clamp(40px, 4.4vw, 64px); line-height: 1.06; letter-spacing: -0.009em; color: #1d1d1f; }
.eqc-stats span { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }

.eqc-cta-sub { margin-top: 14px; }
.eqc-cta-act { margin-top: 28px; gap: 12px 28px; }
.eqc-cta-act .dj-more { font-size: 17px; color: #0066cc; }

@media (max-width: 1100px) { .eqc-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 860px) {
  .eqc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .eqc-support { grid-template-columns: 1fr; }
  .eqc-stats { grid-template-columns: 1fr 1fr; gap: 36px 16px; }
}
@media (max-width: 767px) {
  .eqc-tabs { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 -16px; padding: 2px 16px; width: calc(100% + 32px); }
  .eqc-tabs::-webkit-scrollbar { display: none; }
  .eqc-tab { flex: 0 0 auto; }
}
@media (max-width: 540px) {
  .eqc-grid { grid-template-columns: 1fr; }
  .eqc-media { aspect-ratio: 4 / 3; }
}
@media (prefers-reduced-motion: reduce) { .eqc-card, .eqc-card:hover { transition: none; transform: none; } }
</style>

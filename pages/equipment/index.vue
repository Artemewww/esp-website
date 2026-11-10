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
            механическая очистка и обезвоживание осадка. Подберём оборудование под состав ваших сточных вод.
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
                <NuxtLink to="/contacts#contact-form" class="dj-more">Запросить КП</NuxtLink>
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
          <h2 class="dj-h2">Оборудование ESP — это не покупка. Это партнёрство на весь жизненный цикл.</h2>
          <p class="dj-lede">Каждая единица поставляется с полным пакетом документации, гарантийными обязательствами и доступом к инженерной поддержке 24/7.</p>
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
  { value: '100%', label: 'оборудования с BIM-моделью' },
  { value: '24 часа', label: 'на подготовку КП' }
]
const support = [
  { title: 'Гарантия до 5 лет', text: 'Расширенная гарантия на всё оборудование ESP. SLA реакции — 4 часа. Устранение неисправностей без доп. платы.', glyph: 'shieldcheck' },
  { title: 'Склады запасных частей', text: 'Складская программа ESP — 98% запчастей в наличии. Поставка по Беларуси и СНГ в течение 24–48 часов.', glyph: 'warehouse' },
  { title: 'Техническая документация', text: 'Полный пакет: исполнительные чертежи, схемы автоматизации, паспорта оборудования, инструкции по эксплуатации.', glyph: 'doc' }
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
.eqc-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.eqc-intro { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 12px 32px; margin-bottom: 24px; }
.eqc-intro .dj-lede { max-width: 62ch; }
.eqc { background: #fff; color: var(--dj-text); }

.eqc-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px 40px; flex-wrap: wrap; padding-top: clamp(40px, 6vw, 72px); padding-bottom: clamp(28px, 3.5vw, 40px); }
.eqc-title { max-width: 16ch; hyphens: manual; }
.eqc-feat-name { hyphens: manual; }
.eqc-lede { max-width: 58ch; margin-top: 14px; }

/* Баннер: копия слева, рендер справа на светло-сером, квадратные края */
.eqc-feat-wrap { padding: 0 12px; }
.eqc-feat { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: stretch; max-width: 1416px; margin: 0 auto; background: var(--dj-soft); overflow: hidden; }
.eqc-feat-copy { display: flex; flex-direction: column; justify-content: center; padding: clamp(32px, 5vw, 72px); }
.eqc-feat-name { margin-top: 8px; }
.eqc-feat-desc { margin-top: 14px; max-width: 44ch; font-size: 16px; line-height: 1.55; color: var(--dj-text); }
.eqc-feat-meta { margin-top: 10px; font-size: 14px; color: var(--dj-muted); }
.eqc-feat-act { margin-top: 28px; }
.eqc-feat-media { min-height: clamp(320px, 36vw, 520px); }
.eqc-feat-media :deep(.esh-img) { width: 86%; height: 86%; }
.eqc-feat:hover :deep(.esh-img) { transform: scale(1.03); }

/* Фильтр и сетка */
.eqc-cat { padding: clamp(40px, 5vw, 64px) 0 clamp(56px, 7vw, 96px); }
.eqc-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px 24px; flex-wrap: wrap; }
.eqc-tabs { display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; }
.eqc-tab { height: 36px; padding: 0 16px; border-radius: 999px; font-size: 14px; color: var(--dj-ink); background: var(--dj-soft); transition: background-color 0.2s ease, color 0.2s ease; }
.eqc-tab:hover { background: #e9ebee; }
.eqc-tab.is-on { background: var(--dj-ink); color: #fff; }
.eqc-count { font-size: 13px; color: var(--dj-muted); white-space: nowrap; }

.eqc-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 28px 0 0; padding: 0; list-style: none; }
.eqc-card { display: flex; flex-direction: column; min-width: 0; background: #fff; }
.eqc-media { display: block; aspect-ratio: 1 / 1; }
.eqc-card:hover :deep(.esh-img) { transform: scale(1.04); }
.eqc-body { display: flex; flex-direction: column; flex: 1; padding: 18px 4px 8px; }
.eqc-cat-name { font-size: 12px; font-weight: 500; color: var(--dj-accent); }
.eqc-name { margin-top: 6px; font-size: 18px; line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; color: var(--dj-ink); overflow-wrap: break-word; }
.eqc-name a:hover { color: var(--dj-link); }
.eqc-desc { margin-top: 8px; font-size: 14px; line-height: 1.5; color: var(--dj-text); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.eqc-meta { margin-top: 8px; font-size: 13px; line-height: 1.4; color: var(--dj-muted); }
.eqc-actions { display: flex; flex-wrap: wrap; gap: 6px 20px; margin-top: auto; padding-top: 16px; }

/* Сервис */
.eqc-sup-head { max-width: 760px; }
.eqc-sup-head .dj-lede { margin-top: 14px; }
.eqc-support { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 40px 0 0; padding: 0; list-style: none; }
.eqc-support li { display: grid; gap: 8px; align-content: start; padding: 32px 28px; background: #fff; }
.eqc-support :deep(svg) { width: 30px; height: 30px; color: var(--dj-ink); margin-bottom: 6px; }
.eqc-support b { font-size: 18px; font-weight: 600; color: var(--dj-ink); }
.eqc-support span { font-size: 14px; line-height: 1.55; color: var(--dj-muted); }
.eqc-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: clamp(48px, 6vw, 80px); }
.eqc-stats b { font-size: clamp(36px, 4.4vw, 60px); }

.eqc-cta-sub { margin-top: 12px; }
.eqc-cta-act { margin-top: 28px; }

@media (max-width: 1100px) {
  .eqc-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 860px) {
  .eqc-feat { grid-template-columns: 1fr; }
  .eqc-feat-media { order: -1; min-height: 0; aspect-ratio: 4 / 3; }
  .eqc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .eqc-support { grid-template-columns: 1fr; }
  .eqc-stats { grid-template-columns: 1fr 1fr; gap: 36px 16px; }
}
@media (max-width: 767px) {
  .eqc-feat-wrap { padding: 0 8px; }
  .eqc-feat-copy { padding: 28px 20px 32px; }
  .eqc-tabs { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 -24px; padding: 0 24px; width: calc(100% + 48px); }
  .eqc-tabs::-webkit-scrollbar { display: none; }
  .eqc-tab { flex: 0 0 auto; }
  .eqc-grid { gap: 8px; }
}
@media (max-width: 540px) {
  .eqc-grid { grid-template-columns: 1fr; gap: 28px; }
  .eqc-media { aspect-ratio: 4 / 3; }
}
</style>

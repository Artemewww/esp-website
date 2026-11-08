<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Новости</span>
        <h1 class="ap-title">Новости и экспертные материалы</h1>
        <p class="ap-lede">События ESP — запуски очистных сооружений, отраслевые семинары, развитие компании — и материалы инженеров об очистке сточных вод.</p>

        <!-- Главная новость: крупная карточка -->
        <article v-if="lead" class="ap-card ap-card--media nw-lead" @click="open(lead)">
          <div class="nw-media nw-media--lead">
            <img v-if="lead.image" :src="lead.image" :alt="lead.title" class="nw-img" />
            <NewsPlaceholder v-else label="ESP · Хроника" />
          </div>
          <div class="ap-card-body nw-lead__body">
            <span class="nw-cat">{{ lead.category || 'Новости' }}</span>
            <h2 class="nw-lead__title">
              <button type="button" class="nw-link" @click.stop="open(lead)">{{ lead.title }}</button>
            </h2>
            <time :datetime="lead.date" class="nw-date">{{ lead.dateLabel }}</time>
            <p class="ap-text nw-excerpt nw-excerpt--lead">{{ excerpt(lead) }}</p>
            <span class="ap-link nw-more">Читать полностью ›</span>
          </div>
        </article>

        <!-- Лента -->
        <div class="ap-grid ap-grid--3 nw-grid">
          <article v-for="n in rest" :key="n.date + n.title" class="ap-card ap-card--media nw-card" @click="open(n)">
            <div class="nw-media">
              <img v-if="n.image" :src="n.image" :alt="n.title" loading="lazy" class="nw-img" />
              <NewsPlaceholder v-else label="ESP · Хроника" />
            </div>
            <div class="ap-card-body">
              <span class="nw-cat">{{ n.category || 'Новости' }}</span>
              <h3 class="nw-card__title">
                <button type="button" class="nw-link" @click.stop="open(n)">{{ n.title }}</button>
              </h3>
              <time :datetime="n.date" class="nw-date">{{ n.dateLabel }}</time>
              <p class="ap-text nw-excerpt">{{ excerpt(n) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Чтение новости целиком -->
    <Teleport to="body">
      <div v-if="current" class="nw-modal" role="dialog" aria-modal="true" :aria-label="current.title" @keydown.esc="close">
        <div class="nw-modal__backdrop" @click="close"></div>
        <div ref="panel" class="nw-modal__panel" tabindex="-1">
          <button type="button" class="nw-modal__close" aria-label="Закрыть" @click="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div class="nw-modal__media">
            <img v-if="current.image" :src="current.image" :alt="current.title" class="nw-img" />
            <NewsPlaceholder v-else label="ESP · Хроника" />
          </div>
          <div class="nw-modal__body">
            <time :datetime="current.date" class="nw-date">{{ current.dateLabel }}</time>
            <h2 class="nw-modal__title">{{ current.title }}</h2>
            <p v-for="(para, i) in paragraphs(current)" :key="i" class="nw-modal__p">{{ para }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch, onBeforeUnmount, h } from 'vue'
import BrandPattern from '~/components/ui/BrandPattern.vue'

const { news } = useNews()

// Свежие сверху: заказчик может добавить новость в любое место списка в админке
const sorted = computed(() =>
  [...(news.value || [])].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
)
const lead = computed(() => sorted.value[0])
const rest = computed(() => sorted.value.slice(1))

const paragraphs = (n) => String(n?.text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
const excerpt = (n) => paragraphs(n)[0] || ''

// Заглушка без фото: фирменная суперграфика «Лист» на синем
const NewsPlaceholder = (props) =>
  h('div', { class: 'nw-ph', 'aria-hidden': 'true' }, [
    h('div', { class: 'nw-ph__rows' }, [0, 1, 2, 3, 4].map(i =>
      h(BrandPattern, { key: i, height: 44, class: i % 2 ? 'nw-ph__row nw-ph__row--shift' : 'nw-ph__row' })
    )),
    h('span', { class: 'nw-ph__label' }, props.label || 'ESP')
  ])
NewsPlaceholder.props = ['label']

// Открытая новость живёт в ?news=<date>, чтобы ссылкой можно было поделиться
const route = useRoute()
const router = useRouter()
const panel = ref(null)
const current = computed(() => {
  const key = route.query.news
  return key ? sorted.value.find(n => n.date === key) || null : null
})
const open = (n) => router.push({ query: { ...route.query, news: n.date } })
const close = () => {
  const { news: _, ...q } = route.query
  router.push({ query: q })
}

const onKey = (e) => { if (e.key === 'Escape') close() }
watch(current, async (val) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = val ? 'hidden' : ''
  if (val) {
    window.addEventListener('keydown', onKey)
    await nextTick()
    panel.value?.focus()
  } else {
    window.removeEventListener('keydown', onKey)
  }
}, { immediate: true })
onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})

useHead(() => ({
  title: current.value ? `${current.value.title} | Новости ESP` : 'Новости | ESP',
  meta: [
    { name: 'description', content: current.value ? excerpt(current.value) : 'Новости ЭкоСервисПроект: запуски очистных сооружений, отраслевые семинары и экспертные материалы об очистке сточных вод.' }
  ]
}))
</script>

<style scoped>
/* Newsroom в подаче Apple: крупная первая карточка, ниже сетка из трёх */
.nw-media { aspect-ratio: 16 / 10; overflow: hidden; background: #002366; }
.nw-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s cubic-bezier(0.16, 1, 0.3, 1); }
.nw-cat { font-size: 12px; font-weight: 600; letter-spacing: .02em; text-transform: uppercase; color: #2f6fb8; }
.nw-date { display: block; font-size: 13px; color: #6e6e73; }
.nw-link { all: unset; cursor: pointer; }
.nw-link:focus-visible { outline: 2px solid #0b5cad; outline-offset: 3px; border-radius: 4px; }
.nw-excerpt { margin-top: 0.25rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.nw-excerpt--lead { font-size: 17px; -webkit-line-clamp: 4; }

.nw-lead, .nw-card { cursor: pointer; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
.nw-lead:hover, .nw-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06); }
.nw-lead:hover .nw-img, .nw-card:hover .nw-img { transform: scale(1.03); }
.nw-lead { margin-top: 2.5rem; }
.nw-media--lead { aspect-ratio: 16 / 9; }
.nw-lead__body { padding: 1.6rem 1.6rem 2rem !important; }
.nw-lead__title { font-family: var(--font-sans); font-weight: 700; font-size: clamp(1.5rem, 3vw, 2.4rem); line-height: 1.12; letter-spacing: -0.02em; color: #1d1d1f; max-width: 48rem; }
.nw-card__title { font-family: var(--font-sans); font-weight: 600; font-size: 1.2rem; line-height: 1.25; letter-spacing: -0.015em; color: #1d1d1f; }
.nw-more { margin-top: 0.75rem; }
.nw-grid { margin-top: 1.25rem; }
@media (min-width: 768px) { .nw-lead__body { padding: 2.25rem 2.5rem 2.5rem !important; } }
/* Телефон: лента — миниатюра слева, текст справа, без огромных плашек */
@media (max-width: 767px) {
  .nw-grid { gap: 0.75rem; }
  .nw-card { display: grid; grid-template-columns: 96px minmax(0, 1fr); align-items: start; }
  .nw-card .nw-media { aspect-ratio: 1; height: 100%; min-height: 96px; }
  .nw-card .ap-card-body { gap: 0.3rem; padding: 0.9rem 1rem 1rem; }
  .nw-card__title { font-size: 15px; line-height: 1.3; }
  .nw-card .nw-excerpt { display: none; }
  .nw-card .nw-cat { font-size: 11px; }
  .nw-card :deep(.nw-ph__label) { display: none; }
  .nw-lead { margin-top: 1.75rem; }
  .nw-lead__body { padding: 1.25rem 1.25rem 1.5rem !important; }
}

/* Заглушка */
:deep(.nw-ph) { position: relative; width: 100%; height: 100%; min-height: 100%; background: #002366; overflow: hidden; color: rgba(255, 255, 255, .06); }
:deep(.nw-ph__rows) { position: absolute; inset: -8px 0 0; display: flex; flex-direction: column; gap: 8px; }
:deep(.nw-ph__row--shift) { transform: translateX(-34px); width: calc(100% + 34px); }
:deep(.nw-ph__label) { position: absolute; left: 16px; bottom: 14px; font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, .75); }

/* Модальное окно */
.nw-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 16px; overflow-y: auto; }
.nw-modal__backdrop { position: fixed; inset: 0; background: rgba(29, 29, 31, .55); backdrop-filter: blur(6px); }
.nw-modal__panel { position: relative; width: 100%; max-width: 760px; margin: auto 0; background: #fff; border-radius: 22px; overflow: hidden; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .35); outline: none; }
.nw-modal__media { aspect-ratio: 16 / 9; overflow: hidden; background: #002366; }
.nw-modal__body { padding: 24px 20px 28px; }
.nw-modal__title { margin: 0.5rem 0 1.25rem; font-family: var(--font-sans); font-weight: 700; font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.15; letter-spacing: -0.02em; color: #1d1d1f; }
.nw-modal__p { font-size: 17px; line-height: 1.6; color: #1d1d1f; margin-bottom: 1rem; }
.nw-modal__p:last-child { margin-bottom: 0; }
@media (min-width: 768px) { .nw-modal { padding: 40px 24px; } .nw-modal__body { padding: 36px 44px 44px; } }
.nw-modal__close { position: absolute; top: 12px; right: 12px; z-index: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, .9); color: #1d1d1f; border-radius: 9999px; transition: background-color .2s ease; }
.nw-modal__close:hover { background: #fff; }
.nw-modal__close svg { width: 18px; height: 18px; }
@media (prefers-reduced-motion: reduce) { .nw-img, .nw-lead, .nw-card { transition: none; } }
</style>

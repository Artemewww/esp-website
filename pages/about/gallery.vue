<template>
  <div ref="root" class="gl">
    <div class="dj-wrap gl-crumb"><Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Фотогалерея' }]" /></div>
    <DjPageHero
      eyebrow="Реализованные объекты"
      title="Фотогалерея"
      lede="Подборка материалов по категориям объектов ESP. Полные карточки с описанием и метриками — в разделе «Проекты»."
    />

    <section class="gl-sec">
      <div class="dj-wrap gl-list">
        <div v-for="(cat, ci) in categories" :key="cat.title" class="gl-cat dj-reveal">
          <div class="gl-head">
            <h2 class="gl-h">{{ cat.title }}</h2>
            <span class="gl-num">{{ cat.count }}</span>
          </div>
          <div class="gl-grid">
            <button
              v-for="(img, i) in cat.images"
              :key="i"
              type="button"
              class="gl-tile"
              :aria-label="`${cat.title} — фото ${i + 1} из ${cat.images.length}, открыть`"
              @click="open(ci, i, $event)"
            >
              <img :src="img" :alt="cat.title" loading="lazy" decoding="async" />
            </button>
          </div>
          <NuxtLink :to="cat.link" class="dj-more gl-more">{{ cat.linkLabel }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <div
      v-if="lb"
      ref="dialog"
      class="gl-lb"
      role="dialog"
      aria-modal="true"
      :aria-label="`${lbCat.title}, фото ${lb.i + 1} из ${lbCat.images.length}`"
      tabindex="-1"
      @click.self="close"
      @keydown="onKey"
    >
      <div class="gl-lb-bar">
        <span class="gl-lb-cap">{{ lbCat.title }} · {{ lb.i + 1 }} / {{ lbCat.images.length }}</span>
        <button ref="closeBtn" type="button" class="gl-lb-btn" @click="close">Закрыть</button>
      </div>
      <button type="button" class="gl-lb-nav gl-lb-prev" aria-label="Предыдущее фото" @click="step(-1)">‹</button>
      <img :src="lbCat.images[lb.i]" :alt="lbCat.title" class="gl-lb-img" />
      <button type="button" class="gl-lb-nav gl-lb-next" aria-label="Следующее фото" @click="step(1)">›</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import { useReveal } from '~/composables/useReveal'

const categories = [
  {
    title: 'Станции полной биологической очистки сточных вод (от 100 м³/сутки)',
    count: '14 объектов',
    images: ['/images/product_2.png', '/images/product_5.png', '/images/team/team-at-work.png', '/images/object.jpg'],
    link: '/equipment?category=Реакторы',
    linkLabel: 'Оборудование для биологической очистки'
  },
  {
    title: 'Эффект очистки',
    count: '12 материалов',
    images: ['/images/team/quality-standard.png', '/images/team/quality-underwater.png', '/images/team/crystal-water.png', '/images/view2.jpg'],
    link: '/about#quality',
    linkLabel: 'Стандарты качества ESP'
  },
  {
    title: 'Станции очистки сточных вод типа ВС',
    count: '13 объектов',
    images: ['/images/product_6.png', '/images/product_3.png', '/images/slide1.jpg', '/images/slide2.jpg'],
    link: '/equipment',
    linkLabel: 'Каталог оборудования'
  },
  {
    title: 'Установки очистки ливневых вод типа ОРЛ и ОРЛ-С',
    count: '19 объектов',
    images: ['/images/product_7.png', '/images/product_4.png', '/images/team/lidar-object.png', '/images/view3.jpg'],
    link: '/equipment/orl-storm-water',
    linkLabel: 'Установки ОРЛ / ливневая канализация'
  },
  {
    title: 'Канализационные насосные станции',
    count: '24 объекта',
    images: ['/images/product_1.png', '/images/team/team-collaboration.jpg', '/images/team/office-interior.png', '/images/slide3.jpg'],
    link: '/equipment/kns-kvatro',
    linkLabel: 'Насосные станции КНС'
  }
]

const root = ref(null)
useReveal(root)

const lb = ref(null)
const dialog = ref(null)
const closeBtn = ref(null)
let opener = null
const lbCat = computed(() => (lb.value ? categories[lb.value.c] : null))

const open = (c, i, e) => {
  opener = e?.currentTarget || null
  lb.value = { c, i }
}
const close = () => {
  lb.value = null
  nextTick(() => opener?.focus())
}
const step = (d) => {
  const n = lbCat.value.images.length
  lb.value = { c: lb.value.c, i: (lb.value.i + d + n) % n }
}
const onKey = (e) => {
  if (e.key === 'Escape') { e.preventDefault(); close() }
  else if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
  else if (e.key === 'Tab') {
    const f = [...dialog.value.querySelectorAll('button')]
    const first = f[0]; const last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}
watch(lb, (v, old) => {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (v && !old) nextTick(() => closeBtn.value?.focus())
})
onBeforeUnmount(() => { if (typeof document !== 'undefined') document.documentElement.style.overflow = '' })

useHead({
  title: 'Фотогалерея | ESP',
  meta: [
    { name: 'description', content: 'Фотогалерея реализованных объектов ЭкоСервисПроект: станции биологической очистки, установки ОРЛ, насосные станции.' }
  ]
})
</script>

<style scoped>
.gl-crumb { padding-top: 20px; }
.gl-sec { padding: clamp(24px, 4vw, 48px) 0 clamp(64px, 8vw, 104px); }
.gl-list { display: grid; gap: clamp(48px, 6vw, 80px); }
.gl-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid var(--dj-line); }
.gl-h { max-width: 40rem; font-size: clamp(22px, 2.2vw, 30px); line-height: 1.2; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); }
.gl-num { flex-shrink: 0; font-size: 14px; color: var(--dj-muted); }
.gl-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
.gl-tile { display: block; aspect-ratio: 1; padding: 0; overflow: hidden; background: var(--dj-soft); cursor: zoom-in; }
.gl-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s var(--dj-ease); }
.gl-tile:hover img { transform: scale(1.05); }
.gl-tile:focus-visible { outline: 2px solid var(--dj-link); outline-offset: 2px; }
.gl-more { margin-top: 16px; white-space: normal; }

.gl-lb { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 64px 72px 32px; background: rgba(11, 13, 16, 0.92); backdrop-filter: blur(8px); font-family: var(--dj-font); outline: none; }
.gl-lb-bar { position: absolute; top: 0; left: 0; right: 0; display: flex; align-items: center; gap: 16px; padding: 14px 20px; font-size: 14px; color: rgba(255, 255, 255, 0.8); }
.gl-lb-cap { margin-right: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gl-lb-btn { flex-shrink: 0; height: 32px; padding: 0 14px; border-radius: 999px; background: rgba(255, 255, 255, 0.16); color: #fff; font-size: 14px; }
.gl-lb-btn:hover { background: rgba(255, 255, 255, 0.28); }
.gl-lb-img { display: block; max-width: 100%; max-height: 100%; object-fit: contain; }
.gl-lb-nav { position: absolute; top: 50%; width: 44px; height: 44px; margin-top: -22px; border-radius: 50%; background: rgba(255, 255, 255, 0.16); color: #fff; font-size: 28px; line-height: 1; }
.gl-lb-nav:hover { background: rgba(255, 255, 255, 0.28); }
.gl-lb-prev { left: 16px; }
.gl-lb-next { right: 16px; }
.gl-lb button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
@media (max-width: 767px) {
  .gl-head { flex-direction: column; align-items: flex-start; gap: 6px; }
  .gl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .gl-lb { padding: 64px 12px 84px; }
  .gl-lb-nav { top: auto; bottom: 20px; margin-top: 0; }
  .gl-lb-prev { left: calc(50% - 56px); }
  .gl-lb-next { right: calc(50% - 56px); }
}
@media (prefers-reduced-motion: reduce) { .gl-tile img { transition: none; } }
</style>

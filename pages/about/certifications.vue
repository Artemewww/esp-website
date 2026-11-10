<template>
  <div ref="root" class="ct">
    <div class="dj-wrap ct-crumb"><Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Сертификаты' }]" /></div>
    <DjPageHero
      eyebrow="Документы и допуски"
      title="Сертификаты и аттестаты"
      lede="ESP работает по системе менеджмента качества ISO 9001-2011 (ISO 9001:2008) и имеет полный пакет разрешительных документов на проектирование, производство и монтаж. Нажмите на документ, чтобы открыть его в полном размере."
    />

    <div class="dj-wrap">
      <ul class="ct-badges dj-reveal">
        <li class="ct-badge"><ApIcon name="check" class="ct-check" />ISO 9001-2011 (ISO 9001:2008)</li>
        <li class="ct-badge"><ApIcon name="check" class="ct-check" />Аттестат 2-й категории сложности проектирования</li>
        <li class="ct-badge"><ApIcon name="check" class="ct-check" />Допуски на СМР: водоснабжение, канализация, металлоконструкции</li>
      </ul>
    </div>

    <section class="ct-sec">
      <div class="dj-wrap ct-list">
        <details v-for="cat in certificates" :key="cat.id" class="ct-cat dj-reveal" open>
          <summary class="ct-sum">
            <div>
              <h2 class="ct-h">{{ cat.title }}</h2>
              <p class="ct-desc">{{ cat.desc }}</p>
            </div>
            <span class="ct-num">{{ cat.items.length }} документов</span>
          </summary>
          <div class="ct-grid">
            <button
              v-for="item in cat.items"
              :key="item.num"
              type="button"
              class="ct-doc"
              @click="openLightbox(item)"
            >
              <span class="ct-thumb"><img :src="item.img" :alt="`Документ ${item.num}`" loading="lazy" /></span>
              <span class="ct-tag">№ {{ item.num }}</span>
              <span class="dj-more ct-open">Открыть</span>
            </button>
          </div>
        </details>
      </div>
    </section>

    <!-- Lightbox -->
    <div v-if="activeItem" class="ct-lb" role="dialog" aria-modal="true" @click.self="activeItem = null">
      <div class="ct-lb-in">
        <div class="ct-lb-bar">
          <span>Документ № {{ activeItem.num }}</span>
          <a :href="activeItem.img" download class="dj-more dj-more--light">Скачать</a>
          <button type="button" class="ct-lb-x" @click="activeItem = null">Закрыть</button>
        </div>
        <img :src="activeItem.img" :alt="`Документ ${activeItem.num}`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useReveal } from '~/composables/useReveal'
import { certificationCategories } from '~/composables/useCertifications'
const certificates = useEditableList('certificates', certificationCategories)

const activeItem = ref(null)
const openLightbox = (item) => { activeItem.value = item }
const root = ref(null)
useReveal(root)
const onKey = (e) => { if (e.key === 'Escape') activeItem.value = null }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

useHead({
  title: 'Сертификаты и аттестаты | ESP',
  meta: [
    { name: 'description', content: 'Сертификаты качества ЭкоСервисПроект: ISO 9001, аттестаты на проектирование, сертификаты соответствия и декларации.' }
  ]
})
</script>

<style scoped>
.ct-crumb { padding-top: 20px; }
.ct-badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 0; padding: 0; list-style: none; }
.ct-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; background: var(--dj-soft); font-size: 14px; color: var(--dj-ink); }
.ct-badge :deep(.ct-check) { width: 16px; height: 16px; flex-shrink: 0; color: var(--dj-blue); }
.ct-sec { padding: clamp(40px, 6vw, 72px) 0 clamp(64px, 8vw, 104px); }
.ct-list { display: grid; gap: clamp(48px, 6vw, 72px); }
.ct-sum { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid var(--dj-line); cursor: pointer; list-style: none; }
.ct-sum::-webkit-details-marker { display: none; }
.ct-h { font-size: clamp(22px, 2.2vw, 30px); line-height: 1.2; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); }
.ct-desc { margin-top: 6px; max-width: 60ch; font-size: 15px; line-height: 1.55; color: var(--dj-muted); }
.ct-num { flex-shrink: 0; font-size: 14px; color: var(--dj-muted); }
.ct-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
.ct-doc { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; text-align: left; }
.ct-thumb { display: block; width: 100%; aspect-ratio: 3 / 4; padding: 12%; background: var(--dj-soft); overflow: hidden; }
.ct-thumb img { width: 100%; height: 100%; object-fit: contain; box-shadow: 0 6px 18px rgba(0, 0, 0, .12); transition: transform 0.8s var(--dj-ease); }
.ct-doc:hover .ct-thumb img { transform: scale(1.05); }
.ct-tag { margin-top: 6px; font-size: 14px; font-weight: 500; color: var(--dj-ink); }
.ct-open { font-size: 13px; }
.ct-lb { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(11, 13, 16, 0.88); backdrop-filter: blur(8px); font-family: var(--dj-font); }
.ct-lb-in { position: relative; width: 100%; max-width: 44rem; }
.ct-lb-bar { display: flex; align-items: center; gap: 20px; margin-bottom: 12px; font-size: 14px; color: rgba(255, 255, 255, .8); }
.ct-lb-bar > span { margin-right: auto; }
.ct-lb-x { height: 32px; padding: 0 14px; border-radius: 999px; background: rgba(255, 255, 255, 0.16); color: #fff; font-size: 14px; }
.ct-lb-x:hover { background: rgba(255, 255, 255, 0.28); }
.ct-lb-in img { display: block; width: 100%; max-height: 82vh; object-fit: contain; background: #fff; }
@media (max-width: 1023px) { .ct-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 767px) {
  .ct-badges { justify-content: flex-start; }
  .ct-sum { flex-direction: column; align-items: flex-start; }
  .ct-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>

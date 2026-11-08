<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Сертификаты' }]" />
        <span class="ap-eyebrow ct-eyebrow">Документы и допуски</span>
        <h1 class="ap-title">Сертификаты и аттестаты</h1>
        <p class="ap-lede">
          ESP работает по системе менеджмента качества ISO 9001-2011 (ISO 9001:2008) и имеет полный пакет разрешительных документов на проектирование, производство и монтаж. Нажмите на документ, чтобы открыть его в полном размере.
        </p>

        <div class="ct-badges">
          <span class="ct-badge"><ApIcon name="check" class="ct-check" />ISO 9001-2011 (ISO 9001:2008)</span>
          <span class="ct-badge"><ApIcon name="check" class="ct-check" />Аттестат 2-й категории сложности проектирования</span>
          <span class="ct-badge"><ApIcon name="check" class="ct-check" />Допуски на СМР: водоснабжение, канализация, металлоконструкции</span>
        </div>

        <div class="ct-list">
          <details v-for="cat in certificates" :key="cat.id" class="ct-cat" open>
            <summary class="ct-sum">
              <div>
                <h3 class="ap-h3">{{ cat.title }}</h3>
                <p class="ap-text ct-desc">{{ cat.desc }}</p>
              </div>
              <span class="ap-pill ct-num">{{ cat.items.length }} документов</span>
            </summary>
            <div class="ct-grid">
              <button
                v-for="item in cat.items"
                :key="item.num"
                type="button"
                class="ct-doc"
                @click="openLightbox(item)"
              >
                <img :src="item.img" :alt="`Документ ${item.num}`" loading="lazy" />
                <span class="ct-tag">№ {{ item.num }}</span>
              </button>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <div v-if="activeItem" class="ct-lb" @click.self="activeItem = null">
      <div class="ct-lb-in">
        <button type="button" class="ct-lb-x" @click="activeItem = null">Закрыть</button>
        <img :src="activeItem.img" :alt="`Документ ${activeItem.num}`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { certificationCategories } from '~/composables/useCertifications'
const certificates = useEditableList('certificates', certificationCategories)

const activeItem = ref(null)
const openLightbox = (item) => { activeItem.value = item }

useHead({
  title: 'Сертификаты и аттестаты | ESP',
  meta: [
    { name: 'description', content: 'Сертификаты качества ЭкоСервисПроект: ISO 9001, аттестаты на проектирование, сертификаты соответствия и декларации.' }
  ]
})
</script>

<style scoped>
.ct-eyebrow { margin-top: 1.5rem; }
.ct-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.75rem; }
.ct-badge { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.5rem 1rem; border-radius: 999px; background: #fff; font-size: 14px; color: var(--ap-ink); }
.ct-badge :deep(.ct-check) { width: 16px; height: 16px; flex-shrink: 0; color: var(--ap-blue); }
.ct-list { display: grid; gap: 1rem; margin-top: 2.5rem; }
.ct-cat { border-radius: 18px; background: #fff; overflow: hidden; }
.ct-sum { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.5rem 1.75rem; cursor: pointer; list-style: none; }
.ct-sum::-webkit-details-marker { display: none; }
.ct-desc { margin-top: 0.3rem; }
.ct-num { flex-shrink: 0; }
.ct-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0.75rem; padding: 0 1.75rem 1.75rem; }
.ct-doc { position: relative; aspect-ratio: 3 / 4; border-radius: 12px; overflow: hidden; background: var(--ap-bg); }
.ct-doc img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.ct-doc:hover img { transform: scale(1.04); }
.ct-tag { position: absolute; right: 0.4rem; bottom: 0.4rem; padding: 0.1rem 0.5rem; border-radius: 999px; background: rgba(255, 255, 255, 0.92); font-size: 11px; color: var(--ap-ink); }
.ct-lb { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0, 0, 0, 0.8); }
.ct-lb-in { position: relative; width: 100%; max-width: 42rem; }
.ct-lb-x { position: absolute; top: -2.6rem; right: 0; padding: 0.35rem 0.9rem; border-radius: 999px; background: rgba(255, 255, 255, 0.16); color: #fff; font-size: 14px; }
.ct-lb-x:hover { background: rgba(255, 255, 255, 0.28); }
.ct-lb-in img { width: 100%; max-height: 85vh; object-fit: contain; border-radius: 14px; background: #fff; }
@media (max-width: 1023px) { .ct-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 767px) {
  .ct-sum { flex-direction: column; align-items: flex-start; padding: 1.25rem; }
  .ct-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 0 1.25rem 1.25rem; }
}
</style>

<template>
  <!-- Ряд эталонных карточек оборудования (EquipCard), как на главной.
       layout="scroll" — горизонтальная лента по ширине контента;
       layout="grid" — сетка с запасом сверху под выступающее изделие.
       bare — без своего фона и вертикальных отступов (внутри чужой секции). -->
  <section class="nr" :class="{ 'nr--bare': bare, 'nr--p2': phone2 }" :aria-label="title || 'Оборудование ESP'">
    <h2 v-if="title" class="nr-h">{{ title }}</h2>
    <div ref="rowEl" class="nr-row" :class="`nr-row--${layout}`" @load.capture="measure">
      <EquipCard v-for="e in items" :key="e.slug" class="dj-reveal" :item="e" :meta="metaOf ? metaOf(e) : ''" />
    </div>
  </section>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  title: { type: String, default: '' },
  layout: { type: String, default: 'scroll' },
  // Телефон: сетка в две колонки компактных карточек вместо ленты
  phone2: { type: Boolean, default: false },
  bare: Boolean,
  metaOf: { type: Function, default: null }
})

// Сколько изделие реально выходит за верх карточки: картинка прижата к низу
// своей рамки, у широких изделий выход меньше. Отступ над рядом и над каждой
// карточкой берём по факту, а не с запасом — без пустых полос над карточками.
const rowEl = ref(null)
let raf = 0
const measure = () => {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const row = rowEl.value
    if (!row) return
    let max = 0
    row.querySelectorAll('.ec').forEach((c) => {
      const img = c.querySelector('.ec__img')
      if (!img || !img.complete || !img.naturalWidth) return
      const pro = Math.max(0, Math.round(c.getBoundingClientRect().top - img.getBoundingClientRect().top))
      c.style.setProperty('--ec-pro', pro + 'px')
      max = Math.max(max, pro)
    })
    row.style.setProperty('--nr-pro', max + 'px')
  })
}
watch(() => props.items, () => nextTick(measure))
onMounted(() => { measure(); window.addEventListener('resize', measure, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('resize', measure))
</script>

<style scoped>
.nr { padding: clamp(48px, 6vw, 80px) 0 clamp(24px, 3vw, 40px); background: #EDEDED; font-family: var(--dj-font); }
.nr--bare { padding: 0; background: none; }
.nr-h { max-width: 1200px; margin: 0 auto; padding: 0 24px; font-size: var(--t-sec); line-height: var(--t-sec-lh); font-weight: 600; letter-spacing: var(--t-sec-ls); color: #1A1A1A; }
/* Лента как на главной: карточки от края контента, прокрутка вбок */
.nr-row--scroll { display: grid; grid-auto-flow: column; grid-auto-columns: 300px; gap: 20px; overflow-x: auto; padding: calc(var(--nr-pro, 108px) + 12px) max(22px, calc((100vw - 1200px) / 2)) 24px; scroll-padding: 0 max(22px, calc((100vw - 1200px) / 2)); scroll-snap-type: x mandatory; scrollbar-width: none; }
.nr-row--scroll::-webkit-scrollbar { display: none; }
/* Сетка: место сверху под изделие, выходящее за край карточки */
.nr-row--grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 280px)); justify-content: center; align-items: stretch; gap: calc(var(--nr-pro, 100px) + 20px) 20px; max-width: 1248px; margin: 0 auto; padding: calc(var(--nr-pro, 108px) + 12px) 24px 24px; }
.nr--bare .nr-row--grid { padding-left: 0; padding-right: 0; }
@media (max-width: 734px) {
  .nr-h { padding: 0 16px; }
  .nr-row--scroll { grid-auto-columns: minmax(270px, 82vw); gap: 14px; padding: calc(var(--nr-pro, 98px) + 12px) 16px 24px; scroll-padding: 0 16px; }
  /* На телефоне сетка становится лентой, чтобы не тянуть страницу на километр */
  .nr-row--grid { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: minmax(270px, 82vw); gap: 14px; overflow-x: auto; padding: calc(var(--nr-pro, 98px) + 12px) 16px 24px; scroll-padding: 0 16px; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .nr-row--grid::-webkit-scrollbar { display: none; }
  .nr--bare .nr-row--grid { margin: 0 -16px; padding-left: 16px; padding-right: 16px; }
}
/* Телефон, phone2: две колонки; между карточками без выступа зазор 10px, как по
   горизонтали; над карточкой с выступающим изделием — место под изделие */
@media (max-width: 734px) {
  .nr--p2 .nr-row--grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-flow: row; grid-auto-columns: auto; gap: 10px; align-items: end; overflow: visible; padding: 10px 0 8px; margin: 0; scroll-snap-type: none; }
  .nr--p2 :deep(.ec) { min-height: 0; }
  .nr--p2 :deep(.ec:not(.ec--inset)) { margin-top: calc(var(--ec-pro, 46px) + 10px); padding-top: 92px; --ec-ib: 86px; --ec-ih: 132px; }
  .nr--p2 :deep(.ec__img) { width: 88%; }
  .nr--p2 :deep(.ec__inset) { margin: 10px 10px 8px; height: 104px; }
  .nr--p2 :deep(.ec__body) { padding: 0 12px 14px; gap: 4px; }
  .nr--p2 :deep(.ec__body b) { font-size: 15px; line-height: 1.2; }
  .nr--p2 :deep(.ec__body small) { font-size: 12px; }
}
</style>

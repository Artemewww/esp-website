<template>
  <!-- Ряд эталонных карточек оборудования (EquipCard), как на главной.
       layout="scroll" — горизонтальная лента по ширине контента;
       layout="grid" — сетка с запасом сверху под выступающее изделие.
       bare — без своего фона и вертикальных отступов (внутри чужой секции). -->
  <section class="nr" :class="{ 'nr--bare': bare }" :aria-label="title || 'Оборудование ESP'">
    <h2 v-if="title" class="nr-h">{{ title }}</h2>
    <div class="nr-row" :class="`nr-row--${layout}`">
      <EquipCard v-for="e in items" :key="e.slug" class="dj-reveal" :item="e" :meta="metaOf ? metaOf(e) : ''" />
    </div>
  </section>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  title: { type: String, default: '' },
  layout: { type: String, default: 'scroll' },
  bare: Boolean,
  metaOf: { type: Function, default: null }
})
</script>

<style scoped>
.nr { padding: clamp(48px, 6vw, 80px) 0 clamp(24px, 3vw, 40px); background: #EDEDED; font-family: var(--dj-font); }
.nr--bare { padding: 0; background: none; }
.nr-h { max-width: 1200px; margin: 0 auto; padding: 0 24px; font-size: clamp(28px, 3.9vw, 56px); line-height: 1.07; font-weight: 600; letter-spacing: -0.005em; color: #1A1A1A; }
/* Лента как на главной: карточки от края контента, прокрутка вбок */
.nr-row--scroll { display: grid; grid-auto-flow: column; grid-auto-columns: 300px; gap: 20px; overflow-x: auto; padding: 120px max(22px, calc((100vw - 1200px) / 2)) 24px; scroll-padding: 0 max(22px, calc((100vw - 1200px) / 2)); scroll-snap-type: x mandatory; scrollbar-width: none; }
.nr-row--scroll::-webkit-scrollbar { display: none; }
/* Сетка: место сверху под изделие, выходящее за край карточки */
.nr-row--grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 280px)); justify-content: center; align-items: stretch; gap: 120px 20px; max-width: 1248px; margin: 0 auto; padding: 120px 24px 24px; }
.nr--bare .nr-row--grid { padding-left: 0; padding-right: 0; }
@media (max-width: 734px) {
  .nr-h { padding: 0 16px; }
  .nr-row--scroll { grid-auto-columns: minmax(270px, 82vw); gap: 14px; padding: 110px 16px 24px; scroll-padding: 0 16px; }
  /* На телефоне сетка становится лентой, чтобы не тянуть страницу на километр */
  .nr-row--grid { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: minmax(270px, 82vw); gap: 14px; overflow-x: auto; padding: 110px 16px 24px; scroll-padding: 0 16px; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .nr-row--grid::-webkit-scrollbar { display: none; }
  .nr--bare .nr-row--grid { margin: 0 -16px; padding-left: 16px; padding-right: 16px; }
}
</style>

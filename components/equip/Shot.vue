<template>
  <!-- Поле товара в духе Apple Store: рендер на светло-сером, белый фон
       рендера растворяется через multiply. Если рендера нет — аккуратная
       пустая плашка с контуром типа оборудования. -->
  <div class="esh" :class="{ 'is-empty': !src }">
    <img v-if="src" :src="src" :alt="item?.name" :loading="eager ? 'eager' : 'lazy'" decoding="async" :fetchpriority="eager ? 'high' : undefined" class="esh-img" />
    <div v-else class="esh-empty">
      <EquipPlaceholder :kind="placeholderOf(item)" class="esh-ph" />
      <span v-if="caption" class="esh-cap">Изображение появится позже</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { renderOf, placeholderOf } from '~/utils/equipVisual'

const props = defineProps({
  item: { type: Object, default: null },
  eager: Boolean,
  caption: { type: Boolean, default: true }
})
const src = computed(() => renderOf(props.item))
</script>

<style scoped>
.esh { position: relative; display: grid; place-items: center; width: 100%; height: 100%; overflow: hidden; background: #f5f5f7; font-family: var(--dj-font); }
.esh-img { width: 82%; height: 82%; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.6s cubic-bezier(0, 0, 0.5, 1); }
.esh-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; }
.esh-ph { width: clamp(72px, 36%, 150px); color: #c7c7cc; stroke-width: 2; }
.esh-cap { font-size: 12px; line-height: 1.33; letter-spacing: -0.01em; color: #86868b; }
.esh.is-empty { background: #f5f5f7; }
@media (prefers-reduced-motion: reduce) { .esh-img { transition: none; } }
</style>

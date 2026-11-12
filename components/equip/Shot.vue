<template>
  <!-- Поле товара в духе Apple Store: рендер на светло-сером, белый фон
       рендера растворяется через multiply. Если рендера нет — аккуратная
       пустая плашка с контуром типа оборудования. -->
  <div class="esh" :class="{ 'is-empty': !src }">
    <img v-if="src" :srcset="srcset(src)" sizes="(max-width: 734px) 100vw, 33vw" :src="src" :alt="item?.name" :loading="eager ? 'eager' : 'lazy'" decoding="async" :fetchpriority="eager ? 'high' : undefined" class="esh-img" />
    <EquipBrand v-else :item="item" compact />
  </div>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
import { computed } from 'vue'
import { renderOf } from '~/utils/equipVisual'

const props = defineProps({
  item: { type: Object, default: null },
  eager: Boolean,
  caption: { type: Boolean, default: true }
})
const src = computed(() => renderOf(props.item))
</script>

<style scoped>
.esh { position: relative; display: grid; place-items: center; width: 100%; height: 100%; overflow: hidden; background: #EDEDED; font-family: var(--dj-font); }
.esh-img { width: 82%; height: 82%; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.6s cubic-bezier(0, 0, 0.5, 1); }
.esh-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; }
.esh-ph { width: clamp(72px, 36%, 150px); color: #c7c7cc; stroke-width: 1.5; }
.esh-cap { font-size: 12px; line-height: 1.33; letter-spacing: -0.01em; color: #8A8A8A; }
.esh.is-empty { background: #EDEDED; }
@media (prefers-reduced-motion: reduce) { .esh-img { transition: none; } }
</style>

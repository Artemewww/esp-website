<template>
  <!-- Эталонная карточка оборудования (как на главной, ряд «Оборудование ESP»):
       белая карточка, вырезанное изделие выходит за верхний край, внизу название,
       две строки описания и синяя кнопка. Нет вырезки — чистый рендер или фирменная
       схема в окне вверху карточки (без мыльных фото). -->
  <NuxtLink :to="`/equipment/${d.slug}`" class="ec" :class="{ 'ec--inset': !cut }">
    <img v-if="cut" class="ec__img" :src="cut" :alt="d.name" loading="lazy" decoding="async" />
    <span v-else class="ec__inset">
      <img v-if="render" class="ec__render" :src="render" :alt="d.name" loading="lazy" decoding="async" />
      <EquipBrand v-else :item="d" compact />
    </span>
    <span class="ec__body">
      <b>{{ d.name }}</b>
      <small>{{ d.desc }}</small>
      <span v-if="meta" class="ec__meta">{{ meta }}</span>
      <span class="ec__foot"><span class="ec__btn">{{ cta }}</span></span>
    </span>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'
import { cutSrc } from '~/composables/useEquipCut'
import { renderOf } from '~/utils/equipVisual'
import catalog from '~~/content/defaults/equipment.json'

const props = defineProps({
  item: { type: Object, required: true },
  cta: { type: String, default: 'Подробнее ›' },
  meta: { type: String, default: '' }
})
// Единые данные по slug: короткое описание и фото из каталога, остальное — из item
const d = computed(() => {
  const c = catalog.find((e) => e.slug === props.item.slug) || {}
  return { ...props.item, name: props.item.name || c.name, desc: c.desc || props.item.desc, photo: c.photo || props.item.photo || props.item.image }
})
const cut = computed(() => cutSrc(d.value.photo || '') || cutSrc(props.item.image || '') || cutSrc(props.item.src || ''))
const render = computed(() => renderOf(d.value))
</script>

<style scoped>
.ec { position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-width: 0; min-height: 380px; border-radius: var(--r-md); container-type: inline-size; scroll-snap-align: start; color: #1A1A1A; background: #fff; font-family: var(--dj-font); text-decoration: none; box-shadow: var(--sh-2); transition: box-shadow 0.4s var(--dj-ease), transform 0.4s var(--dj-ease); }
/* Под выступающее изделие резервируем место: текст никогда не наезжает на картинку */
.ec:not(.ec--inset) { padding-top: 172px; }
.ec:hover { transform: translateY(-3px); box-shadow: var(--sh-2); }
.ec:focus-visible { outline: 2px solid #002366; outline-offset: 3px; }
.ec__img { position: absolute; left: 50%; top: -84px; width: 82%; height: 240px; object-fit: contain; object-position: center bottom; transform: translateX(-50%); filter: drop-shadow(0 14px 14px rgba(10, 20, 35, 0.14)); transition: transform 0.7s var(--dj-ease); }
.ec:hover .ec__img { transform: translateX(-50%) translateY(-8px) scale(1.03); }
.ec__inset { position: relative; flex: none; display: block; margin: 20px 20px 18px; height: 168px; overflow: hidden; border-radius: var(--r-md); background: #fff; transition: transform 0.7s var(--dj-ease); }
.ec__render { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
.ec:hover .ec__inset { transform: translateY(-6px); }
.ec__body { margin-top: auto; display: grid; gap: 6px; padding: 0 clamp(20px, 9cqi, 28px) 26px; }
.ec__body b { font-size: clamp(20px, 8.4cqi, 24px); line-height: 1.16667; font-weight: 600; letter-spacing: 0.009em; overflow-wrap: break-word; }
.ec__body small { font-size: 14px; line-height: 1.42859; letter-spacing: -0.016em; color: #5E5E5E; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ec__foot { display: flex; align-items: center; margin-top: 16px; }
.ec__btn { flex: none; padding: 8px 16px; border-radius: var(--r-pill); background: #002366; color: #fff; font-size: 14px; line-height: 1.2; letter-spacing: -0.016em; transition: background-color 0.2s ease; }
.ec:hover .ec__btn { background: #002366; }
.ec__meta { font-size: 12px; line-height: 1.33; font-weight: 600; letter-spacing: -0.01em; color: #002366; }
@media (prefers-reduced-motion: reduce) { .ec, .ec__img, .ec__inset { transition: none; } }
</style>

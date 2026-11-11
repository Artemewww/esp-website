<template>
  <!-- Ряд карточек как «Neuheiten» в DJI Store: цветной градиент, изделие
       выходит за верхний край карточки, внизу название, строка и кнопка. -->
  <section class="nr" :aria-label="title">
    <h2 v-if="title" class="nr-h">{{ title }}</h2>
    <div class="nr-row">
      <NuxtLink v-for="(e, i) in items" :key="e.slug" :to="`/equipment/${e.slug}`" class="nr-card" :class="{ 'nr-card--photo': !hasCut(e.photo) }" :style="{ '--tone': TONES[i % TONES.length] }">
        <img v-if="hasCut(e.photo)" class="nr-img" :src="cutSrc(e.photo)" :alt="e.name" loading="lazy" decoding="async" />
        <span v-else class="nr-photo"><img :src="e.photo" :alt="e.name" loading="lazy" decoding="async" /></span>
        <span class="nr-body">
          <b>{{ e.name }}</b>
          <small>{{ e.desc }}</small>
          <span class="nr-foot"><span>{{ e.category || 'Оборудование ESP' }}</span><span class="nr-btn">Подробнее</span></span>
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { hasCut, cutSrc } from '~/composables/useEquipCut'
// Если у изделия нет вырезки без фона — показываем снимок целиком
defineProps({ items: { type: Array, required: true }, title: { type: String, default: '' } })
const TONES = ['#9aa8b6', '#7f93a8', '#a89a8a', '#8696a7', '#93a3a0']
</script>

<style scoped>
.nr { padding: clamp(48px, 6vw, 80px) 0 24px; background: #f5f5f7; font-family: var(--dj-font); }
.nr-h { max-width: 1200px; margin: 0 auto; padding: 0 24px; font-size: clamp(28px, 3.9vw, 56px); line-height: 1.07; font-weight: 600; letter-spacing: -0.005em; color: #1d1d1f; }
.nr-row { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(280px, 300px); gap: 12px; overflow-x: auto; padding: 110px max(24px, calc((100vw - 1200px) / 2)) 24px; scroll-snap-type: x mandatory; scrollbar-width: none; }
.nr-row::-webkit-scrollbar { display: none; }
.nr-card { position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-height: 340px; border-radius: 18px; scroll-snap-align: start; box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08); color: #fff; background: linear-gradient(180deg, color-mix(in srgb, var(--tone) 55%, #fff) 0%, var(--tone) 55%, color-mix(in srgb, var(--tone) 75%, #1d2733) 100%); }
.nr-img { position: absolute; left: 50%; top: -92px; width: 84%; height: 230px; object-fit: contain; object-position: center bottom; transform: translateX(-50%); filter: drop-shadow(0 18px 20px rgba(10, 20, 35, 0.28)); transition: transform 0.7s var(--dj-ease); }
.nr-card:hover .nr-img { transform: translateX(-50%) translateY(-8px) scale(1.03); }
.nr-body { display: grid; gap: 6px; padding: 0 24px 24px; }
.nr-body b { font-size: 21px; line-height: 1.19048; font-weight: 600; letter-spacing: 0.011em; }
.nr-body small { font-size: 14px; line-height: 1.42859; letter-spacing: -0.016em; color: rgba(255, 255, 255, 0.78); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.nr-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; font-size: 12px; letter-spacing: -0.01em; color: rgba(255, 255, 255, 0.82); }
.nr-btn { padding: 4px 11px; border-radius: 980px; background: #fff; color: var(--dj-ink); font-size: 12px; line-height: 1.33337; }
.nr-photo { position: absolute; left: 14px; right: 14px; top: -70px; height: 210px; overflow: hidden; border-radius: 14px; box-shadow: 0 18px 30px -16px rgba(10, 20, 35, 0.45); transition: transform 0.7s var(--dj-ease); }
.nr-photo img { width: 100%; height: 100%; object-fit: cover; }
.nr-card:hover .nr-photo { transform: translateY(-6px); }
@media (max-width: 734px) { .nr-h { padding: 0 16px; } .nr-row { padding-left: 16px; padding-right: 16px; scroll-padding: 0 16px; } }
</style>

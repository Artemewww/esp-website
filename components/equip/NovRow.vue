<template>
  <!-- Ряд карточек как «Neuheiten» в DJI Store: цветной градиент, изделие
       выходит за верхний край карточки, внизу название, строка и кнопка. -->
  <section class="nr" :aria-label="title">
    <h2 v-if="title" class="nr-h">{{ title }}</h2>
    <div class="nr-row">
      <NuxtLink v-for="(e, i) in items" :key="e.slug" :to="`/equipment/${e.slug}`" class="nr-card" :style="{ '--tone': TONES[i % TONES.length] }">
        <img class="nr-img" :src="e.photo.replace('/images/equipment/', '/images/equipment/cut/')" :alt="e.name" loading="lazy" decoding="async" />
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
defineProps({ items: { type: Array, required: true }, title: { type: String, default: '' } })
const TONES = ['#9aa8b6', '#7f93a8', '#a89a8a', '#8696a7', '#93a3a0']
</script>

<style scoped>
.nr { padding: clamp(40px, 5vw, 64px) 0 24px; background: #f0f2f4; font-family: var(--dj-font); }
.nr-h { max-width: 1200px; margin: 0 auto; padding: 0 24px; font-size: clamp(22px, 2vw, 28px); font-weight: 600; letter-spacing: -0.03em; color: var(--dj-ink); }
.nr-row { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(280px, 300px); gap: 12px; overflow-x: auto; padding: 110px max(24px, calc((100vw - 1200px) / 2)) 24px; scroll-snap-type: x mandatory; scrollbar-width: none; }
.nr-row::-webkit-scrollbar { display: none; }
.nr-card { position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-height: 340px; border-radius: 6px; scroll-snap-align: start; color: #fff; background: linear-gradient(180deg, color-mix(in srgb, var(--tone) 55%, #fff) 0%, var(--tone) 55%, color-mix(in srgb, var(--tone) 75%, #1d2733) 100%); }
.nr-img { position: absolute; left: 50%; top: -92px; width: 84%; height: 230px; object-fit: contain; object-position: center bottom; transform: translateX(-50%); filter: drop-shadow(0 18px 20px rgba(10, 20, 35, 0.28)); transition: transform 0.7s var(--dj-ease); }
.nr-card:hover .nr-img { transform: translateX(-50%) translateY(-8px) scale(1.03); }
.nr-body { display: grid; gap: 6px; padding: 0 20px 20px; }
.nr-body b { font-size: 20px; line-height: 1.2; font-weight: 600; letter-spacing: -0.03em; }
.nr-body small { font-size: 13px; line-height: 1.45; color: rgba(255, 255, 255, 0.78); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.nr-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; font-size: 13px; color: rgba(255, 255, 255, 0.82); }
.nr-btn { padding: 8px 16px; border-radius: 999px; background: #fff; color: var(--dj-ink); font-size: 14px; }
</style>

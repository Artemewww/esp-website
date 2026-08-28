<template>
  <!-- Стена логотипов: те же партнёры и институты, что на главной.
       Здесь без бесконечной ленты — статичная сетка читается спокойнее
       на внутренней странице, где логотипы разглядывают, а не «ловят». -->
  <div class="pw">
    <div v-for="(logo, i) in partnerLogos" :key="i" class="pw-cell">
      <img :src="logo" alt="" loading="lazy" />
    </div>
  </div>
</template>

<script setup>
import { partnerLogos } from '~/composables/usePartnerLogos'
</script>

<style scoped>
.pw {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: #ededed;
  border: 1px solid #ededed;
}
@media (min-width: 640px) { .pw { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .pw { grid-template-columns: repeat(5, minmax(0, 1fr)); } }

.pw-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1.25rem;
  background: #fff;
  min-height: 8.5rem;
}

/* Логотипы приходят разного веса и цвета: в покое приглушены до общего
   тона, на наведении оживают — иначе стена рябит. */
.pw-cell img {
  max-width: 100%;
  max-height: 4.5rem;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.55;
  transition: filter 0.3s ease, opacity 0.3s ease;
}
.pw-cell:hover img {
  filter: grayscale(0);
  opacity: 1;
}
</style>

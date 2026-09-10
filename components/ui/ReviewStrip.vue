<template>
  <!-- Отзывы показываем документами, а не пересказом: заголовок и ссылка
       «читать отзывы» ничего не доказывают, скан письма — доказывает. -->
  <div class="rs">
    <div class="rs-track">
      <button
        v-for="(img, i) in shown"
        :key="img"
        type="button"
        class="rs-card"
        :aria-label="`Открыть отзыв №${i + 1}`"
        @click="open(i)"
      >
        <img :src="img" :alt="`Отзыв клиента ESP №${i + 1}`" loading="lazy" />
      </button>
    </div>

    <!-- Лайтбокс: скан письма нужно читать, а в ленте он мелкий -->
    <Teleport to="body">
      <div v-if="active > -1" class="rs-lightbox" @click="active = -1">
        <button type="button" class="rs-close" aria-label="Закрыть">×</button>
        <img :src="shown[active]" :alt="`Отзыв клиента ESP №${active + 1}`" @click.stop />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  // Сколько сканов показать в ленте
  limit: { type: Number, default: 8 }
})

// Сканы приходят из админки (/admin → «Отзывы»). Пока правок нет, там лежит
// тот же список из 21 файла, что и раньше лежал прямо здесь.
const fallback = Array.from({ length: 21 }, (_, i) => ({
  image: `/images/reviews/review-${String(i + 1).padStart(2, '0')}.jpg`
}))
const reviews = useEditableList('reviews', fallback)
const all = computed(() => reviews.value.map((r) => r.image).filter(Boolean))
const shown = computed(() => all.value.slice(0, props.limit))

const active = ref(-1)

const onKey = (e) => { if (e.key === 'Escape') active.value = -1 }

const open = (i) => {
  active.value = i
  window.addEventListener('keydown', onKey)
}

onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.rs-track {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.75rem;
  /* Полоса прокрутки на светлом фоне выглядит грязно, а лента и так
     читается как лента: край последней карточки виден. */
  scrollbar-width: thin;
}

.rs-card {
  flex: 0 0 auto;
  width: clamp(150px, 22vw, 210px);
  scroll-snap-align: start;
  background: #fff;
  border: 1px solid #ededed;
  padding: 0.5rem;
  cursor: zoom-in;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.rs-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 35, 102, 0.35);
  box-shadow: 0 18px 40px -22px rgba(0, 35, 102, 0.5);
}
.rs-card img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: top center;
  display: block;
}

.rs-lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(8, 10, 14, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
  cursor: zoom-out;
}
.rs-lightbox img {
  max-width: min(100%, 900px);
  max-height: 92vh;
  object-fit: contain;
  cursor: default;
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.8);
}
.rs-close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 2.4rem;
  line-height: 1;
  color: rgba(255, 255, 255, 0.75);
  background: none;
  border: none;
  cursor: pointer;
}
.rs-close:hover { color: #fff; }
</style>

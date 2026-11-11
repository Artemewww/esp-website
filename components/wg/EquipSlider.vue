<template>
  <!-- «How much water do you need?» у Watergen: крупная подпись, рендер машины
       и ползунок с делениями. У ESP ползунок идёт по ступеням очистки, под
       каждой — своя машина из каталога. -->
  <div class="es">
    <div class="es-stage">
      <div class="es-info">
        <span class="es-step">{{ current.stage }}</span>
        <span class="es-big">{{ String(index + 1).padStart(2, '0') }}</span>
        <h3 class="es-name">{{ current.name }}</h3>
        <NuxtLink :to="`/equipment/${current.slug}`" class="es-link">
          Подробнее
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </div>
      <div class="es-photo">
        <Transition name="es-swap" mode="out-in">
          <img :key="current.slug" :src="current.image" :alt="current.name" loading="lazy" decoding="async" />
        </Transition>
      </div>
    </div>

    <div class="es-track">
      <input
        v-model.number="index"
        class="es-range"
        type="range"
        min="0"
        :max="items.length - 1"
        step="1"
        aria-label="Выбор оборудования"
      />
      <ol class="es-ticks" :style="{ '--n': items.length }">
        <li v-for="(it, i) in items" :key="it.slug" :class="{ 'is-on': i === index }">
          <button type="button" @click="index = i">{{ it.short }}</button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ items: { type: Array, required: true } })
const index = ref(0)
const current = computed(() => props.items[index.value])
</script>

<style scoped>
.es-stage {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 6fr);
  align-items: center;
  gap: 2rem;
  min-height: 22rem;
}
.es-info { display: grid; justify-items: start; gap: 0.35rem; }
.es-step { font-size: 11.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--wg-label); }
.es-big {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(4.5rem, 9vw, 7.5rem);
  line-height: 0.9;
  letter-spacing: -0.05em;
  color: #a9c6e8;
}
.es-name { font-family: var(--font-display); font-weight: 700; font-size: clamp(1.3rem, 2vw, 1.7rem); line-height: 1.15; color: var(--wg-ink); }
.es-link { display: inline-flex; align-items: center; gap: 0.35rem; margin-top: 0.4rem; font-size: 14px; font-weight: 600; color: var(--wg-label); }
.es-link svg { width: 14px; height: 14px; }
.es-photo { position: relative; height: clamp(15rem, 28vw, 22rem); }
.es-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 24px 36px rgba(0, 35, 102, 0.14)); }
.es-swap-enter-active, .es-swap-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.es-swap-enter-from { opacity: 0; transform: translateY(10px); }
.es-swap-leave-to { opacity: 0; transform: translateY(-10px); }

.es-track { position: relative; margin-top: 2.5rem; }
.es-range { width: 100%; accent-color: var(--wg-ink); cursor: pointer; }
.es-ticks {
  display: grid;
  grid-template-columns: repeat(var(--n, 7), minmax(0, 1fr));
  list-style: none;
  padding: 0;
  margin-top: 0.75rem;
}
.es-ticks li { text-align: center; }
.es-ticks li:first-child { text-align: left; }
.es-ticks li:last-child { text-align: right; }
.es-ticks button { font-size: 12px; line-height: 1.3; color: var(--wg-muted); transition: color 0.2s ease; }
.es-ticks li.is-on button { color: var(--wg-ink); font-weight: 600; }
@media (max-width: 767px) {
  .es-stage { grid-template-columns: 1fr; min-height: 0; }
  .es-photo { order: -1; height: 14rem; }
  .es-ticks { display: none; }
}
</style>

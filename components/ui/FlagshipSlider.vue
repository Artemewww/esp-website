<template>
  <!-- Флагманы: объекты со своей съёмкой идут первыми и показываются так же,
       как на главной — кадром во весь блок, а не карточкой в сетке. -->
  <section
    class="fs relative w-full overflow-hidden bg-esp-black"
    :class="{ 'fs--full': full }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div class="fs-stage relative w-full">
      <div
        v-for="(p, i) in items"
        :key="p.slug"
        class="absolute inset-0 transition-opacity duration-700"
        :style="{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }"
        :aria-hidden="i !== index"
      >
        <video
          v-if="p.video"
          class="absolute inset-0 w-full h-full object-cover"
          :src="i === index || loaded.has(i) ? p.video : undefined"
          :poster="p.poster"
          autoplay
          muted
          loop
          playsinline
          preload="none"
        ></video>
        <img
          v-else
          class="absolute inset-0 w-full h-full object-cover"
          :src="p.poster || (p.gallery && p.gallery[0])"
          :alt="p.name"
          loading="lazy"
          decoding="async"
        />
        <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(26,26,26,0.94) 0%, rgba(26,26,26,0.7) 32%, rgba(26,26,26,0.15) 72%)"></div>
      </div>

      <!-- Подпись лежит поверх всех кадров: при смене слайда меняется текст,
           а не переезжает блок. -->
      <div class="absolute inset-x-0 bottom-0">
        <div class="fs-copy mx-auto text-white">
          <slot name="eyebrow" />
          <span class="fs-badge">
            {{ current.badge || current.location }}
          </span>
          <h2 class="fs-name">{{ current.name }}</h2>
          <p class="mt-3 text-sm md:text-base text-white/85 leading-relaxed max-w-2xl line-clamp-3">{{ current.desc }}</p>

          <div class="flex flex-wrap items-center gap-3 pt-5">
            <NuxtLink
              :to="`/projects/${current.slug}`"
              class="fs-btn"
            >
              Смотреть объект
            </NuxtLink>
            <span class="text-white/55 text-sm font-inter tabular-nums">
              {{ String(index + 1).padStart(2, '0') }} / {{ String(items.length).padStart(2, '0') }}
            </span>
          </div>

          <!-- Полоски как в первом экране главной: равной ширины, активная
               залита белым. -->
          <div class="flex items-center gap-[7px] pt-6 w-full max-w-sm">
            <button
              v-for="(p, i) in items"
              :key="p.slug"
              type="button"
              class="h-[3px] flex-1 rounded-[2px] transition-colors"
              :class="i === index ? 'bg-white/95' : 'bg-white/[0.28] hover:bg-white/50'"
              :aria-label="p.name"
              :aria-current="i === index ? 'true' : undefined"
              @click="go(i)"
            ></button>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="fs-arrow hidden md:flex left-6"
        aria-label="Предыдущий объект"
        @click="go(index - 1)"
      >‹</button>
      <button
        type="button"
        class="fs-arrow hidden md:flex right-6"
        aria-label="Следующий объект"
        @click="go(index + 1)"
      >›</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  interval: { type: Number, default: 7000 },
  // Кадр на весь экран: первый блок страницы «Проекты»
  full: { type: Boolean, default: false }
})

const index = ref(0)
const hovered = ref(false)
// Ролики соседних слайдов не грузим заранее: на странице их одиннадцать.
const loaded = ref(new Set([0]))
const current = computed(() => props.items[index.value] || {})

let timer = null
const go = (i) => {
  const n = props.items.length
  index.value = ((i % n) + n) % n
  loaded.value.add(index.value)
  restart()
}
const restart = () => {
  clearInterval(timer)
  timer = setInterval(() => { if (!hovered.value) go(index.value + 1) }, props.interval)
}

// Свайп на телефоне листает объекты
let tx = 0, ty = 0
const onTouchStart = (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY }
const onTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - tx
  const dy = e.changedTouches[0].clientY - ty
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(index.value + (dx < 0 ? 1 : -1))
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  restart()
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.fs-stage { height: min(72vh, 42rem); }
.fs--full .fs-stage { height: 100vh; height: 100svh; min-height: 34rem; max-height: 62rem; }
.fs-copy { max-width: 76rem; padding: 0 1.5rem 2.25rem; }
.fs--full .fs-copy { padding-bottom: clamp(2rem, 6vh, 4rem); }
.fs-badge { display: inline-flex; align-items: center; padding: 0.3rem 0.8rem; border-radius: var(--r-pill); background: rgba(255, 255, 255, 0.14); backdrop-filter: blur(8px); font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.92); }
.fs-name { margin-top: 0.75rem; max-width: 48rem; font-family: var(--font-display); font-weight: 700; font-size: clamp(1.6rem, 4.2vw, 3.25rem); line-height: 1.08; letter-spacing: -0.025em; }
.fs-btn { display: inline-flex; align-items: center; padding: 0.7rem 1.35rem; border-radius: var(--r-pill); background: #fff; color: #1d1d1f; font-size: 15px; line-height: 1.2; transition: background-color 0.2s ease; }
.fs-btn:hover { background: #e8e8ed; }
.fs-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255, 255, 255, 0.16); backdrop-filter: blur(8px); color: #fff; font-size: 24px; line-height: 1; transition: background-color 0.2s ease; }
.fs-arrow:hover { background: rgba(255, 255, 255, 0.3); }
@media (max-width: 767px) {
  .fs-copy { padding: 0 1.5rem 1.75rem; }
}
</style>

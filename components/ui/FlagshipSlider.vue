<template>
  <!-- Флагманы: объекты со своей съёмкой идут первыми и показываются так же,
       как на главной — кадром во весь блок, а не карточкой в сетке. -->
  <section
    class="relative w-full overflow-hidden bg-esp-black"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="relative w-full" :style="{ height: 'min(72vh, 42rem)' }">
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
        <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(6,10,20,0.94) 0%, rgba(6,10,20,0.7) 32%, rgba(6,10,20,0.15) 72%)"></div>
      </div>

      <!-- Подпись лежит поверх всех кадров: при смене слайда меняется текст,
           а не переезжает блок. -->
      <div class="absolute inset-x-0 bottom-0">
        <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pb-8 md:pb-12 text-white">
          <span class="inline-block px-3 py-1.5 bg-black/40 border border-white/20 text-esp-lidar text-[11px] md:text-xs font-medium uppercase tracking-wide backdrop-blur-sm">
            {{ current.badge || current.location }}
          </span>
          <h2 class="font-rounded text-xl sm:text-3xl md:text-4xl leading-tight max-w-3xl mt-3">{{ current.name }}</h2>
          <p class="mt-3 text-sm md:text-base text-white/85 leading-relaxed max-w-2xl line-clamp-3">{{ current.desc }}</p>

          <div class="flex flex-wrap items-center gap-3 pt-5">
            <NuxtLink
              :to="`/projects/${current.slug}`"
              class="px-6 py-3 bg-esp-green text-white font-medium hover:bg-esp-green/90 transition"
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
        class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center bg-black/35 hover:bg-black/60 text-white backdrop-blur-sm transition"
        aria-label="Предыдущий объект"
        @click="go(index - 1)"
      >‹</button>
      <button
        type="button"
        class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center bg-black/35 hover:bg-black/60 text-white backdrop-blur-sm transition"
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
  interval: { type: Number, default: 7000 }
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

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  restart()
})
onUnmounted(() => clearInterval(timer))
</script>

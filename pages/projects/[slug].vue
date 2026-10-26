<template>
  <div v-if="project" class="bg-esp-gray min-h-screen pb-10">
    <section class="py-6 bg-white border-b border-esp-gray">
      <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Breadcrumb :items="[{ label: 'Проекты', to: '/projects' }, { label: project.name }]" />
      </div>
    </section>

    <!-- BLOCK 1: Hero. Кадр объекта во весь блок: видео, если есть съёмка,
         иначе обложка или первое фото. Текст лежит в потоке, а не абсолютом:
         на телефоне блок выше кадра, и подписи не наезжают друг на друга. -->
    <section class="relative w-full overflow-hidden flex items-end bg-esp-black" style="min-height: min(78vh, 46rem)">
      <video
        v-if="project.video"
        class="absolute inset-0 w-full h-full object-cover"
        :src="project.video"
        :poster="project.poster"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      ></video>
      <img
        v-else-if="heroImage"
        class="absolute inset-0 w-full h-full object-cover"
        :src="heroImage"
        :alt="project.name"
      />
      <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(26,26,26,0.94) 0%, rgba(26,26,26,0.78) 28%, rgba(26,26,26,0.3) 62%, rgba(26,26,26,0.22) 100%)"></div>

      <div class="relative w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-28 pb-10 md:pb-14 text-white">
        <span v-if="project.badge || project.region" class="inline-block px-3 py-1.5 bg-esp-black/40 border border-white/20 text-white/90 text-xs font-medium uppercase tracking-wide backdrop-blur-sm">
          {{ project.badge || project.region }}
        </span>
        <h1 class="font-rounded text-2xl sm:text-4xl md:text-5xl leading-tight max-w-4xl mt-4">{{ project.name }}</h1>
        <p v-if="project.longDesc || project.desc" class="mt-4 text-sm md:text-base text-white/85 leading-relaxed max-w-3xl">
          {{ sw(project.longDesc || project.desc) }}
        </p>

        <div class="flex flex-wrap items-center gap-2 pt-5">
          <span v-if="project.location" class="pj-hchip">{{ project.location }}</span>
          <span v-if="project.year" class="pj-hchip">Год запуска: {{ project.year }}</span>
          <span v-if="project.capacity" class="pj-hchip">Производительность: {{ project.capacity }}</span>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-7 sm:max-w-md">
          <NuxtLink to="/contacts#contact-form" class="px-6 py-3.5 bg-esp-green text-white font-medium text-center hover:bg-esp-green/90 transition">
            Обсудить похожий проект
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- BLOCK 2: Показатели объекта. Две плашки из админки: объём сточных вод
         и качество очистки. Пустое поле не выводим — без пустых плашек. -->
    <section v-if="indicators.length" class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-10 mb-10">
      <div class="grid grid-cols-1 gap-4" :class="indicators.length > 1 ? 'sm:grid-cols-2' : 'sm:max-w-md'">
        <div v-for="m in indicators" :key="m.label" class="bg-white p-6 md:p-8 border-l-4" :class="m.accent">
          <span class="block text-xs text-esp-black/55 font-medium uppercase tracking-wide">{{ m.label }}</span>
          <div class="text-2xl md:text-3xl font-rounded font-bold text-esp-black mt-2 leading-tight">{{ m.value }}</div>
        </div>
      </div>
    </section>

    <!-- BLOCK 3: Task / Solution / Result -->
    <section v-if="project.task || project.solution || project.resultText" class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16" :class="{ 'mt-10': !indicators.length }">
      <div class="bg-white px-5 py-12 md:p-14">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            Траектория модернизации
          </span>
          <h2 class="font-rounded text-2xl md:text-3xl text-esp-black">Путь трансформации сточных вод</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div v-for="st in steps" :key="st.num" class="bg-esp-gray p-6 space-y-3">
            <span class="text-xs font-semibold uppercase font-mono" :class="st.color">{{ st.num }} · {{ st.kicker }}</span>
            <h3 class="font-rounded font-semibold text-lg text-esp-black">{{ st.title }}</h3>
            <p class="text-sm text-esp-black/70 leading-relaxed">{{ sw(st.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK 4: Gallery -->
    <section v-if="project.gallery && project.gallery.length" class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16">
      <h2 class="font-rounded text-2xl mb-8 text-esp-black">Фото объекта и сборки модулей</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          v-for="(img, idx) in project.gallery"
          :key="idx"
          @click="openLightbox(idx)"
          class="bg-white aspect-[4/3] relative group overflow-hidden cursor-pointer"
        >
          <img :src="img" :alt="`${project.name} — фото ${idx + 1}`" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute inset-0 bg-esp-black/0 group-hover:bg-esp-black/30 transition-colors flex items-center justify-center">
            <svg class="w-8 h-8 opacity-0 group-hover:opacity-100 text-white transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5M11 8v6M8 11h6"/></svg>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK 5: Tech stack -->
    <section v-if="project.techStack && project.techStack.length" class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16">
      <div class="bg-white p-8">
        <h3 class="font-rounded text-xl text-esp-black mb-6 pb-2 border-b border-esp-gray">Использованный технологический стек</h3>
        <div class="flex flex-wrap gap-3 mb-8">
          <span v-for="t in project.techStack" :key="t" class="px-3.5 py-2 bg-esp-gray text-sm font-medium text-esp-blue">{{ t }}</span>
        </div>

        <h3 class="font-rounded text-xl text-esp-black mb-6 pb-2 border-b border-esp-gray">Применённое оборудование</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink
            v-for="eq in usedEquipment"
            :key="eq.slug"
            :to="`/equipment/${eq.slug}`"
            class="bg-esp-gray border border-esp-gray overflow-hidden hover:shadow-lg transition-all duration-300 block"
          >
            <div class="aspect-square bg-white flex items-center justify-center p-6 border-b border-esp-gray">
              <img :src="eq.image" :alt="eq.name" class="w-full h-full object-contain" />
            </div>
            <div class="p-4">
              <h3 class="font-rounded font-semibold text-esp-black text-sm mb-1">{{ eq.name }}</h3>
              <p class="text-esp-black/60 text-xs mb-2">{{ eq.capacity }}</p>
              <span class="text-esp-blue text-xs font-medium">Смотреть оборудование →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- BLOCK 6: Testimonial -->
    <section v-if="project.reviewName" class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16">
      <div class="bg-white p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
        <div class="shrink-0 w-24 h-24 rounded-full bg-esp-blue text-white flex items-center justify-center font-rounded font-bold text-xl">
          {{ project.reviewName.split(' ').map(w => w[0]).join('').slice(0, 2) }}
        </div>
        <div class="space-y-3">
          <blockquote class="font-rounded text-lg text-esp-black italic leading-relaxed">
            {{ project.reviewQuote }}
          </blockquote>
          <div class="text-sm text-esp-black/60">
            {{ project.reviewName }}
          </div>
        </div>
      </div>
    </section>

    <!-- Параметры и другие проекты -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <aside v-if="params.length" class="bg-white p-6 h-fit lg:col-span-1">
        <h3 class="font-rounded font-semibold text-esp-black mb-4">Параметры проекта</h3>
        <dl class="text-sm">
          <div v-for="(row, i) in params" :key="row.label" class="flex justify-between gap-4 py-2.5" :class="{ 'border-t border-esp-gray': i }">
            <dt class="text-esp-black/60 shrink-0">{{ row.label }}</dt>
            <dd class="font-medium text-esp-black text-right">{{ row.value }}</dd>
          </div>
        </dl>
      </aside>

      <div v-if="otherProjects.length" :class="params.length ? 'lg:col-span-2' : 'lg:col-span-3'">
        <h2 class="font-rounded text-2xl mb-6 text-esp-black">Другие проекты</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <NuxtLink
            v-for="p in otherProjects"
            :key="p.slug"
            :to="`/projects/${p.slug}`"
            class="group bg-white flex gap-4 p-3 hover:shadow-lg transition-all duration-300"
          >
            <div class="w-24 h-20 sm:w-28 shrink-0 bg-esp-gray overflow-hidden">
              <img v-if="p.poster || (p.gallery && p.gallery[0])" :src="p.poster || p.gallery[0]" :alt="p.name" class="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div class="min-w-0 py-1">
              <h3 class="font-rounded font-semibold text-esp-black text-sm leading-snug mb-1.5 group-hover:text-esp-blue transition-colors">{{ p.name }}</h3>
              <p class="text-esp-black/55 text-xs">{{ [p.location, p.capacity].filter(Boolean).join(' · ') }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA: без сотрудника и должности, телефон общий — приёмная. -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div class="bg-esp-blue text-white text-center px-5 py-12 md:p-14">
        <h2 class="font-rounded text-2xl md:text-4xl mb-5">Обсудим похожий объект</h2>
        <p class="text-white/85 max-w-2xl mx-auto mb-8">
          Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <NuxtLink to="/contacts#contact-form" class="bg-white text-esp-blue px-8 py-4 font-medium hover:bg-esp-gray transition">
            Оставить заявку
          </NuxtLink>
          <a :href="`tel:${PHONE_TEL}`" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition tabular-nums">
            {{ PHONE }}
          </a>
        </div>
        <p class="text-white/60 text-xs mt-4">Телефон приёмной ESP</p>
      </div>
    </section>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="fixed inset-0 z-50 bg-esp-black/95 flex items-center justify-center p-4" @click.self="lightboxOpen = false">
      <div class="relative max-w-4xl w-full">
        <div class="absolute -top-10 right-0 flex gap-4 text-white text-sm">
          <span>{{ activePhotoIdx + 1 }} / {{ project.gallery.length }}</span>
          <button @click="lightboxOpen = false" class="hover:text-white/70">Закрыть ✕</button>
        </div>
        <button @click="prevPhoto" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 z-10">←</button>
        <img :src="project.gallery[activePhotoIdx]" class="w-full max-h-[80vh] object-contain" />
        <button @click="nextPhoto" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 z-10">→</button>
      </div>
    </div>

  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Проект не найден.</p>
    <NuxtLink to="/projects" class="text-esp-blue hover:underline">Вернуться к проектам</NuxtLink>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useProjects } from '~/composables/useProjects'
import { equipmentList } from '~/composables/useEquipment'

const route = useRoute()
const { projects, getBySlug } = useProjects()
const project = computed(() => getBySlug(route.params.slug))

// Объект, добавленный в админке, есть только в ответе сервера, а не в
// сборке. Прежде чем отдавать 404, дожидаемся свежего списка.
if (!project.value) {
  await refreshNuxtData('site-content-projects')
}

// Для несуществующих адресов — честный 404, а не пустая страница с кодом 200.
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Проект не найден', fatal: true })
}

const PHONE = '+375 (17) 238-11-41'
const PHONE_TEL = '+375172381141'

// «Стоки» в текстах из данных выводим как «сточные воды».
const sw = (s) => String(s || '')
  .replace(/стоков/g, 'сточных вод')
  .replace(/стоками/g, 'сточными водами')
  .replace(/стоках/g, 'сточных водах')
  .replace(/стоки/g, 'сточные воды')

const heroImage = computed(() => project.value?.poster || project.value?.gallery?.[0] || '')

const indicators = computed(() => {
  const p = project.value || {}
  return [
    { label: 'Объём сточных вод', value: String(p.volume || '').trim(), accent: 'border-esp-blue' },
    { label: 'Качество очистки', value: String(p.quality || '').trim(), accent: 'border-esp-green' }
  ].filter(m => m.value)
})

const steps = computed(() => [
  { num: '01', kicker: 'Задача', title: 'Исходная задача', text: project.value?.task, color: 'text-esp-black/60' },
  { num: '02', kicker: 'Решение', title: 'Внедрённое решение', text: project.value?.solution, color: 'text-esp-blue' },
  { num: '03', kicker: 'Результат', title: 'Результат', text: project.value?.resultText, color: 'text-esp-green' }
].filter(st => st.text))

const params = computed(() => {
  const p = project.value || {}
  return [
    { label: 'Категория', value: p.category },
    { label: 'Год', value: p.year },
    { label: 'Производительность', value: p.capacity },
    { label: 'Регион', value: p.region }
  ].filter(r => r.value)
})

const usedEquipment = computed(() => {
  if (!project.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => project.value.equipmentSlugs.includes(e.slug))
})

// «Другие проекты» — из списка в админке, кроме текущего. Сначала объекты
// той же категории.
const otherProjects = computed(() => {
  const rest = projects.value.filter(p => p.slug !== route.params.slug && p.isKey !== false)
  const same = rest.filter(p => p.category === project.value?.category)
  const other = rest.filter(p => p.category !== project.value?.category)
  return [...same, ...other].slice(0, 4)
})

const lightboxOpen = ref(false)
const activePhotoIdx = ref(0)

const openLightbox = (idx) => {
  activePhotoIdx.value = idx
  lightboxOpen.value = true
}
const prevPhoto = () => {
  activePhotoIdx.value = activePhotoIdx.value === 0 ? project.value.gallery.length - 1 : activePhotoIdx.value - 1
}
const nextPhoto = () => {
  activePhotoIdx.value = activePhotoIdx.value === project.value.gallery.length - 1 ? 0 : activePhotoIdx.value + 1
}

// og-картинки лежат в этом проекте: origin берём из runtimeConfig,
// чтобы смена домена правилась в одном месте.
const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead(() => ({
  title: project.value ? `${project.value.name} | Проекты ESP` : 'Проект не найден | ESP',
  meta: [
    { name: 'description', content: project.value ? project.value.desc : '' },
    { property: 'og:title', content: project.value?.name || '' },
    { property: 'og:description', content: project.value?.desc || '' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: project.value ? `https://ecoservisproekt.by/projects/${project.value.slug}` : '' }]
}))

useSchemaOrg([
  defineBreadcrumb(() => ([
    { name: 'Проекты', item: '/projects' },
    { name: project.value?.name }
  ]))
])
</script>

<style scoped>
.pj-hchip {
  padding: 0.25rem 0.65rem;
  background: rgba(26, 26, 26, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
}
</style>

<template>
  <div v-if="project" class="bg-esp-gray min-h-screen pb-10">
    <section class="py-6 bg-white border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Проекты', to: '/projects' }, { label: project.name }]" />
      </div>
    </section>

    <!-- BLOCK 1: Hero -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-10 mb-16">
      <div class="bg-gradient-to-tr from-esp-black to-slate-900 text-white p-8 md:p-14 relative overflow-hidden" style="min-height: 420px;">
        <div class="relative z-10 max-w-4xl flex flex-col justify-between h-full space-y-10">
          <div>
            <span class="inline-block px-3 py-1.5 bg-white/10 border border-white/20 text-esp-lidar text-xs font-medium uppercase tracking-wide mb-3">
              {{ project.location }}
            </span>
            <h1 class="font-rounded text-3xl sm:text-4xl md:text-5xl leading-tight">{{ project.name }}</h1>

            <div class="flex flex-wrap gap-3 pt-4">
              <span class="px-2.5 py-1 bg-white/10 border border-white/20 text-xs text-white/80 font-inter">Регион: {{ project.location }}</span>
              <span class="px-2.5 py-1 bg-white/10 border border-white/20 text-xs text-white/80 font-inter">Год запуска: {{ project.year }}</span>
              <span class="px-2.5 py-1 bg-white/10 border border-white/20 text-xs text-esp-green font-inter">Мощность: {{ project.capacity }}</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 max-w-md">
            <NuxtLink to="/contacts#contact-form" class="px-6 py-3.5 bg-esp-green text-white font-medium text-center hover:bg-esp-green/90 transition">
              Обсудить похожий проект
            </NuxtLink>
            <button @click="rfqModalOpen = true" class="px-6 py-3.5 bg-white text-esp-blue font-medium hover:bg-esp-gray transition">
              Запросить PDF-кейс
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK 2: Task / Solution / Result -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16 bg-white py-16">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Траектория модернизации
        </span>
        <h2 class="font-rounded text-2xl md:text-3xl text-esp-black">Путь трансформации стоков</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-esp-gray p-6 space-y-3">
          <span class="text-red-500 text-xs font-semibold uppercase font-mono">01 · Задача</span>
          <h3 class="font-rounded font-semibold text-lg text-esp-black">Установленная задача</h3>
          <p class="text-sm text-esp-black/70 leading-relaxed">{{ project.task }}</p>
        </div>
        <div class="bg-esp-gray p-6 space-y-3">
          <span class="text-esp-blue text-xs font-semibold uppercase font-mono">02 · Решение</span>
          <h3 class="font-rounded font-semibold text-lg text-esp-black">Внедрённое решение</h3>
          <p class="text-sm text-esp-black/70 leading-relaxed">{{ project.solution }}</p>
        </div>
        <div class="bg-esp-gray p-6 space-y-3">
          <span class="text-esp-green text-xs font-semibold uppercase font-mono">03 · Результат</span>
          <h3 class="font-rounded font-semibold text-lg text-esp-black">Экологический результат</h3>
          <p class="text-sm text-esp-black/70 leading-relaxed">{{ project.resultText }}</p>
        </div>
      </div>
    </section>

    <!-- BLOCK 3: Metrics & Before/After -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16">
      <div class="bg-white p-8 md:p-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-6 grid grid-cols-2 gap-6">
            <div v-for="(m, idx) in project.metrics" :key="idx" class="bg-esp-gray/60 p-5 text-center">
              <span class="block text-xs text-esp-green font-mono font-semibold uppercase">Показатель {{ idx + 1 }}</span>
              <div class="text-2xl sm:text-3xl font-rounded font-bold text-esp-black mt-2 mb-1">
                {{ m.value }} <span class="text-xs text-esp-black/50 font-inter">{{ m.suffix }}</span>
              </div>
              <span class="block text-xs text-esp-black/50 font-medium uppercase">{{ m.label }}</span>
            </div>
          </div>

          <div class="lg:col-span-6 space-y-5">
            <h3 class="font-rounded text-xl text-esp-black">Динамика очистки: до и после</h3>
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold uppercase">
                <span>Показатель до ESP</span>
                <span class="text-red-500">{{ project.beforeValue }}</span>
              </div>
              <div class="w-full h-4 bg-esp-gray overflow-hidden">
                <div class="h-full bg-red-500" style="width: 90%"></div>
              </div>
            </div>
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold uppercase">
                <span>Показатель после ESP</span>
                <span class="text-esp-green">{{ project.afterValue }}</span>
              </div>
              <div class="w-full h-4 bg-esp-gray overflow-hidden">
                <div class="h-full bg-esp-green" style="width: 4%"></div>
              </div>
            </div>
            <p class="text-xs text-esp-black/40">* замеры зафиксированы лабораторией контроля качества ESP на этапе пусконаладки.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK 4: Gallery -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16">
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
            <span class="opacity-0 group-hover:opacity-100 text-white text-2xl transition-opacity">🔍</span>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK 5: Tech stack -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16">
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
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16">
      <div class="bg-white p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
        <div class="shrink-0 w-24 h-24 rounded-full bg-esp-blue text-white flex items-center justify-center font-rounded font-bold text-xl">
          {{ project.reviewName.split(' ').map(w => w[0]).join('').slice(0, 2) }}
        </div>
        <div class="space-y-3">
          <blockquote class="font-rounded text-lg text-esp-black italic leading-relaxed">
            {{ project.reviewQuote }}
          </blockquote>
          <div class="text-sm text-esp-black/60">
            {{ project.reviewName }} · <span class="text-esp-green font-medium">{{ project.reviewRole }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Project meta / other projects -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <aside class="bg-white p-6 h-fit lg:col-span-1">
        <h3 class="font-rounded font-semibold text-esp-black mb-4">Параметры проекта</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between border-b border-esp-gray pb-2">
            <span class="text-esp-black/60">Результат</span>
            <span class="font-medium text-esp-green">{{ project.result }}</span>
          </div>
          <div class="flex justify-between border-b border-esp-gray pb-2">
            <span class="text-esp-black/60">Категория</span>
            <span class="font-medium text-esp-black">{{ project.category }}</span>
          </div>
          <div class="flex justify-between border-b border-esp-gray pb-2">
            <span class="text-esp-black/60">Год</span>
            <span class="font-medium text-esp-black">{{ project.year }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-esp-black/60">Регион</span>
            <span class="font-medium text-esp-black">{{ project.region }}</span>
          </div>
        </div>
      </aside>

      <div class="lg:col-span-2">
        <h2 class="font-rounded text-2xl mb-6 text-esp-black">Другие проекты</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <NuxtLink
            v-for="p in otherProjects"
            :key="p.slug"
            :to="`/projects/${p.slug}`"
            class="bg-white p-6 hover:shadow-lg transition-all duration-300"
          >
            <h3 class="font-rounded font-semibold text-esp-black text-sm mb-2">{{ p.name }}</h3>
            <p class="text-esp-black/60 text-xs">{{ p.location }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div class="text-white text-center p-8 md:p-14" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
        <h2 class="font-rounded text-2xl md:text-4xl mb-6">Нужен аналогичный результат?</h2>
        <p class="text-white/90 max-w-2xl mx-auto mb-8">
          Оставьте параметры вашего объекта. Инженеры ESP подготовят проектную 3D-модель и полный расчёт окупаемости в течение 48 часов.
        </p>
        <button @click="rfqModalOpen = true" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition">
          Запросить аналогичное решение
        </button>
      </div>
    </section>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" @click.self="lightboxOpen = false">
      <div class="relative max-w-4xl w-full">
        <div class="absolute -top-10 right-0 flex gap-4 text-white text-sm">
          <span>{{ activePhotoIdx + 1 }} / {{ project.gallery.length }}</span>
          <button @click="lightboxOpen = false" class="hover:text-red-400">Закрыть ✕</button>
        </div>
        <button @click="prevPhoto" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 z-10">←</button>
        <img :src="project.gallery[activePhotoIdx]" class="w-full max-h-[80vh] object-contain" />
        <button @click="nextPhoto" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 z-10">→</button>
      </div>
    </div>

    <!-- RFQ Modal -->
    <div v-if="rfqModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-esp-black/60" @click="rfqModalOpen = false"></div>
      <div class="relative bg-white max-w-md w-full p-8 shadow-2xl">
        <button @click="rfqModalOpen = false" class="absolute top-4 right-4 text-esp-black/50 hover:text-esp-black">✕</button>
        <div v-if="!rfqSent">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Запросить аналогичное решение</h3>
          <p class="text-esp-black/60 text-sm mb-6">Оставьте контакты — инженер ESP подготовит расчёт по вашему объекту.</p>
          <form @submit.prevent="rfqSent = true" class="space-y-4">
            <input required placeholder="ФИО" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <input required placeholder="Компания" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <input required type="email" placeholder="E-mail" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <button type="submit" class="w-full btn-primary justify-center">Отправить запрос</button>
          </form>
        </div>
        <div v-else class="text-center py-6">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Запрос отправлен</h3>
          <p class="text-esp-black/60 text-sm">Инженер ESP свяжется с вами в течение 48 часов с расчётом по объекту.</p>
        </div>
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
import { projectsList } from '~/composables/useProjects'
import { equipmentList } from '~/composables/useEquipment'

const route = useRoute()
const project = computed(() => projectsList.find(p => p.slug === route.params.slug))

const usedEquipment = computed(() => {
  if (!project.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => project.value.equipmentSlugs.includes(e.slug))
})

const otherProjects = computed(() =>
  projectsList.filter(p => p.slug !== route.params.slug).slice(0, 4)
)

const lightboxOpen = ref(false)
const activePhotoIdx = ref(0)
const rfqModalOpen = ref(false)
const rfqSent = ref(false)

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

useHead(() => ({
  title: project.value ? `${project.value.name} | Проекты ESP` : 'Проект не найден | ESP',
  meta: [
    { name: 'description', content: project.value ? project.value.desc : '' },
    { property: 'og:title', content: project.value?.name || '' },
    { property: 'og:description', content: project.value?.desc || '' },
    { property: 'og:image', content: project.value?.gallery?.[0] ? `https://ecoservisproekt.com${project.value.gallery[0]}` : '' }
  ],
  link: [{ rel: 'canonical', href: project.value ? `https://ecoservisproekt.com/projects/${project.value.slug}` : '' }]
}))

useSchemaOrg([
  defineBreadcrumb(() => ([
    { name: 'Проекты', item: '/projects' },
    { name: project.value?.name }
  ]))
])
</script>

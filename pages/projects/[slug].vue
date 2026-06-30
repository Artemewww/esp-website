<template>
  <div v-if="project">
    <section class="py-6 bg-white border-b border-esp-gray">
      <div class="container-custom">
        <div class="flex items-center gap-2 text-sm text-esp-black/50 font-inter">
          <NuxtLink to="/projects" class="hover:text-esp-blue transition">Проекты</NuxtLink>
          <span>/</span>
          <span class="text-esp-black">{{ project.name }}</span>
        </div>
      </div>
    </section>

    <section class="relative h-[40vh] min-h-[320px] flex items-end bg-gradient-to-br from-esp-blue via-esp-black to-esp-green">
      <div class="container-custom pb-10 text-white relative z-10">
        <span class="inline-block px-3 py-1 bg-esp-green text-white text-xs font-medium mb-4">{{ project.category }}</span>
        <h1 class="font-rounded text-3xl md:text-5xl mb-3">{{ project.name }}</h1>
        <p class="text-white/80">{{ project.location }} · {{ project.year }}</p>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <h2 class="font-rounded text-2xl mb-4 text-esp-black">О проекте</h2>
          <p class="text-esp-black/70 text-lg leading-relaxed mb-8">{{ project.longDesc || project.desc }}</p>

          <div class="flex flex-wrap gap-2 mb-8">
            <span v-for="tag in project.tags" :key="tag" class="px-3 py-1 bg-esp-gray text-esp-black/70 text-sm font-inter">{{ tag }}</span>
          </div>

          <h2 class="font-rounded text-2xl mb-4 text-esp-black">Применённое оборудование</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink
              v-for="eq in usedEquipment"
              :key="eq.slug"
              :to="`/equipment/${eq.slug}`"
              class="flex gap-4 bg-esp-gray p-4 hover:shadow-lg transition-all duration-300"
            >
              <img :src="eq.image" :alt="eq.name" class="w-20 h-20 object-contain bg-white flex-shrink-0" />
              <div>
                <h3 class="font-rounded font-semibold text-esp-black text-sm mb-1">{{ eq.name }}</h3>
                <p class="text-esp-black/60 text-xs mb-2">{{ eq.capacity }}</p>
                <span class="text-esp-blue text-xs font-medium">Смотреть оборудование →</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <aside class="bg-esp-gray p-6 h-fit">
          <h3 class="font-rounded font-semibold text-esp-black mb-4">Параметры проекта</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-white pb-2">
              <span class="text-esp-black/60">Результат</span>
              <span class="font-medium text-esp-green">{{ project.result }}</span>
            </div>
            <div class="flex justify-between border-b border-white pb-2">
              <span class="text-esp-black/60">Категория</span>
              <span class="font-medium text-esp-black">{{ project.category }}</span>
            </div>
            <div class="flex justify-between border-b border-white pb-2">
              <span class="text-esp-black/60">Год</span>
              <span class="font-medium text-esp-black">{{ project.year }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-esp-black/60">Регион</span>
              <span class="font-medium text-esp-black">{{ project.region }}</span>
            </div>
          </div>
          <NuxtLink to="/contacts#contact-form" class="btn-primary w-full text-center block mt-6">
            Обсудить похожий проект
          </NuxtLink>
        </aside>
      </div>
    </section>

    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl mb-8 text-esp-black">Другие проекты</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Проект не найден.</p>
    <NuxtLink to="/projects" class="text-esp-blue hover:underline">Вернуться к проектам</NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { projectsList } from '~/composables/useProjects'
import { equipmentList } from '~/composables/useEquipment'

const route = useRoute()
const project = computed(() => projectsList.find(p => p.slug === route.params.slug))

const usedEquipment = computed(() => {
  if (!project.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => project.value.equipmentSlugs.includes(e.slug))
})

const otherProjects = computed(() =>
  projectsList.filter(p => p.slug !== route.params.slug).slice(0, 3)
)

useHead(() => ({
  title: project.value ? `${project.value.name} | Проекты ESP` : 'Проект не найден | ESP',
  meta: [
    { name: 'description', content: project.value ? project.value.desc : '' }
  ]
}))
</script>

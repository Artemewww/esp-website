<template>
  <div v-if="expert" class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Команда', to: '/team' }, { label: expert.name }]" />
      </div>
    </section>

    <!-- Apple-style bio hero: full-width portrait + name/title -->
    <section class="pt-14 pb-20">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <span class="block text-esp-blue text-sm font-medium mb-4 font-inter">{{ expert.department }}</span>
          <h1 class="font-rounded text-4xl md:text-6xl text-esp-black leading-tight mb-3">{{ expert.name }}</h1>
          <p class="text-xl text-esp-black/60">{{ expert.role }}</p>
        </div>

        <div class="max-w-3xl mx-auto aspect-[16/10] bg-esp-gray overflow-hidden mb-14">
          <img :src="expert.photo" :alt="expert.name" class="w-full h-full object-cover" />
        </div>

        <div class="max-w-2xl mx-auto text-center mb-16">
          <p class="text-2xl text-esp-black/80 leading-relaxed font-rounded">{{ expert.philosophy }}</p>
        </div>

        <div class="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
          <a :href="`mailto:${expert.email}`" class="btn-primary text-center">Написать письмо</a>
          <NuxtLink to="/contacts#contact-form" class="border-2 border-esp-blue text-esp-blue px-8 py-4 font-medium hover:bg-esp-blue hover:text-white transition text-center">
            Задать вопрос эксперту
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Professional path — clean single-column, Apple-like prose flow -->
    <section class="py-20 border-t border-esp-gray">
      <div class="container-custom max-w-2xl">
        <h2 class="font-rounded text-3xl text-esp-black mb-12">Профессиональный путь</h2>
        <div class="space-y-10">
          <div v-for="b in expert.bio" :key="b.year" class="flex gap-6">
            <span class="font-mono text-esp-blue text-sm flex-shrink-0 w-14 pt-1">{{ b.year }}</span>
            <div class="border-l border-esp-gray pl-6">
              <h3 class="font-rounded text-lg text-esp-black mb-1">{{ b.title }}</h3>
              <p class="text-esp-black/60 leading-relaxed">{{ b.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="expert.skills?.length" class="py-20 bg-esp-gray/40">
      <div class="container-custom max-w-2xl">
        <h2 class="font-rounded text-3xl text-esp-black mb-12">Компетенции</h2>
        <div class="space-y-6">
          <div v-for="skill in expert.skills" :key="skill.title">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-esp-black font-medium">{{ skill.title }}</span>
              <span class="text-esp-black/40">{{ skill.level }}%</span>
            </div>
            <div class="h-1 bg-white">
              <div class="h-full bg-esp-blue" :style="{ width: skill.level + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related projects -->
    <section v-if="relatedProjects.length" class="py-20 border-t border-esp-gray">
      <div class="container-custom max-w-2xl">
        <h2 class="font-rounded text-3xl text-esp-black mb-10">Проекты с участием эксперта</h2>
        <div class="space-y-4">
          <NuxtLink
            v-for="p in relatedProjects"
            :key="p.slug"
            :to="`/projects/${p.slug}`"
            class="flex items-center justify-between py-4 border-b border-esp-gray group"
          >
            <div>
              <h3 class="font-rounded text-esp-black group-hover:text-esp-blue transition-colors">{{ p.name }}</h3>
              <p class="text-esp-black/50 text-sm">{{ p.location }}</p>
            </div>
            <span class="text-esp-blue text-sm">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Other leaders — same Apple grid as /team -->
    <section class="py-20 md:py-28 bg-white border-t border-esp-gray">
      <div class="container-custom">
        <h2 class="font-rounded text-3xl md:text-4xl text-esp-black mb-14">Другие руководители</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          <NuxtLink
            v-for="ex in otherExperts"
            :key="ex.slug"
            :to="`/team/${ex.slug}`"
            class="group block"
          >
            <div class="aspect-[4/5] bg-esp-gray overflow-hidden mb-5">
              <img :src="ex.photo" :alt="ex.name" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03]" />
            </div>
            <h3 class="font-rounded text-xl text-esp-black leading-snug group-hover:text-esp-blue transition-colors">{{ ex.name }}</h3>
            <p class="text-esp-black/50 text-sm mt-1">{{ ex.role }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Эксперт не найден.</p>
    <NuxtLink to="/team" class="text-esp-blue hover:underline">Вернуться к команде</NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { expertsList } from '~/composables/useExperts'
import { projectsList } from '~/composables/useProjects'

const route = useRoute()
const expert = computed(() => expertsList.find(e => e.slug === route.params.slug))

const relatedProjects = computed(() => {
  if (!expert.value?.relatedProjects?.length) return []
  return projectsList.filter(p => expert.value.relatedProjects.includes(p.slug))
})

const otherExperts = computed(() => expertsList.filter(e => e.slug !== route.params.slug))

useHead(() => ({
  title: expert.value ? `${expert.value.name} — ${expert.value.role} | ESP` : 'Эксперт не найден | ESP',
  meta: [
    { name: 'description', content: expert.value ? `Профиль эксперта ESP: ${expert.value.name}, ${expert.value.role}. Биография, компетенции, реализованные проекты.` : '' }
  ]
}))
</script>

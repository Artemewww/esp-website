<template>
  <div v-if="expert">
    <section class="py-6 bg-white border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Команда', to: '/team' }, { label: expert.name }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-1">
          <div class="w-24 h-24 rounded-full bg-esp-blue text-white flex items-center justify-center font-rounded font-bold text-3xl mb-6">
            {{ expert.name.split(' ').map(w => w[0]).join('') }}
          </div>
          <h1 class="font-rounded text-2xl md:text-3xl mb-2 text-esp-black">{{ expert.name }}</h1>
          <p class="text-esp-blue font-medium mb-1">{{ expert.role }}</p>
          <p class="text-esp-black/50 text-sm mb-6">{{ expert.department }}</p>
          <p class="text-esp-black/70 italic mb-8 leading-relaxed">{{ expert.philosophy }}</p>

          <a :href="`mailto:${expert.email}`" class="btn-primary inline-block mb-3 w-full text-center">Написать письмо</a>
          <NuxtLink to="/contacts#contact-form" class="border-2 border-esp-blue text-esp-blue px-8 py-4 font-medium hover:bg-esp-blue hover:text-white transition inline-block w-full text-center">
            Задать вопрос эксперту
          </NuxtLink>

          <div v-if="expert.skills?.length" class="mt-10">
            <h3 class="font-rounded font-semibold text-esp-black mb-4">Компетенции</h3>
            <div class="space-y-4">
              <div v-for="skill in expert.skills" :key="skill.title">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-esp-black/70">{{ skill.title }}</span>
                  <span class="text-esp-black/40">{{ skill.level }}%</span>
                </div>
                <div class="h-1.5 bg-esp-gray">
                  <div class="h-full bg-esp-blue" :style="{ width: skill.level + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <h2 class="font-rounded text-2xl mb-8 text-esp-black">Профессиональный путь</h2>
          <Timeline :items="bioItems" />

          <div v-if="relatedProjects.length" class="mt-16">
            <h2 class="font-rounded text-2xl mb-6 text-esp-black">Проекты с участием эксперта</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuxtLink
                v-for="p in relatedProjects"
                :key="p.slug"
                :to="`/projects/${p.slug}`"
                class="bg-esp-gray p-5 hover:shadow-lg transition-all duration-300 block"
              >
                <h3 class="font-rounded font-semibold text-esp-black text-sm mb-1">{{ p.name }}</h3>
                <p class="text-esp-black/60 text-xs">{{ p.location }}</p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl mb-8 text-esp-black">Другие эксперты</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NuxtLink
            v-for="ex in otherExperts"
            :key="ex.slug"
            :to="`/team/${ex.slug}`"
            class="bg-white p-6 hover:shadow-lg transition-all duration-300"
          >
            <h3 class="font-rounded font-semibold text-esp-black">{{ ex.name }}</h3>
            <p class="text-esp-blue text-sm">{{ ex.role }}</p>
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
const bioItems = computed(() => (expert.value?.bio || []).map(b => ({ title: String(b.year), content: `${b.title}. ${b.desc}` })))

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

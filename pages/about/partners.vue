<template>
  <div class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Партнёры' }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Экосистема партнёрства
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">Наши партнёры</h1>
        <p class="text-xl text-esp-black/70 max-w-3xl mb-6">
          За 17 лет работы ESP выстроила партнёрскую сеть из проектных институтов, промышленных предприятий, госучреждений и зарубежных компаний.
        </p>
        <div class="relative max-w-md mb-10">
          <input
            v-model="search"
            type="search"
            placeholder="Найти партнёра по названию..."
            class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <component
            :is="p.site ? 'a' : 'div'"
            v-for="(p, i) in filteredPartners"
            :key="i"
            :href="p.site ? `https://${p.site}` : undefined"
            :target="p.site ? '_blank' : undefined"
            rel="noopener"
            class="bg-esp-gray p-5 flex flex-col gap-1 hover:bg-esp-blue/10 transition-colors"
          >
            <span class="text-sm font-medium text-esp-black leading-snug">{{ p.name }}</span>
            <span v-if="p.site" class="text-esp-blue text-xs">{{ p.site }}</span>
          </component>
        </div>
        <p v-if="!filteredPartners.length" class="text-esp-black/50 text-center py-10">Партнёры не найдены</p>
      </div>
    </section>

    <section class="section-padding bg-esp-gray">
      <div class="container-custom max-w-3xl text-center">
        <h2 class="font-rounded text-2xl md:text-3xl mb-4 text-esp-black">Хотите стать партнёром ESP?</h2>
        <p class="text-esp-black/70 mb-8">Проектным организациям и региональным дилерам — выгодные условия сотрудничества.</p>
        <NuxtLink to="/about/cooperation" class="btn-primary inline-block">Предложения о сотрудничестве →</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { partnersList } from '~/composables/usePartners'

const search = ref('')
const filteredPartners = computed(() => {
  if (!search.value.trim()) return partnersList
  const q = search.value.toLowerCase()
  return partnersList.filter(p => p.name.toLowerCase().includes(q))
})

useHead({
  title: 'Партнёры | ESP',
  meta: [
    { name: 'description', content: 'Партнёрская сеть ЭкоСервисПроект: проектные институты, промышленные предприятия, госучреждения Беларуси и зарубежные компании.' }
  ]
})
</script>

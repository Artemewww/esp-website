<template>
  <div v-if="tech">
    <section class="py-6 bg-white border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Технологии', to: '/technologies' }, { label: tech.shortTitle }]" />
      </div>
    </section>

    <!-- Hero -->
    <section class="section-padding bg-esp-black text-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-lidar/20 text-esp-lidar text-sm font-medium mb-4 font-inter">
          Технология очистки
        </span>
        <h1 class="font-rounded text-3xl md:text-5xl mb-6">{{ tech.title }}</h1>
        <p class="text-white/80 text-lg max-w-3xl mb-8">{{ tech.desc }}</p>
        <div class="flex flex-wrap gap-4">
          <span v-for="b in tech.badges" :key="b.label" class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-sm">
            <Icon :name="b.icon" cls="w-4 h-4 text-esp-lidar" />
            <span class="text-white/60">{{ b.label }}:</span>
            <span class="font-semibold">{{ b.value }}</span>
          </span>
        </div>
        <div class="flex flex-wrap gap-4 mt-8">
          <NuxtLink to="/contacts#contact-form" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition">
            Запросить расчёт
          </NuxtLink>
          <button @click="downloadModal = true" class="px-8 py-4 bg-esp-blue text-white font-medium hover:bg-esp-blue/90 transition">
            Скачать тех. паспорт
          </button>
        </div>
      </div>
    </section>

    <!-- Steps -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            Как это работает
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">5 шагов очистки высокой степени надёжности</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div v-for="(step, i) in tech.steps" :key="i" class="bg-esp-gray p-5">
            <div class="w-9 h-9 rounded-full bg-esp-blue text-white flex items-center justify-center font-rounded font-bold text-sm mb-4">{{ i + 1 }}</div>
            <h3 class="font-rounded font-semibold text-esp-black text-sm mb-2">{{ step.title }}</h3>
            <p class="text-esp-black/60 text-xs leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Specs -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-2xl md:text-3xl mb-8 text-esp-black">Технические характеристики</h2>
        <div class="bg-white">
          <div v-for="(spec, i) in tech.specs" :key="i" class="flex justify-between items-center px-6 py-4 border-b border-esp-gray last:border-b-0">
            <span class="text-esp-black/60">{{ spec.label }}</span>
            <span class="font-medium text-esp-black text-right">{{ spec.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Equipment used -->
    <section v-if="relatedEquipment.length" class="section-padding bg-white">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl md:text-3xl mb-8 text-esp-black">Оборудование для этой технологии</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="eq in relatedEquipment"
            :key="eq.slug"
            :to="`/equipment/${eq.slug}`"
            class="bg-esp-gray border border-esp-gray overflow-hidden hover:shadow-lg transition-all duration-300 block"
          >
            <div class="aspect-square bg-white flex items-center justify-center p-6">
              <img :src="eq.image" :alt="eq.name" class="w-full h-full object-contain" />
            </div>
            <div class="p-4">
              <h3 class="font-rounded font-semibold text-esp-black text-sm">{{ eq.name }}</h3>
              <span class="text-esp-blue text-xs font-medium">Смотреть оборудование →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Related cases -->
    <section v-if="relatedProjects.length" class="section-padding bg-esp-gray">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl md:text-3xl mb-8 text-esp-black">Реализованные кейсы</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NuxtLink
            v-for="p in relatedProjects"
            :key="p.slug"
            :to="`/projects/${p.slug}`"
            class="bg-white p-6 hover:shadow-lg transition-all duration-300 block"
          >
            <h3 class="font-rounded font-semibold text-esp-black mb-1">{{ p.name }}</h3>
            <p class="text-esp-black/60 text-sm mb-2">{{ p.location }}</p>
            <span class="text-esp-green font-medium text-sm">{{ p.result }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Other technologies -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl md:text-3xl mb-8 text-esp-black">Другие технологии</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="t in otherTechnologies"
            :key="t.slug"
            :to="`/technologies/${t.slug}`"
            class="bg-esp-gray p-5 hover:shadow-lg transition-all duration-300"
          >
            <h3 class="font-rounded font-semibold text-esp-black text-sm">{{ t.shortTitle }}</h3>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-6">Запросить технологический аудит</h2>
        <p class="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
          Оставьте параметры вашего объекта. Инженерный совет ESP подготовит 3D-схему сопряжений и предельную смету в течение 48 часов.
        </p>
        <NuxtLink to="/contacts#contact-form" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition inline-block">
          Запустить технический запрос
        </NuxtLink>
      </div>
    </section>

    <!-- Download modal -->
    <div v-if="downloadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-esp-black/60" @click="downloadModal = false"></div>
      <div class="relative bg-white max-w-md w-full p-8 shadow-2xl">
        <button @click="downloadModal = false" class="absolute top-4 right-4 text-esp-black/50 hover:text-esp-black">✕</button>
        <div v-if="!sent">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Скачать технический паспорт</h3>
          <p class="text-esp-black/60 text-sm mb-6">Оставьте e-mail — пришлём PDF с полными характеристиками технологии «{{ tech.shortTitle }}».</p>
          <form @submit.prevent="sent = true" class="space-y-4">
            <input required type="email" placeholder="E-mail" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <button type="submit" class="w-full btn-primary">Получить PDF</button>
          </form>
        </div>
        <div v-else class="text-center py-6">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Отправлено</h3>
          <p class="text-esp-black/60 text-sm">Технический паспорт придёт на почту в течение нескольких минут.</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Технология не найдена.</p>
    <NuxtLink to="/technologies" class="text-esp-blue hover:underline">Вернуться к технологиям</NuxtLink>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { technologiesList } from '~/composables/useTechnologies'
import { equipmentList } from '~/composables/useEquipment'
import { projectsList } from '~/composables/useProjects'

const route = useRoute()
const tech = computed(() => technologiesList.find(t => t.slug === route.params.slug))

const relatedEquipment = computed(() => {
  if (!tech.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => tech.value.equipmentSlugs.includes(e.slug))
})

const relatedProjects = computed(() => {
  if (!tech.value?.relatedProjects?.length) return []
  return projectsList.filter(p => tech.value.relatedProjects.includes(p.slug))
})

const otherTechnologies = computed(() => technologiesList.filter(t => t.slug !== route.params.slug))

const downloadModal = ref(false)
const sent = ref(false)

useHead(() => ({
  title: tech.value ? `${tech.value.title} | Технологии ESP` : 'Технология не найдена | ESP',
  meta: [
    { name: 'description', content: tech.value ? `${tech.value.desc} Технические характеристики, применяемое оборудование, реализованные кейсы ESP.` : '' }
  ]
}))
</script>

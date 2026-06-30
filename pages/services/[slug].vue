<template>
  <div v-if="service">
    <section class="py-6 bg-white border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Услуги', to: '/services' }, { label: service.title }]" />
      </div>
    </section>

    <section class="relative section-padding text-white overflow-hidden" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
      <DottedSurface />
      <div class="container-custom relative z-10">
        <div class="w-16 h-16 bg-white/10 flex items-center justify-center mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="serviceIcons[service.icon]"></svg>
        </div>
        <h1 class="font-rounded text-3xl md:text-5xl mb-4">{{ service.title }}</h1>
        <p class="text-lg text-white/85 max-w-2xl">{{ service.longDesc || service.desc }}</p>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <h2 class="font-rounded text-2xl mb-6 text-esp-black">Этапы выполнения</h2>
          <div class="space-y-4">
            <div v-for="(stage, i) in service.stages" :key="i" class="flex gap-5 bg-esp-gray p-5">
              <div class="w-10 h-10 bg-esp-blue text-white rounded-full flex items-center justify-center font-rounded font-bold flex-shrink-0">
                {{ i + 1 }}
              </div>
              <div>
                <h3 class="font-rounded font-semibold text-esp-black mb-1">{{ stage.title }}</h3>
                <p class="text-esp-black/60 text-sm">{{ stage.desc }}</p>
              </div>
            </div>
          </div>

          <div v-if="relatedEquipment.length" class="mt-12">
            <h2 class="font-rounded text-2xl mb-6 text-esp-black">Применяемое оборудование</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuxtLink
                v-for="eq in relatedEquipment"
                :key="eq.slug"
                :to="`/equipment/${eq.slug}`"
                class="flex gap-4 bg-esp-gray p-4 hover:shadow-lg transition-all duration-300"
              >
                <img :src="eq.image" :alt="eq.name" class="w-16 h-16 object-contain bg-white flex-shrink-0" />
                <div>
                  <h3 class="font-rounded font-semibold text-esp-black text-sm">{{ eq.name }}</h3>
                  <span class="text-esp-blue text-xs font-medium">Смотреть оборудование →</span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <aside class="bg-esp-gray p-6 h-fit">
          <h3 class="font-rounded font-semibold text-esp-black mb-4">Что входит</h3>
          <ul class="space-y-3 text-sm mb-6">
            <li v-for="point in service.points" :key="point" class="flex gap-2 text-esp-black/70">
              <span class="text-esp-green font-bold">✓</span>
              <span>{{ point }}</span>
            </li>
          </ul>
          <NuxtLink to="/contacts#contact-form" class="btn-primary w-full text-center block">
            Заказать услугу
          </NuxtLink>
        </aside>
      </div>
    </section>

    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl mb-8 text-esp-black">Другие услуги</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="s in otherServices"
            :key="s.slug"
            :to="`/services/${s.slug}`"
            class="bg-white p-6 hover:shadow-lg transition-all duration-300"
          >
            <h3 class="font-rounded font-semibold text-esp-black text-sm">{{ s.title }}</h3>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Услуга не найдена.</p>
    <NuxtLink to="/services" class="text-esp-blue hover:underline">Вернуться к услугам</NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { servicesList, serviceIcons } from '~/composables/useServices'
import { equipmentList } from '~/composables/useEquipment'

const route = useRoute()
const service = computed(() => servicesList.find(s => s.slug === route.params.slug))

const relatedEquipment = computed(() => {
  if (!service.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => service.value.equipmentSlugs.includes(e.slug))
})

const otherServices = computed(() =>
  servicesList.filter(s => s.slug !== route.params.slug).slice(0, 3)
)

useHead(() => ({
  title: service.value ? `${service.value.title} | Услуги ESP` : 'Услуга не найдена | ESP',
  meta: [
    { name: 'description', content: service.value ? service.value.desc : '' }
  ]
}))
</script>

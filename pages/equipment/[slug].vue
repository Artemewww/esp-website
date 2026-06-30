<template>
  <div v-if="product">
    <!-- Breadcrumbs -->
    <section class="py-6 bg-white border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Оборудование', to: '/equipment' }, { label: product.name }]" />
      </div>
    </section>

    <!-- Product hero -->
    <section class="section-padding bg-white">
      <div class="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div class="bg-esp-gray flex items-center justify-center p-10 aspect-square">
          <img :src="product.image" :alt="product.name" class="max-w-full max-h-full object-contain" />
        </div>

        <div>
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            {{ product.badge }}
          </span>
          <h1 class="font-rounded text-3xl md:text-4xl mb-5 text-esp-black">{{ product.name }}</h1>
          <div class="space-y-4 mb-8">
            <p v-for="(para, i) in descParagraphs" :key="i" class="text-lg text-esp-black/70 leading-relaxed">{{ para }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-esp-gray p-4">
              <span class="block text-esp-black/50 text-xs font-inter mb-1">Производительность</span>
              <span class="font-rounded font-semibold text-esp-black">{{ product.capacity }}</span>
            </div>
            <div class="bg-esp-gray p-4">
              <span class="block text-esp-black/50 text-xs font-inter mb-1">Применение</span>
              <span class="font-rounded font-semibold text-esp-black">{{ product.application }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button @click="openBim" class="btn-primary">Запросить BIM/CAD модель</button>
            <button @click="openSpec" class="border-2 border-esp-blue text-esp-blue px-8 py-4 font-medium hover:bg-esp-blue hover:text-white transition">
              В спецификацию
            </button>
          </div>
          <p class="text-xs text-esp-black/40 mt-3 font-inter">BIM/CAD модели предоставляются индивидуально по запросу инженеру ESP.</p>
        </div>
      </div>
    </section>

    <!-- Specs table -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-2xl md:text-3xl mb-8 text-esp-black">Технические характеристики</h2>
        <div class="bg-white">
          <div v-for="(spec, i) in product.specs" :key="i" class="flex justify-between items-center px-6 py-4 border-b border-esp-gray last:border-b-0">
            <span class="text-esp-black/60">{{ spec.label }}</span>
            <span class="font-medium text-esp-black text-right">{{ spec.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Related projects -->
    <section v-if="relatedProjects.length" class="section-padding bg-white">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl md:text-3xl mb-8 text-esp-black">Это оборудование применено в проектах</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="proj in relatedProjects"
            :key="proj.slug"
            :to="`/projects/${proj.slug}`"
            class="bg-esp-gray p-6 hover:shadow-lg transition-all duration-300 block"
          >
            <h3 class="font-rounded font-semibold text-esp-black mb-2">{{ proj.name }}</h3>
            <p class="text-esp-black/60 text-sm">{{ proj.location }}</p>
            <span class="text-esp-blue text-sm font-medium mt-3 inline-block">Смотреть проект →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Other equipment -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl md:text-3xl mb-8 text-esp-black">Другое оборудование</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="item in otherEquipment"
            :key="item.slug"
            :to="`/equipment/${item.slug}`"
            class="bg-white overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div class="h-32 flex items-center justify-center p-4 border-b border-esp-gray">
              <img :src="item.image" :alt="item.name" class="max-h-full max-w-full object-contain" />
            </div>
            <div class="p-4">
              <h3 class="font-rounded text-sm font-semibold text-esp-black">{{ item.name }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div v-if="modal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-esp-black/60" @click="modal.open = false"></div>
      <div class="relative bg-white max-w-lg w-full p-8 shadow-2xl">
        <button @click="modal.open = false" class="absolute top-4 right-4 text-esp-black/50 hover:text-esp-black">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <div v-if="!modal.sent">
          <h3 class="font-rounded text-2xl font-semibold mb-2 text-esp-black">{{ modal.title }}</h3>
          <p class="text-esp-black/60 text-sm mb-6">{{ modal.subtitle }}</p>
          <form @submit.prevent="modal.sent = true" class="space-y-4">
            <input required type="text" placeholder="Ваше имя" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <input required type="email" placeholder="E-mail" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <input type="tel" placeholder="Телефон" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <button type="submit" class="w-full btn-primary">Отправить запрос</button>
          </form>
        </div>
        <div v-else class="text-center py-6">
          <div class="w-16 h-16 bg-esp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-esp-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Заявка отправлена</h3>
          <p class="text-esp-black/60 text-sm">Инженер ESP свяжется с вами в течение 24 часов.</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Оборудование не найдено.</p>
    <NuxtLink to="/equipment" class="text-esp-blue hover:underline">Вернуться в каталог</NuxtLink>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { equipmentList } from '~/composables/useEquipment'
import { projectsList } from '~/composables/useProjects'

const route = useRoute()
const product = computed(() => equipmentList.find(p => p.slug === route.params.slug))
const descParagraphs = computed(() => (product.value?.longDesc || product.value?.desc || '').split('\n\n'))

const relatedProjects = computed(() => {
  if (!product.value?.relatedProjects?.length) return []
  return projectsList.filter(p => product.value.relatedProjects.includes(p.slug))
})

const otherEquipment = computed(() =>
  equipmentList.filter(p => p.slug !== route.params.slug).slice(0, 4)
)

const modal = ref({ open: false, sent: false, title: '', subtitle: '' })
const openBim = () => {
  modal.value = { open: true, sent: false, title: 'Запросить BIM/CAD модель', subtitle: `BIM-модели предоставляются индивидуально по запросу. Оставьте контакты — пришлём модель «${product.value.name}» в формате Revit/AutoCAD.` }
}
const openSpec = () => {
  modal.value = { open: true, sent: false, title: 'Добавить в спецификацию', subtitle: `«${product.value.name}» будет включено в спецификацию. Укажите контакты для получения файла.` }
}

useHead(() => ({
  title: product.value ? `${product.value.name} | Оборудование ESP` : 'Оборудование не найдено | ESP',
  meta: [
    { name: 'description', content: product.value ? `${product.value.desc} Технические характеристики, BIM/CAD модели по запросу.` : '' }
  ]
}))
</script>

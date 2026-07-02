<template>
  <div class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Сертификаты' }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Документы и допуски
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">Сертификаты и аттестаты</h1>
        <p class="text-xl text-esp-black/70 max-w-3xl mb-6">
          ESP работает по системе менеджмента качества ISO 9001-2011 (ISO 9001:2008) и имеет полный пакет разрешительных документов на проектирование, производство и монтаж. Нажмите на документ, чтобы открыть его в полном размере.
        </p>

        <div class="flex flex-wrap gap-3 mb-14">
          <span class="flex items-center gap-2 px-4 py-2 bg-esp-gray rounded-full text-sm font-medium text-esp-black">
            <Icon name="check" cls="w-4 h-4 text-esp-green flex-shrink-0" />ISO 9001-2011 (ISO 9001:2008)
          </span>
          <span class="flex items-center gap-2 px-4 py-2 bg-esp-gray rounded-full text-sm font-medium text-esp-black">
            <Icon name="check" cls="w-4 h-4 text-esp-green flex-shrink-0" />Аттестат 2-й категории сложности проектирования
          </span>
          <span class="flex items-center gap-2 px-4 py-2 bg-esp-gray rounded-full text-sm font-medium text-esp-black">
            <Icon name="check" cls="w-4 h-4 text-esp-green flex-shrink-0" />Допуски на СМР: водоснабжение, канализация, металлоконструкции
          </span>
        </div>

        <div class="space-y-4">
          <details v-for="cat in certificationCategories" :key="cat.id" class="group border border-esp-gray" open>
            <summary class="flex items-center justify-between p-5 cursor-pointer hover:bg-esp-gray/50 transition">
              <div>
                <h3 class="font-rounded font-semibold text-esp-black">{{ cat.title }}</h3>
                <p class="text-esp-black/60 text-sm mt-1">{{ cat.desc }}</p>
              </div>
              <span class="flex-shrink-0 ml-4 px-3 py-1 bg-esp-blue/10 text-esp-blue text-sm font-medium">{{ cat.items.length }} документов</span>
            </summary>
            <div class="px-5 pb-5">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  v-for="item in cat.items"
                  :key="item.num"
                  @click="openLightbox(item)"
                  class="aspect-[3/4] bg-esp-gray border border-esp-gray overflow-hidden relative group/item"
                >
                  <img :src="item.img" :alt="`Документ ${item.num}`" class="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                  <span class="absolute bottom-1 right-1 bg-esp-black/70 text-white text-[10px] px-1.5 py-0.5">№ {{ item.num }}</span>
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <div v-if="activeItem" class="fixed inset-0 z-50 bg-esp-black/90 flex items-center justify-center p-4" @click.self="activeItem = null">
      <div class="relative max-w-2xl w-full">
        <button @click="activeItem = null" class="absolute -top-10 right-0 text-white text-sm hover:text-esp-lidar">Закрыть ✕</button>
        <img :src="activeItem.img" :alt="`Документ ${activeItem.num}`" class="w-full max-h-[85vh] object-contain bg-white" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { certificationCategories } from '~/composables/useCertifications'

const activeItem = ref(null)
const openLightbox = (item) => { activeItem.value = item }

useHead({
  title: 'Сертификаты и аттестаты | ESP',
  meta: [
    { name: 'description', content: 'Сертификаты качества ЭкоСервисПроект: ISO 9001, аттестаты на проектирование, сертификаты соответствия и декларации.' }
  ]
})
</script>

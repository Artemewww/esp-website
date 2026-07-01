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
          ESP работает по системе менеджмента качества ISO 9001-2011 (ISO 9001:2008) и имеет полный пакет разрешительных документов на проектирование, производство и монтаж.
        </p>

        <div class="flex flex-wrap gap-3 mb-14">
          <span class="px-4 py-2 bg-esp-gray rounded-full text-sm font-medium text-esp-black">✅ ISO 9001-2011 (ISO 9001:2008)</span>
          <span class="px-4 py-2 bg-esp-gray rounded-full text-sm font-medium text-esp-black">✅ Аттестат 2-й категории сложности проектирования</span>
          <span class="px-4 py-2 bg-esp-gray rounded-full text-sm font-medium text-esp-black">✅ Допуски на СМР: водоснабжение, канализация, металлоконструкции</span>
        </div>

        <div class="space-y-4">
          <details v-for="cat in certificationCategories" :key="cat.id" class="group border border-esp-gray">
            <summary class="flex items-center justify-between p-5 cursor-pointer hover:bg-esp-gray/50 transition">
              <div>
                <h3 class="font-rounded font-semibold text-esp-black">{{ cat.title }}</h3>
                <p class="text-esp-black/60 text-sm mt-1">{{ cat.desc }}</p>
              </div>
              <span class="flex-shrink-0 ml-4 px-3 py-1 bg-esp-blue/10 text-esp-blue text-sm font-medium">{{ cat.count }} документов</span>
            </summary>
            <div class="px-5 pb-5">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  v-for="i in cat.count"
                  :key="i"
                  @click="requestCert(cat, i)"
                  class="aspect-[3/4] bg-esp-gray border border-esp-gray flex flex-col items-center justify-center gap-2 hover:border-esp-blue transition"
                >
                  <span class="text-2xl">📜</span>
                  <span class="text-xs text-esp-black/60">№ {{ cat.id }}.{{ i }}</span>
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- Request modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-esp-black/60" @click="modalOpen = false"></div>
      <div class="relative bg-white max-w-md w-full p-8 shadow-2xl">
        <button @click="modalOpen = false" class="absolute top-4 right-4 text-esp-black/50 hover:text-esp-black">✕</button>
        <div v-if="!sent">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Запросить копию документа</h3>
          <p class="text-esp-black/60 text-sm mb-6">Оставьте e-mail — пришлём скан-копию {{ activeCert }} в течение рабочего дня.</p>
          <form @submit.prevent="sent = true" class="space-y-4">
            <input required type="email" placeholder="E-mail" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <button type="submit" class="w-full btn-primary">Отправить запрос</button>
          </form>
        </div>
        <div v-else class="text-center py-6">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Отправлено</h3>
          <p class="text-esp-black/60 text-sm">Документ придёт на почту в течение рабочего дня.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { certificationCategories } from '~/composables/useCertifications'

const modalOpen = ref(false)
const sent = ref(false)
const activeCert = ref('')

const requestCert = (cat, i) => {
  activeCert.value = `${cat.title} № ${cat.id}.${i}`
  sent.value = false
  modalOpen.value = true
}

useHead({
  title: 'Сертификаты и аттестаты | ESP',
  meta: [
    { name: 'description', content: 'Сертификаты качества ЭкоСервисПроект: ISO 9001, аттестаты на проектирование, сертификаты соответствия и декларации.' }
  ]
})
</script>

<template>
  <div>
    <section class="section-padding bg-white">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Оборудование', to: '/equipment' }, { label: 'Сравнение' }]" />
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mt-6 mb-4 font-inter">
          Инженерный арбитраж
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">Сравнение оборудования</h1>
        <p class="text-xl text-esp-black/80 max-w-3xl">
          Выберите до 4 моделей из каталога ESP, чтобы сравнить производительность, применение и гарантийные условия бок о бок.
        </p>
      </div>
    </section>

    <!-- Model picker -->
    <section class="py-8 bg-esp-gray border-y border-esp-gray">
      <div class="container-custom">
        <p class="text-sm text-esp-black/60 mb-4 font-inter">Выбрано: {{ selected.length }} / 4</p>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="eq in equipmentList"
            :key="eq.slug"
            @click="toggle(eq.slug)"
            class="px-4 py-2 text-sm font-medium transition-colors border"
            :class="selected.includes(eq.slug) ? 'bg-esp-black text-white border-esp-black' : 'bg-white text-esp-black border-esp-gray hover:border-esp-blue'"
          >
            {{ eq.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Comparison table -->
    <section class="section-padding bg-white overflow-x-auto">
      <div class="container-custom min-w-[700px]">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-left p-4 border-b border-esp-gray w-48 text-esp-black/50 text-sm font-inter font-normal">Параметр</th>
              <th v-for="m in comparedModels" :key="m.slug" class="p-4 border-b border-esp-gray text-left min-w-[200px]">
                <img :src="m.image" :alt="m.name" class="w-full aspect-square object-contain bg-esp-gray p-4 mb-3" />
                <NuxtLink :to="`/equipment/${m.slug}`" class="font-rounded font-semibold text-esp-black hover:text-esp-blue transition">{{ m.name }}</NuxtLink>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-4 border-b border-esp-gray text-esp-black/60 text-sm font-inter">Категория</td>
              <td v-for="m in comparedModels" :key="m.slug + 'cat'" class="p-4 border-b border-esp-gray text-sm">{{ m.category }}</td>
            </tr>
            <tr>
              <td class="p-4 border-b border-esp-gray text-esp-black/60 text-sm font-inter">Производительность</td>
              <td v-for="m in comparedModels" :key="m.slug + 'cap'" class="p-4 border-b border-esp-gray font-medium">{{ m.capacity }}</td>
            </tr>
            <tr>
              <td class="p-4 border-b border-esp-gray text-esp-black/60 text-sm font-inter">Применение</td>
              <td v-for="m in comparedModels" :key="m.slug + 'app'" class="p-4 border-b border-esp-gray">{{ m.application }}</td>
            </tr>
            <tr>
              <td class="p-4 border-b border-esp-gray text-esp-black/60 text-sm font-inter">Гарантия</td>
              <td v-for="m in comparedModels" :key="m.slug + 'war'" class="p-4 border-b border-esp-gray font-medium text-esp-green">{{ warranty(m) }}</td>
            </tr>
            <tr>
              <td class="p-4 text-esp-black/60 text-sm font-inter align-top">Ключевые характеристики</td>
              <td v-for="m in comparedModels" :key="m.slug + 'specs'" class="p-4 align-top">
                <ul class="space-y-1 text-xs text-esp-black/70">
                  <li v-for="spec in m.specs.slice(0, 4)" :key="spec.label">
                    <span class="text-esp-black/40">{{ spec.label }}:</span> {{ spec.value }}
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="p-4 text-esp-black/60 text-sm font-inter"></td>
              <td v-for="m in comparedModels" :key="m.slug + 'cta'" class="p-4">
                <NuxtLink :to="`/equipment/${m.slug}`" class="text-esp-blue text-sm font-medium hover:underline">Подробнее →</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!comparedModels.length" class="text-esp-black/50 text-center py-10">Выберите оборудование выше, чтобы начать сравнение</p>
      </div>
    </section>

    <!-- RFQ -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom max-w-2xl">
        <div class="bg-white p-8">
          <h3 class="font-rounded text-2xl font-semibold mb-3 text-esp-black">Запросить расчёт по выбранным моделям</h3>
          <p class="text-esp-black/70 mb-6">Отправим сравнительное КП с учётом параметров вашего объекта.</p>
          <form v-if="!sent" @submit.prevent="sent = true" class="space-y-4">
            <input v-model="form.name" required type="text" placeholder="Ваше имя" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <input v-model="form.email" required type="email" placeholder="E-mail" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <button type="submit" class="btn-primary w-full">Отправить запрос</button>
          </form>
          <div v-else class="p-5 bg-esp-green/10 border border-esp-green text-esp-green text-center font-medium">
            Запрос отправлен. Инженер ESP свяжется с вами.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { equipmentList } from '~/composables/useEquipment'

useHead({
  title: 'Сравнение оборудования ESP | Подберите оптимальную модель',
  meta: [
    { name: 'description', content: 'Сравните до 4 моделей оборудования ESP по производительности, применению, гарантии и техническим характеристикам.' }
  ]
})

const selected = ref(['flotation-ecomachine', 'kns-kvatro'])
const toggle = (slug) => {
  if (selected.value.includes(slug)) {
    if (selected.value.length <= 1) return
    selected.value = selected.value.filter(s => s !== slug)
  } else {
    if (selected.value.length >= 4) return
    selected.value = [...selected.value, slug]
  }
}

const comparedModels = computed(() => equipmentList.filter(e => selected.value.includes(e.slug)))
const warranty = (m) => m.specs.find(s => s.label.toLowerCase().includes('гарант'))?.value || '—'

const form = ref({ name: '', email: '' })
const sent = ref(false)
</script>

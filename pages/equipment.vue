<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <h1 class="font-rounded text-5xl md:text-6xl mb-6 text-esp-black">
          Оборудование — Тело системы
        </h1>
        <p class="text-xl text-esp-black max-w-3xl">
          «Экомашины» собственного производства. Клеймо «Эталон ESP» на каждом узле.
        </p>
      </div>
    </section>

    <!-- Categories -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="item in equipment" :key="item.id" class="bg-white p-6 rounded-none shadow-sm hover:shadow-lg transition-shadow">
            <div class="h-48 bg-esp-gray mb-6 flex items-center justify-center">
              <span class="text-esp-black">3D Model</span>
            </div>
            <h3 class="font-rounded text-xl mb-3 text-esp-black">{{ item.name }}</h3>
            <p class="text-esp-black mb-4">{{ item.description }}</p>
            <NuxtLink :to="`/equipment/${item.slug}`" class="text-esp-blue font-medium hover:underline">
              Подробнее →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const equipment = [
  {
    id: 1,
    name: 'Очистные сооружения ливневых вод (ОРЛ)',
    description: 'Комплексная очистка поверхностных стоков',
    slug: 'orl'
  },
  {
    id: 2,
    name: 'Канализационные насосные станции (КНС)',
    description: 'Автоматизированные системы перекачки',
    slug: 'kns'
  },
  {
    id: 3,
    name: 'Флотаторы',
    description: 'Эффективное удаление взвешенных веществ',
    slug: 'flotators'
  },
  {
    id: 4,
    name: 'Шкафы управления',
    description: 'Интеллектуальное управление системами',
    slug: 'control-panels'
  },
  {
    id: 5,
    name: 'Системы фильтрации',
    description: 'Многоступенчатая очистка воды',
    slug: 'filtration'
  }
]
</script>
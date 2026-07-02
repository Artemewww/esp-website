<template>
  <div class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Фотогалерея' }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Реализованные объекты
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">Фотогалерея</h1>
        <p class="text-xl text-esp-black/70 max-w-3xl mb-16">
          Подборка материалов по категориям объектов ESP. Полные карточки с описанием и метриками — в разделе «Проекты».
        </p>

        <div class="space-y-16">
          <div v-for="cat in categories" :key="cat.title">
            <div class="flex items-baseline justify-between mb-6">
              <h2 class="font-rounded text-2xl text-esp-black">{{ cat.title }}</h2>
              <span class="text-esp-black/40 text-sm font-inter flex-shrink-0 ml-4">{{ cat.count }}</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div v-for="(img, i) in cat.images" :key="i" class="aspect-square bg-esp-gray overflow-hidden">
                <img :src="img" :alt="cat.title" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <NuxtLink :to="cat.link" class="inline-block mt-4 text-esp-blue text-sm font-medium hover:underline">{{ cat.linkLabel }} →</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const categories = [
  {
    title: 'Станции полной биологической очистки сточных вод (от 100 м³/сутки)',
    count: '14 объектов',
    images: ['/images/product_2.png', '/images/product_5.png', '/images/team/team-at-work.png', '/images/object.jpg'],
    link: '/equipment?category=Реакторы',
    linkLabel: 'Оборудование для биологической очистки'
  },
  {
    title: 'Эффект очистки',
    count: '12 материалов',
    images: ['/images/team/quality-standard.png', '/images/team/quality-underwater.png', '/images/team/crystal-water.png', '/images/view2.jpg'],
    link: '/about#quality',
    linkLabel: 'Стандарты качества ESP'
  },
  {
    title: 'Станции очистки сточных вод типа ВС',
    count: '13 объектов',
    images: ['/images/product_6.png', '/images/product_3.png', '/images/slide1.jpg', '/images/slide2.jpg'],
    link: '/equipment',
    linkLabel: 'Каталог оборудования'
  },
  {
    title: 'Установки очистки ливневых вод типа ОРЛ и ОРЛ-С',
    count: '19 объектов',
    images: ['/images/product_7.png', '/images/product_4.png', '/images/team/lidar-object.png', '/images/view3.jpg'],
    link: '/equipment/orl-storm-water',
    linkLabel: 'Установки ОРЛ / ливневая канализация'
  },
  {
    title: 'Канализационные насосные станции',
    count: '24 объекта',
    images: ['/images/product_1.png', '/images/team/team-collaboration.png', '/images/team/office-interior.png', '/images/slide3.jpg'],
    link: '/equipment/kns-kvatro',
    linkLabel: 'Насосные станции КНС'
  }
]

useHead({
  title: 'Фотогалерея | ESP',
  meta: [
    { name: 'description', content: 'Фотогалерея реализованных объектов ЭкоСервисПроект: станции биологической очистки, установки ОРЛ, насосные станции.' }
  ]
})
</script>

<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Фотогалерея' }]" />
        <span class="ap-eyebrow gl-eyebrow">Реализованные объекты</span>
        <h1 class="ap-title">Фотогалерея</h1>
        <p class="ap-lede">
          Подборка материалов по категориям объектов ESP. Полные карточки с описанием и метриками — в разделе «Проекты».
        </p>

        <div v-for="cat in categories" :key="cat.title" class="gl-cat">
          <div class="ap-head">
            <h2 class="ap-h3 gl-h">{{ cat.title }}</h2>
            <span class="ap-small">{{ cat.count }}</span>
          </div>
          <div class="gl-grid">
            <div v-for="(img, i) in cat.images" :key="i" class="gl-tile">
              <img :src="img" :alt="cat.title" loading="lazy" decoding="async" />
            </div>
          </div>
          <NuxtLink :to="cat.link" class="ap-link gl-more">{{ cat.linkLabel }} ›</NuxtLink>
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
    images: ['/images/product_1.png', '/images/team/team-collaboration.jpg', '/images/team/office-interior.png', '/images/slide3.jpg'],
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

<style scoped>
.gl-eyebrow { margin-top: 1.5rem; }
.gl-cat { margin-top: clamp(3rem, 6vw, 4.5rem); }
.gl-h { max-width: 40rem; font-size: clamp(1.25rem, 2vw, 1.6rem); }
.gl-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin-top: 1.25rem; }
.gl-tile { aspect-ratio: 1; border-radius: 18px; overflow: hidden; background: #ebebef; }
.gl-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.gl-tile:hover img { transform: scale(1.04); }
.gl-more { display: inline-block; margin-top: 1rem; white-space: normal; }
@media (max-width: 767px) {
  .gl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
  .gl-tile { border-radius: 14px; }
}
@media (prefers-reduced-motion: reduce) { .gl-tile img { transition: none; } }
</style>

<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
          Инженерный каталог
        </span>
        <h1 class="font-rounded text-5xl md:text-6xl mb-6 text-esp-black">
          Каталог оборудования ESP
        </h1>
        <p class="text-xl text-esp-black/80 max-w-3xl mb-8">
          Скачивайте BIM/CAD модели, генерируйте спецификации и сравнивайте модели. Конвенция для проектировщиков и партнеров.
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="#catalog" class="btn-primary inline-block">Перейти к каталогу</a>
          <a href="#tools" class="border-2 border-esp-blue text-esp-blue px-8 py-4 font-medium hover:bg-esp-blue hover:text-white transition inline-block">
            Инструменты для проектировщиков
          </a>
        </div>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="py-12 bg-esp-black text-white">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">5</div>
            <p class="text-white/70 text-sm">Лет гарантии</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">4ч</div>
            <p class="text-white/70 text-sm">SLA реакция</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">100%</div>
            <p class="text-white/70 text-sm">BIM-документация</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">24ч</div>
            <p class="text-white/70 text-sm">Подготовка КП</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Smart Filter & Catalog -->
    <section id="catalog" class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="mb-10">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Каталог оборудования</h2>
          <p class="text-esp-black/70 max-w-2xl">Фильтруйте по типу, производительности, применению. Все модели доступны в BIM/CAD форматах.</p>
        </div>

        <!-- Category Filters -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            class="px-5 py-2 font-medium transition-colors text-sm"
            :class="activeCategory === cat ? 'bg-esp-blue text-white' : 'bg-white text-esp-black hover:bg-esp-blue/10'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div class="h-48 bg-gradient-to-br from-esp-blue/10 to-esp-green/10 flex items-center justify-center relative">
              <span class="text-6xl">{{ product.icon }}</span>
              <span class="absolute top-3 left-3 px-2 py-1 bg-esp-blue text-white text-xs font-medium">
                {{ product.badge }}
              </span>
              <span class="absolute top-3 right-3 px-2 py-1 bg-white/90 text-esp-black text-xs font-inter">
                BIM/CAD
              </span>
            </div>
            <div class="p-5">
              <h3 class="font-rounded text-lg font-semibold mb-2 text-esp-black">{{ product.name }}</h3>
              <p class="text-esp-black/60 text-sm mb-3">{{ product.desc }}</p>
              <div class="grid grid-cols-2 gap-2 text-xs font-inter mb-4">
                <div class="bg-esp-gray p-2">
                  <span class="text-esp-black/50">Производит.:</span><br>
                  <span class="font-medium text-esp-black">{{ product.capacity }}</span>
                </div>
                <div class="bg-esp-gray p-2">
                  <span class="text-esp-black/50">Применение:</span><br>
                  <span class="font-medium text-esp-black">{{ product.application }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="flex-1 py-2 border border-esp-blue text-esp-blue text-sm hover:bg-esp-blue hover:text-white transition">
                  Скачать BIM
                </button>
                <button class="flex-1 py-2 bg-esp-green text-white text-sm hover:bg-esp-green/90 transition">
                  В спецификацию
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools for Designers -->
    <section id="tools" class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-lidar/20 text-esp-blue text-sm font-medium mb-4 font-inter">
            Для проектировщиков
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">
            Ускорьте проектирование на 40%
          </h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Используйте готовые блоки ESP в Revit и AutoCAD. Экспортируйте спецификации в одном клике.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-8 border border-esp-gray hover:border-esp-blue hover:shadow-lg transition-all duration-300">
            <div class="w-14 h-14 bg-esp-blue/10 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-esp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16M4 11h4m-4 4h4"/>
              </svg>
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-3 text-esp-black">Калькулятор подбора</h3>
            <p class="text-esp-black/70 mb-5 text-sm leading-relaxed">
              Введите параметры воды и производительность — получите рекомендованные модели с технической документацией.
            </p>
            <button class="w-full py-3 bg-esp-blue text-white font-medium hover:bg-esp-blue/90 transition">
              Открыть калькулятор
            </button>
          </div>

          <div class="p-8 border border-esp-gray hover:border-esp-blue hover:shadow-lg transition-all duration-300">
            <div class="w-14 h-14 bg-esp-green/10 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-esp-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-3 text-esp-black">Генератор спецификаций</h3>
            <p class="text-esp-black/70 mb-5 text-sm leading-relaxed">
              Выберите оборудование из каталога и экспортируйте готовую спецификацию в формате Excel или PDF за один клик.
            </p>
            <button class="w-full py-3 bg-esp-green text-white font-medium hover:bg-esp-green/90 transition">
              Создать спецификацию
            </button>
          </div>

          <div class="p-8 border border-esp-gray hover:border-esp-blue hover:shadow-lg transition-all duration-300">
            <div class="w-14 h-14 bg-esp-lidar/10 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-esp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-3 text-esp-black">BIM-библиотека</h3>
            <p class="text-esp-black/70 mb-5 text-sm leading-relaxed">
              Готовые Revit и AutoCAD семейства всего оборудования ESP. Параметризованные модели с коннекторами и аннотациями.
            </p>
            <button class="w-full py-3 border-2 border-esp-blue text-esp-blue font-medium hover:bg-esp-blue hover:text-white transition">
              Скачать BIM-библиотеку
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Service & Support -->
    <section class="section-padding bg-esp-black text-white">
      <div class="container-custom">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 font-inter">
              Сервис и поддержка
            </span>
            <h2 class="font-rounded text-3xl md:text-4xl mb-6">
              Оборудование ESP — это не покупка. Это партнёрство на весь жизненный цикл.
            </h2>
            <p class="text-white/80 text-lg mb-8">
              Каждая единица поставляется с полным пакетом документации, гарантийными обязательствами и доступом к инженерной поддержке 24/7.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-5">
            <div class="flex gap-5 bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
              <div class="w-12 h-12 bg-esp-green flex-shrink-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-rounded text-lg font-semibold mb-1">Гарантия до 5 лет</h3>
                <p class="text-white/70 text-sm">Расширенная гарантия на всё оборудование ESP. SLA реакции — 4 часа. Устранение неисправностей без доп. платы.</p>
              </div>
            </div>

            <div class="flex gap-5 bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
              <div class="w-12 h-12 bg-esp-blue flex-shrink-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <div>
                <h3 class="font-rounded text-lg font-semibold mb-1">Склады запасных частей</h3>
                <p class="text-white/70 text-sm">Складская программа ESP — 98% запчастей в наличии. Поставка по Беларуси и СНГ в течение 24–48 часов.</p>
              </div>
            </div>

            <div class="flex gap-5 bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
              <div class="w-12 h-12 bg-white/10 flex-shrink-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div>
                <h3 class="font-rounded text-lg font-semibold mb-1">Техническая документация</h3>
                <p class="text-white/70 text-sm">Полный пакет: исполнительные чертежи, схемы автоматизации, паспорта оборудования, инструкции по эксплуатации.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-4">Получите персональное КП за 24 часа</h2>
        <p class="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
          Прикрепите ТЗ или параметры воды. Инженер ESP свяжется для уточнения деталей и подготовит расчет с учетом BIM-модели.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/contacts#contact-form" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition">
            Запросить КП
          </NuxtLink>
          <NuxtLink to="/contacts" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition">
            Связаться с инженером
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Оборудование ESP | Каталог насосов, фильтров, реакторов с BIM/CAD моделями',
  meta: [
    {
      name: 'description',
      content: 'Каталог оборудования EcoServiceProject: флотаторы, КНС, реакторы, фильтры, УФ-установки. BIM/CAD модели для Revit/AutoCAD, генератор спецификаций, гарантия 5 лет.'
    }
  ]
})

const categories = ['Все', 'Флотаторы', 'КНС', 'Фильтры', 'Реакторы', 'УФ-установки']
const activeCategory = ref('Все')

const products = [
  {
    id: 1,
    name: 'Оборудование Экомашины',
    desc: 'Производство экологичных машин для очистки воды. Качество мирового уровня с логотипом производителя. Системы локальной очистки для жилого и коммунального использования.',
    capacity: 'до 5 м³/ч',
    application: 'Жилые объекты',
    icon: '🌱',
    badge: 'Экомашины',
    category: 'Флотаторы'
  },
  {
    id: 2,
    name: 'КНС ESP-НС-250',
    desc: 'Канализационная насосная станция с погружными насосами и автоматическим управлением.',
    capacity: 'до 250 м³/ч',
    application: 'КХ / Жилые',
    icon: '🔧',
    badge: 'КНС',
    category: 'КНС'
  },
  {
    id: 3,
    name: 'Биореактор ESP-МБР-50',
    desc: 'Мембранный биореактор для глубокой биологической очистки стоков с удалением азота и фосфора.',
    capacity: 'до 50 м³/ч',
    application: 'АПК / КХ',
    icon: '🧬',
    badge: 'Реакторы',
    category: 'Реакторы'
  },
  {
    id: 4,
    name: 'Фильтр ESP-Ф-200',
    desc: 'Напорный механический фильтр с зернистой загрузкой для удаления взвешенных веществ.',
    capacity: 'до 200 м³/ч',
    application: 'Универсально',
    icon: '🔵',
    badge: 'Фильтры',
    category: 'Фильтры'
  },
  {
    id: 5,
    name: 'УФ-установка ESP-УФ-75',
    desc: 'Ультрафиолетовая обеззараживающая установка для финишной очистки воды без применения хлора.',
    capacity: 'до 75 м³/ч',
    application: 'Финишная очистка',
    icon: '💡',
    badge: 'УФ-установки',
    category: 'УФ-установки'
  },
  {
    id: 6,
    name: 'Флотатор ESP-ФЛ-500',
    desc: 'Высокопроизводительный флотатор для крупных промышленных объектов и городских КОС.',
    capacity: 'до 500 м³/ч',
    application: 'КОС / Индустрия',
    icon: '🏭',
    badge: 'Флотаторы',
    category: 'Флотаторы'
  }
]

const filteredProducts = computed(() => {
  if (activeCategory.value === 'Все') return products
  return products.filter(p => p.category === activeCategory.value)
})
</script>

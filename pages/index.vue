<template>
  <div>

    <!-- ===== HERO: «Манифест бренда» ===== -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">

      <!-- Video Background -->
      <div class="absolute inset-0 z-0">
        <video
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          class="w-full h-full object-cover"
        >
          <source src="/videos/hero-water.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-gradient-to-r from-esp-black/85 via-esp-black/50 to-transparent"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-3xl px-6 md:px-12 lg:px-24 w-full">
        <span class="inline-flex items-center gap-2 px-4 py-2 bg-esp-green/15 backdrop-blur-md text-esp-green rounded-full text-sm font-semibold border border-esp-green/20 mb-6">
          <span class="w-2 h-2 bg-esp-green rounded-full animate-pulse"></span>
          25+ лет опыта
        </span>

        <h1 class="font-rounded text-5xl md:text-7xl font-semibold text-white leading-[1.05] mb-6">
          Связь.<br><span class="text-esp-green">Синергия</span> опыта и технологий
        </h1>

        <p class="font-inter text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-10">
          ESP — премиальный технологический партнер, создающий интеллектуальные экосистемы очистки воды через синтез 25-летнего опыта и цифровых инноваций
        </p>

        <div class="flex flex-col md:flex-row gap-4">
          <NuxtLink to="/contacts#contact-form" class="btn-primary text-center">
            Обсудить проект
          </NuxtLink>
          <NuxtLink to="/projects" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition text-center">
            Посмотреть кейсы
          </NuxtLink>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <button
        @click="scrollToMetrics"
        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors z-10"
        aria-label="Прокрутить вниз"
      >
        <div class="w-6 h-10 border-2 border-current rounded-full relative">
          <div class="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-current rounded-full animate-scroll-dot"></div>
        </div>
      </button>
    </section>

    <!-- ===== БЛОК 2: КЛЮЧЕВЫЕ МЕТРИКИ («Факторы силы») ===== -->
    <section id="metrics" ref="metricsSection" class="bg-white border-y border-esp-gray py-12 md:py-16">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="metric in metrics" :key="metric.label" class="metric">
            <span class="block text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2 tabular-nums">
              {{ metric.display }}{{ metric.suffix }}
            </span>
            <span class="text-esp-black/70 font-medium text-sm md:text-base">{{ metric.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 3: БРЕНД-СТОЛПЫ («Почему нам верят») ===== -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="font-rounded text-3xl md:text-5xl mb-4 text-esp-black">
            Почему нам верят
          </h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Четыре столпа, на которых строится доверие лидеров отрасли к ESP
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="pillar in pillars"
            :key="pillar.title"
            class="bg-white p-8 border-l-4 border-esp-green shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="text-4xl mb-5">{{ pillar.icon }}</div>
            <h3 class="font-rounded text-xl font-semibold mb-3 text-esp-black">{{ pillar.title }}</h3>
            <p class="text-esp-black/70 leading-relaxed text-sm">{{ pillar.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 4: ЭКОСИСТЕМА В ДЕЙСТВИИ ===== -->
    <section class="section-padding bg-esp-black text-white">
      <div class="container-custom">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span class="inline-block px-4 py-1.5 rounded-full bg-esp-lidar/20 text-esp-lidar text-sm font-medium mb-6 font-inter">
              Экосистема в действии
            </span>
            <h2 class="font-rounded text-3xl md:text-5xl mb-6">
              30 000 элементов, синхронизированных как единый организм
            </h2>
            <p class="text-xl text-white/80 font-inter mb-8">
              Вращайте, масштабируйте, включайте «рентген-режим» для просмотра внутренних процессов очистного комплекса — на странице «Технологии».
            </p>
            <NuxtLink to="/technologies" class="btn-primary inline-block">
              Открыть интерактивную модель
            </NuxtLink>
          </div>

          <div class="aspect-video bg-gradient-to-br from-esp-blue/20 via-esp-black to-esp-green/20 relative overflow-hidden border border-white/10">
            <div class="absolute inset-0 opacity-40">
              <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-esp-blue rounded-full blur-3xl"></div>
              <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-esp-green rounded-full blur-3xl"></div>
            </div>
            <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <span class="text-5xl mb-4">🔗</span>
              <p class="text-white/80">Интерактивная 3D-модель очистного комплекса</p>
              <p class="text-sm text-white/50 mt-2">Лидарное сканирование · Цифровой двойник</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 5: СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО ===== -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <h2 class="text-center font-rounded text-3xl font-semibold mb-12 text-esp-black">
          Нам доверяют лидеры отрасли
        </h2>

        <div class="grid grid-cols-3 md:grid-cols-6 gap-6 mb-12">
          <div
            v-for="i in 6"
            :key="i"
            class="aspect-[2/1] bg-esp-gray flex items-center justify-center text-esp-black/40 font-medium hover:bg-esp-blue hover:text-white transition-colors"
          >
            Партнёр {{ i }}
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <span class="px-4 py-2 bg-esp-gray rounded-full text-sm font-medium text-esp-black">
            ✅ ISO 9001:2015
          </span>
          <span class="px-4 py-2 bg-esp-gray rounded-full text-sm font-medium text-esp-black">
            ✅ Эко-сертификация
          </span>
          <span class="px-4 py-2 bg-esp-gray rounded-full text-sm font-medium text-esp-black">
            ✅ Патенты на технологии
          </span>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 6: CTA ===== -->
    <section class="py-16 md:py-24 text-center text-white" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-6">Готовы создать Эталон качества?</h2>
        <p class="text-lg text-white/95 mb-10 max-w-2xl mx-auto">
          Обсудим ваш проект, подготовим индивидуальное решение и покажем, как синергия опыта и технологий приведёт к кристальному результату
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/contacts#contact-form" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition">
            Обсудить проект
          </NuxtLink>
          <NuxtLink to="/contacts" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition">
            Запросить презентацию
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'ESP | EcoServiceProject — Связь. Синергия опыта и технологий',
  meta: [
    {
      name: 'description',
      content: 'ESP — премиальный технологический партнер мирового уровня, создающий интеллектуальные экосистемы очистки воды. 25+ лет опыта, 30 000 синхронизированных элементов, кристальный просвет 5м.'
    }
  ]
})

const metricsSection = ref(null)
const animated = ref(false)

const metrics = ref([
  { label: 'лет опыта', value: 25, suffix: '+', display: 0 },
  { label: 'синхронизированных элементов', value: 30000, suffix: '+', display: 0 },
  { label: 'экспертов в команде', value: 100, suffix: '+', display: 0 },
  { label: 'кристальный просвет воды', value: 5, suffix: ' м', display: 0 }
])

const pillars = [
  {
    icon: '🤝',
    title: 'Синергия опыта',
    text: '25+ лет фундаментальных знаний и преемственность поколений: от отца-основателя к сыну'
  },
  {
    icon: '⚙️',
    title: 'Интеллект в действии',
    text: '3D-проектирование и лидарное сканирование для точности до миллиметра на стадии замысла'
  },
  {
    icon: '💧',
    title: 'Связь для людей',
    text: 'Мы строим бизнес на глубоком доверии и партнёрстве, где «МЫ» — это код единства'
  },
  {
    icon: '🏆',
    title: 'Эталон ответственности',
    text: 'Гарантия 100% результата очистки и прозрачность всех процессов — наш внутренний стандарт'
  }
]

const animateMetrics = () => {
  if (animated.value) return
  animated.value = true
  metrics.value.forEach((metric) => {
    const duration = 2000
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      metric.display = metric.value < 100
        ? Math.round(metric.value * eased)
        : Math.round(metric.value * eased / 100) * 100
      if (progress < 1) requestAnimationFrame(tick)
      else metric.display = metric.value
    }
    requestAnimationFrame(tick)
  })
}

const scrollToMetrics = () => {
  document.getElementById('metrics')?.scrollIntoView({ behavior: 'smooth' })
}

let observer

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) animateMetrics()
    })
  }, { threshold: 0.5 })
  if (metricsSection.value) observer.observe(metricsSection.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
@keyframes scroll-dot {
  0% { opacity: 0; transform: translate(-50%, 0); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, 12px); }
}
.animate-scroll-dot {
  animation: scroll-dot 1.5s infinite;
}
</style>

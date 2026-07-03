<template>
  <div>

    <!-- ===== HERO: «Манифест бренда» ===== -->
    <section class="relative h-screen flex items-center justify-start overflow-hidden bg-esp-black">

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
        <span class="inline-flex items-center gap-2 px-4 py-2 bg-esp-black/60 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/30 mb-6">
          <span class="w-2 h-2 bg-esp-green rounded-full animate-pulse"></span>
          18 лет опыта
        </span>

        <h1 class="font-rounded text-5xl md:text-7xl font-semibold text-white leading-[1.05] mb-6">
          Архитекторы технологических экосистем очистки воды
        </h1>

        <p class="font-inter text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-10">
          18 лет опыта. 30 000 элементов под контролем. Кристальная чистота 5 метров.
        </p>

        <div class="flex flex-col md:flex-row gap-4">
          <NuxtLink to="/contacts#contact-form" class="btn-primary text-center">
            Заказать технический аудит
          </NuxtLink>
          <NuxtLink to="/technologies" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition text-center">
            Изучить технологии
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

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 lg:row-span-2 bg-white p-10 border-l-4 border-esp-green shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-center">
            <div class="text-5xl mb-6">{{ pillars[0].icon }}</div>
            <h3 class="font-rounded text-2xl font-semibold mb-4 text-esp-black">{{ pillars[0].title }}</h3>
            <p class="text-esp-black/70 leading-relaxed">{{ pillars[0].text }}</p>
          </div>
          <div
            v-for="pillar in pillars.slice(1)"
            :key="pillar.title"
            class="bg-white p-6 border-l-4 border-esp-green shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="text-3xl mb-4">{{ pillar.icon }}</div>
            <h3 class="font-rounded text-lg font-semibold mb-2 text-esp-black">{{ pillar.title }}</h3>
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

          <NuxtLink to="/technologies" class="aspect-video bg-gradient-to-br from-esp-blue/20 via-esp-black to-esp-blue/40 relative overflow-hidden border border-white/10 block group">
            <svg viewBox="0 0 400 220" class="absolute inset-0 w-full h-full opacity-80">
              <circle cx="200" cy="110" r="30" fill="none" stroke="#00D4FF" stroke-width="1.2" opacity="0.7">
                <animate attributeName="r" values="30;70;30" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="110" r="30" fill="none" stroke="#00D4FF" stroke-width="1.2" opacity="0.7">
                <animate attributeName="r" values="30;70;30" dur="3s" begin="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" begin="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="110" r="26" fill="#002366" stroke="#00D4FF" stroke-width="1" />
              <g stroke="#00A3CC" stroke-width="1" opacity="0.5">
                <line x1="200" y1="110" x2="90" y2="60" />
                <line x1="200" y1="110" x2="310" y2="60" />
                <line x1="200" y1="110" x2="90" y2="170" />
                <line x1="200" y1="110" x2="310" y2="170" />
              </g>
              <circle r="3" fill="#00D4FF"><animateMotion dur="2s" repeatCount="indefinite" path="M200,110 L90,60" /></circle>
              <circle r="3" fill="#00D4FF"><animateMotion dur="2.4s" repeatCount="indefinite" path="M200,110 L310,60" /></circle>
              <circle r="3" fill="#00D4FF"><animateMotion dur="2.2s" repeatCount="indefinite" path="M200,110 L90,170" /></circle>
              <circle r="3" fill="#00D4FF"><animateMotion dur="1.8s" repeatCount="indefinite" path="M200,110 L310,170" /></circle>
              <circle cx="90" cy="60" r="14" fill="#002366" /><circle cx="310" cy="60" r="14" fill="#002366" />
              <circle cx="90" cy="170" r="14" fill="#002366" /><circle cx="310" cy="170" r="14" fill="#002366" />
            </svg>
            <div class="relative z-10 h-full flex flex-col items-center justify-end pb-8 text-center px-6 bg-gradient-to-t from-esp-black/80 via-transparent to-transparent">
              <p class="text-white/90 font-medium group-hover:text-white transition-colors">Интерактивная 3D-модель очистного комплекса</p>
              <p class="text-sm text-white/50 mt-2">Лидарное сканирование · Цифровой двойник · Открыть на странице «Технологии» →</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 4.5: МОЗГ И ТЕЛО ===== -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            Экосистема ESP
          </span>
          <h2 class="font-rounded text-3xl md:text-5xl mb-4 text-esp-black">Мозг и Тело</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Инжиниринговый «Мозг» ESP проектирует, производственное «Тело» Экомашины — изготавливает
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-esp-gray p-10 flex flex-col items-center text-center">
            <div class="h-16 flex items-center mb-6">
              <svg viewBox="0 0 120 61" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-auto">
                <path d="M63.0562 1.29415C66.2988 4.75237 73.6844 12.9677 75.2426 17.0885C75.8406 18.671 76.4481 21.7646 73.9536 21.9386C71.7999 22.0887 71.3448 19.0047 70.6491 17.6391C70.1202 16.5999 69.1911 15.27 68.4787 14.3334C66.4465 11.6617 63.6947 9.12579 61.5838 6.45645L57.6694 11.5663C50.2599 29.0719 76.9818 26.4645 78.6018 42.3209C80.3458 59.4022 58.6129 65.9325 48.0395 54.1184L45.1972 50.5291C44.7088 50.5982 42.9624 52.8337 42.343 53.4081C29.5729 65.2152 9.53871 60.4938 2.45324 44.9854C-3.36714 32.2465 1.4526 16.8502 13.9082 10.3747C22.5375 5.88922 32.5868 7.24057 41.9785 7.40025C43.477 16.8335 41.5472 28.6072 34.2426 35.2805C29.4767 39.6339 23.2365 41.7799 16.8427 41.8132C15.5211 41.82 14.5739 40.6019 14.7912 39.2983C14.9634 38.2655 15.8243 37.491 16.8696 37.432C18.5252 37.3387 20.1784 37.2264 21.8084 36.8845C30.6538 35.0313 35.8414 28.031 37.5864 19.9074C38.5857 15.2555 34.4738 11.29 29.7183 11.4424C25.9921 11.5616 22.2635 11.7808 18.7184 13.0511C8.10447 16.8621 2.58904 27.8564 5.03108 38.8221C5.18393 39.5065 5.41556 40.1635 5.66802 40.813C5.93275 41.4941 7.17602 41.3764 7.25631 40.6501C7.83525 35.4378 10.1034 30.5424 13.7581 26.7887C17.1602 23.2923 22.0086 21.9219 26.1207 19.5124C27.4032 18.7596 28.5079 17.8111 29.7476 17.0235C29.954 16.8923 30.2207 16.9132 30.4096 17.0686C30.5299 17.1675 30.6074 17.3107 30.6115 17.4663C30.6595 19.2819 29.453 20.8557 28.3078 22.1793C24.341 26.7625 18.1013 26.8912 14.4323 32.8233C6.6178 45.4573 15.421 58.4989 30.0971 55.1932C35.9961 53.8657 39.7294 50.0858 43.2721 45.5169C43.988 44.5937 44.1633 43.2027 45.8366 43.2027C47.5099 43.2027 48.2491 46.0031 49.1831 47.967C51.3392 52.4977 57.2787 56.69 62.3891 55.1432C65.7079 54.1398 67.2041 50.1263 66.6585 46.9016C65.372 39.2988 49.8311 37.671 46.7267 27.7873C43.2459 16.7096 55.5085 8.13432 61.1097 0.233567L61.6005 0C61.8936 0 62.7441 0.960484 63.0562 1.29177V1.29415ZM52.204 18.6043C51.0557 18.9118 50.6221 21.7432 50.5458 22.7775C49.6453 34.7609 68.7503 34.3891 70.7325 45.679C71.1614 48.1243 70.6968 49.397 70.5443 51.6397C70.4609 52.8576 71.3448 51.8304 71.7093 51.3728C74.2967 48.1195 75.0948 42.8261 72.9435 39.1701C68.2262 31.1549 52.4018 30.2779 52.204 18.6019V18.6043Z" fill="#002366"/>
                <path d="M94.9361 58.0852C91.2242 62.0606 83.7123 60.0157 83.1286 54.2313C82.1184 44.2189 84.3722 32.7384 95.3435 29.7735C97.8427 29.0991 100.342 29.2873 102.727 28.8297C106.627 28.0838 107.632 22.8261 104.283 20.6406C102.477 19.4609 99.4533 19.8303 98.1453 21.6178C97.1113 23.0287 97.3067 25.872 96.468 26.6109C95.7485 27.2424 93.4161 27.3354 92.4035 27.6595C91.9652 20.7693 96.5443 13.9697 104.106 15.812C113.367 18.0714 112.831 31.6564 103.356 33.2723C101.54 33.5821 99.6129 33.2913 97.776 33.6393C93.0325 34.5378 89.0395 38.4274 87.9888 43.1369C87.4956 45.3534 87.2431 51.7527 87.6982 53.9382C88.1937 56.331 91.908 56.1237 92.3463 53.6975C93.3065 48.3564 89.8567 39.6048 97.3472 37.7363C101.4 36.7257 105.162 37.8674 109.128 35.7176C118.92 30.4123 117.21 14.9897 106.391 12.0868C103.556 11.3265 94.2595 11.3957 91.0836 11.6769C88.7417 11.8842 87.8673 13.1307 87.6457 15.383C87.6457 21.8854 87.6457 25.2918 87.6457 31.0605C85.0398 33.2998 83.3716 35.8695 83.3716 35.8695C83.3716 35.8695 83.3716 35.8695 83.1143 15.1327C83.4883 10.3684 86.6356 7.44647 91.3171 7.14617C94.7765 6.92452 99.763 6.93644 103.229 7.14617C124.14 8.41411 125.82 37.2453 106.443 41.3685C104.263 41.8332 98.3311 41.2088 97.29 42.6841C95.2172 45.6203 98.5527 54.2003 94.9313 58.078L94.9361 58.0852Z" fill="#002366"/>
              </svg>
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Инжиниринговый «Мозг»</h3>
            <p class="text-esp-black/70 text-sm">3D-проектирование, BIM-моделирование, LiDAR-сканирование и расчёты. ESP проектирует каждую систему с точностью до миллиметра.</p>
          </div>

          <div class="bg-esp-gray p-10 flex flex-col items-center text-center">
            <div class="h-16 flex items-center mb-6">
              <img src="/logo-ecomachine.svg" alt="Экомашины" class="h-full w-auto" />
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Производственное «Тело»</h3>
            <p class="text-esp-black/70 text-sm">Экомашины — производство флотаторов, КНС, реакторов и ОРЛ-установок. 100% контроль качества на каждом узле.</p>
            <NuxtLink to="/equipment" class="text-esp-blue text-sm font-medium mt-4 hover:underline">Смотреть каталог оборудования →</NuxtLink>
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
            v-for="partner in trustedPartners"
            :key="partner"
            class="aspect-[2/1] bg-esp-gray flex items-center justify-center text-esp-black/60 font-semibold text-xs md:text-sm text-center px-2 hover:bg-esp-blue hover:text-white transition-colors"
          >
            {{ partner }}
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
    <section class="py-16 md:py-24 text-center text-white" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
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
    },
    { property: 'og:title', content: 'ESP | EcoServiceProject — экосистемы очистки воды' },
    { property: 'og:description', content: 'Проектирование, производство и монтаж очистных сооружений «под ключ». 25+ лет опыта, 150+ реализованных проектов.' },
    { property: 'og:image', content: 'https://ecoservisproekt.com/images/team/team-hero-1.png' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.com/' }]
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

const trustedPartners = ['БНТУ', 'БГУИР', 'Красный Октябрь', 'Теплосеть', 'Минскводоканал', 'Экологический надзор РБ']

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

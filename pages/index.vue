<template>
  <div>

    <!-- ===== HERO: СЛАЙДЕР ===== -->
    <section class="relative h-screen w-full flex items-center overflow-hidden bg-esp-black" style="margin-top: -5rem; padding-top: 5rem;">

      <!-- Preloader dots while video loads -->
      <div v-if="!videoLoaded" class="absolute inset-0 z-20 flex items-center justify-center bg-esp-black">
        <div class="relative w-32 h-32">
          <div v-for="i in 3" :key="i"
            class="absolute inset-0 rounded-full border-2 border-esp-lidar/30"
            :style="{
              animation: `preloader-ring 2s ease-out ${i * 0.4}s infinite`,
              opacity: 0
            }"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-3 h-3 bg-esp-lidar rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Video Background -->
      <div class="absolute inset-0 z-0" :class="{ 'opacity-0': !videoLoaded }" style="transition: opacity 0.8s ease">
        <video
          :key="currentSlide"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          class="w-full h-full object-cover"
          :ref="(el) => { if (el) handleVideoLoad(el) }"
          @loadeddata="onVideoLoaded"
          @timeupdate="onTimeUpdate"
        >
          <source :src="slides[currentSlide].video" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-gradient-to-r from-esp-black/85 via-esp-black/50 to-transparent"></div>
      </div>

      <!-- Content: всегда прижато к левому краю, как в портфолио -->
      <div class="relative z-10 w-full text-left">
        <div :key="'content-' + currentSlide" class="max-w-3xl px-6 md:px-12 lg:px-24">
          <!-- Badge with staggered animation -->
          <div class="hero-badge mb-6">
            <span class="inline-flex items-center gap-2 px-4 py-2 bg-esp-black/60 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/30">
              <span v-if="slides[currentSlide].type === 'hero'" class="text-base leading-none">🇧🇾</span>
              <span class="text-white/90">{{ slides[currentSlide].badge }}</span>
            </span>
          </div>

          <!-- Title with staggered animation -->
          <h1 class="font-rounded text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] mb-6 overflow-hidden max-w-4xl">
            <span
              v-for="(word, wIdx) in slides[currentSlide].title.split(' ')"
              :key="wIdx"
              class="inline-block mr-[0.3em]"
            >
              <span
                v-for="(char, cIdx) in word.split('')"
                :key="cIdx"
                class="inline-block water-char"
                :style="{ animationDelay: `${0.6 + wIdx * 0.08 + cIdx * 0.04}s` }"
              >{{ char }}</span>
            </span>
          </h1>

          <!-- Description with staggered animation -->
          <p class="font-inter text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed mb-10 hero-desc">
            {{ slides[currentSlide].description }}
          </p>

          <!-- Buttons with staggered animation -->
          <div class="flex flex-col md:flex-row gap-4 hero-buttons">
            <NuxtLink
              v-if="slides[currentSlide].link"
              :to="slides[currentSlide].link"
              class="btn-primary text-center"
            >
              {{ slides[currentSlide].type === 'hero' ? 'Заказать технический аудит' : 'Подробнее о проекте' }}
            </NuxtLink>
            <NuxtLink
              v-if="slides[currentSlide].type === 'hero'"
              to="/technologies"
              class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition text-center"
            >
              Изучить технологии
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Video Preview Widget (right bottom corner) -->
      <div class="absolute bottom-8 right-6 z-10 group cursor-pointer" @click="openVideoModal">
        <div class="relative w-28 h-16 md:w-40 md:h-[90px] rounded-xl overflow-hidden border-2 border-white/30 hover:border-esp-lidar/70 transition-all duration-500 shadow-2xl hover:shadow-esp-lidar/30 hover:scale-105">
          <video
            autoplay
            muted
            loop
            playsinline
            class="w-full h-full object-cover"
          >
            <source src="/videos/hero-compilation.mp4" type="video/mp4" />
          </video>
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-esp-blue/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shadow-esp-blue/40">
              <svg class="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Modal (almost fullscreen) -->
      <div v-if="showVideoModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm" @click.self="closeVideoModal">
        <div class="relative w-[95vw] h-[90vh] flex items-center justify-center">
          <button @click="closeVideoModal" class="absolute top-4 right-4 z-10 text-white/80 hover:text-white flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200" title="Закрыть">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div class="w-full h-full bg-black rounded-xl overflow-hidden">
            <video
              autoplay
              controls
              muted
              playsinline
              class="w-full h-full object-contain"
            >
              <source src="/videos/hero-compilation.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          class="transition-all duration-300 rounded-full"
          :class="[
            index === currentSlide
              ? 'w-3 h-3 bg-esp-green shadow-lg shadow-esp-green/50 scale-125'
              : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70 hover:scale-110'
          ]"
          :aria-label="`Перейти к слайду ${index + 1}`"
        ></button>
      </div>
    </section>

    <!-- ===== БЛОК 2: КЛЮЧЕВЫЕ МЕТРИКИ («Факторы силы») ===== -->
    <section id="metrics" ref="metricsSection" class="bg-white border-y border-esp-gray py-12 md:py-16">
      <div class="container-custom">
        <div class="grid grid-cols-3 gap-4 md:gap-8 text-center">
          <div v-for="metric in metrics" :key="metric.label" class="metric">
            <span class="block text-3xl sm:text-5xl md:text-6xl font-rounded font-bold text-esp-blue mb-3 tabular-nums">
              {{ metric.display }}{{ metric.suffix }}
            </span>
            <span class="text-esp-black/70 font-semibold text-xs sm:text-base md:text-lg uppercase tracking-wide">
              {{ metric.label }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 3: ПОЧЕМУ НАМ ДОВЕРЯЮТ ЛИДЕРЫ ===== -->
    <section ref="trustSection" class="section-padding bg-white relative overflow-hidden" :class="{ 'trust-active': trustActive }">
      <div class="container-custom">
        <div class="text-center mb-12 md:mb-16">
          <h2 class="font-rounded text-3xl md:text-5xl font-bold text-esp-black water-title">
            ПОЧЕМУ НАМ ДОВЕРЯЮТ ЛИДЕРЫ
          </h2>
        </div>

        <div ref="trustGrid" class="trust-grid">
          <!-- Анимированные линии от капли к каждому блоку -->
          <svg
            class="trust-svg"
            :viewBox="`0 0 ${trustSize.w} ${trustSize.h}`"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="trustGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#00A8E8" stop-opacity="0.12" />
                <stop offset="100%" stop-color="#00A8E8" />
              </linearGradient>
            </defs>
            <path
              v-for="(d, i) in trustPaths"
              :key="i"
              :d="d"
              class="trust-line"
              :style="{ '--i': i }"
              pathLength="1"
              stroke="url(#trustGrad)"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>

          <!-- Капля -->
          <div ref="trustDrop" class="trust-drop">
            <img src="/kapla.png" alt="Капля ESP — эталон качества" />
          </div>

          <!-- Блоки -->
          <div class="trust-blocks">
            <div
              v-for="(factor, idx) in trustFactors"
              :key="idx"
              :ref="(el) => setTrustBlockRef(el, idx)"
              class="trust-block"
              :style="{ '--i': idx }"
            >
              <span class="trust-node"></span>
              <div class="trust-block-body">
                <h4 class="trust-block-title font-rounded">{{ factor.title }}</h4>
                <p class="trust-block-text">{{ factor.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 4: ТЕХНОЛОГИИ — СКРОЛЛ-СЛОИ (сканирование → проектирование → эксплуатация) ===== -->
    <section ref="techSection" class="tech-scroll bg-white">
      <div class="tech-sticky">
        <!-- Полноэкранные слои-изображения (плавно накладываются при скролле) -->
        <div class="tech-media">
          <img
            v-for="(stage, i) in techStages"
            :key="i"
            :src="stage.img"
            :alt="stage.title"
            class="tech-layer"
            :style="{ opacity: techLayerOpacity(i), zIndex: i }"
          />
        </div>

        <!-- Бейдж + связующий заголовок -->
        <div class="tech-head">
          <span class="tech-badge">Технологии</span>
          <h2 class="tech-title font-rounded">
            ТЕХНОЛОГИИ, КОТОРЫЕ СОЕДИНЯЮТ
            <span class="text-esp-blue">ПРОЕКТИРОВАНИЕ, ПРОИЗВОДСТВО И УПРАВЛЕНИЕ</span>
          </h2>
        </div>

        <!-- Подписи этапов (кроссфейд) -->
        <div class="tech-captions">
          <div
            v-for="(stage, i) in techStages"
            :key="i"
            class="tech-caption"
            :class="{ 'is-active': techActive === i }"
          >
            <span class="tech-caption-num" :style="{ color: stage.color }">0{{ i + 1 }}</span>
            <h3 class="tech-caption-title font-rounded">{{ stage.title }}</h3>
            <p class="tech-caption-text">{{ stage.text }}</p>
          </div>
        </div>

        <!-- Индикатор этапов -->
        <div class="tech-steps">
          <button
            v-for="(stage, i) in techStages"
            :key="i"
            type="button"
            class="tech-step"
            :class="{ 'is-active': techActive === i }"
            :style="{ '--c': stage.color }"
            @click="scrollToStage(i)"
          >
            <span class="tech-step-dot"></span>
            <span class="tech-step-label">{{ stage.short }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 5: ПОЛНОШИРИННАЯ КАРТИНКА ===== -->
    <section class="w-full overflow-hidden bg-white">
      <img src="/Kapla_factory.png" alt="Оборудование ESP" class="w-full h-auto object-contain" />
    </section>

    <!-- ===== БЛОК 6: ВИДЕОМОЗАИКА (стиль relats) ===== -->
    <section ref="mosaicSection" class="vm-section bg-esp-black" :class="{ 'vm-active': vmActive }">
      <div class="vm-grid">
        <div
          v-for="(src, i) in mosaicVideos"
          :key="src"
          class="vm-tile"
          :style="{ transitionDelay: `${i * 0.12}s` }"
        >
          <video muted loop playsinline preload="metadata" class="vm-video">
            <source :src="src" type="video/mp4" />
          </video>
        </div>
      </div>
      <div class="vm-overlay">
        <h2 class="font-rounded text-3xl md:text-5xl font-semibold text-white text-center max-w-3xl mx-auto px-6 leading-[1.15]">
          Полный цикл решений<br />для очистки воды
        </h2>
      </div>
    </section>

    <!-- ===== БЛОК 7: ПАРТНЁРЫ (карусель) ===== -->
    <section class="py-14 md:py-20 bg-white overflow-hidden">
      <div class="container-custom">
        <h2 class="text-center font-rounded text-3xl font-semibold mb-10 text-esp-black">
          Нам доверяют лидеры отрасли
        </h2>
      </div>
      <div class="partners-marquee">
        <div class="partners-track">
          <div
            v-for="(logo, i) in [...partnerLogos, ...partnerLogos]"
            :key="i"
            class="partner-logo"
          >
            <img :src="logo" alt="" loading="lazy" />
          </div>
        </div>
      </div>
      <div class="container-custom">
        <div class="flex justify-center mt-12">
          <img src="/icon-sertificat.png" alt="Сертификаты, эко-сертификация и патенты ESP" class="max-w-full h-auto" />
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 8: ОТЗЫВЫ ===== -->
    <section class="section-padding text-white" style="background: linear-gradient(180deg, #0a58b8 0%, #063f8f 100%)">
      <div class="container-custom">
        <h2 class="text-center font-rounded text-3xl md:text-4xl font-semibold mb-14 tracking-wide">
          ОТЗЫВЫ
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <button
            v-for="(img, i) in reviewImages"
            :key="img"
            type="button"
            class="review-card"
            @click="openReview(i)"
          >
            <img :src="img" :alt="`Отзыв ESP №${i + 1}`" loading="lazy" />
            <span class="review-zoom" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Лайтбокс отзывов -->
    <Teleport to="body">
      <div v-if="reviewOpen" class="review-lightbox" @click="closeReview">
        <button type="button" class="review-lb-btn review-lb-close" @click.stop="closeReview" aria-label="Закрыть">✕</button>
        <button type="button" class="review-lb-btn review-lb-prev" @click.stop="stepReview(-1)" aria-label="Предыдущий">‹</button>
        <img :src="reviewImages[reviewIndex]" :alt="`Отзыв ESP №${reviewIndex + 1}`" class="review-lb-img" @click.stop />
        <button type="button" class="review-lb-btn review-lb-next" @click.stop="stepReview(1)" aria-label="Следующий">›</button>
        <div class="review-lb-counter">{{ reviewIndex + 1 }} / {{ reviewImages.length }}</div>
      </div>
    </Teleport>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const videoLoaded = ref(false)
const showVideoModal = ref(false)
let autoSlideTimer = null
let slowMoTimer = null

const openVideoModal = () => {
  showVideoModal.value = true
  if (autoSlideTimer) clearInterval(autoSlideTimer)
}

const closeVideoModal = () => {
  showVideoModal.value = false
  startAutoSlide()
}

const slides = [
  // ===== СЛАЙД 1: Заглавный (Hero) — DJI_0402 ускоренное =====
  {
    type: 'hero',
    badge: 'Произведено в Республике Беларусь',
    title: 'Мы архитекторы технологий очистки воды',
    description: '28 лет опыта. Кристальная чистота воды с просветом 4 метра. Экосистема, состоящая из 30 000 элементов.',
    link: '/contacts#contact-form',
    video: '/videos/DJI_0402.mp4',
    speed: 2.5
  },
  // ===== СЛАЙДЫ 2-12: Проекты =====
  {
    type: 'project',
    badge: 'Фаниполь | 4700 м³/сут',
    title: 'Молочный завод',
    description: 'Очистные сооружения производственных сточных вод. СПК «Агрокомбинат Снов»',
    link: '/projects/minsk-vodokanal-modernization',
    video: '/videos/DJI_0238.mp4'
  },
  {
    type: 'project',
    badge: 'Минск | 25 000 м³/сут',
    title: 'Модернизация очистных сооружений Минского водоканала',
    description: 'Реконструкция городской станции водоочистки с внедрением BIM-проектирования и IoT-мониторинга.',
    link: '/projects/minsk-vodokanal-modernization',
    video: '/videos/DJI_0470.mp4'
  },
  {
    type: 'project',
    badge: 'Гродненская область | 1 500 м³/сут',
    title: 'Система очистки агрохолдинга «БелАгро»',
    description: 'Биологическая очистка производственных стоков свиноводческого комплекса с замкнутым циклом водопользования.',
    link: '/projects/agrokombinat-snov',
    video: '/videos/DJI_0654.mp4#t=5'
  },
  {
    type: 'project',
    badge: 'Брестская область | 600 м³/сут',
    title: 'Очистные сооружения молокозавода «Савушкин»',
    description: 'Многоступенчатая очистка стоков молочного производства с рециркуляцией воды.',
    link: '/projects/savushkin-dairy',
    video: '/videos/DJI_0715.mp4'
  },
  {
    type: 'project',
    badge: 'Минск | 250 м³/ч',
    title: 'Канализационная насосная станция жилого квартала «Маяк»',
    description: 'Автоматизированная насосная станция для жилого комплекса на 2500 квартир.',
    link: '/projects/mayak-residential',
    video: '/videos/hero-water.mp4#t=16'
  },
  {
    type: 'project',
    badge: 'Жлобин | 15 000 м³/сут',
    title: 'Реконструкция очистных сооружений металлургического завода',
    description: 'Лидарное сканирование и создание цифрового двойника для проектирования расширения мощности.',
    link: '/projects/gorodok-reconstruction',
    video: '/videos/DJI_0238.mp4'
  },
  {
    type: 'project',
    badge: 'Петриков | 2 200 м³/сут',
    title: 'Очистные сооружения города Петрикова',
    description: 'Станция биологической очистки коммунальных стоков для КУП «Петриковский райжилкомхоз».',
    link: '/projects/petrikov-bio-station',
    video: '/videos/DJI_0470.mp4'
  },
  {
    type: 'project',
    badge: 'Витебская область | 3 000 м³/сут',
    title: 'Очистные сооружения Витебской бройлерной птицефабрики',
    description: 'Станция полной биологической очистки с денитрификацией и ультрафиолетовым обеззараживанием.',
    link: '/projects/vitebsk-broiler',
    video: '/videos/DJI_0654.mp4#t=5'
  },
  {
    type: 'project',
    badge: 'Кричев | 250 м³/сут',
    title: 'Вынос очистных сооружений из прибрежной зоны реки Белянка',
    description: 'Строительство новой станции биологической очистки для Кричевского водоканала.',
    link: '/projects/krichev-vodokanal',
    video: '/videos/DJI_0715.mp4'
  },
  {
    type: 'project',
    badge: 'Столбцовский район | 450 м³/сут',
    title: 'Очистные сооружения и насосная станция в деревне Вишневец',
    description: 'Станция очистки сточных вод и канализационная насосная станция для УП «УКС-Столбцы».',
    link: '/projects/vishnevets-kns',
    video: '/videos/hero-water.mp4#t=16'
  },
  {
    type: 'project',
    badge: 'Минский район | 25 м³/сут',
    title: 'Локальные очистные для пяти жилых домов в деревне Городище',
    description: 'Автономные очистные сооружения канализации «Миниклар ДС 25» для частной жилой застройки.',
    link: '/projects/gorodishche-houses',
    video: '/videos/DJI_0238.mp4'
  }
]

const handleVideoLoad = (el) => {
  if (slides[currentSlide.value].speed) {
    el.playbackRate = slides[currentSlide.value].speed
  }
}

const onTimeUpdate = (e) => {
  const slide = slides[currentSlide.value]
  if (!slide.slowMoStart || !slide.slowMoEnd) return
  const video = e.target
  const currentTime = video.currentTime
  // Slow motion between slowMoStart and slowMoEnd
  if (currentTime >= slide.slowMoStart && currentTime <= slide.slowMoEnd) {
    video.playbackRate = slide.slowMoRate
  } else if (currentTime > slide.slowMoEnd) {
    video.playbackRate = slide.speed || 1
  }
}

const onVideoLoaded = () => {
  videoLoaded.value = true
}

const goToSlide = (index) => {
  currentSlide.value = index
  videoLoaded.value = false
  resetAutoSlide()
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
  videoLoaded.value = false
}

const resetAutoSlide = () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
  }
  const delay = slides[currentSlide.value].type === 'hero' ? 12000 : 5000
  autoSlideTimer = setInterval(nextSlide, delay)
}

const startAutoSlide = () => {
  if (autoSlideTimer) clearInterval(autoSlideTimer)
  autoSlideTimer = setInterval(nextSlide, 12000)
}

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
  { label: 'Реализовано проектов', value: 2000, suffix: '+', display: 0 },
  { label: 'Экспертов в команде', value: 100, suffix: '+', display: 0 },
  { label: 'Лет опыта', value: 28, suffix: '', display: 0 }
])

const trustFactors = [
  {
    title: 'ИНЖИНИРИНГ',
    text: 'Проектируем будущее с точностью до миллиметра.'
  },
  {
    title: 'РЕШЕНИЯ НА БАЗЕ USBF',
    text: 'Внедряем технологию USBF под задачи конкретного объекта, а не по типовому шаблону. Опираемся на 28 лет практики глубокой биологической очистки.'
  },
  {
    title: 'ПРОИЗВОДСТВО',
    text: 'Точность в каждой детали. Качество в каждом узле.'
  },
  {
    title: 'ТЕСТИРОВАНИЕ',
    text: 'Проверяем надёжность на каждом этапе. 100% результата и полная прозрачность всех процессов — наш внутренний стандарт.'
  }
]

// ===== Блок «Почему нам доверяют лидеры»: капля → линии → точки → блоки =====
const trustSection = ref(null)
const trustGrid = ref(null)
const trustDrop = ref(null)
const trustActive = ref(false)
const trustPaths = ref([])
const trustSize = ref({ w: 1000, h: 500 })
const trustBlockEls = []
let trustRO
let trustObserver

const setTrustBlockRef = (el, idx) => {
  if (el) trustBlockEls[idx] = el
}

// Пересчёт SVG-путей от правого края капли к точке каждого блока
const measureTrust = () => {
  const grid = trustGrid.value
  const drop = trustDrop.value
  if (!grid || !drop) return
  const g = grid.getBoundingClientRect()
  trustSize.value = { w: grid.offsetWidth, h: grid.offsetHeight }
  const d = drop.getBoundingClientRect()
  const dx = d.right - g.left
  const dy = d.top - g.top + d.height / 2
  const paths = []
  trustBlockEls.forEach((el) => {
    if (!el) return
    const b = el.getBoundingClientRect()
    const nx = b.left - g.left
    const ny = b.top - g.top + 16
    const mx = dx + (nx - dx) * 0.5
    paths.push(`M ${dx} ${dy} C ${mx} ${dy}, ${mx} ${ny}, ${nx} ${ny}`)
  })
  trustPaths.value = paths
}

const partnerLogos = [
  '/logocompany/bntu.png',
  '/logocompany/BGUIR-logo.jpg',
  '/logocompany/belaruskali.jpg',
  '/logocompany/Belarusneft.png',
  '/logocompany/Bel_minprirod.gif',
  '/logocompany/MTS-1.png',
  '/logocompany/logo-print.png',
  '/logocompany/8558.gif',
  '/logocompany/images.png',
  '/logocompany/images-1.png',
  '/logocompany/80c6fe59f5b620e9940155f748939cf7.jpg',
  '/logocompany/a1028285fb980e60630f0be2400ec053.jpg',
  '/logocompany/d877f2006e18247d96f2092f23e47fd8.png'
]

const animateMetrics = () => {
  if (animated.value) return
  animated.value = true
  metrics.value.forEach((metric) => {
    const duration = 7000
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      metric.display = Math.round(metric.value * eased)
      if (progress < 1) requestAnimationFrame(tick)
      else metric.display = metric.value
    }
    requestAnimationFrame(tick)
  })
}

let observer

// Блок «Технологии»: полноэкранные слои, накладываются при скролле
const techSection = ref(null)
const techProgress = ref(0)
let techRaf = 0

const techStages = [
  {
    short: 'Сканирование',
    title: 'ЛИДАРНОЕ СКАНИРОВАНИЕ',
    text: 'Лазерное сканирование действующих сооружений с точностью до 1 мм. Создаём облако точек территории для проектирования реконструкции без остановки производства.',
    img: '/images/digital-twin/layer-lidar.jpg',
    color: '#22c55e'
  },
  {
    short: 'Проектирование',
    title: 'BIM-ПРОЕКТИРОВАНИЕ',
    text: 'Информационная модель сооружения в Revit: от концепции до рабочей документации. Выявляем коллизии на стадии проекта, а не монтажа.',
    img: '/images/digital-twin/layer-bim.jpg',
    color: '#3b82f6'
  },
  {
    short: 'Эксплуатация',
    title: 'ЭКСПЛУАТАЦИЯ И УПРАВЛЕНИЕ',
    text: 'Датчики качества воды, расхода и давления в реальном времени. SCADA-интеграция и мобильный дашборд для диспетчерского контроля объектом 24/7.',
    img: '/images/digital-twin/layer-operation.jpg',
    color: '#10b981'
  }
]

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Прозрачность слоя i в зависимости от прогресса скролла (0-й — базовый)
const techLayerOpacity = (i) => {
  const p = techProgress.value
  if (i === 0) return 1
  if (i === 1) return smoothstep(0.22, 0.46, p)
  return smoothstep(0.60, 0.84, p)
}

// Активный этап (для подписи и индикатора)
const techActive = computed(() => {
  const p = techProgress.value
  if (p < 0.36) return 0
  if (p < 0.70) return 1
  return 2
})

const updateTechProgress = () => {
  techRaf = 0
  const el = techSection.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const range = el.offsetHeight - window.innerHeight
  const scrolled = -rect.top
  techProgress.value = range > 0 ? Math.min(1, Math.max(0, scrolled / range)) : 0
}

const onTechScroll = () => {
  if (techRaf) return
  techRaf = requestAnimationFrame(updateTechProgress)
}

const scrollToStage = (i) => {
  const el = techSection.value
  if (!el) return
  const range = el.offsetHeight - window.innerHeight
  const centers = [0.14, 0.52, 0.9]
  const top = el.offsetTop + centers[i] * range
  window.scrollTo({ top, behavior: 'smooth' })
}

// Видеомозаика (стиль relats): clip-path reveal + play/pause по видимости
const mosaicSection = ref(null)
const vmActive = ref(false)
let vmObserver
const mosaicVideos = [
  '/videos/mosaic/DJI_0238.mp4',
  '/videos/mosaic/DJI_0402.mp4',
  '/videos/mosaic/DJI_0470.mp4',
  '/videos/mosaic/DJI_0654.mp4',
  '/videos/mosaic/DJI_0715.mp4',
  '/videos/preview.mp4'
]

// Отзывы — реальные сканы писем (с зумом в лайтбоксе)
const reviewImages = Array.from({ length: 21 }, (_, i) =>
  `/images/reviews/review-${String(i + 1).padStart(2, '0')}.jpg`
)
const reviewOpen = ref(false)
const reviewIndex = ref(0)

const openReview = (i) => {
  reviewIndex.value = i
  reviewOpen.value = true
}
const closeReview = () => { reviewOpen.value = false }
const stepReview = (dir) => {
  const n = reviewImages.length
  reviewIndex.value = (reviewIndex.value + dir + n) % n
}
const onReviewKey = (e) => {
  if (!reviewOpen.value) return
  if (e.key === 'Escape') closeReview()
  else if (e.key === 'ArrowLeft') stepReview(-1)
  else if (e.key === 'ArrowRight') stepReview(1)
}

onMounted(() => {
  startAutoSlide()
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) animateMetrics()
    })
  }, { threshold: 0.5 })
  if (metricsSection.value) observer.observe(metricsSection.value)

  // Блок «Технологии»: слои по прогрессу скролла
  window.addEventListener('scroll', onTechScroll, { passive: true })
  updateTechProgress()

  vmObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const videos = mosaicSection.value?.querySelectorAll('video') || []
      if (entry.isIntersecting) {
        vmActive.value = true
        videos.forEach((v) => v.play().catch(() => {}))
      } else {
        videos.forEach((v) => v.pause())
      }
    })
  }, { threshold: 0.2 })
  if (mosaicSection.value) vmObserver.observe(mosaicSection.value)

  // Блок доверия: измеряем линии и запускаем последовательную анимацию
  nextTick(() => {
    measureTrust()
    requestAnimationFrame(measureTrust)
  })
  const dropImg = trustDrop.value?.querySelector('img')
  if (dropImg && !dropImg.complete) dropImg.addEventListener('load', measureTrust, { once: true })

  trustObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        measureTrust()
        trustActive.value = true
        trustObserver.disconnect()
      }
    })
  }, { threshold: 0.3 })
  if (trustSection.value) trustObserver.observe(trustSection.value)

  if (trustGrid.value && typeof ResizeObserver !== 'undefined') {
    trustRO = new ResizeObserver(() => measureTrust())
    trustRO.observe(trustGrid.value)
  }
  window.addEventListener('resize', measureTrust)
  window.addEventListener('keydown', onReviewKey)
})

onUnmounted(() => {
  if (autoSlideTimer) clearInterval(autoSlideTimer)
  if (slowMoTimer) clearInterval(slowMoTimer)
  observer?.disconnect()
  vmObserver?.disconnect()
  trustObserver?.disconnect()
  trustRO?.disconnect()
  if (techRaf) cancelAnimationFrame(techRaf)
  window.removeEventListener('scroll', onTechScroll)
  window.removeEventListener('resize', measureTrust)
  window.removeEventListener('keydown', onReviewKey)
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

/* Preloader ring animation */
@keyframes preloader-ring {
  0% { transform: scale(0.3); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* Staggered block animations for hero */
.hero-badge {
  animation: heroBlockIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
}

.hero-title {
  animation: heroBlockIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both;
}

.hero-desc {
  animation: heroBlockIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.8s both;
}

.hero-buttons {
  animation: heroBlockIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.6s both;
}

@keyframes heroBlockIn {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
    filter: blur(6px);
  }
  50% {
    filter: blur(0px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}

/* Water ripple text animation */
.water-char {
  display: inline-block;
  animation: waterRise 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  opacity: 0;
}

@keyframes waterRise {
  0% {
    opacity: 0;
    transform: translateY(100%) scale(0.8);
    filter: blur(4px) brightness(1.5);
  }
  50% {
    filter: blur(0px) brightness(1.2);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px) brightness(1);
  }
}

/* Slide transitions */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.water-title {
  animation: waterRise 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
}

/* ===== Блок «Почему нам доверяют лидеры»: капля → линии → точки → блоки ===== */
.trust-grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  align-items: center;
  gap: 2rem;
}

.trust-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}

/* Капля */
.trust-drop {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.82) translateY(14px);
}
.trust-drop img {
  width: 100%;
  height: auto;
  max-height: 560px;
  object-fit: contain;
}
.trust-active .trust-drop {
  animation: trustDropIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.05s both;
}

/* Линии */
.trust-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.trust-active .trust-line {
  animation: trustDrawLine 0.7s ease-out both;
  animation-delay: calc(0.75s + var(--i) * 1.1s);
}

/* Блоки */
.trust-blocks {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
.trust-block {
  position: relative;
  padding-left: 2rem;
}
.trust-node {
  position: absolute;
  left: 0;
  top: 16px;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: #00A8E8;
  box-shadow: 0 0 0 4px rgba(0, 168, 232, 0.18);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}
.trust-active .trust-node {
  animation: trustNodeIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: calc(0.75s + var(--i) * 1.1s + 0.6s);
}
.trust-block-body {
  opacity: 0;
  transform: translateX(14px);
}
.trust-active .trust-block-body {
  animation: trustBodyIn 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: calc(0.75s + var(--i) * 1.1s + 0.82s);
}
.trust-block-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f1115;
  margin-bottom: 0.35rem;
  letter-spacing: 0.01em;
}
.trust-block-text {
  color: rgba(15, 17, 21, 0.68);
  font-size: 0.9rem;
  line-height: 1.55;
}

@keyframes trustDropIn {
  0% { opacity: 0; transform: scale(0.82) translateY(14px); filter: blur(4px); }
  60% { filter: blur(0); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}
@keyframes trustDrawLine {
  to { stroke-dashoffset: 0; }
}
@keyframes trustNodeIn {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes trustBodyIn {
  0% { opacity: 0; transform: translateX(14px); }
  100% { opacity: 1; transform: translateX(0); }
}

@media (max-width: 767px) {
  .trust-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .trust-svg { display: none; }
  .trust-drop img { max-height: 360px; }
}

@media (prefers-reduced-motion: reduce) {
  .trust-drop,
  .trust-block-body,
  .trust-node { opacity: 1; transform: none; animation: none; }
  .trust-node { transform: translate(-50%, -50%); }
  .trust-line { stroke-dashoffset: 0; animation: none; }
}

/* ===== Блок «Технологии»: полноэкранные слои по скроллу ===== */
.tech-scroll {
  position: relative;
  /* высота задаёт длину прокрутки: 3 этапа */
  height: 340vh;
}

.tech-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

/* Полноэкранные изображения-слои */
.tech-media {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tech-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 9vh 4vw 16vh;
  will-change: opacity;
  transition: opacity 0.15s linear;
}

/* Бейдж + заголовок сверху */
.tech-head {
  position: absolute;
  top: clamp(5.5rem, 12vh, 8rem);
  left: 50%;
  transform: translateX(-50%);
  width: min(92%, 60rem);
  text-align: center;
  z-index: 20;
  pointer-events: none;
}
.tech-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  background: rgba(0, 168, 232, 0.1);
  color: #0a58b8;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.9rem;
}
.tech-title {
  font-size: clamp(1.15rem, 2.4vw, 2.1rem);
  font-weight: 700;
  line-height: 1.12;
  color: #0f1115;
  letter-spacing: 0.01em;
}

/* Подписи этапов (кроссфейд) */
.tech-captions {
  position: absolute;
  left: clamp(1.25rem, 5vw, 5rem);
  bottom: clamp(2rem, 8vh, 5rem);
  width: min(90%, 30rem);
  z-index: 20;
}
.tech-caption {
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
}
.tech-caption.is-active {
  opacity: 1;
  transform: translateY(0);
}
.tech-caption-num {
  display: block;
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.6rem;
}
.tech-caption-title {
  font-size: clamp(1.35rem, 2.4vw, 2rem);
  font-weight: 700;
  color: #0f1115;
  margin-bottom: 0.6rem;
  letter-spacing: 0.01em;
}
.tech-caption-text {
  font-size: 0.98rem;
  line-height: 1.55;
  color: rgba(15, 17, 21, 0.66);
}

/* Индикатор этапов справа */
.tech-steps {
  position: absolute;
  right: clamp(1.25rem, 4vw, 4rem);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 20;
}
.tech-step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(15, 17, 21, 0.4);
  font-size: 0.85rem;
  font-weight: 600;
  transition: color 0.3s ease;
}
.tech-step-dot {
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  border: 2px solid rgba(15, 17, 21, 0.25);
  transition: all 0.3s ease;
  flex-shrink: 0;
}
.tech-step.is-active {
  color: #0f1115;
}
.tech-step.is-active .tech-step-dot {
  background: var(--c);
  border-color: var(--c);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 22%, transparent);
}
.tech-step-label {
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.tech-step.is-active .tech-step-label {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .tech-title { font-size: clamp(1.05rem, 3.4vw, 1.6rem); }
  .tech-layer { padding: 14vh 3vw 20vh; }
  .tech-captions {
    left: 50%;
    transform: translateX(-50%);
    width: min(92%, 34rem);
    text-align: center;
  }
  .tech-caption { left: 50%; transform: translate(-50%, 14px); }
  .tech-caption.is-active { transform: translate(-50%, 0); }
  .tech-steps {
    right: 50%;
    top: auto;
    bottom: 1.25rem;
    transform: translateX(50%);
    flex-direction: row;
    gap: 0.75rem;
  }
  .tech-step-label { display: none; }
}

/* ===== Видеомозаика (стиль relats) ===== */
.vm-section {
  position: relative;
  overflow: hidden;
}

.vm-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.vm-tile {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  clip-path: inset(46% 46% 46% 46%);
  transition: clip-path 1.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.vm-active .vm-tile {
  clip-path: inset(0 0 0 0);
}

.vm-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.15);
  transition: transform 1.6s ease;
}

.vm-active .vm-video {
  transform: scale(1);
}

.vm-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.25);
  opacity: 0;
  transition: opacity 1s ease 0.9s;
}

.vm-active .vm-overlay {
  opacity: 1;
}

@media (max-width: 640px) {
  .vm-grid { grid-template-columns: repeat(2, 1fr); }
}

/* ===== Карусель партнёров ===== */
.partners-marquee {
  overflow: hidden;
  width: 100%;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.partners-track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
  animation: partners-scroll 30s linear infinite;
}

.partners-track:hover {
  animation-play-state: paused;
}

.partner-logo {
  width: 180px;
  height: 80px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
}
.partner-logo img {
  max-width: 100%;
  max-height: 56px;
  width: auto;
  height: auto;
  object-fit: contain;
  /* Монохром */
  filter: grayscale(1) contrast(1.05);
  opacity: 0.55;
  transition: filter 0.3s ease, opacity 0.3s ease;
}
.partner-logo:hover img {
  filter: grayscale(1) contrast(1.05);
  opacity: 0.9;
}

@keyframes partners-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ===== Отзывы: карточки + лайтбокс ===== */
.review-card {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  cursor: zoom-in;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.review-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
.review-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
}
.review-zoom {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  background: rgba(10, 88, 184, 0.9);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.review-card:hover .review-zoom {
  opacity: 1;
  transform: scale(1);
}

.review-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(3, 12, 30, 0.92);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1rem;
  animation: reviewFade 0.2s ease-out;
}
.review-lb-img {
  max-width: min(92vw, 900px);
  max-height: 88vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
  cursor: default;
}
.review-lb-btn {
  position: absolute;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 9999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  user-select: none;
}
.review-lb-btn:hover { background: rgba(255, 255, 255, 0.25); }
.review-lb-close {
  top: 1.25rem;
  right: 1.25rem;
  width: 44px;
  height: 44px;
  font-size: 1.25rem;
}
.review-lb-prev,
.review-lb-next {
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  font-size: 2rem;
  line-height: 1;
}
.review-lb-prev { left: 1.25rem; }
.review-lb-next { right: 1.25rem; }
.review-lb-counter {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}
@keyframes reviewFade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (max-width: 640px) {
  .review-lb-prev { left: 0.5rem; }
  .review-lb-next { right: 0.5rem; }
  .review-lb-btn { width: 42px; height: 42px; }
}

@media (prefers-reduced-motion: reduce) {
  .vm-tile, .vm-video, .vm-overlay { transition: none; }
  .partners-track { animation: none; }
}
</style>

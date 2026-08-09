<template>
  <div>

    <!-- ===== HERO: СЛАЙДЕР ===== -->
    <section class="relative h-screen w-full flex items-center overflow-hidden bg-esp-black" style="margin-top: -5rem; padding-top: 5rem;">

      <!-- Video Background.
           poster — первый кадр ролика: рисуется мгновенно, пока грузится видео,
           поэтому чёрный прелоадер больше не нужен — переход кадр-в-кадр незаметен. -->
      <div class="absolute inset-0 z-0">
        <video
          :key="currentSlide"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          :poster="slides[currentSlide].poster"
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
            <!-- Окошко крохотное — тянуть сюда полную компиляцию (53 МБ) незачем -->
            <source src="/videos/hero/compilation-preview.mp4" type="video/mp4" />
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
              <!-- Тот же файл, но с moov-атомом в начале: старт без ожидания полной загрузки -->
              <source src="/videos/hero/compilation.mp4" type="video/mp4" />
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

    <!-- ===== БЛОК 3: БРЕНД-ВЫСКАЗЫВАНИЕ — «Лист» с фотозаливкой + слоган ===== -->
    <BrandStatement />

    <!-- ===== БЛОК 4: ПОЧЕМУ НАМ ДОВЕРЯЮТ ЛИДЕРЫ — split-screen showcase ===== -->
    <section ref="tsSection" class="ts-section bg-white">
      <div ref="tsPin" class="ts-pin">
        <div class="ts-split">
          <!-- Левая панель: кремовая карточка — заголовок сверху, «барабан» по центру, табы снизу -->
          <div class="ts-left">
            <div class="ts-left-card">
              <div class="ts-left-head">
                <span class="ts-eyebrow-dot"></span>
                <span>ПОЧЕМУ НАМ ДОВЕРЯЮТ ЛИДЕРЫ</span>
              </div>
              <div ref="tsWheel" class="ts-wheel">
                <button
                  v-for="(f, i) in trustFactors"
                  :key="i"
                  type="button"
                  class="ts-item"
                  :class="{ 'is-active': activeTrust === i }"
                  @click="goTrust(i)"
                >
                  <span class="ts-item-title font-rounded">{{ f.title }}</span>
                </button>
              </div>
              <div class="ts-tabs">
                <button
                  v-for="(f, i) in trustFactors"
                  :key="i"
                  type="button"
                  class="ts-tab"
                  :class="{ 'is-active': activeTrust === i }"
                  @click="goTrust(i)"
                >{{ f.caption }}</button>
              </div>
            </div>
          </div>

          <!-- Правая колонка: медиа-карточки со сменой + плашка -->
          <div class="ts-right">
            <div ref="tsCards" class="ts-cards">
              <article
                v-for="(f, i) in trustFactors"
                :key="i"
                class="ts-card"
                :class="{ 'is-active': activeTrust === i }"
              >
                <img
                  class="ts-media"
                  :src="f.image"
                  :alt="f.alt"
                  loading="lazy"
                  decoding="async"
                />
                <div class="ts-plaque">
                  <span class="ts-plaque-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                      <path :d="trustIcons[f.icon]" />
                    </svg>
                  </span>
                  <p class="ts-plaque-text">{{ f.text }}</p>
                </div>
              </article>
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
            :style="techLayerStyle(i)"
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
    <!-- ===== БЛОК 5: SCROLL-ГАЛЕРЕЯ (zoom-out центрального видео → сетка 3×3) ===== -->
    <!-- На sticky, а не на пине GSAP. Пин кэшировал start/end и после поздних
         сдвигов вёрстки (прелоадер, догрузка медиа) залипал поверх блока
         технологий, а его распорка оставляла ~1080px пустоты. У sticky длина
         прокрутки — это высота самой секции, поэтому пустоты быть не может,
         а прогресс каждый кадр считается от живого getBoundingClientRect(). -->
    <section ref="galleryPin" class="sg-scroll">
      <div class="sg-sticky">
        <div ref="galleryGrid" class="sg-grid">
          <div
            v-for="(src, i) in galleryVideos"
            :key="i"
            class="sg-tile"
            :class="{ 'sg-tile--center': i === 4 }"
          >
            <video muted loop playsinline preload="metadata" class="sg-video">
              <source :src="src" type="video/mp4" />
            </video>
          </div>
        </div>
        <div ref="galleryOverlay" class="sg-overlay">
          <h2 class="font-rounded text-3xl md:text-5xl lg:text-6xl font-semibold text-white text-center max-w-3xl mx-auto px-6 leading-[1.15] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            Полный цикл решений<br />для очистки воды
          </h2>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 6: ПОЛНОШИРИННАЯ КАРТИНКА ===== -->
    <section class="w-full overflow-hidden bg-white">
      <img src="/Kapla_factory.png" alt="Оборудование ESP" class="w-full h-auto object-contain" />
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
    </section>

    <!-- ===== БЛОК 8: ОТЗЫВЫ ===== -->
    <section class="section-padding text-white" style="background: linear-gradient(180deg, #0a58b8 0%, #063f8f 100%)">
      <div class="container-custom">
        <h2 class="text-center font-rounded text-3xl md:text-4xl font-semibold mb-14 tracking-wide">
          ОТЗЫВЫ
        </h2>
        <!-- Слайдер: горизонтальная лента со скролл-снапом (свайп на тач,
             стрелки на десктопе). Клик по карточке открывает лайтбокс. -->
        <div class="review-slider">
          <button
            type="button"
            class="review-nav review-nav--prev"
            :disabled="!reviewCanPrev"
            aria-label="Предыдущие отзывы"
            @click="slideReviews(-1)"
          >‹</button>

          <div ref="reviewTrack" class="review-track" @scroll.passive="onReviewScroll">
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

          <button
            type="button"
            class="review-nav review-nav--next"
            :disabled="!reviewCanNext"
            aria-label="Следующие отзывы"
            @click="slideReviews(1)"
          >›</button>
        </div>

        <!-- Индикатор прокрутки ленты -->
        <div class="review-progress" aria-hidden="true">
          <span class="review-progress-bar" :style="{ transform: `scaleX(${reviewScrollRatio})` }"></span>
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

    <!-- ===== БЛОК 9: CTA ===== -->
    <section class="cta-section">
      <!-- Фирменная суперграфика «Лист» из брендбука (протяжённая версия) -->
      <BrandPattern class="cta-pattern cta-pattern--top" :height="64" />
      <BrandPattern class="cta-pattern cta-pattern--bottom" :height="64" />

      <div class="container-custom cta-inner">
        <span class="cta-eyebrow">
          <span class="cta-eyebrow-dot"></span>
          Следующий шаг
        </span>

        <h2 class="cta-title font-rounded">
          Готовы создать<br />
          <span class="cta-title-accent">Эталон качества?</span>
        </h2>

        <p class="cta-lead">
          Обсудим ваш проект, подготовим индивидуальное решение и покажем, как синергия
          опыта и технологий приведёт к кристальному результату.
        </p>

        <div class="cta-actions">
          <NuxtLink to="/contacts#contact-form" class="cta-btn cta-btn--primary">
            Обсудить проект
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
          <NuxtLink to="/contacts" class="cta-btn cta-btn--ghost">
            Запросить презентацию
          </NuxtLink>
        </div>

        <!-- Строка доверия: те же цифры, что в блоке «Факторы силы» -->
        <ul class="cta-trust">
          <li v-for="m in metrics" :key="m.label" class="cta-trust-item">
            <span class="cta-trust-value">{{ m.value.toLocaleString('ru-RU') }}{{ m.suffix }}</span>
            <span class="cta-trust-label">{{ m.label }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
    // Ускорение 2.5x запечено в сам файл при перекодировании,
    // поэтому playbackRate здесь больше не нужен.
    video: '/videos/hero/DJI_0402.mp4',
    poster: '/videos/hero/DJI_0402.jpg'
  },
  // ===== СЛАЙДЫ 2-12: Проекты =====
  {
    type: 'project',
    badge: 'Фаниполь | 4700 м³/сут',
    title: 'Молочный завод',
    description: 'Очистные сооружения производственных сточных вод. СПК «Агрокомбинат Снов»',
    link: '/projects/minsk-vodokanal-modernization',
    video: '/videos/hero/DJI_0238.mp4',
    poster: '/videos/hero/DJI_0238.jpg'
  },
  {
    type: 'project',
    badge: 'Минск | 25 000 м³/сут',
    title: 'Модернизация очистных сооружений Минского водоканала',
    description: 'Реконструкция городской станции водоочистки с внедрением BIM-проектирования и IoT-мониторинга.',
    link: '/projects/minsk-vodokanal-modernization',
    video: '/videos/hero/DJI_0470.mp4',
    poster: '/videos/hero/DJI_0470.jpg'
  },
  {
    type: 'project',
    badge: 'Гродненская область | 1 500 м³/сут',
    title: 'Система очистки агрохолдинга «БелАгро»',
    description: 'Биологическая очистка производственных стоков свиноводческого комплекса с замкнутым циклом водопользования.',
    link: '/projects/agrokombinat-snov',
    video: '/videos/hero/DJI_0654.mp4',
    poster: '/videos/hero/DJI_0654.jpg'
  },
  {
    type: 'project',
    badge: 'Брестская область | 600 м³/сут',
    title: 'Очистные сооружения молокозавода «Савушкин»',
    description: 'Многоступенчатая очистка стоков молочного производства с рециркуляцией воды.',
    link: '/projects/savushkin-dairy',
    video: '/videos/hero/DJI_0715.mp4',
    poster: '/videos/hero/DJI_0715.jpg'
  },
  {
    type: 'project',
    badge: 'Минск | 250 м³/ч',
    title: 'Канализационная насосная станция жилого квартала «Маяк»',
    description: 'Автоматизированная насосная станция для жилого комплекса на 2500 квартир.',
    link: '/projects/mayak-residential',
    video: '/videos/hero/hero-water.mp4',
    poster: '/videos/hero/hero-water.jpg'
  },
  {
    type: 'project',
    badge: 'Жлобин | 15 000 м³/сут',
    title: 'Реконструкция очистных сооружений металлургического завода',
    description: 'Лидарное сканирование и создание цифрового двойника для проектирования расширения мощности.',
    link: '/projects/gorodok-reconstruction',
    video: '/videos/hero/DJI_0238.mp4',
    poster: '/videos/hero/DJI_0238.jpg'
  },
  {
    type: 'project',
    badge: 'Петриков | 2 200 м³/сут',
    title: 'Очистные сооружения города Петрикова',
    description: 'Станция биологической очистки коммунальных стоков для КУП «Петриковский райжилкомхоз».',
    link: '/projects/petrikov-bio-station',
    video: '/videos/hero/DJI_0470.mp4',
    poster: '/videos/hero/DJI_0470.jpg'
  },
  {
    type: 'project',
    badge: 'Витебская область | 3 000 м³/сут',
    title: 'Очистные сооружения Витебской бройлерной птицефабрики',
    description: 'Станция полной биологической очистки с денитрификацией и ультрафиолетовым обеззараживанием.',
    link: '/projects/vitebsk-broiler',
    video: '/videos/hero/DJI_0654.mp4',
    poster: '/videos/hero/DJI_0654.jpg'
  },
  {
    type: 'project',
    badge: 'Кричев | 250 м³/сут',
    title: 'Вынос очистных сооружений из прибрежной зоны реки Белянка',
    description: 'Строительство новой станции биологической очистки для Кричевского водоканала.',
    link: '/projects/krichev-vodokanal',
    video: '/videos/hero/DJI_0715.mp4',
    poster: '/videos/hero/DJI_0715.jpg'
  },
  {
    type: 'project',
    badge: 'Столбцовский район | 450 м³/сут',
    title: 'Очистные сооружения и насосная станция в деревне Вишневец',
    description: 'Станция очистки сточных вод и канализационная насосная станция для УП «УКС-Столбцы».',
    link: '/projects/vishnevets-kns',
    video: '/videos/hero/hero-water.mp4',
    poster: '/videos/hero/hero-water.jpg'
  },
  {
    type: 'project',
    badge: 'Минский район | 25 м³/сут',
    title: 'Локальные очистные для пяти жилых домов в деревне Городище',
    description: 'Автономные очистные сооружения канализации «Миниклар ДС 25» для частной жилой застройки.',
    link: '/projects/gorodishche-houses',
    video: '/videos/hero/DJI_0238.mp4',
    poster: '/videos/hero/DJI_0238.jpg'
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
  // Как только текущий ролик готов — тянем следующий в фоне,
  // чтобы переключение слайда не упиралось в сеть.
  prefetchSlide(currentSlide.value + 1)
}

// Прогрев кэша: постер следующего слайда грузим целиком (он лёгкий),
// у видео забираем только начало — этого хватает, чтобы старт был мгновенным.
const prefetched = new Set()
const prefetchSlide = (index) => {
  const slide = slides[index % slides.length]
  if (!slide || prefetched.has(slide.video)) return
  prefetched.add(slide.video)

  const img = new Image()
  img.src = slide.poster

  const v = document.createElement('video')
  v.preload = 'auto'
  v.muted = true
  v.src = slide.video
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
  link: [
    { rel: 'canonical', href: 'https://ecoservisproekt.com/' },
    // Постер первого слайда — первое, что видит посетитель.
    // Грузим его параллельно с HTML, не дожидаясь разбора страницы.
    { rel: 'preload', as: 'image', href: '/videos/hero/DJI_0402.jpg', fetchpriority: 'high' }
  ]
})

const metricsSection = ref(null)
const animated = ref(false)

const metrics = ref([
  { label: 'Реализовано проектов', value: 2000, suffix: '+', display: 0 },
  { label: 'Экспертов в команде', value: 100, suffix: '+', display: 0 },
  { label: 'Лет опыта', value: 28, suffix: '', display: 0 }
])

// ===== Блок «Почему нам доверяют лидеры»: split-screen showcase =====
// Каждому пункту слева соответствует медиа-карточка справа и текст в плашке.
// image — путь к фото карточки. Чтобы заменить снимок, достаточно поменять
// строку здесь: разметка и анимация от источника не зависят.
const trustFactors = [
  {
    title: 'ИНЖИНИРИНГ',
    caption: 'Проектирование',
    image: '/images/lidaresp.jpg',
    alt: 'Инженер ESP с лидарным сканером на промышленной площадке',
    icon: 'compass',
    text: 'Проектируем будущее с точностью до миллиметра.'
  },
  {
    title: 'РЕШЕНИЯ НА БАЗЕ USBF',
    caption: 'Технология USBF',
    image: '/images/view3.jpg',
    alt: 'Технологическая схема процессного оборудования очистки',
    icon: 'layers',
    text: 'Внедряем технологию USBF под задачи конкретного объекта, а не по типовому шаблону. Опираемся на 28 лет практики глубокой биологической очистки.'
  },
  {
    title: 'ПРОИЗВОДСТВО',
    caption: 'Собственный цех',
    image: '/images/production-shop.png',
    alt: 'Рабочий на участке раскроя металла в собственном цехе ESP',
    icon: 'factory',
    text: 'Точность в каждой детали. Качество в каждом узле.'
  },
  {
    title: 'ТЕСТИРОВАНИЕ',
    caption: 'Контроль качества',
    image: '/images/view1.jpg',
    alt: 'Чистая река в лесу — результат глубокой биологической очистки',
    icon: 'check',
    text: 'Проверяем надёжность на каждом этапе. 100% результата и полная прозрачность всех процессов — наш внутренний стандарт.'
  }
]

// Иконки плашки (stroke-path, наследуют currentColor)
const trustIcons = {
  compass: 'M12 3a9 9 0 100 18 9 9 0 000-18zM14.8 9.2l-1.6 4-4 1.6 1.6-4 4-1.6z',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  factory: 'M3 21V9l6 4V9l6 4V6l6 3v12H3zM7 17v0M12 17v0M17 17v0',
  check: 'M4 12l5 5L20 6'
}

const tsSection = ref(null)
const tsPin = ref(null)
const tsWheel = ref(null)
const tsCards = ref(null)
const activeTrust = ref(0)
let tsST = null

// ── Настраиваемые параметры анимации ─────────────────────────────
const TS_SCROLL_PER = 90    // % высоты экрана на один этап (длина пина = (N−1) × этот %)
const TS_STEP_RATIO = 1.5   // шаг «барабана» = высота активного пункта × этот коэффициент
const TS_SIDE_SCALE = 0.58  // масштаб соседних (prev/next) пунктов
const TS_SIDE_OPACITY = 0.3 // прозрачность соседних пунктов (в пределах 0.2–0.35)
// ─────────────────────────────────────────────────────────────────

// Шаг барабана считаем от реальной высоты пункта: при clamp-типографике он
// меняется вместе с шириной экрана, поэтому кэш сбрасываем на каждом refresh.
let tsStep = 0
const measureTrustStep = () => {
  const first = tsWheel.value?.children?.[0]
  // offsetHeight, а не getBoundingClientRect: он не учитывает scale, который мы
  // же и навесили — иначе шаг схлопывался бы с каждым пересчётом
  tsStep = first ? first.offsetHeight * TS_STEP_RATIO : 0
}

// Раскладка «барабана» и карточек по дробной позиции pos (0..N-1)
const renderTrust = (pos) => {
  const items = tsWheel.value?.children
  const cards = tsCards.value?.children
  if (items) {
    if (!tsStep) measureTrustStep()
    for (let i = 0; i < items.length; i++) {
      const d = i - pos
      const ad = Math.abs(d)
      // t: 0 у активного, 1 у соседа — по нему интерполируем масштаб и прозрачность
      const t = Math.min(ad, 1)
      const s = 1 - (1 - TS_SIDE_SCALE) * t
      // в пределах ±1 держим соседей видимыми, дальше — плавно гасим к нулю
      const o = ad <= 1
        ? 1 - (1 - TS_SIDE_OPACITY) * t
        : Math.max(0, TS_SIDE_OPACITY * (2 - ad))
      // сдвиг сжимаем по мере удаления: даёт ощущение вращающегося барабана
      const y = Math.sign(d) * (t + (ad - t) * 0.6) * tsStep
      items[i].style.transform = `translate3d(0, calc(-50% + ${y}px), 0) scale(${s})`
      items[i].style.opacity = String(o)
      items[i].style.zIndex = String(ad < 0.5 ? 2 : 1)
      items[i].style.pointerEvents = ad < 0.5 ? 'auto' : 'none'
    }
  }
  if (cards) {
    for (let i = 0; i < cards.length; i++) {
      const d = i - pos
      // старая карточка уходит вверх, новая выезжает снизу
      cards[i].style.transform = `translateY(${d * 100}%)`
      cards[i].style.zIndex = String(50 - Math.abs(Math.round(d * 10)))
    }
  }
  activeTrust.value = Math.round(pos)
}

// Клик по пункту/табу — доскроллить до нужной позиции (десктоп) или переключить (мобайл)
const goTrust = (i) => {
  const N = trustFactors.length
  if (tsST) {
    const y = tsST.start + (i / (N - 1)) * (tsST.end - tsST.start)
    window.scrollTo({ top: y, behavior: 'smooth' })
  } else {
    activeTrust.value = i
  }
}

let tsMM = null
const initTrust = () => {
  const pin = tsPin.value
  if (!pin) return
  gsap.registerPlugin(ScrollTrigger)
  const N = trustFactors.length

  // matchMedia сам включает/выключает эффект и переоценивает медиа-запрос при
  // ресайзе — поэтому десктоп-режим стартует корректно, даже если на момент
  // mount вьюпорт ещё не измерен, и переключается на мобайл при сужении.
  tsMM = gsap.matchMedia()
  tsMM.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    pin.classList.add('is-animated')
    renderTrust(0)

    tsST = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      // длина пина = (кол-во этапов − 1) × шаг: каждый этап получает равный отрезок скролла
      end: `+=${(N - 1) * TS_SCROLL_PER}%`,
      pin: true,
      anticipatePin: 1,
      // «прилипание» к ближайшему этапу — колесо не проскакивает табы, секция
      // листается по одному шагу и отпускает страницу только после последнего
      snap: {
        snapTo: 1 / (N - 1),
        duration: { min: 0.2, max: 0.6 },
        delay: 0.05,
        ease: 'power1.inOut'
      },
      // анимация привязана к скроллу 1:1 (эквивалент scrub: true для standalone-триггера)
      onUpdate: (self) => renderTrust(self.progress * (N - 1)),
      onRefresh: (self) => {
        measureTrustStep()
        renderTrust(self.progress * (N - 1))
      }
    })

    // Пересчёт позиций пина после полной загрузки (интро-прелоадер, поздние медиа)
    const refresh = () => ScrollTrigger.refresh()
    if (document.readyState === 'complete') requestAnimationFrame(refresh)
    else window.addEventListener('load', refresh, { once: true })
    setTimeout(refresh, 1500)

    // Откат к мобайл-раскладке, когда медиа-запрос перестаёт совпадать
    return () => {
      tsST?.kill()
      tsST = null
      tsStep = 0
      pin.classList.remove('is-animated')
      const items = tsWheel.value?.children || []
      const cards = tsCards.value?.children || []
      for (const el of items) el.style.cssText = ''
      for (const el of cards) el.style.cssText = ''
      activeTrust.value = 0
    }
  })
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

// ── Раскадровка этапов ───────────────────────────────────────────
// Важно: нижний слой НИКОГДА не гасится. Картинки лежат стопкой, и новая
// проявляется поверх предыдущей, полностью её накрывая. Если гасить нижний
// синхронно с проявлением верхнего, между ними просвечивает белый фон
// секции и на середине перехода кадр вымывается почти в белое.
const TECH_STOPS = [0.36, 0.70] // границы между этапами 1↔2 и 2↔3
const TECH_FADE = 0.09          // ширина перехода (в долях прогресса)
// ─────────────────────────────────────────────────────────────────

// Насколько слой i проявлен поверх предыдущих: 0 — ещё не вступил,
// 1 — полностью накрыл нижние. Первый слой — база, он виден всегда.
const techLayerAmount = (i) => {
  if (i === 0) return 1
  const h = TECH_FADE / 2
  return smoothstep(TECH_STOPS[i - 1] - h, TECH_STOPS[i - 1] + h, techProgress.value)
}

// Слой: прозрачность + лёгкий наезд приходящей картинки (база не масштабируется).
// zIndex по порядку — тот, что вступает позже, всегда сверху.
const techLayerStyle = (i) => {
  const a = techLayerAmount(i)
  return {
    opacity: a,
    transform: i === 0 ? 'none' : `scale(${(1.03 - 0.03 * a).toFixed(4)})`,
    zIndex: i,
    pointerEvents: 'none'
  }
}

// Активный этап (для подписи и индикатора) — переключаем на середине кроссфейда
const techActive = computed(() => {
  const p = techProgress.value
  if (p < TECH_STOPS[0]) return 0
  if (p < TECH_STOPS[1]) return 1
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
  // середины «полок», где этап виден один и целиком
  const centers = [TECH_STOPS[0] / 2, (TECH_STOPS[0] + TECH_STOPS[1]) / 2, (1 + TECH_STOPS[1]) / 2]
  const top = el.offsetTop + centers[i] * range
  window.scrollTo({ top, behavior: 'smooth' })
}

// Scroll-галерея: центральное видео на весь экран → zoom-out → сетка 3×3
const galleryPin = ref(null)
const galleryGrid = ref(null)
const galleryOverlay = ref(null)
let galleryObserver = null
let galleryRaf = 0
// 9 плиток: индекс 4 — центральная (герой). Порядок в CSS-grid слева-направо, сверху-вниз.
const galleryVideos = [
  '/videos/mosaic/DJI_0238.mp4', '/videos/mosaic/DJI_0402.mp4', '/videos/mosaic/DJI_0470.mp4',
  '/videos/mosaic/IMG_1374.mp4', '/videos/mosaic/hero-water.mp4', '/videos/mosaic/DJI_0654.mp4',
  '/videos/mosaic/DJI_0715.mp4', '/videos/mosaic/IMG_1362.mp4', '/videos/mosaic/IMG_1357.mp4'
]

// ── Настраиваемые параметры эффекта ──────────────────────────────
const SG_COVER_MARGIN = 1.06 // запас к стартовому зуму: на старте центральная
                             // плитка должна уходить за края экрана, иначе видны
                             // её скруглённые углы и полоски соседей — «рамка»
const SG_ZOOM_END = 0.86     // прогресс, на котором сетка уже в масштабе 1:
                             // остаток хода — «полка», где сетку видно целиком
                             // до того, как секция отпустит скролл
const SG_NEIGHBOR_END = 0.45 // к этому прогрессу соседние плитки полностью проявлены
const SG_OVERLAY_END = 0.34  // к этому прогрессу заголовок уже ушёл
// ─────────────────────────────────────────────────────────────────

// Стартовый зум считаем от реального размера плитки, а не константой: плитка
// это (100vw − отступы)/3, поэтому нужный масштаб зависит от вьюпорта. Берём
// максимум по осям — как object-fit: cover, чтобы накрыть экран целиком.
let sgStartScale = 3.2
const measureGalleryScale = () => {
  const centre = galleryGrid.value?.children?.[4]
  if (!centre?.offsetWidth || !centre?.offsetHeight) return
  sgStartScale = Math.max(
    window.innerWidth / centre.offsetWidth,
    window.innerHeight / centre.offsetHeight
  ) * SG_COVER_MARGIN
}

// Прогресс считаем от живого rect — он не может «устареть» после сдвигов вёрстки.
const updateGallery = () => {
  galleryRaf = 0
  const sec = galleryPin.value
  const grid = galleryGrid.value
  if (!sec || !grid) return

  const range = sec.offsetHeight - window.innerHeight
  const p = range > 0
    ? Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / range))
    : 0

  // Зум-аут: 1:1 к скроллу, с лёгким замедлением к концу
  const z = smoothstep(0, SG_ZOOM_END, p)
  grid.style.transform = `scale(${(sgStartScale + (1 - sgStartScale) * z).toFixed(4)})`

  // Соседние плитки: от 0 (на старте виден только центральный кадр, без рамки)
  // до 1. Появляются сразу с началом прокрутки, вместе с отъездом зума.
  const n = smoothstep(0, SG_NEIGHBOR_END, p)
  const tiles = grid.children
  for (let i = 0; i < tiles.length; i++) {
    if (i !== 4) tiles[i].style.opacity = String(n)
  }

  // Заголовок уходит в первой трети
  const overlay = galleryOverlay.value
  if (overlay) {
    const o = 1 - smoothstep(0, SG_OVERLAY_END, p)
    overlay.style.opacity = String(o)
    overlay.style.transform = `scale(${(0.82 + 0.18 * o).toFixed(4)})`
  }
}

const onGalleryScroll = () => {
  if (galleryRaf) return
  galleryRaf = requestAnimationFrame(updateGallery)
}

// При ресайзе меняется и размер плитки, и нужный стартовый зум
const onGalleryResize = () => {
  measureGalleryScale()
  onGalleryScroll()
}

// Отзывы — реальные сканы писем (с зумом в лайтбоксе)
const reviewImages = Array.from({ length: 21 }, (_, i) =>
  `/images/reviews/review-${String(i + 1).padStart(2, '0')}.jpg`
)
const reviewOpen = ref(false)
const reviewIndex = ref(0)

// ── Слайдер отзывов ──────────────────────────────────────────────
const reviewTrack = ref(null)
const reviewScrollLeft = ref(0)
const reviewScrollMax = ref(0)

// Доля прокрутки ленты (0..1) — питает полоску-индикатор
const reviewScrollRatio = computed(() =>
  reviewScrollMax.value > 0 ? Math.min(1, reviewScrollLeft.value / reviewScrollMax.value) : 0
)
// Порог в 4px: у скролла бывает дробный остаток, из-за которого стрелка
// никогда не гаснет на самом краю ленты
const reviewCanPrev = computed(() => reviewScrollLeft.value > 4)
const reviewCanNext = computed(() => reviewScrollLeft.value < reviewScrollMax.value - 4)

const syncReviewScroll = () => {
  const el = reviewTrack.value
  if (!el) return
  reviewScrollLeft.value = el.scrollLeft
  reviewScrollMax.value = el.scrollWidth - el.clientWidth
}
const onReviewScroll = () => syncReviewScroll()

// Листаем на «страницу» — целое число карточек, влезающих в видимую область
const slideReviews = (dir) => {
  const el = reviewTrack.value
  if (!el) return
  const card = el.querySelector('.review-card')
  const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth
  const perPage = Math.max(1, Math.floor(el.clientWidth / step))
  el.scrollBy({ left: dir * step * perPage, behavior: 'smooth' })
}

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

  // Scroll-галерея: zoom-out по прогрессу скролла (sticky, без пина)
  window.addEventListener('scroll', onGalleryScroll, { passive: true })
  window.addEventListener('resize', onGalleryResize, { passive: true })
  measureGalleryScale()
  updateGallery()

  // Стартовое состояние стрелок/индикатора ленты отзывов
  syncReviewScroll()
  window.addEventListener('resize', syncReviewScroll, { passive: true })
  // Проигрываем видео галереи только пока блок в зоне видимости (экономия ресурсов)
  galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const videos = galleryPin.value?.querySelectorAll('video') || []
      if (entry.isIntersecting) videos.forEach((v) => v.play().catch(() => {}))
      else videos.forEach((v) => v.pause())
    })
  }, { threshold: 0 })
  if (galleryPin.value) galleryObserver.observe(galleryPin.value)

  // Блок «Почему нам доверяют лидеры»: split-screen showcase
  initTrust()

  window.addEventListener('keydown', onReviewKey)
})

onUnmounted(() => {
  if (autoSlideTimer) clearInterval(autoSlideTimer)
  if (slowMoTimer) clearInterval(slowMoTimer)
  observer?.disconnect()
  galleryObserver?.disconnect()
  tsST?.kill()
  tsMM?.kill()
  if (techRaf) cancelAnimationFrame(techRaf)
  if (galleryRaf) cancelAnimationFrame(galleryRaf)
  window.removeEventListener('scroll', onTechScroll)
  window.removeEventListener('scroll', onGalleryScroll)
  window.removeEventListener('resize', onGalleryResize)
  window.removeEventListener('resize', syncReviewScroll)
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

/* ===== Блок 3 «Почему нам доверяют лидеры»: split-screen showcase ===== */
.ts-section { position: relative; background: #eef0f3; }
.ts-pin { position: relative; }

.ts-eyebrow-dot {
  flex: 0 0 auto;
  width: 9px; height: 9px;
  border-radius: 9999px;
  background: #00A8E8;
}

/* — Базовая (мобильная) раскладка — */
.ts-split {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.25rem 1rem 2.75rem;
}
.ts-left { display: flex; flex-direction: column; }
.ts-left-card { display: flex; flex-direction: column; }
.ts-left-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  line-height: 1.25;
  letter-spacing: 0.12em;
  font-weight: 800;
  text-transform: uppercase;
  color: #0f1115;
  margin-bottom: 1.25rem;
}
.ts-wheel { display: none; }         /* «барабан» — только на десктопе */

.ts-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.ts-tabs::-webkit-scrollbar { display: none; }
.ts-tab {
  flex: 0 0 auto;
  padding: 0.5rem 0.95rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  color: rgba(15, 17, 21, 0.6);
  background: #ffffff;
  transition: color 0.25s ease, background 0.25s ease;
}
.ts-tab.is-active { color: #fff; background: #00A8E8; }

.ts-cards {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 28px;
  overflow: hidden;
}
.ts-card {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
}
.ts-card.is-active { opacity: 1; transform: none; pointer-events: auto; }
.ts-media {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  background: #0a0a0a;
  /* Лёгкий наезд на активной карточке — вместо движения, которое давало видео */
  transform: scale(1.04);
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.ts-card.is-active .ts-media { transform: scale(1); }
/* Стеклянная плашка поверх медиа */
.ts-plaque {
  position: absolute;
  right: 14px;
  bottom: 14px;
  width: max-content;
  max-width: min(340px, calc(100% - 28px));
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}
/* Иконка в круглой подложке слева */
.ts-plaque-icon {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #ffffff;
}
.ts-plaque-icon svg { width: 18px; height: 18px; display: block; }
.ts-plaque-text {
  font-size: 13px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

/* — Десктоп: закреплённый split-screen из двух панелей-карточек — */
@media (min-width: 768px) {
  .ts-pin.is-animated {
    height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .ts-pin.is-animated .ts-split {
    flex: 1;
    flex-direction: row;
    /* stretch: высоту ряда задаёт медиа-карточка со своей пропорцией,
       левая панель подстраивается под неё — без «сплюснутости» */
    align-items: stretch;
    gap: clamp(1rem, 1.6vw, 1.5rem);
    padding: 0 clamp(1.25rem, 2.2vw, 2.5rem);
    max-width: none;
    width: 100%;
    margin: 0;
  }
  .ts-pin.is-animated .ts-left { flex: 1 1 0; min-width: 0; }
  .ts-pin.is-animated .ts-right { flex: 1 1 0; min-width: 0; }

  /* Левая панель — кремовая карточка вровень с медиа-карточкой */
  .ts-pin.is-animated .ts-left-card {
    height: 100%;
    background: #f2f0ea;
    border-radius: 28px;
    padding: clamp(1.75rem, 2.6vw, 3rem);
    box-shadow: 0 30px 70px -40px rgba(15, 17, 21, 0.35);
  }
  .ts-pin.is-animated .ts-left-head {
    justify-content: center;
    font-size: clamp(1rem, 1.15vw, 1.25rem);
    letter-spacing: 0.16em;
    color: rgba(15, 17, 21, 0.85);
    text-align: center;
    margin-bottom: 0;
  }

  /* «Барабан» пунктов — крупный активный по центру, prev/next приглушены */
  .ts-pin.is-animated .ts-wheel {
    display: block;
    position: relative;
    flex: 1;
    width: 100%;
    overflow: hidden;
    /* мягкое затухание к краям — усиливает эффект вращающегося барабана */
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%);
  }
  .ts-pin.is-animated .ts-item {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    transform-origin: center center;
    will-change: transform, opacity;
  }
  .ts-item-title {
    font-size: clamp(2.2rem, 3.6vw, 3.6rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.01em;
    color: #0f1115;
    text-wrap: balance;
  }

  /* Табы — снизу внутри карточки, растянуты по ширине */
  .ts-pin.is-animated .ts-tabs {
    justify-content: space-between;
    gap: 0.75rem;
    overflow: visible;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(15, 17, 21, 0.1);
  }
  .ts-pin.is-animated .ts-tab {
    padding: 0;
    background: transparent;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(15, 17, 21, 0.4);
    white-space: nowrap;
  }
  .ts-pin.is-animated .ts-tab.is-active { color: #00A8E8; background: transparent; }

  /* Правая панель — медиа-карточка, вертикальный слайд (JS управляет transform).
     Пропорция 4:3 + потолок по высоте экрана: карточка остаётся объёмной,
     а её высота задаёт высоту всего ряда (align-items: stretch выше). */
  .ts-pin.is-animated .ts-cards {
    /* 1:1 (а не 4:3): при ширине в половину экрана landscape-пропорция
       оставляла карточку низкой — squarish заполняет высоту экрана */
    aspect-ratio: 1 / 1;
    width: 100%;
    height: auto;
    max-height: 84vh;
    border-radius: 28px;
    box-shadow: 0 30px 70px -40px rgba(15, 17, 21, 0.45);
  }
  .ts-pin.is-animated .ts-card {
    opacity: 1 !important;
    transform: translateY(100%);
    transition: none;
    border-radius: 28px;
    pointer-events: auto;
    will-change: transform;
  }
  .ts-plaque {
    right: 20px;
    bottom: 20px;
    max-width: min(340px, calc(100% - 40px));
    padding: 16px 20px;
  }
  .ts-plaque-icon { width: 40px; height: 40px; }
  .ts-plaque-icon svg { width: 20px; height: 20px; }
  .ts-plaque-text { font-size: 14px; }
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
  /* cover, а не contain: иллюстрации 1400×933 нарисованы на белом фоне, и при
     contain с отступами они ужимались до ~810×540 в белой секции 1280×720 —
     больше половины блока уходило в пустоту. При cover кадр занимает всю
     ширину, а обрезаются только собственные белые поля картинки. */
  object-fit: cover;
  object-position: center;
  will-change: opacity, transform;
  transition: opacity 0.15s linear, transform 0.15s linear;
}

/* Бейдж + заголовок сверху */
/* Светлые подложки сверху и снизу: картинка теперь во весь кадр, и без них
   заголовок и подписи ложатся прямо на иллюстрацию и теряют читаемость. */
.tech-sticky::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background:
    linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.86) 14%, rgba(255, 255, 255, 0) 32%),
    linear-gradient(0deg, #fff 0%, rgba(255, 255, 255, 0.82) 12%, rgba(255, 255, 255, 0) 34%);
}

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
  /* коротко: подписи лежат друг на друге, и на длинном кроссфейде два разных
     текста читаются наложенными. 0.22s — переход ещё заметен, но не «двоит». */
  transition: opacity 0.22s ease, transform 0.22s ease;
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
/* ===== Scroll-галерея: zoom-out центрального видео → сетка 3×3 ===== */
.sg-scroll {
  position: relative;
  width: 100%;
  /* высота = длина прокрутки эффекта; 100vh экрана + 150vh хода */
  height: 250vh;
  background: #0a0a0a;
}

.sg-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

.sg-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
  will-change: transform;
  /* фолбэк до первого кадра JS; точное значение считает measureGalleryScale */
  transform: scale(3.2);
  transform-origin: center center;
  backface-visibility: hidden;
}

.sg-tile {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #0a0a0a;
}
.sg-tile:not(.sg-tile--center) { opacity: 0; }

.sg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sg-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 5;
  will-change: opacity, transform;
}

@media (max-width: 640px) {
  .sg-grid { gap: 6px; padding: 6px; }
  .sg-tile { border-radius: 12px; }
}

/* Без анимации: сетка сразу целиком, секция не растягивает прокрутку */
@media (prefers-reduced-motion: reduce) {
  .sg-scroll { height: 100vh; }
  .sg-grid { transform: scale(1) !important; }
  .sg-tile { opacity: 1 !important; }
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

/* ===== Отзывы: слайдер + карточки + лайтбокс ===== */
.review-slider {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Лента: горизонтальный скролл со снапом — свайп на тач-устройствах,
   стрелки и колесо/трекпад на десктопе */
.review-track {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 0;
  padding: 0.5rem 0.25rem 1.25rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}
.review-track::-webkit-scrollbar { display: none; }

/* Стрелки листания */
.review-nav {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  line-height: 1;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  transition: background 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
}
.review-nav:hover:not(:disabled) { background: rgba(255, 255, 255, 0.24); transform: scale(1.06); }
.review-nav:disabled { opacity: 0.25; cursor: default; }

/* Полоска прогресса ленты */
.review-progress {
  margin: 0.25rem auto 0;
  width: min(220px, 60%);
  height: 3px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}
.review-progress-bar {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: #fff;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.15s linear;
}

.review-card {
  position: relative;
  display: block;
  /* В ленте карточка имеет фиксированную ширину, а не тянется по гриду */
  flex: 0 0 auto;
  width: clamp(150px, 20vw, 230px);
  scroll-snap-align: start;
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

/* ===== Финальный CTA ===== */
.cta-section {
  position: relative;
  overflow: hidden;
  padding: clamp(4rem, 10vh, 7rem) 0 clamp(4rem, 9vh, 6.5rem);
  color: #fff;
  background:
    radial-gradient(120% 80% at 50% 0%, rgba(0, 168, 232, 0.28) 0%, transparent 60%),
    linear-gradient(135deg, #002366 0%, #000f33 100%);
}

/* Фирменная лента «Листа»: по одной полосе сверху и снизу, приглушённо —
   графика поддерживает блок, но не спорит с заголовком и кнопками */
.cta-pattern {
  position: absolute;
  left: 0;
  right: 0;
  color: #ffffff;
  opacity: 0.09;
}
.cta-pattern--top { top: 0; }
.cta-pattern--bottom { bottom: 0; transform: rotate(180deg); }

.cta-inner {
  position: relative;
  z-index: 1;
  max-width: 56rem;
  text-align: center;
}

.cta-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.95rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}
.cta-eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: #00a8e8;
  box-shadow: 0 0 0 4px rgba(0, 168, 232, 0.25);
}

.cta-title {
  margin-top: clamp(1.1rem, 3vh, 1.8rem);
  font-size: clamp(2rem, 5.2vw, 3.75rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.02em;
  text-wrap: balance;
}
.cta-title-accent {
  background: linear-gradient(100deg, #7fd8ff 0%, #00a8e8 55%, #4ce0b3 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cta-lead {
  margin: clamp(0.9rem, 2.4vh, 1.4rem) auto 0;
  max-width: 40rem;
  font-size: clamp(0.95rem, 1.15vw, 1.15rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
}

/* Иерархия: одна главная кнопка + вторая призрачная */
.cta-actions {
  margin-top: clamp(1.6rem, 4vh, 2.5rem);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
}
.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-size: 0.98rem;
  font-weight: 600;
  white-space: nowrap;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease;
}
.cta-btn svg { width: 18px; height: 18px; transition: transform 0.25s ease; }
.cta-btn--primary {
  background: linear-gradient(100deg, #00a8e8, #0086ba);
  color: #fff;
  box-shadow: 0 14px 34px -12px rgba(0, 168, 232, 0.75);
}
.cta-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px -12px rgba(0, 168, 232, 0.9);
}
.cta-btn--primary:hover svg { transform: translateX(3px); }
.cta-btn--ghost {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
}
.cta-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* Строка доверия */
.cta-trust {
  margin: clamp(2.2rem, 5vh, 3.2rem) auto 0;
  padding-top: clamp(1.4rem, 3vh, 2rem);
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  list-style: none;
  max-width: 44rem;
}
.cta-trust-value {
  display: block;
  font-size: clamp(1.4rem, 2.6vw, 2.1rem);
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  color: #fff;
}
.cta-trust-label {
  display: block;
  margin-top: 0.3rem;
  font-size: clamp(0.68rem, 0.85vw, 0.8rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 640px) {
  .cta-btn { width: 100%; }
  .cta-trust { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; }
}


/* На тач-экранах листаем свайпом — стрелки только занимают место */
@media (max-width: 767px) {
  .review-nav { display: none; }
  .review-track { gap: 1rem; scroll-padding-left: 0.25rem; }
}
@media (max-width: 640px) {
  .review-lb-prev { left: 0.5rem; }
  .review-lb-next { right: 0.5rem; }
  .review-lb-btn { width: 42px; height: 42px; }
}

@media (prefers-reduced-motion: reduce) {
  .partners-track { animation: none; }
}
</style>

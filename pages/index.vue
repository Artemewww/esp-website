<template>
  <div>

    <!-- ===== HERO: СЛАЙДЕР ===== -->
    <section data-header="dark" class="relative h-screen w-full flex items-center overflow-hidden bg-esp-black" style="margin-top: -5rem; padding-top: 5rem;">

      <!-- Video Background.
           poster — первый кадр ролика: рисуется мгновенно, пока грузится видео,
           поэтому чёрный прелоадер больше не нужен — переход кадр-в-кадр незаметен. -->
      <div class="absolute inset-0 z-0">
        <video
          :key="currentSlide"
          autoplay
          muted
          :loop="!slides[currentSlide].playOnce"
          playsinline
          preload="auto"
          :poster="slides[currentSlide].poster"
          class="w-full h-full object-cover hero-video"
          :ref="(el) => { if (el) handleVideoLoad(el) }"
          @playing="onVideoPlaying"
          @error="onVideoError"
          @timeupdate="onTimeUpdate"
          @ended="onVideoEnded"
        >
          <source :src="slides[currentSlide].video" type="video/mp4" />
        </video>
        <!-- Затемнение держит читаемость белого текста, но прижато к левому
             краю: раньше плашка на 85/50% гасила весь кадр, и ролик выглядел
             тёмным даже там, где текста нет. -->
        <div class="absolute inset-0 hero-scrim"></div>

        <!-- Порядок строгий: пока ролик не пошёл — экран закрыт подложкой с
             облаком точек; кадр поехал — точки собираются в «Лист» и уходят;
             и только после этого выходит текст. -->
        <Transition name="hero-load">
          <div v-if="!contentReady" class="hero-cover">
            <HomeHeroLoader :done="videoPlaying" @finished="contentReady = true" />
          </div>
        </Transition>
      </div>

      <!-- Content: всегда прижато к левому краю, как в портфолио.
           Показываем только когда ролик отдал первый кадр — иначе текст
           выезжает поверх индикатора загрузки. -->
      <div class="relative z-10 w-full text-left hero-content" :class="{ 'is-ready': contentReady }">
        <div :key="'content-' + currentSlide" class="max-w-3xl px-6 md:px-12 lg:px-24">
          <!-- Badge with staggered animation -->
          <div class="hero-badge mb-6">
            <span class="inline-flex items-center gap-2 px-4 py-2 bg-esp-black/60 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/30">
              <FlagBy v-if="slides[currentSlide].type === 'hero'" class="text-base" />
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
      <div class="absolute bottom-8 right-6 z-10 group cursor-pointer hero-preview-widget" :class="{ 'is-hide-on-mob': currentSlide === 0 }" @click="openVideoModal">
        <div class="relative w-28 h-16 md:w-40 md:h-[90px] rounded-xl overflow-hidden border-2 border-white/30 hover:border-esp-lidar/70 transition-all duration-500 shadow-2xl hover:shadow-esp-lidar/30 hover:scale-105">
          <video
            autoplay
            muted
            loop
            playsinline
            class="w-full h-full object-cover"
          >
            <!-- Окошко крохотное: здесь короткий немой луп, а не весь ролик -->
            <source src="/videos/hero/ESP_preview_200826.mp4" type="video/mp4" />
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
        <div class="relative w-[95vw] h-[90vh] hero-modal-frame flex items-center justify-center">
          <button @click="closeVideoModal" class="absolute top-4 right-4 z-10 text-white/80 hover:text-white flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200" title="Закрыть">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div class="w-full h-full bg-black rounded-xl overflow-hidden relative hero-modal-media">
            <!-- Прелоадер: крутится, пока кадр модального ролика ещё грузится -->
            <div v-if="!modalVideoReady" class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/60">
              <div class="w-12 h-12 rounded-full border-2 border-esp-lidar/30 border-t-esp-lidar animate-spin"></div>
              <span class="text-white/70 text-sm tracking-wide">Загрузка ролика…</span>
            </div>
            <video
              autoplay
              controls
              playsinline
              @playing="onModalReady"
              @loadeddata="onModalReady"
              @error="onModalReady"
              class="w-full h-full object-contain hero-modal-video"
            >
              <!-- Имиджевый ролик 2026 (02.09) в 1080p. moov в начале и частые
                   ключевые кадры: воспроизведение стартует до полной загрузки. -->
              <source src="/videos/hero/ESP_final_02092026_1080.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 hero-pagination" :class="{ 'is-hide-on-mob': currentSlide === 0 }">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          class="transition-all duration-300 rounded-full"
          :class="[
            index === currentSlide
              ? 'w-3 h-3 bg-white shadow-lg shadow-white/50 scale-125'
              : 'w-2.5 h-2.5 bg-transparent border-2 border-white/70 hover:bg-white/30 hover:scale-110'
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

    <!-- ===== БЛОК 4: ПОЧЕМУ НАМ ДОВЕРЯЮТ ЛИДЕРЫ - full-screen steps ===== -->
    <section ref="tsSection" class="ts-section bg-black">
      <div ref="tsPin" class="ts-pin">
        <div class="ts-media-layer">
          <!-- Шаг с панелями обходится без фотографии: кадр не загружаем вовсе. -->
          <template v-for="(f, i) in trustFactors" :key="i">
            <img
              v-if="!f.panels"
              class="ts-bg-img"
              :class="{ 'is-active': activeTrust === i }"
              :src="f.image"
              :alt="f.alt"
              loading="lazy"
              decoding="async"
              @load="trustLoaded[i] = true"
              @error="trustLoaded[i] = true"
            />
          </template>
        </div>
        <div class="ts-overlay"></div>

        <!-- Пока кадр шага не пришёл, экран не должен быть пустым чёрным
             прямоугольником: держим ту же метку загрузки, что и на первом экране. -->
        <Transition name="hero-load">
          <div v-if="!trustReady" class="ts-cover">
            <HomeHeroLoader :done="false" />
          </div>
        </Transition>

        <!-- Экраны панелей оператора: живут только у своего шага и въезжают
             по очереди, чтобы читались как ряд включающихся мониторов. -->
        <div
          v-if="trustFactors[activeTrust].panels"
          :key="'panels-' + activeTrust"
          class="ts-panels"
        >
          <figure
            v-for="(p, i) in trustFactors[activeTrust].panels"
            :key="p.src"
            class="ts-panel"
            :style="{ animationDelay: 0.08 * i + 0.1 + 's' }"
          >
            <img :src="p.src" :alt="'Экран панели оператора ' + p.label" loading="lazy" decoding="async" />
            <figcaption>
              <b>{{ p.label }}</b>
              <span>{{ p.sub }}</span>
            </figcaption>
          </figure>
        </div>

        <div class="ts-content">
          <div class="ts-steps">
            <div class="ts-steps-line">
              <div class="ts-steps-line-fill" :style="{ width: stepLineWidth + '%' }"></div>
            </div>
            <button
              v-for="(f, i) in trustFactors"
              :key="i"
              class="ts-step"
              :class="{ 'is-active': activeTrust === i }"
              @click="goTrust(i)"
              type="button"
            >
              <span class="ts-step-dot"></span>
              <span class="ts-step-title font-rounded">{{ f.title }}</span>
            </button>
          </div>
          <div class="ts-caption">
            <div class="ts-caption-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path :d="trustIcons[trustFactors[activeTrust].icon]" />
              </svg>
            </div>
            <div class="ts-caption-text">
              <h2 class="font-rounded">{{ trustFactors[activeTrust].title }}</h2>
              <p>{{ trustFactors[activeTrust].text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== БЛОК 4: ТЕХНОЛОГИИ — цифровой двойник (скан → BIM → эксплуатация) ===== -->
    <HomeTechShowcase />
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

    <!-- ===== БЛОК 5.1: СБОРКА ЗНАКА ИЗ ТОЧЕК (скролл-эффект) ===== -->
    <HomeLogoAssembly />

    <!-- ===== БЛОК 6: СТБ 2672-2025 — БЕРЕЖЛИВЫЙ МЕНЕДЖМЕНТ ===== -->
    <section class="lean-section relative overflow-hidden">
      <!-- Фоновое свечение -->
      <div class="absolute inset-0 opacity-20 pointer-events-none">
        <div class="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-esp-blue/30 blur-[120px]"></div>
        <div class="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-esp-green/20 blur-[120px]"></div>
      </div>

      <div class="container-custom relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <!-- Левая колонка: бейдж, заголовок, текст -->
          <div>
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/30 mb-6">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-xs font-bold tracking-widest uppercase text-white">Стандарт качества</span>
            </div>

            <h2 class="font-rounded text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6">
              Система бережливого<br />
              <span class="text-white">менеджмента</span><br />
              по СТБ 2672-2025
            </h2>

            <p class="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              Мы придерживаемся принципов бережливого производства и непрерывного
              совершенствования. Это значит: минимум потерь, максимум ценности для
              заказчика и абсолютная прозрачность на каждом этапе — от проектирования
              до эксплуатации.
            </p>

            <div class="flex flex-wrap gap-3">
              <span class="lean-chip">#кайдзен</span>
              <span class="lean-chip">#5S</span>
              <span class="lean-chip">#TQM</span>
              <span class="lean-chip">#JIT</span>
            </div>
          </div>

          <!-- Правая колонка: карточки принципов -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="lean-card">
              <div class="lean-card-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="lean-card-title">Устранение потерь</h3>
              <p class="lean-card-text">Исключаем перепроизводство, ожидания и лишние перемещения в каждом процессе.</p>
            </div>

            <div class="lean-card">
              <div class="lean-card-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="lean-card-title">Фокус на людях</h3>
              <p class="lean-card-text">Развиваем компетенции сотрудников и создаём культуру постоянного улучшения.</p>
            </div>

            <div class="lean-card">
              <div class="lean-card-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 class="lean-card-title">Встроенное качество</h3>
              <p class="lean-card-text">Качество закладываем на каждом этапе, а не исправляем в конце. Контроль без компромиссов.</p>
            </div>

            <div class="lean-card">
              <div class="lean-card-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 class="lean-card-title">Непрерывное улучшение</h3>
              <p class="lean-card-text">Постоянно совершенствуем процессы на основе данных, обратной связи и анализа.</p>
            </div>
          </div>
        </div>
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
    </section>

    <!-- ===== БЛОК 8: ОТЗЫВЫ ===== -->
    <section class="section-padding text-white reviews-section">
      <div class="container-custom">
        <h2 class="text-center font-rounded text-4xl md:text-6xl font-semibold mb-4 tracking-wide text-esp-black">
          ОТЗЫВЫ
        </h2>
        <p class="text-center text-esp-black/60 mb-14 max-w-2xl mx-auto">
          Официальные письма заказчиков. Нажмите на любое, чтобы прочитать целиком.
        </p>
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
              <span class="review-card__mat" aria-hidden="true">
                <img :src="img" :alt="`Отзыв ESP №${i + 1}`" loading="lazy" />
              </span>
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
      <BrandPattern class="cta-pattern cta-pattern--top" :height="40" />
      <BrandPattern class="cta-pattern cta-pattern--bottom" :height="40" />

      <div class="container-custom cta-inner">
        <span class="cta-eyebrow">
          <span class="cta-eyebrow-dot"></span>
          Следующий шаг
        </span>

        <h2 class="cta-title font-rounded">
          Готовы<br />
          <span class="cta-title-accent">к сотрудничеству?</span>
        </h2>

        <p class="cta-lead">
          Обсудим Ваш проект, подготовим индивидуальное решение и покажем, как опыт
          и передовые технологии в руках наших экспертов приводят к кристально чистому результату.
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const currentSlide = ref(0)
// Ролик реально пошёл (событие playing), а не просто догрузился: раньше текст
// выходил на чёрный кадр, потому что данные уже были, а картинки ещё не было.
const videoPlaying = ref(false)
// Текст выходит после того, как знак дособрался и подложка ушла.
const contentReady = ref(false)

const showVideoModal = ref(false)
// Кадр модального ролика ещё не появился — пока держим прелоадер поверх.
const modalVideoReady = ref(false)
let autoSlideTimer = null
let slowMoTimer = null

const openVideoModal = () => {
  modalVideoReady.value = false
  showVideoModal.value = true
  if (autoSlideTimer) clearTimeout(autoSlideTimer)
}

const closeVideoModal = () => {
  showVideoModal.value = false
  startAutoSlide()
}

// Как только кадр модального ролика готов (или поймали ошибку) — убираем прелоадер.
const onModalReady = () => {
  modalVideoReady.value = true
}

const slides = [
  // ===== СЛАЙД 1: Заглавный (Hero) — карта объектов в Беларуси =====
  {
    type: 'hero',
    badge: 'Произведено в Республике Беларусь',
    title: 'Мы архитекторы технологий очистки воды',
    description: '28 лет опыта. Кристальная чистота воды с просветом 4 метра. Экосистема, состоящая из 30 000 элементов.',
    link: '/contacts#contact-form',
    video: '/videos/hero/BelarusMapESP.mp4',
    poster: '/videos/hero/BelarusMapESP.jpg',
    // Ролик карты идёт ровно один раз: без зацикливания, а слайд листается
    // по событию ended, чтобы анимация не начинала второй круг.
    playOnce: true
  },
  // ===== СЛАЙД 2: Речица =====
  {
    type: 'project',
    badge: 'Гомельская область | 18 000 м³/сут',
    title: 'Очистные сооружения города Речица',
    description: 'Биологическая очистка хозяйственно-бытовых и производственных сточных вод города с выпуском в реку Днепр. Год постройки — 2026.',
    link: '/projects',
    video: '/videos/hero/DJI_0654.mp4',
    poster: '/videos/hero/DJI_0654.jpg'
  },
  // ===== СЛАЙДЫ 3-12: Проекты =====
  {
    type: 'project',
    badge: 'Витебская область | 600 м³/сут',
    title: 'Очистные сооружения Поставского молочного завода',
    description: 'Очистка высококонцентрированных сточных вод молочного завода методом физико-химической и последующей биологической очистки. Год постройки — 2024.',
    link: '/projects',
    video: '/videos/hero/DJI_0715.mp4',
    poster: '/videos/hero/DJI_0715.jpg'
  },
  {
    type: 'project',
    badge: 'Могилевская область | 4250 м³/сут',
    title: 'Очистные сооружения города Кричев',
    description: 'Станция биологической очистки сточных вод города. Год постройки — 2026.',
    link: '/projects/krichev-vodokanal',
    video: '/videos/hero/DJI_0238.mp4',
    poster: '/videos/hero/DJI_0238.jpg'
  },
  {
    type: 'project',
    badge: 'Могилевская область | 1800 м³/сут',
    title: 'Очистные сооружения г. Мстиславля',
    description: 'Станция очистных сооружений города Мстиславля.',
    link: '/projects',
    video: '/videos/hero/DJI_0238.mp4',
    poster: '/videos/hero/DJI_0238.jpg'
  },
  {
    type: 'project',
    badge: 'Минская область, Несвижский район | 1500 м³/сут',
    title: 'Станция биологической очистки сточных вод в д. Снов Несвижского района',
    description: 'Станция биологической очистки сточных вод.',
    link: '/projects/agrokombinat-snov',
    video: '/videos/hero/DJI_0470.mp4',
    poster: '/videos/hero/DJI_0470.jpg'
  },
  {
    type: 'project',
    badge: 'Витебская область | 3000 м³/сут',
    title: 'Очистные сооружения ОАО «Витебская бройлерная птицефабрика»',
    description: 'Станция полной биологической очистки, в том числе 300 м³/сут — цех КРС и площадка по выращиванию кур.',
    link: '/projects/vitebsk-broiler',
    video: '/videos/hero/DJI_0654.mp4',
    poster: '/videos/hero/DJI_0654.jpg'
  },
  {
    type: 'project',
    badge: 'Минская область, Молодечненский район',
    title: 'Реконструкция очистных сооружений сточных вод в деревне Красное',
    description: 'Реконструкция очистных сооружений сточных вод.',
    link: '/projects',
    video: '/videos/hero/DJI_0715.mp4',
    poster: '/videos/hero/DJI_0715.jpg'
  },
  {
    type: 'project',
    badge: 'Гродненская область | 6500 м³/сут',
    title: 'Строительство очистных сооружений города Скидель',
    description: 'Строительство очистных сооружений города Скидель. Год постройки — 2026.',
    link: '/projects',
    video: '/videos/hero/DJI_0470.mp4',
    poster: '/videos/hero/DJI_0470.jpg'
  },
  {
    type: 'project',
    badge: 'Могилевская область, Быховский район | 150 м³/сут',
    title: 'д. Годылева',
    description: 'Очистные сооружения в деревне Годылева Быховского района.',
    link: '/projects',
    video: '/videos/hero/DJI_0654.mp4',
    poster: '/videos/hero/DJI_0654.jpg'
  },
  {
    type: 'project',
    badge: 'Витебская область',
    title: 'Очистные сооружения города Шумилино',
    description: 'Очистные сооружения города Шумилино.',
    link: '/projects',
    video: '/videos/hero/DJI_0715.mp4',
    poster: '/videos/hero/DJI_0715.jpg'
  },
  {
    type: 'project',
    badge: 'Минская область, Дзержинский район | 4700 м³/сут',
    title: 'Городские очистные сооружения города Фаниполь',
    description: 'Очистные сооружения города-спутника, реализованные с учётом развития города. Год постройки — 2025.',
    link: '/projects',
    video: '/videos/hero/DJI_0238.mp4',
    poster: '/videos/hero/DJI_0238.jpg'
  }
]

const heroVideoEl = ref(null)

const handleVideoLoad = (el) => {
  heroVideoEl.value = el
  if (slides[currentSlide.value].speed) {
    el.playbackRate = slides[currentSlide.value].speed
  }
}

// Слайд с playOnce листается сразу после последнего кадра.
const onVideoEnded = () => {
  if (slides[currentSlide.value].playOnce) nextSlide()
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

// Страховка: если сеть подвела и кадр не пришёл, текст всё равно нужно
// показать — пустой экран хуже, чем текст без готового видео.
let heroLoadFallback = null

// Текст ждёт именно старта кадра, поэтому короткого таймера здесь быть не
// должно: на медленной сети он бы выпустил заголовок на чёрный экран — ровно
// та беда, от которой уходим. Страховка длинная и только на случай, когда
// ролик не поедет уже никогда.
const HERO_FALLBACK_MS = 12000

const revealHero = () => {
  clearTimeout(heroLoadFallback)
  videoPlaying.value = true
}

const awaitHeroVideo = () => {
  videoPlaying.value = false
  clearTimeout(heroLoadFallback)
  if (contentReady.value) return
  // Во вкладке в фоне браузер не запускает видео вовсе — держать там
  // прелоадер незачем, его всё равно никто не видит.
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
    revealHero()
    return
  }
  heroLoadFallback = setTimeout(revealHero, HERO_FALLBACK_MS)
}

const onVideoPlaying = () => {
  revealHero()
  prefetchSlide(currentSlide.value + 1)
}

// Битый файл или заблокированный автозапуск: ждать нечего, открываем экран.
const onVideoError = () => revealHero()

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
  awaitHeroVideo()
  resetAutoSlide()
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
  awaitHeroVideo()
  resetAutoSlide()
}

// Таймер пересобирается на каждом слайде. Для слайда с playOnce он лишь
// страховка на случай, если автовоспроизведение не стартовало: обычно слайд
// переключает событие ended, и оно наступает раньше.
const resetAutoSlide = () => {
  if (autoSlideTimer) clearTimeout(autoSlideTimer)
  const delay = slides[currentSlide.value].playOnce ? 8000 : 5000
  autoSlideTimer = setTimeout(nextSlide, delay)
}

const startAutoSlide = () => {
  resetAutoSlide()
}

const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead({
  title: 'ESP | EcoServiceProject — Связь. Синергия опыта и технологий',
  meta: [
    {
      name: 'description',
      content: 'ESP — премиальный технологический партнер мирового уровня, создающий интеллектуальные экосистемы очистки воды. 28 лет опыта, 30 000 синхронизированных элементов, кристальный просвет 5м.'
    },
    { property: 'og:title', content: 'ESP | EcoServiceProject — экосистемы очистки воды' },
    { property: 'og:description', content: 'Проектирование, производство и монтаж очистных сооружений «под ключ». 28 лет опыта, 2000+ реализованных проектов.' },
    { property: 'og:image', content: `${ogOrigin}/images/team/team-hero-1.png` }
  ],
  link: [
    { rel: 'canonical', href: 'https://ecoservisproekt.com/' },
    // Постер первого слайда — первое, что видит посетитель.
    // Грузим его параллельно с HTML, не дожидаясь разбора страницы.
    { rel: 'preload', as: 'image', href: '/videos/hero/BelarusMapESP.jpg', fetchpriority: 'high' }
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
    title: 'РЕШЕНИЯ НА БАЗЕ USBF',
    caption: 'Технология USBF',
    image: '/images/Image_service/USFproject.webp',
    alt: 'Решения на базе технологии USBF',
    icon: 'layers',
    text: 'Внедряем технологию USBF под задачи конкретного объекта. Опираемся на 28 лет практики в биологической очистке сточных вод. Используем передовые разработки.'
  },
  {
    title: 'ИНЖИНИРИНГ',
    caption: 'Проектирование',
    image: '/images/developer/ИНЖИНИРИНГ.png',
    alt: 'Инжиниринг — проектирование и подготовка проекта',
    icon: 'compass',
    text: 'Проектируем будущее с точностью до миллиметра.'
  },
  {
    title: 'ПРОИЗВОДСТВО',
    caption: 'Собственный цех',
    image: '/images/developer/ПРОИЗВОДСТВО.png',
    alt: 'Производство оборудования в собственном цехе ESP',
    icon: 'factory',
    text: 'Точность в каждой детали. Качество в каждом узле.'
  },
  {
    title: 'ВВОД В ЭКСПЛУАТАЦИЮ',
    caption: 'Пусконаладка и контроль',
    image: '/images/developer/ВВОД В ЭКСПЛУАТАЦИЮ3.png',
    alt: 'Ввод объекта в эксплуатацию — пусконаладка и контроль',
    icon: 'check',
    text: 'Выводим объект на проектные показатели. 100% результата и полная прозрачность всех процессов — наш внутренний стандарт.'
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
const activeTrust = ref(0)
// Каждому шагу — своя отметка о загрузке кадра: пока текущий не пришёл,
// поверх лежит подложка с меткой, а не чёрная дыра.
const trustLoaded = ref(trustFactors.map(() => false))
const trustReady = computed(() => {
  const f = trustFactors[activeTrust.value]
  // Шаг с панелями фотографии не ждёт — он собран из экранов автоматики.
  return f?.panels ? true : trustLoaded.value[activeTrust.value]
})
let tsST = null

const stepLineWidth = computed(() => {
  const N = trustFactors.length
  if (N <= 1) return 0
  return (activeTrust.value / (N - 1)) * 100
})

function renderTrust(pos) {
  activeTrust.value = Math.round(pos)
}

function goTrust(i) {
  activeTrust.value = i
}

// Pinning: скролл по блоку листает шаги и заполняет линию слева направо
const initTrust = () => {
  const pin = tsPin.value
  if (!pin) return
  gsap.registerPlugin(ScrollTrigger)
  const N = trustFactors.length
  if (tsST) tsST.kill()
  tsST = ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: `+=${(N - 1) * 100}%`,
    pin: true,
    anticipatePin: 1,
    snap: {
      snapTo: 1 / (N - 1),
      duration: { min: 0.2, max: 0.5 },
      delay: 0.05,
      ease: 'power1.inOut'
    },
    onUpdate: (self) => renderTrust(self.progress * (N - 1)),
    onRefresh: (self) => renderTrust(self.progress * (N - 1))
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

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Scroll-галерея: центральное видео на весь экран → zoom-out → сетка 3×3
const galleryPin = ref(null)
const galleryGrid = ref(null)
const galleryOverlay = ref(null)
let galleryObserver = null
let galleryRaf = 0
// 9 плиток: индекс 4 — центральная (герой). Порядок в CSS-grid слева-направо, сверху-вниз.
const galleryVideos = [
  '/videos/mosaic/esp_seg1_190826.mp4', '/videos/mosaic/esp_seg2_190826.mp4', '/videos/mosaic/esp_seg3_190826.mp4',
  '/videos/mosaic/esp_seg4_190826.mp4', '/videos/mosaic/esp_hero_190826.mp4', '/videos/mosaic/DJI_0715.mp4',
  '/videos/mosaic/esp_seg6_190826.mp4', '/videos/mosaic/esp_seg7_190826.mp4', '/videos/mosaic/esp_drone3_200826.mp4'
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

  // Тёмная подложка на центральном кадре держится только пока виден один видео:
  // как только сетка разворачивается в девять плиток, затемнение уходит, чтобы
  // все кадры стояли рядом одинаково ярко.
  grid.style.setProperty('--sg-dim', String(1 - n))

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

const startHero = () => {
  if (heroVideoEl.value) {
    heroVideoEl.value.currentTime = 0
    // Автозапуск отклонён политикой браузера — ролик сам не поедет,
    // держать зрителя перед подложкой бессмысленно.
    heroVideoEl.value.play?.().catch(revealHero)
  }
  startAutoSlide()
}

onMounted(() => {
  awaitHeroVideo()
  startHero()
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) animateMetrics()
    })
  }, { threshold: 0.5 })
  if (metricsSection.value) observer.observe(metricsSection.value)

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

  // Блок «Почему нам доверяют лидеры»: pinned steps
  initTrust()

  window.addEventListener('keydown', onReviewKey)
})

onUnmounted(() => {
  if (autoSlideTimer) clearTimeout(autoSlideTimer)
  if (slowMoTimer) clearInterval(slowMoTimer)
  observer?.disconnect()
  galleryObserver?.disconnect()
  tsST?.kill()
  if (galleryRaf) cancelAnimationFrame(galleryRaf)
  window.removeEventListener('scroll', onGalleryScroll)
  window.removeEventListener('resize', onGalleryResize)
  window.removeEventListener('resize', syncReviewScroll)
  window.removeEventListener('keydown', onReviewKey)
})
</script>

<style scoped>
/* Секции этой страницы не задают боковых полей сами, и на телефоне текст
   упирался в края. Гуттер вешаем на контейнеры и снимаем там, где у секции
   свои отступы (.section-padding), чтобы поля не удваивались. */
.container-custom {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.section-padding .container-custom {
  padding-left: 0;
  padding-right: 0;
}
@media (min-width: 640px) {
  .container-custom {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

/* ===== Hero: свет в кадре ===== */
/* Ролики сняты в контровом свете и на сайте читались мрачно. Немного
   поднимаем яркость самого видео и отпускаем углы кадра. */
.hero-video {
  filter: brightness(1.12) saturate(1.05) contrast(0.97);
}

/* Затемнение под текстом: плотное у левого края, где лежат заголовок и
   описание, и почти сходящее на нет к середине кадра. Снизу — лёгкая
   подложка под бейджи слайдера, сверху — под шапку сайта. */
/* Индикатор загрузки ролика: три точки в фирменном лидарном цвете, живут
   в правом нижнем углу, чтобы не спорить с заголовком слайда. */
/* Подложка закрывает весь кадр, а не только знак: до старта ролика зритель
   не должен видеть ни чёрного прямоугольника, ни постера наполовину. */
.hero-cover {
  position: absolute;
  inset: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b0e13;
}

/* Текст первого экрана держим в разметке ради выдачи, но не показываем,
   пока не готов кадр: анимация букв стартует уже после проявления. */
.hero-content {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.45s ease;
}
.hero-content.is-ready {
  opacity: 1;
  visibility: visible;
}
.hero-content:not(.is-ready) :deep(.water-char),
.hero-content:not(.is-ready) .hero-badge,
.hero-content:not(.is-ready) .hero-desc,
.hero-content:not(.is-ready) .hero-buttons {
  animation-play-state: paused;
}

.hero-load-leave-active { transition: opacity 0.4s ease; }
.hero-load-leave-to { opacity: 0; }

.hero-scrim {
  background:
    linear-gradient(100deg, rgba(26, 26, 26, 0.78) 0%, rgba(26, 26, 26, 0.42) 34%, rgba(26, 26, 26, 0.08) 58%, rgba(26, 26, 26, 0) 78%),
    linear-gradient(to bottom, rgba(26, 26, 26, 0.34) 0%, rgba(26, 26, 26, 0) 22%),
    linear-gradient(to top, rgba(26, 26, 26, 0.22) 0%, rgba(26, 26, 26, 0) 18%);
}

/* ===== Hero: мобильная версия ===== */
/* На интро-баннере видео-превью и пагинация прячутся, чтобы не наезжать на
   заголовок и кнопки. Появляются плавно с переходом на второй слайд. */
.hero-preview-widget,
.hero-pagination {
  transition: opacity 0.4s ease;
}

/* ===== Видео-модалка: мобильная ===== */
/* Ролик 1920×1080 (пейзаж) — на мобиле модалке задаём горизонтальную рамку,
   чтобы видео открывалось горизонтально, а не вытягивалось в портрет. */
@media (max-width: 767px) {
  /* Скрываем видео-превью и пагинацию только на первом (интро) слайде */
  .hero-preview-widget.is-hide-on-mob,
  .hero-pagination.is-hide-on-mob {
    opacity: 0;
    pointer-events: none;
  }

  /* Пагинацию на мобиле смещаем левее и ниже, чтобы не налезала на видео */
  .hero-pagination {
    left: 1.25rem;
    transform: none;
    bottom: 0.75rem;
    gap: 0.5rem;
  }
  .hero-pagination.is-hide-on-mob {
    opacity: 0;
  }

  /* Модалка: пейзажная рамка. Ширина во всю, а высоту ограничиваем так, чтобы
     сохранялась горизонтальная пропорция (16:9), и всё влезало на экран. */
  .hero-modal-frame {
    width: 96vw !important;
    height: auto !important;
    max-height: 92vh !important;
    aspect-ratio: 16 / 10;
  }
  .hero-modal-media {
    border-radius: 12px;
  }
}

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

/* ===== Блок «Почему нам доверяют лидеры»: full-screen steps ===== */
.ts-section { position: relative; background: #0a0a0a; }

.ts-pin {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 620px;
  overflow: hidden;
}

/* Background images full screen */
.ts-media-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.ts-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity;
}
.ts-bg-img.is-active { opacity: 1; }

/* Подложка шага: тот же тёмный фон, что у самого блока, чтобы подмена
   кадра не читалась как мигание. */
.ts-cover {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b0e13;
}

.ts-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.65) 100%);
}

/* ===== Экраны панелей оператора (шаг «Тестирование») ===== */
/* Кадр диспетчерской остаётся фоном, а поверх ложится сетка реальных HMI.
   Экраны отдаём в исходном разрешении 800×480 и не растягиваем сверх меры —
   иначе схемы и подписи на них рассыпаются в пиксели. */
/* На шаге с панелями фотографии нет вовсе: сцену держат сами экраны
   автоматики на тёмном фоне. */
.ts-pin:has(.ts-panels) .ts-overlay {
  background: linear-gradient(to bottom, #0b0e13 0%, #0d1117 55%, #080a0e 100%);
}

.ts-panels {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.5rem, 1vw, 1.1rem);
  width: min(94vw, 104rem);
  pointer-events: none;
}
.ts-panel {
  margin: 0;
  border-radius: 0.65rem;
  overflow: hidden;
  background: #0b0f14;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 212, 255, 0.06);
  opacity: 0;
  transform: translateY(18px) scale(0.985);
  animation: tsPanelIn 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}
.ts-panel img {
  display: block;
  width: 100%;
  height: auto;
}
.ts-panel figcaption {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.5rem 0.7rem 0.55rem;
  background: rgba(8, 11, 15, 0.92);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ts-panel figcaption b {
  color: #00d4ff;
  font-weight: 700;
}
.ts-panel figcaption span {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
}
@keyframes tsPanelIn {
  to { opacity: 1; transform: none; }
}
@media (max-width: 1024px) {
  .ts-panels {
    top: clamp(4.5rem, 12vh, 8rem);
    transform: translate(-50%, 0);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(94vw, 40rem);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ts-panel { animation-duration: 0.01ms; }
}

.ts-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: clamp(1.75rem, 5vh, 4rem) clamp(1.5rem, 4vw, 4.5rem) clamp(2rem, 6vh, 4.5rem);
  z-index: 2;
}

.ts-heading {
  position: absolute;
  top: clamp(4.5rem, 8vh, 6rem);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: clamp(0.85rem, 1.3vw, 1.15rem);
  letter-spacing: 0.18em;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffffff;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.7rem 1.4rem;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.2);
  white-space: nowrap;
}

.ts-eyebrow-dot {
  flex: 0 0 auto;
  width: 9px;
  height: 9px;
  border-radius: 9999px;
  background: #00A8E8;
  box-shadow: 0 0 10px rgba(0,168,232,0.8);
}

.ts-steps {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 1150px;
  width: 100%;
  margin: 0 auto 2rem;
  padding-top: 0.6rem;
}

.ts-steps-line {
  position: absolute;
  top: 34px;
  left: 3%;
  right: 3%;
  height: 4px;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.15);
  border-radius: 9999px;
  overflow: hidden;
}

.ts-steps-line-fill {
  height: 100%;
  background: linear-gradient(to right, #00A8E8, #ffffff);
  border-radius: 9999px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(0,168,232,0.5);
}

.ts-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  z-index: 2;
  padding: 0.5rem 0.6rem;
  background: transparent;
  border: none;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.ts-step:hover { transform: translateY(-4px); }

.ts-step-dot {
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  background: rgba(255,255,255,0.9);
  border: 3px solid #ffffff;
  box-shadow: 0 0 0 5px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.4);
  transition: background 0.4s, border-color 0.4s, box-shadow 0.4s, transform 0.4s;
}

.ts-step.is-active .ts-step-dot {
  background: #00A8E8;
  border-color: #ffffff;
  box-shadow: 0 0 0 7px rgba(0, 168, 232, 0.35), 0 0 24px rgba(0, 168, 232, 0.8);
  transform: scale(1.15);
}

.ts-step-title {
  font-size: clamp(0.68rem, 1vw, 0.95rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  transition: color 0.35s;
  text-align: center;
  white-space: nowrap;
}

.ts-step.is-active .ts-step-title { color: #ffffff; }

.ts-caption {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 1.75rem);
  padding: clamp(1.25rem, 2.5vw, 2rem) clamp(1.5rem, 3vw, 2.5rem);
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.45);
}

.ts-caption-badge {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgba(0,168,232,0.9), rgba(0,120,200,0.7));
  border: 1px solid rgba(255,255,255,0.25);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(0,168,232,0.35);
}

.ts-caption-badge svg {
  width: 26px;
  height: 26px;
  display: block;
}

.ts-caption-text h2 {
  font-size: clamp(1.4rem, 2.4vw, 2.2rem);
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #ffffff;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
}

.ts-caption-text p {
  font-size: clamp(0.92rem, 1.35vw, 1.12rem);
  line-height: 1.65;
  color: rgba(255,255,255,0.88);
  max-width: 62ch;
}

@media (max-width: 767px) {
  .ts-pin {
    height: 100vh;
    min-height: 560px;
  }
  .ts-heading {
    top: 4rem;
    font-size: 0.7rem;
    padding: 0.5rem 1rem;
    white-space: normal;
    text-align: center;
    line-height: 1.3;
  }
  .ts-step-title { display: none; }
  .ts-step-dot { width: 20px; height: 20px; }
  .ts-steps-line { top: 29px; }
  .ts-caption {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem 1.1rem;
    border-radius: 18px;
  }
  .ts-caption-badge { width: 40px; height: 40px; }
  .ts-caption-badge svg { width: 20px; height: 20px; }
}

/* ===== Блок «Технологии»: полноэкранные слои по скроллу ===== */
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

.sg-tile--center::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  /* Затемнение живёт на старте, пока виден один центральный кадр; к концу
     сборки сетки из девяти видео JS гасит его до нуля (--sg-dim → 0). */
  opacity: var(--sg-dim, 1);
  transition: opacity 0.2s ease;
  pointer-events: none;
}

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
  width: 240px;
  height: 108px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
}
.partner-logo img {
  max-width: 100%;
  max-height: 78px;
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
  color: #002366;
  background: rgba(0, 35, 102, 0.06);
  border: 1px solid rgba(0, 35, 102, 0.18);
  cursor: pointer;
  transition: background 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
}
.review-nav:hover:not(:disabled) { background: rgba(0, 35, 102, 0.12); transform: scale(1.06); }
.review-nav:disabled { opacity: 0.25; cursor: default; }

/* Полоска прогресса ленты */
.review-progress {
  margin: 0.25rem auto 0;
  width: min(220px, 60%);
  height: 3px;
  border-radius: 3px;
  background: rgba(0, 35, 102, 0.15);
  overflow: hidden;
}
.review-progress-bar {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: #002366;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.15s linear;
}

/* Светлая подложка вместо тёмной: письма заказчиков сами по себе белые,
   поэтому секция держится на спокойном светло-сером градиенте. */
.reviews-section {
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(0, 96, 57, 0.06) 0%, rgba(0, 96, 57, 0) 60%),
    linear-gradient(180deg, #eef2f7 0%, #e6ecf3 100%);
}

.review-card {
  position: relative;
  display: block;
  /* В ленте карточка имеет фиксированную ширину, а не тянется по гриду */
  flex: 0 0 auto;
  width: clamp(220px, 27vw, 330px);
  scroll-snap-align: start;
  aspect-ratio: 3 / 4;
  /* «Музейная» рама: белое паспарту, тонкий бордер, мягкая рассеянная тень.
     Письма видны без тяжёлой тени — как экспонат на стене галереи. */
  background: #fff;
  border: 1px solid rgba(0, 35, 102, 0.14);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 8px 24px rgba(30, 45, 75, 0.12);
  cursor: zoom-in;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.review-card__mat {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
  background: #f4f6fa;
}
.review-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
.review-card:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 35, 102, 0.3);
  box-shadow: 0 16px 36px rgba(30, 45, 75, 0.16);
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
  left: 10px;
  right: 10px;
  color: #ffffff;
  opacity: 0.09;
  animation: ctaPatternStroke 8s ease-in-out infinite;
}
.cta-pattern--top { top: 10px; }
.cta-pattern--bottom { bottom: 10px; transform: rotate(180deg); }
.cta-pattern svg {
  width: 100%;
  height: 40px;
  object-fit: cover;
}

@keyframes ctaPatternStroke {
  0%, 100% { opacity: 0.09; filter: drop-shadow(0 0 0 rgba(255,255,255,0)); }
  50% { opacity: 0.25; filter: drop-shadow(0 0 6px rgba(0,168,232,0.4)); }
}

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

/* ===== Блок СТБ 2672-2025: Бережливый менеджмент ===== */
.lean-section {
  padding: clamp(4rem, 8vh, 6rem) 0;
  background:
    radial-gradient(100% 100% at 0% 0%, rgba(0, 168, 232, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, #001a33 0%, #00264d 50%, #001a33 100%);
  color: #fff;
}

.lean-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}
.lean-chip:hover {
  background: rgba(0, 168, 232, 0.15);
  border-color: rgba(0, 168, 232, 0.4);
  color: #fff;
  transform: translateY(-2px);
}

.lean-card {
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  transition: all 0.35s ease;
}
.lean-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 168, 232, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
}

.lean-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0, 168, 232, 0.25), rgba(0, 120, 200, 0.15));
  color: #7fd8ff;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 168, 232, 0.3);
}

.lean-card-title {
  font-family: 'SF Pro Rounded', 'Inter', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.lean-card-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
}

@media (max-width: 767px) {
  .lean-section { padding: 3rem 0; }
  .lean-card { padding: 1.25rem; }
}
</style>

<template>
  <div class="about-page">
    <!-- Hero Video Section (Full Screen Brand Film) -->
    <section class="hero-video relative min-h-screen flex items-center justify-center overflow-hidden bg-esp-black">
      
      <!-- Video Background -->
      <div class="hero-video__bg absolute inset-0 w-full h-full">
        <video 
          ref="brandVideo"
          class="w-full h-full object-cover"
          :poster="videoPoster"
          autoplay 
          muted 
          loop 
          playsinline
          preload="auto"
        >
          <source src="/videos/hero-water.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        
        <!-- Overlay для читаемости -->
        <div class="hero-video__overlay absolute inset-0 bg-gradient-to-b from-esp-black/70 via-esp-black/50 to-esp-black/80" />
        
        <!-- Паттерн «Лист трансформации» -->
        <div class="hero-video__pattern absolute inset-0 opacity-[0.08]" />
      </div>
      
      <!-- Content -->
      <div class="container relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <div class="hero-video__badge inline-flex items-center gap-2 px-4 py-2 bg-esp-black/60 backdrop-blur-sm text-white rounded-full font-semibold text-sm mb-6 animate-on-scroll border border-white/30">
            <span class="w-2 h-2 bg-esp-green rounded-full animate-pulse" />
            25+ лет опыта
          </div>
          
          <h1 class="hero-video__title text-white mb-6 animate-on-scroll" style="animation-delay: 0.1s">
            Наследие и <span class="text-esp-green">Видение</span>
          </h1>

          <p class="hero-video__subtitle text-lg text-white/90 mb-10 max-w-2xl mx-auto animate-on-scroll" style="animation-delay: 0.2s">
            25-летний путь от подрядчика к премиальному технологическому партнеру мирового уровня. МЫ создаём экосистемы чистой воды, где опыт отца синергирует с технологиями сына.
          </p>
          
          <div class="hero-video__actions flex flex-wrap justify-center gap-4 animate-on-scroll" style="animation-delay: 0.3s">
            <a href="#history" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition">
              Наша история
            </a>
            <a href="#ecosystem" class="bg-white text-esp-black px-8 py-4 font-medium hover:bg-esp-gray transition">
              Экосистема ESP
            </a>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <button 
        @click="scrollToHistory" 
        class="hero-video__scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors z-10"
        aria-label="Прокрутить вниз"
      >
        <span class="text-xs font-medium">Прокрутите</span>
        <div class="w-6 h-10 border-2 border-white/50 rounded-full relative">
          <div class="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-white rounded-full animate-scroll" />
        </div>
      </button>
    </section>

    <!-- History & Timeline Section -->
    <section id="history" class="section history bg-white">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">Наследие и Видение</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            25-летний путь от подрядчика к премиальному технологическому партнеру мирового уровня
          </p>
        </div>
        
        <!-- Interactive Timeline: year selector + animated content panel -->
        <div class="max-w-4xl mx-auto">
          <!-- Progress line with year buttons -->
          <div class="relative flex justify-between items-center mb-12 px-2">
            <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-esp-gray"></div>
            <div
              class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-esp-green transition-all duration-500"
              :style="{ width: `${(activeYearIndex / (timelineEvents.length - 1)) * 100}%` }"
            ></div>
            <button
              v-for="(ev, i) in timelineEvents"
              :key="ev.year"
              @click="activeYearIndex = i"
              class="relative z-10 flex flex-col items-center gap-2 group"
            >
              <span
                class="w-4 h-4 rounded-full border-4 border-white shadow transition-all duration-300"
                :class="i <= activeYearIndex ? 'bg-esp-green scale-125' : 'bg-esp-gray group-hover:bg-esp-blue/50'"
              ></span>
              <span
                class="text-sm font-bold font-mono transition-colors"
                :class="i === activeYearIndex ? 'text-esp-green' : 'text-esp-black/40 group-hover:text-esp-black'"
              >{{ ev.year }}</span>
            </button>
          </div>

          <!-- Active year content, animated on change -->
          <Transition name="fade-slide" mode="out-in">
            <div :key="activeYearIndex" class="bg-esp-gray/60 p-8 md:p-10 text-center">
              <h3 class="text-2xl font-semibold mb-3 text-esp-black">{{ timelineEvents[activeYearIndex].title }}</h3>
              <p class="text-esp-black/70 max-w-2xl mx-auto">{{ timelineEvents[activeYearIndex].desc }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Brain & Body Ecosystem Section -->
    <section id="ecosystem" class="section brain-body bg-esp-gray" style="scroll-margin-top: 100px;">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">Мозг и Тело: Экосистема ESP</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            Уникальная структура, объединяющая инжиниринговый интеллект и производственное совершенство
          </p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Brain (ESP) -->
          <div class="brain-card bg-white p-8 shadow-lg animate-on-scroll">
            <div class="brain-card__icon h-14 flex items-center mb-6">
              <svg width="100" height="51" viewBox="0 0 120 61" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-auto">
                <path d="M63.0562 1.29415C66.2988 4.75237 73.6844 12.9677 75.2426 17.0885C75.8406 18.671 76.4481 21.7646 73.9536 21.9386C71.7999 22.0887 71.3448 19.0047 70.6491 17.6391C70.1202 16.5999 69.1911 15.27 68.4787 14.3334C66.4465 11.6617 63.6947 9.12579 61.5838 6.45645L57.6694 11.5663C50.2599 29.0719 76.9818 26.4645 78.6018 42.3209C80.3458 59.4022 58.6129 65.9325 48.0395 54.1184L45.1972 50.5291C44.7088 50.5982 42.9624 52.8337 42.343 53.4081C29.5729 65.2152 9.53871 60.4938 2.45324 44.9854C-3.36714 32.2465 1.4526 16.8502 13.9082 10.3747C22.5375 5.88922 32.5868 7.24057 41.9785 7.40025C43.477 16.8335 41.5472 28.6072 34.2426 35.2805C29.4767 39.6339 23.2365 41.7799 16.8427 41.8132C15.5211 41.82 14.5739 40.6019 14.7912 39.2983C14.9634 38.2655 15.8243 37.491 16.8696 37.432C18.5252 37.3387 20.1784 37.2264 21.8084 36.8845C30.6538 35.0313 35.8414 28.031 37.5864 19.9074C38.5857 15.2555 34.4738 11.29 29.7183 11.4424C25.9921 11.5616 22.2635 11.7808 18.7184 13.0511C8.10447 16.8621 2.58904 27.8564 5.03108 38.8221C5.18393 39.5065 5.41556 40.1635 5.66802 40.813C5.93275 41.4941 7.17602 41.3764 7.25631 40.6501C7.83525 35.4378 10.1034 30.5424 13.7581 26.7887C17.1602 23.2923 22.0086 21.9219 26.1207 19.5124C27.4032 18.7596 28.5079 17.8111 29.7476 17.0235C29.954 16.8923 30.2207 16.9132 30.4096 17.0686C30.5299 17.1675 30.6074 17.3107 30.6115 17.4663C30.6595 19.2819 29.453 20.8557 28.3078 22.1793C24.341 26.7625 18.1013 26.8912 14.4323 32.8233C6.6178 45.4573 15.421 58.4989 30.0971 55.1932C35.9961 53.8657 39.7294 50.0858 43.2721 45.5169C43.988 44.5937 44.1633 43.2027 45.8366 43.2027C47.5099 43.2027 48.2491 46.0031 49.1831 47.967C51.3392 52.4977 57.2787 56.69 62.3891 55.1432C65.7079 54.1398 67.2041 50.1263 66.6585 46.9016C65.372 39.2988 49.8311 37.671 46.7267 27.7873C43.2459 16.7096 55.5085 8.13432 61.1097 0.233567L61.6005 0C61.8936 0 62.7441 0.960484 63.0562 1.29177V1.29415ZM52.204 18.6043C51.0557 18.9118 50.6221 21.7432 50.5458 22.7775C49.6453 34.7609 68.7503 34.3891 70.7325 45.679C71.1614 48.1243 70.6968 49.397 70.5443 51.6397C70.4609 52.8576 71.3448 51.8304 71.7093 51.3728C74.2967 48.1195 75.0948 42.8261 72.9435 39.1701C68.2262 31.1549 52.4018 30.2779 52.204 18.6019V18.6043Z" fill="#002366"/>
                <path d="M94.9361 58.0852C91.2242 62.0606 83.7123 60.0157 83.1286 54.2313C82.1184 44.2189 84.3722 32.7384 95.3435 29.7735C97.8427 29.0991 100.342 29.2873 102.727 28.8297C106.627 28.0838 107.632 22.8261 104.283 20.6406C102.477 19.4609 99.4533 19.8303 98.1453 21.6178C97.1113 23.0287 97.3067 25.872 96.468 26.6109C95.7485 27.2424 93.4161 27.3354 92.4035 27.6595C91.9652 20.7693 96.5443 13.9697 104.106 15.812C113.367 18.0714 112.831 31.6564 103.356 33.2723C101.54 33.5821 99.6129 33.2913 97.776 33.6393C93.0325 34.5378 89.0395 38.4274 87.9888 43.1369C87.4956 45.3534 87.2431 51.7527 87.6982 53.9382C88.1937 56.331 91.908 56.1237 92.3463 53.6975C93.3065 48.3564 89.8567 39.6048 97.3472 37.7363C101.4 36.7257 105.162 37.8674 109.128 35.7176C118.92 30.4123 117.21 14.9897 106.391 12.0868C103.556 11.3265 94.2595 11.3957 91.0836 11.6769C88.7417 11.8842 87.8673 13.1307 87.6457 15.383C87.6457 21.8854 87.6457 25.2918 87.6457 31.0605C85.0398 33.2998 83.3716 35.8695 83.3716 35.8695C83.3716 35.8695 83.3716 35.8695 83.1143 15.1327C83.4883 10.3684 86.6356 7.44647 91.3171 7.14617C94.7765 6.92452 99.763 6.93644 103.229 7.14617C124.14 8.41411 125.82 37.2453 106.443 41.3685C104.263 41.8332 98.3311 41.2088 97.29 42.6841C95.2172 45.6203 98.5527 54.2003 94.9313 58.078L94.9361 58.0852Z" fill="#002366"/>
              </svg>
            </div>
            <h3 class="brain-card__title text-2xl font-semibold mb-4">Инжиниринговый «Мозг»</h3>
            <p class="brain-card__desc text-esp-black/70 mb-6">
              ESP — интеллектуальный центр экосистемы. Мы проектируем не просто объекты, а масштабные идеи на стадии замысла, используя передовые технологии для синхронизации 30 000 элементов.
            </p>
            <ul class="brain-card__list space-y-3">
              <li class="flex items-start gap-3">
                <span class="text-esp-green mt-1">✓</span>
                <span class="text-esp-black/80">3D-проектирование и BIM-интеграция</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-esp-green mt-1">✓</span>
                <span class="text-esp-black/80">Лидарное сканирование: точность до мм</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-esp-green mt-1">✓</span>
                <span class="text-esp-black/80">Цифровые двойники для упрощения эксплуатации</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-esp-green mt-1">✓</span>
                <span class="text-esp-black/80">100+ экспертов в штате</span>
              </li>
            </ul>
          </div>
          
          <!-- Body (Ecomachines) -->
          <div class="body-card bg-white p-8 shadow-lg animate-on-scroll" style="animation-delay: 0.1s">
            <div class="body-card__icon h-14 flex items-center mb-6">
              <img src="/logo-ecomachine.svg" alt="Экомашины" class="h-full w-auto" />
            </div>
            <h3 class="body-card__title text-2xl font-semibold mb-4">Производственное «Тело»</h3>
            <p class="body-card__desc text-esp-black/70 mb-6">
              «Экомашины» — производственная мощь экосистемы. Полный цикл локализации в РБ, внедрение принципов бережливого производства и гарантия качества каждого узла.
            </p>
            <ul class="body-card__list space-y-3">
              <li class="flex items-start gap-3">
                <span class="text-esp-green mt-1">✓</span>
                <span class="text-esp-black/80">Собственное производство в Заславле</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-esp-green mt-1">✓</span>
                <span class="text-esp-black/80">Максимальная локализация и импортозамещение</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-esp-green mt-1">✓</span>
                <span class="text-esp-black/80">Принципы Lean-менеджмента</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-esp-green mt-1">✓</span>
                <span class="text-esp-black/80">Контроль качества на каждом этапе</span>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Ecosystem Network: анимированная SVG-схема связей подразделений -->
        <div class="mt-16 animate-on-scroll" style="animation-delay: 0.2s">
          <div class="ecosystem-scheme bg-esp-black p-8 shadow-lg text-center">
            <h3 class="text-xl font-semibold mb-2 text-white">Интерактивная схема взаимодействия</h3>
            <p class="text-white/60 mb-6">
              Визуализация синхронной работы всех подразделений ESP для достижения «Эталона качества»
            </p>
            <svg viewBox="0 0 800 360" class="w-full h-auto max-h-[380px]">
              <defs>
                <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#006039" />
                  <stop offset="100%" stop-color="#002366" />
                </linearGradient>
              </defs>

              <!-- Connections: hub (ESP) to 4 departments -->
              <g stroke="url(#linkGrad)" stroke-width="1.5" fill="none" opacity="0.5">
                <line x1="400" y1="180" x2="150" y2="80" />
                <line x1="400" y1="180" x2="650" y2="80" />
                <line x1="400" y1="180" x2="150" y2="280" />
                <line x1="400" y1="180" x2="650" y2="280" />
              </g>

              <!-- Animated pulses travelling along connections -->
              <circle r="4" fill="#00D4FF">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M400,180 L150,80" />
              </circle>
              <circle r="4" fill="#00D4FF">
                <animateMotion dur="2.8s" repeatCount="indefinite" path="M400,180 L650,80" />
              </circle>
              <circle r="4" fill="#00D4FF">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M400,180 L150,280" />
              </circle>
              <circle r="4" fill="#00D4FF">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M400,180 L650,280" />
              </circle>

              <!-- Central ESP hub with vector logo -->
              <circle cx="400" cy="180" r="34" fill="white" />
              <circle cx="400" cy="180" r="34" fill="none" stroke="#00D4FF" stroke-width="1.5" opacity="0.6">
                <animate attributeName="r" values="34;46;34" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <g transform="translate(376, 165) scale(0.2)">
                <path d="M63.0562 1.29415C66.2988 4.75237 73.6844 12.9677 75.2426 17.0885C75.8406 18.671 76.4481 21.7646 73.9536 21.9386C71.7999 22.0887 71.3448 19.0047 70.6491 17.6391C70.1202 16.5999 69.1911 15.27 68.4787 14.3334C66.4465 11.6617 63.6947 9.12579 61.5838 6.45645L57.6694 11.5663C50.2599 29.0719 76.9818 26.4645 78.6018 42.3209C80.3458 59.4022 58.6129 65.9325 48.0395 54.1184L45.1972 50.5291C44.7088 50.5982 42.9624 52.8337 42.343 53.4081C29.5729 65.2152 9.53871 60.4938 2.45324 44.9854C-3.36714 32.2465 1.4526 16.8502 13.9082 10.3747C22.5375 5.88922 32.5868 7.24057 41.9785 7.40025C43.477 16.8335 41.5472 28.6072 34.2426 35.2805C29.4767 39.6339 23.2365 41.7799 16.8427 41.8132C15.5211 41.82 14.5739 40.6019 14.7912 39.2983C14.9634 38.2655 15.8243 37.491 16.8696 37.432C18.5252 37.3387 20.1784 37.2264 21.8084 36.8845C30.6538 35.0313 35.8414 28.031 37.5864 19.9074C38.5857 15.2555 34.4738 11.29 29.7183 11.4424C25.9921 11.5616 22.2635 11.7808 18.7184 13.0511C8.10447 16.8621 2.58904 27.8564 5.03108 38.8221C5.18393 39.5065 5.41556 40.1635 5.66802 40.813C5.93275 41.4941 7.17602 41.3764 7.25631 40.6501C7.83525 35.4378 10.1034 30.5424 13.7581 26.7887C17.1602 23.2923 22.0086 21.9219 26.1207 19.5124C27.4032 18.7596 28.5079 17.8111 29.7476 17.0235C29.954 16.8923 30.2207 16.9132 30.4096 17.0686C30.5299 17.1675 30.6074 17.3107 30.6115 17.4663C30.6595 19.2819 29.453 20.8557 28.3078 22.1793C24.341 26.7625 18.1013 26.8912 14.4323 32.8233C6.6178 45.4573 15.421 58.4989 30.0971 55.1932C35.9961 53.8657 39.7294 50.0858 43.2721 45.5169C43.988 44.5937 44.1633 43.2027 45.8366 43.2027C47.5099 43.2027 48.2491 46.0031 49.1831 47.967C51.3392 52.4977 57.2787 56.69 62.3891 55.1432C65.7079 54.1398 67.2041 50.1263 66.6585 46.9016C65.372 39.2988 49.8311 37.671 46.7267 27.7873C43.2459 16.7096 55.5085 8.13432 61.1097 0.233567L61.6005 0C61.8936 0 62.7441 0.960484 63.0562 1.29177V1.29415ZM52.204 18.6043C51.0557 18.9118 50.6221 21.7432 50.5458 22.7775C49.6453 34.7609 68.7503 34.3891 70.7325 45.679C71.1614 48.1243 70.6968 49.397 70.5443 51.6397C70.4609 52.8576 71.3448 51.8304 71.7093 51.3728C74.2967 48.1195 75.0948 42.8261 72.9435 39.1701C68.2262 31.1549 52.4018 30.2779 52.204 18.6019V18.6043Z" fill="#002366"/>
                <path d="M94.9361 58.0852C91.2242 62.0606 83.7123 60.0157 83.1286 54.2313C82.1184 44.2189 84.3722 32.7384 95.3435 29.7735C97.8427 29.0991 100.342 29.2873 102.727 28.8297C106.627 28.0838 107.632 22.8261 104.283 20.6406C102.477 19.4609 99.4533 19.8303 98.1453 21.6178C97.1113 23.0287 97.3067 25.872 96.468 26.6109C95.7485 27.2424 93.4161 27.3354 92.4035 27.6595C91.9652 20.7693 96.5443 13.9697 104.106 15.812C113.367 18.0714 112.831 31.6564 103.356 33.2723C101.54 33.5821 99.6129 33.2913 97.776 33.6393C93.0325 34.5378 89.0395 38.4274 87.9888 43.1369C87.4956 45.3534 87.2431 51.7527 87.6982 53.9382C88.1937 56.331 91.908 56.1237 92.3463 53.6975C93.3065 48.3564 89.8567 39.6048 97.3472 37.7363C101.4 36.7257 105.162 37.8674 109.128 35.7176C118.92 30.4123 117.21 14.9897 106.391 12.0868C103.556 11.3265 94.2595 11.3957 91.0836 11.6769C88.7417 11.8842 87.8673 13.1307 87.6457 15.383C87.6457 21.8854 87.6457 25.2918 87.6457 31.0605C85.0398 33.2998 83.3716 35.8695 83.3716 35.8695C83.3716 35.8695 83.3716 35.8695 83.1143 15.1327C83.4883 10.3684 86.6356 7.44647 91.3171 7.14617C94.7765 6.92452 99.763 6.93644 103.229 7.14617C124.14 8.41411 125.82 37.2453 106.443 41.3685C104.263 41.8332 98.3311 41.2088 97.29 42.6841C95.2172 45.6203 98.5527 54.2003 94.9313 58.078L94.9361 58.0852Z" fill="#002366"/>
              </g>

              <!-- Departments -->
              <g v-for="node in ecosystemNodes" :key="node.label">
                <circle :cx="node.x" :cy="node.y" r="26" fill="#002366" />
                <text :x="node.x" :y="node.y - 36" text-anchor="middle" fill="white" font-size="12" font-weight="600">{{ node.label }}</text>
                <text :x="node.x" :y="node.y + 5" text-anchor="middle" fill="white" font-size="16">{{ node.icon }}</text>
              </g>
            </svg>
            <p class="text-white/40 text-sm mt-4">30 000 синхронизированных элементов в едином цифровом контуре</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quality Standard Section -->
    <section id="quality" class="section quality bg-white" style="scroll-margin-top: 100px;">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">Эталон качества</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            Внутренний стандарт ESP, гарантирующий безупречный результат каждого проекта
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <!-- 5m Standard -->
          <div class="quality-card bg-esp-gray/50 p-8 text-center hover:shadow-lg transition-all duration-300 animate-on-scroll">
            <div class="quality-card__value text-5xl font-bold text-esp-green mb-4">5м</div>
            <h3 class="quality-card__title text-xl font-semibold mb-3">Кристальный просвет</h3>
            <p class="quality-card__desc text-esp-black/70">
              Стандарт чистоты воды, достигаемый благодаря синхронизации всех элементов системы
            </p>
          </div>
          
          <!-- Certifications -->
          <div class="quality-card bg-esp-gray/50 p-8 text-center hover:shadow-lg transition-all duration-300 animate-on-scroll" style="animation-delay: 0.1s">
            <Icon name="certificate" cls="w-12 h-12 mb-4 mx-auto text-esp-green" />
            <h3 class="quality-card__title text-xl font-semibold mb-3">Сертификации</h3>
            <p class="quality-card__desc text-esp-black/70">
              ISO 9001:2015, эко-сертификация, патенты на технологии очистки воды
            </p>
          </div>
          
          <!-- Guarantee -->
          <div class="quality-card bg-esp-gray/50 p-8 text-center hover:shadow-lg transition-all duration-300 animate-on-scroll" style="animation-delay: 0.2s">
            <Icon name="check" cls="w-12 h-12 mb-4 mx-auto text-esp-green" />
            <h3 class="quality-card__title text-xl font-semibold mb-3">Гарантия 100%</h3>
            <p class="quality-card__desc text-esp-black/70">
              Полная ответственность за результат и прозрачность всех процессов
            </p>
          </div>
        </div>
        
        <!-- Стандарты очистки: путь к кристальной чистоте (анимированная шкала) -->
        <div class="quality-infographic bg-esp-gray/50 p-8 md:p-10 animate-on-scroll">
          <div class="flex flex-col md:flex-row items-center gap-8 mb-10">
            <img src="/images/team/quality-standard.png" alt="Эталон качества ESP с 1998 года" class="w-40 h-40 object-contain flex-shrink-0" />
            <div>
              <h3 class="text-xl font-semibold mb-2">Стандарты очистки: путь к кристальной чистоте</h3>
              <p class="text-esp-black/60 text-sm">Каждый объект ESP проходит пять контролируемых стадий очистки — от механической фильтрации до финального УФ-обеззараживания.</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-3 relative">
            <div class="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-esp-black/20 via-esp-blue to-esp-blue/60"></div>
            <div v-for="(stage, i) in clarityStages" :key="stage.label" class="relative text-center animate-on-scroll" :style="{ animationDelay: `${i * 0.1}s` }">
              <div class="relative w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold" :style="{ backgroundColor: stage.color }">
                {{ i + 1 }}
                <span class="absolute inset-0 rounded-full animate-ping-slow" :style="{ backgroundColor: stage.color, opacity: 0.35 }"></span>
              </div>
              <div class="w-full h-2 bg-white overflow-hidden mb-3">
                <div class="h-full transition-all duration-1000" :style="{ width: stage.clarity + '%', backgroundColor: stage.color }"></div>
              </div>
              <h4 class="font-semibold text-sm text-esp-black mb-1">{{ stage.label }}</h4>
              <p class="text-xs text-esp-black/50">{{ stage.result }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Global Presence Section -->
    <section id="map" class="section global bg-esp-gray" style="scroll-margin-top: 100px;">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">Глобальное присутствие</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            Проекты по всему миру в партнёрстве с ведущими экспертными институтами
          </p>
        </div>
        
        <!-- Real map with all 12 project locations (interactive) -->
        <div class="global-map bg-white overflow-hidden shadow-2xl mb-12 animate-on-scroll">
          <ClientOnly>
            <ProjectsMap :points="mapPoints" class="w-full aspect-video" />
            <template #fallback>
              <div class="w-full aspect-video flex items-center justify-center text-esp-black/40 text-sm">Загрузка карты…</div>
            </template>
          </ClientOnly>
        </div>
        <p class="text-center text-esp-black/50 text-sm -mt-8 mb-12">
          150+ проектов в Беларуси, СНГ и Европе — <NuxtLink to="/projects" class="text-esp-blue hover:underline">смотреть полный список →</NuxtLink>
        </p>
        
        <!-- Partner Network -->
        <div class="partner-network text-center">
          <h3 class="text-xl font-semibold mb-8 animate-on-scroll">Партнёрская сеть и экспертные институты</h3>
          <div class="grid grid-cols-3 md:grid-cols-6 gap-6 animate-on-scroll" style="animation-delay: 0.1s">
            <div v-for="i in 6" :key="i" class="partner-logo aspect-[2/1] bg-white rounded-lg flex items-center justify-center text-esp-black/40 font-medium hover:bg-esp-blue hover:text-white transition-colors cursor-default shadow-sm">
              Партнёр {{ i }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews teaser -->
    <section class="section bg-esp-gray">
      <div class="container text-center">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Социальное доказательство
        </span>
        <h2 class="section__title mb-4 animate-on-scroll">Что говорят наши клиенты</h2>
        <p class="section__subtitle text-esp-black/70 max-w-2xl mx-auto mb-8 animate-on-scroll" style="animation-delay: 0.1s">
          Отзывы водоканалов, агрохолдингов и промышленных предприятий, доверивших нам очистку своих объектов
        </p>
        <NuxtLink to="/about/reviews" class="btn-primary inline-block">Читать отзывы клиентов →</NuxtLink>
      </div>
    </section>

    <!-- Media Center Section -->
    <section id="media" class="section media bg-white" style="scroll-margin-top: 100px;">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">Медиа-центр</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            Имиджевые материалы, закулисье проектов и пресс-кит для СМИ
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Brand Film -->
          <div class="media-card bg-esp-gray/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-on-scroll">
            <div class="media-card__thumbnail aspect-video relative overflow-hidden">
              <img src="/images/team/team-hero-2.png" alt="Имиджевый фильм ESP" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-esp-black/30 flex items-center justify-center">
                <div class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span class="text-esp-blue text-2xl ml-1">▶</span>
                </div>
              </div>
            </div>
            <div class="media-card__content p-6">
              <h3 class="media-card__title text-lg font-semibold mb-2">Имиджевый фильм бренда</h3>
              <p class="media-card__desc text-sm text-esp-black/70 mb-4">2-3 минуты о миссии, ценностях и пути ESP</p>
              <span class="text-xs text-esp-black/50 flex items-center gap-1"><Icon name="clock" cls="w-3.5 h-3.5" />2-3 мин</span>
            </div>
          </div>

          <!-- Backstage -->
          <div class="media-card bg-esp-gray/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-on-scroll" style="animation-delay: 0.1s">
            <div class="media-card__thumbnail aspect-video overflow-hidden">
              <img src="/images/team/team-at-work.png" alt="Backstage ESP" class="w-full h-full object-cover" />
            </div>
            <div class="media-card__content p-6">
              <h3 class="media-card__title text-lg font-semibold mb-2">Backstage: как создаются проекты</h3>
              <p class="media-card__desc text-sm text-esp-black/70 mb-4">Закулисье реализации масштабных объектов</p>
              <span class="text-xs text-esp-black/50 flex items-center gap-1"><Icon name="camera" cls="w-3.5 h-3.5" />Фото + Видео</span>
            </div>
          </div>

          <!-- Press Kit -->
          <div class="media-card bg-esp-gray/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-on-scroll" style="animation-delay: 0.2s">
            <div class="media-card__thumbnail aspect-video bg-gradient-to-br from-esp-blue/20 via-esp-black/10 to-esp-blue/40 flex items-center justify-center relative">
              <Icon name="folder" cls="w-14 h-14 text-esp-blue" />
            </div>
            <div class="media-card__content p-6">
              <h3 class="media-card__title text-lg font-semibold mb-2">Пресс-кит для скачивания</h3>
              <p class="media-card__desc text-sm text-esp-black/70 mb-4">Логотипы, фото, брендбук, презентации</p>
              <span class="text-xs text-esp-black/50 flex items-center gap-1"><Icon name="download" cls="w-3.5 h-3.5" />PDF + ZIP</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta relative overflow-hidden" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full" style="background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%); animation: rotate 20s linear infinite" />
      </div>
      
      <div class="container relative z-10 text-center text-white">
        <h2 class="cta__title mb-6 animate-on-scroll">Готовы создать Эталон качества?</h2>
        <p class="cta__desc text-lg opacity-95 mb-10 max-w-2xl mx-auto animate-on-scroll">
          Обсудим ваш проект, подготовим индивидуальное решение и покажем, как синергия опыта и технологий приведёт к кристальному результату
        </p>
        <div class="cta__actions flex flex-wrap justify-center gap-4 animate-on-scroll">
          <RouterLink to="/contacts" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition">Обсудить проект</RouterLink>
          <RouterLink to="/projects" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition">Посмотреть кейсы</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectGeo } from '~/composables/useProjectGeo'

const { mapPoints } = useProjectGeo()

useHead({
  title: 'О компании ESP | EcoServiceProject — 25 лет опыта, 30 000 элементов',
  meta: [
    {
      name: 'description',
      content: 'История EcoServiceProject с 1999 года. Семейное дело: опыт отца и технологии сына. Таймлайн 25 лет, сертификаты качества, экосистема Brain & Body.'
    },
    { property: 'og:title', content: 'О компании ESP | 25 лет опыта' },
    { property: 'og:description', content: 'История EcoServiceProject с 1999 года: экосистема инжиниринга и производства, сертификаты качества, глобальное присутствие.' },
    { property: 'og:image', content: 'https://ecoservisproekt.com/images/team/quality-standard.png' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.com/about' }]
})

const router = useRouter()
const brandVideo = ref(null)

// ===== Timeline: год + анимированная карточка =====
const timelineEvents = [
  { year: 1999, title: 'Основание компании', desc: 'Начало пути. Первые проекты в сфере очистки воды. Формирование команды единомышленников.' },
  { year: 2010, title: 'Расширение производства', desc: 'Запуск собственного производства «Экомашины». Локализация ключевых узлов и компонентов.' },
  { year: 2018, title: 'Преемственность поколений', desc: 'Сын присоединяется к бизнесу. Синергия опыта отца-основателя и инновационного видения нового поколения.' },
  { year: 2022, title: 'Цифровая трансформация', desc: 'Внедрение 3D-проектирования и лидарного сканирования. Переход к интеллектуальному инжинирингу.' },
  { year: 2026, title: 'Эталон качества', desc: '100+ экспертов. 30 000 синхронизированных элементов. Кристальный просвет воды 5 метров.' }
]
const activeYearIndex = ref(timelineEvents.length - 1)

// ===== Стандарты очистки: 5 стадий =====
const clarityStages = [
  { label: 'Механическая', result: 'Взвеси −90%', clarity: 20, color: '#002366' },
  { label: 'Биологическая', result: 'БПК до 10 мг/л', clarity: 45, color: '#004B87' },
  { label: 'Физико-химическая', result: 'Фосфор < 0.5 мг/л', clarity: 65, color: '#00688A' },
  { label: 'Мембранная', result: 'Прозрачность 5 м', clarity: 88, color: '#006039' },
  { label: 'УФ-обеззараживание', result: '99.99% дезинфекция', clarity: 100, color: '#00A86B' }
]

// ===== Ecosystem network scheme nodes =====
const ecosystemNodes = [
  { x: 150, y: 80, label: 'Проектирование', icon: '📐' },
  { x: 650, y: 80, label: 'Производство', icon: '⚙️' },
  { x: 150, y: 280, label: 'Монтаж', icon: '🔧' },
  { x: 650, y: 280, label: 'Контроль / КИПиА', icon: '📡' }
]

// ===== VIDEO PLACEHOLDER (замените на реальные пути после съёмки) =====
const videoUrl = ref('/videos/esp-brand-film.mp4')
const videoPoster = ref('/images/hero-bg.jpg')

const scrollToHistory = () => {
  document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })
}

// Scroll animations
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, { threshold: 0.1 })
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
  
  // Add CSS animations
  const style = document.createElement('style')
  style.textContent = `
    @keyframes scroll {
      0% { opacity: 0; transform: translateX(-50%) translateY(0); }
      50% { opacity: 1; }
      100% { opacity: 0; transform: translateX(-50%) translateY(12px); }
    }
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
    }
    @keyframes ping-slow {
      0% { transform: scale(1); opacity: 0.4; }
      75%, 100% { transform: scale(1.6); opacity: 0; }
    }
    .animate-scroll { animation: scroll 1.5s infinite; }
    .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
    .animate-ping-slow { animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
    .fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
    .fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
    .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-on-scroll.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `
  document.head.appendChild(style)
})
</script>

<style scoped>
/* ===== CONTAINER ===== */
.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ===== SECTIONS ===== */
.section {
  padding: 5rem 0;
}

.section__title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
}

.section__subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
}

/* ===== HERO VIDEO ===== */
.hero-video__bg {
  z-index: 0;
}

.hero-video__bg video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-video__overlay {
  z-index: 1;
}

.hero-video__pattern {
  z-index: 1;
  background-image: 
    radial-gradient(ellipse at 20% 80%, rgba(0,96,57,0.15) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 20%, rgba(0,35,102,0.15) 0%, transparent 40%);
  pointer-events: none;
}

.hero-video__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.1;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.hero-video__subtitle {
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
}

.hero-video__scroll {
  z-index: 10;
}

/* ===== TIMELINE ===== */
.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline__line {
  z-index: 0;
}

@media (max-width: 768px) {
  .timeline__line {
    left: 20px !important;
  }
  
  .timeline__item {
    grid-template-columns: 1fr !important;
  }
  
  .timeline__content {
    text-align: left !important;
    padding-left: 50px !important;
  }
  
  .timeline__marker {
    left: 20px !important;
    transform: translateX(-50%) !important;
  }
}

.timeline__year {
  font-size: 1.25rem;
}

.timeline__title {
  font-size: 1.25rem;
}

.timeline__desc {
  font-size: 0.95rem;
}

/* ===== BRAIN & BODY ===== */
.brain-card,
.body-card {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.brain-card:hover,
.body-card:hover {
  border-color: rgba(0, 96, 57, 0.2);
}

.brain-card__list li,
.body-card__list li {
  font-size: 0.95rem;
}

/* ===== QUALITY ===== */
.quality-card {
  border: 1px solid transparent;
}

.quality-card:hover {
  border-color: rgba(0, 96, 57, 0.2);
}

.quality-card__value {
  font-family: 'SF Pro Rounded', sans-serif;
}

/* ===== GLOBAL ===== */
.global-map {
  position: relative;
}

.map-placeholder {
  min-height: 400px;
}

.partner-logo {
  border: 1px solid rgba(237, 237, 237, 0.5);
}

/* ===== MEDIA ===== */
.media-card {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.media-card:hover {
  border-color: rgba(0, 96, 57, 0.2);
  transform: translateY(-4px);
}

.media-card__thumbnail {
  position: relative;
}

/* ===== CTA ===== */
.cta {
  position: relative;
  overflow: hidden;
}

/* ===== ANIMATIONS ===== */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .section {
    padding: 3rem 0;
  }
  
  .hero-video__title {
    font-size: 2rem;
  }
  
  .hero-video__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-video__actions .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}

/* ===== PAGE WIDTH FIX ===== */
.about-page {
  width: 100%;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}
</style>
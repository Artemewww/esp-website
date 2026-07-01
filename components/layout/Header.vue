<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'glass border-b border-gray-200' : 'bg-transparent'"
  >
    <div class="max-w-[1600px] mx-auto px-6">
      <div class="flex items-center justify-between h-20">
        
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center flex-shrink-0">
          <svg width="120" height="41" viewBox="0 0 120 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M63.0562 1.29415C66.2988 4.75237 73.6844 12.9677 75.2426 17.0885C75.8406 18.671 76.4481 21.7646 73.9536 21.9386C71.7999 22.0887 71.3448 19.0047 70.6491 17.6391C70.1202 16.5999 69.1911 15.27 68.4787 14.3334C66.4465 11.6617 63.6947 9.12579 61.5838 6.45645L57.6694 11.5663C50.2599 29.0719 76.9818 26.4645 78.6018 42.3209C80.3458 59.4022 58.6129 65.9325 48.0395 54.1184L45.1972 50.5291C44.7088 50.5982 42.9624 52.8337 42.343 53.4081C29.5729 65.2152 9.53871 60.4938 2.45324 44.9854C-3.36714 32.2465 1.4526 16.8502 13.9082 10.3747C22.5375 5.88922 32.5868 7.24057 41.9785 7.40025C43.477 16.8335 41.5472 28.6072 34.2426 35.2805C29.4767 39.6339 23.2365 41.7799 16.8427 41.8132C15.5211 41.82 14.5739 40.6019 14.7912 39.2983C14.9634 38.2655 15.8243 37.491 16.8696 37.432C18.5252 37.3387 20.1784 37.2264 21.8084 36.8845C30.6538 35.0313 35.8414 28.031 37.5864 19.9074C38.5857 15.2555 34.4738 11.29 29.7183 11.4424C25.9921 11.5616 22.2635 11.7808 18.7184 13.0511C8.10447 16.8621 2.58904 27.8564 5.03108 38.8221C5.18393 39.5065 5.41556 40.1635 5.66802 40.813C5.93275 41.4941 7.17602 41.3764 7.25631 40.6501C7.83525 35.4378 10.1034 30.5424 13.7581 26.7887C17.1602 23.2923 22.0086 21.9219 26.1207 19.5124C27.4032 18.7596 28.5079 17.8111 29.7476 17.0235C29.954 16.8923 30.2207 16.9132 30.4096 17.0686C30.5299 17.1675 30.6074 17.3107 30.6115 17.4663C30.6595 19.2819 29.453 20.8557 28.3078 22.1793C24.341 26.7625 18.1013 26.8912 14.4323 32.8233C6.6178 45.4573 15.421 58.4989 30.0971 55.1932C35.9961 53.8657 39.7294 50.0858 43.2721 45.5169C43.988 44.5937 44.1633 43.2027 45.8366 43.2027C47.5099 43.2027 48.2491 46.0031 49.1831 47.967C51.3392 52.4977 57.2787 56.69 62.3891 55.1432C65.7079 54.1398 67.2041 50.1263 66.6585 46.9016C65.372 39.2988 49.8311 37.671 46.7267 27.7873C43.2459 16.7096 55.5085 8.13432 61.1097 0.233567L61.6005 0C61.8936 0 62.7441 0.960484 63.0562 1.29177V1.29415ZM52.204 18.6043C51.0557 18.9118 50.6221 21.7432 50.5458 22.7775C49.6453 34.7609 68.7503 34.3891 70.7325 45.679C71.1614 48.1243 70.6968 49.397 70.5443 51.6397C70.4609 52.8576 71.3448 51.8304 71.7093 51.3728C74.2967 48.1195 75.0948 42.8261 72.9435 39.1701C68.2262 31.1549 52.4018 30.2779 52.204 18.6019V18.6043Z" fill="#002366"/>
            <path d="M94.9361 58.0852C91.2242 62.0606 83.7123 60.0157 83.1286 54.2313C82.1184 44.2189 84.3722 32.7384 95.3435 29.7735C97.8427 29.0991 100.342 29.2873 102.727 28.8297C106.627 28.0838 107.632 22.8261 104.283 20.6406C102.477 19.4609 99.4533 19.8303 98.1453 21.6178C97.1113 23.0287 97.3067 25.872 96.468 26.6109C95.7485 27.2424 93.4161 27.3354 92.4035 27.6595C91.9652 20.7693 96.5443 13.9697 104.106 15.812C113.367 18.0714 112.831 31.6564 103.356 33.2723C101.54 33.5821 99.6129 33.2913 97.776 33.6393C93.0325 34.5378 89.0395 38.4274 87.9888 43.1369C87.4956 45.3534 87.2431 51.7527 87.6982 53.9382C88.1937 56.331 91.908 56.1237 92.3463 53.6975C93.3065 48.3564 89.8567 39.6048 97.3472 37.7363C101.4 36.7257 105.162 37.8674 109.128 35.7176C118.92 30.4123 117.21 14.9897 106.391 12.0868C103.556 11.3265 94.2595 11.3957 91.0836 11.6769C88.7417 11.8842 87.8673 13.1307 87.6457 15.383C87.6457 21.8854 87.6457 25.2918 87.6457 31.0605C85.0398 33.2998 83.3716 35.8695 83.3716 35.8695C83.3716 35.8695 83.3716 35.8695 83.1143 15.1327C83.4883 10.3684 86.6356 7.44647 91.3171 7.14617C94.7765 6.92452 99.763 6.93644 103.229 7.14617C124.14 8.41411 125.82 37.2453 106.443 41.3685C104.263 41.8332 98.3311 41.2088 97.29 42.6841C95.2172 45.6203 98.5527 54.2003 94.9313 58.078L94.9361 58.0852Z" fill="#002366"/>
          </svg>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden xl:flex items-center space-x-1">
          
          <!-- О компании (Mega Menu) -->
          <div 
            class="relative group" 
            @mouseenter="activeMenu = 'about'" 
            @mouseleave="activeMenu = null"
          >
            <NuxtLink to="/about" class="nav-link flex items-center gap-1" :class="{ 'nav-link-active': isActive('/about') }">
              <span>О компании</span>
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </NuxtLink>
            
            <div v-show="activeMenu === 'about'" class="absolute top-full left-0 pt-4 w-[900px]">
              <div class="glass rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div class="grid grid-cols-2 gap-0">
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Наследие и Видение</h4>
                    <NuxtLink to="/about#history" class="mega-link">
                      <div class="font-medium text-esp-black">Наша история</div>
                      <div class="text-sm text-gray-600">Таймлайн 1999→2026, преемственность поколений</div>
                    </NuxtLink>
                    <NuxtLink to="/about#ecosystem" class="mega-link">
                      <div class="font-medium text-esp-black">Мозг и Тело: Экосистема ESP</div>
                      <div class="text-sm text-gray-600">Инжиниринг + Производство</div>
                    </NuxtLink>
                    <NuxtLink to="/about#quality" class="mega-link">
                      <div class="font-medium text-esp-black">Эталон качества</div>
                      <div class="text-sm text-gray-600">Стандарты, сертификации, гарантия 100%</div>
                    </NuxtLink>
                  </div>
                  <div class="p-6">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Глобальное присутствие</h4>
                    <NuxtLink to="/about#map" class="mega-link">
                      <div class="font-medium text-esp-black">Карта проектов</div>
                      <div class="text-sm text-gray-600">Беларусь и СНГ с фильтрами</div>
                    </NuxtLink>
                    <NuxtLink to="/about#media" class="mega-link">
                      <div class="font-medium text-esp-black">Медиа-центр</div>
                      <div class="text-sm text-gray-600">Имиджевый фильм, Backstage, пресс-кит</div>
                    </NuxtLink>
                    <NuxtLink to="/partners" class="mega-link">
                      <div class="font-medium text-esp-black">Партнёры</div>
                      <div class="text-sm text-gray-600">Экосистема поставщиков и интеграторов</div>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Услуги и Экспертиза (Mega Menu) -->
          <div 
            class="relative group" 
            @mouseenter="activeMenu = 'services'" 
            @mouseleave="activeMenu = null"
          >
            <NuxtLink to="/services" class="nav-link flex items-center gap-1" :class="{ 'nav-link-active': isActive('/services') }">
              <span>Услуги</span>
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </NuxtLink>
            
            <div v-show="activeMenu === 'services'" class="absolute top-full left-0 pt-4 w-[1200px]">
              <div class="glass rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div class="grid grid-cols-4 gap-0">
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Проектирование</h4>
                    <NuxtLink to="/services/designing-of-treatment-facilities" class="mega-link">
                      <div class="font-medium text-esp-black">Очистные сооружения</div>
                      <div class="text-sm text-gray-600">3D/BIM, LiDAR-сканирование</div>
                    </NuxtLink>
                    <NuxtLink to="/services/design-of-engineering-networks" class="mega-link">
                      <div class="font-medium text-esp-black">Инженерные сети</div>
                      <div class="text-sm text-gray-600">Водоснабжение и канализация</div>
                    </NuxtLink>
                    <NuxtLink to="/services/design" class="mega-link">
                      <div class="font-medium text-esp-black">Проектная документация</div>
                    </NuxtLink>
                  </div>
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Производство и монтаж</h4>
                    <NuxtLink to="/services/production" class="mega-link">Производство оборудования</NuxtLink>
                    <NuxtLink to="/services/installation" class="mega-link">Монтаж под ключ</NuxtLink>
                    <NuxtLink to="/services/start" class="mega-link">Пусконаладочные работы</NuxtLink>
                  </div>
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Поддержка</h4>
                    <NuxtLink to="/services/service" class="mega-link">
                      <div class="font-medium text-esp-black">Сервисное обслуживание</div>
                      <div class="text-sm text-gray-600">Плановое ТО, диагностика</div>
                    </NuxtLink>
                    <NuxtLink to="/services/repair" class="mega-link">
                      <div class="font-medium text-esp-black">Ремонт оборудования</div>
                    </NuxtLink>
                    <NuxtLink to="/services/support" class="mega-link">
                      <div class="font-medium text-esp-blue">24/7 Техподдержка</div>
                      <div class="text-sm text-gray-600">SLA 4 часа</div>
                    </NuxtLink>
                  </div>
                  <div class="p-6 bg-esp-gray/40">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Процесс «под ключ»</h4>
                    <NuxtLink
                      v-for="stage in turnkeyStagesList"
                      :key="stage.slug"
                      :to="`/services/process/${stage.slug}`"
                      class="mega-link !py-1.5 flex items-center gap-2"
                    >
                      <span class="text-xs font-mono text-esp-blue">{{ stage.num }}</span>
                      <span class="text-sm">{{ stage.title }}</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Проекты (Mega Menu) -->
          <div 
            class="relative group" 
            @mouseenter="activeMenu = 'projects'" 
            @mouseleave="activeMenu = null"
          >
            <NuxtLink to="/projects" class="nav-link flex items-center gap-1" :class="{ 'nav-link-active': isActive('/projects') }">
              <span>Проекты</span>
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </NuxtLink>
            
            <div v-show="activeMenu === 'projects'" class="absolute top-full left-0 pt-4 w-[800px]">
              <div class="glass rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div class="grid grid-cols-2 gap-0">
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Кейсы</h4>
                    <NuxtLink to="/projects#cases" class="mega-link">
                      <div class="font-medium text-esp-black">Все проекты</div>
                      <div class="text-sm text-gray-600">С фильтрами по отрасли, региону, году</div>
                    </NuxtLink>
                    <NuxtLink to="/projects#map" class="mega-link">
                      <div class="font-medium text-esp-black">Интерактивная карта</div>
                      <div class="text-sm text-gray-600">География ESP в Беларуси и СНГ</div>
                    </NuxtLink>
                  </div>
                  <div class="p-6">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Доказательство результата</h4>
                    <NuxtLink to="/projects#metrics" class="mega-link">
                      <div class="font-medium text-esp-black">Метрики было/стало</div>
                      <div class="text-sm text-gray-600">Интерактивные графики, цифры</div>
                    </NuxtLink>
                    <NuxtLink to="/projects#export" class="mega-link">
                      <div class="font-medium text-esp-blue">Скачать кейс в PDF</div>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Технологии (Mega Menu) -->
          <div 
            class="relative group" 
            @mouseenter="activeMenu = 'tech'" 
            @mouseleave="activeMenu = null"
          >
            <NuxtLink to="/technologies" class="nav-link flex items-center gap-1" :class="{ 'nav-link-active': isActive('/technologies') }">
              <span>Технологии</span>
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </NuxtLink>
            
            <div v-show="activeMenu === 'tech'" class="absolute top-full left-0 pt-4 w-[900px]">
              <div class="glass rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div class="grid grid-cols-3 gap-0">
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Очистка воды</h4>
                    <NuxtLink to="/technologies/mechanical-filtration" class="mega-link">Механическая фильтрация</NuxtLink>
                    <NuxtLink to="/technologies/biological-treatment" class="mega-link">Биологическая очистка</NuxtLink>
                    <NuxtLink to="/technologies/physiochemical-methods" class="mega-link">Физико-химические методы</NuxtLink>
                    <NuxtLink to="/technologies/membrane-filtration" class="mega-link">Мембранные технологии</NuxtLink>
                    <NuxtLink to="/technologies/uv-disinfection" class="mega-link">УФ-обеззараживание</NuxtLink>
                  </div>
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Цифровые инструменты</h4>
                    <NuxtLink to="/technologies#lidar" class="mega-link">Лидарное сканирование</NuxtLink>
                    <NuxtLink to="/technologies#3d" class="mega-link">3D-проектирование</NuxtLink>
                    <NuxtLink to="/technologies#digital-twin" class="mega-link">Цифровые двойники</NuxtLink>
                  </div>
                  <div class="p-6">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Инновации</h4>
                    <NuxtLink to="/technologies#eco" class="mega-link">Экологические инновации</NuxtLink>
                    <NuxtLink to="/technologies#lab" class="mega-link">Лаборатория и контроль</NuxtLink>
                    <NuxtLink to="/technologies#tour" class="mega-link">Виртуальный тур 360°</NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Оборудование (Mega Menu) -->
          <div 
            class="relative group" 
            @mouseenter="activeMenu = 'equipment'" 
            @mouseleave="activeMenu = null"
          >
            <NuxtLink to="/equipment" class="nav-link flex items-center gap-1" :class="{ 'nav-link-active': isActive('/equipment') }">
              <span>Оборудование</span>
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </NuxtLink>
            
            <div v-show="activeMenu === 'equipment'" class="absolute top-full left-0 pt-4 w-[1000px]">
              <div class="glass rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div class="grid grid-cols-3 gap-0">
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Категории</h4>
                    <NuxtLink to="/equipment#pumps" class="mega-link">Насосные станции</NuxtLink>
                    <NuxtLink to="/equipment#filters" class="mega-link">Фильтры и мембраны</NuxtLink>
                    <NuxtLink to="/equipment#reactors" class="mega-link">Реакторы и биоблоки</NuxtLink>
                    <NuxtLink to="/equipment#control" class="mega-link">Системы автоматизации</NuxtLink>
                  </div>
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Для проектировщиков</h4>
                    <NuxtLink to="/equipment#bim" class="mega-link">BIM/CAD модели</NuxtLink>
                    <NuxtLink to="/equipment#calculator" class="mega-link">Калькулятор подбора</NuxtLink>
                    <NuxtLink to="/equipment#specs" class="mega-link">Генератор спецификаций</NuxtLink>
                    <NuxtLink to="/equipment/compare" class="mega-link">Сравнение оборудования</NuxtLink>
                  </div>
                  <div class="p-6">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Сервис</h4>
                    <NuxtLink to="/equipment#support" class="mega-link">Гарантия и обслуживание</NuxtLink>
                    <NuxtLink to="/equipment#parts" class="mega-link">Запасные части</NuxtLink>
                    <NuxtLink to="/equipment#docs" class="mega-link">Техническая документация</NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Команда и Карьера -->
          <div 
            class="relative group" 
            @mouseenter="activeMenu = 'team'" 
            @mouseleave="activeMenu = null"
          >
            <NuxtLink to="/team" class="nav-link flex items-center gap-1" :class="{ 'nav-link-active': isActive('/team') }">
              <span>Команда</span>
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </NuxtLink>
            
            <div v-show="activeMenu === 'team'" class="absolute top-full left-0 pt-4 w-[700px]">
              <div class="glass rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div class="grid grid-cols-2 gap-0">
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">О нас</h4>
                    <NuxtLink to="/team#experts" class="mega-link">
                      <div class="font-medium text-esp-black">Наши эксперты</div>
                      <div class="text-sm text-gray-600">Портреты лидеров, структура</div>
                    </NuxtLink>
                    <NuxtLink to="/team#culture" class="mega-link">
                      <div class="font-medium text-esp-black">Культура «МЫ»</div>
                      <div class="text-sm text-gray-600">Ценности, традиции, преемственность</div>
                    </NuxtLink>
                  </div>
                  <div class="p-6">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Карьера</h4>
                    <NuxtLink to="/team#vacancies" class="mega-link">Вакансии</NuxtLink>
                    <NuxtLink to="/team#internship" class="mega-link">Стажировки</NuxtLink>
                    <NuxtLink to="/team#apply" class="mega-link">
                      <div class="font-medium text-esp-blue">Стать частью команды</div>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ресурсы и Блог -->
          <div 
            class="relative group" 
            @mouseenter="activeMenu = 'resources'" 
            @mouseleave="activeMenu = null"
          >
            <NuxtLink to="/resources" class="nav-link flex items-center gap-1" :class="{ 'nav-link-active': isActive('/resources') }">
              <span>Ресурсы</span>
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </NuxtLink>
            
            <div v-show="activeMenu === 'resources'" class="absolute top-full left-0 pt-4 w-[800px]">
              <div class="glass rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div class="grid grid-cols-2 gap-0">
                  <div class="p-6 border-r border-gray-200">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Контент</h4>
                    <NuxtLink to="/resources#blog" class="mega-link">Блог и аналитика</NuxtLink>
                    <NuxtLink to="/resources#library" class="mega-link">Библиотека знаний</NuxtLink>
                    <NuxtLink to="/resources#faq" class="mega-link">FAQ и поддержка</NuxtLink>
                  </div>
                  <div class="p-6">
                    <h4 class="font-bold text-esp-black mb-4 font-rounded text-sm uppercase tracking-wider">Инструменты</h4>
                    <NuxtLink to="/resources#calculator" class="mega-link">Калькулятор очистки</NuxtLink>
                    <NuxtLink to="/resources#test" class="mega-link">Тест готовности объекта</NuxtLink>
                    <NuxtLink to="/resources#subscribe" class="mega-link">Подписка на новости</NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Вебинары -->
          <NuxtLink to="/webinars" class="nav-link" :class="{ 'nav-link-active': isActive('/webinars') }">
            Вебинары
          </NuxtLink>

          <!-- Контакты -->
          <NuxtLink to="/contacts" class="nav-link" :class="{ 'nav-link-active': isActive('/contacts') }">
            Контакты
          </NuxtLink>
        </nav>

        <!-- Utility Icons -->
        <div class="hidden xl:flex items-center space-x-4">
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-esp-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1">
            <svg class="w-5 h-5 text-esp-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
            <span class="text-sm font-medium text-esp-black">RU</span>
          </button>
          
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-esp-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </button>
          
          <NuxtLink to="/contacts" class="btn-primary ml-4">
            Заказать аудит
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="xl:hidden p-2">
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="mobileMenuOpen" class="xl:hidden glass border-t border-gray-200 max-h-[80vh] overflow-y-auto">
      <div class="px-6 py-4 space-y-2">
        
        <!-- Mobile Accordions for each section -->
        <div v-for="section in mobileMenuSections" :key="section.id">
          <button 
            @click="mobileOpen = mobileOpen === section.id ? null : section.id" 
            class="mobile-nav-link"
          >
            <div class="flex items-center justify-between w-full">
              <!-- Text aligned left -->
              <span class="text-left flex-1">{{ section.title }}</span>
              <!-- Arrow aligned right, same vertical level -->
              <svg 
                class="w-5 h-5 flex-shrink-0 transition-transform duration-300" 
                :class="{ 'rotate-180': mobileOpen === section.id }" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </button>
          <div v-show="mobileOpen === section.id" class="pl-4 mt-2 space-y-2">
            <NuxtLink 
              v-for="item in section.items" 
              :key="item.to"
              :to="item.to" 
              class="mobile-sublink text-left"
              @click="mobileMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile CTA -->
        <div class="pt-4 mt-4 border-t border-gray-200">
          <NuxtLink to="/contacts" class="btn-primary w-full block text-center">
            Заказать технический аудит
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { turnkeyStagesList } from '~/composables/useTurnkeyProcess'

const route = useRoute()
const isActive = (path) => route.path === path || route.path.startsWith(path + '/')

const scrolled = ref(false)
const activeMenu = ref(null)
const mobileMenuOpen = ref(false)
const mobileOpen = ref(null)

const mobileMenuSections = [
  {
    id: 'about',
    title: 'О компании',
    items: [
      { to: '/about#history', label: 'Наша история' },
      { to: '/about#ecosystem', label: 'Мозг и Тело: Экосистема' },
      { to: '/about#quality', label: 'Эталон качества' },
      { to: '/about#map', label: 'Карта проектов' },
      { to: '/about#media', label: 'Медиа-центр' },
      { to: '/partners', label: 'Партнёры' }
    ]
  },
  {
    id: 'services',
    title: 'Услуги и Экспертиза',
    items: [
      { to: '/services/designing-of-treatment-facilities', label: 'Очистные сооружения' },
      { to: '/services/design-of-engineering-networks', label: 'Инженерные сети' },
      { to: '/services/design', label: 'Проектная документация' },
      { to: '/services/production', label: 'Производство оборудования' },
      { to: '/services/installation', label: 'Монтаж под ключ' },
      { to: '/services/start', label: 'Пусконаладочные работы' },
      { to: '/services/service', label: 'Сервисное обслуживание' },
      { to: '/services/repair', label: 'Ремонт оборудования' },
      { to: '/services/support', label: '24/7 Техподдержка' },
      { to: '/services/process/idea-audit', label: 'Процесс «под ключ» (7 этапов)' }
    ]
  },
  {
    id: 'projects',
    title: 'Проекты и Кейсы',
    items: [
      { to: '/projects#cases', label: 'Все проекты' },
      { to: '/projects#map', label: 'Интерактивная карта' },
      { to: '/projects#metrics', label: 'Метрики было/стало' }
    ]
  },
  {
    id: 'tech',
    title: 'Технологии',
    items: [
      { to: '/technologies/mechanical-filtration', label: 'Механическая фильтрация' },
      { to: '/technologies/biological-treatment', label: 'Биологическая очистка' },
      { to: '/technologies/membrane-filtration', label: 'Мембранные технологии' },
      { to: '/technologies#lidar', label: 'Лидарное сканирование' },
      { to: '/technologies#3d', label: '3D-проектирование' },
      { to: '/technologies#digital-twin', label: 'Цифровые двойники' },
      { to: '/technologies#eco', label: 'Экологические инновации' }
    ]
  },
  {
    id: 'equipment',
    title: 'Оборудование',
    items: [
      { to: '/equipment#pumps', label: 'Насосные станции' },
      { to: '/equipment#filters', label: 'Фильтры и мембраны' },
      { to: '/equipment#bim', label: 'BIM/CAD модели' },
      { to: '/equipment#calculator', label: 'Калькулятор подбора' },
      { to: '/equipment/compare', label: 'Сравнение оборудования' }
    ]
  },
  {
    id: 'team',
    title: 'Команда и Карьера',
    items: [
      { to: '/team#experts', label: 'Наши эксперты' },
      { to: '/team#vacancies', label: 'Вакансии' },
      { to: '/team#internship', label: 'Стажировки' }
    ]
  },
  {
    id: 'resources',
    title: 'Ресурсы и Блог',
    items: [
      { to: '/resources#blog', label: 'Блог и аналитика' },
      { to: '/resources#library', label: 'Библиотека знаний' },
      { to: '/resources#faq', label: 'FAQ и поддержка' }
    ]
  },
  {
    id: 'webinars',
    title: 'Вебинары и события',
    items: [
      { to: '/webinars', label: 'Календарь событий' }
    ]
  },
  {
    id: 'contacts',
    title: 'Контакты',
    items: [
      { to: '/contacts', label: 'Связаться с нами' }
    ]
  }
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.nav-link {
  @apply px-4 py-2 text-esp-black hover:text-esp-blue transition-colors font-medium font-inter text-sm whitespace-nowrap relative;
}

.nav-link-active {
  @apply text-esp-blue;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: -2px;
  height: 2px;
  background: #002366;
  border-radius: 2px;
}

.mega-link {
  @apply block px-4 py-3 hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-esp-blue rounded-r-lg;
}

.mobile-nav-link {
  @apply block px-4 py-3 text-esp-black hover:text-esp-blue hover:bg-gray-50 transition-colors font-medium font-inter w-full;
}

.mobile-sublink {
  @apply block px-4 py-2 text-sm text-gray-700 hover:text-esp-blue hover:bg-gray-100 transition-colors rounded text-left;
}

.glass {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.btn-primary {
  @apply bg-esp-blue text-white px-6 py-2.5 rounded-none font-medium transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg whitespace-nowrap;
}
</style>
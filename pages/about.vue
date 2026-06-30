<template>
  <div class="about-page">
    <!-- Hero Video Section (Full Screen Brand Film) -->
    <section class="hero-video relative min-h-screen flex items-center justify-center overflow-hidden">
      
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
          <div class="hero-video__badge inline-flex items-center gap-2 px-4 py-2 bg-esp-green/20 backdrop-blur-sm text-esp-green rounded-full font-semibold text-sm mb-6 animate-on-scroll border border-esp-green/30">
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
            <a href="#brain-body" class="btn-primary">
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
        
        <!-- Interactive Timeline -->
        <div class="timeline relative max-w-5xl mx-auto">
          <!-- Timeline Line -->
          <div class="timeline__line absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-esp-blue via-esp-green to-esp-blue transform -translate-x-1/2" />
          
          <!-- Timeline Items -->
          <div class="timeline__items space-y-16">
            
            <!-- 1999 -->
            <div class="timeline__item relative grid md:grid-cols-2 gap-8 items-center animate-on-scroll">
              <div class="timeline__content md:text-right order-2 md:order-1">
                <span class="timeline__year text-esp-green font-bold text-xl mb-2 block">1999</span>
                <h3 class="timeline__title text-xl font-semibold mb-3">Основание компании</h3>
                <p class="timeline__desc text-esp-black/70">
                  Начало пути. Первые проекты в сфере очистки воды. Формирование команды единомышленников.
                </p>
              </div>
              <div class="timeline__marker order-1 md:order-2 flex justify-center">
                <div class="w-4 h-4 rounded-full bg-esp-green border-4 border-white shadow-lg" />
              </div>
              <div class="order-3 md:order-3" />
            </div>
            
            <!-- 2010 -->
            <div class="timeline__item relative grid md:grid-cols-2 gap-8 items-center animate-on-scroll" style="animation-delay: 0.1s">
              <div class="order-1" />
              <div class="timeline__marker order-2 flex justify-center">
                <div class="w-4 h-4 rounded-full bg-esp-blue border-4 border-white shadow-lg" />
              </div>
              <div class="timeline__content order-3">
                <span class="timeline__year text-esp-blue font-bold text-xl mb-2 block">2010</span>
                <h3 class="timeline__title text-xl font-semibold mb-3">Расширение производства</h3>
                <p class="timeline__desc text-esp-black/70">
                  Запуск собственного производства «Экомашины». Локализация ключевых узлов и компонентов.
                </p>
              </div>
            </div>
            
            <!-- 2018 -->
            <div class="timeline__item relative grid md:grid-cols-2 gap-8 items-center animate-on-scroll" style="animation-delay: 0.2s">
              <div class="timeline__content md:text-right order-2 md:order-1">
                <span class="timeline__year text-esp-green font-bold text-xl mb-2 block">2018</span>
                <h3 class="timeline__title text-xl font-semibold mb-3">Преемственность поколений</h3>
                <p class="timeline__desc text-esp-black/70">
                  Сын присоединяется к бизнесу. Синергия опыта отца-основателя и инновационного видения нового поколения.
                </p>
              </div>
              <div class="timeline__marker order-1 md:order-2 flex justify-center">
                <div class="w-4 h-4 rounded-full bg-esp-green border-4 border-white shadow-lg" />
              </div>
              <div class="order-3 md:order-3" />
            </div>
            
            <!-- 2022 -->
            <div class="timeline__item relative grid md:grid-cols-2 gap-8 items-center animate-on-scroll" style="animation-delay: 0.3s">
              <div class="order-1" />
              <div class="timeline__marker order-2 flex justify-center">
                <div class="w-4 h-4 rounded-full bg-esp-blue border-4 border-white shadow-lg" />
              </div>
              <div class="timeline__content order-3">
                <span class="timeline__year text-esp-blue font-bold text-xl mb-2 block">2022</span>
                <h3 class="timeline__title text-xl font-semibold mb-3">Цифровая трансформация</h3>
                <p class="timeline__desc text-esp-black/70">
                  Внедрение 3D-проектирования и лидарного сканирования. Переход к интеллектуальному инжинирингу.
                </p>
              </div>
            </div>
            
            <!-- 2026 -->
            <div class="timeline__item relative grid md:grid-cols-2 gap-8 items-center animate-on-scroll" style="animation-delay: 0.4s">
              <div class="timeline__content md:text-right order-2 md:order-1">
                <span class="timeline__year text-esp-green font-bold text-xl mb-2 block">2026</span>
                <h3 class="timeline__title text-xl font-semibold mb-3">Эталон качества</h3>
                <p class="timeline__desc text-esp-black/70">
                  100+ экспертов. 30 000 синхронизированных элементов. Кристальный просвет воды 5 метров.
                </p>
              </div>
              <div class="timeline__marker order-1 md:order-2 flex justify-center">
                <div class="w-4 h-4 rounded-full bg-esp-green border-4 border-white shadow-lg" />
              </div>
              <div class="order-3 md:order-3" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brain & Body Ecosystem Section -->
    <section id="brain-body" class="section brain-body bg-esp-gray">
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
            <div class="brain-card__icon w-20 h-20 rounded-2xl bg-gradient-to-br from-esp-blue to-esp-green flex items-center justify-center text-4xl mb-6">
              🧠
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
            <div class="body-card__icon w-20 h-20 rounded-2xl bg-white border border-esp-gray flex items-center justify-center mb-6 p-3">
              <img src="/logo-ecomachine.svg" alt="Экомашины" class="w-full h-full object-contain" />
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
        
        <!-- Interactive Scheme Placeholder -->
        <div class="mt-16 animate-on-scroll" style="animation-delay: 0.2s">
          <div class="ecosystem-scheme bg-white p-8 shadow-lg text-center">
            <h3 class="text-xl font-semibold mb-4">Интерактивная схема взаимодействия</h3>
            <p class="text-esp-black/70 mb-6">
              Визуализация синхронной работы всех подразделений ESP для достижения «Эталона качества»
            </p>
            <div class="scheme-placeholder aspect-video bg-gradient-to-br from-esp-blue/10 via-white to-esp-green/10 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 opacity-30">
                <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-esp-blue rounded-full blur-3xl animate-pulse-slow" />
                <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-esp-green rounded-full blur-3xl animate-pulse-slow" style="animation-delay: -2s" />
              </div>
              <div class="relative z-10 text-center">
                <span class="text-5xl mb-4 block">🔗</span>
                <p class="text-esp-black/70 mb-4">30 000 синхронизированных элементов</p>
                <p class="text-sm text-esp-black/50">* Интерактивная схема будет активна в финальной версии</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quality Standard Section -->
    <section class="section quality bg-white">
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
            <div class="quality-card__icon text-5xl mb-4">📜</div>
            <h3 class="quality-card__title text-xl font-semibold mb-3">Сертификации</h3>
            <p class="quality-card__desc text-esp-black/70">
              ISO 9001:2015, эко-сертификация, патенты на технологии очистки воды
            </p>
          </div>
          
          <!-- Guarantee -->
          <div class="quality-card bg-esp-gray/50 p-8 text-center hover:shadow-lg transition-all duration-300 animate-on-scroll" style="animation-delay: 0.2s">
            <div class="quality-card__icon text-5xl mb-4">✅</div>
            <h3 class="quality-card__title text-xl font-semibold mb-3">Гарантия 100%</h3>
            <p class="quality-card__desc text-esp-black/70">
              Полная ответственность за результат и прозрачность всех процессов
            </p>
          </div>
        </div>
        
        <!-- Animated Infographic Placeholder -->
        <div class="quality-infographic bg-esp-gray/50 p-8 animate-on-scroll">
          <h3 class="text-center text-xl font-semibold mb-8">Стандарты очистки: путь к кристальной чистоте</h3>
          <div class="infographic-placeholder aspect-video bg-gradient-to-br from-esp-blue/10 via-white to-esp-green/10 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 opacity-30">
              <div class="absolute top-1/3 left-1/4 w-48 h-48 bg-esp-blue rounded-full blur-3xl" />
              <div class="absolute bottom-1/3 right-1/4 w-48 h-48 bg-esp-green rounded-full blur-3xl" />
            </div>
            <div class="relative z-10 text-center">
              <span class="text-5xl mb-4 block">💧</span>
              <p class="text-esp-black/70 mb-4">Анимированная инфографика процесса очистки</p>
              <p class="text-sm text-esp-black/50">* Будет активна в финальной версии</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Global Presence Section -->
    <section class="section global bg-esp-gray">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section__title mb-4 animate-on-scroll">Глобальное присутствие</h2>
          <p class="section__subtitle text-esp-black/70 max-w-3xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
            Проекты по всему миру в партнёрстве с ведущими экспертными институтами
          </p>
        </div>
        
        <!-- Map Placeholder -->
        <div class="global-map bg-white overflow-hidden shadow-2xl mb-12 animate-on-scroll">
          <div class="map-placeholder aspect-video bg-gradient-to-br from-esp-blue/10 via-white to-esp-green/10 flex items-center justify-center relative">
            <div class="absolute inset-0 opacity-20">
              <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-esp-blue rounded-full blur-3xl" />
              <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-esp-green rounded-full blur-3xl" />
            </div>
            <div class="relative z-10 text-center">
              <span class="text-5xl mb-4 block">🌍</span>
              <h3 class="text-xl font-semibold text-esp-black mb-2">Интерактивная карта проектов</h3>
              <p class="text-esp-black/70 mb-4">Беларусь, СНГ, Европа</p>
              <p class="text-sm text-esp-black/50">* Карта с фильтрами по регионам и отраслям</p>
            </div>
          </div>
        </div>
        
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

    <!-- Media Center Section -->
    <section class="section media bg-white">
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
            <div class="media-card__thumbnail aspect-video bg-gradient-to-br from-esp-blue/20 via-esp-black/10 to-esp-green/20 flex items-center justify-center relative">
              <span class="text-5xl mb-2">🎬</span>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span class="text-esp-blue text-2xl ml-1">▶</span>
                </div>
              </div>
            </div>
            <div class="media-card__content p-6">
              <h3 class="media-card__title text-lg font-semibold mb-2">Имиджевый фильм бренда</h3>
              <p class="media-card__desc text-sm text-esp-black/70 mb-4">2-3 минуты о миссии, ценностях и пути ESP</p>
              <span class="text-xs text-esp-black/50">⏱ 2-3 мин</span>
            </div>
          </div>
          
          <!-- Backstage -->
          <div class="media-card bg-esp-gray/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-on-scroll" style="animation-delay: 0.1s">
            <div class="media-card__thumbnail aspect-video bg-gradient-to-br from-esp-blue/20 via-esp-black/10 to-esp-green/20 flex items-center justify-center relative">
              <span class="text-5xl mb-2">🎥</span>
            </div>
            <div class="media-card__content p-6">
              <h3 class="media-card__title text-lg font-semibold mb-2">Backstage: как создаются проекты</h3>
              <p class="media-card__desc text-sm text-esp-black/70 mb-4">Закулисье реализации масштабных объектов</p>
              <span class="text-xs text-esp-black/50">📸 Фото + Видео</span>
            </div>
          </div>
          
          <!-- Press Kit -->
          <div class="media-card bg-esp-gray/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-on-scroll" style="animation-delay: 0.2s">
            <div class="media-card__thumbnail aspect-video bg-gradient-to-br from-esp-blue/20 via-esp-black/10 to-esp-green/20 flex items-center justify-center relative">
              <span class="text-5xl mb-2">📁</span>
            </div>
            <div class="media-card__content p-6">
              <h3 class="media-card__title text-lg font-semibold mb-2">Пресс-кит для скачивания</h3>
              <p class="media-card__desc text-sm text-esp-black/70 mb-4">Логотипы, фото, брендбук, презентации</p>
              <span class="text-xs text-esp-black/50">📥 PDF + ZIP</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta relative overflow-hidden" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
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

useHead({
  title: 'О компании ESP | EcoServiceProject — 25 лет опыта, 30 000 элементов',
  meta: [
    {
      name: 'description',
      content: 'История EcoServiceProject с 1999 года. Семейное дело: опыт отца и технологии сына. Таймлайн 25 лет, сертификаты качества, экосистема Brain & Body.'
    }
  ]
})

const router = useRouter()
const brandVideo = ref(null)

// ===== VIDEO PLACEHOLDER (замените на реальные пути после съёмки) =====
const videoUrl = ref('/videos/esp-brand-film.mp4')
const videoPoster = ref('/images/esp-brand-poster.jpg')

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
    .animate-scroll { animation: scroll 1.5s infinite; }
    .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
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
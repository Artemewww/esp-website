<template>
  <div class="bg-white min-h-screen">
    
    <!-- ===== FULL-SCREEN 3D HERO SECTION ===== -->
    <section class="relative h-screen w-full bg-gradient-to-br from-gray-900 via-esp-black to-gray-900 overflow-hidden">
      <div ref="heroContainer" class="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"></div>
      
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div class="text-center max-w-5xl px-6">
          <span class="inline-block px-5 py-2 rounded-full bg-esp-lidar/20 text-esp-lidar text-sm font-medium mb-8 font-inter backdrop-blur-sm border border-esp-lidar/30 animate-pulse">
            Мозг инжиниринга
          </span>
          <h1 class="font-rounded text-5xl md:text-7xl lg:text-8xl mb-8 text-white drop-shadow-2xl leading-tight">
            Технологии:<br />
            <span class="text-esp-lidar">Визуализация сложности</span>
          </h1>
          <p class="text-xl md:text-2xl text-white/80 font-inter leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
            5 стадий очистки воды — от механики до УФ-обеззараживания. LiDAR, 3D/BIM и IoT в каждом проекте ESP.
          </p>
          
          <div class="mt-16 animate-bounce">
            <svg class="w-8 h-8 text-white/60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="absolute top-8 right-8 z-10 hidden lg:block">
        <div class="glass-dark px-6 py-4 rounded-xl border border-white/10 backdrop-blur-md">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-3 h-3 bg-esp-lidar rounded-full animate-pulse"></div>
            <span class="text-white/90 text-sm font-inter font-medium">30 000+ точек данных</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-esp-blue rounded-full animate-pulse"></div>
            <span class="text-white/90 text-sm font-inter font-medium">Точность до 1 мм</span>
          </div>
        </div>
      </div>
      
      <div class="absolute bottom-8 left-8 z-10 hidden lg:block">
        <div class="glass-dark px-6 py-4 rounded-xl border border-white/10 backdrop-blur-md">
          <p class="text-white/70 text-sm font-inter">← Вращайте мышью или тачем →</p>
        </div>
      </div>
    </section>

    <!-- ===== COMPETENCIES HEADER (ABOVE SLIDER) ===== -->
    <section class="section bg-white">
      <div class="container-custom">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            Наши компетенции
          </span>
          <h2 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">
            Интеллектуальный инжиниринг
          </h2>
          <p class="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
            Каждая технология — это инструмент для создания безупречных экосистем очистки воды
          </p>
        </div>
      </div>
    </section>

    <!-- ===== LUX IMAGE SLIDER SECTION ===== -->
    <section class="relative py-0">
      <div 
        ref="sliderContainer"
        class="relative h-[80vh] min-h-[600px] overflow-hidden"
        @wheel="handleWheel"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <!-- Slider content (same as before) -->
        <div class="relative w-full h-full">
          <div 
            v-for="(slide, index) in sliderImages" 
            :key="index"
            class="absolute inset-0 w-full h-full transition-opacity duration-1000"
            :class="currentSlide === index ? 'opacity-100' : 'opacity-0'"
          >
            <div 
              class="absolute inset-0 bg-cover bg-center"
              :style="{ backgroundImage: `url(${slide.image})` }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            </div>
            
            <div class="absolute inset-0 flex items-center">
              <div class="max-w-7xl mx-auto px-6 w-full">
                <div class="max-w-2xl">
                  <span class="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-6 font-inter backdrop-blur-sm border border-white/20">
                    {{ slide.tag }}
                  </span>
                  <h2 class="font-rounded text-4xl md:text-6xl text-white mb-6 leading-tight">
                    {{ slide.title }}
                  </h2>
                  <p class="text-xl text-white/80 font-inter leading-relaxed mb-8">
                    {{ slide.description }}
                  </p>
                  <button class="btn btn-lidar inline-flex items-center gap-2">
                    <span>{{ slide.cta }}</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Slider Controls -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4">
          <button @click="prevSlide" class="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <div class="flex items-center gap-2">
            <div 
              v-for="(slide, index) in sliderImages" 
              :key="index"
              @click="currentSlide = index"
              class="w-12 h-1 rounded-full cursor-pointer transition-all duration-300"
              :class="currentSlide === index ? 'bg-white w-16' : 'bg-white/30'"
            ></div>
          </div>
          
          <button @click="nextSlide" class="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <div class="absolute top-8 right-8 z-20">
          <div class="glass-dark px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md">
            <span class="text-white/90 text-sm font-inter font-medium">
              {{ currentSlide + 1 }} / {{ sliderImages.length }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== INTERACTIVE DEMO SECTION (WITH MODAL) ===== -->
    <section class="section bg-gradient-to-br from-esp-blue via-esp-black to-esp-green text-white text-center">
      <div class="container-custom max-w-4xl">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-lidar/20 text-esp-lidar text-sm font-medium mb-6 font-inter">
          Интерактивная демо
        </span>
        
        <h2 class="font-rounded text-4xl md:text-6xl mb-6">
          Попробуйте сами
        </h2>
        
        <p class="text-xl text-white/80 font-inter leading-relaxed max-w-2xl mx-auto mb-12">
          Вращайте облако точек мышью или тачем. 
          Приблизьте, чтобы рассмотреть детали. 
          Почувствуйте точность наших технологий.
        </p>
        
        <!-- Instruction Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div class="glass-dark px-6 py-4 rounded-xl border border-white/10 backdrop-blur-md">
            <div class="w-12 h-12 bg-esp-lidar/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-esp-lidar" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
              </svg>
            </div>
            <p class="text-white/90 text-sm font-inter">Зажмите ЛКМ и потяните для вращения</p>
          </div>
          <div class="glass-dark px-6 py-4 rounded-xl border border-white/10 backdrop-blur-md">
            <div class="w-12 h-12 bg-esp-lidar/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-esp-lidar" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
              </svg>
            </div>
            <p class="text-white/90 text-sm font-inter">Колесо мыши для масштабирования</p>
          </div>
          <div class="glass-dark px-6 py-4 rounded-xl border border-white/10 backdrop-blur-md">
            <div class="w-12 h-12 bg-esp-lidar/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-esp-lidar" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </div>
            <p class="text-white/90 text-sm font-inter">На мобильных — жесты тачем</p>
          </div>
        </div>
        
        <!-- CTA Button to Open Modal -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button @click="openDemoModal" class="btn btn-lidar inline-flex items-center gap-2 px-10 py-5 text-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>Попробовать интерактив</span>
          </button>
          
          <NuxtLink to="/contacts" class="btn bg-white text-esp-black hover:bg-gray-100 inline-flex items-center gap-2 px-10 py-5 text-lg">
            <span>Заказать сканирование объекта</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== MODAL FOR INTERACTIVE DEMO ===== -->
    <div 
      v-if="isDemoModalOpen"
      class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
      @click.self="closeDemoModal"
    >
      <!-- Close Button -->
      <button 
        @click="closeDemoModal"
        class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-[101]"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- Modal Header -->
      <div class="absolute top-6 left-6 z-[101]">
        <div class="glass-dark px-6 py-3 rounded-lg border border-white/10 backdrop-blur-md">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-esp-lidar rounded-full animate-pulse"></div>
            <span class="text-white/90 text-sm font-inter font-medium">30 000+ точек LiDAR</span>
          </div>
        </div>
      </div>
      
      <!-- 3D Canvas Container -->
      <div ref="modalContainer" class="absolute inset-0 w-full h-full"></div>
      
      <!-- Modal Instructions (Bottom) -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[101]">
        <div class="glass-dark px-8 py-4 rounded-xl border border-white/10 backdrop-blur-md">
          <p class="text-white/70 text-sm font-inter">
            ← Вращайте мышью • Колесо для зума • ESC для закрытия →
          </p>
        </div>
      </div>
    </div>

    <!-- ===== 5 STAGES OF WATER TREATMENT ===== -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="text-center mb-14">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            Процесс очистки
          </span>
          <h2 class="font-rounded text-3xl md:text-5xl mb-4 text-esp-black">
            5 стадий на пути к кристальной воде
          </h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Каждый этап спроектирован с учётом специфики объекта и закреплён «Эталоном ESP»
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <NuxtLink v-for="(stage, i) in waterStages" :key="i" :to="`/technologies/${stage.slug}`" class="block">
            <div class="bg-white p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center h-full">
              <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg font-bold font-rounded"
                :style="{ backgroundColor: stage.color }">
                {{ i + 1 }}
              </div>
              <h3 class="font-rounded text-base font-semibold mb-2 text-esp-black">{{ stage.title }}</h3>
              <p class="text-esp-black/60 text-xs leading-relaxed">{{ stage.desc }}</p>
              <div class="mt-3 pt-3 border-t border-esp-gray">
                <span class="text-xs font-medium" :style="{ color: stage.color }">{{ stage.result }}</span>
              </div>
              <span class="block mt-2 text-esp-blue text-xs font-medium">Подробнее →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== STAGE DEEP-DIVE (Sticky Scroll) ===== -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
            Детальный разбор
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Что происходит на каждом этапе</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">Кликните на стадию слева, чтобы увидеть подробности</p>
        </div>
        <StickyScroll :items="stageDeepDive" />
      </div>
    </section>

    <!-- ===== DIGITAL TOOLS ===== -->
    <section class="section-padding bg-esp-black text-white relative overflow-hidden">
      <DottedSurface class="opacity-60" />
      <div class="container-custom relative z-10">
        <div class="text-center mb-14">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-lidar/20 text-esp-lidar text-sm font-medium mb-4 font-inter">
            Цифровые инструменты
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4">Мозг инжиниринга</h2>
          <p class="text-white/70 max-w-2xl mx-auto">
            Три технологические платформы, которые делают ESP точнее, быстрее и предсказуемее
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(tool, i) in digitalTools" :key="tool.title" :id="['lidar', '3d', 'digital-twin'][i]" style="scroll-margin-top: 100px;" class="border border-white/10 p-8 hover:bg-white/5 transition">
            <div class="text-4xl mb-5">{{ tool.icon }}</div>
            <h3 class="font-rounded text-xl font-semibold mb-3">{{ tool.title }}</h3>
            <p class="text-white/70 text-sm leading-relaxed mb-5">{{ tool.desc }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in tool.tags" :key="tag" class="px-2 py-1 bg-white/5 border border-white/10 text-xs text-esp-lidar font-inter">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== ECOLOGICAL INNOVATIONS (CLOSED WATER LOOP) ===== -->
    <section id="eco" class="section-padding bg-white" style="scroll-margin-top: 100px;">
      <div class="container-custom">
        <div class="grid lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-5 space-y-4">
            <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium font-inter">
              Замкнутый водный цикл
            </span>
            <h2 class="font-rounded text-3xl md:text-4xl text-esp-black leading-tight">
              Экологические инновации в действии
            </h2>
            <p class="text-esp-black/70 leading-relaxed">
              Мы разрабатываем и поставляем очистные системы, которые минимизируют потребление пресной воды из скважин, полностью перенаправляя стоки обратно в производственные технологические циклы.
            </p>
            <div class="space-y-2 pt-2">
              <div v-for="(step, i) in cycleSteps" :key="i" class="p-3 border border-esp-gray flex items-center justify-between bg-esp-gray/50">
                <span class="font-rounded font-semibold text-sm text-esp-black">[{{ i + 1 }}] {{ step.title }}</span>
                <span class="text-xs text-esp-black/50">{{ step.desc }}</span>
              </div>
            </div>
          </div>
          <div class="lg:col-span-7 bg-esp-gray p-8 aspect-video flex flex-col items-center justify-center relative">
            <div class="text-center">
              <div class="font-rounded text-5xl font-bold text-esp-green mb-2">98%</div>
              <p class="text-xs uppercase tracking-wider text-esp-black/50">Коэффициент рециркуляции воды</p>
            </div>
            <p class="text-center text-xs text-esp-black/50 mt-6 max-w-sm">
              Автоматизированный замкнутый цикл сводит сброс стоков в природные водоёмы практически к нулю.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== LABORATORY & CONTROL / VIRTUAL 360° TOUR ===== -->
    <section id="lab" class="section-padding bg-esp-gray" style="scroll-margin-top: 100px;">
      <div class="container-custom">
        <div id="tour" class="grid lg:grid-cols-2 gap-10 items-center" style="scroll-margin-top: 100px;">
          <div>
            <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
              Лаборатория и контроль
            </span>
            <h3 class="font-rounded text-3xl text-esp-black mb-4">Эталонная химическая лаборатория ESP</h3>
            <p class="text-esp-black/70 leading-relaxed mb-6">
              Каждая капля воды проходит 14 этапов контроля: от анализа ХПК и БПК до микробиологических тестов и спектрофотометрии. Посмотрите нашу аналитическую лабораторию в интерактивном режиме 360°.
            </p>
            <button @click="labTourOpen = !labTourOpen" class="btn-primary inline-block">
              {{ labTourOpen ? 'Остановить тур' : 'Запустить тур 360°' }}
            </button>
          </div>
          <div class="bg-esp-black aspect-video flex items-center justify-center relative overflow-hidden">
            <div v-if="labTourOpen" class="text-center text-white space-y-3">
              <div class="w-10 h-10 border-2 border-esp-lidar border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p class="text-xs font-mono uppercase tracking-wider text-esp-lidar">Панорама активна: лаборатория ESP</p>
            </div>
            <div v-else class="text-center text-white/40 space-y-2">
              <span class="text-3xl block">🔬</span>
              <p class="text-xs font-mono uppercase tracking-wider">Панорама в режиме ожидания</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA SECTION ===== -->
    <section class="section bg-gradient-to-br from-esp-blue via-esp-black to-esp-green text-white text-center">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-4xl md:text-5xl mb-6">
          Готовы обсудить технологическую задачу?
        </h2>
        <p class="text-xl text-white/80 mb-10 font-inter">
          Главный инженер ESP проанализирует вашу систему и предложит решения
        </p>
        <NuxtLink to="/contacts" class="btn bg-white text-esp-black hover:bg-gray-100 inline-flex items-center gap-2 px-10 py-5 text-lg">
          <span>Заказать технический аудит</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Технологии ESP | LiDAR, BIM, IoT и 5 стадий очистки воды',
  meta: [
    {
      name: 'description',
      content: 'Технологический стек ESP: LiDAR-сканирование, 3D/BIM проектирование, IoT-мониторинг. 5 стадий очистки воды: механика, биология, физхимия, мембраны, УФ. Цифровые двойники объектов.'
    }
  ]
})

// ===== TZ CONTENT DATA =====
const waterStages = [
  { title: 'Механическая фильтрация', desc: 'Удаление крупных взвешенных частиц, песка, мусора. Решётки, песколовки, первичные отстойники.', result: 'Удаление ≥90% взвеси', color: '#002366', slug: 'mechanical-filtration' },
  { title: 'Биологическая очистка', desc: 'Активный ил разрушает органические соединения. Аэротенки, биореакторы, системы нитри-денитрификации.', result: 'БПК снижается до 10 мг/л', color: '#006039', slug: 'biological-treatment' },
  { title: 'Физико-химическая', desc: 'Флотация, коагуляция, реагентное осаждение фосфора и тяжёлых металлов. Флотаторы ESP-ФЛ серии.', result: 'Фосфор < 0.5 мг/л', color: '#004B87', slug: 'physiochemical-methods' },
  { title: 'Мембранные технологии', desc: 'МБР, ультрафильтрация, нанофильтрация. Барьер для микроорганизмов и коллоидных примесей.', result: 'Прозрачность 5м NTU', color: '#005A3A', slug: 'membrane-filtration' },
  { title: 'УФ-обеззараживание', desc: 'Финишное обеззараживание без хлора. Установки ESP-УФ серии — нулевой риск для экосистем водоёма.', result: '99.99% дезинфекция', color: '#00A86B', slug: 'uv-disinfection' }
]

const stageDeepDive = waterStages.map((s, i) => ({
  title: s.title,
  description: `${s.desc} Результат: ${s.result}.`,
  icon: ['🌀', '🦠', '⚗️', '🧬', '💡'][i],
  gradient: `linear-gradient(135deg, ${s.color} 0%, #000 130%)`
}))

const digitalTools = [
  {
    icon: '📡',
    title: 'LiDAR-сканирование',
    desc: 'Лазерное сканирование действующих сооружений с точностью до 1 мм. Создаём облако точек для проектирования реконструкции без остановки производства.',
    tags: ['Faro Focus', 'Leica BLK360', 'Облако точек', 'AS-BUILT']
  },
  {
    icon: '🏗️',
    title: '3D/BIM-проектирование',
    desc: 'Информационная модель сооружения в Revit: от концепции до рабочей документации. Выявляем коллизии на стадии проекта, а не монтажа.',
    tags: ['Autodesk Revit', 'AutoCAD', 'Navisworks', 'IFC']
  },
  {
    icon: '📊',
    title: 'IoT-мониторинг',
    desc: 'Датчики качества воды, расхода и давления в реальном времени. SCADA-интеграция и мобильный дашборд для диспетчерского контроля 24/7.',
    tags: ['SCADA', 'Modbus', 'MQTT', 'Дашборд']
  }
]

const cycleSteps = [
  { title: 'Вход воды', desc: 'Подача грязных стоков с фракциями' },
  { title: 'Очистка', desc: 'Мембрана задерживает 99% бактерий' },
  { title: 'Возврат', desc: 'Кристально чистая вода в оборот' },
  { title: 'Сбережение', desc: 'Снижение углеродного следа' }
]
const labTourOpen = ref(false)

// ===== HERO 3D SCENE =====
const heroContainer = ref(null)
let heroScene, heroCamera, heroRenderer, heroParticles, heroAnimationId
let heroIsDragging = false, heroLastX = 0, heroLastY = 0

// ===== SLIDER =====
const sliderContainer = ref(null)
const currentSlide = ref(0)
const sliderInterval = ref(null)
const isSliding = ref(false)
const touchStartX = ref(0)
const touchStartY = ref(0)
const wheelTimeout = ref(null)

const sliderImages = [
   {
    image: '/images/lidaresp.jpg',  // ← Ваш файл из public/images/
    tag: 'LiDAR-сканирование',
    title: 'Точность до миллиметра',
    description: 'Получаем высокоточные облака точек для реконструкции существующих сооружений. 30 000+ точек данных для идеальной точности проекта.',
    cta: 'Узнать больше'
  },
  {
    image: '/images/proektirovanieesp.jpg',  // ← Ваш файл
    tag: '3D-проектирование',
    title: 'Строим дважды: в цифре и в металле',
    description: 'Создаем масштабные идеи на стадии замысла. Исключаем коллизии до начала монтажа. Визуализируем каждый узел системы.',
    cta: 'Смотреть демо'
  },
  {
    image: '/images/lidaresp.jpg',  // ← Ваш файл
    tag: 'Цифровые двойники',
    title: 'Виртуальная копия для эксплуатации',
    description: 'Мониторинг в реальном времени, прогнозная аналитика и обучение персонала без риска для реального оборудования.',
    cta: 'Обсудить проект'
  },
  {
    image: '/images/proektirovanieesp.jpg',  // ← Ваш файл
    tag: 'Бережливый инжиниринг',
    title: 'Оптимизация процессов и затрат',
    description: 'Сокращаем сроки реализации на 30% и энергозатраты на 40% благодаря оптимизации на стадии проектирования.',
    cta: 'Рассчитать экономию'
  }
]

const nextSlide = () => {
  if (isSliding.value) return
  isSliding.value = true
  currentSlide.value = (currentSlide.value + 1) % sliderImages.length
  setTimeout(() => { isSliding.value = false }, 1000)
}

const prevSlide = () => {
  if (isSliding.value) return
  isSliding.value = true
  currentSlide.value = (currentSlide.value - 1 + sliderImages.length) % sliderImages.length
  setTimeout(() => { isSliding.value = false }, 1000)
}

const handleWheel = (e) => {
  if (wheelTimeout.value) return
  wheelTimeout.value = setTimeout(() => { wheelTimeout.value = null }, 800)
  if (e.deltaY > 0) nextSlide()
  else if (e.deltaY < 0) prevSlide()
}

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  if (!sliderContainer.value) return
  const deltaX = e.touches[0].clientX - touchStartX.value
  const deltaY = e.touches[0].clientY - touchStartY.value
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) e.preventDefault()
}

const handleTouchEnd = (e) => {
  if (!sliderContainer.value) return
  const deltaX = e.changedTouches[0].clientX - touchStartX.value
  if (Math.abs(deltaX) > 100) {
    if (deltaX < 0) nextSlide()
    else prevSlide()
  }
}

const startAutoSlide = () => {
  sliderInterval.value = setInterval(nextSlide, 6000)
}

const stopAutoSlide = () => {
  if (sliderInterval.value) clearInterval(sliderInterval.value)
}

// ===== MODAL 3D SCENE =====
const isDemoModalOpen = ref(false)
const modalContainer = ref(null)
let modalScene, modalCamera, modalRenderer, modalParticles, modalAnimationId
let modalIsDragging = false, modalLastX = 0, modalLastY = 0

const openDemoModal = () => {
  isDemoModalOpen.value = true
  // Disable body scroll
  document.body.style.overflow = 'hidden'
  // Initialize 3D scene after modal is rendered
  setTimeout(() => {
    initModalScene()
  }, 100)
}

const closeDemoModal = () => {
  isDemoModalOpen.value = false
  // Enable body scroll
  document.body.style.overflow = ''
  // Cleanup 3D scene
  cleanupModalScene()
}

// Handle ESC key to close modal
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isDemoModalOpen.value) {
    closeDemoModal()
  }
}

const initModalScene = async () => {
  if (!modalContainer.value) return
  
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const width = modalContainer.value.offsetWidth
  const height = modalContainer.value.offsetHeight
  
  modalScene = new THREE.Scene()
  modalScene.fog = new THREE.FogExp2(0x1A1A1A, 0.015)
  
  modalCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  modalCamera.position.set(0, 15, 80)
  modalCamera.lookAt(0, 0, 0)
  
  modalRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
  modalRenderer.setSize(width, height)
  modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  modalRenderer.setClearColor(0x1A1A1A, 1)
  modalContainer.value.appendChild(modalRenderer.domElement)
  
  const geometry = new THREE.BufferGeometry()
  const vertices = [], colors = []
  const cB = new THREE.Color(0x002366), cG = new THREE.Color(0x006039), cL = new THREE.Color(0x00D4FF)
  
  for (let i = 0; i < 25000; i++) {
    const layer = Math.floor(Math.random() * 4)
    const t = Math.random() * Math.PI * 2
    const r = 15 + layer * 8 + Math.random() * 5
    const x = Math.cos(t) * r + (Math.random() - 0.5) * 12
    const z = Math.sin(t) * r + (Math.random() - 0.5) * 12
    const y = layer * 12 + (Math.random() - 0.5) * 8 + Math.sin(x * 0.15) * 3
    vertices.push(x, y, z)
    
    let col = layer === 0 ? cB.clone() : layer === 1 ? cB.clone().lerp(cL, 0.4) : layer === 2 ? cL.clone() : cG.clone()
    col.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1)
    colors.push(col.r, col.g, col.b)
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  
  const material = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, pointSize: { value: 0.4 } },
    vertexShader: `
      uniform float time, pointSize;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vDistance;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDistance = length(mv.xyz);
        vec3 pos = position;
        pos.y += sin(pos.x * 0.1 + time * 0.5) * 0.5;
        pos.z += cos(pos.y * 0.08 + time * 0.3) * 0.3;
        mv = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = pointSize * (300.0 / vDistance);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDistance;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, d);
        alpha *= smoothstep(100.0, 30.0, vDistance);
        vec3 col = vColor * (1.0 + 0.3 * sin(gl_FragCoord.x * 0.01));
        gl_FragColor = vec4(col, alpha * 0.9);
      }
    `,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  })
  
  modalParticles = new THREE.Points(geometry, material)
  modalScene.add(modalParticles)
  
  modalScene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const pl = new THREE.PointLight(0x00D4FF, 0.8, 100); pl.position.set(30, 30, 30); modalScene.add(pl)
  
  modalContainer.value.addEventListener('mousedown', onModalDown)
  modalContainer.value.addEventListener('mousemove', onModalMove)
  modalContainer.value.addEventListener('mouseup', onModalUp)
  modalContainer.value.addEventListener('mouseleave', onModalUp)
  modalContainer.value.addEventListener('touchstart', onModalTouchStart, { passive: false })
  modalContainer.value.addEventListener('touchmove', onModalTouchMove, { passive: false })
  modalContainer.value.addEventListener('touchend', onModalUp)
  modalContainer.value.addEventListener('wheel', onModalWheel, { passive: false })
  window.addEventListener('resize', onModalResize)
  
  animateModal()
}

const onModalDown = (e) => { modalIsDragging = true; modalLastX = e.clientX; modalLastY = e.clientY }
const onModalMove = (e) => {
  if (!modalIsDragging || !modalParticles) return
  const dx = e.clientX - modalLastX, dy = e.clientY - modalLastY
  modalParticles.rotation.y += dx * 0.005
  modalParticles.rotation.x += dy * 0.005
  modalLastX = e.clientX; modalLastY = e.clientY
}
const onModalUp = () => { modalIsDragging = false }
const onModalTouchStart = (e) => { if (e.touches.length === 1) { modalIsDragging = true; modalLastX = e.touches[0].clientX; modalLastY = e.touches[0].clientY; e.preventDefault() } }
const onModalTouchMove = (e) => { if (!modalIsDragging || !modalParticles || e.touches.length !== 1) return; const dx = e.touches[0].clientX - modalLastX, dy = e.touches[0].clientY - modalLastY; modalParticles.rotation.y += dx * 0.005; modalParticles.rotation.x += dy * 0.005; modalLastX = e.touches[0].clientX; modalLastY = e.touches[0].clientY; e.preventDefault() }
const onModalWheel = (e) => {
  e.preventDefault()
  modalCamera.position.z += e.deltaY * 0.05
  modalCamera.position.z = Math.max(30, Math.min(150, modalCamera.position.z))
}
const onModalResize = () => {
  if (!modalContainer.value || !modalCamera || !modalRenderer) return
  const width = modalContainer.value.offsetWidth, height = modalContainer.value.offsetHeight
  modalCamera.aspect = width / height
  modalCamera.updateProjectionMatrix()
  modalRenderer.setSize(width, height)
}

const animateModal = () => {
  modalAnimationId = requestAnimationFrame(animateModal)
  if (modalParticles?.material?.uniforms?.time) modalParticles.material.uniforms.time.value = performance.now() * 0.001
  if (modalParticles && !modalIsDragging) { modalParticles.rotation.y += 0.0015 }
  if (modalRenderer && modalScene && modalCamera) modalRenderer.render(modalScene, modalCamera)
}

const cleanupModalScene = () => {
  if (modalAnimationId) cancelAnimationFrame(modalAnimationId)
  if (modalParticles) { modalParticles.geometry?.dispose(); modalParticles.material?.dispose() }
  if (modalRenderer) {
    modalRenderer.dispose()
    if (modalRenderer.domElement?.parentNode) modalRenderer.domElement.parentNode.removeChild(modalRenderer.domElement)
  }
  modalScene = null; modalCamera = null
  window.removeEventListener('resize', onModalResize)
}

// ===== HERO 3D SCENE FUNCTIONS (same as before) =====
const initHeroScene = async () => {
  if (!heroContainer.value) return
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const width = heroContainer.value.offsetWidth
  const height = heroContainer.value.offsetHeight
  
  heroScene = new THREE.Scene()
  heroScene.fog = new THREE.FogExp2(0x1A1A1A, 0.015)
  
  heroCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  heroCamera.position.set(0, 15, 80)
  heroCamera.lookAt(0, 0, 0)
  
  heroRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
  heroRenderer.setSize(width, height)
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  heroRenderer.setClearColor(0x1A1A1A, 1)
  heroContainer.value.appendChild(heroRenderer.domElement)
  
  const geometry = new THREE.BufferGeometry()
  const vertices = [], colors = []
  const cB = new THREE.Color(0x002366), cG = new THREE.Color(0x006039), cL = new THREE.Color(0x00D4FF)
  
  for (let i = 0; i < 25000; i++) {
    const layer = Math.floor(Math.random() * 4)
    const t = Math.random() * Math.PI * 2
    const r = 15 + layer * 8 + Math.random() * 5
    const x = Math.cos(t) * r + (Math.random() - 0.5) * 12
    const z = Math.sin(t) * r + (Math.random() - 0.5) * 12
    const y = layer * 12 + (Math.random() - 0.5) * 8 + Math.sin(x * 0.15) * 3
    vertices.push(x, y, z)
    
    let col = layer === 0 ? cB.clone() : layer === 1 ? cB.clone().lerp(cL, 0.4) : layer === 2 ? cL.clone() : cG.clone()
    col.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1)
    colors.push(col.r, col.g, col.b)
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  
  const material = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, pointSize: { value: 0.4 } },
    vertexShader: `
      uniform float time, pointSize;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vDistance;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDistance = length(mv.xyz);
        vec3 pos = position;
        pos.y += sin(pos.x * 0.1 + time * 0.5) * 0.5;
        pos.z += cos(pos.y * 0.08 + time * 0.3) * 0.3;
        mv = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = pointSize * (300.0 / vDistance);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDistance;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, d);
        alpha *= smoothstep(100.0, 30.0, vDistance);
        vec3 col = vColor * (1.0 + 0.3 * sin(gl_FragCoord.x * 0.01));
        gl_FragColor = vec4(col, alpha * 0.9);
      }
    `,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  })
  
  heroParticles = new THREE.Points(geometry, material)
  heroScene.add(heroParticles)
  
  heroScene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const pl = new THREE.PointLight(0x00D4FF, 0.8, 100); pl.position.set(30, 30, 30); heroScene.add(pl)
  
  heroContainer.value.addEventListener('mousedown', onHeroDown)
  heroContainer.value.addEventListener('mousemove', onHeroMove)
  heroContainer.value.addEventListener('mouseup', onHeroUp)
  heroContainer.value.addEventListener('mouseleave', onHeroUp)
  heroContainer.value.addEventListener('touchstart', onHeroTouchStart, { passive: false })
  heroContainer.value.addEventListener('touchmove', onHeroTouchMove, { passive: false })
  heroContainer.value.addEventListener('touchend', onHeroUp)
  window.addEventListener('resize', onHeroResize)
  
  animateHero()
}

const onHeroDown = (e) => { heroIsDragging = true; heroLastX = e.clientX; heroLastY = e.clientY }
const onHeroMove = (e) => {
  if (!heroIsDragging || !heroParticles) return
  const dx = e.clientX - heroLastX, dy = e.clientY - heroLastY
  heroParticles.rotation.y += dx * 0.005
  heroParticles.rotation.x += dy * 0.005
  heroLastX = e.clientX; heroLastY = e.clientY
}
const onHeroUp = () => { heroIsDragging = false }
const onHeroTouchStart = (e) => { if (e.touches.length === 1) { heroIsDragging = true; heroLastX = e.touches[0].clientX; heroLastY = e.touches[0].clientY; e.preventDefault() } }
const onHeroTouchMove = (e) => { if (!heroIsDragging || !heroParticles || e.touches.length !== 1) return; const dx = e.touches[0].clientX - heroLastX, dy = e.touches[0].clientY - heroLastY; heroParticles.rotation.y += dx * 0.005; heroParticles.rotation.x += dy * 0.005; heroLastX = e.touches[0].clientX; heroLastY = e.touches[0].clientY; e.preventDefault() }
const onHeroResize = () => {
  if (!heroContainer.value || !heroCamera || !heroRenderer) return
  const width = heroContainer.value.offsetWidth, height = heroContainer.value.offsetHeight
  heroCamera.aspect = width / height
  heroCamera.updateProjectionMatrix()
  heroRenderer.setSize(width, height)
}

const animateHero = () => {
  heroAnimationId = requestAnimationFrame(animateHero)
  if (heroParticles?.material?.uniforms?.time) heroParticles.material.uniforms.time.value = performance.now() * 0.001
  if (heroParticles && !heroIsDragging) { heroParticles.rotation.y += 0.0015 }
  if (heroRenderer && heroScene && heroCamera) heroRenderer.render(heroScene, heroCamera)
}

const cleanupHero = () => {
  if (heroAnimationId) cancelAnimationFrame(heroAnimationId)
  if (heroParticles) { heroParticles.geometry?.dispose(); heroParticles.material?.dispose() }
  if (heroRenderer) {
    heroRenderer.dispose()
    if (heroRenderer.domElement?.parentNode) heroRenderer.domElement.parentNode.removeChild(heroRenderer.domElement)
  }
  heroScene = null; heroCamera = null
  window.removeEventListener('resize', onHeroResize)
}

onMounted(() => {
  initHeroScene()
  startAutoSlide()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  cleanupHero()
  cleanupModalScene()
  stopAutoSlide()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.glass-dark {
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.section {
  @apply py-20 lg:py-28;
}

.container-custom {
  @apply max-w-7xl mx-auto px-6;
}

.btn {
  @apply px-8 py-4 rounded-none font-medium transition-all duration-300 text-base;
}

.btn-lidar {
  @apply bg-esp-lidar text-esp-black hover:bg-opacity-90 hover:shadow-lg;
}

.cursor-grab {
  cursor: grab;
}
.cursor-grab:active {
  cursor: grabbing;
}

.no-scroll {
  overflow: hidden;
}
</style>
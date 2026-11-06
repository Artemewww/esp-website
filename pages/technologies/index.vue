<template>
  <div class="ap">

    <!-- ===== Шапка в подаче Apple + интерактивное облако точек ===== -->
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Центр инжиниринга</span>
        <h1 class="ap-title">
          Технологии:<br />
          Визуализация сложности
        </h1>
        <p class="ap-lede">
          4 стадии очистки воды — от механики до УФ-обеззараживания. LiDAR, 3D/BIM и IoT в каждом проекте ESP.
        </p>

        <div class="ap-media tc-hero">
          <div ref="heroContainer" class="tc-hero-canvas cursor-grab"></div>
        </div>
        <div class="tc-hero-meta">
          <span class="ap-pill">30 000+ точек данных</span>
          <span class="ap-pill">Точность до 1 мм</span>
          <span class="ap-caption">← Вращайте мышью или тачем →</span>
        </div>
      </div>
    </section>

    <!-- ===== Компетенции + слайдер ===== -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Наши компетенции</span>
        <h2 class="ap-h2">Интеллектуальный инжиниринг</h2>
        <p class="ap-lede">
          Каждая технология — это инструмент для создания безупречных экосистем очистки воды
        </p>

        <div
          ref="sliderContainer"
          class="ap-media tc-slider"
          @wheel="handleWheel"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            v-for="(slide, index) in sliderImages"
            :key="index"
            class="tc-slide"
            :class="{ 'is-on': currentSlide === index }"
            :style="{ backgroundImage: `url(${slide.image})` }"
            role="img"
            :aria-label="slide.title"
          ></div>
          <span class="tc-count">{{ currentSlide + 1 }} / {{ sliderImages.length }}</span>
        </div>

        <div class="tc-slide-info">
          <div v-for="(slide, index) in sliderImages" v-show="currentSlide === index" :key="index" class="tc-slide-txt">
            <span class="ap-eyebrow">{{ slide.tag }}</span>
            <h3 class="tc-slide-title">{{ slide.title }}</h3>
            <p class="ap-text">{{ slide.description }}</p>
            <div class="ap-actions">
              <button type="button" class="ap-btn ap-btn--ghost">{{ slide.cta }} ›</button>
            </div>
          </div>

          <div class="tc-ctrl">
            <button type="button" class="tc-arrow" aria-label="Назад" @click="prevSlide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
            </button>
            <div class="tc-dots">
              <button
                v-for="(slide, index) in sliderImages"
                :key="index"
                type="button"
                class="tc-dot"
                :class="{ 'is-on': currentSlide === index }"
                :aria-label="`Слайд ${index + 1}`"
                @click="currentSlide = index"
              ></button>
            </div>
            <button type="button" class="tc-arrow" aria-label="Вперёд" @click="nextSlide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Интерактивная демо ===== -->
    <section class="ap-sec ap-center">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Интерактивная демо</span>
        <h2 class="ap-h2">Попробуйте сами</h2>
        <p class="ap-lede">
          Вращайте облако точек мышью или тачем.
          Приблизьте, чтобы рассмотреть детали.
          Почувствуйте точность наших технологий.
        </p>

        <div class="ap-grid ap-grid--3 tc-howto">
          <div class="ap-card">
            <svg class="ap-ico" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
            </svg>
            <p class="ap-text">Зажмите ЛКМ и потяните для вращения</p>
          </div>
          <div class="ap-card">
            <svg class="ap-ico" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
            </svg>
            <p class="ap-text">Колесо мыши для масштабирования</p>
          </div>
          <div class="ap-card">
            <svg class="ap-ico" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
            </svg>
            <p class="ap-text">На мобильных — жесты тачем</p>
          </div>
        </div>

        <div class="ap-actions">
          <button type="button" class="ap-btn" @click="openDemoModal">Попробовать интерактив</button>
          <NuxtLink to="/contacts" class="ap-link">Заказать сканирование объекта ›</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== Модальное окно с 3D-демо ===== -->
    <div
      v-if="isDemoModalOpen"
      class="tc-modal"
      @click.self="closeDemoModal"
    >
      <button type="button" class="tc-modal-close" aria-label="Закрыть" @click="closeDemoModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <span class="tc-modal-chip tc-modal-chip--top">30 000+ точек LiDAR</span>
      <div ref="modalContainer" class="tc-modal-canvas"></div>
      <span class="tc-modal-chip tc-modal-chip--bottom">← Вращайте мышью • Колесо для зума • ESC для закрытия →</span>
    </div>

    <!-- ===== Стадии очистки воды ===== -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Процесс очистки</span>
        <h2 class="ap-h2">Стадии очистки воды</h2>
        <p class="ap-lede">
          Каждый этап спроектирован с учётом специфики объекта и закреплён «Эталоном ESP»
        </p>
        <div class="ap-grid ap-grid--4">
          <NuxtLink v-for="(stage, i) in waterStages" :key="i" :to="`/technologies/${stage.slug}`" class="ap-card">
            <span class="tc-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="ap-h3">{{ stage.title }}</h3>
            <p class="ap-text">{{ stage.desc }}</p>
            <div class="ap-card-foot tc-stage-foot">
              <span class="ap-pill">{{ stage.result }}</span>
              <span class="ap-link">Подробнее ›</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== Детальный разбор ===== -->
    <section class="ap-sec">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Детальный разбор</span>
        <h2 class="ap-h2">Что происходит на каждом этапе</h2>
        <p class="ap-lede">Кликните на стадию слева, чтобы увидеть подробности</p>
        <div class="tc-sticky">
          <StickyScroll :items="stageDeepDive" />
        </div>
      </div>
    </section>

    <!-- ===== Цифровые инструменты ===== -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Цифровые инструменты</span>
        <h2 class="ap-h2">Центр инжиниринга</h2>
        <p class="ap-lede">
          Три технологические платформы, которые делают ESP точнее, быстрее и предсказуемее
        </p>
        <div class="ap-grid ap-grid--3">
          <div v-for="(tool, i) in digitalTools" :key="tool.title" :id="['lidar', '3d', 'digital-twin'][i]" class="ap-card ap-card--media tc-anchor">
            <img :src="['/images/team/lidar-terrain.png', '/images/team/lidar-object.png', '/images/team/digital-twin-model.png'][i]" :alt="tool.title" loading="lazy" class="ap-card-img" />
            <div class="ap-card-body">
              <h3 class="ap-h3">{{ tool.title }}</h3>
              <p class="ap-text">{{ tool.desc }}</p>
              <div class="ap-card-foot tc-tags">
                <span v-for="tag in tool.tags" :key="tag" class="ap-pill">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Замкнутый водный цикл ===== -->
    <section id="eco" class="ap-sec tc-anchor">
      <div class="ap-wrap tc-split">
        <div>
          <span class="ap-eyebrow">Замкнутый водный цикл</span>
          <h2 class="ap-h2">Экологические инновации в действии</h2>
          <p class="ap-lede">
            Мы разрабатываем и поставляем очистные системы, которые минимизируют потребление пресной воды из скважин, перенаправляя очищенные сточные воды обратно в производственные технологические циклы.
          </p>
          <div class="ap-rows">
            <div v-for="(step, i) in cycleSteps" :key="i" class="ap-row">
              <b>{{ i + 1 }}. {{ step.title }}</b>
              <span class="ap-small">{{ step.desc }}</span>
            </div>
          </div>
        </div>
        <div class="ap-card tc-stat">
          <b class="tc-stat-num">98%</b>
          <span class="tc-stat-label">Коэффициент рециркуляции воды</span>
          <p class="ap-text">
            Автоматизированный замкнутый цикл сводит сброс сточных вод в природные водоёмы практически к нулю.
          </p>
        </div>
      </div>
    </section>

    <!-- ===== Лаборатория и тур 360° ===== -->
    <section id="lab" class="ap-sec ap-sec--white tc-anchor">
      <div id="tour" class="ap-wrap tc-split tc-anchor">
        <div>
          <span class="ap-eyebrow">Лаборатория и контроль</span>
          <h2 class="ap-h2">Эталонная химическая лаборатория ESP</h2>
          <p class="ap-lede">
            Каждая капля воды проходит 14 этапов контроля: от анализа ХПК и БПК до микробиологических тестов и спектрофотометрии. Посмотрите нашу аналитическую лабораторию в интерактивном режиме 360°.
          </p>
          <div class="ap-actions">
            <button type="button" class="ap-btn" @click="labTourOpen = !labTourOpen">
              {{ labTourOpen ? 'Остановить тур' : 'Запустить тур 360°' }}
            </button>
          </div>
        </div>
        <div class="tc-tour" :class="{ 'is-on': labTourOpen }">
          <svg class="tc-tour-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3M7.5 14h9" />
          </svg>
          <p v-if="labTourOpen" class="ap-small">Панорама активна: лаборатория ESP</p>
          <p v-else class="ap-small">Панорама в режиме ожидания</p>
        </div>
      </div>
    </section>

    <!-- ===== Финальный призыв ===== -->
    <section class="ap-sec ap-cta">
      <div class="ap-wrap">
        <h2 class="ap-h2">Готовы обсудить технологическую задачу?</h2>
        <p class="ap-lede">
          Главный инженер ESP проанализирует вашу систему и предложит решения
        </p>
        <div class="ap-actions">
          <NuxtLink to="/contacts" class="ap-btn">Заказать технический аудит</NuxtLink>
          <NuxtLink to="/services" class="ap-link">Услуги ESP ›</NuxtLink>
        </div>
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

// og-картинки лежат в этом проекте: origin берём из runtimeConfig,
// чтобы смена домена правилась в одном месте.
const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead({
  title: 'Технологии ESP | LiDAR, BIM, IoT и 4 стадии очистки воды',
  meta: [
    {
      name: 'description',
      content: 'Технологический стек ESP: LiDAR-сканирование, 3D/BIM проектирование, IoT-мониторинг. 4 стадии очистки воды: механика, биология, физхимия, УФ. Цифровые двойники объектов.'
    },
    { property: 'og:title', content: 'Технологии ESP | LiDAR, BIM, IoT и 4 стадии очистки' },
    { property: 'og:description', content: 'Лазерное сканирование, 3D/BIM проектирование, цифровые двойники и полный технологический цикл очистки воды.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/technologies' }]
})

// ===== TZ CONTENT DATA =====
const waterStages = [
  { title: 'Механическая фильтрация', desc: 'Удаление крупных взвешенных частиц, песка, мусора. Решётки, песколовки, первичные отстойники.', result: 'Удаление ≥90% взвеси', color: '#002366', slug: 'mechanical-filtration' },
  { title: 'Биологическая очистка', desc: 'Активный ил разрушает органические соединения. Аэротенки, биореакторы, системы нитри-денитрификации.', result: 'БПК снижается до 10 мг/л', color: '#006039', slug: 'biological-treatment' },
  { title: 'Физико-химическая', desc: 'Флотация, коагуляция, реагентное осаждение фосфора и тяжёлых металлов. Флотаторы ESP-ФЛ серии.', result: 'Фосфор < 0.5 мг/л', color: '#1A1A1A', slug: 'physiochemical-methods' },
  { title: 'УФ-обеззараживание', desc: 'Финишное обеззараживание без хлора. Установки ESP-УФ серии — нулевой риск для экосистем водоёма.', result: '99.99% дезинфекция', color: '#002366', slug: 'uv-disinfection' }
]

const stageDeepDive = waterStages.map((s, i) => ({
  title: s.title,
  description: `${s.desc} Результат: ${s.result}.`,
  icon: ['loop', 'microbe', 'flask', 'bulb'][i],
  gradient: `linear-gradient(135deg, ${s.color} 0%, #1A1A1A 130%)`
}))

const digitalTools = [
  {
    icon: 'lidar',
    title: 'LiDAR-сканирование',
    desc: 'Лазерное сканирование действующих сооружений с точностью до 1 мм. Создаём облако точек для проектирования реконструкции без остановки производства.',
    tags: ['Faro Focus', 'Leica BLK360', 'Облако точек', 'AS-BUILT']
  },
  {
    icon: 'building',
    title: '3D/BIM-проектирование',
    desc: 'Информационная модель сооружения в Revit: от концепции до рабочей документации. Выявляем коллизии на стадии проекта, а не монтажа.',
    tags: ['Autodesk Revit', 'AutoCAD', 'Navisworks', 'IFC']
  },
  {
    icon: 'chart',
    title: 'IoT-мониторинг',
    desc: 'Датчики качества воды, расхода и давления в реальном времени. SCADA-интеграция и мобильный дашборд для диспетчерского контроля 24/7.',
    tags: ['SCADA', 'Modbus', 'MQTT', 'Дашборд']
  }
]

const cycleSteps = [
  { title: 'Вход воды', desc: 'Подача сточных вод на очистку' },
  { title: 'Очистка', desc: 'Многоступенчатая очистка и обеззараживание' },
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
.ap-cta .ap-actions { justify-content: center; }
.tc-anchor { scroll-margin-top: 100px; }

/* Облако точек в скруглённом кадре под заголовком */
.tc-hero { position: relative; height: clamp(320px, 52vw, 620px); background: #1a1a1a; }
.tc-hero-canvas { position: absolute; inset: 0; }
.tc-hero-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 0.75rem; margin-top: 0.9rem; }
.tc-hero-meta .ap-caption { margin-top: 0; }
.cursor-grab { cursor: grab; }
.cursor-grab:active { cursor: grabbing; }

/* Слайдер: кадр без наложенного текста, подпись под ним */
.tc-slider { position: relative; aspect-ratio: 16 / 8; touch-action: pan-y; }
.tc-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
.tc-slide.is-on { opacity: 1; }
.tc-count { position: absolute; top: 1rem; right: 1rem; padding: 0.25rem 0.7rem; border-radius: 999px; background: rgba(255, 255, 255, 0.85); color: var(--ap-ink); font-size: 12px; font-weight: 600; }
.tc-slide-info { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem 2rem; flex-wrap: wrap; margin-top: 1.75rem; }
.tc-slide-txt { flex: 1 1 28rem; max-width: 40rem; }
.tc-slide-title { font-weight: 600; font-size: clamp(1.4rem, 2.4vw, 1.9rem); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 0.6rem; }
.tc-slide-txt .ap-actions { margin-top: 1.25rem; }
.tc-ctrl { display: flex; align-items: center; gap: 0.75rem; }
.tc-arrow { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: #e8e8ed; color: var(--ap-ink); transition: background-color 0.2s ease; }
.tc-arrow svg { width: 16px; height: 16px; }
.tc-arrow:hover { background: #dcdce1; }
.tc-dots { display: flex; gap: 0.4rem; }
.tc-dot { width: 8px; height: 8px; border-radius: 999px; background: #c7c7cc; transition: width 0.3s ease, background-color 0.3s ease; }
.tc-dot.is-on { width: 24px; background: var(--ap-ink); }

.tc-howto .ap-card { align-items: center; text-align: center; }
.tc-howto .ap-ico { margin: 0 auto 0.4rem; }

/* Модальное окно демо — тёмное полотно для облака точек */
.tc-modal { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.95); }
.tc-modal-canvas { position: absolute; inset: 0; }
.tc-modal-close { position: absolute; top: 1.25rem; right: 1.25rem; z-index: 101; width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; background: rgba(255, 255, 255, 0.12); color: #fff; transition: background-color 0.2s ease; }
.tc-modal-close:hover { background: rgba(255, 255, 255, 0.2); }
.tc-modal-close svg { width: 20px; height: 20px; }
.tc-modal-chip { position: absolute; z-index: 101; padding: 0.5rem 1rem; border-radius: 999px; background: rgba(255, 255, 255, 0.12); color: rgba(255, 255, 255, 0.85); font-size: 13px; }
.tc-modal-chip--top { top: 1.25rem; left: 1.25rem; }
.tc-modal-chip--bottom { bottom: 1.5rem; left: 50%; transform: translateX(-50%); max-width: calc(100% - 2rem); text-align: center; }

.tc-num { font-size: 13px; font-weight: 600; color: var(--ap-accent); }
.tc-stage-foot { display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
.tc-sticky { margin-top: 2.5rem; border-radius: 22px; overflow: hidden; }
.tc-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.tc-split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 3rem; align-items: center; }
.tc-stat { align-items: center; justify-content: center; text-align: center; min-height: 20rem; padding: 2.5rem; }
.tc-stat-num { font-size: clamp(3.5rem, 8vw, 6rem); font-weight: 700; line-height: 1; letter-spacing: -0.03em; color: var(--ap-blue); }
.tc-stat-label { margin-top: 0.5rem; font-size: 15px; font-weight: 600; }
.tc-stat .ap-text { max-width: 24rem; margin-top: 0.5rem; }

.tc-tour { display: grid; place-items: center; align-content: center; gap: 0.75rem; aspect-ratio: 16 / 9; border-radius: 22px; background: var(--ap-bg); text-align: center; transition: background-color 0.4s ease; }
.tc-tour.is-on { background: #e6edf7; }
.tc-tour-ico { width: 40px; height: 40px; color: var(--ap-muted); }
.tc-tour.is-on .tc-tour-ico { color: var(--ap-blue); }

@media (max-width: 1023px) {
  .tc-split { grid-template-columns: 1fr; gap: 2rem; }
}
@media (max-width: 767px) {
  .tc-slider { aspect-ratio: 4 / 3; }
  .tc-stat { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .tc-slide, .tc-dot { transition: none; }
}
</style>

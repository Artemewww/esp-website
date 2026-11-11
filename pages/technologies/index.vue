<template>
  <div id="top" ref="root" class="dj tx">
    <!-- 1. Первый экран страницы продукта: огромный заголовок и кадр очистных -->
    <AppleHero
      eyebrow="Центр инжиниринга"
      title="Технологии очистки сточных вод"
      lede="4 стадии очистки воды — от механики до УФ-обеззараживания. LiDAR, 3D/BIM и IoT в каждом проекте ESP."
      video="/videos/mosaic/DJI_0470.mp4"
      image="/videos/hero/DJI_0470.jpg"
      alt="Отстойники очистных сооружений ESP с высоты"
    >
      <a href="#stages" class="ax-btn" @click.prevent="jump('#stages')">Стадии очистки</a>
      <a href="#demo" class="ax-link" @click.prevent="jump('#demo')">Интерактивная демонстрация</a>
    </AppleHero>

    <AppleSubBar
      title="Технологии"
      :links="[
        { label: 'Стадии очистки', href: '#stages' },
        { label: 'Процесс', href: '#process' },
        { label: 'Компетенции', href: '#competencies' },
        { label: 'Цифровые инструменты', href: '#digital' },
        { label: 'Демо', href: '#demo' },
        { label: 'Замкнутый цикл', href: '#eco' },
        { label: 'Лаборатория', href: '#lab' }
      ]"
      :cta="{ label: 'Обсудить проект', to: '/contacts#contact-form' }"
    />

    <!-- 2. «Главное»: галерея карточек — стадии и цифровые инструменты -->
    <AppleHighlights :items="highlights" />

    <!-- 3. Стадии очистки: липкий кадр, справа сменяются главы -->
    <section id="stages" class="tx-anchor ax-sec ax-white" aria-labelledby="stages-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Процесс очистки</span>
        <h2 id="stages-h" class="ax-h2">Стадии очистки воды</h2>
        <p class="ax-lede">Каждый этап спроектирован с учётом специфики объекта и закреплён «Эталоном ESP»</p>
      </div>
      <AppleChapters :items="stageChapters" />
    </section>

    <!-- 4. Детальный разбор: «Рассмотрите ближе» -->
    <section id="process" class="tx-anchor ax-sec ax-dark" aria-labelledby="process-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Детальный разбор</span>
        <h2 id="process-h" class="ax-h2">Что происходит на каждом этапе</h2>
        <p class="ax-lede">Кликните на стадию слева, чтобы увидеть подробности</p>
      </div>
      <AppleCloserLook class="dj-reveal" :items="closer" label="Стадии очистки" />
    </section>

    <!-- 5. Компетенции: карусель причин -->
    <section id="competencies" class="tx-anchor ax-sec ax-light" aria-labelledby="comp-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Наши компетенции</span>
        <h2 id="comp-h" class="ax-h2">Интеллектуальный инжиниринг</h2>
        <p class="ax-lede">Каждая технология — это инструмент для создания безупречных экосистем очистки воды</p>
      </div>
      <AppleWhy :items="competencies" />
    </section>

    <!-- 6. Цифровые инструменты: блок сравнения трёх платформ -->
    <section id="digital" class="tx-anchor ax-sec ax-dark" aria-labelledby="digital-h">
      <div class="ax-wrap ax-head ax-head--center dj-reveal">
        <span class="ax-eyebrow">Цифровые инструменты</span>
        <h2 id="digital-h" class="ax-h2">Центр инжиниринга</h2>
        <p class="ax-lede">Три технологические платформы, которые делают ESP точнее, быстрее и предсказуемее</p>
      </div>
      <span v-for="tool in digitalTools" :id="tool.id" :key="tool.id" class="tx-anchor tx-ghost" />
      <AppleCompare dark :columns="digitalColumns" />
    </section>

    <!-- 7. Интерактивное облако точек -->
    <section id="demo" class="tx-anchor ax-sec ax-white" aria-labelledby="demo-h">
      <div class="ax-wrap ax-head ax-head--center dj-reveal">
        <span class="ax-eyebrow">Интерактивная демонстрация</span>
        <h2 id="demo-h" class="ax-h2">Попробуйте сами</h2>
        <p class="ax-lede">
          Вращайте облако точек мышью или тачем.
          Приблизьте, чтобы рассмотреть детали.
          Почувствуйте точность наших технологий.
        </p>
      </div>
      <div class="tx-cloud dj-reveal">
        <div ref="heroContainer" class="tx-cloud__canvas" aria-label="Облако точек LiDAR"></div>
        <div class="tx-cloud__meta">
          <span>30 000+ точек данных</span>
          <span>Точность до 1 мм</span>
        </div>
        <span class="tx-cloud__hint">← Вращайте мышью или тачем →</span>
      </div>
      <div class="ax-wrap">
        <ul class="tx-howto">
          <li class="dj-reveal"><ApIcon name="loop" /><span>Зажмите ЛКМ и потяните для вращения</span></li>
          <li class="dj-reveal"><ApIcon name="zoom" /><span>Колесо мыши для масштабирования</span></li>
          <li class="dj-reveal"><ApIcon name="expand" /><span>На мобильных — жесты тачем</span></li>
        </ul>
        <div class="ax-actions ax-actions--center">
          <button type="button" class="ax-btn" @click="openDemoModal">Попробовать интерактив</button>
          <NuxtLink to="/contacts" class="ax-link">Заказать сканирование объекта</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Модальное окно с 3D-демо -->
    <div v-if="isDemoModalOpen" class="tx-modal" @click.self="closeDemoModal">
      <button type="button" class="tx-modal__close" aria-label="Закрыть" @click="closeDemoModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <span class="tx-modal__chip tx-modal__chip--top">30 000+ точек LiDAR</span>
      <div ref="modalContainer" class="tx-modal__canvas"></div>
      <span class="tx-modal__chip tx-modal__chip--bottom">← Вращайте мышью • Колесо для зума • ESC для закрытия →</span>
    </div>

    <!-- 8. Замкнутый водный цикл: бенто цифр и шагов -->
    <section id="eco" class="tx-anchor ax-sec ax-light" aria-labelledby="eco-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Замкнутый водный цикл</span>
        <h2 id="eco-h" class="ax-h2">Экологические инновации в действии</h2>
        <p class="ax-lede">
          Мы разрабатываем и поставляем очистные системы, которые минимизируют потребление пресной воды из скважин, перенаправляя очищенные сточные воды обратно в производственные технологические циклы.
        </p>
      </div>
      <AppleBento :items="ecoBento" />
    </section>

    <!-- 9. Лаборатория и тур 360° -->
    <section id="lab" class="tx-anchor ax-sec ax-dark" aria-labelledby="lab-h">
      <div id="tour" class="ax-wrap tx-split tx-anchor">
        <div class="dj-reveal">
          <span class="ax-eyebrow">Лаборатория и контроль</span>
          <h2 id="lab-h" class="ax-h2">Эталонная химическая лаборатория ESP</h2>
          <p class="ax-lede">
            Каждая капля воды проходит 14 этапов контроля: от анализа ХПК и БПК до микробиологических тестов и спектрофотометрии. Посмотрите нашу аналитическую лабораторию в интерактивном режиме 360°.
          </p>
          <div class="ax-actions">
            <button type="button" class="ax-btn" @click="labTourOpen = !labTourOpen">
              {{ labTourOpen ? 'Остановить тур' : 'Запустить тур 360°' }}
            </button>
          </div>
        </div>
        <div class="tx-tour dj-reveal" :class="{ 'is-on': labTourOpen }">
          <span class="tx-tour__ring" aria-hidden="true"></span>
          <ApIcon name="flask" class="tx-tour__ico" />
          <p v-if="labTourOpen">Панорама активна: лаборатория ESP</p>
          <p v-else>Панорама в режиме ожидания</p>
        </div>
      </div>
    </section>

    <!-- 10. Финальный призыв -->
    <AppleCta title="Готовы обсудить технологическую задачу?" lede="Главный инженер ESP проанализирует вашу систему и предложит решения">
      <NuxtLink to="/contacts" class="ax-btn">Заказать технический аудит</NuxtLink>
      <NuxtLink to="/services" class="ax-link">Услуги ESP</NuxtLink>
    </AppleCta>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { useReveal } from '~/composables/useReveal'

definePageMeta({ layout: 'default' })

const root = ref(null)
useReveal(root)

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

// ===== Контент (ТЗ) =====
const waterStages = [
  { title: 'Механическая фильтрация', desc: 'Удаление крупных взвешенных частиц, песка, мусора. Решётки, песколовки, первичные отстойники.', result: 'Удаление ≥90% взвеси', slug: 'mechanical-filtration', image: '/images/reel/esp_seg7_190826.jpg' },
  { title: 'Биологическая очистка', desc: 'Активный ил разрушает органические соединения. Аэротенки, биореакторы, системы нитри-денитрификации.', result: 'БПК снижается до 10 мг/л', slug: 'biological-treatment', image: '/videos/hero/krichev_230926.jpg' },
  { title: 'Физико-химическая', desc: 'Флотация, коагуляция, реагентное осаждение фосфора и тяжёлых металлов. Флотаторы серии ESP-ФЛ.', result: 'Фосфор < 0.5 мг/л', slug: 'physiochemical-methods', image: '/videos/hero/DJI_0715.jpg' },
  { title: 'УФ-обеззараживание', desc: 'Финишное обеззараживание без хлора. Установки серии ESP-УФ.', result: '99.99% дезинфекция', slug: 'uv-disinfection', image: '/images/team/crystal-water.png' }
]

const stageDeepDive = waterStages.map((s) => ({
  title: s.title,
  description: `${s.desc} Результат: ${s.result}.`
}))
const dive = ref(0)

const digitalTools = [
  {
    id: 'lidar',
    title: 'LiDAR-сканирование',
    desc: 'Лазерное сканирование действующих сооружений с точностью до 1 мм. Создаём облако точек для проектирования реконструкции без остановки производства.',
    tags: ['Faro Focus', 'Leica BLK360', 'Облако точек', 'AS-BUILT'],
    image: '/images/tech/lidar-scan.webp'
  },
  {
    id: '3d',
    title: '3D/BIM-проектирование',
    desc: 'Информационная модель сооружения в Revit: от концепции до рабочей документации. Выявляем коллизии на стадии проекта, а не монтажа.',
    tags: ['Autodesk Revit', 'AutoCAD', 'Navisworks', 'IFC'],
    image: '/images/real4k/cad-screen.webp'
  },
  {
    id: 'digital-twin',
    title: 'IoT-мониторинг',
    desc: 'Датчики качества воды, расхода и давления в реальном времени. SCADA-интеграция и мобильный дашборд для диспетчерского контроля 24/7.',
    tags: ['SCADA', 'Modbus', 'MQTT', 'Дашборд'],
    image: '/images/tech/twin-scan.webp'
  }
]

const cycleSteps = [
  { title: 'Вход воды', desc: 'Подача сточных вод на очистку' },
  { title: 'Очистка', desc: 'Многоступенчатая очистка и обеззараживание' },
  { title: 'Возврат', desc: 'Очищенная вода возвращается в оборот' },
  { title: 'Сбережение', desc: 'Снижение углеродного следа' }
]
const labTourOpen = ref(false)

// Компетенции (раньше — слайдер): каждая карточка ведёт к своему разделу
const sliderImages = [
  {
    image: '/images/digital-twin/layer-lidar.jpg',
    tag: 'LiDAR-сканирование',
    title: 'Точность до миллиметра',
    description: 'Получаем высокоточные облака точек для реконструкции существующих сооружений. 30 000+ точек данных для точного проектирования.',
    cta: 'Подробнее',
    to: '#lidar'
  },
  {
    image: '/images/digital-twin/layer-bim.jpg',
    tag: '3D-проектирование',
    title: 'Сначала в цифровой модели, затем в металле',
    description: 'Прорабатываем решения на стадии замысла, исключаем коллизии до начала монтажа, визуализируем каждый узел системы.',
    cta: 'Подробнее',
    to: '#demo'
  },
  {
    image: '/images/digital-twin/layer-operation.jpg',
    tag: 'Цифровые двойники',
    title: 'Виртуальная копия для эксплуатации',
    description: 'Мониторинг в реальном времени, прогнозная аналитика и обучение персонала без риска для реального оборудования.',
    cta: 'Обсудить проект',
    to: '/contacts#contact-form'
  },
  {
    image: '/images/digital-twin/bimproekt.jpg',
    tag: 'Бережливый инжиниринг',
    title: 'Оптимизация процессов и затрат',
    description: 'Сокращаем сроки реализации на 30% и энергозатраты на 40% благодаря оптимизации на стадии проектирования.',
    cta: 'Запросить консультацию',
    to: '/contacts#contact-form'
  }
]

// ===== Раскладка контента по блокам страницы продукта apple.com =====
const highlights = [
  ...waterStages.map((st) => ({ title: `${st.title}.`, text: st.result, image: st.image, to: `/technologies/${st.slug}` })),
  ...digitalTools.map((t) => ({ title: `${t.title}.`, text: t.desc, image: t.image, to: `#${t.id}` }))
]
const stageChapters = waterStages.map((st, i) => ({
  kicker: String(i + 1).padStart(2, '0'),
  title: st.title,
  text: st.desc,
  chip: st.result,
  image: st.image,
  to: `/technologies/${st.slug}`
}))
const closer = waterStages.map((st, i) => ({
  label: stageDeepDive[i].title,
  text: stageDeepDive[i].description,
  chip: st.result,
  image: st.image,
  to: `/technologies/${st.slug}`
}))
const competencies = sliderImages.map((sl) => ({ kicker: sl.tag, title: sl.title, text: sl.description, image: sl.image, contain: true, to: sl.to }))
const digitalColumns = digitalTools.map((t, i) => ({
  eyebrow: String(i + 1).padStart(2, '0'),
  title: t.title,
  text: t.desc,
  image: t.image,
  rows: t.tags.map((tag) => ({ label: tag }))
}))
const ecoBento = [
  { size: 'lg', image: '/images/home/pond-filled.webp', alt: 'Наполненный пруд-накопитель очищенной воды', value: '98%', label: 'Коэффициент рециркуляции воды', text: 'Автоматизированный замкнутый цикл сводит сброс сточных вод в природные водоёмы практически к нулю.' },
  ...cycleSteps.map((st, i) => ({ value: String(i + 1), label: st.title, text: st.desc, size: i < 2 ? 'sm' : 'md', tone: i === 3 ? 'ink' : '' }))
]

// Плавный переход к якорю с учётом шапки (56) и подполосы (52)
const jump = (href) => {
  const el = document.querySelector(href)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 108, behavior: reduce ? 'auto' : 'smooth' })
}

// ===== Облако точек (общая сцена для блока и модального окна) =====
function createCloud(container, { wheelZoom = false } = {}) {
  const width = container.offsetWidth
  const height = container.offsetHeight
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0b0d10, 0.015)
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(0, 15, 80)
  camera.lookAt(0, 0, 0)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x0b0d10, 1)
  container.appendChild(renderer.domElement)

  const geometry = new THREE.BufferGeometry()
  const vertices = []
  const colors = []
  const cB = new THREE.Color(0x002366), cG = new THREE.Color(0x006039), cL = new THREE.Color(0x00d4ff)
  for (let i = 0; i < 25000; i++) {
    const layer = Math.floor(Math.random() * 4)
    const t = Math.random() * Math.PI * 2
    const r = 15 + layer * 8 + Math.random() * 5
    const x = Math.cos(t) * r + (Math.random() - 0.5) * 12
    const z = Math.sin(t) * r + (Math.random() - 0.5) * 12
    const y = layer * 12 + (Math.random() - 0.5) * 8 + Math.sin(x * 0.15) * 3
    vertices.push(x, y, z)
    const col = layer === 0 ? cB.clone() : layer === 1 ? cB.clone().lerp(cL, 0.4) : layer === 2 ? cL.clone() : cG.clone()
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
  const particles = new THREE.Points(geometry, material)
  scene.add(particles)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let dragging = false, lastX = 0, lastY = 0, raf = 0, visible = true
  const rotate = (x, y) => {
    particles.rotation.y += (x - lastX) * 0.005
    particles.rotation.x += (y - lastY) * 0.005
    lastX = x; lastY = y
  }
  const onDown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY }
  const onMove = (e) => { if (dragging) rotate(e.clientX, e.clientY) }
  const onUp = () => { dragging = false }
  const onTouchStart = (e) => { if (e.touches.length === 1) { dragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; e.preventDefault() } }
  const onTouchMove = (e) => { if (!dragging || e.touches.length !== 1) return; rotate(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault() }
  const onWheel = (e) => {
    e.preventDefault()
    camera.position.z = Math.max(30, Math.min(150, camera.position.z + e.deltaY * 0.05))
  }
  const onResize = () => {
    const w = container.offsetWidth, h = container.offsetHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  container.addEventListener('mousedown', onDown)
  container.addEventListener('mousemove', onMove)
  container.addEventListener('mouseup', onUp)
  container.addEventListener('mouseleave', onUp)
  container.addEventListener('touchstart', onTouchStart, { passive: false })
  container.addEventListener('touchmove', onTouchMove, { passive: false })
  container.addEventListener('touchend', onUp)
  if (wheelZoom) container.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('resize', onResize)

  // Рисуем только когда блок на экране
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(container)

  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (!visible) return
    if (!reduce) material.uniforms.time.value = performance.now() * 0.001
    if (!dragging && !reduce) particles.rotation.y += 0.0015
    renderer.render(scene, camera)
  }
  tick()

  return () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    window.removeEventListener('resize', onResize)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    renderer.domElement.parentNode?.removeChild(renderer.domElement)
  }
}

const heroContainer = ref(null)
let disposeHero = null
let heroWatch = null

const isDemoModalOpen = ref(false)
const modalContainer = ref(null)
let disposeModal = null

const openDemoModal = () => {
  isDemoModalOpen.value = true
  document.body.style.overflow = 'hidden'
  setTimeout(() => {
    if (modalContainer.value) disposeModal = createCloud(modalContainer.value, { wheelZoom: true })
  }, 120)
}
const closeDemoModal = () => {
  isDemoModalOpen.value = false
  document.body.style.overflow = ''
  disposeModal?.()
  disposeModal = null
}
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isDemoModalOpen.value) closeDemoModal()
}

onMounted(() => {
  // Сцену создаём, только когда блок с облаком подходит к экрану
  heroWatch = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || disposeHero || !heroContainer.value) return
    disposeHero = createCloud(heroContainer.value)
    heroWatch.disconnect()
  }, { rootMargin: '300px 0px' })
  if (heroContainer.value) heroWatch.observe(heroContainer.value)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  heroWatch?.disconnect()
  disposeHero?.()
  disposeModal?.()
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped src="../../components/apple/apple.css"></style>
<style scoped>
.tx { overflow-x: clip; background: #fff; }
.tx-anchor { scroll-margin-top: 116px; }
.tx-ghost { display: block; height: 0; }

/* Облако точек: сцена со скруглением, как медиа apple.com */
.tx-cloud { position: relative; width: min(1260px, 87.5vw); height: clamp(380px, 50vw, 680px); margin: 0 auto; overflow: hidden; border-radius: 28px; background: #0b0d10; cursor: grab; }
.tx-cloud:active { cursor: grabbing; }
.tx-cloud__canvas { position: absolute; inset: 0; }
.tx-cloud__meta { position: absolute; top: 24px; left: 24px; display: flex; flex-wrap: wrap; gap: 8px; pointer-events: none; }
.tx-cloud__meta span, .tx-cloud__hint { padding: 8px 16px; border-radius: 980px; font-size: 14px; letter-spacing: -0.016em; color: #f5f5f7; background: rgba(66, 66, 69, 0.72); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.tx-cloud__hint { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); white-space: nowrap; pointer-events: none; }
.tx-howto { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin: 48px 0 0; padding: 0; list-style: none; text-align: center; }
.tx-howto li { display: flex; flex-direction: column; align-items: center; gap: 12px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.tx-howto :deep(svg) { width: 32px; height: 32px; color: #1d1d1f; }

/* Модальное окно демо */
.tx-modal { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.95); }
.tx-modal__canvas { position: absolute; inset: 0; }
.tx-modal__close { position: absolute; top: 20px; right: 20px; z-index: 101; width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; background: rgba(66, 66, 69, 0.72); color: #f5f5f7; transition: background-color 0.2s ease; }
.tx-modal__close:hover { background: rgba(90, 90, 94, 0.8); }
.tx-modal__close svg { width: 20px; height: 20px; }
.tx-modal__chip { position: absolute; z-index: 101; padding: 8px 16px; border-radius: 980px; background: rgba(66, 66, 69, 0.72); color: #f5f5f7; font-size: 14px; font-family: var(--dj-font); }
.tx-modal__chip--top { top: 20px; left: 20px; }
.tx-modal__chip--bottom { bottom: 24px; left: 50%; transform: translateX(-50%); max-width: calc(100% - 32px); text-align: center; }

/* Лаборатория */
.tx-split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: clamp(32px, 5vw, 72px); align-items: center; }
.tx-tour { position: relative; display: grid; place-items: center; align-content: center; gap: 14px; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 28px; background: radial-gradient(circle at 50% 50%, #2a2a2d 0%, #1d1d1f 70%); text-align: center; }
.tx-tour p { position: relative; font-size: 14px; color: #86868b; }
.tx-tour__ico { position: relative; width: 44px; height: 44px; color: #86868b; transition: color 0.4s ease; }
.tx-tour.is-on .tx-tour__ico { color: #f5f5f7; }
.tx-tour__ring { position: absolute; left: 50%; top: 50%; width: 180px; height: 180px; margin: -110px 0 0 -90px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.14); }
.tx-tour.is-on .tx-tour__ring { animation: tx-spin 6s linear infinite; border-top-color: rgba(255, 255, 255, 0.7); }
@keyframes tx-spin { to { transform: rotate(360deg); } }

@media (max-width: 833px) {
  .tx-split { grid-template-columns: 1fr; }
}
@media (max-width: 734px) {
  .tx-cloud { border-radius: 22px; }
  .tx-howto { grid-template-columns: 1fr; gap: 22px; }
  .tx-cloud__hint { font-size: 12px; }
  .ax-h2 { overflow-wrap: break-word; hyphens: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .tx-tour.is-on .tx-tour__ring { animation: none; }
}
</style>

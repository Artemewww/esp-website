<template>
  <div ref="root" class="dj tx">
    <!-- 1. Первый экран: кадр очистных во всю ширину -->
    <DjPageHero
      eyebrow="Центр инжиниринга"
      title="Технологии: Визуализация сложности"
      lede="4 стадии очистки воды — от механики до УФ-обеззараживания. LiDAR, 3D/BIM и IoT в каждом проекте ESP."
      video="/videos/mosaic/DJI_0470.mp4"
      image="/videos/hero/DJI_0470.jpg"
      alt="Отстойники очистных сооружений ESP с высоты"
    >
      <a href="#stages" class="dj-btn dj-btn--white dj-btn--lg" @click.prevent="jump('#stages')">Стадии очистки</a>
      <a href="#demo" class="dj-btn dj-btn--glass dj-btn--lg" @click.prevent="jump('#demo')">Интерактивная демо</a>
    </DjPageHero>

    <DjSubnav
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

    <!-- 2. Стадии очистки: четыре плитки-кадра -->
    <section id="stages" class="tx-anchor tx-block" aria-labelledby="stages-h">
      <div class="dj-wrap dj-center tx-head dj-reveal">
        <span class="dj-eyebrow">Процесс очистки</span>
        <h2 id="stages-h" class="dj-h2 tx-big">Стадии очистки воды</h2>
        <p class="dj-lede">Каждый этап спроектирован с учётом специфики объекта и закреплён «Эталоном ESP»</p>
      </div>
      <div class="dj-tiles dj-tiles--2">
        <NuxtLink
          v-for="(stage, i) in waterStages"
          :key="stage.slug"
          :to="`/technologies/${stage.slug}`"
          class="dj-tile tx-stage dj-reveal"
        >
          <span class="dj-tile__eyebrow">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="dj-tile__title">{{ stage.title }}</h3>
          <p class="dj-tile__sub">{{ stage.desc }}</p>
          <span class="tx-chip">{{ stage.result }}</span>
          <span class="dj-links"><span class="dj-more">Подробнее</span></span>
          <span class="dj-tile__media"><img :src="stage.image" :alt="stage.title" loading="lazy" decoding="async" /></span>
        </NuxtLink>
      </div>
    </section>

    <!-- 3. Детальный разбор: стадии слева, кадр и описание справа -->
    <section id="process" class="dj-sec dj-sec--dark tx-anchor" aria-labelledby="process-h">
      <div class="dj-wrap">
        <div class="dj-center tx-head dj-reveal">
          <span class="dj-eyebrow">Детальный разбор</span>
          <h2 id="process-h" class="dj-h2 tx-big">Что происходит на каждом этапе</h2>
          <p class="dj-lede">Кликните на стадию слева, чтобы увидеть подробности</p>
        </div>
        <div class="tx-dive dj-reveal">
          <div class="tx-dive__list" role="tablist" aria-label="Стадии очистки">
            <button
              v-for="(s, i) in stageDeepDive"
              :key="s.title"
              type="button"
              role="tab"
              class="tx-dive__tab"
              :class="{ 'is-on': dive === i }"
              :aria-selected="dive === i"
              @click="dive = i"
            >
              <span class="tx-dive__n">{{ String(i + 1).padStart(2, '0') }}</span>
              <span>{{ s.title }}</span>
            </button>
          </div>
          <div class="tx-dive__panel" role="tabpanel">
            <Transition name="tx-fade" mode="out-in">
              <div :key="dive" class="tx-dive__body">
                <div class="tx-dive__media"><img :src="waterStages[dive].image" :alt="stageDeepDive[dive].title" loading="lazy" decoding="async" /></div>
                <div class="tx-dive__txt">
                  <span class="tx-dive__result">{{ waterStages[dive].result }}</span>
                  <h3 class="dj-h3">{{ stageDeepDive[dive].title }}</h3>
                  <p>{{ stageDeepDive[dive].description }}</p>
                  <NuxtLink :to="`/technologies/${waterStages[dive].slug}`" class="dj-more dj-more--light">Подробнее</NuxtLink>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Компетенции: четыре плитки на светлом градиенте -->
    <section id="competencies" class="tx-anchor tx-block" aria-labelledby="comp-h">
      <div class="dj-wrap dj-center tx-head dj-reveal">
        <span class="dj-eyebrow">Наши компетенции</span>
        <h2 id="comp-h" class="dj-h2 tx-big">Интеллектуальный инжиниринг</h2>
        <p class="dj-lede">Каждая технология — это инструмент для создания безупречных экосистем очистки воды</p>
      </div>
      <div class="dj-tiles dj-tiles--2">
        <component
          :is="slide.to.startsWith('#') ? 'a' : NuxtLinkCmp"
          v-for="slide in sliderImages"
          :key="slide.title"
          v-bind="slide.to.startsWith('#') ? { href: slide.to } : { to: slide.to }"
          class="dj-tile tx-comp dj-reveal"
          @click="slide.to.startsWith('#') && ($event.preventDefault(), jump(slide.to))"
        >
          <span class="dj-tile__eyebrow">{{ slide.tag }}</span>
          <h3 class="dj-tile__title">{{ slide.title }}</h3>
          <p class="dj-tile__sub">{{ slide.description }}</p>
          <span class="dj-links"><span class="dj-more">{{ slide.cta }}</span></span>
          <span class="dj-tile__media dj-tile__media--contain"><img :src="slide.image" :alt="slide.tag" loading="lazy" decoding="async" /></span>
        </component>
      </div>
    </section>

    <!-- 5. Цифровые инструменты: тёмный кинематографичный блок -->
    <section id="digital" class="dj-sec dj-sec--dark tx-anchor tx-digital" aria-labelledby="digital-h">
      <div class="dj-wrap dj-center tx-head dj-reveal">
        <span class="dj-eyebrow">Цифровые инструменты</span>
        <h2 id="digital-h" class="dj-h2 tx-big">Центр инжиниринга</h2>
        <p class="dj-lede">Три технологические платформы, которые делают ESP точнее, быстрее и предсказуемее</p>
      </div>
      <div class="dj-tiles dj-tiles--3">
        <article
          v-for="(tool, i) in digitalTools"
          :id="tool.id"
          :key="tool.title"
          class="dj-tile dj-tile--photo tx-anchor tx-tool dj-reveal"
        >
          <span class="dj-tile__eyebrow">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="dj-tile__title">{{ tool.title }}</h3>
          <p class="dj-tile__sub">{{ tool.desc }}</p>
          <ul class="tx-tags">
            <li v-for="tag in tool.tags" :key="tag">{{ tag }}</li>
          </ul>
          <span class="dj-tile__media"><img :src="tool.image" :alt="tool.title" loading="lazy" decoding="async" /></span>
        </article>
      </div>
    </section>

    <!-- 6. Интерактивное облако точек -->
    <section id="demo" class="tx-anchor tx-demo" aria-labelledby="demo-h">
      <div class="dj-wrap dj-center tx-head dj-reveal">
        <span class="dj-eyebrow">Интерактивная демо</span>
        <h2 id="demo-h" class="dj-h2 tx-big">Попробуйте сами</h2>
        <p class="dj-lede">
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
      <div class="dj-wrap">
        <ul class="tx-howto">
          <li class="dj-reveal"><ApIcon name="loop" /><span>Зажмите ЛКМ и потяните для вращения</span></li>
          <li class="dj-reveal"><ApIcon name="zoom" /><span>Колесо мыши для масштабирования</span></li>
          <li class="dj-reveal"><ApIcon name="expand" /><span>На мобильных — жесты тачем</span></li>
        </ul>
        <div class="dj-links tx-actions">
          <button type="button" class="dj-btn dj-btn--lg" @click="openDemoModal">Попробовать интерактив</button>
          <NuxtLink to="/contacts" class="dj-more">Заказать сканирование объекта</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Модальное окно с 3D-демо -->
    <div v-if="isDemoModalOpen" class="tx-modal" @click.self="closeDemoModal">
      <button type="button" class="tx-modal__close" aria-label="Закрыть" @click="closeDemoModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <span class="tx-modal__chip tx-modal__chip--top">30 000+ точек LiDAR</span>
      <div ref="modalContainer" class="tx-modal__canvas"></div>
      <span class="tx-modal__chip tx-modal__chip--bottom">← Вращайте мышью • Колесо для зума • ESC для закрытия →</span>
    </div>

    <!-- 7. Замкнутый водный цикл -->
    <section id="eco" class="tx-anchor tx-eco" aria-labelledby="eco-h">
      <div class="dj-wrap dj-center tx-head dj-reveal">
        <span class="dj-eyebrow">Замкнутый водный цикл</span>
        <h2 id="eco-h" class="dj-h2 tx-big">Экологические инновации в действии</h2>
        <p class="dj-lede">
          Мы разрабатываем и поставляем очистные системы, которые минимизируют потребление пресной воды из скважин, перенаправляя очищенные сточные воды обратно в производственные технологические циклы.
        </p>
      </div>
      <div ref="ecoBand" class="tx-eco__band dj-reveal">
        <img :style="{ transform: `translate3d(0, ${ecoShift}px, 0) scale(1.12)` }" src="/images/home/pond-filled.webp" alt="Наполненный пруд-накопитель очищенной воды" loading="lazy" decoding="async" />
        <div class="tx-eco__stat">
          <b>98%</b>
          <span>Коэффициент рециркуляции воды</span>
          <p>Автоматизированный замкнутый цикл сводит сброс сточных вод в природные водоёмы практически к нулю.</p>
        </div>
      </div>
      <div class="dj-wrap">
        <ol class="tx-cycle">
          <li v-for="(step, i) in cycleSteps" :key="step.title" class="dj-reveal">
            <span class="tx-cycle__n">{{ i + 1 }}</span>
            <b>{{ step.title }}</b>
            <span>{{ step.desc }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- 8. Лаборатория и тур 360° -->
    <section id="lab" class="dj-sec dj-sec--dark tx-anchor" aria-labelledby="lab-h">
      <div id="tour" class="dj-wrap tx-split tx-anchor">
        <div class="dj-reveal">
          <span class="dj-eyebrow">Лаборатория и контроль</span>
          <h2 id="lab-h" class="dj-h2">Эталонная химическая лаборатория ESP</h2>
          <p class="dj-lede tx-lab-lede">
            Каждая капля воды проходит 14 этапов контроля: от анализа ХПК и БПК до микробиологических тестов и спектрофотометрии. Посмотрите нашу аналитическую лабораторию в интерактивном режиме 360°.
          </p>
          <div class="tx-lab-act">
            <button type="button" class="dj-btn dj-btn--white dj-btn--lg" @click="labTourOpen = !labTourOpen">
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

    <!-- 9. Финальный призыв -->
    <section class="dj-sec dj-sec--soft dj-center" aria-labelledby="cta-h">
      <div class="dj-wrap dj-reveal">
        <h2 id="cta-h" class="dj-h2 tx-big">Готовы обсудить технологическую задачу?</h2>
        <p class="dj-lede">Главный инженер ESP проанализирует вашу систему и предложит решения</p>
        <div class="dj-links tx-actions">
          <NuxtLink to="/contacts" class="dj-btn dj-btn--lg">Заказать технический аудит</NuxtLink>
          <NuxtLink to="/services" class="dj-more">Услуги ESP</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, resolveComponent } from 'vue'
import * as THREE from 'three'
import { useReveal } from '~/composables/useReveal'

definePageMeta({ layout: 'default' })

const NuxtLinkCmp = resolveComponent('NuxtLink')
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
  { title: 'Физико-химическая', desc: 'Флотация, коагуляция, реагентное осаждение фосфора и тяжёлых металлов. Флотаторы ESP-ФЛ серии.', result: 'Фосфор < 0.5 мг/л', slug: 'physiochemical-methods', image: '/videos/hero/DJI_0715.jpg' },
  { title: 'УФ-обеззараживание', desc: 'Финишное обеззараживание без хлора. Установки ESP-УФ серии — нулевой риск для экосистем водоёма.', result: '99.99% дезинфекция', slug: 'uv-disinfection', image: '/images/team/crystal-water.png' }
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
    image: '/images/team/lidar-terrain.png'
  },
  {
    id: '3d',
    title: '3D/BIM-проектирование',
    desc: 'Информационная модель сооружения в Revit: от концепции до рабочей документации. Выявляем коллизии на стадии проекта, а не монтажа.',
    tags: ['Autodesk Revit', 'AutoCAD', 'Navisworks', 'IFC'],
    image: '/images/team/lidar-object.png'
  },
  {
    id: 'digital-twin',
    title: 'IoT-мониторинг',
    desc: 'Датчики качества воды, расхода и давления в реальном времени. SCADA-интеграция и мобильный дашборд для диспетчерского контроля 24/7.',
    tags: ['SCADA', 'Modbus', 'MQTT', 'Дашборд'],
    image: '/images/team/digital-twin-model.png'
  }
]

const cycleSteps = [
  { title: 'Вход воды', desc: 'Подача сточных вод на очистку' },
  { title: 'Очистка', desc: 'Многоступенчатая очистка и обеззараживание' },
  { title: 'Возврат', desc: 'Кристально чистая вода в оборот' },
  { title: 'Сбережение', desc: 'Снижение углеродного следа' }
]
const labTourOpen = ref(false)

// Компетенции (раньше — слайдер): каждая карточка ведёт к своему разделу
const sliderImages = [
  {
    image: '/images/digital-twin/layer-lidar.jpg',
    tag: 'LiDAR-сканирование',
    title: 'Точность до миллиметра',
    description: 'Получаем высокоточные облака точек для реконструкции существующих сооружений. 30 000+ точек данных для идеальной точности проекта.',
    cta: 'Узнать больше',
    to: '#lidar'
  },
  {
    image: '/images/digital-twin/layer-bim.jpg',
    tag: '3D-проектирование',
    title: 'Строим дважды: в цифре и в металле',
    description: 'Создаем масштабные идеи на стадии замысла. Исключаем коллизии до начала монтажа. Визуализируем каждый узел системы.',
    cta: 'Смотреть демо',
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
    cta: 'Рассчитать экономию',
    to: '/contacts#contact-form'
  }
]

// Плавный переход к якорю с учётом шапки (56) и подполосы (52)
const jump = (href) => {
  const el = document.querySelector(href)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 108, behavior: reduce ? 'auto' : 'smooth' })
}

// ===== Лёгкий параллакс кадра «Замкнутый цикл» =====
const ecoBand = ref(null)
const ecoShift = ref(0)
let ecoRaf = 0
const onEcoScroll = () => {
  if (ecoRaf) return
  ecoRaf = requestAnimationFrame(() => {
    ecoRaf = 0
    const el = ecoBand.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    if (r.bottom < 0 || r.top > vh) return
    const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2) // -1..1
    ecoShift.value = Math.round(p * -36)
  })
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
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', onEcoScroll, { passive: true })
    onEcoScroll()
  }
})

onUnmounted(() => {
  heroWatch?.disconnect()
  disposeHero?.()
  disposeModal?.()
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', onEcoScroll)
  if (ecoRaf) cancelAnimationFrame(ecoRaf)
})
</script>

<style scoped>
.tx { overflow-x: clip; }
.tx-anchor { scroll-margin-top: 116px; }
.tx-block { padding: clamp(56px, 8vw, 104px) 0 0; }
.tx-head { margin-bottom: clamp(28px, 4vw, 48px); }
.tx-head .dj-lede { margin-top: 14px; max-width: 46ch; }
.tx-big { margin-top: 6px; font-size: clamp(32px, 4.6vw, 56px); line-height: 1.06; letter-spacing: -0.03em; text-wrap: balance; }
.tx-actions { margin-top: 32px; gap: 14px 26px; }

/* Стадии: кадр на весь фон, результат — тонкой капсулой */
.tx-stage .dj-tile__sub { max-width: 40ch; }
.tx-chip { margin-top: 14px; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 500; color: var(--dj-ink); box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.22); }
.tx-stage .dj-tile__media { height: 50%; }

/* Детальный разбор */
.tx-dive { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: clamp(20px, 3vw, 48px); align-items: stretch; }
.tx-dive__list { display: flex; flex-direction: column; border-top: 1px solid rgba(255, 255, 255, 0.12); }
.tx-dive__tab { display: flex; align-items: baseline; gap: 18px; padding: 22px 4px; text-align: left; font-size: clamp(17px, 1.5vw, 21px); font-weight: 500; color: rgba(255, 255, 255, 0.5); border-bottom: 1px solid rgba(255, 255, 255, 0.12); background: none; transition: color 0.3s ease, padding 0.4s var(--dj-ease); }
.tx-dive__tab:hover { color: rgba(255, 255, 255, 0.82); }
.tx-dive__tab.is-on { color: #fff; padding-left: 14px; box-shadow: inset 2px 0 0 #fff; }
.tx-dive__n { font-size: 13px; font-weight: 400; font-variant-numeric: tabular-nums; color: rgba(255, 255, 255, 0.45); }
.tx-dive__panel { position: relative; min-height: 100%; background: #15181c; overflow: hidden; }
.tx-dive__body { display: grid; grid-template-rows: auto 1fr; height: 100%; }
.tx-dive__media { aspect-ratio: 16 / 8; overflow: hidden; }
.tx-dive__media img { width: 100%; height: 100%; object-fit: cover; }
.tx-dive__txt { padding: clamp(22px, 3vw, 36px); display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.tx-dive__txt p { font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.7); max-width: 60ch; }
.tx-dive__result { font-size: clamp(26px, 3vw, 40px); font-weight: 300; letter-spacing: -0.02em; color: #fff; line-height: 1.1; }
.tx-fade-enter-active, .tx-fade-leave-active { transition: opacity 0.35s ease, transform 0.5s var(--dj-ease); }
.tx-fade-enter-from { opacity: 0; transform: translateY(10px); }
.tx-fade-leave-to { opacity: 0; }

/* Компетенции: изометрия на светлом градиенте */
.tx-comp { cursor: pointer; }
.tx-comp .dj-tile__sub { max-width: 44ch; }
.tx-comp .dj-tile__media { height: 52%; }

/* Цифровые инструменты */
.tx-digital { padding-bottom: clamp(44px, 6vw, 80px); }
.tx-digital .dj-tiles { max-width: 1440px; margin: 0 auto; }
.tx-tool { background: linear-gradient(180deg, #14181f 0%, #07090d 100%); }
.tx-tool::before { display: none; }
.tx-tool .dj-tile__media { inset: auto 0 0 0; height: 46%; -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 35%); mask-image: linear-gradient(180deg, transparent 0%, #000 35%); }
.tx-tool { min-height: clamp(560px, 46vw, 680px); }
.tx-tool .dj-tile__sub { max-width: 38ch; }
.tx-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin: 16px 0 0; padding: 0; list-style: none; }
.tx-tags li { padding: 4px 11px; border-radius: 999px; font-size: 12px; color: rgba(255, 255, 255, 0.86); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3); }

/* Облако точек */
.tx-demo { padding: clamp(56px, 8vw, 104px) 0; background: #fff; }
.tx-cloud { position: relative; height: clamp(360px, 52vw, 640px); margin: 0 12px; background: #0b0d10; overflow: hidden; cursor: grab; }
.tx-cloud:active { cursor: grabbing; }
.tx-cloud__canvas { position: absolute; inset: 0; }
.tx-cloud__meta { position: absolute; top: 20px; left: 20px; display: flex; flex-wrap: wrap; gap: 8px; pointer-events: none; }
.tx-cloud__meta span, .tx-cloud__hint { padding: 6px 13px; border-radius: 999px; font-size: 12px; color: rgba(255, 255, 255, 0.86); background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.tx-cloud__hint { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); white-space: nowrap; pointer-events: none; }
.tx-howto { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin: 40px auto 0; padding: 0; list-style: none; max-width: 960px; text-align: center; }
.tx-howto li { display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 15px; color: var(--dj-text); }
.tx-howto :deep(svg) { width: 30px; height: 30px; color: var(--dj-ink); }
.tx-demo .tx-actions { margin-top: 36px; }

/* Модальное окно демо */
.tx-modal { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.95); }
.tx-modal__canvas { position: absolute; inset: 0; }
.tx-modal__close { position: absolute; top: 20px; right: 20px; z-index: 101; width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; background: rgba(255, 255, 255, 0.12); color: #fff; transition: background-color 0.2s ease; }
.tx-modal__close:hover { background: rgba(255, 255, 255, 0.22); }
.tx-modal__close svg { width: 20px; height: 20px; }
.tx-modal__chip { position: absolute; z-index: 101; padding: 8px 16px; border-radius: 999px; background: rgba(255, 255, 255, 0.12); color: rgba(255, 255, 255, 0.85); font-size: 13px; font-family: var(--dj-font); }
.tx-modal__chip--top { top: 20px; left: 20px; }
.tx-modal__chip--bottom { bottom: 24px; left: 50%; transform: translateX(-50%); max-width: calc(100% - 32px); text-align: center; }

/* Замкнутый цикл */
.tx-eco { padding: clamp(56px, 8vw, 104px) 0; background: var(--dj-soft); }
.tx-eco__band { position: relative; height: clamp(420px, 48vw, 620px); margin: 0 12px; overflow: hidden; background: #0b0d10; display: flex; align-items: flex-end; justify-content: center; }
.tx-eco__band img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.tx-eco__band::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.45) 55%, rgba(0, 0, 0, 0.78) 100%); }
.tx-eco__stat { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 24px clamp(32px, 5vw, 56px); color: #fff; }
.tx-eco__stat b { font-size: clamp(72px, 12vw, 168px); font-weight: 200; line-height: 0.95; letter-spacing: -0.05em; font-variant-numeric: tabular-nums; }
.tx-eco__stat span { margin-top: 8px; font-size: clamp(16px, 1.4vw, 19px); font-weight: 600; }
.tx-eco__stat p { margin-top: 8px; max-width: 46ch; font-size: 15px; line-height: 1.55; color: rgba(255, 255, 255, 0.82); }
.tx-cycle { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; margin: clamp(36px, 5vw, 56px) 0 0; padding: 0; list-style: none; }
.tx-cycle li { display: flex; flex-direction: column; gap: 6px; padding-top: 18px; border-top: 1px solid #d5d8dc; }
.tx-cycle__n { font-size: clamp(36px, 4vw, 56px); font-weight: 200; line-height: 1; color: var(--dj-ink); letter-spacing: -0.03em; }
.tx-cycle b { margin-top: 8px; font-size: 17px; font-weight: 600; color: var(--dj-ink); }
.tx-cycle span:last-child { font-size: 14px; line-height: 1.5; color: var(--dj-muted); }

/* Лаборатория */
.tx-split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 5vw, 72px); align-items: center; }
.tx-lab-lede { margin-top: 16px; }
.tx-lab-act { margin-top: 28px; }
.tx-tour { position: relative; display: grid; place-items: center; align-content: center; gap: 14px; aspect-ratio: 16 / 9; overflow: hidden; background: radial-gradient(circle at 50% 50%, #1b2230 0%, #0f1217 70%); text-align: center; transition: background-color 0.4s ease; }
.tx-tour p { position: relative; font-size: 14px; color: rgba(255, 255, 255, 0.66); }
.tx-tour__ico { position: relative; width: 44px; height: 44px; color: rgba(255, 255, 255, 0.5); transition: color 0.4s ease; }
.tx-tour.is-on .tx-tour__ico { color: #fff; }
.tx-tour__ring { position: absolute; left: 50%; top: 50%; width: 180px; height: 180px; margin: -110px 0 0 -90px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.14); }
.tx-tour.is-on .tx-tour__ring { animation: tx-spin 6s linear infinite; border-top-color: rgba(255, 255, 255, 0.7); }
@keyframes tx-spin { to { transform: rotate(360deg); } }

@media (max-width: 1023px) {
  .tx-dive { grid-template-columns: 1fr; }
  .tx-dive__list { flex-direction: row; overflow-x: auto; border-top: 0; scrollbar-width: none; }
  .tx-dive__list::-webkit-scrollbar { display: none; }
  .tx-dive__tab { flex: 0 0 auto; padding: 14px 16px; font-size: 15px; white-space: nowrap; }
  .tx-dive__tab.is-on { padding-left: 16px; box-shadow: inset 0 -2px 0 #fff; }
  .tx-split { grid-template-columns: 1fr; }
  .tx-cycle { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 767px) {
  .tx-cloud, .tx-eco__band { margin: 0 8px; }
  .tx-howto { grid-template-columns: 1fr; gap: 22px; }
  .tx-cloud__hint { font-size: 11px; }
  .tx-dive__media { aspect-ratio: 4 / 3; }
  .tx-tool, .tx-stage, .tx-comp { min-height: 560px; }
  .tx-big { overflow-wrap: break-word; hyphens: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .tx-fade-enter-active, .tx-fade-leave-active, .tx-dive__tab { transition: none; }
  .tx-tour.is-on .tx-tour__ring { animation: none; }
  .tx-eco__band img { transform: none !important; }
}
</style>

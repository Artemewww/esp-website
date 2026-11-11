<template>
  <div id="top" ref="root" class="dj tx">
    <!-- 1. Первый экран страницы продукта: огромный заголовок и кадр очистных -->
    <AppleHero
      eyebrow="Центр инжиниринга"
      title="Технологии очистки сточных вод"
      lede="4 стадии очистки воды — от механики до УФ-обеззараживания. LiDAR, 3D/BIM и IoT в каждом проекте ESP."
      image="/images/technologies/hero.webp"
      alt="Станция очистки сточных вод с прямоугольными аэротенками на рассвете"
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
        { label: 'Замкнутый цикл', href: '#eco' }
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
        <p class="ax-lede">Каждый этап спроектирован с учётом специфики объекта и закреплён «Эталоном ESP».</p>
      </div>
      <TechStagePanels :items="stageChapters" />
    </section>

    <!-- 4. Детальный разбор: «Рассмотрите ближе» -->
    <section id="process" class="tx-anchor ax-sec ax-dark" aria-labelledby="process-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Детальный разбор</span>
        <h2 id="process-h" class="ax-h2">Что происходит на каждом этапе</h2>
        <p class="ax-lede">Выберите стадию слева, чтобы увидеть подробности.</p>
      </div>
      <AppleCloserLook class="dj-reveal" :items="closer" label="Стадии очистки" />
    </section>

    <!-- 5. Компетенции: карусель причин -->
    <section id="competencies" class="tx-anchor ax-sec ax-light" aria-labelledby="comp-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Наши компетенции</span>
        <h2 id="comp-h" class="ax-h2">Интеллектуальный инжиниринг</h2>
        <p class="ax-lede">Каждая технология делает проект точнее, а очистку — надёжнее.</p>
      </div>
      <TechTwinCards :items="competencies" rail />
    </section>

    <!-- 6. Цифровые инструменты: блок сравнения трёх платформ -->
    <section id="digital" class="tx-anchor ax-sec ax-dark" aria-labelledby="digital-h">
      <div class="ax-wrap ax-head ax-head--center dj-reveal">
        <span class="ax-eyebrow">Цифровые инструменты</span>
        <h2 id="digital-h" class="ax-h2">Центр инжиниринга</h2>
        <p class="ax-lede">Три технологические платформы, которые делают ESP точнее, быстрее и предсказуемее</p>
      </div>
      <span v-for="tool in digitalTools" :id="tool.id" :key="tool.id" class="tx-anchor tx-ghost" />
      <TechTwinCards :items="digitalColumns" tone="dark" />
    </section>

    <!-- 7. Интерактивное облако точек -->
    <section id="demo" class="tx-anchor ax-sec ax-white tx-demo" aria-labelledby="demo-h">
      <div class="ax-wrap ax-head ax-head--center dj-reveal">
        <span class="ax-eyebrow">Интерактивная демонстрация</span>
        <h2 id="demo-h" class="ax-h2">Попробуйте сами</h2>
        <p class="ax-lede">
          Вращайте облако точек мышью или тачем.
          Приблизьте, чтобы рассмотреть детали.
          Оцените точность съёмки сами.
        </p>
      </div>
      <TechPlantCloud class="dj-reveal" />
      <div class="ax-wrap">
        <ul class="tx-howto">
          <li class="dj-reveal"><ApIcon name="loop" /><span>Нажмите на модель и потяните, чтобы вращать</span></li>
          <li class="dj-reveal"><ApIcon name="zoom" /><span>Колесо мыши или щипок — приблизить здания и резервуары</span></li>
          <li class="dj-reveal"><ApIcon name="expand" /><span>Кнопка справа — на весь экран</span></li>
        </ul>
        <div class="ax-actions ax-actions--center">
          <NuxtLink to="/contacts" class="ax-link">Заказать сканирование объекта</NuxtLink>
        </div>
      </div>
    </section>

    <!-- 8. Замкнутый водный цикл: бенто цифр и шагов -->
    <section id="eco" class="tx-anchor ax-sec ax-light" aria-labelledby="eco-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Замкнутый водный цикл</span>
        <h2 id="eco-h" class="ax-h2">Экологические инновации в действии</h2>
        <p class="ax-lede">
          Мы разрабатываем и поставляем очистные системы, которые минимизируют потребление пресной воды из скважин, перенаправляя очищенные сточные воды обратно в производственные технологические циклы.
        </p>
      </div>
      <TechEcoLoop :stat="ecoStat" :steps="cycleSteps" />
    </section>

    <!-- 9. Финальный призыв (единый для всех страниц) -->
    <AppleCta title="Готовы обсудить технологическую задачу?" lede="Главный инженер ESP проанализирует вашу систему и предложит решение." />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReveal } from '~/composables/useReveal'

definePageMeta({ layout: 'default' })

const root = ref(null)
useReveal(root)

// og-картинки лежат в этом проекте: origin берём из runtimeConfig,
// чтобы смена домена правилась в одном месте.
const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead({
  title: 'Технологии ESP | LiDAR, BIM, IoT и 4 стадии очистки воды',
  meta: [
    {
      name: 'description',
      content: 'Технологический стек ESP: LiDAR-сканирование, 3D/BIM проектирование, IoT-мониторинг. 4 стадии очистки воды: механика, биология, физхимия, УФ. Цифровые двойники объектов.'
    },
    { property: 'og:title', content: 'Технологии ESP | LiDAR, BIM, IoT и 4 стадии очистки' },
    { property: 'og:description', content: 'Лазерное сканирование, 3D/BIM проектирование, цифровые двойники и полный технологический цикл очистки воды.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/technologies' }]
})

// ===== Контент (ТЗ) =====
const waterStages = [
  { title: 'Механическая фильтрация', desc: 'Удаление крупных взвешенных частиц, песка, мусора. Решётки, песколовки, первичные отстойники.', result: 'Удаление ≥90% взвеси', slug: 'mechanical-filtration', image: '/images/technologies/stage/mechanical-filtration.webp' },
  { title: 'Биологическая очистка', desc: 'Активный ил разрушает органические соединения. Аэротенки, биореакторы, системы нитри-денитрификации.', result: 'БПК снижается до 10 мг/л', slug: 'biological-treatment', image: '/images/technologies/stage/biological-treatment.webp' },
  { title: 'Физико-химическая', desc: 'Флотация, коагуляция, реагентное осаждение фосфора и тяжёлых металлов. Флотаторы серии ESP-ФЛ.', result: 'Фосфор < 0,5 мг/л', slug: 'physiochemical-methods', image: '/images/technologies/stage/physiochemical-methods.webp' },
  { title: 'УФ-обеззараживание', desc: 'Финишное обеззараживание без хлора. Установки серии ESP-УФ.', result: 'Обеззараживание 99,99%', slug: 'uv-disinfection', image: '/images/technologies/stage/uv-disinfection.webp' }
]

const stageDeepDive = waterStages.map((s) => ({
  title: s.title,
  description: `${s.desc} Результат: ${s.result}.`
}))

// Графика цифрового двойника ESP (public/images/digital-twin): только прямоугольные сооружения
const digitalTools = [
  {
    id: 'lidar',
    title: 'LiDAR-сканирование',
    desc: 'Лазерное сканирование действующих сооружений с точностью до 1 мм. Создаём облако точек для проектирования реконструкции без остановки производства.',
    tags: ['Faro Focus', 'Leica BLK360', 'Облако точек', 'AS-BUILT'],
    image: '/images/digital-twin/layer-lidar-a.webp',
    badge: 'Облако точек'
  },
  {
    id: '3d',
    title: '3D/BIM-проектирование',
    desc: 'Информационная модель сооружения в Revit: от концепции до рабочей документации. Выявляем коллизии на стадии проекта, а не монтажа.',
    tags: ['Autodesk Revit', 'AutoCAD', 'Navisworks', 'IFC'],
    image: '/images/digital-twin/layer-bim-a.webp',
    badge: 'Эталонная модель'
  },
  {
    id: 'digital-twin',
    title: 'IoT-мониторинг',
    desc: 'Датчики качества воды, расхода и давления в реальном времени. SCADA-интеграция и мобильный дашборд для диспетчерского контроля 24/7.',
    tags: ['SCADA', 'Modbus', 'MQTT', 'Дашборд'],
    image: '/images/digital-twin/testing/hmi-4.webp',
    badge: 'SCADA',
    screen: true
  }
]

const cycleSteps = [
  { title: 'Вход воды', desc: 'Подача сточных вод на очистку' },
  { title: 'Очистка', desc: 'Многоступенчатая очистка и обеззараживание' },
  { title: 'Возврат', desc: 'Очищенная вода возвращается в оборот' },
  { title: 'Сбережение', desc: 'Снижение углеродного следа' }
]
const ecoStat = { value: 98, label: 'Коэффициент рециркуляции воды', text: 'Автоматизированный замкнутый цикл сводит сброс сточных вод в природные водоёмы практически к нулю.' }

// Компетенции: путь цифрового двойника — съёмка с дрона → эталонная модель → оптимизация → эксплуатация
const competencies = [
  {
    step: 'Этап 01 · Съёмка',
    image: '/images/digital-twin/layer-lidar-a.webp',
    badge: 'Дрон + LiDAR',
    kicker: 'LiDAR-сканирование',
    title: 'Точность до миллиметра',
    text: 'Получаем высокоточные облака точек для реконструкции существующих сооружений. 30 000+ точек данных для точного проектирования.',
    cta: 'Подробнее',
    to: '#lidar'
  },
  {
    step: 'Этап 02 · Эталонная модель',
    image: '/images/digital-twin/layer-bim-a.webp',
    badge: 'BIM',
    kicker: '3D-проектирование',
    title: 'Сначала в цифровой модели, затем в металле',
    text: 'Прорабатываем решения на стадии замысла, исключаем коллизии до начала монтажа, визуализируем каждый узел системы.',
    cta: 'Подробнее',
    to: '#demo'
  },
  {
    step: 'Этап 03 · Оптимизация',
    image: '/images/digital-twin/cut/stage-03.webp',
    badge: 'Lean',
    kicker: 'Бережливый инжиниринг',
    title: 'Оптимизация процессов и затрат',
    text: 'Сокращаем сроки реализации на 30% и энергозатраты на 40% благодаря оптимизации на стадии проектирования.',
    cta: 'Обсудить проект',
    to: '/contacts#contact-form'
  },
  {
    step: 'Этап 04 · Эксплуатация',
    image: '/images/digital-twin/layer-operation-a.webp',
    badge: 'Цифровой двойник',
    kicker: 'Цифровые двойники',
    title: 'Виртуальная копия для эксплуатации',
    text: 'Мониторинг в реальном времени, прогнозная аналитика и обучение персонала без риска для реального оборудования.',
    cta: 'Обсудить проект',
    to: '/contacts#contact-form'
  }
]

// ===== Раскладка контента по блокам страницы продукта apple.com =====
const highlights = [
  ...waterStages.map((st) => ({ title: `${st.title}.`, text: st.result, image: st.image, light: true, to: `/technologies/${st.slug}` })),
  ...digitalTools.map((t) => ({ title: `${t.title}.`, text: t.desc, image: t.image, contain: true, to: `#${t.id}` }))
]
const stageChapters = waterStages.map((st, i) => ({
  title: st.title,
  text: stageDeepDive[i].description.replace(/ Результат:.*$/, ''),
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
const digitalColumns = digitalTools.map((t, i) => ({
  kicker: String(i + 1).padStart(2, '0'),
  title: t.title,
  text: t.desc,
  image: t.image,
  badge: t.badge,
  screen: t.screen,
  tags: t.tags
}))

// Плавный переход к якорю с учётом шапки (56) и подполосы (52)
const jump = (href) => {
  const el = document.querySelector(href)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 108, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<style scoped src="../../components/apple/apple.css"></style>
<style scoped>
.tx { overflow-x: clip; background: #fff; }
.tx-anchor { scroll-margin-top: 116px; }
.tx-ghost { display: block; height: 0; }

/* #39: «Главное» — компактнее по вертикали, без провала до стадий */
.tx :deep(.hl) { padding: clamp(48px, 6vw, 88px) 0 clamp(40px, 5vw, 72px); }
.tx :deep(.hl-head) { margin-bottom: clamp(24px, 3vw, 40px); }
#stages { padding-top: clamp(56px, 7vw, 100px); }

/* Демо: облако на всю ширину экрана */
.tx-demo { padding-bottom: clamp(64px, 8vw, 120px); }
.tx-howto { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin: 48px 0 0; padding: 0; list-style: none; text-align: center; }
.tx-howto li { display: flex; flex-direction: column; align-items: center; gap: 12px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.tx-howto :deep(svg) { width: 32px; height: 32px; color: #1A1A1A; }

@media (max-width: 734px) {
  .tx-howto { grid-template-columns: 1fr; gap: 22px; }
  .ax-h2 { overflow-wrap: break-word; hyphens: auto; }
}
</style>

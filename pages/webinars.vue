<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Отраслевой диалог и вебинары
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">
          Календарь экспертизы ESP
        </h1>
        <p class="text-xl text-esp-black/80 max-w-3xl mb-8">
          Регулярные образовательные вебинары, научно-практические съезды, мастер-классы по 3D-проектированию и SCADA. Мы делимся 25-летней инженерной практикой без секретов.
        </p>

        <div class="relative max-w-2xl mb-6">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-esp-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="search"
            type="search"
            placeholder="Поиск событий, спикеров..."
            class="w-full pl-12 pr-4 py-4 border border-esp-gray hover:border-esp-blue focus:border-esp-blue focus:ring-2 focus:ring-esp-blue/20 outline-none transition font-inter text-esp-black"
          />
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            v-for="t in types"
            :key="t"
            @click="activeType = t"
            class="px-5 py-2 text-sm font-medium transition-colors"
            :class="activeType === t ? 'bg-esp-black text-white' : 'bg-esp-gray text-esp-black hover:bg-esp-black/10'"
          >{{ t }}</button>
        </div>
      </div>
    </section>

    <!-- Interactive calendar -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <h2 class="font-rounded text-2xl md:text-3xl text-esp-black">Календарь событий</h2>
          <div class="flex items-center gap-4">
            <button @click="shiftMonth(-1)" class="w-9 h-9 flex items-center justify-center border border-esp-gray hover:border-esp-blue text-esp-black transition">‹</button>
            <span class="font-medium text-esp-black w-36 text-center font-inter">{{ monthLabel }}</span>
            <button @click="shiftMonth(1)" class="w-9 h-9 flex items-center justify-center border border-esp-gray hover:border-esp-blue text-esp-black transition">›</button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-px bg-esp-gray border border-esp-gray">
          <div v-for="wd in weekDays" :key="wd" class="bg-esp-black/5 text-center text-xs font-medium text-esp-black/50 py-2 font-inter">{{ wd }}</div>
          <div
            v-for="(cell, i) in calendarCells"
            :key="i"
            class="bg-white aspect-square p-2 relative"
            :class="cell.events?.length ? 'cursor-pointer hover:bg-esp-blue/5' : ''"
            @click="cell.events?.length && openRegister(cell.events[0])"
          >
            <span v-if="cell.day" class="text-sm" :class="cell.events?.length ? 'text-esp-blue font-semibold' : 'text-esp-black/70'">{{ cell.day }}</span>
            <div v-if="cell.events?.length" class="absolute bottom-2 left-2 right-2 flex flex-col gap-1">
              <span
                v-for="ev in cell.events"
                :key="ev.title"
                class="hidden md:block text-[10px] leading-tight px-1 py-0.5 truncate text-white font-inter"
                :class="ev.status === 'ЗАВЕРШЕНО' ? 'bg-esp-black/40' : 'bg-esp-blue'"
              >{{ ev.title }}</span>
              <span class="md:hidden w-1.5 h-1.5 rounded-full mx-auto" :class="cell.events[0].status === 'ЗАВЕРШЕНО' ? 'bg-esp-black/40' : 'bg-esp-blue'"></span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-6 mt-4 text-xs text-esp-black/50 font-inter">
          <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 bg-esp-blue inline-block"></span>Регистрация открыта</span>
          <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 bg-esp-black/40 inline-block"></span>Завершено / запись</span>
        </div>
      </div>
    </section>

    <!-- Events -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="ev in filteredEvents" :key="ev.title" class="bg-white p-6 hover:shadow-lg transition-all duration-300">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-2 py-1 bg-esp-blue/10 text-esp-blue text-xs font-medium font-inter">{{ ev.type }}</span>
              <span
                class="px-2 py-1 text-xs font-medium font-inter"
                :class="ev.status === 'РЕГИСТРАЦИЯ ОТКРЫТА' ? 'bg-esp-green/10 text-esp-green' : 'bg-esp-black/10 text-esp-black/60'"
              >{{ ev.status }}</span>
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-3 text-esp-black">{{ ev.title }}</h3>
            <p class="text-esp-black/70 text-sm mb-4">{{ ev.desc }}</p>
            <div class="text-sm text-esp-black/60 mb-4 space-y-1 font-inter">
              <p>{{ ev.date }}</p>
              <p>{{ ev.location }}</p>
            </div>
            <div class="flex items-center justify-between border-t border-esp-gray pt-4">
              <div>
                <p class="text-xs text-esp-black/40 font-inter">SPEAKER</p>
                <p class="font-medium text-esp-black text-sm">{{ ev.speaker }}</p>
              </div>
              <button @click="openRegister(ev)" class="px-5 py-2.5 bg-esp-blue text-white text-sm font-medium hover:bg-esp-blue/90 transition">
                {{ ev.status === 'ЗАВЕРШЕНО' ? 'Смотреть запись' : 'Участвовать' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Research Academy -->
    <section class="section-padding bg-esp-black text-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-4 font-inter">
          Committed to reproducibility
        </span>
        <h2 class="font-rounded text-3xl md:text-4xl mb-4">Научно-технический архив знаний</h2>
        <p class="text-white/70 max-w-2xl mb-10">
          Мы верим, что экологическое развитие невозможно в изоляции. ESP предоставляет доступ к архивам технических патентов, химических карт стоков и 3D-семейств оборудования для будущих инженеров.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div class="border border-white/10 p-6">
            <p class="text-xs text-esp-lidar font-inter mb-2">01. REVIT BIM LIBRARIES</p>
            <p class="text-white/80 text-sm">Загрузите параметрические модели аэраторов и мембранных фильтров для ваших КР/ТХ разделов.</p>
          </div>
          <div class="border border-white/10 p-6">
            <p class="text-xs text-esp-lidar font-inter mb-2">02. CHEMICAL PROTOCOLS</p>
            <p class="text-white/80 text-sm">Аналитические формулы реакции коагулянтов при очистке от нефтепродуктов и тяжелых металлов.</p>
          </div>
          <div class="border border-white/10 p-6">
            <p class="text-xs text-esp-lidar font-inter mb-2">03. UNIVERSITY PLACEMENTS</p>
            <p class="text-white/80 text-sm">Академические программы практики для выпускников БНТУ, БГУИР и профильных кафедр.</p>
          </div>
        </div>

        <NuxtLink to="/contacts" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition inline-block">
          Запросить научную консультацию
        </NuxtLink>
      </div>
    </section>

    <!-- Subscribe -->
    <section class="py-12 bg-esp-gray">
      <div class="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="font-rounded text-xl font-semibold text-esp-black mb-1">Уведомления об эфирах</h2>
          <p class="text-esp-black/60 text-sm">Не пропустите следующий вебинар — только анонсы новых тем и ссылки на Revit-библиотеки от инженеров ESP.</p>
        </div>
        <form @submit.prevent="subscribed = true" class="flex w-full md:w-auto gap-2">
          <input v-if="!subscribed" v-model="email" required type="email" placeholder="you@company.com" class="flex-1 md:w-64 px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
          <button v-if="!subscribed" type="submit" class="px-6 py-3 bg-esp-blue text-white font-medium hover:bg-esp-blue/90 transition whitespace-nowrap">Подписаться</button>
          <span v-else class="px-4 py-3 text-esp-green font-medium">✓ Вы подписаны</span>
        </form>
      </div>
    </section>

    <!-- Register modal -->
    <div v-if="modal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-esp-black/60" @click="modal.open = false"></div>
      <div class="relative bg-white max-w-md w-full p-8 shadow-2xl">
        <button @click="modal.open = false" class="absolute top-4 right-4 text-esp-black/50 hover:text-esp-black">✕</button>
        <div v-if="!modal.sent">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">{{ modal.title }}</h3>
          <p class="text-esp-black/60 text-sm mb-6">Оставьте контакты — пришлём ссылку на подключение и материалы события.</p>
          <form @submit.prevent="modal.sent = true" class="space-y-4">
            <input required type="text" placeholder="Ваше имя" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <input required type="email" placeholder="E-mail" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <button type="submit" class="w-full btn-primary">Зарегистрироваться</button>
          </form>
        </div>
        <div v-else class="text-center py-6">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Регистрация принята</h3>
          <p class="text-esp-black/60 text-sm">Ссылка на подключение придёт на почту за час до начала.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Вебинары и события ESP | Календарь экспертизы',
  meta: [
    { name: 'description', content: 'Вебинары, мастер-классы и саммиты ESP: 3D-проектирование, SCADA, мембранная фильтрация. Регистрация на ближайшие события.' },
    { property: 'og:title', content: 'Вебинары и события ESP' },
    { property: 'og:description', content: 'Календарь вебинаров, мастер-классов и практикумов инженеров ESP.' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.com/webinars' }]
})

const search = ref('')
const types = ['Все темы', 'Вебинары', 'Мастер-классы', 'Практикумы', 'Саммиты / Записи']
const activeType = ref('Все темы')
const email = ref('')
const subscribed = ref(false)

const events = [
  {
    type: 'WEBINAR',
    status: 'РЕГИСТРАЦИЯ ОТКРЫТА',
    title: 'Инновации в мембранной ультрафильтрации тяжелых стоков',
    desc: 'Практический вебинар о переходе на ультрафильтрацию с диаметром пор 0.02 мкм. Обсудим хим-устойчивость мембранных модулей и методы противодействия биообрастанию при непрерывной фильтрации.',
    date: '25.06.2026 • 11:00 (Минск)',
    location: 'Онлайн (Zoom конференция)',
    speaker: 'Дмитрий Громак',
    category: 'Вебинары'
  },
  {
    type: 'MASTERCLASS',
    status: 'РЕГИСТРАЦИЯ ОТКРЫТА',
    title: 'Семинар-практикум: Лазерное 3D-сканирование и проектирование в Revit',
    desc: 'Очный мастер-класс по работе с лазерными 3D-сканерами на участках застройки очистных сооружений. Прямой импорт облаков точек в Revit для построения цифрового двойника ESP.',
    date: '12.07.2026 • 10:00 – 16:00',
    location: 'Минск, головной офис ESP',
    speaker: 'Алексей Громак',
    category: 'Мастер-классы'
  },
  {
    type: 'WORKSHOP',
    status: 'РЕГИСТРАЦИЯ ОТКРЫТА',
    title: 'Синхронизация АСУ ТП и облачной телеметрии через шлюзы Modbus',
    desc: 'Технический вебинар о программировании промышленных ПЛК. Разбор передачи телеметрических данных в реальном времени на IoT-панель ESP.',
    date: '30.07.2026 • 14:00 (Минск)',
    location: 'Вебинар / интерактивный стрим',
    speaker: 'Евгений Савин',
    category: 'Практикумы'
  },
  {
    type: 'CONFERENCE',
    status: 'ЗАВЕРШЕНО',
    title: 'СНГ Конгресс: Декарбонизация и эко-безопасность промышленных узлов',
    desc: 'Экологический саммит по внедрению систем замкнутого оборотного водоснабжения на тяжелых химических и металлургических комбинатах.',
    date: '14.05.2026 • 10:00 – 18:00',
    location: 'Москва / видеозапись',
    speaker: 'Алексей Громак',
    category: 'Саммиты / Записи'
  }
]

// ===== Interactive calendar =====
const parseEventDate = (str) => {
  const m = str.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (!m) return null
  return { day: parseInt(m[1], 10), month: parseInt(m[2], 10) - 1, year: parseInt(m[3], 10) }
}
const eventsWithDates = events.map(e => ({ ...e, parsedDate: parseEventDate(e.date) }))

const firstEventDate = eventsWithDates.find(e => e.parsedDate)?.parsedDate
const calendarMonth = ref(firstEventDate ? firstEventDate.month : new Date().getMonth())
const calendarYear = ref(firstEventDate ? firstEventDate.year : new Date().getFullYear())

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const monthLabel = computed(() => `${monthNames[calendarMonth.value]} ${calendarYear.value}`)

const shiftMonth = (delta) => {
  let m = calendarMonth.value + delta
  let y = calendarYear.value
  if (m < 0) { m = 11; y -= 1 }
  if (m > 11) { m = 0; y += 1 }
  calendarMonth.value = m
  calendarYear.value = y
}

const calendarCells = computed(() => {
  const daysInMonth = new Date(calendarYear.value, calendarMonth.value + 1, 0).getDate()
  const firstWeekday = (new Date(calendarYear.value, calendarMonth.value, 1).getDay() + 6) % 7 // Monday = 0
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push({ day: null })
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = eventsWithDates.filter(e =>
      e.parsedDate && e.parsedDate.day === d && e.parsedDate.month === calendarMonth.value && e.parsedDate.year === calendarYear.value
    )
    cells.push({ day: d, events: dayEvents })
  }
  return cells
})

const filteredEvents = computed(() => {
  let r = events
  if (activeType.value !== 'Все темы') r = r.filter(e => e.category === activeType.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    r = r.filter(e => e.title.toLowerCase().includes(q) || e.speaker.toLowerCase().includes(q))
  }
  return r
})

const modal = ref({ open: false, sent: false, title: '' })
const openRegister = (ev) => {
  modal.value = { open: true, sent: false, title: ev.title }
}
</script>

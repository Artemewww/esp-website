<template>
  <div class="ap">
    <!-- Hero -->
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Отраслевой диалог и вебинары</span>
        <h1 class="ap-title">Календарь экспертизы ESP</h1>
        <p class="ap-lede">Регулярные образовательные вебинары, научно-практические съезды, мастер-классы по 3D-проектированию и SCADA. Мы делимся 25-летней инженерной практикой без секретов.</p>
      </div>
    </section>

    <section class="ap-sec ap-sec--white ap-sec--tight wb-filters">
      <div class="ap-wrap">
        <div class="wb-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="search"
            type="search"
            placeholder="Поиск событий, спикеров..."
            class="ap-input"
          />
        </div>

        <div class="ap-tabs" role="tablist" aria-label="Темы событий">
          <button
            v-for="t in types"
            :key="t"
            type="button"
            role="tab"
            :aria-selected="activeType === t"
            class="ap-tab"
            :class="{ 'is-on': activeType === t }"
            @click="activeType = t"
          >{{ t }}</button>
        </div>

        <div class="ap-media wb-media">
          <img src="/images/team/office-interior.png" alt="Вебинары и мероприятия ESP" />
        </div>
      </div>
    </section>

    <!-- Interactive calendar -->
    <section class="ap-sec">
      <div class="ap-wrap">
        <div class="ap-head">
          <h2 class="ap-h2">Календарь событий</h2>
          <div class="wb-month">
            <button type="button" class="wb-arrow" aria-label="Предыдущий месяц" @click="shiftMonth(-1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
            </button>
            <span class="wb-month-label">{{ monthLabel }}</span>
            <button type="button" class="wb-arrow" aria-label="Следующий месяц" @click="shiftMonth(1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <div class="wb-cal">
          <div v-for="wd in weekDays" :key="wd" class="wb-wd">{{ wd }}</div>
          <div
            v-for="(cell, i) in calendarCells"
            :key="i"
            class="wb-cell"
            :class="{ 'is-ev': cell.events?.length, 'is-empty': !cell.day }"
            @click="cell.events?.length && openRegister(cell.events[0])"
          >
            <span v-if="cell.day" class="wb-day">{{ cell.day }}</span>
            <div v-if="cell.events?.length" class="wb-evs">
              <span
                v-for="ev in cell.events"
                :key="ev.title"
                class="wb-ev"
                :class="{ 'is-done': ev.status === 'ЗАВЕРШЕНО' }"
              >{{ ev.title }}</span>
              <span class="wb-dot" :class="{ 'is-done': cell.events[0].status === 'ЗАВЕРШЕНО' }"></span>
            </div>
          </div>
        </div>
        <div class="wb-legend">
          <span><i class="wb-key"></i>Регистрация открыта</span>
          <span><i class="wb-key is-done"></i>Завершено / запись</span>
        </div>
      </div>
    </section>

    <!-- Events -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <div class="ap-grid ap-grid--2 wb-events">
          <div v-for="ev in filteredEvents" :key="ev.title" class="ap-card">
            <div class="wb-tags">
              <span class="ap-pill">{{ ev.type }}</span>
              <span class="ap-pill" :class="ev.status === 'РЕГИСТРАЦИЯ ОТКРЫТА' ? 'wb-open' : 'wb-closed'">{{ ev.status }}</span>
            </div>
            <h3 class="ap-h3">{{ ev.title }}</h3>
            <p class="ap-text">{{ ev.desc }}</p>
            <div class="ap-small wb-when">
              <p>{{ ev.date }}</p>
              <p>{{ ev.location }}</p>
            </div>
            <div class="ap-card-foot wb-foot">
              <div>
                <p class="ap-small">SPEAKER</p>
                <p class="wb-speaker">{{ ev.speaker }}</p>
              </div>
              <button type="button" class="ap-btn" @click="openRegister(ev)">
                {{ ev.status === 'ЗАВЕРШЕНО' ? 'Смотреть запись' : 'Участвовать' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Research Academy -->
    <section class="ap-sec">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Committed to reproducibility</span>
        <h2 class="ap-h2">Научно-технический архив знаний</h2>
        <p class="ap-lede">
          Мы верим, что экологическое развитие невозможно в изоляции. ESP предоставляет доступ к архивам технических патентов, химических карт сточных вод и 3D-семейств оборудования для будущих инженеров.
        </p>

        <div class="ap-media wb-media">
          <img src="/images/team/crystal-water.png" alt="" loading="lazy" />
        </div>

        <div class="ap-grid ap-grid--3">
          <div class="ap-card">
            <span class="wb-num">01. REVIT BIM LIBRARIES</span>
            <p class="ap-text">Загрузите параметрические модели аэраторов и мембранных фильтров для ваших КР/ТХ разделов.</p>
          </div>
          <div class="ap-card">
            <span class="wb-num">02. CHEMICAL PROTOCOLS</span>
            <p class="ap-text">Аналитические формулы реакции коагулянтов при очистке от нефтепродуктов и тяжелых металлов.</p>
          </div>
          <div class="ap-card">
            <span class="wb-num">03. UNIVERSITY PLACEMENTS</span>
            <p class="ap-text">Академические программы практики для выпускников БНТУ, БГУИР и профильных кафедр.</p>
          </div>
        </div>

        <div class="ap-actions">
          <NuxtLink to="/contacts" class="ap-btn">Запросить научную консультацию</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Subscribe -->
    <section class="ap-sec ap-sec--white ap-sec--tight">
      <div class="ap-wrap wb-sub-row">
        <div>
          <h2 class="ap-h3">Уведомления об эфирах</h2>
          <p class="ap-text">Не пропустите следующий вебинар — только анонсы новых тем и ссылки на Revit-библиотеки от инженеров ESP.</p>
        </div>
        <form class="wb-sub-form" @submit.prevent="subscribe">
          <input v-if="!subscribed" v-model="email" name="email" autocomplete="email" required type="email" placeholder="you@company.com" class="ap-input" />
          <button v-if="!subscribed" type="submit" class="ap-btn" :disabled="subLead.sending.value">{{ subLead.sending.value ? 'Отправка...' : 'Подписаться' }}</button>
          <LeadConsent v-if="!subscribed" v-model="subConsent" />
          <p v-if="subLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ subLead.error.value }}</p>
          <span v-else class="ap-note-ok">✓ Вы подписаны</span>
        </form>
      </div>
    </section>

    <!-- Register modal -->
    <div v-if="modal.open" class="wb-modal">
      <div class="wb-modal__backdrop" @click="modal.open = false"></div>
      <div class="wb-modal__panel">
        <button type="button" class="wb-modal__close" aria-label="Закрыть" @click="modal.open = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div v-if="!modal.sent">
          <h3 class="ap-h3">{{ modal.title }}</h3>
          <p class="ap-text wb-modal__sub">Оставьте контакты — пришлём ссылку на подключение и материалы события.</p>
          <form class="wb-modal__form" @submit.prevent="register">
            <input v-model="regForm.name" name="name" autocomplete="name" required type="text" placeholder="Ваше имя" class="ap-input" />
            <input v-model="regForm.email" name="email" autocomplete="email" required type="email" placeholder="E-mail" class="ap-input" />
            <input v-model="regForm.company" name="company" autocomplete="organization" type="text" placeholder="Организация" class="ap-input" />
            <LeadConsent v-model="regForm.consent" />
            <p v-if="regLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ regLead.error.value }}</p>
            <button type="submit" class="ap-btn ap-btn--block" :disabled="regLead.sending.value">{{ regLead.sending.value ? 'Отправка...' : 'Зарегистрироваться' }}</button>
          </form>
        </div>
        <div v-else class="wb-modal__done">
          <h3 class="ap-h3">Регистрация принята</h3>
          <p class="ap-text">Ссылка на подключение придёт на почту за час до начала.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import webinarDefaults from '~~/content/defaults/webinars.json'
import { ref, computed } from 'vue'

useHead({
  title: 'Вебинары и события ESP | Календарь экспертизы',
  meta: [
    { name: 'description', content: 'Вебинары, мастер-классы и саммиты ESP: 3D-проектирование, SCADA, мембранная фильтрация. Регистрация на ближайшие события.' },
    { property: 'og:title', content: 'Вебинары и события ESP' },
    { property: 'og:description', content: 'Календарь вебинаров, мастер-классов и практикумов инженеров ESP.' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/webinars' }]
})

const search = ref('')
const types = ['Все темы', 'Вебинары', 'Мастер-классы', 'Практикумы', 'Саммиты / Записи']
const activeType = ref('Все темы')
const email = ref('')
const subscribed = ref(false)
const subConsent = ref(false)
const subLead = useLead('subscribe')
const subscribe = async (e) => {
  subscribed.value = await subLead.send({ email: email.value, subject: 'Анонсы вебинаров', consent: subConsent.value }, [], e)
}

// Анонсы приходят из админки (/admin → «Вебинары и события»).
const events = useEditableList('webinars', webinarDefaults)

// ===== Interactive calendar =====
const parseEventDate = (str) => {
  const m = str.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (!m) return null
  return { day: parseInt(m[1], 10), month: parseInt(m[2], 10) - 1, year: parseInt(m[3], 10) }
}
const eventsWithDates = computed(() => events.value.map(e => ({ ...e, parsedDate: parseEventDate(e.date) })))

const firstEventDate = computed(() => eventsWithDates.value.find(e => e.parsedDate)?.parsedDate)
const calendarMonth = ref(firstEventDate.value ? firstEventDate.value.month : new Date().getMonth())
const calendarYear = ref(firstEventDate.value ? firstEventDate.value.year : new Date().getFullYear())

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
    const dayEvents = eventsWithDates.value.filter(e =>
      e.parsedDate && e.parsedDate.day === d && e.parsedDate.month === calendarMonth.value && e.parsedDate.year === calendarYear.value
    )
    cells.push({ day: d, events: dayEvents })
  }
  return cells
})

const filteredEvents = computed(() => {
  let r = events.value
  if (activeType.value !== 'Все темы') r = r.filter(e => e.category === activeType.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    r = r.filter(e => e.title.toLowerCase().includes(q) || e.speaker.toLowerCase().includes(q))
  }
  return r
})

const modal = ref({ open: false, sent: false, title: '' })
const regForm = ref({ name: '', email: '', company: '', consent: false })
const regLead = useLead('webinar')
const register = async (e) => {
  modal.value.sent = await regLead.send({ ...regForm.value, subject: modal.value.title }, [], e)
}
const openRegister = (ev) => {
  modal.value = { open: true, sent: false, title: ev.title }
}
</script>

<style scoped>
.wb-search { position: relative; max-width: 40rem; }
.wb-search svg { position: absolute; left: 1rem; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: #6e6e73; pointer-events: none; }
.wb-search .ap-input { padding-left: 2.75rem; }
.wb-media img { aspect-ratio: 16 / 6; object-fit: cover; }
@media (max-width: 767px) { .wb-media img { aspect-ratio: 16 / 9; } }

.wb-month { display: flex; align-items: center; gap: 0.6rem; }
.wb-month-label { min-width: 8.5rem; text-align: center; font-size: 15px; font-weight: 600; }
.wb-arrow { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: #e8e8ed; color: #1d1d1f; transition: background-color .2s ease; }
.wb-arrow:hover { background: #dcdce1; }
.wb-arrow svg { width: 16px; height: 16px; }

.wb-cal { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; margin-top: 2rem; padding: 0.75rem; border-radius: 18px; background: #fff; }
.wb-wd { padding: 0.4rem 0; text-align: center; font-size: 12px; font-weight: 600; color: #6e6e73; }
.wb-cell { position: relative; aspect-ratio: 1; padding: 0.5rem; border-radius: 12px; background: #f5f5f7; min-width: 0; }
.wb-cell.is-empty { background: transparent; }
.wb-cell.is-ev { cursor: pointer; background: rgba(0, 35, 102, .06); transition: background-color .2s ease; }
.wb-cell.is-ev:hover { background: rgba(0, 35, 102, .12); }
.wb-day { font-size: 14px; color: #6e6e73; }
.wb-cell.is-ev .wb-day { color: #002366; font-weight: 700; }
.wb-evs { position: absolute; left: 0.4rem; right: 0.4rem; bottom: 0.4rem; display: flex; flex-direction: column; gap: 3px; }
.wb-ev { display: none; padding: 2px 6px; border-radius: 6px; font-size: 10px; line-height: 1.3; color: #fff; background: #002366; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wb-ev.is-done, .wb-dot.is-done, .wb-key.is-done { background: #a1a1a6; }
.wb-dot { width: 6px; height: 6px; margin: 0 auto; border-radius: 50%; background: #002366; }
@media (min-width: 768px) { .wb-ev { display: block; } .wb-dot { display: none; } }
@media (max-width: 767px) { .wb-cal { gap: 3px; padding: 0.4rem; } .wb-cell { padding: 0.3rem; border-radius: 8px; } .wb-day { font-size: 12px; } }
.wb-legend { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; margin-top: 1rem; font-size: 13px; color: #6e6e73; }
.wb-legend span { display: inline-flex; align-items: center; gap: 0.5rem; }
.wb-key { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #002366; }

.wb-events { margin-top: 0; }
.wb-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
.wb-open { background: rgba(0, 96, 57, .09); color: #006039; }
.wb-closed { background: rgba(0, 0, 0, .06); color: #6e6e73; }
.wb-when { display: grid; gap: 0.15rem; margin-top: 0.25rem; }
.wb-foot { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; border-top: 1px solid #d2d2d7; margin-top: auto; padding-top: 1rem; }
.wb-speaker { font-size: 15px; font-weight: 600; color: #1d1d1f; }
.wb-num { font-size: 12px; font-weight: 600; letter-spacing: .02em; color: #2f6fb8; }

.wb-sub-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.25rem 2rem; }
.wb-sub-row > div { flex: 1 1 22rem; }
.wb-sub-form { display: flex; flex-wrap: wrap; gap: 0.6rem; width: 100%; max-width: 26rem; }
.wb-sub-form .lead-consent, .wb-sub-form p { flex-basis: 100%; }
.wb-sub-form .ap-input { flex: 1; min-width: 0; border-radius: 999px; padding: 0.7rem 1.1rem; }

.wb-modal { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.wb-modal__backdrop { position: absolute; inset: 0; background: rgba(29, 29, 31, .55); backdrop-filter: blur(6px); }
.wb-modal__panel { position: relative; width: 100%; max-width: 28rem; padding: 2rem; border-radius: 22px; background: #fff; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .35); }
.wb-modal__close { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: #f5f5f7; color: #1d1d1f; }
.wb-modal__close svg { width: 16px; height: 16px; }
.wb-modal__sub { margin: 0.5rem 0 1.25rem; }
.wb-modal__form { display: grid; gap: 0.75rem; }
.wb-modal__done { display: grid; gap: 0.5rem; padding: 1.5rem 0; text-align: center; }
</style>

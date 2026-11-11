<template>
  <div ref="root" class="dj">
    <DjPageHero eyebrow="Вебинары и события" title="Календарь событий ESP" lede="Образовательные вебинары, научно-практические конференции, мастер-классы по 3D-проектированию и SCADA. Делимся инженерным опытом ESP." />

    <section class="dj-sec wb-filters">
      <div class="dj-wrap">
        <div class="wb-search dj-reveal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="search"
            type="search"
            placeholder="Поиск событий и спикеров"
            class="wb-input"
          />
        </div>

        <div class="wb-tabs dj-reveal" role="tablist" aria-label="Темы событий">
          <button
            v-for="t in types"
            :key="t"
            type="button"
            role="tab"
            :aria-selected="activeType === t"
            class="wb-tab"
            :class="{ 'is-on': activeType === t }"
            @click="activeType = t"
          >{{ t }}</button>
        </div>

        <div class="wb-media dj-reveal">
          <img src="/images/news/real/engineering-seminar.webp" alt="Вебинары и мероприятия ESP" />
        </div>
      </div>
    </section>

    <!-- Interactive calendar -->
    <section class="dj-sec dj-sec--soft">
      <div class="dj-wrap">
        <div class="wb-head dj-reveal">
          <h2 class="dj-h2">Календарь событий</h2>
          <div class="wb-month">
            <button type="button" class="wb-arrow" aria-label="Предыдущий месяц" @click="shiftMonth(-1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
            </button>
            <span class="wb-month-label">{{ monthLabel }}</span>
            <button type="button" class="wb-arrow" aria-label="Следующий месяц" @click="shiftMonth(1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
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
          <span><i class="wb-key is-done"></i>Завершено, доступна запись</span>
        </div>
      </div>
    </section>

    <!-- Events -->
    <section class="dj-sec">
      <div class="dj-wrap">
        <div class="wb-grid wb-grid--2 wb-events">
          <div v-for="ev in filteredEvents" :key="ev.title" class="wb-card">
            <div class="wb-tags">
              <span class="wb-pill">{{ ev.type }}</span>
              <span class="wb-pill" :class="ev.status === 'РЕГИСТРАЦИЯ ОТКРЫТА' ? 'wb-open' : 'wb-closed'">{{ ev.status }}</span>
            </div>
            <h3 class="dj-h3 wb-card-title">{{ ev.title }}</h3>
            <p class="wb-text">{{ ev.desc }}</p>
            <div class="wb-small wb-when">
              <p>{{ ev.date }}</p>
              <p>{{ ev.location }}</p>
            </div>
            <div class="wb-foot">
              <div>
                <p class="wb-label">SPEAKER</p>
                <p class="wb-speaker">{{ ev.speaker }}</p>
              </div>
              <button type="button" class="dj-btn" @click="openRegister(ev)">
                {{ ev.status === 'ЗАВЕРШЕНО' ? 'Смотреть запись' : 'Зарегистрироваться' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Research Academy -->
    <section class="dj-sec dj-sec--soft">
      <div class="dj-wrap">
        <div class="dj-center wb-intro dj-reveal">
          <span class="dj-eyebrow">Committed to reproducibility</span>
          <h2 class="dj-h2">Научно-технический архив</h2>
          <p class="dj-lede">
            ESP предоставляет доступ к архивам технических патентов, химических карт сточных вод и 3D-семейств оборудования.
          </p>
        </div>

        <div class="wb-media dj-reveal">
          <img src="/images/real4k/cad-screen.webp" alt="" loading="lazy" />
        </div>

        <div class="wb-grid wb-grid--3">
          <div class="wb-card wb-card--white dj-reveal">
            <span class="wb-num">01. REVIT BIM LIBRARIES</span>
            <p class="wb-text">Параметрические модели аэраторов и мембранных фильтров для разделов КР и ТХ.</p>
          </div>
          <div class="wb-card wb-card--white dj-reveal">
            <span class="wb-num">02. CHEMICAL PROTOCOLS</span>
            <p class="wb-text">Аналитические формулы реакции коагулянтов при очистке от нефтепродуктов и тяжёлых металлов.</p>
          </div>
          <div class="wb-card wb-card--white dj-reveal">
            <span class="wb-num">03. UNIVERSITY PLACEMENTS</span>
            <p class="wb-text">Академические программы практики для выпускников БНТУ, БГУИР и профильных кафедр.</p>
          </div>
        </div>

        <div class="dj-links">
          <NuxtLink to="/contacts" class="dj-btn dj-btn--lg">Запросить консультацию</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Subscribe -->
    <section class="dj-sec wb-subsec">
      <div class="dj-wrap wb-sub-row dj-reveal">
        <div>
          <h2 class="dj-h3">Анонсы вебинаров</h2>
          <p class="wb-text">Только анонсы новых тем и ссылки на библиотеки Revit от инженеров ESP.</p>
        </div>
        <form class="wb-sub-form" @submit.prevent="subscribe">
          <input v-if="!subscribed" v-model="email" name="email" autocomplete="email" required type="email" placeholder="you@company.com" class="wb-input" />
          <button v-if="!subscribed" type="submit" class="dj-btn" :disabled="subLead.sending.value">{{ subLead.sending.value ? 'Отправка…' : 'Подписаться' }}</button>
          <LeadConsent v-if="!subscribed" v-model="subConsent" />
          <p v-if="subLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ subLead.error.value }}</p>
          <span v-else-if="subscribed" class="wb-note-ok"><ApIcon name="check" :size="16" /> Вы подписаны</span>
        </form>
      </div>
    </section>

    <!-- Register modal -->
    <div v-if="modal.open" class="wb-modal">
      <div class="wb-modal__backdrop" @click="modal.open = false"></div>
      <div class="wb-modal__panel">
        <button type="button" class="wb-modal__close" aria-label="Закрыть" @click="modal.open = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div v-if="!modal.sent">
          <h3 class="dj-h3 wb-modal__title">{{ modal.title }}</h3>
          <p class="wb-text wb-modal__sub">Оставьте контакты — пришлём ссылку на подключение и материалы события.</p>
          <form class="wb-modal__form" @submit.prevent="register">
            <input v-model="regForm.name" name="name" autocomplete="name" required type="text" placeholder="Ваше имя" class="wb-input" />
            <input v-model="regForm.email" name="email" autocomplete="email" required type="email" placeholder="E-mail" class="wb-input" />
            <input v-model="regForm.company" name="company" autocomplete="organization" type="text" placeholder="Организация" class="wb-input" />
            <LeadConsent v-model="regForm.consent" />
            <p v-if="regLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ regLead.error.value }}</p>
            <button type="submit" class="dj-btn wb-block" :disabled="regLead.sending.value">{{ regLead.sending.value ? 'Отправка…' : 'Зарегистрироваться' }}</button>
          </form>
        </div>
        <div v-else class="wb-modal__done">
          <h3 class="dj-h3">Регистрация принята</h3>
          <p class="wb-text">Ссылка на подключение придёт на почту за час до начала.</p>
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

const root = ref(null)
useReveal(root)
</script>

<style scoped>
/* Apple: поля 12px-скругления, чипы-капсулы, плитки 28px на #f5f5f7, текст 17/25 */
.wb-input { width: 100%; height: 48px; padding: 0 16px; border: 1px solid #d2d2d7; border-radius: 12px; background: #fff; font: inherit; font-size: 17px; letter-spacing: -0.022em; color: var(--dj-ink); outline: none; transition: border-color .2s ease, box-shadow .2s ease; }
.wb-input:focus { border-color: #0071e3; box-shadow: 0 0 0 4px rgba(0, 113, 227, .18); }
.wb-input::placeholder { color: #86868b; }
.wb-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.wb-small { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.wb-label { font-size: 12px; line-height: 1.33; font-weight: 600; letter-spacing: 0.02em; color: #86868b; }
.wb-block { width: 100%; }
.wb-pill { display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: -0.01em; background: #fff; color: var(--dj-ink); }
.wb-note-ok { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #008009; }

.wb-filters { padding-top: 0; }
.wb-search { position: relative; max-width: 692px; margin: 0 auto; }
.wb-search svg { position: absolute; left: 16px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: #86868b; pointer-events: none; }
.wb-search .wb-input { padding-left: 44px; background: #f5f5f7; border-color: transparent; }
.wb-search .wb-input:focus { background: #fff; border-color: #0071e3; }
.wb-tabs { display: flex; flex-wrap: nowrap; justify-content: center; gap: 8px; margin-top: 20px; overflow-x: auto; scrollbar-width: none; }
.wb-tabs::-webkit-scrollbar { display: none; }
@media (max-width: 767px) { .wb-tabs { justify-content: flex-start; margin-left: -16px; margin-right: -16px; padding: 0 16px; } }
.wb-tab { flex: none; height: 36px; padding: 0 16px; border-radius: 999px; font-size: 14px; font-weight: 400; letter-spacing: -0.016em; white-space: nowrap; color: var(--dj-ink); background: #fff; box-shadow: inset 0 0 0 1px #d2d2d7; transition: background-color .2s ease, color .2s ease, box-shadow .2s ease; }
.wb-tab:hover { box-shadow: inset 0 0 0 1px #86868b; }
.wb-tab.is-on { background: var(--dj-ink); color: #fff; box-shadow: none; }
.wb-media { margin-top: 40px; overflow: hidden; border-radius: 28px; background: #f5f5f7; transform: translateZ(0); }
.wb-media img { display: block; width: 100%; aspect-ratio: 16 / 7; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.wb-media:hover img { transform: scale(1.03); }
@media (max-width: 767px) { .wb-media { border-radius: 18px; } .wb-media img { aspect-ratio: 4 / 3; } }

.wb-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
.wb-month { display: flex; align-items: center; gap: 12px; }
.wb-month-label { min-width: 8.5rem; text-align: center; font-size: 17px; font-weight: 600; letter-spacing: -0.022em; color: var(--dj-ink); }
.wb-arrow { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: rgba(210, 210, 215, .64); color: rgba(0, 0, 0, .56); transition: background-color .2s ease, color .2s ease; }
.wb-arrow:hover { background: rgba(223, 223, 227, .7); color: rgba(0, 0, 0, .64); }
.wb-arrow svg { width: 16px; height: 16px; }

.wb-cal { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; margin-top: 32px; }
.wb-wd { padding: 4px 0; text-align: center; font-size: 12px; font-weight: 600; letter-spacing: 0.02em; color: #86868b; }
.wb-cell { position: relative; aspect-ratio: 1; padding: 10px; min-width: 0; border-radius: 14px; background: #fff; }
.wb-cell.is-empty { background: transparent; }
.wb-cell.is-ev { cursor: pointer; background: #fff; box-shadow: inset 0 0 0 2px var(--dj-blue); transition: background-color .2s ease; }
.wb-cell.is-ev:hover { background: rgba(0, 35, 102, .05); }
.wb-day { font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }
.wb-cell.is-ev .wb-day { color: var(--dj-blue); font-weight: 600; }
.wb-evs { position: absolute; left: 8px; right: 8px; bottom: 8px; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.wb-ev { display: none; padding: 3px 8px; border-radius: 6px; font-size: 11px; line-height: 1.3; color: #fff; background: var(--dj-blue); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wb-ev.is-done, .wb-dot.is-done, .wb-key.is-done { background: #a1a1a6; }
.wb-dot { width: 6px; height: 6px; margin: 0 auto; border-radius: 50%; background: var(--dj-blue); }
@media (min-width: 768px) { .wb-ev { display: block; } .wb-dot { display: none; } }
@media (max-width: 767px) { .wb-cal { gap: 4px; } .wb-cell { padding: 5px; border-radius: 10px; } .wb-day { font-size: 12px; } }
.wb-legend { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 20px; font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }
.wb-legend span { display: inline-flex; align-items: center; gap: 8px; }
.wb-key { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--dj-blue); }

.wb-grid { display: grid; gap: 20px; }
.wb-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.wb-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 20px; }
@media (max-width: 899px) { .wb-grid--2, .wb-grid--3 { grid-template-columns: minmax(0, 1fr); gap: 16px; } }
.wb-card { display: flex; flex-direction: column; gap: 12px; min-width: 0; padding: clamp(28px, 3vw, 40px); border-radius: 28px; background: #f5f5f7; }
.wb-card--white { background: #fff; }
@media (max-width: 767px) { .wb-card { border-radius: 18px; } }
.wb-card-title { font-size: clamp(24px, 2.2vw, 28px); line-height: 1.14; letter-spacing: 0.007em; overflow-wrap: break-word; }
.wb-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.wb-open { background: rgba(0, 128, 9, .1); color: #008009; }
.wb-closed { background: rgba(0, 0, 0, .06); color: #6e6e73; }
.wb-when { display: grid; gap: 2px; }
.wb-foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: auto; padding-top: 20px; border-top: 1px solid #d2d2d7; }
.wb-speaker { font-size: 17px; font-weight: 600; letter-spacing: -0.022em; color: var(--dj-ink); }
.wb-num { font-size: 12px; font-weight: 600; letter-spacing: 0.02em; color: #6e6e73; }
.wb-card--white .wb-text { color: var(--dj-ink); }
.wb-intro { max-width: 52rem; margin: 0 auto; }
.wb-intro .dj-lede { margin-top: 16px; }
.wb-subsec { padding: clamp(48px, 6vw, 80px) 0; }

.wb-sub-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px 40px; padding: clamp(28px, 4vw, 48px); border-radius: 28px; background: #f5f5f7; }
@media (max-width: 767px) { .wb-sub-row { border-radius: 18px; margin: 0 16px; padding: 28px 20px; } }
.wb-sub-row > div { flex: 1 1 22rem; min-width: 0; }
.wb-sub-row .wb-text { margin-top: 8px; }
.wb-sub-form { display: flex; flex-wrap: wrap; gap: 10px; width: 100%; max-width: 28rem; }
.wb-sub-form .lead-consent, .wb-sub-form p { flex-basis: 100%; }
.wb-sub-form .wb-input { flex: 1; min-width: 0; }
.wb-sub-form .dj-btn { height: 48px; }

.wb-modal { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px; }
.wb-modal__backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, .48); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); }
.wb-modal__panel { position: relative; width: 100%; max-width: 30rem; max-height: 100%; overflow-y: auto; padding: 44px 36px 36px; border-radius: 28px; background: #fff; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .35); animation: wb-in .5s var(--dj-ease) both; }
@keyframes wb-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
.wb-modal__close { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: #e8e8ed; color: #6e6e73; transition: background-color .2s ease, color .2s ease; }
.wb-modal__close:hover { background: #dcdce1; color: var(--dj-ink); }
.wb-modal__close svg { width: 16px; height: 16px; }
.wb-modal__title { padding-right: 32px; font-size: 28px; line-height: 1.14; letter-spacing: 0.007em; }
.wb-modal__sub { margin: 10px 0 24px; }
.wb-modal__form { display: grid; gap: 12px; }
.wb-modal__done { display: grid; gap: 8px; padding: 24px 0; text-align: center; }
@media (prefers-reduced-motion: reduce) { .wb-media img, .wb-modal__panel { transition: none; animation: none; } }
</style>

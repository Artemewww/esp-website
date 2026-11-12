<template>
  <div ref="root" class="cf">
    <!-- Выбор анкеты: три разных набора полей, но одна форма -->
    <div ref="tabsEl" class="cf-tabs" role="tablist" aria-label="Тип анкеты">
      <button
        v-for="(f, key) in FORMS"
        :key="key"
        type="button"
        class="cf-tab"
        :class="{ 'is-active': kind === key }"
        role="tab"
        :aria-selected="kind === key"
        @click="switchKind(key)"
      >
        <b>{{ f.title }}</b>
        <span>{{ f.note }}</span>
      </button>
    </div>

    <!-- Прилипший переключатель: когда карточки ушли под шапку, на месте
         подполосы страницы встаёт компактный сегмент-контрол (та же высота
         52px и тот же размытый фон) — видно, какая анкета заполняется. -->
    <ClientOnly>
      <Teleport to="body">
        <div class="cf-bar" :class="{ 'is-shown': stuck }" :aria-hidden="!stuck">
          <div class="cf-bar-in">
            <span class="cf-bar-title">Анкета</span>
            <div class="cf-seg" role="tablist" aria-label="Тип анкеты">
              <button
                v-for="(f, key) in FORMS"
                :key="key"
                type="button"
                class="cf-seg-btn"
                :class="{ 'is-active': kind === key }"
                role="tab"
                :aria-selected="kind === key"
                :tabindex="stuck ? 0 : -1"
                @click="switchKind(key, true)"
              >{{ f.short }}</button>
            </div>
            <span class="cf-bar-step">Шаг {{ step + 1 }} из {{ steps.length }}</span>
          </div>
        </div>
      </Teleport>
    </ClientOnly>

    <form class="cf-form" novalidate @submit.prevent="submit">
      <ol class="cf-steps">
        <li
          v-for="(group, i) in steps"
          :key="kind + group.title"
          :ref="(el) => (stepEls[i] = el)"
          class="cf-step"
          :class="{ 'is-open': step === i, 'is-done': isDone(i) && step !== i, 'is-locked': i > reached }"
        >
          <!-- Рельс: кружок с номером/галочкой и линия к следующему шагу -->
          <span class="cf-dot" aria-hidden="true">
            <svg v-if="isDone(i) && step !== i" viewBox="0 0 16 16" width="14" height="14"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <template v-else>{{ i + 1 }}</template>
          </span>

          <button
            type="button"
            class="cf-step-head"
            :disabled="i > reached || step === i"
            :aria-expanded="step === i"
            @click="openStep(i)"
          >
            <span class="cf-step-title">{{ group.title }}</span>
            <span v-if="step !== i && isDone(i)" class="cf-step-sum">{{ summary(group) || 'Без дополнительных сведений' }}</span>
            <span v-if="step !== i && isDone(i)" class="cf-step-edit">Изменить</span>
          </button>

          <div class="cf-body">
            <div class="cf-inner">
              <template v-if="!group.final">
                <div class="cf-grid">
                  <component
                    :is="f.type === 'choice' ? 'div' : 'label'"
                    v-for="f in group.fields"
                    :key="f.name"
                    class="cf-field dj-field"
                    :class="[`s-${f.s || 6}`, f.w && `w-${f.w}`, { 'm-half': f.m }]"
                  >
                    <span class="dj-label">
                      {{ f.label }}<i v-if="f.required" class="dj-req" aria-hidden="true">*</i>
                    </span>

                    <!-- Типовые ответы — капсулы; «Другое» открывает поле для своего
                         варианта с кнопкой-стрелкой «Далее» внутри поля -->
                    <template v-if="f.type === 'choice'">
                      <div class="cf-chips" role="radiogroup" :aria-label="f.label">
                        <button
                          v-for="o in optionsOf(f)"
                          :key="o.key"
                          type="button"
                          class="cf-chip"
                          :class="{ 'is-active': picks[f.name] === o.key }"
                          role="radio"
                          :aria-checked="picks[f.name] === o.key"
                          @click="pick(f, o.key, i)"
                        >{{ o.label }}</button>
                      </div>
                      <div v-if="picks[f.name] === OTHER" class="cf-other">
                        <input
                          v-model="others[f.name]"
                          class="dj-input"
                          :name="f.name"
                          :data-other="f.name"
                          :aria-label="`${f.label}: ваш вариант`"
                          placeholder="Ваш вариант"
                          @input="syncChoice(f)"
                          @keydown.enter.prevent="afterChoice(f, i)"
                        />
                        <button type="button" class="cf-other-go" aria-label="Далее" @click="afterChoice(f, i)">
                          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 10h11M10.5 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        </button>
                      </div>
                    </template>

                    <textarea
                      v-else-if="f.type === 'textarea'"
                      v-model="values[f.name]"
                      class="dj-input"
                      :name="f.name"
                      rows="3"
                    ></textarea>

                    <input
                      v-else
                      v-model="values[f.name]"
                      class="dj-input"
                      :type="f.type || 'text'"
                      :name="f.name"
                      :inputmode="f.inputmode"
                      :autocomplete="f.autocomplete"
                    />

                    <span v-if="errors[f.name]" class="dj-error">{{ errors[f.name] }}</span>
                  </component>
                </div>
                <div v-if="!isSoloChoice(group)" class="cf-next">
                  <button type="button" class="dj-btn cf-next-btn" @click="next(i)">Далее</button>
                  <span v-if="!group.fields.some((f) => f.required)" class="cf-next-note">Раздел можно пропустить</span>
                </div>
              </template>

              <template v-else>
                <!-- Согласие: анкета содержит персональные данные, отправлять её
                     без явного согласия соискателя нельзя. -->
                <label class="cf-consent">
                  <input v-model="consent" type="checkbox" class="dj-check" />
                  <span>
                    Я подтверждаю, что указал(а) сведения полностью и достоверно, и даю согласие
                    на обработку персональных данных в целях рассмотрения моей кандидатуры.
                    <a href="#privacy">Условия обработки</a>
                  </span>
                </label>
                <span v-if="errors.consent" class="dj-error cf-error--block">{{ errors.consent }}</span>

                <div class="cf-actions">
                  <button type="submit" class="dj-btn cf-submit" :disabled="lead.sending.value">{{ lead.sending.value ? 'Отправка…' : 'Отправить анкету' }}</button>
                  <a :href="current.file" class="dj-more cf-alt" download>Скачать анкету в DOCX</a>
                </div>

                <p class="cf-hint">
                  Анкета уходит письмом в отдел кадров с вашего почтового приложения — так данные
                  не хранятся на сайте. Если письмо не открылось, скопируйте текст кнопкой ниже.
                </p>

                <p v-if="sent" class="cf-sent">
                  <template v-if="!lead.error.value">Анкета отправлена в отдел кадров. Мы свяжемся с вами.</template>
                  <template v-else>Сервер не ответил, поэтому мы открыли письмо в вашей почтовой программе — убедитесь, что оно отправлено.</template>
                  <button type="button" class="cf-copy" @click="copy">Скопировать текст анкеты</button>
                  <span v-if="copied" class="cf-copied">Скопировано</span>
                </p>
              </template>
            </div>
          </div>
        </li>
      </ol>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { vacanciesList } from '~/composables/useVacancies'

const props = defineProps({
  hrEmail: { type: String, required: true }
})

// s — ширина на ПК в колонках 12-колоночной сетки (по ожидаемой длине ввода),
// m — на телефоне поле занимает половину строки (короткие пары).
const F = (name, label, opts = {}) => ({ name, label, ...opts })
// Поле-выбор: капсулы с типовыми ответами; other: false — без «Другое»
const C = (name, label, options, opts = {}) => F(name, label, { type: 'choice', options, s: 12, ...opts })

const PERSONAL = {
  title: 'Персональные данные',
  fields: [
    F('lastName', 'Фамилия', { required: true, autocomplete: 'family-name', s: 4 }),
    F('firstName', 'Имя', { required: true, autocomplete: 'given-name', s: 4 }),
    F('middleName', 'Отчество', { s: 4 }),
    F('birthDate', 'Дата рождения', { type: 'date', s: 3, w: 'xs' }),
    F('address', 'Адрес фактического проживания', { s: 9 }),
    C('citizenship', 'Гражданство', ['Беларусь', 'Россия']),
    C('family', 'Семейное положение', ['Не женат / не замужем', 'Женат / замужем', 'Разведён(а)'])
  ]
}

const CONTACTS = {
  title: 'Контакты',
  fields: [
    F('phone', 'Мобильный телефон', { required: true, type: 'tel', inputmode: 'tel', autocomplete: 'tel', s: 4, w: 'sm' }),
    F('email', 'Электронная почта', { required: true, type: 'email', autocomplete: 'email', s: 5, w: 'md' }),
    C('callTime', 'Удобное время для звонка', ['Утром', 'Днём', 'Вечером', 'В любое время'])
  ]
}

const EDUCATION = (specLabel) => ({
  title: 'Образование',
  fields: [
    C('eduLevel', 'Уровень образования', ['Общее среднее', 'Профессионально-техническое', 'Среднее специальное', 'Высшее', 'Неоконченное высшее']),
    F('eduPlace', 'Учебное заведение', { s: 9 }),
    F('eduPeriod', 'Период обучения', { s: 3 }),
    F('eduSpec', specLabel, { s: 6 }),
    F('eduQualification', 'Квалификация по диплому', { s: 6 })
  ]
})

const EXPERIENCE = {
  title: 'Опыт работы',
  fields: [
    F('lastCompany', 'Последнее место работы', { s: 5 }),
    F('lastPosition', 'Должность, профессия', { s: 4 }),
    F('lastPeriod', 'Период работы', { s: 3 }),
    F('lastDuties', 'Обязанности', { type: 'textarea', s: 12 }),
    F('leaveReason', 'Причина ухода', { s: 12 })
  ]
}

const VACANCY = { title: 'Вакансия', fields: [C('vacancy', 'Вакансия, на которую претендуете', null, { required: true })] }

const FORMS = {
  worker: {
    title: 'Анкета рабочего',
    short: 'Рабочего',
    note: 'Рабочие специальности',
    file: '/docs/career/anketa-rabochego.docx',
    groups: [
      VACANCY,
      PERSONAL,
      CONTACTS,
      EDUCATION('Специальность (профессия)'),
      { title: 'Навыки', fields: [F('skills', 'Знания и навыки, приобретённые самостоятельно', { type: 'textarea', s: 12 })] },
      EXPERIENCE,
      {
        title: 'Дополнительно',
        fields: [
          F('salary', 'Желаемая заработная плата, бел. руб.', { s: 4, w: 'sm', inputmode: 'numeric' }),
          C('startDate', 'Когда сможете приступить', ['Сразу', 'Через 2 недели', 'Через месяц']),
          C('source', 'Откуда узнали о вакансии', ['Сайт компании', 'Сайт поиска работы', 'Социальные сети', 'От знакомых'])
        ]
      }
    ]
  },
  specialist: {
    title: 'Анкета специалиста',
    short: 'Специалиста',
    note: 'Инженерные и офисные позиции',
    file: '/docs/career/anketa-specialista.docx',
    groups: [
      VACANCY,
      PERSONAL,
      CONTACTS,
      EDUCATION('Специальность'),
      EXPERIENCE,
      {
        title: 'Дополнительно',
        fields: [
          F('salary', 'Желаемая заработная плата, бел. руб.', { s: 4, w: 'sm', inputmode: 'numeric' }),
          C('startDate', 'Когда сможете приступить', ['Сразу', 'Через 2 недели', 'Через месяц']),
          C('union', 'Членство в профсоюзной организации', ['Да', 'Нет'], { other: false })
        ]
      }
    ]
  },
  intern: {
    title: 'Анкета практиканта',
    short: 'Практиканта',
    note: 'Студенты и практика',
    file: '/docs/career/anketa-praktikanta.docx',
    groups: [
      {
        title: 'О практике',
        fields: [
          F('eduPlaceMain', 'Учебное заведение', { required: true, s: 12 }),
          C('practiceType', 'Вид практики', ['Ознакомительная', 'Учебная', 'Производственная', 'Преддипломная']),
          F('practicePeriod', 'Период практики', { s: 4 }),
          F('practiceTopic', 'Тема', { s: 8 })
        ]
      },
      PERSONAL,
      CONTACTS,
      EDUCATION('Специальность (профессия)'),
      { title: 'Навыки', fields: [F('skills', 'Владение ПК, программами, инструментом', { type: 'textarea', s: 12 })] },
      {
        title: 'Дополнительно',
        fields: [
          C('distribution', 'Рассматриваете компанию для работы по распределению?', ['Да', 'Нет', 'Пока не решил(а)'], { other: false }),
          C('source', 'Откуда узнали о компании', ['Сайт компании', 'Учебное заведение', 'Социальные сети', 'От знакомых'])
        ]
      }
    ]
  }
}

const kind = ref('worker')
const current = computed(() => FORMS[kind.value])
// Последний шаг — согласие и отправка
const steps = computed(() => [...current.value.groups, { title: 'Согласие и отправка', final: true, fields: [] }])

const values = reactive({})
const errors = reactive({})
const consent = ref(false)
const sent = ref(false)
const copied = ref(false)
let lastBody = ''

// Пошаговое заполнение: step — открытый шаг, reached — самый дальний
// доступный (до него можно вернуться кликом по заголовку).
const step = ref(0)
const reached = ref(0)
const stepEls = []
const isDone = (i) => i < reached.value

const filled = (f) => String(values[f.name] || '').trim()
const summary = (g) => g.fields.filter(filled).map((f) => String(values[f.name]).trim().replace(/\s+/g, ' ')).join(' · ')

const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dj-header-h')) || 44
const scrollToStep = (i) => nextTick(() => {
  const el = stepEls[i]
  if (!el) return
  // Ждём начала раскрытия, чтобы считать позицию уже без свернувшегося шага
  setTimeout(() => {
    const y = el.getBoundingClientRect().top + window.scrollY - headerH() - 52 - 16
    if (Math.abs(window.scrollY - y) > 8) window.scrollTo({ top: y, behavior: 'smooth' })
  }, 60)
})

const validateGroup = (g) => {
  let ok = true
  for (const f of g.fields) {
    delete errors[f.name]
    if (f.required && !filled(f)) {
      errors[f.name] = f.type !== 'choice' ? 'Заполните это поле' : picks[f.name] === OTHER ? 'Впишите свой вариант' : 'Выберите вариант'
      ok = false
    }
  }
  if (g.fields.some((f) => f.name === 'email') && values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Проверьте адрес почты'
    ok = false
  }
  return ok
}

const openStep = (i) => {
  if (i > reached.value) return
  step.value = i
  scrollToStep(i)
}

const next = (i) => {
  if (!validateGroup(steps.value[i])) return
  step.value = i + 1
  reached.value = Math.max(reached.value, i + 1)
  scrollToStep(i + 1)
}

const switchKind = (key, fromBar = false) => {
  if (kind.value === key) return
  kind.value = key
  sent.value = false
  step.value = 0
  reached.value = 0
  Object.keys(errors).forEach((k) => delete errors[k])
  // Варианты ответа у разных анкет разные: выбор, которого нет в новой анкете, сбрасываем
  current.value.groups.flatMap((g) => g.fields).filter((f) => f.type === 'choice').forEach((f) => {
    const p = picks[f.name]
    if (p && p !== OTHER && !optionsOf(f).some((o) => o.key === p)) { picks[f.name] = ''; values[f.name] = '' }
  })
  if (fromBar) scrollToStep(0)
}

const validate = () => {
  Object.keys(errors).forEach((k) => delete errors[k])
  let firstBad = -1
  current.value.groups.forEach((g, i) => {
    if (!validateGroup(g) && firstBad < 0) firstBad = i
  })
  if (!consent.value) errors.consent = 'Без согласия отправить анкету нельзя'
  return { ok: Object.keys(errors).length === 0, firstBad }
}

const buildBody = () => {
  const lines = [current.value.title, '']
  for (const g of current.value.groups) {
    const list = g.fields.filter(filled)
    if (!list.length) continue
    lines.push(g.title.toUpperCase())
    for (const f of list) lines.push(`${f.label}: ${values[f.name]}`)
    lines.push('')
  }
  lines.push('Согласие на обработку персональных данных: дано')
  lines.push('Отправлено с сайта ecoservisproekt.com')
  return lines.join('\n')
}

const lead = useLead('career')

// Открытые вакансии компании (тот же раздел данных, что и список на /career).
// Производство — анкета рабочего, остальные отделы — анкета специалиста.
const vacancies = useEditableList('vacancies', vacanciesList)
const isWorkerVac = (v) => /производ|цех/i.test(v.dept || '')
const kindOf = (v) => (isWorkerVac(v) ? 'worker' : 'specialist')
const vacancyOptions = computed(() => {
  const all = (vacancies.value || []).filter((v) => v && v.title && !v.closed && !v.hidden)
  const own = all.filter((v) => kindOf(v) === kind.value)
  return (own.length ? own : all).map((v) => ({ key: v.slug || v.title, label: v.title }))
})

// Поля-выборы: picks — выбранная капсула, others — свой вариант для «Другое».
// В заявку, как и раньше, уходит текст ответа (values[name]).
const OTHER = '__other'
const picks = reactive({})
const others = reactive({})
const optionsOf = (f) => {
  const base = f.name === 'vacancy' ? vacancyOptions.value : (f.options || []).map((o) => ({ key: o, label: o }))
  return f.other === false ? base : [...base, { key: OTHER, label: 'Другое' }]
}
const syncChoice = (f) => {
  const p = picks[f.name]
  values[f.name] = p === OTHER ? (others[f.name] || '') : (optionsOf(f).find((o) => o.key === p)?.label || '')
  if (values[f.name]) delete errors[f.name]
}
// Шаг из одного вопроса-выбора засчитывается сразу после клика по капсуле
const isSoloChoice = (g) => !g.final && g.fields.length === 1 && g.fields[0].type === 'choice'
const focusNextField = (f, i) => {
  const fields = steps.value[i].fields
  const nextF = fields[fields.indexOf(f) + 1]
  if (!nextF) return
  nextTick(() => {
    const box = stepEls[i]
    const el = box?.querySelector(`[name="${nextF.name}"]`) || box?.querySelectorAll('.cf-field')[fields.indexOf(nextF)]?.querySelector('.cf-chip')
    el?.focus({ preventScroll: true })
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })
}
const afterChoice = (f, i) => {
  if (isSoloChoice(steps.value[i])) next(i)
  else focusNextField(f, i)
}
const pick = (f, key, i) => {
  picks[f.name] = key
  syncChoice(f)
  if (key === OTHER) {
    nextTick(() => stepEls[i]?.querySelector(`[data-other="${f.name}"]`)?.focus())
    return
  }
  // Короткая пауза — человек успевает увидеть подсвеченную капсулу
  setTimeout(() => afterChoice(f, i), 220)
}
watch(vacancyOptions, () => { if (picks.vacancy) syncChoice({ name: 'vacancy' }) })

// Пришёл со страницы вакансии: /career?vacancy=<slug>#forms — она выбрана сразу.
// Карточки вакансий на той же странице могут прислать событие career:vacancy.
const preselect = (q) => {
  if (!q) return
  const v = (vacancies.value || []).find((x) => x.slug === q || x.title === q)
  if (!v) return
  switchKind(kindOf(v))
  picks.vacancy = v.slug || v.title
  syncChoice({ name: 'vacancy' })
}
const route = useRoute()
watch(() => route.query.vacancy, (q) => preselect(String(q || '')))
const onVacancyEvent = (e) => preselect(e.detail)

const submit = async (e) => {
  const { ok, firstBad } = validate()
  if (!ok) {
    // Возвращаем к шагу с первым незаполненным полем
    if (firstBad >= 0) { step.value = firstBad; scrollToStep(firstBad) }
    return
  }
  lastBody = buildBody()
  const who = [values.lastName, values.firstName].filter(Boolean).join(' ')
  const subject = `${current.value.title}${who ? ' — ' + who : ''}`
  copied.value = false
  // Анкета уходит в отдел кадров через /api/lead; письмо из почтового
  // клиента — только запасной путь, если сервер не ответил.
  const sentOk = await lead.send({
    name: who, email: values.email, phone: values.phone,
    position: current.value.title, message: lastBody, consent: consent.value
  }, [], e)
  sent.value = true
  if (!sentOk) {
    window.location.href =
      `mailto:${props.hrEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lastBody)}`
  }
}

const copy = async () => {
  try {
    await navigator.clipboard.writeText(lastBody || buildBody())
    copied.value = true
  } catch {
    copied.value = false
  }
}

// Прилипание переключателя: карточки ушли под шапку, а анкета ещё на экране.
// Пока переключатель прилип, подполоса страницы (DjSubnav) прячется.
const root = ref(null)
const tabsEl = ref(null)
const stuck = ref(false)
const hideSubnav = useState('dsn-hide', () => false)
let raf = 0
const check = () => {
  raf = 0
  if (!root.value || !tabsEl.value) return
  const h = headerH()
  const t = tabsEl.value.getBoundingClientRect()
  const r = root.value.getBoundingClientRect()
  stuck.value = t.bottom < h + 8 && r.bottom > h + 52 + 120
  hideSubnav.value = stuck.value
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
onMounted(() => {
  preselect(String(route.query.vacancy || ''))
  window.addEventListener('career:vacancy', onVacancyEvent)
  check()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('career:vacancy', onVacancyEvent)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
  hideSubnav.value = false
})
</script>

<style scoped>
.cf { display: grid; gap: 32px; }

/* Выбор типа анкеты: сегменты-карточки */
.cf-tabs { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 760px) { .cf-tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.cf-tab { display: grid; gap: 4px; text-align: left; padding: 18px 22px; border-radius: var(--r-md); background: #fff; border: 1px solid transparent; font-family: var(--dj-font); cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
.cf-tab b { font-size: 17px; font-weight: 600; letter-spacing: -0.022em; color: var(--dj-ink); }
.cf-tab span { font-size: 14px; line-height: 1.35; color: var(--dj-muted); }
.cf-tab:hover { background: #fafafa; }
.cf-tab:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.cf-tab.is-active { background: #fff; border-color: var(--dj-apple); box-shadow: 0 0 0 1px var(--dj-apple); }

/* Прилипший переключатель — копия подполосы (DjSubnav) по высоте и фону */
.cf-bar { position: fixed; left: 0; right: 0; top: var(--dj-header-h); z-index: 41; background: rgba(255, 255, 255, 0.72); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); border-bottom: 1px solid rgba(0, 0, 0, 0.16); font-family: var(--dj-font); transform: translateY(-100%); opacity: 0; visibility: hidden; pointer-events: none; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0s 0.45s; }
.cf-bar.is-shown { transform: none; opacity: 1; visibility: visible; pointer-events: auto; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.cf-bar-in { max-width: 1024px; height: 52px; margin: 0 auto; padding: 0 22px; display: flex; align-items: center; gap: 20px; }
.cf-bar-title { font-size: 21px; line-height: 1.14; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); white-space: nowrap; }
.cf-bar-step { margin-left: auto; font-size: 12px; line-height: 1.33; color: rgba(0, 0, 0, 0.56); white-space: nowrap; font-variant-numeric: tabular-nums; }
.cf-seg { display: flex; padding: 2px; border-radius: 999px; background: rgba(0, 0, 0, 0.06); }
.cf-seg-btn { min-height: 30px; padding: 0 16px; border-radius: 999px; font-family: var(--dj-font); font-size: 13px; font-weight: 500; letter-spacing: -0.01em; color: rgba(0, 0, 0, 0.72); white-space: nowrap; cursor: pointer; transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease; }
.cf-seg-btn:hover { color: var(--dj-ink); }
.cf-seg-btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.cf-seg-btn.is-active { background: #fff; color: var(--dj-ink); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.14), 0 0 0 0.5px rgba(0, 0, 0, 0.06); }
@media (max-width: 767px) {
  .cf-bar-in { height: 48px; padding: 0 12px; gap: 10px; }
  .cf-bar-title { display: none; }
  .cf-seg { flex: 1 1 auto; min-width: 0; }
  .cf-seg-btn { flex: 1 1 0; min-width: 0; padding: 0 6px; font-size: 13px; overflow: hidden; text-overflow: ellipsis; }
  .cf-bar-step { font-size: 11px; }
}

/* Пошаговая анкета: слева рельс с кружками, справа шаги */
.cf-form { font-family: var(--dj-font); }
.cf-steps { list-style: none; margin: 0; padding: 0; display: grid; }
.cf-step { --dot: 32px; --gap: 20px; position: relative; display: grid; grid-template-columns: var(--dot) minmax(0, 1fr); column-gap: var(--gap); padding-bottom: 8px; }
.cf-step::before { content: ''; position: absolute; left: calc(var(--dot) / 2 - 1px); top: calc(var(--dot) + 6px); bottom: 6px; width: 2px; border-radius: 2px; background: rgba(0, 0, 0, 0.12); transition: background-color 0.4s ease; }
.cf-step:last-child::before { display: none; }
.cf-step.is-done::before { background: var(--dj-apple); }
.cf-dot { grid-column: 1; grid-row: 1; width: var(--dot); height: var(--dot); border-radius: 50%; display: grid; place-items: center; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--dj-muted); background: #fff; box-shadow: inset 0 0 0 1.5px rgba(0, 0, 0, 0.18); transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease; }
.cf-step.is-open .cf-dot { color: var(--dj-apple); box-shadow: inset 0 0 0 2px var(--dj-apple); }
.cf-step.is-done .cf-dot { color: #fff; background: var(--dj-apple); box-shadow: none; }

.cf-step-head { grid-column: 2; grid-row: 1; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; min-height: var(--dot); padding: 0 0 12px; text-align: left; font-family: var(--dj-font); cursor: pointer; }
.cf-step-head:disabled { cursor: default; }
.cf-step-title { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); padding-top: 3px; }
.cf-step.is-locked .cf-step-title { color: rgba(0, 0, 0, 0.36); }
.cf-step-sum { grid-column: 1; grid-row: 2; margin-top: 2px; font-size: 14px; line-height: 1.43; color: var(--dj-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cf-step-edit { grid-column: 2; grid-row: 1 / span 2; font-size: 14px; color: var(--dj-link); }
.cf-step-head:not(:disabled):hover .cf-step-edit { text-decoration: underline; }
.cf-step-head:focus-visible { outline: none; border-radius: 8px; box-shadow: var(--focus-ring); }

/* Раскрытие шага: grid-rows 0fr → 1fr */
.cf-body { grid-column: 2; grid-row: 2; display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.cf-inner { min-height: 0; overflow: hidden; visibility: hidden; opacity: 0; margin: 0 -6px; padding: 0 6px; transition: opacity 0.3s ease, visibility 0s 0.5s; }
.cf-step.is-open .cf-body { grid-template-rows: 1fr; }
.cf-step.is-open .cf-inner { visibility: visible; opacity: 1; padding-top: 6px; padding-bottom: 28px; transition: opacity 0.4s ease 0.1s; }

/* Ширина поля — по ожидаемой длине ввода: 12 колонок на ПК */
.cf-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.cf-field { grid-column: 1 / -1; min-width: 0; }
.cf-field.m-half { grid-column: span 1; }
@media (min-width: 760px) {
  .cf-grid { grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 18px 16px; }
  .cf-field.s-3, .cf-field.m-half.s-3 { grid-column: span 3; }
  .cf-field.s-4, .cf-field.m-half.s-4 { grid-column: span 4; }
  .cf-field.s-5, .cf-field.m-half.s-5 { grid-column: span 5; }
  .cf-field.s-6, .cf-field.m-half.s-6 { grid-column: span 6; }
  .cf-field.s-7 { grid-column: span 7; }
  .cf-field.s-8 { grid-column: span 8; }
  .cf-field.s-9 { grid-column: span 9; }
  .cf-field.s-12 { grid-column: 1 / -1; }
}
.cf-field .dj-label { min-height: 1.4em; }
.cf-field .dj-input { min-width: 0; }
/* Короткие значения — поле не шире ожидаемого ввода */
@media (min-width: 760px) {
  .cf-field.w-xs .dj-input { max-width: 180px; }
  .cf-field.w-sm .dj-input { max-width: 240px; }
  .cf-field.w-md .dj-input { max-width: 320px; }
}

/* Капсулы с вариантами ответа */
.cf-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.cf-chip { min-height: 44px; padding: 10px 20px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18); font-family: var(--dj-font); font-size: 15px; line-height: 1.3; letter-spacing: -0.01em; color: var(--dj-ink); cursor: pointer; transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease; }
.cf-chip:hover { box-shadow: inset 0 0 0 1px var(--dj-ink); }
.cf-chip:focus-visible { outline: none; box-shadow: inset 0 0 0 1px var(--dj-apple), var(--focus-ring); }
.cf-chip.is-active { background: var(--dj-apple); color: #fff; box-shadow: none; }
.cf-other { position: relative; margin-top: 12px; max-width: 480px; }
.cf-other .dj-input { padding-right: 60px; }
.cf-other-go { position: absolute; top: 50%; right: 8px; width: 38px; height: 38px; margin-top: -19px; border-radius: 50%; display: grid; place-items: center; background: var(--dj-apple); color: #fff; cursor: pointer; transition: background-color 0.2s ease, transform 0.2s ease; }
.cf-other-go:hover { background: #0a3a8c; }
.cf-other-go:active { transform: scale(0.94); }
.cf-other-go:focus-visible { outline: none; box-shadow: var(--focus-ring); }

.cf-next { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; margin-top: 24px; }
.cf-next-btn { cursor: pointer; min-width: 140px; }
.cf-next-note { font-size: 14px; color: var(--dj-muted); }
.cf-error--block { display: block; margin-top: 8px; }

/* Согласие */
.cf-consent { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; padding: 18px 22px; border-radius: var(--r-md); background: #fff; font-size: 14px; line-height: 1.43; color: var(--dj-muted); }
.cf-consent a { color: var(--dj-link); }
.cf-consent a:hover { text-decoration: underline; }

/* Действия */
.cf-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 24px; margin-top: 24px; }
.cf-submit { cursor: pointer; }
.cf-submit:disabled { opacity: 0.5; cursor: default; }
.cf-alt { color: var(--dj-link); }
.cf-alt:hover { text-decoration: underline; }

.cf-hint { margin-top: 20px; font-size: 14px; line-height: 1.43; color: var(--dj-muted); max-width: 62ch; }
.cf-sent { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 16px; padding: 16px 20px; border-radius: var(--r-md); background: rgba(0, 96, 57, 0.07); font-size: 15px; line-height: 1.43; color: var(--dj-ink); }
.cf-copy { font-size: 15px; color: var(--dj-link); cursor: pointer; }
.cf-copy:hover { text-decoration: underline; }
.cf-copied { font-size: 14px; color: #006039; }

/* Телефон: компактный рельс */
@media (max-width: 759px) {
  .cf-step { --dot: 26px; --gap: 14px; }
  .cf-step::before { width: 1px; left: calc(var(--dot) / 2 - 0.5px); }
  .cf-dot { font-size: 12px; }
  .cf-step-title { font-size: 19px; padding-top: 1px; }
  .cf-step-edit { display: none; }
  .cf-next-btn { flex: 1 1 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .cf-bar, .cf-bar.is-shown, .cf-body, .cf-inner, .cf-step.is-open .cf-inner, .cf-dot, .cf-step::before { transition: none; }
}
</style>

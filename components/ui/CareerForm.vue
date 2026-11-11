<template>
  <div class="cf">
    <!-- Выбор анкеты: три разных набора полей, но одна форма -->
    <div class="cf-tabs" role="tablist">
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

    <form class="cf-form" novalidate @submit.prevent="submit">
      <fieldset v-for="group in current.groups" :key="group.title" class="cf-group">
        <legend class="cf-legend">{{ group.title }}</legend>

        <div class="cf-grid">
          <label v-for="f in group.fields" :key="f.name" class="cf-field dj-field" :class="{ 'is-wide': f.wide }">
            <span class="dj-label">
              {{ f.label }}<i v-if="f.required" class="dj-req" aria-hidden="true">*</i>
            </span>

            <textarea
              v-if="f.type === 'textarea'"
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
          </label>
        </div>
      </fieldset>

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
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  hrEmail: { type: String, required: true }
})

const F = (name, label, opts = {}) => ({ name, label, ...opts })

const PERSONAL = {
  title: 'Персональные данные',
  fields: [
    F('lastName', 'Фамилия', { required: true, autocomplete: 'family-name' }),
    F('firstName', 'Имя', { required: true, autocomplete: 'given-name' }),
    F('middleName', 'Отчество'),
    F('birthDate', 'Дата рождения', { type: 'date' }),
    F('citizenship', 'Гражданство'),
    F('address', 'Адрес фактического проживания', { wide: true }),
    F('family', 'Семейное положение')
  ]
}

const CONTACTS = {
  title: 'Контакты',
  fields: [
    F('phone', 'Мобильный телефон', { required: true, type: 'tel', inputmode: 'tel', autocomplete: 'tel' }),
    F('callTime', 'Удобное время для звонка'),
    F('email', 'Электронная почта', { required: true, type: 'email', autocomplete: 'email' })
  ]
}

const EDUCATION = (specLabel) => ({
  title: 'Образование',
  fields: [
    F('eduLevel', 'Уровень образования'),
    F('eduPlace', 'Учебное заведение', { wide: true }),
    F('eduPeriod', 'Период обучения'),
    F('eduSpec', specLabel),
    F('eduQualification', 'Квалификация по диплому')
  ]
})

const EXPERIENCE = {
  title: 'Опыт работы',
  fields: [
    F('lastCompany', 'Последнее место работы', { wide: true }),
    F('lastPeriod', 'Период работы'),
    F('lastPosition', 'Должность, профессия'),
    F('lastDuties', 'Обязанности', { type: 'textarea', wide: true }),
    F('leaveReason', 'Причина ухода', { wide: true })
  ]
}

const FORMS = {
  worker: {
    title: 'Анкета рабочего',
    note: 'Рабочие специальности',
    file: '/docs/career/anketa-rabochego.docx',
    groups: [
      { title: 'Вакансия', fields: [F('vacancy', 'Вакансия, на которую претендуете', { wide: true, required: true })] },
      PERSONAL,
      CONTACTS,
      EDUCATION('Специальность (профессия)'),
      { title: 'Навыки', fields: [F('skills', 'Знания и навыки, приобретённые самостоятельно', { type: 'textarea', wide: true })] },
      EXPERIENCE,
      {
        title: 'Дополнительно',
        fields: [
          F('salary', 'Желаемая заработная плата, бел. руб.'),
          F('startDate', 'Когда сможете приступить'),
          F('source', 'Откуда узнали о вакансии')
        ]
      }
    ]
  },
  specialist: {
    title: 'Анкета специалиста',
    note: 'Инженерные и офисные позиции',
    file: '/docs/career/anketa-specialista.docx',
    groups: [
      { title: 'Вакансия', fields: [F('vacancy', 'Вакансия, на которую претендуете', { wide: true, required: true })] },
      PERSONAL,
      CONTACTS,
      EDUCATION('Специальность'),
      EXPERIENCE,
      {
        title: 'Дополнительно',
        fields: [
          F('salary', 'Желаемая заработная плата, бел. руб.'),
          F('startDate', 'Когда сможете приступить'),
          F('union', 'Членство в профсоюзной организации')
        ]
      }
    ]
  },
  intern: {
    title: 'Анкета практиканта',
    note: 'Студенты и практика',
    file: '/docs/career/anketa-praktikanta.docx',
    groups: [
      {
        title: 'О практике',
        fields: [
          F('eduPlaceMain', 'Учебное заведение', { wide: true, required: true }),
          F('practiceType', 'Вид практики'),
          F('practicePeriod', 'Период практики'),
          F('practiceTopic', 'Тема', { wide: true })
        ]
      },
      PERSONAL,
      CONTACTS,
      EDUCATION('Специальность (профессия)'),
      { title: 'Навыки', fields: [F('skills', 'Владение ПК, программами, инструментом', { type: 'textarea', wide: true })] },
      {
        title: 'Дополнительно',
        fields: [
          F('distribution', 'Рассматриваете компанию для работы по распределению?'),
          F('source', 'Откуда узнали о компании')
        ]
      }
    ]
  }
}

const kind = ref('worker')
const current = computed(() => FORMS[kind.value])

const values = reactive({})
const errors = reactive({})
const consent = ref(false)
const sent = ref(false)
const copied = ref(false)
let lastBody = ''

const switchKind = (key) => {
  kind.value = key
  sent.value = false
  Object.keys(errors).forEach((k) => delete errors[k])
}

const validate = () => {
  Object.keys(errors).forEach((k) => delete errors[k])
  for (const g of current.value.groups) {
    for (const f of g.fields) {
      if (f.required && !String(values[f.name] || '').trim()) {
        errors[f.name] = 'Заполните это поле'
      }
    }
  }
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Проверьте адрес почты'
  }
  if (!consent.value) errors.consent = 'Без согласия отправить анкету нельзя'
  return Object.keys(errors).length === 0
}

const buildBody = () => {
  const lines = [current.value.title, '']
  for (const g of current.value.groups) {
    const filled = g.fields.filter((f) => String(values[f.name] || '').trim())
    if (!filled.length) continue
    lines.push(g.title.toUpperCase())
    for (const f of filled) lines.push(`${f.label}: ${values[f.name]}`)
    lines.push('')
  }
  lines.push('Согласие на обработку персональных данных: дано')
  lines.push('Отправлено с сайта ecoservisproekt.com')
  return lines.join('\n')
}

const lead = useLead('career')

const submit = async (e) => {
  if (!validate()) {
    // Возвращаем к первому незаполненному полю: список длинный, искать
    // ошибку глазами неудобно.
    const first = document.querySelector('.cf-error')
    first?.closest('.cf-field, .cf-consent')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    return
  }
  lastBody = buildBody()
  const who = [values.lastName, values.firstName].filter(Boolean).join(' ')
  const subject = `${current.value.title}${who ? ' — ' + who : ''}`
  copied.value = false
  // Анкета уходит в отдел кадров через /api/lead; письмо из почтового
  // клиента — только запасной путь, если сервер не ответил.
  const ok = await lead.send({
    name: who, email: values.email, phone: values.phone,
    position: current.value.title, message: lastBody, consent: consent.value
  }, [], e)
  sent.value = true
  if (!ok) {
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
</script>

<style scoped>
.cf { display: grid; gap: 32px; }

/* Выбор типа анкеты: сегменты-карточки */
.cf-tabs { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 760px) { .cf-tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.cf-tab { display: grid; gap: 4px; text-align: left; padding: 18px 22px; border-radius: 18px; background: var(--dj-soft); border: 1px solid transparent; font-family: var(--dj-font); cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
.cf-tab b { font-size: 17px; font-weight: 600; letter-spacing: -0.022em; color: var(--dj-ink); }
.cf-tab span { font-size: 14px; line-height: 1.35; color: var(--dj-muted); }
.cf-tab:hover { background: #ececf0; }
.cf-tab:focus-visible { outline: none; box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.3); }
.cf-tab.is-active { background: #fff; border-color: var(--dj-apple); box-shadow: 0 0 0 1px var(--dj-apple); }

.cf-group { border: none; padding: 0; margin: 0; }
.cf-legend { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); margin-bottom: 16px; padding: 0; }
.cf-form { display: grid; gap: 32px; font-family: var(--dj-font); }
.cf-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 700px) { .cf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.cf-field.is-wide { grid-column: 1 / -1; }
.cf-error--block { display: block; margin-top: -20px; }

/* Согласие */
.cf-consent { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; padding: 18px 22px; border-radius: 18px; background: var(--dj-soft); font-size: 14px; line-height: 1.43; color: var(--dj-muted); }
.cf-consent a { color: var(--dj-link); }
.cf-consent a:hover { text-decoration: underline; }

/* Действия */
.cf-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 24px; }
.cf-submit { cursor: pointer; }
.cf-submit:disabled { opacity: 0.5; cursor: default; }
.cf-alt { color: var(--dj-link); }
.cf-alt:hover { text-decoration: underline; }

.cf-hint { font-size: 14px; line-height: 1.43; color: var(--dj-muted); max-width: 62ch; }
.cf-sent { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 16px 20px; border-radius: 18px; background: rgba(0, 96, 57, 0.07); font-size: 15px; line-height: 1.43; color: var(--dj-ink); }
.cf-copy { font-size: 15px; color: var(--dj-link); cursor: pointer; }
.cf-copy:hover { text-decoration: underline; }
.cf-copied { font-size: 14px; color: #006039; }
</style>

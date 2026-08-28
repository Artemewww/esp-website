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
          <label v-for="f in group.fields" :key="f.name" class="cf-field" :class="{ 'is-wide': f.wide }">
            <span class="cf-label">
              {{ f.label }}<i v-if="f.required" class="cf-req" aria-hidden="true">*</i>
            </span>

            <textarea
              v-if="f.type === 'textarea'"
              v-model="values[f.name]"
              class="cf-input cf-textarea"
              :name="f.name"
              rows="3"
            ></textarea>

            <input
              v-else
              v-model="values[f.name]"
              class="cf-input"
              :type="f.type || 'text'"
              :name="f.name"
              :inputmode="f.inputmode"
              :autocomplete="f.autocomplete"
            />

            <span v-if="errors[f.name]" class="cf-error">{{ errors[f.name] }}</span>
          </label>
        </div>
      </fieldset>

      <!-- Согласие: анкета содержит персональные данные, отправлять её
           без явного согласия соискателя нельзя. -->
      <label class="cf-consent">
        <input v-model="consent" type="checkbox" class="cf-check" />
        <span>
          Я подтверждаю, что указал(а) сведения полностью и достоверно, и даю согласие
          на обработку персональных данных в целях рассмотрения моей кандидатуры.
          <a href="#privacy">Условия обработки</a>
        </span>
      </label>
      <span v-if="errors.consent" class="cf-error cf-error--block">{{ errors.consent }}</span>

      <div class="cf-actions">
        <button type="submit" class="cf-submit">Отправить анкету</button>
        <a :href="current.file" class="cf-alt" download>Скачать анкету в DOCX</a>
      </div>

      <p class="cf-hint">
        Анкета уходит письмом в отдел кадров с вашего почтового приложения — так данные
        не хранятся на сайте. Если письмо не открылось, скопируйте текст кнопкой ниже.
      </p>

      <p v-if="sent" class="cf-sent">
        Письмо сформировано. Проверьте, что оно ушло из вашей почтовой программы.
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
    F('lastPosition', 'Должность / профессия'),
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
          F('salary', 'Желаемая зарплата, бел. руб.'),
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
          F('salary', 'Желаемая зарплата, бел. руб.'),
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

const submit = () => {
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
  sent.value = true
  copied.value = false
  window.location.href =
    `mailto:${props.hrEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lastBody)}`
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
.cf { display: grid; gap: 2rem; }

/* ===== Выбор типа анкеты ===== */
.cf-tabs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: #e2e2e2;
  border: 1px solid #e2e2e2;
}
@media (min-width: 760px) { .cf-tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

.cf-tab {
  display: grid;
  gap: 0.2rem;
  text-align: left;
  padding: 1.15rem 1.35rem;
  background: #fff;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.cf-tab b {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 1rem;
  color: #1a1a1a;
}
.cf-tab span { font-size: 0.83rem; color: rgba(26, 26, 26, 0.55); }
.cf-tab:hover { background: rgba(0, 35, 102, 0.03); }
.cf-tab.is-active {
  background: rgba(0, 35, 102, 0.05);
  box-shadow: inset 0 -3px 0 #002366;
}

/* ===== Поля ===== */
.cf-group { border: none; padding: 0; margin: 0; }
.cf-legend {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #0057b8;
  font-weight: 600;
  margin-bottom: 0.9rem;
  padding: 0;
}
.cf-form { display: grid; gap: 2rem; }

.cf-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 700px) { .cf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.cf-field.is-wide { grid-column: 1 / -1; }

.cf-field { display: grid; gap: 0.4rem; }
.cf-label {
  font-size: 0.86rem;
  color: rgba(26, 26, 26, 0.7);
}
.cf-req { color: #c2410c; font-style: normal; margin-left: 0.15rem; }

.cf-input {
  width: 100%;
  padding: 0.8rem 0.95rem;
  border: 1px solid #dcdcdc;
  background: #fff;
  font-size: 0.95rem;
  color: #1a1a1a;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.cf-input:hover { border-color: #b8b8b8; }
.cf-input:focus {
  outline: none;
  border-color: #002366;
  box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1);
}
.cf-textarea { resize: vertical; min-height: 5.5rem; }

.cf-error {
  font-size: 0.8rem;
  color: #c2410c;
}
.cf-error--block { display: block; margin-top: -1.25rem; }

/* ===== Согласие ===== */
.cf-consent {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 1.15rem 1.35rem;
  border: 1px solid #ededed;
  background: #fafafa;
  font-size: 0.88rem;
  line-height: 1.55;
  color: rgba(26, 26, 26, 0.7);
}
.cf-check { width: 1.05rem; height: 1.05rem; margin-top: 0.15rem; accent-color: #002366; }
.cf-consent a { color: #0057b8; text-decoration: underline; }

/* ===== Действия ===== */
.cf-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
.cf-submit {
  padding: 0.95rem 2.1rem;
  background: #002366;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.cf-submit:hover { background: #0057b8; transform: translateY(-2px); }
.cf-alt {
  font-size: 0.9rem;
  font-weight: 600;
  color: #002366;
  border-bottom: 1px solid rgba(0, 35, 102, 0.3);
}
.cf-alt:hover { color: #0057b8; border-color: #0057b8; }

.cf-hint {
  font-size: 0.83rem;
  line-height: 1.55;
  color: rgba(26, 26, 26, 0.5);
  max-width: 62ch;
}
.cf-sent {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(0, 96, 57, 0.07);
  border-left: 3px solid #006039;
  font-size: 0.9rem;
  color: rgba(26, 26, 26, 0.78);
}
.cf-copy {
  font-size: 0.85rem;
  font-weight: 600;
  color: #002366;
  border-bottom: 1px solid rgba(0, 35, 102, 0.35);
}
.cf-copied { font-size: 0.83rem; color: #006039; }
</style>

<template>
  <!-- Контакты в подаче Apple: светлая страница, белые плашки, капсулы.
       Личные мобильные и ФИО сотрудников на сайте не публикуем — только
       отделы и общие каналы компании. -->
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Контакты</span>
        <h1 class="ap-title">Начните диалог с эталоном качества.</h1>
        <p class="ap-lede">Инженерный офис в Минске и собственное производство в Заславле. Отвечаем в рабочие часы, на письма — в течение дня.</p>

        <div class="ap-grid ap-grid--2 ct-main">
          <a href="mailto:ecoservisproekt@mail.ru" class="ap-card ct-big">
            <span class="ap-eyebrow">E-mail</span>
            <b class="ct-value">ecoservisproekt@mail.ru</b>
            <span class="ap-text">Пишите по любым вопросам</span>
            <span class="ap-link ap-card-foot">Написать ›</span>
          </a>
          <a href="tel:+375293291990" class="ap-card ct-big">
            <span class="ap-eyebrow">Мессенджеры</span>
            <b class="ct-value">Viber · Telegram · WhatsApp</b>
            <span class="ap-text">+375 (29) 329-19-90</span>
            <span class="ap-link ap-card-foot">Позвонить ›</span>
          </a>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <h2 class="ap-h2">Телефоны отделов.</h2>
        <p class="ap-lede">Свяжитесь напрямую с нужным отделом — приёмная соединит с руководством.</p>
        <div class="ap-grid ap-grid--3">
          <a v-for="d in departments" :key="d.tel" :href="`tel:${d.tel}`" class="ap-card">
            <ApIcon name="phone" class="ap-ico" />
            <span class="ap-small">{{ d.role }}</span>
            <h3 class="ap-h3">{{ d.title }}</h3>
            <b class="ct-phone">{{ d.phone }}</b>
            <span class="ap-text">{{ d.note }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Контакты компании: адреса, графики работы, реквизиты -->
    <section class="ap-sec">
      <div class="ap-wrap">
        <h2 class="ap-h2">Контакты компании.</h2>
        <p class="ap-lede">Общество с ограниченной ответственностью «Экосервиспроект»</p>
        <div class="ap-grid ap-grid--3">
          <div id="schedule" class="ap-card ct-anchor">
            <h3 class="ap-h3">График работы</h3>
            <div class="ct-block">
              <b>Офис</b>
              <span>пн–пт, с 9:00 до 18:00</span>
              <small>обеденное время с 13:00 до 14:00</small>
            </div>
            <div class="ct-block">
              <b>Производство</b>
              <span>пн–пт, с 8:30 до 17:00</span>
              <small>обеденное время с 12:30 до 13:00</small>
            </div>
          </div>

          <!-- Реквизиты: по договорным документам ООО «Экосервиспроект» -->
          <div id="requisites" class="ap-card ct-anchor">
            <h3 class="ap-h3">Реквизиты предприятия</h3>
            <dl class="ct-req">
              <div v-for="r in requisites" :key="r.k">
                <dt>{{ r.k }}</dt>
                <dd>{{ r.v }}</dd>
              </div>
            </dl>
            <div class="ap-actions ct-dl">
              <a href="/docs/rekvizity-ecoservisproekt.pdf" download class="ap-btn">Скачать реквизиты</a>
              <a href="/docs/rekvizity-ecoservisproekt.docx" download class="ap-link">Word ›</a>
            </div>
            <span class="ap-small">PDF, 55 Кб · DOCX, 4 Кб</span>
          </div>

          <div class="ap-card">
            <h3 class="ap-h3">Адреса</h3>
            <div class="ct-block">
              <b>Главный офис</b>
              <span>г. Минск, ул. Петра Мстиславца, д. 20</span>
              <small>Координаты: 53.932442, 27.651330</small>
            </div>
            <div class="ct-block">
              <b>Производство</b>
              <span>г. Заславль, ул. Советская, 188Д</span>
              <small>Координаты: 54.016305, 27.259800</small>
            </div>
            <a href="#map" class="ap-link ap-card-foot">Как к нам проехать: Карта ›</a>
          </div>
        </div>
      </div>
    </section>

    <section id="contact-form" class="ap-sec ap-sec--white ct-anchor">
      <div class="ap-wrap ap-wrap--narrow">
        <div class="ap-center">
          <h2 class="ap-h2">Обсудить проект.</h2>
          <p class="ap-lede">Заполните форму — мы свяжемся в течение рабочего дня</p>
        </div>

        <form class="ap-form ct-form" @submit.prevent="submitForm">
          <div class="ap-form-row">
            <div>
              <label for="name" class="ap-label">Ваше имя *</label>
              <input id="name" v-model="form.name" name="name" autocomplete="name" type="text" class="ap-input" placeholder="Иван Иванов" required />
            </div>
            <div>
              <label for="contact" class="ap-label">Контакт для связи *</label>
              <input id="contact" v-model="form.contact" name="contact" autocomplete="email" type="text" class="ap-input" placeholder="Телефон или Email" required />
            </div>
          </div>
          <div class="ap-form-row">
            <div>
              <label for="topic" class="ap-label">Тема обращения</label>
              <select id="topic" v-model="form.topic" name="topic" class="ap-input">
                <option value="">Выберите тему</option>
                <option value="project">Обсуждение проекта</option>
                <option value="equipment">Оборудование</option>
                <option value="partnership">Партнёрство</option>
                <option value="career">Карьера</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div>
              <label for="phone" class="ap-label">Телефон</label>
              <input id="phone" v-model="form.phone" name="phone" autocomplete="tel" type="tel" class="ap-input" placeholder="+375 (__) ___-__-__" />
            </div>
          </div>
          <div>
            <label for="message" class="ap-label">Краткое описание</label>
            <textarea id="message" v-model="form.message" name="message" rows="4" class="ap-input" placeholder="Опишите вашу задачу..."></textarea>
          </div>
          <div>
            <span class="ap-label">Прикрепить файлы (ТЗ, схемы, фото)</span>
            <button type="button" class="ct-drop" @click="$refs.fileInput.click()">
              <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileUpload" />
              <span>{{ files.length > 0 ? files.length + ' файлов выбрано' : 'Перетащите файлы или нажмите для выбора' }}</span>
              <small>PDF, DOC, JPG, PNG до 10MB</small>
            </button>
          </div>
          <LeadConsent v-model="form.consent" />
          <p v-if="lead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ lead.error.value }}</p>
          <button type="submit" class="ap-btn ap-btn--block" :disabled="isSubmitting">
            {{ isSubmitting ? 'Отправка...' : 'Отправить заявку' }}
          </button>
          <p v-if="formSuccess" class="ap-note-ok">Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.</p>
        </form>
      </div>
    </section>

    <section id="map" class="ap-sec ct-anchor">
      <!-- Якоря пунктов меню «Как к нам проехать: офис / производство» -->
      <span id="map-office" class="ct-anchor" aria-hidden="true"></span>
      <span id="map-production" class="ct-anchor" aria-hidden="true"></span>
      <div class="ap-wrap">
        <h2 class="ap-h2">Где мы находимся.</h2>
        <p class="ap-lede">Инженерный офис и производство — две точки в Минском регионе. Выберите нужную, карта переведёт метку.</p>
        <div class="ct-map">
          <ContactsMap :points="officePoints" :focus-id="mapFocus" />
        </div>
        <!-- Построить маршрут: кнопки сразу открывают навигатор на точку офиса -->
        <div class="ap-actions">
          <a href="https://yandex.ru/maps/?rtext=~53.932442,27.651330&rtt=auto" target="_blank" rel="noopener" class="ap-btn">Построить маршрут в Яндекс.Картах</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=53.932442,27.651330" target="_blank" rel="noopener" class="ap-link">Открыть в Google Maps ›</a>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white ap-cta">
      <div class="ap-wrap">
        <h2 class="ap-h2">Готовы начать проект?</h2>
        <p class="ap-lede">Запланируйте встречу с нашим специалистом — обсудим детали и подготовим индивидуальное решение</p>
        <div class="ap-actions">
          <a href="#contact-form" class="ap-btn">Запланировать встречу</a>
          <NuxtLink to="/about" class="ap-link">Узнать о компании ›</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Пункт меню «Как к нам проехать» приходит якорем #map-office / #map-production.
const route = useRoute()

// Реквизиты ООО «Экосервиспроект» (из договорных документов 16.09.2026).
const requisites = [
  { k: 'УНП', v: '190937670' },
  { k: 'Юр. адрес', v: '220076, г. Минск, ул. П. Мстиславца, 20, пом. 236' },
  { k: 'Р/с', v: 'BY18 BLNB 3012 0000 2754 7200 0933' },
  { k: 'Банк', v: 'ЦБУ №17 ОАО «БНБ-Банк»' },
  { k: 'БИК', v: 'BLNBBY2X' }
]
const mapFocus = computed(() => (route.hash || '').replace(/^#map-/, '').replace(/^#.*/, ''))

// Координаты офиса и производства — по адресам из раздела «Контакты».
const officePoints = [
  {
    id: 'office',
    title: 'Главный офис',
    address: 'г. Минск, ул. Петра Мстиславца, 20',
    hours: 'Пн–Пт, 9:00–18:00, обед 13:00–14:00',
    lat: 53.932493,
    lng: 27.651316
  },
  {
    id: 'production',
    title: 'Производство',
    address: 'г. Заславль, ул. Советская, 188Д',
    hours: 'Пн–Пт, 8:30–17:00, обед 12:30–13:00',
    lat: 54.016305,
    lng: 27.259800
  }
]

import { ref, computed } from 'vue'

// Отделы — общие рабочие номера, без личных мобильных сотрудников.
const departments = [
  { title: 'Приёмная', role: 'Городской телефон', phone: '+375 (17) 238-11-41', tel: '+375172381141', note: 'Общие вопросы, запись на встречу, связь с руководством', icon: 'M3 5a2 2 0 012-2h13a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM8 9h1M15 9h1M8 13h1M15 13h1M8 17h4' },
  { title: 'Бухгалтерия', role: 'Финансовые вопросы', phone: '+375 (17) 238-11-43', tel: '+375172381143', note: 'Документы, оплата, отчётность', icon: 'M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zM9 8h6M9 12h6M9 16h3' },
  { title: 'Проектный отдел', role: 'Проектирование и расчёты', phone: '+375 (17) 238-11-44', tel: '+375172381144', note: 'Технические и проектные вопросы', icon: 'M9 2v6M15 2v6M6 4h12a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z' }
]

useHead({
  title: 'Контакты ESP | Начните диалог с EcoServiceProject',
  meta: [
    {
      name: 'description',
      content: 'Контакты ООО «Экосервиспроект»: +375 (29) 165-60-61, ecoservisproekt@mail.ru. г. Минск, ул. Петра Мстиславца, 20. Производство — г. Заславль. Запросите консультацию инженера.'
    },
    { property: 'og:title', content: 'Контакты ESP' },
    { property: 'og:description', content: '+375 (29) 165-60-61, ecoservisproekt@mail.ru. г. Минск, ул. Петра Мстиславца, 20 (р-н Нац. библиотеки).' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/contacts' }]
})

// Form state
const form = ref({
  name: '',
  contact: '',
  phone: '',
  topic: '',
  message: '',
  consent: false
})

const files = ref([])
const isSubmitting = ref(false)
const formSuccess = ref(false)

// File upload handler
const handleFileUpload = (event) => {
  files.value = Array.from(event.target.files)
}

// Form submission
const lead = useLead('contact')
const submitForm = async (e) => {
  isSubmitting.value = true
  // В поле «контакт» человек пишет почту или телефон — раскладываем по своим полям.
  const contact = form.value.contact.trim()
  const ok = await lead.send({
    name: form.value.name,
    email: contact.includes('@') ? contact : '',
    contact: contact.includes('@') ? '' : contact,
    phone: form.value.phone,
    topic: form.value.topic,
    message: form.value.message,
    consent: form.value.consent
  }, files.value, e)
  isSubmitting.value = false
  if (!ok) return
  formSuccess.value = true
  
  // Reset form after 5 seconds
  setTimeout(() => {
    form.value = {
      name: '',
      contact: '',
      phone: '',
      topic: '',
      message: '',
      consent: false
    }
    files.value = []
    formSuccess.value = false
  }, 5000)
}
</script>

<style scoped>
.ct-main { margin-top: 2.75rem; }
.ct-big { padding: clamp(1.75rem, 3vw, 2.5rem); }
.ct-value { font-size: clamp(1.35rem, 2.4vw, 1.9rem); font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; overflow-wrap: anywhere; }
.ct-phone { font-size: 1.15rem; font-weight: 600; letter-spacing: -0.01em; color: var(--ap-blue); }
.ct-block { display: grid; gap: 0.15rem; margin-top: 0.6rem; font-size: 15px; }
.ct-block b { font-weight: 600; }
.ct-block span { color: var(--ap-ink); }
.ct-block small { font-size: 12px; color: var(--ap-muted); }
.ct-req { display: grid; gap: 0.55rem; margin-top: 0.5rem; font-size: 14px; }
.ct-req div { display: grid; grid-template-columns: 5.5rem 1fr; gap: 0.75rem; }
.ct-req dt { color: var(--ap-muted); }
.ct-req dd { overflow-wrap: anywhere; }
.ct-dl { margin-top: 1rem; }
.ct-form { margin-top: 2.5rem; }
.ct-drop { display: grid; gap: 0.25rem; width: 100%; padding: 1.4rem; border: 1.5px dashed var(--ap-line); border-radius: 12px; background: #fff; text-align: center; font-size: 14px; color: var(--ap-ink); transition: border-color 0.2s ease; }
.ct-drop:hover { border-color: var(--ap-link); }
.ct-drop small { font-size: 12px; color: var(--ap-muted); }
.ct-map { margin-top: 2.5rem; border-radius: 22px; overflow: hidden; }
.ct-anchor { scroll-margin-top: 6rem; }
span.ct-anchor { display: block; }
</style>

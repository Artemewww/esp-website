<template>
  <!-- Контакты в подаче DJI Support: белая страница, крупный заголовок,
       плитки каналов связи. Личные мобильные и ФИО сотрудников на сайте
       не публикуем — только отделы и общие каналы компании. -->
  <div ref="root" class="dj ct">
    <DjPageHero
      eyebrow="Контакты"
      title="Начните диалог с эталоном качества."
      lede="Инженерный офис в Минске и собственное производство в Заславле. Отвечаем в рабочие часы, на письма — в течение дня."
    >
      <a href="#contact-form" class="dj-btn dj-btn--lg">Обсудить проект</a>
      <a href="#map" class="dj-more">Как к нам проехать</a>
    </DjPageHero>

    <DjSubnav
      title="Контакты"
      :links="[
        { href: '#channels', label: 'Связь' },
        { href: '#departments', label: 'Отделы' },
        { href: '#company', label: 'Компания' },
        { href: '#contact-form', label: 'Форма' },
        { href: '#map', label: 'Карта' }
      ]"
      :cta="{ to: '/contacts#contact-form', label: 'Написать нам' }"
    />

    <!-- Основные каналы: две крупные плитки -->
    <section id="channels" class="ct-anchor ct-channels">
      <div class="ct-grid ct-grid--2">
        <a href="mailto:ecoservisproekt@mail.ru" class="ct-tile ct-tile--big dj-reveal">
          <ApIcon name="mail" class="ct-ico" />
          <span class="ct-kicker">E-mail</span>
          <b class="ct-value">ecoservisproekt@mail.ru</b>
          <span class="ct-note">Пишите по любым вопросам</span>
          <span class="dj-more ct-foot">Написать</span>
        </a>
        <a href="tel:+375293291990" class="ct-tile ct-tile--big dj-reveal">
          <ApIcon name="chat" class="ct-ico" />
          <span class="ct-kicker">Мессенджеры</span>
          <b class="ct-value">Viber · Telegram · WhatsApp</b>
          <span class="ct-note">+375 (29) 329-19-90</span>
          <span class="dj-more ct-foot">Позвонить</span>
        </a>
      </div>
    </section>

    <!-- Телефоны отделов: плитки поддержки -->
    <section id="departments" class="dj-sec ct-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 class="dj-h2">Телефоны отделов.</h2>
        <p class="dj-lede ct-lede">Свяжитесь напрямую с нужным отделом — приёмная соединит с руководством.</p>
      </div>
      <div class="ct-grid ct-grid--3 ct-grid--pad">
        <a v-for="d in departments" :key="d.tel" :href="`tel:${d.tel}`" class="ct-tile dj-reveal">
          <ApIcon name="phone" class="ct-ico" />
          <span class="ct-kicker">{{ d.role }}</span>
          <h3 class="ct-title">{{ d.title }}</h3>
          <b class="ct-phone">{{ d.phone }}</b>
          <span class="ct-note">{{ d.note }}</span>
          <span class="dj-more ct-foot">Позвонить</span>
        </a>
      </div>
    </section>

    <!-- Контакты компании: графики работы, адреса, реквизиты -->
    <section id="company" class="dj-sec dj-sec--soft ct-anchor">
      <div class="dj-wrap">
        <div class="dj-center dj-reveal">
          <h2 class="dj-h2">Контакты компании.</h2>
          <p class="dj-lede ct-lede">Общество с ограниченной ответственностью «Экосервиспроект»</p>
        </div>

        <div class="ct-grid ct-grid--2 ct-info">
          <div id="schedule" class="ct-card ct-anchor dj-reveal">
            <ApIcon name="clock" class="ct-ico" />
            <h3 class="ct-title">График работы</h3>
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

          <div class="ct-card dj-reveal">
            <ApIcon name="pin" class="ct-ico" />
            <h3 class="ct-title">Адреса</h3>
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
            <a href="#map" class="dj-more ct-foot">Как к нам проехать: Карта</a>
          </div>
        </div>

        <!-- Реквизиты: по договорным документам ООО «Экосервиспроект» -->
        <div id="requisites" class="ct-req-wrap ct-anchor dj-reveal">
          <div class="ct-req-head">
            <h3 class="ct-title">Реквизиты предприятия</h3>
            <div class="ct-dl">
              <a href="/docs/rekvizity-ecoservisproekt.pdf" download class="dj-btn">Скачать реквизиты</a>
              <a href="/docs/rekvizity-ecoservisproekt.docx" download class="dj-more">Word</a>
            </div>
            <span class="ct-small">PDF, 55 Кб · DOCX, 4 Кб</span>
          </div>
          <dl class="ct-req">
            <div v-for="r in requisites" :key="r.k">
              <dt>{{ r.k }}</dt>
              <dd>{{ r.v }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section id="contact-form" class="dj-sec ct-anchor">
      <div class="ct-narrow">
        <div class="dj-center dj-reveal">
          <h2 class="dj-h2">Обсудить проект.</h2>
          <p class="dj-lede ct-lede">Заполните форму — мы свяжемся в течение рабочего дня</p>
        </div>

        <form class="ct-form dj-reveal" @submit.prevent="submitForm">
          <div class="ct-row">
            <div>
              <label for="name" class="ct-label">Ваше имя *</label>
              <input id="name" v-model="form.name" name="name" autocomplete="name" type="text" class="ct-input" placeholder="Иван Иванов" required />
            </div>
            <div>
              <label for="contact" class="ct-label">Контакт для связи *</label>
              <input id="contact" v-model="form.contact" name="contact" autocomplete="email" type="text" class="ct-input" placeholder="Телефон или Email" required />
            </div>
          </div>
          <div class="ct-row">
            <div>
              <label for="topic" class="ct-label">Тема обращения</label>
              <select id="topic" v-model="form.topic" name="topic" class="ct-input">
                <option value="">Выберите тему</option>
                <option value="project">Обсуждение проекта</option>
                <option value="equipment">Оборудование</option>
                <option value="partnership">Партнёрство</option>
                <option value="career">Карьера</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div>
              <label for="phone" class="ct-label">Телефон</label>
              <input id="phone" v-model="form.phone" name="phone" autocomplete="tel" type="tel" class="ct-input" placeholder="+375 (__) ___-__-__" />
            </div>
          </div>
          <div>
            <label for="message" class="ct-label">Краткое описание</label>
            <textarea id="message" v-model="form.message" name="message" rows="4" class="ct-input" placeholder="Опишите вашу задачу..."></textarea>
          </div>
          <div>
            <span class="ct-label">Прикрепить файлы (ТЗ, схемы, фото)</span>
            <button type="button" class="ct-drop" @click="$refs.fileInput.click()">
              <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileUpload" />
              <ApIcon name="upload" class="ct-drop-ico" />
              <span>{{ files.length > 0 ? files.length + ' файлов выбрано' : 'Перетащите файлы или нажмите для выбора' }}</span>
              <small>PDF, DOC, JPG, PNG до 10MB</small>
            </button>
          </div>
          <LeadConsent v-model="form.consent" />
          <p v-if="lead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ lead.error.value }}</p>
          <button type="submit" class="dj-btn dj-btn--lg ct-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Отправка...' : 'Отправить заявку' }}
          </button>
          <p v-if="formSuccess" class="ct-ok">Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.</p>
        </form>
      </div>
    </section>

    <section id="map" class="ct-anchor ct-map-sec">
      <!-- Якоря пунктов меню «Как к нам проехать: офис / производство» -->
      <span id="map-office" class="ct-anchor" aria-hidden="true"></span>
      <span id="map-production" class="ct-anchor" aria-hidden="true"></span>
      <div class="dj-wrap dj-center ct-map-head dj-reveal">
        <h2 class="dj-h2">Где мы находимся.</h2>
        <p class="dj-lede ct-lede">Инженерный офис и производство — две точки в Минском регионе. Выберите нужную, карта переведёт метку.</p>
        <!-- Построить маршрут: кнопки сразу открывают навигатор на точку офиса -->
        <div class="dj-links ct-map-act">
          <a href="https://yandex.ru/maps/?rtext=~53.932442,27.651330&rtt=auto" target="_blank" rel="noopener" class="dj-btn">Построить маршрут в Яндекс.Картах</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=53.932442,27.651330" target="_blank" rel="noopener" class="dj-more">Открыть в Google Maps</a>
        </div>
      </div>
      <div class="ct-map">
        <ContactsMap :points="officePoints" :focus-id="mapFocus" />
      </div>
    </section>

    <section class="dj-sec dj-sec--dark dj-center">
      <div class="dj-wrap dj-reveal">
        <h2 class="dj-h2">Готовы начать проект?</h2>
        <p class="dj-lede ct-lede">Запланируйте встречу с нашим специалистом — обсудим детали и подготовим индивидуальное решение</p>
        <div class="dj-links ct-cta-act">
          <a href="#contact-form" class="dj-btn dj-btn--white dj-btn--lg">Запланировать встречу</a>
          <NuxtLink to="/about" class="dj-more dj-more--light">Узнать о компании</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Пункт меню «Как к нам проехать» приходит якорем #map-office / #map-production.
const route = useRoute()
const root = ref(null)
useReveal(root)

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
import { useReveal } from '~/composables/useReveal'

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
.ct-anchor { scroll-margin-top: 120px; }
span.ct-anchor { display: block; }
.ct-lede { margin-top: 12px; max-width: 46ch; }

/* Плитки поддержки: квадратные углы, зазор 12px, светлый градиент */
.ct-grid { display: grid; gap: 12px; }
.ct-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.ct-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ct-grid--pad { max-width: 1440px; margin: clamp(32px, 4vw, 48px) auto 0; padding: 0 12px; }
.ct-channels .ct-grid { padding: 0 12px 12px; max-width: 1440px; margin: 0 auto; }

.ct-tile { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-height: 260px; padding: clamp(28px, 3vw, 40px); background: linear-gradient(180deg, #f6f7f9 0%, #eceef1 100%); color: var(--dj-text); transition: background-color 0.3s ease; overflow: hidden; }
.ct-tile::after { content: ''; position: absolute; inset: 0; background: #fff; opacity: 0; transition: opacity 0.35s var(--dj-ease); z-index: 0; pointer-events: none; }
.ct-tile:hover::after { opacity: 0.35; }
.ct-tile > * { position: relative; z-index: 1; }
.ct-tile--big { min-height: clamp(300px, 26vw, 380px); }
.ct-ico { width: 32px; height: 32px; margin-bottom: 14px; color: var(--dj-ink); }
.ct-kicker { font-size: 13px; font-weight: 500; color: var(--dj-muted); }
.ct-title { font-size: clamp(20px, 1.8vw, 24px); line-height: 1.2; font-weight: 600; color: var(--dj-ink); letter-spacing: -0.015em; }
.ct-value { font-size: clamp(22px, 2.6vw, 36px); line-height: 1.15; font-weight: 600; letter-spacing: -0.025em; color: var(--dj-ink); overflow-wrap: anywhere; }
.ct-phone { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.ct-note { font-size: 15px; line-height: 1.5; color: var(--dj-muted); }
.ct-foot { margin-top: auto; padding-top: 18px; }

/* Компания: белые карточки на сером */
.ct-info { margin-top: clamp(32px, 4vw, 48px); }
.ct-card { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: clamp(28px, 3vw, 40px); background: #fff; }
.ct-block { display: grid; gap: 2px; margin-top: 14px; font-size: 15px; }
.ct-block b { font-weight: 600; color: var(--dj-ink); }
.ct-block span { color: var(--dj-text); }
.ct-block small { font-size: 12px; color: var(--dj-muted); }

/* Реквизиты: чистый список в две колонки */
.ct-req-wrap { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 24px 48px; margin-top: 12px; padding: clamp(28px, 3vw, 40px); background: #fff; }
.ct-req-head { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
.ct-dl { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 22px; }
.ct-small { font-size: 12px; color: var(--dj-muted); }
.ct-req { margin: 0; border-top: 1px solid var(--dj-line); }
.ct-req div { display: grid; grid-template-columns: 9rem minmax(0, 1fr); gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--dj-line); font-size: 15px; }
.ct-req dt { color: var(--dj-muted); }
.ct-req dd { margin: 0; color: var(--dj-ink); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }

/* Форма: спокойная белая карточка */
.ct-narrow { max-width: 760px; margin: 0 auto; padding: 0 24px; }
.ct-form { display: grid; gap: 18px; margin-top: clamp(28px, 4vw, 44px); padding: clamp(24px, 4vw, 48px); background: #fff; box-shadow: 0 0 0 1px var(--dj-line), 0 24px 60px -32px rgba(0, 0, 0, 0.18); }
.ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.ct-label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500; color: var(--dj-ink); }
.ct-input { width: 100%; padding: 13px 14px; border: 1px solid #d2d5d9; border-radius: 0; background: #fff; font: inherit; font-size: 15px; color: var(--dj-ink); transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.ct-input:focus { outline: none; border-color: var(--dj-ink); box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1); }
textarea.ct-input { resize: vertical; }
.ct-drop { display: grid; justify-items: center; gap: 4px; width: 100%; padding: 24px; border: 1px dashed #c4c8cd; background: var(--dj-soft); text-align: center; font-size: 14px; color: var(--dj-ink); transition: border-color 0.2s ease, background-color 0.2s ease; }
.ct-drop:hover { border-color: var(--dj-ink); background: #eef0f3; }
.ct-drop small { font-size: 12px; color: var(--dj-muted); }
.ct-drop-ico { width: 24px; height: 24px; margin-bottom: 4px; color: var(--dj-muted); }
.ct-submit { width: 100%; }
.ct-submit:disabled { opacity: 0.6; cursor: default; }
.ct-ok { margin: 0; padding: 12px 14px; background: #ecf6ef; color: #135c2e; font-size: 14px; }

/* Карта во всю ширину */
.ct-map-sec { padding-top: clamp(56px, 8vw, 104px); background: var(--dj-soft); }
.ct-map-act { margin-top: 22px; }
.ct-map { margin-top: clamp(32px, 4vw, 48px); }
.ct-map :deep(.cmap) { border-radius: 0; }
.ct-cta-act { margin-top: 26px; }

@media (max-width: 1023px) {
  .ct-grid--3 { grid-template-columns: 1fr 1fr; }
  .ct-grid--3 > :last-child:nth-child(odd) { grid-column: 1 / -1; }
  .ct-req-wrap { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 767px) {
  .ct-grid--2, .ct-grid--3 { grid-template-columns: minmax(0, 1fr); }
  .ct-grid--pad, .ct-channels .ct-grid { padding-left: 8px; padding-right: 8px; gap: 8px; }
  .ct-grid { gap: 8px; }
  .ct-tile { min-height: 0; }
  .ct-row { grid-template-columns: minmax(0, 1fr); }
  .ct-narrow { padding: 0 16px; }
  .ct-req div { grid-template-columns: 6.5rem minmax(0, 1fr); }
  .ct-map-act .dj-btn { white-space: normal; height: auto; min-height: 40px; padding: 10px 22px; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .ct-tile::after { transition: none; }
}
</style>

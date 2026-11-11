<template>
  <!-- Контакты в подаче DJI Support: белая страница, крупный заголовок,
       плитки каналов связи. Личные мобильные и ФИО сотрудников на сайте
       не публикуем — только отделы и общие каналы компании. -->
  <div ref="root" class="dj ct">
    <!-- Баннер в подаче DJI Support: светлая студия, текст слева,
         справа инженер ESP в фирменном поло обсуждает проект с заказчиком -->
    <section class="ct-banner" aria-labelledby="ct-h">
      <img
        class="ct-banner__img"
        src="/images/contacts/support-banner.webp"
        alt="Инженер ESP рассказывает заказчику о флотаторе: макет установки под стеклом на белой тумбе"
        width="1792"
        height="768"
        fetchpriority="high"
      />
      <div class="dj-wrap ct-banner__wrap">
        <div class="ct-banner__txt">
          <span class="dj-eyebrow">Контакты</span>
          <h1 id="ct-h" class="ct-banner__h">Свяжитесь с инженерами ESP.</h1>
          <p class="ct-banner__lede">Инженерный офис в Минске и собственное производство в Заславле. Отвечаем в рабочие часы, на письма — в течение рабочего дня.</p>
          <div class="ct-banner__act">
            <a href="#contact-form" class="dj-btn dj-btn--lg">Обсудить проект</a>
            <a href="#map" class="dj-more">Как к нам проехать</a>
          </div>
        </div>
      </div>
    </section>

    <DjSubnav
      title="Контакты"
      :links="[
        { href: '#channels', label: 'Связь' },
        { href: '#departments', label: 'Отделы' },
        { href: '#company', label: 'Компания' },
        { href: '#contact-form', label: 'Форма' },
        { href: '#map', label: 'Карта' }
      ]"
      :cta="{ to: '/contacts#contact-form', label: 'Обсудить проект' }"
    />

    <!-- Основные каналы: две крупные плитки -->
    <section id="channels" class="ct-anchor ct-channels">
      <div class="ct-grid ct-grid--2">
        <a href="mailto:ecoservisproekt@mail.ru" class="ct-tile ct-tile--big dj-reveal">
          <ApIcon name="mail" class="ct-ico" />
          <span class="ct-kicker">Электронная почта</span>
          <b class="ct-value">ecoservisproekt@mail.ru</b>
          <span class="ct-note">По любым вопросам</span>
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
        <h2 class="dj-h2">Телефоны отделов</h2>
        <p class="dj-lede ct-lede">Свяжитесь с нужным отделом напрямую. Приёмная соединит с руководством.</p>
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
          <h2 class="dj-h2">Контакты компании</h2>
          <p class="dj-lede ct-lede">ООО «Экосервиспроект»</p>
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
            <a href="#map" class="dj-more ct-foot">Как проехать</a>
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
          <h2 class="dj-h2">Обсудить проект</h2>
          <p class="dj-lede ct-lede">Заполните форму — мы свяжемся с вами в течение рабочего дня.</p>
        </div>

        <form class="ct-form dj-reveal" @submit.prevent="submitForm">
          <div class="ct-row">
            <div>
              <label for="name" class="ct-label">Ваше имя *</label>
              <input id="name" v-model="form.name" name="name" autocomplete="name" type="text" class="ct-input" placeholder="Фамилия Имя" required />
            </div>
            <div>
              <label for="contact" class="ct-label">Контакт для связи *</label>
              <input id="contact" v-model="form.contact" name="contact" autocomplete="email" type="text" class="ct-input" placeholder="Телефон или электронная почта" required />
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
            <textarea id="message" v-model="form.message" name="message" rows="4" class="ct-input" placeholder="Опишите задачу"></textarea>
          </div>
          <div>
            <span class="ct-label">Прикрепить файлы (ТЗ, схемы, фото)</span>
            <button type="button" class="ct-drop" @click="$refs.fileInput.click()">
              <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileUpload" />
              <ApIcon name="upload" class="ct-drop-ico" />
              <span>{{ files.length > 0 ? files.length + ' файлов выбрано' : 'Перетащите файлы или нажмите для выбора' }}</span>
              <small>PDF, DOC, JPG, PNG, до 10 МБ</small>
            </button>
          </div>
          <LeadConsent v-model="form.consent" />
          <p v-if="lead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ lead.error.value }}</p>
          <button type="submit" class="dj-btn dj-btn--lg ct-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Отправка…' : 'Отправить заявку' }}
          </button>
          <p v-if="formSuccess" class="ct-ok">Заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>
        </form>
      </div>
    </section>

    <section id="map" class="ct-anchor ct-map-sec">
      <!-- Якоря пунктов меню «Как к нам проехать: офис / производство» -->
      <span id="map-office" class="ct-anchor" aria-hidden="true"></span>
      <span id="map-production" class="ct-anchor" aria-hidden="true"></span>
      <div class="dj-wrap dj-center ct-map-head dj-reveal">
        <h2 class="dj-h2">Где мы находимся</h2>
        <p class="dj-lede ct-lede">Инженерный офис и производство — две точки в Минском регионе. Выберите нужную — карта переместит метку.</p>
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
        <h2 class="dj-h2">Обсудим ваш проект</h2>
        <p class="dj-lede ct-lede">Назначьте встречу со специалистом: обсудим детали и подготовим решение под ваш объект.</p>
        <div class="dj-links ct-cta-act">
          <a href="#contact-form" class="dj-btn dj-btn--white dj-btn--lg">Обсудить проект</a>
          <NuxtLink to="/about" class="dj-more dj-more--light">О компании</NuxtLink>
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
/* Apple Contact: белая страница, карточки со скруглением 18px на #f5f5f7,
   отделы — сетка с волосяными линиями, поля формы в стиле apple.com. */
/* Баннер «как DJI Support»: фото на всю ширину, текст на светлой части слева */
.ct-banner { position: relative; display: flex; align-items: center; height: clamp(440px, 33vw, 640px); margin-top: var(--dj-header-h, 44px); overflow: hidden; background: linear-gradient(180deg, #d1d4d9 0%, #d6d8df 17%, #d5d8de 33%, #cdd0d5 46%, #d8dbe0 60%, #e1e4ea 67%, #dadee6 82%, #c2c7cd 100%); }
/* Фото прижато вправо; слева стена продолжается фоном в тон — под текстом чистое поле,
   макеты станций и люди видны полностью */
.ct-banner__img { position: absolute; top: 0; right: 0; height: 100%; width: auto; max-width: none; aspect-ratio: 1792 / 768; -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 12%); mask-image: linear-gradient(90deg, transparent 0%, #000 12%); }
.ct-banner__wrap { position: relative; width: 100%; }
/* Светлая дымка в тон стены под текстом: размытый макет на фоне не спорит с заголовком */
.ct-banner::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, rgba(214, 217, 223, 0.92) 0%, rgba(214, 217, 223, 0.8) 34%, rgba(214, 217, 223, 0) 48%); }
.ct-banner__wrap { z-index: 1; }
.ct-banner__txt { max-width: min(480px, 33%); }
.ct-banner__h { margin-top: 10px; font-size: clamp(32px, 2.9vw, 52px); font-weight: 600; line-height: 1.06; letter-spacing: -0.015em; color: #1d1d1f; }
.ct-banner__lede { margin-top: 14px; font-size: clamp(16px, 1.25vw, 20px); line-height: 1.42; color: #424245; }
.ct-banner__act { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 24px; margin-top: 28px; }
/* Планшет и телефон: фото сверху целиком, текст под ним — ничего не перекрывает людей */
@media (max-width: 1068px) {
  .ct-banner { display: block; height: auto; background: #f5f5f7; }
  .ct-banner::after { display: none; }
  .ct-banner__img { position: static; display: block; width: 100%; height: auto; aspect-ratio: 16 / 7; object-position: 74% 30%; -webkit-mask-image: none; mask-image: none; }
  .ct-banner__txt { max-width: 640px; padding: 32px 0 40px; }
}
@media (max-width: 734px) {
  .ct-banner__img { aspect-ratio: 4 / 3; }
  .ct-banner__txt { max-width: none; padding: 28px 0 36px; }
}
.ct-anchor { scroll-margin-top: 120px; }
span.ct-anchor { display: block; }
.ct-lede { margin-top: 14px; max-width: 40em; color: #6e6e73; }
.dj-sec--dark .ct-lede { color: #86868b; }

.ct-grid { display: grid; gap: 20px; }
.ct-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.ct-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ct-grid--pad { max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }
.ct-channels .ct-grid { padding: 12px 12px 0; max-width: 1440px; margin: 0 auto; gap: 12px; }

.ct-tile { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-height: 260px; padding: clamp(28px, 3vw, 44px); border-radius: 18px; background: #f5f5f7; color: var(--dj-ink); transition: transform 0.3s cubic-bezier(0, 0, 0.5, 1), box-shadow 0.3s cubic-bezier(0, 0, 0.5, 1); overflow: hidden; }
.ct-tile:hover { transform: scale(1.01); box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.12); }
.ct-channels .ct-tile { border-radius: 18px; }
.ct-channels .ct-tile:hover { transform: none; box-shadow: none; }
.ct-tile--big { min-height: clamp(320px, 28vw, 420px); align-items: center; justify-content: center; text-align: center; }
.ct-ico { width: 36px; height: 36px; margin-bottom: 16px; color: var(--dj-ink); }
.ct-kicker { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; font-weight: 600; color: #6e6e73; }
.ct-title { font-size: clamp(24px, 2vw, 28px); line-height: 1.14; font-weight: 600; color: var(--dj-ink); letter-spacing: 0.007em; }
.ct-value { font-size: clamp(28px, 3vw, 40px); line-height: 1.1; font-weight: 600; letter-spacing: 0; color: var(--dj-ink); overflow-wrap: anywhere; }
.ct-phone { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.ct-note { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.ct-foot { margin-top: auto; padding-top: 20px; font-size: 17px; }
.ct-tile--big .ct-foot { margin-top: 0; }

/* Компания: белые карточки на #f5f5f7 */
.ct-info { margin-top: clamp(36px, 4vw, 56px); }
.ct-card { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: clamp(28px, 3vw, 44px); border-radius: 18px; background: #fff; }
.ct-block { display: grid; gap: 2px; margin-top: 18px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; }
.ct-block b { font-weight: 600; color: var(--dj-ink); }
.ct-block span { color: var(--dj-ink); }
.ct-block small { font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }

/* Реквизиты: список как Tech Specs */
.ct-req-wrap { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 24px 56px; margin-top: 20px; padding: clamp(28px, 3vw, 44px); border-radius: 18px; background: #fff; }
.ct-req-head { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
.ct-dl { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 22px; }
.ct-small { font-size: 12px; line-height: 1.33; letter-spacing: -0.01em; color: #6e6e73; }
.ct-req { margin: 0; border-top: 1px solid #d2d2d7; }
.ct-req div { display: grid; grid-template-columns: 9rem minmax(0, 1fr); gap: 16px; padding: 16px 0; border-bottom: 1px solid #d2d2d7; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; }
.ct-req dt { color: #6e6e73; }
.ct-req dd { margin: 0; color: var(--dj-ink); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }

/* Форма: поля apple.com — скругление 12px, рамка #86868b, фокус синим */
.ct-narrow { max-width: 692px; margin: 0 auto; padding: 0 24px; }
.ct-form { display: grid; gap: 20px; margin-top: clamp(32px, 4vw, 48px); }
.ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ct-label { display: block; margin-bottom: 8px; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; font-weight: 600; color: var(--dj-ink); }
.ct-input { width: 100%; min-height: 56px; padding: 16px; border: 1px solid #86868b; border-radius: 12px; background: #fff; font: inherit; font-size: 17px; line-height: 1.24; letter-spacing: -0.022em; color: var(--dj-ink); transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.ct-input::placeholder { color: #86868b; }
.ct-input:focus { outline: none; border-color: #0071e3; box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.2); }
select.ct-input { -webkit-appearance: none; appearance: none; padding-right: 44px; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%2386868b' stroke-width='1.6'/%3E%3C/svg%3E") no-repeat right 18px center / 12px 8px; }
textarea.ct-input { resize: vertical; }
.ct-drop { display: grid; justify-items: center; gap: 4px; width: 100%; padding: 28px 24px; border: 1px dashed #86868b; border-radius: 12px; background: #f5f5f7; text-align: center; font-size: 17px; letter-spacing: -0.022em; color: var(--dj-ink); transition: border-color 0.2s ease, background-color 0.2s ease; }
.ct-drop:hover { border-color: #0071e3; background: #f0f0f3; }
.ct-drop small { font-size: 12px; color: #6e6e73; }
.ct-drop-ico { width: 24px; height: 24px; margin-bottom: 4px; color: #6e6e73; }
.ct-submit { width: 100%; height: 56px; border-radius: 12px; font-size: 17px; }
.ct-submit:disabled { opacity: 0.6; cursor: default; }
.ct-ok { margin: 0; padding: 14px 16px; border-radius: 12px; background: #ecf6ef; color: #135c2e; font-size: 14px; }

/* Карта во всю ширину */
.ct-map-sec { padding-top: clamp(56px, 8vw, 104px); background: #f5f5f7; }
.ct-map-act { margin-top: 24px; }
.ct-map { margin-top: clamp(36px, 4vw, 56px); }
.ct-map :deep(.cmap) { border-radius: 0; }
.ct-cta-act { margin-top: 30px; }

@media (max-width: 1023px) {
  .ct-grid--3 { grid-template-columns: 1fr 1fr; }
  .ct-grid--3 > :last-child:nth-child(odd) { grid-column: 1 / -1; }
  .ct-req-wrap { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 767px) {
  .ct-grid--2, .ct-grid--3 { grid-template-columns: minmax(0, 1fr); }
  .ct-grid--pad { padding-left: 16px; padding-right: 16px; }
  .ct-grid { gap: 12px; }
  .ct-channels .ct-grid { padding: 12px 0 0; }
  .ct-tile { min-height: 0; }
  .ct-row { grid-template-columns: minmax(0, 1fr); }
  .ct-narrow { padding: 0 16px; }
  .ct-req div { grid-template-columns: 6.5rem minmax(0, 1fr); }
  .ct-map-act .dj-btn { white-space: normal; height: auto; min-height: 40px; padding: 10px 22px; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .ct-tile { transition: none; }
  .ct-tile:hover { transform: none; }
}
</style>

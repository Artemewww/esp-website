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
        alt="Инженер ESP в фирменном поло рассказывает заказчику о станции на фоне макета очистных сооружений"
        width="1792"
        height="768"
        fetchpriority="high"
      />
      <div class="dj-wrap ct-banner__wrap">
        <div class="ct-banner__txt">
          <span class="dj-eyebrow">Контакты</span>
          <h1 id="ct-h" class="ct-banner__h">Свяжитесь с инженерами ESP.</h1>
          <p class="ct-banner__lede">Инженерный офис в Минске и собственное производство в Заславле. Отвечаем в рабочие часы, на письма — в течение рабочего дня.</p>
          <div class="ct-banner__act">
            <a href="#contact-form" class="dj-btn dj-btn--lg">Обсудить проект</a>
            <a href="#map" class="dj-more">Как к нам проехать</a>
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

    <!-- Каналы связи одной карточкой-облачком: мессенджеры, телефон, почта -->
    <section id="channels" class="ct-anchor ct-channels">
      <CtMessengers class="dj-reveal" />
    </section>

    <!-- Телефоны отделов: плитки поддержки -->
    <section id="departments" class="dj-sec ct-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 class="dj-h2">Телефоны отделов</h2>
        <p class="dj-lede ct-lede">Свяжитесь с нужным отделом напрямую. Приёмная соединит с руководством.</p>
      </div>
      <div class="ct-grid ct-grid--3 ct-grid--pad">
        <a v-for="d in departments" :key="d.tel" :href="`tel:${d.tel}`" class="ct-tile ct-tile--photo dj-reveal">
          <span class="ct-dep-photo"><img :src="d.photo" :alt="d.title" loading="lazy" decoding="async" width="1200" height="800" /></span>
          <span class="ct-dep-ico" :style="{ '--c': d.color }" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path :d="d.icon" /></svg>
          </span>
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

        <!-- График работы: живые часы Минска + два здания; клик ведёт на карту -->
        <div id="schedule" class="ct-info ct-anchor dj-reveal">
          <CtSchedule @go="goToMap" />
        </div>

        <!-- Реквизиты: по договорным документам ООО «Экосервиспроект» -->
        <div id="requisites" class="ct-anchor dj-reveal">
          <CtRequisites :items="requisites" />
        </div>
      </div>
    </section>

    <section id="contact-form" class="dj-sec ct-anchor">
      <div class="ct-narrow">
        <div class="dj-center dj-reveal">
          <h2 class="dj-h2">Обсудить проект</h2>
          <p class="dj-lede ct-lede">Заполните форму — мы свяжемся с вами в течение рабочего дня.</p>
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
          <p v-if="formSuccess" class="ct-ok">Заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>
        </form>
      </div>
    </section>

    <section id="map" class="ct-anchor ct-map-sec">
      <!-- Якоря пунктов меню «Как к нам проехать: офис / производство» -->
      <span id="map-office" class="ct-anchor" aria-hidden="true"></span>
      <span id="map-production" class="ct-anchor" aria-hidden="true"></span>
      <div class="dj-wrap dj-center ct-map-head dj-reveal">
        <h2 class="dj-h2">Приезжайте — покажем в&nbsp;работе.</h2>
        <p class="dj-lede ct-lede">В офисе в Минске обсудим проект с&nbsp;инженерами, на производстве в Заславле — посмотрите оборудование до&nbsp;поставки. Нажмите на&nbsp;метку, чтобы построить маршрут.</p>
      </div>
      <div class="ct-map">
        <ContactsMap ref="mapRef" :points="officePoints" :focus-id="mapFocus" />
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
  { k: 'Банк', v: 'ЦБУ № 17 ОАО «БНБ-Банк»' },
  { k: 'БИК', v: 'BLNBBY2X' }
]
// Клик по карточке здания: прокрутить к карте и раскрыть метку с маршрутом.
const mapRef = ref(null)
const goToMap = (id) => {
  document.getElementById('map')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => mapRef.value?.focusById(id), 450)
}
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
    address: 'г. Заславль, ул. Советская, 118Д',
    hours: 'Пн–Пт, 8:30–17:00, обед 12:30–13:00',
    lat: 54.016305,
    lng: 27.259800
  }
]

import { ref, computed } from 'vue'
import { useReveal } from '~/composables/useReveal'
import CtSchedule from '~/components/contacts/CtSchedule.vue'
import CtRequisites from '~/components/contacts/CtRequisites.vue'
import CtMessengers from '~/components/contacts/CtMessengers.vue'

// Отделы — общие рабочие номера, без личных мобильных сотрудников.
const departments = [
  // Иконки в духе SF Symbols: гарнитура, калькулятор, циркуль — у каждого отдела своя
  { title: 'Приёмная', photo: '/images/contacts/dept-reception.webp', role: 'Городской телефон', phone: '+375 (17) 238-11-41', tel: '+375172381141', note: 'Общие вопросы, запись на встречу, связь с руководством', color: '#002366', icon: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5.5A1.5 1.5 0 0 1 4 17.5V14ZM20 14h-3v5h1.5a1.5 1.5 0 0 0 1.5-1.5V14ZM17 19c0 1.4-1.8 2.5-4.5 2.5' },
  { title: 'Бухгалтерия', photo: '/images/contacts/dept-accounting.webp', role: 'Финансовые вопросы', phone: '+375 (17) 238-11-43', tel: '+375172381143', note: 'Документы, оплата, отчётность', color: '#1f7a4d', icon: 'M8 2.5h8A2.5 2.5 0 0 1 18.5 5v14a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 19V5A2.5 2.5 0 0 1 8 2.5ZM8.5 6h7v3.5h-7ZM9 13h.01M12 13h.01M15 13h.01M9 16.5h.01M12 16.5h.01M15 16.5h.01' },
  { title: 'Проектный отдел', photo: '/images/contacts/dept-design.webp', role: 'Проектирование и расчёты', phone: '+375 (17) 238-11-44', tel: '+375172381144', note: 'Технические и проектные вопросы', color: '#0a6cff', icon: 'M12 2.5v2.5M12 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM11 8.8 6 21M13 8.8l5 12.2M7.6 17h8.8' }
]

useHead({
  title: 'Контакты ESP | Офис в Минске, производство в Заславле',
  meta: [
    {
      name: 'description',
      content: 'Контакты ООО «Экосервиспроект»: +375 (29) 165-60-61, ecoservisproekt@mail.ru. г. Минск, ул. Петра Мстиславца, 20. Производство — г. Заславль. Запросите консультацию инженера.'
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
.ct-banner { position: relative; display: flex; align-items: center; height: clamp(440px, 33vw, 640px); margin-top: var(--dj-header-h, 44px); overflow: hidden; background: linear-gradient(180deg, #d7dde4 0%, #d8dee5 25%, #d7dce3 50%, #d4d9df 67%, #cdd3d9 83%, #bfc4cb 100%); }
/* Фото прижато вправо; слева стена продолжается фоном в тон — под текстом чистое поле,
   макеты станций и люди видны полностью */
.ct-banner__img { position: absolute; top: 0; right: 0; height: 100%; width: auto; max-width: none; aspect-ratio: 1792 / 768; -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 12%); mask-image: linear-gradient(90deg, transparent 0%, #000 12%); }
.ct-banner__wrap { position: relative; width: 100%; }
/* Светлая дымка в тон стены под текстом: размытый макет на фоне не спорит с заголовком */
.ct-banner::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, rgba(216, 222, 229, 0.92) 0%, rgba(216, 222, 229, 0.8) 34%, rgba(216, 222, 229, 0) 48%); }
.ct-banner__wrap { z-index: 1; }
.ct-banner__txt { max-width: min(480px, 33%); }
.ct-banner__h { margin-top: 10px; font-size: clamp(32px, 2.9vw, 52px); font-weight: 600; line-height: 1.06; letter-spacing: -0.015em; color: #1d1d1f; }
.ct-banner__lede { margin-top: 14px; font-size: clamp(16px, 1.25vw, 20px); line-height: 1.42; color: #424245; }
.ct-banner__act { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 24px; margin-top: 28px; }
/* Планшет и телефон: фото сверху целиком, текст под ним — ничего не перекрывает людей */
@media (max-width: 1068px) {
  .ct-banner { display: block; height: auto; margin-top: 0; background: #f5f5f7; }
  .ct-banner::after { display: none; }
  .ct-banner__img { position: static; display: block; width: 100%; height: auto; aspect-ratio: 16 / 7; object-fit: cover; object-position: 74% 30%; -webkit-mask-image: none; mask-image: none; }
  .ct-banner__txt { max-width: 640px; padding: 32px 0 40px; }
}
@media (max-width: 734px) {
  .ct-banner__img { aspect-ratio: 4 / 3; }
  .ct-banner__txt { max-width: none; padding: 28px 0 36px; }
}
.ct-anchor { scroll-margin-top: 120px; }
span.ct-anchor { display: block; }
.ct-lede { margin-top: 14px; max-width: 40em; color: #6e6e73; }

.ct-grid { display: grid; gap: 20px; }
.ct-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.ct-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ct-grid--pad { max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }

.ct-tile { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-height: 260px; padding: clamp(28px, 3vw, 44px); border-radius: 18px; background: #f5f5f7; color: var(--dj-ink); transition: transform 0.3s cubic-bezier(0, 0, 0.5, 1), box-shadow 0.3s cubic-bezier(0, 0, 0.5, 1); overflow: hidden; }
.ct-tile:hover { transform: scale(1.01); box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.12); }
.ct-channels .ct-tile { border-radius: 18px; }
.ct-channels .ct-tile:hover { transform: none; box-shadow: none; }
.ct-dep-ico { display: grid; place-items: center; width: 56px; height: 56px; margin-bottom: 18px; border-radius: 16px; background: color-mix(in srgb, var(--c) 10%, #fff); color: var(--c); transition: transform 0.3s cubic-bezier(0, 0, 0.5, 1); }
.ct-dep-ico svg { width: 30px; height: 30px; }
/* #49: карточка отдела — фото сверху (как во всём сайте), иконка-бейдж на стыке фото и текста */
.ct-tile--photo { padding-top: 0; }
.ct-dep-photo { display: block; margin: 0 calc(-1 * clamp(28px, 3vw, 44px)); width: calc(100% + 2 * clamp(28px, 3vw, 44px)); aspect-ratio: 16 / 10; overflow: hidden; background: #e8e8ed; }
.ct-dep-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0, 0, 0.5, 1); }
.ct-tile--photo:hover .ct-dep-photo img { transform: scale(1.04); }
.ct-tile--photo .ct-dep-ico { margin-top: -28px; position: relative; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1); background: #fff; }
.ct-tile:hover .ct-dep-ico { transform: scale(1.08) rotate(-4deg); }
.ct-ico { width: 36px; height: 36px; margin-bottom: 16px; color: var(--dj-ink); }
.ct-kicker { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; font-weight: 600; color: #6e6e73; }
.ct-title { font-size: clamp(24px, 2vw, 28px); line-height: 1.14; font-weight: 600; color: var(--dj-ink); letter-spacing: 0.007em; }
.ct-phone { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.ct-note { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.ct-foot { margin-top: auto; padding-top: 20px; font-size: 17px; }

.ct-info { margin-top: clamp(36px, 4vw, 56px); }


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
.ct-map { margin-top: clamp(36px, 4vw, 56px); }
.ct-map :deep(.cmap) { border-radius: 0; }
@media (max-width: 1068px) { .ct-map :deep(.cmap-switch) { padding: 0 16px; } }

@media (max-width: 1023px) {
  .ct-grid--3 { grid-template-columns: 1fr 1fr; }
  .ct-grid--3 > :last-child:nth-child(odd) { grid-column: 1 / -1; }
  }
@media (max-width: 767px) {
  .ct-grid--2, .ct-grid--3 { grid-template-columns: minmax(0, 1fr); }
  .ct-grid--pad { padding-left: 16px; padding-right: 16px; }
  .ct-grid { gap: 12px; }
  .ct-tile { min-height: 0; }
  .ct-row { grid-template-columns: minmax(0, 1fr); }
  .ct-narrow { padding: 0 16px; }
  }
@media (prefers-reduced-motion: reduce) {
  .ct-tile { transition: none; }
  .ct-tile:hover { transform: none; }
}
</style>

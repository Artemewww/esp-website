<template>
  <!-- Контакты в подаче DJI Support: белая страница, крупный заголовок,
       плитки каналов связи. Личные мобильные и ФИО сотрудников на сайте
       не публикуем — только отделы и общие каналы компании. -->
  <div ref="root" class="dj ct">
    <!-- Первый экран: тот же блок, что «Обсудим ваш объект» — текст слева, сотрудники ESP справа -->
    <AppleCta class="ct-top" h1 eyebrow="Контакты" title="Свяжитесь с инженерами ESP." lede="Инженерный офис в Минске и собственное производство в Заславле. Отвечаем в рабочие часы, на письма — в течение рабочего дня." />

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
      <div class="ct-dc-grid ct-grid--pad">
        <a v-for="d in departments" :key="d.title" :href="`tel:${d.tel}`" class="ct-dc dj-reveal">
          <span class="ct-dc-photo"><img :src="d.photo" :alt="d.alt || d.title" :style="d.pos ? { objectPosition: d.pos } : null" loading="lazy" decoding="async" width="1200" height="800" /></span>
          <span class="ct-dc-body">
            <span class="ct-dc-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path :d="d.icon" /></svg>
            </span>
            <span class="ct-dc-role">{{ d.role }}</span>
            <h3 class="ct-dc-title">{{ d.title }}</h3>
            <b class="ct-dc-phone">{{ d.phone }}</b>
            <span class="ct-dc-note">{{ d.note }}</span>
            <span class="ct-dc-foot">
              <span class="ct-dc-call">Позвонить<span aria-hidden="true"> ›</span></span>
              <span class="ct-dc-btn" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </span>
          </span>
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

        <!-- На широком экране график и папка «Документы» стоят в один ряд -->
        <div class="ct-company-row">
        <!-- График работы: живые часы Минска + два здания; клик ведёт на карту -->
        <div id="schedule" class="ct-info ct-anchor dj-reveal">
          <CtSchedule @go="goToMap" />
        </div>

        <!-- Реквизиты: по договорным документам ООО «Экосервиспроект» -->
        <div id="requisites" class="ct-anchor dj-reveal">
          <CtRequisites :items="requisites" />
        </div>
        </div>
      </div>
    </section>

    <section id="contact-form" class="dj-sec ct-anchor">
      <div class="ct-narrow">
        <figure class="ct-hands dj-reveal" aria-hidden="true">
          <img src="/images/brand/hands-drop.webp" alt="" width="1792" height="768" loading="lazy" decoding="async" />
        </figure>
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
              <label for="contact" class="ct-label">Контакт для связи *</label>
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
              <input id="phone" v-model="form.phone" name="phone" autocomplete="tel" type="tel" class="ct-input ct-input--tel" placeholder="+375 (__) ___-__-__" />
            </div>
          </div>
          <div>
            <label for="message" class="ct-label">Краткое описание</label>
            <textarea id="message" v-model="form.message" name="message" rows="4" class="ct-input" placeholder="Опишите задачу"></textarea>
          </div>
          <div>
            <span class="ct-label">Прикрепить файлы (ТЗ, схемы, фото)</span>
            <button type="button" class="ct-drop" @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="handleDrop">
              <input ref="fileInput" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.jpg,.jpeg,.png,.webp,.heic,.zip,.rar,.7z" class="hidden" @change="handleFileUpload" />
              <ApIcon name="upload" class="ct-drop-ico" />
              <span>{{ files.length > 0 ? files.length + ' файлов выбрано' : 'Перетащите файлы или нажмите для выбора' }}</span>
              <small>PDF, DOC, XLS, DWG, JPG, PNG, ZIP — до 5 файлов по 10 МБ</small>
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
        <p class="dj-lede ct-lede">В офисе в Минске обсудим проект с&nbsp;инженерами, на производстве в Заславле — посмотрите оборудование до&nbsp;поставки. Нажмите на&nbsp;метку, чтобы построить маршрут.</p>
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
import { contacts } from '~/composables/useSiteNav'
import CtSchedule from '~/components/contacts/CtSchedule.vue'
import CtRequisites from '~/components/contacts/CtRequisites.vue'
import CtMessengers from '~/components/contacts/CtMessengers.vue'

// Отделы — общие рабочие номера, без личных мобильных сотрудников.
const departments = [
  // Иконки в духе SF Symbols: гарнитура, калькулятор, циркуль — у каждого отдела своя
  { title: 'Приёмная', photo: '/images/contacts/dept-reception.webp', role: 'Городской телефон', phone: '+375 (17) 238-11-41', tel: '+375172381141', note: 'Общие вопросы, запись на встречу, связь с руководством', color: '#002366', icon: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5.5A1.5 1.5 0 0 1 4 17.5V14ZM20 14h-3v5h1.5a1.5 1.5 0 0 0 1.5-1.5V14ZM17 19c0 1.4-1.8 2.5-4.5 2.5' },
  { title: 'Бухгалтерия', photo: '/images/contacts/dept-accounting.webp', role: 'Финансовые вопросы', phone: '+375 (17) 238-11-43', tel: '+375172381143', note: 'Документы, оплата, отчётность', color: '#002366', icon: 'M8 2.5h8A2.5 2.5 0 0 1 18.5 5v14a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 19V5A2.5 2.5 0 0 1 8 2.5ZM8.5 6h7v3.5h-7ZM9 13h.01M12 13h.01M15 13h.01M9 16.5h.01M12 16.5h.01M15 16.5h.01' },
  { title: 'Проектный отдел', photo: '/images/contacts/dept-design.webp', pos: '78% 50%', role: 'Проектирование и расчёты', phone: '+375 (17) 238-11-44', tel: '+375172381144', note: 'Технические и проектные вопросы', color: '#002366', icon: 'M12 2.5v2.5M12 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM11 8.8 6 21M13 8.8l5 12.2M7.6 17h8.8' },
  // Отдельного номера у производства нет — общий телефон компании (useSiteNav contacts.phone)
  { title: 'Цех ESP', photo: '/images/contacts/dept-production.webp', alt: 'Лазерная резка металла в цехе ESP в Заславле', role: 'Производство в Заславле', phone: contacts.phone, tel: contacts.phoneHref.replace('tel:', ''), note: 'Собственное производство оборудования', color: '#002366', icon: 'M3 21h18M4 21V10l5 3V10l5 3V10l5 3v8M17 6V3h2v7' }
]

useHead({
  title: 'Контакты ESP | Офис в Минске, производство в Заславле',
  meta: [
    {
      name: 'description',
      content: `Контакты ООО «Экосервиспроект»: ${contacts.phone}, ${contacts.email}. ${contacts.address}. Производство — г. Заславль. Запросите консультацию инженера.`
    },
    { property: 'og:title', content: 'Контакты ESP' },
    { property: 'og:description', content: `${contacts.phone}, ${contacts.email}. ${contacts.address}.` }
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
// Те же ограничения, что на сервере (server/api/lead.post.ts): иначе файл молча отбросится.
const FILE_OK = /\.(pdf|docx?|xlsx?|dwg|dxf|jpe?g|png|webp|heic|zip|rar|7z)$/i
const pickFiles = (list) => {
  const all = Array.from(list || [])
  files.value = all.filter(f => FILE_OK.test(f.name) && f.size <= 10 * 1024 * 1024).slice(0, 5)
  lead.error.value = files.value.length < all.length
    ? 'Часть файлов не прикреплена: до 5 файлов PDF, DOC, XLS, DWG, JPG, PNG, ZIP, до 10 МБ каждый'
    : ''
}
const handleFileUpload = (event) => pickFiles(event.target.files)
const handleDrop = (event) => pickFiles(event.dataTransfer?.files)

// Тема из ссылки: /contacts?topic=equipment#contact-form
const TOPICS = { project: 'Обсуждение проекта', equipment: 'Оборудование', partnership: 'Партнёрство', career: 'Карьера', other: 'Другое' }
if (TOPICS[route.query.topic]) form.value.topic = route.query.topic

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
    topic: TOPICS[form.value.topic] || '',
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
/* Apple Contact: белая страница, карточки со скруглением 18px на #EDEDED,
   отделы — сетка с волосяными линиями, поля формы в стиле apple.com. */
/* Баннер «как Apple Support»: светлый фон #FAFAFA, слева колонка по центру —
   серебряная капля ESP, заголовок, текст, кнопки; справа фото, растушёванное в фон */
.ct-banner { position: relative; display: flex; align-items: center; min-height: clamp(420px, 33vw, 640px); overflow: hidden; background: #CED2D8; }
.ct-banner__media { position: absolute; top: 8px; right: 2%; bottom: 0; width: 56%; display: flex; justify-content: flex-end; align-items: flex-end; }
/* Фото: люди и макет справа; левый, верхний и нижний края мягко уходят в фон */
.ct-banner__img { display: block; width: auto; height: 100%; max-width: 100%; object-fit: contain; object-position: right bottom; }
.ct-banner__wrap { position: relative; z-index: 1; width: 100%; }
.ct-banner__txt { display: flex; flex-direction: column; align-items: center; width: 40%; max-width: 480px; padding: 48px 0; text-align: center; }
.ct-banner__mark { display: block; width: auto; height: 120px; margin-bottom: 22px; filter: drop-shadow(0 10px 18px rgba(26, 26, 26, 0.14)); }
.ct-banner__h { margin-top: 10px; font-size: clamp(32px, 2.9vw, 52px); font-weight: 600; line-height: 1.06; letter-spacing: -0.015em; color: #1A1A1A; }
.ct-banner__lede { margin-top: 14px; font-size: clamp(16px, 1.25vw, 20px); line-height: 1.42; color: #3D3D3D; }
.ct-banner__act { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 14px 24px; margin-top: 28px; }
/* Планшет и телефон: фото сверху, низ растушёван в фон, текст по центру под ним */
@media (max-width: 1068px) {
  .ct-banner { display: block; min-height: 0; margin-top: 0; }
  .ct-banner__media { position: relative; width: 100%; aspect-ratio: 16 / 9; }
  .ct-banner__media { top: 0; justify-content: center; padding-top: 16px; }
  .ct-banner__img { height: 100%; width: auto; object-position: center bottom; }
  .ct-banner__txt { width: auto; max-width: 600px; margin: 0 auto; padding: 4px 0 44px; }
  .ct-banner__mark { height: 96px; margin-bottom: 18px; }
}
@media (max-width: 734px) {
  .ct-banner__media { aspect-ratio: 5 / 4; }
  .ct-banner__img { object-position: center bottom; }
  .ct-banner__txt { padding: 0 0 36px; }
  .ct-banner__mark { height: 84px; margin-bottom: 14px; }
}
.ct-anchor { scroll-margin-top: 120px; }
span.ct-anchor { display: block; }
.ct-lede { margin-top: 14px; max-width: 40em; color: #5E5E5E; }

.ct-grid { display: grid; gap: 20px; }
.ct-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.ct-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ct-grid--pad { max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }

.ct-tile { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-height: 260px; padding: clamp(28px, 3vw, 44px); border-radius: var(--r-md); background: #EDEDED; color: var(--dj-ink); transition: transform 0.3s cubic-bezier(0, 0, 0.5, 1), box-shadow 0.3s cubic-bezier(0, 0, 0.5, 1); overflow: hidden; }
.ct-tile:hover { transform: scale(1.01); box-shadow: var(--sh-1); }
.ct-channels .ct-tile { border-radius: var(--r-md); }
.ct-channels .ct-tile:hover { transform: none; box-shadow: none; }
/* #49: карточки отделов — фото сверху растворяется в матовое «стекло», плитка-иконка на стыке */
.ct-dc-grid { display: grid; gap: 20px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.ct-dc { --dc-bg: #F4F6F9; position: relative; display: flex; flex-direction: column; border-radius: var(--r-lg); background: var(--dc-bg); color: var(--dj-ink); overflow: hidden; isolation: isolate; box-shadow: 0 1px 2px rgba(0, 35, 102, 0.05), 0 18px 40px -22px rgba(0, 35, 102, 0.28); transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.4s cubic-bezier(0.2, 0.7, 0.2, 1); }
.ct-dc:hover { transform: translateY(-6px); box-shadow: 0 2px 4px rgba(0, 35, 102, 0.06), 0 28px 56px -24px rgba(0, 35, 102, 0.36); }
.ct-dc:focus-visible { outline: 2px solid #002366; outline-offset: 4px; }
.ct-dc-photo { position: relative; display: block; aspect-ratio: 4 / 3; overflow: hidden; }
.ct-dc-photo img { width: 100%; height: 100%; object-fit: cover; -webkit-mask-image: linear-gradient(to bottom, #000 52%, rgba(0, 0, 0, 0.55) 78%, transparent 100%); mask-image: linear-gradient(to bottom, #000 52%, rgba(0, 0, 0, 0.55) 78%, transparent 100%); transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1); }
/* матовое стекло: размытие нарастает плавно, без жёсткой границы */
.ct-dc-photo::after { content: ''; position: absolute; inset: 40% 0 0; background: linear-gradient(to bottom, rgba(244, 246, 249, 0), rgba(244, 246, 249, 0.75)); -webkit-backdrop-filter: blur(16px) saturate(1.2); backdrop-filter: blur(16px) saturate(1.2); -webkit-mask-image: linear-gradient(to bottom, transparent, #000 70%); mask-image: linear-gradient(to bottom, transparent, #000 70%); pointer-events: none; }
.ct-dc:hover .ct-dc-photo img { transform: scale(1.05); }
.ct-dc-body { position: relative; z-index: 1; display: flex; flex: 1; flex-direction: column; align-items: flex-start; gap: 6px; margin-top: -28px; padding: 0 24px 22px; }
.ct-dc-ico { display: grid; place-items: center; width: 56px; height: 56px; margin-bottom: 12px; border-radius: 16px; background: #fff; color: #002366; box-shadow: 0 1px 2px rgba(0, 35, 102, 0.08), 0 8px 20px -8px rgba(0, 35, 102, 0.3); transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1); }
.ct-dc-ico svg { width: 30px; height: 30px; }
.ct-dc:hover .ct-dc-ico { transform: translateY(-2px) rotate(-4deg); }
.ct-dc-role { font-size: 14px; line-height: 1.4; font-weight: 500; color: #6B7280; }
.ct-dc-title { margin: 0; font-size: clamp(22px, 1.7vw, 26px); line-height: 1.15; font-weight: 600; letter-spacing: -0.01em; color: var(--dj-ink); }
.ct-dc-phone { margin-top: 4px; font-size: clamp(20px, 1.55vw, 23px); line-height: 1.2; font-weight: 600; letter-spacing: -0.005em; color: var(--dj-ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ct-dc-note { font-size: 15px; line-height: 1.45; color: #5E5E5E; }
.ct-dc-foot { display: flex; align-items: center; justify-content: space-between; align-self: stretch; margin-top: auto; padding-top: 18px; }
.ct-dc-call { font-size: 17px; font-weight: 600; color: #002366; }
.ct-dc-btn { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: #fff; color: #002366; box-shadow: 0 0 0 1px rgba(0, 35, 102, 0.12); transition: background 0.3s, color 0.3s, transform 0.3s; }
.ct-dc-btn svg { width: 18px; height: 18px; }
.ct-dc:hover .ct-dc-btn { background: #002366; color: #fff; transform: translateX(2px); }
@media (max-width: 1199px) { .ct-dc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .ct-dc-photo { aspect-ratio: 16 / 9; } }
@media (max-width: 767px) {
  .ct-dc-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
  .ct-dc-body { padding: 0 20px 18px; }
}
@media (prefers-reduced-motion: reduce) { .ct-dc, .ct-dc-photo img, .ct-dc-ico, .ct-dc-btn { transition: none; } .ct-dc:hover { transform: none; } .ct-dc:hover .ct-dc-photo img { transform: none; } }
.ct-ico { width: 36px; height: 36px; margin-bottom: 16px; color: var(--dj-ink); }
.ct-kicker { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; font-weight: 600; color: #5E5E5E; }
.ct-title { font-size: clamp(24px, 2vw, 28px); line-height: 1.14; font-weight: 600; color: var(--dj-ink); letter-spacing: 0.007em; }
.ct-phone { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.ct-note { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.ct-foot { margin-top: auto; padding-top: 20px; font-size: 17px; }

.ct-info { margin-top: clamp(36px, 4vw, 56px); }


/* Форма: поля apple.com — скругление 12px, рамка #8A8A8A, фокус синим */
.ct-narrow { max-width: 692px; margin: 0 auto; padding: 0 24px; }
.ct-hands { width: 100vw; margin: 0 0 clamp(8px, 2vw, 20px) calc(50% - 50vw); }
.ct-hands img { display: block; width: 100%; height: auto; mix-blend-mode: multiply; }
.ct-form { display: grid; gap: 20px; margin-top: clamp(32px, 4vw, 48px); }
/* Ширина полей — по длине ввода: имя и тема уже, контакт шире, телефон ~240px */
.ct-row { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 20px; }
@media (min-width: 768px) { .ct-input--tel { max-width: 240px; } }
.ct-label { display: block; margin-bottom: 8px; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; font-weight: 600; color: var(--dj-ink); }
.ct-input { width: 100%; min-height: 56px; padding: 16px; border: 1px solid #8A8A8A; border-radius: var(--r-sm); background: #fff; font: inherit; font-size: 17px; line-height: 1.24; letter-spacing: -0.022em; color: var(--dj-ink); transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.ct-input::placeholder { color: #8A8A8A; }
.ct-input:focus { outline: none; border-color: #002366; box-shadow: var(--focus-ring); }
select.ct-input { -webkit-appearance: none; appearance: none; padding-right: 44px; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%2386868b' stroke-width='1.6'/%3E%3C/svg%3E") no-repeat right 18px center / 12px 8px; }
textarea.ct-input { resize: vertical; }
.ct-drop { display: grid; justify-items: center; gap: 4px; width: 100%; padding: 28px 24px; border: 1px dashed #8A8A8A; border-radius: var(--r-sm); background: #EDEDED; text-align: center; font-size: 17px; letter-spacing: -0.022em; color: var(--dj-ink); transition: border-color 0.2s ease, background-color 0.2s ease; }
.ct-drop:hover { border-color: #002366; background: #EDEDED; }
.ct-drop small { font-size: 12px; color: #5E5E5E; }
.ct-drop-ico { width: 24px; height: 24px; margin-bottom: 4px; color: #5E5E5E; }
.ct-submit { width: 100%; height: 56px; border-radius: var(--r-sm); font-size: 17px; }
.ct-submit:disabled { opacity: 0.6; cursor: default; }
.ct-ok { margin: 0; padding: 14px 16px; border-radius: var(--r-sm); background: #ecf6ef; color: #135c2e; font-size: 14px; }

/* Карта во всю ширину */
.ct-map-sec { padding-top: clamp(56px, 8vw, 104px); background: #EDEDED; }
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
/* Первый экран: кадр сотрудников «уходит» за правый край экрана — среза руки не видно,
   люди крупнее и левее; низ прячется под блок «Инженеры ESP» */
.ct-top :deep(.ct-person), .ct-top :deep(.ct-ph) { position: static; }
.ct-top :deep(.ct-person) { min-height: clamp(460px, 40vw, 640px); }
.ct-top :deep(.ct-copy) { position: relative; z-index: 2; }
.ct-top :deep(.ct-person img) { position: absolute; right: max(0px, calc(50% - 490px)); bottom: 0; height: min(100%, 860px); width: auto; max-width: 52vw; object-fit: contain; object-position: right bottom; -webkit-mask-image: none; mask-image: none; }
@media (max-width: 834px) { .ct-top :deep(.ct-person) { min-height: 0; } .ct-top :deep(.ct-person img) { position: static; height: auto; max-width: 100%; } }
.ct-channels { position: relative; z-index: 2; margin-top: clamp(-72px, -5vw, -32px); }
@media (max-width: 834px) { .ct-channels { margin-top: -24px; } }
@media (min-width: 1600px) {
  .ct-company-row { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr); gap: 24px; align-items: end; margin-top: clamp(48px, 4vw, 72px); width: min(1760px, 94vw); position: relative; left: 50%; transform: translateX(-50%); }
  .ct-company-row :deep(.cr) { margin-top: 0; display: flex; flex-direction: column; }
  .ct-company-row :deep(.cr-folder) { flex: 1; }
}
</style>

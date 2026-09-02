<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <PageHero
      kicker="Контакты"
      title="Начните диалог с эталоном качества"
      lede="Инженерный офис в Минске и собственное производство в Заславле. Отвечаем в рабочие часы, на письма — в течение дня."
    />

    <!-- Способы связи: сведены в одну строку без крупных декоративных
         иконок — 16-пиксельная метка слева и сразу сам контакт. -->
    <section class="section contact-methods bg-white">
      <div class="container">
        <div class="cm-grid">
          <a href="tel:+375291656061" class="cm-card animate-on-scroll">
            <span class="cm-kicker">Телефон</span>
            <span class="cm-value">+375 29 165-60-61</span>
            <span class="cm-note">Пн–Пт, 9:00–18:00</span>
          </a>

          <a href="mailto:info@ecoservisproekt.com" class="cm-card animate-on-scroll">
            <span class="cm-kicker">Почта</span>
            <span class="cm-value">info@ecoservisproekt.com</span>
            <span class="cm-note">Отвечаем в течение рабочего дня</span>
          </a>

          <div class="cm-card animate-on-scroll">
            <span class="cm-kicker">Мессенджеры</span>
            <span class="cm-msgs">
              <a href="https://wa.me/375291656061" target="_blank" rel="noopener" class="cm-msg">WhatsApp</a>
              <a href="https://t.me/ecoservisproekt" target="_blank" rel="noopener" class="cm-msg">Telegram</a>
            </span>
            <span class="cm-note">Быстрее всего — сюда</span>
          </div>

          <div class="cm-card animate-on-scroll">
            <span class="cm-kicker">Адрес</span>
            <span class="cm-value cm-value--sm">Минск, ул. Петра Мстиславца, 20, пом. 236</span>
            <span class="cm-note">220076, Республика Беларусь</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section contact-personal-section bg-white">
      <div class="container">
        <h2 class="section__title text-center mb-12 animate-on-scroll">
          Персональные контакты
        </h2>
        <p class="section__subtitle text-center text-esp-black/70 mb-12 max-w-2xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
          Выберите направление для связи с профильным специалистом
        </p>
        
        <div class="personal-cards-grid mb-16">
          <!-- Technical Support 24/7 -->
          <div class="personal-card p-8 animate-on-scroll">
            <div class="personal-card__head">
              <div class="personal-card__avatar bg-esp-blue/8 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="w-9 h-9 text-esp-blue">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="personal-card__titles">
                <h3 class="personal-card__name">Техническая поддержка</h3>
                <p class="personal-card__position">Инженеры 24/7, без выходных</p>
              </div>
            </div>
            <div class="personal-card__contacts">
              <a href="tel:+375291656061" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                +375 29 165-60-61
              </a>
              <a href="mailto:support@ecoservisproekt.com" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                support@ecoservisproekt.com
              </a>
            </div>
          </div>
          
          <!-- HR -->
          <div class="personal-card p-8 animate-on-scroll" style="animation-delay: 0.1s">
            <div class="personal-card__head">
              <div class="personal-card__avatar bg-esp-blue/8 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="w-9 h-9 text-esp-blue">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="personal-card__titles">
                <h3 class="personal-card__name">HR-отдел</h3>
                <p class="personal-card__position">Карьера и стажировки</p>
              </div>
            </div>
            <div class="personal-card__contacts">
              <a href="mailto:hr@ecoservisproekt.com" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                hr@ecoservisproekt.com
              </a>
              <p class="personal-card__note">Пн–Пт: 10:00 – 17:00</p>
            </div>
          </div>
          
          <!-- Press Service -->
          <div class="personal-card p-8 animate-on-scroll" style="animation-delay: 0.2s">
            <div class="personal-card__head">
              <div class="personal-card__avatar bg-esp-blue/8 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="w-9 h-9 text-esp-blue">
                  <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="personal-card__titles">
                <h3 class="personal-card__name">Пресс-служба</h3>
                <p class="personal-card__position">СМИ и партнёрские запросы</p>
              </div>
            </div>
            <div class="personal-card__contacts">
              <a href="mailto:press@ecoservisproekt.com" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                press@ecoservisproekt.com
              </a>
              <p class="personal-card__note">Для аккредитации и комментариев СМИ</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section id="contact-form" class="section contact-form bg-esp-gray">
      <div class="container">
        <h2 class="section__title text-center mb-4 animate-on-scroll">
          Обсудить проект
        </h2>
        <p class="section__subtitle text-center text-esp-black/70 mb-12 max-w-2xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
          Заполните форму — мы свяжемся в течение рабочего дня
        </p>
        
        <div class="max-w-4xl mx-auto">
          <form @submit.prevent="submitForm" class="contact-form__fields bg-white p-8 shadow-lg">
            <div class="form-row grid md:grid-cols-2 gap-6">
              
              <!-- Name -->
              <div class="form-group">
                <label for="name" class="form-label block text-sm font-medium text-esp-black mb-2">
                  Ваше имя *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name"
                  class="form-input w-full px-4 py-3 border border-esp-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-esp-blue focus:border-transparent transition-all"
                  placeholder="Иван Иванов"
                  required
                />
              </div>
              
              <!-- Contact -->
              <div class="form-group">
                <label for="contact" class="form-label block text-sm font-medium text-esp-black mb-2">
                  Контакт для связи *
                </label>
                <input 
                  type="text" 
                  id="contact" 
                  v-model="form.contact"
                  class="form-input w-full px-4 py-3 border border-esp-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-esp-blue focus:border-transparent transition-all"
                  placeholder="Телефон или Email"
                  required
                />
              </div>
            </div>

            <div class="form-row grid md:grid-cols-2 gap-6">
              
              <!-- Topic -->
              <div class="form-group">
                <label for="topic" class="form-label block text-sm font-medium text-esp-black mb-2">
                  Тема обращения
                </label>
                <select 
                  id="topic" 
                  v-model="form.topic"
                  class="form-input w-full px-4 py-3 border border-esp-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-esp-blue focus:border-transparent transition-all"
                >
                  <option value="">Выберите тему</option>
                  <option value="project">Обсуждение проекта</option>
                  <option value="equipment">Оборудование</option>
                  <option value="partnership">Партнёрство</option>
                  <option value="career">Карьера</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              
              <!-- Phone -->
              <div class="form-group">
                <label for="phone" class="form-label block text-sm font-medium text-esp-black mb-2">
                  Телефон
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone"
                  class="form-input w-full px-4 py-3 border border-esp-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-esp-blue focus:border-transparent transition-all"
                  placeholder="+375 (__) ___-__-__"
                />
              </div>
            </div>
            
            <!-- Message -->
            <div class="form-group">
              <label for="message" class="form-label block text-sm font-medium text-esp-black mb-2">
                Краткое описание
              </label>
              <textarea 
                id="message" 
                v-model="form.message"
                rows="4"
                class="form-input w-full px-4 py-3 border border-esp-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-esp-blue focus:border-transparent transition-all resize-none"
                placeholder="Опишите вашу задачу..."
              ></textarea>
            </div>
            
            <!-- File Upload -->
            <div class="form-group">
              <label class="form-label block text-sm font-medium text-esp-black mb-2">
                Прикрепить файлы (ТЗ, схемы, фото)
              </label>
              <div class="file-upload border-2 border-dashed border-esp-gray rounded-lg p-6 text-center hover:border-esp-blue transition-colors cursor-pointer">
                <input 
                  type="file" 
                  multiple 
                  class="hidden"
                  @change="handleFileUpload"
                  ref="fileInput"
                />
                <div @click="$refs.fileInput.click()">
                  <svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 mx-auto mb-2 text-esp-black/40">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <p class="text-sm text-esp-black/70">
                    {{ files.length > 0 ? files.length + ' файлов выбрано' : 'Перетащите файлы или нажмите для выбора' }}
                  </p>
                  <p class="text-xs text-esp-black/50 mt-1">PDF, DOC, JPG, PNG до 10MB</p>
                </div>
              </div>
            </div>
            
            <!-- Consent -->
            <div class="form-group">
              <label class="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" v-model="form.consent" class="mt-1 w-4 h-4 text-esp-blue rounded focus:ring-esp-blue" required />
                <span class="text-sm text-esp-black/70">
                  Я согласен на обработку персональных данных в соответствии с 
                  <a href="#" class="text-esp-blue hover:underline">политикой конфиденциальности</a>
                </span>
              </label>
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit" 
              class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Отправка...' : 'Отправить заявку' }}
            </button>
            
            <!-- Success Message -->
            <div v-if="formSuccess" class="form-success bg-esp-green/10 text-esp-green p-4 rounded-lg text-center mt-4">
              <span class="text-2xl mb-2 block">✅</span>
              <p>Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.</p>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="section contact-map bg-white">
      <div class="container">
        <h2 class="section__title text-center mb-4 animate-on-scroll">Где мы находимся</h2>
        <p class="text-center text-esp-black/60 mb-10 max-w-2xl mx-auto animate-on-scroll">
          Инженерный офис и производство — две точки в Минском регионе.
          Выберите нужную, карта переведёт метку.
        </p>

        <div class="animate-on-scroll">
          <ContactsMap :points="officePoints" />
        </div>

        <!-- Построить маршрут: кнопки сразу открывают навигатор на точку офиса -->
        <div class="route-actions animate-on-scroll">
          <a
            href="https://yandex.ru/maps/?rtext=~53.9375,27.6321&rtt=auto"
            target="_blank"
            rel="noopener"
            class="route-btn route-btn--primary"
          >
            <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5" aria-hidden="true">
              <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Построить маршрут в Яндекс.Картах
          </a>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=53.9375,27.6321"
            target="_blank"
            rel="noopener"
            class="route-btn route-btn--ghost"
          >
            <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5" aria-hidden="true">
              <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Открыть в Google Maps
          </a>
        </div>
      </div>
    </section>

    <section class="section cta relative overflow-hidden" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full" style="background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%); animation: rotate 20s linear infinite" />
      </div>
      
      <div class="container relative z-10 text-center text-white">
        <h2 class="cta__title mb-6 animate-on-scroll">Готовы начать проект?</h2>
        <p class="cta__desc text-lg opacity-95 mb-10 max-w-2xl mx-auto animate-on-scroll">
          Запланируйте встречу с нашим специалистом — обсудим детали и подготовим индивидуальное решение
        </p>
        <!-- Кнопки те же, что в CTA на главной: базовый класс .btn на этой
             странице не был описан, поэтому пара сжималась и налезала. -->
        <div class="cta__actions flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 animate-on-scroll">
          <a href="#contact-form" class="cta-btn cta-btn--primary">
            Запланировать встречу
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <NuxtLink to="/about" class="cta-btn cta-btn--ghost">
            Узнать о компании
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Координаты сняты по адресам офиса и производства — если нужна метка
// точно в воротах, пришлите координаты, поправлю в одну строку.
const officePoints = [
  {
    id: 'office',
    title: 'Головной офис',
    address: 'Минск, ул. Петра Мстиславца, 20, пом. 236',
    hours: 'Пн–Пт, 9:00–18:00',
    lat: 53.9375,
    lng: 27.6321
  },
  {
    id: 'production',
    title: 'Производство',
    address: 'Заславль, производственная зона',
    hours: 'По предварительной записи',
    lat: 54.0022,
    lng: 27.2814
  }
]

import { ref, onMounted } from 'vue'

useHead({
  title: 'Контакты ESP | Начните диалог с EcoServiceProject',
  meta: [
    {
      name: 'description',
      content: 'Контакты EcoServiceProject: +375 29 165-60-61, info@ecoservisproekt.com. Минск, ул. Петра Мстиславца, 20, пом. 236. Запросите консультацию инженера.'
    },
    { property: 'og:title', content: 'Контакты ESP' },
    { property: 'og:description', content: '+375 29 165-60-61, info@ecoservisproekt.com. г. Минск, ул. Петра Мстиславца, 20, пом. 236.' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.com/contacts' }]
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
const submitForm = async () => {
  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isSubmitting.value = false
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

// Scroll animations
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, { threshold: 0.1 })
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
  
  // Add CSS animations
  const style = document.createElement('style')
  style.textContent = `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-on-scroll.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `
  document.head.appendChild(style)
})
</script>

<style scoped>
/* ===== Способы связи ===== */
.cm-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: #ededed;
  border: 1px solid #ededed;
  margin-bottom: 4rem;
}
@media (min-width: 640px) { .cm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .cm-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

/* Карточки собраны в одну плиту с волосяными разделителями: так строка
   контактов читается как таблица фактов, а не как четыре разных блока. */
.cm-card {
  display: grid;
  align-content: start;
  gap: 0.4rem;
  padding: 1.6rem 1.5rem;
  background: #fff;
  transition: background-color 0.2s ease;
}
a.cm-card:hover { background: rgba(0, 35, 102, 0.03); }

.cm-kicker {
  font-size: 0.72rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #0057b8;
  font-weight: 600;
}
.cm-value {
  font-size: 1.02rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.35;
  word-break: break-word;
}
.cm-value--sm { font-size: 0.95rem; font-weight: 500; }
.cm-note {
  font-size: 0.8rem;
  color: rgba(26, 26, 26, 0.55);
}
.cm-msgs { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.cm-msg {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a;
  border-bottom: 1px solid rgba(0, 35, 102, 0.3);
  transition: color 0.2s ease, border-color 0.2s ease;
}
.cm-msg:hover { color: #0057b8; border-color: #0057b8; }

/* ===== CONTAINER - FIX RIGHT MARGIN ===== */
.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ===== SECTIONS ===== */
.section {
  padding: 5rem 0;
}

.section__title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.section__subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
}

/* ===== HERO SECTION ===== */
.hero__gradient {
  z-index: 0;
}

.hero__pattern {
  z-index: 0;
  background-image: 
    radial-gradient(ellipse at 20% 80%, rgba(0,96,57,0.08) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 20%, rgba(0,35,102,0.08) 0%, transparent 40%);
  pointer-events: none;
}

.hero__title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
}

/* ===== CONTACT CARDS ===== */
.contact-card {
  border: 1px solid transparent;
}

.contact-card:hover {
  border-color: rgba(0, 96, 57, 0.2);
}

.contact-card__link {
  word-break: break-word;
}

.contact-card__icon svg {
  stroke: #002366;
}

/* ===== PERSONAL CARDS GRID ===== */
.personal-cards-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .personal-cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.personal-card {
  border: 1px solid #e6ebf2;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 35, 102, 0.06);
  transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
}

.personal-card:hover {
  border-color: rgba(0, 35, 102, 0.25);
  box-shadow: 0 18px 40px rgba(0, 35, 102, 0.12);
  transform: translateY(-3px);
}

.personal-card__head {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.personal-card__avatar {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.personal-card__name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #002366;
  line-height: 1.25;
}

.personal-card__position {
  font-size: 0.85rem;
  color: rgba(26, 26, 26, 0.6);
  margin-top: 0.15rem;
}

.personal-card__contacts {
  display: grid;
  gap: 0.6rem;
}

.personal-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0057b8;
  transition: color 0.2s ease;
  word-break: break-word;
}

.personal-card__link:hover { color: #002366; }

.personal-card__note {
  font-size: 0.8rem;
  color: rgba(26, 26, 26, 0.55);
}

.personal-card__avatar img {
  display: block;
}

/* ===== ROUTE BUTTONS (Яндекс/Google навигатор) ===== */
.route-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.route-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.route-btn:hover { transform: translateY(-2px); }

.route-btn--primary {
  background: #002366;
  color: #fff;
}
.route-btn--primary:hover { background: #00307f; }

.route-btn--ghost {
  background: #fff;
  color: #002366;
  border-color: rgba(0, 35, 102, 0.3);
}
.route-btn--ghost:hover { border-color: #002366; background: rgba(0, 35, 102, 0.04); }

/* ===== FORM STYLES ===== */
.contact-form__fields {
  position: relative;
}

.form-input {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
}

.form-input:focus {
  box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1);
}

.file-upload:hover {
  border-color: #002366;
  background: rgba(0, 35, 102, 0.02);
}

/* ===== MAP SECTION ===== */
.map-wrapper {
  position: relative;
  width: 100%;
}

.map-container {
  position: relative;
  width: 100%;
  height: 500px;
}

.map-container iframe {
  border-radius: 24px;
}

/* ===== OFFICE CARDS ===== */
.office-card {
  border: 1px solid rgba(237, 237, 237, 0.5);
}

/* ===== CTA SECTION & BUTTONS ===== */
.cta {
  position: relative;
  overflow: hidden;
}

/* ===== Кнопки CTA — общий стиль с главной ===== */
.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-size: 0.98rem;
  font-weight: 600;
  white-space: nowrap;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease;
}
.cta-btn svg { width: 18px; height: 18px; transition: transform 0.25s ease; }
.cta-btn--primary {
  background: linear-gradient(100deg, #00a8e8, #0086ba);
  color: #fff;
  box-shadow: 0 14px 34px -12px rgba(0, 168, 232, 0.75);
}
.cta-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px -12px rgba(0, 168, 232, 0.9);
}
.cta-btn--primary:hover svg { transform: translateX(3px); }
.cta-btn--ghost {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
}
.cta-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.btn--cta-primary {
  background: #FFFFFF;
  color: #002366;
  border: 2px solid #FFFFFF;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn--cta-primary:hover {
  background: #006039;
  color: #FFFFFF;
  border-color: #006039;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 96, 57, 0.3);
}

.btn--cta-outline {
  background: transparent;
  color: #FFFFFF;
  border: 2px solid #FFFFFF;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn--cta-outline:hover {
  background: #FFFFFF;
  color: #002366;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.2);
}

/* ===== ANIMATIONS ===== */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .section {
    padding: 3rem 0;
  }
  
  .contact-form__fields {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .map-container {
    height: 400px;
  }
  
  .cta__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn--lg {
    width: 100%;
    max-width: 300px;
  }
}

/* ===== FIX PAGE WIDTH - NO RIGHT MARGIN ===== */
.contact-page {
  width: 100%;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}
</style>
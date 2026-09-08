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
            <span class="cm-kicker">Телефон · A1</span>
            <span class="cm-value">+375 (29) 165-60-61</span>
            <span class="cm-note">Пн–Пт, 9:00–18:00</span>
          </a>

          <a href="mailto:ecoservisproekt@mail.ru" class="cm-card animate-on-scroll">
            <span class="cm-kicker">E-mail</span>
            <span class="cm-value">ecoservisproekt@mail.ru</span>
            <span class="cm-note">Пишите по любым вопросам</span>
          </a>

          <a href="tel:+375293291990" class="cm-card animate-on-scroll">
            <span class="cm-kicker">Мессенджеры</span>
            <span class="cm-value">Viber · Telegram · WhatsApp</span>
            <span class="cm-note">+375 (29) 329-19-90</span>
          </a>

          <div class="cm-card animate-on-scroll">
            <span class="cm-kicker">Офис</span>
            <span class="cm-value cm-value--sm">Минск, ул. Петра Мстиславца, 20</span>
            <span class="cm-note">220076, Республика Беларусь</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section contact-personal-section bg-white">
      <div class="container">
        <h2 class="section__title text-center mb-12 animate-on-scroll">
          Телефоны отделов и руководителей
        </h2>
        <p class="section__subtitle text-center text-esp-black/70 mb-12 max-w-2xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
          Свяжитесь напрямую с нужным отделом или руководителем
        </p>
        
        <div class="personal-cards-grid mb-16">
          <!-- Приёмная -->
          <div class="personal-card p-8 animate-on-scroll">
            <div class="personal-card__head">
              <div class="personal-card__avatar bg-esp-blue/8 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="w-9 h-9 text-esp-blue">
                  <path d="M3 5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 9h1M15 9h1M8 13h1M15 13h1M8 17h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="personal-card__titles">
                <h3 class="personal-card__name">Приёмная</h3>
                <p class="personal-card__position">Городской телефон</p>
              </div>
            </div>
            <div class="personal-card__contacts">
              <a href="tel:+375172381141" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                +375 (17) 238-11-41
              </a>
              <p class="personal-card__note">Общие вопросы, запись на встречу</p>
            </div>
          </div>
          
          <!-- Бухгалтерия -->
          <div class="personal-card p-8 animate-on-scroll" style="animation-delay: 0.1s">
            <div class="personal-card__head">
              <div class="personal-card__avatar bg-esp-blue/8 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="w-9 h-9 text-esp-blue">
                  <path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="personal-card__titles">
                <h3 class="personal-card__name">Бухгалтерия</h3>
                <p class="personal-card__position">Финансовые вопросы</p>
              </div>
            </div>
            <div class="personal-card__contacts">
              <a href="tel:+375172381143" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                +375 (17) 238-11-43
              </a>
              <p class="personal-card__note">Документы, оплата, отчётность</p>
            </div>
          </div>
          
          <!-- Проектный отдел -->
          <div class="personal-card p-8 animate-on-scroll" style="animation-delay: 0.2s">
            <div class="personal-card__head">
              <div class="personal-card__avatar bg-esp-blue/8 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="w-9 h-9 text-esp-blue">
                  <path d="M9 2v6M15 2v6M6 4h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="personal-card__titles">
                <h3 class="personal-card__name">Проектный отдел</h3>
                <p class="personal-card__position">Проектирование и расчёты</p>
              </div>
            </div>
            <div class="personal-card__contacts">
              <a href="tel:+375172381144" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                +375 (17) 238-11-44
              </a>
              <p class="personal-card__note">Технические и проектные вопросы</p>
            </div>
          </div>

          <!-- Директор -->
          <div class="personal-card p-8 animate-on-scroll">
            <div class="personal-card__head">
              <div class="personal-card__avatar bg-esp-blue/8 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="w-9 h-9 text-esp-blue">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="personal-card__titles">
                <h3 class="personal-card__name">Громак Алексей Иванович</h3>
                <p class="personal-card__position">Директор</p>
              </div>
            </div>
            <div class="personal-card__contacts">
              <a href="tel:+375296345655" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                +375 (29) 634-56-55
              </a>
            </div>
          </div>

          <!-- Зам. по проектированию -->
          <div class="personal-card p-8 animate-on-scroll" style="animation-delay: 0.1s">
            <div class="personal-card__head">
              <div class="personal-card__avatar bg-esp-blue/8 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="w-9 h-9 text-esp-blue">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="personal-card__titles">
                <h3 class="personal-card__name">Попов Кирилл Валерьевич</h3>
                <p class="personal-card__position">Заместитель директора по проектированию</p>
              </div>
            </div>
            <div class="personal-card__contacts">
              <a href="tel:+375296478883" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                +375 (29) 647-88-83
              </a>
            </div>
          </div>

          <!-- Зам. по производству -->
          <div class="personal-card p-8 animate-on-scroll" style="animation-delay: 0.2s">
            <div class="personal-card__head">
              <div class="personal-card__avatar bg-esp-blue/8 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="w-9 h-9 text-esp-blue">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="personal-card__titles">
                <h3 class="personal-card__name">Громак Иван Алексеевич</h3>
                <p class="personal-card__position">Заместитель директора по производству</p>
              </div>
            </div>
            <div class="personal-card__contacts">
              <a href="tel:+375293291990" class="personal-card__link">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                +375 (29) 329-19-90
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Контакты компании: адреса, графики работы, реквизиты -->
    <section class="section contact-company bg-white">
      <div class="container">
        <h2 class="section__title text-center mb-4 animate-on-scroll">Контакты компании</h2>
        <p class="text-center text-esp-black/70 mb-12 max-w-2xl mx-auto animate-on-scroll">
          Общество с ограниченной ответственностью «Экосервиспроект»
        </p>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
          <!-- Графики -->
          <div class="bg-esp-gray p-8">
            <h3 class="font-rounded text-lg font-semibold mb-4 text-esp-black">График работы</h3>
            <div class="space-y-4">
              <div>
                <p class="font-medium text-esp-black">Офис</p>
                <p class="text-esp-black/70 text-sm">пн–пт, с 9:00 до 18:00</p>
                <p class="text-esp-black/50 text-xs">обеденное время с 13:00 до 14:00</p>
              </div>
              <div>
                <p class="font-medium text-esp-black">Производство</p>
                <p class="text-esp-black/70 text-sm">пн–пт, с 8:30 до 17:00</p>
                <p class="text-esp-black/50 text-xs">обеденное время с 12:30 до 13:00</p>
              </div>
            </div>
          </div>

          <!-- Реквизиты -->
          <div class="bg-esp-gray p-8">
            <h3 class="font-rounded text-lg font-semibold mb-4 text-esp-black">Реквизиты предприятия</h3>
            <p class="text-esp-black/70 text-sm mb-4">Скачайте реквизиты для оформления документов и договоров</p>
            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-esp-blue text-white rounded-full text-sm font-semibold hover:bg-esp-blue/90 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>
              Скачать реквизиты
            </a>
            <p class="text-esp-black/50 text-xs mt-2">PDF, 275 Кб</p>
          </div>

          <!-- Адреса -->
          <div class="bg-esp-gray p-8">
            <h3 class="font-rounded text-lg font-semibold mb-4 text-esp-black">Адреса</h3>
            <div class="space-y-4">
              <div>
                <p class="font-medium text-esp-black">Главный офис</p>
                <p class="text-esp-black/70 text-sm">г. Минск, ул. Петра Мстиславца, д. 20</p>
                <p class="text-esp-black/50 text-xs">Координаты: 53.932442, 27.651330</p>
              </div>
              <div>
                <p class="font-medium text-esp-black">Производство</p>
                <p class="text-esp-black/70 text-sm">г. Заславль, ул. Советская, 188Д</p>
                <p class="text-esp-black/50 text-xs">Координаты: 54.016305, 27.259800</p>
              </div>
              <a href="#map" class="inline-flex items-center gap-1 text-esp-blue text-sm font-semibold hover:underline">Как к нам проехать: Карта</a>
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
    <section id="map" class="section contact-map bg-white">
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
            href="https://yandex.ru/maps/?rtext=~53.932442,27.651330&rtt=auto"
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
            href="https://www.google.com/maps/dir/?api=1&destination=53.932442,27.651330"
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
// Координаты офиса и производства — по адресам из раздела «Контакты».
const officePoints = [
  {
    id: 'office',
    title: 'Главный офис',
    address: 'г. Минск, ул. Петра Мстиславца, 20',
    hours: 'Пн–Пт, 9:00–18:00, обед 13:00–14:00',
    lat: 53.932442,
    lng: 27.651330
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

import { ref, onMounted } from 'vue'

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
<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero relative py-20 overflow-hidden">
      <div class="hero__gradient absolute inset-0 bg-gradient-to-br from-esp-blue/10 via-white to-esp-green/10" />
      <div class="hero__pattern absolute inset-0 opacity-[0.05]" />
      
      <div class="container relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="hero__title mb-6 animate-on-scroll">
            Начните диалог с <span class="text-esp-green">Эталоном</span> качества
          </h1>
          <p class="hero__subtitle text-lg text-esp-black/70 mb-8 animate-on-scroll" style="animation-delay: 0.1s">
            ESP — ваш премиальный технологический партнер. Мы на связи для обсуждения проектов любой сложности
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Methods Grid -->
    <section class="section contact-methods bg-white">
      <div class="container">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          <!-- Phone -->
          <div class="contact-card bg-esp-gray/50 p-8 text-center hover:shadow-lg transition-all duration-300 animate-on-scroll">
            <div class="contact-card__icon w-16 h-16 mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" class="w-full h-full">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="contact-card__title text-lg font-semibold mb-3">Телефон</h3>
            <a href="tel:+375172152276" class="contact-card__link text-esp-blue font-medium hover:text-esp-green transition-colors">
              +375 (17) 215-22-76
            </a>
            <p class="contact-card__desc text-sm text-esp-black/60 mt-2">Пн-Пт: 9:00 - 18:00</p>
          </div>
          
          <!-- Email -->
          <div class="contact-card bg-esp-gray/50 p-8 text-center hover:shadow-lg transition-all duration-300 animate-on-scroll" style="animation-delay: 0.1s">
            <div class="contact-card__icon w-16 h-16 mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" class="w-full h-full">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="contact-card__title text-lg font-semibold mb-3">Email</h3>
            <a href="mailto:info@ecoservisproekt.com" class="contact-card__link text-esp-blue font-medium hover:text-esp-green transition-colors break-all">
              info@ecoservisproekt.com
            </a>
            <p class="contact-card__desc text-sm text-esp-black/60 mt-2">Ответ в течение 24 часов</p>
          </div>
          
          <!-- Messengers -->
          <div class="contact-card bg-esp-gray/50 p-8 text-center hover:shadow-lg transition-all duration-300 animate-on-scroll" style="animation-delay: 0.2s">
            <div class="contact-card__icon w-16 h-16 mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" class="w-full h-full">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="contact-card__title text-lg font-semibold mb-3">Мессенджеры</h3>
            <div class="contact-card__links flex justify-center gap-3">
              <a href="https://t.me/ecoservisproekt" target="_blank" class="messenger-link w-12 h-12 rounded-full bg-[#229ED9] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
              <a href="https://wa.me/375291234567" target="_blank" class="messenger-link w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
            <p class="contact-card__desc text-sm text-esp-black/60 mt-3">Быстрая связь</p>
          </div>
          
          <!-- Address -->
          <div class="contact-card bg-esp-gray/50 p-8 text-center hover:shadow-lg transition-all duration-300 animate-on-scroll" style="animation-delay: 0.3s">
            <div class="contact-card__icon w-16 h-16 mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" class="w-full h-full">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="contact-card__title text-lg font-semibold mb-3">Адрес</h3>
            <p class="contact-card__desc text-esp-black/80">
              220076, г. Минск,<br>
              ул. Петра Мстиславца, 20,<br>
              пом. 236
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Personal Contacts Section (Desktop: Horizontal) -->
    <section class="section contact-personal-section bg-white">
      <div class="container">
        <h2 class="section__title text-center mb-12 animate-on-scroll">
          Персональные контакты
        </h2>
        <p class="section__subtitle text-center text-esp-black/70 mb-12 max-w-2xl mx-auto animate-on-scroll" style="animation-delay: 0.1s">
          Выберите направление для связи с профильным специалистом
        </p>
        
        <div class="personal-cards-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <!-- Director -->
          <div class="personal-card bg-esp-gray/50 p-6 shadow-lg hover:shadow-2xl transition-shadow animate-on-scroll">
            <div class="personal-card__avatar w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-esp-gray/30 mb-4 mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face" 
                alt="Алексей Громак"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="text-center">
              <h3 class="personal-card__name text-lg font-semibold mb-1">Алексей Громак</h3>
              <p class="personal-card__position text-sm text-esp-black/70 mb-3">Директор ESP</p>
              <div class="personal-card__contacts space-y-2">
                <a href="tel:+375172152276" class="personal-card__link flex items-center justify-center gap-2 text-sm text-esp-blue hover:text-esp-green transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  +375 (17) 215-22-76
                </a>
                <a href="mailto:d.zhabenko@ecoservisproekt.com" class="personal-card__link flex items-center justify-center gap-2 text-sm text-esp-blue hover:text-esp-green transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  d.zhabenko@ecoservisproekt.com
                </a>
              </div>
            </div>
          </div>
          
          <!-- Technical Support -->
          <div class="personal-card bg-esp-gray/50 p-6 shadow-lg hover:shadow-2xl transition-shadow animate-on-scroll" style="animation-delay: 0.1s">
            <div class="personal-card__avatar w-20 h-20 rounded-full bg-white flex-shrink-0 border border-esp-gray/30 mb-4 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" class="w-10 h-10 text-esp-blue">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="text-center">
              <h3 class="personal-card__name text-lg font-semibold mb-1">Техническая поддержка</h3>
              <p class="personal-card__position text-sm text-esp-black/70 mb-3">Инженеры 24/7</p>
              <div class="personal-card__contacts space-y-2">
                <a href="tel:+375172152276" class="personal-card__link flex items-center justify-center gap-2 text-sm text-esp-blue hover:text-esp-green transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  +375 (17) 215-22-76
                </a>
                <a href="mailto:support@ecoservisproekt.com" class="personal-card__link flex items-center justify-center gap-2 text-sm text-esp-blue hover:text-esp-green transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  support@ecoservisproekt.com
                </a>
                <p class="text-xs text-esp-black/60">🕒 Круглосуточно, без выходных</p>
              </div>
            </div>
          </div>
          
          <!-- HR Department -->
          <div class="personal-card bg-esp-gray/50 p-6 shadow-lg hover:shadow-2xl transition-shadow animate-on-scroll" style="animation-delay: 0.2s">
            <div class="personal-card__avatar w-20 h-20 rounded-full bg-white flex-shrink-0 border border-esp-gray/30 mb-4 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" class="w-10 h-10 text-esp-blue">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="text-center">
              <h3 class="personal-card__name text-lg font-semibold mb-1">HR-отдел</h3>
              <p class="personal-card__position text-sm text-esp-black/70 mb-3">Карьера и стажировки</p>
              <div class="personal-card__contacts space-y-2">
                <a href="mailto:hr@ecoservisproekt.com" class="personal-card__link flex items-center justify-center gap-2 text-sm text-esp-blue hover:text-esp-green transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  hr@ecoservisproekt.com
                </a>
                <p class="text-xs text-esp-black/60">🕒 Пн-Пт: 10:00 - 17:00</p>
              </div>
            </div>
          </div>
          
          <!-- Press Service -->
          <div class="personal-card bg-esp-gray/50 p-6 shadow-lg hover:shadow-2xl transition-shadow animate-on-scroll" style="animation-delay: 0.3s">
            <div class="personal-card__avatar w-20 h-20 rounded-full bg-white flex-shrink-0 border border-esp-gray/30 mb-4 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" class="w-10 h-10 text-esp-blue">
                <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="text-center">
              <h3 class="personal-card__name text-lg font-semibold mb-1">Пресс-служба</h3>
              <p class="personal-card__position text-sm text-esp-black/70 mb-3">СМИ и партнёрские запросы</p>
              <div class="personal-card__contacts space-y-2">
                <a href="mailto:press@ecoservisproekt.com" class="personal-card__link flex items-center justify-center gap-2 text-sm text-esp-blue hover:text-esp-green transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  press@ecoservisproekt.com
                </a>
              </div>
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
        <h2 class="section__title text-center mb-12 animate-on-scroll">
          Наши офисы
        </h2>
        
        <!-- Yandex Map - Always Visible -->
        <div class="map-wrapper overflow-hidden shadow-2xl animate-on-scroll mb-12">
          <div class="map-container relative w-full h-[500px]">
            <iframe 
              src="https://yandex.by/map-widget/v1/?um=constructor%3A0&amp;source=constructor&amp;center=27.6275%2C53.8751&amp;zoom=16&amp;pt=27.6275%2C53.8751%2Cpm2rdm" 
              width="100%" 
              height="500" 
              frameborder="0"
              class="w-full h-full"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        
        <!-- Office Details -->
        <div class="grid md:grid-cols-3 gap-6">
          <div class="office-card bg-esp-gray/50 p-6 text-center animate-on-scroll">
            <div class="w-12 h-12 mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" class="w-full h-full">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="office-card__title text-lg font-semibold mb-2">Головной офис</h3>
            <p class="office-card__address text-sm text-esp-black/70 mb-3">
              г. Минск, ул. Петра Мстиславца, 20, пом. 236
            </p>
            <p class="office-card__hours text-xs text-esp-black/60">
              Пн-Пт: 9:00 - 18:00
            </p>
          </div>
          
          <div class="office-card bg-esp-gray/50 p-6 text-center animate-on-scroll" style="animation-delay: 0.1s">
            <div class="w-12 h-12 mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" class="w-full h-full">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="office-card__title text-lg font-semibold mb-2">Производство</h3>
            <p class="office-card__address text-sm text-esp-black/70 mb-3">
              г. Заславль, производственная зона
            </p>
            <p class="office-card__hours text-xs text-esp-black/60">
              По предварительной записи
            </p>
          </div>
          
          <div class="office-card bg-esp-gray/50 p-6 text-center animate-on-scroll" style="animation-delay: 0.2s">
            <div class="w-12 h-12 mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" class="w-full h-full">
                <circle cx="12" cy="12" r="10" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="2" y1="12" x2="22" y2="12" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#002366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="office-card__title text-lg font-semibold mb-2">Проекты worldwide</h3>
            <p class="office-card__address text-sm text-esp-black/70 mb-3">
              Беларусь, СНГ, Европа
            </p>
            <p class="office-card__hours text-xs text-esp-black/60">
              Выезд на объект по договорённости
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta relative overflow-hidden" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full" style="background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%); animation: rotate 20s linear infinite" />
      </div>
      
      <div class="container relative z-10 text-center text-white">
        <h2 class="cta__title mb-6 animate-on-scroll">Готовы начать проект?</h2>
        <p class="cta__desc text-lg opacity-95 mb-10 max-w-2xl mx-auto animate-on-scroll">
          Запланируйте встречу с нашим специалистом — обсудим детали и подготовим индивидуальное решение
        </p>
        <div class="cta__actions flex flex-wrap justify-center gap-4 animate-on-scroll">
          <a href="#contact-form" class="btn btn--cta-primary btn--lg">
            📅 Запланировать встречу
          </a>
          <RouterLink to="/about" class="btn btn--cta-outline btn--lg">
            Узнать о компании
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

useHead({
  title: 'Контакты ESP | Начните диалог с EcoServiceProject',
  meta: [
    {
      name: 'description',
      content: 'Контакты EcoServiceProject: +375 (17) 215-22-76, info@ecoservisproekt.com. Минск, ул. Петра Мстиславца, 20, пом. 236. Запросите консультацию инженера.'
    }
  ]
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
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .personal-cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.personal-card {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.personal-card:hover {
  border-color: rgba(0, 96, 57, 0.2);
}

.personal-card__avatar {
  flex-shrink: 0;
}

.personal-card__avatar img {
  display: block;
}

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
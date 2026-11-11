<template>
  <div class="lg">
    <section class="lg-sec">
      <div class="dj-wrap lg-wrap">
        <span class="dj-eyebrow">Правовая информация</span>
        <h1 class="dj-h1 lg-title">Политика конфиденциальности</h1>
        <p class="dj-lede lg-lede">Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта ESP (ЭкоСервисПроект) и меры по обеспечению их безопасности.</p>
      </div>
      <div class="dj-wrap lg-wrap lg-body">
        <h2>1. Сбор персональных данных</h2>
        <p>Мы собираем персональные данные, которые вы добровольно предоставляете при заполнении форм обратной связи: имя, телефон, электронная почта, сообщение. Данные используются исключительно для обработки вашего запроса и связи с вами.</p>

        <h2>2. Использование данных</h2>
        <p>Персональные данные используются для: обработки заявок на консультацию, подготовки коммерческих предложений, отправки технической документации и BIM-моделей по запросу, информирования о статусе проекта.</p>

        <h2>3. Защита данных</h2>
        <p>ESP принимает необходимые организационные и технические меры для защиты персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>

        <h2>4. Передача третьим лицам</h2>
        <p>Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Республики Беларусь.</p>

        <h2>5. Файлы cookie</h2>
        <p>Сайт использует cookie-файлы для улучшения работы и аналитики посещаемости. Продолжая использовать сайт, вы соглашаетесь с использованием cookie.</p>

        <h2>6. Контакты</h2>
        <p>По вопросам обработки персональных данных обращайтесь по адресу: <a href="mailto:info@ecoservisproekt.com" class="lg-link">info@ecoservisproekt.com</a></p>

        <p class="lg-note">Редакция от 2026 года. ESP (ЭкоСервисПроект) оставляет за собой право вносить изменения в настоящую Политику.</p>

      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Политика конфиденциальности | ESP',
  meta: [
    { name: 'description', content: 'Политика конфиденциальности и обработки персональных данных ЭкоСервисПроект (ESP).' }
  ]
})
</script>

<style scoped>
/* Apple Legal: узкая колонка 17/25, заголовки разделов 32/36, без линеек */
.lg-sec { padding: clamp(56px, 7vw, 100px) 0 clamp(72px, 8vw, 120px); }
.lg-wrap { max-width: 740px; }
.lg-title { margin-top: 8px; font-size: clamp(40px, 4.4vw, 56px); line-height: 1.07; letter-spacing: -0.005em; overflow-wrap: break-word; hyphens: auto; }
.lg-lede { margin-top: 18px; }
.lg-body { margin-top: clamp(40px, 5vw, 64px); }
.lg-body h2 { margin: 52px 0 14px; font-size: clamp(24px, 2.4vw, 32px); font-weight: 600; line-height: 1.125; letter-spacing: 0.004em; color: var(--dj-ink); }
.lg-body h2:first-child { margin-top: 0; }
.lg-body p, .lg-body li { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: var(--dj-ink); }
.lg-body p + p { margin-top: 14px; }
.lg-link { color: #002366; overflow-wrap: anywhere; }
.lg-link:hover { text-decoration: underline; }
.lg-body p.lg-note { margin-top: 56px; padding-top: 20px; border-top: 1px solid #D6D6D6; font-size: 12px; line-height: 1.34; letter-spacing: -0.01em; color: #5E5E5E; }
.lg-body p.lg-note .lg-link { font-size: inherit; }
</style>

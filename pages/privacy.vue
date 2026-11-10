<template>
  <div class="lg">
    <section class="lg-sec">
      <div class="dj-wrap lg-wrap">
        <span class="dj-eyebrow">Правовая информация</span>
        <h1 class="dj-h1 lg-title">Политика конфиденциальности</h1>
        <p class="dj-lede lg-lede">Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта ESP (EcoServiceProject) и меры по обеспечению их безопасности.</p>
      </div>
      <div class="dj-wrap lg-wrap lg-body">
        <h2>1. Сбор персональных данных</h2>
        <p>Мы собираем персональные данные, которые вы добровольно предоставляете при заполнении форм обратной связи: имя, телефон, email, сообщение. Данные используются исключительно для обработки вашего запроса и связи с вами.</p>

        <h2>2. Использование данных</h2>
        <p>Персональные данные используются для: обработки заявок на консультацию, подготовки коммерческих предложений, отправки технической документации и BIM-моделей по запросу, информирования о статусе проекта.</p>

        <h2>3. Защита данных</h2>
        <p>ESP принимает необходимые организационные и технические меры для защиты персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>

        <h2>4. Передача третьим лицам</h2>
        <p>Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Республики Беларусь.</p>

        <h2>5. Файлы cookie</h2>
        <p>Сайт использует cookie-файлы для улучшения работы и аналитики посещаемости. Продолжая использовать сайт, вы соглашаетесь с использованием cookie.</p>

        <h2>6. Контакты</h2>
        <p>По вопросам обработки персональных данных обращайтесь по адресу: <a href="mailto:info@ecoservisproekt.com" class="lg-link">info@ecoservisproekt.com</a></p>

        <p class="lg-note">Редакция от 2026 года. ESP (EcoServiceProject) оставляет за собой право вносить изменения в настоящую Политику.</p>

      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Политика конфиденциальности | ESP',
  meta: [
    { name: 'description', content: 'Политика конфиденциальности и обработки персональных данных EcoServiceProject (ESP).' }
  ]
})
</script>

<style scoped>
.lg-sec { padding: clamp(48px, 7vw, 96px) 0 clamp(64px, 8vw, 104px); }
.lg-wrap { max-width: 760px; }
.lg-title { margin-top: 10px; overflow-wrap: break-word; hyphens: auto; }
.lg-lede { margin-top: 16px; }
.lg-body { margin-top: clamp(32px, 4vw, 48px); }
.lg-body h2 { margin: 40px 0 10px; padding-top: 24px; border-top: 1px solid var(--dj-line); font-size: clamp(20px, 1.8vw, 24px); font-weight: 600; line-height: 1.25; letter-spacing: -0.015em; color: var(--dj-ink); }
.lg-body h2:first-child { margin-top: 0; }
.lg-body p, .lg-body li { font-size: 17px; line-height: 1.65; color: var(--dj-text); }
.lg-link { color: var(--dj-link); overflow-wrap: anywhere; }
.lg-link:hover { text-decoration: underline; }
.lg-body p.lg-note { margin-top: 48px; padding: 16px 20px; background: var(--dj-soft); font-size: 13px; line-height: 1.5; color: var(--dj-muted); }
@media (max-width: 479px) { .lg-title { font-size: 30px; } }
</style>

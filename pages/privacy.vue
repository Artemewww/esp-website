<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first ap-sec--white">
      <div class="ap-wrap lg-wrap">
        <span class="ap-eyebrow">Правовая информация</span>
        <h1 class="ap-title lg-title">Политика конфиденциальности</h1>
        <p class="ap-lede">Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта ESP (EcoServiceProject) и меры по обеспечению их безопасности.</p>
      </div>
      <div class="ap-wrap lg-wrap lg-body">
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
        <p>По вопросам обработки персональных данных обращайтесь по адресу: <a href="mailto:info@ecoservisproekt.com" class="ap-link">info@ecoservisproekt.com</a></p>

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
.lg-wrap { max-width: 44rem; }
.lg-title { font-size: clamp(1.75rem, 7.5vw, 3.3rem); overflow-wrap: break-word; hyphens: auto; }
.lg-body { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--ap-line); }
.lg-body h2 { margin: 2.4rem 0 0.7rem; font-size: 1.4rem; font-weight: 600; line-height: 1.25; letter-spacing: -0.015em; color: var(--ap-ink); }
.lg-body h2:first-child { margin-top: 0; }
.lg-body p { font-size: 16px; line-height: 1.6; color: var(--ap-muted); }
.lg-body .ap-link { font-size: inherit; white-space: normal; overflow-wrap: anywhere; }
.lg-body p.lg-note { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--ap-line); font-size: 13px; }
</style>

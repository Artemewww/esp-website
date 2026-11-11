<template>
  <div class="lg">
    <section class="lg-sec">
      <div class="dj-wrap lg-wrap">
        <span class="dj-eyebrow">Правовая информация</span>
        <h1 class="dj-h1 lg-title">Условия использования</h1>
        <p class="dj-lede lg-lede">Используя сайт ESP (EcoServiceProject), вы соглашаетесь с настоящими условиями использования.</p>
      </div>
      <div class="dj-wrap lg-wrap lg-body">
        <h2>1. Общие положения</h2>
        <p>Сайт ecoservisproekt.com (ESP) предоставляет информацию об услугах, оборудовании и проектах компании. Вся информация на сайте носит справочный характер и не является публичной офертой.</p>

        <h2>2. Интеллектуальная собственность</h2>
        <p>Все материалы сайта (тексты, изображения, логотипы, схемы, BIM/CAD модели) являются собственностью ESP и защищены законодательством об интеллектуальной собственности. Копирование и использование без письменного разрешения запрещено.</p>

        <h2>3. BIM/CAD модели</h2>
        <p>BIM/CAD модели оборудования предоставляются индивидуально по запросу проектировщикам и партнёрам ESP. Использование моделей допускается исключительно в рамках проектирования объектов с применением оборудования ESP.</p>

        <h2>4. Техническая документация</h2>
        <p>Опросные листы, инструкции по монтажу и эксплуатации предоставляются для ознакомления и использования при проектировании. Перед применением рекомендуется уточнить актуальность документов у инженеров ESP.</p>

        <h2>5. Ограничение ответственности</h2>
        <p>ESP не несёт ответственности за ущерб, возникший в результате использования информации с сайта без согласования с техническими специалистами компании.</p>

        <h2>6. Изменения условий</h2>
        <p>ESP оставляет за собой право изменять настоящие условия использования в любое время без предварительного уведомления.</p>

        <p class="lg-note">Редакция от 2026 года. По всем вопросам обращайтесь: <a href="mailto:info@ecoservisproekt.com" class="lg-link">info@ecoservisproekt.com</a></p>

      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Условия использования | ESP',
  meta: [
    { name: 'description', content: 'Условия использования сайта EcoServiceProject (ESP): права на контент, BIM/CAD модели, техническую документацию.' }
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
.lg-link { color: #0066cc; overflow-wrap: anywhere; }
.lg-link:hover { text-decoration: underline; }
.lg-body p.lg-note { margin-top: 56px; padding-top: 20px; border-top: 1px solid #d2d2d7; font-size: 12px; line-height: 1.34; letter-spacing: -0.01em; color: #6e6e73; }
.lg-body p.lg-note .lg-link { font-size: inherit; }
</style>

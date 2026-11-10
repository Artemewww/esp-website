<template>
  <div class="lg">
    <section class="lg-sec">
      <div class="dj-wrap lg-wrap">
        <span class="dj-eyebrow">Правовая информация</span>
        <h1 class="dj-h1 lg-title">Условия использования</h1>
        <p class="dj-lede lg-lede">Используя сайт ESP (EcoServiceProject), вы соглашаетесь с настоящими условиями использования.</p>
      </div>
      <div class="dj-wrap lg-wrap lg-body">
        <h2>1. Общие положения</h2>
        <p>Сайт ecoservisproekt.com (ESP) предоставляет информацию об услугах, оборудовании и проектах компании. Вся информация на сайте носит справочный характер и не является публичной офертой.</p>

        <h2>2. Интеллектуальная собственность</h2>
        <p>Все материалы сайта (тексты, изображения, логотипы, схемы, BIM/CAD модели) являются собственностью ESP и защищены законодательством об интеллектуальной собственности. Копирование и использование без письменного разрешения запрещено.</p>

        <h2>3. BIM/CAD модели</h2>
        <p>BIM/CAD модели оборудования предоставляются индивидуально по запросу проектировщикам и партнёрам ESP. Использование моделей допускается исключительно в рамках проектирования объектов с применением оборудования ESP.</p>

        <h2>4. Техническая документация</h2>
        <p>Опросные листы, инструкции по монтажу и эксплуатации предоставляются для ознакомления и использования при проектировании. Перед применением рекомендуется уточнить актуальность документов у инженеров ESP.</p>

        <h2>5. Ограничение ответственности</h2>
        <p>ESP не несёт ответственности за ущерб, возникший в результате использования информации с сайта без согласования с техническими специалистами компании.</p>

        <h2>6. Изменения условий</h2>
        <p>ESP оставляет за собой право изменять настоящие условия использования в любое время без предварительного уведомления.</p>

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

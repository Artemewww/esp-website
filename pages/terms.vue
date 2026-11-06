<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first ap-sec--white">
      <div class="ap-wrap lg-wrap">
        <span class="ap-eyebrow">Правовая информация</span>
        <h1 class="ap-title lg-title">Условия использования</h1>
        <p class="ap-lede">Используя сайт ESP (EcoServiceProject), вы соглашаетесь с настоящими условиями использования.</p>
      </div>
      <div class="ap-wrap lg-wrap lg-body">
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

        <p class="lg-note">Редакция от 2026 года. По всем вопросам обращайтесь: <a href="mailto:info@ecoservisproekt.com" class="ap-link">info@ecoservisproekt.com</a></p>

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
.lg-wrap { max-width: 44rem; }
.lg-title { font-size: clamp(1.75rem, 7.5vw, 3.3rem); overflow-wrap: break-word; hyphens: auto; }
.lg-body { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--ap-line); }
.lg-body h2 { margin: 2.4rem 0 0.7rem; font-size: 1.4rem; font-weight: 600; line-height: 1.25; letter-spacing: -0.015em; color: var(--ap-ink); }
.lg-body h2:first-child { margin-top: 0; }
.lg-body p { font-size: 16px; line-height: 1.6; color: var(--ap-muted); }
.lg-body .ap-link { font-size: inherit; white-space: normal; overflow-wrap: anywhere; }
.lg-body p.lg-note { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--ap-line); font-size: 13px; }
</style>

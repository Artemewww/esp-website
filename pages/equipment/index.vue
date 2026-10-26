<template>
  <div>
    <PageHero
      kicker="Каталог оборудования"
      title="Каталог оборудования ESP"
      lede="Собственное производство ESP: флотационные установки, станции дозирования реагентов, механическая очистка и обезвоживание осадка. Подберём оборудование под состав ваших сточных вод."
    >
      <div class="flex flex-wrap gap-4">
        <a href="#catalog" class="ph-btn ph-btn--primary">Перейти к каталогу</a>
        <NuxtLink to="/contacts#contact-form" class="ph-btn ph-btn--ghost">Запросить КП</NuxtLink>
      </div>
    </PageHero>

    <!-- Производитель и цифры — светлой полосой под тёмной шапкой -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="mb-12 max-w-2xl">
          <div class="relative p-6 flex items-center gap-5 border border-esp-gray bg-esp-gray/40">
            <SpinningBadge :size="120" text="ESP • ПРОИЗВОДСТВО • КАЧЕСТВО • " class="hidden sm:flex text-esp-blue">
              <span class="text-sm font-bold text-esp-black font-rounded text-center leading-tight">5 лет<br /><span class="text-xs font-normal text-esp-black/60">гарантии</span></span>
            </SpinningBadge>
            <div class="min-w-0">
              <img src="/logo-esp.svg" alt="ESP" class="h-14 w-auto mb-2" />
              <p class="font-rounded font-semibold text-esp-black mb-1">Производитель — ESP</p>
              <p class="text-esp-black/60 text-sm leading-snug">Производственная база ESP: полный цикл на собственных мощностях, 100% контроль качества на каждом узле.</p>
            </div>
          </div>
        </div>

        <!-- Stats bar: светлый фон, синие цифры -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-esp-gray pt-10">
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">5 лет</div>
            <p class="text-esp-black/60 text-sm">Гарантии на оборудование</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">4 часа</div>
            <p class="text-esp-black/60 text-sm">Время реакции сервисной службы</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">100%</div>
            <p class="text-esp-black/60 text-sm">Оборудования с BIM-моделью</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">24 часа</div>
            <p class="text-esp-black/60 text-sm">На подготовку коммерческого предложения</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Наша продукция: чистая сетка, фото на белом -->
    <section id="catalog" class="section-padding bg-esp-gray" style="scroll-margin-top: 100px;">
      <!-- Старые якоря (#tools, #specs, #filters, #pumps) ведут сюда же -->
      <span id="tools" class="eq-anchor" aria-hidden="true"></span>
      <span id="specs" class="eq-anchor" aria-hidden="true"></span>
      <span id="filters" class="eq-anchor" aria-hidden="true"></span>
      <span id="pumps" class="eq-anchor" aria-hidden="true"></span>
      <div class="container-custom">
        <div class="mb-8 md:mb-10 max-w-2xl">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Наша продукция</h2>
          <p class="text-esp-black/70">Оборудование для очистки хозяйственно-бытовых, производственных и ливневых сточных вод. Откройте карточку, чтобы посмотреть описание и характеристики.</p>
        </div>

        <ul class="eq-grid">
          <li v-for="product in equipment" :key="product.slug">
            <NuxtLink :to="`/equipment/${product.slug}`" class="eq-card group">
              <span class="eq-card__media">
                <img :src="product.photo" :alt="product.name" loading="lazy" class="eq-card__img" />
              </span>
              <span class="eq-card__body">
                <span class="eq-card__title font-rounded">{{ product.name }}</span>
                <svg class="eq-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Service & Support -->
    <section id="support" class="section-padding bg-esp-black text-white" style="scroll-margin-top: 100px;">
      <div id="docs" style="scroll-margin-top: 100px;"></div>
      <div id="parts" style="scroll-margin-top: 100px;"></div>
      <div class="container-custom">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 font-inter">
              Сервис и поддержка
            </span>
            <h2 class="font-rounded text-3xl md:text-4xl mb-6">
              Оборудование ESP — это не покупка. Это партнёрство на весь жизненный цикл.
            </h2>
            <p class="text-white/80 text-lg mb-8">
              Каждая единица поставляется с полным пакетом документации, гарантийными обязательствами и доступом к инженерной поддержке 24/7.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-5">
            <div class="flex gap-5 bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
              <div class="w-12 h-12 bg-esp-green flex-shrink-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-rounded text-lg font-semibold mb-1">Гарантия до 5 лет</h3>
                <p class="text-white/70 text-sm">Расширенная гарантия на всё оборудование ESP. SLA реакции — 4 часа. Устранение неисправностей без доп. платы.</p>
              </div>
            </div>

            <div class="flex gap-5 bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
              <div class="w-12 h-12 bg-esp-blue flex-shrink-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <div>
                <h3 class="font-rounded text-lg font-semibold mb-1">Склады запасных частей</h3>
                <p class="text-white/70 text-sm">Складская программа ESP — 98% запчастей в наличии. Поставка по Беларуси и СНГ в течение 24–48 часов.</p>
              </div>
            </div>

            <div class="flex gap-5 bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
              <div class="w-12 h-12 bg-white/10 flex-shrink-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div>
                <h3 class="font-rounded text-lg font-semibold mb-1">Техническая документация</h3>
                <p class="text-white/70 text-sm">Полный пакет: исполнительные чертежи, схемы автоматизации, паспорта оборудования, инструкции по эксплуатации.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-4">Получите персональное КП за 24 часа</h2>
        <p class="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
          Прикрепите ТЗ или параметры сточных вод. Инженер ESP свяжется для уточнения деталей и подготовит расчёт.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/contacts#contact-form" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition">
            Запросить КП
          </NuxtLink>
          <NuxtLink to="/contacts" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition">
            Связаться с инженером
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { equipment } = useEquipment()

// og-картинки лежат в этом проекте: origin берём из runtimeConfig,
// чтобы смена домена правилась в одном месте.
const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead({
  title: 'Оборудование ESP | Каталог оборудования для очистки сточных вод',
  meta: [
    {
      name: 'description',
      content: 'Каталог оборудования ЭкоСервисПроект: флотационные установки, КНС, станции биологической очистки, микрофильтры, ленточные фильтр-прессы, станции дозирования реагентов. Гарантия 5 лет.'
    },
    { property: 'og:title', content: 'Оборудование ESP | Каталог оборудования для очистки сточных вод' },
    { property: 'og:description', content: 'Флотационные установки, КНС, станции очистки, фильтры и станции дозирования собственного производства ESP. Гарантия 5 лет.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/equipment' }]
})
</script>

<style scoped>
#catalog { position: relative; }
.eq-anchor { position: absolute; top: 0; scroll-margin-top: 100px; }

.eq-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
@media (min-width: 768px) {
  .eq-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
}
@media (min-width: 1200px) {
  .eq-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
}

.eq-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border: 1px solid transparent;
  transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
}
.eq-card:hover,
.eq-card:focus-visible {
  border-color: rgba(0, 35, 102, .25);
  box-shadow: 0 12px 32px -16px rgba(26, 26, 26, .25);
  transform: translateY(-2px);
}
.eq-card__media {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  padding: 14px;
  background: #fff;
  overflow: hidden;
}
@media (min-width: 768px) { .eq-card__media { padding: 22px; } }
.eq-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform .5s ease;
}
.eq-card:hover .eq-card__img { transform: scale(1.04); }
.eq-card__body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px 16px;
}
@media (min-width: 768px) { .eq-card__body { padding: 14px 20px 20px; } }
.eq-card__title {
  font-size: 14px;
  line-height: 1.3;
  font-weight: 600;
  color: #1A1A1A;
  overflow-wrap: anywhere;
}
@media (min-width: 768px) { .eq-card__title { font-size: 16px; } }
.eq-card__arrow {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  color: #002366;
  transition: transform .25s ease;
}
.eq-card:hover .eq-card__arrow { transform: translateX(3px); }
</style>

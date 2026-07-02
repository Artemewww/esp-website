<template>
  <div class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Предложения о сотрудничестве' }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Развитие сети
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">Предложения о сотрудничестве</h1>
        <p class="text-xl text-esp-black/70 max-w-3xl mb-16">
          ESP приглашает проектные организации и региональных представителей к расширению дилерской сети оборудования для очистки сточных вод.
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <!-- Project organizations -->
          <div class="bg-esp-gray p-8">
            <div class="w-14 h-14 bg-esp-blue/10 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-esp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
              </svg>
            </div>
            <h2 class="font-rounded text-xl font-semibold mb-4 text-esp-black">Проектным организациям и архитектурным бюро</h2>
            <p class="text-esp-black/70 text-sm mb-4">
              Приглашаем к сотрудничеству коллег из проектных организаций и архитектурных бюро. Сотрудничая с нами, вы можете быть уверены в многократно проверенных практикой технологиях и оборудовании.
            </p>
            <ul class="space-y-3 text-sm text-esp-black/70 mb-4">
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Выполнение отдельных разделов проекта</li>
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Подготовка технических предложений по нашей линейке оборудования</li>
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Инженерное сопровождение на стадии проектирования и экспертизы</li>
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Сбор исходных данных и выполнение технических условий заказчика</li>
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Передача готовых разделов проекта — комплектов чертежей и пояснительных записок</li>
            </ul>
            <NuxtLink to="/about/documentation" class="text-esp-blue text-sm font-medium hover:underline">Технические характеристики оборудования (ДС, ВС, ОРЛ, насосные станции, жироуловители) →</NuxtLink>
          </div>

          <!-- Dealers -->
          <div class="bg-esp-gray p-8">
            <div class="w-14 h-14 bg-esp-green/10 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-esp-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 3c0-1.657-1.343-3-3-3H9c-1.657 0-3 1.343-3 3v2h12v-2z"/>
              </svg>
            </div>
            <h2 class="font-rounded text-xl font-semibold mb-4 text-esp-black">Дилерам и региональным представителям</h2>
            <p class="text-esp-black/70 text-sm mb-4">
              Ищем представителей в регионах Беларуси, а также готовых представлять интересы ESP в других странах.
            </p>
            <ul class="space-y-3 text-sm text-esp-black/70">
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Широкий ассортимент оборудования</li>
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Выгодные условия сотрудничества</li>
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Возможность рассрочки платежа</li>
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Полная информационная и гарантийная поддержка</li>
            </ul>
          </div>
        </div>

        <!-- Contact + form -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 class="font-rounded text-2xl mb-4 text-esp-black">Как начать сотрудничество</h3>
            <p class="text-esp-black/70 mb-6">
              Для получения дилерского прайс-листа отправьте запрос через форму или контакты, указав краткую информацию о вашей компании.
            </p>
            <div class="space-y-3 text-sm">
              <a href="tel:+375291656061" class="flex items-center gap-3 text-esp-black hover:text-esp-blue transition">
                <Icon name="phone" cls="w-4 h-4 text-esp-blue flex-shrink-0" /> +375 29 165-60-61
              </a>
              <div class="flex items-center gap-3 text-esp-black">
                <Icon name="pin" cls="w-4 h-4 text-esp-blue flex-shrink-0" /> 220076, г. Минск, ул. Петра Мстиславца, д. 20, офис 236
              </div>
            </div>
          </div>

          <div class="bg-esp-gray p-8">
            <div v-if="sent" class="p-5 bg-esp-green/10 border border-esp-green text-esp-green text-center font-medium">
              Заявка отправлена. Мы свяжемся с вами в ближайшее время.
            </div>
            <form v-else @submit.prevent="sent = true" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Ваше имя" class="border border-esp-black/20 p-3 bg-white font-inter" />
                <input required placeholder="Компания" class="border border-esp-black/20 p-3 bg-white font-inter" />
              </div>
              <input required type="email" placeholder="E-mail" class="w-full border border-esp-black/20 p-3 bg-white font-inter" />
              <select v-model="cooperationType" class="w-full border border-esp-black/20 p-3 bg-white font-inter">
                <option value="dealer">Дилерство / региональное представительство</option>
                <option value="project">Проектная организация</option>
                <option value="other">Другое</option>
              </select>
              <textarea rows="3" placeholder="Кратко о компании" class="w-full border border-esp-black/20 p-3 bg-white font-inter"></textarea>
              <button type="submit" class="w-full btn-primary">Отправить заявку</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const sent = ref(false)
const cooperationType = ref('dealer')

useHead({
  title: 'Предложения о сотрудничестве | ESP',
  meta: [
    { name: 'description', content: 'ESP приглашает проектные организации и дилеров к сотрудничеству по всей Беларуси и за рубежом.' }
  ]
})
</script>

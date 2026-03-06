<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <h1 class="font-rounded text-5xl md:text-6xl mb-6 text-esp-black">
          Контакты
        </h1>
        <p class="text-xl text-esp-black max-w-3xl">
          Готовы обсудить инженерную задачу? Свяжитесь с нами для технического аудита.
        </p>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Form -->
          <div class="bg-white p-8 rounded-none">
            <h2 class="font-rounded text-2xl mb-6 text-esp-black">Заказать технический аудит</h2>
            <form @submit.prevent="submitForm" class="space-y-6">
              <div>
                <label class="block text-esp-black mb-2">Тип объекта</label>
                <select v-model="form.type" class="w-full border border-esp-gray p-4 rounded-none focus:border-esp-blue focus:outline-none">
                  <option value="">Выберите тип</option>
                  <option value="water">Водоканал / ЖКХ</option>
                  <option value="apk">Агропромышленный комплекс</option>
                  <option value="industry">Промышленное предприятие</option>
                </select>
              </div>
              <div>
                <label class="block text-esp-black mb-2">Текущая проблема</label>
                <textarea v-model="form.problem" rows="4" class="w-full border border-esp-gray p-4 rounded-none focus:border-esp-blue focus:outline-none" placeholder="Опишите задачу..."></textarea>
              </div>
              <div>
                <label class="block text-esp-black mb-2">ФИО</label>
                <input v-model="form.name" type="text" class="w-full border border-esp-gray p-4 rounded-none focus:border-esp-blue focus:outline-none" placeholder="Иван Иванов" />
              </div>
              <div>
                <label class="block text-esp-black mb-2">Телефон</label>
                <input v-model="form.phone" type="tel" class="w-full border border-esp-gray p-4 rounded-none focus:border-esp-blue focus:outline-none" placeholder="+375 (XX) XXX-XX-XX" />
              </div>
              <div>
                <label class="block text-esp-black mb-2">Email</label>
                <input v-model="form.email" type="email" class="w-full border border-esp-gray p-4 rounded-none focus:border-esp-blue focus:outline-none" placeholder="email@example.com" />
              </div>
              <button type="submit" class="btn-primary w-full">
                Отправить заявку
              </button>
            </form>
          </div>

          <!-- Contact Info -->
          <div>
            <h2 class="font-rounded text-2xl mb-6 text-esp-black">Контактная информация</h2>
            <div class="space-y-6 mb-8">
              <div>
                <h3 class="font-rounded text-lg mb-2 text-esp-blue">Адрес</h3>
                <p class="text-esp-black">220076, г. Минск, ул. Петра Мстиславца, д.20, п.236</p>
              </div>
              <div>
                <h3 class="font-rounded text-lg mb-2 text-esp-blue">Телефоны</h3>
                <p class="text-esp-black">Приемная: <a href="tel:+375172381141" class="hover:text-esp-blue">+375 (17) 238-11-41</a></p>
                <p class="text-esp-black">Мобильный: <a href="tel:+375291656061" class="hover:text-esp-blue">+375 (29) 165-60-61</a></p>
                <p class="text-esp-black">Проектный отдел: <a href="tel:+375172381144" class="hover:text-esp-blue">+375 (17) 238-11-44</a></p>
              </div>
              <div>
                <h3 class="font-rounded text-lg mb-2 text-esp-blue">Email</h3>
                <p class="text-esp-black"><a href="mailto:ecoservisproekt@mail.ru" class="hover:text-esp-blue">ecoservisproekt@mail.ru</a></p>
              </div>
            </div>

            <!-- Map Placeholder -->
            <div class="h-64 bg-esp-black rounded-none flex items-center justify-center">
              <span class="text-white">Interactive Map (Yandex/Google)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  type: '',
  problem: '',
  name: '',
  phone: '',
  email: ''
})

const submitForm = () => {
  // Handle form submission
  console.log('Form submitted:', form)
  alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.')
}
</script>
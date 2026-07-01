<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-12">
    <!-- Left visual panel -->
    <div class="hidden lg:flex lg:col-span-5 text-white p-12 flex-col justify-between relative overflow-hidden" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <span class="text-xs uppercase font-inter tracking-widest text-esp-lidar font-semibold">ESP // Портал партнёра</span>

      <div class="space-y-6">
        <h2 class="font-rounded text-3xl">Проектируем экосистемы будущего</h2>
        <p class="text-white/80">
          Единый доступ к калькуляторам, BIM/CAD-каталогу и проектной аналитике для клиентов и партнёров ESP.
        </p>
        <div class="border border-white/20 bg-white/5 p-5 space-y-3 font-mono text-xs">
          <div class="flex justify-between border-b border-white/10 pb-2"><span>Мембранный модуль</span><span class="text-white font-semibold">ОНЛАЙН</span></div>
          <div class="flex justify-between border-b border-white/10 pb-2"><span>Лидарное сканирование</span><span class="text-white font-semibold">АКТИВНО</span></div>
          <div class="flex justify-between"><span>SCADA-интеграция</span><span class="text-esp-lidar font-semibold">ПОДКЛЮЧЕНО</span></div>
        </div>
      </div>

      <div class="flex justify-between text-xs text-white/50">
        <span>© 2007–2026 ЭкоСервисПроект</span>
        <span>ISO 9001:2015</span>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-16 bg-esp-gray">
      <div class="w-full max-w-md bg-white border border-esp-black p-8 md:p-10">
        <div class="flex border-b border-esp-gray mb-8 text-sm font-medium">
          <button
            @click="tab = 'login'"
            class="flex-1 pb-3 text-center border-b-2 transition"
            :class="tab === 'login' ? 'border-esp-green text-esp-green' : 'border-transparent text-esp-black/40 hover:text-esp-black'"
          >Вход</button>
          <button
            @click="tab = 'register'"
            class="flex-1 pb-3 text-center border-b-2 transition"
            :class="tab === 'register' ? 'border-esp-green text-esp-green' : 'border-transparent text-esp-black/40 hover:text-esp-black'"
          >Регистрация</button>
        </div>

        <div v-if="tab === 'login'">
          <h1 class="font-rounded text-2xl mb-1 text-esp-black">Добро пожаловать</h1>
          <p class="text-esp-black/50 text-sm mb-6">Вход в личный кабинет партнёра ESP</p>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase text-esp-black/60 mb-1">E-mail или телефон</label>
              <input v-model="loginForm.email" type="text" required placeholder="engineer@company.com" class="w-full bg-esp-gray border border-esp-black/20 p-3 font-inter focus:outline-none focus:border-esp-blue" />
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-xs font-semibold uppercase text-esp-black/60">Пароль</label>
                <button type="button" @click="tab = 'recover'" class="text-xs text-esp-green hover:underline">Забыли пароль?</button>
              </div>
              <input v-model="loginForm.password" type="password" required placeholder="••••••••" class="w-full bg-esp-gray border border-esp-black/20 p-3 font-inter focus:outline-none focus:border-esp-blue" />
            </div>
            <button type="submit" class="w-full btn-primary justify-center" :disabled="submitting">
              {{ submitting ? 'Проверка...' : 'Войти' }}
            </button>
          </form>
        </div>

        <div v-else-if="tab === 'register'">
          <h1 class="font-rounded text-2xl mb-1 text-esp-black">Создать аккаунт</h1>
          <p class="text-esp-black/50 text-sm mb-6">Заявка на регистрацию в экосистеме ESP</p>

          <div v-if="registerSuccess" class="p-6 bg-esp-green/10 border border-esp-green text-center text-sm text-esp-green">
            Запрос принят. Письмо с подтверждением направлено на вашу почту.
          </div>
          <form v-else @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase text-esp-black/60 mb-1">ФИО</label>
              <input v-model="regForm.name" type="text" required class="w-full bg-esp-gray border border-esp-black/20 p-3 font-inter focus:outline-none focus:border-esp-blue" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-esp-black/60 mb-1">Компания</label>
              <input v-model="regForm.company" type="text" required class="w-full bg-esp-gray border border-esp-black/20 p-3 font-inter focus:outline-none focus:border-esp-blue" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-esp-black/60 mb-1">Рабочий e-mail</label>
              <input v-model="regForm.email" type="email" required class="w-full bg-esp-gray border border-esp-black/20 p-3 font-inter focus:outline-none focus:border-esp-blue" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-esp-black/60 mb-1">Пароль</label>
              <input v-model="regForm.password" type="password" required class="w-full bg-esp-gray border border-esp-black/20 p-3 font-inter focus:outline-none focus:border-esp-blue" />
            </div>
            <label class="flex items-start gap-2 text-xs text-esp-black/60">
              <input v-model="regForm.agreed" type="checkbox" required class="mt-0.5" />
              <span>Согласен на обработку персональных данных в соответствии с политикой конфиденциальности</span>
            </label>
            <button type="submit" class="w-full btn-primary justify-center" :disabled="submitting">
              {{ submitting ? 'Отправка...' : 'Зарегистрироваться' }}
            </button>
          </form>
        </div>

        <div v-else>
          <button @click="tab = 'login'" class="text-esp-black/50 text-sm mb-4 hover:text-esp-black">← Назад ко входу</button>
          <h1 class="font-rounded text-2xl mb-1 text-esp-black">Сброс пароля</h1>
          <p class="text-esp-black/50 text-sm mb-6">Восстановление доступа к личному кабинету</p>

          <div v-if="recoverSuccess" class="p-6 bg-esp-blue/10 border border-esp-blue text-center text-sm text-esp-blue">
            Ссылка для сброса пароля отправлена на {{ recoverEmail }}. Ссылка действительна 15 минут.
          </div>
          <form v-else @submit.prevent="handleRecover" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase text-esp-black/60 mb-1">Рабочий e-mail</label>
              <input v-model="recoverEmail" type="email" required class="w-full bg-esp-gray border border-esp-black/20 p-3 font-inter focus:outline-none focus:border-esp-blue" />
            </div>
            <button type="submit" class="w-full btn-primary justify-center">Отправить ссылку сброса</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useHead({
  title: 'Личный кабинет | ESP',
  meta: [{ name: 'description', content: 'Вход и регистрация в партнёрском портале EcoServiceProject.' }]
})

const tab = ref('login')
const submitting = ref(false)
const registerSuccess = ref(false)
const recoverSuccess = ref(false)
const recoverEmail = ref('')

const loginForm = ref({ email: '', password: '' })
const regForm = ref({ name: '', company: '', email: '', password: '', agreed: false })

const handleLogin = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    navigateTo('/')
  }, 900)
}

const handleRegister = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    registerSuccess.value = true
  }, 900)
}

const handleRecover = () => {
  recoverSuccess.value = true
}
</script>

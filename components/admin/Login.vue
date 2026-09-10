<template>
  <div class="lg-wrap">
    <form class="lg-card" @submit.prevent="submit">
      <div class="lg-mark" aria-hidden="true">ESP</div>
      <h1 class="lg-title">Редактирование сайта</h1>

      <p v-if="devMode" class="lg-note">
        Локальный режим: пароль не задан, вход свободный.
      </p>
      <p v-else-if="state && !state.configured" class="lg-note lg-note--warn">
        Админка ещё не настроена: администратору нужно задать пароль
        в переменной окружения <code>NUXT_ADMIN_PASSWORD</code>.
      </p>

      <label v-if="!devMode" class="lg-field">
        <span class="lg-label">Пароль</span>
        <input
          v-model="password"
          type="password"
          class="lg-input"
          autocomplete="current-password"
          :disabled="busy"
        />
      </label>

      <p v-if="error" class="lg-error">{{ error }}</p>

      <button type="submit" class="lg-btn" :disabled="busy">
        {{ busy ? 'Проверяем…' : 'Войти' }}
      </button>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({ state: { type: Object, default: null } })
const emit = defineEmits(['done'])

const password = ref('')
const busy = ref(false)
const error = ref('')

// Без пароля в окружении сервер пускает только на локальной машине —
// показываем это честно, чтобы никто не думал, что защита работает.
const devMode = computed(() => Boolean(props.state?.local && !props.state?.configured))

const submit = async () => {
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/admin/session', { method: 'POST', body: { password: password.value } })
    emit('done')
  } catch (e) {
    error.value = e?.statusMessage || 'Не удалось войти'
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.lg-wrap { display: grid; place-items: center; min-height: 100vh; padding: 1.25rem; }
.lg-card {
  width: 100%; max-width: 25rem; background: #fff;
  border: 1px solid var(--adm-line); border-radius: 12px;
  padding: 2rem 1.75rem 1.75rem; display: grid; gap: 1rem;
  box-shadow: 0 12px 40px rgba(20, 22, 26, 0.06);
}
.lg-mark {
  width: 44px; height: 44px; display: grid; place-items: center;
  background: var(--adm-blue); color: #fff; border-radius: 9px;
  font-weight: 700; font-size: 0.85rem; letter-spacing: 0.04em;
}
.lg-title { margin: 0; font-size: 1.3rem; font-weight: 650; }
.lg-note { margin: 0; font-size: 0.85rem; color: var(--adm-muted); line-height: 1.5; }
.lg-note--warn { color: #92400e; background: #fef3c7; padding: 0.6rem 0.75rem; border-radius: 7px; }
.lg-note code { font-size: 0.8rem; }

.lg-field { display: grid; gap: 0.35rem; }
.lg-label { font-size: 0.8rem; color: var(--adm-muted); }
.lg-input {
  width: 100%; padding: 0.65rem 0.75rem; font-size: 0.95rem;
  border: 1px solid var(--adm-line); border-radius: 8px; background: #fff;
  font-family: inherit; color: inherit;
}
.lg-input:focus { outline: 2px solid rgba(0, 35, 102, 0.35); outline-offset: 1px; border-color: var(--adm-blue); }

.lg-error { margin: 0; font-size: 0.85rem; color: #b91c1c; }

.lg-btn {
  padding: 0.72rem 1rem; border: 0; border-radius: 8px; cursor: pointer;
  background: var(--adm-blue); color: #fff; font-size: 0.95rem; font-weight: 600;
  font-family: inherit;
}
.lg-btn:disabled { opacity: 0.6; cursor: default; }
</style>

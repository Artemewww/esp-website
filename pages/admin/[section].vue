<template>
  <div>
    <AdminLogin v-if="!state?.authed" :state="state" @done="reloadAll" />

    <template v-else-if="data">
      <AdminBar
        :title="data.section.title"
        :subtitle="data.section.where"
        :local="state.local"
        @logout="logout"
      >
        <template #actions>
          <span v-if="dirty" class="ed-dirty">есть несохранённые правки</span>
          <button type="button" class="ed-save" :disabled="!dirty || saving" @click="save">
            {{ saving ? 'Сохраняем…' : 'Сохранить' }}
          </button>
        </template>
      </AdminBar>

      <main class="ed-main">
        <div class="ed-top">
          <NuxtLink to="/admin" class="ed-back">← Все блоки</NuxtLink>
          <p class="ed-sub">{{ data.section.subtitle }}</p>
        </div>

        <p v-if="saved" class="ed-ok">{{ savedNote }}</p>
        <p v-if="error" class="ed-err">{{ error }}</p>

        <ol class="ed-list">
          <li v-for="(item, i) in items" :key="i" class="ed-item" :class="{ 'is-open': open === i }">
            <div class="ed-head">
              <button type="button" class="ed-toggle" @click="open = open === i ? -1 : i">
                <span class="ed-num">{{ i + 1 }}</span>
                <span class="ed-name">{{ item[data.section.titleField] || 'Без названия' }}</span>
                <span v-if="metaOf(item)" class="ed-meta">{{ metaOf(item) }}</span>
                <span class="ed-chev" aria-hidden="true">{{ open === i ? '▲' : '▼' }}</span>
              </button>

              <div class="ed-ops">
                <button type="button" class="ed-op" title="Выше" :disabled="i === 0" @click="move(i, -1)">↑</button>
                <button type="button" class="ed-op" title="Ниже" :disabled="i === items.length - 1" @click="move(i, 1)">↓</button>
                <button type="button" class="ed-op ed-op--del" title="Удалить" @click="remove(i)">✕</button>
              </div>
            </div>

            <div v-if="open === i" class="ed-body">
              <div v-for="f in data.section.fields" :key="f.key" class="ed-field">
                <label class="ed-lab" :for="`f-${i}-${f.key}`">{{ f.label }}</label>

                <textarea
                  v-if="f.type === 'textarea'"
                  :id="`f-${i}-${f.key}`"
                  v-model="item[f.key]"
                  class="ed-in ed-area"
                  rows="4"
                />

                <select
                  v-else-if="f.type === 'select'"
                  :id="`f-${i}-${f.key}`"
                  v-model="item[f.key]"
                  class="ed-in"
                >
                  <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
                </select>

                <AdminMediaField
                  v-else-if="f.type === 'image' || f.type === 'media'"
                  :id="`f-${i}-${f.key}`"
                  v-model="item[f.key]"
                  :kind="f.type"
                  @error="error = $event"
                />

                <input
                  v-else
                  :id="`f-${i}-${f.key}`"
                  v-model="item[f.key]"
                  class="ed-in"
                  type="text"
                />

                <p v-if="f.hint" class="ed-hint">{{ f.hint }}</p>
              </div>
            </div>
          </li>
        </ol>

        <div class="ed-foot">
          <button type="button" class="ed-add" @click="add">
            + Добавить {{ data.section.itemLabel.toLowerCase() }}
          </button>
          <button type="button" class="ed-reset" @click="reset">
            Вернуть как было
          </button>
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useSeoMeta({ robots: 'noindex, nofollow' })

const route = useRoute()
const key = computed(() => route.params.section)

const { data: state, refresh: refreshState } = await useFetch('/api/admin/session')

// useFetch передаёт куку сессии при отрисовке на сервере; с useAsyncData +
// $fetch ручка отвечала бы 401 и страница приходила бы пустой.
const { data, refresh: refreshData } = await useFetch(
  () => `/api/admin/content/${key.value}`,
  { watch: [key], default: () => null }
)

useHead(() => ({ title: data.value ? `${data.value.section.title} — ESP` : 'Редактирование — ESP' }))

const items = ref([])
const open = ref(-1)
const saving = ref(false)
const saved = ref(false)
const confirmed = ref(true)
const error = ref('')

// Снимок исходных данных: по нему считаем, есть ли что сохранять, и по нему
// же кнопка «Сохранить» гаснет, когда правок нет.
const snapshot = ref('')
watch(data, (d) => {
  items.value = d ? JSON.parse(JSON.stringify(d.items)) : []
  snapshot.value = JSON.stringify(items.value)
  open.value = -1
}, { immediate: true })

const dirty = computed(() => JSON.stringify(items.value) !== snapshot.value)

const metaOf = (item) => {
  const f = data.value?.section.metaField
  return f ? item[f] : ''
}

const move = (i, dir) => {
  const j = i + dir
  if (j < 0 || j >= items.value.length) return
  const [row] = items.value.splice(i, 1)
  items.value.splice(j, 0, row)
  open.value = open.value === i ? j : -1
}

const remove = (i) => {
  const name = items.value[i][data.value.section.titleField] || 'запись'
  if (!confirm(`Удалить «${name}»? Действие можно отменить, не сохраняя страницу.`)) return
  items.value.splice(i, 1)
  open.value = -1
}

const add = () => {
  const blank = {}
  for (const f of data.value.section.fields) blank[f.key] = f.type === 'select' ? (f.options?.[0] || '') : ''
  items.value.push(blank)
  open.value = items.value.length - 1
}

const save = async () => {
  saving.value = true
  error.value = ''
  saved.value = false
  try {
    const res = await $fetch(`/api/admin/content/${key.value}`, { method: 'PUT', body: { items: items.value } })
    snapshot.value = JSON.stringify(items.value)
    // confirmed === false означает, что хранилище ещё не начало отдавать
    // записанное. Данные сохранены, но на сайте появятся чуть позже —
    // говорим об этом прямо, а не рисуем «готово».
    confirmed.value = res?.confirmed !== false
    saved.value = true
    setTimeout(() => { saved.value = false }, 6000)
  } catch (e) {
    error.value = e?.statusMessage || 'Не удалось сохранить'
  } finally {
    saving.value = false
  }
}

const reset = async () => {
  if (!confirm('Вернуть блок к тому виду, в котором сайт был передан? Все ваши правки в этом блоке будут удалены.')) return
  error.value = ''
  try {
    await $fetch(`/api/admin/content/${key.value}`, { method: 'DELETE' })
    await refreshData()
  } catch (e) {
    error.value = e?.statusMessage || 'Не удалось вернуть'
  }
}

// Vercel Blob согласован лишь в конечном счёте: правка доезжает до всех
// узлов за несколько секунд. На обычном сервере (и на HOSTER.by) запись
// в файл видна сразу, поэтому и текст разный — обещать «сразу» там, где
// это неправда, нельзя.
const savedNote = computed(() => {
  if (!confirmed.value) return 'Сохранено. Хранилище ещё обновляется — на сайте правка появится через несколько секунд.'
  return 'Сохранено. Обновите страницу сайта, чтобы увидеть правку.'
})

const reloadAll = async () => { await refreshState(); await refreshData() }
const logout = async () => {
  await $fetch('/api/admin/session', { method: 'DELETE' })
  await refreshState()
}

// Уйти со страницы с несохранёнными правками можно только осознанно.
onMounted(() => {
  const guard = (e) => { if (dirty.value) { e.preventDefault(); e.returnValue = '' } }
  window.addEventListener('beforeunload', guard)
  onUnmounted(() => window.removeEventListener('beforeunload', guard))
})
</script>

<style scoped>
.ed-main { max-width: 1080px; margin: 0 auto; padding: 1.5rem 1.25rem 5rem; }
.ed-top { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.ed-back { color: var(--adm-blue); text-decoration: none; font-size: 0.88rem; font-weight: 600; }
.ed-back:hover { text-decoration: underline; }
.ed-sub { margin: 0; color: var(--adm-muted); font-size: 0.88rem; }

.ed-dirty { font-size: 0.78rem; color: #92400e; }
.ed-save {
  background: var(--adm-blue); color: #fff; border: 0; border-radius: 7px;
  padding: 0.48rem 1rem; font-size: 0.88rem; font-weight: 600; cursor: pointer; font-family: inherit;
}
.ed-save:disabled { background: #c9ced8; cursor: default; }

.ed-ok { margin: 0 0 1rem; padding: 0.65rem 0.85rem; background: #ecfdf5; color: #065f46; border-radius: 7px; font-size: 0.88rem; }
.ed-err { margin: 0 0 1rem; padding: 0.65rem 0.85rem; background: #fef2f2; color: #b91c1c; border-radius: 7px; font-size: 0.88rem; }

.ed-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6rem; }
.ed-item { background: #fff; border: 1px solid var(--adm-line); border-radius: 9px; overflow: hidden; }
.ed-item.is-open { border-color: var(--adm-blue); }

.ed-head { display: flex; align-items: stretch; }
.ed-toggle {
  flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.7rem;
  background: none; border: 0; padding: 0.85rem 0.5rem 0.85rem 0.9rem;
  cursor: pointer; text-align: left; font-family: inherit; color: inherit;
}
.ed-num {
  flex: none; width: 22px; height: 22px; display: grid; place-items: center;
  background: #eef1f6; border-radius: 5px; font-size: 0.72rem; color: var(--adm-muted); font-weight: 600;
}
.ed-name { font-weight: 600; font-size: 0.94rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ed-meta { color: var(--adm-muted); font-size: 0.82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ed-chev { margin-left: auto; color: #9aa1ac; font-size: 0.6rem; flex: none; }

.ed-ops { display: flex; align-items: center; gap: 0.15rem; padding-right: 0.55rem; }
.ed-op {
  width: 28px; height: 28px; border: 1px solid transparent; background: none; border-radius: 6px;
  cursor: pointer; color: var(--adm-muted); font-size: 0.85rem; font-family: inherit;
}
.ed-op:hover:not(:disabled) { background: #eef1f6; color: var(--adm-ink); }
.ed-op:disabled { opacity: 0.28; cursor: default; }
.ed-op--del:hover { background: #fef2f2; color: #b91c1c; }

.ed-body { border-top: 1px solid var(--adm-line); padding: 1.1rem 1.1rem 1.3rem; display: grid; gap: 1.05rem; }
.ed-field { display: grid; gap: 0.3rem; }
.ed-lab { font-size: 0.8rem; color: var(--adm-muted); font-weight: 500; }
.ed-in {
  width: 100%; padding: 0.55rem 0.7rem; font-size: 0.92rem; font-family: inherit; color: inherit;
  border: 1px solid var(--adm-line); border-radius: 7px; background: #fff;
}
.ed-in:focus { outline: 2px solid rgba(0, 35, 102, 0.3); outline-offset: 1px; border-color: var(--adm-blue); }
.ed-area { resize: vertical; line-height: 1.55; }
.ed-hint { margin: 0; font-size: 0.76rem; color: #9aa1ac; }

.ed-foot { display: flex; gap: 0.6rem; margin-top: 1.2rem; flex-wrap: wrap; }
.ed-add {
  background: #fff; border: 1px dashed #c2c9d4; border-radius: 8px;
  padding: 0.6rem 1rem; font-size: 0.88rem; cursor: pointer; color: var(--adm-blue);
  font-weight: 600; font-family: inherit;
}
.ed-add:hover { border-color: var(--adm-blue); background: rgba(0, 35, 102, 0.03); }
.ed-reset {
  background: none; border: 0; color: var(--adm-muted); font-size: 0.85rem;
  cursor: pointer; padding: 0.6rem 0.5rem; font-family: inherit;
}
.ed-reset:hover { color: #b91c1c; text-decoration: underline; }
</style>

<template>
  <div class="mf">
    <!-- Превью того, что уже стоит: человек должен видеть файл, а не путь к нему. -->
    <div v-if="modelValue" class="mf-prev">
      <img v-if="isImage" :src="modelValue" class="mf-img" alt="" />
      <video v-else-if="isVideo" :src="modelValue" class="mf-img" muted playsinline preload="metadata" />
      <span v-else class="mf-file">📄</span>

      <div class="mf-info">
        <span class="mf-path">{{ shortPath }}</span>
        <button type="button" class="mf-clear" @click="$emit('update:modelValue', '')">Убрать</button>
      </div>
    </div>

    <div class="mf-row">
      <input
        :id="id"
        :value="modelValue"
        class="mf-in"
        type="text"
        :placeholder="kind === 'image' ? 'Путь к изображению' : 'Путь к файлу'"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <label class="mf-up" :class="{ 'is-busy': busy }">
        {{ busy ? `${percent}%` : 'Загрузить' }}
        <input type="file" class="mf-file-in" :accept="accept" :disabled="busy" @change="upload" />
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  kind: { type: String, default: 'media' },
  id: { type: String, default: undefined }
})
const emit = defineEmits(['update:modelValue', 'error'])

const busy = ref(false)
const percent = ref(0)

const accept = computed(() =>
  props.kind === 'image' ? 'image/*' : 'image/*,video/*,application/pdf,.doc,.docx'
)
const isImage = computed(() => /\.(jpe?g|png|webp|gif|svg)(\?|$)/i.test(props.modelValue))
const isVideo = computed(() => /\.(mp4|webm|mov)(\?|$)/i.test(props.modelValue))
const shortPath = computed(() => {
  const v = props.modelValue
  return v.length > 60 ? `…${v.slice(-57)}` : v
})

const upload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  busy.value = true
  percent.value = 0

  try {
    const url = await new Promise((resolve, reject) => {
      // XHR, а не fetch: только он показывает прогресс, а видео тут по 50–80 МБ.
      const xhr = new XMLHttpRequest()
      const form = new FormData()
      form.append('file', file)
      xhr.open('POST', '/api/admin/upload')
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) percent.value = Math.round((ev.loaded / ev.total) * 100)
      }
      xhr.onload = () => {
        let body = {}
        try { body = JSON.parse(xhr.responseText) } catch { /* пустой ответ */ }
        if (xhr.status >= 200 && xhr.status < 300 && body.url) resolve(body.url)
        else reject(new Error(body.statusMessage || body.message || `Ошибка загрузки (${xhr.status})`))
      }
      xhr.onerror = () => reject(new Error('Не удалось передать файл'))
      xhr.send(form)
    })
    emit('update:modelValue', url)
  } catch (err) {
    emit('error', err.message)
  } finally {
    busy.value = false
    e.target.value = ''
  }
}
</script>

<style scoped>
.mf { display: grid; gap: 0.5rem; }

.mf-prev { display: flex; align-items: center; gap: 0.7rem; }
.mf-img {
  width: 108px; height: 68px; object-fit: cover; border-radius: 6px;
  border: 1px solid var(--adm-line); background: #f2f4f7; flex: none;
}
.mf-file {
  width: 108px; height: 68px; display: grid; place-items: center; font-size: 1.5rem;
  border-radius: 6px; border: 1px solid var(--adm-line); background: #f2f4f7; flex: none;
}
.mf-info { min-width: 0; display: grid; gap: 0.25rem; }
.mf-path { font-size: 0.76rem; color: var(--adm-muted); word-break: break-all; }
.mf-clear {
  justify-self: start; background: none; border: 0; padding: 0;
  color: #b91c1c; font-size: 0.78rem; cursor: pointer; font-family: inherit;
}
.mf-clear:hover { text-decoration: underline; }

.mf-row { display: flex; gap: 0.45rem; }
.mf-in {
  flex: 1; min-width: 0; padding: 0.55rem 0.7rem; font-size: 0.88rem; font-family: inherit; color: inherit;
  border: 1px solid var(--adm-line); border-radius: 7px; background: #fff;
}
.mf-in:focus { outline: 2px solid rgba(0, 35, 102, 0.3); outline-offset: 1px; border-color: var(--adm-blue); }

.mf-up {
  flex: none; display: grid; place-items: center; min-width: 6.2rem;
  padding: 0.55rem 0.85rem; border: 1px solid var(--adm-line); border-radius: 7px;
  background: #fff; font-size: 0.85rem; font-weight: 600; color: var(--adm-blue); cursor: pointer;
}
.mf-up:hover { border-color: var(--adm-blue); }
.mf-up.is-busy { color: var(--adm-muted); cursor: progress; }
.mf-file-in { display: none; }
</style>

<script setup lang="ts">
/**
 * Раскадровка видео ESP_final_040926_1080.mp4 — рабочий инструмент для
 * согласования ролика с заказчиком.
 *
 * Клиент по ссылке `/raskadrovka` видит блоки-кадры с распознанной озвучкой,
 * правит текст озвучки, меняет порядок блоков перетаскиванием, добавляет свои
 * блоки с картинкой или видео и указывает, к какому видео относится блок.
 * Всё сохраняется на сервере (та же система, что у админки сайта), история
 * изменений показывает, что и когда правилось.
 */
definePageMeta({ layout: 'admin' })

interface Block {
  id: string
  img: string
  media: string
  videoLink: string
  tc: string
  dur: number
  originalVo: string
  vo: string
  comment: string
  kind?: 'frame' | 'custom'
}

const blocks = ref<Block[]>([])
const updatedAt = ref<string | null>(null)
const history = ref<{ at: string; blocks: number; note: string }[]>([])
const loaded = ref(false)
const saveState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const showHistory = ref(false)
const filter = ref<'all' | 'nov' | 'vo' | 'changed'>('all')
const dragId = ref<string | null>(null)

const counts = computed(() => ({
  all: blocks.value.length,
  nov: blocks.value.filter((b) => !b.vo.trim()).length,
  vo: blocks.value.filter((b) => b.vo.trim()).length,
  changed: blocks.value.filter((b) => b.vo !== b.originalVo || b.comment || b.media || b.videoLink).length
}))

const filtered = computed(() => {
  if (filter.value === 'all') return blocks.value
  return blocks.value.filter((b) => {
    if (filter.value === 'nov') return !b.vo.trim()
    if (filter.value === 'vo') return Boolean(b.vo.trim())
    return b.vo !== b.originalVo || Boolean(b.comment || b.media || b.videoLink)
  })
})

const load = async () => {
  const res = await $fetch<{ blocks: Block[]; history: typeof history.value; updatedAt: string | null }>('/api/admin/raskadrovka')
  blocks.value = res.blocks
  history.value = res.history || []
  updatedAt.value = res.updatedAt
  loaded.value = true
}

load().catch((e: any) => {
  loaded.value = true
  if (e?.statusCode === 401) showLogin.value = true
})

const password = ref('')
const busy = ref(false)
const loginError = ref('')
const showLogin = ref(false)
const doLogin = async () => {
  busy.value = true
  loginError.value = ''
  try {
    await $fetch('/api/admin/session', { method: 'POST', body: { password: password.value } })
    showLogin.value = false
    loaded.value = false
    await load()
  } catch (e: any) {
    loginError.value = e?.statusMessage || 'Не удалось войти'
  } finally {
    busy.value = false
  }
}

let saveTimer: ReturnType<typeof setTimeout> | undefined
const save = async () => {
  saveState.value = 'saving'
  try {
    const res = await $fetch<{ at: string }>('/api/admin/raskadrovka', {
      method: 'POST',
      body: { blocks: blocks.value }
    })
    saveState.value = 'saved'
    updatedAt.value = res.at
    setTimeout(() => { saveState.value = 'idle' }, 2000)
  } catch {
    saveState.value = 'error'
  }
}
const queueSave = () => {
  saveState.value = 'saving'
  clearTimeout(saveTimer)
  saveTimer = setTimeout(save, 900)
}

const uploadMedia = async (blockId: string, file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  const res = await $fetch<{ url: string }>('/api/admin/upload', { method: 'POST', body: fd })
  const b = blocks.value.find((x) => x.id === blockId)
  if (b) {
    b.media = res.url
    queueSave()
  }
}

const onPickFile = (blockId: string, event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) uploadMedia(blockId, file)
  input.value = ''
}

const addBlock = () => {
  const last = blocks.value[blocks.value.length - 1]
  blocks.value.push({
    id: 'c' + Date.now().toString(36),
    img: '',
    media: '',
    videoLink: '',
    tc: '—',
    dur: last ? last.dur : 5,
    originalVo: '',
    vo: '',
    comment: '',
    kind: 'custom'
  })
  queueSave()
  nextTick(() => {
    document.querySelector(`[data-block-id="${blocks.value[blocks.value.length - 1].id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

const removeBlock = (id: string) => {
  blocks.value = blocks.value.filter((b) => b.id !== id)
  queueSave()
}

// Перетаскивание блоков: HTML5 drag&drop без библиотек.
const onDragStart = (e: DragEvent, id: string) => {
  dragId.value = id
  e.dataTransfer?.setData('text/plain', id)
}
const onDrop = (e: DragEvent, targetId: string) => {
  e.preventDefault()
  const sourceId = dragId.value || e.dataTransfer?.getData('text/plain')
  dragId.value = null
  if (!sourceId || sourceId === targetId) return
  const from = blocks.value.findIndex((b) => b.id === sourceId)
  const to = blocks.value.findIndex((b) => b.id === targetId)
  if (from < 0 || to < 0) return
  const [moved] = blocks.value.splice(from, 1)
  blocks.value.splice(to, 0, moved)
  queueSave()
}

const fmtDate = (iso: string) => new Date(iso).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })

const onKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    clearTimeout(saveTimer)
    save()
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="min-h-screen bg-esp-gray/40">
    <header class="sticky top-0 z-20 bg-esp-black text-white shadow-lg">
      <div class="container-custom px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <h1 class="font-rounded text-lg font-bold">Раскадровка · ESP_final_040926_1080</h1>
        <span class="text-sm text-white/60">
          блоков <b class="text-esp-lidar">{{ counts.all }}</b>
          · с озвучкой <b class="text-esp-lidar">{{ counts.vo }}</b>
          · без озвучки <b class="text-esp-lidar">{{ counts.nov }}</b>
          · правок <b class="text-esp-lidar">{{ counts.changed }}</b>
        </span>

        <div class="flex items-center gap-2 ml-auto flex-wrap">
          <button
            v-for="(label, key) in { all: 'Все', nov: 'Без озвучки', vo: 'С озвучкой', changed: 'Изменённые' }"
            :key="key"
            class="px-3 py-1.5 text-xs font-medium transition-colors"
            :class="filter === key ? 'bg-esp-lidar text-esp-black' : 'bg-white/10 text-white/80 hover:bg-white/20'"
            @click="filter = key as any"
          >{{ label }}</button>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs" :class="{
            'text-white/50': saveState === 'idle',
            'text-esp-lidar': saveState === 'saving',
            'text-green-400': saveState === 'saved',
            'text-red-400': saveState === 'error'
          }">
            {{ saveState === 'saving' ? 'Сохранение…' : saveState === 'saved' ? '✓ Сохранено' : saveState === 'error' ? 'Ошибка сохранения' : updatedAt ? 'Обновлено ' + fmtDate(updatedAt) : '' }}
          </span>
          <button class="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 transition-colors" @click="showHistory = !showHistory">История</button>
          <button class="px-4 py-1.5 text-xs font-medium bg-esp-lidar text-esp-black hover:bg-white transition-colors" @click="addBlock">+ Блок</button>
          <button class="px-4 py-1.5 text-xs font-medium bg-esp-blue hover:bg-esp-blue/80 transition-colors" @click="save">Сохранить</button>
        </div>
      </div>

      <div v-if="showHistory" class="border-t border-white/10 bg-esp-black/95 px-6 py-3 max-h-52 overflow-auto">
        <div class="container-custom">
          <p class="text-xs text-white/50 mb-2">Последние изменения (видно, что и когда правилось):</p>
          <p v-if="!history.length" class="text-sm text-white/40">Пока правок не было.</p>
          <div v-for="(h, i) in history" :key="i" class="text-sm text-white/70 py-0.5">
            <span class="text-white/40 font-mono text-xs">{{ fmtDate(h.at) }}</span> —
            блоков: {{ h.blocks }}<template v-if="h.note"> — {{ h.note }}</template>
          </div>
        </div>
      </div>
    </header>

    <main class="container-custom px-6 py-8">
      <div v-if="showLogin" class="max-w-sm mx-auto my-20 bg-white border border-esp-black/15 p-8 shadow-sm">
        <h2 class="font-rounded text-xl font-bold mb-2">Вход</h2>
        <p class="text-sm text-esp-black/60 mb-5">Введите пароль доступа (тот же, что для редактирования сайта).</p>
        <form @submit.prevent="doLogin">
          <input
            v-model="password"
            type="password"
            placeholder="Пароль"
            autocomplete="current-password"
            class="w-full border border-esp-black/20 px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-esp-lidar"
          >
          <p v-if="loginError" class="text-sm text-red-600 mb-3">{{ loginError }}</p>
          <button type="submit" :disabled="busy" class="w-full bg-esp-blue text-white py-2.5 text-sm font-medium hover:bg-esp-blue/80 transition-colors disabled:opacity-50">
            {{ busy ? 'Проверяем…' : 'Войти' }}
          </button>
        </form>
      </div>

      <p v-else-if="!loaded" class="text-esp-black/60">Загрузка…</p>
      <div v-else class="grid gap-5" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))">
        <article
          v-for="b in filtered"
          :key="b.id"
          :data-block-id="b.id"
          draggable="true"
          class="bg-white border border-esp-black/15 flex flex-col cursor-grab active:cursor-grabbing"
          :class="{ 'ring-2 ring-esp-lidar': dragId === b.id, 'border-esp-green/50': b.kind === 'custom' }"
          @dragstart="onDragStart($event, b.id)"
          @dragover.prevent
          @drop="onDrop($event, b.id)"
        >
          <div class="relative bg-esp-black aspect-video">
            <video v-if="b.media && /\.(mp4|webm|mov)$/i.test(b.media)" :src="b.media" class="w-full h-full object-cover" controls preload="metadata" />
            <img v-else-if="b.media" :src="b.media" class="w-full h-full object-cover" alt="">
            <img v-else-if="b.img" :src="b.img" class="w-full h-full object-cover" alt="">
            <div v-else class="w-full h-full flex items-center justify-center text-white/40 text-sm">Медиа не загружено</div>
            <span class="absolute top-2 left-2 px-2 py-0.5 bg-esp-black/80 text-esp-lidar text-xs font-mono">{{ b.tc }}</span>
            <span class="absolute top-2 right-2 px-2 py-0.5 bg-esp-black/80 text-white/70 text-xs">{{ b.dur }}s</span>
          </div>

          <div class="p-3 flex flex-col gap-2.5 flex-1">
            <label class="text-[11px] uppercase tracking-wide text-esp-black/50 font-medium">
              Ссылка к видео (какому ролику относится)
              <input
                v-model="b.videoLink"
                type="url"
                placeholder="https://…"
                class="mt-1 w-full border border-esp-black/20 px-2 py-1.5 text-sm normal-case tracking-normal focus:outline-none focus:border-esp-lidar"
                @input="queueSave"
              >
            </label>

            <div>
              <div class="text-[11px] uppercase tracking-wide text-esp-black/50 font-medium mb-1">Текущая озвучка</div>
              <p v-if="b.originalVo" class="text-sm bg-esp-gray/60 px-2.5 py-2 text-esp-black/80">{{ b.originalVo }}</p>
              <p v-else class="text-sm text-esp-black/35 italic px-2.5">— нет озвучки —</p>
            </div>

            <label class="text-[11px] uppercase tracking-wide text-esp-black/50 font-medium">
              {{ b.originalVo ? 'Правка озвучки' : 'Текст для озвучки' }}
              <textarea
                v-model="b.vo"
                rows="2"
                :placeholder="b.originalVo ? 'что поправить в озвучке…' : 'напишите текст, который нужно озвучить…'"
                class="mt-1 w-full border px-2.5 py-2 text-sm resize-y focus:outline-none focus:border-esp-lidar"
                :class="b.vo !== b.originalVo ? 'border-esp-green' : 'border-esp-black/20'"
                @input="queueSave"
              />
            </label>

            <label class="text-[11px] uppercase tracking-wide text-esp-black/50 font-medium">
              Комментарий к блоку
              <textarea
                v-model="b.comment"
                rows="1"
                placeholder="пожелания по монтажу, что изменить…"
                class="mt-1 w-full border border-esp-black/20 px-2.5 py-2 text-sm resize-y focus:outline-none focus:border-esp-lidar"
                @input="queueSave"
              />
            </label>

            <div class="mt-auto flex items-center gap-2 pt-1">
              <label class="flex-1 text-center px-3 py-1.5 text-xs font-medium border border-esp-blue text-esp-blue cursor-pointer hover:bg-esp-blue hover:text-white transition-colors">
                {{ b.media ? 'Заменить медиа' : (b.kind === 'custom' ? 'Загрузить фото/видео' : 'Заменить кадр') }}
                <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" class="hidden" @change="onPickFile(b.id, $event)">
              </label>
              <a v-if="b.videoLink" :href="b.videoLink" target="_blank" class="px-3 py-1.5 text-xs border border-esp-black/20 text-esp-black/70 hover:border-esp-lidar hover:text-esp-lidar transition-colors">Открыть</a>
              <button v-if="b.kind === 'custom'" class="px-3 py-1.5 text-xs border border-red-500/40 text-red-600 hover:bg-red-500 hover:text-white transition-colors" @click="removeBlock(b.id)">✕</button>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

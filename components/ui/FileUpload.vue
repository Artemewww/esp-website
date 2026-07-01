<template>
  <div>
    <div
      class="relative border-2 border-dashed p-8 text-center transition-colors cursor-pointer"
      :class="isDragging ? 'border-esp-blue bg-esp-blue/5' : 'border-esp-gray hover:border-esp-blue/50'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="inputRef.click()"
    >
      <input ref="inputRef" type="file" class="hidden" :accept="accept" @change="handleChange" />
      <svg class="w-10 h-10 mx-auto mb-3 text-esp-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
      <p v-if="!file" class="text-esp-black/70 text-sm font-medium">Кликните для выбора файла или перетащите сюда</p>
      <p v-else class="text-esp-black font-medium text-sm">{{ file.name }} <span class="text-esp-black/40">({{ sizeLabel }})</span></p>
      <p class="text-esp-black/40 text-xs mt-2">{{ hint }}</p>
    </div>
    <button v-if="file" @click="clear" class="text-xs text-esp-blue hover:underline mt-2">Убрать файл</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  accept: { type: String, default: '.pdf,.doc,.docx' },
  hint: { type: String, default: 'Максимальный размер: 10МБ. PDF, DOC, DOCX.' }
})
const emit = defineEmits(['change'])

const inputRef = ref(null)
const file = ref(null)
const isDragging = ref(false)

const sizeLabel = computed(() => file.value ? `${(file.value.size / 1024 / 1024).toFixed(1)} МБ` : '')

const setFile = (f) => {
  file.value = f
  emit('change', f)
}

const handleChange = (e) => {
  const f = e.target.files?.[0]
  if (f) setFile(f)
}

const handleDrop = (e) => {
  isDragging.value = false
  const f = e.dataTransfer.files?.[0]
  if (f) setFile(f)
}

const clear = () => {
  file.value = null
  if (inputRef.value) inputRef.value.value = ''
  emit('change', null)
}
</script>

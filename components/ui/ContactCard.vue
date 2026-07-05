<template>
  <div class="border border-esp-gray bg-white p-6 md:p-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
      <!-- Actions -->
      <div>
        <span class="block text-esp-blue text-xs font-medium uppercase tracking-wide mb-2 font-inter">Контактная карточка</span>
        <h3 class="font-rounded text-xl text-esp-black mb-1">{{ expert.fullName || expert.name }}</h3>
        <p class="text-esp-black/60 text-sm mb-5">{{ expert.contact?.vcardTitle || expert.role }}</p>

        <div class="space-y-2.5">
          <a
            v-if="expert.contact?.phone"
            :href="`tel:${expert.contact.phone}`"
            class="btn-primary w-full justify-center flex items-center gap-2"
          >
            <Icon name="phone" cls="w-4 h-4" /> Позвонить
          </a>
          <button
            @click="save"
            class="w-full border-2 border-esp-blue text-esp-blue px-6 py-3 font-medium hover:bg-esp-blue hover:text-white transition flex items-center justify-center gap-2"
          >
            <Icon name="download" cls="w-4 h-4" /> Сохранить контакт
          </button>
          <a
            v-if="expert.email"
            :href="`mailto:${expert.email}`"
            class="w-full border border-esp-gray text-esp-black px-6 py-3 font-medium hover:bg-esp-gray transition flex items-center justify-center gap-2 text-sm"
          >
            {{ expert.email }}
          </a>
        </div>

        <!-- Messengers -->
        <div v-if="hasMessengers" class="flex gap-2 mt-4">
          <a v-if="expert.contact?.whatsapp" :href="expert.contact.whatsapp" target="_blank" rel="noopener"
             class="flex-1 text-center py-2 text-xs font-medium bg-[#25D366]/10 text-[#1a8a48] hover:bg-[#25D366]/20 transition">WhatsApp</a>
          <a v-if="expert.contact?.telegram" :href="expert.contact.telegram" target="_blank" rel="noopener"
             class="flex-1 text-center py-2 text-xs font-medium bg-[#229ED9]/10 text-[#1877a8] hover:bg-[#229ED9]/20 transition">Telegram</a>
          <a v-if="expert.contact?.viber" :href="expert.contact.viber"
             class="flex-1 text-center py-2 text-xs font-medium bg-[#7360F2]/10 text-[#5a49c4] hover:bg-[#7360F2]/20 transition">Viber</a>
        </div>
      </div>

      <!-- QR -->
      <div class="text-center">
        <div class="inline-block bg-white p-3 border border-esp-gray">
          <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR-код контакта" class="w-44 h-44 mx-auto" />
          <div v-else class="w-44 h-44 flex items-center justify-center text-esp-black/30 text-xs">Генерация QR…</div>
        </div>
        <p class="text-esp-black/50 text-xs mt-3 max-w-[200px] mx-auto font-inter">
          Наведите камеру телефона — контакт сохранится в телефонную книгу
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { buildVCardCompact, downloadVCard } from '~/composables/useVCard'

const props = defineProps({
  expert: { type: Object, required: true }
})

const qrDataUrl = ref('')
const hasMessengers = computed(() => {
  const c = props.expert.contact || {}
  return !!(c.whatsapp || c.telegram || c.viber)
})

const save = () => downloadVCard(props.expert)

onMounted(async () => {
  const QRCode = (await import('qrcode')).default
  const vcard = buildVCardCompact(props.expert)
  qrDataUrl.value = await QRCode.toDataURL(vcard, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 320,
    color: { dark: '#002366', light: '#ffffff' }
  })
})
</script>

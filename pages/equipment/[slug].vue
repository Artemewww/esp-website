<template>
  <div v-if="product">
    <!-- Breadcrumbs -->
    <section class="py-6 bg-white border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Оборудование', to: '/equipment' }, { label: product.name }]" />
      </div>
    </section>

    <!-- Product hero -->
    <section class="section-padding bg-white">
      <div class="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <div class="bg-white border border-esp-gray flex items-center justify-center p-6 aspect-square">
            <img :src="activeImage" :alt="product.name" class="w-full h-full object-contain" />
          </div>
          <div v-if="galleryImages.length > 1" class="grid grid-cols-4 gap-3 mt-3">
            <button
              v-for="(img, i) in galleryImages"
              :key="i"
              @click="activeImage = img"
              class="aspect-square bg-white border flex items-center justify-center p-2 transition"
              :class="activeImage === img ? 'border-esp-blue' : 'border-esp-gray hover:border-esp-blue/50'"
            >
              <img :src="img" :alt="`${product.name} ${i + 1}`" class="w-full h-full object-contain" />
            </button>
          </div>
        </div>

        <div>
          <h1 class="font-rounded text-3xl md:text-4xl mb-5 text-esp-black">{{ product.name }}</h1>
          <div class="space-y-4 mb-6">
            <p v-for="(para, i) in descParagraphs" :key="i" class="text-lg text-esp-black/70 leading-relaxed">{{ para }}</p>
          </div>

          <ul v-if="product.advantages?.length" class="space-y-2 mb-8">
            <li v-for="adv in product.advantages" :key="adv" class="flex gap-2 text-esp-black/80 text-sm">
              <span class="text-esp-green font-bold">✓</span>
              <span>{{ adv }}</span>
            </li>
          </ul>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-esp-gray p-4">
              <span class="block text-esp-black/50 text-xs font-inter mb-1">Производительность</span>
              <span class="font-rounded font-semibold text-esp-black">{{ product.capacity }}</span>
            </div>
            <div class="bg-esp-gray p-4">
              <span class="block text-esp-black/50 text-xs font-inter mb-1">Применение</span>
              <span class="font-rounded font-semibold text-esp-black">{{ product.application }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 mb-2">
            <NuxtLink to="/contacts#contact-form" class="btn-primary">Запросить КП</NuxtLink>
            <NuxtLink to="/equipment#catalog" class="border-2 border-esp-blue text-esp-blue px-8 py-4 font-medium hover:bg-esp-blue hover:text-white transition">
              Всё оборудование
            </NuxtLink>
          </div>

          <!-- Specs accordion -->
          <div class="mt-6 border border-esp-gray">
            <button
              @click="specsOpen = !specsOpen"
              class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-esp-gray/50 transition"
            >
              <span class="font-rounded font-semibold text-esp-black">Технические характеристики</span>
              <svg class="w-5 h-5 text-esp-black/50 transition-transform" :class="{ 'rotate-180': specsOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-show="specsOpen" class="border-t border-esp-gray">
              <div v-for="(spec, i) in product.specs" :key="i" class="flex justify-between items-center px-5 py-3 border-b border-esp-gray last:border-b-0 text-sm">
                <span class="text-esp-black/60">{{ spec.label }}</span>
                <span class="font-medium text-esp-black text-right">{{ spec.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related projects -->
    <section v-if="relatedProjects.length" class="section-padding bg-esp-gray">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl md:text-3xl mb-8 text-esp-black">Это оборудование применено в проектах</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="proj in relatedProjects"
            :key="proj.slug"
            :to="`/projects/${proj.slug}`"
            class="bg-white p-6 hover:shadow-lg transition-all duration-300 block"
          >
            <h3 class="font-rounded font-semibold text-esp-black mb-2">{{ proj.name }}</h3>
            <p class="text-esp-black/60 text-sm">{{ proj.location }}</p>
            <span class="text-esp-blue text-sm font-medium mt-3 inline-block">Смотреть проект →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Other equipment -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl md:text-3xl mb-8 text-esp-black">Другое оборудование</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="item in otherEquipment"
            :key="item.slug"
            :to="`/equipment/${item.slug}`"
            class="bg-white border border-esp-gray overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div class="aspect-square bg-white flex items-center justify-center p-5 border-b border-esp-gray">
              <img :src="item.photo" :alt="item.name" loading="lazy" class="w-full h-full object-contain" />
            </div>
            <div class="p-4">
              <h3 class="font-rounded text-sm font-semibold text-esp-black">{{ item.name }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Оборудование не найдено.</p>
    <NuxtLink to="/equipment" class="text-esp-blue hover:underline">Вернуться в каталог</NuxtLink>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { projectsList } from '~/composables/useProjects'

const { equipment, getBySlug } = useEquipment()
const route = useRoute()
const product = computed(() => getBySlug(route.params.slug))
const descParagraphs = computed(() => (product.value?.longDesc || product.value?.desc || '').split('\n\n'))

// Фото из админки (photo) — главное; доп. ракурсы из кода (images) идут следом
const galleryImages = computed(() => {
  const p = product.value
  if (!p) return []
  return [...new Set([p.photo || p.image, ...(p.images || [])].filter(Boolean))]
})
const activeImage = ref(galleryImages.value[0])
watch(galleryImages, (imgs) => { activeImage.value = imgs[0] }, { immediate: true })

const specsOpen = ref(false)

const relatedProjects = computed(() => {
  if (!product.value?.relatedProjects?.length) return []
  return projectsList.filter(p => product.value.relatedProjects.includes(p.slug))
})

const otherEquipment = computed(() =>
  equipment.value.filter(p => p.slug !== route.params.slug).slice(0, 4)
)

// og-картинки лежат в этом проекте: origin берём из runtimeConfig,
// чтобы смена домена правилась в одном месте.
const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead(() => ({
  title: product.value ? `${product.value.name} | Оборудование ESP` : 'Оборудование не найдено | ESP',
  meta: [
    { name: 'description', content: product.value ? `${product.value.desc} Технические характеристики и расчёт под ваш объект.` : '' },
    { property: 'og:title', content: product.value ? product.value.name : '' },
    { property: 'og:description', content: product.value ? product.value.desc : '' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: product.value ? `https://ecoservisproekt.by/equipment/${product.value.slug}` : '' }]
}))

useSchemaOrg([
  defineProduct(() => ({
    name: product.value?.name,
    description: product.value?.desc,
    image: product.value ? `${ogOrigin}${product.value.photo || product.value.image}` : undefined,
    category: product.value?.category,
    brand: 'ESP',
  })),
  defineBreadcrumb(() => ([
    { name: 'Оборудование', item: '/equipment' },
    { name: product.value?.name }
  ]))
])
</script>

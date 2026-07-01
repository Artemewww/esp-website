<template>
  <div v-if="article" class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Ресурсы', to: '/resources' }, { label: article.title }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom max-w-4xl">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
          {{ article.category }}
        </span>
        <h1 class="font-rounded text-3xl md:text-5xl mb-6 text-esp-black leading-tight">{{ article.title }}</h1>

        <div class="flex flex-wrap items-center gap-4 text-sm text-esp-black/60 mb-10 pb-6 border-b border-esp-gray">
          <NuxtLink :to="`/team/${article.authorSlug}`" class="font-medium text-esp-black hover:text-esp-blue">{{ article.authorName }}</NuxtLink>
          <span>·</span>
          <span>{{ article.date }}</span>
          <span>·</span>
          <span class="text-esp-blue">{{ article.readTime }}</span>
        </div>

        <div class="aspect-[21/9] bg-esp-black mb-12 flex items-center justify-center text-white/40 text-sm font-mono">
          ESP_BIM_MODEL_INTEGRATION
        </div>

        <div class="prose-esp space-y-12">
          <div v-for="sec in article.sections" :key="sec.id" :id="sec.id" class="space-y-4" style="scroll-margin-top: 100px;">
            <h2 class="font-rounded text-2xl text-esp-black border-b border-esp-gray pb-2">{{ sec.title }}</h2>
            <p v-for="(p, i) in sec.paragraphs" :key="i" class="text-esp-black/80 leading-relaxed">{{ p }}</p>

            <blockquote v-if="sec.quote" class="bg-esp-gray border-l-4 border-esp-green p-6 text-esp-black/80 italic">
              {{ sec.quote }}
            </blockquote>

            <div v-if="sec.stats" class="grid grid-cols-2 gap-4 bg-esp-black text-white p-6">
              <div v-for="(s, i) in sec.stats" :key="i" class="text-center" :class="i > 0 ? 'border-l border-white/10' : ''">
                <div class="text-2xl font-rounded font-bold" :class="i === 0 ? 'text-red-400' : 'text-esp-green'">{{ s.value }}</div>
                <p class="text-xs text-white/60 mt-1">{{ s.label }}</p>
              </div>
            </div>

            <div v-if="sec.table" class="border border-esp-black overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-esp-gray">
                    <th v-for="h in sec.table.headers" :key="h" class="p-3 text-left font-semibold text-esp-black">{{ h }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in sec.table.rows" :key="ri" class="border-t border-esp-gray">
                    <td v-for="(cell, ci) in row" :key="ci" class="p-3" :class="ci === 0 ? 'text-esp-black/70' : 'font-semibold text-esp-black'">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Author card -->
        <div class="mt-16 bg-esp-gray p-6 flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-esp-blue text-white flex items-center justify-center font-rounded font-bold flex-shrink-0">
            {{ article.authorName.split(' ').map(w => w[0]).join('') }}
          </div>
          <div>
            <h4 class="font-rounded font-semibold text-esp-black">{{ article.authorName }}</h4>
            <p class="text-esp-black/60 text-sm">{{ article.authorRole }}</p>
            <NuxtLink :to="`/team/${article.authorSlug}`" class="text-esp-blue text-sm font-medium">Читать все статьи →</NuxtLink>
          </div>
        </div>

        <!-- Related project -->
        <div v-if="relatedProject" class="mt-6">
          <NuxtLink :to="`/projects/${relatedProject.slug}`" class="block bg-white border border-esp-gray p-5 hover:shadow-lg transition">
            <span class="text-xs uppercase text-esp-black/40">Упомянутый проект</span>
            <h5 class="font-rounded font-semibold text-esp-black">{{ relatedProject.name }}</h5>
            <span class="text-esp-green text-sm font-medium">Открыть кейс →</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Статья не найдена.</p>
    <NuxtLink to="/resources" class="text-esp-blue hover:underline">Вернуться в ресурсы</NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { articlesList } from '~/composables/useArticles'
import { projectsList } from '~/composables/useProjects'

const route = useRoute()
const article = computed(() => articlesList.find(a => a.slug === route.params.slug))
const relatedProject = computed(() => {
  if (!article.value?.relatedProjectSlug) return null
  return projectsList.find(p => p.slug === article.value.relatedProjectSlug)
})

useHead(() => ({
  title: article.value ? `${article.value.title} | Техблог ESP` : 'Статья не найдена | ESP',
  meta: [{ name: 'description', content: article.value?.excerpt || '' }]
}))
</script>

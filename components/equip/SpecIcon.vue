<template>
  <!-- Иконка характеристики: общий набор ApIcon (viewBox 24, штрих 1.5), подбирается по смыслу подписи -->
  <ApIcon :name="GLYPH[kind]" class="esi" />
</template>

<script setup>
import { computed } from 'vue'
import ApIcon from '~/components/ui/ApIcon.vue'

const props = defineProps({ label: { type: String, default: '' } })

// вид характеристики -> глиф ApIcon
const GLYPH = {
  gauge: 'gauge', shield: 'shieldcheck', chip: 'chip', cube: 'cube', wrench: 'wrench', bolt: 'bolt',
  people: 'users', drop: 'drop', ruler: 'ruler', target: 'target', stack: 'layers', sparkles: 'sparkles',
  wind: 'wind', cycle: 'loop', box: 'cube', grid: 'grid', calendar: 'calendar', pin: 'pin', check: 'circlecheck'
}

const RULES = [
  [/гарант/i, 'shield'],
  [/срок службы/i, 'calendar'],
  [/энерго/i, 'bolt'],
  [/производительн|мощност|скорост|давлен/i, 'gauge'],
  [/управлен|шкаф|автоматик|выход|зонд|измеряем/i, 'chip'],
  [/материал|корпус|исполнен|изготовл|модификац/i, 'cube'],
  [/обслуживан|монтаж/i, 'wrench'],
  [/жител|объект/i, 'people'],
  [/степень|эффект|сорбц|влажност|водопоглощ/i, 'drop'],
  [/размер|габарит|высот|глубин/i, 'ruler'],
  [/точност|дозир/i, 'target'],
  [/аэрац|аэратор|воздух/i, 'wind'],
  [/насос/i, 'cycle'],
  [/фасовк|форма|комплектац/i, 'box'],
  [/зон/i, 'grid'],
  [/применен|назначен/i, 'pin'],
  [/производител|сери|модельн|линейк|тип|пример|состав/i, 'stack'],
  [/технолог|принцип|особенност|опци/i, 'sparkles']
]

const kind = computed(() => (RULES.find(([re]) => re.test(props.label)) || [, 'check'])[1])
</script>

<style scoped>
.esi { display: block; width: var(--ico, 40px); height: var(--ico, 40px); flex: none; }
</style>

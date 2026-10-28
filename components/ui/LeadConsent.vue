<template>
  <label class="lead-consent" :class="{ 'is-dark': dark }">
    <input
      type="checkbox"
      :checked="modelValue"
      required
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span>
      Согласен на обработку персональных данных по
      <NuxtLink to="/privacy" target="_blank">политике конфиденциальности</NuxtLink>
    </span>
    <!-- Ловушка для ботов: человек это поле не видит и не заполняет. -->
    <input
      type="text"
      name="website"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
      class="lead-consent__trap"
    />
  </label>
</template>

<script setup>
// Согласие по Закону РБ № 99-З: без отметки форма не уходит (проверяет и сервер).
defineProps({ modelValue: Boolean, dark: Boolean })
defineEmits(['update:modelValue'])
</script>

<style scoped>
.lead-consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(26, 26, 26, 0.7);
  cursor: pointer;
  text-align: left;
}
.lead-consent.is-dark { color: rgba(255, 255, 255, 0.75); }
.lead-consent input[type='checkbox'] {
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: #002366;
}
.lead-consent a { color: #002366; text-decoration: underline; }
.lead-consent.is-dark a { color: #fff; }
.lead-consent__trap {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>

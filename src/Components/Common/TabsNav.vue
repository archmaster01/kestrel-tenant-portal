<template>
  <div class="flex border-b border-gray-700 bg-gray-950/50 px-4 shrink-0 overflow-x-auto scrollbar-hide">
    <button
      v-for="tab in tabs"
      :key="tab"
      @click="$emit('update:modelValue', tab)"
      class="px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap"
      :class="modelValue === tab ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
});
defineEmits(['update:modelValue']);
</script>
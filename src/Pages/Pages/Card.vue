<template>
  <div class="flex justify-between items-center w-full gap-4">
    <div class="flex flex-col overflow-hidden">
      <span class="font-medium text-white truncate text-sm" :title="item.url">{{ item.url }}</span>
      <span class="text-[10px] text-gray-500 truncate mt-0.5">{{ item.website?.domain || 'No Domain Assigned' }}</span>
    </div>
    <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0" :class="statusClass">
      {{ statusText }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: { type: Object, required: true }
});

const isScraped = computed(() => !!props.item.extracted_at);

const statusText = computed(() => isScraped.value ? 'Scraped' : 'Pending');

const statusClass = computed(() => {
  return isScraped.value 
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-gray-800 text-gray-400 border-gray-700';
});
</script>
<template>
  <div class="px-4 py-2.5 flex justify-between items-center text-xs text-gray-400 shrink-0 border-gray-800" :class="customClass">
    <button @click="$emit('update:page', page - 1)" :disabled="page <= 1 || isLoading" class="hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-2 transition-colors font-medium uppercase tracking-wider">
      &larr; Prev
    </button>
    
    <!-- 🚀 Interactive Page Indicator -->
    <div 
      @dblclick.prevent.stop="startEditingPage"
      class="font-medium bg-gray-900 px-3 py-1 rounded border shadow-inner flex items-center justify-center min-w-[75px] transition-colors select-none"
      :class="!editingPage && !isLoading ? 'border-gray-800 hover:border-gray-600 cursor-text' : 'border-gray-800'"
      title="Doble clic para saltar a una página"
    >
      <template v-if="!editingPage">
        {{ page }} <span class="text-gray-600 mx-1">/</span> {{ totalPages || 1 }}
      </template>
      <template v-else>
        <input 
          v-model="jumpToPage"
          v-focus
          @blur="submitPage"
          @keyup.enter="submitPage"
          @keyup.esc="editingPage = false"
          type="text"
          class="w-7 bg-transparent text-center text-white p-0 m-0 border-none focus:ring-0 outline-none text-xs font-medium"
        />
        <span class="text-gray-600 mx-1">/</span> 
        <span class="text-gray-400">{{ totalPages || 1 }}</span>
      </template>
    </div>

    <button @click="$emit('update:page', page + 1)" :disabled="page >= totalPages || totalPages === 0 || isLoading" class="hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-2 transition-colors font-medium uppercase tracking-wider">
      Next &rarr;
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  isLoading: { type: Boolean, default: false },
  customClass: { type: String, default: 'bg-gray-950/40' } // Allows styling overrides for top vs bottom
});

const emit = defineEmits(['update:page']);

// Inline Page Editing State
const editingPage = ref(false);
const jumpToPage = ref(1);

// Custom directive to auto-focus the input
const vFocus = {
  mounted: (el) => {
    setTimeout(() => {
      el.focus();
      el.select();
    }, 50);
  }
};

const startEditingPage = () => {
  if (props.isLoading) return; 
  jumpToPage.value = props.page;
  editingPage.value = true;
};

const submitPage = () => {
  if (!editingPage.value) return;
  
  let p = parseInt(jumpToPage.value, 10);
  
  if (!isNaN(p)) {
    if (p < 1) p = 1;
    if (p > props.totalPages) p = props.totalPages;
    
    if (p !== props.page) {
      emit('update:page', p);
    }
  }
  
  editingPage.value = false;
};
</script>
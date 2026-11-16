<template>
  <button
    v-if="text"
    @click="copy"
    type="button"
    :title="copied ? '¡Copiado!' : 'Copiar al portapapeles'"
    class="shrink-0 rounded-lg p-2 transition-colors flex items-center justify-center border"
    :class="copied 
      ? 'text-emerald-400 bg-emerald-900/20 border-emerald-800/50 hover:bg-emerald-900/30' 
      : 'text-gray-400 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:text-white'"
  >
    <!-- Check Icon -->
    <svg v-if="copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <!-- Copy Icon -->
    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
    </svg>
  </button>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  text: {
    type: [String, Number],
    default: ''
  }
});

const copied = ref(false);

const copy = async () => {
  if (!props.text) return;
  
  try {
    // 1. Try modern Async Clipboard API (HTTPS or localhost)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.text);
    } 
    // 2. Fallback for non-secure contexts (like http://kestrel-portal.test)
    else {
      const textArea = document.createElement("textarea");
      textArea.value = props.text;
      // Prevent scrolling to bottom
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (!successful) throw new Error('Fallback copy command failed');
    }

    // Trigger visual feedback
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1500);
    
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
</script>
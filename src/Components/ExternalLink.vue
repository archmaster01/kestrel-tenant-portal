<template>
  <a 
    :href="href" 
    :target="target" 
    :rel="target === '_blank' ? 'noopener noreferrer' : null"
    class="shrink-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-emerald-400 hover:text-emerald-300 px-4 rounded-lg transition-colors"
    :title="title"
  >
    <!-- Use a slot so you can pass custom text/icons, but default to the external link icon -->
    <slot>
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
      </svg>
    </slot>
  </a>
</template>

<script setup>
defineProps({
  href: { type: String, required: true },
  target: { type: String, default: '_blank' }, // Can be '_blank' or '_self'
  title: { type: String, default: 'Abrir enlace' }
});
</script>
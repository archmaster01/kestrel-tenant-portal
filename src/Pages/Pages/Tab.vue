<template>
  <div class="p-6 h-full overflow-y-auto flex flex-col gap-4">
    <!-- Header & Actions -->
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center gap-3">
        <h3 class="text-lg font-bold text-white tracking-wide">Scraped URLs</h3>
        <span class="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
          {{ items.length }} totales
        </span>
      </div>
      <button @click="triggerRescrape" class="bg-gray-800 hover:bg-gray-700 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-gray-700 rounded shadow-sm transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Re-Scrape
      </button>
    </div>

    <!-- Data Table -->
    <div v-if="items.length > 0" class="border border-gray-700/60 rounded-xl overflow-hidden shadow-lg bg-gray-900/50">
      <table class="w-full text-left text-sm text-gray-300">
        <thead class="bg-gray-950/80 text-xs uppercase text-gray-500 font-semibold border-b border-gray-700/60">
          <tr>
            <th class="px-5 py-3">URL</th>
            <th class="px-5 py-3 w-32">Status</th>
            <th class="px-5 py-3 w-24 text-right">Words</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800/50">
          <tr v-for="page in items" :key="page.id" class="hover:bg-gray-800/50 transition-colors">
            <td class="px-5 py-3 truncate max-w-md" :title="page.url">
              <a :href="page.url" target="_blank" class="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                {{ page.url }}
              </a>
            </td>
            <td class="px-5 py-3">
              <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0"
                    :class="['scraped', 'completed'].includes((page.status || '').toLowerCase()) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'">
                {{ page.status || 'Pending' }}
              </span>
            </td>
            <td class="px-5 py-3 text-right text-gray-400 font-medium">
              {{ getWordCount(page).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center p-12 bg-gray-900/30 border border-gray-700/50 border-dashed rounded-xl flex-1">
      <svg class="w-12 h-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <p class="text-gray-400 font-medium text-sm">No pages have been scraped for this domain yet.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

const getWordCount = (page) => {
  if (typeof page.word_count === 'number') return page.word_count;
  const text = (page.context_markdown || '').trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
};

const triggerRescrape = () => {
  alert('Rescrape functionality pending API integration.');
};
</script>
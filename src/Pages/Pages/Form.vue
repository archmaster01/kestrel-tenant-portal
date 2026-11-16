<template>
  <div class="p-6 flex flex-col gap-6 overflow-y-auto h-full">
    
    <!-- Context Header & Manual Trigger -->
    <div class="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
      <div>
        <h3 class="text-white font-bold text-lg">Page Extractor</h3>
        <p class="text-xs text-gray-400 mt-1">Words extracted: <span class="text-emerald-400 font-medium">{{ wordCount.toLocaleString() }}</span></p>
      </div>
      
      <!-- 🚀 Smart Button Logic (Now with clean Spinner) -->
      <button 
        v-if="modelValue.id" 
        @click="triggerScrape" 
        :disabled="isScraping || modelValue.status === 'blocked'" 
        :title="modelValue.status === 'blocked' ? 'Scraping bloqueado permanentemente por WAF' : 'Iniciar extracción'"
        class="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <!-- 🚀 Using our Spinner.vue -->
        <Spinner v-if="isScraping" class="animate-spin h-4 w-4 text-gray-950" />
        
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        
        {{ isScraping ? 'Scraping...' : (modelValue.status === 'completed' ? 'Re-Scrape Data' : (modelValue.status === 'blocked' ? 'Blocked (WAF)' : 'Scrape Now')) }}
      </button>
    </div>

    <!-- Data Fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="col-span-1 md:col-span-2">
        <label class="block text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">Target URL</label>
        
        <div class="flex gap-2">
          <input 
            type="url" 
            v-model="modelValue.url" 
            :readonly="mode === 'view'" 
            class="flex-1 w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-200 px-4 py-2 transition-colors font-medium text-lg" 
            :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''" 
            placeholder="https://..." 
          />
          
          <!-- 🚀 Using our new ExternalLink component! -->
          <ExternalLink 
            v-if="modelValue.url" 
            :href="modelValue.url" 
            target="_blank" 
            title="Abrir en una nueva pestaña" 
          />
        </div>
      </div>

      <!-- 🚀 New Status Indicator -->
      <div>
        <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Status</label>
        <div class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors"
             :class="{
               'text-gray-400': !modelValue.status || modelValue.status === 'pending',
               'text-emerald-400': modelValue.status === 'completed',
               'text-red-400': modelValue.status === 'blocked' || modelValue.status === 'failed'
             }">
          {{ modelValue.status || 'Pending' }}
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Last Extracted</label>
        <div class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors" :class="!modelValue.extracted_at ? 'italic text-gray-500' : ''">
          {{ modelValue.extracted_at ? formatTimestamp(modelValue.extracted_at) : 'Never scraped' }}
        </div>
      </div>
      
      <div>
        <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Associated Domain</label>
        <select v-model="modelValue.website_id" :disabled="mode === 'view'" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-3 py-2 transition-colors disabled:opacity-70 disabled:cursor-default">
          <option value="" disabled>Select Website...</option>
          <option v-for="site in dependencies.websites" :key="site.id" :value="site.id">
            {{ site.domain }}
          </option>
        </select>
      </div>

      <!-- Raw Content Output -->
      <div class="col-span-1 md:col-span-2 flex flex-col h-[400px]">
        <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Extracted Markdown Content</label>
        <textarea v-model="modelValue.context_markdown" :readonly="mode === 'view'" class="w-full flex-1 bg-gray-950 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-emerald-400/80 px-4 py-3 resize-none transition-colors font-mono text-xs leading-relaxed" :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''" placeholder="Raw scraped text will appear here..."></textarea>
      </div>
    </div>

  </div>
</template>

<script setup>
import { watch, computed, ref } from 'vue'; // 🚀 Added ref
import axios from 'axios';
import { formatTimestamp } from '../../utils/format-timestamp'; 
import Spinner from '@/Components/Spinner.vue'; // 🚀 Added Spinner
import ExternalLink from '@/Components/ExternalLink.vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
  mode: { type: String, default: 'view' },
  dependencies: { type: Object, default: () => ({}) }
});

const isScraping = ref(false); // 🚀 New loading state

const wordCount = computed(() => {
  if (!props.modelValue.context_markdown) return 0;
  return props.modelValue.context_markdown.trim().split(/\s+/).length;
});

watch(() => props.mode, (newMode) => {
  if (newMode === 'edit' && !props.modelValue.id && Object.keys(props.modelValue).length === 0) {
    Object.assign(props.modelValue, {
      url: '',
      website_id: '',
      status: 'pending', // 🚀 Initialize new status field
      extracted_at: null,
      context_markdown: ''
    });
  }
}, { immediate: true });

const triggerScrape = async () => {
  if(!props.modelValue.id) return;

  // 🚀 Hard block just in case they bypass the UI disabled state
  if (props.modelValue.status === 'blocked') {
    alert("Esta página está bloqueada por un WAF (Cloudflare). No se puede realizar scraping.");
    return;
  }

  // 🚀 Warn only if it previously succeeded
  if (props.modelValue.status === 'completed') {
    const isConfirmed = confirm("This page has already been scraped successfully. Re-scraping will consume API credits and overwrite the existing markdown. Do you want to proceed?");
    if (!isConfirmed) return;
  }

  isScraping.value = true;

  try {
    const { data } = await axios.post(`/scraped-pages/${props.modelValue.id}/scrape`);
    Object.assign(props.modelValue, data);
  } catch (error) {
    console.error("Scrape failed", error);
    
    // 🚀 If the backend throws our WAF exception, we still update the UI data so the status goes to 'blocked'
    if (error.response?.data?.page) {
       Object.assign(props.modelValue, error.response.data.page);
    }
    
    const backendMessage = error.response?.data?.message || "Unknown error occurred";
    alert(`Scrape Failed:\n\n${backendMessage}`);
  } finally {
    isScraping.value = false;
  }
};
</script>
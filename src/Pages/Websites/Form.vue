<template>
  <div class="p-6 space-y-6">
    <!-- Top Row: Domain & Seller -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Domain Edit (Takes up 2 columns on large screens) -->
      <div class="lg:col-span-2">
        <label class="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Dominio Web</label>
        <div class="flex items-center gap-2">
          <input 
            type="text" 
            v-model="modelValue.domain" 
            :readonly="mode === 'view'" 
            class="flex-1 bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-white font-medium text-lg px-4 py-2 transition-colors" 
            :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''" 
            placeholder="ejemplo.com" 
          />
          
          <!-- Botón para Scrapear Sitio -->
          <!-- <button
            v-if="modelValue.id"
            @click.prevent="triggerScrape"
            :disabled="isScraping"
            type="button"
            title="Extraer datos con Jina"
            class="shrink-0 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Spinner v-if="isScraping" class="w-6 h-6" />
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button> -->

          <!-- Botón para abrir el Demo -->
          <a 
            v-if="modelValue.domain"
            :href="`/demo/${modelValue.domain}`" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Probar Demo del Agente"
            class="shrink-0 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-emerald-500 hover:text-emerald-400 transition-colors flex items-center justify-center"
          >
            <IconPlayCircle class="w-6 h-6" />
          </a>

          <!-- Botón original: Abrir sitio web -->
          <a 
            v-if="modelValue.domain"
            :href="formattedUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Abrir sitio web"
            class="shrink-0 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
          >
            <IconExternalLink class="w-6 h-6" />
          </a>
        </div>
      </div>

      <!-- Seller / Agency (Takes up 1 column) -->
      <div>
        <label class="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Seller / Partner</label>
        <select 
            v-model="modelValue.seller_id" 
            :disabled="mode === 'view'" 
            class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-white font-medium text-lg px-4 py-2 transition-colors disabled:opacity-70 disabled:cursor-default" 
            :class="mode === 'view' ? 'focus:border-gray-700' : ''"
        >
            <option :value="null">Direct Sales (None)</option>
            <option v-for="seller in dependencies.sellers" :key="seller.id" :value="seller.id">
                {{ seller.name }} {{ seller.agency_name ? `— ${seller.agency_name}` : '' }}
            </option>
        </select>
      </div>

    </div>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      
      <!-- Row 1 -->
      <div>
        <label class="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Estado</label>
        <select v-model="modelValue.status" :disabled="mode === 'view'" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-200 px-3 py-2 text-sm transition-colors disabled:opacity-70 disabled:cursor-default">
          <option value="prospecting">Prospecting</option>
          <option value="trial">Trial</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="opted_out">🔕 Opted-Out (Baja)</option>
        </select>
      </div>
      <div>
        <label class="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Email Contacto</label>
        <div class="flex items-center gap-1">
          <input type="email" v-model="modelValue.email" :readonly="mode === 'view'" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-200 px-3 py-2 text-sm transition-colors truncate" :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''" />
          <CopyButton :text="modelValue.email" />
        </div>
      </div>
      <div>
        <label class="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">WhatsApp CRM</label>
        <div class="flex items-center gap-1">
          <input type="text" v-model="modelValue.whatsapp_number" :readonly="mode === 'view'" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-200 px-3 py-2 text-sm transition-colors truncate" :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''" />
          <CopyButton :text="modelValue.whatsapp_number" />
        </div>
      </div>
      
      <!-- Row 2 -->
      <div>
        <label class="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Color de Marca</label>
        <div class="flex items-center gap-2">
          <input 
            type="color" 
            :value="modelValue.brand_color || '#10B981'" 
            @input="modelValue.brand_color = $event.target.value"
            :disabled="mode === 'view'" 
            class="h-9 w-12 rounded bg-gray-900 border border-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-default shrink-0" 
          />
          <span class="text-sm text-gray-400 truncate">{{ modelValue.brand_color || '#10B981' }}</span>
        </div>
      </div>
      <!-- Archivo Mockup -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Archivo Mockup</label>
          
          <!-- 🚀 Physical File Status Indicator -->
          <div v-if="modelValue.domain" class="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
            <span class="w-1.5 h-1.5 rounded-full" :class="modelValue.has_mockup ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'"></span>
            <span :class="modelValue.has_mockup ? 'text-emerald-500' : 'text-red-500'">
              {{ modelValue.has_mockup ? 'Encontrado' : 'Faltante' }}
            </span>
          </div>
        </div>
        
        <div class="flex items-center gap-1">
          <input 
            type="text" 
            :value="modelValue.mockup_image" 
            readonly 
            class="w-full bg-gray-900 border border-gray-700 rounded-lg outline-none text-gray-400 px-3 py-2 text-sm cursor-default opacity-70 truncate" 
            placeholder="Requiere dominio"
          />
          <CopyButton :text="modelValue.mockup_image" />
        </div>
      </div>
      
    </div>

    <!-- Business Profile & Widget Config -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Business Profile -->
      <div class="border border-gray-700 rounded-xl overflow-hidden">
        <div class="bg-gray-900/80 px-4 py-2.5 border-b border-gray-700 flex items-center justify-between">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Perfil de Negocio
          </span>

          <!-- 🚀 RESTORED: Gemini AI Extraction Button -->
          <div v-if="modelValue.id" class="flex items-center gap-2">
            <span
              v-if="modelValue.contact_info_parsed_at"
              :title="`Analizado el ${new Date(modelValue.contact_info_parsed_at).toLocaleString()}`"
              class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded"
            >
              ✓ Analizado con IA
            </span>
            <button
              v-else
              @click.prevent="triggerExtraction"
              :disabled="isExtracting"
              type="button"
              class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Spinner v-if="isExtracting" class="w-3.5 h-3.5" />
              <span v-else>✨</span>
              <span>{{ isExtracting ? 'Extrayendo...' : 'Extraer con IA' }}</span>
            </button>
          </div>
        </div>
        <div class="p-4 bg-gray-800/30 space-y-4 h-full">
          <div>
            <label class="text-xs text-gray-500 block mb-1">Nombre Comercial</label>
            <input type="text" v-model="modelValue.business_name" :readonly="mode === 'view'" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-3 py-2 text-sm transition-colors" :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''" />
          </div>
          <!-- Slogan Comercial -->
          <div>
            <label class="text-xs text-gray-500 block mb-1">Slogan / Frase Comercial</label>
            <input
              type="text"
              v-model="modelValue.slogan"
              :readonly="mode === 'view'"
              placeholder="Ej. El escenario perfecto para tus eventos en Querétaro"
              class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-3 py-2 text-sm transition-colors"
              :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''"
            />
          </div>

          <!-- Logo del Negocio -->
          <div>
            <label class="text-xs text-gray-500 block mb-1">Logo del Negocio (URL o Subir Imagen)</label>
            <div class="flex items-center gap-2">
              <div
                v-if="modelValue.logo_url"
                class="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0 p-1"
              >
                <img :src="modelValue.logo_url" alt="Logo" class="max-w-full max-h-full object-contain" />
              </div>
              <input
                type="text"
                v-model="modelValue.logo_url"
                :readonly="mode === 'view'"
                placeholder="/storage/logos/... o https://..."
                class="flex-1 bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-3 py-2 text-sm transition-colors"
                :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''"
              />
              <label
                class="shrink-0 rounded-lg px-3 py-2 text-xs font-bold border transition-colors flex items-center gap-1.5"
                :class="mode === 'view'
                  ? 'bg-gray-900 text-gray-500 border-gray-800 cursor-not-allowed opacity-60'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/30 cursor-pointer'"
                :title="mode === 'view' ? 'Haz clic en Editar (lápiz) para subir un logo' : 'Seleccionar imagen desde tu computadora'"
              >
                <span>📁 {{ isUploadingLogo ? 'Subiendo...' : 'Subir Logo' }}</span>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleLogoUpload"
                  :disabled="mode === 'view' || isUploadingLogo"
                />
              </label>
            </div>
          </div>
          <div>
            <label class="text-xs text-gray-500 block mb-1">Tipo de Negocio</label>
            <input type="text" v-model="modelValue.business_type" :readonly="mode === 'view'" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-3 py-2 text-sm transition-colors" :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-500 block mb-1">Tamaño</label>
              <input
                type="text"
                v-model="modelValue.business_size"
                :readonly="mode === 'view'"
                class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-3 py-2 text-sm transition-colors"
                :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''"
              />
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Ubicación</label>
              <input
                type="text"
                v-model="modelValue.location"
                :readonly="mode === 'view'"
                placeholder="Ciudad, Estado"
                class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-3 py-2 text-sm transition-colors"
                :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Widget Configuration -->
      <div class="border border-gray-700 rounded-xl overflow-hidden">
        <div class="bg-gray-900/80 px-4 py-3 border-b border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Configuración del Widget
        </div>
        <!-- 🚀 NUEVO: Widget Snippet / Installation Code -->
        <div class="mt-6 pt-6 border-t border-gray-700/50 px-4">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Código de Instalación (Snippet)
            </label>
             <button 
              @click.prevent="copy(modelValue.snippet)"
              class="text-xs flex items-center gap-1.5 transition-colors font-medium px-2 py-1 rounded hover:bg-white/5"
              :class="copied ? 'text-emerald-400' : 'text-gray-400 hover:text-white'"
            >
              <IconCheck v-if="copied" class="w-4 h-4" />
              <IconCopy v-else class="w-4 h-4" />
              {{ copied ? '¡Copiado!' : 'Copiar Código' }}
            </button>
          </div>
          
          <div class="bg-black/40 border border-gray-700/80 rounded-lg p-4 relative overflow-x-auto group">
            <pre class="text-[11px] text-emerald-300/90 font-mono whitespace-pre-wrap select-all leading-relaxed">{{ modelValue.snippet || 'Guarda el dominio para generar el snippet de instalación...' }}</pre>
          </div>
          <p class="text-[10px] text-gray-500 mt-2">
            Inserta este código justo antes de la etiqueta de cierre &lt;/body&gt; en el sitio web.
          </p>
        </div>
        <div class="p-4 bg-gray-800/30 space-y-4 h-full">
          <div>
            <label class="text-xs text-gray-500 block mb-1">Mensaje de Bienvenida (Greeting)</label>
            <textarea v-model="modelValue.greeting" :readonly="mode === 'view'" rows="1" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-3 py-2 text-sm transition-colors resize-none" :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label class="text-xs text-gray-500 block mb-1">Posición</label>
              <select v-model="modelValue.widget_position" :disabled="mode === 'view'" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-2 py-2 text-sm transition-colors disabled:opacity-70 disabled:cursor-default">
                <option value="down-right">Abajo Derecha</option>
                <option value="down-left">Abajo Izquierda</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Tema</label>
              <select v-model="modelValue.widget_mode" :disabled="mode === 'view'" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-2 py-2 text-sm transition-colors disabled:opacity-70 disabled:cursor-default">
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Ground Truth Data -->
    <div>
      <label class="block text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">
          Verdades Rápidas (Ground Truth Data)
      </label>
      <textarea 
          v-model="modelValue.ground_truth_data" 
          :readonly="mode === 'view'" 
          rows="5" 
          placeholder="E.g., El 25 de diciembre permaneceremos cerrados. / Ofrecemos 10% de descuento en pagos en efectivo."
          class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-300 px-4 py-3 resize-none transition-colors"
          :class="mode === 'view' ? 'opacity-70 cursor-default focus:border-gray-700' : ''"
      ></textarea>
      <p class="text-[10px] text-gray-500 mt-1">This context overrides or complements the scraped data.</p>
    </div>

    <!-- 🚀 Matriz de Personalidad y Comportamiento IA (Por Sitio / Cliente) -->
    <PromptMatrixForm
      v-model="modelValue.ai_parameters"
      mode="customer"
      :readonly="mode === 'view'"
    />
  </div>
</template>

<script setup>
import { watch, computed, ref } from 'vue';
import axios from 'axios';
import CopyButton from '@/Components/CopyButton.vue';
import Spinner from '@/Components/Spinner.vue';

import IconExternalLink from '@/Components/Icons/ExternalLink.vue';
import IconPlayCircle from '@/Components/Icons/PlayCircle.vue';
import IconCopy from '@/Components/Icons/Copy.vue';
import IconCheck from '@/Components/Icons/Check.vue';
import { useClipboard } from '@/Composables/useClipboard';
import PromptMatrixForm from '@/Components/PromptMatrixForm.vue';

const isExtracting = ref(false);
const { copied, copy } = useClipboard();

const props = defineProps({
  modelValue: { type: Object, required: true },
  mode: { type: String, default: 'view' },
  dependencies: { type: Object, default: () => ({}) }
});

const formattedUrl = computed(() => {
  const domain = props.modelValue.domain || '';
  if (domain.endsWith('.no-url')) {
    return `/chat/${domain}`;
  }
  if (domain.startsWith('http://') || domain.startsWith('https://')) {
    return domain;
  }
  return `https://${domain}`;
});

// 🚀 Safe clipboard copy function
const copyMockupName = async () => {
  if (!props.modelValue.mockup_image) return;
  try {
    await navigator.clipboard.writeText(props.modelValue.mockup_image);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

const isScraping = ref(false);

const triggerScrape = async () => {
  if (!props.modelValue.id) return;
  
  isScraping.value = true;
  
  try {
    await axios.post(`/scraped-pages/${props.modelValue.id}/scrape`);
    console.log('Scraping iniciado correctamente');
  } catch (error) {
    console.error('Error triggering scrape:', error);
    alert('Hubo un error al iniciar el scraping.');
  } finally {
    isScraping.value = false;
  }
};

const triggerExtraction = async () => {
  if (!props.modelValue.id) return;
  isExtracting.value = true;
  
  try {
    const { data } = await axios.post(`/websites/${props.modelValue.id}/extract`);
    Object.assign(props.modelValue, data); 
  } catch (error) {
    alert(error.response?.data?.message || 'Error al extraer datos.');
  } finally {
    isExtracting.value = false;
  }
};

const isUploadingLogo = ref(false);

const handleLogoUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // If the record hasn't been saved yet (no ID), convert small logo to data URL or prompt save
  if (!props.modelValue.id) {
    const reader = new FileReader();
    reader.onload = (e) => {
      props.modelValue.logo_url = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
    return;
  }

  isUploadingLogo.value = true;
  const formData = new FormData();
  formData.append('logo', file);

  try {
    const { data } = await axios.post(`/websites/${props.modelValue.id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    props.modelValue.logo_url = data.logo_url;
  } catch (error) {
    alert(error.response?.data?.message || 'Error al subir el logotipo.');
  } finally {
    isUploadingLogo.value = false;
    event.target.value = '';
  }
};

// Hydrate empty template when a new website is created
watch(() => props.mode, (newMode) => {
  if (newMode === 'edit' && !props.modelValue.id) {
    if (Object.keys(props.modelValue).length === 0) {
      Object.assign(props.modelValue, {
        domain: '',
        status: 'prospecting',
        email: '',
        whatsapp_number: '',
        brand_color: '#10B981', 
        business_name: '',
        business_type: '',
        business_size: '',
        location: '',
        greeting: '',
        widget_position: 'down-right',
        widget_mode: 'dark',
        widget_initial_state: 'closed',
        ai_parameters: {
          commercial_aggressiveness: 'low',
          conversational_warmth: 'high',
          unlisted_info_strategy: 'acknowledge_and_bridge',
          price_anchoring: false,
          max_sentences: 3,
        }
      });
    }
  }
}, { immediate: true });
</script>
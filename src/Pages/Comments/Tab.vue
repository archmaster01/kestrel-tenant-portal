<template>
  <div class="p-6 h-full flex flex-col bg-gray-900/20">
    
    <!-- Input Section -->
    <div class="mb-6 bg-gray-900 p-4 rounded-xl border border-gray-700/60 shadow-sm shrink-0">
      <textarea 
        v-model="form.comentario"
        rows="3"
        placeholder="Escribe un comentario o nota interna sobre este registro..."
        class="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg p-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
      ></textarea>
      
      <div class="mt-3 flex justify-between items-center">
        <label class="flex items-center gap-2 text-gray-400 text-xs cursor-pointer">
          <input type="checkbox" v-model="form.privado" class="w-3.5 h-3.5 rounded border-gray-700 text-emerald-500 focus:ring-emerald-500 bg-gray-950">
          Marcar como nota privada
        </label>
        
        <button 
          @click="submitComment" 
          :disabled="form.processing || !form.comentario.trim()"
          class="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded shadow-sm transition-colors"
        >
          {{ form.processing ? 'Guardando...' : 'Agregar Nota' }}
        </button>
      </div>
    </div>

    <!-- Feed Section -->
    <div class="flex-1 overflow-y-auto pr-2">
      <h4 class="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Historial de Notas</h4>
      
      <div v-if="commentsList.length > 0" class="space-y-4">
        <div v-for="comment in commentsList" :key="comment.id" class="p-4 rounded-lg border bg-gray-900/50" :class="comment.privado ? 'border-amber-900/30' : 'border-gray-800'">
          <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-semibold text-gray-400 flex items-center gap-2">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Usuario ID: {{ comment.created_by }}
            </span>
            <div class="flex items-center gap-3">
              <span v-if="comment.privado" class="text-[9px] uppercase tracking-wider font-bold bg-amber-900/30 text-amber-500 px-1.5 py-0.5 rounded border border-amber-800/50">Privado</span>
              <span class="text-[10px] text-gray-600 font-medium">{{ new Date(comment.created_at).toLocaleDateString() }}</span>
            </div>
          </div>
          <p class="text-sm text-gray-300 whitespace-pre-wrap">{{ comment.comentario }}</p>
        </div>
      </div>
      
      <div v-else class="text-center py-12 border border-gray-800 border-dashed rounded-xl">
        <p class="text-gray-500 text-sm font-medium">Aún no hay comentarios en este registro.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';

const props = defineProps({
  parent: { type: Object, required: true },
  items: { type: Array, default: () => [] }
});

// 🚀 DYNAMIC MODEL TYPE RESOLUTION
// MasterIndex provides the context via Inertia page props (e.g., modelDirectory: 'Websites')
// We grab that and singularize it to satisfy Laravel's class_exists('App\\Models\\Website') constraint
const pageProps = usePage().props;
const modelType = (pageProps.modelDirectory || 'Website').replace(/s$/, '');

// 🚀 RELATIONSHIP MAPPING
// Because the tab is named "comments" in tabsConfig, MasterIndex looks for selectedItem['comments']. 
// However, your Laravel relationship is named `comentarios`. This computed property acts as a bridge.
const commentsList = computed(() => props.parent.comentarios || props.items || []);

const form = useForm({
  modelo_type: modelType, 
  modelo_id: props.parent.id,
  comentario: '',
  privado: false
});

const submitComment = () => {
  form.post('/comentarios', {
    preserveScroll: true,
    onSuccess: () => {
      
      // HACK: Optimistically insert the comment into the local state FIRST
      if (!props.parent.comentarios) props.parent.comentarios = [];
      
      props.parent.comentarios.unshift({
        id: Date.now(), // Temp ID
        comentario: form.comentario, // Safely grabs the text before reset
        privado: form.privado,
        created_by: usePage().props.auth?.user?.id || 'Tú', 
        created_at: new Date().toISOString()
      });

      // Clear the inputs AFTER the array has been updated
      form.reset('comentario', 'privado');
    }
  });
};
</script>
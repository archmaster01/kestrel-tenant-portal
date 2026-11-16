<template>
  <div class="p-4 space-y-4">
    <!-- Top Filter & Summary Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-gray-900/70 border border-gray-800 rounded-xl px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Historial de Conversaciones:</span>
        <span class="text-xs font-mono text-emerald-400">{{ parent?.domain }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="channelFilter = 'all'"
          class="px-3 py-1 rounded-lg text-xs font-bold transition-colors border"
          :class="channelFilter === 'all'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-gray-800/60 text-gray-400 border-gray-700 hover:text-gray-200'"
        >
          Todos ({{ messages.length }})
        </button>

        <button
          type="button"
          @click="channelFilter = 'web'"
          class="px-3 py-1 rounded-lg text-xs font-bold transition-colors border"
          :class="channelFilter === 'web'
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            : 'bg-gray-800/60 text-gray-400 border-gray-700 hover:text-gray-200'"
        >
          🌐 Demo / Widget Web ({{ webCount }})
        </button>

        <button
          type="button"
          @click="channelFilter = 'whatsapp'"
          class="px-3 py-1 rounded-lg text-xs font-bold transition-colors border"
          :class="channelFilter === 'whatsapp'
            ? 'bg-green-500/20 text-green-300 border-green-500/40'
            : 'bg-gray-800/60 text-gray-400 border-gray-700 hover:text-gray-200'"
        >
          💬 WhatsApp ({{ waCount }})
        </button>

        <button
          type="button"
          @click="fetchChats"
          class="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors"
          title="Actualizar mensajes"
        >
          ↻
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 text-center text-xs text-gray-400 animate-pulse">
      Cargando preguntas y respuestas de {{ parent?.domain }}...
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!filteredMessages.length"
      class="bg-gray-900/40 border border-gray-800/80 rounded-xl p-10 text-center space-y-2"
    >
      <div class="text-sm font-bold text-gray-300">Sin preguntas registradas en este canal</div>
      <p class="text-xs text-gray-500 max-w-md mx-auto">
        Aún no hay mensajes entre {{ parent?.business_name || parent?.domain }} y Kestrel AI en el filtro seleccionado.
        (Si el prospecto solo abrió la página demo pero no envió ninguna pregunta al chat, aparecerá en Telemetry pero sin mensajes aquí).
      </p>
    </div>

    <!-- Chat Bubbles Feed -->
    <div
      v-else
      class="bg-gray-950/60 border border-gray-800 rounded-xl p-4 space-y-3 max-h-[560px] overflow-y-auto"
    >
      <div
        v-for="msg in filteredMessages"
        :key="msg.id"
        class="flex flex-col"
        :class="msg.direction === 'inbound' ? 'items-start' : 'items-end'"
      >
        <!-- Sender + Channel Badge -->
        <div class="flex items-center gap-2 mb-1 px-1">
          <span
            class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
            :class="msg.channel === 'web'
              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
              : 'bg-green-500/15 text-green-300 border-green-500/30'"
          >
            {{ msg.channel === 'web' ? '🌐 Web' : '💬 WA' }}
          </span>
          <span class="text-[11px] font-semibold text-gray-400">{{ msg.sender }}</span>
          <span class="text-[10px] text-gray-500">{{ formatDateTime(msg.created_at) }}</span>
        </div>

        <!-- Bubble -->
        <div
          class="max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap border shadow-sm"
          :class="msg.direction === 'inbound'
            ? 'bg-gray-800/90 text-gray-100 border-gray-700 rounded-tl-sm'
            : (msg.channel === 'web'
                ? 'bg-purple-950/50 text-purple-100 border-purple-700/40 rounded-tr-sm'
                : 'bg-emerald-950/60 text-emerald-100 border-emerald-700/40 rounded-tr-sm')"
        >
          {{ msg.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  parent: { type: Object, required: true }
});

const loading = ref(false);
const messages = ref([]);
const webCount = ref(0);
const waCount = ref(0);
const channelFilter = ref('all');

const fetchChats = async () => {
  if (!props.parent?.id) return;
  loading.value = true;
  try {
    const { data } = await axios.get(`/websites/${props.parent.id}/chats`);
    messages.value = data.messages || [];
    webCount.value = data.web_count || 0;
    waCount.value = data.wa_count || 0;
  } catch (e) {
    console.error('Error loading website chats:', e);
  } finally {
    loading.value = false;
  }
};

const filteredMessages = computed(() => {
  if (channelFilter.value === 'all') return messages.value;
  return messages.value.filter(m => m.channel === channelFilter.value);
});

const formatDateTime = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

watch(() => props.parent?.id, fetchChats, { immediate: true });
</script>
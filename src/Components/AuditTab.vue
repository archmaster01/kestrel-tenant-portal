<template>
  <div class="p-6 space-y-6 h-full overflow-y-auto">
    
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-white tracking-wide">Registro de Auditoría</h3>
      <span class="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
        Record ID: {{ item.id || 'N/A' }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Timestamps -->
      <div class="bg-gray-900/50 border border-gray-700/60 rounded-xl p-5 space-y-4">
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-700/50 pb-2">Timestamps</h4>
        
        <div>
          <span class="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Created At</span>
          <span class="text-sm text-gray-200 font-medium">{{ formatDate(item.created_at) }}</span>
        </div>
        
        <div>
          <span class="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Last Modified</span>
          <span class="text-sm text-gray-200 font-medium">{{ formatDate(item.updated_at) }}</span>
        </div>

        <div v-if="item.deleted_at">
          <span class="block text-[10px] text-red-500 uppercase tracking-widest font-bold mb-1">Deleted At</span>
          <span class="text-sm text-gray-200 font-medium">{{ formatDate(item.deleted_at) }}</span>
        </div>
      </div>

      <!-- Authorship -->
      <div class="bg-gray-900/50 border border-gray-700/60 rounded-xl p-5 space-y-4">
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-700/50 pb-2">Authorship</h4>
        
        <div>
          <span class="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Created By</span>
          <span class="text-sm text-gray-200 font-medium">{{ item.creator?.name || item.created_by || 'System' }}</span>
        </div>
        
        <div>
          <span class="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Last Editor</span>
          <span class="text-sm text-gray-200 font-medium">{{ item.editor?.name || item.updated_by || 'System' }}</span>
        </div>
      </div>
    </div>
    
    <!-- Raw Data Dump (Collapsible or just standard block) -->
    <div class="border border-gray-700/60 rounded-xl overflow-hidden mt-4">
      <div class="bg-gray-900/80 px-4 py-3 border-b border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
        System Payload
      </div>
      <div class="p-4 bg-gray-950 overflow-x-auto">
        <pre class="text-xs text-emerald-400/80 font-mono">{{ JSON.stringify(item, null, 2) }}</pre>
      </div>
    </div>

  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit'
  }).format(date);
};
</script>
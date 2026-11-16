<template>
  <div class="flex items-center gap-1.5 p-2 bg-gray-950 border-b border-gray-800 rounded-t-xl shrink-0 justify-end">
    
    <!-- Contextual Extra Actions Slot (Approval, Retry, Pause, etc.) -->
    <slot name="extra-actions" />

    <!-- View Mode Actions -->
    <template v-if="mode === 'view'">
      <button v-if="showAdd" @click="$emit('add')" class="p-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-800 rounded transition-colors" title="Add">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
      </button>
      
      <!-- 🚀 Botón Duplicar Dinámico -->
      <button v-if="showDuplicate" @click="$emit('duplicate')" :title="duplicateLabel" class="p-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-800 rounded transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
      </button>

      <button v-if="showEdit" @click="$emit('edit')" class="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-colors" title="Edit">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
      </button>
      
      <button v-if="showDelete" @click="$emit('delete')" class="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors" title="Delete / Detach">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    </template>

    <!-- Edit Mode Actions (Save/Cancel) -->
    <template v-if="mode === 'edit'">
      <button @click="$emit('cancel')" class="p-2 text-gray-400 hover:text-amber-400 hover:bg-gray-800 rounded transition-colors" title="Cancel">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
      </button>
      
      <button @click="$emit('save')" :disabled="disableSave" class="p-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-800 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Save">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
      </button>
    </template>

  </div>
</template>

<script setup>
defineProps({
  mode: { type: String, default: 'view' },
  showAdd: { type: Boolean, default: true },
  showEdit: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  showDuplicate: { type: Boolean, default: true },
  duplicateLabel: { type: String, default: 'Duplicar registro' },
  disableSave: { type: Boolean, default: false },
});

defineEmits(['add', 'edit', 'delete', 'cancel', 'save', 'duplicate']);
</script>
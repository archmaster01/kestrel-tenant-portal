<template>
    <AuthenticatedLayout>
        <div class="p-6 bg-gray-900 min-h-[calc(100vh-64px)] text-gray-100 flex flex-col relative">
            
            <!-- Page Header Slot -->
            <!-- <div class="mb-6 shrink-0">
            <slot name="header">
                <h1 class="text-2xl font-bold text-white tracking-wide">Dashboard</h1>
            </slot>
            </div> -->

            <!-- Master-Detail Layout -->
            <div class="flex flex-1 overflow-hidden h-[calc(100vh-164px)]">
            
            <!-- Left Panel: Dynamic Width -->
            <div 
                class="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shrink-0 shadow-lg"
                :style="{ width: leftPanelWidth + '%' }"
            >
                <slot name="left-panel"></slot>
            </div>

            <!-- Resize Handle (Logic is completely contained here now) -->
            <div 
                @mousedown="startDrag"
                class="w-2 mx-2 cursor-col-resize flex items-center justify-center group shrink-0"
                title="Drag to resize"
            >
                <div 
                class="w-1 h-12 bg-gray-700 rounded-full group-hover:bg-emerald-500 transition-colors" 
                :class="isDragging ? 'bg-emerald-500' : ''"
                ></div>
            </div>

            <!-- Right Panel: Flex Fill -->
            <div v-if="hasSelection" class="flex-1 flex flex-col overflow-hidden">
                <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg shrink-0 flex flex-col h-full overflow-hidden">
                <slot name="right-panel"></slot>
                </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="flex-1 flex flex-col items-center justify-center bg-gray-800/50 border border-gray-700 border-dashed rounded-xl">
                <slot name="empty-state">
                <svg class="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <p class="text-gray-400 font-medium">Selecciona un elemento de la lista.</p>
                </slot>
            </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import { ref } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';

const props = defineProps({
  // Allows the parent to dictate if the right panel or empty state should show
  hasSelection: {
    type: Boolean,
    required: true
  },
  // Allows customizing the starting width per page
  defaultLeftWidth: {
    type: Number,
    default: 25
  }
});

// Reusable Resizable Pane Logic
const leftPanelWidth = ref(props.defaultLeftWidth);
const isDragging = ref(false);

const startDrag = () => {
  isDragging.value = true;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  const newWidth = (e.clientX / window.innerWidth) * 100;
  if (newWidth > 15 && newWidth < 40) {
    leftPanelWidth.value = newWidth;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};
</script>
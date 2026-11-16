<template>
  <div class="flex flex-col h-full bg-gray-900 border-r border-gray-800">
    
    <!-- Header -->
    <div class="p-4 border-b border-gray-800 flex justify-between items-center shrink-0">
      <h2 class="text-lg font-bold text-white tracking-wide uppercase text-sm">
        {{ title }} <span class="text-gray-500 ml-1">({{ totalItems !== null ? totalItems : items.length }})</span>
      </h2>
      
      <!-- 🚀 Action Buttons Container -->
      <div class="flex items-center gap-2">
        <!-- Select / Deselect Visible Page (Multi-select mode only) -->
        <button
          v-if="selectable && selectableVisibleItems.length > 0"
          @click="toggleSelectVisible"
          type="button"
          class="px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors"
          :class="allVisibleSelected
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'"
        >
          {{ allVisibleSelected ? 'Deseleccionar página' : 'Seleccionar página' }}
        </button>

        <!-- Refresh Button -->
        <button 
          @click="$emit('refresh')" 
          :disabled="isLoading"
          type="button"
          class="bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-lg"
          title="Actualizar datos"
        >
          <svg :class="{ 'animate-spin': isLoading }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>

        <!-- Create Button -->
        <button
          v-if="showCreate"
          @click="$emit('create')"
          type="button"
          class="bg-emerald-500 hover:bg-emerald-400 text-gray-950 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-lg"
          title="Nuevo registro"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="p-4 border-b border-gray-800 bg-gray-900/50 shrink-0 transition-all">
      
      <!-- Top Row: Search Input & Settings Toggle -->
      <div class="flex gap-2">
        <div class="relative flex-1">
          <input
            type="text"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="searchPlaceholder"
            class="w-full bg-gray-950 border border-gray-700 focus:border-emerald-500 rounded-lg outline-none text-gray-200 pl-4 pr-10 py-2 text-sm transition-colors"
          />
          <button 
            v-if="modelValue" 
            @click="$emit('update:modelValue', '')"
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <!-- 🚀 Filter/Sort Toggle Button -->
        <button 
          @click="showSettings = !showSettings"
          type="button"
          class="relative bg-gray-950 border rounded-lg px-3 flex items-center justify-center transition-colors outline-none shrink-0"
          :class="(showSettings || hasActiveFilters) ? 'border-emerald-500 text-emerald-400' : 'border-gray-700 text-gray-400 hover:border-gray-500'"
          title="Toggle Filters & Sorting"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          <span
            v-if="hasActiveFilters"
            class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-gray-900"
          ></span>
        </button>
      </div>

      <!-- 🚀 Collapsible Settings Panel -->
      <div v-show="showSettings" class="mt-3 pt-3 border-t border-gray-800/60 space-y-3">
        
        <!-- Standard Filters & Pagination Limit Loop -->
        <div v-if="(filterConfig && filterConfig.length) || hasPagination" class="flex flex-wrap items-center gap-2">
          <select 
            v-for="filter in filterConfig" 
            :key="filter.name"
            :value="activeFilters[filter.name] || ''"
            @change="$emit('updateFilter', filter.name, $event.target.value)"
            class="flex-1 min-w-[130px] bg-gray-900 border border-gray-800 text-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
          >
            <option v-for="(label, value) in filter.options" :key="value" :value="value">
              {{ label }}
            </option>
          </select>

          <!-- Items Per Page Selector -->
          <select
            v-if="hasPagination"
            :value="itemsPerPage"
            @change="$emit('update:itemsPerPage', Number($event.target.value))"
            class="bg-gray-950 border border-gray-700 rounded-lg text-sm text-gray-300 px-3 py-1.5 outline-none focus:border-emerald-500 transition-colors shrink-0 w-28"
          >
            <option :value="8">8 items</option>
            <option :value="10">10 items</option>
            <option :value="15">15 items</option>
            <option :value="25">25 items</option>
            <option :value="50">50 items</option>
            <option :value="100">100 items</option>
          </select>

          <!-- Clear Filters Button -->
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-1.5 shrink-0"
            title="Restablecer búsqueda y filtros"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </button>
        </div>

        <!-- Sorting Pills Row -->
        <div v-if="Object.keys(sortConfig).length > 0" class="flex flex-wrap items-center gap-2">
          <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider shrink-0 mr-1">Ordenar:</span>
          
          <button
            v-for="(label, key) in sortConfig"
            :key="key"
            @click="toggleSort(key)"
            type="button"
            class="px-3 py-1 text-xs font-medium rounded-full border transition-all flex items-center gap-1.5 shrink-0"
            :class="activeFilters.sort_by === key 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm' 
              : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200 hover:bg-gray-800'"
          >
            {{ label }}
            <template v-if="activeFilters.sort_by === key">
              <svg v-if="activeFilters.sort_dir === 'asc'" class="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"></path></svg>
              <svg v-else class="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
            </template>
          </button>
        </div>
        
      </div>
    </div>

    <!-- 🚀 Top Pagination -->
    <PaginationControls 
      v-if="hasPagination" 
      :page="page" 
      :total-pages="totalPages" 
      :is-loading="isLoading" 
      @update:page="$emit('update:page', $event)" 
      custom-class="border-b bg-gray-950/40" 
    />

    <!-- Record List -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      <div
        v-for="item in items"
        :key="item.id"
        @click="handleRowClick(item)"
        class="border rounded-xl overflow-hidden transition-all duration-200 relative"
        :class="getRowClasses(item)"
        :title="disabledReason ? disabledReason(item) : ''"
      >
        <div class="p-4 flex items-center gap-3">
          <!-- Multi-Select Checkbox -->
          <input
            v-if="selectable"
            type="checkbox"
            :checked="selectedIds.includes(item.id)"
            :disabled="isItemDisabled(item)"
            @click.stop="handleRowClick(item)"
            class="w-4 h-4 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900 bg-gray-950 shrink-0"
            :class="isItemDisabled(item) ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'"
          />

          <div class="flex-1 min-w-0">
            <component :is="cardComponent" :item="item" v-if="cardComponent" />
            <div v-else class="text-xs text-red-500">Card logic missing</div>
          </div>
        </div>
      </div>
      
      <div v-if="items.length === 0" class="text-center py-10 text-gray-500 text-sm font-medium">
        No records found.
      </div>
    </div>

    <!-- Bottom Pagination -->
    <PaginationControls 
      v-if="hasPagination" 
      :page="page" 
      :total-pages="totalPages" 
      :is-loading="isLoading" 
      @update:page="$emit('update:page', $event)" 
      custom-class="border-t bg-gray-950/80 py-3" 
    />

  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import PaginationControls from '@/Components/PaginationControls.vue';

const props = defineProps({
  title: String,
  items: Array,
  modelValue: String, 
  searchPlaceholder: { type: String, default: 'Search...' },
  selectedId: [Number, String],
  filterConfig: { type: Array, default: () => [] },
  activeFilters: { type: Object, default: () => ({}) },
  cardComponent: Object,

  sortConfig: { type: Object, default: () => ({}) },
  
  // Pagination & Counts
  totalItems: { type: Number, default: null },
  hasPagination: { type: Boolean, default: false },
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  itemsPerPage: { type: Number, default: 10 },
  isLoading: { type: Boolean, default: false },

  // Multi-select & Modal Picker Props
  showCreate: { type: Boolean, default: true },
  selectable: { type: Boolean, default: false },
  selectedIds: { type: Array, default: () => [] },
  isItemDisabled: { type: Function, default: () => false },
  disabledReason: { type: Function, default: null }
});

const emit = defineEmits([
  'update:modelValue',
  'select',
  'create',
  'updateFilter',
  'update:page',
  'update:itemsPerPage',
  'update:selectedIds',
  'refresh'
]);

const showSettings = ref(false);

const hasActiveFilters = computed(() => {
  const hasSearch = Boolean(props.modelValue && String(props.modelValue).trim() !== '');
  const hasFilter = (props.filterConfig || []).some(f => {
    const val = props.activeFilters?.[f.name];
    return val !== undefined && val !== null && val !== '';
  });
  return hasSearch || hasFilter;
});

const clearAllFilters = () => {
  if (props.modelValue) {
    emit('update:modelValue', '');
  }
  (props.filterConfig || []).forEach(f => {
    if (props.activeFilters?.[f.name]) {
      emit('updateFilter', f.name, '');
    }
  });
};

const selectableVisibleItems = computed(() => {
  if (!props.selectable) return [];
  return (props.items || []).filter(item => !props.isItemDisabled(item));
});

const allVisibleSelected = computed(() => {
  if (selectableVisibleItems.value.length === 0) return false;
  return selectableVisibleItems.value.every(item => props.selectedIds.includes(item.id));
});

const toggleSelectVisible = () => {
  const visibleIds = selectableVisibleItems.value.map(i => i.id);
  if (allVisibleSelected.value) {
    emit('update:selectedIds', props.selectedIds.filter(id => !visibleIds.includes(id)));
  } else {
    const merged = Array.from(new Set([...props.selectedIds, ...visibleIds]));
    emit('update:selectedIds', merged);
  }
};

const handleRowClick = (item) => {
  if (!props.selectable) {
    emit('select', item);
    return;
  }
  if (props.isItemDisabled(item)) return;

  const exists = props.selectedIds.includes(item.id);
  const updated = exists
    ? props.selectedIds.filter(id => id !== item.id)
    : [...props.selectedIds, item.id];

  emit('update:selectedIds', updated);
};

const getRowClasses = (item) => {
  if (props.selectable) {
    if (props.isItemDisabled(item)) {
      return 'border-gray-800/60 bg-gray-900/20 opacity-45 cursor-not-allowed';
    }
    const isChecked = props.selectedIds.includes(item.id);
    return isChecked
      ? 'cursor-pointer border-emerald-500 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
      : 'cursor-pointer border-gray-800 bg-gray-900/40 hover:border-gray-600 hover:bg-gray-800/60';
  }

  return props.selectedId === item.id
    ? 'cursor-pointer border-emerald-500 bg-gray-800/80 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
    : 'cursor-pointer border-gray-800 bg-gray-900/40 hover:border-gray-600 hover:bg-gray-800/60';
};

const toggleSort = (key) => {
  if (props.activeFilters.sort_by === key) {
    const newDir = props.activeFilters.sort_dir === 'desc' ? 'asc' : 'desc';
    emit('updateFilter', 'sort_dir', newDir);
  } else {
    emit('updateFilter', 'sort_by', key);
    emit('updateFilter', 'sort_dir', 'desc');
  }
};
</script>
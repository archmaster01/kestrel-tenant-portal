import { ref, watch } from 'vue';

export function useModelUrlState() {
  // 1. Parse the current URL parameters on load
  const params = new URLSearchParams(window.location.search);

  // 2. Hydrate core state variables or fallback to defaults
  const searchQuery = ref(params.get('search') || '');
  const currentPage = ref(Number(params.get('page')) || 1);
  const itemsPerPage = ref(Number(params.get('per_page')) || 10);
  const activeTab = ref(params.get('tab') || 'details');

  // 3. Hydrate dynamic filters (status, sort_by, sort_dir, etc.)
  const coreParams = ['search', 'page', 'per_page', 'tab', 'id', 'prospect_id'];
  const initialFilters = {};
  
  for (const [key, value] of params.entries()) {
    if (!coreParams.includes(key)) {
      initialFilters[key] = value;
    }
  }
  
  // Ensure default sorting if none exists in the URL
  if (!initialFilters['sort_by']) {
    initialFilters['sort_by'] = 'created_at';
    initialFilters['sort_dir'] = 'desc';
  }

  const activeFilters = ref(initialFilters);

  // 4. Watch the activeTab separately, as it doesn't trigger API calls
  // (The rest of the params are pushed to the URL by loadData in useModelCrud)
  watch(activeTab, (newTab) => {
    const url = new URL(window.location);
    url.searchParams.set('tab', newTab);
    window.history.replaceState(window.history.state, '', url);
  });

  return {
    searchQuery,
    currentPage,
    itemsPerPage,
    activeTab,
    activeFilters
  };
}
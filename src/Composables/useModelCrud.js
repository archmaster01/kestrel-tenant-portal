import { ref, watch, toRaw } from 'vue';
import axios from 'axios';

export function useModelCrud({ apiEndpoint, resourceEndpoint, searchQuery, currentPage, itemsPerPage, activeFilters }) {
  const items = ref([]);
  const selectedItem = ref(null);
  const originalData = ref(null);
  const editorMode = ref('view');
  const backendTotal = ref(0);
  const totalPages = ref(1);
  const isLoading = ref(false);

  // Capture any initial deep-linked ?id= from the URL when the page first mounts
  const pinnedTargetId = ref(new URL(window.location).searchParams.get('id') || null);

  const loadData = async () => {
    // 1. Silently sync the current state into the URL before fetching
    const url = new URL(window.location);
    
    if (searchQuery.value) url.searchParams.set('search', searchQuery.value);
    else url.searchParams.delete('search');
    
    if (currentPage.value > 1) url.searchParams.set('page', currentPage.value);
    else url.searchParams.delete('page');
    
    if (itemsPerPage.value && itemsPerPage.value !== 10) url.searchParams.set('per_page', itemsPerPage.value);
    else url.searchParams.delete('per_page');
    
    Object.entries(activeFilters.value).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    
    window.history.replaceState(window.history.state, '', url);

    // 2. Fetch the data
    isLoading.value = true;
    try {
      const { data } = await axios.get(apiEndpoint, { 
        params: {
          ...activeFilters.value,
          search: searchQuery.value,
          page: currentPage.value,
          per_page: itemsPerPage.value,
          target_id: pinnedTargetId.value || undefined
        }
      });
      
      if (data.data) {
        items.value = data.data;
        backendTotal.value = data.total;
        totalPages.value = data.last_page;
        currentPage.value = data.current_page;
      } else {
        items.value = data;
        backendTotal.value = data.length;
        totalPages.value = 1;
      }
      
      // 3. Read the ID from the URL and select it
      if (items.value.length > 0 && editorMode.value !== 'edit') {
        const urlId = new URL(window.location).searchParams.get('id');
        
        if (urlId) {
          const matchingItem = items.value.find(i => String(i.id) === String(urlId));
          selectItem(matchingItem || items.value[0]);
        } else if (!selectedItem.value?.id) {
          selectItem(items.value[0]);
        }
      }
    } catch (error) {
      console.error(`Failed to load data from ${apiEndpoint}`, error);
    } finally {
      isLoading.value = false;
    }
  };

  // Watchers optimized to prevent double-fetching
  watch([searchQuery, itemsPerPage], () => {
    currentPage.value = 1;
    loadData();
  });

  watch(currentPage, () => {
    loadData();
  });

  const applyFilter = (name, value) => {
    activeFilters.value[name] = value;
    if (currentPage.value !== 1) {
      currentPage.value = 1; // Watcher will trigger loadData
    } else {
      loadData(); 
    }
  };

  const selectItem = (item) => {
    if (editorMode.value === 'edit') {
      if(!confirm('¿Descartar cambios no guardados?')) return;
    }
    
    // Safely clone the raw object to avoid Proxy issues
    const rawItem = toRaw(item);
    selectedItem.value = JSON.parse(JSON.stringify(rawItem));
    originalData.value = JSON.parse(JSON.stringify(rawItem));
    editorMode.value = 'view';
    
    // 🚀 RESTORED: Push the selected ID into the URL
    const url = new URL(window.location);
    if (item?.id) {
      url.searchParams.set('id', item.id);
    } else {
      url.searchParams.delete('id');
    }
    window.history.replaceState(window.history.state, '', url);
  };

  const createItem = () => {
    selectedItem.value = {};
    originalData.value = {};
    editorMode.value = 'edit';
  };

  const cancelEdit = () => {
    if (!selectedItem.value.id) {
      selectedItem.value = null;
    } else {
      selectedItem.value = JSON.parse(JSON.stringify(toRaw(originalData.value)));
    }
    editorMode.value = 'view';
  };

  const saveItem = async () => {
    isLoading.value = true;
    
    // If you have a formErrors ref, clear it here:
    // formErrors.value = {}; 

    try {
      const isNew = !selectedItem.value.id;
      const url = isNew ? resourceEndpoint : `${resourceEndpoint}/${selectedItem.value.id}`;
      const method = isNew ? 'post' : 'patch';
      
      const { data } = await axios[method](url, selectedItem.value);
      const savedId = data.id || (data.data && data.data.id); 
      
      editorMode.value = 'view';
      await loadData();
      
      if (savedId) {
        const freshItem = items.value.find(i => i.id === savedId) || items.value[0];
        if (freshItem) selectItem(freshItem);
      }
    } catch (error) {
      // 🚀 Safely Capture the 422 Validation Error
      if (error.response && error.response.status === 422) {
        const responseData = error.response.data || {};
        let errorMessages = 'Validation failed. Please check your inputs.';

        // Check if Laravel sent the specific 'errors' bag
        if (responseData.errors && typeof responseData.errors === 'object') {
          errorMessages = Object.values(responseData.errors).flat().join('\n');
        } 
        // Fallback to a general message if the errors bag is missing
        else if (responseData.message) {
          errorMessages = responseData.message;
        }

        alert('Validation Failed:\n' + errorMessages);
      } else {
        console.error('Failed to save item', error);
        alert('An unexpected error occurred while saving.');
      }
    } finally {
      isLoading.value = false;
    }
  };

  const deleteItem = async (id) => {
    await axios.delete(`${resourceEndpoint}/${id}`);
    selectedItem.value = null;
    await loadData();
  };

  const duplicateItem = async (id, payload = {}) => {
    isLoading.value = true;
    try {
      const { data } = await axios.post(`${resourceEndpoint}/${id}/duplicate`, payload);
      const newId = data?.id || data?.data?.id;

      await loadData();

      if (newId) {
        const clonedItem = items.value.find(i => String(i.id) === String(newId));
        if (clonedItem) selectItem(clonedItem);
      }
    } catch (error) {
      console.error('Failed to duplicate item', error);
      alert(error.response?.data?.message || 'Error al duplicar el registro.');
    } finally {
      isLoading.value = false;
    }
  };

  return {
    items, selectedItem, editorMode, backendTotal, totalPages, isLoading,
    loadData, applyFilter, selectItem, createItem, cancelEdit, saveItem, deleteItem, duplicateItem
  };
}
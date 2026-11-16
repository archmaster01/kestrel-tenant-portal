import { ref } from 'vue';

const toasts = ref([]);

export function useToast() {
  const addToast = (message, type = 'error', title = 'Atención') => {
    if (!message) return;

    // 🚀 Prevent duplicate toasts with the same message
    const isDuplicate = toasts.value.some(t => t.message === message);
    if (isDuplicate) return;

    const id = Date.now() + Math.random();
    toasts.value.push({ id, message, type, title });
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return { toasts, addToast, removeToast };
}
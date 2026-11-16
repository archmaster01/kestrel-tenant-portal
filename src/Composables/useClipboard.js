import { ref } from 'vue';

export function useClipboard(resetDelay = 2000) {
    const copied = ref(false);

    const copy = async (text) => {
        if (!text) return;
        
        try {
            // Modern approach (Requires HTTPS or localhost)
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for local dev HTTP environments (valet, artisan serve, etc.)
                const textArea = document.createElement("textarea");
                textArea.value = text;
                
                // Move it off-screen so it doesn't mess with the UI
                textArea.style.position = "absolute";
                textArea.style.left = "-999999px";
                
                document.body.appendChild(textArea);
                textArea.select();
                
                document.execCommand('copy');
                textArea.remove();
            }

            // Trigger visual feedback
            copied.value = true;
            setTimeout(() => { 
                copied.value = false; 
            }, resetDelay);
            
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('No se pudo copiar al portapapeles. Por favor, selecciona y copia manualmente.');
        }
    };

    return {
        copied,
        copy
    };
}
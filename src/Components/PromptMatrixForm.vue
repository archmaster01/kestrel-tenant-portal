<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({})
    },
    mode: {
        type: String,
        default: 'admin', // 'admin' | 'customer'
    },
    channel: {
        type: String,
        default: 'WebWidget',
    },
    readonly: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(['update:modelValue']);

const defaults = {
    commercial_aggressiveness: 'med',
    conversational_warmth: 'high',
    unlisted_info_strategy: 'acknowledge_and_bridge',
    price_anchoring: false,
    meta_ai_transparency: true,
    max_sentences: 3,
    sandbox_max_turns: 15,
};

const matrix = computed(() => ({
    ...defaults,
    ...(props.modelValue || {})
}));

const updateParam = (key, value) => {
    if (props.readonly) return;
    emit('update:modelValue', {
        ...matrix.value,
        [key]: value
    });
};

const aggressivenessOptions = [
    { value: 'low', label: 'Baja (Empática)', desc: 'Prioriza rapport y confianza antes de pedir datos.' },
    { value: 'med', label: 'Media (Consultiva)', desc: 'Resuelve dudas y perfila de forma equilibrada.' },
    { value: 'high', label: 'Alta (Cierre Directo)', desc: 'Enfocada en capturar el lead o cita desde el inicio.' },
];

const warmthOptions = [
    { value: 'low', label: 'Ejecutiva', desc: 'Directa al grano, concisa y pragmática.' },
    { value: 'med', label: 'Cordial', desc: 'Trato profesional, claro y amable.' },
    { value: 'high', label: 'Cálida y Humana', desc: 'Cercana, empática y conversacional (ideal médicos/servicios).' },
];

const brevityOptions = [
    { value: 2, label: 'Ultra Breve (2 oraciones)' },
    { value: 3, label: 'Estándar (3 oraciones)' },
    { value: 4, label: 'Detallada (4 oraciones)' },
];
</script>

<template>
    <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-5 space-y-6 transition-opacity"
         :class="readonly ? 'opacity-75 pointer-events-none' : ''">
        <div class="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
                <h3 class="text-sm font-semibold text-white flex items-center gap-2">
                    <span>🎛️ Matriz de Personalidad y Comportamiento IA</span>
                </h3>
                <p class="text-xs text-gray-400 mt-0.5">
                    Ajusta cómo conversa, perfila y vende tu agente sin modificar código ni texto.
                </p>
            </div>
            <span class="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                {{ mode === 'admin' ? 'Modo Admin' : 'Personalización Activa' }}
            </span>
        </div>

        <!-- 1. Commercial Aggressiveness -->
        <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-300">
                Agresividad Comercial (Ritmo de Captura)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                    v-for="opt in aggressivenessOptions"
                    :key="opt.value"
                    type="button"
                    @click="updateParam('commercial_aggressiveness', opt.value)"
                    class="text-left p-3 rounded-lg border transition-all cursor-pointer"
                    :class="matrix.commercial_aggressiveness === opt.value
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                        : 'bg-gray-800/60 border-gray-700/70 text-gray-400 hover:border-gray-600'"
                >
                    <div class="text-xs font-semibold">{{ opt.label }}</div>
                    <div class="text-[11px] opacity-75 mt-1 leading-snug">{{ opt.desc }}</div>
                </button>
            </div>
        </div>

        <!-- 2. Conversational Warmth -->
        <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-300">
                Calidez Conversacional (Tono)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                    v-for="opt in warmthOptions"
                    :key="opt.value"
                    type="button"
                    @click="updateParam('conversational_warmth', opt.value)"
                    class="text-left p-3 rounded-lg border transition-all cursor-pointer"
                    :class="matrix.conversational_warmth === opt.value
                        ? 'bg-purple-500/15 border-purple-500 text-white shadow-sm'
                        : 'bg-gray-800/60 border-gray-700/70 text-gray-400 hover:border-gray-600'"
                >
                    <div class="text-xs font-semibold">{{ opt.label }}</div>
                    <div class="text-[11px] opacity-75 mt-1 leading-snug">{{ opt.desc }}</div>
                </button>
            </div>
        </div>

        <!-- 3. Brevity / Max Sentences -->
        <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-300">
                Extensión de Respuesta (Brevedad)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                    v-for="opt in brevityOptions"
                    :key="opt.value"
                    type="button"
                    @click="updateParam('max_sentences', opt.value)"
                    class="text-center py-2.5 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer"
                    :class="Number(matrix.max_sentences) === opt.value
                        ? 'bg-blue-500/15 border-blue-500 text-white'
                        : 'bg-gray-800/60 border-gray-700/70 text-gray-400 hover:border-gray-600'"
                >
                    {{ opt.label }}
                </button>
            </div>
        </div>

        <!-- 4. Behavioral Toggles Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <!-- Unlisted Info Strategy -->
            <div class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/60">
                <div class="pr-3">
                    <div class="text-xs font-medium text-gray-200">Puente en Servicios No Listados</div>
                    <div class="text-[11px] text-gray-400">Si preguntan algo que no está en la web, reconoce la duda y ofrece confirmar con el especialista.</div>
                </div>
                <input
                    type="checkbox"
                    :checked="matrix.unlisted_info_strategy === 'acknowledge_and_bridge'"
                    @change="e => updateParam('unlisted_info_strategy', e.target.checked ? 'acknowledge_and_bridge' : 'strict')"
                    class="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 bg-gray-900 w-4 h-4 cursor-pointer"
                />
            </div>

            <!-- Price Anchoring -->
            <div class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/60">
                <div class="pr-3">
                    <div class="text-xs font-medium text-gray-200">Anclaje de Servicio Premium</div>
                    <div class="text-[11px] text-gray-400">Destaca el paquete más completo antes de opciones económicas (apágalo para médicos).</div>
                </div>
                <input
                    type="checkbox"
                    :checked="Boolean(matrix.price_anchoring)"
                    @change="e => updateParam('price_anchoring', e.target.checked)"
                    class="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 bg-gray-900 w-4 h-4 cursor-pointer"
                />
            </div>

            <!-- Admin-Only: Meta-AI Transparency -->
            <div v-if="mode === 'admin'" class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/60">
                <div class="pr-3">
                    <div class="text-xs font-medium text-gray-200">Revelación Meta-IA ("Yo soy Kestrel AI")</div>
                    <div class="text-[11px] text-gray-400">Usa la propia charla de WhatsApp como demostración en vivo de su fluidez.</div>
                </div>
                <input
                    type="checkbox"
                    :checked="Boolean(matrix.meta_ai_transparency)"
                    @change="e => updateParam('meta_ai_transparency', e.target.checked)"
                    class="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 bg-gray-900 w-4 h-4 cursor-pointer"
                />
            </div>
        </div>
    </div>
</template>
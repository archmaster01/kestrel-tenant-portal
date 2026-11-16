<script setup>
// Tailwind safelist so dynamic controller colors are never purged:
// text-white text-gray-300 text-emerald-400 text-rose-400 text-cyan-400 text-blue-400 text-amber-400 text-indigo-400 text-purple-400 text-pink-400

defineProps({
    card: {
        type: Object,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['select']);

const activeThemeClasses = {
    emerald: 'border-emerald-500 ring-1 ring-emerald-500/40 bg-emerald-950/10',
    green:   'border-green-500 ring-1 ring-green-500/40 bg-green-950/10',
    indigo:  'border-indigo-500 ring-1 ring-indigo-500/40 bg-indigo-950/10',
    cyan:    'border-cyan-500 ring-1 ring-cyan-500/40 bg-cyan-950/10',
    purple:  'border-purple-500 ring-1 ring-purple-500/40 bg-purple-950/10',
    blue:    'border-blue-500 ring-1 ring-blue-500/40 bg-blue-950/10',
    amber:   'border-amber-500 ring-1 ring-amber-500/40 bg-amber-950/10',
};
</script>

<template>
    <div
        @click="$emit('select', card.key)"
        class="bg-gray-950 border px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 select-none"
        :class="active
            ? (activeThemeClasses[card.theme] || activeThemeClasses.emerald)
            : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/60'"
    >
        <div class="flex items-center justify-between gap-1">
            <span class="text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                {{ card.title }}
            </span>
            <span
                class="text-[10px] font-semibold truncate"
                :class="card.key === 'widget' ? 'text-purple-400 font-bold' : 'text-gray-500'"
            >
                {{ card.badge }}
            </span>
        </div>

        <div class="mt-1.5 flex items-baseline justify-between gap-2">
            <!-- Primary Left Metric -->
            <div class="flex items-baseline gap-1 shrink-0">
                <span class="text-2xl font-extrabold" :class="card.primary.color">
                    {{ card.primary.value }}
                </span>
                <span class="text-[11px] text-gray-400">
                    {{ card.primary.label }}
                </span>
            </div>

            <!-- Secondary Right Breakdown Items -->
            <div class="flex flex-wrap items-baseline justify-end gap-x-2 gap-y-0.5 text-xs">
                <template v-for="(item, idx) in card.items" :key="idx">
                    <span v-if="idx > 0" class="text-gray-700">·</span>
                    <span class="whitespace-nowrap">
                        <span class="font-bold" :class="item.color">{{ item.value }}</span>
                        <span class="text-gray-400 text-[11px] ml-0.5">{{ item.label }}</span>
                    </span>
                </template>
            </div>
        </div>
    </div>
</template>
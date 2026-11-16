<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import axios from 'axios';
import ReportStatCard from '@/Components/Reports/StatCard.vue';
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps({
    parent: {
        type: Object,
        required: true,
    },
    items: {
        type: Array,
        default: () => [],
    },
    mode: {
        type: String,
        default: 'view',
    },
});

const telemetryData = ref(null);
const isLoading = ref(false);
const selectedDays = ref('30');
const selectedSource = ref('all'); // 'all' | 'external' | 'demo'

const fetchSiteTelemetry = async () => {
    if (!props.parent?.id) return;
    isLoading.value = true;
    try {
        const { data } = await axios.get(`/websites/${props.parent.id}/telemetry`, {
            params: {
                days: selectedDays.value,
                source: selectedSource.value,
            },
        });
        telemetryData.value = data;
    } catch (error) {
        console.error('Error loading website telemetry:', error);
    } finally {
        isLoading.value = false;
    }
};

watch(() => props.parent?.id, () => {
    fetchSiteTelemetry();
});

onMounted(() => {
    fetchSiteTelemetry();
});

const changeSource = (source) => {
    selectedSource.value = source;
    fetchSiteTelemetry();
};

const changeDays = (days) => {
    selectedDays.value = days;
    fetchSiteTelemetry();
};

const formatEventLabel = (type) => {
    const map = {
        proposal_opened: '📄 Abrió Propuesta Comercial',
        clicked_pricing: '🔥 Clic en Precios',
        clicked_installation: '🚀 Clic en Instalación',
        clicked_prequalification: '🎯 Solicitud Prueba / Precalificación',
        powered_by_clicked: '⚡ Clic en Powered by Kestrel AI',
        demo_completed: '✅ Completó Demo IA',
        demo_started: '💬 Inició Simulador IA',
        fast_pass_initiated: '⚡ Fast-Pass Ejecutado',
        demo_chip_clicked: '🔘 Clic en Chip del Simulador',
        message_sent: '💬 Mensaje Enviado al Widget IA',
        chat_message: '🤖 Mensaje al Chat IA',
        widget_opened: '👀 Abrió Widget IA',
        widget_closed: '👋 Cerró Widget IA',
        widget_loaded: '🟢 Cargó Widget en Sitio',
        incoming_traffic: '🌐 Visita a Demo (/demo)',
        page_view: '📄 Vista de Página',
    };
    return map[type] || type;
};

const seriesPalette = ['#06b6d4', '#a855f7', '#ec4899', '#f59e0b'];
const enabledSeries = ref(['Hits / Cargas']);

watch(
    () => telemetryData.value?.timeline?.series,
    (rawSeries) => {
        if (!rawSeries || !rawSeries.length) return;
        const valid = enabledSeries.value.filter(name =>
            rawSeries.some(s => s.name === name)
        );
        if (valid.length === 0) {
            enabledSeries.value = [rawSeries[0].name];
        }
    },
    { immediate: true }
);

const toggleSeriesPill = (seriesName) => {
    const idx = enabledSeries.value.indexOf(seriesName);
    if (idx > -1) {
        if (enabledSeries.value.length > 1) {
            enabledSeries.value.splice(idx, 1);
        }
    } else {
        enabledSeries.value.push(seriesName);
    }
};

const filteredChartData = computed(() => {
    const rawSeries = telemetryData.value?.timeline?.series || [];
    const series = [];
    const colors = [];

    rawSeries.forEach((s, i) => {
        if (enabledSeries.value.includes(s.name)) {
            series.push(s);
            colors.push(seriesPalette[i] || '#06b6d4');
        }
    });

    return { series, colors };
});

const chartOptions = computed(() => ({
    chart: {
        toolbar: { show: false },
        foreColor: '#9ca3af',
        background: 'transparent',
        animations: { enabled: true, speed: 350 },
    },
    colors: filteredChartData.value.colors,
    stroke: { curve: 'smooth', width: 2.5 },
    xaxis: {
        categories: telemetryData.value?.timeline?.labels || [],
    },
    yaxis: { min: 0, forceNiceScale: true },
    dataLabels: { enabled: false },
    grid: { borderColor: '#1f2937', strokeDashArray: 4 },
    fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.28, opacityTo: 0.02 },
    },
    legend: { show: false },
    tooltip: { theme: 'dark' },
}));
</script>

<template>
    <div class="p-5 flex flex-col gap-4">
        <!-- Top Filter Bar: Split External Site Widget vs /demo Simulator -->
        <div class="flex flex-wrap items-center justify-between gap-2 bg-gray-950 px-4 py-2.5 rounded-xl border border-gray-800">
            <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white">{{ parent.domain }}</span>
                <div class="h-4 w-px bg-gray-800"></div>

                <div class="flex items-center gap-1.5">
                    <button
                        @click="changeSource('all')"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                        :class="selectedSource === 'all'
                            ? 'bg-gray-700 text-white shadow'
                            : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'"
                    >
                        🌐 Todo
                    </button>
                    <button
                        @click="changeSource('external')"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                        :class="selectedSource === 'external'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'"
                    >
                        🟢 Sitio Externo (Widget)
                    </button>
                    <button
                        @click="changeSource('demo')"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                        :class="selectedSource === 'demo'
                            ? 'bg-cyan-600 text-white shadow'
                            : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'"
                    >
                        🎯 Demo (/demo)
                    </button>
                </div>
            </div>

            <div class="flex items-center gap-1">
                <button
                    v-for="opt in [
                        { label: '7D', val: '7' },
                        { label: '30D', val: '30' },
                        { label: '90D', val: '90' },
                        { label: 'Todo', val: 'all' }
                    ]"
                    :key="opt.val"
                    @click="changeDays(opt.val)"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                    :class="selectedDays === opt.val
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'"
                >
                    {{ opt.label }}
                </button>
            </div>
        </div>

        <div v-if="isLoading" class="py-12 text-center text-emerald-400 text-sm font-semibold animate-pulse">
            Cargando telemetría de {{ parent.domain }}...
        </div>

        <template v-else-if="telemetryData">
            <!-- 4 KPI Cards for this Website -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <ReportStatCard
                    v-for="card in telemetryData.cards"
                    :key="card.key"
                    :card="card"
                />
            </div>

            <!-- Chart + Live Event Feed for this Website -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="lg:col-span-2 bg-gray-950 border border-gray-800 p-4 rounded-xl flex flex-col">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h3 class="text-gray-300 text-xs font-bold uppercase tracking-wider">
                            Evolución Diaria — {{ parent.domain }}
                        </h3>

                        <!-- Interactive Series Toggle Pills -->
                        <div class="flex flex-wrap items-center gap-1.5">
                            <button
                                v-for="(s, idx) in (telemetryData.timeline?.series || [])"
                                :key="s.name"
                                type="button"
                                @click="toggleSeriesPill(s.name)"
                                class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all"
                                :class="enabledSeries.includes(s.name)
                                    ? 'bg-gray-900 text-gray-100 border-gray-700 shadow-sm'
                                    : 'bg-gray-950/40 text-gray-500 border-gray-800/60 opacity-50 hover:opacity-80'"
                            >
                                <span
                                    class="w-2.5 h-2.5 rounded-full transition-transform"
                                    :class="enabledSeries.includes(s.name) ? 'scale-100' : 'scale-75'"
                                    :style="{ backgroundColor: seriesPalette[idx] || '#06b6d4' }"
                                ></span>
                                <span>{{ s.name }}</span>
                            </button>
                        </div>
                    </div>

                    <VueApexCharts
                        :key="parent.id + '-' + selectedDays + '-' + selectedSource + '-' + enabledSeries.join(',')"
                        type="area"
                        height="240"
                        :options="chartOptions"
                        :series="filteredChartData.series"
                    />
                </div>

                <div class="bg-gray-950 border border-gray-800 p-4 rounded-xl flex flex-col max-h-[300px]">
                    <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                        ⚡ Eventos de {{ parent.domain }}
                    </h3>
                    <div class="flex-1 overflow-y-auto divide-y divide-gray-800/70 pr-1">
                        <div
                            v-for="ev in telemetryData.recent_events"
                            :key="ev.id"
                            class="py-2.5 flex items-start justify-between gap-2 px-1"
                        >
                            <div class="min-w-0 flex-1">
                                <div class="text-xs font-semibold text-emerald-400">
                                    {{ formatEventLabel(ev.event_type) }}
                                </div>

                                <!-- User Question or Clicked Chip -->
                                <div
                                    v-if="ev.details?.message || ev.details?.prompt || ev.details?.text"
                                    class="mt-1 text-xs text-white bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 break-words"
                                >
                                    <span class="text-pink-400 font-bold">Usuario:</span>
                                    "{{ ev.details.message || ev.details.prompt || ev.details.text }}"
                                </div>

                                <!-- AI Response -->
                                <div
                                    v-if="ev.details?.ai_response"
                                    class="mt-1 text-[11px] text-gray-300 bg-gray-900/50 border border-gray-800/70 rounded-lg px-2.5 py-1.5 break-words"
                                >
                                    <span class="text-cyan-400 font-bold">IA:</span>
                                    {{ ev.details.ai_response }}
                                </div>

                                <!-- Fallback for historical events that only recorded character_count -->
                                <div
                                    v-else-if="ev.details?.character_count && !ev.details?.message"
                                    class="text-[10px] text-gray-400 italic mt-0.5"
                                >
                                    Longitud: {{ ev.details.character_count }} caracteres (previo a captura de texto)
                                </div>

                                <div v-if="ev.details?.ip_origen" class="text-[10px] text-gray-500 font-mono mt-0.5">
                                    IP: {{ ev.details.ip_origen }}
                                </div>
                            </div>
                            <span class="text-[10px] text-gray-500 shrink-0">
                                {{ ev.time_ago }}
                            </span>
                        </div>
                        <div v-if="!telemetryData.recent_events?.length" class="py-8 text-center text-xs text-gray-500">
                            Sin eventos registrados para este filtro.
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
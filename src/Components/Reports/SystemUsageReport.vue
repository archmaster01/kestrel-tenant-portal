<template>
  <div class="flex flex-col h-full gap-6">
    <div class="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 shrink-0">
      <h2 class="text-lg font-bold text-gray-200">System Usage (Last 30 Days)</h2>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-emerald-500 animate-pulse">
      Cargando métricas globales...
    </div>

    <template v-else-if="telemetryData">
      <div class="grid grid-cols-3 gap-4 shrink-0">
        <div class="bg-gray-900/50 border border-gray-700/50 p-5 rounded-lg shadow-sm">
          <div class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Tráfico Global</div>
          <div class="text-3xl font-bold text-blue-400">{{ telemetryData.metrics.traffic }}</div>
        </div>
        <div class="bg-gray-900/50 border border-gray-700/50 p-5 rounded-lg shadow-sm">
          <div class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Widgets Cargados</div>
          <div class="text-3xl font-bold text-emerald-400">{{ telemetryData.metrics.loads }}</div>
        </div>
        <div class="bg-gray-900/50 border border-gray-700/50 p-5 rounded-lg shadow-sm">
          <div class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Fast-Pass Ejecutados</div>
          <div class="text-3xl font-bold text-purple-400">{{ telemetryData.metrics.fast_passes }}</div>
        </div>
      </div>

      <div class="bg-gray-900/50 border border-gray-700/50 p-5 rounded-lg flex-1 flex flex-col min-h-[350px]">
        <h3 class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 shrink-0">Eventos en el Tiempo</h3>
        <div class="flex-1 relative">
            <VueApexCharts 
              class="absolute inset-0"
              type="area" 
              height="100%" 
              :options="chartOptions" 
              :series="telemetryData.timeline.series" 
            />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import VueApexCharts from 'vue3-apexcharts';

const telemetryData = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const { data } = await axios.get('/reports/system-usage');
    telemetryData.value = data;
  } catch (error) {
    console.error('Failed to load system usage', error);
  } finally {
    isLoading.value = false;
  }
});

const chartOptions = computed(() => ({
  chart: { toolbar: { show: false }, foreColor: '#9ca3af', background: 'transparent', stacked: false },
  colors: ['#3b82f6', '#10b981', '#a855f7'],
  stroke: { curve: 'smooth', width: 2 },
  xaxis: { 
    categories: telemetryData.value?.timeline?.labels || [],
    type: 'datetime'
  },
  yaxis: { min: 0, forceNiceScale: true },
  dataLabels: { enabled: false },
  grid: { borderColor: '#374151', strokeDashArray: 4 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.05 }},
  legend: { position: 'top', horizontalAlign: 'right' }
}));
</script>
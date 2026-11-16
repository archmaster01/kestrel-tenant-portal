<template>
  <div class="flex items-center gap-3">
    <!-- Brand Color / Approval Indicator -->
    <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" :style="{ backgroundColor: indicatorColor }"></div>
    
    <div class="flex-1 min-w-0">
      <div class="text-sm font-semibold text-gray-200 truncate">{{ activeData.domain }}</div>
      <div class="text-xs text-gray-500 truncate mt-0.5">{{ activeData.business_name || 'Sin nombre comercial' }}</div>
      
      <!-- Dynamic Indicators Row -->
      <div class="flex items-center gap-2.5 mt-1.5">
        
        <!-- Email -->
        <div v-if="activeData.email" :title="activeData.email" class="text-gray-600 hover:text-emerald-400 cursor-help transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>

        <!-- WhatsApp -->
        <div v-if="activeData.whatsapp_number" :title="activeData.whatsapp_number" class="text-gray-600 hover:text-emerald-400 cursor-help transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
        </div>

        <!-- Mockup Image -->
        <div v-if="activeData.has_mockup" :title="activeData.mockup_image" class="text-gray-600 hover:text-emerald-400 cursor-help transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>

        <!-- Scraped Pages Count -->
        <div v-if="pageCount > 0" :title="`${pageCount} página(s) extraída(s)`" class="text-gray-600 hover:text-emerald-400 cursor-help transition-colors flex items-center gap-0.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          <span class="text-[9px] font-bold">{{ pageCount }}</span>
        </div>

        <div v-if="campaignCount > 0" :title="`${campaignCount} campaña(s) vinculada(s)`" class="text-gray-600 hover:text-emerald-400 cursor-help transition-colors flex items-center gap-0.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
          <span class="text-[9px] font-bold">{{ campaignCount }}</span>
        </div>

        <!-- Direct Link to Website CRM Record (Shown on any route other than /admin/websites) -->
        <Link
          v-if="showWebsiteLink && activeData.id"
          :href="route('admin.websites.index', { sort_by: 'created_at', sort_dir: 'desc', id: activeData.id, tab: 'details' })"
          @click.stop
          title="Ir a la ficha del sitio en Websites"
          class="text-gray-500 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>

      </div>
    </div>
    
    <!-- Status, Behavioral Funnel Badge & Step Badges -->
    <div class="shrink-0 flex flex-col items-end gap-1">
      <div class="flex items-center gap-1">
        <span
          class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
          :class="badgeClass"
        >
          {{ displayLabel }}
        </span>
        <!-- Website-level Handoff Pill (Shown in /admin/websites when any campaign is in Handoff) -->
        <span
          v-if="!item.pivot && hasActiveHandoff"
          class="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded border bg-rose-500/20 text-rose-300 border-rose-500/40"
        >
          🎯 HANDOFF
        </span>
      </div>

      <!-- Behavioral Funnel Badge (Only shown inside Campaign Prospects context) -->
      <span
        v-if="funnelBadge && item.pivot?.status !== 'CONVERTED_HANDOFF'"
        class="text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded border"
        :class="funnelBadge.badge"
      >
        {{ funnelBadge.shortLabel }}
      </span>

      <span
        v-if="item.pivot?.current_step > 0"
        class="text-[9px] font-mono text-gray-500"
      >
        Toque {{ item.pivot.current_step }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
const PROSPECT_STATUS_MAP = { active: { label: 'Activo', classes: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' }, pending: { label: 'Pendiente', classes: 'bg-amber-900/40 text-amber-300 border-amber-700/50' } }; const PROSPECT_FUNNEL_STAGE_MAP = { qualified: { label: 'Calificado', classes: 'bg-blue-900/40 text-blue-300 border-blue-700/50' } };

const props = defineProps({
  item: { type: Object, required: true }
});

const page = usePage();
const route = (name, params = {}) => `/${name.replace(/\./g, '/')}`;

// 🚀 Smart data resolver: Checks if nested inside a pivot relation
const activeData = computed(() => props.item.website || props.item);

// 🚀 Detect if this Website has an active Handoff (either via pivot, loaded campaigns, or global handoffAlerts)
const hasActiveHandoff = computed(() => {
  if (props.item.pivot?.status === 'CONVERTED_HANDOFF') return true;
  if ((page.props.handoffAlerts || []).some(a => Number(a.website_id) === Number(activeData.value?.id))) {
    return true;
  }
  if (Array.isArray(activeData.value?.campaigns)) {
    return activeData.value.campaigns.some(c => c.pivot?.status === 'CONVERTED_HANDOFF');
  }
  return false;
});

// 🚀 Show the shortcut link everywhere except on the main Websites index page
const showWebsiteLink = computed(() => {
  if (typeof window === 'undefined') return false;
  return !window.location.pathname.startsWith('/admin/websites');
});

// 🚀 Pulls the Prospect pivot status first, falls back to Website status
const rawStatus = computed(() => props.item.pivot?.status || props.item.status || 'Draft');

const funnelBadge = computed(() => {
  const stage = props.item.pivot?.funnel_stage;
  if (!stage) return null;
  return PROSPECT_FUNNEL_STAGE_MAP[stage] || null;
});

const pageCount = computed(() => {
  if (typeof activeData.value.pages_count === 'number') {
    return activeData.value.pages_count;
  }
  if (activeData.value.pages && Array.isArray(activeData.value.pages)) {
    return activeData.value.pages.length;
  }
  return 0;
});

const campaignCount = computed(() => activeData.value.campaigns_count || 0);

// Website-level status styles ( merged with shared PROSPECT_STATUS_MAP )
const websiteStatusColors = {
  active: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50',
  prospecting: 'bg-blue-900/30 text-blue-400 border-blue-800/50',
  trial: 'bg-purple-900/30 text-purple-400 border-purple-800/50',
  snippet_delivered: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  inactive: 'bg-gray-800 text-gray-400 border-gray-700',
  Clicked: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Converted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Rejected: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
};

const displayLabel = computed(() => {
  if (props.item.pivot && PROSPECT_STATUS_MAP[rawStatus.value]) {
    return PROSPECT_STATUS_MAP[rawStatus.value].label;
  }
  return rawStatus.value;
});

const badgeClass = computed(() => {
  if (props.item.pivot && PROSPECT_STATUS_MAP[rawStatus.value]) {
    return PROSPECT_STATUS_MAP[rawStatus.value].badge;
  }
  return websiteStatusColors[rawStatus.value] || 'bg-gray-800 border-gray-700 text-gray-400';
});

// 🚀 Smart Dot Color Logic
const indicatorColor = computed(() => {
  if (hasActiveHandoff.value) return '#F43F5E'; // Rose-500 whenever in Handoff

  const isProspectContext = !!props.item.pivot || !!props.item.website;
  if (isProspectContext) {
    const isApproved = !!(props.item.pivot?.approved_at || props.item.approved_at);
    return isApproved ? '#10B981' : '#EAB308';
  }

  return activeData.value.brand_color || '#10B981';
});
</script>
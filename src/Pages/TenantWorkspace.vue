<template>
  <MasterDetailLayout :hasSelection="!!selectedTenant">
    <template #left-panel>
      <ModelIndex
        :items="filteredTenants"
        :total="filteredTenants.length"
        :selectedId="selectedTenant?.id" :cardComponent="WebsiteCard"
        v-model="searchQuery"
        v-model:page="currentPage"
        v-model:itemsPerPage="itemsPerPage"
        :sortKey="sortKey"
        :sortDir="sortDir"
        :sortOptions="{ business_name: 'Nombre', domain: 'Dominio', updated_at: 'Actualizado' }"
        @select="selectTenant"
        @create="startCreate"
        @refresh="resetSelection"
      >
        <template #card="{ item }">
          <WebsiteCard :item="item" />
        </template>
      </ModelIndex>
    </template>

    <template #right-panel>
      <div v-if="selectedTenant" class="flex flex-col h-full bg-gray-900 text-gray-100">
        <div class="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-950/70">
          <div>
            <h2 class="text-sm font-bold text-white" data-testid="active-tenant-title">
              {{ selectedTenant.business_name }}
            </h2>
            <p class="text-xs text-emerald-400 font-mono">{{ selectedTenant.domain }}</p>
          </div>
          <ActionToolbar
            :mode="editMode"
            :showEdit="true"
            :showDelete="false"
            @edit="editMode = 'edit'"
            @cancel="editMode = 'view'"
            @save="saveTenant"
          />
        </div>

        <TabsNav :tabs="tabs" v-model="activeTab" />

        <div class="flex-1 overflow-y-auto p-4">
          <WebsiteForm
            v-if="activeTab === 'Configuración'"
            v-model="selectedTenant"
            :mode="editMode"
          />
          <WebsiteChat
            v-else-if="activeTab === 'Conversaciones'"
            :parent="selectedTenant"
          />
          <PagesTab
            v-else-if="activeTab === 'Páginas Extraídas'"
            :items="selectedTenant.pages || []"
          />
          <WebsiteTelemetry
            v-else-if="activeTab === 'Telemetría'"
            :parent="selectedTenant"
          />
          <CommentsTab
            v-else-if="activeTab === 'Notas'"
            :parent="selectedTenant"
            :items="selectedTenant.comments || []"
          />
        </div>
      </div>
    </template>
  </MasterDetailLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import MasterDetailLayout from '@/Components/Common/MasterDetailLayout.vue';
import ModelIndex from '@/Components/Common/ModelIndex.vue';
import TabsNav from '@/Components/Common/TabsNav.vue';
import ActionToolbar from '@/Components/Common/ActionToolbar.vue';
import WebsiteCard from '@/Pages/Websites/Card.vue';
import WebsiteForm from '@/Pages/Websites/Form.vue';
import WebsiteChat from '@/Pages/Websites/Chat.vue';
import WebsiteTelemetry from '@/Pages/Websites/Telemetry.vue';
import PagesTab from '@/Pages/Pages/Tab.vue';
import CommentsTab from '@/Pages/Comments/Tab.vue';
import { buildWidgetSnippet } from '@/utils/snippet';

const tabs = ['Configuración', 'Conversaciones', 'Páginas Extraídas', 'Telemetría', 'Notas'];
const activeTab = ref('Configuración');
const editMode = ref('view');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(25);
const sortKey = ref('business_name');
const sortDir = ref('asc');

const tenants = ref([
  {
    id: 1,
    identifier: 'kst-clinic-01',
    business_name: 'Kestrel Dental Clinic',
    domain: 'kestrel-clinic.example.com',
    brand_color: '#10b981',
    whatsapp_phone: '+521555019900',
    contact_email: 'contacto@kestrel-clinic.example.com',
    plan_tier: 'starter',
    status: 'active',
    funnel_stage: 'qualified',
    snippet: buildWidgetSnippet('kst-clinic-01'),
    ground_truth_data: 'Horario: Lunes a Viernes 9:00 a 18:00. Valoración dental: $850 MXN.',
    ai_parameters: {
      commercial_aggressiveness: 'medium',
      conversational_warmth: 'warm',
      max_sentences: 3,
      unlisted_info_strategy: 'strict',
      price_anchoring: false,
      meta_ai_transparency: true
    },
    pages: [
      { id: 101, url: 'https://kestrel-clinic.example.com/servicios', title: 'Servicios Dentales', extracted_at: '2026-03-20T12:00:00Z', word_count: 640, context_markdown: 'Implantes dentales, ortodoncia invisible y limpieza ultrasónica.' },
      { id: 102, url: 'https://kestrel-clinic.example.com/juriquilla', title: 'Sucursal Juriquilla', extracted_at: '2026-03-21T15:30:00Z', word_count: 410, context_markdown: 'Ubicados en Blvd. Universitario 555, Juriquilla. Estacionamiento gratuito.' }
    ],
    comments: [
      { id: 301, body: 'Cliente solicitó activar recordatorios de citas por WhatsApp.', created_at: '2026-03-22T09:15:00Z', user: { name: 'Operador Demo' } }
    ]
  },
  {
    id: 2,
    identifier: 'kst-academy-02',
    business_name: 'Kestrel Language Academy',
    domain: 'kestrel-academy.example.com',
    brand_color: '#3b82f6',
    whatsapp_phone: '+521555019922',
    contact_email: 'admisiones@kestrel-academy.example.com',
    plan_tier: 'growth',
    status: 'active',
    funnel_stage: 'qualified',
    snippet: buildWidgetSnippet('kst-academy-02'),
    ground_truth_data: 'Cursos de inglés y francés. Certificación Cambridge. Inscripciones abiertas.',
    ai_parameters: {
      commercial_aggressiveness: 'high',
      conversational_warmth: 'neutral',
      max_sentences: 2,
      unlisted_info_strategy: 'acknowledge_and_bridge',
      price_anchoring: true,
      meta_ai_transparency: true
    },
    pages: [
      { id: 201, url: 'https://kestrel-academy.example.com/es/cursos', title: 'Cursos Intensivos', extracted_at: '2026-03-19T10:00:00Z', word_count: 820, context_markdown: 'Cursos sabatinos e intensivos entre semana.' }
    ],
    comments: []
  }
]);

const filteredTenants = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return tenants.value;
  return tenants.value.filter(
    t => t.business_name.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q)
  );
});

const selectedTenant = ref(tenants.value[0]);

const selectTenant = (item) => {
  selectedTenant.value = item;
  editMode.value = 'view';
};

const startCreate = () => {
  selectedTenant.value = {
    id: Date.now(),
    identifier: 'kst-new-tenant',
    business_name: 'Nuevo Tenant Kestrel',
    domain: 'nuevo-tenant.example.com',
    brand_color: '#10b981',
    whatsapp_phone: '+521555019999',
    snippet: buildWidgetSnippet('kst-new-tenant'),
    ground_truth_data: '',
    ai_parameters: {
      commercial_aggressiveness: 'medium',
      conversational_warmth: 'warm',
      max_sentences: 3,
      unlisted_info_strategy: 'strict',
      price_anchoring: false,
      meta_ai_transparency: true
    },
    pages: [],
    comments: []
  };
  editMode.value = 'edit';
};

const resetSelection = () => {
  selectedTenant.value = tenants.value[0];
  editMode.value = 'view';
};

const saveTenant = () => {
  editMode.value = 'view';
};
</script>

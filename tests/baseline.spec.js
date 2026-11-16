import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import TenantWorkspace from '@/Pages/TenantWorkspace.vue';
import { buildWidgetSnippet } from '@/utils/snippet';

describe('Kestrel Tenant Portal Baseline', () => {
  it('renders the Master-Detail workspace with the default tenant selected', () => {
    const wrapper = mount(TenantWorkspace);
    expect(wrapper.find('[data-testid="active-tenant-title"]').text()).toBe('Kestrel Dental Clinic');
    expect(wrapper.text()).toContain('kestrel-clinic.example.com');
  });

  it('switches across existing workspace tabs cleanly', async () => {
    const wrapper = mount(TenantWorkspace);
    const buttons = wrapper.findAll('button');

    const chatTab = buttons.find(b => b.text() === 'Conversaciones');
    await chatTab.trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('valoración dental');

    const pagesTab = buttons.find(b => b.text() === 'Páginas Extraídas');
    await pagesTab.trigger('click');
    expect(wrapper.text()).toContain('kestrel-clinic.example.com/servicios');

    const telemetryTab = buttons.find(b => b.text() === 'Telemetría');
    await telemetryTab.trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('Hits / Cargas');
  });

  it('generates a sanitized Kestrel widget snippet', () => {
    const snippet = buildWidgetSnippet('kst-clinic-01');
    expect(snippet).toContain('kestrel-cdn.example.com');
    expect(snippet).toContain('data-kestrel-id="kst-clinic-01"');
    expect(snippet).toContain('<kestrel-widget></kestrel-widget>');
  });
});

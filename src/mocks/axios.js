const mockChatStore = {
  1: [
    {
      id: 501,
      channel: 'whatsapp',
      direction: 'inbound',
      sender: '+521555019901',
      content: 'Hola, ¿cuál es el precio de la valoración dental y horarios en sucursal centro?',
      created_at: '2026-03-25T10:14:00Z'
    },
    {
      id: 502,
      channel: 'whatsapp',
      direction: 'outbound',
      sender: 'Kestrel AI',
      content: 'Hola Sofía, la consulta de valoración cuesta $850 MXN. Atendemos de Lunes a Viernes de 9:00 a 18:00 hrs.',
      created_at: '2026-03-25T10:14:05Z'
    },
    {
      id: 503,
      channel: 'web',
      direction: 'inbound',
      sender: 'visitante-web-88a',
      content: '¿Tienen estacionamiento en la clínica de Juriquilla?',
      created_at: '2026-03-25T11:30:00Z'
    }
  ],
  2: [
    {
      id: 601,
      channel: 'web',
      direction: 'inbound',
      sender: 'visitante-web-12b',
      content: '¿Cuándo inician los cursos intensivos de inglés B2?',
      created_at: '2026-03-25T09:00:00Z'
    }
  ]
};

const axiosMock = {
  async get(url, config = {}) {
    if (url.includes('/telemetry')) {
      return {
        data: {
          cards: [
            {
              key: 'hits',
              title: 'Hits / Cargas',
              badge: '+12%',
              theme: 'cyan',
              primary: { value: 420, label: 'visitas', color: 'text-cyan-400' },
              items: [{ value: 310, label: 'web', color: 'text-gray-300' }]
            },
            {
              key: 'widget',
              title: 'Aperturas Widget',
              badge: '+8%',
              theme: 'purple',
              primary: { value: 148, label: 'aperturas', color: 'text-purple-400' },
              items: [{ value: '35%', label: 'CTR', color: 'text-emerald-400' }]
            },
            {
              key: 'chats',
              title: 'Mensajes IA',
              badge: '+19%',
              theme: 'emerald',
              primary: { value: 86, label: 'respuestas', color: 'text-emerald-400' },
              items: [{ value: 52, label: 'WA', color: 'text-green-400' }]
            },
            {
              key: 'leads',
              title: 'Leads Capturados',
              badge: '+5%',
              theme: 'amber',
              primary: { value: 24, label: 'prospectos', color: 'text-amber-400' },
              items: [{ value: 18, label: 'calificados', color: 'text-emerald-400' }]
            }
          ],
          timeline: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            series: [
              { name: 'Hits / Cargas', data: [45, 62, 58, 71, 84, 52, 48] },
              { name: 'Mensajes IA', data: [9, 14, 11, 16, 19, 10, 7] }
            ]
          },
          recent_events: [
            {
              id: 'ev-101',
              event_type: 'chat_message',
              time_ago: 'hace 5 min',
              details: {
                message: '¿Cuál es el costo de valoración?',
                ai_response: 'La consulta de valoración inicial tiene un costo de $850 MXN.',
                ip_origen: '192.0.2.14'
              }
            },
            {
              id: 'ev-102',
              event_type: 'widget_opened',
              time_ago: 'hace 18 min',
              details: { ip_origen: '198.51.100.42' }
            }
          ]
        }
      };
    }

    if (url.includes('/chats')) {
      const match = url.match(/\/websites\/(\d+)\/chats/);
      const siteId = match ? Number(match[1]) : 1;
      const list = mockChatStore[siteId] || mockChatStore[1];
      return {
        data: {
          messages: list,
          web_count: list.filter(m => m.channel === 'web').length,
          wa_count: list.filter(m => m.channel === 'whatsapp').length
        }
      };
    }

    if (url.includes('/reports/system-usage')) {
      return {
        data: {
          total_websites: 2,
          total_conversations: 510,
          total_scraped_pages: 64
        }
      };
    }

    return { data: {} };
  },

  async post(url, payload = {}) {
    if (url.includes('/extract')) {
      return {
        data: {
          business_name: 'Kestrel Dental Clinic',
          brand_color: '#10b981',
          whatsapp_phone: '+521555019900',
          ground_truth_data: 'Horario: Lunes a Viernes 9:00 a 18:00. Valoración inicial: $850 MXN.'
        }
      };
    }

    if (url.includes('/scrape')) {
      return {
        data: {
          status: 'queued',
          extracted_at: new Date().toISOString()
        }
      };
    }

    if (url.includes('/logo')) {
      return {
        data: {
          logo_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="8" fill="%2310b981"/></svg>'
        }
      };
    }

    return { data: { success: true, payload } };
  },

  async put(url, payload = {}) {
    return { data: { success: true, payload } };
  },

  async delete(url) {
    return { data: { success: true } };
  }
};

export default axiosMock;

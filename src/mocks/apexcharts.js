import { defineComponent, h } from 'vue';

export default defineComponent({
    name: 'VueApexChartsMock',
    props: {
        type: { type: String, default: 'area' },
        height: { type: [String, Number], default: 250 },
        options: { type: Object, default: () => ({}) },
        series: { type: Array, default: () => [] }
    },
    setup(props) {
        return () =>
            h(
                'div',
                {
                    'data-testid': 'apexcharts-mock',
                    'data-chart-type': props.type,
                    'data-series-count': props.series.length,
                    class: 'w-full h-full min-h-[220px] rounded-lg border border-gray-800 bg-gray-900/50 p-4 flex flex-col justify-between'
                },
                [
                    h('div', { class: 'flex items-center justify-between text-xs text-gray-400' }, [
                        h('span', `Series activas: ${props.series.map(s => s.name).join(', ') || 'Ninguna'}`),
                        h('span', `Categorías: ${(props.options?.xaxis?.categories || []).join(' · ')}`)
                    ]),
                    h(
                        'div',
                        { class: 'grid grid-cols-1 gap-2 my-auto' },
                        props.series.map((s) =>
                            h('div', { key: s.name, class: 'flex items-center justify-between text-xs bg-gray-950 px-3 py-1.5 rounded border border-gray-800' }, [
                                h('span', { class: 'font-semibold text-gray-200' }, s.name),
                                h('span', { class: 'font-mono text-emerald-400' }, (s.data || []).join(', '))
                            ])
                        )
                    )
                ]
            );
    }
});

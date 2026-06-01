import { FluentDesignSystem } from '@fluentui/web-components';
import { definition as chartLegendDefinition } from '../chart-legend/chart-legend.definition.js';
import { ensureDefinition, type Meta, type Story } from '../helpers.stories.js';
import { definition } from './stacked-bar-chart.definition.js';
import type { StackedBarChartData } from './stacked-bar-chart.options.js';
import type { StackedBarChart } from './stacked-bar-chart.js';

ensureDefinition('fluent-chart-legend', () => chartLegendDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-stacked-bar-chart', () => definition.define(FluentDesignSystem.registry));

const sampleData: StackedBarChartData = {
  chartTitle: 'Stacked Bar Chart',
  chartData: [
    { legend: 'Alpha', data: 25, color: '#637cef' },
    { legend: 'Beta', data: 15, color: '#e3008c' },
    { legend: 'Gamma', data: 10, color: '#107c10' },
  ],
};

export default { title: 'Components/StackedBarChart' } as Meta<StackedBarChart>;

export const Basic: Story<StackedBarChart> = () => {
  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked Bar Chart';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '100');
  return chart;
};
Basic.parameters = { docs: { story: { height: '220px' } } };

import { FluentDesignSystem } from '@fluentui/web-components';
import { ensureDefinition, type Meta, type Story } from '../helpers.stories.js';
import { definition } from './sparkline-chart.definition.js';
import type { SparklineDataPoint } from './sparkline-chart.options.js';
import type { SparklineChart } from './sparkline-chart.js';

ensureDefinition('fluent-sparkline-chart', () => definition.define(FluentDesignSystem.registry));

const sampleData: SparklineDataPoint[] = [
  { x: 0, y: 10 },
  { x: 1, y: 18 },
  { x: 2, y: 12 },
  { x: 3, y: 20 },
  { x: 4, y: 14 },
];

export default { title: 'Components/SparklineChart' } as Meta<SparklineChart>;

export const Basic: Story<SparklineChart> = () => {
  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = sampleData;
  chart.variant = 'line';
  chart.setAttribute('width', '220');
  chart.setAttribute('height', '60');
  return chart;
};
Basic.parameters = { docs: { story: { height: '160px' } } };

import { FluentDesignSystem } from '@fluentui/web-components';
import { definition as chartLegendDefinition } from '../chart-legend/chart-legend.definition.js';
import { ensureDefinition, type Meta, type Story } from '../helpers.stories.js';
import { definition } from './tree-chart.definition.js';
import type { TreeChart } from './tree-chart.js';

ensureDefinition('fluent-chart-legend', () => chartLegendDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-tree-chart', () => definition.define(FluentDesignSystem.registry));

export default { title: 'Components/TreeChart' } as Meta<TreeChart>;

export const Basic: Story<TreeChart> = () => {
  const chart = document.createElement('fluent-tree-chart') as TreeChart;
  chart.data = {
    name: 'CEO',
    fill: '#637cef',
    children: [
      { name: 'CTO', fill: '#0078d4', children: [{ name: 'Dev Lead', fill: '#005a9e' }] },
      { name: 'CFO', fill: '#e3008c' },
      { name: 'COO', fill: '#107c10' },
    ],
  };
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  return chart;
};
Basic.parameters = { docs: { story: { height: '420px' } } };

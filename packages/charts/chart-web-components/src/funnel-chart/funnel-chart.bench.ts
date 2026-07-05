import { FunnelChart } from './funnel-chart.js';
import { definition } from './funnel-chart.definition.js';

FunnelChart.define(definition);

const itemRenderer = () => {
  const funnelChart = document.createElement('fluent-funnel-chart');
  return funnelChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

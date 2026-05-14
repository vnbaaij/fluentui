import { FluentDesignSystem } from '@fluentui/web-components';
import { definition } from './funnel-chart.definition.js';

definition.define(FluentDesignSystem.registry);

const itemRenderer = () => {
  const funnelChart = document.createElement('fluent-funnel-chart');
  return funnelChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

import { FluentDesignSystem } from '@fluentui/web-components';
import '../chart-legend/define.js';
import { definition } from './gauge-chart.definition.js';

definition.define(FluentDesignSystem.registry);

const itemRenderer = () => {
  const gaugeChart = document.createElement('fluent-gauge-chart');
  return gaugeChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

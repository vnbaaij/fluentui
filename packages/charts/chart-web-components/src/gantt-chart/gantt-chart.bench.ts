import { FluentDesignSystem } from '@fluentui/web-components';
import { definition } from './gantt-chart.definition.js';

definition.define(FluentDesignSystem.registry);

const itemRenderer = () => {
  const ganttChart = document.createElement('fluent-gantt-chart');
  return ganttChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

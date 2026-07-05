import { HorizontalBarChart } from './horizontal-bar-chart.js';
import { definition } from './horizontal-bar-chart.definition.js';

HorizontalBarChart.define(definition);

const itemRenderer = () => {
  const horizontalbarchart = document.createElement('fluent-horizontal-bar-chart');
  return horizontalbarchart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

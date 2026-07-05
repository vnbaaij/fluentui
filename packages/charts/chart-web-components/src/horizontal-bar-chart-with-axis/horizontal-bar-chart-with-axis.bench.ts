import { HorizontalBarChartWithAxis } from './horizontal-bar-chart-with-axis.js';
import { definition } from './horizontal-bar-chart-with-axis.definition.js';

HorizontalBarChartWithAxis.define(definition);


const itemRenderer = () => {
  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis');
  return chart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

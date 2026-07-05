import { DonutChart } from './donut-chart.js';
import { definition } from './donut-chart.definition.js';


DonutChart.define(definition);

const itemRenderer = () => {
  const donutChart = document.createElement('fluent-donut-chart');
  return donutChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

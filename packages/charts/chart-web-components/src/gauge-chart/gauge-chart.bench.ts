import './define.js';

const itemRenderer = () => {
  const gaugeChart = document.createElement('fluent-gauge-chart');
  return gaugeChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

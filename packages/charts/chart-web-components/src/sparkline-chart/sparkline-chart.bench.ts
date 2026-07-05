import './define.js';

const itemRenderer = () => {
  const sparklineChart = document.createElement('fluent-sparkline-chart');
  return sparklineChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

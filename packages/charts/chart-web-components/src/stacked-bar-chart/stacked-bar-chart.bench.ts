import './define.js';

const itemRenderer = () => {
  const stackedBarChart = document.createElement('fluent-stacked-bar-chart');
  return stackedBarChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

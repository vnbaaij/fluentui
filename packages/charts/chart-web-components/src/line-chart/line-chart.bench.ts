import './define.js';

const itemRenderer = () => {
  const lineChart = document.createElement('fluent-line-chart');
  return lineChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

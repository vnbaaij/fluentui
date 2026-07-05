import './define.js';

const itemRenderer = () => {
  const scatterChart = document.createElement('fluent-scatter-chart');
  return scatterChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

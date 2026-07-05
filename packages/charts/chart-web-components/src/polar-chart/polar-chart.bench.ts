import './define.js';

const itemRenderer = () => {
  const polarChart = document.createElement('fluent-polar-chart');
  return polarChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

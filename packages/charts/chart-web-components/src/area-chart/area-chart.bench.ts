import './define.js';

const itemRenderer = () => {
  const areaChart = document.createElement('fluent-area-chart');
  return areaChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

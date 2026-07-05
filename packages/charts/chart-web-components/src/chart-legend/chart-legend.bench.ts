import './define.js';

const itemRenderer = () => {
  const chartLegend = document.createElement('fluent-chart-legend');
  return chartLegend;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

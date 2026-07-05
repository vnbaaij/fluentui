import './define.js';

const itemRenderer = () => {
  const verticalStackedBarChart = document.createElement('fluent-vertical-stacked-bar-chart');
  return verticalStackedBarChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

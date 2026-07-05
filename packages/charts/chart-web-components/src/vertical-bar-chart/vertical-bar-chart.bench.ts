import './define.js';

const itemRenderer = () => {
  const verticalBarChart = document.createElement('fluent-vertical-bar-chart');
  return verticalBarChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

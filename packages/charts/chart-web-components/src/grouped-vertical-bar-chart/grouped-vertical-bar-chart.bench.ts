import './define.js';

const itemRenderer = () => {
  const groupedVerticalBarChart = document.createElement('fluent-grouped-vertical-bar-chart');
  return groupedVerticalBarChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

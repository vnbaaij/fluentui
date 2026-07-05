import './define.js';

const itemRenderer = () => {
  const sankeyChart = document.createElement('fluent-sankey-chart');
  return sankeyChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

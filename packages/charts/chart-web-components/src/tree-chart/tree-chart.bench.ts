import './define.js';

const itemRenderer = () => {
  const treeChart = document.createElement('fluent-tree-chart');
  return treeChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

import { GanttChart } from './gantt-chart.js';
import { definition } from './gantt-chart.definition.js';

GanttChart.define(definition);

const itemRenderer = () => {
  const ganttChart = document.createElement('fluent-gantt-chart');
  return ganttChart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

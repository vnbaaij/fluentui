import { FluentDesignSystem } from '@fluentui/web-components';
import { definition } from './heat-map-chart.definition.js';

definition.define(FluentDesignSystem.registry);

const itemRenderer = () => {
  const chart = document.createElement('fluent-heat-map-chart');
  return chart;
};

export default itemRenderer;
export { tests } from '../utils/benchmark-wrapper.js';

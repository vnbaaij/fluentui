import { FluentDesignSystem } from '@fluentui/web-components';
import { HeatMapChart } from './heat-map-chart.js';
import { styles } from './heat-map-chart.styles.js';
import { template } from './heat-map-chart.template.js';

/**
 * @public
 * @remarks
 * HTML Element: `<fluent-heat-map-chart>`
 */
export const definition = HeatMapChart.compose({
  name: `${FluentDesignSystem.prefix}-heat-map-chart`,
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
});

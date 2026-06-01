import { FluentDesignSystem } from '@fluentui/web-components';
import { VerticalStackedBarChart } from './vertical-stacked-bar-chart.js';
import { styles } from './vertical-stacked-bar-chart.styles.js';
import { template } from './vertical-stacked-bar-chart.template.js';

/**
 * @public
 * @remarks
 * HTML Element: `<fluent-vertical-stacked-bar-chart>`
 */
export const definition = VerticalStackedBarChart.compose({
  name: `${FluentDesignSystem.prefix}-vertical-stacked-bar-chart`,
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
});

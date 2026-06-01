import { FluentDesignSystem } from '@fluentui/web-components';
import { VerticalBarChart } from './vertical-bar-chart.js';
import { styles } from './vertical-bar-chart.styles.js';
import { template } from './vertical-bar-chart.template.js';

/**
 * @public
 * @remarks
 * HTML Element: `<fluent-vertical-bar-chart>`
 */
export const definition = VerticalBarChart.compose({
  name: `${FluentDesignSystem.prefix}-vertical-bar-chart`,
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
});

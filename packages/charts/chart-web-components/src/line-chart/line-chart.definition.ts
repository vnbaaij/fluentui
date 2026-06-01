import { FluentDesignSystem } from '@fluentui/web-components';
import { LineChart } from './line-chart.js';
import { styles } from './line-chart.styles.js';
import { template } from './line-chart.template.js';

/**
 * @public
 * @remarks
 * HTML Element: `<fluent-line-chart>`
 */
export const definition = LineChart.compose({
  name: `${FluentDesignSystem.prefix}-line-chart`,
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
});

import { FluentDesignSystem } from '@fluentui/web-components';
import { ScatterChart } from './scatter-chart.js';
import { styles } from './scatter-chart.styles.js';
import { template } from './scatter-chart.template.js';

/**
 * @public
 * @remarks
 * HTML Element: `<fluent-scatter-chart>`
 */
export const definition = ScatterChart.compose({
  name: `${FluentDesignSystem.prefix}-scatter-chart`,
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
});

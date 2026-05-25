import { FluentDesignSystem } from '@fluentui/web-components';
import { GaugeChart } from './gauge-chart.js';
import { styles } from './gauge-chart.styles.js';
import { template } from './gauge-chart.template.js';

/**
 * @public
 * @remarks
 * HTML Element: `<fluent-gauge-chart>`
 */
export const definition = GaugeChart.compose({
  name: `${FluentDesignSystem.prefix}-gauge-chart`,
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
});

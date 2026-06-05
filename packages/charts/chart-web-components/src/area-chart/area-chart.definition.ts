import { FluentDesignSystem } from '@fluentui/web-components';
import { AreaChart } from './area-chart.js';
import { styles } from './area-chart.styles.js';
import { template } from './area-chart.template.js';

/**
 * @public
 * @remarks
 * HTML Element: `<fluent-area-chart>`
 */
export const definition = AreaChart.compose({
  name: `${FluentDesignSystem.prefix}-area-chart`,
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
});

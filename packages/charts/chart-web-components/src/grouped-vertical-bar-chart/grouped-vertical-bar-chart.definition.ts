import { FluentDesignSystem } from '@fluentui/web-components';
import { GroupedVerticalBarChart } from './grouped-vertical-bar-chart.js';
import { styles } from './grouped-vertical-bar-chart.styles.js';
import { template } from './grouped-vertical-bar-chart.template.js';

/**
 * @public
 * @remarks
 * HTML Element: `<fluent-grouped-vertical-bar-chart>`
 */
export const definition = GroupedVerticalBarChart.compose({
  name: `${FluentDesignSystem.prefix}-grouped-vertical-bar-chart`,
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
});

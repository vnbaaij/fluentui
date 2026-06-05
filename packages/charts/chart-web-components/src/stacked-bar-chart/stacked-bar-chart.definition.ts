import { FluentDesignSystem } from '@fluentui/web-components';
import { StackedBarChart } from './stacked-bar-chart.js';
import { styles } from './stacked-bar-chart.styles.js';
import { template } from './stacked-bar-chart.template.js';

/** @public @remarks HTML Element: `<fluent-stacked-bar-chart>` */
export const definition = StackedBarChart.compose({
  name: `${FluentDesignSystem.prefix}-stacked-bar-chart`,
  template,
  styles,
  shadowOptions: { delegatesFocus: true },
});

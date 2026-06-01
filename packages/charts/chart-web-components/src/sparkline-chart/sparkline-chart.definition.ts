import { FluentDesignSystem } from '@fluentui/web-components';
import { SparklineChart } from './sparkline-chart.js';
import { styles } from './sparkline-chart.styles.js';
import { template } from './sparkline-chart.template.js';

/** @public @remarks HTML Element: `<fluent-sparkline-chart>` */
export const definition = SparklineChart.compose({
  name: `${FluentDesignSystem.prefix}-sparkline-chart`,
  template,
  styles,
  shadowOptions: { delegatesFocus: true },
});

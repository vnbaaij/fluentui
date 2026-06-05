import { FluentDesignSystem } from '@fluentui/web-components';
import { PolarChart } from './polar-chart.js';
import { styles } from './polar-chart.styles.js';
import { template } from './polar-chart.template.js';

/** @public @remarks HTML Element: `<fluent-polar-chart>` */
export const definition = PolarChart.compose({
  name: `${FluentDesignSystem.prefix}-polar-chart`,
  template,
  styles,
  shadowOptions: { delegatesFocus: true },
});

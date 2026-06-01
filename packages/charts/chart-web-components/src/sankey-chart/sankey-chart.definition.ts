import { FluentDesignSystem } from '@fluentui/web-components';
import { SankeyChart } from './sankey-chart.js';
import { styles } from './sankey-chart.styles.js';
import { template } from './sankey-chart.template.js';

/** @public @remarks HTML Element: `<fluent-sankey-chart>` */
export const definition = SankeyChart.compose({
  name: `${FluentDesignSystem.prefix}-sankey-chart`,
  template,
  styles,
  shadowOptions: { delegatesFocus: true },
});

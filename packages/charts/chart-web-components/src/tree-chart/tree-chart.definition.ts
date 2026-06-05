import { FluentDesignSystem } from '@fluentui/web-components';
import { TreeChart } from './tree-chart.js';
import { styles } from './tree-chart.styles.js';
import { template } from './tree-chart.template.js';

/** @public @remarks HTML Element: `<fluent-tree-chart>` */
export const definition = TreeChart.compose({
  name: `${FluentDesignSystem.prefix}-tree-chart`,
  template,
  styles,
  shadowOptions: { delegatesFocus: true },
});

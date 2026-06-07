import type { Axis, AxisDomain } from 'd3-axis';
import type { AxisCategoryOrder } from './chart-options.js';

export type AxisScaleLike<Domain extends AxisDomain> = {
  domain(): Domain[];
  ticks?: (count?: number) => Domain[];
  bandwidth?: () => number;
  (value: Domain): number | undefined;
};

export type CartesianAxisCapability = {
  xAxisTypes: readonly ('number' | 'date' | 'category')[];
  yAxisTypes: readonly ('number' | 'date' | 'category')[];
  tickGeneration: readonly string[];
  formatting: readonly string[];
  labelLayout: readonly string[];
  rtlBehavior: readonly string[];
  dualAxis: boolean;
  categoryOrdering: readonly string[];
};

/**
 * Capability matrix for web-component cartesian charts.
 * Used as a parity checklist when aligning axis behavior across components.
 */
export const CARTESIAN_CHART_CAPABILITY_MATRIX: Record<string, CartesianAxisCapability> = {
  'area-chart': {
    xAxisTypes: ['number', 'date'],
    yAxisTypes: ['number'],
    tickGeneration: ['auto', 'tick-values', 'x-axis-tick-count', 'y-axis-tick-count', 'rounded-ticks'],
    formatting: ['tick-format', 'x-axis-tick-format', 'y-axis-tick-format', 'date-localize-options', 'use-utc'],
    labelLayout: ['tick-padding', 'wrap-x-axis-labels', 'rotate-x-axis-labels', 'hide-tick-overlap', 'axis-titles'],
    rtlBehavior: ['primary-y-axis-side-swap', 'secondary-y-axis-side-swap', 'legend-side-mirroring'],
    dualAxis: true,
    categoryOrdering: [],
  },
  'line-chart': {
    xAxisTypes: ['number', 'date'],
    yAxisTypes: ['number'],
    tickGeneration: ['auto', 'tick-values', 'x-axis-tick-count', 'y-axis-tick-count', 'rounded-ticks'],
    formatting: ['tick-format', 'x-axis-tick-format', 'y-axis-tick-format', 'date-localize-options', 'use-utc'],
    labelLayout: ['tick-padding', 'wrap-x-axis-labels', 'rotate-x-axis-labels', 'hide-tick-overlap', 'axis-titles'],
    rtlBehavior: ['primary-y-axis-side-swap', 'legend-side-mirroring'],
    dualAxis: false,
    categoryOrdering: [],
  },
  'scatter-chart': {
    xAxisTypes: ['number'],
    yAxisTypes: ['number'],
    tickGeneration: ['auto', 'tick-values', 'x-axis-tick-count', 'y-axis-tick-count', 'rounded-ticks'],
    formatting: ['x-axis-tick-format', 'y-axis-tick-format'],
    labelLayout: ['tick-padding', 'wrap-x-axis-labels', 'rotate-x-axis-labels', 'hide-tick-overlap', 'axis-titles'],
    rtlBehavior: ['primary-y-axis-side-swap', 'legend-side-mirroring'],
    dualAxis: false,
    categoryOrdering: [],
  },
  'vertical-bar-chart': {
    xAxisTypes: ['category'],
    yAxisTypes: ['number'],
    tickGeneration: [
      'auto',
      'tick-values',
      'y-axis-tick-values',
      'x-axis-tick-count',
      'y-axis-tick-count',
      'rounded-ticks',
    ],
    formatting: ['y-axis-tick-format'],
    labelLayout: ['tick-padding', 'wrap-x-axis-labels', 'rotate-x-axis-labels', 'hide-tick-overlap', 'axis-titles'],
    rtlBehavior: ['primary-y-axis-side-swap', 'legend-side-mirroring'],
    dualAxis: false,
    categoryOrdering: ['x-axis-category-order'],
  },
  'grouped-vertical-bar-chart': {
    xAxisTypes: ['category'],
    yAxisTypes: ['number'],
    tickGeneration: [
      'auto',
      'tick-values',
      'y-axis-tick-values',
      'x-axis-tick-count',
      'y-axis-tick-count',
      'rounded-ticks',
    ],
    formatting: ['y-axis-tick-format'],
    labelLayout: ['tick-padding', 'wrap-x-axis-labels', 'rotate-x-axis-labels', 'hide-tick-overlap', 'axis-titles'],
    rtlBehavior: ['primary-y-axis-side-swap', 'legend-side-mirroring'],
    dualAxis: false,
    categoryOrdering: ['x-axis-category-order'],
  },
  'vertical-stacked-bar-chart': {
    xAxisTypes: ['category'],
    yAxisTypes: ['number'],
    tickGeneration: [
      'auto',
      'tick-values',
      'y-axis-tick-values',
      'x-axis-tick-count',
      'y-axis-tick-count',
      'rounded-ticks',
    ],
    formatting: ['y-axis-tick-format'],
    labelLayout: ['tick-padding', 'wrap-x-axis-labels', 'rotate-x-axis-labels', 'hide-tick-overlap', 'axis-titles'],
    rtlBehavior: ['primary-y-axis-side-swap', 'legend-side-mirroring'],
    dualAxis: false,
    categoryOrdering: ['x-axis-category-order'],
  },
  'horizontal-bar-chart-with-axis': {
    xAxisTypes: ['number', 'date'],
    yAxisTypes: ['number', 'category'],
    tickGeneration: ['auto', 'tick-values', 'x-axis-tick-count', 'y-axis-tick-count', 'rounded-ticks'],
    formatting: ['x-axis-tick-format', 'y-axis-tick-format', 'tick-format', 'date-localize-options', 'use-utc'],
    labelLayout: ['tick-padding', 'show-y-axis-labels-tooltip', 'axis-titles'],
    rtlBehavior: ['x-range-mirroring'],
    dualAxis: false,
    categoryOrdering: ['y-axis-category-order'],
  },
  'gantt-chart': {
    xAxisTypes: ['number', 'date'],
    yAxisTypes: ['number', 'category'],
    tickGeneration: ['auto', 'tick-values', 'x-axis-tick-count', 'y-axis-tick-count', 'rounded-ticks'],
    formatting: ['x-axis-tick-format', 'y-axis-tick-format', 'tick-format', 'date-localize-options', 'use-utc'],
    labelLayout: ['tick-padding', 'show-y-axis-labels-tooltip', 'axis-titles'],
    rtlBehavior: ['x-range-mirroring', 'primary-y-axis-side-swap'],
    dualAxis: false,
    categoryOrdering: ['y-axis-category-order'],
  },
  'heat-map-chart': {
    xAxisTypes: ['number', 'date', 'category'],
    yAxisTypes: ['number', 'date', 'category'],
    tickGeneration: ['auto', 'rounded-ticks'],
    formatting: [
      'x-axis-date-format-string',
      'y-axis-date-format-string',
      'x-axis-number-format-string',
      'y-axis-number-format-string',
    ],
    labelLayout: ['tick-padding', 'axis-titles'],
    rtlBehavior: ['layout-direction-mirroring'],
    dualAxis: false,
    categoryOrdering: ['x-axis-category-order', 'y-axis-category-order', 'sort-order'],
  },
};

export const getAxisTickValues = <Domain extends AxisDomain>(
  axis: Axis<Domain>,
  scale: AxisScaleLike<Domain>,
): Domain[] => {
  const explicit = axis.tickValues();
  if (explicit) {
    return Array.from(explicit as Iterable<Domain>);
  }
  if (typeof scale.ticks === 'function') {
    const [count] = axis.tickArguments() as [number?];
    return scale.ticks(count);
  }
  return scale.domain();
};

export const getAxisPosition = <Domain extends AxisDomain>(scale: AxisScaleLike<Domain>, value: Domain): number => {
  const start = scale(value) ?? 0;
  return typeof scale.bandwidth === 'function' ? start + scale.bandwidth() / 2 : start;
};

export const applyAxisTickConfig = <Domain extends AxisDomain>(
  axis: Axis<Domain>,
  tickCount: number | string | undefined,
  tickValues: readonly Domain[] | undefined,
) => {
  const parsedCount = Number(tickCount);
  if (Number.isFinite(parsedCount) && parsedCount > 0) {
    axis.ticks(parsedCount);
  }
  if (tickValues?.length) {
    axis.tickValues(tickValues as Iterable<Domain>);
  }
};

export type CategoryGroup<TPoint> = {
  key: string;
  points: readonly TPoint[];
};

type CategoryAggregateOrder = Exclude<
  AxisCategoryOrder,
  'default' | 'data' | 'category ascending' | 'category descending'
>;

const getMedian = (values: readonly number[]) => {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
};

const getAggregateValue = (values: readonly number[], order: CategoryAggregateOrder): number => {
  switch (order) {
    case 'total ascending':
    case 'total descending':
    case 'sum ascending':
    case 'sum descending':
      return values.reduce((sum, value) => sum + value, 0);
    case 'min ascending':
    case 'min descending':
      return Math.min(...values);
    case 'max ascending':
    case 'max descending':
      return Math.max(...values);
    case 'mean ascending':
    case 'mean descending':
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    case 'median ascending':
    case 'median descending':
      return getMedian(values);
    default:
      return 0;
  }
};

export const sortCategoryGroups = <TPoint>(
  groups: readonly CategoryGroup<TPoint>[],
  order: AxisCategoryOrder | undefined,
  dataOrderKeys: readonly string[],
  getValues: (group: CategoryGroup<TPoint>) => readonly number[],
) => {
  const resolvedOrder = order || 'default';
  if (resolvedOrder === 'default' || resolvedOrder === 'data') {
    const firstIndex = new Map<string, number>();
    dataOrderKeys.forEach((key, index) => {
      if (!firstIndex.has(key)) {
        firstIndex.set(key, index);
      }
    });
    return [...groups].sort(
      (left, right) =>
        (firstIndex.get(left.key) ?? Number.MAX_SAFE_INTEGER) - (firstIndex.get(right.key) ?? Number.MAX_SAFE_INTEGER),
    );
  }

  if (resolvedOrder.startsWith('category')) {
    const sorted = [...groups].sort((left, right) => left.key.localeCompare(right.key));
    if (resolvedOrder.endsWith('descending')) {
      sorted.reverse();
    }
    return sorted;
  }

  const sorted = [...groups].sort(
    (left, right) =>
      getAggregateValue(getValues(left), resolvedOrder as CategoryAggregateOrder) -
      getAggregateValue(getValues(right), resolvedOrder as CategoryAggregateOrder),
  );
  if (resolvedOrder.endsWith('descending')) {
    sorted.reverse();
  }
  return sorted;
};

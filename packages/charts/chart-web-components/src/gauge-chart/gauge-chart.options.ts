/**
 * A segment of the gauge chart.
 *
 * @public
 */
export interface GaugeChartSegment {
  /**
   * Legend text for the segment.
   */
  legend: string;

  /**
   * Size of the segment (its contribution to the gauge range).
   */
  size: number;

  /**
   * Color of the segment. Supports DataVizPalette tokens and raw CSS color strings.
   */
  color?: string;

  /**
   * Optional two-stop gradient expressed as `[startColor, endColor]`.
   * Only used when `enable-gradient` is set on the chart.
   */
  gradient?: [string, string];
}

/**
 * Predefined format options for the chart-value label in the center of the gauge.
 *
 * @public
 */
export type GaugeValueFormat = 'percentage' | 'fraction';

/**
 * Display variant for the gauge.
 *
 * @public
 */
export type GaugeChartVariant = 'single-segment' | 'multiple-segments';

/**
 * Internal representation of a segment that also carries the computed
 * start and end positions on the gauge range.
 *
 * @internal
 */
export interface ExtendedSegment extends GaugeChartSegment {
  start: number;
  end: number;
}

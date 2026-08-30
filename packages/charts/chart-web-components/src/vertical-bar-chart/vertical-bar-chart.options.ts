import type { AccessibilityData } from '../utils/chart-options.js';

/** @public */
export interface VerticalBarChartLineDataPoint {
  /** @public */ y: number;
  /** @public */ yAxisCalloutData?: string;
  /** @public */ useSecondaryYScale?: boolean;
  /** @public */ onClick?: VoidFunction;
}

/** @public */
export interface VerticalBarChartDataPoint {
  /** @public */ x: string | number | Date;
  /** @public */ y: number;
  /** Text or date that overrides the x value displayed in the tooltip. Dates are formatted using the chart culture. */
  /** @public */ xAxisCalloutData?: string | Date;
  /** Text that overrides the bar value displayed in the tooltip. */
  /** @public */ yAxisCalloutData?: string;
  /** @public */ legend?: string;
  /** @public */ color?: string;
  /** @public */ gradient?: [string, string];
  /** @public */ lineData?: VerticalBarChartLineDataPoint;
  /** @public */ onClick?: VoidFunction;
  /** @public */ callOutAccessibilityData?: AccessibilityData;
}

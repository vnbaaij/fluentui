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
  /** @public */ legend?: string;
  /** @public */ color?: string;
  /** @public */ gradient?: [string, string];
  /** @public */ lineData?: VerticalBarChartLineDataPoint;
  /** @public */ onClick?: VoidFunction;
  /** @public */ callOutAccessibilityData?: AccessibilityData;
}

/** @public */
export interface VerticalStackedBarChartDataPoint {
  /** @public */ legend: string;
  /** @public */ data: number;
  /** Text or date that overrides the x value displayed in the tooltip. Dates are formatted using the chart culture. */
  /** @public */ xAxisCalloutData?: string | Date;
  /** Text that overrides the segment value displayed in the tooltip. */
  /** @public */ yAxisCalloutData?: string;
  /** @public */ color?: string;
  /** @public */ gradient?: [string, string];
}

/** @public */
export interface VerticalStackedBarChartLineDataPoint {
  /** @public */ y: number;
  /** Text that overrides the line value displayed in the tooltip. */
  /** @public */ yAxisCalloutData?: string;
  /** @public */ legend: string;
  /** @public */ color?: string;
  /** @public */ useSecondaryYScale?: boolean;
  /** @public */ onClick?: VoidFunction;
}

/** @public */
export interface VerticalStackedBarChartProps {
  /** @public */ xAxisPoint: string | number | Date;
  /** @public */ chartData: VerticalStackedBarChartDataPoint[];
  /** @public */ lineData?: VerticalStackedBarChartLineDataPoint[];
}

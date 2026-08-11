/** @public */
export interface VerticalStackedBarChartDataPoint {
  /** @public */ legend: string;
  /** @public */ data: number;
  /** @public */ color?: string;
  /** @public */ gradient?: [string, string];
}

/** @public */
export interface VerticalStackedBarChartLineDataPoint {
  /** @public */ y: number;
  /** @public */ legend: string;
  /** @public */ color?: string;
  /** @public */ useSecondaryYScale?: boolean;
  /** @public */ onClick?: VoidFunction;
}

/** @public */
export interface VerticalStackedBarChartProps {
  /** @public */ xAxisPoint: string | number;
  /** @public */ chartData: VerticalStackedBarChartDataPoint[];
  /** @public */ lineData?: VerticalStackedBarChartLineDataPoint[];
}

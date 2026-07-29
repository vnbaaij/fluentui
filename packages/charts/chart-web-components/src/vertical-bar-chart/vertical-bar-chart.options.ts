/** @public */
export interface VerticalBarChartLineDataPoint {
  /** @public */ y: number;
  /** @public */ yAxisCalloutData?: string;
  /** @public */ onClick?: VoidFunction;
}

/** @public */
export interface VerticalBarChartDataPoint {
  /** @public */ x: string | number;
  /** @public */ y: number;
  /** @public */ legend?: string;
  /** @public */ color?: string;
  /** @public */ lineData?: VerticalBarChartLineDataPoint;
  /** @public */ onClick?: VoidFunction;
}

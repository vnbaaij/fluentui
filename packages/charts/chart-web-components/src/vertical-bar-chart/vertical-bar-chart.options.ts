/** @public */
export interface VerticalBarChartDataPoint {
  /** @public */ x: string | number;
  /** @public */ y: number;
  /** @public */ legend?: string;
  /** @public */ color?: string;
  /** @public */ onClick?: VoidFunction;
}

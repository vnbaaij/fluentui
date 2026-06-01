/** @public */
export interface PolarChartDataPoint {
  /** @public */ x: string;
  /** @public */ y: number;
}

/** @public */
export interface PolarChartSeries {
  /** @public */ legend: string;
  /** @public */ data: PolarChartDataPoint[];
  /** @public */ color?: string;
}

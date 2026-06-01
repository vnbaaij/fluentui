/** @public */
export interface ScatterChartDataPoint {
  /** @public */ x: number;
  /** @public */ y: number;
  /** @public */ size?: number;
}

/** @public */
export interface ScatterChartSeries {
  /** @public */ legend: string;
  /** @public */ data: ScatterChartDataPoint[];
  /** @public */ color?: string;
}

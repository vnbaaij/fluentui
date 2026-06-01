/** @public */
export interface LineChartDataPoint {
  /** @public */ x: number | Date;
  /** @public */ y: number;
}

/** @public */
export interface LineChartSeries {
  /** @public */ legend: string;
  /** @public */ data: LineChartDataPoint[];
  /** @public */ color?: string;
}

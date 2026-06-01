/** @public */
export interface GroupedVerticalBarChartDataPoint {
  /** @public */ key: string;
  /** @public */ data: number;
  /** @public */ color?: string;
}

/** @public */
export interface GroupedVerticalBarChartData {
  /** @public */ xAxisPoint: string;
  /** @public */ series: GroupedVerticalBarChartDataPoint[];
}

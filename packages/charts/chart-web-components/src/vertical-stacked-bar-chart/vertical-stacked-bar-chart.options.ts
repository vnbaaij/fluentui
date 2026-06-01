/** @public */
export interface VerticalStackedBarChartDataPoint {
  /** @public */ legend: string;
  /** @public */ data: number;
  /** @public */ color?: string;
}

/** @public */
export interface VerticalStackedBarChartProps {
  /** @public */ xAxisPoint: string | number;
  /** @public */ chartData: VerticalStackedBarChartDataPoint[];
}

/** @public */
export interface LineChartDataPoint {
  /** @public */ x: number | Date;
  /** @public */ y: number;
  /** @public */ xAxisCalloutData?: string | Date;
  /** @public */ yAxisCalloutData?: string;
  /** @public */ hideCallout?: boolean;
  /** @public */ onDataPointClick?: VoidFunction;
  /** @deprecated Use `onDataPointClick` instead. @public */ onClick?: VoidFunction;
}

/** @public */
export interface LineChartGap {
  /** @public */ startIndex: number;
  /** @public */ endIndex: number;
}

/** @public */
export interface LineChartLineOptions {
  /** @public */ strokeWidth?: number | string;
  /** @public */ strokeDasharray?: number | string;
  /** @public */ strokeDashoffset?: number | string;
  /** @public */ strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit';
  /** @public */ lineBorderWidth?: number | string;
  /** @public */ lineBorderColor?: string;
}

/** @public */
export interface LineChartColorFillBarData {
  /** @public */ startX: number | Date;
  /** @public */ endX: number | Date;
}

/** @public */
export interface LineChartColorFillBar {
  /** @public */ legend: string;
  /** @public */ color: string;
  /** @public */ data: LineChartColorFillBarData[];
  /** @public */ applyPattern?: boolean;
}

/** @public */
export interface LineChartEventAnnotation {
  /** @public */ date: Date;
  /** @public */ event: string;
  /** @public */ onRenderCard?: () => HTMLElement | string;
}

/** @public */
export interface LineChartEventAnnotationProps {
  /** @public */ events: LineChartEventAnnotation[];
  /** @public */ strokeColor?: string;
  /** @public */ labelColor?: string;
  /** @public */ labelHeight?: number;
  /** @public */ labelWidth?: number;
  /** @public */ mergedLabel: (count: number) => string;
}

/** @public */
export interface LineChartSeries {
  /** @public */ legend: string;
  /** @public */ data: LineChartDataPoint[];
  /** @public */ color?: string;
  /** @public */ gaps?: LineChartGap[];
  /** @public */ useSecondaryYScale?: boolean;
  /** @public */ lineOptions?: LineChartLineOptions;
  /** @public */ onLineClick?: VoidFunction;
}

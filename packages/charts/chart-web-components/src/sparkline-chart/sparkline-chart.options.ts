/** @public */
export interface SparklineDataPoint {
  /** @public */ x: number | Date | string;
  /** @public */ y: number;
}

/** @public */
export type SparklineVariant = 'line' | 'area';

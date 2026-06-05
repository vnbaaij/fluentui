import { attr } from '@microsoft/fast-element';
import { scaleLinear, scaleTime } from 'd3-scale';
import { area, line } from 'd3-shape';
import { ChartBase } from '../utils/chart-base.js';
import { getColorFromToken, jsonConverter, SVG_NAMESPACE_URI } from '../utils/chart-helpers.js';
import type { SparklineDataPoint, SparklineVariant } from './sparkline-chart.options.js';

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

const toNumber = (value: number | string | undefined, fallback: number): number => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

interface NormalizedPoint {
  x: number | Date;
  y: number;
}

/** @public */
export class SparklineChart extends ChartBase {
  @attr({ converter: jsonConverter })
  public data!: SparklineDataPoint[];

  @attr
  public variant: SparklineVariant = 'line';

  @attr
  public color?: string;

  protected override _enableResizeObserver = true;

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'variant', 'color'] as const;
    const saved: Partial<Record<(typeof attrFields)[number], unknown>> = {};

    for (const field of attrFields) {
      saved[field] = self[field];
      delete self[field];
    }

    super.connectedCallback();

    for (const field of attrFields) {
      if (self[field] === undefined && saved[field] !== undefined) {
        self[field] = saved[field];
      }
    }

    this._requestRender();
  }

  protected dataChanged() {
    this._requestRender();
  }

  protected variantChanged() {
    this._requestRender();
  }

  protected colorChanged() {
    this._requestRender();
  }

  protected override _performRender(): void {
    if (!this.$fastController.isConnected || !this.chartContainer) {
      return;
    }

    this._applyHostDimensions(this.width, this.height);
    this._clearChart();
    this.legends = [];

    const points = this.data ?? [];
    if (points.length === 0) {
      this.elementInternals.ariaLabel = this._getHostAriaLabel();
      return;
    }

    const width = this.chartContainer.getBoundingClientRect().width || toNumber(this.width, 160);
    const height = this.chartContainer.getBoundingClientRect().height || toNumber(this.height, 48);
    const margins = { top: 4, right: 4, bottom: 4, left: 4 };
    const innerWidth = Math.max(width - margins.left - margins.right, 1);
    const innerHeight = Math.max(height - margins.top - margins.bottom, 1);
    const stroke = this.color ? getColorFromToken(this.color) : '#637cef';

    const normalized = this._normalizePoints(points);
    const yMin = Math.min(...normalized.map(point => point.y));
    const yMax = Math.max(...normalized.map(point => point.y));
    const safeYMax = yMin === yMax ? yMax + 1 : yMax;
    const yScale = scaleLinear().domain([Math.min(0, yMin), safeYMax]).range([innerHeight, 0]);

    const svg = createSvgElement<SVGSVGElement>('svg');
    svg.classList.add('chart');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const group = createSvgElement<SVGGElement>('g');
    group.setAttribute('transform', `translate(${margins.left}, ${margins.top})`);
    svg.appendChild(group);

    const isTimeSeries = normalized[0]?.x instanceof Date;
    const xDomainStart = normalized[0]?.x ?? 0;
    const xDomainEnd = normalized[normalized.length - 1]?.x ?? 0;
    const safeEnd =
      isTimeSeries && xDomainStart instanceof Date && xDomainEnd instanceof Date && xDomainStart.getTime() === xDomainEnd.getTime()
        ? new Date(xDomainEnd.getTime() + 1)
        : !isTimeSeries && xDomainStart === xDomainEnd
          ? Number(xDomainEnd) + 1
          : xDomainEnd;

    const xScale = isTimeSeries
      ? scaleTime().domain([xDomainStart as Date, safeEnd as Date]).range([0, innerWidth])
      : scaleLinear().domain([Number(xDomainStart), Number(safeEnd)]).range([0, innerWidth]);

    const lineGenerator = line<NormalizedPoint>()
      .x(point => (point.x instanceof Date ? xScale(point.x) : xScale(Number(point.x))))
      .y(point => yScale(point.y));

    if (this.variant === 'area') {
      const areaGenerator = area<NormalizedPoint>()
        .x(point => (point.x instanceof Date ? xScale(point.x) : xScale(Number(point.x))))
        .y0(innerHeight)
        .y1(point => yScale(point.y));

      const areaPath = createSvgElement<SVGPathElement>('path');
      areaPath.classList.add('sparkline-area');
      areaPath.setAttribute('fill', stroke);
      areaPath.setAttribute('d', areaGenerator(normalized) ?? '');
      group.appendChild(areaPath);
    }

    const linePath = createSvgElement<SVGPathElement>('path');
    linePath.classList.add('sparkline-line');
    linePath.setAttribute('stroke', stroke);
    linePath.setAttribute('d', lineGenerator(normalized) ?? '');
    group.appendChild(linePath);

    this.chartContainer.appendChild(svg);
    this.elementInternals.ariaLabel = this._getHostAriaLabel();
  }

  protected override _applyActiveLegendState(): void {}

  protected override _getHostAriaLabel(): string {
    const count = this.data?.length ?? 0;
    return count > 0 ? `Sparkline chart with ${count} points.` : 'Sparkline chart with no data.';
  }

  private _clearChart(): void {
    while (this.chartContainer?.firstChild) {
      this.chartContainer.firstChild.remove();
    }
  }

  private _normalizePoints(points: SparklineDataPoint[]): NormalizedPoint[] {
    const isTimeSeries = points.some(
      point => point.x instanceof Date || (typeof point.x === 'string' && Number.isNaN(Number(point.x)) && !Number.isNaN(Date.parse(point.x))),
    );

    return points.map((point, index) => {
      if (isTimeSeries) {
        return {
          x: point.x instanceof Date ? point.x : new Date(point.x),
          y: point.y,
        };
      }

      return {
        x: typeof point.x === 'number' ? point.x : Number.isFinite(Number(point.x)) ? Number(point.x) : index,
        y: point.y,
      };
    });
  }
}

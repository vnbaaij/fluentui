import { attr } from '@microsoft/fast-element';
import { extent } from 'd3-array';
import { type Axis, axisBottom, type AxisDomain, axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import { type ScaleLinear, scaleLinear, type ScaleTime, scaleTime } from 'd3-scale';
import { line as createLine } from 'd3-shape';
import { timeFormat, utcFormat } from 'd3-time-format';
import type { TooltipProps } from '../utils/chart-options.js';
import { CartesianChartBase } from '../utils/cartesian-chart-base.js';
import { getDirectionalMargins } from '../utils/cartesian-axis-helpers.js';
import {
  applyAxisTickConfig,
  type AxisScaleLike,
  computePreparedNumericYAxis,
  DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
  renderBottomAxisShared,
  renderPrimaryYAxisShared,
  toAxisNumber as toNumber,
  toOptionalAxisNumber as toOptionalNumber,
} from '../utils/cartesian-axis-shared.js';
import {
  formatLocaleNumber,
  getColorFromToken,
  getNextColor,
  jsonConverter,
  parseDateOrNumber,
  SVG_NAMESPACE_URI,
} from '../utils/chart-helpers.js';
import type { LineChartDataPoint, LineChartSeries } from './line-chart.options.js';

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

type TooltipState = TooltipProps & { xValue: string };
type XValue = number | Date;
type ContinuousScale = ScaleLinear<number, number> | ScaleTime<number, number>;
type NormalizedPoint = LineChartDataPoint & { x: XValue; xLabel: string; cx: number; cy: number };
type NormalizedSeries = { legend: string; color: string; data: NormalizedPoint[] };

const defaultMargins = { top: 40, right: 20, bottom: 50, left: 60 };

const formatNumberValue = (value: number, specifier: string | undefined, culture: string | undefined): string => {
  if (specifier) {
    try {
      return format(specifier)(value);
    } catch {
      // Fall back to locale formatting below.
    }
  }
  return formatLocaleNumber(value, culture);
};

const formatDateValue = (chart: LineChart, value: Date): string => {
  if (chart.customDateTimeFormatter) {
    return chart.customDateTimeFormatter(value);
  }
  if (chart.tickFormat) {
    try {
      return (chart.useUTC ? utcFormat(chart.tickFormat) : timeFormat(chart.tickFormat))(value);
    } catch {
      // Fall back to Intl below.
    }
  }
  try {
    return new Intl.DateTimeFormat(chart.culture, chart.dateLocalizeOptions).format(value);
  } catch {
    return new Intl.DateTimeFormat(undefined, chart.dateLocalizeOptions).format(value);
  }
};

const getNormalizedXValue = (value: number | Date): XValue => {
  const parsed = parseDateOrNumber(value as number | Date | string);
  return parsed instanceof Date ? parsed : Number(parsed);
};

/** @public */
export class LineChart extends CartesianChartBase {
  public declare tooltipProps: TooltipState;

  @attr({ converter: jsonConverter })
  public data!: LineChartSeries[];

  @attr({ attribute: 'show-markers', mode: 'boolean' })
  public showMarkers: boolean = false;

  @attr({ attribute: 'y-axis-tick-label-max-width' })
  public yAxisTickLabelMaxWidth?: number | string;

  protected override _enableResizeObserver = true;

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'showMarkers', 'yAxisTickLabelMaxWidth'] as const;
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

    this.tooltipProps = { ...this.tooltipProps, xValue: '' } as TooltipState;
    this._requestRender();
  }

  public get tooltipInlineTransform(): string {
    return this._isRTL ? 'translateX(50%)' : 'translateX(-50%)';
  }

  protected dataChanged(): void {
    this._requestRender();
  }

  protected showMarkersChanged(): void {
    this._requestRender();
  }

  protected yAxisTickLabelMaxWidthChanged(): void {
    this._requestRender();
  }

  protected override _clearTooltip(): void {
    this.tooltipProps = { isVisible: false, legend: '', xValue: '', yValue: '', color: '', xPos: 0, yPos: 0 };
  }

  protected override _buildDefaultTooltipHTML(): string {
    return [
      `<div class="tooltip-header">${this.tooltipProps.yValue}</div>`,
      `<div class="tooltip-info" style="border-color: ${this.tooltipProps.color};">`,
      `<div class="tooltip-legend-text">${this.tooltipProps.legend}</div>`,
      `<div class="tooltip-primary-value" style="color: ${this.tooltipProps.color};">${this.tooltipProps.xValue}</div>`,
      `</div>`,
    ].join('');
  }

  protected override _performRender(): void {
    if (!this.$fastController.isConnected || !this.chartContainer) {
      return;
    }

    this._applyHostDimensions(this.width, this.height);
    this._clearChart();

    const seriesData = Array.isArray(this.data) ? this.data : [];
    if (seriesData.length === 0) {
      this.legends = [];
      this._updateLegendInteractionState();
      this.elementInternals.ariaLabel = this._getHostAriaLabel();
      return;
    }

    const flattened = seriesData.flatMap(series => series.data.map(point => getNormalizedXValue(point.x)));
    const isDateAxis = flattened.some(value => value instanceof Date);

    const normalizedSeries: NormalizedSeries[] = seriesData.map((series, index) => {
      const color = series.color ? getColorFromToken(series.color) : getNextColor(index, 0);
      const data = series.data.map(point => {
        const x = getNormalizedXValue(point.x);
        return {
          x,
          y: point.y,
          xLabel:
            x instanceof Date ? formatDateValue(this, x) : formatNumberValue(x, this.xAxisTickFormat, this.culture),
          cx: 0,
          cy: 0,
        };
      });
      return { legend: series.legend, color, data };
    });

    const width = this.chartContainer.getBoundingClientRect().width || toNumber(this.width, 500);
    const height = toNumber(this.height, 300);
    const margins = getDirectionalMargins(defaultMargins, this._isRTL);
    const innerWidth = Math.max(width - margins.left - margins.right, 1);
    const innerHeight = Math.max(height - margins.top - margins.bottom, 1);

    const yValues = normalizedSeries.flatMap(series => series.data.map(point => point.y));
    const rawYExtent = extent(yValues);
    let yMin = toOptionalNumber(this.yMinValue) ?? rawYExtent[0] ?? 0;
    let yMax = toOptionalNumber(this.yMaxValue) ?? rawYExtent[1] ?? 1;
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }

    let xScale: ContinuousScale;
    let xFormatter: (value: AxisDomain) => string;
    if (isDateAxis) {
      const dateValues = normalizedSeries
        .flatMap(series => series.data.map(point => point.x))
        .filter((value): value is Date => value instanceof Date);
      const rawExtent = extent(dateValues, value => value.getTime());
      const xMin =
        this.xMinValue !== undefined
          ? parseDateOrNumber(this.xMinValue as string | number)
          : new Date(rawExtent[0] ?? 0);
      const xMax =
        this.xMaxValue !== undefined
          ? parseDateOrNumber(this.xMaxValue as string | number)
          : new Date(rawExtent[1] ?? 0);
      const domainMin = xMin instanceof Date ? xMin : new Date(Number(xMin));
      const domainMax = xMax instanceof Date ? xMax : new Date(Number(xMax));
      xScale = scaleTime().domain([domainMin, domainMax]).range([0, innerWidth]);
      if (this.roundedTicks) {
        xScale.nice();
      }
      xFormatter = value => formatDateValue(this, value as Date);
    } else {
      const xValues = normalizedSeries
        .flatMap(series => series.data.map(point => point.x))
        .filter((value): value is number => typeof value === 'number');
      const rawExtent = extent(xValues);
      let xMin = toOptionalNumber(this.xMinValue) ?? rawExtent[0] ?? 0;
      let xMax = toOptionalNumber(this.xMaxValue) ?? rawExtent[1] ?? 1;
      if (xMin === xMax) {
        xMin -= 1;
        xMax += 1;
      }
      xScale = scaleLinear().domain([xMin, xMax]).range([0, innerWidth]);
      if (this.roundedTicks) {
        xScale.nice();
      }
      xFormatter = value => formatNumberValue(Number(value), this.xAxisTickFormat, this.culture);
    }

    const preparedYAxis = computePreparedNumericYAxis({
      minValue: yMin,
      maxValue: yMax,
      tickCount: toNumber(this.yAxisTickCount, DEFAULT_REACT_NUMERIC_Y_TICK_COUNT),
      roundedTicks: this.roundedTicks,
    });

    const yScale = scaleLinear().domain([preparedYAxis.domainMin, preparedYAxis.domainMax]).range([innerHeight, 0]);

    normalizedSeries.forEach(series => {
      series.data.forEach(point => {
        point.cx = xScale(point.x as never) ?? 0;
        point.cy = yScale(point.y);
      });
    });

    const svg = createSvgElement<SVGSVGElement>('svg');
    svg.classList.add('chart-svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const plotGroup = createSvgElement<SVGGElement>('g');
    plotGroup.setAttribute('transform', `translate(${margins.left}, ${margins.top})`);
    svg.appendChild(plotGroup);

    const xAxis = axisBottom(xScale).tickPadding(toNumber(this.tickPadding, 6));
    if (!isDateAxis) {
      xAxis.ticks(6);
    }
    if (this.tickValues?.length) {
      if (isDateAxis) {
        xAxis.tickValues(this.tickValues.map(value => parseDateOrNumber(value as string | number | Date) as Date));
      } else {
        xAxis.tickValues(this.tickValues.map(value => Number(value)));
      }
    }

    const yAxis = axisLeft(yScale).tickPadding(toNumber(this.tickPadding, 6));
    applyAxisTickConfig(
      yAxis,
      this.yAxisTickCount ?? DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
      this.yAxisTickValues ?? preparedYAxis.tickValues,
    );

    const showTooltipForPoint = (legend: string, color: string, point: NormalizedPoint) => {
      if (!this._shouldShowTooltip(legend) || this.hideTooltip) {
        return;
      }
      const hostRect = this.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const anchorX = svgRect.left - hostRect.left + margins.left + point.cx;
      const anchorY = svgRect.top - hostRect.top + margins.top + point.cy;
      this._currentTooltipDataPoint = { legend, x: point.x, y: point.y };
      this.tooltipProps = {
        isVisible: true,
        legend,
        xValue: point.xLabel,
        yValue: formatNumberValue(point.y, this.yAxisTickFormat, this.culture),
        color,
        xPos: anchorX,
        yPos: anchorY,
      };
      this._positionTooltipFromAnchor(anchorX, anchorY, { outputAnchorX: true, preferredVertical: 'above' });
    };

    const showNearestPoint = (legend: string, color: string, points: NormalizedPoint[], event: MouseEvent) => {
      const svgRect = svg.getBoundingClientRect();
      const localX = event.clientX - svgRect.left - margins.left;
      const nearest = points.reduce((best, candidate) =>
        Math.abs(candidate.cx - localX) < Math.abs(best.cx - localX) ? candidate : best,
      );
      showTooltipForPoint(legend, color, nearest);
    };

    normalizedSeries.forEach(series => {
      const path = createSvgElement<SVGPathElement>('path');
      path.classList.add('line-path');
      path.dataset.legend = series.legend;
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', series.color);
      path.setAttribute(
        'd',
        createLine<NormalizedPoint>()
          .x(point => point.cx)
          .y(point => point.cy)(series.data) ?? '',
      );
      path.addEventListener('mouseenter', event => showNearestPoint(series.legend, series.color, series.data, event));
      path.addEventListener('mousemove', event => showNearestPoint(series.legend, series.color, series.data, event));
      path.addEventListener('mouseleave', () => this._clearTooltip());
      plotGroup.appendChild(path);

      if (this.showMarkers) {
        series.data.forEach(point => {
          const circle = createSvgElement<SVGCircleElement>('circle');
          circle.classList.add('line-marker');
          circle.dataset.legend = series.legend;
          circle.setAttribute('cx', String(point.cx));
          circle.setAttribute('cy', String(point.cy));
          circle.setAttribute('r', '4');
          circle.setAttribute('fill', series.color);
          circle.addEventListener('mouseenter', () => showTooltipForPoint(series.legend, series.color, point));
          circle.addEventListener('mouseleave', () => this._clearTooltip());
          plotGroup.appendChild(circle);
        });
      }
    });

    renderBottomAxisShared({
      svg,
      scale: xScale as AxisScaleLike<AxisDomain>,
      axis: xAxis as Axis<AxisDomain>,
      formatter: xFormatter,
      axisLeft: margins.left,
      axisTop: margins.top,
      innerWidth,
      innerHeight,
      tickPadding: toNumber(this.tickPadding, 6),
      isRTL: this._isRTL,
      rotateXAxisLabels: this.rotateXAxisLabels,
      wrapXAxisLabels: this.wrapXAxisLabels,
      hideTickOverlap: this.hideTickOverlap,
      showXAxisLabelsTooltip: this.showXAxisLabelsTooltip,
      axisLabelTooltipHandlers: {
        show: (target, fullLabel) => this._showAxisLabelTooltip(target, fullLabel),
        hide: () => this._hideAxisLabelTooltip(),
      },
      xAxisTitle: this.xAxisTitle,
    });
    renderPrimaryYAxisShared({
      svg,
      scale: yScale as AxisScaleLike<number>,
      axis: yAxis as unknown as Axis<number>,
      formatter: value => formatNumberValue(value, this.yAxisTickFormat, this.culture),
      axisStartX: margins.left,
      axisTop: margins.top,
      innerHeight,
      innerWidth,
      tickPadding: toNumber(this.tickPadding, 6),
      isRTL: this._isRTL,
      yAxisTitle: this.yAxisTitle,
      tickLabelMaxWidth: toOptionalNumber(this.yAxisTickLabelMaxWidth),
    });

    this.chartContainer.appendChild(svg);
    this.legends = normalizedSeries.map(series => ({ legend: series.legend, color: series.color }));
    this._updateLegendInteractionState();
    this.elementInternals.ariaLabel = this._getHostAriaLabel();
  }

  protected override _applyActiveLegendState(): void {
    if (!this.chartContainer) {
      return;
    }
    const highlighted = this._getHighlightedLegends();
    const hasSelection = highlighted.length > 0;
    this.chartContainer.querySelectorAll<SVGElement>('.line-path, .line-marker').forEach(element => {
      const legend = element.dataset.legend ?? '';
      const isActive = !hasSelection || highlighted.includes(legend);
      element.classList.toggle('inactive', !isActive);
      element.setAttribute('opacity', isActive ? '1' : '0.1');
    });
  }

  protected override _getHostAriaLabel(): string {
    const seriesCount = Array.isArray(this.data) ? this.data.length : 0;
    if (seriesCount === 0) {
      return this.chartTitle ? `${this.chartTitle}. No data.` : 'Line chart with no data.';
    }
    return `${this.chartTitle || 'Line chart'}. ${seriesCount} series.`;
  }

  private _clearChart(): void {
    while (this.chartContainer.firstChild) {
      this.chartContainer.firstChild.remove();
    }
  }
}

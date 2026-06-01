import { attr } from '@microsoft/fast-element';
import { extent } from 'd3-array';
import { axisBottom, axisLeft, type Axis, type AxisDomain } from 'd3-axis';
import { format } from 'd3-format';
import { scaleLinear, scaleTime, type ScaleLinear, type ScaleTime } from 'd3-scale';
import { line as createLine } from 'd3-shape';
import { timeFormat, utcFormat } from 'd3-time-format';
import type { TooltipProps } from '../utils/chart-options.js';
import { CartesianChartBase } from '../utils/cartesian-chart-base.js';
import {
  formatLocaleNumber,
  getColorFromToken,
  getNextColor,
  jsonConverter,
  parseDateOrNumber,
  SVG_NAMESPACE_URI,
  wrapText,
} from '../utils/chart-helpers.js';
import type { LineChartDataPoint, LineChartSeries } from './line-chart.options.js';

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

type TooltipState = TooltipProps & { xValue: string };
type XValue = number | Date;
type ContinuousScale = ScaleLinear<number, number> | ScaleTime<number, number>;
type ScaleLike<Domain extends AxisDomain> = {
  domain(): Domain[];
  ticks?: (count?: number) => Domain[];
  bandwidth?: () => number;
  (value: Domain): number | undefined;
};
type NormalizedPoint = LineChartDataPoint & { x: XValue; xLabel: string; cx: number; cy: number };
type NormalizedSeries = { legend: string; color: string; data: NormalizedPoint[] };

const defaultMargins = { top: 40, right: 20, bottom: 50, left: 60 };

const toNumber = (value: number | string | undefined, fallback: number): number => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (value: number | string | undefined): number | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

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

const getTickValues = <Domain extends AxisDomain>(axis: Axis<Domain>, scale: ScaleLike<Domain>): Domain[] => {
  const explicit = axis.tickValues();
  if (explicit) {
    return Array.from(explicit as Iterable<Domain>);
  }
  if (typeof scale.ticks === 'function') {
    const [count] = axis.tickArguments() as [number?];
    return scale.ticks(count);
  }
  return scale.domain();
};

const getPosition = <Domain extends AxisDomain>(scale: ScaleLike<Domain>, value: Domain): number => {
  const start = scale(value) ?? 0;
  return typeof scale.bandwidth === 'function' ? start + scale.bandwidth() / 2 : start;
};

const renderBottomAxis = <Domain extends AxisDomain>(
  svg: SVGSVGElement,
  chart: LineChart,
  scale: ScaleLike<Domain>,
  axis: Axis<Domain>,
  formatter: (value: Domain) => string,
  innerWidth: number,
  innerHeight: number,
): void => {
  const group = createSvgElement<SVGGElement>('g');
  group.classList.add('x-axis');
  group.setAttribute('transform', `translate(${defaultMargins.left}, ${defaultMargins.top + innerHeight})`);

  const domain = createSvgElement<SVGLineElement>('line');
  domain.classList.add('axis-domain');
  domain.setAttribute('x1', '0');
  domain.setAttribute('x2', String(innerWidth));
  group.appendChild(domain);

  const tickPadding = toNumber(chart.tickPadding, 6);
  let previousRight = Number.NEGATIVE_INFINITY;

  getTickValues(axis, scale).forEach(value => {
    const tick = createSvgElement<SVGGElement>('g');
    tick.classList.add('tick');
    tick.setAttribute('transform', `translate(${getPosition(scale, value)}, 0)`);

    const line = createSvgElement<SVGLineElement>('line');
    line.classList.add('axis-tick-line');
    line.setAttribute('y2', '6');
    tick.appendChild(line);

    const text = createSvgElement<SVGTextElement>('text');
    text.classList.add('axis-text');
    text.setAttribute('y', String(6 + tickPadding));
    text.setAttribute('text-anchor', chart.rotateXAxisLabels ? 'start' : 'middle');
    text.textContent = formatter(value);
    if (chart.rotateXAxisLabels) {
      text.setAttribute('transform', 'rotate(45)');
    }
    if (chart.showXAxisLabelsTooltip) {
      const title = createSvgElement<SVGTitleElement>('title');
      title.textContent = text.textContent;
      text.appendChild(title);
    }
    tick.appendChild(text);
    group.appendChild(tick);

    if (chart.wrapXAxisLabels && typeof scale.bandwidth === 'function') {
      wrapText(text, Math.max(scale.bandwidth(), 1));
    } else if (chart.hideTickOverlap && !chart.rotateXAxisLabels) {
      const box = text.getBBox();
      const left = getPosition(scale, value) + box.x;
      const right = left + box.width;
      if (left < previousRight) {
        tick.style.display = 'none';
      } else {
        previousRight = right + 4;
      }
    }
  });

  if (chart.xAxisTitle) {
    const title = createSvgElement<SVGTextElement>('text');
    title.classList.add('x-axis-title');
    title.setAttribute('x', String(innerWidth / 2));
    title.setAttribute('y', '42');
    title.setAttribute('text-anchor', 'middle');
    title.textContent = chart.xAxisTitle;
    group.appendChild(title);
  }

  svg.appendChild(group);
};

const renderLeftAxis = (
  svg: SVGSVGElement,
  chart: LineChart,
  scale: ScaleLike<number>,
  axis: Axis<number>,
  formatter: (value: number) => string,
  innerHeight: number,
): void => {
  const group = createSvgElement<SVGGElement>('g');
  group.classList.add('y-axis');
  group.setAttribute('transform', `translate(${defaultMargins.left}, ${defaultMargins.top})`);

  const domain = createSvgElement<SVGLineElement>('line');
  domain.classList.add('axis-domain');
  domain.setAttribute('y2', String(innerHeight));
  group.appendChild(domain);

  const tickPadding = toNumber(chart.tickPadding, 6);
  getTickValues(axis, scale).forEach(value => {
    const tick = createSvgElement<SVGGElement>('g');
    tick.classList.add('tick');
    tick.setAttribute('transform', `translate(0, ${getPosition(scale, value)})`);

    const line = createSvgElement<SVGLineElement>('line');
    line.classList.add('axis-tick-line');
    line.setAttribute('x2', '-6');
    tick.appendChild(line);

    const text = createSvgElement<SVGTextElement>('text');
    text.classList.add('y-axis-text');
    text.setAttribute('x', String(-(6 + tickPadding)));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('dominant-baseline', 'middle');
    text.textContent = formatter(value);
    tick.appendChild(text);

    group.appendChild(tick);
  });

  if (chart.yAxisTitle) {
    const title = createSvgElement<SVGTextElement>('text');
    title.classList.add('y-axis-title');
    title.setAttribute('x', String(-innerHeight / 2));
    title.setAttribute('y', '-42');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('transform', 'rotate(-90)');
    title.textContent = chart.yAxisTitle;
    group.appendChild(title);
  }

  svg.appendChild(group);
};

/** @public */
export class LineChart extends CartesianChartBase {
  declare public tooltipProps: TooltipState;

  @attr({ converter: jsonConverter })
  public data!: LineChartSeries[];

  @attr({ attribute: 'show-markers', mode: 'boolean' })
  public showMarkers: boolean = false;

  protected override _enableResizeObserver = true;

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'showMarkers'] as const;
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
          xLabel: x instanceof Date ? formatDateValue(this, x) : formatNumberValue(x, this.xAxisTickFormat, this.culture),
          cx: 0,
          cy: 0,
        };
      });
      return { legend: series.legend, color, data };
    });

    const width = this.chartContainer.getBoundingClientRect().width || toNumber(this.width, 500);
    const height = toNumber(this.height, 300);
    const innerWidth = Math.max(width - defaultMargins.left - defaultMargins.right, 1);
    const innerHeight = Math.max(height - defaultMargins.top - defaultMargins.bottom, 1);

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
      const dateValues = normalizedSeries.flatMap(series => series.data.map(point => point.x)).filter((value): value is Date => value instanceof Date);
      const rawExtent = extent(dateValues, value => value.getTime());
      const xMin = this.xMinValue !== undefined ? parseDateOrNumber(this.xMinValue as string | number) : new Date(rawExtent[0] ?? 0);
      const xMax = this.xMaxValue !== undefined ? parseDateOrNumber(this.xMaxValue as string | number) : new Date(rawExtent[1] ?? 0);
      const domainMin = xMin instanceof Date ? xMin : new Date(Number(xMin));
      const domainMax = xMax instanceof Date ? xMax : new Date(Number(xMax));
      xScale = scaleTime().domain([domainMin, domainMax]).range([0, innerWidth]);
      if (this.roundedTicks) {
        xScale.nice();
      }
      xFormatter = value => formatDateValue(this, value as Date);
    } else {
      const xValues = normalizedSeries.flatMap(series => series.data.map(point => point.x)).filter((value): value is number => typeof value === 'number');
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

    const yScale = scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);
    if (this.roundedTicks) {
      yScale.nice();
    }

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
    plotGroup.setAttribute('transform', `translate(${defaultMargins.left}, ${defaultMargins.top})`);
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

    const yAxis = axisLeft(yScale).tickPadding(toNumber(this.tickPadding, 6)).ticks(6);
    if (this.yAxisTickValues?.length) {
      yAxis.tickValues(this.yAxisTickValues);
    }

    const showTooltipForPoint = (legend: string, color: string, point: NormalizedPoint) => {
      if (!this._shouldShowTooltip(legend) || this.hideTooltip) {
        return;
      }
      const hostRect = this.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      this._currentTooltipDataPoint = { legend, x: point.x, y: point.y };
      this.tooltipProps = {
        isVisible: true,
        legend,
        xValue: point.xLabel,
        yValue: formatNumberValue(point.y, this.yAxisTickFormat, this.culture),
        color,
        xPos: svgRect.left - hostRect.left + defaultMargins.left + point.cx,
        yPos: svgRect.top - hostRect.top + defaultMargins.top + point.cy,
      };
    };

    const showNearestPoint = (legend: string, color: string, points: NormalizedPoint[], event: MouseEvent) => {
      const svgRect = svg.getBoundingClientRect();
      const localX = event.clientX - svgRect.left - defaultMargins.left;
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

    renderBottomAxis(svg, this, xScale as ScaleLike<AxisDomain>, xAxis as Axis<AxisDomain>, xFormatter, innerWidth, innerHeight);
    renderLeftAxis(
      svg,
      this,
      yScale as ScaleLike<number>,
      yAxis as unknown as Axis<number>,
      value => formatNumberValue(value, this.yAxisTickFormat, this.culture),
      innerHeight,
    );

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

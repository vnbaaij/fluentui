import { attr } from '@microsoft/fast-element';
import { extent } from 'd3-array';
import { type Axis, axisBottom, type AxisDomain, axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import { scaleLinear, type ScaleLinear } from 'd3-scale';
import type { TooltipProps } from '../utils/chart-options.js';
import { CartesianChartBase } from '../utils/cartesian-chart-base.js';
import { getDirectionalMargins } from '../utils/cartesian-axis-helpers.js';
import {
  type AxisScaleLike,
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
  SVG_NAMESPACE_URI,
} from '../utils/chart-helpers.js';
import type { ScatterChartSeries } from './scatter-chart.options.js';

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

type TooltipState = TooltipProps & { xValue: string };

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

/** @public */
export class ScatterChart extends CartesianChartBase {
  public declare tooltipProps: TooltipState;

  @attr({ converter: jsonConverter })
  public data!: ScatterChartSeries[];

  protected override _enableResizeObserver = true;

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data'] as const;
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

    const normalizedSeries = seriesData.map((series, index) => ({
      legend: series.legend,
      color: series.color ? getColorFromToken(series.color) : getNextColor(index, 0),
      data: series.data.map(point => ({
        ...point,
        xLabel: formatNumberValue(point.x, this.xAxisTickFormat, this.culture),
        yLabel: formatNumberValue(point.y, this.yAxisTickFormat, this.culture),
      })),
    }));

    const width = this.chartContainer.getBoundingClientRect().width || toNumber(this.width, 500);
    const height = toNumber(this.height, 300);
    const margins = getDirectionalMargins(defaultMargins, this._isRTL);
    const innerWidth = Math.max(width - margins.left - margins.right, 1);
    const innerHeight = Math.max(height - margins.top - margins.bottom, 1);

    const xExtent = extent(normalizedSeries.flatMap(series => series.data.map(point => point.x)));
    const yExtent = extent(normalizedSeries.flatMap(series => series.data.map(point => point.y)));
    let xMin = toOptionalNumber(this.xMinValue) ?? xExtent[0] ?? 0;
    let xMax = toOptionalNumber(this.xMaxValue) ?? xExtent[1] ?? 1;
    let yMin = toOptionalNumber(this.yMinValue) ?? yExtent[0] ?? 0;
    let yMax = toOptionalNumber(this.yMaxValue) ?? yExtent[1] ?? 1;
    if (xMin == xMax) {
      xMin -= 1;
      xMax += 1;
    }
    if (yMin == yMax) {
      yMin -= 1;
      yMax += 1;
    }

    const xScale: ScaleLinear<number, number> = scaleLinear().domain([xMin, xMax]).range([0, innerWidth]);
    const yScale: ScaleLinear<number, number> = scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);
    if (this.roundedTicks) {
      xScale.nice();
      yScale.nice();
    }

    const svg = createSvgElement<SVGSVGElement>('svg');
    svg.classList.add('chart-svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const plotGroup = createSvgElement<SVGGElement>('g');
    plotGroup.setAttribute('transform', `translate(${margins.left}, ${margins.top})`);
    svg.appendChild(plotGroup);

    const xAxis = axisBottom(xScale).tickPadding(toNumber(this.tickPadding, 6)).ticks(6);
    if (this.tickValues?.length) {
      xAxis.tickValues(this.tickValues.map(value => Number(value)));
    }

    const yAxis = axisLeft(yScale).tickPadding(toNumber(this.tickPadding, 6)).ticks(6);
    if (this.yAxisTickValues?.length) {
      yAxis.tickValues(this.yAxisTickValues);
    }

    normalizedSeries.forEach(series => {
      series.data.forEach(point => {
        const circle = createSvgElement<SVGCircleElement>('circle');
        circle.classList.add('scatter-point');
        circle.dataset.legend = series.legend;
        circle.setAttribute('cx', String(xScale(point.x)));
        circle.setAttribute('cy', String(yScale(point.y)));
        circle.setAttribute('r', String(point.size ?? 6));
        circle.setAttribute('fill', series.color);
        circle.addEventListener('mouseenter', () => {
          if (!this._shouldShowTooltip(series.legend) || this.hideTooltip) {
            return;
          }
          const hostRect = this.getBoundingClientRect();
          const svgRect = svg.getBoundingClientRect();
          this._currentTooltipDataPoint = { legend: series.legend, ...point };
          this.tooltipProps = {
            isVisible: true,
            legend: series.legend,
            xValue: point.xLabel,
            yValue: point.yLabel,
            color: series.color,
            xPos: svgRect.left - hostRect.left + margins.left + xScale(point.x),
            yPos: svgRect.top - hostRect.top + margins.top + yScale(point.y),
          };
        });
        circle.addEventListener('mouseleave', () => this._clearTooltip());
        plotGroup.appendChild(circle);
      });
    });

    renderBottomAxisShared({
      svg,
      scale: xScale as AxisScaleLike<number>,
      axis: xAxis as unknown as Axis<number>,
      formatter: value => formatNumberValue(value, this.xAxisTickFormat, this.culture),
      axisLeft: margins.left,
      axisTop: margins.top,
      innerWidth,
      innerHeight,
      tickPadding: toNumber(this.tickPadding, 6),
      rotateXAxisLabels: this.rotateXAxisLabels,
      wrapXAxisLabels: this.wrapXAxisLabels,
      wrapLabelWidth: 48,
      hideTickOverlap: this.hideTickOverlap,
      showXAxisLabelsTooltip: this.showXAxisLabelsTooltip,
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
    this.chartContainer.querySelectorAll<SVGElement>('.scatter-point').forEach(element => {
      const legend = element.dataset.legend ?? '';
      const isActive = !hasSelection || highlighted.includes(legend);
      element.classList.toggle('inactive', !isActive);
      element.setAttribute('opacity', isActive ? '1' : '0.1');
    });
  }

  protected override _getHostAriaLabel(): string {
    const seriesCount = Array.isArray(this.data) ? this.data.length : 0;
    if (seriesCount === 0) {
      return this.chartTitle ? `${this.chartTitle}. No data.` : 'Scatter chart with no data.';
    }
    return `${this.chartTitle || 'Scatter chart'}. ${seriesCount} series.`;
  }

  private _clearChart(): void {
    while (this.chartContainer.firstChild) {
      this.chartContainer.firstChild.remove();
    }
  }
}

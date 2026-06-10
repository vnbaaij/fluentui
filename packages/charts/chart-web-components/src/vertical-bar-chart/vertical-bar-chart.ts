import { attr } from '@microsoft/fast-element';
import { max } from 'd3-array';
import { type Axis, axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import { type ScaleBand, scaleBand, type ScaleLinear, scaleLinear } from 'd3-scale';
import type { TooltipProps } from '../utils/chart-options.js';
import { CartesianChartBase } from '../utils/cartesian-chart-base.js';
import { getDirectionalMargins } from '../utils/cartesian-axis-helpers.js';
import {
  applyAxisTickConfig,
  computePreparedNumericYAxis,
  DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
  renderBottomAxisShared,
  renderPrimaryYAxisShared,
  sortCategoryGroups,
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
import type { VerticalBarChartDataPoint } from './vertical-bar-chart.options.js';

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
export class VerticalBarChart extends CartesianChartBase {
  public declare tooltipProps: TooltipState;

  @attr({ converter: jsonConverter })
  public data!: VerticalBarChartDataPoint[];

  @attr({ attribute: 'bar-width' })
  public barWidth?: number | string;

  @attr({ attribute: 'use-single-color', mode: 'boolean' })
  public useSingleColor: boolean = false;

  protected override _enableResizeObserver = true;

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'barWidth', 'useSingleColor'] as const;
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

  protected barWidthChanged(): void {
    this._requestRender();
  }

  protected useSingleColorChanged(): void {
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

    const points = Array.isArray(this.data) ? this.data : [];
    if (points.length === 0) {
      this.legends = [];
      this._updateLegendInteractionState();
      this.elementInternals.ariaLabel = this._getHostAriaLabel();
      return;
    }

    const width = this.chartContainer.getBoundingClientRect().width || toNumber(this.width, 500);
    const height = toNumber(this.height, 300);
    const margins = getDirectionalMargins(defaultMargins, this._isRTL);
    const innerWidth = Math.max(width - margins.left - margins.right, 1);
    const innerHeight = Math.max(height - margins.top - margins.bottom, 1);
    const groupsByCategory = new Map<string, VerticalBarChartDataPoint[]>();
    points.forEach(point => {
      const key = String(point.x);
      groupsByCategory.set(key, [...(groupsByCategory.get(key) ?? []), point]);
    });
    const xDomain = sortCategoryGroups(
      Array.from(groupsByCategory.entries()).map(([key, groupedPoints]) => ({ key, points: groupedPoints })),
      this.xAxisCategoryOrder,
      points.map(point => String(point.x)),
      group => group.points.map(point => point.y),
    ).map(group => group.key);
    const xScale = scaleBand<string>().domain(xDomain).range([0, innerWidth]).padding(0.2);
    const maxY = max(points, point => point.y) ?? 0;
    const preparedYAxis = computePreparedNumericYAxis({
      minValue: toOptionalNumber(this.yMinValue) ?? 0,
      maxValue: toOptionalNumber(this.yMaxValue) ?? Math.max(maxY, 1),
      tickCount: toNumber(this.yAxisTickCount, DEFAULT_REACT_NUMERIC_Y_TICK_COUNT),
      roundedTicks: this.roundedTicks,
    });
    const yScale = scaleLinear().domain([preparedYAxis.domainMin, preparedYAxis.domainMax]).range([innerHeight, 0]);

    const svg = createSvgElement<SVGSVGElement>('svg');
    svg.classList.add('chart-svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const plotGroup = createSvgElement<SVGGElement>('g');
    plotGroup.setAttribute('transform', `translate(${margins.left}, ${margins.top})`);
    svg.appendChild(plotGroup);

    const xAxis = axisBottom(xScale).tickPadding(toNumber(this.tickPadding, 6));
    applyAxisTickConfig(
      xAxis,
      this.xAxisTickCount,
      this.tickValues?.map(value => String(value)),
    );
    const yAxis = axisLeft(yScale).tickPadding(toNumber(this.tickPadding, 6));
    applyAxisTickConfig(
      yAxis,
      this.yAxisTickCount ?? DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
      this.yAxisTickValues ?? preparedYAxis.tickValues,
    );

    const singleColor = this.useSingleColor
      ? points[0].color
        ? getColorFromToken(points[0].color)
        : getNextColor(0, 0)
      : undefined;

    const legendMap = new Map<string, string>();

    points.forEach((point, index) => {
      const key = String(point.x);
      const legend = point.legend ?? key;
      const x = xScale(key) ?? 0;
      const requestedWidth = toOptionalNumber(this.barWidth);
      const actualWidth = Math.min(requestedWidth ?? xScale.bandwidth(), xScale.bandwidth());
      const offset = (xScale.bandwidth() - actualWidth) / 2;
      const color = singleColor ?? (point.color ? getColorFromToken(point.color) : getNextColor(index, 0));
      legendMap.set(legend, color);

      const rect = createSvgElement<SVGRectElement>('rect');
      rect.classList.add('bar');
      rect.dataset.legend = legend;
      rect.setAttribute('x', String(x + offset));
      rect.setAttribute('y', String(yScale(point.y)));
      rect.setAttribute('width', String(actualWidth));
      rect.setAttribute('height', String(Math.max(innerHeight - yScale(point.y), 0)));
      rect.setAttribute('fill', color);
      if (this.strokeWidth !== undefined) {
        rect.setAttribute('stroke-width', String(this.strokeWidth));
        rect.setAttribute('stroke', color);
      }
      rect.addEventListener('mouseenter', () => {
        if (!this._shouldShowTooltip(legend) || this.hideTooltip) {
          return;
        }
        const hostRect = this.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        this._currentTooltipDataPoint = point;
        this.tooltipProps = {
          isVisible: true,
          legend,
          xValue: key,
          yValue: formatNumberValue(point.y, this.yAxisTickFormat, this.culture),
          color,
          xPos: svgRect.left - hostRect.left + margins.left + x + offset + actualWidth / 2,
          yPos: svgRect.top - hostRect.top + margins.top + yScale(point.y),
        };
      });
      rect.addEventListener('mouseleave', () => this._clearTooltip());
      rect.addEventListener('click', () => point.onClick?.());
      plotGroup.appendChild(rect);
    });

    renderBottomAxisShared({
      svg,
      scale: xScale,
      axis: xAxis,
      formatter: value => value,
      axisLeft: margins.left,
      axisTop: margins.top,
      innerWidth,
      innerHeight,
      tickPadding: toNumber(this.tickPadding, 6),
      rotateXAxisLabels: this.rotateXAxisLabels,
      wrapXAxisLabels: this.wrapXAxisLabels,
      hideTickOverlap: this.hideTickOverlap,
      showXAxisLabelsTooltip: this.showXAxisLabelsTooltip,
      xAxisTitle: this.xAxisTitle,
    });
    renderPrimaryYAxisShared({
      svg,
      scale: yScale,
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
    this.legends = Array.from(legendMap.entries()).map(([legend, color]) => ({ legend, color }));
    this._updateLegendInteractionState();
    this.elementInternals.ariaLabel = this._getHostAriaLabel();
  }

  protected override _applyActiveLegendState(): void {
    if (!this.chartContainer) {
      return;
    }
    const highlighted = this._getHighlightedLegends();
    const hasSelection = highlighted.length > 0;
    this.chartContainer.querySelectorAll<SVGElement>('.bar').forEach(element => {
      const legend = element.dataset.legend ?? '';
      const isActive = !hasSelection || highlighted.includes(legend);
      element.classList.toggle('inactive', !isActive);
      element.setAttribute('opacity', isActive ? '1' : '0.1');
    });
  }

  protected override _getHostAriaLabel(): string {
    const count = Array.isArray(this.data) ? this.data.length : 0;
    if (count === 0) {
      return this.chartTitle ? `${this.chartTitle}. No data.` : 'Vertical bar chart with no data.';
    }
    return `${this.chartTitle || 'Vertical bar chart'}. ${count} bars.`;
  }

  private _clearChart(): void {
    while (this.chartContainer.firstChild) {
      this.chartContainer.firstChild.remove();
    }
  }
}

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
import type { VerticalStackedBarChartProps } from './vertical-stacked-bar-chart.options.js';

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
export class VerticalStackedBarChart extends CartesianChartBase {
  public declare tooltipProps: TooltipState;

  @attr({ converter: jsonConverter })
  public data!: VerticalStackedBarChartProps[];

  @attr({ attribute: 'bar-gap-max' })
  public barGapMax?: number | string;

  @attr({ attribute: 'bar-width' })
  public barWidth?: number | string;

  protected override _enableResizeObserver = true;

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'barGapMax', 'barWidth'] as const;
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

  protected barGapMaxChanged(): void {
    this._requestRender();
  }

  protected barWidthChanged(): void {
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

    const stacks = Array.isArray(this.data) ? this.data : [];
    if (stacks.length === 0) {
      this.legends = [];
      this._updateLegendInteractionState();
      this.elementInternals.ariaLabel = this._getHostAriaLabel();
      return;
    }

    const requestedChartWidth = toOptionalNumber(this.width);
    const measuredWidth = this.chartContainer.getBoundingClientRect().width;
    const width = requestedChartWidth ?? measuredWidth || toNumber(this.width, 600);
    const height = toNumber(this.height, 350);
    const margins = getDirectionalMargins(defaultMargins, this._isRTL);
    const innerWidth = Math.max(width - margins.left - margins.right, 1);
    const innerHeight = Math.max(height - margins.top - margins.bottom, 1);
    const groupsByCategory = new Map<string, number[]>();
    stacks.forEach(stack => {
      groupsByCategory.set(
        String(stack.xAxisPoint),
        stack.chartData.map(point => point.data),
      );
    });
    const domain = sortCategoryGroups(
      Array.from(groupsByCategory.entries()).map(([key, values]) => ({ key, points: values })),
      this.xAxisCategoryOrder,
      stacks.map(stack => String(stack.xAxisPoint)),
      group => group.points,
    ).map(group => group.key);
    const xScale = scaleBand<string>().domain(domain).range([0, innerWidth]).padding(0.2);
    const maxTotal =
      max(stacks, stack => stack.chartData.reduce((sum, point) => sum + Math.max(point.data, 0), 0)) ?? 0;
    const yScale = scaleLinear()
      .domain([toOptionalNumber(this.yMinValue) ?? 0, toOptionalNumber(this.yMaxValue) ?? Math.max(maxTotal, 1)])
      .range([innerHeight, 0]);
    if (this.roundedTicks) {
      yScale.nice();
    }

    const legendNames = Array.from(new Set(stacks.flatMap(stack => stack.chartData.map(point => point.legend))));
    const colorMap = new Map<string, string>();
    legendNames.forEach((legend, index) => {
      const match = stacks.flatMap(stack => stack.chartData).find(point => point.legend === legend);
      colorMap.set(legend, match?.color ? getColorFromToken(match.color) : getNextColor(index, 0));
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
    applyAxisTickConfig(
      xAxis,
      this.xAxisTickCount,
      this.tickValues?.map(value => String(value)),
    );
    const yAxis = axisLeft(yScale).tickPadding(toNumber(this.tickPadding, 6));
    applyAxisTickConfig(yAxis, this.yAxisTickCount ?? 6, this.yAxisTickValues);

    const gapMax = toOptionalNumber(this.barGapMax);
    stacks.forEach(stack => {
      const x = xScale(String(stack.xAxisPoint)) ?? 0;
      const step = xScale.step();
      let actualWidth = xScale.bandwidth();
      if (gapMax !== undefined) {
        // bar-gap-max is a cap for the visual gap between adjacent stacks.
        // Grow bars into the band padding area when needed to satisfy the cap.
        actualWidth = Math.min(Math.max(actualWidth, Math.max(step - gapMax, 1)), step);
      }
      const requestedWidth = toOptionalNumber(this.barWidth);
      actualWidth = Math.min(Math.max(requestedWidth ?? actualWidth, 1), step);
      const offset = (xScale.bandwidth() - actualWidth) / 2;

      let start = 0;
      stack.chartData.forEach(segment => {
        const color = colorMap.get(segment.legend) ?? getNextColor(0, 0);
        const nextTotal = start + Math.max(segment.data, 0);
        const top = yScale(nextTotal);
        const bottom = yScale(start);

        const rect = createSvgElement<SVGRectElement>('rect');
        rect.classList.add('bar');
        rect.dataset.legend = segment.legend;
        rect.setAttribute('x', String(x + offset));
        rect.setAttribute('y', String(top));
        rect.setAttribute('width', String(actualWidth));
        rect.setAttribute('height', String(Math.max(bottom - top, 0)));
        rect.setAttribute('fill', color);
        if (this.strokeWidth !== undefined) {
          rect.setAttribute('stroke-width', String(this.strokeWidth));
          rect.setAttribute('stroke', color);
        }
        rect.addEventListener('mouseenter', () => {
          if (!this._shouldShowTooltip(segment.legend) || this.hideTooltip) {
            return;
          }
          const hostRect = this.getBoundingClientRect();
          const svgRect = svg.getBoundingClientRect();
          this._currentTooltipDataPoint = { ...segment, xAxisPoint: stack.xAxisPoint };
          this.tooltipProps = {
            isVisible: true,
            legend: segment.legend,
            xValue: String(stack.xAxisPoint),
            yValue: formatNumberValue(segment.data, this.yAxisTickFormat, this.culture),
            color,
            xPos: svgRect.left - hostRect.left + margins.left + x + offset + actualWidth / 2,
            yPos: svgRect.top - hostRect.top + margins.top + top,
          };
        });
        rect.addEventListener('mouseleave', () => this._clearTooltip());
        plotGroup.appendChild(rect);
        start = nextTotal;
      });
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
    this.legends = legendNames.map(legend => ({ legend, color: colorMap.get(legend) ?? getNextColor(0, 0) }));
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
      return this.chartTitle ? `${this.chartTitle}. No data.` : 'Vertical stacked bar chart with no data.';
    }
    return `${this.chartTitle || 'Vertical stacked bar chart'}. ${count} stacks.`;
  }

  private _clearChart(): void {
    while (this.chartContainer.firstChild) {
      this.chartContainer.firstChild.remove();
    }
  }
}

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
  renderAxisGridLinesShared,
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
import type { GroupedVerticalBarChartData } from './grouped-vertical-bar-chart.options.js';

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
export class GroupedVerticalBarChart extends CartesianChartBase {
  public declare tooltipProps: TooltipState;

  @attr({ converter: jsonConverter })
  public data!: GroupedVerticalBarChartData[];

  @attr({ attribute: 'bar-width' })
  public barWidth?: number | string;

  protected override _enableResizeObserver = true;

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'barWidth'] as const;
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

  protected dataChanged(): void {
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

    const groups = Array.isArray(this.data) ? this.data : [];
    if (groups.length === 0) {
      this.legends = [];
      this._updateLegendInteractionState();
      this.elementInternals.ariaLabel = this._getHostAriaLabel();
      return;
    }

    const width = this.chartContainer.getBoundingClientRect().width || toNumber(this.width, 600);
    const height = toNumber(this.height, 300);
    const margins = getDirectionalMargins(defaultMargins, this._isRTL);
    const innerWidth = Math.max(width - margins.left - margins.right, 1);
    const innerHeight = Math.max(height - margins.top - margins.bottom, 1);

    const groupedByCategory = new Map<string, number[]>();
    groups.forEach(group => {
      groupedByCategory.set(
        group.xAxisPoint,
        group.series.map(point => point.data),
      );
    });
    const groupDomain = sortCategoryGroups(
      Array.from(groupedByCategory.entries()).map(([key, values]) => ({ key, points: values })),
      this.xAxisCategoryOrder,
      groups.map(group => group.xAxisPoint),
      group => group.points,
    ).map(group => group.key);
    const keyDomain = Array.from(new Set(groups.flatMap(group => group.series.map(point => point.key))));
    const xAxisInnerPadding = toOptionalNumber(this.xAxisInnerPadding) ?? 2 / 3;
    const xAxisOuterPadding = toOptionalNumber(this.xAxisOuterPadding) ?? 0;
    const xScale = scaleBand<string>()
      .domain(groupDomain)
      .range([0, innerWidth])
      .paddingInner(xAxisInnerPadding)
      .paddingOuter(xAxisOuterPadding);
    const innerScale = scaleBand<string>().domain(keyDomain).range([0, xScale.bandwidth()]).padding(0.05);
    const maxY = max(groups.flatMap(group => group.series.map(point => point.data))) ?? 0;
    const preparedYAxis = computePreparedNumericYAxis({
      minValue: toOptionalNumber(this.yMinValue) ?? 0,
      maxValue: toOptionalNumber(this.yMaxValue) ?? Math.max(maxY, 1),
      tickCount: toNumber(this.yAxisTickCount, DEFAULT_REACT_NUMERIC_Y_TICK_COUNT),
      roundedTicks: this.roundedTicks,
    });
    const yScale = scaleLinear().domain([preparedYAxis.domainMin, preparedYAxis.domainMax]).range([innerHeight, 0]);

    const colorMap = new Map<string, string>();
    keyDomain.forEach((key, index) => {
      const match = groups.flatMap(group => group.series).find(point => point.key === key);
      colorMap.set(key, match?.color ? getColorFromToken(match.color) : getNextColor(index, 0));
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
    applyAxisTickConfig(
      yAxis,
      this.yAxisTickCount ?? DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
      this.yAxisTickValues ?? preparedYAxis.tickValues,
    );
    renderAxisGridLinesShared({
      layer: plotGroup,
      orientation: 'horizontal',
      scale: yScale,
      axis: yAxis as unknown as Axis<number>,
      spanStart: 0,
      spanEnd: innerWidth,
    });

    groups.forEach(group => {
      const groupX = xScale(group.xAxisPoint) ?? 0;
      group.series.forEach(point => {
        const slotX = innerScale(point.key) ?? 0;
        const requestedWidth = toOptionalNumber(this.barWidth);
        const actualWidth = Math.min(requestedWidth ?? innerScale.bandwidth(), innerScale.bandwidth());
        const offset = (innerScale.bandwidth() - actualWidth) / 2;
        const color = colorMap.get(point.key) ?? getNextColor(0, 0);

        const rect = createSvgElement<SVGRectElement>('rect');
        rect.classList.add('bar');
        rect.dataset.legend = point.key;
        rect.setAttribute('x', String(groupX + slotX + offset));
        rect.setAttribute('y', String(yScale(point.data)));
        rect.setAttribute('width', String(actualWidth));
        rect.setAttribute('height', String(Math.max(innerHeight - yScale(point.data), 0)));
        rect.setAttribute('fill', color);
        if (this.strokeWidth !== undefined) {
          rect.setAttribute('stroke-width', String(this.strokeWidth));
          rect.setAttribute('stroke', color);
        }
        const showTooltip = (event?: MouseEvent) => {
          if (!this._shouldShowTooltip(point.key) || this.hideTooltip) {
            return;
          }
          const hostRect = this.getBoundingClientRect();
          const svgRect = svg.getBoundingClientRect();
          const anchorX = svgRect.left - hostRect.left + margins.left + groupX + slotX + offset + actualWidth / 2;
          const minY = svgRect.top - hostRect.top + margins.top + yScale(point.data);
          const maxY = svgRect.top - hostRect.top + margins.top + innerHeight;
          const anchorY = event ? Math.min(Math.max(event.clientY - hostRect.top, minY), maxY) : (minY + maxY) / 2;
          const isFreshShow = !this.tooltipProps.isVisible;
          this._currentTooltipDataPoint = { ...point, xAxisPoint: group.xAxisPoint };
          this.tooltipProps = {
            isVisible: true,
            legend: point.key,
            xValue: group.xAxisPoint,
            yValue: formatNumberValue(point.data, this.yAxisTickFormat, this.culture),
            color,
            xPos: anchorX,
            yPos: anchorY,
          };
          this._positionTooltipAvoidingOverlap(anchorX, minY, maxY, isFreshShow);
        };
        rect.addEventListener('mouseenter', showTooltip);
        rect.addEventListener('mousemove', showTooltip);
        rect.addEventListener('mouseleave', () => this._clearTooltip());
        plotGroup.appendChild(rect);
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
    this.legends = keyDomain.map(key => ({ legend: key, color: colorMap.get(key) ?? getNextColor(0, 0) }));
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
      return this.chartTitle ? `${this.chartTitle}. No data.` : 'Grouped vertical bar chart with no data.';
    }
    return `${this.chartTitle || 'Grouped vertical bar chart'}. ${count} groups.`;
  }

  private _clearChart(): void {
    while (this.chartContainer.firstChild) {
      this.chartContainer.firstChild.remove();
    }
  }
}

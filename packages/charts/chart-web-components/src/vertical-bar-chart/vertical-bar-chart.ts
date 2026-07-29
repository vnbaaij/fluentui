import { attr } from '@microsoft/fast-element';
import { max } from 'd3-array';
import { type Axis, axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import { type ScaleBand, scaleBand, type ScaleLinear, scaleLinear } from 'd3-scale';
import { line as createLine } from 'd3-shape';
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

  @attr({ attribute: 'line-legend-text' })
  public lineLegendText?: string;

  @attr({ attribute: 'line-legend-color' })
  public lineLegendColor?: string;

  protected override _enableResizeObserver = true;

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'barWidth', 'useSingleColor', 'lineLegendText', 'lineLegendColor'] as const;
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

  protected lineLegendTextChanged(): void {
    this._requestRender();
  }

  protected lineLegendColorChanged(): void {
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
    const allNumericX = points.every(point => typeof point.x === 'number' && Number.isFinite(point.x));

    let xScaleBand: ScaleBand<string> | undefined;
    let xScaleLinear: ScaleLinear<number, number> | undefined;
    let xAxis: Axis<string | number>;
    let barAutoWidth = 24;

    const getXCenter = (point: VerticalBarChartDataPoint): number => {
      if (xScaleLinear) {
        return xScaleLinear(point.x as number);
      }
      return (xScaleBand!(String(point.x)) ?? 0) + xScaleBand!.bandwidth() / 2;
    };

    if (allNumericX) {
      const numericXValues = points.map(point => point.x as number);
      const minX = Math.min(...numericXValues);
      const maxX = Math.max(...numericXValues);
      const domainMin = minX === maxX ? minX - 1 : minX;
      const domainMax = minX === maxX ? maxX + 1 : maxX;

      xScaleLinear = scaleLinear().domain([domainMin, domainMax]).range([0, innerWidth]);
      if (this.roundedTicks) {
        xScaleLinear.nice();
      }

      xAxis = axisBottom(xScaleLinear).tickPadding(toNumber(this.tickPadding, 6)) as unknown as Axis<string | number>;
      applyAxisTickConfig(
        xAxis as unknown as Axis<number>,
        this.xAxisTickCount,
        this.tickValues?.map(value => Number(value)),
      );

      const sortedUniqueX = [...new Set(numericXValues)].sort((left, right) => left - right);
      if (sortedUniqueX.length > 1) {
        const minGap = sortedUniqueX.slice(1).reduce((currentMin, value, index) => {
          return Math.min(currentMin, value - sortedUniqueX[index]);
        }, Number.POSITIVE_INFINITY);
        const minPxGap = Math.abs(xScaleLinear(sortedUniqueX[0] + minGap) - xScaleLinear(sortedUniqueX[0]));
        barAutoWidth = Math.max(8, Math.min(24, minPxGap * 0.5));
      }
    } else {
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
      xScaleBand = scaleBand<string>().domain(xDomain).range([0, innerWidth]).padding(0.2);
      xAxis = axisBottom(xScaleBand).tickPadding(toNumber(this.tickPadding, 6)) as unknown as Axis<string | number>;
      applyAxisTickConfig(
        xAxis as unknown as Axis<string>,
        this.xAxisTickCount,
        this.tickValues?.map(value => String(value)),
      );
    }

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
      const requestedWidth = toOptionalNumber(this.barWidth);
      const actualWidth = xScaleBand
        ? Math.min(requestedWidth ?? xScaleBand.bandwidth(), xScaleBand.bandwidth())
        : requestedWidth ?? barAutoWidth;
      const xCenter = getXCenter(point);
      const x = xCenter - actualWidth / 2;
      const color = singleColor ?? (point.color ? getColorFromToken(point.color) : getNextColor(index, 0));
      legendMap.set(legend, color);

      const rect = createSvgElement<SVGRectElement>('rect');
      rect.classList.add('bar');
      rect.dataset.legend = legend;
      rect.setAttribute('x', String(x));
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
        const anchorX = svgRect.left - hostRect.left + margins.left + xCenter;
        const anchorY = svgRect.top - hostRect.top + margins.top + yScale(point.y);
        this._currentTooltipDataPoint = point;
        this.tooltipProps = {
          isVisible: true,
          legend,
          xValue: key,
          yValue: formatNumberValue(point.y, this.yAxisTickFormat, this.culture),
          color,
          xPos: anchorX,
          yPos: anchorY,
        };
        this._positionTooltipFromAnchor(anchorX, anchorY, { outputAnchorX: true, preferredVertical: 'above' });
      });
      rect.addEventListener('mouseleave', () => this._clearTooltip());
      rect.addEventListener('click', () => point.onClick?.());
      plotGroup.appendChild(rect);
    });

    const linePoints = points.filter(point => point.lineData && typeof point.lineData.y === 'number');
    if (linePoints.length > 0) {
      const lineLegend = this.lineLegendText || 'Line';
      const lineColor = this.lineLegendColor ? getColorFromToken(this.lineLegendColor) : 'brown';
      legendMap.set(lineLegend, lineColor);

      const linePath = createSvgElement<SVGPathElement>('path');
      linePath.classList.add('line-path');
      linePath.dataset.legend = lineLegend;
      linePath.setAttribute('fill', 'none');
      linePath.setAttribute('stroke', lineColor);
      linePath.setAttribute('stroke-width', '3');
      linePath.setAttribute(
        'd',
        createLine<VerticalBarChartDataPoint>()
          .x(point => getXCenter(point))
          .y(point => yScale(point.lineData?.y ?? 0))(linePoints) ?? '',
      );
      plotGroup.appendChild(linePath);

      linePoints.forEach((point, index) => {
        const marker = createSvgElement<SVGCircleElement>('circle');
        marker.classList.add('line-marker');
        marker.dataset.legend = lineLegend;
        marker.setAttribute('cx', String(getXCenter(point)));
        marker.setAttribute('cy', String(yScale(point.lineData?.y ?? 0)));
        marker.setAttribute('r', '4');
        marker.setAttribute('fill', '#fff');
        marker.setAttribute('stroke', lineColor);
        marker.setAttribute('stroke-width', '2');
        marker.addEventListener('click', () => point.lineData?.onClick?.());
        marker.id = `vbc-line-marker-${index}`;
        plotGroup.appendChild(marker);
      });
    }

    renderBottomAxisShared({
      svg,
      scale: (xScaleBand ?? xScaleLinear) as ScaleBand<string> | ScaleLinear<number, number>,
      axis: xAxis,
      formatter: value => String(value),
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
    this.chartContainer.querySelectorAll<SVGElement>('.bar, .line-path, .line-marker').forEach(element => {
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

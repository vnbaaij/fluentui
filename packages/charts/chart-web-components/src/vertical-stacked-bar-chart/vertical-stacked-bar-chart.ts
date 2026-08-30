import { attr } from '@microsoft/fast-element';
import { max } from 'd3-array';
import { type Axis, axisBottom, axisLeft, axisRight } from 'd3-axis';
import { format } from 'd3-format';
import { type ScaleBand, scaleBand, type ScaleLinear, scaleLinear } from 'd3-scale';
import { line as createLine } from 'd3-shape';
import { timeFormat, utcFormat } from 'd3-time-format';
import type { TooltipProps } from '../utils/chart-options.js';
import { CartesianChartBase } from '../utils/cartesian-chart-base.js';
import {
  applyAxisTickConfig,
  computePreparedNumericYAxis,
  DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
  renderAxisGridLinesShared,
  renderBottomAxisShared,
  renderPrimaryYAxisShared,
  renderSecondaryYAxisShared,
  sortCategoryGroups,
  toAxisNumber as toNumber,
  toOptionalAxisNumber as toOptionalNumber,
} from '../utils/cartesian-axis-shared.js';
import {
  formatLocaleNumber,
  getColorFromToken,
  getNextColor,
  jsonConverter,
  lightenColor,
  SVG_NAMESPACE_URI,
} from '../utils/chart-helpers.js';
import type {
  VerticalStackedBarChartDataPoint,
  VerticalStackedBarChartLineDataPoint,
  VerticalStackedBarChartProps,
} from './vertical-stacked-bar-chart.options.js';

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

type TooltipState = TooltipProps & { xValue: string };
type LinePlotPoint = {
  xAxisPoint: string | number;
  xCenter: number;
  entry: VerticalStackedBarChartLineDataPoint;
};

const defaultMargins = { top: 40, right: 20, bottom: 50, left: 60 };
const defaultCategoricalBarWidth = 16;

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

const formatDateValue = (chart: VerticalStackedBarChart, value: Date): string => {
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
  const options = chart.dateLocalizeOptions ?? { year: 'numeric', month: '2-digit', day: '2-digit' };
  try {
    return new Intl.DateTimeFormat(chart.culture, options).format(value);
  } catch {
    return new Intl.DateTimeFormat(undefined, options).format(value);
  }
};

const formatXAxisCalloutValue = (
  chart: VerticalStackedBarChart,
  value: VerticalStackedBarChartDataPoint['xAxisCalloutData'],
  fallback: string,
): string => {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return formatDateValue(chart, new Date((value as Date).getTime()));
  }
  return typeof value === 'string' && value ? value : fallback;
};

/** @public */
export class VerticalStackedBarChart extends CartesianChartBase {
  public declare tooltipProps: TooltipState;

  private _activeLineMarkerXValue: string | null = null;

  @attr({ converter: jsonConverter })
  public data!: VerticalStackedBarChartProps[];

  @attr({ attribute: 'bar-gap-max' })
  public barGapMax?: number | string;

  @attr({ attribute: 'bar-width' })
  public barWidth?: number | string;

  @attr({ attribute: 'enable-gradient', mode: 'boolean' })
  public enableGradient: boolean = false;

  @attr({ attribute: 'secondary-y-axis-title' })
  public secondaryYAxisTitle?: string;

  protected override _enableResizeObserver = true;

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'barGapMax', 'barWidth', 'enableGradient', 'secondaryYAxisTitle'] as const;
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

  /**
   * Shows/updates the tooltip for a bar segment, following the mouse's vertical position
   * within the segment (clamped to its bounds) instead of anchoring at a fixed edge —
   * matching React's behavior of the tooltip tracking the cursor as it moves through a bar.
   */
  private _showBarSegmentTooltipAtY(
    clientY: number,
    x: number,
    offset: number,
    actualWidth: number,
    top: number,
    bottom: number,
    margins: { top: number; bottom: number; left: number; right: number },
    svg: SVGSVGElement,
    content: { legend: string; xValue: string; yValue: string; color: string },
  ): void {
    const isFreshShow = !this.tooltipProps.isVisible;
    const hostRect = this.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const anchorX = svgRect.left - hostRect.left + margins.left + x + offset + actualWidth / 2;
    const minY = svgRect.top - hostRect.top + margins.top + top;
    const maxY = svgRect.top - hostRect.top + margins.top + bottom;
    const rawY = clientY - hostRect.top;
    const anchorY = Math.min(Math.max(rawY, minY), maxY);

    this.tooltipProps = {
      isVisible: true,
      legend: content.legend,
      xValue: content.xValue,
      yValue: content.yValue,
      color: content.color,
      xPos: anchorX,
      yPos: anchorY,
    };
    this._positionTooltipAvoidingOverlap(anchorX, anchorY, anchorY, isFreshShow);
  }

  /**
   * Shows/updates the tooltip for a line point, following the mouse's vertical position
   * within `[cyMin, cyMax]` (plot-local, same space as `cy`) instead of anchoring at the
   * point's exact center. Defaults to a small window around the point itself.
   */
  private _showLinePointTooltipAtY(
    clientY: number,
    cx: number,
    cy: number,
    margins: { top: number; bottom: number; left: number; right: number },
    svg: SVGSVGElement,
    content: { legend: string; xValue: string; yValue: string; color: string },
    cyMin: number = cy - 10,
    cyMax: number = cy + 10,
  ): void {
    const isFreshShow = !this.tooltipProps.isVisible;
    const hostRect = this.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const anchorX = svgRect.left - hostRect.left + margins.left + cx;
    const minY = svgRect.top - hostRect.top + margins.top + cyMin;
    const maxY = svgRect.top - hostRect.top + margins.top + cyMax;
    const rawY = clientY - hostRect.top;
    const anchorY = Math.min(Math.max(rawY, minY), maxY);

    this.tooltipProps = {
      isVisible: true,
      legend: content.legend,
      xValue: content.xValue,
      yValue: content.yValue,
      color: content.color,
      xPos: anchorX,
      yPos: anchorY,
    };
    this._positionTooltipAvoidingOverlap(anchorX, anchorY, anchorY, isFreshShow);
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

  protected enableGradientChanged(): void {
    this._requestRender();
  }

  protected secondaryYAxisTitleChanged(): void {
    this._requestRender();
  }

  protected override _clearTooltip(): void {
    this.tooltipProps = { isVisible: false, legend: '', xValue: '', yValue: '', color: '', xPos: 0, yPos: 0 };
  }

  protected override _buildDefaultTooltipHTML(): string {
    return [
      `<div class="tooltip-header">${this.tooltipProps.xValue}</div>`,
      `<div class="tooltip-info" style="border-color: ${this.tooltipProps.color};">`,
      `<div class="tooltip-legend-text">${this.tooltipProps.legend}</div>`,
      `<div class="tooltip-primary-value" style="color: ${this.tooltipProps.color};">${this.tooltipProps.yValue}</div>`,
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
    const width = requestedChartWidth ?? (measuredWidth || toNumber(this.width, 600));
    const height = toNumber(this.height, 350);
    const hasSecondaryY = stacks.some(stack => stack.lineData?.some(entry => entry.useSecondaryYScale));
    const primaryAxisSpace = defaultMargins.left;
    const secondaryAxisSpace = 70;
    const margins = {
      top: defaultMargins.top,
      bottom: defaultMargins.bottom,
      left: this._isRTL ? (hasSecondaryY ? secondaryAxisSpace : defaultMargins.right) : primaryAxisSpace,
      right: this._isRTL ? primaryAxisSpace : hasSecondaryY ? secondaryAxisSpace : defaultMargins.right,
    };
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
    const xAxisInnerPadding = toOptionalNumber(this.xAxisInnerPadding) ?? 2 / 3;
    const xAxisOuterPadding = toOptionalNumber(this.xAxisOuterPadding) ?? 0;
    const xScale = scaleBand<string>()
      .domain(domain)
      .range([0, innerWidth])
      .paddingInner(xAxisInnerPadding)
      .paddingOuter(xAxisOuterPadding);
    const maxTotal =
      max(stacks, stack => stack.chartData.reduce((sum, point) => sum + Math.max(point.data, 0), 0)) ?? 0;
    const preparedYAxis = computePreparedNumericYAxis({
      minValue: toOptionalNumber(this.yMinValue) ?? 0,
      maxValue: toOptionalNumber(this.yMaxValue) ?? Math.max(maxTotal, 1),
      tickCount: toNumber(this.yAxisTickCount, DEFAULT_REACT_NUMERIC_Y_TICK_COUNT),
      roundedTicks: this.roundedTicks,
    });
    const yScale = scaleLinear().domain([preparedYAxis.domainMin, preparedYAxis.domainMax]).range([innerHeight, 0]);

    const secondaryLineValues = stacks
      .flatMap(stack => stack.lineData ?? [])
      .filter(entry => entry.useSecondaryYScale)
      .map(entry => entry.y)
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    let preparedSecondaryYAxis = preparedYAxis;
    let yScaleSecondary = yScale;
    if (hasSecondaryY) {
      const secondaryMin = secondaryLineValues.length > 0 ? Math.min(0, ...secondaryLineValues) : 0;
      let secondaryMax = secondaryLineValues.length > 0 ? Math.max(0, ...secondaryLineValues) : 1;
      if (secondaryMin === secondaryMax) {
        secondaryMax += 1;
      }
      preparedSecondaryYAxis = computePreparedNumericYAxis({
        minValue: secondaryMin,
        maxValue: secondaryMax,
        tickCount: toNumber(this.yAxisTickCount, DEFAULT_REACT_NUMERIC_Y_TICK_COUNT),
        roundedTicks: this.roundedTicks,
      });
      yScaleSecondary = scaleLinear()
        .domain([preparedSecondaryYAxis.domainMin, preparedSecondaryYAxis.domainMax])
        .range([innerHeight, 0]);
    }

    const getLineScale = (entry: VerticalStackedBarChartLineDataPoint): ScaleLinear<number, number> => {
      return entry.useSecondaryYScale ? yScaleSecondary : yScale;
    };

    const legendNames = Array.from(new Set(stacks.flatMap(stack => stack.chartData.map(point => point.legend))));
    const colorMap = new Map<string, string>();
    legendNames.forEach((legend, index) => {
      const match = stacks.flatMap(stack => stack.chartData).find(point => point.legend === legend);
      colorMap.set(legend, match?.color ? getColorFromToken(match.color) : getNextColor(index, 0));
    });

    const lineLegendOrder: string[] = [];
    const lineColorMap = new Map<string, string>();
    stacks.forEach(stack => {
      stack.lineData?.forEach(entry => {
        if (!lineColorMap.has(entry.legend)) {
          lineColorMap.set(
            entry.legend,
            entry.color ? getColorFromToken(entry.color) : getNextColor(lineLegendOrder.length, 10),
          );
          lineLegendOrder.push(entry.legend);
        }
      });
    });

    const buildLinePoints = (legend: string): LinePlotPoint[] => {
      return stacks.reduce<LinePlotPoint[]>((points, stack) => {
        const entry = stack.lineData?.find(item => item.legend === legend);
        if (entry && typeof entry.y === 'number' && Number.isFinite(entry.y)) {
          const xCenter = (xScale(String(stack.xAxisPoint)) ?? 0) + xScale.bandwidth() / 2;
          points.push({ xAxisPoint: stack.xAxisPoint, xCenter, entry });
        }
        return points;
      }, []);
    };

    const svg = createSvgElement<SVGSVGElement>('svg');
    svg.classList.add('chart-svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    // Only hide the tooltip when the pointer leaves the whole chart, not individual
    // segments/points — moving over blank space between them just leaves it in place.
    svg.addEventListener('mouseleave', () => {
      this._clearTooltip();
      this._activeLineMarkerXValue = null;
      this._syncLineMarkerVisibility();
    });

    const defs = createSvgElement<SVGDefsElement>('defs');
    svg.appendChild(defs);

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

    const cornerRadius = this.roundCorners ? 3 : 0;

    stacks.forEach((stack, stackIndex) => {
      const x = xScale(String(stack.xAxisPoint)) ?? 0;
      const step = xScale.step();
      // Match React's default categorical bar width cap; explicit bar-width can grow it.
      let actualWidth = Math.min(xScale.bandwidth(), defaultCategoricalBarWidth);
      const requestedWidth = toOptionalNumber(this.barWidth);
      actualWidth = Math.min(Math.max(requestedWidth ?? actualWidth, 1), step);
      const offset = (xScale.bandwidth() - actualWidth) / 2;

      const stackTotal = stack.chartData.reduce((sum, segment) => sum + Math.max(segment.data, 0), 0);
      // bar-gap-max controls the visual gap between stacked segments within a bar (matching
      // React's VerticalStackedBarChart), capped at 20% of the stack's height and never below 1px.
      // Defaults to 2px (this component's prior fixed gap) when the attribute is not set.
      const barGapMax = toOptionalNumber(this.barGapMax) ?? 2;
      const gapsCount = barGapMax > 0 ? Math.max(stack.chartData.length - 1, 0) : 0;
      const totalHeightPx = Math.max(yScale(0) - yScale(stackTotal), 0);
      const desiredGapPx = gapsCount > 0 ? Math.max(1, Math.min(barGapMax, (totalHeightPx * 0.2) / gapsCount)) : 0;
      const usableHeightPx = Math.max(totalHeightPx - desiredGapPx * gapsCount, 0);
      // Mirror React's VerticalStackedBarChart scaling: segments under 1% of the stack are
      // treated as 1% when computing the scale, then rendered at least that tall — otherwise
      // tiny segments would round down to an invisible, unhoverable sliver.
      const sumOfPercent =
        stackTotal > 0
          ? stack.chartData.reduce((sum, segment) => {
              const percent = (Math.max(segment.data, 0) / stackTotal) * 100;
              return sum + (percent > 0 && percent < 1 ? 1 : percent);
            }, 0)
          : 0;
      const scalingRatio = sumOfPercent > 0 ? sumOfPercent / 100 : 1;
      const heightValueScale = stackTotal > 0 ? usableHeightPx / (stackTotal * scalingRatio) : 0;
      const minSegmentHeight = (heightValueScale * stackTotal) / 100;

      let cumulativeBottom = yScale(0);
      stack.chartData.forEach((segment, segmentIndex) => {
        const color = colorMap.get(segment.legend) ?? getNextColor(0, 0);
        const segmentValue = Math.max(segment.data, 0);
        let segmentHeight = heightValueScale * segmentValue;
        if (segmentValue > 0 && segmentHeight < minSegmentHeight) {
          segmentHeight = minSegmentHeight;
        }
        const bottom = cumulativeBottom;
        const top = bottom - segmentHeight;

        const rect = createSvgElement<SVGRectElement>('rect');
        rect.classList.add('bar');
        rect.dataset.legend = segment.legend;
        rect.setAttribute('x', String(x + offset));
        rect.setAttribute('y', String(top));
        rect.setAttribute('width', String(actualWidth));
        rect.setAttribute('height', String(Math.max(bottom - top, 0)));
        const gradientId = this._appendGradient(defs, stackIndex, segmentIndex, segment, color);
        rect.setAttribute('fill', gradientId ? `url(#${gradientId})` : color);
        rect.setAttribute('rx', String(cornerRadius));
        rect.setAttribute('ry', String(cornerRadius));
        if (this.strokeWidth !== undefined) {
          rect.setAttribute('stroke-width', String(this.strokeWidth));
          rect.setAttribute('stroke', color);
        }
        rect.addEventListener('mouseenter', event => {
          if (!this._shouldShowTooltip(segment.legend) || this.hideTooltip) {
            return;
          }
          this._currentTooltipDataPoint = { ...segment, xAxisPoint: stack.xAxisPoint };
          this._showBarSegmentTooltipAtY(event.clientY, x, offset, actualWidth, top, bottom, margins, svg, {
            legend: segment.legend,
            xValue: formatXAxisCalloutValue(this, segment.xAxisCalloutData, String(stack.xAxisPoint)),
            yValue: segment.yAxisCalloutData || formatNumberValue(segment.data, this.yAxisTickFormat, this.culture),
            color,
          });
        });
        rect.addEventListener('mousemove', event => {
          if (!this._shouldShowTooltip(segment.legend) || this.hideTooltip) {
            return;
          }
          this._showBarSegmentTooltipAtY(event.clientY, x, offset, actualWidth, top, bottom, margins, svg, {
            legend: segment.legend,
            xValue: formatXAxisCalloutValue(this, segment.xAxisCalloutData, String(stack.xAxisPoint)),
            yValue: segment.yAxisCalloutData || formatNumberValue(segment.data, this.yAxisTickFormat, this.culture),
            color,
          });
        });
        plotGroup.appendChild(rect);
        cumulativeBottom = top - (segmentIndex < stack.chartData.length - 1 ? desiredGapPx : 0);
      });

      const shouldShowLabel =
        !this.hideLabels && actualWidth >= 16 && stackTotal > 0 && this._getHighlightedLegends().length === 0;
      if (shouldShowLabel) {
        const label = createSvgElement<SVGTextElement>('text');
        label.classList.add('bar-label');
        label.setAttribute('x', String(x + offset + actualWidth / 2));
        label.setAttribute('y', String(yScale(stackTotal) - 6));
        label.setAttribute('text-anchor', 'middle');
        label.textContent = formatNumberValue(stackTotal, this.yAxisTickFormat, this.culture);
        plotGroup.appendChild(label);
      }
    });

    lineLegendOrder.forEach(legend => {
      const linePoints = buildLinePoints(legend);
      if (linePoints.length === 0) {
        return;
      }

      const lineColor = lineColorMap.get(legend) ?? getNextColor(0, 10);
      const resolvedLineStrokeWidth =
        this.lineStrokeWidth !== undefined ? Number.parseFloat(this.lineStrokeWidth.toString()) : 3;
      const lineBorderWidth =
        this.lineBorderWidth !== undefined ? Number.parseFloat(this.lineBorderWidth.toString()) : 0;
      const lineBorderColor = this.lineBorderColor || 'var(--colorNeutralBackground1, #fff)';
      const lineStrokeLinecap = this.lineStrokeLinecap || 'square';
      const buildPath = createLine<LinePlotPoint>()
        .x(point => point.xCenter)
        .y(point => getLineScale(point.entry)(point.entry.y));

      if (lineBorderWidth > 0) {
        const lineBorderPath = createSvgElement<SVGPathElement>('path');
        lineBorderPath.classList.add('line-border');
        lineBorderPath.dataset.legend = legend;
        lineBorderPath.setAttribute('fill', 'none');
        lineBorderPath.setAttribute('stroke', lineBorderColor);
        lineBorderPath.setAttribute('stroke-width', String(resolvedLineStrokeWidth + lineBorderWidth * 2));
        lineBorderPath.setAttribute('stroke-linecap', lineStrokeLinecap);
        if (this.lineStrokeDasharray !== undefined) {
          lineBorderPath.setAttribute('stroke-dasharray', String(this.lineStrokeDasharray));
        }
        if (this.lineStrokeDashoffset !== undefined) {
          lineBorderPath.setAttribute('stroke-dashoffset', String(this.lineStrokeDashoffset));
        }
        lineBorderPath.setAttribute('d', buildPath(linePoints) ?? '');
        plotGroup.appendChild(lineBorderPath);
      }

      const linePath = createSvgElement<SVGPathElement>('path');
      linePath.classList.add('line-path');
      linePath.dataset.legend = legend;
      linePath.setAttribute('fill', 'none');
      linePath.setAttribute('stroke', lineColor);
      linePath.setAttribute('stroke-width', String(resolvedLineStrokeWidth));
      linePath.setAttribute('stroke-linecap', lineStrokeLinecap);
      if (this.lineStrokeDasharray !== undefined) {
        linePath.setAttribute('stroke-dasharray', String(this.lineStrokeDasharray));
      }
      if (this.lineStrokeDashoffset !== undefined) {
        linePath.setAttribute('stroke-dashoffset', String(this.lineStrokeDashoffset));
      }
      linePath.setAttribute('d', buildPath(linePoints) ?? '');
      plotGroup.appendChild(linePath);

      // Wide invisible hit path so hovering anywhere along the line (not just near a
      // point) shows the tooltip for the nearest data point, following the cursor's Y.
      const lineCyValues = linePoints.map(point => getLineScale(point.entry)(point.entry.y));
      const lineCyMin = Math.min(...lineCyValues);
      const lineCyMax = Math.max(...lineCyValues);
      const findNearestLinePoint = (localX: number): LinePlotPoint =>
        linePoints.reduce((closest, point) =>
          Math.abs(point.xCenter - localX) < Math.abs(closest.xCenter - localX) ? point : closest,
        );
      const handleLineHover = (event: MouseEvent): void => {
        if (!this._shouldShowTooltip(legend) || this.hideTooltip) {
          return;
        }
        const svgRect = svg.getBoundingClientRect();
        const localX = event.clientX - svgRect.left - margins.left;
        const nearest = findNearestLinePoint(localX);
        const nearestCy = getLineScale(nearest.entry)(nearest.entry.y);
        this._activeLineMarkerXValue = String(nearest.xAxisPoint);
        this._syncLineMarkerVisibility();
        this._currentTooltipDataPoint = { ...nearest.entry, xAxisPoint: nearest.xAxisPoint };
        this._showLinePointTooltipAtY(
          event.clientY,
          nearest.xCenter,
          nearestCy,
          margins,
          svg,
          {
            legend,
            xValue: String(nearest.xAxisPoint),
            yValue:
              nearest.entry.yAxisCalloutData || formatNumberValue(nearest.entry.y, this.yAxisTickFormat, this.culture),
            color: lineColor,
          },
          lineCyMin,
          lineCyMax,
        );
      };
      const lineHitArea = createSvgElement<SVGPathElement>('path');
      lineHitArea.classList.add('line-hit-area');
      lineHitArea.dataset.legend = legend;
      lineHitArea.setAttribute('fill', 'none');
      lineHitArea.setAttribute('stroke', 'transparent');
      lineHitArea.setAttribute('stroke-width', '16');
      lineHitArea.setAttribute('d', buildPath(linePoints) ?? '');
      lineHitArea.addEventListener('mouseenter', handleLineHover);
      lineHitArea.addEventListener('mousemove', handleLineHover);
      lineHitArea.addEventListener('mouseleave', () => {
        this._activeLineMarkerXValue = null;
        this._syncLineMarkerVisibility();
      });
      plotGroup.appendChild(lineHitArea);

      linePoints.forEach(point => {
        const cx = point.xCenter;
        const cy = getLineScale(point.entry)(point.entry.y);

        const marker = createSvgElement<SVGCircleElement>('circle');
        marker.classList.add('line-marker');
        marker.dataset.legend = legend;
        marker.dataset.xValue = String(point.xAxisPoint);
        marker.setAttribute('cx', String(cx));
        marker.setAttribute('cy', String(cy));
        marker.setAttribute('r', '0');
        marker.setAttribute('visibility', 'hidden');
        marker.setAttribute('fill', '#fff');
        marker.setAttribute('stroke', lineColor);
        marker.setAttribute('stroke-width', '2');
        marker.setAttribute('pointer-events', 'none');
        plotGroup.appendChild(marker);

        // Larger invisible hit area so the line point gets its own hover tooltip, independent of the bar.
        const markerHitArea = createSvgElement<SVGCircleElement>('circle');
        markerHitArea.classList.add('line-marker-hit-area');
        markerHitArea.dataset.legend = legend;
        markerHitArea.setAttribute('cx', String(cx));
        markerHitArea.setAttribute('cy', String(cy));
        markerHitArea.setAttribute('r', '10');
        markerHitArea.setAttribute('fill', 'transparent');
        markerHitArea.addEventListener('mouseenter', event => {
          this._activeLineMarkerXValue = String(point.xAxisPoint);
          this._syncLineMarkerVisibility();
          if (!this._shouldShowTooltip(legend) || this.hideTooltip) {
            return;
          }
          this._currentTooltipDataPoint = { ...point.entry, xAxisPoint: point.xAxisPoint };
          this._showLinePointTooltipAtY(event.clientY, cx, cy, margins, svg, {
            legend,
            xValue: String(point.xAxisPoint),
            yValue:
              point.entry.yAxisCalloutData || formatNumberValue(point.entry.y, this.yAxisTickFormat, this.culture),
            color: lineColor,
          });
        });
        markerHitArea.addEventListener('mousemove', event => {
          if (!this._shouldShowTooltip(legend) || this.hideTooltip) {
            return;
          }
          this._showLinePointTooltipAtY(event.clientY, cx, cy, margins, svg, {
            legend,
            xValue: String(point.xAxisPoint),
            yValue:
              point.entry.yAxisCalloutData || formatNumberValue(point.entry.y, this.yAxisTickFormat, this.culture),
            color: lineColor,
          });
        });
        markerHitArea.addEventListener('mouseleave', () => {
          this._activeLineMarkerXValue = null;
          this._syncLineMarkerVisibility();
        });
        markerHitArea.addEventListener('click', () => point.entry.onClick?.());
        plotGroup.appendChild(markerHitArea);
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

    if (hasSecondaryY) {
      const yAxisSecondary = axisRight(yScaleSecondary).tickPadding(toNumber(this.tickPadding, 6));
      applyAxisTickConfig(
        yAxisSecondary,
        this.yAxisTickCount ?? DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
        this.yAxisTickValues ?? preparedSecondaryYAxis.tickValues,
      );
      renderSecondaryYAxisShared({
        svg,
        scale: yScaleSecondary,
        axis: yAxisSecondary as unknown as Axis<number>,
        formatter: value => formatNumberValue(value, this.yAxisTickFormat, this.culture),
        axisStartX: margins.left,
        axisTop: margins.top,
        innerHeight,
        innerWidth,
        tickPadding: toNumber(this.tickPadding, 6),
        isRTL: this._isRTL,
        yAxisTitle: this.secondaryYAxisTitle,
      });
    }

    this.chartContainer.appendChild(svg);
    this.legends = [
      ...lineLegendOrder.map(legend => ({
        legend,
        color: lineColorMap.get(legend) ?? getNextColor(0, 10),
        isLineLegendInBarChart: true,
      })),
      ...legendNames.map(legend => ({ legend, color: colorMap.get(legend) ?? getNextColor(0, 0) })),
    ];
    this._updateLegendInteractionState();
    this.elementInternals.ariaLabel = this._getHostAriaLabel();
  }

  protected override _applyActiveLegendState(): void {
    if (!this.chartContainer) {
      return;
    }
    const highlighted = this._getHighlightedLegends();
    const hasSelection = highlighted.length > 0;
    this.chartContainer
      .querySelectorAll<SVGElement>('.bar, .line-path, .line-border, .line-marker')
      .forEach(element => {
        const legend = element.dataset.legend ?? '';
        const isActive = !hasSelection || highlighted.includes(legend);
        element.classList.toggle('inactive', !isActive);
        element.setAttribute('opacity', isActive ? '1' : '0.1');
      });
    this._syncLineMarkerVisibility();
  }

  protected override _getHostAriaLabel(): string {
    const count = Array.isArray(this.data) ? this.data.length : 0;
    if (count === 0) {
      return this.chartTitle ? `${this.chartTitle}. No data.` : 'Vertical stacked bar chart with no data.';
    }
    return `${this.chartTitle || 'Vertical stacked bar chart'}. ${count} stacks.`;
  }

  private _appendGradient(
    defs: SVGDefsElement,
    stackIndex: number,
    segmentIndex: number,
    segment: VerticalStackedBarChartProps['chartData'][number],
    color: string,
  ): string | undefined {
    if (!this.enableGradient && !segment.gradient) {
      return undefined;
    }

    const gradientId = `vsbc-gradient-${stackIndex}-${segmentIndex}`;
    const gradient = createSvgElement<SVGLinearGradientElement>('linearGradient');
    gradient.setAttribute('id', gradientId);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y1', '100%');
    gradient.setAttribute('y2', '0%');

    const [from, to] = segment.gradient ?? [lightenColor(color, 0.35), color];
    for (const [offset, stopColor] of [
      ['0%', from],
      ['100%', to],
    ]) {
      const stop = createSvgElement<SVGStopElement>('stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', stopColor);
      gradient.appendChild(stop);
    }

    defs.appendChild(gradient);
    return gradientId;
  }

  private _clearChart(): void {
    while (this.chartContainer.firstChild) {
      this.chartContainer.firstChild.remove();
    }
  }

  private _syncLineMarkerVisibility(): void {
    if (!this.chartContainer) {
      return;
    }

    const highlighted = this._getHighlightedLegends();
    const hasSelection = highlighted.length > 0;

    this.chartContainer.querySelectorAll<SVGCircleElement>('.line-marker').forEach(marker => {
      const markerLegend = marker.dataset.legend ?? '';
      const markerXValue = marker.dataset.xValue ?? '';
      const legendIsActive = !hasSelection || highlighted.includes(markerLegend);
      const shouldShow =
        legendIsActive && this._activeLineMarkerXValue !== null && markerXValue === this._activeLineMarkerXValue;

      marker.setAttribute('visibility', shouldShow ? 'visible' : 'hidden');
      marker.setAttribute('r', shouldShow ? '8' : '0');
    });
  }
}

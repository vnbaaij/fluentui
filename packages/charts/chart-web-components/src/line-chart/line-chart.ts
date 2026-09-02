import { attr } from '@microsoft/fast-element';
import { extent } from 'd3-array';
import { type Axis, axisBottom, type AxisDomain, axisLeft, axisRight } from 'd3-axis';
import { format } from 'd3-format';
import { type ScaleTime, scaleTime } from 'd3-scale';
import { line as createLine } from 'd3-shape';
import { timeFormat, utcFormat } from 'd3-time-format';
import type { TooltipProps } from '../utils/chart-options.js';
import { CartesianChartBase } from '../utils/cartesian-chart-base.js';
import {
  applyAxisTickConfig,
  type AxisScaleLike,
  computePreparedNumericYAxis,
  createNumericContinuousScale,
  DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
  type NumericContinuousScale,
  renderAxisGridLinesShared,
  renderBottomAxisShared,
  renderPrimaryYAxisShared,
  renderSecondaryYAxisShared,
  toAxisNumber as toNumber,
  toOptionalAxisNumber as toOptionalNumber,
} from '../utils/cartesian-axis-shared.js';
import {
  defaultYAxisTickFormatter,
  formatLocaleNumber,
  getColorFromToken,
  getNextColor,
  jsonConverter,
  parseDateOrNumber,
  SVG_NAMESPACE_URI,
} from '../utils/chart-helpers.js';
import { renderBorderedLinePath } from '../utils/line-path-helpers.js';
import { getMarkerPath, markerShapeNames } from '../utils/marker-shapes.js';
import type { LineChartColorFillBar, LineChartDataPoint, LineChartSeries } from './line-chart.options.js';

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

type TooltipEntry = { legend: string; color: string; value: string };
type TooltipState = TooltipProps & { xValue: string; entries: TooltipEntry[] };
type XValue = number | Date;
type ContinuousScale = NumericContinuousScale | ScaleTime<number, number>;
type NormalizedPoint = LineChartDataPoint & { x: XValue; xLabel: string; cx: number; cy: number };
type NormalizedSeries = Omit<LineChartSeries, 'color' | 'data'> & { color: string; data: NormalizedPoint[] };

const defaultMargins = { top: 40, right: 20, bottom: 50, left: 60 };
const markerSize = 12;

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

const formatDateAxisValue = (chart: LineChart, value: Date): string => {
  if (chart.customDateTimeFormatter || chart.tickFormat || chart.dateLocalizeOptions) {
    return formatDateValue(chart, value);
  }
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(chart.useUTC ? { timeZone: 'UTC' } : {}),
  };
  try {
    return new Intl.DateTimeFormat(chart.culture, options).format(value);
  } catch {
    return new Intl.DateTimeFormat(undefined, options).format(value);
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

  @attr({ attribute: 'allow-multiple-shapes-for-points', mode: 'boolean' })
  public allowMultipleShapesForPoints: boolean = false;

  @attr({ attribute: 'is-callout-for-stack', mode: 'boolean' })
  public isCalloutForStack: boolean = false;

  @attr({ attribute: 'color-fill-bars', converter: jsonConverter })
  public colorFillBars?: LineChartColorFillBar[];

  @attr({ attribute: 'y-axis-tick-label-max-width' })
  public yAxisTickLabelMaxWidth?: number | string;

  protected override _enableResizeObserver = true;

  public connectedCallback(): void {
    const self = this as Record<string, unknown>;
    const attrFields = [
      'data',
      'showMarkers',
      'allowMultipleShapesForPoints',
      'isCalloutForStack',
      'colorFillBars',
      'yAxisTickLabelMaxWidth',
    ] as const;
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

    this.tooltipProps = { ...this.tooltipProps, xValue: '', entries: [] } as TooltipState;
    this._requestRender();
  }

  protected dataChanged(): void {
    this._requestRender();
  }

  protected showMarkersChanged(): void {
    this._requestRender();
  }

  protected allowMultipleShapesForPointsChanged(): void {
    this._requestRender();
  }

  protected isCalloutForStackChanged(): void {
    this._clearTooltip();
    this._requestRender();
  }

  protected colorFillBarsChanged(): void {
    this._requestRender();
  }

  protected yAxisTickLabelMaxWidthChanged(): void {
    this._requestRender();
  }

  protected override _clearTooltip(): void {
    this.tooltipProps = {
      isVisible: false,
      legend: '',
      xValue: '',
      yValue: '',
      color: '',
      xPos: 0,
      yPos: 0,
      entries: [],
    };
  }

  protected override _buildDefaultTooltipHTML(): string {
    return [
      `<div class="tooltip-header">${this.tooltipProps.xValue}</div>`,
      ...this.tooltipProps.entries.map(
        entry =>
          `<div class="tooltip-info" style="border-color: ${entry.color};">` +
          `<div class="tooltip-legend-text">${entry.legend}</div>` +
          `<div class="tooltip-primary-value" style="color: ${entry.color};">${entry.value}</div>` +
          `</div>`,
      ),
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
        const calloutX = point.xAxisCalloutData;
        return {
          ...point,
          x,
          y: point.y,
          xLabel: calloutX
            ? calloutX instanceof Date
              ? formatDateValue(this, calloutX)
              : calloutX
            : x instanceof Date
            ? formatDateValue(this, x)
            : formatNumberValue(x, this.xAxisTickFormat, this.culture),
          cx: 0,
          cy: 0,
        };
      });
      return { ...series, color, data };
    });

    const hasSecondaryY = normalizedSeries.some(series => series.useSecondaryYScale);
    const width = this.chartContainer.getBoundingClientRect().width || toNumber(this.width, 500);
    const height = toNumber(this.height, 300);
    const { svg, plotGroup, margins, innerWidth, innerHeight } = this._createCartesianRenderContext({
      width,
      height,
      defaultMargins,
      hasSecondaryYAxis: hasSecondaryY,
    });

    const primarySeries = normalizedSeries.filter(series => !series.useSecondaryYScale);
    const yValues = (primarySeries.length > 0 ? primarySeries : normalizedSeries).flatMap(series =>
      series.data.map(point => point.y),
    );
    const rawYExtent = extent(yValues);
    const dataYMin = rawYExtent[0] ?? 0;
    const dataYMax = rawYExtent[1] ?? 0;
    const configuredYMin = toOptionalNumber(this.yMinValue);
    const configuredYMax = toOptionalNumber(this.yMaxValue);
    let yMin =
      this.yScaleType === 'log'
        ? configuredYMin !== undefined && configuredYMin > 0
          ? Math.min(dataYMin, configuredYMin)
          : dataYMin
        : Math.min(dataYMin, configuredYMin ?? 0);
    let yMax =
      this.yScaleType === 'log'
        ? configuredYMax !== undefined && configuredYMax > 0
          ? Math.max(dataYMax, configuredYMax)
          : dataYMax
        : Math.max(dataYMax, configuredYMax ?? 0);
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }

    let xScale: ContinuousScale;
    let xFormatter: (value: AxisDomain) => string;
    const xRange: [number, number] = this._isRTL ? [innerWidth, 0] : [0, innerWidth];
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
      xScale = scaleTime().domain([domainMin, domainMax]).range(xRange);
      if (this.roundedTicks) {
        xScale.nice();
      }
      xFormatter = value => formatDateAxisValue(this, value as Date);
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
      xScale = createNumericContinuousScale({
        domainMin: xMin,
        domainMax: xMax,
        range: xRange,
        scaleType: this.xScaleType,
        roundedTicks: this.roundedTicks,
      }).scale;
      xFormatter = value => formatNumberValue(Number(value), this.xAxisTickFormat, this.culture);
    }

    const defs = createSvgElement<SVGDefsElement>('defs');
    svg.appendChild(defs);
    this.colorFillBars?.forEach((fillBar, fillBarIndex) => {
      const color = getColorFromToken(fillBar.color);
      const patternId = `line-range-pattern-${fillBarIndex}`;
      if (fillBar.applyPattern) {
        const pattern = createSvgElement<SVGPatternElement>('pattern');
        pattern.setAttribute('id', patternId);
        pattern.setAttribute('width', '16');
        pattern.setAttribute('height', '16');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        const stripe = createSvgElement<SVGPathElement>('path');
        stripe.setAttribute('d', 'M-4,4 l8,-8 M0,16 l16,-16 M12,20 l8,-8');
        stripe.setAttribute('stroke', color);
        stripe.setAttribute('stroke-width', '1.25');
        pattern.appendChild(stripe);
        defs.appendChild(pattern);
      }
      fillBar.data.forEach(range => {
        const startX = xScale(getNormalizedXValue(range.startX) as never) ?? 0;
        const endX = xScale(getNormalizedXValue(range.endX) as never) ?? 0;
        const rect = createSvgElement<SVGRectElement>('rect');
        rect.classList.add('color-fill-bar');
        rect.dataset.legend = fillBar.legend;
        rect.setAttribute('x', String(Math.min(startX, endX)));
        rect.setAttribute('y', '0');
        rect.setAttribute('width', String(Math.abs(endX - startX)));
        rect.setAttribute('height', String(innerHeight));
        rect.setAttribute('fill', fillBar.applyPattern ? `url(#${patternId})` : color);
        rect.setAttribute('fill-opacity', '1');
        rect.dataset.activeOpacity = fillBar.applyPattern ? '1' : '0.4';
        plotGroup.appendChild(rect);
      });
    });

    const preparedYAxis = computePreparedNumericYAxis({
      minValue: yMin,
      maxValue: yMax,
      tickCount: toNumber(this.yAxisTickCount, DEFAULT_REACT_NUMERIC_Y_TICK_COUNT),
      roundedTicks: this.roundedTicks,
    });

    const { scale: yScale, isLogarithmic: isLogarithmicY } = createNumericContinuousScale({
      domainMin: preparedYAxis.domainMin,
      domainMax: preparedYAxis.domainMax,
      range: [innerHeight, 0],
      scaleType: this.yScaleType,
    });

    const secondaryYValues = normalizedSeries
      .filter(series => series.useSecondaryYScale)
      .flatMap(series => series.data.map(point => point.y));
    const secondaryYExtent = extent(secondaryYValues);
    let preparedSecondaryYAxis = preparedYAxis;
    let yScaleSecondary: NumericContinuousScale = yScale;
    let isLogarithmicSecondaryY = false;
    if (hasSecondaryY) {
      let secondaryYMin = Math.min(secondaryYExtent[0] ?? 0, 0);
      let secondaryYMax = Math.max(secondaryYExtent[1] ?? 0, 0);
      if (secondaryYMin === secondaryYMax) {
        secondaryYMin -= 1;
        secondaryYMax += 1;
      }
      preparedSecondaryYAxis = computePreparedNumericYAxis({
        minValue: secondaryYMin,
        maxValue: secondaryYMax,
        tickCount: toNumber(this.yAxisTickCount, DEFAULT_REACT_NUMERIC_Y_TICK_COUNT),
        roundedTicks: this.roundedTicks,
      });
      const secondaryScale = createNumericContinuousScale({
        domainMin: preparedSecondaryYAxis.domainMin,
        domainMax: preparedSecondaryYAxis.domainMax,
        range: [innerHeight, 0],
        scaleType: this.secondaryYScaleType,
      });
      yScaleSecondary = secondaryScale.scale;
      isLogarithmicSecondaryY = secondaryScale.isLogarithmic;
    }

    normalizedSeries.forEach(series => {
      const seriesYScale = series.useSecondaryYScale ? yScaleSecondary : yScale;
      series.data.forEach(point => {
        point.cx = xScale(point.x as never) ?? 0;
        point.cy = seriesYScale(point.y);
      });
    });

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
    } else if (isDateAxis) {
      const seenLabels = new Set<string>();
      const uniqueDateTicks = (xScale as ScaleTime<number, number>).ticks().filter(value => {
        const label = xFormatter(value);
        if (seenLabels.has(label)) {
          return false;
        }
        seenLabels.add(label);
        return true;
      });
      xAxis.tickValues(uniqueDateTicks);
    }

    const yAxis = axisLeft(yScale).tickPadding(toNumber(this.tickPadding, 6));
    applyAxisTickConfig(
      yAxis,
      this.yAxisTickCount ?? DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
      this.yAxisTickValues ?? (isLogarithmicY ? undefined : preparedYAxis.tickValues),
    );

    renderAxisGridLinesShared({
      layer: plotGroup,
      orientation: 'horizontal',
      scale: yScale,
      axis: yAxis as unknown as Axis<number>,
      spanStart: 0,
      spanEnd: innerWidth,
    });

    let singleHoverDot: SVGCircleElement | SVGPathElement | undefined;
    let singleHoverLine: SVGLineElement | undefined;
    const clearSinglePointTooltip = (): void => {
      if (singleHoverDot) {
        singleHoverDot.style.display = 'none';
      }
      if (singleHoverLine) {
        singleHoverLine.style.display = 'none';
      }
      this._clearTooltip();
    };
    const positionCallout = (anchorX: number, anchorY: number, isFreshShow: boolean): void => {
      this._positionTooltipAvoidingOverlap(anchorX, anchorY, anchorY, isFreshShow, {
        horizontalPlacement: 'side',
        preferredVerticalSide: 'below',
        gap: 15,
      });
    };

    const showTooltipForPoint = (legend: string, color: string, point: NormalizedPoint, shapeIndex = 0) => {
      if (!this._shouldShowTooltip(legend) || this.hideTooltip || point.hideCallout) {
        return;
      }
      const isFreshShow =
        !this.tooltipProps.isVisible ||
        this.tooltipProps.legend !== legend ||
        this.tooltipProps.xValue !== point.xLabel;
      const hostRect = this.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const anchorX = svgRect.left - hostRect.left + margins.left + point.cx;
      const anchorY = svgRect.top - hostRect.top + margins.top + point.cy;
      const formattedYValue = point.yAxisCalloutData ?? formatNumberValue(point.y, this.yAxisTickFormat, this.culture);
      this._currentTooltipDataPoint = { legend, x: point.x, y: point.y };
      this.tooltipProps = {
        isVisible: true,
        legend,
        xValue: point.xLabel,
        yValue: formattedYValue,
        color,
        xPos: anchorX,
        yPos: anchorY,
        entries: [
          {
            legend,
            color,
            value: formattedYValue,
          },
        ],
      };
      if (singleHoverDot) {
        singleHoverDot.dataset.legend = legend;
        singleHoverDot.dataset.shape = markerShapeNames[shapeIndex];
        singleHoverDot.setAttribute('cx', String(point.cx));
        singleHoverDot.setAttribute('cy', String(point.cy));
        if (singleHoverDot.tagName === 'path') {
          singleHoverDot.setAttribute('d', getMarkerPath(point.cx, point.cy, markerSize, shapeIndex));
        }
        singleHoverDot.setAttribute('stroke', color);
        singleHoverDot.style.display = '';
      }
      if (singleHoverLine) {
        const x = margins.left + point.cx;
        singleHoverLine.setAttribute('x1', String(x));
        singleHoverLine.setAttribute('x2', String(x));
        singleHoverLine.setAttribute('y1', String(margins.top + point.cy));
        singleHoverLine.setAttribute('y2', String(margins.top + innerHeight));
        singleHoverLine.style.display = '';
      }
      positionCallout(anchorX, anchorY, isFreshShow);
    };

    const showNearestPoint = (
      legend: string,
      color: string,
      points: NormalizedPoint[],
      event: MouseEvent,
      shapeIndex: number,
    ) => {
      const svgRect = svg.getBoundingClientRect();
      const localX = event.clientX - svgRect.left - margins.left;
      const nearest = points.reduce((best, candidate) =>
        Math.abs(candidate.cx - localX) < Math.abs(best.cx - localX) ? candidate : best,
      );
      if (!this.isCalloutForStack) {
        showTooltipForPoint(legend, color, nearest, shapeIndex);
        return;
      }

      const entries = normalizedSeries.flatMap(series => {
        const matchingPoint = series.data.find(point => Number(point.x) === Number(nearest.x));
        return matchingPoint && this._shouldShowTooltip(series.legend)
          ? [
              {
                legend: series.legend,
                color: series.color,
                value: formatNumberValue(matchingPoint.y, this.yAxisTickFormat, this.culture),
              },
            ]
          : [];
      });
      showTooltipForPoint(legend, color, nearest, shapeIndex);
      this.tooltipProps = { ...this.tooltipProps, entries };
    };

    normalizedSeries.forEach((series, seriesIndex) => {
      const shapeIndex = this.allowMultipleShapesForPoints ? seriesIndex % markerShapeNames.length : 0;
      const gapEdges = new Set(series.gaps?.map(gap => `${gap.startIndex}:${gap.endIndex}`));
      const segments = series.data.reduce<NormalizedPoint[][]>(
        (result, point, pointIndex) => {
          const previousIndex = pointIndex - 1;
          if (pointIndex > 0 && gapEdges.has(`${previousIndex}:${pointIndex}`)) {
            result.push([]);
          }
          result[result.length - 1].push(point);
          return result;
        },
        [[]],
      );
      segments.forEach((segment, segmentIndex) => {
        const pathData =
          createLine<NormalizedPoint>()
            .x(point => point.cx)
            .y(point => point.cy)(segment) ?? '';
        const { linePath: path } = renderBorderedLinePath({
          layer: plotGroup,
          pathData,
          legend: series.legend,
          color: series.color,
          strokeWidth: toNumber(series.lineOptions?.strokeWidth ?? this.lineStrokeWidth, 4),
          borderWidth: toOptionalNumber(series.lineOptions?.lineBorderWidth ?? this.lineBorderWidth),
          borderColor: series.lineOptions?.lineBorderColor ?? this.lineBorderColor,
          strokeLinecap: series.lineOptions?.strokeLinecap ?? this.lineStrokeLinecap ?? 'round',
          strokeDasharray: series.lineOptions?.strokeDasharray ?? this.lineStrokeDasharray,
          strokeDashoffset: series.lineOptions?.strokeDashoffset ?? this.lineStrokeDashoffset,
        });
        path.dataset.segmentIndex = String(segmentIndex);
        path.addEventListener('mouseenter', event =>
          showNearestPoint(series.legend, series.color, segment, event, shapeIndex),
        );
        path.addEventListener('mousemove', event =>
          showNearestPoint(series.legend, series.color, segment, event, shapeIndex),
        );
        path.addEventListener('mouseleave', clearSinglePointTooltip);
        if (series.onLineClick) {
          path.addEventListener('click', series.onLineClick);
        }
      });

      if (this.showMarkers || this.allowMultipleShapesForPoints || series.data.length === 1) {
        series.data.forEach(point => {
          const marker = createSvgElement<SVGPathElement>('path');
          marker.classList.add('line-marker');
          marker.dataset.legend = series.legend;
          marker.dataset.shape = markerShapeNames[shapeIndex];
          marker.setAttribute('cx', String(point.cx));
          marker.setAttribute('cy', String(point.cy));
          marker.setAttribute('d', getMarkerPath(point.cx, point.cy, markerSize, shapeIndex));
          marker.setAttribute('fill', series.color);
          marker.addEventListener('mouseenter', () =>
            showTooltipForPoint(series.legend, series.color, point, shapeIndex),
          );
          marker.addEventListener('mouseleave', clearSinglePointTooltip);
          plotGroup.appendChild(marker);
        });
      }

      series.data.forEach(point => {
        const onDataPointClick = point.onDataPointClick ?? point.onClick;
        if (!onDataPointClick) {
          return;
        }
        const hitArea = createSvgElement<SVGCircleElement>('circle');
        hitArea.classList.add('line-marker-hit-area');
        hitArea.dataset.legend = series.legend;
        hitArea.setAttribute('cx', String(point.cx));
        hitArea.setAttribute('cy', String(point.cy));
        hitArea.setAttribute('r', String(markerSize / 2));
        hitArea.setAttribute('fill', 'transparent');
        hitArea.addEventListener('mouseenter', () =>
          showTooltipForPoint(series.legend, series.color, point, shapeIndex),
        );
        hitArea.addEventListener('mouseleave', clearSinglePointTooltip);
        hitArea.addEventListener('click', onDataPointClick);
        plotGroup.appendChild(hitArea);
      });
    });

    if (!this.isCalloutForStack) {
      singleHoverLine = createSvgElement<SVGLineElement>('line');
      singleHoverLine.classList.add('hover-line');
      singleHoverLine.style.display = 'none';
      svg.appendChild(singleHoverLine);

      singleHoverDot = this.allowMultipleShapesForPoints
        ? createSvgElement<SVGPathElement>('path')
        : createSvgElement<SVGCircleElement>('circle');
      singleHoverDot.classList.add('hover-dot', 'single-hover-dot');
      if (singleHoverDot.tagName === 'circle') {
        singleHoverDot.setAttribute('r', String(markerSize / 2));
      }
      singleHoverDot.setAttribute('fill', '#fff');
      singleHoverDot.setAttribute('stroke-width', '2');
      singleHoverDot.style.display = 'none';
      plotGroup.appendChild(singleHoverDot);
    }

    if (this.isCalloutForStack) {
      const calloutPointsByX = new Map<
        number,
        { xLabel: string; cx: number; points: Array<NormalizedPoint | undefined> }
      >();
      normalizedSeries.forEach((series, seriesIndex) => {
        series.data.forEach(point => {
          const key = Number(point.x);
          if (!calloutPointsByX.has(key)) {
            calloutPointsByX.set(key, { xLabel: point.xLabel, cx: point.cx, points: [] });
          }
          calloutPointsByX.get(key)!.points[seriesIndex] = point;
        });
      });
      const calloutPoints = [...calloutPointsByX.entries()].sort(([left], [right]) => left - right);

      const hoverLine = createSvgElement<SVGLineElement>('line');
      hoverLine.classList.add('hover-line');
      hoverLine.setAttribute('y1', String(margins.top / 2));
      hoverLine.setAttribute('y2', String(margins.top + innerHeight));
      hoverLine.style.display = 'none';
      svg.appendChild(hoverLine);

      const hoverDots = normalizedSeries.map((series, seriesIndex) => {
        const shapeIndex = this.allowMultipleShapesForPoints ? seriesIndex % markerShapeNames.length : 0;
        const dot = this.allowMultipleShapesForPoints
          ? createSvgElement<SVGPathElement>('path')
          : createSvgElement<SVGCircleElement>('circle');
        dot.classList.add('hover-dot');
        dot.dataset.legend = series.legend;
        dot.dataset.shape = markerShapeNames[shapeIndex];
        if (dot.tagName === 'circle') {
          dot.setAttribute('r', String(markerSize / 2));
        }
        dot.setAttribute('fill', '#fff');
        dot.setAttribute('stroke', series.color);
        dot.setAttribute('stroke-width', '2');
        dot.style.display = 'none';
        plotGroup.appendChild(dot);
        return dot;
      });

      const overlay = createSvgElement<SVGRectElement>('rect');
      overlay.classList.add('callout-overlay');
      overlay.setAttribute('x', '0');
      overlay.setAttribute('y', '0');
      overlay.setAttribute('width', String(innerWidth));
      overlay.setAttribute('height', String(innerHeight));
      overlay.setAttribute('fill', 'white');
      overlay.setAttribute('fill-opacity', '0');
      overlay.setAttribute('pointer-events', 'all');
      plotGroup.appendChild(overlay);

      const onOverlayMouseMove = (event: MouseEvent): void => {
        if (calloutPoints.length === 0) {
          return;
        }
        const svgRect = svg.getBoundingClientRect();
        const localX = event.clientX - svgRect.left - margins.left;
        const nearest = calloutPoints.reduce((best, candidate) =>
          Math.abs(candidate[1].cx - localX) < Math.abs(best[1].cx - localX) ? candidate : best,
        );
        const [, calloutPoint] = nearest;
        const entries: Array<TooltipEntry & { cy: number }> = [];

        hoverLine.setAttribute('x1', String(margins.left + calloutPoint.cx));
        hoverLine.setAttribute('x2', String(margins.left + calloutPoint.cx));
        hoverLine.style.display = '';

        calloutPoint.points.forEach((point, seriesIndex) => {
          const series = normalizedSeries[seriesIndex];
          if (point && !point.hideCallout && this._shouldShowTooltip(series.legend)) {
            hoverDots[seriesIndex].setAttribute('cx', String(point.cx));
            hoverDots[seriesIndex].setAttribute('cy', String(point.cy));
            if (hoverDots[seriesIndex].tagName === 'path') {
              const shapeIndex = seriesIndex % markerShapeNames.length;
              hoverDots[seriesIndex].setAttribute('d', getMarkerPath(point.cx, point.cy, markerSize, shapeIndex));
            }
            hoverDots[seriesIndex].style.display = '';
            entries.push({
              legend: series.legend,
              color: series.color,
              value: point.yAxisCalloutData ?? formatNumberValue(point.y, this.yAxisTickFormat, this.culture),
              cy: point.cy,
            });
          } else {
            hoverDots[seriesIndex].style.display = 'none';
          }
        });

        entries.sort((left, right) => left.cy - right.cy);
        if (!this.hideTooltip && entries.length > 0) {
          const hostRect = this.getBoundingClientRect();
          const anchorX = svgRect.left - hostRect.left + margins.left + calloutPoint.cx;
          const anchorY = svgRect.top - hostRect.top + margins.top + entries[0].cy;
          const tooltipEntries = entries.map(({ cy: _cy, ...entry }) => entry);
          const isFreshShow = !this.tooltipProps.isVisible || this.tooltipProps.xValue !== calloutPoint.xLabel;
          this._currentTooltipDataPoint = { x: nearest[0], entries: tooltipEntries };
          this.tooltipProps = {
            isVisible: true,
            legend: tooltipEntries[0].legend,
            xValue: calloutPoint.xLabel,
            yValue: tooltipEntries[0].value,
            color: tooltipEntries[0].color,
            xPos: anchorX,
            yPos: anchorY,
            entries: tooltipEntries,
          };
          positionCallout(anchorX, anchorY, isFreshShow);
        }
      };

      const onOverlayMouseLeave = (): void => {
        hoverLine.style.display = 'none';
        hoverDots.forEach(dot => (dot.style.display = 'none'));
        this._clearTooltip();
      };
      overlay.addEventListener('mousemove', onOverlayMouseMove);
      overlay.addEventListener('mouseleave', onOverlayMouseLeave);
    }

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
      formatter: value =>
        this.yAxisTickFormat
          ? formatNumberValue(value, this.yAxisTickFormat, this.culture)
          : defaultYAxisTickFormatter(value),
      axisStartX: margins.left,
      axisTop: margins.top,
      innerHeight,
      innerWidth,
      tickPadding: toNumber(this.tickPadding, 6),
      isRTL: this._isRTL,
      yAxisTitle: this.yAxisTitle,
      tickLabelMaxWidth: toOptionalNumber(this.yAxisTickLabelMaxWidth),
    });

    if (hasSecondaryY) {
      const yAxisSecondary = axisRight(yScaleSecondary).tickPadding(toNumber(this.tickPadding, 6));
      applyAxisTickConfig(
        yAxisSecondary,
        this.yAxisTickCount ?? DEFAULT_REACT_NUMERIC_Y_TICK_COUNT,
        isLogarithmicSecondaryY ? undefined : preparedSecondaryYAxis.tickValues,
      );
      renderSecondaryYAxisShared({
        svg,
        scale: yScaleSecondary,
        axis: yAxisSecondary as unknown as Axis<number>,
        formatter: value => defaultYAxisTickFormatter(Number(value)),
        axisStartX: margins.left,
        axisTop: margins.top,
        innerHeight,
        innerWidth,
        tickPadding: toNumber(this.tickPadding, 6),
        isRTL: this._isRTL,
        yAxisTitle: this.secondaryYAxisTitle,
      });
    }

    this._renderAnnotations({
      svg,
      collisionLayer: plotGroup,
      margins,
      innerWidth,
      innerHeight,
      mapDataX: value => xScale(getNormalizedXValue(value as number | Date) as never) ?? 0,
      mapDataY: (value, axis) => (axis === 'secondary' ? yScaleSecondary : yScale)(Number(value)),
    });

    this.chartContainer.appendChild(svg);
    this.legends = [
      ...normalizedSeries.map((series, seriesIndex) => ({
        legend: series.legend,
        color: series.color,
        ...(this.allowMultipleShapesForPoints && {
          shape: markerShapeNames[seriesIndex % markerShapeNames.length],
        }),
      })),
      ...(this.colorFillBars?.map(fillBar => ({ legend: fillBar.legend, color: getColorFromToken(fillBar.color) })) ??
        []),
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
      .querySelectorAll<SVGElement>('.line-border, .line-path, .line-marker, .color-fill-bar')
      .forEach(element => {
        const legend = element.dataset.legend ?? '';
        const isActive = !hasSelection || highlighted.includes(legend);
        element.classList.toggle('inactive', !isActive);
        element.setAttribute('opacity', isActive ? element.dataset.activeOpacity ?? '1' : '0.1');
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

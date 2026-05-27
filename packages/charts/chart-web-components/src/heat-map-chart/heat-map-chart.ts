import { attr } from '@microsoft/fast-element';
import { type ScaleBand, scaleBand, scaleLinear } from 'd3-scale';
import { format as d3Format } from 'd3-format';
import { timeFormat as d3TimeFormat } from 'd3-time-format';
import { CartesianChartBase } from '../utils/cartesian-chart-base.js';
import { getColorFromToken, jsonConverter, SVG_NAMESPACE_URI } from '../utils/chart-helpers.js';
import type { Legend, TooltipProps } from '../utils/chart.options.js';
import type { HeatMapChartData, HeatMapChartDataPoint, HeatMapSortOrder } from './heat-map-chart.options.js';

// ── Internal types ────────────────────────────────────────────────────────────

type FlatPoint = HeatMapChartDataPoint & { legend: string };

type HeatMapTooltipProps = TooltipProps & {
  rectText: string;
  ratio?: [number, number];
  descriptionMessage?: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 50;
const MARGIN_LEFT = 80;
const MARGIN_RIGHT = 20;
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 420;
const CELL_FONT_SIZE = 11;

// ── Helpers ───────────────────────────────────────────────────────────────────

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

const detectAxisType = (value: string | Date | number): 'date' | 'number' | 'string' => {
  if (value instanceof Date) {
    return 'date';
  }
  if (typeof value === 'number') {
    return 'number';
  }
  // ISO date string?
  const d = new Date(value as string);
  if (!isNaN(d.getTime()) && /^\d{4}/.test(value as string)) {
    return 'date';
  }
  // Numeric string?
  if (value !== '' && !isNaN(Number(value))) {
    return 'number';
  }
  return 'string';
};

const axisValueToKey = (value: string | Date | number, type: 'date' | 'number' | 'string'): string => {
  if (type === 'date') {
    const d = value instanceof Date ? value : new Date(value as string);
    return String(d.getTime());
  }
  return String(value);
};

const formatAxisKey = (
  key: string,
  type: 'date' | 'number' | 'string',
  dateFormat: string,
  numberFormat: string,
): string => {
  if (type === 'date') {
    const date = new Date(Number(key));
    return d3TimeFormat(dateFormat)(date);
  }
  if (type === 'number') {
    return d3Format(numberFormat)(Number(key));
  }
  return key;
};

// Determine foreground text color with adequate contrast against `bgHex`.
const getTextColorForBg = (bgHex: string): string => {
  const clean = bgHex.replace('#', '');
  if (clean.length !== 6) {
    return '#000000';
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Relative luminance (WCAG 2.1)
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  // Contrast vs white (L=1) and black (L=0)
  const contrastWhite = (1 + 0.05) / (L + 0.05);
  const contrastBlack = (L + 0.05) / (0 + 0.05);
  return contrastWhite >= contrastBlack ? '#ffffff' : '#000000';
};

/**
 * `<fluent-heat-map-chart>` – a grid-based heat map chart where each cell is
 * colored by a continuous color scale.
 *
 * Follows the same architecture as the other chart web components in this
 * package (extends CartesianChartBase, renders into `chartContainer`, uses
 * chart-base legend and tooltip systems).
 *
 * @tag fluent-heat-map-chart
 * @public
 */
export class HeatMapChart extends CartesianChartBase {
  // ── Attrs ─────────────────────────────────────────────────────────────────

  @attr({ converter: jsonConverter })
  public data!: HeatMapChartData[];

  @attr
  public width?: number | string;

  @attr
  public height?: number | string;

  /** Control points for the color scale (one per color in `rangeValuesForColorScale`). */
  @attr({ attribute: 'domain-values-for-color-scale', converter: jsonConverter })
  public domainValuesForColorScale: number[] = [];

  /** Colors (hex strings or CSS tokens) mapped to domain control points. */
  @attr({ attribute: 'range-values-for-color-scale', converter: jsonConverter })
  public rangeValuesForColorScale: string[] = [];

  /** d3 time-format string for x-axis Date labels. Default: `'%b/%d'`. */
  @attr({ attribute: 'x-axis-date-format-string' })
  public xAxisDateFormatString?: string;

  /** d3 time-format string for y-axis Date labels. Default: `'%b/%d'`. */
  @attr({ attribute: 'y-axis-date-format-string' })
  public yAxisDateFormatString?: string;

  /** d3 number-format string for x-axis numeric labels. Default: `'.2~s'`. */
  @attr({ attribute: 'x-axis-number-format-string' })
  public xAxisNumberFormatString?: string;

  /** d3 number-format string for y-axis numeric labels. Default: `'.2~s'`. */
  @attr({ attribute: 'y-axis-number-format-string' })
  public yAxisNumberFormatString?: string;

  /** Sort order for string axis labels. Default: `'alphabetical'`. */
  @attr({ attribute: 'sort-order' })
  public sortOrder: HeatMapSortOrder = 'alphabetical';

  /** Narrows the inherited base tooltipProps type to include heat map fields. */
  public declare tooltipProps: HeatMapTooltipProps;

  protected override _enableResizeObserver = true;

  // ── Private state ─────────────────────────────────────────────────────────

  private _renderedCells: SVGGElement[] = [];

  connectedCallback(): void {
    const self = this as Record<string, unknown>;
    const attrFields = [
      'data',
      'width',
      'height',
      'domainValuesForColorScale',
      'rangeValuesForColorScale',
      'xAxisDateFormatString',
      'yAxisDateFormatString',
      'xAxisNumberFormatString',
      'yAxisNumberFormatString',
      'sortOrder',
    ] as const;

    const saved: Partial<Record<(typeof attrFields)[number], unknown>> = {};
    for (const field of attrFields) {
      saved[field] = self[field];
      delete self[field];
    }

    self['tooltipProps'] = {
      isVisible: false,
      legend: '',
      yValue: '',
      color: '',
      xPos: 0,
      yPos: 0,
      rectText: '',
      ratio: undefined,
      descriptionMessage: undefined,
    } satisfies HeatMapTooltipProps;

    super.connectedCallback();

    for (const field of attrFields) {
      if (self[field] === undefined && saved[field] !== undefined) {
        self[field] = saved[field];
      }
    }

    this.addEventListener('mouseleave', this._handleMouseLeave);

    if (this.data) {
      this._requestRender();
    }
  }

  public disconnectedCallback(): void {
    this.removeEventListener('mouseleave', this._handleMouseLeave);
    super.disconnectedCallback();
  }

  // ── Changed callbacks ─────────────────────────────────────────────────────

  protected dataChanged(): void {
    this._requestRender();
  }

  protected widthChanged(): void {
    this._requestRender();
  }

  protected heightChanged(): void {
    this._requestRender();
  }

  protected domainValuesForColorScaleChanged(): void {
    this._requestRender();
  }

  protected rangeValuesForColorScaleChanged(): void {
    this._requestRender();
  }

  protected xAxisDateFormatStringChanged(): void {
    this._requestRender();
  }

  protected yAxisDateFormatStringChanged(): void {
    this._requestRender();
  }

  protected xAxisNumberFormatStringChanged(): void {
    this._requestRender();
  }

  protected yAxisNumberFormatStringChanged(): void {
    this._requestRender();
  }

  protected sortOrderChanged(): void {
    this._requestRender();
  }

  protected override tooltipPropsChanged(_old: TooltipProps, newValue: TooltipProps): void {
    const typed = newValue as HeatMapTooltipProps;
    if (typed.isVisible && !this.hideTooltip) {
      const parts: string[] = [];
      if (typed.legend) {
        parts.push(typed.legend);
      }
      if (typed.rectText) {
        parts.push(typed.rectText);
      }
      this.liveRegionText = parts.join(': ');
    } else {
      this.liveRegionText = '';
    }
  }

  // ── Aria / accessibility ──────────────────────────────────────────────────

  protected _getHostAriaLabel(): string {
    const count = this.data?.reduce((n, d) => n + d.data.length, 0) ?? 0;
    return (this.chartTitle ? `${this.chartTitle}. ` : '') + `Heat map chart with ${count} data points.`;
  }

  // ── Render (called by ChartBase._requestRender) ───────────────────────────

  protected _performRender(): void {
    this._applyHostDimensions();
    this._renderChart();
  }

  protected _applyHostDimensions() {
    super._applyHostDimensions(this.width, this.height);
  }

  // ── Legend interaction ────────────────────────────────────────────────────

  protected _applyActiveLegendState(): void {
    if (!this._renderedCells) {
      return;
    }

    const highlighted = this._getHighlightedLegends();
    this._renderedCells.forEach(cell => {
      const legend = cell.dataset.legend ?? '';
      if (highlighted.length === 0 || highlighted.includes(legend)) {
        cell.style.opacity = '1';
        cell.classList.remove('inactive');
      } else {
        cell.style.opacity = '0.1';
        cell.classList.add('inactive');
      }
    });
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private readonly _handleMouseLeave = (): void => {
    this._clearHeatTooltip();
  };

  private _clearHeatTooltip(): void {
    this.tooltipProps = {
      ...(this.tooltipProps as HeatMapTooltipProps),
      isVisible: false,
    };
  }

  private _showHeatTooltip(event: MouseEvent | FocusEvent, point: FlatPoint, cellColor: string): void {
    if (this.hideTooltip) {
      return;
    }
    let clientX: number;
    let clientY: number;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      const rect = (event.currentTarget as Element).getBoundingClientRect();
      clientX = rect.left + rect.width / 2;
      clientY = rect.top + rect.height / 2;
    }
    const hostRect = this.getBoundingClientRect();
    const rectText =
      point.rectText !== undefined
        ? String(point.rectText)
        : !isNaN(point.value)
        ? String(point.value)
        : 'No data available';

    this.tooltipProps = {
      isVisible: true,
      legend: point.legend,
      yValue: rectText,
      color: cellColor,
      xPos: clientX - hostRect.left,
      yPos: clientY - hostRect.top,
      rectText,
      ratio: point.ratio,
      descriptionMessage: point.descriptionMessage,
    } satisfies HeatMapTooltipProps;
  }

  private _buildColorScale() {
    const domain =
      Array.isArray(this.domainValuesForColorScale) && this.domainValuesForColorScale.length > 0
        ? this.domainValuesForColorScale
        : [0, 100];

    const resolvedRange =
      Array.isArray(this.rangeValuesForColorScale) && this.rangeValuesForColorScale.length > 0
        ? this.rangeValuesForColorScale.map(c => getColorFromToken(c))
        : ['#e6f2f8', '#004d8c'];

    return scaleLinear<string>()
      .domain(domain)
      .range(resolvedRange as string[]);
  }

  private _flattenData(): FlatPoint[] {
    const flat: FlatPoint[] = [];
    (this.data || []).forEach(series => {
      series.data.forEach(point => {
        flat.push({ ...point, legend: series.legend });
      });
    });
    return flat;
  }

  private _detectTypes(flat: FlatPoint[]): {
    xType: 'date' | 'number' | 'string';
    yType: 'date' | 'number' | 'string';
  } {
    const first = flat[0];
    return {
      xType: first ? detectAxisType(first.x) : 'string',
      yType: first ? detectAxisType(first.y) : 'string',
    };
  }

  private _collectLabels(
    flat: FlatPoint[],
    xType: 'date' | 'number' | 'string',
    yType: 'date' | 'number' | 'string',
  ): { xLabels: string[]; yLabels: string[] } {
    const xKeySet = new Set<string>();
    const yKeySet = new Set<string>();
    const xDateFormat = this.xAxisDateFormatString ?? '%b/%d';
    const yDateFormat = this.yAxisDateFormatString ?? '%b/%d';
    const xNumFormat = this.xAxisNumberFormatString ?? '.2~s';
    const yNumFormat = this.yAxisNumberFormatString ?? '.2~s';

    flat.forEach(p => {
      xKeySet.add(axisValueToKey(p.x, xType));
      yKeySet.add(axisValueToKey(p.y, yType));
    });

    const sortKeys = (keys: Set<string>, type: 'date' | 'number' | 'string'): string[] => {
      const arr = Array.from(keys);
      if (type === 'date' || type === 'number') {
        return arr.sort((a, b) => Number(a) - Number(b));
      }
      if (this.sortOrder === 'none') {
        return arr;
      }
      return arr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    };

    const xKeys = sortKeys(xKeySet, xType);
    const yKeys = sortKeys(yKeySet, yType);

    const xLabels = xKeys.map(k => formatAxisKey(k, xType, xDateFormat, xNumFormat));
    const yLabels = yKeys.map(k => formatAxisKey(k, yType, yDateFormat, yNumFormat));

    return { xLabels, yLabels };
  }

  /**
   * Build a lookup map from {xLabel, yLabel} → FlatPoint.
   * This enables O(1) cell lookups when rendering the grid.
   */
  private _buildPointMap(
    flat: FlatPoint[],
    xType: 'date' | 'number' | 'string',
    yType: 'date' | 'number' | 'string',
  ): Map<string, FlatPoint> {
    const xDateFormat = this.xAxisDateFormatString ?? '%b/%d';
    const yDateFormat = this.yAxisDateFormatString ?? '%b/%d';
    const xNumFormat = this.xAxisNumberFormatString ?? '.2~s';
    const yNumFormat = this.yAxisNumberFormatString ?? '.2~s';

    const map = new Map<string, FlatPoint>();
    flat.forEach(p => {
      const xKey = axisValueToKey(p.x, xType);
      const yKey = axisValueToKey(p.y, yType);
      const xLabel = formatAxisKey(xKey, xType, xDateFormat, xNumFormat);
      const yLabel = formatAxisKey(yKey, yType, yDateFormat, yNumFormat);
      map.set(`${xLabel}|${yLabel}`, p);
    });
    return map;
  }

  private _getAriaLabel(point: FlatPoint | null, xLabel: string, yLabel: string): string {
    if (!point) {
      return `${xLabel}, ${yLabel}. No data available.`;
    }
    const zValue = point.ratio ? `${point.ratio[0]}/${point.ratio[1]}` : point.rectText ?? point.value;
    const base = `${xLabel}, ${yLabel}. ${point.legend}, ${zValue}.`;
    return (
      point.callOutAccessibilityData?.ariaLabel ??
      base + (point.descriptionMessage ? ` ${point.descriptionMessage}.` : '')
    );
  }

  private _renderChart(): void {
    if (!this.$fastController.isConnected || !this.chartContainer) {
      return;
    }

    this._clearChart();

    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.legends = [];
      this.elementInternals.ariaLabel = this._getHostAriaLabel();
      return;
    }

    this.elementInternals.ariaLabel = this._getHostAriaLabel();

    const colorScale = this._buildColorScale();
    const flat = this._flattenData();
    const { xType, yType } = this._detectTypes(flat);
    const { xLabels, yLabels } = this._collectLabels(flat, xType, yType);
    const pointMap = this._buildPointMap(flat, xType, yType);

    const containerWidth =
      this.chartContainer.getBoundingClientRect().width || this.getBoundingClientRect().width || DEFAULT_WIDTH;

    const w = Math.max(parseFloat(String(this.width)) || containerWidth, 200);
    const h = Math.max(parseFloat(String(this.height)) || DEFAULT_HEIGHT, 100);

    const isRTL = this._isRTL;
    const marginLeft = isRTL ? MARGIN_RIGHT : MARGIN_LEFT;
    const marginRight = isRTL ? MARGIN_LEFT : MARGIN_RIGHT;
    const innerWidth = w - marginLeft - marginRight;
    const innerHeight = h - MARGIN_TOP - MARGIN_BOTTOM;

    // ── Scales ───────────────────────────────────────────────────────────────

    const xScale = scaleBand()
      .domain(isRTL ? [...xLabels].reverse() : xLabels)
      .range([0, innerWidth])
      .padding(0.02);

    // y-axis: first label at top → range [0, innerHeight] with first label at 0
    const yScale = scaleBand()
      .domain([...yLabels].reverse())
      .range([0, innerHeight])
      .padding(0.02);

    // ── SVG structure ─────────────────────────────────────────────────────────

    const svg = createSvgElement<SVGSVGElement>('svg');
    svg.setAttribute('class', 'chart-svg');
    svg.setAttribute('role', 'none');
    svg.setAttribute('width', `${w}`);
    svg.setAttribute('height', `${h}`);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const g = createSvgElement<SVGGElement>('g');
    g.setAttribute('transform', `translate(${marginLeft},${MARGIN_TOP})`);
    svg.appendChild(g);

    // ── Axes ──────────────────────────────────────────────────────────────────

    this._renderXAxis(g, xScale, innerHeight, xLabels);
    this._renderYAxis(g, yScale, yLabels, isRTL, innerWidth);

    // ── Grid cells ────────────────────────────────────────────────────────────

    this._renderedCells = [];
    let firstCell = true;

    yLabels.forEach(yLabel => {
      const yscaledY = yScale(yLabel);
      if (yscaledY === undefined) {
        return;
      }

      xLabels.forEach(xLabel => {
        const scaledX = xScale(xLabel);
        if (scaledX === undefined) {
          return;
        }

        const key = `${xLabel}|${yLabel}`;
        const point = pointMap.get(key) ?? null;
        const hasData = point !== null && !isNaN(point.value);
        const fillColor = hasData ? colorScale(point!.value) : 'transparent';
        const textColor = hasData ? getTextColorForBg(fillColor) : 'transparent';
        const ariaLabel = this._getAriaLabel(point, xLabel, yLabel);
        const legend = point?.legend ?? '';

        const cell = createSvgElement<SVGGElement>('g');
        cell.setAttribute('class', 'heat-cell');
        cell.setAttribute('role', 'img');
        cell.setAttribute('aria-label', ariaLabel);
        cell.setAttribute('data-legend', legend);
        cell.setAttribute('data-x', xLabel);
        cell.setAttribute('data-y', yLabel);
        cell.setAttribute('fill-opacity', legend && !this._getHighlightedLegends().length ? '1' : '1');
        cell.setAttribute('tabindex', firstCell ? '0' : '-1');
        cell.setAttribute('transform', `translate(${scaledX},${yscaledY})`);
        if (firstCell) {
          firstCell = false;
        }

        const rect = createSvgElement<SVGRectElement>('rect');
        rect.setAttribute('width', `${xScale.bandwidth()}`);
        rect.setAttribute('height', `${yScale.bandwidth()}`);
        rect.setAttribute('fill', fillColor);
        rect.setAttribute('class', 'heat-rect');
        cell.appendChild(rect);

        if (hasData && point!.rectText !== undefined) {
          const text = createSvgElement<SVGTextElement>('text');
          text.setAttribute('class', 'cell-text');
          text.setAttribute('x', `${xScale.bandwidth() / 2}`);
          text.setAttribute('y', `${yScale.bandwidth() / 2}`);
          text.setAttribute('dominant-baseline', 'middle');
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('fill', textColor);
          text.setAttribute('font-size', `${CELL_FONT_SIZE}`);
          const displayValue =
            this.culture && typeof point!.rectText === 'number'
              ? point!.rectText.toLocaleString(this.culture)
              : String(point!.rectText);
          text.textContent = displayValue;
          cell.appendChild(text);
        }

        // ── Events ────────────────────────────────────────────────────────────

        const handleInteraction = (e: MouseEvent | FocusEvent): void => {
          if (!point || isNaN(point.value)) {
            return;
          }
          const highlighted = this._getHighlightedLegends();
          if (highlighted.length === 0 || highlighted.includes(point.legend)) {
            this._showHeatTooltip(e, point, fillColor);
          }
        };

        cell.addEventListener('mouseover', handleInteraction);
        cell.addEventListener('mousemove', handleInteraction);
        cell.addEventListener('focus', handleInteraction);
        cell.addEventListener('mouseleave', () => this._clearHeatTooltip());
        cell.addEventListener('blur', () => this._clearHeatTooltip());
        cell.addEventListener('click', () => point?.onClick?.());
        cell.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            point?.onClick?.();
          } else {
            this._rovingKeydown(this._renderedCells, e);
          }
        });

        this._renderedCells.push(cell);
        g.appendChild(cell);
      });
    });

    // ── Axis titles ───────────────────────────────────────────────────────────

    if (this.xAxisTitle) {
      const xTitle = createSvgElement<SVGTextElement>('text');
      xTitle.setAttribute('class', 'axis-title');
      xTitle.setAttribute('x', `${innerWidth / 2}`);
      xTitle.setAttribute('y', `${innerHeight + MARGIN_BOTTOM - 8}`);
      xTitle.setAttribute('text-anchor', 'middle');
      xTitle.textContent = this.xAxisTitle;
      g.appendChild(xTitle);
    }

    if (this.yAxisTitle) {
      const yTitle = createSvgElement<SVGTextElement>('text');
      yTitle.setAttribute('class', 'axis-title');
      yTitle.setAttribute(
        'transform',
        `translate(${isRTL ? innerWidth + 14 : -14}, ${innerHeight / 2}) rotate(${isRTL ? 90 : -90})`,
      );
      yTitle.setAttribute('text-anchor', 'middle');
      yTitle.textContent = this.yAxisTitle;
      g.appendChild(yTitle);
    }

    // ── Legends ───────────────────────────────────────────────────────────────

    this.legends = (this.data || []).map(series => ({
      legend: series.legend,
      color: colorScale(series.value),
    })) as Legend[];

    this.chartContainer.appendChild(svg);
    this._applyActiveLegendState();
    this._applyLegendButtonState();
  }

  private _renderXAxis(g: SVGGElement, xScale: ScaleBand<string>, innerHeight: number, xLabels: string[]): void {
    // Axis line
    const axisDomain = createSvgElement<SVGLineElement>('line');
    axisDomain.setAttribute('class', 'axis-domain');
    axisDomain.setAttribute('x1', '0');
    axisDomain.setAttribute('y1', `${innerHeight}`);
    axisDomain.setAttribute('x2', `${xScale.range()[1]}`);
    axisDomain.setAttribute('y2', `${innerHeight}`);
    g.appendChild(axisDomain);

    // Tick labels
    xLabels.forEach(label => {
      const x = (xScale(label) ?? 0) + xScale.bandwidth() / 2;

      const text = createSvgElement<SVGTextElement>('text');
      text.setAttribute('class', 'axis-text');
      text.setAttribute('x', `${x}`);
      text.setAttribute('y', `${innerHeight + 14}`);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'hanging');
      text.textContent = label;
      g.appendChild(text);
    });
  }

  private _renderYAxis(
    g: SVGGElement,
    yScale: ScaleBand<string>,
    yLabels: string[],
    isRTL: boolean,
    innerWidth: number,
  ): void {
    // Axis line
    const axisDomain = createSvgElement<SVGLineElement>('line');
    axisDomain.setAttribute('class', 'axis-domain');
    axisDomain.setAttribute('x1', '0');
    axisDomain.setAttribute('y1', '0');
    axisDomain.setAttribute('x2', '0');
    axisDomain.setAttribute('y2', `${yScale.range()[1]}`);
    g.appendChild(axisDomain);

    // Tick labels
    yLabels.forEach(label => {
      const y = (yScale(label) ?? 0) + yScale.bandwidth() / 2;
      const x = isRTL ? innerWidth + 6 : -6;

      const text = createSvgElement<SVGTextElement>('text');
      text.setAttribute('class', 'y-axis-text');
      text.setAttribute('x', `${x}`);
      text.setAttribute('y', `${y}`);
      text.setAttribute('text-anchor', isRTL ? 'start' : 'end');
      text.setAttribute('dominant-baseline', 'middle');
      text.textContent = label;
      g.appendChild(text);
    });
  }

  private _clearChart(): void {
    if (!this.chartContainer) {
      return;
    }
    this._renderedCells = [];
    while (this.chartContainer.firstChild) {
      this.chartContainer.removeChild(this.chartContainer.firstChild);
    }
  }
}

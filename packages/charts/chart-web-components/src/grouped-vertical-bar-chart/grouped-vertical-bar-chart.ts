import { attr } from '@microsoft/fast-element';
import { max } from 'd3-array';
import { axisBottom, axisLeft, type Axis, type AxisDomain } from 'd3-axis';
import { format } from 'd3-format';
import { scaleBand, scaleLinear, type ScaleBand, type ScaleLinear } from 'd3-scale';
import type { TooltipProps } from '../utils/chart-options.js';
import { CartesianChartBase } from '../utils/cartesian-chart-base.js';
import { formatLocaleNumber, getColorFromToken, getNextColor, jsonConverter, SVG_NAMESPACE_URI, wrapText } from '../utils/chart-helpers.js';
import type { GroupedVerticalBarChartData } from './grouped-vertical-bar-chart.options.js';

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

type TooltipState = TooltipProps & { xValue: string };
type ScaleLike<Domain extends AxisDomain> = {
  domain(): Domain[];
  ticks?: (count?: number) => Domain[];
  bandwidth?: () => number;
  (value: Domain): number | undefined;
};

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

const renderBottomAxis = (
  svg: SVGSVGElement,
  chart: GroupedVerticalBarChart,
  scale: ScaleBand<string>,
  axis: Axis<string>,
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

  getTickValues(axis, scale as ScaleLike<string>).forEach(value => {
    const tick = createSvgElement<SVGGElement>('g');
    tick.classList.add('tick');
    tick.setAttribute('transform', `translate(${getPosition(scale as ScaleLike<string>, value)}, 0)`);

    const line = createSvgElement<SVGLineElement>('line');
    line.classList.add('axis-tick-line');
    line.setAttribute('y2', '6');
    tick.appendChild(line);

    const text = createSvgElement<SVGTextElement>('text');
    text.classList.add('axis-text');
    text.setAttribute('y', String(6 + tickPadding));
    text.setAttribute('text-anchor', chart.rotateXAxisLabels ? 'start' : 'middle');
    text.textContent = value;
    if (chart.rotateXAxisLabels) {
      text.setAttribute('transform', 'rotate(45)');
    }
    if (chart.showXAxisLabelsTooltip) {
      const title = createSvgElement<SVGTitleElement>('title');
      title.textContent = value;
      text.appendChild(title);
    }
    tick.appendChild(text);
    group.appendChild(tick);

    if (chart.wrapXAxisLabels) {
      wrapText(text, Math.max(scale.bandwidth(), 1));
    } else if (chart.hideTickOverlap && !chart.rotateXAxisLabels) {
      const box = text.getBBox();
      const left = getPosition(scale as ScaleLike<string>, value) + box.x;
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
  chart: GroupedVerticalBarChart,
  scale: ScaleLinear<number, number>,
  axis: Axis<number>,
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
  getTickValues(axis, scale as ScaleLike<number>).forEach(value => {
    const tick = createSvgElement<SVGGElement>('g');
    tick.classList.add('tick');
    tick.setAttribute('transform', `translate(0, ${getPosition(scale as ScaleLike<number>, value)})`);

    const line = createSvgElement<SVGLineElement>('line');
    line.classList.add('axis-tick-line');
    line.setAttribute('x2', '-6');
    tick.appendChild(line);

    const text = createSvgElement<SVGTextElement>('text');
    text.classList.add('y-axis-text');
    text.setAttribute('x', String(-(6 + tickPadding)));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('dominant-baseline', 'middle');
    text.textContent = formatNumberValue(value, chart.yAxisTickFormat, chart.culture);
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
export class GroupedVerticalBarChart extends CartesianChartBase {
  declare public tooltipProps: TooltipState;

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

  public get tooltipInlineTransform(): string {
    return this._isRTL ? 'translateX(50%)' : 'translateX(-50%)';
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
    const innerWidth = Math.max(width - defaultMargins.left - defaultMargins.right, 1);
    const innerHeight = Math.max(height - defaultMargins.top - defaultMargins.bottom, 1);

    const groupDomain = groups.map(group => group.xAxisPoint);
    const keyDomain = Array.from(new Set(groups.flatMap(group => group.series.map(point => point.key))));
    const xScale = scaleBand<string>().domain(groupDomain).range([0, innerWidth]).padding(0.1);
    const innerScale = scaleBand<string>().domain(keyDomain).range([0, xScale.bandwidth()]).padding(0.05);
    const maxY = max(groups.flatMap(group => group.series.map(point => point.data))) ?? 0;
    const yScale = scaleLinear()
      .domain([toOptionalNumber(this.yMinValue) ?? 0, toOptionalNumber(this.yMaxValue) ?? Math.max(maxY, 1)])
      .range([innerHeight, 0]);
    if (this.roundedTicks) {
      yScale.nice();
    }

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
    plotGroup.setAttribute('transform', `translate(${defaultMargins.left}, ${defaultMargins.top})`);
    svg.appendChild(plotGroup);

    const xAxis = axisBottom(xScale).tickPadding(toNumber(this.tickPadding, 6));
    const yAxis = axisLeft(yScale).tickPadding(toNumber(this.tickPadding, 6)).ticks(6);
    if (this.yAxisTickValues?.length) {
      yAxis.tickValues(this.yAxisTickValues);
    }

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
        rect.addEventListener('mouseenter', () => {
          if (!this._shouldShowTooltip(point.key) || this.hideTooltip) {
            return;
          }
          const hostRect = this.getBoundingClientRect();
          const svgRect = svg.getBoundingClientRect();
          this._currentTooltipDataPoint = { ...point, xAxisPoint: group.xAxisPoint };
          this.tooltipProps = {
            isVisible: true,
            legend: point.key,
            xValue: group.xAxisPoint,
            yValue: formatNumberValue(point.data, this.yAxisTickFormat, this.culture),
            color,
            xPos: svgRect.left - hostRect.left + defaultMargins.left + groupX + slotX + offset + actualWidth / 2,
            yPos: svgRect.top - hostRect.top + defaultMargins.top + yScale(point.data),
          };
        });
        rect.addEventListener('mouseleave', () => this._clearTooltip());
        plotGroup.appendChild(rect);
      });
    });

    renderBottomAxis(svg, this, xScale, xAxis, innerWidth, innerHeight);
    renderLeftAxis(svg, this, yScale, yAxis as unknown as Axis<number>, innerHeight);

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

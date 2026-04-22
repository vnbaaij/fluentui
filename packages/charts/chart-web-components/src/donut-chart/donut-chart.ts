import { attr, FASTElement, nullableNumberConverter, observable } from '@microsoft/fast-element';
import { format as d3Format } from 'd3-format';
import { arc as d3Arc, pie as d3Pie, PieArcDatum } from 'd3-shape';
import {
  booleanStringConverter,
  getColorFromToken,
  getNextColor,
  getRTL,
  jsonConverter,
  SVG_NAMESPACE_URI,
  validateChartProps,
  wrapText,
} from '../utils/chart-helpers.js';
import type { ChartDataPoint, ChartProps, Legend } from './donut-chart.options.js';

export class DonutChart extends FASTElement {
  @attr({ attribute: 'chart-title' })
  public chartTitle?: string;

  @attr({ converter: nullableNumberConverter })
  public height: number = 200;

  @attr({ converter: nullableNumberConverter })
  public width: number = 200;

  @attr({ attribute: 'hide-legends', mode: 'boolean' })
  public hideLegends: boolean = false;

  @attr({ attribute: 'hide-tooltip', mode: 'boolean' })
  public hideTooltip: boolean = false;

  @attr({ attribute: 'hide-labels', mode: 'boolean' })
  public hideLabels: boolean = true;

  @attr({ attribute: 'show-labels-in-percent', mode: 'boolean' })
  public showLabelsInPercent: boolean = false;

  @attr({ attribute: 'round-corners', mode: 'boolean' })
  public roundCorners: boolean = false;

  @attr({ converter: jsonConverter })
  public data!: ChartProps;

  @attr({ attribute: 'inner-radius', converter: nullableNumberConverter })
  public innerRadius: number = 1;

  @attr({ attribute: 'value-inside-donut' })
  public valueInsideDonut?: string;

  @attr({ attribute: 'legend-list-label' })
  public legendListLabel?: string;

  @attr
  public order: 'default' | 'sorted' = 'default';

  @attr
  public culture?: string;

  @observable
  public legends: Legend[] = [];

  @observable
  public activeLegend: string = '';
  protected activeLegendChanged(oldValue: string, newValue: string) {
    this._applyActiveLegendState();

    this._updateTextInsideDonut();
  }

  @observable
  public isLegendSelected: boolean = false;

  @observable
  public tooltipProps = {
    isVisible: false,
    legend: '',
    yValue: '',
    color: '',
    xPos: 0,
    yPos: 0,
  };
  protected tooltipPropsChanged(oldValue: any, newValue: any) {
    this._updateTextInsideDonut();
  }

  public chartContainer!: HTMLDivElement;
  public group!: SVGGElement;
  public elementInternals: ElementInternals = this.attachInternals();

  private _arcs: SVGPathElement[] = [];
  private _arcLabels: SVGTextElement[] = [];
  private _isRTL: boolean = false;
  private _textInsideDonut?: SVGTextElement;
  private readonly _handleMouseLeave = () => {
    this.tooltipProps = { isVisible: false, legend: '', yValue: '', color: '', xPos: 0, yPos: 0 };
  };

  constructor() {
    super();

    this.elementInternals.role = 'region';
  }

  public handleLegendMouseoverAndFocus(legendTitle: string) {
    if (this.isLegendSelected) {
      return;
    }

    this.activeLegend = legendTitle;
  }

  public handleLegendMouseoutAndBlur() {
    if (this.isLegendSelected) {
      return;
    }

    this.activeLegend = '';
  }

  public handleLegendClick(legendTitle: string) {
    if (this.isLegendSelected && this.activeLegend === legendTitle) {
      this.activeLegend = '';
      this.isLegendSelected = false;
    } else {
      this.activeLegend = legendTitle;
      this.isLegendSelected = true;
    }
  }

  connectedCallback() {
    this._initializeFromAttributes();

    super.connectedCallback();

    this.addEventListener('mouseleave', this._handleMouseLeave);

    if (!this.data) {
      return;
    }

    this._initializeAndRender();
  }

  public disconnectedCallback() {
    this.removeEventListener('mouseleave', this._handleMouseLeave);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'round-corners' && oldValue !== newValue) {
      this.roundCorners = newValue !== null && newValue !== 'false';
    }
  }

  protected roundCornersChanged() {
    this._scheduleRender();
  }

  protected dataChanged(_oldValue: ChartProps, newValue: ChartProps) {
    if (newValue) {
      this._scheduleRender();
    }
  }

  protected chartTitleChanged() {
    this._scheduleRender();
  }

  protected widthChanged() {
    this._scheduleRender();
  }

  protected heightChanged() {
    this._scheduleRender();
  }

  protected innerRadiusChanged() {
    this._scheduleRender();
  }

  protected valueInsideDonutChanged() {
    this._scheduleRender();
  }

  protected hideLabelsChanged() {
    this._scheduleRender();
  }

  protected showLabelsInPercentChanged() {
    this._scheduleRender();
  }

  protected cultureChanged() {
    this._scheduleRender();
  }

  protected orderChanged() {
    this._scheduleRender();
  }

  private _renderPending = false;

  /**
   * Schedules a single re-render via microtask, batching multiple synchronous
   * attribute changes (e.g. from a Blazor re-render) into one render pass.
   * Interactive-state changes (activeLegend, tooltipProps) bypass this and
   * update immediately.
   */
  private _scheduleRender(): void {
    if (this._renderPending) {
      return;
    }
    this._renderPending = true;
    queueMicrotask(() => {
      this._renderPending = false;
      this._rerender();
    });
  }

  private _rerender() {
    if (!this.$fastController.isConnected || !this.data) {
      return;
    }

    this._clearChart();
    this._initializeAndRender();
  }

  private _clearChart() {
    if (this.group) {
      while (this.group.firstChild) {
        this.group.removeChild(this.group.firstChild);
      }
    }

    this._arcs = [];
    this._arcLabels = [];
    this._textInsideDonut = undefined;
  }

  private _initializeFromAttributes() {
    const setString = (name: string, assign: (value: string) => void) => {
      const value = this.getAttribute(name);
      if (value !== null) {
        assign(value);
      }
    };

    const setBoolean = (name: string, assign: (value: boolean) => void) => {
      const value = this.getAttribute(name);
      if (value !== null) {
        assign(booleanStringConverter.fromView(value));
      }
    };

    setString('chart-title', value => {
      this.chartTitle = value;
    });
    setString('height', value => {
      this.height = nullableNumberConverter.fromView(value) ?? this.height;
    });
    setString('width', value => {
      this.width = nullableNumberConverter.fromView(value) ?? this.width;
    });
    setString('data', value => {
      this.data = jsonConverter.fromView(value) as ChartProps;
    });
    setString('inner-radius', value => {
      this.innerRadius = nullableNumberConverter.fromView(value) ?? this.innerRadius;
    });
    setString('value-inside-donut', value => {
      this.valueInsideDonut = value;
    });
    setString('legend-list-label', value => {
      this.legendListLabel = value;
    });
    setString('order', value => {
      this.order = value as 'default' | 'sorted';
    });
    setString('culture', value => {
      this.culture = value;
    });

    setBoolean('hide-legends', value => {
      this.hideLegends = value;
    });
    setBoolean('hide-tooltip', value => {
      this.hideTooltip = value;
    });
    setBoolean('hide-labels', value => {
      this.hideLabels = value;
    });
    setBoolean('show-labels-in-percent', value => {
      this.showLabelsInPercent = value;
    });
    setBoolean('round-corners', value => {
      this.roundCorners = value;
    });
  }

  private _initializeAndRender() {
    validateChartProps(this.data, 'data');

    const chartData = this._resolveChartData();

    this.legends = this._getLegends(chartData);
    this._isRTL = getRTL(this);
    this.elementInternals.ariaLabel =
      this.chartTitle || this.data.chartTitle || `Donut chart with ${chartData.length} segments.`;

    this._render(chartData);
  }

  private _resolveChartData(): ChartDataPoint[] {
    const sourceData =
      this.order === 'sorted' ? [...this.data.chartData].sort((a, b) => b.data - a.data) : this.data.chartData;
    const totalValue = sourceData.reduce((sum, point) => sum + (point.data ?? 0), 0);
    const minimumValue = totalValue * 0.01;

    return sourceData.map((dataPoint, index) => {
      const color = dataPoint.color ? getColorFromToken(dataPoint.color) : getNextColor(index);
      const resolvedData = minimumValue > dataPoint.data && dataPoint.data > 0 ? minimumValue : dataPoint.data;

      return {
        ...dataPoint,
        color,
        data: resolvedData,
        yAxisCalloutData:
          resolvedData !== dataPoint.data
            ? dataPoint.yAxisCalloutData ?? dataPoint.data.toLocaleString(this.culture || undefined)
            : dataPoint.yAxisCalloutData,
      };
    });
  }

  private _render(chartData: ChartDataPoint[]) {
    const totalValue = chartData.reduce((sum, point) => sum + (point.data ?? 0), 0);
    const outerRadius = Math.max(0, (Math.min(this.height, this.width) - 20) / 2);
    const cornerRadius = this.roundCorners ? 3 : 0;
    const pie = d3Pie<ChartDataPoint>()
      .value(d => d.data)
      .padAngle(0.02);
    const arc = d3Arc<PieArcDatum<ChartDataPoint>>()
      .innerRadius(this.innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(cornerRadius);

    pie(chartData).forEach(arcDatum => {
      const arcGroup = document.createElementNS(SVG_NAMESPACE_URI, 'g');
      this.group.appendChild(arcGroup);

      const pathOutline = document.createElementNS(SVG_NAMESPACE_URI, 'path');
      arcGroup.appendChild(pathOutline);
      pathOutline.classList.add('arc-outline');
      pathOutline.setAttribute('d', arc(arcDatum)!);

      const path = document.createElementNS(SVG_NAMESPACE_URI, 'path');
      arcGroup.appendChild(path);
      this._arcs.push(path);
      path.classList.add('arc');
      path.setAttribute('d', arc(arcDatum)!);
      path.setAttribute('fill', arcDatum.data.color!);
      path.setAttribute('data-id', arcDatum.data.legend);
      path.setAttribute('tabindex', '0');
      path.setAttribute('aria-label', `${arcDatum.data.legend}, ${arcDatum.data.data}.`);
      path.setAttribute('role', 'img');

      path.addEventListener('mouseover', event => {
        if (this.activeLegend !== '' && this.activeLegend !== arcDatum.data.legend) {
          return;
        }

        const bounds = this.getBoundingClientRect();

        this.tooltipProps = {
          isVisible: true,
          legend: arcDatum.data.legend,
          yValue: `${arcDatum.data.data}`,
          color: arcDatum.data.color!,
          xPos: this._isRTL ? bounds.right - event.clientX : event.clientX - bounds.left,
          yPos: event.clientY - bounds.top - 85,
        };
      });
      path.addEventListener('focus', event => {
        if (this.activeLegend !== '' && this.activeLegend !== arcDatum.data.legend) {
          return;
        }

        const rootBounds = this.getBoundingClientRect();
        const arcBounds = path.getBoundingClientRect();

        this.tooltipProps = {
          isVisible: true,
          legend: arcDatum.data.legend,
          yValue: `${arcDatum.data.data}`,
          color: arcDatum.data.color!,
          xPos: this._isRTL
            ? rootBounds.right - arcBounds.left - arcBounds.width / 2
            : arcBounds.left + arcBounds.width / 2 - rootBounds.left,
          yPos: arcBounds.top - rootBounds.top - 85,
        };
      });
      path.addEventListener('blur', event => {
        this.tooltipProps = { isVisible: false, legend: '', yValue: '', color: '', xPos: 0, yPos: 0 };
      });

      const label = this._createArcLabel(arc, arcDatum, totalValue, outerRadius);
      if (label) {
        arcGroup.appendChild(label);
        this._arcLabels.push(label);
      }
    });

    this._applyActiveLegendState();

    if (this.valueInsideDonut) {
      this._textInsideDonut = document.createElementNS(SVG_NAMESPACE_URI, 'text');
      this.group.appendChild(this._textInsideDonut);
      this._textInsideDonut.classList.add('text-inside-donut');
      this._textInsideDonut.setAttribute('x', '0');
      this._textInsideDonut.setAttribute('y', '0');
      this._textInsideDonut.setAttribute('text-anchor', 'middle');
      this._textInsideDonut.setAttribute('dominant-baseline', 'middle');
      this._updateTextInsideDonut();
    }
  }

  private _getLegends(chartData: ChartDataPoint[]): Legend[] {
    return chartData.map(d => ({
      title: d.legend,
      color: d.color!,
    }));
  }

  private _applyActiveLegendState() {
    if (!this._arcs || !this._arcLabels) {
      return;
    }

    if (this.activeLegend === '') {
      this._arcs.forEach(arc => arc.classList.remove('inactive'));
      this._arcLabels.forEach(label => label.classList.remove('inactive'));
      return;
    }

    this._arcs.forEach(arc => {
      arc.classList.toggle('inactive', arc.getAttribute('data-id') !== this.activeLegend);
    });
    this._arcLabels.forEach(label => {
      label.classList.toggle('inactive', label.getAttribute('data-id') !== this.activeLegend);
    });
  }

  private _createArcLabel(
    arc: ReturnType<typeof d3Arc<PieArcDatum<ChartDataPoint>>>,
    arcDatum: PieArcDatum<ChartDataPoint>,
    totalValue: number,
    outerRadius: number,
  ) {
    if (this.hideLabels || Math.abs(arcDatum.endAngle - arcDatum.startAngle) < Math.PI / 12) {
      return undefined;
    }

    const [base, perp] = arc.centroid(arcDatum);
    const hypotenuse = Math.sqrt(base * base + perp * perp);
    const labelRadius = Math.max(this.innerRadius, outerRadius) + 2;
    const angle = (arcDatum.startAngle + arcDatum.endAngle) / 2;
    const label = document.createElementNS(SVG_NAMESPACE_URI, 'text');

    label.classList.add('arc-label');
    label.setAttribute('data-id', arcDatum.data.legend);
    label.setAttribute('x', `${(hypotenuse === 0 ? 0 : base / hypotenuse) * labelRadius}`);
    label.setAttribute('y', `${(hypotenuse === 0 ? 0 : perp / hypotenuse) * labelRadius}`);
    label.setAttribute('text-anchor', angle > Math.PI !== this._isRTL ? 'end' : 'start');
    label.setAttribute('dominant-baseline', angle > Math.PI / 2 && angle < (3 * Math.PI) / 2 ? 'hanging' : 'auto');
    label.setAttribute('aria-hidden', 'true');
    label.textContent = this.showLabelsInPercent
      ? d3Format('.0%')(totalValue === 0 ? 0 : arcDatum.value / totalValue)
      : this._formatArcLabelValue(arcDatum.value);

    return label;
  }

  private _formatArcLabelValue(value: number) {
    const formatted = new Intl.NumberFormat(this.culture || undefined, {
      maximumFractionDigits: value >= 1000 ? 1 : 2,
      notation: value >= 1000 ? 'compact' : 'standard',
    }).format(value);

    return formatted.endsWith('K') ? `${formatted.slice(0, -1)}k` : formatted;
  }

  private _getTextInsideDonut(valueInsideDonut: string) {
    let textInsideDonut = valueInsideDonut;

    if (valueInsideDonut && (this.activeLegend !== '' || this.tooltipProps.isVisible)) {
      const highlightedDataPoint = this.data.chartData.find(
        dataPoint =>
          dataPoint.legend === this.activeLegend ||
          (this.tooltipProps.isVisible && dataPoint.legend === this.tooltipProps.legend),
      );
      textInsideDonut =
        highlightedDataPoint!.yAxisCalloutData ??
        highlightedDataPoint!.calloutData ??
        highlightedDataPoint!.data.toLocaleString(this.culture || undefined);
    }

    return textInsideDonut;
  }

  private _updateTextInsideDonut() {
    if (!this._textInsideDonut || !this.valueInsideDonut) {
      return;
    }

    this._textInsideDonut.textContent = this._getTextInsideDonut(this.valueInsideDonut);
    const lineHeight = this._textInsideDonut.getBoundingClientRect().height;
    wrapText(this._textInsideDonut, 2 * this.innerRadius);
    const lines = this._textInsideDonut.getElementsByTagName('tspan');
    const start = -1 * Math.trunc((lines.length - 1) / 2);
    for (let i = 0; i < lines.length; i++) {
      lines[i].setAttribute('dy', `${(start + i) * lineHeight}`);
    }
  }
}

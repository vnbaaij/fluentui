import { attr } from '@microsoft/fast-element';
import { ChartBase } from '../utils/chart-base.js';
import { getColorFromToken, getNextColor, jsonConverter, SVG_NAMESPACE_URI } from '../utils/chart-helpers.js';
import type { PolarChartSeries } from './polar-chart.options.js';

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

const toNumber = (value: number | string | undefined, fallback: number): number => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

interface RenderedSeries {
  legend: string;
  polygon: SVGPolygonElement;
  markers: SVGCircleElement[];
}

/** @public */
export class PolarChart extends ChartBase {
  @attr({ converter: jsonConverter })
  public data!: PolarChartSeries[];

  @attr({ attribute: 'show-markers', mode: 'boolean' })
  public showMarkers: boolean = false;

  protected override _enableResizeObserver = true;

  private _seriesElements: RenderedSeries[] = [];

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'showMarkers'] as const;
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

    this._requestRender();
  }

  protected dataChanged() {
    this._requestRender();
  }

  protected showMarkersChanged() {
    this._requestRender();
  }

  protected override _performRender(): void {
    if (!this.$fastController.isConnected || !this.chartContainer) {
      return;
    }

    this._applyHostDimensions(this.width, this.height);
    this._clearChart();

    const series = this.data ?? [];
    const categories = series[0]?.data.map(point => point.x) ?? [];

    this.legends = series.map((entry, index) => ({
      legend: entry.legend,
      color: entry.color ? getColorFromToken(entry.color) : getNextColor(index, 0),
    }));
    this._updateLegendInteractionState();

    if (series.length === 0 || categories.length === 0) {
      this.elementInternals.ariaLabel = this._getHostAriaLabel();
      return;
    }

    const width = this.chartContainer.getBoundingClientRect().width || toNumber(this.width, 400);
    const height = this.chartContainer.getBoundingClientRect().height || toNumber(this.height, 400);
    const margins = { top: 32, right: 56, bottom: 48, left: 56 };
    const innerWidth = Math.max(width - margins.left - margins.right, 1);
    const innerHeight = Math.max(height - margins.top - margins.bottom, 1);
    const centerX = margins.left + innerWidth / 2;
    const centerY = margins.top + innerHeight / 2;
    const radius = Math.max(Math.min(innerWidth, innerHeight) / 2, 1);
    const maxValue = Math.max(1, ...series.flatMap(entry => entry.data.map(point => point.y)));
    const gridLevels = 4;

    const svg = createSvgElement<SVGSVGElement>('svg');
    svg.classList.add('chart');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const categoryPoints = categories.map((category, index) => {
      const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
      const axisX = centerX + Math.cos(angle) * radius;
      const axisY = centerY + Math.sin(angle) * radius;
      return { category, angle, axisX, axisY };
    });

    for (let level = 1; level <= gridLevels; level++) {
      const currentRadius = (radius * level) / gridLevels;
      const polygon = createSvgElement<SVGPolygonElement>('polygon');
      polygon.classList.add('polar-grid');
      polygon.setAttribute(
        'points',
        categoryPoints
          .map(point => `${centerX + Math.cos(point.angle) * currentRadius},${centerY + Math.sin(point.angle) * currentRadius}`)
          .join(' '),
      );
      svg.appendChild(polygon);
    }

    categoryPoints.forEach(point => {
      const axis = createSvgElement<SVGLineElement>('line');
      axis.classList.add('polar-axis');
      axis.setAttribute('x1', String(centerX));
      axis.setAttribute('y1', String(centerY));
      axis.setAttribute('x2', String(point.axisX));
      axis.setAttribute('y2', String(point.axisY));
      svg.appendChild(axis);

      const label = createSvgElement<SVGTextElement>('text');
      label.classList.add('polar-axis-label');
      label.setAttribute('x', String(centerX + Math.cos(point.angle) * (radius + 20)));
      label.setAttribute('y', String(centerY + Math.sin(point.angle) * (radius + 20)));
      label.textContent = point.category;
      svg.appendChild(label);
    });

    this._seriesElements = series.map((entry, seriesIndex) => {
      const color = entry.color ? getColorFromToken(entry.color) : getNextColor(seriesIndex, 0);
      const points = categoryPoints.map((categoryPoint, categoryIndex) => {
        const pointValue = entry.data[categoryIndex]?.y ?? 0;
        const pointRadius = (Math.max(pointValue, 0) / maxValue) * radius;
        return {
          x: centerX + Math.cos(categoryPoint.angle) * pointRadius,
          y: centerY + Math.sin(categoryPoint.angle) * pointRadius,
        };
      });

      const polygon = createSvgElement<SVGPolygonElement>('polygon');
      polygon.classList.add('polar-series');
      polygon.dataset.legend = entry.legend;
      polygon.setAttribute('points', points.map(point => `${point.x},${point.y}`).join(' '));
      polygon.setAttribute('fill', color);
      polygon.setAttribute('stroke', color);
      svg.appendChild(polygon);

      const markers: SVGCircleElement[] = [];
      if (this.showMarkers) {
        points.forEach(point => {
          const marker = createSvgElement<SVGCircleElement>('circle');
          marker.classList.add('polar-marker');
          marker.dataset.legend = entry.legend;
          marker.setAttribute('cx', String(point.x));
          marker.setAttribute('cy', String(point.y));
          marker.setAttribute('r', '3');
          marker.setAttribute('fill', color);
          svg.appendChild(marker);
          markers.push(marker);
        });
      }

      return { legend: entry.legend, polygon, markers };
    });

    this.chartContainer.appendChild(svg);
    this._applyActiveLegendState();
    this.elementInternals.ariaLabel = this._getHostAriaLabel();
  }

  protected override _applyActiveLegendState(): void {
    if (!this._seriesElements) {
      return;
    }

    const highlighted = this._getHighlightedLegends();
    const hasSelection = highlighted.length > 0;

    for (const series of this._seriesElements) {
      const isActive = !hasSelection || highlighted.includes(series.legend);
      series.polygon.classList.toggle('inactive', !isActive);
      series.polygon.setAttribute('opacity', isActive ? '1' : '0.1');
      series.markers.forEach(marker => {
        marker.classList.toggle('inactive', !isActive);
        marker.setAttribute('opacity', isActive ? '1' : '0.1');
      });
    }
  }

  protected override _getHostAriaLabel(): string {
    const count = this.data?.length ?? 0;
    return `Polar chart with ${count} series.`;
  }

  private _clearChart(): void {
    this._seriesElements = [];
    this._clearTooltip();

    if (!this.chartContainer) {
      return;
    }

    while (this.chartContainer.firstChild) {
      this.chartContainer.firstChild.remove();
    }
  }
}

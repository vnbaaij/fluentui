import { attr } from '@microsoft/fast-element';
import { format } from 'd3-format';
import { sankey, sankeyLinkHorizontal, type SankeyLink, type SankeyNode } from 'd3-sankey';
import { ChartBase } from '../utils/chart-base.js';
import { getColorFromToken, getNextColor, jsonConverter, SVG_NAMESPACE_URI } from '../utils/chart-helpers.js';
import type { SankeyChartData, SankeyChartLink, SankeyChartNode } from './sankey-chart.options.js';

const createSvgElement = <T extends SVGElement>(tag: string): T =>
  document.createElementNS(SVG_NAMESPACE_URI, tag) as T;

const defaultNumberFormatter = format(',.2~f');

const toNumber = (value: number | string | undefined, fallback: number): number => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

interface SankeyNodeDatum extends SankeyChartNode {}
interface SankeyLinkDatum extends SankeyChartLink {}
interface SankeyLayoutData {
  nodes: SankeyNodeDatum[];
  links: SankeyLinkDatum[];
}

interface RenderedNode {
  legend: string;
  node: SVGRectElement;
  label: SVGTextElement;
}

interface RenderedLink {
  sourceLegend: string;
  targetLegend: string;
  path: SVGPathElement;
}

/** @public */
export class SankeyChart extends ChartBase {
  @attr({ converter: jsonConverter })
  public data!: SankeyChartData;

  @attr({ attribute: 'path-color' })
  public pathColor?: string;

  protected override _enableResizeObserver = true;

  private _nodes: RenderedNode[] = [];
  private _links: RenderedLink[] = [];

  public connectedCallback() {
    const self = this as Record<string, unknown>;
    const attrFields = ['data', 'pathColor'] as const;
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

  protected pathColorChanged() {
    this._requestRender();
  }

  protected override _performRender(): void {
    if (!this.$fastController.isConnected || !this.chartContainer) {
      return;
    }

    this._applyHostDimensions(this.width, this.height);
    this._clearChart();

    const chartData = this.data;
    const nodes = chartData?.nodes ?? [];
    const links = chartData?.links ?? [];

    if (nodes.length === 0) {
      this.legends = [];
      this._updateLegendInteractionState();
      this.elementInternals.ariaLabel = this._getHostAriaLabel();
      return;
    }

    const width = this.chartContainer.getBoundingClientRect().width || toNumber(this.width, 700);
    const height = this.chartContainer.getBoundingClientRect().height || toNumber(this.height, 300);
    const margins = { top: 16, right: 88, bottom: 16, left: 88 };
    const innerWidth = Math.max(width - margins.left - margins.right, 1);
    const innerHeight = Math.max(height - margins.top - margins.bottom, 1);

    const svg = createSvgElement<SVGSVGElement>('svg');
    svg.classList.add('chart');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const group = createSvgElement<SVGGElement>('g');
    group.setAttribute('transform', `translate(${margins.left}, ${margins.top})`);
    svg.appendChild(group);

    const graphData: SankeyLayoutData = {
      nodes: nodes.map(node => ({ ...node })),
      links: links.map(link => ({ ...link })),
    };

    const graph = sankey<SankeyLayoutData, SankeyNodeDatum, SankeyLinkDatum>()
      .nodeWidth(16)
      .nodePadding(16)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])(graphData);

    this.legends = graph.nodes.map((node, index) => ({
      legend: node.name,
      color: node.color ? getColorFromToken(node.color) : getNextColor(index, 0),
    }));
    this._updateLegendInteractionState();

    const linkPath = sankeyLinkHorizontal<SankeyNodeDatum, SankeyLinkDatum>();

    this._links = graph.links.map((link, index) => {
      const source = link.source as SankeyNode<SankeyNodeDatum, SankeyLinkDatum>;
      const target = link.target as SankeyNode<SankeyNodeDatum, SankeyLinkDatum>;
      const sourceLegend = source.name;
      const targetLegend = target.name;
      const strokeColor = this.pathColor
        ? getColorFromToken(this.pathColor)
        : source.color
          ? getColorFromToken(source.color)
          : getNextColor(source.index ?? index, 0);

      const path = createSvgElement<SVGPathElement>('path');
      path.classList.add('sankey-link');
      path.dataset.sourceLegend = sourceLegend;
      path.dataset.targetLegend = targetLegend;
      path.setAttribute('d', linkPath(link) ?? '');
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-width', String(Math.max(link.width ?? 1, 1)));
      path.setAttribute('aria-hidden', 'true');

      path.addEventListener('mouseenter', () => {
        if (!this._shouldShowLinkTooltip(sourceLegend, targetLegend) || this.hideTooltip) {
          return;
        }

        const rootBounds = this.getBoundingClientRect();
        const linkBounds = path.getBoundingClientRect();
        this._currentTooltipDataPoint = link;
        this.tooltipProps = {
          isVisible: true,
          legend: `${sourceLegend} → ${targetLegend}`,
          yValue: defaultNumberFormatter(link.value),
          color: strokeColor,
          xPos: this._isRTL
            ? rootBounds.right - linkBounds.left - linkBounds.width / 2
            : linkBounds.left - rootBounds.left + linkBounds.width / 2,
          yPos: Math.max(linkBounds.top - rootBounds.top - 8, 0),
        };
      });

      path.addEventListener('mouseleave', () => {
        this._clearTooltip();
      });

      group.appendChild(path);
      return { sourceLegend, targetLegend, path };
    });

    this._nodes = graph.nodes.map((node, index) => {
      const fill = node.color ? getColorFromToken(node.color) : getNextColor(index, 0);
      const rect = createSvgElement<SVGRectElement>('rect');
      rect.classList.add('sankey-node');
      rect.dataset.legend = node.name;
      rect.setAttribute('x', String(node.x0 ?? 0));
      rect.setAttribute('y', String(node.y0 ?? 0));
      rect.setAttribute('width', String(Math.max((node.x1 ?? 0) - (node.x0 ?? 0), 0)));
      rect.setAttribute('height', String(Math.max((node.y1 ?? 0) - (node.y0 ?? 0), 0)));
      rect.setAttribute('fill', fill);
      group.appendChild(rect);

      const label = createSvgElement<SVGTextElement>('text');
      label.classList.add('sankey-node-label');
      label.dataset.legend = node.name;
      const isLeftAligned = (node.x0 ?? 0) < innerWidth / 2;
      label.setAttribute('x', String(isLeftAligned ? (node.x1 ?? 0) + 6 : (node.x0 ?? 0) - 6));
      label.setAttribute('y', String(((node.y0 ?? 0) + (node.y1 ?? 0)) / 2));
      label.setAttribute('dy', '0.35em');
      label.setAttribute('text-anchor', isLeftAligned ? 'start' : 'end');
      label.textContent = node.name;
      group.appendChild(label);

      return { legend: node.name, node: rect, label };
    });

    this.chartContainer.appendChild(svg);
    this._applyActiveLegendState();
    this.elementInternals.ariaLabel = this._getHostAriaLabel();
  }

  protected override _applyActiveLegendState(): void {
    if (!this._nodes || !this._links) {
      return;
    }

    const highlighted = this._getHighlightedLegends();
    const hasSelection = highlighted.length > 0;

    for (const renderedNode of this._nodes) {
      const isActive = !hasSelection || highlighted.includes(renderedNode.legend);
      renderedNode.node.classList.toggle('inactive', !isActive);
      renderedNode.node.setAttribute('opacity', isActive ? '1' : '0.1');
      renderedNode.label.classList.toggle('inactive', !isActive);
      renderedNode.label.setAttribute('opacity', isActive ? '1' : '0.1');
    }

    for (const renderedLink of this._links) {
      const isActive =
        !hasSelection ||
        highlighted.includes(renderedLink.sourceLegend) ||
        highlighted.includes(renderedLink.targetLegend);
      renderedLink.path.classList.toggle('inactive', !isActive);
      renderedLink.path.setAttribute('opacity', isActive ? '1' : '0.1');
    }
  }

  protected override _getHostAriaLabel(): string {
    const nodeCount = this.data?.nodes?.length ?? 0;
    const linkCount = this.data?.links?.length ?? 0;
    return `Sankey chart with ${nodeCount} nodes and ${linkCount} links.`;
  }

  private _shouldShowLinkTooltip(sourceLegend: string, targetLegend: string): boolean {
    const highlighted = this._getHighlightedLegends();
    return highlighted.length === 0 || highlighted.includes(sourceLegend) || highlighted.includes(targetLegend);
  }

  private _clearChart(): void {
    this._nodes = [];
    this._links = [];
    this._clearTooltip();

    if (!this.chartContainer) {
      return;
    }

    while (this.chartContainer.firstChild) {
      this.chartContainer.firstChild.remove();
    }
  }
}

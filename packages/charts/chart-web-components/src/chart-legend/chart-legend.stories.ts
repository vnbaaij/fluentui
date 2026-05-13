import { FluentDesignSystem } from '@fluentui/web-components';
import type { Meta, Story } from '../helpers.stories.js';
import { ChartLegend as FluentChartLegend } from './chart-legend.js';
import { definition } from './chart-legend.definition.js';

if (!customElements.get('fluent-chart-legend')) {
  definition.define(FluentDesignSystem.registry);
}

const items = [
  { legend: 'Apples', color: '#637cef' },
  { legend: 'Oranges', color: '#e3008c' },
  { legend: 'Bananas', color: '#00b7c3' },
];

interface WireOptions {
  /** When true, multiple items can be selected via click (default: false = single-select). */
  allowMultiSelect?: boolean;
  /** Pre-selected legend name (single-select mode). */
  initialActiveLegend?: string;
  /** Whether the initial active legend counts as a user click-selection (blocks hover). */
  initialIsSelected?: boolean;
  /** Pre-selected legend names (multi-select mode). */
  initialSelectedLegends?: string[];
}

/**
 * Wires hover / focus / click interactivity that exactly mirrors how the chart
 * components consume legend events:
 *
 * Single-select (default):
 *   - Hover / focus  → highlight the hovered item only when nothing is selected
 *   - Mouse-out/blur → clear highlight only when nothing is selected
 *   - Click          → select (locks highlight); click same item again to deselect
 *
 * Multi-select (allowMultiSelect: true):
 *   - Hover / focus  → highlight hovered item only when no items are selected
 *   - Mouse-out/blur → clear only when no items are selected
 *   - Click          → toggle item in/out of the selection set
 */
function wireInteractivity(el: FluentChartLegend, opts: WireOptions = {}): void {
  const allowMultiSelect = opts.allowMultiSelect ?? false;
  let activeLegend = opts.initialActiveLegend ?? '';
  let isLegendSelected = opts.initialIsSelected ?? false;
  let selectedLegends = [...(opts.initialSelectedLegends ?? [])];

  function getHighlighted(): string[] {
    if (allowMultiSelect && selectedLegends.length > 0) {
      return [...selectedLegends];
    }
    return activeLegend ? [activeLegend] : [];
  }

  function apply(): void {
    el.highlighted = getHighlighted();
  }

  // Apply initial state immediately so pre-selections are visible.
  apply();

  const hoverBlocked = () => (allowMultiSelect ? selectedLegends.length > 0 : isLegendSelected);

  el.addEventListener('legend-mouseover', (e: Event) => {
    if (hoverBlocked()) return;
    activeLegend = (e as CustomEvent<string>).detail;
    apply();
  });

  el.addEventListener('legend-mouseout', () => {
    if (hoverBlocked()) return;
    activeLegend = '';
    apply();
  });

  el.addEventListener('legend-focus', (e: Event) => {
    if (hoverBlocked()) return;
    activeLegend = (e as CustomEvent<string>).detail;
    apply();
  });

  el.addEventListener('legend-blur', () => {
    if (hoverBlocked()) return;
    activeLegend = '';
    apply();
  });

  el.addEventListener('legend-click', (e: Event) => {
    const name = (e as CustomEvent<string>).detail;

    if (allowMultiSelect) {
      const next = selectedLegends.includes(name)
        ? selectedLegends.filter(l => l !== name)
        : [...selectedLegends, name];
      selectedLegends = next;
      if (next.length === 0) {
        activeLegend = '';
      } else if (!next.includes(activeLegend)) {
        activeLegend = next[next.length - 1];
      }
    } else {
      if (isLegendSelected && activeLegend === name) {
        activeLegend = '';
        isLegendSelected = false;
      } else {
        activeLegend = name;
        isLegendSelected = true;
      }
    }
    apply();
  });
}

function note(text: string): HTMLParagraphElement {
  const p = document.createElement('p');
  p.style.cssText = 'font-size:12px;color:#666;margin-top:8px;';
  p.textContent = text;
  return p;
}

export default {
  title: 'Components/ChartLegend',
} as Meta<FluentChartLegend>;

export const Basic: Story<FluentChartLegend> = () => {
  const container = document.createElement('div');
  const el = document.createElement('fluent-chart-legend') as FluentChartLegend;
  el.items = items;
  el.label = 'Chart legend';
  wireInteractivity(el);
  container.appendChild(el);
  container.appendChild(
    note('Hover to preview; click to select/deselect. Hover is blocked while an item is selected.'),
  );
  return container;
};

export const WithHighlighted: Story<FluentChartLegend> = () => {
  const container = document.createElement('div');
  const el = document.createElement('fluent-chart-legend') as FluentChartLegend;
  el.items = items;
  el.label = 'Chart legend — one item selected';
  wireInteractivity(el, { initialActiveLegend: 'Apples', initialIsSelected: true });
  container.appendChild(el);
  container.appendChild(
    note('"Apples" is selected — hover on other items is blocked. Click "Apples" again to deselect.'),
  );
  return container;
};

export const WithMultipleHighlighted: Story<FluentChartLegend> = () => {
  const container = document.createElement('div');
  const el = document.createElement('fluent-chart-legend') as FluentChartLegend;
  el.items = items;
  el.label = 'Chart legend — multiple items selected';
  wireInteractivity(el, {
    allowMultiSelect: true,
    initialSelectedLegends: ['Apples', 'Bananas'],
    initialActiveLegend: 'Bananas',
  });
  container.appendChild(el);
  container.appendChild(
    note(
      '"Apples" and "Bananas" are selected (multi-select). Hover is blocked while any selection is active. Click to toggle.',
    ),
  );
  return container;
};

export const Hidden: Story<FluentChartLegend> = () => {
  const container = document.createElement('div');
  const el = document.createElement('fluent-chart-legend') as FluentChartLegend;
  el.items = items;
  el.label = 'Hidden legend';
  el.hidden = true;
  container.appendChild(el);
  container.appendChild(note('The legend is hidden (display: none via :host([hidden])).'));
  return container;
};

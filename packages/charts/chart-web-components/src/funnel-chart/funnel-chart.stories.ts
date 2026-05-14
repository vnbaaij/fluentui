import { html } from '@microsoft/fast-element';
import { FieldDefinition, FluentDesignSystem, SwitchDefinition } from '@fluentui/web-components';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import { renderComponent } from '../helpers.stories.js';
import { FunnelChart as FluentFunnelChart } from './funnel-chart.js';
import type { FunnelDataPoint } from './funnel-chart.options.js';

type FluentSwitchElement = HTMLElement & { checked: boolean };

const ensureDefinition = (tagName: string, define: () => void) => {
  if (!customElements.get(tagName)) {
    define();
  }
};

ensureDefinition('fluent-field', () => FieldDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-switch', () => SwitchDefinition.define(FluentDesignSystem.registry));

const controlsRowStyle = 'display:flex;flex-wrap:wrap;gap:16px 24px;align-items:end;';
const toggleFieldStyle = 'min-width:220px;';

const createSwitchField = (
  labelText: string,
  id: string,
  checked: boolean,
  onChange: (nextChecked: boolean) => void,
) => {
  const field = document.createElement('fluent-field');
  field.setAttribute('label-position', 'after');
  field.setAttribute('style', toggleFieldStyle);

  const label = document.createElement('label');
  label.slot = 'label';
  label.htmlFor = id;
  label.textContent = labelText;
  field.appendChild(label);

  const control = document.createElement('fluent-switch') as FluentSwitchElement;
  control.slot = 'input';
  control.id = id;
  control.checked = checked;
  control.toggleAttribute('checked', checked);
  control.addEventListener('change', () => onChange(control.checked));
  field.appendChild(control);

  return {
    element: field,
    setValue: (nextChecked: boolean) => {
      control.checked = nextChecked;
      control.toggleAttribute('checked', nextChecked);
    },
  };
};

// ── Sample data ──────────────────────────────────────────────────────────────

const simpleData: FunnelDataPoint[] = [
  { stage: 'Impressions', value: 8000, color: '#637cef' },
  { stage: 'Clicks', value: 4000, color: '#e3008c' },
  { stage: 'Leads', value: 1500, color: '#2aa0a4' },
  { stage: 'Conversions', value: 600, color: '#9373c0' },
];

const stackedData: FunnelDataPoint[] = [
  {
    stage: 'Awareness',
    subValues: [
      { category: 'Organic', value: 5000, color: '#637cef' },
      { category: 'Paid', value: 3000, color: '#e3008c' },
    ],
  },
  {
    stage: 'Interest',
    subValues: [
      { category: 'Organic', value: 3000, color: '#637cef' },
      { category: 'Paid', value: 2000, color: '#e3008c' },
    ],
  },
  {
    stage: 'Decision',
    subValues: [
      { category: 'Organic', value: 1200, color: '#637cef' },
      { category: 'Paid', value: 800, color: '#e3008c' },
    ],
  },
  {
    stage: 'Purchase',
    subValues: [
      { category: 'Organic', value: 500, color: '#637cef' },
      { category: 'Paid', value: 300, color: '#e3008c' },
    ],
  },
];

// ── Stories ──────────────────────────────────────────────────────────────────

export default {
  title: 'Components/FunnelChart',
} as Meta<FluentFunnelChart>;

export const Basic: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <fluent-funnel-chart
    chart-title="Funnel chart basic example"
    data="${JSON.stringify(simpleData)}"
    width="350"
    height="400"
  ></fluent-funnel-chart>
`);

export const Horizontal: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <fluent-funnel-chart
    chart-title="Horizontal funnel chart"
    data="${JSON.stringify(simpleData)}"
    orientation="horizontal"
    width="600"
    height="300"
  ></fluent-funnel-chart>
`);

export const Stacked: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <fluent-funnel-chart
    chart-title="Stacked funnel chart"
    data="${JSON.stringify(stackedData)}"
    width="350"
    height="400"
  ></fluent-funnel-chart>
`);

export const StackedHorizontal: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <fluent-funnel-chart
    chart-title="Stacked horizontal funnel chart"
    data="${JSON.stringify(stackedData)}"
    orientation="horizontal"
    width="600"
    height="300"
  ></fluent-funnel-chart>
`);

export const HideLegends: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <fluent-funnel-chart
    chart-title="Funnel chart – hide legends"
    data="${JSON.stringify(simpleData)}"
    width="350"
    height="400"
    hide-legends
  ></fluent-funnel-chart>
`);

export const HideTooltip: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let hideTooltip = true;

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Funnel chart – hide tooltip');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '350');
  chart.setAttribute('height', '400');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.toggleAttribute('hide-tooltip', hideTooltip);
  container.appendChild(chart);

  const hideTooltipControl = createSwitchField('Hide tooltip', 'funnel-hide-tooltip', hideTooltip, nextChecked => {
    hideTooltip = nextChecked;
    hideTooltipControl.setValue(nextChecked);
    chart.hideTooltip = nextChecked;
    chart.toggleAttribute('hide-tooltip', nextChecked);
  });
  controls.appendChild(hideTooltipControl.element);

  return container;
};

export const MultipleLegendSelection: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let allowMultiple = true;

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Funnel chart – multiple legend selection');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '350');
  chart.setAttribute('height', '400');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.allowMultipleLegendSelection = allowMultiple;
  chart.toggleAttribute('allow-multiple-legend-selection', allowMultiple);
  container.appendChild(chart);

  const multipleControl = createSwitchField(
    'Allow multiple legend selection',
    'funnel-multiple-legend',
    allowMultiple,
    nextChecked => {
      allowMultiple = nextChecked;
      multipleControl.setValue(nextChecked);
      chart.allowMultipleLegendSelection = nextChecked;
      chart.toggleAttribute('allow-multiple-legend-selection', nextChecked);
    },
  );
  controls.appendChild(multipleControl.element);

  return container;
};

export const RTL: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <div dir="rtl">
    <fluent-funnel-chart
      chart-title="Funnel chart RTL example"
      data="${JSON.stringify(simpleData)}"
      width="350"
      height="400"
    ></fluent-funnel-chart>
  </div>
`);

export const Culture: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <fluent-funnel-chart
    chart-title="Funnel chart culture example (de-DE)"
    data="${JSON.stringify(simpleData)}"
    width="350"
    height="400"
    culture="de-DE"
  ></fluent-funnel-chart>
`);

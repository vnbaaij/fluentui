import { html } from '@microsoft/fast-element';
import {
  FieldDefinition,
  FluentDesignSystem,
  LabelDefinition,
  SliderDefinition,
  SwitchDefinition,
  TextInputDefinition,
} from '@fluentui/web-components';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import { renderComponent } from '../helpers.stories.js';
import { GaugeChart as FluentGaugeChart } from './gauge-chart.js';
import type { GaugeChartSegment } from './gauge-chart.options.js';

type FluentSliderElement = HTMLElement & { value: string };
type FluentSwitchElement = HTMLElement & { checked: boolean };
type FluentTextInputElement = HTMLElement & { value: string };

const ensureDefinition = (tagName: string, define: () => void) => {
  if (!customElements.get(tagName)) {
    define();
  }
};

ensureDefinition('fluent-field', () => FieldDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-label', () => LabelDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-slider', () => SliderDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-switch', () => SwitchDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-text-input', () => TextInputDefinition.define(FluentDesignSystem.registry));

const controlsRowStyle = 'display:flex;flex-wrap:wrap;gap:16px 24px;align-items:end;';
const sliderFieldStyle = 'min-width:220px;flex:1 1 220px;';
const toggleFieldStyle = 'min-width:220px;';

const createSliderField = (
  labelText: string,
  id: string,
  value: number,
  min: number,
  max: number,
  onChange: (nextValue: number) => void,
) => {
  const field = document.createElement('fluent-field');
  field.setAttribute('label-position', 'above');
  field.setAttribute('style', sliderFieldStyle);

  const label = document.createElement('label');
  label.slot = 'label';
  label.htmlFor = id;
  label.textContent = labelText;
  field.appendChild(label);

  const slider = document.createElement('fluent-slider') as FluentSliderElement;
  slider.slot = 'input';
  slider.id = id;
  slider.setAttribute('min', `${min}`);
  slider.setAttribute('max', `${max}`);
  slider.value = `${value}`;
  slider.setAttribute('value', `${value}`);
  field.appendChild(slider);

  const message = document.createElement('fluent-label');
  message.slot = 'message';
  message.textContent = `${value}`;
  field.appendChild(message);

  slider.addEventListener('change', () => onChange(Number(slider.value)));

  return {
    element: field,
    setValue: (nextValue: number) => {
      slider.value = `${nextValue}`;
      slider.setAttribute('value', `${nextValue}`);
      message.textContent = `${nextValue}`;
    },
  };
};

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

const createTextInputField = (
  labelText: string,
  id: string,
  value: string,
  onChange: (nextValue: string | undefined) => void,
) => {
  const field = document.createElement('fluent-field');
  field.setAttribute('label-position', 'above');
  field.setAttribute('style', 'min-width:220px;flex:1 1 220px;');

  const label = document.createElement('label');
  label.slot = 'label';
  label.htmlFor = id;
  label.textContent = labelText;
  field.appendChild(label);

  const input = document.createElement('fluent-text-input') as FluentTextInputElement;
  input.slot = 'input';
  input.id = id;
  input.setAttribute('value', value);
  input.addEventListener('input', () => {
    onChange(input.value || undefined);
  });
  field.appendChild(input);

  return { element: field };
};

// ── Sample data ───────────────────────────────────────────────────────────────

const multiSegments: GaugeChartSegment[] = [
  { legend: 'Low', size: 33, color: 'qualitative.1' },
  { legend: 'Medium', size: 34, color: 'qualitative.3' },
  { legend: 'High', size: 33, color: 'qualitative.2' },
];

const singleSegment: GaugeChartSegment[] = [{ legend: 'Used', size: 55 }];

const basicTitle = 'Gauge chart basic example';

const storyTemplate = html<StoryArgs<FluentGaugeChart>>`
  <fluent-gauge-chart
    chart-title="${basicTitle}"
    segments="${JSON.stringify(multiSegments)}"
    chart-value="50"
    max-value="100"
  >
  </fluent-gauge-chart>
`;

export default {
  title: 'Components/GaugeChart',
} as Meta<FluentGaugeChart>;

export const Basic: Story<FluentGaugeChart> = renderComponent(storyTemplate).bind({});

export const SingleSegment: Story<FluentGaugeChart> = renderComponent(html<StoryArgs<FluentGaugeChart>>`
  <fluent-gauge-chart
    chart-title="Gauge chart single-segment example"
    segments="${JSON.stringify(singleSegment)}"
    chart-value="55"
    max-value="100"
    variant="single-segment"
  >
  </fluent-gauge-chart>
`);

export const FractionFormat: Story<FluentGaugeChart> = renderComponent(html<StoryArgs<FluentGaugeChart>>`
  <fluent-gauge-chart
    chart-title="Gauge chart fraction format example"
    segments="${JSON.stringify(multiSegments)}"
    chart-value="50"
    max-value="100"
    chart-value-format="fraction"
  >
  </fluent-gauge-chart>
`);

export const HideMinMax: Story<FluentGaugeChart> = renderComponent(html<StoryArgs<FluentGaugeChart>>`
  <fluent-gauge-chart
    chart-title="Gauge chart hidden min/max example"
    segments="${JSON.stringify(multiSegments)}"
    chart-value="50"
    max-value="100"
    hide-min-max
  >
  </fluent-gauge-chart>
`);

export const WithSublabel: Story<FluentGaugeChart> = renderComponent(html<StoryArgs<FluentGaugeChart>>`
  <fluent-gauge-chart
    chart-title="Gauge chart sublabel example"
    segments="${JSON.stringify(multiSegments)}"
    chart-value="50"
    max-value="100"
    sublabel="out of 100"
  >
  </fluent-gauge-chart>
`);

export const RoundedCorners: Story<FluentGaugeChart> = renderComponent(html<StoryArgs<FluentGaugeChart>>`
  <fluent-gauge-chart
    chart-title="Gauge chart rounded corners example"
    segments="${JSON.stringify(multiSegments)}"
    chart-value="50"
    max-value="100"
    round-corners
  >
  </fluent-gauge-chart>
`);

export const HideLegends: Story<FluentGaugeChart> = renderComponent(html<StoryArgs<FluentGaugeChart>>`
  <fluent-gauge-chart
    chart-title="Gauge chart hidden legend example"
    segments="${JSON.stringify(multiSegments)}"
    chart-value="50"
    max-value="100"
    hide-legends
  >
  </fluent-gauge-chart>
`);

export const Sizing: Story<FluentGaugeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);
  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chartHost);

  let width = 340;
  let height = 200;

  const renderChart = () => {
    const chart = document.createElement('fluent-gauge-chart') as FluentGaugeChart;
    chart.setAttribute('chart-title', 'Gauge chart sizing example');
    chart.setAttribute('segments', JSON.stringify(multiSegments));
    chart.setAttribute('chart-value', '50');
    chart.setAttribute('max-value', '100');
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);
    chart.setAttribute('style', `width:${width}px;height:${height}px`);
    chartHost.replaceChildren(chart);
  };

  const widthControl = createSliderField('Width', 'gauge-width', width, 200, 640, nextWidth => {
    width = nextWidth;
    widthControl.setValue(nextWidth);
    renderChart();
  });
  controls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'gauge-height', height, 100, 400, nextHeight => {
    height = nextHeight;
    heightControl.setValue(nextHeight);
    renderChart();
  });
  controls.appendChild(heightControl.element);

  renderChart();
  return container;
};
Sizing.parameters = { docs: { story: { height: '460px' } } };

export const LiveValue: Story<FluentGaugeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);
  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chartHost);

  const chart = document.createElement('fluent-gauge-chart') as FluentGaugeChart;
  chart.setAttribute('chart-title', 'Gauge chart live value example');
  chart.setAttribute('segments', JSON.stringify(multiSegments));
  chart.setAttribute('chart-value', '50');
  chart.setAttribute('max-value', '100');
  chartHost.appendChild(chart);

  const valueControl = createSliderField('Chart value', 'gauge-value', 50, 0, 100, nextValue => {
    chart.setAttribute('chart-value', `${nextValue}`);
    valueControl.setValue(nextValue);
  });
  controls.appendChild(valueControl.element);

  return container;
};
LiveValue.parameters = { docs: { story: { height: '460px' } } };

export const CustomMinMax: Story<FluentGaugeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);
  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chartHost);

  const customSegments: GaugeChartSegment[] = [
    { legend: 'Cold', size: 20 },
    { legend: 'Warm', size: 20 },
    { legend: 'Hot', size: 20 },
  ];

  const chart = document.createElement('fluent-gauge-chart') as FluentGaugeChart;
  chart.setAttribute('chart-title', 'Gauge chart custom range example');
  chart.setAttribute('segments', JSON.stringify(customSegments));
  chart.setAttribute('chart-value', '40');
  chart.setAttribute('min-value', '10');
  chart.setAttribute('max-value', '70');
  chartHost.appendChild(chart);

  const valueControl = createSliderField('Chart value', 'gauge-custom-value', 40, 10, 70, nextValue => {
    chart.setAttribute('chart-value', `${nextValue}`);
    valueControl.setValue(nextValue);
  });
  controls.appendChild(valueControl.element);

  return container;
};
CustomMinMax.parameters = { docs: { story: { height: '460px' } } };

export const HideTooltip: Story<FluentGaugeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let hideTooltip = true;

  const chart = document.createElement('fluent-gauge-chart') as FluentGaugeChart;
  chart.setAttribute('chart-title', 'Gauge chart hide tooltip example');
  chart.setAttribute('segments', JSON.stringify(multiSegments));
  chart.setAttribute('chart-value', '50');
  chart.setAttribute('max-value', '100');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.toggleAttribute('hide-tooltip', hideTooltip);
  container.appendChild(chart);

  const hideTooltipControl = createSwitchField('Hide tooltip', 'gauge-hide-tooltip', hideTooltip, nextChecked => {
    hideTooltip = nextChecked;
    hideTooltipControl.setValue(nextChecked);
    chart.hideTooltip = nextChecked;
    chart.toggleAttribute('hide-tooltip', nextChecked);
  });
  controls.appendChild(hideTooltipControl.element);

  return container;
};
HideTooltip.parameters = { docs: { story: { height: '440px' } } };

export const RTL: Story<FluentGaugeChart> = renderComponent(html<StoryArgs<FluentGaugeChart>>`
  <div dir="rtl">
    <fluent-gauge-chart
      chart-title="Gauge chart RTL example"
      segments="${JSON.stringify(multiSegments)}"
      chart-value="50"
      max-value="100"
    >
    </fluent-gauge-chart>
  </div>
`);

export const WithSublabelAndTitle: Story<FluentGaugeChart> = renderComponent(html<StoryArgs<FluentGaugeChart>>`
  <fluent-gauge-chart
    chart-title="Gauge chart full example"
    segments="${JSON.stringify(multiSegments)}"
    chart-value="50"
    max-value="100"
    sublabel="out of 100"
    chart-value-format="fraction"
  >
  </fluent-gauge-chart>
`);

export const MultipleLegendSelection: Story<FluentGaugeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let allowMultiple = true;

  const chart = document.createElement('fluent-gauge-chart') as FluentGaugeChart;
  chart.setAttribute('chart-title', 'Gauge chart multiple legend selection example');
  chart.setAttribute('segments', JSON.stringify(multiSegments));
  chart.setAttribute('chart-value', '50');
  chart.setAttribute('max-value', '100');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.allowMultipleLegendSelection = allowMultiple;
  chart.toggleAttribute('allow-multiple-legend-selection', allowMultiple);
  container.appendChild(chart);

  const multipleControl = createSwitchField(
    'Allow multiple legend selection',
    'gauge-multiple-legend',
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
MultipleLegendSelection.parameters = { docs: { story: { height: '440px' } } };

export const Sublabel: Story<FluentGaugeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);
  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chartHost);

  const chart = document.createElement('fluent-gauge-chart') as FluentGaugeChart;
  chart.setAttribute('chart-title', 'Gauge chart sublabel example');
  chart.setAttribute('segments', JSON.stringify(multiSegments));
  chart.setAttribute('chart-value', '50');
  chart.setAttribute('max-value', '100');
  chart.setAttribute('sublabel', 'out of 100');
  chartHost.appendChild(chart);

  const sublabelInput = createTextInputField('Sublabel', 'gauge-sublabel', 'out of 100', nextValue => {
    chart.sublabel = nextValue;
    if (nextValue) {
      chart.setAttribute('sublabel', nextValue);
    } else {
      chart.removeAttribute('sublabel');
    }
  });
  controls.appendChild(sublabelInput.element);

  return container;
};
Sublabel.parameters = { docs: { story: { height: '460px' } } };

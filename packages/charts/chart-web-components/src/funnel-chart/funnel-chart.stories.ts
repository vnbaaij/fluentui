import { html } from '@microsoft/fast-element';
import {
  FieldDefinition,
  FluentDesignSystem,
  LabelDefinition,
  RadioDefinition,
  RadioGroupDefinition,
  SliderDefinition,
  SwitchDefinition,
} from '@fluentui/web-components';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import { renderComponent } from '../helpers.stories.js';
import { FunnelChart as FluentFunnelChart } from './funnel-chart.js';
import type { FunnelDataPoint } from './funnel-chart.options.js';

type FluentSliderElement = HTMLElement & { value: string };
type FluentSwitchElement = HTMLElement & { checked: boolean };
type FluentRadioGroupElement = HTMLElement;

const ensureDefinition = (tagName: string, define: () => void) => {
  if (!customElements.get(tagName)) {
    define();
  }
};

ensureDefinition('fluent-field', () => FieldDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-label', () => LabelDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-radio', () => RadioDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-radio-group', () => RadioGroupDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-slider', () => SliderDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-switch', () => SwitchDefinition.define(FluentDesignSystem.registry));

const controlsRowStyle = 'display:flex;flex-wrap:wrap;gap:16px 24px;align-items:end;margin-bottom:16px;';
const sliderFieldStyle = 'min-width:220px;flex:1 1 220px;';
const toggleFieldStyle = 'min-width:220px;';

// ── Control helpers ──────────────────────────────────────────────────────────

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

  slider.addEventListener('change', () => {
    message.textContent = slider.value;
    onChange(Number(slider.value));
  });

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

const createRadioGroupField = (
  labelText: string,
  name: string,
  options: Array<{ label: string; value: string }>,
  currentValue: string,
  onChange: (value: string) => void,
) => {
  const outerField = document.createElement('fluent-field');
  outerField.setAttribute('label-position', 'above');

  const groupLabel = document.createElement('label');
  groupLabel.slot = 'label';
  groupLabel.textContent = labelText;
  outerField.appendChild(groupLabel);

  const radioGroup = document.createElement('fluent-radio-group') as FluentRadioGroupElement;
  radioGroup.slot = 'input';
  radioGroup.setAttribute('name', name);
  radioGroup.setAttribute('value', currentValue);
  outerField.appendChild(radioGroup);

  for (const option of options) {
    const itemField = document.createElement('fluent-field');
    itemField.setAttribute('label-position', 'after');

    const radio = document.createElement('fluent-radio') as HTMLInputElement;
    radio.slot = 'input';
    radio.setAttribute('value', option.value);
    if (option.value === currentValue) {
      radio.toggleAttribute('checked', true);
    }
    // Listen directly on each radio — more reliable than reading radioGroup.value
    // from a group-level change event (avoids FAST Observable timing issues).
    radio.addEventListener('change', () => onChange(option.value));
    itemField.appendChild(radio);

    const itemLabel = document.createElement('label');
    itemLabel.slot = 'label';
    itemLabel.textContent = option.label;
    itemField.appendChild(itemLabel);

    radioGroup.appendChild(itemField);
  }

  return {
    element: outerField,
    setValue: (newValue: string) => {
      radioGroup.setAttribute('value', newValue);
    },
  };
};

// ── Sample data ──────────────────────────────────────────────────────────────

// DataVizPalette.color5/6/10/3 resolved values – matches the React Charts FunnelChart story
const simpleData: FunnelDataPoint[] = [
  { stage: 'Visitors', value: 1000, color: '#13a10e' },
  { stage: 'Signups', value: 600, color: '#3a96dd' },
  { stage: 'Trials', value: 300, color: '#ae8c00' },
  { stage: 'Customers', value: 250, color: '#2aa0a4' },
];

// Matches the React Charts FunnelChart stacked story
const stackedData: FunnelDataPoint[] = [
  {
    stage: 'Visit',
    subValues: [
      { category: 'A', value: 100, color: '#13a10e' },
      { category: 'B', value: 80, color: '#3a96dd' },
      { category: 'C', value: 50, color: '#ae8c00' },
      { category: 'D', value: 30, color: '#2aa0a4' },
    ],
  },
  {
    stage: 'Sign-Up',
    subValues: [
      { category: 'A', value: 60, color: '#13a10e' },
      { category: 'B', value: 40, color: '#3a96dd' },
      { category: 'C', value: 20, color: '#ae8c00' },
      { category: 'D', value: 10, color: '#2aa0a4' },
    ],
  },
  {
    stage: 'Purchase',
    subValues: [
      { category: 'A', value: 30, color: '#13a10e' },
      { category: 'B', value: 20, color: '#3a96dd' },
      { category: 'C', value: 10, color: '#ae8c00' },
      { category: 'D', value: 5, color: '#2aa0a4' },
    ],
  },
];

// ── Stories ──────────────────────────────────────────────────────────────────

export default {
  title: 'Components/FunnelChart',
} as Meta<FluentFunnelChart>;

export const Basic: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');

  let width = 600;
  let height = 500;
  let hideLegends = false;
  let allowMultiple = false;
  let orientation: 'horizontal' | 'vertical' = 'horizontal';

  const renderChart = () => {
    chart.width = width;
    chart.height = height;
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);
    chart.hideLegends = hideLegends;
    chart.toggleAttribute('hide-legends', hideLegends);
    chart.allowMultipleLegendSelection = allowMultiple;
    chart.toggleAttribute('allow-multiple-legend-selection', allowMultiple);
    chart.orientation = orientation;
    chart.setAttribute('orientation', orientation);
  };

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  controls.appendChild(
    createSliderField('Change Width', 'funnel-basic-width', width, 200, 1000, nextValue => {
      width = nextValue;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSliderField('Change Height', 'funnel-basic-height', height, 200, 1000, nextValue => {
      height = nextValue;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSwitchField('Hide Legend', 'funnel-basic-hide-legend', hideLegends, nextChecked => {
      hideLegends = nextChecked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSwitchField('Multiple Legend Selection', 'funnel-basic-multi-select', allowMultiple, nextChecked => {
      allowMultiple = nextChecked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createRadioGroupField(
      'Orientation',
      'funnel-basic-orientation',
      [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
      orientation,
      newValue => {
        orientation = newValue as 'horizontal' | 'vertical';
        renderChart();
      },
    ).element,
  );

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Basic Funnel Chart');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('orientation', orientation);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  return container;
};

export const Stacked: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');

  let width = 600;
  let height = 500;
  let hideLegends = false;
  let allowMultiple = false;
  let orientation: 'horizontal' | 'vertical' = 'horizontal';

  const renderChart = () => {
    chart.width = width;
    chart.height = height;
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);
    chart.hideLegends = hideLegends;
    chart.toggleAttribute('hide-legends', hideLegends);
    chart.allowMultipleLegendSelection = allowMultiple;
    chart.toggleAttribute('allow-multiple-legend-selection', allowMultiple);
    chart.orientation = orientation;
    chart.setAttribute('orientation', orientation);
  };

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  controls.appendChild(
    createSliderField('Change Width', 'funnel-stacked-width', width, 200, 1000, nextValue => {
      width = nextValue;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSliderField('Change Height', 'funnel-stacked-height', height, 200, 1000, nextValue => {
      height = nextValue;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSwitchField('Hide Legend', 'funnel-stacked-hide-legend', hideLegends, nextChecked => {
      hideLegends = nextChecked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSwitchField('Multiple Legend Selection', 'funnel-stacked-multi-select', allowMultiple, nextChecked => {
      allowMultiple = nextChecked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createRadioGroupField(
      'Orientation',
      'funnel-stacked-orientation',
      [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
      orientation,
      newValue => {
        orientation = newValue as 'horizontal' | 'vertical';
        renderChart();
      },
    ).element,
  );

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Stacked Funnel Chart');
  chart.setAttribute('data', JSON.stringify(stackedData));
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('orientation', orientation);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  return container;
};

export const HideTooltip: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let hideTooltip = true;

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Funnel chart – hide tooltip');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.toggleAttribute('hide-tooltip', hideTooltip);
  container.appendChild(chart);

  controls.appendChild(
    createSwitchField('Hide tooltip', 'funnel-hide-tooltip', hideTooltip, nextChecked => {
      hideTooltip = nextChecked;
      chart.hideTooltip = nextChecked;
      chart.toggleAttribute('hide-tooltip', nextChecked);
    }).element,
  );

  return container;
};

export const RTL: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <div dir="rtl">
    <fluent-funnel-chart
      chart-title="Funnel chart RTL example"
      data="${JSON.stringify(simpleData)}"
      width="600"
      height="300"
    ></fluent-funnel-chart>
  </div>
`);

export const Culture: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <fluent-funnel-chart
    chart-title="Funnel chart culture example (de-DE)"
    data="${JSON.stringify(simpleData)}"
    width="600"
    height="300"
    culture="de-DE"
  ></fluent-funnel-chart>
`);
